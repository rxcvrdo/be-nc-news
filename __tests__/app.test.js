const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const app = require('../app')
const data = require('../db/data/test-data/index')
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
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