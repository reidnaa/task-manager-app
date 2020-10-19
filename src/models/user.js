const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim : true,
        
        
    },
    password:{
        minlength: 6,
        type: String,
        required:true,
        trim:true,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('cannot contain \'password\'');
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("email is messed");
            }
        }
        
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0 ){
                throw new Error("issues bro")
            }
        },
        default: 0

    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps:true
})


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON =  function(){
    const user = this;

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

userSchema.methods.generateAuthToken =  async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    
    await user.save();
    return token;
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}



// hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
   

    next();
})


//  this is not working
userSchema.pre("deleteOne", { document: true , query: false}, function (next) {
    const user = this;
    
    Task.deleteMany({ owner: user._id });
    next();
    
 })

const User = mongoose.model('User', userSchema)

module.exports = User;