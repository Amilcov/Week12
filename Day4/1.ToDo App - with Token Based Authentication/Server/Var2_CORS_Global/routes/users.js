const express = require('express');
const db = require('../db/models');
const { check } = require('express-validator');
const { handlerValidationErrors, asyncHandler } = require('./utils');
const bcrypt = require('bcryptjs');
const { getUserToken } = require('../auth');

const router = express.Router();

const userValidators = [
    check("email")
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Email Address')
      .isEmail()
      .withMessage('Email Address is not a valid Email')
      .custom( (value) => {
        return db.User.findOne({ where: {email: value}})
        .then( user => { 
                       if (user) return Promise.reject('The provided email Address is already in database');
        });
      }),
    check("password") 
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Password'),

    handlerValidationErrors, 
];

router.post(
  '/', 
  userValidators, 
  asyncHandler( async(req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({ email, hashedPassword });

    const token = getUserToken(user);
    res.status(201).json({ 
         user: {id: user.id},
         token
    });
    

}));


module.exports = router;