import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    dateOfBirth:{
        type:Date,
        required:true,
    },
    gender:{
        type:String,
        enum:["male","female","prefer not to say"],
        required:true
    },
    country:{
        type:String,
        required:true,
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    try {
        const salt=await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword=async function(password) {
    return bcrypt.compare(password,this.password);
}

const User=mongoose.model("User",userSchema);
export default User;