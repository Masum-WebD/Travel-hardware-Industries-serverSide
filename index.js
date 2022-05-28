const express = require('express');
const app =express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port =process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ecmxs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const ProductCollection =client.db('travel_hardware').collection('product')
        const ReviewCollection =client.db('travel_hardware').collection('Review')
        const OrdersCollection =client.db('travel_hardware').collection('orders')
        app.get('/product', async(req, res)=>{
            const query ={};
            const cursor = ProductCollection.find(query);
            const product= await cursor.toArray()
            res.send(product);
        })
        //product with id
        app.get('/product/:id', async(req, res)=>{
            const id =req.params.id;
            const query ={_id:ObjectId(id)}
            const product =await ProductCollection.findOne(query);
            res.send(product);
        })
        //review
        app.get('/review', async(req, res)=>{
            const query ={};
            const cursor = ReviewCollection.find(query);
            const review= await cursor.toArray()
            res.send(review);
        })

        //Orders
        app.post('/orders',async (req,res)=>{
            const order =req.body;
            const result = await OrdersCollection.insertOne(order);
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('travel hardware store is ready for product sell')
})
app.listen(port,()=>{
    console.log(`travel hardware port number ${port}`)
})