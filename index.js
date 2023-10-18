const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.local || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mikailhossain0202
//uWojYGpeAOUSpcyU

const uri =
    "mongodb+srv://mikailhossain0202:uWojYGpeAOUSpcyU@cluster0.v1znjtl.mongodb.net/?retryWrites=true&w=majority";

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
