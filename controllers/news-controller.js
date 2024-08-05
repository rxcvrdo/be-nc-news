const {selectTopics, fetchArticleById, fetchAllArticles, fetchCommentsByArticleId,addCommentToArticle, updateArticleVotes, deleteCommentById, fetchAllUsers, fetchUserByUsername, updateCommentVotes, addArticle} = require('../models/news-model')

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

exports.getUserByUsername = (req, res, next) => {
    const{username} = req.params
    fetchUserByUsername(username)
    .then((user) => {
        
        res.status(200).send({user})
    }).catch((err) => {
        next(err)
    })
}

exports.patchCommentVotes = ( req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body
    
    updateCommentVotes(comment_id, inc_votes)
   .then((updatedComment) => {
    
    res.status(200).send({ comment: updatedComment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postArticle = (req, res, next) => {
    const {author, title, body, topic, article_img_url} = req.body

    if(!author || !title || !body|| !topic) {
    return Promise.reject({status: 404, message: 'Bad request: missing required fields'})
}
   addArticle({author, title, body, topic, article_img_url})
   .then((article) => {
    res.status(201).send({article})
   }).catch((err) => {
    next(err)
   })
}