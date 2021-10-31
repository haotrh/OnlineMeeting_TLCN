const express = require("express");
const { json, urlencoded } = require("express");
const cors = require("cors");
const helmet = require('helmet')
const https = require("http")
const fs = require("fs")
const path = require("path")
const mediasoup = require('mediasoup')
const config = require('./config/mediasoup.config')
const Room = require('./lib/mediasoup/Room')
const Peer = require('./lib/mediasoup/Peer')
const routes = require('./routes');
const { sequelize } = require("./models/index");
const { errorConverter, errorHandler } = require("./middleware/error");
const passport = require('passport');
const { jwtStrategy } = require('./config/passport.config');
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");

//Global variables
let app;
let httpsServer;
let workers = [];
let nextMediasoupWorkerIdx = 0;
let roomList = new Map();
const PORT = process.env.PORT || config.listenPort || 8080;
const _dirname = path.resolve();

//Init
(async () => {
  try {
    // await runMediasoupWorker();
    await runExpressApp();
    await runWebServer();
    // await runSequelize();
    // await runSocketServer();
  } catch (err) {
    console.error(err);
  }
})();

//RUN MEDIASOUP WORKER
async function runMediasoupWorker() {
  let { numWorkers } = config.mediasoup;

  for (let i = 0; i < numWorkers; i++) {
    try {
      let worker = await mediasoup.createWorker({
        logLevel: config.mediasoup.worker.logLevel,
        logTags: config.mediasoup.worker.logTags,
        rtcMinPort: config.mediasoup.worker.rtcMinPort,
        rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
      });
      worker.on("died", () => {
        console.error(
          "mediasoup worker died, exiting in 2 seconds... [pid:%d]",
          worker.pid
        );
        setTimeout(() => process.exit(1), 2000);
      });
      workers.push(worker);
    } catch (e) {
      console.log(e);
    }
  }
}

//RUN EXPRESS APP
async function runExpressApp() {
  app = express();

  //enable cors
  app.use(cors());

  //set security HTTP headers
  app.use(helmet());

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(express.static(__dirname));
  //set jwt
  app.use(passport.initialize());
  passport.use('jwt', jwtStrategy);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use('/api', routes);
  //handle error
  app.use(errorConverter);
  app.use(errorHandler);
}

//RUN WEB SERVER
async function runWebServer() {
  const options = {
    key: fs.readFileSync(path.join(__dirname, config.sslKey), "utf-8"),
    cert: fs.readFileSync(path.join(__dirname, config.sslCrt), "utf-8"),
  };

  httpsServer = https.createServer(options, app);


  httpsServer.listen(PORT, () => {
    console.log("Listening " + config.listenPort);
  });
}

//RUN SEQUELIZE
async function runSequelize() {
  await sequelize.sync({ force: true })
  console.log('Drop and Resync Db');
}

//RUN SOCKET SERVER
async function runSocketServer() {
  const io = require('socket.io')(httpsServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //Create room
    socket.on("createRoom", async ({ room_id }, callback) => {
      if (roomList.has(room_id)) {
        callback({ error: "Room already exists" });
      } else {
        console.log("Created room", { room_id });

        let worker = getMediasoupWorker();
        roomList.set(room_id, new Room(room_id, worker, io, socket.id));

        console.log(roomList)
        callback(room_id);
      }
    });

    //Join room
    socket.on("join", ({ room_id, uid, name }, callback) => {
      console.log("User joined", {
        room_id,
        name,
      });

      const room = roomList.get(room_id);

      if (!room) {
        return callback({
          error: "Room does not exist",
        });
      }

      room.addPeer(new Peer(socket.id, uid, name));
      socket.room_id = room_id;

      callback(room.toJson());
    });

    //Get producers
    socket.on("getProducers", (_, callback) => {
      if (!socket.room_id) {
        callback({ error: "Not joined any room" });
        return;
      }

      const room = roomList.get(socket.room_id);

      if (!room) return;

      console.log("Get producers", {
        name: `${room.getPeers().get(socket.id)?.name}`,
      });

      let producerList = room.getProducerListForPeer();
      socket.emit("newProducers", producerList);
    });

    //Get RouterRtpCapabilities
    socket.on("getRouterRtpCapabilities", (_, callback) => {
      if (!socket.room_id) {
        callback({ error: "Not joined any room" });
        return;
      }

      console.log("Get RouterRtpCapabilities", {
        name: `${roomList.get(socket.room_id)?.getPeers()?.get(socket.id)?.name
          }`,
      });

      try {
        callback(roomList.get(socket.room_id)?.getRtpCapabilities());
      } catch (e) {
        callback({
          error: e?.message ?? "Error",
        });
      }
    });

    //Create WebRTC Transport
    socket.on("createWebRtcTransport", async (_, callback) => {
      if (!socket.room_id) {
        callback({ error: "Not joined any room" });
        return;
      }

      console.log("Create webrtc transport", {
        name: `${roomList.get(socket.room_id)?.getPeers()?.get(socket.id)?.name
          }`,
      });

      try {
        const room = roomList.get(socket.room_id);

        if (!room) return;

        const { params } = await room.createWebRtcTransport(socket.id);
        callback(params);
      } catch (err) {
        console.error(err);
        callback({
          error: err?.message,
        });
      }
    });

    //Connect transport
    socket.on(
      "connectTransport",
      async ({ transport_id, dtlsParameters }, callback) => {
        if (!socket.room_id) {
          callback({ error: "Not joined any room" });
          return;
        }

        console.log("Connect transport", {
          name: `${roomList.get(socket.room_id)?.getPeers()?.get(socket.id)?.name
            }`,
        });

        const room = roomList.get(socket.room_id);

        if (!room) return;

        await room.connectPeerTransport(
          socket.id,
          transport_id,
          dtlsParameters
        );

        callback("success");
      }
    );

    //Produce
    socket.on(
      "produce",
      async ({ kind, rtpParameters, producerTransportId }, callback) => {
        if (!socket.room_id) {
          callback({ error: "Not joined any room" });
          return;
        }

        const room = roomList.get(socket.room_id);

        if (!room) {
          return callback({ error: "not is a room" });
        }

        let producer_id = await room.produce(
          socket.id,
          producerTransportId,
          rtpParameters,
          kind
        );

        console.log("Produce", {
          type: `${kind}`,
          name: `${room?.getPeers()?.get(socket.id)?.name}`,
          id: `${producer_id}`,
        });

        callback({
          producer_id,
        });
      }
    );

    //Consume
    socket.on(
      "consume",
      async (
        { consumerTransportId, producerId, rtpCapabilities },
        callback
      ) => {
        if (!socket.room_id) {
          callback({ error: "Not joined any room" });
          return;
        }

        const room = roomList.get(socket.room_id);

        if (!room) return;

        let params = await room.consume(
          socket.id,
          consumerTransportId,
          producerId,
          rtpCapabilities
        );

        console.log("Consuming", {
          name: `${roomList.get(socket.room_id) &&
            roomList.get(socket.room_id)?.getPeers()?.get(socket.id)?.name
            }`,
          producer_id: `${producerId}`,
          consumer_id: `${params.id}`,
        });

        callback(params);
      }
    );

    // socket.on("resume", async (_, callback) => {
    //   await consumer.resume();
    //   callback();
    // });

    //Get My Room Info
    socket.on("getMyRoomInfo", (_, callback) => {
      if (!socket.room_id) {
        callback({ error: "Not joined any room" });
        return;
      }

      callback(roomList.get(socket.room_id)?.toJson());
    });

    //Get Room Info By Id
    socket.on("getRoomInfoById", ({ room_id }, callback) => {
      const room = roomList.get(room_id);
      if (!room) {
        callback({ error: "Room not found" });
      } else {
        callback(room.toJson());
      }
    });

    //Disconnect
    socket.on("disconnect", () => {
      if (!socket.room_id) {
        return;
      }

      console.log("Disconnect", {
        name: `${roomList.get(socket.room_id) &&
          roomList.get(socket.room_id)?.getPeers()?.get(socket.id)?.name
          }`,
      });
      roomList.get(socket.room_id)?.removePeer(socket.id);
    });

    //Producer closed
    socket.on("producerClosed", ({ producer_id }) => {
      if (!socket.room_id) {
        return;
      }

      console.log("Producer close", {
        name: `${roomList.get(socket.room_id) &&
          roomList.get(socket.room_id)?.getPeers()?.get(socket.id)?.name
          }`,
      });

      roomList.get(socket.room_id)?.closeProducer(socket.id, producer_id);
    });

    //Exit room
    socket.on("exitRoom", async (_, callback) => {
      if (!socket.room_id) {
        return;
      }

      console.log("Exit room", {
        name: `${roomList.get(socket.room_id) &&
          roomList.get(socket.room_id)?.getPeers()?.get(socket.id)?.name
          }`,
      });

      const room = roomList.get(socket.room_id);

      if (!room) {
        callback({
          error: "not currently in a room",
        });
        return;
      }
      // close transports
      await room.removePeer(socket.id);
      if (room.getPeers().size === 0) {
        roomList.delete(socket.room_id);
      }

      socket.room_id = null;

      callback("successfully exited room");
    });
  });
}

//Get next mediasoup Worker
const getMediasoupWorker = () => {
  const worker = workers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

  return worker;
};
