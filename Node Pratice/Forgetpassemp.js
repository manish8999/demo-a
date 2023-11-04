const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

// Nodemailer configuration
// let testAccount= nodemailer.createTestAccount();
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   secure: false,
//   auth: {
//     user: testAccount.user,
//     pass: testAccount.pass,
//   },
// });

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

// User Login API endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Hash the provided password for comparison with the hashed password in the database
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  // Check if the email and hashed password match in the database
  connection.query(
    'SELECT * FROM register WHERE email = ? AND password = ?',
    [email, hashedPassword],
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

      console.log('User logged in successfully');
      res.json({ message: 'User logged in successfully' });
    }
  );
});

// Forgot Password API endpoint
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Generate a reset token and set the expiration time (one hour from now)
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiration = Date.now() + 3600000;

  // Update the reset token and reset token expiration in the database
  connection.query(
    'UPDATE register SET reset_token = ?, reset_token_expiration = ? WHERE email = ?',
    [resetToken, resetTokenExpiration, email],
    (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating reset token in the database: ', updateErr);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      let config = {
        service: "gmail",
        auth: {
            user: 'manishdjagtap1026@gmail.com', 
            pass: 'rgsvtqjnkjzxlgty',
        },
      };
      let transporter = nodemailer.createTransport(config);
        
        let message={
          from: 'manishjagtap1026@gmail.com', // sender address
          to: "manishjagtap1026@gmail.com", // list of receivers
          subject: 'Password Reset',
          html: `<p>Click the link below to reset your password:</p>
                <a href="http://localhost:3000/reset-password?token=${resetToken}&email=${email}">Reset Password</a>`,
        }
        transporter.sendMail(message).then((info)=>{
          return res.status(201).json({
              msg:"You Should Recived An Mail",        
          })
          }).catch(error=>{
              return res.status(500).json({error})
        })
    }
  );
});


// Reset Password API endpoint
app.post('/reset-password', (req, res) => {
    const { email, token, newPassword } = req.body;
  
    // Check if the email and reset token match in the database
    connection.query(
      'SELECT * FROM register WHERE email = ? AND reset_token = ? AND reset_token_expiration > ?',
      [email, token, Date.now()],
      (err, rows) => {
        if (err) {
          console.error('Error querying database: ', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        if (rows.length === 0) {
          res.status(400).json({ error: 'Invalid reset token or expired link' });
          return;
        }
  
        // Hash the new password before updating it in the database
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
  
        // Update the password and reset token in the database
        connection.query(
          'UPDATE register SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE email = ?',
          [hashedPassword, email],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error('Error updating password in the database: ', updateErr);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }
  
            console.log('Password reset successful');
            res.json({ message: 'Password reset successful' });
          }
        );
      }
    );
  });
  


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
