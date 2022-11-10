const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6fgntc0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//

// function verifyJwt(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "unauthorized user" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//      return res.status(401).send({ message: "unauthorized access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// } 


//

async function run(){
    try{
      const serviceCollection = client
        .db("wildlife-studio")
        .collection("reviews");

      const reviewsCollection = client
        .db("wildlife-studio")
        .collection("addReviews");
      // token

      // app.post("/jwt", (req, res) => {
      //   const user = req.body;
      //   console.log(user);
      //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      //     expiresIn: "1h",
      //   });
      //   res.send({ token });
      // });

      app.get("/services", async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services);
      });

      app.post("/services", async (req, res) => {
        const addServices = req.body;
        const result = await serviceCollection.insertOne(addServices);
        res.send(result);
      });

      app.post("/allReviews", async (req, res) => {
        const allReview = req.body;
        const result = await reviewsCollection.insertOne(allReview);
        console.log(result);
        res.send(result);
      });

      //verifyJwt,
      app.get("/allReviews", async (req, res) => {
        const decoded = req.decoded;
        console.log("inside la la orderapi", decoded);
        //    if (decoded.email !== req.query.email) {
        //      res.status(403).send({ message: "unauthorized access" });
        //    }
        let query = {};
        if (req.query.email) {
          query = {
            email: req.query.email,
          };
        }
        const cursor = reviewsCollection.find(query);
        const allreviews = await cursor.toArray();
        console.log('allreviews collection', allreviews);
        res.send(allreviews);
      });

      app.get("/allReviews/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const allreview = await reviewsCollection.findOne(query);
        res.send(allreview);
      });

      app.get("/allReviews/:id", async (req, res) => {
        //    const decoded = req.decoded;
        //    console.log("inside orderapi", decoded);
        //    if (decoded.email !== req.query.email) {
        //      res.status(403).send({ message: "unauthorized access" });
        //    }
        const id = req.params.id;
        let query = { _id: ObjectId(id) };
        if (req.query.email) {
          query = {
            email: req.query.email,
          };
        }
        const reviewsId = await reviewsCollection.findOne(query);
           const allreviews = await cursor.toArray();
          console.log('allreviews email query ', allreviews);
        res.send(reviewsId);
      });

      app.get("/allServices", async (req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const allServices = await cursor.toArray();
        res.send(allServices);
      });
      app.get("/allServices/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
      });

      //    app.put("/allReviews/:id", async (req, res) => {
      //      const id = req.params.id;
      //      console.log('body reeeeeere', req.body);
      //      const filter = { _id: ObjectId(id) };
      //      const myReviews = req.body;

      //      const updateDoc = {
      //        $set: {
      //          email: myReviews.email,
      //          name: myReviews.name

      //        },
      //      };
      //      const result = await reviewsCollection.updateOne(filter, updateDoc);
      //      console.log('result koi', result);
      //      res.send(result);
      //    });

      app.delete("/allReviews/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewsCollection.deleteOne(query);
        res.send(result);
      });
      app.get("/allReviews", async (req, res) => {
          const query = req.params.services
        const result = await reviewsCollection.findOne(query);
        console.log('serviceId', result);
        res.send(result);
      });

      // verifyJwt,

      app.get("/allReviews", async (req, res) => {
        // const decoded = req.decoded;
        // console.log("inside orderapi", decoded);
        // if (decoded.email !== req.query.email) {
        //   res.status(403).send({ message: "forbidden access" });
        // }
        let query = {};
        if (req.query.email) {
          query = {
            email: req.query.email,
          };
        }
        const cursor = reviewsCollection.find(query);
        const review = await cursor.toArray();
        res.send(review);
      });
     
      
    }
    catch{

    }

}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('studio server running');
});

app.listen(port, () => {
    console.log(`Wildlife server running on ${port}`);
    
});
module.exports = app;