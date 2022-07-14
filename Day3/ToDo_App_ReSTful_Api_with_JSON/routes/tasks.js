const express = require('express');
const db = require('../db/models');

const { task } = db;
const { check, validationResult } = require('express-validator');

const router = express.Router();

const  asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const validateTask = [
    check('name')
      .exists({checkFalsy: true})
      .withMessage('Please provide a value for name of the task'),

    check('name')  
      .isLength({max: 255})
      .withMessage('Please provide a valid value for name of the task that is less than 255 characters long')
];

const handlerValidationErrors = (req, res, next) => {
   const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        const errors = validationErrors.array().map(err => err.msg);

        const err = new Error('Bad Request');
        err.title = 'Bad Request';
        err.status = 400;
        err.errors = errors
        return next(err);
    }
    next();
};


const taskNotFound = (id) => {
      const err = new Error(`Task  with ${id} could not be found`);
      err.title = 'Task not found';
      err.status = 404;
      
      return err;
};


router.get('/', asyncHandler(async (req, res) => {
    const tasks = await db.Task.findAll();
    res.json({ tasks });
})); 


router.post('/', validateTask, handlerValidationErrors, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const task = await db.Task.create({name});
    res.status(201).json({ task });
  
}));


router.get('/:id(\\d+)',validateTask, handlerValidationErrors, asyncHandler( async(req, res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await db.Task.findByPk(taskId);
    if (task) {
      res.json({task});
    } else {
      next(taskNotFound(taskId));
    }
}));


router.put('/:id(\\d+)', validateTask, handlerValidationErrors, asyncHandler( async(req, res, next)=>{
  const taskId = parseInt(req.params.id, 10);
  const taskToUpdate = await db.Task.findByPk(taskId);

  if (taskToUpdate) {
      const { name } = req.body;
      const task = { name };
      await taskToUpdate.update(task);
      res.json({ task });
  } else  {
    next(taskNotFound(taskId));
  }

}));


router.delete('/:id(\\d+)', asyncHandler(async(req, res, next) => {
  const taskId = parseInt(req.params.id, 10);
  console.log('delete_____', taskId);
  const task = await db.Task.findByPk(taskId);
  if(task) {
      await task.destroy();
      res.status(204).end();
  } else {
     next(taskNotFound(taskId));
  }

}));

module.exports = router;