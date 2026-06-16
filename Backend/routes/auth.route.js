import express from 'express';
import { login, logOut, signUp, updatePassword } from '../controllers/auth.controller.js';
import { isAuth } from '../middleware/isAuth.js'; // Ensure the import path matches your directory setup

const authRouter = express.Router();

// Authentication Routes
authRouter.post('/signup', signUp);
authRouter.get('/signup', (req, res) => {
   res.send('Signup route is working');
});

authRouter.post('/login', login);
authRouter.get('/login', (req, res) => {
   res.send('Login route is working');
});

authRouter.post('/logout', logOut);

// Protected Password Management Route
// This matches your frontend request to: `${serverUrl}/api/auth/update-password`
authRouter.put('/update-password', isAuth, updatePassword);

// authRouter.post('/delete', deleteOperation);

export default authRouter;