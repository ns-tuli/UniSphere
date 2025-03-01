import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a Name"]
    },
    email: {
        type: String,
        required:[true,"please give your email"],
        unique:true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please add a valid email'
        ]
    },
    studentId: { type: String, required: true, unique: true },
    role:{
        type:[String],
        enum:["user"],
        default:['user']
    },
    password:{
        type:String,
        // required:[true,"Please enter a valid password"],
        minlength:6,
        select:false,
    },
    department: { type: String },
  joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  eventReminders: [{
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    reminderTime: { type: Date }
  }],
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }

})
// encrypt password using bcrypt
UserSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})
// Sign jwt and return 
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRE 
        }
    );
};
// Match user entered password with actual password
UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
export default mongoose.model('User', UserSchema);