const User = require("../models/user");
const bcrypt = require("bcrypt")

async function register(req,res){
    let {username,email,password,confirmPass} = req.body;
    try{
        if(password !== confirmPass ){
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