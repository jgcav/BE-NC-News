const express = require('express')
const {getTopics, getArticleById} = require('./controllers/news.controllers')
const {handle404, handleCustomErrors, handlePsqlErrors} = require('./errors/errors')

const app = express()


app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)

app.all('/*', handle404)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)

module.exports = app