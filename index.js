const fs = require('fs');
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
