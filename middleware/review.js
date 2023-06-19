const Review = require("../models/Review");

const checkReviewIfAlreadyExists = async(req,res,next)=>{

    const {review,rating,addedBy} = req.body
    const {productId} = req.params;

    
    const ifReviewAlreadyExists = await Review.findOne({product:productId,addedBy:req.user.userId});
    
    if(ifReviewAlreadyExists){
        return res.json({error:"You have already added A review for this product"})
    }

    next()

}


module.exports = {checkReviewIfAlreadyExists}