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

router.post(`/`, async (req, res) => {
    let userPlace = new UserPlace({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        userId: req.body.userId,
        date: new Date().toString(),
        info: req.body.info
    });

    userPlace = await userPlace.save();
    if (!userPlace) {
        return res.status(400).send('The place is wrong');
    }
    res.status(200).send(userPlace);
});

module.exports = router;
