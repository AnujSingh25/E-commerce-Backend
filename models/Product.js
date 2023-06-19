const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   name:{
    type:String,
    trim :true,
    required:true,
    maxLength:255,

   },
   slug:{
    type:String,
    lowercase:true,
   },
   description:{
    type:String,
    required:true,
    maxLength:2500,

   },
   price:{
    type:Number,
    required:true,
   },
   category:{
    type:mongoose.Types.ObjectId,
    ref:'Category',
    required:true,
   },
   quantity:{
    type:Number,
   },
   sold:{
    type:Number,
    default : 0,

   },
   featured:{
      type:Boolean
   },
   reviews:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:'Review'
      }
   ],
   photo:{
    type:String,
   
    required:true,

   },
   photoID:{
      type:String,
      required:true
   },
   shipping:{
      required:false,
      type:Boolean
   }

},{timestamps:true})

module.exports = mongoose.model('Product',ProductSchema)
