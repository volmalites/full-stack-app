'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// load api routes
const usersRoute = require('./routes/users');
const coursesRoute = require('./routes/courses');

// Test database connection with authenticate
const sequelize = require('./models').sequelize;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// cross origin support
app.use(cors({
  exposedHeaders: ['Location'],
}));

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// api route
app.use('/api/users', usersRoute);
app.use('/api/courses', coursesRoute);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => error.message);
    res.status(400).json({ errors });
  } else {
    res.status(err.status || 500).json({
      message: err.message,
      error: {},
    });
  }
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
