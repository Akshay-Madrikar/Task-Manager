const express = require('express');
const User = require('../models/user');

// A router object is an isolated instance of middleware and routes. 
// You can think of it as a “mini-application,” capable only of performing middleware and routing functions. 
// Every Express application has a built-in app router.
// The top-level express object has a Router() method that creates a new router object. 
const router = new express.Router();

// Creating new user
router.post('/users', async (req, res) => {
//============== PROMISE WAY ====================/
        // const user = new User(req.body);
        // user.save().then(() => {
        //     res.status(201).send(user);
        // }).catch((error) => {
        //     res.status(400).send(error);
        // });
//================================================/
    
//============== ASYNC-AWAIT WAY ====================/
        const user = new User(req.body);
        try {
            await user.save();
            res.status(201).send(user);
        }catch(error) {
            res.status(400).send(error);
        };
//====================================================/
});
    
// Read users
router.get('/users', async (req, res) => {
        try{
            const users = await User.find({});
            res.send(users);
        } catch(error) {
            res.status(500).send(error);
        };
});
    
// Read individual user
router.get('/users/:id', async (req, res) => {
        const _id = req.params.id;
    
        try{
            const user = await User.findById(_id);
            if(!user) {
                return res.status(404).send('User not found!')
            }
            res.send(user);
        } catch(error)  {
            res.status(500).send(error);
        };    
});
    
// Update user
//A PATCH request on the other hand, is used to make changes to part of the resource at a location. 
//That is, it PATCHES the resource — changing its properties. 
//It is used to make minor updates to resources and it’s not required to be idempotent.
router.patch('/users/:id', async (req, res) => {
    
        // To not allow user to update fields which are not present in User model
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name','email','password','age'];
        const isValidOperation = updates.every( update => allowedUpdates.includes(update) );
    
        if(!isValidOperation) {
           return  res.status(400).send({
               error: 'Invalid operation!'
           });
        };
        
        try{
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
    
            if(!user) {
                return res.status(404).send('User not found!');
            }
            res.send(user);
        } catch(error) {
            res.status(400).send(error);
        };
});
    
// Delete an user
router.delete('/users/:id', async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
    
            if(!user) {
                return res.status(404).send('User not found!');
            }
            res.send(user);
        } catch(error) {
            res.status(500).send(error);
        };
});

module.exports = router;