const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./db');

const indexRouter = require('./routes/index');
const listAvailabilitiesRouter = require('./routes/listAvailabilities');
const listReservationsRouter = require('./routes/listReservations');
const createReservationRouter = require('./routes/createReservation');
const createAvailabilityRouter = require('./routes/createAvailability');

const app = express();
db.initDb();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// api routes
app.use('/', indexRouter);
app.use('/listAvailabilities', listAvailabilitiesRouter);
app.use('/listReservations', listReservationsRouter);
app.use('/createReservation', createReservationRouter);
app.use('/createAvailability', createAvailabilityRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
