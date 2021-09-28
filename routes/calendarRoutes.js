
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
            // req.session[req.body.startdate] = null;
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

}