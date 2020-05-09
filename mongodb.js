const { MongoClient, ObjectID } = require('mongodb');

// MongoClient instance is needed for connection 
// ObjectID instance is needed to generate/get id of document

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// connect method takes 3 params:
// 1. url: url to connect
// 2. options: like useNewUrlParser to parse the url(1) properly
// 3. callback to run. It takes 2 parmas:
//  3.1. error: An error instance representing the error during the execution
//  3.2. client: The connected client
MongoClient.connect(
    connectionUrl, 
    { useNewUrlParser: true, useUnifiedTopology: true  }, 
    (error, client) => {
    if( error ){
       return console.log('Unable to connect to database');
    }

    // db method gives back a database reference. It takes 1 param:
    // 1. the name of the databse we tryin' to manipulate
    const db = client.db(databaseName);

//============== insertOne ========================/
    // insertOne method: Inserts a single document into MongoDB. It takes 2 args: 
    // 1. document to insert
    // 2. callback to run. It takes 2 params:
    //  2.1. error: An error instance representing the error during the execution
    //  2.2. result: The result object if the command was executed successfully

    db.collection('users').insertOne({
        name: 'Slowb0y',
        age: 23
    }, (error, result) => {
        if(error) {
            return console.log('Unable to insert user');
        }

        //ops: All the documents inserted using insertOne/insertMany/replaceOne
        console.log(result.insertedCount);
    });
//===================================================/


//============== insertMany ========================/
    // insertMany method: Inserts array of documents into MongoDB. It has 2 args: 
    // 1. array of documents to insert
    // 2. callback to run. It takes 2 params:
    //  2.1. error: An error instance representing the error during the execution
    //  2.2. result: The result object if the command was executed successfully

    // db.collection('users').insertMany([
    //     {
    //     name: 'Jeol',
    //     age: 23
    //     },
    //     {
    //     name: 'Ronit',
    //     age: 20
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert user');
    //     }

    //     //ops: All the documents inserted using insertOne/insertMany/replaceOne
    //     console.log(result.ops);
    // });


    db.collection('tasks').insertMany([
        {
            description: 'Solve an algorithm',
            completed: true
        },
        {
            description: 'Exercise',
            completed: false
        },
        {
            description: 'Do dishes',
            completed: false
        }
    ], (error , result) => {
        if(error) {
            return console.log('Unable to insert tasks');
        }

        console.log(result.ops);
    })
//======================================================/


//============== findOne ===============================/
    // findOne method: fetches the first document that matches the query
    // 1. object to find
    // 2. callback to run. It takes 2 params:
    //  2.1. error: An error instance representing the error during the execution
    //  2.2. general result: The result object if the command was executed successfully

    // db.collection('users').findOne({name: 'Slowb0y'}, (error, user) => {
    //     if(error) {
    //         console.log('unable to fetch');
    //     }

    //     console.log(user);
    // });

        db.collection('users').findOne( new ObjectID("5eb67904e1a4b304788de52a"), (error, user) => {
        if(error) {
            console.log('unable to fetch');
        }

        console.log(user);
        });

//======================================================/


//============== find ==================================/
    // find method: Creates a cursor for a query that can be used to iterate over results from MongoDB
    // It takes 1 arg:
    // 1. query: The cursor query object

    // The Cursor is a MongoDB Collection of the document which is returned upon the find method execution
    // By default, it is automatically executed as a loop. 
    // ... In simple words when we call a find method, all the documents which are returned are saved in a virtual cursor

    // toArray method returns an array of documents
    // It takes 1 arg:
    // 1. callback to run. It takes 2 args:
    //  1.1. error: An error instance representing the error during the execution
    //  1.2. documents: All the documents the satisfy the cursor

    db.collection('users').find({ age: 23 }).toArray((error, doc) => {
        console.log(doc);
    })
//======================================================/


//============== updateOne ==================================/
    
    // updateOne method: updates a single document in a collection
    // It takes 3 args:
    // 1. filter: The Filter used to select the document to update
    // 2. update: The update operations to be applied to the document
    // 3. callback (optional if you return promise). Here we return a promise

    db.collection('users').updateOne({
        _id: new ObjectID("5eb67a2e3840083a6474c7be")
    },{
        $set: {
            name: 'Aashish'
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
//======================================================/


//============== updateMany ==================================/
    // updateMany method: Updates multiple documents in a collection
    // It takes 3 args:
    // 1. filter: The Filter used to select the document to update
    // 2. update: The update operations to be applied to the document
    // 3. callback (optional if you return promise). Here we return a promise
    db.collection('tasks').updateMany({
        completed: false
    },{
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

//======================================================/


//============== deleteOne ==================================/
    
    // deleteOne method: Deletes a document from a collection
    // It takes 2 args:
    // 1. filter: The Filter used to select the document to delete
    // 2. callback (optional if you return promise). Here we return a promise
    db.collection('users').deleteOne({
        _id: new ObjectID("5eb67a2e3840083a6474c7bf")
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })

//===========================================================/

});