const passport = require('passport');
const local = require('passport-local').Strategy;
const UserManager = require('../managers/userManager');
const bcrypt = require('bcrypt');

const userManager = new UserManager();

// REGISTER PASSPORT

const passportConfig = () => {
    passport.use(
        "register",
        new local.Strategy(
          {
            usernameField: "email",
            passReqToCallback: true,
          },
          async function (req, email, password, done) {
            try {
              const { username, role } = req.body;
    
              if (!username || !email || !password) {
                return done(null, false, { message: "Username, email, and password are required" });
              }
    
              const userExists = await userManager.getUserByFilter({ email });
              if (userExists) {
                return done(null, false, { message: "User already exists" });
              }
    
              const hashedPassword = await bcrypt.hash(password, 10);
              const newUser = await userManager.addUser(username, email, hashedPassword, role);
              return done(null, newUser);
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    
      //  Login
      passport.use(
        "login",
        new local.Strategy(
          {
            usernameField: "email",
            passReqToCallback: true,
          },
          async function (req, email, password, done) {
            try {
              const user = await userManager.getUserByFilter({ email });
              if (!user) {
                return done(null, false, { message: "User not found" });
              }
              
              const validate = await bcrypt.compare(password, user.password);
              console.log('validación de passwords: ', validate)
              console.log('password según DB: ', password)
              console.log('password según usuario: ', user.password)
              if (!validate) {
                return done(null, false, { message: "Wrong password" });
              }
    
              return done(null, user);
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userManager.getUserByFilter({ _id: id });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = passportConfig;