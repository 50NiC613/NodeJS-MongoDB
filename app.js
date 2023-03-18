const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const port = 3000;
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products')
const categoriesRouter = require('./routes/categories')
const ordersRouter = require('./routes/orders')
const app = express();
require('dotenv/config');
const errorHandler = require('./helpers/error-handler');
const authJwt=require('/helpers/jwt')


//middlewares
app.use(cors());
app.use(errorHandler());
app.options('*',cors);
app.use(logger('dev'));
app.use(authJwt());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//connexion a localhost mongodb
mongoose.connect('mongodb://127.0.0.1:27017/tienda',
    {"useNewUrlParser": true, "useUnifiedTopology": true})
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch(err => console.log(err));

//routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/categories', categoriesRouter);

// catch error 404 y dar la respuesta
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res) {
  // poner los locals que solo den error en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render de la página de error
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`El servidor esta corriendo en http://localhost:${port}`);
});

module.exports = app;