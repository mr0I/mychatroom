const LocalStrategy = require('passport-local').Strategy;
const User = require('../rpc/models/User');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '533264578272-2m0m87di7ds55bqmq5ifv5h9g312s7p3.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';


module.exports =  (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },function (username, password, done) {
        User.getUserByEmail(username, function (err, user) {
            if (err) throw err;
            if (!user) return done(null, false, {messages: 'unknown user'});

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) return done(err);
                if (isMatch) return done(null, user);
                else return done(null, false, null);
            });
        });
    }));

    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://127.0.0.1:8080/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            userProfile=profile;
            return done(null, userProfile);
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
            done(err, user);
        });
    });
};
