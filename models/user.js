const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        match:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmPass:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/instagram-clone-a6598.appspot.com/o/profile%2Fdefault.jpeg?alt=media&token=58a03f2d-ebc8-4194-b036-3329eaa12d0e"
    },
    active:{
        type:Boolean,
        default:false
    }
},{timeseries:true})

module.exports = mongoose.model("user",userSchema);