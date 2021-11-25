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
const routes = require('./routes');
const { sequelize } = require("./models/index");
const { errorConverter, errorHandler } = require("./middleware/error");
const passport = require('passport');
const { jwtStrategy } = require('./config/passport.config');
const { tokenService, roomService, userService } = require("./services");
const logger = require("./config/logger.config");
const Peer = require("./lib/mediasoup/Peer");

//Global variables
let app;
let httpsServer;
let workers = [];
let nextMediasoupWorkerIdx = 0;
let roomList = new Map();
const PORT = process.env.PORT || config.listenPort || 8080;

//Init
(async () => {
  try {
    await runMediasoupWorker();
    await runExpressApp();
    await runWebServer();
    // await runSequelize();
    await runSocketServer();
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
  await sequelize.sync()
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

  io.on("connection", async (socket) => {
    const { roomId, token } = socket.handshake.query;

    if (!roomId || !token) {
      logger.warn('Connection request without roomId and/or token');
      socket.disconnect(true);
      return;
    }

    let user;

    try {
      const payload = await tokenService.verifyJwtToken(token);

      if (!payload) {
        logger.warn('Not authenticated');
        socket.disconnect(true);
        return;
      }

      user = await userService.getUserById(payload.sub);
    } catch (err) {
      logger.warn('Not authenticated');
      socket.disconnect(true);
      return;
    }

    if (!user) {
      logger.warn('User not available');
      socket.disconnect(true);
      return;
    }

    const room = await getOrCreateRoom({ roomId, socket });

    if (!room) {
      logger.warn('Room is not available');
      socket.disconnect(true);
      return;
    }

    const peer = new Peer({
      user,
      socket
    })

    room.allPeers.set(peer.id, peer)

    socket.roomId = roomId;

    socket.on('request', (request, cb) => {
      room.handleSocketRequest(peer, request, cb)
    })

    socket.emit("initialized")

    socket.on('disconnect', () => {
      logger.warn("disconnect")
      if (!socket.roomId) {
        return;
      }

      const room = roomList.get(socket.roomId)

      room.removePeer(socket.id);
    })
  });
}

//Get next mediasoup Worker
const getMediasoupWorker = () => {
  const worker = workers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

  return worker;
};

const getOrCreateRoom = async ({ roomId, socket }) => {
  let room = roomList.get(roomId)

  if (room && room.closed) {
    room = null;
  }

  if (!room) {
    const roomData = await roomService.getRoomById(roomId);

    if (!roomData) {
      return null;
    }

    const host = await roomData.getHost();

    room = await Room.create({
      roomId,
      room: roomData,
      hostId: host.id,
      socket,
      worker: getMediasoupWorker(),
      roomClose: () => {
        roomList.delete(roomId)
      }
    })

    roomList.set(room.id, room);
  }

  return room
}
