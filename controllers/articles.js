const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-err');
const {
  wrongDataResponseArticle,
  unauthrizedResponse,
  articleRemovedResponse,
  noArticleFoundResponse,
  invalidArticleIdResponse,
} = require('../utils/responses');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user })
    .then((article) => res.send(article))
    .catch((err) => {
      next(err);
    });
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(wrongDataResponseArticle));
      else next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { _id } = req.params;
  Article.findById(_id).select('+owner')
    .orFail(() => new NotFoundError(noArticleFoundResponse))
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        return next(new ForbiddenError(unauthrizedResponse));
      }
      return article.deleteOne()
        .then(() => res.send({ message: articleRemovedResponse }));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError(invalidArticleIdResponse));
      else next(err);
    });
};

module.exports = { deleteArticle, createArticle, getArticles };
