var express = require('express');
const router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/:pagina?', authenticationMiddleware(), function (req, res, next) {
  const paginaAtual = parseInt(req.params.pagina || 1);

  db.countAllUsers((err, qtd) => {
    if (err)
      return console.error(err);

    const qtdPaginas = Math.ceil(qtd / db.limiteElementosPorPagina) // Arredonda pra cima;

    db.findAllUsers(paginaAtual, (err, docs) => {
      if (err)
        return console.error(err);

      console.log(docs);
      return res.render('index', { title: req.user.username, docs, qtd, qtdPaginas, paginaAtual, profile: req.user.profile });
    });
  })
});

module.exports = router;