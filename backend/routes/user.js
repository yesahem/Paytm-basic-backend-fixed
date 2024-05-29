const express=require("express");
const router=express.Router();
const zod=require("zod");
const {user}=require("../db");
const jwt=require("jsonwebtoken");
const JWT_SEC=require("../config");

const signupSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string(),
});

router.post("/signup",async(req,res)=>{
    const body=req.body;
    const {success}=signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:" incorrect inputs"
        })
    }
    const user=user.findOne({
        username:body.username
    })
    if(user._id){
        return res.json({
            message:"Email already taken"
        })
    }

    const dbUser=await User.create({
        username:body.username,
        password:body.password,
        firstname:body.firstname,
        lastname:body.lastname,
    });
    const token=jwt.sign({
        userId:dbUser._id
    },JWT_SEC)
    res.json({
        message:"User created successfully",
        token:token
    })
});

const signinSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string(),
});
router.post("/signin",async(req,res)=>{
    const body=req.body;
    const {success}=signinSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:" incorrect inputs"
        })
    }
    const user=user.findOne({
        username:body.username
    })
    if(!user._id){
        return res.json({
            message:"you didn't signup"
        })
    }
    
    res.json({
        message:"User signin successfully",
        token:token
    })
});



module.exports=router;
