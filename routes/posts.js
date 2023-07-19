const express = require('express');
const router = express.Router();
const controller = require("../controllers/postController.js")
const Post = require("../models/postModel.js")

router.get("/" , controller.index );
router.get("/:id", controller.details);
router.get("/:id/comments",controller.get_comments);
router.post("/:id/comments",controller.post_comment);

router.post("/", (req, res) => {      
    const newPost = new Post({...req.body, date: new Date(), comments: [], publication_status : false})
    newPost.save()
    .then(() => res.json("Saved"))
    .catch((err) => console.log(err))
})



module.exports = router