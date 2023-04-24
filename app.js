require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const appRouter = require('./routes');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middleware/errorHandler');
const { DATA_BASE_ADDRESS } = require('./utils/config');
const { notFoundResponse } = require('./utils/responses');
const limiter = require('./middleware/rateLimiter');

const app = express();

const { PORT = 3001 } = process.env;

app.use(helmet());
const jsonParser = bodyParser.json();

mongoose.connect(DATA_BASE_ADDRESS);

app.use(cors());
app.options('*', cors());
app.use(jsonParser);
app.use(requestLogger);
app.use(limiter);
app.use(appRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
