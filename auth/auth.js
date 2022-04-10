const jwt = require("jsonwebtoken");

async function auth(req,res,next){
    try{
        const token = req.cookies.token;
        const payload = jwt.verify(token,"jWnZr4u7x!A%D*G-KaPdRgUkXp2s5v8y");
        req.user = {userId:payload.userId,username:payload.username,email:payload.email};
        next();
    }catch(err){
        return res.status(500).json({msg:"Unathorized"})
    }

}

module.exports = auth;