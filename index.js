const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvq0dey.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db("toyMarketplace").collection("toys");
    const newToysCollection = client.db("toyMarketplace").collection("newToys")

    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        projection: {
          image: 1,
          name: 1,
          price: 1,
          description: 1,
          seller: 1,
          quantity: 1,
          rating: 1,
          subCategory: 1,
        },
      };

      const result = await toysCollection.findOne(query, options);
      res.send(result);
    });

    app.get("/toys/category/:category", async (req, res) => {
      const category = req.params.category;
      const query = {
        subCategory: category,
      };

      const options = {
        projection: {
          image: 1,
          name: 1,
          price: 1,
          description: 1,
          seller: 1,
          quantity: 1,
          rating: 1,
          subCategory: 1,
        },
      };

      const result = await toysCollection.find(query, options).toArray();
      res.send(result);
    });

    app.get("/newToys", async (req, res) => {
      console.log(req.query.email)
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = newToysCollection.find(query);
      const result = await cursor.toArray();
      console.log(result)
      res.send(result);
    });

    app.post('/newToys', async (req, res) => {
      const newToy = req.body
      console.log(newToy)
      const result = await newToysCollection.insertOne(newToy)
      // console.log(result)
      res.send(result)
    })

    app.get("/newToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: {
          photo: 1,
          name: 1,
          price: 1,
          description: 1,
          sellerName: 1,
          sellerEmail: 1,
          quantity: 1,
          rating: 1,
          subCategory: 1,
        },
      };

      const result = await newToysCollection.find(query, options).toArray();
      res.send(result);
    });

    app.patch('/newToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const updatedToy = req.body
      console.log(updatedToy)

      const updateDoc = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          description: updatedToy.description,
        },
      }

      const result = await newToysCollection.updateOne(query, updateDoc);
      res.send(result)
    })

    app.delete('/newToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await newToysCollection.deleteOne(query);
      console.log(result)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();toyMarketplace
  }
}
run().catch(console.dir);

// toyMarketplace
// 0xtbCKq4fQYafZbe

app.get("/", (req, res) => {
  res.send("Toys are playing");
});

app.listen(port, () => {
  console.log(`Toys are playing on port ${port}`);
});
