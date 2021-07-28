var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function (req, res, next) {
    if (req.query.fail) {
        return res.render('login', { title: 'Login', message: 'Usuário e/ou senha inválidos' });
    } else {
        res.render('login', { title: 'Login', message: null });
    }
});

router.get('/login', function (req, res, next) {
    if (req.query.fail) {
        return res.render('login', { title: 'Login', message: 'Usuário e/ou senha inválidos' });
    } else {
        res.render('login', { title: 'Login', message: null });
    }
});

router.post('/login', passport.authenticate('local', { successRedirect: '/index', failureRedirect: '/?fail=true' }));

router.post('/logoff', (req, res, next) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;
