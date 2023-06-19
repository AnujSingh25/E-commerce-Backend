const express = require('express');


const router = express.Router();

const {createCategory,updateCategory,deleteCategory,getAllCategory,getSingleCategory} = require('../controllers/categoryController.js')

const {authenticateUser,isUserAdmin} = require('../middleware/auth.js');

router.post('/createCategory',authenticateUser,isUserAdmin,createCategory);
router.put('/updateCategory/:id',authenticateUser,isUserAdmin,updateCategory);
router.get('/getAllCategories',authenticateUser,isUserAdmin,getAllCategory);
router.get('/getSingleCategory/:slug',authenticateUser,isUserAdmin,getSingleCategory);
router.delete('/deleteCategory/:id',authenticateUser,isUserAdmin,deleteCategory);

module.exports = router;