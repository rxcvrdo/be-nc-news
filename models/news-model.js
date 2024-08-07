const { use, response } = require('../app');
const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((result) =>{ 
        return result.rows;
    })
}

exports.fetchArticleById =(article_id) => {
    return db.query(`SELECT 
            articles.*,
            COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id])
    .then((result) => {
        if(result.rows.length ===0){
            return Promise.reject({status: 404, message: 'article does not exist'})
        }
        return result.rows[0]
    })

}

exports.fetchAllArticles = (sort_by ='created_at', order = 'desc', topic) => {
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
   `
   const queryValues = []

   if(topic) {
    sqlString += ` WHERE articles.topic = $1`;
    queryValues.push(topic)
   }

   sqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`

   
    return db.query(sqlString, queryValues).then((result) => {
        if(result.rows.length ===0) {
            return Promise.reject({status: 404, message: 'Topic not found'})
        }
    

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
        throw err
    })
}

exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(`
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id =$2
        RETURNING *;`,
    [inc_votes, article_id]
)
.then((result) => {
    if(result.rows.length === 0){
        return Promise.reject({status: 404, message: 'article not found'})
    }
    return result.rows[0]
})
}

exports.deleteCommentById = (comment_id) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`,[comment_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({status: 404, message: 'comment not found'})
            }
            return result.rows[0]
        })
}

exports.fetchAllUsers = (sort_by = 'created_at', order = 'desc') => {
    return db.query(`
        SELECT username, name, avatar_url FROM users;`)
        .then((result) => {
            if(result.rows.length === 0){
                return Promise.reject({status: 404, message: 'Path not found'})
            }
            return result.rows
        })
}

exports.fetchUserByUsername =(username) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
        if(result.rows.length ===0){
            return Promise.reject({status: 404, message: 'user does not exist'})
        }
        return result.rows[0]
    })

}

exports.updateCommentVotes = (comment_id, inc_votes) => {
    return db.query(`
        UPDATE comments 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`, [inc_votes, comment_id])
        .then((result) => {
            if(result.rows.length === 0) {
                return Promise.reject({status: 404, message: 'comment not found'})
            }
            return result.rows[0]
        })

}

exports.addArticle = (author, title, body, topic, article_img_url) => {
    const query = `
    INSERT INTO articles(author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING article_id, author, title, body, topic, article_img, votes, created_at;
    `
    const values = [author, title, body, topic, article_img_url]
    return db.query(query, values)
    .then(({rows}) => {
        console.log(rows)
        const article = rows[0]
        article.comment_count = 0
        return article
    })
}

