const express = require('express');
const { login, createUser } = require('../controllers/users');
const auth = require('../middleware/auth');
const { validateLogin, validateSignup } = require('../middleware/validation');

const appRouter = express.Router();
const articlesRouter = require('./articles');
const usersRouter = require('./users');

appRouter.post('/signin', validateLogin, login);
appRouter.post('/signup', validateSignup, createUser);

appRouter.use(auth);

appRouter.use('/users', usersRouter);
appRouter.use('/articles', articlesRouter);

module.exports = appRouter;
