require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5eb7ec686fe3ff261c2c00ef').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
// }).then((result) => {
//     console.log(result)
// }).catch(error => console.log(error));


// async-await always returns a promise internally!
const deleteTaskAndCount = async(id) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: true });
    return count;
}

deleteTaskAndCount('5eb7ec686fe3ff261c2c00ef').then((count) => {
    console.log(count);
}).catch((error) => {
    console.log(error);
});