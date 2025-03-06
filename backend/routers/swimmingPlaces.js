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
    publicInfo: req.body.publicInfo,
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

router.post(`/`, (req, res) => {
    const publicPlace = new PublicPlace({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      userId: req.body.userId,
      date: new Date().toString(),
      isPublic: req.body.isPublic,
      publicInfo: req.body.publicInfo,
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

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userPlaces = await UserPlace.find({ userId: userId });
  
      if (!userPlaces) {
        return res.status(404).json({ success: false, message: 'No places found for this user.' });
      }
  
      res.status(200).json(userPlaces);
    } catch (error) {
      console.error('Error fetching user places:', error);
      res.status(500).json({ success: false, message: 'An error occurred while fetching user places.' });
    }
  });

module.exports = router;

