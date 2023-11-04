const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser',
  password: 'test123',
  database: 'keka',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database!');
});

app.use(bodyParser.json());

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'manishdjagtap1026@gmail.com',
    pass: 'rgsvtqjnkjzxlgty',
  },
});

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

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

      const insertQuery = 'INSERT INTO register (username, password, email, reset_token, reset_token_expiration) VALUES (?, ?, ?, ?, ?)';
      const resetToken = ''; 
      const resetTokenExpiration = null; 
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

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

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

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiration = Date.now() + 3600000;

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
          from: 'manishjagtap1026@gmail.com', 
          to: email,
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

app.get('/reset-password', (req, res) => {
  const { token, email } = req.query;
  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Example</title>
</head>
<body>
  <h1>Place Order</h1>
  <form id="orderForm">
  <input type="hidden" name="token" value="${token}">
<input type="hidden" name="email" value="${email}">
    <label for="newPassword">New Password:</label>
    <input type="password" id="newPassword" name="newPassword" required>
    <button type="submit">Reset Password</button>
  </form>
  <script>
    document.getElementById("orderForm").addEventListener("submit", function(event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const order = {
        email: formData.get("email"),
        token: formData.get("token"),
        newPassword: formData.get("newPassword")
      };

      fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Do something with the response data if needed
      })
      .catch(error => {
        console.error("Error:", error);
      });
    });
  </script>
</body>
</html>

  `);
});

app.post('/reset-password', (req, res) => {
    const { email, token, newPassword } = req.body;
  
    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
  
    connection.query(
      'UPDATE register SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE email = ? AND reset_token = ?',
      [hashedPassword, email, token],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating password in the database: ', updateErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        if (updateResult.affectedRows === 0) {
          res.status(400).json({ error: 'Invalid email or token' });
          return;
        }
  
        console.log('Password reset successful');
        res.json({ message: 'Password reset successful' });
      }
    );
  });
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
