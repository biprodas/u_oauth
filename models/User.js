const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, sequelize } = require('../config/db');

const User = sequelize.define('user', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Name can not be null" },
      notEmpty: { msg: "Name can not be empty" },
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Password can not be null" },
      notEmpty: { msg: "Password can not be empty" },
      len: {
        min: 6,
        msg: "At least 6 character long"
      }
    }
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Phone can not be null" },
      notEmpty: { msg: "Phone can not be empty" },
      is: {
        args: /^(?:\+88|01)?(?:\d{11}|\d{13})$/i,
        msg: "Not a vaild phone number"
      }
    }
  },
  role: {
    type: Sequelize.ENUM,
    values: ['Admin', 'Operator', 'User'], // Suprer admin can only be set manually
    defaultValue: 'User'
  },
  
  status: {
    type: Sequelize.ENUM,
    values: ['Pending', 'Active', 'Inactive'],
    defaultValue: 'Active'
  }
},
  {
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    }
  })


// Encrypt password using bcrypt
User.beforeSave(async user => {
  // console.log(user.name, user.password, user.dataValues, user._changed.password)
  if (!user._changed.password) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
})

// Sign JWT and return
User.prototype.getSignedJwtToken = function () {
  return jwt.sign({
    id: this.id,
    name: this.name,
    username: this.username,
    role: this.role,
    project_id: this.project_id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user entered password to hashed password in database
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;