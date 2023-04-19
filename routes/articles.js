const express = require('express');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

const articlesRouter = express.Router();

articlesRouter.get('/', getArticles);

articlesRouter.post('/', createArticle);

articlesRouter.delete('/:_id', deleteArticle);

module.exports = articlesRouter;