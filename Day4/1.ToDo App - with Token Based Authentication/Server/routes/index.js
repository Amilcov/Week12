const express = require('express');
const router = express.Router()


router.get("/", (req, res) => {
  res.json({message: "Test root index"});
});

module.exports = router