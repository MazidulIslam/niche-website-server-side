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
    // Get all Reviews from db
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollections.find({});
      const cycles = await cursor.toArray();
      res.json(cycles);
    });
    // add cycles to db
    app.post("/cycles", async (req, res) => {
      const cycle = req.body;
      const result = await cycleCollections.insertOne(cycle);
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
