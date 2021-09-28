var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
var callbackURL = '/auth/google/callback'

const mongoose = require('mongoose')
const User = mongoose.model('user');
const Event = mongoose.model('event');
const Analytics = mongoose.model('analytics');
const helperFunctions = require('./calendarHelperFunctions');
passport.serializeUser((user, done) => {
    //console.log(user);
    done(null, user);
})

// want to minimize calls to the db so will not store the user in req.user
passport.deserializeUser(async (id, done) => {
    console.log("deserializing user");
    done(null, id);
    // console.log("called deserialize user");
    // var email = id.profile._json.email;
    // if(email) {
    //     var response = await User.find({email});
    //     if(response) {
    //         done(null, response);
    //     } else {
    //         console.log("couldnt find user");
    //         done(null, id);
    //     }
    // }
})

// need to fill in
passport.use(new GoogleStrategy({
    clientID: keys.googleClientId,
    clientSecret: keys.googleClientSecret,
    callbackURL: callbackURL,
    proxy: true,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    console.log("done");
    const fullName = profile.name.givenName + " " + profile.name.familyName;
    // this could create a bug not sure
    const email = profile.emails[0].value
    var existingSyncToken = '';
    // check if user with email exists, if not create a new user
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
        console.log("no user of this type yet. Creating new user")
        const newUser = new User({
            email: email,
            name: fullName,
            friends: [],
            busyTimes: [],
            syncToken: ''
        })
        const savingResponse = await newUser.save();
        if (savingResponse) {
            console.log("New User successfully created");
        }
    } else {
        existingSyncToken = existingUser.syncToken;
    }
    const existingAnalytics = await Analytics.findOne({ email });
    if (!existingAnalytics) {
        const newAnalytics = new Analytics({
            email,
            rawFilterTagData: [],
            rawPickedFriendsData: []
        });
        newAnalytics.save();
    }
    // load balance
    var maxUpdates = 0;
    // sanity check for out of bounds
    var numLoops = 0;
    //next part of code syncs events
    if (req.query.state !== "nosync") {

        var obj = await helperFunctions.buildAuthClient(accessToken, refreshToken);
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        // iterate until you get a synctoken
        var currentSyncToken = '';
        var currentPageToken = '';
        while (!currentSyncToken && numLoops < 50) {
            numLoops += 1;
            const response = await helperFunctions.getAllEventsTest(calendar, oauth2Client, email, existingSyncToken, currentPageToken);
            if (response.error) {
                console.log("error getting events with sync token");
                currentSyncToken = "finished";
            } else {
                console.log("updating db for specific page/sync token")
                if (maxUpdates <= 100) {
                    var addedAndUpdatedEvents = response.addedAndUpdatedList;
                    var deletedEvents = response.deletedList;
                    var syncToken = response.syncToken;
                    var pageToken = response.pageToken;

                    // deal with updates/new events
                    var updatedAddedIdList = addedAndUpdatedEvents.map((event) => { return event.id });
                    const deleteResponse = await Event.deleteMany({ id: { $in: updatedAddedIdList } });
                    maxUpdates += addedAndUpdatedEvents.length;
                    const eventObjects = addedAndUpdatedEvents.map((event) => {
                        return new Event({
                            summary: event.summary,
                            start: event.start,
                            end: event.end,
                            description: event.description,
                            creator: event.creator,
                            owner: email,
                            permissions: 'public',
                            tag: 'default',
                            id: event.id
                        })
                    })
                    await Event.insertMany(eventObjects);

                    // logic for deletes
                    var deletedIdList = deletedEvents.map((event) => { return event.id });
                    await Event.deleteMany({ id: { $in: deletedIdList } });
                } else {
                    console.log("reached max updates of 100 at a time")
                }
                // moment you get a valid sync token without a page token you are done
                if (syncToken) {
                    await User.findOneAndUpdate({ email: email }, { $set: { "syncToken": syncToken } });
                    currentSyncToken = syncToken;
                }
                // if you still have a page token, lets update this variable, we'll loop again
                if (pageToken) {
                    currentPageToken = pageToken;
                } 
            }
        }
        done(null, { accessToken, refreshToken, profile })
        //});
    } else {
        done(null, { accessToken, refreshToken, profile });
    }
}))
