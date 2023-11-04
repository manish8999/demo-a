// Import required modules
const mysql = require('mysql2/promise');

// Create a connection pool to reuse connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'sqluser',
    password: 'test123',
    database: "keka",
    port: 3306
});

async function insertDataIntoTables() {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      // Begin a transaction
      await connection.beginTransaction();

      // Data for the "employees" table
      const employeeData = {
        employee_id:1,
        first_name: 'John',
        last_name: 'Doe',
        job_title: 'Software Engineer',
        department: 'IT',
        hire_date: '2023-07-31',
        salary: 75000,
        reporting_to: 'Manager',
        gender: 'Male',
        birth_date: '1990-05-15',
        physical_handicapped: 'No',
        blood_group: 'O+',
        email_id: 'john.doe@example.com',
      };

      // Insert data into the "employees" table
      const [employeeResult] = await connection.query('INSERT INTO employees SET ?', employeeData);

      // Get the inserted employee ID
      const employeeId = employeeResult.insertId;

      // Data for the "emp_address" table
      const addressData = {
        employee_id: employeeId,
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
      };

      // Insert data into the "emp_address" table
      await connection.query('INSERT INTO emp_address SET ?', addressData);

      // Commit the transaction if everything is successful
      await connection.commit();

      console.log('Data inserted successfully into both tables!');
    } catch (error) {
      // Rollback the transaction if there's an error
      await connection.rollback();

      console.error('Error inserting data:', error);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Error establishing a connection:', error);
  }
}

// Call the function to insert data into tables
insertDataIntoTables();
