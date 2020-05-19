var helperFunctions = require('../services/calendarHelperFunctions');
module.exports = (app, myCache) => {
    app.get('/api/getAllCalendars', async (req, res) => {
        console.log("called show all calendars");
        var user = req.session.passport.user;
        var obj = myCache.get('oauthclient-calendar');
        if (!obj) {
            console.log("non existant cache");
            obj = await helperFunctions.buildAuthClient(user.accessToken, user.refreshToken);
            myCache.set('oauthclient-calendar', obj, 100000);
        }
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        calendar.calendarList.list({ auth: oauth2Client }, function (err, response) {
            res.send(response.data.items);
        })
    })

    app.get('/api/getAllEvents', async (req, res) => {
        console.log("called get all events");
        var user = req.session.passport.user;
        var obj = myCache.get('oauthclient-calendar');
        if (!obj) {
            console.log("non existant cache");
            obj = await helperFunctions.buildAuthClient(user.accessToken, user.refreshToken);
            const value = myCache.set('oauthclient-calendar', obj, 100000);
        }
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        helperFunctions.getAllEvents(calendar, oauth2Client, function (events) {
            res.send(events);
        })
    })

    app.get('/api/test', async (req, res) => {
        res.send(req.user);
    })
}