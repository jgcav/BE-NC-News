exports.error404 = (req, res, next) => {
        res.status(404).send("Invalid path - page not found")
    }