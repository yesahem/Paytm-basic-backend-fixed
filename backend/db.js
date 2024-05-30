const mongoose=require("mongoose");

mongoose.connect("https://localhost:27017/paytm");

const userSchema= new mongoose.Schema({
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
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const user=mongoose.model("user",userSchema);

const Account = mongoose.model('Account', accountSchema);

module.exports={
    user,
    Account
}
