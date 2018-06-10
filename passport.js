const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { JWT_SECRET } = require("./config/authConfig");
const { User } = require("./models/schema");

// const opts = {
// jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
// secretOrKey = 'secret',
// issuer = 'accounts.examplesoft.com',
// audience = 'yoursite.net'
// };

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payLoad, done) => {
      try {
        console.log([payLoad]);
        const user = await User.query().findById(payLoad.sub);
        if (!user) {
          return don(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
