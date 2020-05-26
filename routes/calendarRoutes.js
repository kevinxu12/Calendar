
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
        var email = req.user.profile._json.email 
        //var email = req.user[0].email; 
        //var email = 'xukevinwork@gmail.com'
        var response = req.session[req.body.startdate];
        if (!response) {
            console.log("not cached, fetching from mongo db");
            response = await Event.find({ owner: email, start: { $lt: enddate }, end: { $gt: startdate } });
            req.session[req.body.startdate] = response;
        } else {
            console.log("cached already, fetching from cache");
        }


        const editedResponse = response.map((event) => {
            if (event.start < startdate) {
                event.start = startdate;
            }
            if (event.end > enddate) {
                event.end = enddate;
            }
            return event;
        })
        res.send(editedResponse);
    })


    // event for updating an existing calendar event
    app.post('/api/updateEvent', async (req, res) => {
        console.log("called update event");
        var calendarId = req.body.calendarId;
        var updateJSON = req.body.updateObject;
        var startdate = req.body.startdate;
        // part 1 is updating mongo
        const response = await Event.updateOne({ id: calendarId }, { $set: updateJSON });
        // reset cache
        req.session[startdate] = null
        // part 2 is updating google calendar. use patch

        res.end();
    })

    // take advantage of mongo smart search for Events
    app.post('/api/smartSearch', async (req, res) => {
        var testBody = req.body.searchString;
        var startdate = new Date(req.body.startdate);
        var enddate = new Date(req.body.startdate);
        enddate.setDate(enddate.getDate() + 1);
        var email = req.user.profile._json.email
        //var email = req.user[0].email;
        const response = await Event.find({ owner: email, start: { $lt: enddate }, end: { $gt: startdate }, $text: { $search: testBody } });
        res.send(response);
    });

    // going to need a new helper function

    function filterUnavailableTimes() {
        // step 1 is to get all unavailable hours. It's going to come in as a date. But extract UTC hours and increment from where we are currently 
        // step 2 for the entire week, let's convert these hours into UTC
        // lets return all the events and add back into the response
        // step 4: add a potential filter if say its unavailbility by work or something
    }
    // require a query 
    // ?range=week
    // ?timezone=en-us
    //body = {email: [listofemails]}
    app.post('/api/getAvailableTimes', async (req, res) => {
         console.log('called get available times');
        // res.end();
        // in the future, we will have filters for buffer room
        var emailList = req.body.email;
        var range = req.query.range;
        var timezone = req.query.timezone
        var latestStartDate = new Date();
        if (range === "week") {
            latestStartDate.setDate(latestStartDate.getDate() + 7);
        }
        var changes = 0;
        var dateOption = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit'};
        Event.find({ owner: { $in: emailList }, start: { $lt: latestStartDate }, end: { $gt: new Date()} }, function (err, response) {
            // first we sort reponse by date
            response = response.sort(function (a, b) { if ((a.start - b.start) > 0) { return 1 } else { return -1 } })
            // now we run our algorithm
            var availableTimes = [];
            // we will keep track of two pointers. the first pointer marks the start of the working free period
            // the second keeps track of the end
            // testing purposes
            var pointer1 = new Date();
            var pointer2 = new Date();
            for (var i = 0; i < response.length; i++) {
                var tempStart = response[i].start;
                var tempEnd = response[i].end;
                // case in which s1 --- e1 (leeway) s2 ---e2
                if (tempStart > pointer2) {
                    console.log("called");
                    // add some logic involving when everyone is busy
                    // pointer 2 --- tempstart 
                    // c1) if a start < tempStart but an end > tempStart, set pointer2Date to be the start
                    // c1 if a start < pointer2 but end > pointer22 set pointer1date to be end
                    // if a start and end encompasses don't include this
                     const pointer1Date = new Date(pointer2)
                    const pointer2Date = new Date(tempStart)
                    availableTimes.push([pointer1Date, pointer2Date]);
                    changes = changes + 1;
                    pointer1 = tempStart;
                    pointer2 = tempEnd;
                } else {
                    // case where s1 --- s2 -- e1 -- e2
                    if (tempStart > pointer1) {
                        pointer2 = tempEnd;
                    }
                    // case where s1 -- s2 -- e2 -- e1
                }
            }

            const pointer1Date = new Date(pointer2);
            const pointer2Date = new Date(latestStartDate);
            availableTimes.push([pointer1Date, pointer2Date])
            console.log(availableTimes);
            res.send(availableTimes)
        })
    })

}