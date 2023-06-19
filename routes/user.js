

const express  = require('express');
const { getCurrentUserCartDetails, placeOrder,getUserOrders, getUserAddressBeforePlacingOrderController, getCurrentUserDetailsController, updateUserAddressController, getAllReviews, getAllUsers, getSingleReview, getAllOrders } = require('../controllers/userController');
const { authenticateUser, isUserAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/getCartDetails/:userEmail',authenticateUser,getCurrentUserCartDetails)
router.post('/placeOrder/:userEmail',authenticateUser, placeOrder)
router.get('/getUserOrders',authenticateUser,getUserOrders)
router.get('/getUserAddressBeforePlacingOrder',authenticateUser,getUserAddressBeforePlacingOrderController)
router.get('/getCurrentUserDetails',authenticateUser,getCurrentUserDetailsController)
router.post('/updateUserAddress',authenticateUser,updateUserAddressController)
router.get('/getAllReviews',authenticateUser,isUserAdmin,getAllReviews)
router.get('/getAllUsers',authenticateUser,isUserAdmin,getAllUsers)
router.get('/getAllOrders',authenticateUser,isUserAdmin,getAllOrders)
router.get('/getSingleReview/:id',authenticateUser,getSingleReview)


module.exports = router