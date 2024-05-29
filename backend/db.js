const mongoose=require("mongoose");

mongoose.connect("https://localhost:27017/paytm");

const userSchema=new mongoose({
    username:{
        type:String,
        required:true,
        minLength:8,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:30
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    }
});

const user=mongoose.model("user",userSchema);

module.exports={
    user
}
