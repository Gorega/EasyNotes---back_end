const jwt = require("jsonwebtoken");

async function auth(req,res,next){
    try{
        const token = req.cookies.token;
        const signed = req.cookies.signed;
        const payload = jwt.verify(token,process.env.JWT_SECRET_CODE);
        if(!signed){
            return res.status(401).json({msg:"Unathorized"})
        }
        req.user = {userId:payload.userId,username:payload.username,email:payload.email};
        next();
    }catch(err){
        return res.status(500).json({msg:"Unathorized"})
    }

}

async function checkAuth(req,res,next){
    const token = req.cookies.token;
    if(token){
            jwt.verify(token,process.env.JWT_SECRET_CODE,(err,result)=>{
            if(err){
                return res.status(401).json({msg:"Unauthanticated"})
            }else{
                next();
            }
        });
    }else{
        return res.status(401).json({msg:"Unathorized"})
    }
}

module.exports = {auth,checkAuth};