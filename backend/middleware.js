const {JWT_SEC}=require("./config");
const jwt=require("jsonwebtoken");

const authMiddleware=(req,res,next)=>{
    const authHeader=req.header.authorization;
    if(!authHeader || !authHeader.startWith('Bearer')){
        return res.status(403).json({});
    }
    const token=authHeader.split(' ')[1];

    try{
        const decoded=jwt.verify(token,JWT_SEC);
        if(decoded.userId){
            res.userId=decoded.userId;
            next();

        }
        else{
            return res.status(403).json({});
        }
    }catch(err){
        return res.status(403).json({});
    }
}

module.export={
    authMiddleware
}