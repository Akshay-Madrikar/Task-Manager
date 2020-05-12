const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middlewares/auth');

// A router object is an isolated instance of middleware and routes. 
// You can think of it as a “mini-application,” capable only of performing middleware and routing functions. 
// Every Express application has a built-in app router.
// The top-level express object has a Router() method that creates a new router object. 
const router = new express.Router();

//------- Creating new user -----------
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
            const token = await user.generateAuthToken();
            res.status(201).send({user, token});
        }catch(error) {
            res.status(400).send(error);
        };
//====================================================/
});

//---------- Login user ----------------
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentails(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(error) {
        res.status(400).send(error);
    };
});
    
//-------- Read user profile ----------------
router.get('/users/me', auth, async (req, res) => {
    // req.user getting through auth middleware
    res.send(req.user);
});

//----------------- Update user -----------------
//A PATCH request on the other hand, is used to make changes to part of the resource at a location. 
//That is, it PATCHES the resource — changing its properties. 
//It is used to make minor updates to resources and it’s not required to be idempotent.
router.patch('/users/me', auth, async (req, res) => {
    
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
            updates.forEach( update => req.user[update] = req.body[update] );
            req.user.save(); 
            res.send(req.user);
        } catch(error) {
            res.status(400).send(error);
        };
});

//--------- Upload picture --Explore multer npm module -------------
const upload = multer({ 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file ,cb) {
        //!file.originalname.match(/\.{jpg|jpeg|png}$/)
        if(!file.originalname.endsWith('.jpg' || '.jpeg' || '.png')) {
            return cb(new Error('Please upload an image!'));
        }
        
        cb(undefined, true);
    }
});
    // If error occurs we can get an html response
    // In order to get json response we write callback function for the router
    // It must contains this args: (error,req,res,next) to let express know it is created for handling errors
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req ,res) => {
    // converting profile pic into png with particular width and height using sharp library
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save(); 
    res.send({});
}, (error, req, res, next) => {
    res.status(400).send({ errorMessage: error.message });
});

//------------ Delete user avatar -----------------
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send({ message: 'Profile picture deleted!' });
});

//------------ Fetch user avatar -----------------
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send();
    } catch(error) {
        res.status(400).send(); 
    }
});

//---------- Logout an user -----------------
router.post('/users/logout', auth, async (req, res) => {
    try {
        // getting tokens array from user and then filtering it to find
        // token which has token property(also _id property) !== req.token
        req.user.tokens = req.user.tokens.filter( (token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        
        res.status(200).send({ 
            userLogout: req.user.name, 
            email: req.user.email 
        });
    } catch(error) {
        res.status(500).send(error);
    };
});

//----------- Logout all sessions ------------------
router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send({ 
            message: "Logged out from all sessions!"
        });
    } catch(error) {
        res.status(500).send(error);
    };
})
    
//--------- Delete user ------------------
router.delete('/users/me', auth, async (req, res) => {
        try {
            // Delete a particular user by passing id in url 
            // const user = await User.findByIdAndDelete(req.params.id);
    
            // if(!user) {
            //     return res.status(404).send('User not found!');
            // }

            await req.user.remove();
            res.send(req.user);
        } catch(error) {
            res.status(500).send(error);
        };
});

module.exports = router;

//---------- Read individual user--------------
// router.get('/users/:id', async (req, res) => {
//         const _id = req.params.id;
    
//         try{
//             const user = await User.findById(_id);
//             if(!user) {
//                 return res.status(404).send('User not found!')
//             }
//             res.send(user);
//         } catch(error)  {
//             res.status(500).send(error);
//         };    
// });

//-------------- Update an user by passing id ------------------------
// router.patch('/users/:id', async (req, res) => {
    
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name','email','password','age'];
//     const isValidOperation = updates.every( update => allowedUpdates.includes(update) );

//     if(!isValidOperation) {
//        return  res.status(400).send({
//            error: 'Invalid operation!'
//        });
//     };
    
//     try{
            // New code for update
//         const user = await User.findById(req.params.id);
//         updates.forEach( update => user[update] = req.body[update] );
//         user.save();


//            // ---- Need to change the below line of code for update so that
//            // our userSchema middleware runs correctly ----
//            // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//            //     new: true,
//            //     runValidators: true
//            // });

//         if(!user) {
//             return res.status(404).send('User not found!');
//         }
//         res.send(user);
//     } catch(error) {
//         res.status(400).send(error);
//     };
// });