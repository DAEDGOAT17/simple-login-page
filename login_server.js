const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Port = 4000

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/logindb');  //kindly change the database name a/q to your requirement
    } catch (error) {
        console.error("DB connection error:", error);
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

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'login.html'));
});

app.post('/login/post',async (req,res)=>{
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