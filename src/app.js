const express = require('express');
const session = require('express-session');
const { csrf } = require('lusca');
const { randomUUID }  = require('crypto');
const { URL } = require('url');
const bodyParser = require('body-parser');
const config = require('./config/config');
const routes = require('./routes');
const errorHandler = require('./errorHandler');

const callbackProtocol = new URL(config.oidc.redirect_url).protocol;

const app = express();

app.use(session({
  secret: randomUUID(),
  cookie: { maxAge: 60000, secure: callbackProtocol === 'https:'},
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrf());

app.use('/', routes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('Uncaught Exception!!!');
  console.log(err, origin);
});
