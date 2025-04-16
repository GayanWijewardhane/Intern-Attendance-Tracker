const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

const uri = "mongodb+srv://Lakshani:qPUJ30N3lDRVh9wd@attendance.18uy66z.mongodb.net/?retryWrites=true&w=majority&appName=Attendance";

// MongoDB routes
app.get('/api/attendance', async (req, res) => {
    try {
        const client = await MongoClient.connect(uri);
        const db = client.db("attendance_tracker");
        const data = await db.collection("attendance").find({}).toArray();
        await client.close();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/attendance', async (req, res) => {
    try {
        const client = await MongoClient.connect(uri);
        const db = client.db("attendance_tracker");
        await db.collection("attendance").updateOne(
            { name: req.body.name },
            { $set: req.body },
            { upsert: true }
        );
        await client.close();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
