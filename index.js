      const express = require('express');
      const cors = require("cors");
      require('./db/config');
      const User = require("./db/User");
      const { default: mongoose } = require('mongoose');
      const Product = require('./db/Product');
      const swaggerJSDoc = require('swagger-jsdoc');
      const swaggerUi = require('swagger-ui-express');

      const app = express();

      const port = process.env.PORT || '4000'



      const options = {
         definition:{
         //   openapi:'3.0.0',
           info:{
             title:'Node js API Project for mongodb',
             version:'1.0.0'
           },
           servers:[
             {
              url: 'http://localhost:4000/'
             }
           ]
         },
         apis:['./index.js']
       }
       const swaggerSpec = swaggerJSDoc(options)
       app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
       
       /**
        * @swagger
        * /getdata:
        * get:
        * summary: this api is used to check if get
        * descriptions:this api is used to 
        * responses:
        * 200:
        * description: to test Get method
        */
       app.get('/getdata' , (req, res)=>{
         res.send("hello this is testing ");
       });
       
//  app.get("/", (req, res) => {
//     res.send("/")
//  });


   app.use(express.json());
   app.use(cors());

   app.post("/register", async (req, res)=>{      
      let user = new User(req.body);
      let result = await user.save();
      result = result.toObject(); // remove passord ---
      delete result.password;
      // res.send("api in progress...")
      res.send(result);
   })
app.post("/Login", async(req, res) =>{
   if(req.body.password && req.body.email){
   let user = await User.findOne(req.body).select("-password");
   if(user){
      res.send(user)
   }else{
      res.send({result: "not found"});
   }}else{
      res.send({result: "not found"});
   }
} );

app.get("/products", async (req, res)=>{
   const products = await Product.find();
   if(products.length >0){
      res.send(products)
   }else{
      res.send({result:"No Product Found"})
   }
})

   app.post("/AddProduct", async(req, res)=>{
      let product= new Product(req.body);
      let result = await product.save();
      res.send(result);
   });
   app.delete("/product/:id", async (req, res) =>{
      let result = await Product.deleteOne({_id:req.params.id});
      res.send(result)
   });

   app.get("/product/:id", async(req, res) =>{
      let result = await Product.findOne(
         {_id:req.params.id});
      if(result){
         res.send(result);
      }else{
         res.send("no data found");
      }
   });
   app.put("/product/:id", async (req, res) =>{
      let result = await Product.updateOne(
         {_id:req.params.id},
         {$set:req.body}
      )
      if(result){
         res.send(result);
      }
   });

   app.get("/search/:key", async(req, res) =>{
      let result = await Product.find({
         "$or":[
            {
               name:{$regex:req.params.key}
            },
            {
               company:{$regex:req.params.key}
            }
         ]
      });
      res.send(result);
   })


app.listen(port, () => {
   console.log(`server listening at http://localhost:${port}`)

})

//fetch data form mongoose -----------




// validate----
// app.post("/register", async (req, res)=>{ 
//    try{
//    const user = new User({
//          name:req.body.name,
//          email:req.body.email,
//          password:req.body.password
//    });        
   
//    const userData = await User.findOne({email:req.body.email});
//    if(userData){
//       res.status(200).send({success:false,msg:"this email is exist"});
//    }else{
//       const user_data = await user.save();
//       res.status(200).send({success:true,data:user_data});
//    }       

//    }catch(error){
//       res.status(400).send(error.message)
//       // console.log(error.message);
//       }   