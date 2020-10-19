// CRUD operations

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;


// 
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID} = require('mongodb');
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';



MongoClient.connect(connectionURL, { useNewUrlParser : true ,useUnifiedTopology: true }, (error, client) => {
    if(error){
       return console.log('unable to connect to database');
    }

    const db = client.db(databaseName);

    // db.collection('users').findOne({
    //     _id: new ObjectID("5f736e8cf6e26d0a6f0c89e6")
       
    // }, (error, user) => {
    //     if(error){
    //         return console.log('could not fetch');
    //     }

    //     console.log(user);
    // })
    // db.collection('users').find({
    //     age:35
    // }).toArray((error, users) => {
    //     if (error){ return console.log('nope') ;}

    //     console.log(users);
    // })




    // db.collection('users').find({
    //     age:35
    // }).count((error, users) => {
    //     if (error){ return console.log('nope') ;}

    //     console.log(users);
    // })

    // db.collection('tasks').find({
    //     _id: new ObjectID("5f736ff5af68840b0a44e0d6")
    // }).toArray( (error, task) => {
    //     if (error){
    //         return console.log(error);
    //     }

    //     console.log(task);
    // })

    // db.collection('tasks').find({
    //     completed: false
    // }).toArray((error, task) => {
    //     if (error){
    //         return console.log("issues tissues")
    //     }

    //     console.log(task);
    // })



    // db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //     $set: {
    //         completed:true
    //     }
    // }).then((result) => {
    //     console.log("done");
    // }).catch((error) => {
    //     console.log("error");
    // })

    // db.collection('tasks').deleteMany({
    //     completed: true
    // }).then((result) => {
    //     console.log("completed tasks are gone");
    // }).catch((error) => {
    //     console.log('something went wrong');
    // })

    

})