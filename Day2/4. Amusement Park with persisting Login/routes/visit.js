const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth');



const router = express.Router();


const visitValidators = [
  check('visitedOn')
    .exists({checkFalsy: true})
    .withMessage('Please provide a value for Visied On')
    .isISO8601(),

  check('raiting') 
    .exists({checkFalsy: true}) 
    .withMessage('Please provide a value for Raiting')
    .isInt()
    .withMessage('Please provide an integer value for Raiting')
    .isInt({
      min: 1,
      max: 5
    })
    .withMessage('Please provide an integer value between 1 and 5 for Raiting')
];


router.get('/attraction/:attractionId(\\d+)/visit/add', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const attractionId = parseInt(req.params.attractionId, 10);
    const attraction = await db.Attraction.findByPk(attractionId);
    const visit = db.AttractionVisit.build();

    res.render('visit-add', {
        title: 'Add visit for attraction',
        attraction,
        visit,
        csrfToken: req.csrfToken()
    });
}));



router.post('/attraction/:attractionId(\\d+)/visit/add', requireAuth, csrfProtection, visitValidators, 
  asyncHandler(async (req, res) => {
    const attractionId = parseInt(req.params.attractionId, 10);
    const { visitedOn, raiting, comments } = req.body;
    const attraction = await db.Attraction.findByPk(attractionId);

    const visit = db.AttractionVisit.build({
      attractionId,
      userId: res.locals.user.id,
      visitedOn,
      raiting,
      comments
    });


    const validatorErrors = validationResult(req);

    if(validatorErrors.isEmpty()) {
      await visit.save();
      res.redirect(`/attraction/${attractionId}`);
    } else {
      const errors = validatorErrors.array().map(err => err.msg);

      res.render('visit-add', {
        title: 'Add visit for attraction',
        attraction,
        visit,
        errors,
        csrfToken: req.csrfToken()
      });

    };
    
}));


router.get('/visit/:id(\\d+)', csrfProtection, 
  asyncHandler(async (req, res) => {
    const visitId = parseInt(req.params.id, 10);
    const visit = await db.AttractionVisit.findByPk(visitId, {include: ['attraction']});
    const park = await db.Park.findByPk(visit.attraction.parkId);

    res.render('visit-detail', {
      title: 'Visit Detail',
      visit,
      park,
      csrfToken: req.csrfToken()
    });
}));


router.get('/visit/edit/:id(\\d+)', csrfProtection, 
  asyncHandler(async (req, res) => {
   const visitId = parseInt(req.params.id, 10);
   const visit = await db.AttractionVisit.findByPk(visitId, {include: ['attraction']});
   const park = await db.Park.findByPk(visit.attraction.parkId);

   res.render('visit-edit', {
     title: 'Edit Visit',
     visit,
     park,
     csrfToken: req.csrfToken()
   })
}));


router.post('/visit/edit/:id(\\d+)', requireAuth, csrfProtection, visitValidators, 
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const visitToUpdate = await db.AttractionVisit.findByPk(id, { include: ['attraction'] });
    const { visitedOn, raiting, comments} = req.body;

    const visit = {
      visitedOn, 
      raiting, 
      comments 
    };

    const validatorErrors = validationResult(req);

    if(validatorErrors.isEmpty()) {
      await visitToUpdate.update(visit);
      res.redirect(`/visit/${visitToUpdate.id}`);
    } else {
      const errors = validatorErrors.array().map(err => err.msg);
      const park = await db.Park.findByPk(visitToUpdate.attraction.parkId);

      res.render('visit-edit', {
        title: 'Edit Visit',
        errors,
        visit: {...visit, attractionId: visitToUpdate.id, attraction: visitToUpdate.attraction},
        park,
        csrfToken: req.csrfToken()
      });
    };

}));


router.get('/visit/delete/:id(\\d+)', requireAuth, csrfProtection, 
  asyncHandler(async (req, res) => {
    const visitId = parseInt(req.params.id, 10);
    const visit = await db.AttractionVisit.findByPk(visitId, {include: ['attraction']});
    const park = await db.Park.findByPk(visit.attraction.parkId);

    res.render('visit-delete', {
      title: 'Delete Visit',
      visit,
      park,
      csrfToken: req.csrfToken()
    });
   
}));



router.post('/visit/delete/:id(\\d+)', requireAuth, csrfProtection, 
  asyncHandler(async (req, res) => {
    const visitId = parseInt(req.params.id, 10);
    const visit = await db.AttractionVisit.findByPk(visitId);
    const attractionId = visit.attractionId;

    await visit.destroy();
    res.redirect(`/attraction/${attractionId}`);
}));


module.exports = router;