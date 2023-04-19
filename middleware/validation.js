const { Joi, celebrate, Segments } = require('celebrate');
const { isObjectIdOrHexString } = require('mongoose');
const isURL = require('validator/lib/isURL');

const validateURL = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateMongooseObjectId = (value, helpers) => {
  if (isObjectIdOrHexString(value)) {
    return value;
  }
  return helpers.error('string.uri');
};
const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});
const validateObjectId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    _id: Joi.string().custom(validateMongooseObjectId),
  }),
});

const validateCreateArticle = celebrate({
  [Segments.BODY]: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL),
  }),
});

module.exports = {
  validateLogin,
  validateSignup,
  validateCreateArticle,
  validateObjectId,

};
