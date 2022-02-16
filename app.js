const express = require('express')
const {getTopics} = require('./controllers/topic.controllers')
const {getArticleById, updateArticleVotesById} = require('./controllers/article.controllers')
const {getUsers} = require('./controllers/user.controllers')
const {handle404, handleCustomErrors, handlePsqlErrors} = require('./errors/errors')

const app = express()
app.use(express.json())


app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', updateArticleVotesById)
app.get('/api/users', getUsers)

app.all('/*', handle404)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)

module.exports = app