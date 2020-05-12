const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // reference to User model
    }
}, {
    timestamps: true
   }
);

// const task1 = new Task({
//     description: 'Solve an algorithm                   ',
// });

// task1.save().then( task => console.log(task)).catch( error => console.log(error) );

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;