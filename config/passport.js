// load all the things we need
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
// load up the user model
var User = require("../models/user");
var Chef = require("../models/chef");
// load the auth variables
var configAuth = require("./auth");

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(
    new FacebookStrategy(
      configAuth.facebookAuth,

      // facebook will send back the token and profile
      function(token, refreshToken, profile, done) {
        console.log(JSON.stringify(profile));
        // asynchronous
        process.nextTick(function() {
          // find the user in the database based on their facebook id
          User.findOne({ "facebook.id": profile.id }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) return done(err);

            // if the user is found, then log them in
            if (user) {
              return done(null, user); // user found, return that user
            } else {
              // if there is no user found with that facebook id, create them
              var newUser = new User();

              // set all of the facebook information in our user model
              newUser.facebook.id = profile.id; // set the users facebook id
              newUser.facebook.token = token; // we will save the token that facebook provides to the user
              newUser.facebook.name =
                profile.name.givenName + " " + profile.name.familyName; // look at the passport user profile to see how names are returned
              newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

              newUser.local.email = profile.emails[0].value;
              newUser.local.first_name = profile.name.givenName;
              newUser.local.last_name = profile.name.familyName;

              // save our user to the database
              newUser.save(function(err) {
                if (err) throw err;

                // if successful, return the new user
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({ "local.email": email }, function(err, user) {
            // if there are any errors, return the error
            if (err) return done(err);

            // check to see if theres already a user with that email
            if (user) {
              return done(null, false, { msg: "Email ingresado ya existe" });
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials
              newUser.local.email = email;
              newUser.local.first_name = req.body.first_name;
              newUser.local.last_name = req.body.last_name;
              newUser.local.password = newUser.generateHash(password);

              // save the user
              newUser.save(function(err) {
                if (err) throw err;

                var chef = new Chef({
                  user: newUser._id,
                  description: req.body.description,
                  phone: req.body.phone,
                  date_of_birth: req.body.date_of_birth
                });

                chef.save(err => {
                  if (err) throw err;
                  return done(null, newUser);
                });
              });
            }
          });
        });
      }
    )
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ "local.email": email }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err) return done(err);

          // if no user is found, return the message
          if (!user)
            return done(null, false, {
              msg: "Ooops! Email o contraseña incorrectos."
            });

          // if the user is found but the password is wrong
          if (!user.validPassword(password))
            return done(null, false, {
              msg: "Ooops! Email o contraseña incorrectos."
            });

          // all is well, return successful user
          return done(null, user);
        });
      }
    )
  );
};
