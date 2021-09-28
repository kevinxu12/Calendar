const mongoose = require('mongoose');
const User = mongoose.model('user'); 
module.exports = (app) => {
    // need to test this
    app.post('/api/updateUserUnavailableTimes', async (req, res) => {
        var email = req.user.profile._json.email;
        var obj = req.body;
        const response = await User.findOneAndUpdate({email}, {
            $push: {busyTimes: obj}
        })
        res.end();
    })
}