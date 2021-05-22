const home = require('./home');
const auth = require('./auth');
const users = require('./users');
const todos = require('./todos');

module.exports = app => {
  app.use('/api/v1', home);
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/users', users);
  app.use('/api/v1/todos', todos);
}