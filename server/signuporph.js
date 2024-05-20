const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Orphanage', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define Orphanage schema
const orphanageSchema = new mongoose.Schema({
    name: String,
    director: String,
    address: String,
    pincode: String,
    contact: String,
    email: String,
    registrationNumber: String,
    password: String // Add password field to the schema
});
const Orphanage = mongoose.model('Orphanage', orphanageSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Sign up route for orphanages
// Sign up route for orphanages
app.post('/signup', async (req, res) => {
    try {
        const { name, director, email, password } = req.body; // Destructure email and password from req.body

        // Check if email is already registered
       // const existingOrphanage = await Orphanage.findOne({ email });
       // if (existingOrphanage) {
        //    return res.status(400).json({ error: 'Email is already registered' });
       // }

        // Create new orphanage
        const newOrphanage = new Orphanage({
            name,
            director,
            email, // Add email to the new orphanage object
            password // Add password to the new orphanage object
        });

        console.log('New orphanage data:', newOrphanage); // Log the new orphanage data

        // Save orphanage to the database
        await newOrphanage.save();

        console.log('Orphanage saved successfully'); // Log success message

        res.status(201).json({ message: 'Orphanage signed up successfully' });
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});
