const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();

// For working after hosting on heroku
const port = process.env.PORT || 3000;

//express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
//This method is called as a middleware in your application
app.use(express.json());

// Creating new user
app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// Creating new task
app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// Read users
app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

// Read individual user
app.get('/users/:id', (req, res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send('User not found!')
        }
        res.send(user);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// Read tasks
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

// Read individual task
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;

    Task.findById(_id).then((task) => {
        if(!task) {
            return res.status(404).send('No such task!')
        }
        res.send(task);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});