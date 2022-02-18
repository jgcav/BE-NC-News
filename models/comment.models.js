const db = require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        
        if (rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No comments found for article ID ${article_id}`
            })
        }
        return rows
    })
}