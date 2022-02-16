const db = require('../db/connection')
const app = require('../app')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const request = require('supertest')

beforeEach(() => {
    return seed(data)
})
afterAll(() => {
    return db.end()
})

describe('app', () => {
    test('status 404: returns a not found error if invalid path is requested', () => {
        return request(app)
        .get('/api/topcs')
        .expect(404)
        .then(({text: msg}) => {
            expect(msg).toBe("Invalid path - page not found")
        })
    });
});

describe('GET /api/topics', () => {
    test('status 200: returns an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body: {topics}}) => {
            expect(topics).toBeInstanceOf(Array)
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
});

describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test('status 200: returns an article object with specified properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body: {article}}) => {
                expect(article).toBeInstanceOf(Object)
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
            })
        });
        test('status 400: returns a bad request error if the requested id is invalid', () => {
            return request(app)
            .get('/api/articles/invalid')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request. Invalid input.")
            })
        });
        test('status 404: returns a not found error if the requested id is valid but does not exist', () => {
            return request(app)
            .get('/api/articles/13')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("ID 13 does not exist")
            })
        });
    });
    describe('PATCH', () => {
        test('status 200: returns article with incremented votes property', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: 50})
            .expect(200)
            .then(({body}) => {
                expect(body.response[0].votes).toBe(150)
                expect(body.response[0]).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
            })
            })
            test('status 400: returns a bad request error if request is made and the request object does not include an inc_votes property', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({votes: 50})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad request. Invalid input.")
                })
            });
            test('status 400: returns a bad request error if request is made and the inc_votes property value is not a number', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: "invalid"})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad request. Invalid input.")
                })
            });
            test('status 400: returns a bad request error if request is made with invalid article_id', () => {
                return request(app)
                .patch('/api/articles/invalid')
                .send({inc_votes: 50})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Bad request. Invalid input.")
                })
            });
            test('status 404: returns a not found error if requested id is valid but does not exist', () => {
                return request(app)
                .patch('/api/articles/108')
                .send({inc_votes: 50})
                .expect(404)
                .then(({body}) => {
                expect(body.msg).toBe("ID 108 does not exist")
                })
            });
    });
    
});