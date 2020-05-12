const express = require('express');
const Task = require('../models/task');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Creating new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try{
        await task.save();
        res.status(201).send(task);
    } catch(error) {
        res.status(400).send(error);
    };
});

// Read tasks '/tasks?completed=true'
//      '/tasks/limit=2&skip=10'
//      '/tasks/sortBy=createdAt:desc'
router.get('/tasks', auth, async (req, res) => {
            //--------- One way to find tasks of particular user-------
        //const tasks = await Task.find({ owner: req.user._id });
        //res.send(tasks);
        
        //---------- Alternative way --------------------------
        // populate() in mongoose is used for populating the data inside the reference.
        const match = {};
        const sort = {};

        if(req.query.completed) {
            match.completed = req.query.completed === 'true'
        };

        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);

    } catch(error) {
        res.status(500).send(error);
    };
});

// Read individual task
router.get('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task) {
            return res.status(404).send('No such task!')
        }
        res.send(task);
    } catch(error) {
        res.status(500).send(error);
    };
});

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return  res.status(400).send({
            error: 'Invalid operation!'
        });
    };

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        
        if(!task) {
            return res.status(404).send('Task not found!');
        } 
        
        updates.forEach( update => task[update] = req.body[update] );
        task.save();
        res.send(task);
    } catch(error) {
        res.status(400).send(error);
    };
});

// Delete a task
router.delete('/tasks/:id', auth,  async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if(!task) {
            return res.status(404).send('Task not found!');
        }
        res.send(task);
    } catch(error) {
        res.status(500).send(error);
    };
});

module.exports = router;