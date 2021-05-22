const { Sequelize, sequelize } = require('../config/db');

const User = require('./User')
const Todo = require('./Todo')


module.exports = {
  User,
  Todo,
}