const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
let ObjectId = require("mongodb").ObjectID;
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nu4vl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Quicle Database connected");
    const database = client.db("quicledb");
    const cycleCollections = database.collection("cycles");
    const orderCollections = database.collection("orders");
    const reviewCollections = database.collection("reviews");
    const usersCollections = database.collection("users");
    const messageCollections = database.collection("messages");

    // Get all cycles from db
    app.get("/cycles", async (req, res) => {
      const cursor = cycleCollections.find({});
      const cycles = await cursor.toArray();
      res.json(cycles);
    });
    // Get cycles from db by ID
    app.get("/cycles/:id", async (req, res) => {
      const id = req.params;

      const query = { _id: ObjectId(id) };
      const cycle = await cycleCollections.findOne(query);
      res.json(cycle);
    });
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollections.find({});
      const cycles = await cursor.toArray();
      res.json(cycles);
    });

    // Get all users from db
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollections.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // // get orders from server and show to client
    // app.get("/orders", async (req, res) => {
    //   const email = req.query.email;
    //   const query = { email: email };
    //   const cursor = orderCollections.find(query);
    //   const orders = await cursor.toArray();
    //   res.json(orders);
    // });
    // get orders from server and show to client
    app.get("/orders", async (req, res) => {
      const cursor = orderCollections.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });
    // add cycles to db
    app.post("/cycles", async (req, res) => {
      const cycle = req.body;
      const result = await cycleCollections.insertOne(cycle);
      console.log(result);
      res.json(result);
    });
    // add Messages to db
    app.post("/messages", async (req, res) => {
      const message = req.body;
      const result = await messageCollections.insertOne(message);
      console.log(result);
      res.json(result);
    });
    // add orders to db
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollections.insertOne(order);
      console.log(result);
      res.json(result);
    });
    // add orders to db
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollections.insertOne(review);
      res.json(result);
    });
    // add users to db
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollections.insertOne(users);
      res.json(result);
      console.log(result);
    });
    // update user to db
    app.put("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollections.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });
    // update user role to db
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollections.updateOne(query, updateDoc);
      res.json(result);
    });
    // update status
    app.put("/orders/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      const updateDoc = { $set: { status: "approved" } };
      const result = await orderCollections.updateOne(filter, updateDoc);
      res.json(result);
      console.log(result);
    });

    // delete order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollections.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("Hello quicle server!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
