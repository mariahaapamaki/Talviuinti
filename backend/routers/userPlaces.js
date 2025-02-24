const UserPlace = require('../models/userPlace');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const userPlaceList = await UserPlace.find();

    if (!userPlaceList) {
        return res.status(500).json({ success: false });
    }
    res.send(userPlaceList);
});

router.post(`/`, async (req, res) => {
    let userPlace = new UserPlace({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        user: req.body.userAdded,
        date: new Date().toString()
    });

    userPlace = await userPlace.save();
    if (!userPlace) {
        return res.status(400).send('The place is wrong');
    }
    res.status(200).send(userPlace);
});

module.exports = router;
