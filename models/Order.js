const mongoose = require('mongoose');
const moment = require('moment')
const {Schema} = mongoose;

const OrderSchema = new Schema(
    {
        products:[],
        amount:Number,
        orderedBy:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        delivery_status:{
            type:String,
            enum:['delivered','pending'],
            default:'pending'
        },
        delivery_date:{
            type:Date,

        }
    },{
        timestamps:true
    }
)


OrderSchema.methods.resolveDeliveries = function (){
    
    // ! simple logic to check if today is the delivery date. if yes then we set the delivery_status to delivered.

    


   
}




module.exports = mongoose.model("Order",OrderSchema);