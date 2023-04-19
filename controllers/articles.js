const Article = require('../models/article')
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-err');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user })
    .then((article) => res.send(article))
    .catch((err) => {
      next(err);
    });
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ keyword, title, text, date, source, link, image, owner: req.user })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError('Wrong data for article'));
      else next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { _id } = req.params;
  Article.findById(_id).select("+owner")
    .orFail(() => new NotFoundError('No article found'))
    .then((article) => {
      console.log(article);
      if (!article.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Unathorized Access'));
      }
      return article.deleteOne()
        .then(() => res.send({ message: 'Article succesfully removed' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('unsupported id'));
      else next(err);
    });
};

module.exports = { deleteArticle, createArticle, getArticles };