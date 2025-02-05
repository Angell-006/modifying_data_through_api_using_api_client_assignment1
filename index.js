const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to database.'))
  .catch(err => console.log('Error connecting to database.', err));

// Defining mongoose schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// POST: Create menu item
app.post('/menu', (req, res) => {
  const { name, description, price } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const newItem = new MenuItem({ name, description, price });

  newItem.save()
    .then(item => res.status(201).json({ message: 'Menu item created successfully.', item }))
    .catch(error => res.status(500).json({ error: 'Failed to create menu item' }));
});

// GET: Fetch menu
app.get('/menu', (req, res) => {
  MenuItem.find()
    .then(items => res.status(200).json(items))
    .catch(error => res.status(500).json({ message: "Failed to fetch items", error }));
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
