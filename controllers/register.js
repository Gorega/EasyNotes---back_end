const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mail = require("../controllers/mail");

async function register(req,res){
    let {username,email,password,confirmPass} = req.body;
    try{
        const existEmail = await User.findOne({email});
        const existUsername = await User.findOne({username});
        if(existEmail){
            return res.status(422).json({msg:"Email provided is already exist"})
        }
        if(existUsername){
            return res.status(422).json({msg:"Username provided is already exist"})
        }
        if(!username){
            return res.status(422).json({msg:"Username should not be empty"});
        }
        if(username.length <= 3){
            return res.status(422).json({msg:"Username should not be less than 3 characters"});
        }
        if(!email){
            return res.status(422).json({msg:"Please provide a valid email address"});
        }
        if(!password || password.length < 8){
            return res.status(422).json({msg:"Please type a valid password"});
        }
        if(password !== confirmPass){
            return res.status(422).json({msg:"password don't match"});
        }
        const hashPassword = await bcrypt.hash(password,10);
        password = hashPassword
        confirmPass = hashPassword
        // register user
        const user = await User.create({username,email,password,confirmPass});
        // create activation link
        const randomLink = jwt.sign({username},process.env.JWT_SECRET_CODE,{expiresIn:"1h"});
        let emailMessage = `<h1>EasyNotes</h1> 
        <p>Verify your email address</p>
        <hr/>
        <p> Kindly use the link below in order to activate your account: </p>
        <a href="https://easynotes-gorega.herokuapp.com/activate-account/${randomLink}">Link</a>
        `
        let emailSubject = "EasyNotes - activate your account"
            mail(email,emailMessage,emailSubject);
            await new Token({
                userId:user._id,
                token:randomLink,
                date:new Date().getTime()
            }).save();
        return res.status(200).json({msg:"success"});
    }catch(err){
        return res.status(500).json("server error");
    }
}

async function activateAccount(req,res){
    const {uri} = req.query;
    try{
        const user = await Token.findOne({token:uri});
        await User.findOneAndUpdate({_id:mongoose.Types.ObjectId(user.userId)},{active:true});
        await Token.deleteMany({});
        return res.status(200).json({msg:"active"});

    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

module.exports = {register,activateAccount};