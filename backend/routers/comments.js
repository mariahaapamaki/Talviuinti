const express = require('express');
const router = express.Router();
//const PublicPlace = require('./models/PublicPlace');
const Comment = require('../models/comment');

router.get(`/`, async (req, res) => {
  const comments = await Comment.find();

  if (!comments) {
    res.status(500).json({ success: false });
  }
  res.send(comments);
});

router.get('/:placeId', async (req, res) => {
    const { placeId } = req.params;
  
    try {
      const commentList = await UserPlace.find({ placeId: placeId });
  
      if (!commentList) {
        return res.status(404).json({ success: false, message: 'No places found for this user.' });
      }
  
      res.status(200).json(commentList);
    } catch (error) {
      console.error('Error fetching commentlist:', error);
      res.status(500).json({ success: false, message: 'An error occurred while fetching comment places.' });
    }
  });

router.post('/', (req, res) => {
 const newComment = new Comment({
        placeId: req.body.placeId,
        comment: req.body.comment,
        userId: req.body.userId,
        date: new Date().toString(),
      });
  newComment.save()
    .then((createdComment) => {
      res.status(201).json({
        message: 'Comment added successfully',
        comment: createdComment
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false
      });
    });
});

module.exports = router;
