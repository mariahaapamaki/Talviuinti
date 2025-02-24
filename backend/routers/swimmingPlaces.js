const SwimmingPlace = require('../models/swimmingPlace')
const express = require('express')
const router = express.Router()

router.get(`/`, async (req, res) => {
    const swimmingPlaceList = await SwimmingPlace.find()

    if(!swimmingPlaceList) {
        res.status(500).json({success:false})
    }
    res.send(swimmingPlaceList)
})

router.post(`/`, (req, res) => {
    const swimmingPlace = new SwimmingPlace({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        userAdded: req.body.userAdded,
        dateAdded: new Date().toString()
    })
    user.save().then((createdSwimmingPlace=> {
        res.status(201).json(createdSwimmingPlace)
    })).catch((err) => {
        res.status(500).json({
            error:err,
            success: false
        })
    })
})
module.exports = router