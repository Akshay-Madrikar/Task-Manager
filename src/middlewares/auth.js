const jwt = require('jsonwebtoken');
const User = require('../models/user');

// To authenticate the user
const auth = async (req, res, next) => {
    try{
        // Getting token written in header via postman
        // i.e. Authorization: Bearer yourToken
        // As we want only token, we use replace method to replace
        // 'Bearer ' -> ''
        const token = req.header('Authorization').replace('Bearer ','');

        // verify method takes 2 args:
        // 1. token
        // 2. secret signature used while creating it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);

        //This is a special way for you to tell Mongoose that you want to find an element in the tokens array 
        //whose token field equal the value you're providing.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if(!user){
            throw new Error();
        };

        // To give that particular route handler above user that we fetched from database
        // Also as req doesn't have any user and token property,
        // we can create new properties for future use!
        req.token = token;
        req.user = user;
        next()
    } catch(error) {
        res.status(401).send({ error: 'Please authenticate!' });
    }
    
};

module.exports = auth;