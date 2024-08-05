const express = require('express')
const app = express()
const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./app-error-handlers')
const apiRouter = require('./routers/api-router')
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.use('/api', apiRouter)

app.all('*', (req, res) => {
    res.status(404).send({ message: 'Not found' });
  });

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;