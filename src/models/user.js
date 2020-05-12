const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!');
            }
        }
    },
    password :{
        type: String,
        required: true,
        trim:true,
        minlength: 6,
        validate(value) {
            if(validator.contains(value.toLowerCase(),'password')){
                throw new Error('Your password must not contain password in it!');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        max: 100,
        validate(value) {
            if( value < 0 ){
                throw new Error('Age must be a positive number!');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},
    // options arg in schema have different option available!
    {
        timestamps: true
    }
);

// virtual property doesn't mean that data is stored in the database
// its just realtionship between two entities/models
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner' // owner(foreign) field of Task is associated with _id of user(localField)
});

// To add access indirectly by creating instance of model
// we use methods
// toJSON converts it into string
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject()

    // As we don't user to see password and tokens
    // So, we delete it from user and then send the object!
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    //sign() takes 3 args:
    // 1. payload that identifies particular field of instance of model
    // 2. secret signature
    // 3. options object
    const token = jwt.sign({ _id: user._id.toString() }, 'btownboyz');

    // To save the generated token into user database through model
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// To add access directly from model
// we use 'statics'
userSchema.statics.findByCredentails = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error('Unable to login');
    };

    //compare() compares the hashed password with password provided
    // and returns true or false respectively
    const isMatch = await bcryptjs.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Unable to login');
    };

    return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this;
    
    if(user.isModified('password')){
        // hash() takes 2 params:
        // 1. password to hash
        // 2. no.of rounds
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

// model method is used for creating/reading documents from underlying MONGODB database
// It takes 2 params:
// 1. name of the collection
// 2. object containg the fields for that collection

//** Mongoose automatically looks for the plural, lowercased version of your model name. 
//** Thus, for the example above, the model Tank is for the tanks collection in the database.
const User = mongoose.model('User', userSchema);

//================== Demo to save data without postman ==================/
// // user1 is an instance i.e document of User collection
// const user1 = new User({
//     name: 'Slowb0y    ',
//     email: 'asd@gmail.com',
//     password: '23',
//     age: 54
// });

// // save() is used to save the document. With save(), you get full validation and middleware.
// // It returns an promise
// user1.save().then((result) => {
//     console.log(result)
// }).catch(error => console.log('Error : ', error));
//=======================================================================/

module.exports = User;