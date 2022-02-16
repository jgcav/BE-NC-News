const {fetchUsers} = require('../models/user.models')

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((usernames) => {
        res.status(200).send(usernames)
    }).catch(next)
}