const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

// MySQL Connection Configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'test123',
    database: 'keka',
    port: 3306
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database!');
});

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Register API endpoint
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Hash the password before storing it (you should use a more secure method in production)
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  // Check if the email is already registered
  connection.query(
    'SELECT * FROM register WHERE email = ?',
    [email],
    (err, rows) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (rows.length > 0) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }

      // If the email is not registered, insert the user into the database
      const insertQuery = 'INSERT INTO register (username, password, email, reset_token, reset_token_expiration) VALUES (?, ?, ?, ?, ?)';
      const resetToken = ''; // Set to empty string initially
      const resetTokenExpiration = null; // Set to null initially
      connection.query(
        insertQuery,
        [username, hashedPassword, email, resetToken, resetTokenExpiration],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error inserting user into the database: ', insertErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          console.log('User registered successfully');
          res.json({ message: 'User registered successfully' });
        }
      );
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
