const express = require('express')
const articlesRouter = require('./articlesRouter')
const commentsRouter = require('./commentsRouter')
const usersRouter = require('./usersRouter')
const {getTopics} = require('../controllers/news-controller')
const endpoints = require('../endpoints.json')

const apiRouter = express.Router();

apiRouter.get('/topics', getTopics)
apiRouter.get('/',(req, res, next) => {
    res.status(200).send({endpoints})
})

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;