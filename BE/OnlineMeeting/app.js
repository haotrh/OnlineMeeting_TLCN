const express = require("express");
const { json, urlencoded } = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { role, sequelize, room } = require("./models/index");
const chat = require("./controllers/chat.controller");

const app = express();

const https = require("httpolyglot")
const fs = require("fs")
const path = require("path")
const { Server } = require("socket.io")
const mediasoup = require('mediasoup')

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const _dirname = path.resolve()

// var allowlist = ['http://localhost:8081', 'http://localhost:3000']
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

// app.use(cors(corsOptionsDelegate));
app.use(cors())

// parse requests of content-type - application/json
// app.use(bodyParser.json());
app.use(json());

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({ extended: true }));


const Role = role;
const Room = room;
// force: true => drop existing tables and re-sync database
// For production, just insert these rows manually 
// use sync() without parameters to avoid dropping data => db.sequelize.sync();
sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
// create 3 rows in database
function initial() {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });

    Room.create({
      host: "admin",
      code: "admin",
      password: ""
    });
  }


// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/room.routes')(app);
require('./routes/chat.routes')(app);
require('./routes/verifycode.routes')(app);

// simple route
app.get("/", (req, res) => {
  const date = new Date('2021-10-17T10:42:13.331Z')
  const newer = date.getTime() + (60*60*1000)
  const date2 = new Date(newer)
  const now = Date.now()
  if(now > date2)
  res.send({ message: "Online meeting: " + now })
  res.send({ message: "Online meeting: " + date, newer: "Online meeting: " + date2 });
});

// app.get("/sfu2", (req, res) => {
//   res.render('./server/public/index');
// });

app.use('/sfu', express.static(path.join(_dirname, './server/public/')))
app.use('/chatio', express.static(path.join(_dirname, './server/public/chat/')))

const options = {
  key: fs.readFileSync('./server/ssl/key.pem', 'utf-8'),
  cert: fs.readFileSync('./server/ssl/cert.pem', 'utf-8')
} 

const httpsServer = https.createServer(options, app)
 
const io = new Server(httpsServer)

const emitMessges = (code) => {
  chat.loadSocketMessage(code)
  .then((result) => io.emit("load message", result))
  .catch(console.log);
};

io.on('connection', socket => {
  console.log("chat connected");

  socket.on("send message", message => {
  const msg = JSON.parse(message)
  chat.sendSocketMessage(msg)
  .then((_) => {
    emitMessges(msg.code);
  })
    .catch((err) => io.emit(err));
  });

  socket.on("disconnect", () => {
    console.log("chat disconnected");
  });
});

const peers = io.of('/mediasoup')

peers.on('connection', socket => {
  console.log(socket.id)
  socket.emit('connection-success', { 
    socketId : socket.id 
  })
})

let worker

const createWorker = async() => {
  worker = await mediasoup.createWorker({
    rtcMinPort: 2000,
    rtcMaxPort: 2020
  })

  console.log(`Worker PID: ${worker.pid}`)

  worker.on('died', error => {
    console.log('Worker died')
    setTimeout(() => process.exit(1), 5000)
  })

  return worker
}

worker = createWorker()




// start server
httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}s.`)
})


