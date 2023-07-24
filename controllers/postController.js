const Post = require("../models/postModel.js")

 
const index = (req, res) => {
    Post.find({publication_status: true})
    .then((result) => {
        res.json(result)
    })
    .catch(() => res.status(404))
}

const details = (req, res) => {  
    const id = req.params.id;    
    Post.findById(id)
    .then((result) => {
        res.json(result)
    })
    .catch(() => res.status(404))
    
}

const get_comments = (req, res) => {  
    const id = req.params.id;    
    Post.findById(id)
    .then((result) => {
        res.json(result.comments)
    })
    .catch(() => res.status(404))
    
}

const post_comment = (req, res) => {  
    const id = req.params.id; 
    if(req.body.username == undefined || req.body.text == undefined) {
        res.sendStatus(500)
    } else {
    Post.findById(id).then((post) => {
        Post.findByIdAndUpdate(id, {
            comments: [...post.comments, {...req.body, id: post.comments.length, date: new Date()}]
        })
        .then((result) => {
            res.json("Made a comment")
        })
    })
    .catch(() => res.status(404))
    }   
    
}

const test = (req, res) => {
    if(req.user) {
        res.json("Welcome back, " + req.user.username)
    } else {
        res.json("No users found!")
    }
}


module.exports = {
    index,
    details,
    get_comments,
    post_comment,
    test
}