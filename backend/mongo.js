const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Employee = require('./Models/Employee');
const Address = require('./Models/Address');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Manish2930:Manish@manish.nwa3k1c.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(error => {
        console.error('Database connection error:', error);
    });

app.post('/employees', async (req, res) => {
    try {
        const employeeData = req.body;
        const employee = await Employee.create(employeeData);
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Error creating employee' });
    }
});

app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find().populate('address');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employees' });
    }
});

app.post('/addresses', async (req, res) => {
    try {
        const addressData = req.body;
        const address = await Address.create(addressData);
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: 'Error creating address' });
    }
});

app.get('/addresses', async (req, res) => {
    try {
        const addresses = await Address.find();
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching addresses' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
