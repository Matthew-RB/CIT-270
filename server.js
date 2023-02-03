const express = require("express");

const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const {v4: uuidv4} = require('uuid');

const Redis = require('redis'); // the libary 

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"}); //this points to redis

const cookieParser = require("cookie-parser");


app.use(bodyParser.json()); //This looks for incoming data

app.use(express.static('public'));

app.use(cookieParser());

app.post('/rapidsteptest', async (req, res)=>{
    const steps = req.body;
    await redisClient.zAdd("Steps", steps, 0);
    console.log('Steps', steps);
    res.send('saved');
});


app.get("/", (req, res) => {
    res.send("Hello Matthew");
});

app.get("/validate", async(req, res) =>{
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken);
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);
});

app.post('/login',async (req, res) =>{
    const loginUser = req.body.userName; //Access the username data
    const loginPassword = req.body.password; //Access the password data
    console.log('Login username:' +loginUser);
    const correctPassword = await redisClient.hGet('UserMap',loginUser); //gets correct password from redis
    if (correctPassword == loginPassword){
        const loginToken = uuidv4();
        await redisClient.hSet('TokenMap', loginToken, loginUser);
        res.cookie('stedicookie', loginToken);
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

