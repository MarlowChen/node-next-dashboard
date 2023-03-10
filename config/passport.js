const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

// load up the user model


module.exports = function (passport, db, config) {
  const User = db.User;
  const IndependentCredentials = db.IndependentCredentials;
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey:  process.env.PROJECT_SECRET,
  };
  passport.use('jwt', new JwtStrategy(opts, function (jwt_payload, done) {
    User
      .findByPk(jwt_payload.id)
      .then((user) => { return done(null, user); })
      .catch((error) => { return done(error, false); });
  }));

  if (!config || (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET)) {
    const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = config.GOOGLE_CLIENT_SECRET;

    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: "/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
        
          done(null, profile, accessToken);
        }
      )
    );

  }


  if (!config || (config.FACEBOOK_APP_ID && config.FACEBOOK_APP_SECRET)) {

    const FACEBOOK_APP_ID = config.FACEBOOK_APP_ID;
    const FACEBOOK_APP_SECRET = config.FACEBOOK_APP_SECRET;

    passport.use(
      new FacebookStrategy(
        {
          clientID: FACEBOOK_APP_ID,
          clientSecret: FACEBOOK_APP_SECRET,
          callbackURL: "/auth/facebook/callback",
        },
        function (accessToken, refreshToken, profile, done) {
          done(null, profile);
        }
      )
    );

  }


  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};