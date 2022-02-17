const db = require('../db/connection')

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        const article = rows[0]
        if(!article){
            return Promise.reject({
                status: 404,
                msg: `ID ${article_id} does not exist`
            })
        }
        return {article}
    })
}

exports.amendArticleVotesById = (article_id, updateVotes) => {
    if (!updateVotes){
        return Promise.reject({
            status: 400,
            msg: "Bad request. Invalid input."
        })
    }
    return db.query(`
    UPDATE articles
    SET votes = (votes + $1)
    WHERE article_id = $2
    RETURNING *;`, [updateVotes, article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `ID ${article_id} does not exist`
            })
        }
        return rows
    })
}

exports.fetchArticles = () => {
    return db.query(`
    SELECT articles.*
    FROM articles
    GROUP BY articles.article_id
    ORDER BY created_at desc
    `)
    .then(({rows}) => {
        return rows
    })
}