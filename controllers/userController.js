const Order = require("../models/Order");
const Review = require("../models/Review");
const User = require("../models/User");
const moment = require('moment')

const getCurrentUserCartDetails = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.params.userEmail});


        res.json({cart:user.cart});
    } catch (error) {
        return res.json({error:error})
    }
}


const placeOrder = async(req,res)=>{
    try {

        
        const {amount,cart,user} = req.body;
        const deliveryAfterDays =  Math.floor(Math.random() * 4) + 1


        const deliveryDate = moment().add(deliveryAfterDays,'days')

        const userPlacingTheOrder = await User.findOne({email:req.params.userEmail})

      const newOrder = await new Order({
        orderedBy:userPlacingTheOrder._id,
        products : userPlacingTheOrder.cart,
        amount:amount,
        delivery_date:deliveryDate
      }).save()

      const updateUserModelWithNewOrder = await User.findByIdAndUpdate({_id:userPlacingTheOrder._id},{
        $push:{
            orders:newOrder._id
        },
        cart : []
      })
       
        res.json({orderPlaced:true,newOrder}).status(200)

    } catch (error) {
        console.log(error)
        return res.json({error:error})
    }
}



const getUserOrders = async(req,res)=>{

  // ! find all Orders that are pending
  const allOrders = await Order.find({delivery_status:'pending'});

  // console.log(allOrders)

  // ! create an array of those orders whose delivery is today
 
  const ordersToBeUpdated =  allOrders.map((singleOrder)=>{
  
   if(moment(singleOrder.delivery_date).isSame(moment()._d,'day') ){
    return singleOrder
   }
  })


  // const ordersToBeUpdatedIDs = ordersToBeUpdated.map((singleOrder)=>{
  //   return singleOrder._id
  //  })
  // ! get the IDs of these orders that are to be updated

   const ids = ordersToBeUpdated.map((o)=>{
    return o?._id
   }).filter((o)=>{
    return o?._id !== undefined
   })

   const updateOrders = ids.forEach(async(id)=>{
    const update = await  Order.findByIdAndUpdate({_id:id},{
      delivery_status:'delivered'
    })
   },{new:true})



  const newUpdatedOrders = await Order.find({})


  
  
  const userOrders = await Order.find({orderedBy:req.user.userId}).populate('orderedBy').populate('products.product.category').populate('products.product.reviews');
  



  res.json({userOrders})


}


const getUserAddressBeforePlacingOrderController = async(req,res)=>{

  const userAddress = await User.findOne({_id:req.user.userId})


  res.json({address:userAddress.address || false})
  
}

const getCurrentUserDetailsController = async(req,res)=>{

  const user = await User.findOne({_id:req.user.userId}).select('-orders -password');

  res.json({user})
}

const updateUserAddressController = async(req,res)=>{

  console.log(req.body)
  if(!req.body.address){
    return res.json({error:"Address cannot be null"})
  }

  const updateUser = await User.findByIdAndUpdate({_id:req.user.userId},{
    address:req.body.address
  },{new:true})

  res.json({success:true})
}

const getAllReviews = async(req,res)=>{

  

  const reviews = await Review.find({}).populate('addedBy').populate('product').populate({
    path:'product',
    populate:{
      path:'category',
      model:'Category'
    }
  })

  if(!reviews){
    return res.json({error:'No Reviews Found'}).status(404)
  }

  res.json({message:"hitting the get all reviews route",reviews})
}



const getAllUsers = async(req,res)=>{

  const users = await User.find({role:'user'}).select('-password')

  

  res.json({message:"hitting the get all users route",users})
}

const getSingleReview = async(req,res)=>{
  const review = await Review.find({_id:req?.params?.id})

  res.json({review})
}

const getAllOrders = async(req,res)=>{
  const orders = await Order.find({}).populate('orderedBy')

  res.json({orders})
}
module.exports = {getAllOrders,getSingleReview,getAllUsers,getAllReviews,updateUserAddressController,getCurrentUserCartDetails,placeOrder,getUserOrders,getUserAddressBeforePlacingOrderController,getCurrentUserDetailsController}