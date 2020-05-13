//E:/mongodb/bin/mongod.exe --dbpath=/mongodb-data
const mongoose = require('mongoose');
const connectionUrl = process.env.MONGODB_URL;
// connect method takes 2 params:
// 1. url: url to connect with database-name
// 2. options: like useNewUrlParser to parse the url(1) properly
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});