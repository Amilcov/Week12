const express = require('express');
const { check, validationResult } = require('express-validator');
const { loginUser, logoutUser} = require('../auth');


const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { csrfProtection, asyncHandler } =  require('./utils');


const router = express.Router();

router.get('/user/register', csrfProtection, (req, res) => {
    const user = db.User.build();

    res.render('user-register', {
        title: 'User Register',
        user,
        csrfToken: req.csrfToken()
      });
});


const userValidators = [
    check('firstName')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for First Name')
      .isLength({max: 50})
      .withMessage('Please provide a value no more then 50 chars for First Name'),

    check('lastName')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Last Name')
      .isLength({max: 50})
      .withMessage('Please provide a value no more then 50 chars for Last Name'), 

    check('emailAddress')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Email Address')
      .isLength({max: 255})
      .withMessage('Please provide a value no more then 255 chars for Email Addresss')
      .isEmail()
      .withMessage('Email Address is not a valid email')
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
      .withMessage('Please provide a value no more then 255 chars for Password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
      .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),

    check('confirmPassword')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Confirm Password')
      .isLength({max: 50})
      .withMessage('Please provide a value no more then 255 chars for Confirm Password')
      .custom( (value, { req }) => {
         if (value !== req.body.password) throw new Error('Password and Confirm Password do not match')
         return true;
      }),
      
      
      
];

router.post('/user/register', csrfProtection, userValidators, asyncHandler(async (req, res) => {
    const { firstName, lastName, emailAddress, password } = req.body;

    const user = db.User.build({
        firstName, 
        lastName, 
        emailAddress
    });

    const validatorErrors = validationResult(req);

    if(validatorErrors.isEmpty()) {

       const saltRounds = 10;
       const salt = await bcrypt.genSalt(saltRounds);
       const hashedPassword = await bcrypt.hash(password, salt);

       user.hashedPassword = hashedPassword;
       
       await user.save();
       loginUser(req, res, user);
       res.redirect('/');
    
    } else {
        const errors = validatorErrors.array().map(error => error.msg);
        res.render('user-register', {
         title: 'User Register',
         user, 
         errors,
         csrfToken: req.csrfToken()
      });
       
    }
}));

router.get('/user/login', csrfProtection, (req, res) => {
    const emailAddress = '';
    res.render('user-login', {
        title: 'User Login', 
        emailAddress, 
        csrfToken: req.csrfToken()
    });
});



loginValidators = [
    check('emailAddress')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for Email Address'),
    check('password')
      .exists({checkFalsy: true})  
      .withMessage('Please provide a value for Password')
];


router.post('/user/login', csrfProtection, loginValidators, asyncHandler(async (req,res) => {
   const { emailAddress, password } = req.body;
   let errors = [];
   const validatorErrors = validationResult(req);
  
   if(validatorErrors.isEmpty()) {
        const user = await db.User.findOne({ where: { emailAddress: emailAddress }});

        if (user !== null) {
            const passwordMatch =  await bcrypt.compare(password, user.hashedPassword.toString());
            if (passwordMatch) {
                loginUser(req, res, user);
                return res.redirect('/');
            }
        }
        errors.push('Login failed for the provided Email Address and password');
    } else {
        errors = validatorErrors.array().map(err => err.msg); 
    };
   
    res.render('user-login', {
        title: 'User login', 
        emailAddress, 
        errors, 
        csrfToken: req.csrfToken()
    });
 

}));

router.post('/user/logout', (req, res) => {
    logoutUser(req, res);
    return res.redirect('/user/login');
});


module.exports = router;


