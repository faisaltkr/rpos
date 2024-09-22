const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Route to receive customer data and write to customers.json
app.post('/save-customers', (req, res) => {
  const customers = req.body;

  // Save to customers.json file
  fs.writeFile('customers.json', JSON.stringify(customers, null, 2), (err) => {
    if (err) {
      console.error('Error writing to customers.json:', err);
      res.status(500).send('Error saving customer data.');
    } else {
      console.log('Customer data saved to customers.json');
      res.send('Customer data saved successfully.');
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
