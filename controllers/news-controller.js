const {selectTopics, fetchArticleById} = require('../models/news-model')

exports.getTopics = (req, res, next) => {
    console.log(res)
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then((article) =>{
        res.status(200).send({article})
    }).catch((err) => {
        if (err.status ===404){
            res.status(404).send({ message: 'article does not exist'})
        }else {
            next(err)
        }
    })
}


