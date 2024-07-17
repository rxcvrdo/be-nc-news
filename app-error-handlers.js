exports.customErrorHandler = ((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({message: err.message})
    } else{
        next(err)
    }
})

exports.psqlErrorHandler =(err, req, res, next) => {
    if (err.code ==='22P02'|| err.code ==='23502') {
        res.status(400).send({message: 'Bad request'})
    }else if (err.code === '23503'){
        res.status(404).send({message: 'article not found'})
    }
    else {
        next(err)
    }
}

exports.serverErrorHandler = ( err, req, res, next) => {
   
    res.status(500).send({message: 'internal server error'})
}
