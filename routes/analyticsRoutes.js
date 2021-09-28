const mongoose = require('mongoose');
const Analytics = mongoose.model('analytics');
module.exports = (app) => {
    // Inputs analytics data for every time you click "filter". Record how often you filtered for a tag as well as raw data
    app.post('/api/addNewFilterEventAnalytics', async (req, res) => {
        // body should be format 
        // { date: Date, tag: ''}
        var body = req.body;
        var tag = body.tag;
        var email = req.user.profile._json.email 
        Analytics.findOne({email}, (err, response) => {
            // first bit increments the hash table
            var filterTagMap = response.filterTagCount;
            var tagCount = filterTagMap.get(tag);
            if(tagCount) {
                filterTagMap.set(tag, tagCount + 1);
            } else {
                filterTagMap.set(tag, 1);
            }

            // second bit adds the raw data
            response.rawFilterTagData.push(body);
            response.save();
            res.end();
        });
    })
    // inputs analytics data for every time you click "Find times with friends". Record how often you clicked find friends for each person as well as raw data
    // need to test this one
    // @param body { date: Date, emailList: ['', '', '']}
    app.post('/api/addNewPickedFriendsAnalytics', async (req, res) => {
        
        var body = req.body;
        var date = body.date;
        var emailList = body.emailList;
        var userEmail = req.user.profile._json.email 
        Analytics.findOne({userEmail}, (err, response) => {
            // first bit increments the hash table
            for(const i in emailList) {
                var friendEmail = emailList[i];
                console.log(friendEmail);
                var pickedFriendsMap = response.pickedFriendsCount;
                var pickedCount = pickedFriendsMap.get(friendEmail);
                if(pickedCount) {
                    pickedFriendsMap.set(friendEmail, pickedCount + 1);
                } else {
                    pickedFriendsMap.set(friendEmail, 1);
                }
                response.rawPickedFriendsData.push({date, email: friendEmail});
                // second bit adds the raw data
               
            }
          
            const result = response.save();
            res.end(result);
        });
    })
}