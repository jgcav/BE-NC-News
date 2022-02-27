const db = require('../db/connection')
const app = require('../app')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const request = require('supertest')
const endpoints = require('../endpoints.json')

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

describe('/api/topics', () => {
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
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
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
                expect(body.msg).toBe("Article ID 13 does not exist")
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
                expect(body.msg).toBe("Article ID 108 does not exist")
                })
            });
    });
    
});

describe('/api/users', () => {
    test('status 200: returns an array of objects with a username property', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(4)
            body.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String)
                    })
                )
            })
        })
    });
});

describe('/api/articles', () => {
    test('status 200: returns an array of article objects sorted in descending date order by default', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(12)
            expect(body).toBeSortedBy('created_at', {descending: true})
            body.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    });
    test('status 200: accepts sort_by query which sorts by any valid column', () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy('author', {descending: true})
        })
    });
    test('status 200: accepts order query which orders by ascending or descending but defaults to descending', () => {
        return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy('title', {ascending: true})
        })
    });
    test('status 200: accepts topic query which filters the articles by the specified topic value', () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(11)
            body.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        topic: "mitch"
                    })
                )
            })
        })
    });
    test('status 400: returns a bad request error if sort_by query is invalid', () => {
        return request(app)
        .get("/api/articles?sort_by=xxx")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request. Invalid sort_by query.")
        })
    });
    test('status 400: returns a bad request error if order query is invalid', () => {
        return request(app)
        .get("/api/articles?order=invalid")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request. Invalid order query.")
        })
    });
    test('status 404: returns a not found error if order query is invalid', () => {
        return request(app)
        .get("/api/articles?topic=invalid")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("No topic found")
        })
    });
});

describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('status 200: returns an array of comment objects for the given id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
              expect(body["comments"].forEach((comment) => {
                expect(comment).toEqual(
                  expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                  })
                )
              }))
            })
              
      });
      test('status 200: returns an empty array if valid id is requested but article has no comments', () => {
          return request(app)
          .get('/api/articles/7/comments')
          .expect(200)
          .then(({body}) => {
            expect(body.comments).toEqual([])
          })
    });
        test('status 404: returns a not found error if valid id is requested but article does not exist', () => {
            return request(app)
            .get('/api/articles/3000/comments')
            .expect(404)
            .then(({body}) => {
              expect(body.msg).toBe('Article ID 3000 does not exist')
            })
      });
        test('status 400: returns a bad request error if the requested id is invalid', () => {
            return request(app)
            .get('/api/articles/invalid/comments')
            .expect(400)
            .then(({body}) => {
              expect(body.msg).toBe('Bad request. Invalid input.')
            })
      });
    });
    describe('POST', () => {
        test('status 201: returns posted comment', () => {
            const userComment = {username: "lurker", body: "test comment 1"}
            return request(app)
            .post('/api/articles/2/comments')
            .send(userComment)
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toEqual(
                    expect.objectContaining({
                        comment_id: 19,
                        votes: 0,
                        created_at: expect.any(String),
                        author: "lurker",
                        body: "test comment 1",
                        article_id: 2
                    })
                )
            })
        });
        test('status 404: returns a not found error if username does not exist', () => {
            const userComment = {username: "testuser1", body: "test comment 1"}
            return request(app)
            .post('/api/articles/2/comments')
            .send(userComment)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Requested input does not exist')
            })
        });
        test('status 404: returns a not found error if article id is valid but does not exist', () => {
            const userComment = {username: "lurker", body: "test comment 1"}
            return request(app)
            .post('/api/articles/3000/comments')
            .send(userComment)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Requested input does not exist')
            })
        });
        test('status 400: returns a bad request error if comment body is empty', () => {
            const userComment = {username: "lurker", body: ""}
            return request(app)
            .post('/api/articles/2/comments')
            .send(userComment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request. Invalid input.')
            })
        });
        test('status 400: returns a bad request error if no body and username included in comment', () => {
            const userComment = {}
            return request(app)
            .post('/api/articles/2/comments')
            .send(userComment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request. Invalid input.')
            })
        });
    });
    });

describe('/api/comments/:comment_id', () => {
    test('status 204: returns no content and deletes the comment by given comment id', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    });
    test('status 404: returns a not found error if the given comment id is valid but does not exist', () => {
        return request(app)
        .delete('/api/comments/100')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Comment ID not found")
        })
    });
    test('status 400: returns a bad request error if the given comment is not valid', () => {
        return request(app)
        .delete('/api/comments/invalid')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request. Invalid input.")
        })
    });
});

describe('/api', () => {
    test('status 200: returns JSON describing all available endpoints', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    });
});