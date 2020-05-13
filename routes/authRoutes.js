
const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google',
        passport.authenticate('google', {
            accessType: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/calendar.readonly', 'profile', 'email']
        }
        )
    );
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        console.log("called callback");
        res.redirect('http://localhost:3000/dashboard');
    })
    app.get('/api/currentUser', (req, res) => {
        console.log(req.user);
        res.send(req.user);
    })
}