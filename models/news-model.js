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
    .catch((err) => {
        throw err
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

   console.log(`executing query ${sqlString}`)
   
    return db.query(sqlString).then((result) => {
    

        return result.rows;
    }).catch(err =>{
        throw err
    })
}