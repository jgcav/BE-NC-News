const express = require('express')
const {getTopics} = require('./controllers/topic.controllers')
const {getArticleById, updateArticleVotesById, getArticles} = require('./controllers/article.controllers')
const {getUsers} = require('./controllers/user.controllers')
const {getCommentsByArticleId, postCommentsByArticleId, deleteCommentsByCommentId} = require('./controllers/comment.controllers')
const {handle404, handleCustomErrors, handlePsqlErrors} = require('./errors/errors')
const { getEndpoints } = require('./controllers/endpoints.controllers')

const app = express()
app.use(express.json())


app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', updateArticleVotesById)
app.get('/api/users', getUsers)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postCommentsByArticleId)
app.delete('/api/comments/:comment_id', deleteCommentsByCommentId)
app.get('/api', getEndpoints)

app.all('/*', handle404)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)

module.exports = app