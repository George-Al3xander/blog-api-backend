const express = require('express');
const router = express.Router();

router.get("/" , (req, res) => {
    res.json("Admin test positive!")
})




module.exports = router;
