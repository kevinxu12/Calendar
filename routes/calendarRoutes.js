
var helperFunctions = require('../services/calendarHelperFunctions');
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

}