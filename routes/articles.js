const express = require('express');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

const articlesRouter = express.Router();

articlesRouter.get('/articles', getArticles);

articlesRouter.post('/articles', createArticle);

articlesRouter.delete('/articles/_id', deleteArticle);