//E:/mongodb/bin/mongod.exe --dbpath=/mongodb-data
const mongoose = require('mongoose');

// connect method takes 2 params:
// 1. url: url to connect with database-name
// 2. options: like useNewUrlParser to parse the url(1) properly
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
});