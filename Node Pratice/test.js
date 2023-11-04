const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'sqluser',
  password: 'test123',
  database: 'keka',
  port: 3306
});

app.use(bodyParser.json());

async function insertDataIntoTables(data) {
    try {
      const connection = await pool.getConnection();
  
      try {
        await connection.beginTransaction();
          const employeeData = {
          first_name: data.first_name,
          last_name: data.last_name,
          job_title: data.job_title,
          department: data.department,
          hire_date: data.hire_date,
          salary: data.salary,
          reporting_to: data.reporting_to,
          gender: data.gender,
          birth_date: data.birth_date,
          physical_handicapped: data.physical_handicapped,
          blood_group: data.blood_group,
          email_id: data.email_id,
        };
  
        const [employeeResult] = await connection.query('INSERT INTO employees SET ?', employeeData);
  
        const employeeId = employeeResult.insertId;
  
        const addressData = {
          employee_id: employeeId,
          street: data.street,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
        };
  
        await connection.query('INSERT INTO emp_address SET ?', addressData);
  
        await connection.commit();
  
        console.log('Data inserted successfully into both tables!');
      } catch (error) {
        await connection.rollback();
        console.error('Error inserting data:', error);
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error establishing a connection:', error);
      throw error;
    }
  }
  
app.post('/insert', async (req, res) => {
  try {
    await insertDataIntoTables(req.body);
    res.status(200).json({ message: 'Data inserted successfully into both tables!' });
  } catch (error) {
    res.status(500).json({ error: 'Error inserting data' });
  }
});



async function getAllData() {
    try {
      const connection = await pool.getConnection();
  
      try {
        const [employeesData] = await connection.query('SELECT * FROM employees');
          const [addressData] = await connection.query('SELECT * FROM emp_address');
  
        console.log('Data fetched successfully from both tables!');
        console.log('Employees Data:', employeesData);
        console.log('Address Data:', addressData);
  
        return { employeesData, addressData };
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error establishing a connection:', error);
      throw error;
    }
  }
  app.get('/getdata', async (req, res) => {
    try {
      const data = await getAllData();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  });
    
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
