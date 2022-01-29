const passport = require("passport");
const LocalStrategy = require("passport-local");
const connection = require("./database");
const { validatePassword } = require("../lib/passwordUtils");
const User = require("./schemas");

function verifyCallback(username, password, done) {
  User.findOne({ username: username })
    .then((user) => {
      if (!user) return done(null, false); //done(error, user)
      const isValid = validatePassword(password, user.hash, user.salt);
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
}

/**
 *--------------PASSPORT CONFIG-------------------
 enter the passport authentication strategy and 
 the verify callback 
 */
passport.use(new LocalStrategy(verifyCallback));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
