const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/e-comm");


const connectBD= async () =>{
    // mongoose.connect('mongodb://localhost:27017/e-comm');
    const productSchema = new mongoose.Schema({});
    const product= mongoose.model('user',productSchema);
    const data = await product.find();
    // console.warn(data);
 }
 connectBD();
 