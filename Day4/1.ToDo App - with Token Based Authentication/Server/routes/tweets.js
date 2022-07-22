const express = require('express');
const db = require('../db/models');
const { check } = require('express-validator');
const { asyncHandler, handlerValidationErrors } = require('./utils');
const { requireAuth } = require('./auth');
const { Tweet } = db;

const router = express.Router();
router.use(requireAuth);


const twweetNotFoundError = (id) => {
    const err = new Error (`There isn\'t a tweet with id ${id} in the database`);
    err.title = 'Tweet not found';
    err.status = 404;
    return err;
};


const tweetValidators = [
    check('message')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for message')
      .isLength({max: 280})
      .withMessage('The message must be no more than 280 characters long')
];


    

router.get('/', asyncHandler( async(req, res) => {
    const tweets = await db.Tweet.findAll({
      include:[{ model: db.User, as: "user", attributes: ["username"] }],
      order: [["createdAt", "DESC"]],
      attributes: ["message"]
   });
   
  res.json({tweets});
}));


router.get('/:id(\\d+)', asyncHandler( async(req, res, next) => {
   const tweetId = parseInt(req.params.id, 10);
   const tweet = await db.Tweet.findByPk(tweetId);

   if (tweet) {
    res.json({tweet});
   } else {
    next(twweetNotFoundError());
   }
}));

router.post('/', tweetValidators , handlerValidationErrors, asyncHandler (async(req, res, next) => {
    const { message } = req.body;
    const tweet = await db.Tweet.create({ message, userId: req.user.id });
    res.status(201).json(tweet);
 }));


 router.put('/:id(\\d+)', tweetValidators, handlerValidationErrors, asyncHandler( async(req, res, next) => {
      const tweetId = parseInt(req.params.id, 10);
      const { message } = req.body;
      const tweetToUpdate = await db.Tweet.findByPk(tweetId);

      if (tweetToUpdate) {
         const tweet = await tweetToUpdate.update({message});
         res.json(tweet);
      } else {
        next(twweetNotFoundError());
      }
 }));


 router.delete('/:id(\\d+)', asyncHandler( async(req, res, next) => {
      const tweetId = parseInt(req.params.id, 10);
      const tweet = await db.Tweet.findByPk(tweetId);
      if(tweet) { 
         await tweet.destroy();
         res.status(204).end();
      } else {
        next(twweetNotFoundError());
      }
 }));

module.exports = router;