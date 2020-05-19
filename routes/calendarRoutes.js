
const mongoose = require('mongoose');
const Event = mongoose.model('event');
module.exports = (app) => {

    // requires {date: date object}
    // takes email from session
    // still in testing
    app.post('/api/getAllEventsForDate', async (req, res) => {
        console.log("calling get all events for date");
        var startdate = new Date(req.body.startdate);
        var enddate = new Date(req.body.startdate);
        enddate.setDate(enddate.getDate() + 1);
        var email = req.user.profile.emails[0].value;
        //var email = 'xukevinwork@gmail.com'
        Event.find({owner: email, start: {$lt: enddate}, end: {$gt: startdate}}, function (err, response) {
            if(err) {
                res.end();
            }
            if(response) {
                const editedResponse = response.map((event) => {
                    if(event.start < startdate) {
                        event.start = startdate;
                    }
                    if(event.end > enddate) {
                        event.end = enddate;
                    }
                    return event;
                })
                res.send(editedResponse);
            }
        })
    })

    // event for updating an existing calendar event
    app.post('/api/updateEvent', async (req, res) => {
        var calendarId = req.body.calendarId;
        var updateJSON = req.body.updateObject;
        // part 1 is updating mongo
        const response = await Event.update({id: calendarId}, { $set: updateJSON});
        console.log(response);
        // part 2 is updating google calendar. use patch

        res.end();
    })

    // take advantage of mongo smart search for Events
    app.post('/api/smartSearch', async (req, res) => {
        var testBody = req.body.searchString;
        var startdate = new Date(req.body.startdate);
        var enddate = new Date(req.body.startdate);
        enddate.setDate(enddate.getDate() + 1);
        var email = req.user.profile.emails[0].value;
        const response = await Event.find({owner: email, start: {$lt: enddate}, end: {$gt: startdate}, $text: {$search: testBody}});
        res.send(response);
    }); 

    
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
        var latestStartDate = new Date();
        if(range === "week") {
            latestStartDate.setDate(latestStartDate.getDate() + 7);
        }
        var changes = 0;
        Event.find({owner: {"$in": emailList}, start: { $lt: latestStartDate} }, function(err, response) {
            // first we sort reponse by date
            response = response.sort(function(a,b) { if((a.start - b.start) > 0) { return 1} else {return -1} })
            // now we run our algorithm
            var availableTimes = [];
            // we will keep track of two pointers. the first pointer marks the start of the working free period
            // the second keeps track of the end
            // testing purposes
            var pointer1 = new Date();
            var pointer2 = new Date();
            for(var i = 0; i < response.length; i ++) {
                var tempStart = response[i].start;
                var tempEnd = response[i].end;
                // case in which s1 --- e1 (leeway) s2 ---e2
                if(tempStart > pointer2) {
                    console.log("called");
                    const pointer1Date = new Date(pointer2).toLocaleString(timezone);
                    const pointer2Date = new Date(tempStart).toLocaleString(timezone);
                    availableTimes.push([pointer1Date, pointer2Date]);
                    changes = changes + 1;
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
            if(changes === 0) {
                const pointer1Date = new Date(pointer1).toLocaleString(timezone);
                const pointer2Date = new Date(latestStartDate).toLocaleString(timezone);
                availableTimes.push([pointer1Date, pointer2Date])
            }
            res.send(availableTimes)
        })
    })

}