const PublicPlace = require('../models/swimmingPlace');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const publicPlaceList = await PublicPlace.find();

  if (!publicPlaceList) {
    res.status(500).json({ success: false });
  }
  res.send(publicPlaceList);
});

router.post(`/`, (req, res) => {
  const publicPlace = new PublicPlace({
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    userId: req.body.userId,
    date: new Date().toString(),
    isPublic: req.body.isPublic,
    publicInfo: req.body.info,
    name: req.body.name,
    comment: req.body.comment
  });

  publicPlace.save().then((createdPublicPlace) => {
    res.status(201).json(createdPublicPlace);
  }).catch((err) => {
    res.status(500).json({
      error: err,
      success: false
    });
  });
});

module.exports = router;
