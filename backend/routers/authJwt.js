const express = require('express');
const router = express.Router();
const authJwt = require('../helpers/jwt');

router.get('/', authJwt, async (req, res) => {
    const userList = await User.find();

    if (!userList) {
        return res.status(500).json({ success: false });
    }
    res.send(userList);
});

module.exports = router;
