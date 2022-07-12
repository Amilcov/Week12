const express = require('express');
const { csrfProtection, asyncHandler } = require('./utils');
const db = require('../db/models');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { loginUser, logoutUser } = require('../auth');

const router = express.Router();


router.get('/user/register', csrfProtection, (req, res) => {
  const user = db.User.build();

  res.render('user-register', {
    title: 'Register User',
    user,
    csrfToken: req.csrfToken()
  });
});

const userValidators = [
  check('firstName')
    .exists({checkFalsy: true})
    .withMessage('Please provide a value for First Name')
    .isLength({max: 50})
    .withMessage('Please provide a value no more than 50 chars for First Name'),

  check('lastName')
    .exists({checkFalsy: true})
    .withMessage('Please provide a value for Last Name')
    .isLength({max: 50})
    .withMessage('Please provide a value no more than 50 chars for Last Name'),

  check('emailAddress')
    .exists({checkFalsy: true})
    .withMessage('Please provide a value for Email Address')
    .isLength({max: 255})
    .withMessage('Please provide a value no more than 255 chars for Email Address')
    .isEmail()
    .withMessage('Email Address provided is not a valid email')
    .custom((value) => {
      return db.User.findOne({ where: { emailAddress: value}})
        .then( user => {
          if(user) return Promise.reject('The provided email Address is already in use by other account');
        });
    }),          

  check('password')
    .exists({checkFalsy: true})
    .withMessage('Please provide a value for Password')
    .isLength({max: 50})
    .withMessage('Please provide a value no more than 50 chars for password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
    

    check('confirmPassword')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for confirm Password')
      .custom( (value, {req}) => {  
        if (value !== req.body.password) {
          throw new Error('Password and Confirm Password do not match!');
        };
        return true;
      })
]

router.post('/user/register', csrfProtection, userValidators, 
  asyncHandler(async (req, res) => {
    const { firstName, lastName, emailAddress, password} = req.body;

    const user = db.User.build({
      firstName,
      lastName,
      emailAddress
    });


    const validatorErrors = validationResult(req);

    if(validatorErrors.isEmpty()) {
      user.hashedPassword = await bcrypt.hash(password, 10);
      await user.save();
      loginUser(req, res, user);
      return res.redirect('/');
    } else {
      const errors = validatorErrors.array().map(err => err.msg);
      res.render('user-register', {
        title: 'Register User',
        user,
        errors,
        csrfToken: req.csrfToken()
      });
    };

}));

const loginValidators= [
    check('emailAddress')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Email Address')
      .isEmail()
      .withMessage('Email Address provided is not a valid email'),
        
    check('password')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Password')

];

router.get('/user/login', csrfProtection, (req, res) => {
    res.render('user-login', {
        title: 'Login user',
        emailAddress: '',
        csrfToken: req.csrfToken()
    });
});


router.post('/user/login', csrfProtection, loginValidators, 
  asyncHandler( async (req, res) => {
    const { emailAddress, password} = req.body;
    const validatorErrors = validationResult(req);
    let errors = [];


    if (validatorErrors.isEmpty()) {
      const user = await db.User.findOne({where: {emailAddress: emailAddress}});
      if(user) {
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

        if( passwordMatch ) {
          console.log('login - user', user);
          loginUser(req, res, user);
          return res.redirect('/');
        } else {
          errors.push('Login failed for the provided Email Address and password');
        }

      } else {
        errors.push('Login failed for the provided Email Address and password');
      }
    } else {
      errors = validatorErrors.array().map(err => err.msg);
    }


    res.render('user-login', {
      title: 'Login user',
      emailAddress,
      errors,
      csrfToken: req.csrfToken()
    });    

}));


router.use('/user/logout', (req, res) => {
  logoutUser(req, res);
  return res.redirect('/');
});

module.exports = router;