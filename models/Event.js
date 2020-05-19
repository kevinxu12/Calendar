var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const eventSchema = new Schema({
    summary: {type: String, text: true}, 
    start:Date,
    end: Date,
    description: { type: String, text: true},
    creator: { type: String, text:  true} ,
    owner: String,
    permissions: { type: String, required: false, enum: ['public', 'restricted', 'private'] },
    id: String
})
eventSchema.index({summary: "text", description: "text", creator: "text"});
var Event = mongoose.model('event', eventSchema);