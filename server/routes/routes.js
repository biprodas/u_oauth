const home = require('./home');
const auth = require('./auth');
const users = require('./users');
const refreshTokens = require('./resfreshToken');


module.exports = app => {
  app.use('/api', home);
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/refreshTokens', refreshTokens);
}