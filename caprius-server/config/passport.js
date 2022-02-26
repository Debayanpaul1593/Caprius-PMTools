const passport = require("passport");
const LocalStrategy = require("passport-local");
const connection = require("./database");
const { validatePassword } = require("../lib/passwordUtils");
const {User} = require("./schemas");
const path = require('path');
const fs = require('fs');

//jwt strategy
const JwtStrategy  = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pathToKey = path.join(__dirname, '../cryptography', 'id_rsa_pub.pem');
//console.log('path', pathToKey);
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
//console.log(PUB_KEY);
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms:['RS256']
};


function verifyCallback1(jwt_payload, done){
  User.findOne({id: jwt_payload.sub}, function(err, user){
    if(err) return done(err, false);
    if(user) return done(null, user)
    else{
      return done(null, false);
    }
  })
}

passport.use(new JwtStrategy(options, verifyCallback1));


/**
 * local strategy -->
  * */


  /*function verifyCallback(username, password, done) {
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
}*/

/**
 *--------------PASSPORT CONFIG-------------------
 enter the passport authentication strategy and 
 the verify callback 
 */
//passport.use(new LocalStrategy(verifyCallback));

/**
 * will attach passport: { user: [user.id]} to session object
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});


/**
 * will check for a user based on session userId and
 * return user object on accessing session.user
 */
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
