const passport = require('passport');
const local = require('passport-local').Strategy;
const UserManager = require('../managers/userManager');
const bcrypt = require('bcrypt');

const userManager = new UserManager();

// REGISTER PASSPORT

const passportConfig = () => {
    passport.use('register', new local({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 
        async (req, username, password, done) => {
            try {
    
                // validacion de completitud de datos
                const { username, email, role } = req.body; 
                if (!username || !email || !role) {
                    return done(null, false, { message: 'Username, email and role are required' });
                }
                // validadion si existe el usuario
                let userExists = await userManager.getUserByFilter({ email });
                if (userExists) {
                    return done(null, false, { message: 'User already exists' });
                }
                password = await bcrypt.hash(password, 10);
                const user = await userManager.addUser(username, req.body.email, password, role);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    
    // login passport
    
    passport.use('login', new local({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            console.log('Contraseña recibida:', password);
            const user = await userManager.getUserByFilter({ username });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            console.log('Contraseña almacenada en la base de datos:', user.password);
            const validate = await bcrypt.compare(password, user.password);
            console.log('Contraseña válida:', validate);
            if (!validate) {
                return done(null, false, { message: 'Wrong password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    
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