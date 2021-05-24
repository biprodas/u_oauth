const {Sequelize, sequelize} = require('../config/db');

const RefreshToken = sequelize.define('refresh_token', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "User Id can not be null" }, 
      notEmpty: { msg: "User Id can not be empty" },
    }
  },
  token: Sequelize.STRING,
  expiresIn: Sequelize.DATE,
  revokedAt: Sequelize.DATE,
  revokedByIp: Sequelize.STRING,
  createdByIp: Sequelize.STRING,
  replacedByToken: Sequelize.STRING,

  isExpired: {
    type: Sequelize.VIRTUAL,
    get() {
      return Date.now() >= this.expiresIn;
    },
  },
  isActive: {
    type: Sequelize.VIRTUAL,
    get() {
      return !this.revokedAt && !this.isExpired;
    },
  },
})

module.exports = RefreshToken;

