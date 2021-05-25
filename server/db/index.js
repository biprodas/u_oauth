const { Client } = require("pg");
const dbname = process.env.NODE_ENV === "test" ? "uoauth_test" : "uoauth";

client = new Client({
  connectionString: `postgresql://postgres:101@localhost/uoauth_test`
});

// const connectionString = `postgresql://postgres:101@localhost/uoauth-test`


// client = new Client({
//   host: 'localhost',
//   user: 'postgres',
//   password: '101',
//   database: 'uoauth_test',
// });

client.connect();

module.exports = client;