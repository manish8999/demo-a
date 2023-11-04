const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const app = express();
const port = 3000; 

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'test123',
    database: 'keka',
    port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const secretKey = 'jsvdghsvdsbhvdghsdfsvghdvsghdvs'; 

app.post('/register', (req, res) => {
  const { username, password,email } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const newUser = { username, password: hashedPassword,email };
    connection.query('INSERT INTO register SET ?', newUser, (err, result) => {
      if (err) {
        console.error('Error inserting user into the database: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const token = jwt.sign({ username: newUser.username }, secretKey, {
        expiresIn: '1h',
      });

      res.json({ token });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
