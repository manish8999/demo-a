// var mysql = require('mysql');
// const express = require("express");
// const app = express();
// app.use(express.json());
// const bodyParser = require('body-parser');
// const body=bodyParser;

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'sqluser',
//   password: 'test123',
//   database:"post",
//   port:3306
// });
// const insertCustomerQuery = `
//   INSERT INTO customers (name, email, address)
//   VALUES ('John Doe', 'john@example.com', '123 Main Street')
// `;

// connection.query(insertCustomerQuery, (err, result) => {
//   if (err) throw err;
//   const generatedCustomerId = result.insertId;
//   const insertOrderQuery = `
//     INSERT INTO orders (customer_id, order_date, total_amount)
//     VALUES (?, '2023-07-30', 100.00)
//   `;

//   connection.query(insertOrderQuery, [generatedCustomerId], (err, result) => {
//     if (err) throw err;

//     console.log('Data inserted into orders table.');
//     connection.end();
//   });
// });

// app.listen(3000,(err)=>{
//   if(err){
//     console.log(err);

//   }
//   else{
//     console.log("Server Started At 3000 Port");
//   }
// })