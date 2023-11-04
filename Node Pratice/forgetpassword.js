const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

const secretKey = 'bsjghudqguihiwegiqhhejqgiwuejqwhehqwe'; 

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'manishdjagtap1026@gmail.com', 
    pass: 'rgsvtqjnkjzxlgty',
  },
});

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

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  connection.query(
    'SELECT * FROM register WHERE email = ?',
    [email],
    (err, rows) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (rows.length === 0) {
        res.status(404).json({ error: 'Email not found' });
        return;
      }

      const resetToken = crypto.randomBytes(20).toString('hex');

      const resetTokenExpiration = Date.now() + 3600000;
      const updateQuery = 'UPDATE register SET reset_token = ?, reset_token_expiration = ? WHERE email = ?';
      connection.query(updateQuery, [resetToken, resetTokenExpiration, email], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating reset token in the database: ', updateErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        const mailOptions = {
          from: 'manishdjagtap1026@gmail.com',
          to: email,
          subject: 'Password Reset', 
          html: `<p>Click the link below to reset your password:</p><a href="http://localhost:3000/reset-password?token=${resetToken}&email=${email}">Reset Password</a>`, // Email content with the reset link
        };

        transporter.sendMail(mailOptions, (mailErr, info) => {
          if (mailErr) {
            console.error('Error sending email: ', mailErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          console.log('Email sent: ', info.response);
          res.json({ message: 'Password reset link sent to your email' });
        });
      });
    }
  );
});

app.post('/reset-password', (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  connection.query(
    'SELECT * FROM register WHERE email = ? AND reset_token = ? AND reset_token_expiration > NOW()',
    [email, resetToken],
    (err, rows) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (rows.length === 0) {
        res.status(400).json({ error: 'Invalid or expired reset token' });
        return;
      }

      const user = rows[0];

      bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Error hashing new password: ', hashErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        const updatePasswordQuery = 'UPDATE register SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE email = ?';
        connection.query(updatePasswordQuery, [hashedPassword, email], (updatePasswordErr, updatePasswordResult) => {
          if (updatePasswordErr) {
            console.error('Error updating password in the database: ', updatePasswordErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          res.json({ message: 'Password reset successful' });
        });
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
