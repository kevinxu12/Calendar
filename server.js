const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const http = require("http");
const socketIo = require("socket.io");
const cookieSession = require('cookie-session')
//mongoose.connect(keys.mongoURI);
const app = express();
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ['hi']
}))
app.use(passport.initialize());
app.use(passport.session());



const server = http.createServer(app);
const io = socketIo(server);
require('./services/socket')(io);
require('./services/passport');

require('./routes/authRoutes')(app);
require('./routes/calendarRoutes')(app);



const port = process.env.PORT || 5000;
console.log(port);
app.listen(port);