const {Sequelize, sequelize} = require('../config/db');

const Todo = sequelize.define('todo', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: { msg: "Title can not be null" }, 
      notEmpty: { msg: "Title can not be empty" },
    }
  },
  description: Sequelize.STRING,
  status: Sequelize.STRING
})

module.exports = Todo;