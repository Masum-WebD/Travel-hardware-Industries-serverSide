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
        const userCollection =client.db('travel_hardware').collection('user')
        
          app.get("/admin/:email", async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === "admin";
            res.send({ admin: isAdmin });
          });
          app.put("/user/admin/:email",  async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
              $set: { role: "admin" },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
          });
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
        });
        app.get('/orders',async (req,res)=>{
            const orderUser =req.body.orderPurchase;
            const query ={orderPurchase: orderUser};
            const orders = await OrdersCollection.find(query).toArray();
            res.send(orders);
        })
        app.get("/user", async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
          });
          app.put("/user/:email", async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
              $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            
            res.send(result);
          });
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('travel hardware store is ready for product sell')
})
app.listen(port,()=>{
    console.log(`travel hardware port  ${port}`)
})