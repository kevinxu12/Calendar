const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const http = require("http");
const socketIo = require("socket.io");
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
var cors = require('cors');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
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
require('./models/Analytics');
require('./models/Availability');


require('./services/socket')(io);
require('./services/passport');


require('./routes/authRoutes')(app);
require('./routes/calendarRoutes')(app);
require('./routes/calendarAPIRoutes')(app);
require('./routes/analyticsRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/suggestedEventRoutes')(app);


const port = process.env.PORT || 5000;
console.log(port);
app.listen(port);