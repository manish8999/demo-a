// var mysql = require('mysql');
// const express = require("express");
// const app = express();
// app.use(express.json());
// const bodyParser = require('body-parser');
// const body=bodyParser;
// const cors = require('cors');
// app.use(cors());

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'sqluser',
//   password: 'test123',
//   database:"connection",
//   port:3306
// });
// // app.post('/post',(req,res)=>{
// //   const idstudent=req.body.idstudent;
// //   const studname=req.body.studname;
// //   const stutaddress=req.body.stutaddress;
// //   con.query('insert into student values(?,?,?)',[idstudent,studname,stutaddress],(err,result)=>{
// //     if(err){
// //       console.log(err)
// //     }
// //     else{
// //       res.send("POSTED");

// //     }
// //   })
// // })

// // app.get('/data', (req, res) => {
// //   const query = 'SELECT * FROM piechart';
// //   connection.query(query, (error, results) => {
// //     if (error) throw error;

// //     if (results.length === 0) {
// //       // Handle empty result
// //       res.json([]);
// //       return;
// //     }

// //     const data = results.map((item) => {
// //       return {
        
// //         label: item.label, // Modify according to your column names
// //         value: item.value,
// //       };
// //     });

// //     res.json(data);
// //   });
// // });
// app.get('/data', (req, res) => {
//   const query = 'SELECT * FROM piechart';
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing MySQL query:', error);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }
//     res.json(results);
//   });
// });


// const pool = mysql.createPool(connection);

// app.post('/api/postData', async (req, res) => {
//   try {
//     const { quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel } = req.body;

//     // Insert data into the database
//     const connection = await pool.getConnection();
//     await connection.query(
//       'INSERT INTO connection.signaldata (quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       [quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel]
//     );
//     connection.release();

//     res.status(201).json({ message: 'Data saved successfully' });
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).json({ error: 'An error occurred while saving data' });
//   }
// });

// app.listen(4000,(err)=>{
//   if(err){
//     console.log(err);

//   }
//   else{
//     console.log("Server Start");
//   }
// })


const express = require('express');
const cors = require('cors'); // Import the cors middleware
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());
// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'sqluser',
  password: 'test123',
  database:"connection",
  port:3306
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

app.use(express.json());

// Define a route to handle the POST request
app.post('/api/postData', async (req, res) => {
  try {
    const { quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel } = req.body;

    // Insert data into the database
    const connection = await pool.getConnection();
    console.log(connection)
    await connection.query(
      'INSERT INTO connection.signaldata (quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel]
    );
    connection.release();

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'An error occurred while saving data' });
  }
});



app.post('/post', async (req, res) => {
  try {
    const { quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel,avgofrank,Anedotes,tags,suggestedLinks,durationanecdotes } = req.body;

    // Create the postData object
    const postData = {
      quizName: quizName,
      selectedOption: selectedOption,
      Delivery: Delivery,
      Content: Content,
      level: level,
      Duration: Duration,
      rankdelivery: rankdelivery,
      rankcontent: rankcontent,
      ranklevel: ranklevel,
      rankduration: rankduration,
      avgofrank:avgofrank,
      Anedotes:Anedotes,
      tags:tags,
      suggestedLinks:suggestedLinks,
      durationanecdotes:durationanecdotes
    };

    // Insert data into the database
    pool.query(
      'INSERT INTO connection.signaldata (quizName, selectedOption, Delivery, Content, level, Duration, rankdelivery, rankcontent, rankduration, ranklevel,avgofrank,Anedotes,tags,suggestedLinks,durationanecdotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)',
      [postData.quizName, postData.selectedOption, postData.Delivery, postData.Content, postData.level, postData.Duration, postData.rankdelivery, postData.rankcontent, postData.rankduration, postData.ranklevel,postData.avgofrank,postData.Anedotes,postData.tags,postData.suggestedLinks,postData.durationanecdotes],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'An error occurred while saving data' });
        } else {
          res.send('POSTED');
        }
      }
    );
    res.status(200).json({ success: 'Posted' });

  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'An error occurred while saving data' });
  }
});

app.post('/updateData', (req, res) => {
  const updatedData = req.body; // Updated data received in the request body

  // Update the data in the MySQL database using SQL queries
  const query = 'UPDATE connection.signaldata SET ? WHERE id = ?'; // Replace 'your_table' and 'id' with your table and identifier
  pool.query(query, [updatedData, updatedData.id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ message: 'Error updating data' });
    } else {
      console.log('Data updated successfully');
      res.json({ message: 'Data updated successfully' });
    }
  });
  res.json({ message: 'Data updated successfully' });

});
app.get('/getData', async (req, res) => {
  try {
    const query = 'SELECT * FROM connection.signaldata';
    const [rows] = await pool.query(query); 

    res.json(rows);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
