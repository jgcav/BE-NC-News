const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(({rows}) => {
        return {topics: rows}
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        const article = rows[0]
        if(!article){
            return Promise.reject({
                status: 404,
                msg: `ID ${article_id} does not exist`,
            })
        }
        return { article }
    })
}