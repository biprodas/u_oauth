const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
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
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Username can not be null" },
      notEmpty: { msg: "Username can not be empty" },
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
  role: {
    type: Sequelize.ENUM,
    values: ['Admin', 'Operator', 'User'], // Suprer admin can only be set manually
    defaultValue: 'User'
  },
  // refresh_token: Sequelize.STRING,

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
  return JWT.sign({
    id: this.id,
    name: this.name,
    username: this.username,
    role: this.role,
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

User.prototype.getSignedAccessToken = function () {
  const payload = { id: this.id, username: this.username };
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const options = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES||'5*m').replace("*", ""),
    // issuer: 'biprodas.me',
    // audience: this.id,
  }
  return JWT.sign(payload, secret, options);
};

// dorkar nai
// User.prototype.getSignedRefreshToken = function () {
//   const payload = { id: this.id, username: this.username };
//   const secret = process.env.REFRESH_TOKEN_SECRET;
//   const options = {
//     expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d',
//     // issuer: 'biprodas.me',
//     // audience: this.id,
//   }
//   return JWT.sign(payload, secret, options);
// };

// User.prototype.verifyRefreshToken = function (refresh_token) {
//   const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
//   // check from cokiee or redis
// };


// Match user entered password to hashed password in database
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;