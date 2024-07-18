const {selectTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId,addCommentToArticle, updateArticleVotes, deleteCommentById, fetchAllUsers, getArticlesByTopic} = require('../models/news-model')

exports.getTopics = (req, res, next) => {
   
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then((article) =>{
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query
    fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const{article_id} = req.params
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        
        res.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

exports.postCommentToArticle = ( req, res, next) => {
  
    const {article_id} = req.params
    const {username, body} = req.body
    addCommentToArticle(article_id, username, body)
    .then((comment) => {
        res.status(201).send({comment})
    }).catch((err) => {
        next(err)
    })
}

exports.patchArticleVotes = ( req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    
    updateArticleVotes(article_id, inc_votes)
    .then(updatedArticle =>{
        res.status(200).send({article: updatedArticle})
    })
    .catch(err => {
        next (err)
    })
}

exports.deleteComment= (req, res, next) => {
    const {comment_id} = req.params
    deleteCommentById(comment_id)
    .then((comment) => {
        res.send(204).send()
    }).catch((err) => {
        next(err)
    })
}

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers().then((users) => {
        res.status(200).send({users})
    }).catch((err)=> {
        next(err)
    })
}

exports.getSomeArticles = (req, res, next) => {
    const {topic} = req.params
getArticlesByTopic(topic).then((articles) => {
    res.status(200).send({articles})
}).catch((err) => {
    next(err)
})
}