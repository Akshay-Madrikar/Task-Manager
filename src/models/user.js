const mongoose = require('mongoose');
const validator = require('validator');

// model method is used for creating/reading documents from underlying MONGODB database
// It takes 2 params:
// 1. name of the collection
// 2. object containg the fields for that collection

//** Mongoose automatically looks for the plural, lowercased version of your model name. 
//** Thus, for the example above, the model Tank is for the tanks collection in the database.
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
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
        validate(value) {
            if( value < 0 ){
                throw new Error('Age must be a positive number!');
            }
        }
    }
});

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

module.exports = User;