var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const availabilitySchema = new Schema({
    email: String,
    dailyBusyTimes: [{tag: String, start: Number, end: Number, day: {type: String, required: false}}],
})

 mongoose.model('availability', availabilitySchema);