// create an express server 
const express = require('express');
const app = express(); //calling express as a function we create an appliciation that allows us to set an entire server 
const open = require('open');

//create a route 
app .get('/', (req, res)=> { // /: path(create a route); function get 3 different parameters request, response and next but in this rout we dont need next
console.log ('url recieved')
res.send ('ok') //send data back to the user 
})
// make the application run 
const port=3000; // our server is liseting on port 3000 for bunch of different requests 
// now we have an app running on port 3000



//rout for test 
app.get ('/test', (req, res) => {
 res.json({
    status:200, message:"ok" 
 });

})

//route for time 
app.get('/time', (req, res)=>{
    const time  = new Date() .toLocaleTimeString(); // .toLocaleDateString= Get current time in hh:mm:ss format
    res.json({
        status:200, message: time
     })
});

//step 4 
app.get('/Hello/:id', (req, res)=>{
    const id = req.params.id || " "; // req.params.id = get the id from the url
    res.json({status:200, message:`Hello, ${id}`}); //res.json = send data back to the user in json format
});

app.get('/search',(req,res) => {
    const searchQuery = req.query.s; // req.query.s = get the query from the url (Capture the query parameter 's')
    if (searchQuery){
        res.json({status:200, message:"ok", data:searchQuery});
    } else {
        res.status(500).json({ status: 500, error: true, message: "You have to provide a search" });
    }
})

//movie array
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
  ];

  //routers foe movie

  // Route for creating a new movie (will be implemented later)
  app.post('/movies/create', (req, res) => {
    const { title, year, rating } = req.body; //req.body: contains the data sent by the client (user) as part of the HTTP request.

    if (!title || !year || typeof year !== 'number' || year.toString().length !== 4) {
        //If validation fails, the server responds 
        return res.status(400).json({ status: 400, error: true, message: 'Invalid movie data' }); 
    }

    const newMovie = { title, year, rating: rating || 4 };
    movies.push(newMovie); //Add the New Movie to the Array

    res.status(201).json({ status: 201, data: movies }); //created successfully
});

//Returns the full list of movies as a JSON response.
app.get('/movie/read', (req, res) =>{ 
    res.status(200).json({status:200, data:movies}); 
})

// Route for updating a movie
app.put('/movies/update/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Extracting the id Parameter
    const { title, year, rating } = req.body; //Extracting Data from the Request Body

    // Check if the 'id' is valid
    if (id < 0 || id >= movies.length) {
        return res.status(404).json({ status: 404, error: true, message: 'Movie not found' });
    }
    /*id >= 0: The ID cannot be negative.
     id < movies.length: The ID must be within the valid range of the movies array 
      indexes.*/

    const movie = movies[id]; // Fetching the Movie to Update
    if (title) movie.title = title;
    if (year && typeof year === 'number' && year.toString().length === 4) movie.year = year;
    if (rating && typeof rating === 'number') movie.rating = rating;

    res.status(200).json({ status: 200, data: movies });
});

//delete movie 
app.delete('/movies/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id < 0 || id >= movies.length) {
        return res.status(404).json({ status: 404, error: true, message: 'Movie not found' });
    }

    movies.splice(id, 1); //Removes 1 item from the movies array at the specified index (id).
    res.status(200).json({ status: 200, data: movies });
});

app.get('/movies/read/by-date', (req, res) => {
    const sortedMovies = [...movies].sort((a, b) => a.year - b.year);
    res.status(200).json({
        status: 200,
        data: sortedMovies
    });
});

app.get('/movies/read/by-rating', (req, res) => {
    const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating);
    res.status(200).json({
        status: 200,
        data: sortedMovies
    });
});

app.get('/movies/read/by-title', (req, res) => {
    const sortedMovies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json({
        status: 200,
        data: sortedMovies
    });
});

// Route: Read a Movie by ID
app.get('/movies/read/id/:id', (req, res) => {
    const movieId = parseInt(req.params.id, 10); // Convert ID to an integer

    if (movieId >= 0 && movieId < movies.length) {
        res.status(200).json({
            status: 200,
            data: movies[movieId]
        });
    } else {
        res.status(404).json({
            status: 404,
            error: true,
            message: `The movie with ID ${movieId} does not exist.`
        });
    }
});



// Route to Add a New Movie (Create)
app.get('/movies/add', (req, res) => {
    const { title, year, rating } = req.query; // Get query parameters
    
    // Validate that 'title' and 'year' are provided
    if (!title || !year || isNaN(year) || year.length !== 4) {
      return res.status(403).send({
        status: 403,
        error: true,
        message: 'You cannot create a movie without providing a valid title and year'
      });
    }
  
    // Set default rating if not provided
    const newRating = rating ? parseFloat(rating) : 4; // Default rating to 4 if not provided
  // ? operator in this line is part of a ternary conditional operator, which is a shorthand way to perform an if-else statement.
    // Create a new movie object
    const newMovie = {
      title: title,
      year: parseInt(year), // Ensure the year is an integer
      rating: newRating
    };
  
    // Add the new movie to the movies array
    movies.push(newMovie);
  
    // Respond with the updated list of movies
    res.send({ status: 200, data: movies });
  });



// Route to Delete a Movie (Delete)
app.get('/movies/delete/:id', (req, res) => {
    const movieId = parseInt(req.params.id); // Get movie ID from the URL
  
    // Find the index of the movie with the given ID
    const movieIndex = movies.findIndex(movie => movie.id === movieId); //findIndex() is a method that searches the array for the first element that matches the condition
  
    // If movie with the given ID doesn't exist, return a 404 error
    if (movieIndex === -1) {
      return res.status(404).send({
        status: 404,
        error: true,
        message: `The movie with ID ${movieId} does not exist`
      });
    }
  
    // If movie exists, remove it from the array
    movies.splice(movieIndex, 1); //1 indicates that only one element (the movie) should be removed
  
    // Respond with the updated list of movies
    res.send({ status: 200, data: movies });
  });
  




  // how to make index.js to open the browser -whenever running npm run dev:(ask e ma zobtet me3e)
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    //  open.default(`http://localhost:${port}`);  // This will open the default browser automatically
  });
  