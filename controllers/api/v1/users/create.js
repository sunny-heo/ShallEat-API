// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const { User } = require("../../../../models/schema");
// const VALID_PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/i,
//   mismatchPassword = "Passwords do not match, please try again.",
//   invalidPassword =
//     "Password must include one lowercase character, one uppercase character, a number, and a special character.";

// const isValidPassword = password => VALID_PASSWORD_REGEX.test(password);

// const insertUser = (req, res) => {
//   const { pwMatch, ...validUser } = req.body;
//   bcrypt.hash(validUser.password, saltRounds, async (err, password) => {
//     try {
//       /* Update password with encryption before creating new user*/
//       validUser.password = password;

//       const user = await User.query().insert(validUser);

//       delete validUser.password;

//       req.login(user.id, () => res.json(validUser));
//     } catch (error) {
//       res.json(error);
//     }
//   });
// };

// module.exports = {
//   createUser(req, res) {
//     const { password, pwMatch } = req.body;

//     if (password !== pwMatch) res.json({ mismatchPassword });
//     else if (!isValidPassword(password)) res.json({ invalidPassword });
//     else insertUser(req, res);
//   }
// };
