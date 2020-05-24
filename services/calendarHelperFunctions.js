const { google } = require('googleapis');
const keys = require('../config/keys');
module.exports = {
    buildAuthClient: async function buildAuthClient(access, refresh) {
        console.log("building auth client helper function called");
        const accessToken = access;
        const refreshToken = refresh;
        var callbackURL = '/auth/google/callback'
        var oauth2Client = new google.auth.OAuth2(
            keys.googleClientId,
            keys.googleClientSecret,
            callbackURL
        );

        oauth2Client.credentials = {
            access_token: accessToken,
            refresh_token: refreshToken
        };

        var calendar = await google.calendar('v3');
        return {calendar, oauth2Client};
    },

    getAllEvents: function getAllEvents(calendar, oauth2Client, callback, calendarId) {
        console.log("getting all events helper function called");
        console.log((new Date()).toISOString());
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
                const id = entry.id;
                return {
                    summary,
                    start,
                    end,
                    description,
                    creator,
                    id
                }
            })
            callback(calendarList);
        })
    }
}
