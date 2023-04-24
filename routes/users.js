const express = require('express');
const { getUserMe } = require('../controllers/users');

const usersRouter = express.Router();

usersRouter.get('/me', getUserMe);

module.exports = usersRouter;
