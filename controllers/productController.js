const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const path = require('path');
const slugify = require('slugify')
const cloudinary = require('cloudinary').v2
const braintree = require('braintree')
const dotenv = require('dotenv')

dotenv.config();

const gateway = new braintree.BraintreeGateway({
    environment:braintree.Environment.Sandbox,
    merchantId:process.env.BRAINTREE_MERCHANT_ID,
    publicKey:process.env.BRAINTREE_PUBLIC_KEY,
    privateKey : process.env.BRAINTREE_PRIVATE_KEY

})
const fs = require('fs');
const User = require('../models/User.js');
const Review = require('../models/Review.js');

const createProductController = async (req, res) => {

    const { name, description,category,price,quantity,sold,shipping,featured } = req.body;


    console.log(category,'category')
    console.log(req.body)
    console.log(req.photo)
    // console.log(req.photo)

    
    // console.log(categoryID._id,"whole categoryObject",category);
    const productAlreadyExists = await Product.findOne({name});

    if(productAlreadyExists){
        return res.json({message:"product already exists"});
    }
    
    const existingCategory = await Category.findOne({_id:category});
    console.log(existingCategory,'existingCategeory')

    if(!existingCategory){
        return res.json({error:"The category you are requesting was not found"})
    }
    
    const categorySlugName = existingCategory.slug;

    console.log(categorySlugName,'categorySlugName')

    


    try {

        if(req?.file){
            const localPath = `uploads/productPhotos/${req?.file.filename}`
            // console.log(localPath,'localpath')

             var result = await cloudinary.uploader.upload(localPath, {
                 use_filename: true,
                 folder: `test-folder/${categorySlugName}`
                });

                fs.unlinkSync(localPath)
                
                
                
            }
        const imageURL = result.secure_url;
        const productPhotoID = result.public_id;
        console.log(result.secure_url)

        // const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        //     use_filename: true,
        //     folder: `test-folder/${categorySlugName}`
        // });



        


        const product = await Product.create({
            name, description, price: price, quantity:quantity || 30,sold:sold || 2, shipping:shipping || false, featured:featured || false, category,photoID:productPhotoID, photo: imageURL
        })
        // console.log(product);
        res.json(product);
    } catch (error) {
        console.log(error)
        return res.json(error);
    }
}

const updateProductController = async (req, res) => {

    try {

    const {id} = req.params;

    const { name, description, category, price,sold,quantity,shipping,featured } = req.body;

    
    console.log(featured)

    const productToUpdate = await Product.findOne({ _id: id }).populate('category')
    console.log('this is my prodyct',productToUpdate)

    if(req.file){
        // console.log(req.file)
        // var photo_id = result.public_id;

        const previousImgId = productToUpdate.photoID;
        const productCategorySlug = productToUpdate.category.slug

       const deletePreviousImage = await cloudinary.uploader.destroy(previousImgId);
    const localPath = `uploads/productPhotos/${req?.file.filename}`
    var result = await cloudinary.uploader.upload(localPath, {
            use_filename: true,
            folder: `test-folder/${productCategorySlug}`
        });

        const update = {
            name : name || productToUpdate.name,
            description : description || productToUpdate.description,
            price : price || productToUpdate.price,
            sold : sold || productToUpdate.sold,
            photo:result.secure_url,
            photoID:result.pubic_id,
            category:category,
            quantity : quantity || productToUpdate.quantity,
            shipping : shipping || productToUpdate.shipping,
            featured:featured || productToUpdate.featured || false
        }

        fs.unlinkSync(localPath);

        const updateProduct = await Product.findByIdAndUpdate({_id:id},update,{new:true})

        return res.json({message:"product updated"})
    }

    // const productCategory = productToUpdate.category.name;

    // const productSlug = productToUpdate.category.slug;




    // !========================================================
    const update = {
        name : name || productToUpdate.name,
        description : description || productToUpdate.description,
        price : price || productToUpdate.price,
        sold : sold || productToUpdate.sold,
        photo:productToUpdate.photo || null,
        photoID:productToUpdate.photoID || null,
        category:category,
        quantity : quantity || productToUpdate.quantity,
        shipping : shipping || productToUpdate.shipping,
        featured:featured || productToUpdate.featured || false
    }

    // console.log(productCategory);


    // if(req?.file){

    //     const existingCategory = await Category.findOne({_id:category});
    //     console.log(existingCategory,'existingCategeory')
    
    //     if(!existingCategory){
    //         return res.json({error:"The category you are requesting was not found"})
    //     }
        
    //     const categorySlugName = existingCategory.slug;
    
    //     console.log(categorySlugName,'categorySlugName')
        
    //     const localPath = `uploads/productPhotos/${req?.file.filename}`
    //     // console.log(localPath,'localpath')

    //      var result = await cloudinary.uploader.upload(localPath, {
    //     use_filename: true,
    //     folder: `test-folder/${categorySlugName}`
    // });
   

    //     var photo_id = result.public_id;

    //     const previousImgId = productToUpdate.photoID;
        
    //    const deletePreviousImage = await cloudinary.uploader.destroy(previousImgId);
    //    console.log("delete previous image",deletePreviousImage);

        
    //     var imageURL = result.secure_url;
    // }
    // if(req?.file){

    //     fs.unlinkSync(req?.files?.image?.tempFilePath)
    // }


    //     const product = await Product.findOneAndUpdate({_id:id},{
    //         photo:imageURL||productToUpdate.photo,
    //         photoID : photo_id,
    //         name : name || productToUpdate.name,
    //         description : description || productToUpdate.description,
    //         price : price || productToUpdate.price,
    //         sold : sold || productToUpdate.sold,
    //         quantity : quantity || productToUpdate.quantity,
    //         shipping : shipping || productToUpdate.shipping},{new:true})


    //     console.log(product)

    const updateProduct = await Product.findByIdAndUpdate({_id:id},update,{new:true})

    res.json({message:"product update but no photo was upload so old photo is still there"});
    } catch (error) {
        console.log(error)
        return res.json({error:error})
    }
}

const getAllProductsController = async (req, res) => {
    try {

        const products = await Product.find({}).populate('category')
        res.json(products)    
    } 
        
        catch (error) {
        return res.json({error:error})
    }
}

const getSingleProductController = async (req, res) => {
    try {
        const id = req.params.id;

        const productAlreadyExists = await Product.findOne({_id:id})
        if(!productAlreadyExists){
            return res.status(404).json({message:'Product does not exist.'})
        }
        const product = await Product.findOne({_id:id}).populate('category');

        res.json(product)    
    } 
        
        catch (error) {
            return res.json({error:error})
    }
}

const deleteProductController = async (req, res) => {
    try {

        const id = req.params.id;

        const product = await Product.findOne({_id:id});

        if(!product){
            return res.status(404).json({message:"Product not found"});
        }


        const productPhotoId = product.photoID;
        
        cloudinary.uploader.destroy(productPhotoId);
        const deletedProduct = await Product.findOneAndDelete({_id:id})

        res.json({message:"product deleted Successfully"})
    } catch (error) {
        return res.json({error:error})
    }
}

const uploadProductImageController = async(req,res)=>{
 console.log(req.file)   
}


const searchProductsController = async(req,res)=>{
    const {keyword} = req.params;
    const results = await Product.find({
        $or:[
            {name:{$regex:keyword,$options:"i"}},
            {description:{$regex:keyword,$options:"i"}}
        ]
    });

    res.json(results)
}

const getToken = async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }
            else{
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const processPayment = async(req,res)=>{
    try {
        let nonceFromTheClient = req.body.paymentMethodNonce;
        let newTransaction = gateway.transaction.sale({
            amount:`10.00`,
            paymentMethodNonce:nonceFromTheClient,
            options:{
                submitFormSettlement:true
            }
        },function(error,result){
            if(result){
                res.send(result)
            }else{
                res.status(500).send(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const saveUserCart = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.params.userEmail})

        // const cartItems = user.cart.map((c)=>{
        //     return c._id
        // })

      


        const saveUserCartItems = await User.findByIdAndUpdate({_id:user._id},{
            cart:req.body
        },{new:true})

        // console.log(req.body)
        // console.log(req.params)
        // console.log(saveUserCartItems)
        res.send({cart:"cart"})
    } catch (error) {
        console.log(error)
    }
}

const getCartItems = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.params.userEmail})

        const userCart = user.cart.filter(element => {
            if (
              typeof element === 'object' &&
              !Array.isArray(element) &&
              Object.keys(element).length === 0
            ) {
              return false;
            } else {
              return true;
            }
          })
     
        res.json({cart:userCart})
    } catch (error) {
        console.log(error)
    }
}


const addReviewController = async(req,res)=>{

    const {review,rating,addedBy} = req.body
    const {productId} = req.params;



    
    
    const createdReview = await new Review({
        reviewText:review,
        rating:rating,
        addedBy:req.user.userId,
        product:productId
    }).save()

    const add_review_to_product_review_list = await Product.findByIdAndUpdate({
        _id:productId
    },{
        $push:{
            reviews:createdReview._id
        }
    },{new:true})
    res.json({message:"hitting the route indeed",Success:true})
}

const getUserReviewsController = async(req,res)=>{

    const userReviews = await Review.find({addedBy:req.user.userId})

    const idsOfReviewedProductsByThisUser = userReviews.map((singleReview)=>{
        return singleReview.product.valueOf()
    })

   
    res.json({reviewedProductIDs:idsOfReviewedProductsByThisUser})
}

const getSingleProductReviews = async(req,res)=>{

    const {productId} = req.params;
    const reviews = await Review.find({product:productId}).populate('addedBy')

    if(!reviews){
        return res.status(404).json({message:"No Reviews for the this product"})
    }
res.status(200).json({reviews})
    
  
}


const getFeaturedProducts = async(req,res)=>{

    const featuredProducts = await Product.find({featured:true})

    res.json({featuredProducts})
}
module.exports = {getFeaturedProducts,getSingleProductReviews,getUserReviewsController,addReviewController,getCartItems,saveUserCart,searchProductsController, uploadProductImageController,getSingleProductController, createProductController, updateProductController, getAllProductsController,deleteProductController,getToken,processPayment }