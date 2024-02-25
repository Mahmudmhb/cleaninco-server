const express = require('express');
const cors = require('cors');
require('dotenv').config()


const app = express()

const { MongoClient, ServerApiVersion, MongoAWSError, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_KEY}@cluster0.gegfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

const blogCollection = client.db('cleanincoDB').collection('blogs');
const servicesCollection = client.db('cleanincoDB').collection('services');
const newServiceCollection = client.db('cleanincoDB').collection('newServices')
const addBooksCollection = client.db('cleanincoDB').collection('addbook')

// add services
app.post('/newservices', async(req,res)=>{
  const service = req.body;
  const result = await newServiceCollection.insertOne(service)
  res.send(result)

  // console.log(result)
})
app.post('/addbook', async(req,res)=>{
  const booked = req.body;
  // console.log(booked)
  const done = await addBooksCollection.insertOne(booked)
  res.send(done)
})

// find more data


app.get('/newservices', async (req, res) =>{
  const service = await  newServiceCollection.find().toArray()
  res.send(service)
})
app.get('/manageService', async(req,res)=>{
  //  console.log('tik tik find email', req.query);
   let query = {}
  //  console.log(query)
   if(req.query?.email){
    query ={email: req.query?.email};
    // console.log(query)
    const email = await newServiceCollection.find(query).toArray();
    res.send(email)
   }

})


app.get('/addbook', async(req,res)=>{
  console.log('thk tik ', req.query)
  let query = {};
  if(req.query.ProviderEmail){
    query = {ProviderEmail: req.query.ProviderEmail};
  }
  else if(req.query.userEmail){
    query ={userEmail: req.query.userEmail}
  }
  console.log(query)
  const userfind = await addBooksCollection.find(query).toArray()
  res.send(userfind)
})

app.get('/blogs', async(req,res)=>{
    const blog = await blogCollection.find().toArray()
    res.send(blog)
})

app.get('/services', async(req,res)=>{
  const services = await servicesCollection.find().toArray()
  res.send(services)
})


// find one data 
app.get('/blogs/:id', async(req, res) =>{
    const id = req.params.id
    const cursor = {_id: new ObjectId(id)}
    const result = await blogCollection.findOne(cursor)
    res.send(result)
    // console.log(cursor)
    // console.log('this is id',id)
})
app.get('/newservices/:id', async(req, res)=>{
  const id = req.params.id;
  const find = {_id : new ObjectId(id)}
  const result = await newServiceCollection.findOne(find)
  res.send(result)
})
app.get('/services/:id', async(req, res)=>{
  const id = req.params.id;
  const find = {_id : new ObjectId(id)}
  const result = await servicesCollection.findOne(find)
  res.send(result)
})

app.get('/addbook/:id', async(req,res)=>{
  const id = req.params.id
  // console.log(id)
  const find = {_id: new ObjectId(id)}
  res.send(result = await addBooksCollection.findOne(find))
})


// delete oparation

app.delete('/manageService/:id', async(req, res)=>{
  const id = req.params.id;
  const find = {_id: new ObjectId(id)}
  const result = await newServiceCollection.deleteOne(find)
  // console.log(result)
  res.send(result)
})


// update data 
app.put('/manageService/:id', async(req, res)=>{
  const id = req.params.id;
  const update = req.body;
  // console.log(id, update)
  const options = { upsert: true };
  const filter = {_id: new ObjectId(id)}
  const updateDoc = {
    $set: {
      name: update.name,
      photoUrl: update.photoUrl,
      email: update.email,
      price: update.price,
      description: update.description,
      area: update.area,
      serviceName: update.serviceName,
      ProviderImage:update.ProviderImage
    },
    
  };
  const result = await newServiceCollection.updateOne(filter, updateDoc, options);
  // console.log(result)
  res.send(result)

})

app.put('/addbook/:id', async(req,res)=>{
  const id = req.params.id;
  const update = req.body
  console.log(id, update)
  const filter = {_id: new ObjectId(id)}
  // const options = { upsert: sty };
  const updateDoc = {
    $set: {
      status: update.status
    }
  }
  res.send(result = await addBooksCollection.updateOne(filter,updateDoc), )
})


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',( req, res)=>{
    res.send('this is cleanco server site')
})
app.listen(port, ()=>{
    console.log('this is cleaninco site', port)
})