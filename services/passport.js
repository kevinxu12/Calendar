var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
var callbackURL = '/auth/google/callback'
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
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    console.log("done");
    done(null, {accessToken, refreshToken, profile});
}));
