const router = require('express').Router();
const {home} = require('./controllers/homeController')
const {login, callback, getJWKS} = require('./controllers/authController');

router.get('/', home);
router.post('/login', login);
router.get('/callback', callback);
router.get('/.well-known/jwks.json', getJWKS);

module.exports = router;
