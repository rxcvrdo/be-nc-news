const express = require('express')
const app = express()
const{getTopics, getArticleById, getAllArticles, getCommentsByArticleId, postCommentToArticle, patchArticleVotes,deleteComment} = require('./controllers/news-controller')
const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./app-error-handlers')
const endpoints =require('./endpoints.json')

app.use(express.json())

app.get('/api/topics',getTopics);

app.get('/api',(req, res, next) => {
    res.status(200).send({endpoints})
})

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.all('*', (req, res) => {
    res.status(404).send({ message: 'Not found' });
  });

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;