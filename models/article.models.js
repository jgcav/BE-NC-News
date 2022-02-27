const db = require('../db/connection')

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT articles.*,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then(({rows}) => {
        const article = rows[0]
        if(!article){
            return Promise.reject({
                status: 404,
                msg: `Article ID ${article_id} does not exist`
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
                msg: `Article ID ${article_id} does not exist`
            })
        }
        return rows
    })
}

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {

    if(!["author", "title", "article_id", "topic", "created_at", "votes"].includes(sort_by)){
        return Promise.reject({
            status: 400,
            msg: `Bad request. Invalid sort_by query.`
        })
    }
    if(!["asc", "desc",].includes(order)){
        return Promise.reject({
            status: 400,
            msg: `Bad request. Invalid order query.`
        })
    }

    let query = `
    SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    `
    if (["coding", "football", "cooking", "mitch", "cats", "paper"].includes(topic)){
        query += `WHERE topic = '${topic}'`
    } else if (topic !== undefined) {
        return Promise.reject({status: 404, msg: "No topic found"})
    }

    query += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    `
    return db.query(query)
    .then(({rows}) => {
        return rows
    })
}