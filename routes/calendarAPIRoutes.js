var helperFunctions = require('../services/calendarHelperFunctions');
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
        res.send(new Date());
    })
}