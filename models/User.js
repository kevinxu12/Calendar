var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const userSchema = new Schema({
    email: String,
    name: String,
    friends: [String],
    busyTimes: [{tag: String, start: Number, end: Number}],
    syncToken: String
})

var User = mongoose.model('user', userSchema);