const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Setup
mongoose.connect('mongodb://localhost:27017/locationDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Location schema and model
const locationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now }
});
const Location = mongoose.model('Location', locationSchema);

// ✅ Handle POST from client
app.post('/location', async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log('Received location:', latitude, longitude);

    try {
        const newLocation = new Location({ latitude, longitude });
        await newLocation.save();

        res.json({ message: 'Location saved successfully!' });
    } catch (err) {
        console.error('Error saving to DB:', err);
        res.status(500).json({ message: 'Failed to save location' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
