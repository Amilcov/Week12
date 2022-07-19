const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.json({message: 'Hello from the Express APIs demo app!'});
});

module.exports = router;