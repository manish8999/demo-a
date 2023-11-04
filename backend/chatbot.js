const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Create a MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'test123',
    database:"connection",
    port:3306
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Handle chat interactions
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Save the user's message to the MySQL database
  const insertQuery = 'INSERT INTO messages (text) VALUES (?)';
  connection.query(insertQuery, [userMessage], (err, results) => {
    if (err) {
      console.error('Error inserting message:', err);
    } else {
      console.log('Message inserted into MySQL database');
    }
  });

  const selectQuery = 'SELECT * FROM messages ORDER BY id DESC LIMIT 10';
  connection.query(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error retrieving messages:', err);
    } else {
      const chatHistory = rows.reverse(); // Reverse the order to get the latest messages first
      res.json({ message: `You said: ${userMessage}`, chatHistory });
    }
  });
});
app.get('/api/chat-history', (req, res) => {
    console.log('GET request received');
    const selectQuery = 'SELECT * FROM messages ORDER BY id DESC LIMIT 10';
    connection.query(selectQuery, (err, rows) => {
      if (err) {
        console.error('Error retrieving messages:', err);
        res.status(500).json({ error: 'Failed to retrieve chat history' });
      } else {
        const chatHistory = rows.reverse();
        res.json({ chatHistory });
      }
    });
  });
  
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
