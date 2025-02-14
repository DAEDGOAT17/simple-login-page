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
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
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

app.use(express.json());  


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

app.use("./", router);

app.listen(Port,()=>{
    console.log("server is live");
});