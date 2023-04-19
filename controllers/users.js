const User = require('../models/user')

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('No user found');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Invalid user id'));
      else next(err);
    });
};

module.exports = { getUserMe };