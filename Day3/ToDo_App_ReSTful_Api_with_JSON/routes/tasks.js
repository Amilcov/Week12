const express = require('express');
const db = require('../db/models');
const { task } = db;

const router = express.Router();

const  asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

router.get('/', asyncHandler(async (req, res) => {
    const tasks = await db.Task.findAll();
    res.json({tasks});
}));

module.exports = router;