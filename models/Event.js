var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const eventSchema = new Schema({
    summary: String,
    start:Date,
    end: Date,
    description: String,
    creator: String,
    owner: String,
    permissions: { type: String, required: false, enum: ['public', 'restricted', 'private'] }
})

var Event = mongoose.model('event', eventSchema);