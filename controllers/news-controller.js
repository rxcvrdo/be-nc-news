const {selectTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId} = require('../models/news-model')

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
    const {sort_by, order} = req.query
    fetchAllArticles(sort_by, order)
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

