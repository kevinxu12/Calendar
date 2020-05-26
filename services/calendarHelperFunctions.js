const { google } = require('googleapis');
const keys = require('../config/keys');
var callbackURL = '/auth/google/callback'
var oauth2Client = new google.auth.OAuth2(
    keys.googleClientId,
    keys.googleClientSecret,
    callbackURL
);

module.exports = {
    
    buildAuthClient: async function buildAuthClient(access, refresh) {
        console.log("building auth client helper function called");
        const accessToken = access;
        const refreshToken = refresh;
        oauth2Client.credentials = {
            access_token: accessToken,
            refresh_token: refreshToken
        };

        var calendar = await google.calendar('v3');
        return { calendar, oauth2Client };
    },

    getAllEvents: function getAllEvents(calendar, oauth2Client, callback, calendarId) {
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
    },
    
    // also returns the sync token
    getAllEventsTest: function getAllEventsTest(calendar, oauth2Client, callback, calendarId, existingSyncToken) {
        console.log("getting all events helper function called");
        var paramsObj = {
            auth: oauth2Client,
            calendarId: calendarId || 'primary',
            //timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true
        }
        if (existingSyncToken) {
            paramsObj['syncToken'] = existingSyncToken;
        }
        calendar.events.list(
            paramsObj,
            function (err, response) {
                var data = response.data.items
                const syncToken = response.data.nextSyncToken;
                // standardized to PST
                var deletedList = []
                var addedAndUpdatedList = [];
                data.forEach((entry) => {
                    if (entry.status === "cancelled") {
                        deletedList.push(entry);
                        // assume confirm means updated
                    } else if (entry.status === "confirmed") {
                        const summary = entry.summary;
                        const start = entry.start.dateTime;
                        const end = entry.end.dateTime;
                        const description = entry.description;
                        const creator = entry.creator.email;
                        const id = entry.id;
                        addedAndUpdatedList.push({
                            summary,
                            start,
                            end,
                            description,
                            creator,
                            id
                        });
                    } 
                })
                callback(addedAndUpdatedList, deletedList, syncToken);
            })
    }
}
