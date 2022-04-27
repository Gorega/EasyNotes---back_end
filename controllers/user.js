const User = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const mail = require("../controllers/mail");

let digit;
let tries = 0;
let expiresAt;
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
    const {newEmail} = req.body;
    let emailMessage = `<h1>EasyNotes</h1> 
        <p>Verify your email address</p>
        <hr/>
        <p> Here is the code required in order to verify your email address: </p>
        <p>${randomNumber()}</p>
        `
    let emailSubject = "EasyNotes - verify your email address"
    try{ 
        if(!newEmail){
            return res.status(422).json({msg:"Please enter a valid email address"})
        }
        const user = await User.findOne({email:newEmail});
        if(user){
            return res.status(422).json({msg:"Email provided is used,please choose unused one"});
        }
        tries += 1;
        if(tries <= 3){
            mail(newEmail,emailMessage,emailSubject);
            expiresAt = new Date().getTime();
            return res.status(200).json({msg:"success"});
        }
        setTimeout(()=>{
            tries = 0
        },300000)
        return res.status(422).json({msg:"Please wait a few minutes before trying again."})
    }catch(err){
        return res.status(500).json({msg:"server error"})
    }
}

async function patchUserEmail(req,res){
    const {email,userId} = req.user;
    const {newEmail,verificationCode,password} = req.body;
    try{
        const user = await User.findById({_id:userId});

        if(!password){
            return res.status(422).json({msg:"Incorrect password"});
        }
        // insert your password to authorize changing email
        const comparePass = await bcrypt.compare(password,user.password);
        if(!comparePass){
            return res.status(422).json({msg:"Incorrect password"});
        }

        if(!newEmail){
            return res.status(422).json({msg:"Please provide a valid email address"});
        }
        if(new Date().getTime() > new Date(expiresAt + 10*60000)){
            return res.status(404).json({msg:"Expired verification code"});
        }
        
        // insert verifcation code to authorize changing email
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
        const randomLink = jwt.sign({data:"randomtext"},process.env.JWT_SECRET_CODE,{expiresIn:"1h"});

        // send mail
        let emailMessage = `<h1>EasyNotes</h1> 
        <p>Reset your account password</p>
        <hr/>
        <p> Kindly use the link below in order to reset your account password: </p>
        <a href="https://easynotes-gorega.herokuapp.com/reset-pass-redirect/${randomLink}">Link</a>
        `
        let emailSubject = "EasyNotes - reset your account password"
        tries+=1;
        if(tries <= 3){
            mail(email,emailMessage,emailSubject);
            await new Token({
                userId:user._id,
                token:randomLink,
            }).save();
            return res.status(200).json({msg:"success"});
        }else{
            setTimeout(()=>{
                tries = 0
            },300000)
            res.status(422).json({msg:"Please wait a few minutes before trying again."})
        }
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function resetUserPass(req,res){
        const {uri} = req.query;
        let {newPassword,comfrimNewPass} = req.body;
        try{
            if(!newPassword || !comfrimNewPass || newPassword.length < 8){
                return res.status(422).json({msg:"Please type a vaild password"});
            }
            if(newPassword !== comfrimNewPass){
                return res.status(422).json({msg:"Password don't match"});
            }
            const hashPassword = await bcrypt.hash(newPassword,10);
            newPassword = hashPassword;
            comfrimNewPass = hashPassword;
            const user = await Token.findOne({token:uri});
            if(new Date().getTime() > new Date(user.date.getTime() + 10*60000)){
                return res.status(404).json({msg:"Expired link"});
            }
            await User.findOneAndUpdate({_id:mongoose.Types.ObjectId(user.userId)},{password:newPassword,confirmPass:comfrimNewPass});
            await Token.deleteMany({});
            return res.status(200).json({msg:"You password has been reset successfuly"});

        }catch(err){
            return res.status(500).json({msg:"server error"});
        }
}

async function uploadAvatarPreview(req,res){
    try{
        // const avatarName = req.file.fieldname + "-" + Date.now() + path.extname(req.file.originalname);
        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return res.status(422).json({msg:"Only image files are allowed!"})
        }
        return res.status(200).json({preview:req.file.filename});
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function updateAvatar(req,res){
    const {userId} = req.user;
    const {avatar} = req.body;
    try{
        await User.findOneAndUpdate({_id:userId},{image:avatar});
        return res.status(200).json({msg:"success"})
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function deleteAvater(req,res){
    const {file} = req.query;
    try{
        fs.unlink(`avaters/${file}`,(err)=>{
            if(err){
                return res.status(404).json({msg:"Unfound"})
            }
            return res.status(200).json({msg:"deleted successfuly"})
        })
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}


module.exports = {user,patchUsername,patchUserPass,sendEmail,patchUserEmail,sendResetPassMail,resetUserPass,uploadAvatarPreview,updateAvatar,deleteAvater};