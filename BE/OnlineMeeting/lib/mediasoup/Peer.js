module.exports = class Peer {
  constructor({ user, isHost, rtpCapabilities, socket }) {
    this.id = socket.id;

    this.name = user.displayName;

    this.email = user.email;

    this.picture = user.profilePic;

    this.isHost = isHost ?? false;

    this.authId = user.id;

    this.raisedHand = false;

    this.raisedHandTimestamp = null;

    this.transports = new Map();

    this.consumers = new Map();

    this.producers = new Map();

    this.rtpCapabilities = rtpCapabilities;

    this.socket = socket;
  }

  addTransport(transport) {
    this.transports.set(transport.id, transport);
  }

  async connectTransport(transportId, dtlsParameters) {
    if (!this.transports.has(transportId)) {
      throw new Error(`transport with id "${transportId}" not found`);
    };

    await this.transports.get(transportId).connect({
      dtlsParameters,
    });
  }

  getTransport(id) {
    return this.transports.get(id)
  }

  getConsumerTransport() {
    return [...this.transports.values()].find(transport => transport.appData.consuming);
  }

  addProducer(producer) {
    this.producers.set(producer.id, producer)
  }

  getProducer(producerId) {
    return this.producers.get(producerId);
  }

  removeProducer(producerId) {
    this.producers.delete(producerId);
  }

  addConsumer(consumer) {
    this.consumers.set(consumer.id, consumer)
  }

  getConsumer(consumerId) {
    this.consumers.get(consumerId);
  }

  closeConsumer(consumerId) {
    try {
      this.consumers.get(consumerId).close();
    } catch (e) {
      console.warn(e);
    }
    this.consumers.delete(consumerId);
  }

  close() {
    this.transports.forEach((transport) => transport.close());
    this.socket.disconnect();
  }

  getInfo() {
    const peerInfo = {
      id: this.id,
      authId: this.authId,
      name: this.name,
      picture: this.picture,
      isHost: this.isHost,
      raisedHand: this.raisedHand,
      email: this.email
    }

    return peerInfo
  }
}
