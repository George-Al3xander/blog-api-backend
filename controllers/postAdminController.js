const Post = require("../models/postModel.js")
const jwt = require("jsonwebtoken")
const User = require("../models/modelUser.js")
const bcrypt = require("bcryptjs")

const log_in = (req, res) => {
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
}



const make_post = (req, res) => {
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
}

const edit_post = (req, res) => {
    const id = req.params.id;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const {title, text} = req.body;           
            if(title != undefined && text != undefined) {
                console.log("Both changes")
                Post.findOneAndUpdate({_id: id}, {title, text})
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(404));
            } else if(text != undefined) {
                console.log("Only text")
                Post.findOneAndUpdate({_id: id}, {text})
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(404));
            } else if(title != undefined) {
                Post.findOneAndUpdate({_id: id}, {title})
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(404));
            } else {
                res.sendStatus(404)
            }  
        }
    })   
}

const delete_post = (req, res) => {
    const id = req.params.id;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
           Post.findByIdAndDelete(id)
           .then(() => res.sendStatus(200))
           .catch((err) => res.json(err))
        }
    })
}

const change_publication_status = (req, res) => {
    const id = req.params.id;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
          Post.findById(id)
          .then((post) => {
            Post.findOneAndUpdate({_id: id}, {
                publication_status: !post.publication_status
            })
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500))
        })
        .catch(() => res.sendStatus(500))
        }
    })
}

const edit_comment = (req, res) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            const {username, text} = req.body;    
            Post.findById(postId)
            .then((post) => {
            let tempArray = post.comments;
            let comment = tempArray[commentId]       
            if(username != undefined && text != undefined) {
                console.log("Both changes")
                comment = {...comment, username, text}
            } else if(text != undefined) {
                console.log("Only text")
                comment = {...comment,  text}
                
            } else if(username != undefined) {
                console.log("Only username")
                comment = {...comment, username}                
            } else {
                res.sendStatus(404)
            }  
            tempArray[commentId] = comment;
            Post.findOneAndUpdate({_id: postId}, {
                comments: tempArray
            })
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500))         
            });
        }
    })     
}

const delete_comment = (req, res) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {              
            Post.findById(postId)
            .then((post) => {
                let tempArray = post.comments;
                tempArray = tempArray.filter((item) => {
                    return item.id != commentId
                })      
                tempArray = tempArray.map((item,number) => {
                    return {...item, id: number}
                })
                Post.findOneAndUpdate({_id: postId}, {
                    comments: tempArray
                })
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(500)) 
            });
        }
    }) 
}



module.exports = {
    log_in,
    edit_post,
    make_post,
    delete_post,
    change_publication_status,
    edit_comment,
    delete_comment
}