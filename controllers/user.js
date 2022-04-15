const User = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mail = require("../controllers/mail");

let digit;
const randomNumber = ()=>{
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    digit = randomNumber;
    return digit;
}

async function user(req,res){
    const {userId} = req.user;
    try{
        const user = await User.findOne({_id:userId});
        return res.status(200).json({userId:user._id,email:user.email,username:user.username,image:user.image})
    }catch(err){
        return res.status(500).json({msg:"server error"})
    }
}

async function patchUsername(req,res){
    const {userId} = req.user;
    const {newUsername} = req.body;
    try{
        if(!newUsername || newUsername.length <=2){
            return res.status(422).json({msg:"Please provide a vaild username"});
        }
        await User.findOneAndUpdate({_id:userId},{username:newUsername});
        return res.status(200).json({msg:"Your username has been updated successfuly"});
        
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function patchUserPass(req,res){
    let {currentPass,newPass,confirmNewPass} = req.body;
    const {email} = req.user;
    try{
        if(!currentPass){
            return res.status(422).json({msg:"You should type your current password"});
        }
        const user = await User.findOne({email:email});
        const comparePass = await bcrypt.compare(currentPass,user.password);
        if(!comparePass){
            return res.status(422).json({msg:"Incorrect current password"});
        }
        if(!newPass || !confirmNewPass || newPass.length < 8){
            return res.status(422).json({msg:"Please provide a vaild password"});
        }
        if(newPass != confirmNewPass){
            return res.status(422).json({msg:"Password don't match"});
        }
        const hashNewPass = await bcrypt.hash(newPass,10);
        newPass = hashNewPass;
        confirmNewPass = hashNewPass;

        await User.findOneAndUpdate({email:email},{password:newPass,confirmPass:confirmNewPass});
        return res.status(200).json({msg:"Password have been updated successfuly"});
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function sendEmail(req,res){
    let emailMessage = `<h1>EasyNotes</h1> 
        <p>Verify your email address</p>
        <hr/>
        <p> Here is the code required in order to verify your email address: </p>
        <p>${randomNumber()}</p>
        `
    try{ 
        await mail(req.body.newEmail,emailMessage);
        return res.status(200).json({msg:"success"});
    }catch(err){
        return res.status(500).json({msg:"server error"})
    }
}

async function patchUserEmail(req,res){
    const {email,userId} = req.user;
    const {newEmail,verificationCode,password} = req.body;
    try{
        const user = await User.findById({_id:userId});
        
        if(!newEmail){
            return res.status(422).json({msg:"please provide a valid email address"});
        }
        // insert your password to authorize changing email
        const comparePass = await bcrypt.compare(password,user.password);
        if(!comparePass){
            return res.status(422).json({msg:"Incorrect password"});
        }

        if(verificationCode != digit || !verificationCode){
            return res.status(422).json({msg:"Incorrect verification code"});
        }
        await User.findOneAndUpdate({email:email},{email:newEmail});
        return res.status(200).json({msg:"Your email address has been updated successfuly"});
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function sendResetPassMail(req,res){
    const {email} = req.body;
    try{
        const user = await User.findOne({email:email});
        if(!user || !email){
            return res.status(404).json({msg:"Email entered not exist"});
        }
        // create randomlink
        const randomLink = jwt.sign({data:"randomtext"},process.env.JWT_SECRET_CODE);

        // send mail
        let emailMessage = `<h1>EasyNotes</h1> 
        <p>Reset your account password</p>
        <hr/>
        <p> Kindly use the link below in order to reset your account password: </p>
        <a href="http://localhost:3000/reset-pass-redirect/${randomLink}">Link</a>
        `
        await mail(email,emailMessage);
        await new Token({
            userId:user._id,
            token:randomLink,
            date:new Date().getTime()
        }).save();
        return res.status(200).json({msg:"success"});
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function resetUserPass(req,res){
    const {token} = req.params;
    let {newPassword,comfrimNewPass} = req.body;
    try{
        const user = await Token.findOne({token:token});
        if(!newPassword || !comfrimNewPass || newPassword.length < 8){
            return res.status(422).json({msg:"Please type a vaild password"});
        }
        if(newPassword !== comfrimNewPass){
            return res.status(422).json({msg:"Password don't match"});
        }
        const hashPassword = await bcrypt.hash(newPassword,10);
        newPassword = hashPassword;
        confirmPass = hashPassword;
        await User.findOneAndUpdate({_id:mongoose.Types.ObjectId(user.userId)},{password:newPassword,confirmPass:comfrimNewPass});
        await Token.deleteMany({});
        return res.status(200).json({msg:"active"});

    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

module.exports = {user,patchUsername,patchUserPass,sendEmail,patchUserEmail,sendResetPassMail,resetUserPass};