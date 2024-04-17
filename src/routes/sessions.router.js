const Router = require('express').Router;
const { session } = require('passport');
const UserManager = require('../managers/userManager');
const sessionRouter = Router();
const passport = require('passport');
let userManager = new UserManager();



sessionRouter.get('/', async (req, res) => {
    try {
        const users = await userManager.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// REGISTER

// Registro
sessionRouter.get("/registerError", (req, res) => {
    res.redirect("/register?message=Error en registro");
  });
  
  sessionRouter.post(
    "/register",
    passport.authenticate("register", {
      failureRedirect: "/api/sessions/registerError",
    }),
    async (req, res) => {
      return res.redirect("/register?message=¡Registro correcto!");
    }
  );
  
  // Login normal
  sessionRouter.get("/loginError", (req, res) => {
    res.redirect("/login?error=Error en login");
  });
  
  sessionRouter.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/loginError",}), (req, res) => {
    return res.redirect("/products");
  });

  // github

  sessionRouter.get("/github", passport.authenticate("githubLogin", {}), (req, res)=>{

  });

  sessionRouter.get("/githubError", (req, res) => {
   res.setHeader("Content-Type", "application/json");
   return res.status(500).json({
    error: "Error en servidor",
    detalle: "Error en login con Github"
   })
  });

  sessionRouter.get("/githubCallback", passport.authenticate("githubLogin", {failureRedirect:"api/sessions/githubError"}), (req, res) => {
    req.session.user = req.user;
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({payload: "Login successful", user: req.user});
  });


// sessionRouter.post('/register', async (req, res) => {

//     const { username, email, password, role } = req.body;

//     try {

//         if (!username || !email || !password || !role) {
//             res.status(400).json({ error: 'Faltan campos obligatorios.' });
//         }
//         const existeMail = await userManager.getUserByFilter({ email });
//         if (existeMail){
//             console.log('El email ya está registrado.')
//             return res.status(400).json({ error: 'El email ya está registrado.' });
//         }

//         const newUser = await userManager.addUser(username, email, password, role);
//         req.session.user = newUser;
//         console.log('Usuario registrado', newUser);
//         res.status(201).json('Usuario registrado');
//     } catch (error) {
//         return res.redirect("/register?error=registerError");
//     }
// });

// login



// sessionRouter.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         if (req.headers['content-type'] === 'application/json') {
//             return res.status(400).json({ error: 'Missing fields' });
//         } else {
//             return res.redirect("/login?error=missingFields");
//         }
//     }

//     try {
//         const user = await userManager.authenticateUser(username, password);
//         req.session.user = user;
//         if (req.headers['content-type'] === 'application/json') {
//             return res.status(200).json({ message: 'Login successful' });
//         } else {
//             return res.redirect("/products");
//         }
//     } catch (error) {
//         if (req.headers['content-type'] === 'application/json') {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         } else {
//             return res.redirect("/login?error=invalidCredentials");
//         }
//     }
// });

// LOGOUT
sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            res.status(500).send('Error al cerrar sesión.');
        } else {
            res.redirect('/login'); 
        }
    });
});


module.exports = sessionRouter;