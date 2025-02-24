const jwt = require('jsonwebtoken');

function authJwt(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token.split(" ")[1], secret); // Split the "Bearer " part
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = authJwt;



