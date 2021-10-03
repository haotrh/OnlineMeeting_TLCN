const express = require("express");
const { json, urlencoded } = require("express");
// import bodyParser from "body-parser";
const cors = require("cors");
const { role, sequelize } = require("./models/index");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
// app.use(bodyParser.json());
app.use(json());

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({ extended: true }));


const Role = role;
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
  }

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/room.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Online meeting!" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});