const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// const task1 = new Task({
//     description: 'Solve an algorithm                   ',
// });

// task1.save().then( task => console.log(task)).catch( error => console.log(error) );

module.exports = Task;