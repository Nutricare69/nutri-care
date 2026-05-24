
import express from 'express';

import {login, logOut, signUp } from '../controllers/auth.controller.js';


const authRouter = express.Router();

authRouter.post('/signup',signUp);


authRouter.get('/signup', (req, res) => {
   res.send('Signup route is working');
});

authRouter.post('/login',login);

authRouter.get('/login', (req, res) => {
   res.send('Login route is working');
});

authRouter.post('/logout',logOut);

// authRouter.post('/delete',deleteOperation);

export default authRouter;

