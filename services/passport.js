var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
var callbackURL = '/auth/google/callback'

const mongoose = require('mongoose')
const User = mongoose.model('user');
const Event = mongoose.model('event');
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
    //next part of code syncs events
    if (req.query.state !== "nosync") {
        // another form of logic is deleting everyting and re-entering
        //known bug large amounts of changes will trigger a pageToken that will fail

        var obj = await helperFunctions.buildAuthClient(accessToken, refreshToken);
        var calendar = obj.calendar;
        var oauth2Client = obj.oauth2Client;
        helperFunctions.getAllEventsTest(calendar, oauth2Client, async function (addedAndUpdatedEvents, deletedEvents, syncToken) {
            if(syncToken) { 
                const syncResponse = await User.findOneAndUpdate({email: email}, {$set: {"syncToken": syncToken}});
            }
            // logic for updates and adding 
            // deals with updates
            var updatedAddedIdList = addedAndUpdatedEvents.map((event) => { return event.id});
            Event.deleteMany({id: {$in: updatedAddedIdList} });
            const eventObjects = addedAndUpdatedEvents.map((event) => {
                return new Event({
                    summary: event.summary,
                    start: event.start,
                    end: event.end,
                    description: event.description,
                    creator: event.creator,
                    owner: email,
                    permissions: 'public',
                    tag: 'Default',
                    id: event.id
                })
            })
            const eventResponse = await Event.insertMany(eventObjects);
            console.log(eventResponse);

            // logic for deletes
            var deletedIdList = deletedEvents.map((event) => { return event.id});
            const deleteResponse = await Event.deleteMany({id: {$in: deletedIdList}});
            console.log(deleteResponse);


            done(null, { accessToken, refreshToken, profile })
        }, email, existingSyncToken);
    } else {
        done(null, { accessToken, refreshToken, profile }); 
    }
}))
