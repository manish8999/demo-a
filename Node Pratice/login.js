const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const app = express();
const port = 3001; 

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

const secretKey = 'wejejhebhdgsjdksdhgsidjskdmnsduhjwkdmnshd'; 

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query(
    'SELECT * FROM register WHERE username = ?',
    [username],
    (err, rows) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (rows.length === 0) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const user = rows[0];

      bcrypt.compare(password, user.password, (bcryptErr, result) => {
        if (bcryptErr) {
          console.error('Error comparing passwords: ', bcryptErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        if (!result) {
          res.status(401).json({ error: 'Invalid credentials' });
          return;
        }

        const token = jwt.sign({ username: user.username }, secretKey, {
          expiresIn: '1h', 
        });

        res.json({ token });
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
