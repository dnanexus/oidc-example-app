const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config/config');
const routes = require('./routes');
const errorHandler = require('./errorHandler');
const uuid = require('uuid').v4;
const app = express();

app.use(session({
  secret: uuid(),
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);
app.use(errorHandler);


app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('Uncaught Exception!!!');
  console.log(err, origin);
});
