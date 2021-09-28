var helperFunctions = require('../services/calendarHelperFunctions');
const mongoose = require('mongoose');
const Event = mongoose.model('event');
module.exports = (app) => {
    app.get('/api/getAllCalendars', async (req, res) => {
        console.log("called show all calendars");
        var user = req.session.passport.user;
        var obj = await helperFunctions.buildAuthClient(user.accessToken, user.refreshToken);
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        calendar.calendarList.list({ auth: oauth2Client }, function (err, response) {
            console.log(req.session.passport);
            res.send(response.data.items);
        })
    })
    // for some reason can only call this once
    app.get('/api/getAllEvents', async (req, res) => {
        console.log("called get all events");
        var user = req.session.passport.user;
        var obj = await helperFunctions.buildAuthClient(user.accessToken, user.refreshToken);
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        helperFunctions.getAllEvents(calendar, oauth2Client, function (events, nextSyncToken) {
            res.send(events);
        })
    })

    app.get('/api/test', async (req, res) => {
        //await Event.deleteMany({owner: 'xukevinwork@gmail.com', summary: 'PFYD Board'});
        // var maxDate = new Date();
        // maxDate.setDate(maxDate.getDate() + 7);
        // console.log(maxDate.toISOString());
        // console.log(new Date().toISOString());
        // res.send({test: maxDate.toISOString(), test2: new Date().toISOString()});

        // test filter function
       res.end();

    })

    app.post('/api/addNewEvent', async (req, res) => {
        console.log("adding new event");
        const body = req.body;
        //console.log(req.body);
        var user = req.session.passport.user;
        var obj = await helperFunctions.buildAuthClient(user.accessToken, user.refreshToken);
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        var email = req.user.profile._json.email
        var start = new Date(body.start);
        var end = new Date(body.end);
        var startString = start.toISOString();
        var endString = end.toISOString();
        var timeZone = body.timezone;
        //var attendees = body.attendees.map((event) => { return { email: event.email}})
        var event = {
            start: {
                dateTime: startString,
                timeZone: timeZone
            },
            end: {
                dateTime: endString,
                timeZone: timeZone
            },
            summary: body.title,
            description: body.textEditorValue

        }
        // update to calendar
        calendar.events.insert({ auth: oauth2Client, calendarId: email, resource: event }, async (err, response) => {
            console.log(err);
            console.log(response);
            if (response) {
                const newEvent = new Event({
                    permissions: body.permission || 'public',
                    summary: body.title,
                    start: start,
                    end: end,
                    description: body.textEditorValue,
                    creator: email,
                    owner: email,
                    tag: body.tag || 'default',
                    id: response.data.id
                });
                const saveResponse = await newEvent.save();
                res.send(saveResponse);
            }

        });
    })
}