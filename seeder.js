const fs = require('fs');
const dotenv = require('dotenv');
require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const {Todo, User} = require('./models');


// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const todos = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/todos.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Todo.create(todos);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Todo.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
