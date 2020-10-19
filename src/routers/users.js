const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth =require('../middleware/auth');
const Task = require("../models/task");
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/accounts');


// Route to register a new user
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user, token});
    } catch (e) {
        res.status(401).send(e);
    }
});

// route for logging in a user
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(e){
        res.status(500).send();
    }
});

// route for logging out user
router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send();
    }
})

// route for logging out user from all devices
router.post('/users/logoutall', auth, async(req,res) => {
    
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// route to get users profile - have to be authenticated
router.get("/users/me", auth , async (req, res) => {
    res.send(req.user)
});

// route for updating users info
router.patch("/users/me", auth, async (req, res) => {
    const _id = req.user._id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "email", "password"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "invalid update!" });
    }

    try {
        const user = req.user;

        updates.forEach( (update) => {
            user[update] = req.body[update]
        })

        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});


// route for deleting a user
router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id;

    try{
        
        const tasks = await Task.deleteMany({owner: _id})
        const user = await User.deleteOne({_id});
        sendCancellationEmail(req.user.email, req.user.name)
        if(!user){
            return res.status(400).send();
        }
        res.send("User Deleted");
    }catch(e){
        res.status(500).send();
    }
})


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if( !file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('not a jpg, jpeg or png'))
        }
        cb(undefined, true)
    }
})


// route for uploading an avatar - uses multer and sharp
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width:250,
        height:250
    }).png().toBuffer()
    
    
    
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})


// route for deleting avatar
router.delete('/users/me/avatar', auth , async (req,res) => {

        req.user.avatar = undefined;
        
        await req.user.save();
        res.send("deleted avatar");
});


// route for getting user  avatar
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user){
            throw new Error("no");
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send("what");
    }
})
module.exports = router;


