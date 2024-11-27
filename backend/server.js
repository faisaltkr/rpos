const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const { exec, execFile, spawn, fork } = require('child_process');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Node.js Backend is running!');
});

app.get('/api/items', (req, res) => {
    //const newItem = req.body;
    // Logic to save the item (e.g., to a database)
    res.status(201).json({ message: 'Item added successfully!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}