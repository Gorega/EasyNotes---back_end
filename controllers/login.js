const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req,res){
    const {email,username,password} = req.body;
    try{
        const user = await User.findOne({email}) || await User.findOne({username});
        if(!user){
            return res.status(422).json({msg:"Incorrect uesrname or password"})
        }
        const comparePassword = await bcrypt.compare(password,user.password);
        if(!comparePassword){
            return res.status(404).json({msg:"Incorrect username or password"})
        }
        if(!user.active){
            return res.status(422).json({msg:"please verify you account"});
        }
        const token = jwt.sign({userId:user._id,username:user.username,email:user.email},process.env.JWT_SECRET_CODE)
        res.cookie("token",token,{
            httpOnly:true,
            useCredentials: false,
        })

        return res.status(200).json({userId:user._id,token})
    }catch(err){
        return res.status(500).json("server Error");
    }
}

module.exports = login;