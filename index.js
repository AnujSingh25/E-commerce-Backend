const express  = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const path=require('path')
// ! morgan
const morgan = require('morgan')

dotenv.config();
const app = express();
app.use(express.json())
app.use(cors())
const authRoutes = require('./routes/auth.js')
const categoryRoutes = require('./routes/category.js');

const productRoutes = require('./routes/product.js');
const userRoutes = require('./routes/user.js');

const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key : process.env.CLOUD_API_KEY,
  api_secret : process.env.CLOUD_API_SECRET

})

// app.use(fileUpload({useTempFiles:true}))
app.use(express.static(path.join(__dirname, 'frontend', 'build')))
app.use(morgan('tiny'));

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/user',userRoutes)


const connectDB = require('./db/connect.js');

app.get('*',async(req,res)=>{
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
})



const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
