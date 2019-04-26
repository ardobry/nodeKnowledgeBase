const mongoose = require('mongoose');


//Article Schema
//Cos mongo doesn't need a specific schema on data storage, in case if we still need it, we can add it on application level, not on data level, like sql dbs
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);