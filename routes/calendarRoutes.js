
var helperFunctions = require('../services/calendarHelperFunctions');
const mongoose = require('mongoose');
const Event = mongoose.model('event');
module.exports = (app) => {
    app.get('/api/getAllCalendars', async (req, res) => {
        console.log("called show all calendars");
        var obj = await helperFunctions.buildAuthClient(req);
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        calendar.calendarList.list({ auth: oauth2Client }, function (err, response) {
            res.send(response.data.items);
        })
    })

    app.get('/api/getAllEvents', async (req, res) => {
        console.log("called get all events");
        var obj = await helperFunctions.buildAuthClient(req);
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        helperFunctions.getAllEvents(calendar, oauth2Client, function (events) {
            res.send(events);
        })
    })
    // require a query 
    // ?range=week
    // ?timezone=en-us
    //body = {email: [listofemails]}
    app.post('/api/getAvailableTimes', async (req, res) => {
        // console.log('called get available times');
        // res.end();
        // in the future, we will have filters for buffer room
        var emailList = req.email;
        var range = req.query.range;
        var timezone = req.query.timezone
        var startdate = new Date();
        if(range === "week") {
            startdate.setDate(startdate.getDate() + 7);
        }
        Event.find({owner: {"$in": emailList}, start: { $lt: startdate} }, function(err, response) {
            // first we sort reponse by date
            response = response.sort(function(a,b) { return a.start.getTime() - b.start.getTime() })
            // now we run our algorithm
            console.log(response);
            var availableTimes = [];
            // we will keep track of two pointers. the first pointer marks the start of the working free period
            // the second keeps track of the end
            var pointer1 = new Date();
            var pointer2 = new Date();
            console.log(pointer1.toLocaleString(timezone));
            console.log(pointer2.toLocaleString(timezone));
            for(var i = 0; i < response.length; i ++) {
                console.log(response[i].summary);
                var tempStart = response[i].start;
                var tempEnd = response[i].end;
                console.log(tempStart);
                console.log(tempEnd);
                // case in which s1 --- e1 (leeway) s2 ---e2
                if(tempStart.getTime() > pointer2.getTime()) {
                    const pointer1Date = new Date(pointer2).toLocaleString(timezone);
                    const pointer2Date = new Date(tempStart).toLocaleString(timezone);
                    availableTimes.push([pointer1Date, pointer2Date]);
                    pointer1 = tempStart;
                    pointer2 = tempEnd;
                } else {
                // case where s1 --- s2 -- e1 -- e2
                    if(tempStart > pointer1 ) {
                        pointer2 = tempEnd;
                    } 
                    // case where s1 -- s2 -- e2 -- e1
                }
            }
            res.send(availableTimes)
        })
    })

}