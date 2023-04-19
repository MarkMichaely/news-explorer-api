const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const { NODE_ENV, JWT_SECRET } = process.env;

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('No user found');
    })
    .then((user) => {
      res.send({ email: user.email, name: user.name })
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Invalid user id'));
      else next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new Error('conflict error');
        err.statusCode = 409;
        throw err;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(201).send({ name, email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError('wrong data for user'));
      else next(err);
    });
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports = { getUserMe, login, createUser };