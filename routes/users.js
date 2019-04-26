const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


//Brin in User Model
let User = require('../models/user');


//Register Form
router.get('/register', (req, res) => {
    res.render('register');
});

//Register Process
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    //express-validator usage
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password2 is required').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors
        });
    } else {
        let newUser = new User({
            name,
            email,
            password,
            username
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err)console.log(err);
                newUser.password = hash;
                newUser.save(err => {
                    if(err){
                        console.log(err);
                    } else {
                        req.flash('success', 'You are now registered and can log in!');
                        res.redirect('/users/login');
                    }
                });
            });
        })
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;