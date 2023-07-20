const express = require('express');

const router = express.Router();
const controller = require("../controllers/postController.js")

router.get("/" , controller.index );
router.get("/:id", controller.details);
router.get("/:id/comments",controller.get_comments);
router.post("/:id/comments",controller.post_comment);

module.exports = router