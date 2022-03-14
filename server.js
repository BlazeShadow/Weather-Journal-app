// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

//POST route
app.post("/add", post = (req, res)=>{
    projectData = req.body;
    res.send(projectData); 
});

//GET route 
app.get("/all", get = (req,res)=>{
    res.send(projectData)
});

//Server port & function to test it
const port = 3000;
app.listen(port, listening = ()=>{
    console.log(`Server is running at ${port}`)
});