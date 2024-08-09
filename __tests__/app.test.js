const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const app = require('../app')
const data = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json')
const comments = require('../db/data/test-data/comments')
const pool = require('../db/connection')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe('GET /api/articles/:article_id' , () => {
   it('GET 200 It should respond with an article that incluedes the column comment_count', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article).toHaveProperty('comment_count')
            expect(typeof article.comment_count).toBe('string')
        })
    })
})

describe('GET /api/topics', () => {
    it('return a GET: 200 status code and return an array of topics to the client' , () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBeGreaterThan(0)
            response.body.topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    })
    it('GET: 404 sends an appropriate status and error message when given an invalid endpoint' , () => {
        return request(app)
        .get('/api/topi/')
        .expect(404)
        .then((response => {
            expect(response.body.message).toBe('Not found')
        }))
    })
    it('GET /api: responds with json object representing all of the available endpoints', () =>{
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) =>{
            expect(response.body.endpoints).toEqual(endpoints)
        })
    })
})
describe('GET /api/articles/:article_id',()=> {
    it('GET: 200 responds with a article depending on the article_id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            expect(response.body.article.title).toBe('Living in the shadow of a great man')
            expect(response.body.article.author).toBe('butter_bridge')
            expect(response.body.article.topic).toBe('mitch')
            expect(response.body.article.article_id).toBe(1)
            expect(response.body.article.body).toBe('I find this existence challenging')
            expect(response.body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(response.body.article.votes).toBe(100)
            expect(response.body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    it('GET: 404 responds with an appropriate status and error message when given an valid id that doesnt exist ', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404) 
        .then((response) => {
            expect(response.body.message).toBe('article does not exist')
        })
    })
    it('GET: 400 responds with an appropriate error status and message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/cheese')
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('Bad request')
        })
    })

})
describe('GET /api/articles', () => {
    it('GET: 200 responds with appropriate status and with an array of articles',() => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) =>{
            const articles = response.body.articles
            expect(Array.isArray(articles)).toBe(true)
            expect(articles.length).toBeGreaterThan(0)
            articles.forEach((article) =>{
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    it('should return an array of articles in descending order by default', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBeGreaterThan(0)
            expect(response.body.articles).toBeSortedBy('created_at',
                {descending: true})
        })
    })
    it('should return an array of articles in ascending order when given order query', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBeGreaterThan(0)
            expect(response.body.articles).toBeSortedBy('created_at',
                {ascending: true})
        })
    })
    it('should return an array of articles by the given sort by query',() => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBeGreaterThan(0)
            expect(response.body.articles).toBeSortedBy('votes',
                {descending: true})
        })
    })
    it('should return an array of articles by the given sort by and order query',() => {
        return request(app)
        .get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBeGreaterThan(0)
            expect(response.body.articles).toBeSortedBy('votes',
                {ascending: true})
        })
    })
    it('should return an array of articles by the given sort by and order query', () => {
        return request(app)
        .get('/api/articles?sort_by=comment_count&order=asc')
        .expect(200)
        .then((response) => {
        console.log(response.body.articles)
            expect(response.body.articles.length).toBeGreaterThan(0)
            expect(response.body.articles).toEqual(
              [
                {
                  article_id: 12,
                  title: 'Moustache',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-10-11T11:24:00.000Z',
                  author: 'butter_bridge',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 4,
                  title: 'Student SUES Mitch!',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-05-06T01:14:00.000Z',
                  author: 'rogersop',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 10,
                  title: 'Seven inspirational thought leaders from Manchester UK',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-05-14T04:15:00.000Z',
                  author: 'rogersop',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 13,
                  title: 'Another article about Mitch',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-10-11T11:24:00.000Z',
                  author: 'butter_bridge',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 2,
                  title: 'Sony Vaio; or, The Laptop',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-10-16T05:03:00.000Z',
                  author: 'icellusedkars',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 7,
                  title: 'Z',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-01-07T14:08:00.000Z',
                  author: 'icellusedkars',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 8,
                  title: 'Does Mitch predate civilisation?',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-04-17T01:08:00.000Z',
                  author: 'icellusedkars',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 11,
                  title: 'Am I a cat?',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-01-15T22:21:00.000Z',
                  author: 'icellusedkars',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '0'
                },
                {
                  article_id: 6,
                  title: 'A',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-10-18T01:00:00.000Z',
                  author: 'icellusedkars',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '1'
                },
                {
                  article_id: 3,
                  title: 'Eight pug gifs that remind me of mitch',
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-11-03T09:12:00.000Z',
                  author: 'icellusedkars',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '2'
                },
                {
                  article_id: 5,
                  title: 'UNCOVERED: catspiracy to bring down democracy',
                  topic: 'cats',
                  votes: 0,
                  created_at: '2020-08-03T13:14:00.000Z',
                  author: 'rogersop',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '2'
                },
                {
                  article_id: 9,
                  title: "They're not exactly dogs, are they?",
                  topic: 'mitch',
                  votes: 0,
                  created_at: '2020-06-06T09:10:00.000Z',
                  author: 'butter_bridge',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '2'
                },
                {
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  topic: 'mitch',
                  votes: 100,
                  created_at: '2020-07-09T20:11:00.000Z',
                  author: 'butter_bridge',
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                  comment_count: '11'
                }
              ])
        })
        
    })
    it('it should return a 400 when given a query that does not exist', () => {
        return request(app)
        .get('/api/articles?sort_by=favourite_cheese')
        .expect(400)
        .then((response) =>{
            expect(response.body.message).toBe('Invalid request')
        })
    })
    it('it should return a 400 when given a order that does not exist', () => {
        return request(app)
        .get('/api/articles?sort_by=votes&order=parrallel')
        .expect(400)
        .then((response) =>{
            expect(response.body.message).toBe('Invalid request')
        })
    })
})
describe('GET /api/article/:article_id/comments',() => {
    it('should return an array of comments for the given article_id', () => {
     return request(app)
     .get('/api/articles/1/comments')
     .expect(200)
     .then((response) => {
        expect(response.body.comments.length).toBeGreaterThan(0)
        const comments = response.body.comments;
        comments.forEach((comment) => {
            expect(comment).toHaveProperty('comment_id')
            expect(comment.comment_id).toBeNumber()
            expect(comment).toHaveProperty('votes')
            expect(comment.votes).toBeNumber()
            expect(comment).toHaveProperty('created_at')
            expect(comment.created_at).toBeString()
            expect(comment).toHaveProperty('author')
            expect(comment.author).toBeString()
            expect(comment).toHaveProperty('body')
            expect(comment.body).toBeString()
            expect(comment).toHaveProperty('article_id')
            expect(comment.article_id).toBeNumber()
        })
     })   
    })
    it('GET: 200 should return an array of comments in descending order',() => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            expect(response.body.comments.length).toBeGreaterThan(0)
            expect(response.body.comments).toBeSortedBy('created_at',
                {descending: true})
        })
    })
    it('Get: 404 should return appropriate status and message when given a valid article_id that doesnt exist', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('article does not exist')
        })
    })
    it('GET: 400 should return appropriate status and message when given a non-valid article id', () => {
        return request(app)
        .get('/api/articles/riceIstheBest/comments')
        .then((response) => {
            expect(response.body.message).toBe('Bad request')
        })
    })
    it('get: 200 should return an empty array where article exists but has no comments', () => {
        return request(app)
        .get('/api/articles/13/comments')
        .then((response) => {
            expect(response.body.comments).toEqual([])
        })
    })

})
describe('POST /api/article/:article_id/comments', () => {
    it('POST: 201 should add a comment for the given article_id', () => {
        const newComment = {username: 'butter_bridge', body:'THIS ARTICLE SUCKS!'}
        return request(app)
        .post('/api/articles/1/comments')
        .expect(201)
        .send(newComment)
        .then((response) => { 
            const {comment} = response.body
            expect(comment).toHaveProperty('comment_id')
            expect(comment.article_id).toBe(1)
            expect(comment.author).toBe('butter_bridge')
            expect(comment.body).toBe('THIS ARTICLE SUCKS!')
            expect(comment).toHaveProperty('created_at')
            expect(comment.created_at).toBeString()
        })
    })
    it('gives an appropriate status code and error message when given a valid id that doesnt exist' , () => {
        const newComment = {username: 'butter_bridge', body:'THIS ARTICLE SUCKS!'}
        return request(app)
        .post('/api/articles/9999/comments')
        .expect(404)
        .send(newComment)
        .then((response) => {
            expect(response.body.message).toBe('article not found')
        })
    })
    it('gives an appropriate status code and error message when given an invalid id', () => {
        const newComment = {username: 'butter_bridge', body:'THIS ARTICLE SUCKS!'}
        return request(app)
        .post('/api/articles/teacup/comments')
        .expect(400)
        .send(newComment)
        .then((response) => {
            expect(response.body.message).toBe('Bad request')
        })
    })
    
})
describe('PATCH /api/articles/:article_id', () => {
    it('should update the article votes whilst returning the updated version of article', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: 1})
        .expect(200)
        .then((response) => {
            const {article} = response.body
            expect(article.article_id).toBe(1)
            expect(article.votes).toBe(101)
        })
    })
    it('should decrease the votes when given a number that is negative', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: -50})
        .expect(200)
        .then((response) => {
            const {article} = response.body
            expect(article.article_id).toBe(1)
            expect(article.votes).toBe(50)
        }) 
    })
    it('POST: 404 should return an appropriate status and message when given a article that doesnt exist', () => {
        return request(app)
        .patch('/api/articles/9999')
        .send({inc_votes: 1})
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('article not found')
        })
    })
    it('POST: 400 it should return the appropriate status and message for invalid inc_votes', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: 'oneHundred'})
        .expect(400)
        .then((response) => {
            expect (response.body.message).toBe('Bad request')
        })
    })
    it('POST: 400 should return the appropriate status and message when given an invalid id', () => {
        return request(app)
        .patch('/api/articles/oneHundred')
        .send({inc_votes: 90})
        .expect(400)
        .then((response) => {
            expect (response.body.message).toBe('Bad request')
        })
    })
})
describe('DELETE /api/comments/:comment_id', () => {
    it('should delete the given comment via the comment_id and respond with status 204', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    it('DELETE: 404 should respond with an appropriate status and message if the comment_id doesnt exist', () => {
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('comment not found')
        })
    })
    it('DELETE: 400 should respond with appropriate status and message if comment_id is not valid', () => {
        return request(app)
        .delete('/api/comments/thatone')
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('Bad request')
        })
    })
})
describe('GET /api/users',() => {
    it('GET 200 it responds with an array of users to the client', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users).toBeInstanceOf(Array)
            expect(users.length).toBeGreaterThan(0)
            users.forEach((user) =>{
                expect(user).toHaveProperty('username')
                expect(user.username).toBeString()
                expect(user).toHaveProperty('name')
                expect(user.name).toBeString()
                expect(user).toHaveProperty('avatar_url')
                expect(user.avatar_url).toBeString()
  
            })
        })
    })
    it('GET: 404 it responds with 404 if the endpoint is not found', () => {
        return request(app)
        .get('/api/non-existent')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Not found')
        })
    })
})
describe('GET /api/articles (topic query)', () => {
    it('should filter articles by topic', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toBeInstanceOf(Array)
            expect(articles.length).toBeGreaterThan(0)
            articles.forEach((article) =>{
                expect(article.topic).toBe('cats')
            })
        })
    })
    it('GET: 404 should respond with appropriate status and error message if topic doesnt exist', () => {
        return request(app)
        .get('/api/articles?topic=nonexistent')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Topic not found')
        })
    })
   
})
describe('/api/users/:username', () => {
    it('responds with an array object of the details of the user of the given username', () => {
        return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({body}) => {
            const {user} = body
            expect(user).toHaveProperty('username')
            expect(user.username).toBe('butter_bridge')
            expect(user).toHaveProperty('name')
            expect(user.name).toBe('jonny')
            expect(user).toHaveProperty('avatar_url')
            expect(user.avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
        })
    })
    it('GET 404: responds with the appropriate error message and status code when given a username that doesnt exist in database', () => {
        return request(app)
        .get('/api/users/rxcvrdo')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('user does not exist')
        })
    })
})
describe('PATCH /api/comments/:comments_id', () => {
    it('GET: 200 should respond with an updated comment vote count', () => {
        return request(app)
        .patch('/api/comments/1')
        .send({inc_votes: 1})
        .expect(200)
        .then((response) => {
            const {comment} = response.body
            expect(comment.comment_id).toBe(2)
            expect(comment.votes).toBe(15)
        })
    })
    it('GET: 200 should respond with a decreased updated comment vote count', () => {
        return request(app)
        .patch('/api/comments/1')
        .send({inc_votes: -1})
        .expect(200)
        .then((response) => {
            const {comment} = response.body
            expect(comment.comment_id).toBe(2)
            expect(comment.votes).toBe(13)
        })
    })
    it('GET: 404 should respond with a appropriate status and message when given a comment hat doesnt exist', () => {
        return request(app)
        .patch('/api/comments/999')
        .send({inc_votes: 1})
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('comment not found')
        })
    })
})
// describe('POST /api/articles', () => {
//     it('POST: 201 responds with a newly added article', () => {
//         const newArticle = {
//             author: 'butter_bridge',
//             title: 'Northcoders - the gateway to a career in tech',
//             body: 'a new journey awaits', 
//             topic: 'coding',
//             article_img_url: 'https://example.com/image.jpg'
//         }
//         return request(app)
//         .post('/api/articles')
//         .send(newArticle)
//         .then((response) => {
//             console.log(response.body)
//             const {article} = response.body
//             expect(article).toHaveProperty('article_id')
//         })
            

 //   })
//})



