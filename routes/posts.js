const express = require('express');

const router = express.Router();
const controller = require("../controllers/postController.js")
const controllerAdmin = require("../controllers/postAdminController.js")

const verifyToken = (req, res,next) => {
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken
        next();
    } else {
        res.sendStatus(403)
    }    
}



router.get("/" , controller.index );
router.get("/all" ,verifyToken,controllerAdmin.index );
router.get("/:id", controller.details);
router.get("/:id/comments",controller.get_comments);
router.post("/:id/comments",controller.post_comment);



router.post("/log-in", controllerAdmin.log_in);


router.put("/:id/comments/:commentId",verifyToken,controllerAdmin.edit_comment);
router.delete("/:id/comments/:commentId",verifyToken,controllerAdmin.delete_comment);
router.post("/",verifyToken, controllerAdmin.make_post);
router.put("/:id/status",verifyToken, controllerAdmin.change_publication_status);
router.put("/:id",verifyToken, controllerAdmin.edit_post);
router.delete("/:id", verifyToken, controllerAdmin.delete_post);



module.exports = router