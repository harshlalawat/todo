const mongoose = require('mongoose');
require("dotenv").config();

module.exports.init = async function(){
    await mongoose.connect(`mongodb+srv://CqDB:${process.env.DB_PASSWORD}@atlascluster.xxmyg3n.mongodb.net/CodeQuotient?retryWrites=true&w=majority`);
    console.log("Successfully connected to DB");
}