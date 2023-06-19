const express = require('express');

const router = express.Router();

const {authenticateUser,isUserAdmin} = require('../middleware/auth.js')

const {login,register,secretController,checkAuth} = require('../controllers/authController.js')

// ! registration
router.post('/register',register)


router.post('/login',login)
router.get('/authenticate',authenticateUser,async(req,res)=>{
    console.log('inside auth check')
    res.json({ok:true})
})

router.get("/check-for-admin",authenticateUser, isUserAdmin,async(req,res)=>{
    res.json({ok:true});
})

// ! implementing protected routes

router.get("/secret",authenticateUser, isUserAdmin,secretController);



module.exports = router