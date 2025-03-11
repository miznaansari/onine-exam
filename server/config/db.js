const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://zafarahmad:2a2q8mOQuvJg44ll@cluster0.zffii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { 
    useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
