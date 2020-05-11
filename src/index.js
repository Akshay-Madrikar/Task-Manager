const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// For working after hosting on heroku
const port = process.env.PORT || 3000;

// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
// This method is called as a middleware in your application
app.use(express.json());

// Loading different routers in our application
app.use(userRouter, taskRouter);

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});