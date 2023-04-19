const express = require('express');
const { getUserMe } = require('../controllers/users');

const usersRouter = express.Router();

usersRouter.get('/users/me', getUserMe);

module.exports = usersRouter;
