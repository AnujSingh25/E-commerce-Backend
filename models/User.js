const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true,
        },
        email:{
            type:String,
            trim:true,
            required:true,
            unique:true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email',
              ]
        },
        password:{
            type:String,
            required:true,
            max:14
        },
        address:{
            type:String,
            trim:true
        },
        role:{
            type:String,
            enum:['admin','user'],
            default:'user'
        },
        cart:[
          

        ],
        orders:
           [
             {
                type:Schema.Types.ObjectId,
            ref:'Order'
        }

        ],
        delivery_address:{
            type:String

        }
        
    }
)

module.exports = mongoose.model("User",UserSchema);