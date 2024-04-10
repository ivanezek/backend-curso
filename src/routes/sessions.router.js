const Router = require('express').Router;
const UserManager = require('../managers/userManager');
const sessionRouter = Router();
let userManager = new UserManager();



sessionRouter.get('/', async (req, res) => {
    try {
        const users = await userManager.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

sessionRouter.post('/register', async (req, res) => {

    const { username, email, password, role } = req.body;

    try {

        if (!username || !email || !password || !role) {
            res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }
        const existeMail = await userManager.getUserByFilter({ email });
        if (existeMail){
            console.log('El email ya está registrado.')
            return res.status(400).json({ error: 'El email ya está registrado.' });
        }

        const newUser = await userManager.addUser(username, email, password, role);
        req.session.user = newUser;
        console.log('Usuario registrado', newUser);
        res.status(201).json('Usuario registrado');
    } catch (error) {
        return res.redirect("/register?error=registerError");
    }
});


sessionRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect("/login?error=missingFields");
    }
    try {
        const user = await userManager.getUserByFilter({ username, password });
        if (user) {
            req.session.user = user;
            console.log('Usuario logueado', user);
            res.status(200).json({ message: 'Usuario logueado' });
        }
    } catch (error) {
        console.error('Error al loguear usuario:', error);
        res.status(500).json({ error: 'Error al loguear usuario.' });
    }
});
sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            res.status(500).send('Error al cerrar sesión.');
        } else {
            res.redirect('/login'); // Redirigir a la página de inicio de sesión
        }
    });
});

module.exports = sessionRouter;