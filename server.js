const express = require("express");

const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const {v4: uuidv4} = require('uuid');

app.use(bodyParser.json()); //This looks for incoming data

app.get("/", (req, res) => {
    res.send("Hello Matthew");
});

app.post('/login', (req, res) =>{
    const loginUser = req.body.userName; //Access the username data
    const loginPassword = req.body.password; //Access the password data
    console.log('Login username:' +loginUser);
    if (loginUser=="kill@gmail.com" && loginPassword=="Please@4"){
        const loginToken = uuidv4();
        res.send(loginToken);
    } else {
        res.status(401);
        res.send('Incorrect password for '+loginUser);
    }
});

app.listen(port, () => {
    console.log("listening");
});

