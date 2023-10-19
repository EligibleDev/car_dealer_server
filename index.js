const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.local || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://mikailhossain0202:uWojYGpeAOUSpcyU@cluster0.v1znjtl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection

        const carsCollection = client.db("carDB").collection("car");
        const brandsCollection = client.db("carDB").collection("brands");

        //receiving a new car from frontend
        app.post("/cars", async (req, res) => {
            const newCar = req.body;
            console.log(newCar);

            const result = await carsCollection.insertOne(newCar);
            res.send(result);
        });

        //getting cars data for the brands details page
        app.get("/cars", async (req, res) => {
            const cursor = carsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        //data for brand details page
        app.get("/brands/:name", async (req, res) => {
            const name = req.params.name;
            const query = { name: name };
            const brand = await brandsCollection.findOne(query);

            res.send(brand);
        });

        //accessing the brands data to show on the home page
        app.get("/brands", async (req, res) => {
            const cursor = brandsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("assignment_10_running...");
});

app.listen(port, () => {
    console.log(`assignment 10 is running on: ${port}`);
});
