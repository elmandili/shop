
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://elmandilimail:elmandili2004@cluster0.ilqpr9n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const mongodb = require('mongodb');
const crypto_var = require('crypto-js');


if(process.env.NODE_ENV !== "production")
  {
    require("dotenv").config();
  }
//commit please
const app = express();
const port = process.env.PORT || 3000 ;
 // Use environment variable or default port

// Parse incoming data (optional, for future use)
app.use(bodyParser.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    strict: true,
    deprecationErrors: true,
  }
});



const db = client.db("products");

const collection = db.collection("productsCollection");
const orders = db.collection("orders");
const registeredUsers = db.collection("registeredUsers");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    

    //deploy
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }

  
}
run().catch(console.dir);

app.use(cors());

//new modification



app.use(express.static('browser'));

app.get("/data", async (req,res)=>{
    const documents = await displayAllElements();
    res.send(documents);
})

app.get('/api/get-products',async (req,res)=>{
    const documents = await displayAllElements();
    res.send(documents);
})

app.post('/api/add-product', async(req,res)=>{
    
    const result = await collection.insertOne(req.body);
    console.log(req.body);
    res.json("Added Succesfully");
})

app.post('/api/place-order', async(req, res) => {
  const result = await orders.insertOne(req.body);
  res.json("order placed");
})

app.post('/api/register', async(req, res)=> {
  const result = await registeredUsers.insertOne(req.body);
  res.json("sent for review");
})

app.get('/api/get-orders', async(req, res) => {
  const documents = await getOrders();
  console.log(documents);
  res.send(documents);
})

app.delete('/api/delete-product/:id', async(req, res)=>{
    console.log(req.params.id);
    try
    {
        const document = await collection.findOneAndDelete({_id: new mongodb.ObjectId(req.params.id) })
        console.log(document);
        
        
        
    } 
    catch(err)
    {
        console.log(err);
    }
    

    
    res.json("Product Deleted");
})


app.get('/api/find/:id', async(req,res)=>{
  try
  {
    const document = await collection.findOne({_id: new mongodb.ObjectId(req.params.id)});
    await res.json(document);
    
  }
  catch
  {

  }
})

app.get('/api/update/order-comments/:id/:comments/:statue', (req,res)=>{
  let new_comments = JSON.parse(req.params.comments);
  
  orders.updateOne({_id: new mongodb.ObjectId(req.params.id)},{ $set: {comments: new_comments}});
  orders.updateOne({_id: new mongodb.ObjectId(req.params.id)},{ $set: {statue: req.params.statue}});
  res.json('comments : ' + req.params.comments + ' id : ' + req.params.id);
})

//commit deploy

app.get('/api/find-user/:username', async(req, res)=>{
  try
  {
    const document = await registeredUsers.find({"email" : req.params.username}).toArray() ;
    console.log(document);
    
    await res.json(document);
    console.log("this is the json document : " + JSON.stringify(document)  );
  }
  catch
  {

  }
})

app.get('/api/search/:product_name', async(req,res) =>{
  try
  {
    obj =
    {
      name: req.params.product_name
    }
    const name = req.params.product_name;
    const document = await orders.find({"name" : req.params.product_name}).toArray() ;
    console.log(req.params.product_name)
    console.log(document);
    await res.send(document);

    //merge test
  }
  catch
  {

  }
})

app.get('/api/regex/:reg', async (req,res) =>{
  let cursor = "";
  let document = "";
  console.log(req.params.reg)
  if(req.params.reg != "null")
    {
      cursor = collection.find({productName: { $regex: req.params.reg, $options:'i'}});
      document = await cursor.toArray();
    }
  else
    {
      cursor = collection.find();
      document = await cursor.toArray();
    }
  res.json(document);
})

app.get('/api/encrypt/:data', async(req,res)=>
{
  const x = crypto_var.AES.encrypt(req.params.data, 'key');
  const xx = crypto_var.enc.Base64.stringify(crypto_var.enc.Utf8.parse(x));
  res.json(xx); 
  
})

app.get('/api/decrypt/:data', async(req,res)=>{
  const x = crypto_var.enc.Base64.parse(req.params.data).toString(crypto_var.enc.Utf8);
  const bytes = crypto_var.AES.decrypt(x, 'key');
  const respone = bytes.toString(crypto_var.enc.Utf8) ;
  
  await res.json(respone);
  res.send(respone);
})

app.listen(port, ()=>{
    console.log("port is running");
    console.log(`Example app listening on port ${port}`);
    //
})

app.get('/api/user-orders/:id', async(req, res)=>{
  const document = await orders.find({ user_id : req.params.id}).toArray();
  res.send(JSON.stringify(document));
  console.log(document);
})  

app.get('/api/products-category/:category', async(req, res)=>{
  console.log(req.params.category);
  const document = await collection.find({ category : req.params.category }).toArray();
  res.json(document);
})

app.get('/api/find-product/:id', async(req, res)=>{
  const document = await collection.find({ _id : new mongodb.ObjectId(req.params.id)}).toArray();
  res.json(document);
})




async function insertDocument(document) {
    try {
      const result = await collection.insertOne(document);
      console.log(`Inserted document with ID: ${result.insertedId}`);
    } catch (error) {
      console.error(error);
    }
}

async function findDocuments(filter = {}) {
    try {
      const cursor = collection.find(filter);
      const documents = await cursor.toArray();
      console.log("Found documents:", documents);
    } catch (error) {
      console.error(error);
    }
}


async function getOrders()
{
  try
  {
    const cursor = orders.find();
    const documents = await cursor.toArray();
    
    return documents;
  }catch(err)
  {
    console.log(err);
  }
}

async function displayAllElements()
{
    try
    {
        const cursor = collection.find();
        const documents = await cursor.toArray();
        
        return documents;
    } catch(error)
    {
        console.error(error);
    }
}
  
async function deleteDocument(filter) {
    try {
      const result = await collection.deleteOne(filter);
      console.log(`${result.deletedCount} document(s) deleted.`);
    } catch (error) {
      console.error(error);
    }
}

app.post('api/add-product/',multer().none(), (req,res)=>{
    try {
        const result = collection.insertOne(req);
        console.log(`Inserted document with ID: ${result.insertedId}`);
        res.json("product added");
      } catch (error) {
        console.error(error);
      }
})



  

  
  
  
  
  