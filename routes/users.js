const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.render('register');
  } else {
    res.locals.user = req.user;
    res.redirect('/search');
  }
});


// Register Process
router.post('/register', function(req, res){
  // Get inputed values
  const email = req.body.email.toLowerCase();
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  // Check values through ExpressValidator
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('agreement', 'You did not sign the agreement').notEmpty();

  let validErrors = req.validationErrors();
  if(validErrors){
    res.render('register',{
      errors:validErrors
    });
  } else {
    // Check email & username in database
    checkOnExist(email, username, function(err, user, existEmail, existUsername) {
      if (err) {
        console.log(err);
      }
      if (!existEmail && !existUsername){
        createUser();
      } else {
        if (existEmail) {req.flash("danger", "Email is exist");}; // Email is already exist
        if (existUsername) {req.flash("danger", "Username is exist");}; // Username is already exist
        res.redirect('/users/register');
      }
    });
  };

  function checkOnExist(email, username, callback) {
    let existEmail = false;
    let existUsername = false;
    User.findOne({email: email}, function(err, user) {
      if (err) {
        callback(err, null, true, true);
      } else {
          if (user){
            existEmail = true;
          }
          User.findOne({username: username}, function(err, user) {
            if (err) {
              callback(err, null, true, true);
            } else {
                if (user){
                  existUsername = true;
                }
                callback(null, user, existEmail, existUsername);
              }
          });
        }
    });
  };

  function createUser(){
    let newUser = new User({
      email:email,
      username:username,
      password:password
    });
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          return console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if (err){
            return console.log(err);
          } else {
            req.flash("success", "Successful registered.");
            res.redirect('/users/login');
          }
        })
      });
    });
  };
});

//Login Form
router.get('/login', function(req, res){
  if (!req.user){
    res.locals.user = null;
    res.render('login');
  } else {
    res.locals.user = req.user;
    res.redirect('/search');
  }
});

// Login Process
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }), function(req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
      } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
      }
      res.redirect('/');
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/users/login');
});
module.exports = router;