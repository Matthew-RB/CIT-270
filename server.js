const express = require("express");

const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const {v4: uuidv4} = require('uuid');

const Redis = require('redis'); // the libary 

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"}); //this points to redis

app.use(bodyParser.json()); //This looks for incoming data

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Hello Matthew");
});

app.post('/login',async (req, res) =>{
    const loginUser = req.body.userName; //Access the username data
    const loginPassword = req.body.password; //Access the password data
    console.log('Login username:' +loginUser);
    const correctPassword = await redisClient.hGet('UserMap',loginUser); //gets correct password from redis
    if (correctPassword == loginPassword){
        const loginToken = uuidv4();
        res.send(loginToken);
    } else {
        res.status(401);
        res.send('Incorrect password for '+loginUser);
    }
});

app.listen(port, () => {
    redisClient.connect(); 
    console.log("listening");
});

