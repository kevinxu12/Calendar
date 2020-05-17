const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const http = require("http");
const socketIo = require("socket.io");
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
var cors = require('cors');
mongoose.connect(keys.mongoURI);
mongoose.connection.on('open', function() {
    console.log("connected to mongo db");
})
const app = express();
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['hi']
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());


const server = http.createServer(app);
const io = socketIo(server);

require('./models/User');
require('./models/Event');


require('./services/socket')(io);
require('./services/passport');


require('./routes/authRoutes')(app);
require('./routes/calendarRoutes')(app);



const port = process.env.PORT || 5000;
console.log(port);
app.listen(port);