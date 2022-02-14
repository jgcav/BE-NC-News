const express = require('express')
const {getTopics} = require('./controllers/news.controllers')
const {error404} = require('./errors/errors')

const app = express()

app.get('/api/topics', getTopics)

app.all('/*', error404)

module.exports = app