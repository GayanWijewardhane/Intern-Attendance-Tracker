const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const uri = "mongodb+srv://Lakshani:qPUJ30N3lDRVh9wd@attendance.18uy66z.mongodb.net/?retryWrites=true&w=majority&appName=Attendance";

async function startServer() {
    try {
        const client = await MongoClient.connect(uri);
        console.log("Successfully connected to MongoDB.");
        
        const db = client.db("attendance_tracker");
        const collection = db.collection("attendance");

        app.get('/api/attendance', async (req, res) => {
            try {
                const data = await collection.find({}).toArray();
                console.log("Fetched records:", data.length);
                res.json(data.map(record => ({
                    name: record.name,
                    attendance: record.data.attendance || {},
                    tasks: record.data.tasks || {}
                })));
            } catch (err) {
                console.error('Error fetching records:', err);
                res.status(500).json({ error: err.message });
            }
        });

        app.post('/api/attendance', async (req, res) => {
            try {
                console.log("Saving data for user:", req.body.name);
                const { name, data } = req.body;
                
                const result = await collection.updateOne(
                    { name: name },
                    { 
                        $set: {
                            name: name,
                            attendance: data.attendance,
                            tasks: data.tasks,
                            lastUpdated: new Date()
                        }
                    },
                    { upsert: true }
                );
                
                console.log("Save result:", result);
                res.json({ success: true });
            } catch (err) {
                console.error('Error updating record:', err);
                res.status(500).json({ error: err.message });
            }
        });

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

startServer();