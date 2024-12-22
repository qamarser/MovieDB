// create an express server 
const express = require('express');
const app = express(); //calling express as a function we create an appliciation that allows us to set an entire server 
//create a route 
app .get('/', (req, res)=> { // /: path(create a route); function get 3 different parameters request, response and next but in this rout we dont need next
console.log ('url recieved')
res.send ('ok') //send data back to the user 
})
// make the application run 
app .listen(3000) // our server is liseting on port 3000 for bunch of different requests 

// now we have an app running on port 3000