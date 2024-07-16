const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((result) =>{ 
        return result.rows;
    })
}

exports.fetchArticleById =(article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        if(result.rows.length ===0){
            const error = new Error('Article not found');
            error.status = 404
            throw error
        }
        return result.rows[0]
    }).catch((err) => {
        console.error('Database query error:', err);
        throw err
    })
}