const {fetchArticleById, amendArticleVotesById, fetchArticles} = require('../models/article.models')

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

exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((response) => {
        res.status(200).send(response)
    }).catch(next)
}