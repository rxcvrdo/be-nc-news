const { use } = require('../app');
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
            return Promise.reject({status: 404, message: 'article does not exist'})
        }
        return result.rows[0]
    })

}

exports.fetchAllArticles = (sort_by ='created_at', order = 'desc') => {
   validSortBys = ['article_id', 'title', 'topic', 'created_at', 'votes', 'author']
   validOrders = ['asc', 'desc']

   if(!validSortBys.includes(sort_by)){
    return Promise.reject({status: 400, message: 'Invalid request'})
   }

   if(!validOrders.includes(order)){
    return Promise.reject({status: 400, message:'Invalid request'})
   }
   
   let sqlString = `
   SELECT 
   articles.article_id,
   articles.title,
   articles.topic,
   articles.votes,
   articles.created_at,
   articles.author,
   articles.article_img_url,
   COUNT(comments.comment_id) AS comment_count
   FROM
   articles
   LEFT JOIN
   comments ON comments.article_id = articles.article_id
   GROUP BY 
   articles.article_id
   ORDER BY
   ${sort_by} ${order}`

   
    return db.query(sqlString).then((result) => {
    

        return result.rows;
    })
}

exports.fetchCommentsByArticleId = (article_id) =>{
    const query = `
    SELECT
    comment_id,
    votes,
    created_at,
    author,
    body,
    article_id
    FROM COMMENTS
    WHERE article_id=$1
    ORDER BY 
    created_at DESC;`

    return db.query(query,[article_id]).then((result)=> {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, message: 'article not found'})
        }
       
        return result.rows
    })
}

exports.addCommentToArticle = (article_id, author, body) => {
    if(!author || !body) {
        return Promise.reject({status: 400, message: 'Missing required field, please provide username & message'})
    }
    const query = `
    INSERT INTO comments(article_id, author, body, created_at)
    VALUES($1, $2, $3, NOW())
    RETURNING *;`

    const values = [article_id, author, body]
    return db.query(query, values)
    .then((result) => {
        return result.rows[0]
    })
    .catch((err) => {
        
        if(err.code === '23503') {
            return Promise.reject({status: 404, message: 'article not found'})
        }
        throw err
    })
}