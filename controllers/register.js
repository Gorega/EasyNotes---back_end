const User = require("../models/user");
const bcrypt = require("bcrypt")

async function register(req,res){
    let {username,email,password,confirmPass} = req.body;
    try{
        if(!username){
            return res.status(422).json({msg:"Username should not be empty"});
        }
        if(username.length <= 3){
            return res.status(422).json({msg:"Username should not be less than 3 characters"});
        }
        if(!email){
            return res.status(422).json({msg:"Please provide a valid email address"});
        }
        if(!password){
            return res.status(422).json({msg:"Password should not be empty"});
        }
        if(password !== confirmPass){
            return res.status(422).json({msg:"password don't match"});
        }
        const hashPassword = await bcrypt.hash(password,10);
        password = hashPassword
        confirmPass = hashPassword
        const user = await User.create({username,email,password,confirmPass});
        return res.status(201).json(user);
    }catch(err){
        return res.status(500).json("server error");
    }
}

module.exports = register;