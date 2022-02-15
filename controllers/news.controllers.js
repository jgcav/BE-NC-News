const {fetchTopics, fetchArticleById} = require('../models/news.models')

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send(topics)
    }).catch(next)
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id)
    .then((response) => {
        res.status(200).send(response)
    }).catch(next)
}