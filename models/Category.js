const mongoose = require('mongoose')


const CategorySchema = new mongoose.Schema({
    name: {
        type:String,
        trim : true,
        required:true,
        maxLength:40,
        unique:true
    },
    slug : {
       type:String,
       unique:true,
       lowercase:true, 
    }
})


module.exports = mongoose.model('Category',CategorySchema)