const express = require('express');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { validateObjectId, validateCreateArticle } = require('../middleware/validation');

const articlesRouter = express.Router();

articlesRouter.get('/', getArticles);

articlesRouter.post('/', validateCreateArticle, createArticle);

articlesRouter.delete('/:_id', validateObjectId, deleteArticle);

module.exports = articlesRouter;
