const mongoose =require('mongoose');
require('dotenv').config();
const mongodb=process.env.mongoURI

const connection = mongoose.createConnection(mongodb)
module.exports={
    connection
}