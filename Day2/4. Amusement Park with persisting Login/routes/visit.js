const express = require('express')
const {csrfProtection, asyncHandler} = require('/utils.js');
const router = express.Router();


router.get('/attraction/:id(\\d+)/visit/add', asyncHandler(async (req, res) => {
    const attractionId = parseInt(req.params.id, 10);
    
}
));

module.exports = router;