const {fetchTopics, fetchArticleById, amendArticleVotesById} = require('../models/news.models')

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

exports.updateArticleVotesById = (req, res, next) => {
    const {article_id} = req.params
    const updateVotes = req.body
    const votes =  updateVotes.inc_votes
    amendArticleVotesById(article_id, votes)
    .then((response) => {
        res.status(200).send({response})
    }).catch(next)
}