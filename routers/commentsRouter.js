const express = require('express');
const { deleteComment, patchCommentVotes } = require('../controllers/news-controller');

const commentsRouter = express.Router();

commentsRouter.delete('/:comment_id', deleteComment);

commentsRouter.patch('/:comment_id', patchCommentVotes)

module.exports = commentsRouter;