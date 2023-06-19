const express = require('express');
const path = require('path')

const router = express.Router();






const {createProductController, getAllProductsController, getSingleProductController,updateProductController,deleteProductController, uploadProductImageController, searchProductsController, getToken, processPayment, saveUserCart, getCartItems, addReviewController, getUserReviewsController, getSingleProductReviews, getFeaturedProducts} = require('../controllers/productController.js');
const { authenticateUser, isUserAdmin } = require('../middleware/auth.js');
const {productPhotoUpload, afterUploadingThroughMulter } = require('../middleware/photoUpload/uploadProductImage');
const { checkReviewIfAlreadyExists } = require('../middleware/review.js');

// ! 
router.post('/createProduct',authenticateUser,isUserAdmin,productPhotoUpload.single('photo'),afterUploadingThroughMulter,createProductController);
// router.post('/uploadProductImage',authenticateUser,isUserAdmin,productPhotoUpload.single('file'),uploadProductImageController);
router.put('/updateProduct/:id',authenticateUser,isUserAdmin,productPhotoUpload.single('photo'),afterUploadingThroughMulter,updateProductController);
router.delete('/deleteProduct/:id',authenticateUser,isUserAdmin,deleteProductController);
router.get('/getAllProducts',getAllProductsController);
router.get('/getSingleProduct/:id',getSingleProductController); 
router.get('/getSingleProduct/:id',getSingleProductController); 
router.get('/searchProductsFromSearchBox/:keyword',searchProductsController); 
router.get('/braintree/token',getToken)
router.post('/braintree/payment',processPayment)
router.post('/:userEmail/cart',authenticateUser,saveUserCart)
router.get('/:userEmail/cart',authenticateUser,getCartItems)
router.post('/addReview/:productId',authenticateUser,checkReviewIfAlreadyExists,addReviewController)
router.get('/getUserReviews',authenticateUser,getUserReviewsController)
router.get('/getSingleProductReviews/:productId',getSingleProductReviews)
router.get('/getFeaturedProducts',getFeaturedProducts)



// router.post('/uploadProductImage',authenticateUser, isUserAdmin, uploadImageController);

module.exports = router;