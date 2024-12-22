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

//rout for test 
app.get ('/test', (req, res) => {
 res. status(200) .send('ok')

})

//route for time 
app.get('/time', (req, res)=>{
    const time  = new Date() .toLocaleTimeString(); // .toLocaleDateString= Get current time in hh:mm:ss format
    res.status(200) .send(time )
})

// how to make index.js to open the browser -whenever running npm run dev:(ask e ma zobtet me3e)
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
//     open(`http://localhost:${port}`);  // This will open the default browser automatically
//   })