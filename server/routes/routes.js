const home = require('./home');
const auth = require('./auth');
const users = require('./users');
const todos = require('./todos');

module.exports = app => {
  app.use('/api', home);
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/todos', todos);
}