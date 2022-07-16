const express = require('express');
const db = require('../db/models');
const {check, validationResult } = require('express-validator');
const { Tweet } = db;

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

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

const handlerValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
       const errors =  validationErrors.array().map(err => err.msg);

       const err = new Error('Bad request');
       err.title = 'Bad request: '
       err.status = 400;
       err.errors = errors;

       return next(err);
    };

    next();
}
    

router.get('/', asyncHandler( async(req, res) => {
    const tweets = await db.Tweet.findAll();
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
    const tweet = await db.Tweet.create({ message });
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