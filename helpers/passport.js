const LocalStrategy = require('passport-local').Strategy;
const User = require('../rpc/models/User');

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
                else return done(null, false, {messages: 'invalid Password'});
            });
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
            done(err, user);
        });
    });
};
