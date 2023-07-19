const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({info: "Test"})
})

router.post("/test", (req, res) => {
  res.json(req.body.data)
})

module.exports = router;
