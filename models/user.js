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
        default:"https://icon-library.com/images/no-user-image-icon/no-user-image-icon-21.jpg"
    },
    active:{
        type:Boolean,
        default:false
    }
},{timeseries:true})

module.exports = mongoose.model("user",userSchema);