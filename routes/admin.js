const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")
const User = require("../models/modelUser.js")
const Post = require("../models/postModel.js")
const bcrypt = require("bcryptjs")
router.get("/" , (req, res) => {
    res.json("Admin test positive!")
})


router.post("/log-in", (req, res) => {
    User.find({username: req.body.username}).then((user) => {        
        if(user.length > 0) {
        user = user[0]        
        const result = bcrypt.compareSync(req.body.password, user.password);
        if(result) {
            jwt.sign({user}, process.env.SECRET_KEY, (err, token) => {
               res.redirect(process.env.REDIRECT_URI + `?token=${token}` )
            });  
        } else {
            res.sendStatus(403)
        }
        } else {
            res.sendStatus(403)
        }
    });   
})



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

router.post("/post",verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const {title, text} = req.body
            const newPost = new Post({
                title,
                text,
                comments: [],
                publication_status: false,
                date: new Date()

            })
            newPost.save().then(() => res.sendStatus(200))
        }
    })   
})

router.put("/post",verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const {title, text} = req.body;           
            if(title != undefined && text != undefined) {
                console.log("Both changes")
                Post.findOneAndUpdate({_id: req.body.id}, {title, text})
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(404));
            } else if(text != undefined) {
                console.log("Only text")
                Post.findOneAndUpdate({_id: req.body.id}, {text})
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(404));
            } else if(title != undefined) {
                Post.findOneAndUpdate({_id: req.body.id}, {title})
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(404));
            } else {
                res.sendStatus(404)
            }  
        }
    })   
})

router.delete("/post/delete", verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
           Post.findByIdAndDelete(req.body.id)
           .then(() => res.sendStatus(200))
           .catch((err) => res.json(err))
        }
    })
})

module.exports = router;
