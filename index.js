/*const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loadUsers() {
  if (!fs.existsSync('users.json')) {
    fs.writeFileSync('users.json', '[]');
  }
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

function askCredentials() {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      let users = loadUsers();
      const existingUser = users.find(user => user.username === username && user.password === password);

      if (existingUser) {
        console.log('Login Successfully');
      } else {
        const userExists = users.find(user => user.username === username);
        if (userExists) {
          console.log('Wrong password for existing user.');
        } else {
          users.push({ username, password });
          saveUsers(users);
          console.log('User added successfully.');
        }
      }

      rl.close();
    });
  });
}

askCredentials();
*/
const fs = require('fs');
const readline = require('readline');
const bcrypt = require('bcrypt');
const usersFile = 'users.json';

// Create users.json if it doesn't exist
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, '[]');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load users
function loadUsers() {
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Ask login or register
function askAction() {
  rl.question("Do you want to login or register? (login/register): ", (action) => {
    if (action === "login") {
      loginUser();
    } else if (action === "register") {
      registerUser();
    } else {
      console.log("Invalid choice. Try again.");
      askAction();
    }
  });
}

// Register
function registerUser() {
  rl.question("Choose a username: ", (username) => {
    rl.question("Choose a password: ", async (password) => {
      let users = loadUsers();
      const exists = users.find(user => user.username === username);

      if (exists) {
        console.log("Username already exists.");
        rl.close();
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      users.push({ username, password: hashedPassword });
      saveUsers(users);
      console.log("User registered successfully!");
      rl.close();
    });
  });
}

// Login
function loginUser() {
  rl.question("Enter your username: ", (username) => {
    rl.question("Enter your password: ", async (password) => {
      let users = loadUsers();
      const user = users.find(u => u.username === username);

      if (!user) {
        console.log("User not found.");
        rl.close();
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        console.log("Login successful!");
      } else {
        console.log("Wrong password.");
      }
      rl.close();
    });
  });
}

askAction();
