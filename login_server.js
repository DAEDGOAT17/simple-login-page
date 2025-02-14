const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { error } = require("console");
const Port = 5000;
require('dotenv').config();
const { MONGO_URI } = process.env;


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log("mongoDB connected"))
        .catch((err)=>console.log("mongo db connetion error",err)); //kindly change the database name a/q to your requirement
    }
    catch (error) {
        console.log("Error in connecting to DB", error);
    }
}

connectDB();
 



const db = mongoose.connection;
db.once('open', () => {
    console.log("DB connected");
});
const logindbschema = new mongoose.Schema({
    user_name: { type: String, required: true},
    password: { type: String, required: true }
})

app.use(express.urlencoded({ extended: true }));  


const loginDB = mongoose.model('logindb', logindbschema);

app.use(express.static(path.join(__dirname,'public'))); 

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.post('/login',async (req,res)=>{
    const user = new loginDB({
        user_name: req.body.username,
        password: req.body.password
    });
        await user.save();
        res.send("Data saved to DB");
});

app.listen(Port,()=>{
    console.log("server is live");
});