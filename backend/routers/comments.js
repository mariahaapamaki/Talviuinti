const express = require('express');
const router = express.Router();
const PublicPlace = require('../models/swimmingPlace');
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
  console.log(`Fetching comments for placeId: ${placeId}`); // Add logging

  try {
    const commentList = await Comment.find({ placeId: placeId }); // Corrected model
    console.log(`Comments found: ${commentList.length}`); // Add logging

    if (!commentList || commentList.length === 0) {
      return res.status(200).json({ success: true, message: 'No comments found for this place.', comments: [] });
    }

    res.status(200).json(commentList);
  } catch (error) {
    console.error('Error fetching comment list:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching comments.' });
  }
});

router.post('/', (req, res) => {
  console.log(req.body.placeId)
 const newComment = new Comment({
        placeId: req.body.placeId,
        comment: req.body.comment,
        userId: req.body.userId,
        userName: req.body.userName,
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
