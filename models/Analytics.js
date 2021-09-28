var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// analytics Schema
const analyticsSchema = new Schema({
    email: String,
    rawFilterTagData: [{ date: Date, tag: '' }],
    filterTagCount:
    {
        type: Map,
        of: Number,
        default: {}
    },
    rawPickedFriendsData: [{ date: Date, email: '' }],
    pickedFriendsCount:
    {
        type: Map,
        of: Number,
        default: {}
    }

})

mongoose.model('analytics', analyticsSchema);