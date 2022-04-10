const User = require("../models/user");

async function user(req,res){
    const {userId} = req.user;
    try{
        const user = await User.findOne({_id:userId});
        return res.status(200).json({userId:user._id,email:user.email,username:user.username,image:user.image})
    }catch(err){
        return res.status(500).json({msg:"server error"})
    }
}

module.exports = user;