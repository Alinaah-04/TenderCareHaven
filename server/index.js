const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Connection URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to add student data to the database
app.post('/api/students', async (req, res) => {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB');

        // Get a reference to the database
        const database = client.db();

        // Get a reference to the students collection
        const collection = database.collection('students');

        // Insert the student data into the collection
        const result = await collection.insertOne(req.body);
        console.log('Inserted student data:', result.insertedId);

        res.status(201).send('Student data added successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Close the connection
        await client.close();
        console.log('Disconnected from MongoDB');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
