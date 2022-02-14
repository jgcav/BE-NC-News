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

describe('GET /api', () => {
    test('status 404: returns a not found error if invalid path is requested', () => {
        return request(app).get('/api/topcs')
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