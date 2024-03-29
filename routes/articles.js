const express = require("express");
const router = express.Router();
//Bringing in the article model
const Article = require('../models/article');
//User Model
const User = require('../models/user');


//Access control
const ensureAuthenticated = (req, res, next) => {
    //req.isAuthenticated used because passport is available
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}


//Add route
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

//Load Edit Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if(article.author != req.user._id){
            req.flash('danger', 'Not Authorized');
           return res.redirect('/');
        }
        res.render("edit_article", {
            title: "Edit Article",
            article
        });
    });
});

//Add Submit POST Route
router.post("/add", (req, res) => {
    //Validator implementation
    req.checkBody("title", "Title is required").notEmpty();
    // req.checkBody("author", "Author is required").notEmpty();
    req.checkBody("body", "Body is required").notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render("add_article", {
            title: "Add Article",
            errors: errors
        });
    } else {
        //Need body parser for this to work
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(err => {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash("success", "Article Added");
                res.redirect("/");
            }
        });
    }
});

//Update Submit POST Route
router.post("/edit/:id", (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id };

  Article.updateOne(query, article, err => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash("success", "Article Updated!");
            res.redirect("/");
        }
    });
});

//Deleting an article
router.delete("/:id", (req, res) => {
    if(!req.user._id){
        res.status(500).send();
    }

    let query = { _id: req.params.id };

    Article.findById(req.params.id, (err, article) => {
        if(article.author != req.user._id){
            res.status(500).send();
        } else {
            Article.remove(query, err => {
                if (err) console.log(err);
                res.send("Success");
            });
        }
    });
});


//Get Single Article
// : means that what's coming after is a placeholder and can be anything
router.get("/:id", (req, res) => {    
    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {
            res.render("article", {
                article,
                author: user.name
            });
        });
    });
});

module.exports = router;
