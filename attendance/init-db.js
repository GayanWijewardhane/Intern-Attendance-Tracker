const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Lakshani:qPUJ30N3lDRVh9wd@attendance.18uy66z.mongodb.net/?retryWrites=true&w=majority&appName=Attendance";

const sampleData = [
    {
        name: "Lakmini",
        attendance: {},
        tasks: {},
        lastUpdated: new Date()
    },
    {
        name: "Gayan",
        attendance: {},
        tasks: {},
        lastUpdated: new Date()
    },
    {
        name: "Yasith",
        attendance: {},
        tasks: {},
        lastUpdated: new Date()
    },
    {
        name: "Lakshani",
        attendance: {},
        tasks: {},
        lastUpdated: new Date()
    }
];

async function initDB() {
    let client;
    try {
        client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Successfully connected to MongoDB.");
        
        const db = client.db("attendance_tracker");
        const collection = db.collection("attendance");
        
        // Clear existing data
        await collection.deleteMany({});
        
        // Insert sample data
        const result = await collection.insertMany(sampleData);
        console.log(`Initialized database with ${result.insertedCount} records`);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    } finally {
        if (client) await client.close();
    }
}

initDB();
