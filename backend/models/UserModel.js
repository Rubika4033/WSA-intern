import mongoose  from "mongoose";
import bcrypt from "bcrypt";
const userschema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"This is required"],
    },
    email:{
        type:String,
        required:[true,"This is required"],
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,"This is required"],
        minlength:6,
    },
    avatar:{
        type:String,
        default: "",
    },
    resetPasswordToken:String,
    resetPasswordTokenExpires:Date,

    favourites:[{
            id:{type:String,required:true},
            name:String,
            artist_name:String,
            image:String,
            duration:String,
            audio:String,
        },
    ],


    

});
// presave function
userschema.pre("save",async function(){
    if(!this.isModified("passsword")) return ;
    const salt=await bcrypt.genSalt(10);
    this.password =await bcrypt.hash(this.password,salt);
});
// compare password
userschema.methods.comparePassword = function(enterdPassword){
    return bcrypt.compare(enterdPassword,this.password);
};
const User=mongoose.model("User",userschema);
export default User; 