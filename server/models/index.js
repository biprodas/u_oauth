const { Sequelize, sequelize } = require('../config/db');

const User = require('./User')
const RefreshToken = require('./RefreshToken')

User.hasMany(RefreshToken);
RefreshToken.belongsTo(User);

module.exports = {
  User,
  RefreshToken
}