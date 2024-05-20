const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://elmandilimail:elmandili2004@cluster0.ilqpr9n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB connection string

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error(err));

module.exports = mongoose;
