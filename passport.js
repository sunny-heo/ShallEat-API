const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { JWT_SECRET } = require("./config/authConfig");
const { User } = require("./models/schema");

const cookieExtractor = req => {
  let token = null;
  // console.log(req.cookies);
  if (req && req.cookies) token = req.cookies["ShallEat"];
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET
    },
    async (payLoad, done) => {
      try {
        const user = await User.query().findById(payLoad.sub);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        const provider = { local: { email } };
        const user = await User.query().findOne({ provider });
        const isCorretPassword = user && (await user.isValidPassword(password));

        if (!isCorretPassword) {
          done(null, false, {
            message: "Either email or password is wrong."
          });
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
