const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unauthrized-err');
const { DEV_JWT_SECRET } = require('../utils/config');
const { unauthrizedResponse } = require('../utils/responses');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnathorizedError(unauthrizedResponse);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET);
  } catch (err) {
    throw new UnathorizedError(unauthrizedResponse);
  }
  req.user = payload;
  next();
};
