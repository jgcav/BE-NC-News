const { checkArticleExists } = require('../db/helpers/utils')
const { fetchCommentsByArticleId } = require('../models/comment.models')

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    Promise.all([fetchCommentsByArticleId(article_id), checkArticleExists(article_id)])
    .then(([comments]) => {
        res.status(200).send({comments})
    }).catch(next)
}