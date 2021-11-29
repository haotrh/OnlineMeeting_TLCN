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
    this.room = room

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

    this.selfDestructTimeout = null;

    this.closed = false;

    //All peers included joined, requesting, lobby peers
    this.allPeers = new Map();

    //Joined peers
    this.peers = new Map();

    //List of invted user id
    this.invitedIds = new Set([...room.guests.map(guest => guest.id)]);

    //List of request to join users
    this.requestPeers = new Map();

    // mediasoup AudioLevelObserver.
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

  isPeerValid(peerId) {
    return this.hostId === peerId || this.invitedIds.has(peerId)
  }

  getJoinedPeers(excludePeerId = undefined) {
    return [...this.peers.values()].filter(peer => peer.id !== excludePeerId)
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

  async handleSocketRequest(peer, request, cb, serverRequest) {
    if (request.method.startsWith("host:") && (!serverRequest && !peer.isHost)) {
      cb({ error: "You have no permission" })
      return;
    }

    switch (request.method) {
      case 'getRouterRtpCapabilities': {
        cb(this.router.rtpCapabilities)
        break;
      }

      case 'join': {
        if (!this.isPeerValid(peer.authId)) {
          cb({ error: "Failed to join" })
          throw new Error("Not valid")
        }

        const { rtpCapabilities } = request.data;

        peer.isHost = this.hostId === peer.authId;
        peer.rtpCapabilities = rtpCapabilities;

        const joinedPeers = this.getJoinedPeers()

        if (peer.isHost) {
          this.hostSocketIds.add(peer.id);
        }

        peer.socket.join(this.id)
        this.peers.set(peer.id, peer);

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

      case 'askToJoin': {
        if (this.invitedIds.has(peer.authId) || this.hostId === peer.authId) {
          cb({ error: "You are already valid" })
          throw new Error("You are already valid")
        }

        const { rtpCapabilities } = request.data;

        peer.rtpCapabilities = rtpCapabilities;

        this.requestPeers.set(peer.id, peer);

        for (const hostSocketId of this.hostSocketIds) {
          const hostPeer = this.peers.get(hostSocketId)
          this.notification(hostPeer.socket, "askToJoin", peer.getInfo())
        }

        cb();

        break;
      }

      case 'acceptPeer': {
        const { peerId } = request.data

        const requestPeer = this.requestPeers.get(peerId)

        if (!requestPeer) {
          cb({ error: "Peer did not request" })
          throw new Error("Peer did not request")
        }

        cb();

        this.requestPeers.delete(peerId)
        this.invitedIds.add(requestPeer.authId)
        this.peers.set(peerId, requestPeer)

        //Notify accepted peer
        await this.request(requestPeer.socket, "acceptedPeer", this.toJson(requestPeer))

        //Create consumers for existing Producers
        for (const joinedPeer of this.getJoinedPeers(peerId)) {
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
          this.notification(hostPeer.socket, "askToJoinPeerLeave", { peerId })
        }

        //Notify new peer to all peers
        for (const otherPeer of this.getJoinedPeers(requestPeer.id)) {
          this.notification(
            otherPeer.socket,
            'newPeer',
            requestPeer.getInfo()
          );
        }

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
          this.invitedIds.add(peer.authId)
          this.peers.set(peer.id, peer)

          //Notify accepted peer
          this.notification(peer.socket, "acceptedPeer", this.toJson(peer))

          //Notify to all host all peers are accepted
          for (const hostSocketId of this.hostSocketIds) {
            const hostPeer = this.peers.get(hostSocketId);
            this.notification(hostPeer.socket, "askToJoinPeerAllLeave")
          }

          //Notify new peer to all peers
          for (const otherPeer of this.getJoinedPeers(peer.id)) {
            this.notification(
              otherPeer.socket,
              'newPeer',
              peer.getInfo()
            );
          }
        }

        cb();

        break;
      }

      case 'denyPeer': {
        const { peerId } = request.data

        const peer = this.requestPeers.get(peerId)

        if (!peer) {
          cb({ error: "Peer did not request" })
          throw new Error("Peer did not request")
        }

        this.requestPeers.delete(peerId)

        //Notify denied peer
        this.notification(peer.socket, "deniedPeer")

        cb();

        break;
      }

      case 'denyAllPeers': {
        for (const peer of this.requestPeers.values()) {
          this.notification(peer.socket, "deniedPeer")
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

        if (!appData.source || !['mic', 'webcam', 'screen'].includes(appData.source)) {
          cb({ error: "Invalid producer source" })
          throw new Error('invalid producer source');
        }

        if (appData.source === 'mic' && (!this.allowMicrophone && peer.authId !== this.hostId)) {
          cb({ error: "Peer not authorized" })
          throw new Error('peer not authorized');
        }

        if (appData.source === 'webcam' && (!this.allowCamera && peer.authId !== this.hostId)) {
          cb({ error: "Peer not authorized" })
          throw new Error('peer not authorized');
        }

        if (appData.source === 'screen' && (!this.allowScreenShare && peer.authId !== this.hostId)) {
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

        if (!this.allowChat && peer.authId !== this.hostId) {
          cb({ error: "You have no permission to send chat" })
          throw new Error('No chat permission');
        }

        const { message } = request.data;

        if (!message) {
          cb({ error: "Please enter message" })
          return
        }

        for (const otherPeer of this.getJoinedPeers()) {
          this.notification(otherPeer.socket, "chatMessage", { message, name: peer.name, peerId: peer.id, picture: peer.picture })
        }

        break;
      }

      case 'getMyRoomInfo': {
        cb(this.toJson(peer))

        break;
      }

      case 'raiseHand': {
        if (peer.raisedHand) {
          cb({ error: "Already raised" })
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
          cb({ error: "Not raised" })
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

        if (!this.allowQuestion && peer.authId !== this.hostId) {
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

        this.notification(peer.socket, "host:kick");


        cb()

        break;
      }

      case 'host:turnOnScreenSharing': {
        this.allowScreenShare = true;

        await this.room.update({ allowScreenShare: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnScreenSharing")
        }
        cb()

        break;
      }

      case 'host:turnOffScreenSharing': {
        this.allowScreenShare = false;

        await this.room.update({ allowScreenShare: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffScreenSharing")
        }

        cb()

        break;
      }

      case 'host:turnOnChat': {
        this.allowChat = true;

        await this.room.update({ allowChat: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnChat")
        }

        cb()

        break;
      }

      case 'host:turnOffChat': {
        this.allowChat = false;

        await this.room.update({ allowChat: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffChat")
        }
        cb()

        break;
      }

      case 'host:turnOnMicrophone': {
        this.allowMicrophone = true;

        await this.room.update({ allowMicrophone: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnMicrophone")
        }

        cb()


        break;
      }

      case 'host:turnOffMicrophone': {
        this.allowMicrophone = false;

        await this.room.update({ allowMicrophone: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffMicrophone")
        }

        cb()


        break;
      }

      case 'host:turnOnVideo': {
        this.allowCamera = true;

        await this.room.update({ allowCamera: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnVideo")
        }

        cb()

        break;
      }

      case 'host:turnOffVideo': {
        this.allowCamera = false;

        await this.room.update({ allowCamera: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffVideo")
        }

        cb()

        break;
      }

      case 'host:turnOnQuestion': {
        this.allowQuestion = true;

        await this.room.update({ allowQuestion: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnQuestion")
        }

        cb()

        break;
      }

      case 'host:turnOffQuestion': {
        this.allowQuestion = false;

        await this.room.update({ allowQuestion: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffQuestion")
        }
        cb()
        break;
      }

      case 'host:turnOffRaisehand': {
        this.allowRaiseHand = false;

        await this.room.update({ allowRaiseHand: false })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOffRaisehand")
        }
        cb()
        break;
      }

      case 'host:turnOnRaisehand': {
        this.allowRaiseHand = true;
        await this.room.update({ allowRaiseHand: true })

        for (const peer of this.getJoinedPeers()) {
          this.notification(peer.socket, "host:turnOnRaisehand")
        }
        cb()
        break;
      }

      case 'host:closeRoom': {
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
    let peer = this.peers?.get(peerId)

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

  getPeersInfo(peerId) {
    return [...this.peers.values()].filter(peer => peer.id !== peerId).map(peer => peer.getInfo())
  }

  getRequestPeersInfo() {
    return [...this.requestPeers.values()].map(peer => peer.getInfo())
  }

  selfDestructCountdown() {
    console.log("selfDestructCountdown() started")

    if (this.selfDestructTimeout) {
      clearTimeout(this.selfDestructTimeout)
    }

    this.selfDestructTimeout = setTimeout(() => {
      if (this.closed) return;

      if (this.peers.size === 0) {
        console.log("selfDestructCountdown() completed")
        this.close();
      } else {
        console.log("selfDestructCountdown() aborted; room is not empty!")
      }
    }, 300000)
  }

  close() {
    for (const peer of [...this.allPeers.values()]) {
      this.notification(peer.socket, "roomClosed")
      peer.close();
    }

    this.allPeers = null;

    this.audioLevelObserver = null;

    this.hostId = null;

    this.hostSocketIds = null;

    this.invitedIds = null;

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
      allowCamera: this.allowCamera,
      allowChat: this.allowChat,
      allowMicrophone: this.allowMicrophone,
      allowScreenShare: this.allowScreenShare,
      allowQuestion: this.allowQuestion,
      allowRaiseHand: this.allowRaiseHand,
      allowToJoin: this.invitedIds.has(peer.authId) || isHost,
      peers,
      requestPeers: isHost ? requestPeers : [],
      isHost
    };
  }
}
