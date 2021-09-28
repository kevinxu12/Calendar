const { google } = require('googleapis');
const keys = require('../config/keys');
var callbackURL = '/auth/google/callback'
var oauth2Client = new google.auth.OAuth2(
    keys.googleClientId,
    keys.googleClientSecret,
    callbackURL
);
function monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}
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

    // syncs for the next week
    getAllEventsTest: async function getAllEventsTest(calendar, oauth2Client, calendarId, existingSyncToken, currentPageToken) {
        console.log("getting all events helper function called");
        var maxDate = new Date();
        var current = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        var paramsObj = {
            auth: oauth2Client,
            calendarId: calendarId || 'primary',
            maxResults: 10,
            singleEvents: true
        }
        console.log(existingSyncToken);
        console.log(currentPageToken);
        if (existingSyncToken) {
            paramsObj['syncToken'] = existingSyncToken;
        } else {
            paramsObj['timeMin'] = (new Date()).toISOString();
        }

        if (currentPageToken) {
            paramsObj['pageToken'] = currentPageToken;
        }


        try {
            const response = await calendar.events.list(
                paramsObj);
            // function (err, response) {
            var data = response.data.items
            const syncToken = response.data.nextSyncToken;
            const pageToken = response.data.nextPageToken;
            // standardized to PST
            var deletedList = []
            var addedAndUpdatedList = [];
            data.forEach((entry) => {
                console.log(entry);
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
                    if (monthDiff(new Date(start), current) <= 6) {
                        addedAndUpdatedList.push({
                            summary,
                            start,
                            end,
                            description,
                            creator,
                            id
                        });
                    }
                }
            })
            if (pageToken) {
                return { addedAndUpdatedList, deletedList, pageToken };
            } else {
                return { addedAndUpdatedList, deletedList, syncToken };
            }
            // in the case of a 410 error
        }
        catch (err) {
            console.log(err);
            return { error: "error" };
        }
        // })
    }
}
