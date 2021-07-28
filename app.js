var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

global.authenticationMiddleware = () => {
  return function (req, res, next) {
    if (req.isAuthenticated()) {

      const temPermissao = require('./permissions')(req);
      if (temPermissao) {
        return next();
      } else {
        res.send('Não autorizado!');
      }

    }
    res.redirect('/login?fail=true');
  }
};

var app = express();

// autenticacao
require('./auth.js')(passport);
const sessionStore = new MongoStore({
  client: CONN,
  dbName: process.env.MONGO_DB,
  ttl: 30 * 60 // 30 minutos
});
app.use(session({
  // Chave de seguraça para criptografar o cookie
  secret: process.env.MONGO_STORE_SECRET,

  // Atualiza o cookie à cada requisição
  resave: false,

  // Armazena cookie até mesmo de sessões anônimas
  saveUninitialized: false,

  // Salva a sessão no MongoDB
  store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const reportsRouter = require('./routes/reports');

app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/reports', reportsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: `Error ${err.status}` });
});

module.exports = app;
