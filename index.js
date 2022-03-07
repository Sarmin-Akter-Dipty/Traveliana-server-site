const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleWare
app.use(cors())
app.use(express.json())

//DB_USER=Travel-Agency
//DB_PASS=fBDklfydmQbuOW0y



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oewpu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('TravelAgency');
        const servicesCollection = database.collection('Services');
        const orderCollection = database.collection('order');



        //POST addServices API
        app.post('/services', async (req, res) => {
            const services = req.body;
            // console.log(services);
            const result = await servicesCollection.insertOne(services)
            // console.log(result);
            res.json(result)
        })
        //Get Services Api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.limit(4).toArray();
            res.send(services)
        })
        //Get AllServices Api
        app.get('/allServices', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //Get single services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const services = await servicesCollection.findOne(query);
            res.json(services)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            console.log('order', result);
            res.json(result)
        })

        //my order
        app.get('/myorders', async (req, res) => {
            const query = { email: req.query.email }
            const cursor = await orderCollection.find(query).toArray()
            res.json(cursor)

        })
        app.put('/myorders', async (req, res) => {
            const filter = { _id: ObjectId(req.query.id) }
            const options = { upsert: true }
            const updateDocument = {
                $set: {
                    status: 'Approved'
                }
            }
            const result = await orderCollection.updateOne(filter, updateDocument, options)
            res.send(result)
        })
        app.get("/allOrders", async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.json(result);
        });
        app.put('/allorders', async (req, res) => {
            const filter = { _id: ObjectId(req.query.id) }
            const options = { upsert: true }
            const updateDocument = {
                $set: {
                    status: 'Approved'
                }
            }
            const result = await orderCollection.updateOne(filter, updateDocument, options)
            res.send(result)
        })
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Running Travel-Agency server')

});
app.listen(port, () => {
    console.log('Running in port', port);
});