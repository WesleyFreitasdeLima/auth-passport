var express = require('express');
const router = express.Router();

router.get('/', authenticationMiddleware(), function (req, res, next) {
    res.render('reports', { title: "Reports" });
});

module.exports = router;