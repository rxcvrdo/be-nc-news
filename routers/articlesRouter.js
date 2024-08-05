const express = require('express');
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  postArticle
} = require('../controllers/news-controller');

const articlesRouter = express.Router();

articlesRouter.get('/', getAllArticles);
articlesRouter.post('/', postArticle)
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.get('/:article_id/comments', getCommentsByArticleId);
articlesRouter.post('/:article_id/comments', postCommentToArticle);
articlesRouter.patch('/:article_id', patchArticleVotes);

module.exports = articlesRouter;