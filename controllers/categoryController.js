const category = require('../models/Category.js');
const slugify = require('slugify');
const Category = require('../models/Category.js');



const createCategory = async(req,res) => {




    try {

        const {name} = req.body;
        if(!name.trim()){
            return res.json({error:'Name is required'})
        }

        const categoryAlreadyExists = await Category.findOne({name:name})
        if(categoryAlreadyExists){
            return res.json({error:'Already Exists'});
        }

        const category = await new Category({name,slug:slugify(name)}).save();
        res.json(category);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }


};

const updateCategory = async(req,res)=>{

try {

    
    const id = req.params.id;
    const {name} = req.body
    if(!name.trim()){
        return res.json({error:"please provide category name"})
    }
    
    const categoryToUpdate = await Category.findOneAndUpdate({_id:id},{
        name:name
    },{new:true});


    console.log(categoryToUpdate,'category to update')
    res.json({categoryToUpdate});
} catch (error) {
    return res.json({error:error})
}
}

const getSingleCategory = async(req,res)=>{
    try {

        const slug = req.params.slug;
        const category = await Category.findOne({slug});
        
        if(!category){
            res.status(404).json({error:"Category does not exist"})
        }

        res.status(200).json({category});

        
    } catch (error) {
        res.status(404).json({error})
    }
}

const getAllCategory = async(req,res)=>{

try {
    const allCategories = await Category.find({});

    res.json(allCategories);
} catch (error) {
    return res.status(404).json({error})
}
}


const deleteCategory = async(req,res)=>{

    

    try {
        const id = req.params.id;

    const categoryExists = await Category.findById({_id:id})
    if(!categoryExists){
        return res.status(404).json({error:"Category does not exist"})
    }
        const categoryToDelete = await Category.findByIdAndDelete({_id:id})
        res.status(200).json({categoryToDelete,message:"Category deleted successfully."});
        
    } catch (error) {
        res.status(404).json({error})
    }
}



module.exports =  {createCategory,updateCategory,getAllCategory,deleteCategory,getSingleCategory}