const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

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


async function run(){
    try{
        const serviceCollection = client
          .db("wildlife-studio")
          .collection("reviews");
         app.get("/services", async (req, res) => {
           const query = {};
           const cursor = serviceCollection.find(query);
           const services = await cursor.limit(3).toArray();
           res.send(services);
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
           const service = await serviceCollection.findOne(query)
           res.send(service);
         });

    }
    catch{

    }

}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    req.send('studio server running');
});

app.listen(port, () => {
    console.log(`Wildlife server running on ${port}`);
    
});
module.exports = app;