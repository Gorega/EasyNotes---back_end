
const logout = (req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({msg:"user Logged out"});
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }

}

module.exports = logout;