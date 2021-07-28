const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    function findUser(username, callback){
        DB.collection("users").findOne({"username": username}, function(err, doc){
            callback(err, doc);
        })
    }

    function findUserById(id, callback){
        const objectId = require("mongodb").ObjectId;
        DB.collection("users").findOne({"_id": objectId(id)}, function(err, doc){
            callback(err, doc);
        })
    }

    passport.serializeUser(function(user, done){
        done(null,user._id);
    });

    passport.deserializeUser(function(id, done){
        findUserById(id, function(err,user){
            done(err, user);
        });
    });

    const strategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        findUser(username, (err, user) => {
            if (err)
                return done(err);

            if (!user)
                return done(null, false);

            bcrypt.compare(password, user.password, (err, sucess) => {
                if (err)
                    return done(err);

                if (!sucess)
                    return done(null, false);

                return done(null, user);
            })
        });
    });

    passport.use(strategy);
}