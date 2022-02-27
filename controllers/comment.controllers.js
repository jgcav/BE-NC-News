const { checkArticleExists } = require('../db/helpers/utils')
const { fetchCommentsByArticleId, addCommentsByArticleId, removeCommentsByCommentId } = require('../models/comment.models')

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    Promise.all([fetchCommentsByArticleId(article_id), checkArticleExists(article_id)])
    .then(([comments]) => {
        res.status(200).send({comments})
    }).catch(next)
}

exports.postCommentsByArticleId = (req, res, next) => {
    const {article_id: article_id} = req.params
    const userComment = req.body
    addCommentsByArticleId(article_id, userComment)
    .then((comment) => {
        res.status(201).send({comment})
    }).catch(next)
}

exports.deleteCommentsByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    removeCommentsByCommentId(comment_id)
    .then(() => {
        res.status(204).send()
    }).catch(next)
}