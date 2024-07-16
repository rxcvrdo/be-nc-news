const express = require('express')
const app = express()
const{getTopics, getArticleById, getAllArticles} = require('./controllers/news-controller')
const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./app-error-handlers')
const endpoints =require('./endpoints.json')

app.use(express.json())

app.get('/api/topics',getTopics);

app.get('/api',(req, res, next) => {
    res.status(200).send({endpoints})
})

app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getAllArticles)

app.all('*', (req, res) => {
    res.status(404).send({ message: 'Not found' });
  });

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;