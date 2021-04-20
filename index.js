const express = require('express')
const app = express()
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e9x41.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);
    const serviceCollection = client.db("phoneRepair").collection("addService");
    const reviewCollection = client.db("phoneRepair").collection("reviews");

    app.get('/services', (req, res) => {
        serviceCollection.find()
        .toArray((err, items) => {
          res.send(items);
        })
      })

      app.get('/reviews', (req, res) => {
        reviewCollection.find()
        .toArray((err, items) => {
          res.send(items);
        })
      })

      app.get('/services/:id', (req, res) => {
        serviceCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, items) => {
          console.log(err, items);
          res.send(items[0])
        })
      })

    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new service:', newService);
        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })

    });

    app.post('/addReviews', (req, res) => {
        const newReview = req.body;
        console.log('adding new review:', newReview);
        reviewCollection.insertOne(newReview)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })

    });


});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})