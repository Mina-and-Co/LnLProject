const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

app.use(express.static('frontend'));
//serving files from the frontend folder

app.use(express.urlencoded({ extended: true }));
//urlencoded parses the POST request
app.post('/submit', (req, res) => {
    //Creates a route that listens for POST requests to '/submit'
    const formData = req.body;
    //req.body contains the form data.
    console.log('Form Data Recieved:', formData);
    console.log('Form Data Recieved:', req.body);
    //send a response back to the server console
    res.send(`
        <!DOCTYPE html>
        <head>
        <title>Sucess!</title>
        </head>
        <body>
        <h1>Success!</h1>
        <p>Book: ${req.body.book} by ${req.body.author}.</p>
        <p>Is it a good series? ${formData.goodSeries}</p>
        <p>You rated it ${formData.finalRating} stars.</p>
        <p>The book's genre(s) was/were: ${formData.genre}.</p>
        <p>The violence rating was ${formData.violence}.</p>
        </body>`);
});//res.send sends an HTML response to the browser to confirm.

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname, "/frontend/404notfound.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
