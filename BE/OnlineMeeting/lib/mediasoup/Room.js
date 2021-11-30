const logger = require('../../config/logger.config');
const config = require('../../config/mediasoup.config');
const SocketTimeoutError = require('../../utils/SocketTimeoutError');
const Question = require('./Question');
const Poll = require('./Poll');
const _ = require('lodash')

module.exports = class Room {
  static async create({ roomId, worker, hostId, room }) {
    const mediaCodecs = config.mediasoup.router.mediaCodecs;

    const router = await worker.createRouter({ mediaCodecs })

    const audioLevelObserver = await router.createAudioLevelObserver(
      {
        maxEntries: 1,
        threshold: -80,
        interval: 800
      });

    return new Room({
      roomId, router, hostId, room, audioLevelObserver
    })
  }

  constructor({ roomId, router, worker, hostId, room, audioLevelObserver }) {
    this.room = room;

    this.router = router;

    this.worker = worker;

    this.id = roomId;

    this.hostId = hostId;

    this.hostSocketIds = new Set();

    this.name = room.name;

    this.allowChat = room.allowChat;

    this.allowMicrophone = room.allowMicrophone;

    this.allowCamera = room.allowCamera;

    this.allowScreenShare = room.allowScreenShare;

    this.allowQuestion = room.allowQuestion;

    this.allowRaiseHand = room.allowRaiseHand;

    this.isPrivate = room.isPrivate;

    this.selfDestructTimeout = null;

    this.closed = false;

    //All peers included joined, requesting, lobby peers
    //Key = socket id - Value = peer
    this.allPeers = new Map();

    //Joined peers
    //Key = socket id - Value = peer
    this.peers = new Map();

    //List of ask to join peers
    //Key = auth id - Value = peer
    this.requestPeers = new Map();

    //List of valid peer user id
    this.validAuthIds = new Set([...room.guests.map(guest => guest.id)]);

    // mediasoup AudioLevelObserver - detect current speaker (choose only one).
    this.audioLevelObserver = audioLevelObserver;

    this.questions = new Map()

    this.polls = new Map()

    this.handleAudioLevelObserver();
  }

  handleAudioLevelObserver() {
    this.audioLevelObserver.on('volumes', (volumes) => {
      const { producer, volume } = volumes[0];

      // Notify all Peers.
      for (const peer of this.getJoinedPeers()) {
        this.notification(
          peer.socket,
          'activeSpeaker',
          {
            peerId: producer.appData.peerId,
            volume: volume
          });
      }
    })

    this.audioLevelObserver.on('silence', () => {
      // Notify all Peers.
      for (const peer of this.getJoinedPeers()) {
        this.notification(
          peer.socket,
          'activeSpeaker',
          { peerId: null }
        );
      }
    });

  }

  isPeerValid(peerAuthId) {
    return this.hostId === peerAuthId || this.validAuthIds.has(peerAuthId)
  }

  getJoinedPeers(excludePeerId = undefined) {
    return [...this.peers.values()].filter(peer => peer.id !== excludePeerId)
  }

  getAllPeers(excludePeerId = undefined) {
    return [...this.allPeers.values()].filter(peer => peer.id !== excludePeerId)
  }

  getAllRequestPeers() {
    return [...this.requestPeers.values()]
  }

  timeoutCallback(callback) {
    let called = false;

    const interval = setTimeout(
      () => {
        if (called)
          return;
        called = true;
        callback(new SocketTimeoutError('Request timed out'));
      },
      20000
    );

    return (...args) => {
      if (called)
        return;
      called = true;
      clearTimeout(interval);

      callback(...args);
    };

  }

  sendRequest(socket, method, data = {}) {
    return new Promise((resolve, reject) => {
      socket.emit(
        'request',
        { method, data },
        this.timeoutCallback((err, response) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(response);
          }
        })
      );
    });
  }

  async request(socket, method, data) {
    const requestRetries = 3;

    for (let tries = 0; tries < requestRetries; tries++) {
      try {
        return await this.sendRequest(socket, method, data)
      } catch (err) {
        throw err;
      }
    }
  }

  notification(socket, method, data = {}, broadcast = false, includeSender = false) {
    if (broadcast) {
      socket.broadcast.to(this.id).emit('notification', { method, data })

      if (includeSender)
        socket.emit('notification', { method, data });

    } else {
      socket.emit('notification', { method, data })
    }
  }

  async createConsumer({ consumerPeer, producerPeer, producer }) {
    const router = this.router;

    if (!consumerPeer.rtpCapabilities || !router.canConsume({
      producerId: producer.id,
      rtpCapabilities: consumerPeer.rtpCapabilities
    })) {
      return;
    }

    const transport = consumerPeer.getConsumerTransport();

    if (!transport) {
      logger.warn('_createConsumer() | Transport for consuming not found');

      return;
    }

    let consumer;

    try {
      consumer = await transport.consume(
        {
          producerId: producer.id,
          rtpCapabilities: consumerPeer.rtpCapabilities,
          paused: producer.kind === 'video'
        });

      if (producer.kind === 'audio')
        await consumer.setPriority(255);
    }
    catch (error) {
      logger.warn('_createConsumer() | [error:"%o"]', error);

      return;
    }

    // Store the Consumer into the consumerPeer data Object.
    consumerPeer.addConsumer(consumer);

    consumer.on('transportclose', () => {
      consumerPeer.closeConsumer(consumer.id);
    });

    consumer.on('producerclose', () => {
      consumerPeer.closeConsumer(consumer.id);

      this.notification(consumerPeer.socket, 'consumerClosed', { consumerId: consumer.id });
    });

    consumer.on('producerpause', () => {
      this.notification(consumerPeer.socket, 'consumerPaused', { consumerId: consumer.id });
    });

    consumer.on('producerresume', () => {
      this.notification(consumerPeer.socket, 'consumerResumed', { consumerId: consumer.id });
    });

    // consumer.on('score', (score) => {
    //   this.notification(consumerPeer.socket, 'consumerScore', { consumerId: consumer.id, score });
    // });

    try {
      await this.request(
        consumerPeer.socket,
        'newConsumer',
        {
          peerId: producerPeer.id,
          kind: consumer.kind,
          producerId: producer.id,
          id: consumer.id,
          rtpParameters: consumer.rtpParameters,
          type: consumer.type,
          appData: producer.appData,
          producerPaused: consumer.producerPaused
        }
      );

      await consumer.resume();

      // this.notification(
      //   consumerPeer.socket,
      //   'consumerScore',
      //   {
      //     consumerId: consumer.id,
      //     score: consumer.score
      //   }
      // );
    }
    catch (error) {
      logger.warn('_createConsumer() | [error:"%o"]', error);
    }

  }

  acceptPeer(requestPeer) {
    this.requestPeers.delete(requestPeer.authId)
    this.validAuthIds.add(requestPeer.authId)
    this.peers.set(requestPeer.id, requestPeer)

    // //Add peer to guest list
    // await this.room.addGuest(requestPeer.authId)

    //Notify to peer get accepted
    requestPeer.socket.emit("requestAccepted", this.toJson(requestPeer))

    //Create consumers for existing Producers
    for (const joinedPeer of this.getJoinedPeers(requestPeer.id)) {
      for (const producer of joinedPeer.producers.values()) {
        this.createConsumer({
          consumerPeer: requestPeer,
          producerPeer: joinedPeer,
          producer
        })
      }
    }

    //Notify to all host
    for (const hostSocketId of this.hostSocketIds) {
      const hostPeer = this.peers.get(hostSocketId);
      this.notification(hostPeer.socket, "askToJoinPeerLeave", { peerId: requestPeer.id })
    }

    //Notify new peer to all peers
    for (const otherPeer of this.getJoinedPeers(requestPeer.id)) {
      console.log("newpeer")
      this.notification(
        otherPeer.socket,
        'newPeer',
        requestPeer.getInfo()
      );
    }
  }

  async handleSocketRequest(peer, request, cb, serverRequest) {
    if (this.closed) {
      cb({ error: "Room is closed" })
      return;
    }

    if (request.method.startsWith("host:") && (!serverRequest && !peer.isHost)) {
      cb({ error: "You have no permission" })
      return;
    }

    switch (request.method) {
      case 'getRouterRtpCapabilities': {
        cb(this.router.rtpCapabilities)
        break;
      }

      //For valid peers
      case 'join': {
        if (!this.isPeerValid(peer.authId)) {
          cb({ error: "Failed to join" })
          throw new Error("Not valid")
        }

        const { rtpCapabilities } = request.data;

        //Set peer info
        peer.isHost = this.hostId === peer.authId;
        peer.rtpCapabilities = rtpCapabilities;

        //Get current peers in room except joining peer
        const joinedPeers = this.getJoinedPeers()

        if (peer.isHost) {
          this.hostSocketIds.add(peer.id);
        }

        //Join socket room
        peer.socket.join(this.id)
        this.peers.set(peer.id, peer);

        //Return room info
        cb(this.toJson(peer));

        //Create consumers for existing Producers
        for (const joinedPeer of joinedPeers) {
          for (const producer of joinedPeer.producers.values()) {
            this.createConsumer({
              consumerPeer: peer,
              producerPeer: joinedPeer,
              producer
            })
          }
        }

        //Notify new peer to all peers
        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(
            otherPeer.socket,
            'newPeer',
            peer.getInfo()
          );
        }

        break;
      }

      //Invalid peer ask to join the room
      case 'askToJoin': {
        if (this.isPrivate) {
          cb({ error: "The room is private." })
          return;
        }

        if (this.validAuthIds.has(peer.authId) || this.hostId === peer.authId) {
          cb({ error: "You are already valid" })
          throw new Error("You are already valid")
        }

        if (this.requestPeers.has(peer.authId)) {
          cb();
          return;
        }

        const { rtpCapabilities } = request.data;

        peer.rtpCapabilities = rtpCapabilities;

        this.requestPeers.set(peer.authId, peer);

        //Notify to all host
        for (const hostSocketId of this.hostSocketIds) {
          const hostPeer = this.peers.get(hostSocketId)
          this.notification(hostPeer.socket, "askToJoin", peer.getInfo())
        }

        cb();

        break;
      }

      //Host accept a peer
      case 'host:acceptPeer': {
        const { peerAuthId } = request.data

        const requestPeer = this.requestPeers.get(peerAuthId)

        if (!requestPeer) {
          cb({ error: "Request peer not found!" })
          throw new Error("Request peer not found!")
        }

        cb();

        this.acceptPeer(requestPeer);

        // this.requestPeers.delete(peerId)
        // this.validAuthIds.add(requestPeer.authId)
        // this.peers.set(peerId, requestPeer)

        // //Add peer to guest list
        // await this.room.addGuest(requestPeer.authId)

        // //Notify to peer get accepted
        // await this.request(requestPeer.socket, "acceptedPeer", this.toJson(requestPeer))

        // //Create consumers for existing Producers
        // for (const joinedPeer of this.getJoinedPeers(peerId)) {
        //   for (const producer of joinedPeer.producers.values()) {
        //     this.createConsumer({
        //       consumerPeer: requestPeer,
        //       producerPeer: joinedPeer,
        //       producer
        //     })
        //   }
        // }

        // //Notify to all host
        // for (const hostSocketId of this.hostSocketIds) {
        //   const hostPeer = this.peers.get(hostSocketId);
        //   this.notification(hostPeer.socket, "askToJoinPeerLeave", { peerId })
        // }

        // //Notify new peer to all peers
        // for (const otherPeer of this.getJoinedPeers(requestPeer.id)) {
        //   this.notification(
        //     otherPeer.socket,
        //     'newPeer',
        //     requestPeer.getInfo()
        //   );
        // }

        break;
      }

      case 'acceptAllPeers': {
        for (const peer of this.requestPeers.values()) {
          //Create consumers for existing Producers
          for (const joinedPeer of this.getJoinedPeers()) {
            for (const producer of joinedPeer.producers.values()) {
              this.createConsumer({
                consumerPeer: peer,
                producerPeer: joinedPeer,
                producer
              })
            }
          }

          this.requestPeers.delete(peer.id)
          this.validAuthIds.add(peer.authId)
          this.peers.set(peer.id, peer)

          //Notify accepted peer
          peer.socket.emit("requestAccepted", this.toJson(requestPeer))
          // this.notification(peer.socket, "requestAccepted", this.toJson(peer))

          //Notify new peer to all peers
          for (const otherPeer of this.getJoinedPeers(peer.id)) {
            this.notification(
              otherPeer.socket,
              'newPeer',
              peer.getInfo()
            );
          }
        }

        //Notify to all host all peers are accepted
        for (const hostSocketId of this.hostSocketIds) {
          const hostPeer = this.peers.get(hostSocketId);
          this.notification(hostPeer.socket, "askToJoinPeerAllLeave")
        }

        cb();

        break;
      }

      case 'host:denyPeer': {
        const { peerAuthId } = request.data

        const requestPeer = this.requestPeers.get(peerAuthId)

        if (!requestPeer) {
          cb({ error: "Request peer not found" })
          throw new Error("Request peer not found")
        }

        this.requestPeers.delete(peerAuthId)

        //Notify denied peer
        this.notification(requestPeer.socket, "requestDenied")

        cb();

        break;
      }

      case 'host:denyAllPeers': {
        for (const peer of this.requestPeers.values()) {
          this.notification(peer.socket, "requestDenied")
        }

        this.requestPeers.clear();

        cb()

        break;
      }

      case 'createWebRtcTransport': {
        const { forceTcp, producing, consuming } = request.data;

        const { maxIncomingBitrate, initialAvailableOutgoingBitrate } = config.mediasoup.webRtcTransport;

        const transport = await this.router.createWebRtcTransport({
          listenIps: config.mediasoup.webRtcTransport.listenIps,
          enableUdp: !forceTcp,
          enableTcp: true,
          preferUdp: !forceTcp,
          initialAvailableOutgoingBitrate,
          appData: {
            consuming, producing
          }
        })

        if (maxIncomingBitrate) {
          try {
            await transport.setMaxIncomingBitrate(maxIncomingBitrate);
          } catch (error) { }
        }

        transport.on('dtlsstatechange', (dtlsState) => {
          if (dtlsState === 'failed' || dtlsState === 'closed')
            logger.warn('WebRtcTransport "dtlsstatechange" event [dtlsState:%s]', dtlsState);
        });

        transport.on("close", () => {
          console.log("Transport close", { id: transport.id });
        });

        peer.addTransport(transport);

        cb({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          },
        })

        break;
      }

      case 'connectWebRtcTransport': {
        const { transportId, dtlsParameters } = request.data;

        await peer.connectTransport(transportId, dtlsParameters)

        cb()
        break;
      }

      case 'restartIce': {
        const { transportId } = request.data;
        const transport = peer.getTransport(transportId);

        if (!transport)
          throw new Error(`transport with id "${transportId}" not found`);

        const iceParameters = await transport.restartIce();

        cb(iceParameters);

        break;
      }

      case 'produce': {
        let { appData, transportId, kind, rtpParameters } = request.data;

        if (!appData.source || !['mic', 'camera', 'screen'].includes(appData.source)) {
          cb({ error: "Invalid producer source" })
          throw new Error('invalid producer source');
        }

        if (appData.source === 'mic' && (!this.allowMicrophone && !peer.isHost)) {
          cb({ error: "Peer not authorized" })
          throw new Error('peer not authorized');
        }

        if (appData.source === 'camera' && (!this.allowCamera && !peer.isHost)) {
          cb({ error: "Peer not authorized" })
          throw new Error('peer not authorized');
        }

        if (appData.source === 'screen' && (!this.allowScreenShare && !peer.isHost)) {
          cb({ error: "Peer not authorized" })
          throw new Error('peer not authorized');
        }

        const transport = peer.getTransport(transportId)

        if (!transport) {
          cb({ error: "Transport not found" })
          return;
        }

        appData = { ...appData, peerId: peer.id }

        const producer = await transport.produce({
          kind, rtpParameters, appData
        })

        peer.addProducer(producer)

        // producer.on('score', (score) => {
        //   this.notification(peer.socket, 'producerScore', { producerId: producer.id, score })
        // })

        cb({ producerId: producer.id })

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.createConsumer({
            consumerPeer: otherPeer,
            producerPeer: peer,
            producer
          })
        }

        // Add into the audioLevelObserver.
        if (kind === 'audio') {
          this.audioLevelObserver.addProducer({ producerId: producer.id })
            .catch(() => { });
        }

        break;
      }

      case 'closeProducer': {
        const { producerId } = request.data;
        const producer = peer.getProducer(producerId);

        if (!producer) {
          cb({ error: "Producer not found" })
          throw new Error('producer not found')
        }

        producer.close();

        peer.removeProducer(producerId);

        cb();

        break;
      }

      case 'pauseProducer': {
        const { producerId } = request.data;

        const producer = peer.getProducer(producerId);

        if (!producer) {
          cb({ error: "Producer not found" })
          throw new Error('producer not found')
        }

        await producer.pause();

        cb();

        break;
      }

      case 'resumeProducer': {
        const { producerId } = request.data;
        const producer = peer.getProducer(producerId);

        if (!producer) {
          cb({ error: "Producer not found" })
          throw new Error('producer not found')
        }

        await producer.resume();

        cb();

        break;
      }

      case 'pauseConsumer': {
        const { consumerId } = request.data;
        const consumer = peer.getConsumer(consumerId);

        if (!consumer) {
          cb({ error: "Producer not found" })
          throw new Error('producer not found')
        }

        await consumer.pause();

        cb();

        break;
      }

      case 'resumeConsumer': {
        const { consumerId } = request.data;
        const consumer = peer.getConsumer(consumerId);

        if (!consumer) {
          cb({ error: "Producer not found" })
          throw new Error('producer not found')
        }

        await consumer.resume();

        cb();

        break;
      }

      case 'setConsumerPreferedLayers':
        {
          const { consumerId, spatialLayer, temporalLayer } = request.data;
          const consumer = peer.getConsumer(consumerId);

          if (!consumer)
            throw new Error(`consumer with id "${consumerId}" not found`);

          await consumer.setPreferredLayers({ spatialLayer, temporalLayer });

          cb();

          break;
        }

      case 'setConsumerPriority':
        {
          const { consumerId, priority } = request.data;
          const consumer = peer.getConsumer(consumerId);

          if (!consumer)
            throw new Error(`consumer with id "${consumerId}" not found`);

          await consumer.setPriority(priority);

          cb();

          break;
        }

      case 'requestConsumerKeyFrame':
        {
          const { consumerId } = request.data;
          const consumer = peer.getConsumer(consumerId);

          if (!consumer)
            throw new Error(`consumer with id "${consumerId}" not found`);

          await consumer.requestKeyFrame();

          cb();

          break;
        }

      case 'getTransportStats':
        {
          const { transportId } = request.data;
          const transport = peer.getTransport(transportId);

          if (!transport) {
            cb({ error: "transport not found" })
            throw new Error(`transport with id "${transportId}" not found`);
          }

          const stats = await transport.getStats();

          cb(stats);

          break;
        }

      case 'getProducerStats':
        {
          const { producerId } = request.data;
          const producer = peer.getProducer(producerId);

          if (!producer) {
            cb({ error: "Producer not found" })
            throw new Error(`producer with id "${producerId}" not found`);
          }

          const stats = await producer.getStats();

          cb(stats);

          break;
        }

      case 'getConsumerStats':
        {
          const { consumerId } = request.data;
          const consumer = peer.getConsumer(consumerId);

          if (!consumer) {
            cb({ error: "consumer not found" })
            throw new Error(`consumer with id "${consumerId}" not found`);
          }

          const stats = await consumer.getStats();

          cb(stats);

          break;
        }

      case 'chatMessage': {
        if (!this.peers.has(peer.id)) {
          cb({ error: "You are not in the room" })
          return;
        }

        if (!this.allowChat && !peer.isHost) {
          cb({ error: "You have no permission to send chat" })
          throw new Error('No chat permission');
        }

        const { message } = request.data;

        if (!message) {
          cb({ error: "Please enter message" })
          return
        }

        for (const otherPeer of this.getJoinedPeers()) {
          this.notification(otherPeer.socket, "chatMessage", { message, name: peer.name, peerId: peer.id, picture: peer.picture, timestamp: Date.now() })
        }

        break;
      }

      case 'getMyRoomInfo': {
        cb(this.toJson(peer))

        break;
      }

      case 'raiseHand': {
        if (peer.raisedHand) {
          cb()
          throw new Error("Already raised")
        }

        if (this.allowRaiseHand) {
          peer.raisedHand = true;

          for (const otherPeer of this.getJoinedPeers(peer.id)) {
            this.notification(otherPeer.socket, "raisedHand", { peerId: peer.id })
          }
          cb()
          return
        }

        cb({ error: "You have no permission to raise hand" })

        break;
      }

      case 'lowerHand': {
        if (!peer.raisedHand) {
          cb()
          throw new Error("Not raised")
        }

        peer.raisedHand = false;

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "lowerHand", { peerId: peer.id })
        }

        cb()

        break;
      }

      case 'askNewQuestion': {
        if (!this.peers.has(peer.id)) {
          cb({ error: "You are not in the room" })
          return;
        }

        if (!this.allowQuestion && !peer.isHost) {
          cb({ error: "You have no permission to ask question" })
          throw new Error('No question permission');
        }

        const { question } = request.data;

        if (!question) {
          cb({ error: "Please enter question" })
          return
        }

        const newQuestion = new Question({ peerId: peer.authId, question })

        this.questions.set(newQuestion.id, newQuestion)

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "newQuestion", await newQuestion.getInfo())
        }

        cb(await newQuestion.getInfo())

        break;
      }

      case 'upvoteQuestion': {
        if (!this.peers.has(peer.id)) {
          cb({ error: "You are not in the room" })
          return;
        }

        const { questionId } = request.data;

        if (!questionId) {
          cb({ error: "No question id" })
          return
        }

        const question = this.questions.get(questionId)

        if (!question) {
          cb({ error: "Question not found!" })
          return
        }

        question.upvote(peer.authId)

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "upvoteQuestion", { questionId, upvotes: question.getUpvote(), isVoted: question.getIsVoted(otherPeer.authId) })
        }

        cb({ upvotes: question.getUpvote(), isVoted: question.getIsVoted(peer.authId) })

        break;
      }

      case 'host:deleteQuestion': {
        const { questionId } = request.data;

        if (!this.questions.has(questionId)) {
          cb({ error: "Question not found" })
          return;
        }

        this.questions.delete(questionId)

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "deleteQuestion", { questionId })
        }

        cb()

        break;
      }

      case 'host:replyQuestion': {
        const { questionId, answer } = request.data;

        const question = this.questions.get(questionId)

        if (!question) {
          cb({ error: "Question not found" })
          return;
        }

        question.answerQuestion(answer)

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "replyQuestion", { questionId, reply: question.reply })
        }

        cb(question.reply)

        break;
      }

      case 'getQuestions': {
        if (!this.peers.has(peer.id)) {
          cb({ error: "You are not in the room" })
          return;
        }

        const allQuestions = await Promise.all([...this.questions.values()].map(async (question) => await question.getInfo(peer.authId)))

        cb(allQuestions)

        break;
      }

      case 'newPoll': {
        if (!peer.isHost) {
          cb({ error: "You have no permission to do this" })
          return;
        }

        const { question, options } = request.data;

        if (!question || !options) {
          cb({ error: "Invalid input" })
          return
        }

        const newPoll = new Poll({ options, question })

        this.polls.set(newPoll.id, newPoll)

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "newPoll", newPoll.getInfo())
        }

        cb(newPoll.getInfo())

        break;
      }

      case 'votePoll': {
        if (!this.peers.has(peer.id)) {
          cb({ error: "You are not in the room" })
          return;
        }

        const { pollId, optionIndex } = request.data;

        if (_.isNil(pollId) || _.isNil(optionIndex)) {
          cb({ error: "Invalid input" })
          return
        }

        const poll = this.polls.get(pollId)

        if (!poll) {
          cb({ error: "Poll not found!" })
          return
        }

        poll.vote(peer.authId, optionIndex)

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "votePoll", poll.getInfo(otherPeer.authId))
        }

        cb(poll.getInfo(peer.authId))

        break;
      }

      case 'getPolls': {
        if (!this.peers.has(peer.id)) {
          cb({ error: "You are not in the room" })
          return;
        }

        const allPolls = [...this.polls.values()].map(poll => poll.getInfo(peer.authId))

        cb(allPolls)

        break;
      }

      case 'getPoll': {
        if (!this.peers.has(peer.id)) {
          cb({ error: "You are not in the room" })
          return;
        }

        const { pollId } = request.data;

        const poll = this.polls.get(pollId)

        cb(poll)

        break;
      }

      case 'host:closePoll': {
        const { pollId } = request.data;

        const poll = this.polls.get(pollId)

        if (!poll) {
          cb({ error: "Poll not found" })
          return;
        }

        poll.isClosed = true

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "pollClosed", { pollId })
        }

        cb()

        break;
      }

      case 'host:openPoll': {
        const { pollId } = request.data;

        const poll = this.polls.get(pollId)

        if (!poll) {
          cb({ error: "Poll not found" })
          return;
        }

        poll.isClosed = false

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "pollOpened", { pollId })
        }

        cb()

        break;
      }

      case 'host:deletePoll': {
        const { pollId } = request.data;

        if (!this.polls.has(pollId)) {
          cb({ error: "Poll not found" })
          return;
        }

        this.polls.delete(pollId)

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.notification(otherPeer.socket, "deletePoll", { pollId })
        }

        cb()

        break;
      }

      case 'host:mute': {
        const { peerId } = request.data;

        const peer = this.peers.get(peerId)

        if (!peer) {
          cb({ error: "Peer not found!" })
          throw new Error("Peer not found!")
        }

        this.notification(peer.socket, "host:mute");


        cb()

        break;
      }

      case 'host:stopVideo': {
        const { peerId } = request.data;

        const peer = this.peers.get(peerId)

        if (!peer) {
          cb({ error: "Peer not found!" })
          throw new Error("Peer not found!")
        }

        this.notification(peer.socket, "host:stopVideo");


        cb()

        break;
      }

      case 'host:stopScreenSharing': {
        const { peerId } = request.data;

        const peer = this.peers.get(peerId)

        if (!peer) {
          cb({ error: "Peer not found!" })
          throw new Error("Peer not found!")
        }

        this.notification(peer.socket, "host:stopScreenSharing");


        cb()

        break;
      }

      case 'host:lowerHand': {
        const { peerId } = request.data;

        const peer = this.peers.get(peerId)

        if (!peer) {
          cb({ error: "Peer not found!" })
          throw new Error("Peer not found!")
        }

        this.notification(peer.socket, "host:lowerHand");


        cb()

        break;
      }

      case 'host:kick': {
        const { peerId } = request.data;

        const peer = this.peers.get(peerId)

        if (!peer) {
          cb({ error: "Peer not found!" })
          throw new Error("Peer not found!")
        }

        this.removePeer(peerId)

        cb()

        break;
      }

      case 'host:turnOnScreenSharing': {
        if (this.allowScreenShare === true) {
          cb();
          return;
        }

        console.log("turnon")

        this.allowScreenShare = true;

        await this.room.update({ allowScreenShare: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnScreenSharing")
        }
        cb()

        break;
      }

      case 'host:turnOffScreenSharing': {
        if (this.allowScreenShare === false) {
          cb();
          return;
        }

        this.allowScreenShare = false;

        await this.room.update({ allowScreenShare: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffScreenSharing")
        }

        cb()

        break;
      }

      case 'host:turnOnChat': {
        if (this.allowChat === true) {
          cb();
          return;
        }

        this.allowChat = true;

        await this.room.update({ allowChat: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnChat")
        }

        cb()

        break;
      }

      case 'host:turnOffChat': {
        if (this.allowChat === false) {
          cb();
          return;
        }

        this.allowChat = false;

        await this.room.update({ allowChat: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffChat")
        }
        cb()

        break;
      }

      case 'host:turnOnMicrophone': {
        if (this.allowMicrophone === true) {
          cb();
          return;
        }

        this.allowMicrophone = true;

        await this.room.update({ allowMicrophone: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnMicrophone")
        }

        cb()


        break;
      }

      case 'host:turnOffMicrophone': {
        if (this.allowMicrophone === false) {
          cb();
          return;
        }

        this.allowMicrophone = false;

        await this.room.update({ allowMicrophone: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffMicrophone")
        }

        cb()


        break;
      }

      case 'host:turnOnVideo': {
        if (this.allowCamera === true) {
          cb();
          return;
        }

        this.allowCamera = true;

        await this.room.update({ allowCamera: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnVideo")
        }

        cb()

        break;
      }

      case 'host:turnOffVideo': {
        if (this.allowCamera === false) {
          cb();
          return;
        }

        this.allowCamera = false;

        await this.room.update({ allowCamera: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffVideo")
        }

        cb()

        break;
      }

      case 'host:turnOnQuestion': {
        if (this.allowQuestion === true) {
          cb();
          return;
        }

        this.allowQuestion = true;

        await this.room.update({ allowQuestion: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnQuestion")
        }

        cb()

        break;
      }

      case 'host:turnOffQuestion': {
        if (this.allowQuestion === false) {
          cb();
          return;
        }

        this.allowQuestion = false;

        await this.room.update({ allowQuestion: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffQuestion")
        }
        cb()
        break;
      }

      case 'host:turnOnRaiseHand': {
        if (this.allowRaiseHand === true) {
          cb();
          return;
        }

        this.allowRaiseHand = true;
        await this.room.update({ allowRaiseHand: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnRaiseHand")
        }
        cb()
        break;
      }

      case 'host:turnOffRaiseHand': {
        if (this.allowRaiseHand === false) {
          cb();
          return;
        }

        this.allowRaiseHand = false;

        await this.room.update({ allowRaiseHand: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffRaiseHand")
        }
        cb()
        break;
      }

      case 'host:turnOnPrivate': {
        if (this.isPrivate === true) {
          cb();
          return;
        }

        console.log("private")

        this.isPrivate = true;
        await this.room.update({ isPrivate: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnPrivate")
        }
        cb()
        break;
      }

      case 'host:turnOffPrivate': {
        if (this.isPrivate === false) {
          cb();
          return;
        }

        this.isPrivate = false;
        await this.room.update({ isPrivate: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffPrivate")
        }
        cb()
        break;
      }

      case 'host:updateRoomName': {
        const { name } = request.data;

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:updateRoomName", { name })
        }
        cb()
        break;
      }

      case 'host:closeRoom': {
        console.log("host:closeroom")
        this.close();
        cb()
        break;
      }

      default: {
        logger.error('unknown request.method');

        cb({ error: "unknown request.method" })
      }
    }
  }

  removePeer(peerId) {
    if (!this.closed) {
      let peer = this.peers.get(peerId)

      if (this.allPeers)
        this.allPeers.delete(peerId);

      if (peer) {
        peer.close();

        this.peers.delete(peerId);
        this.hostSocketIds.delete(peerId);

        for (const peer of this.peers.values()) {
          this.notification(peer.socket, "peerLeave", { peerId })
        }
        if (this.peers.size === 0) {
          this.selfDestructCountdown()
        }
        return
      } else {
        if (this.allPeers && this.allPeers.size === 0) {
          this.selfDestructCountdown()
        }
      }

      peer = this.requestPeers ? this.requestPeers.get(peerId) : null

      if (peer) {
        peer.close();

        this.requestPeers.delete(peerId);

        for (const hostSocketId of this.hostSocketIds) {
          const hostPeer = this.peers.get(hostSocketId);
          this.notification(hostPeer.socket, "askToJoinPeerLeave", { peerId })
        }

        return
      }
    }
  }

  getPeersInfo(peerId) {
    return [...this.peers.values()].filter(peer => peer.id !== peerId).map(peer => peer.getInfo())
  }

  getRequestPeersInfo() {
    return [...this.requestPeers.values()].map(peer => peer.getInfo())
  }

  selfDestructCountdown() {
    console.log("selfDestructCountdown() started", { roomId: this.room.id })

    if (this.selfDestructTimeout) {
      clearTimeout(this.selfDestructTimeout)
    }

    this.selfDestructTimeout = setTimeout(() => {
      if (this.closed) return;

      if (this.peers.size === 0) {
        console.log("selfDestructCountdown() completed", { roomId: this.room.id })
        this.close();
      } else {
        console.log("selfDestructCountdown() aborted; room is not empty!", { roomId: this.room.id })
      }
    }, 300000)
  }

  close() {
    if (this.closed) return;

    if (this.selfDestructTimeout) {
      clearTimeout(this.selfDestructTimeout)
    }

    for (const peer of [...this.allPeers.values()]) {
      this.notification(peer.socket, "roomClosed")
      peer.close();
    }

    this.allPeers = null;

    this.audioLevelObserver = null;

    this.hostId = null;

    this.hostSocketIds = null;

    this.validAuthIds = null;

    this.requestPeers = null;

    this.peers = null;

    this.router.close();

    this.router = null;

    this.worker = null;

    this.closed = true;
  }

  toJson(peer = undefined) {
    const peers = this.getPeersInfo(peer.id)
    const requestPeers = this.getRequestPeersInfo()

    const isHost = this.hostId === peer.authId

    return {
      id: this.id,
      name: this.name,
      me: peer.getInfo(),
      isPrivate: this.isPrivate,
      allowCamera: this.allowCamera,
      allowChat: this.allowChat,
      allowMicrophone: this.allowMicrophone,
      allowScreenShare: this.allowScreenShare,
      allowQuestion: this.allowQuestion,
      allowRaiseHand: this.allowRaiseHand,
      allowToJoin: this.validAuthIds.has(peer.authId) || isHost,
      peers,
      requestPeers: isHost ? requestPeers : [],
      isHost
    };
  }
}
