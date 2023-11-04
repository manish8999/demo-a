const mysql = require('mysql');
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors"); // Import the cors middleware
app.use(express.json());

app.use(cors()); 
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser',
  password: 'test123',
  database: "post",
  port: 3306
});
app.post("/customers", (req, res) => {
  const customer = req.body;
  const insertCustomerQuery = `
    INSERT INTO customers (name, email, address)
    VALUES (?, ?, ?)
  `;

  connection.query(insertCustomerQuery, [customer.name, customer.email, customer.address], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error inserting customer" });
      return;
    }

    const generatedCustomerId = result.insertId;
    res.json({ customerId: generatedCustomerId });
  });
});

app.post("/orders", (req, res) => {
  const order = req.body;
  const insertOrderQuery = `
    INSERT INTO orders (customer_id, order_date, total_amount)
    VALUES (?, ?, ?)
  `;

  connection.query(insertOrderQuery, [order.customer_id, order.order_date, order.total_amount], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error inserting order" });
      return;
    }

    res.json({ message: "Order inserted successfully" });
  });
});
  
app.get("/customers", (req, res) => {
  const filterName = req.query.name;

  let getCustomersQuery = `
    SELECT orders.order_date, customers.name, customers.address, orders.total_amount,customers.email
    FROM customers
    JOIN orders ON customers.customer_id = orders.customer_id
  `;

  const queryParams = [];

  if (filterName) {
    getCustomersQuery += `
      WHERE customers.email LIKE ?
    `;
    queryParams.push(`%${filterName}%`); 
  }

  connection.query(getCustomersQuery, queryParams, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching customers" });
      return;
    }

    res.json(results);
  });
});


app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started At 3000 Port");
  }
});
