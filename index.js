const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v1znjtl.mongodb.net/?retryWrites=true&w=majority`;

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
        const cart = client.db("carDB").collection("cart");
        const users = client.db("carDB").collection("users");

        //receiving a new car from frontend
        app.post("/cars", async (req, res) => {
            const newCar = req.body;
            console.log(newCar);

            const result = await carsCollection.insertOne(newCar);
            res.send(result);
        });

        //sending cars to the cart page
        app.post("/cart", async (req, res) => {
            const recentlyAddedToCart = req.body;
            console.log(recentlyAddedToCart);

            const result = await cart.insertOne(recentlyAddedToCart);
            res.send(result);
        });

        app.post("/my-cart/:email", async (req, res) => {
            const recentlyAddedToCart = req.body;
            console.log(recentlyAddedToCart);

            const result = await cart.insertOne(recentlyAddedToCart);
            res.send(result);
        });

        // app.post("/cart", async (req, res) => {
        //     const cartItem = req.body;

        //     const result = await cartCollection.insertOne(cartItem);
        //     res.send(result);
        // });

        // sending users to the db
        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user.providerData.email);

            const result = await users.insertOne(user);
            res.send(result);
        });

        //getting user data
        app.get("/users", async (req, res) => {
            const cursor = users.find();

            const result = await cursor.toArray();
            res.send(result);
        });

        //all cars data
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

        // filtered cars by brand
        app.get("/cars/by_brand/:brandName", async (req, res) => {
            const brandName = req.params.brandName;
            const cursor = carsCollection.find({ brand: brandName });

            const result = await cursor.toArray();
            res.send(result);
        });

        //getting data for product car details
        app.get("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const car = await carsCollection.findOne(query);
            res.send(car);
        });

        //accessing the brands data to show on the home page
        app.get("/brands", async (req, res) => {
            const cursor = brandsCollection.find();

            const result = await cursor.toArray();
            res.send(result);
        });

        //getting data from the cart page
        app.get("/cart", async (req, res) => {
            const cursor = cart.find();

            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/my-cart/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };

            const cursor = cart.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        //updating car
        app.put("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const options = { upsert: true };
            const updatedCar = req.body;
            console.log(updatedCar);
            const car = {
                $set: {
                    name: updatedCar.name,
                    price: updatedCar.price,
                    brand: updatedCar.brand,
                    type: updatedCar.type,
                    image: updatedCar.image,
                    description: updatedCar.description,
                    rating: updatedCar.rating,
                },
            };

            const result = await carsCollection.updateOne(query, car, options);
            res.send(result);
        });

        //cart single data
        app.get("/cart/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await cart.findOne(query);
            res.send(result);
        });

        //deleting from cart
        app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await cart.deleteOne(query);
            res.send(result);
        });

        app.get("/my-cart/:email/:id", async (req, res) => {
            const email = req.params.email;
            const id = req.params.id;
            const query = { _id: new ObjectId(id), email: email };

            const result = await cart.findOne(query);
            res.send(result);
        });

        app.delete("/my-cart/:email/:id", async (req, res) => {
            const email = req.params.email;
            const id = req.params.id;
            const query = { _id: new ObjectId(id), email: email };

            const result = await cart.deleteOne(query);
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
