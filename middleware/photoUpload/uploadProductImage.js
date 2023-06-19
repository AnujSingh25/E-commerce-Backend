
const multer = require('multer');
const sharp = require('sharp')
const multerStorage = multer.memoryStorage();
const path = require('path')

const multerFilter = (req,file,cb)=>{

    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb({message:"Unsupported File Format"},false)
    }
}

const productPhotoUpload = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
})


const afterUploadingThroughMulter = async(req,res,next)=>{
    if(!req.file) return next();


    req.file.filename = `profilePhoto-${Date.now()}-${req?.file.originalname}`

    console.log(req.file.filename)
    await sharp(req.file.buffer).toFormat("jpeg").jpeg({quality:90}).toFile(path.join(`uploads/productPhotos/${req.file.filename}`));

    next()
}


module.exports = {productPhotoUpload,afterUploadingThroughMulter}