

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({


    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    reviewText:{
        type:String,
    },
    rating:{
        type:Number
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }


})











module.exports = mongoose.model('Review',ReviewSchema)