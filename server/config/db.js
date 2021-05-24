const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, 
    //  port: env.DATABASE_PORT,
    dialect: 'postgres',
    dialectOptios:{
      ssl:{
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      // underscored: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
    // operatorsAliases: false,

    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // }
  }
);

const connectPostgreSQL = () => {
  sequelize.authenticate()
  .then(() => console.log('Postgre Database connected...'.yellow.bold))
  .catch(err => console.log('ERROR: ' + err));
};


module.exports = {
  sequelize,
  Sequelize,
  connectPostgreSQL
};
