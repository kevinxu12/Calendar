var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
var callbackURL = '/auth/google/callback'


const mongoose = require('mongoose')
const User = mongoose.model('user');
const Event = mongoose.model('event');
const helperFunctions = require('./calendarHelperFunctions');
passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((id, done) => {
    done(null, id);
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

    // check if user with email exists, if not create a new user
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
        console.log("no user of this type yet. Creating new user")
        const newUser = new User({
            email: email,
            name: fullName,
            friends: []
        })
        const savingResponse = await newUser.save();
        if (savingResponse) {
            console.log("New User successfully created");
        }
    }

    console.log("user already exists");
    const deleteResponse = Event.deleteMany({ owner: email });
    console.log("wiped events");


    // next part of code syncs events
    var obj = await helperFunctions.buildAuthClient(req);
    var calendar = obj.calendar;
    var oauth2Client = obj.oauth2Client;
    helperFunctions.getAllEvents(calendar, oauth2Client, async function (events) {
        const eventObjects = events.map((event) => {
            return new Event({
                summary: event.summary,
                start: event.start,
                end: event.end,
                description: event.description,
                creator: event.creator,
                owner: email,
                permissions: 'public'
            })
        })
        const eventResponse = await Event.insertMany(eventObjects);
        if (eventResponse) {
            console.log("Added events for " + fullName);
        } else {
            console.log("Error adding events into db")
        }
        done(null, { accessToken, refreshToken, profile })
    })
}))
