const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schemaPost = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    comments: {
        type: Array,
        required: true
    },
    publication_status: {
        type: Boolean,
        required: true
    }
})



const Post = mongoose.model("Post", schemaPost);
module.exports = Post