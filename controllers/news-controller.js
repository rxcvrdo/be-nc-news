const {selectTopics} = require('../models/news-model')

exports.getTopics = (req, res, next) => {
    console.log(res)
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

