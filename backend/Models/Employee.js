// Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
