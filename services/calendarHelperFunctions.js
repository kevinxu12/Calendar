const { google } = require('googleapis');
const keys = require('../config/keys');
module.exports = {
    buildAuthClient: async function buildAuthClient(req) {
        var user = req.session.passport.user;
        console.log("building auth client helper function called");
        const accessToken = user.accessToken;
        const refreshToken = user.refreshToken;
        var callbackURL = '/auth/google/callback'
        var oauth2Client = new google.auth.OAuth2(
            keys.googleClientId,
            keys.clientSecret,
            callbackURL
        );

        oauth2Client.credentials = {
            access_token: accessToken,
            refresh_token: refreshToken
        };

        var calendar = await google.calendar('v3');
        return {calendar, oauth2Client};
    },

    getAllEvents: function getAllEvents(calendar, oauth2Client, callback) {
        console.log("getting all events helper function called");
        calendar.events.list({
            auth: oauth2Client,
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime'
        }, function (err, response) {
            const data = response.data.items
            // standardized to PST
            const calendarList = data.map((entry) => {
                const summary = entry.summary;
                const start = entry.start.dateTime;
                const end = entry.end.dateTime;
                const description = entry.description;
                const creator = entry.creator.email;
                return {
                    summary,
                    start,
                    end,
                    description,
                    creator
                }
            })
            callback(calendarList);
        })
    }
}
