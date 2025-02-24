function errorHandler(err, req, res, next) {
    if (err) {
        return res.status(500).json({message: 'error in the server' + err})
    }
    
    return res.status(500).json(err)
}

module.exports = errorHandler;