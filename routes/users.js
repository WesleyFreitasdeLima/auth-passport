var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function (req, res, next) {
  if (req.query.fail) {
    res.render('signup', { title: "Signup", message: 'Falha no cadastro do usuario!' });
  } else {
    res.render('signup', { title: "Signup", message: null });
  }
});

router.post('/signup', (req, res) => {
  const db = require('../db');
  db.createUser(req.body.username, req.body.password, req.body.email, req.body.profile, (err, result) => {
    if (err)
      return res.redirect('/user/signup?fail=true')
    else {
      const text = `Obrigado por se cadastrar ${req.body.username}, sua senha de acesso é ${req.body.password}`;
      require('../mail')(req.body.email, 'Cadastro realizado com sucesso', text);
    }
    return res.redirect('/');
  });
});

router.post('/forgot', (req, res) => {
  const db = require('../db');
  db.resetPassword(req.body.email, (err, result, nPasswd) => {
    if (err)
      return res.redirect('/user/forgot?fail=true');
    else {
      const text = `Olá sua nova senha é ${nPasswd}, sua senha antiga não funciona mais!`;
      require('../mail')(req.body.email, 'Sua senha foi alterada', text);
    }
    return res.redirect('/');
  });
});

router.get('/forgot', (req, res, next) => {
  res.render('forgot', { title: "Forgot" });
});

module.exports = router;
