const { Sequelize } = require('sequelize');

let dbname = process.env.DB_NAME || "uoauth_test";
let dbusername = process.env.DB_USERNAME || "postgres";
let dbpass = process.env.DB_PASSWORD || "101";
let dbhost = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(dbname, dbusername, dbpass,
  {
    host: dbhost, 
    //  port: env.DATABASE_PORT,
    dialect: 'postgres',
    logging: false,
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
