
const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google',
        passport.authenticate('google', {
            accessType: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/calendar', 'profile', 'email']
        }
        )
    );
    app.get('/auth/google/nosync',
        passport.authenticate('google', {
            accessType: 'offline',
            prompt: 'consent',
            scope: ['https://www.googleapis.com/auth/calendar', 'profile', 'email'],
            state: 'nosync'
        }
        )
    );
    // (CHANGES NEEEDED) callback needs to be changed in production
    // use Process.ENV
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        console.log("called callback");
        if(process.env.NODE_ENV === "production") {
            res.redirect('/dashboard');
        }
        res.redirect('http://localhost:3000/dashboard');
    })
    app.get('/api/currentUser', (req, res) => {
        console.log(req.user);
        res.send(req.user);
    })

    app.get('/api/logout', (req, res) => {
        console.log("logging out");
        req.session = null;
        req.user = null;
        res.end();
    })
}