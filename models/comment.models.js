const db = require('../db/connection')

exports.fetchCommentsByArticleId = (article_id) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
           return rows
    })
}

exports.addCommentsByArticleId = (article_id, userComment) => {
    const {username, body} = userComment
    if(!username || !body){
        return Promise.reject({status: 400, msg: "Bad request. Invalid input."})
    }
    return db.query(`INSERT INTO comments
    (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [body, username, article_id])
    .then(({rows}) => {
        return rows[0];
    })
}

exports.removeCommentsByCommentId = (comment_id) => {
    return db.query(`DELETE FROM comments
    WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: "Comment ID not found"
            })
        }
    })
}