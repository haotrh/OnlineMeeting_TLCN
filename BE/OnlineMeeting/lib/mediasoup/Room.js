const logger = require('../../config/logger.config');
const config = require('../../config/mediasoup.config');
const SocketTimeoutError = require('../../utils/SocketTimeoutError')

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
    this.router = router;

    this.worker = worker;

    this.audioLevelObserver = audioLevelObserver;

    this.id = roomId;

    this.hostId = hostId;

    this.hostSocketIds = new Set();

    this.name = room.name;

    this.allowChat = room.allowChat;

    this.allowMicrophone = room.allowMicrophone;

    this.allowCamera = room.allowCamera;

    this.allowScreenShare = room.allowScreenShare;

    //Joined peers
    this.peers = new Map();

    //List of invted user id
    this.invitedIds = new Set();

    //List of request to join users
    this.requestPeers = new Map();
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

  async createConsumer({ consumerPeer, producerPeer, producer, socket }) {
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

      this.notification(consumer.socket, 'consumerClosed', { consumerId: consumer.id });
    });

    consumer.on('producerpause', () => {
      this.notification(consumer.socket, 'consumerPaused', { consumerId: consumer.id });
    });

    consumer.on('producerresume', () => {
      this.notification(consumer.socket, 'consumerResumed', { consumerId: consumer.id });
    });

    consumer.on('score', (score) => {
      this.notification(consumer.socket, 'consumerScore', { consumerId: consumer.id, score });
    });

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

      this.notification(
        consumerPeer.socket,
        'consumerScore',
        {
          consumerId: consumer.id,
          score: consumer.score
        }
      );
    }
    catch (error) {
      logger.warn('_createConsumer() | [error:"%o"]', error);
    }

  }

  async handleSocketRequest(peer, request, cb) {
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

        if (peer.isHost) {
          this.hostSocketIds.add(peer.id);
        }

        peer.socket.join(this.id)
        this.peers.set(peer.id, peer);

        cb(this.toJson(peer));

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

        if (!peer) {
          cb({ error: "Peer did not request" })
          throw new Error("Peer did not request")
        }

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

        this.requestPeers.delete(peerId)
        this.invitedIds.add(requestPeer.authId)
        this.peers.set(peerId, requestPeer)

        //Notify accepted peer
        this.notification(requestPeer.socket, "acceptedPeer", this.toJson(requestPeer))

        //Notify new peer to all peers
        for (const otherPeer of this.getJoinedPeers(requestPeer.id)) {
          this.notification(
            otherPeer.socket,
            'newPeer',
            requestPeer.getInfo()
          );
        }

        cb();

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

        cb({ producerId: producer.id })

        for (const otherPeer of this.getJoinedPeers(peer.id)) {
          this.createConsumer({
            consumerPeer: otherPeer,
            producerPeer: peer,
            producer
          })
        }

        if (kind === 'audio') {
          this.audioLevelObserver.addProducer({ producerId: producer.id }).catch(() => { })
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

      case 'sendMessage': {
        const { message } = request.data;
        if (!message) {
          cb({ error: "Please enter message" })
          return
        }

        for (const peer of this.getJoinedPeers(peer.id)) {
          this.notification(peer.socket, "sendMessage", {})
        }

        break;
      }

      case 'raisedHand': {
        break;
      }

      case 'getMyRoomInfo': {
        cb(this.toJson(peer))

        break;
      }

      default: {
        logger.error('unknown request.method');

        cb({ error: "unknown request.method" })
      }
    }
  }

  removePeer(peerId) {
    let peer = this.peers.get(peerId)

    if (peer) {
      peer.close();

      this.peers.delete(peerId);
      this.hostSocketIds.delete(peerId);

      for (const peer of this.peers.values()) {
        this.notification(peer.socket, "peerLeave", { peerId })
      }
      return
    }

    peer = this.requestPeers.get(peerId)

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

  toJson(peer = undefined) {
    const peers = [...this.peers.values()].map(peer => peer.getInfo())
    const requestPeers = [...this.requestPeers.values()].map(peer => peer.getInfo())

    return {
      id: this.id,
      name: this.name,
      allowCamera: this.allowCamera,
      allowChat: this.allowChat,
      allowMicrophone: this.allowMicrophone,
      allowScreenShare: this.allowScreenShare,
      allowToJoin: this.invitedIds.has(peer.authId) || this.hostId === peer.authId,
      peers,
      requestPeers: this.hostId === peer.authId ? requestPeers : null
    };
  }
}
