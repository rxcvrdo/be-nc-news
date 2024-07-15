const express = require('express')
const app = express()
const{getTopics} = require('./controllers/news-controller')
const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./app-error-handlers')
const endpoints =require('./endpoints.json')

app.use(express.json())

app.get('/api/topics',getTopics);

app.get('/api',(req, res, next) => {
    res.status(200).send({endpoints})
})

app.all('*', (req, res) => {
    res.status(404).send({ message: 'Not found' });
  });

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;