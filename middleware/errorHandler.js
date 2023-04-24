const { serverErrorResponse } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverErrorResponse
        : message,
    });
};

module.exports = errorHandler;
