const express = require('express');
const app = express();
const port = 8000;

app.use(express.static('frontend'));
//serving files from the public folder

app.use(express.urlencoded({ extended: true }));
//urlencoded parses the POST request
app.post('/submit', (req, res) => {
    //Creates a route that listens for POST requests to '/submit'
    const formData = req.body;
    //req.body contains the form data.
    console.log('Form Data Recieved:', formData);
    //send a response back to the server console
    res.send(`
        <!DOCTYPE html>
        <head>
        <title>Sucess!</title>
        <link rel="stylesheet" frontend/styles.css">
        </head>
        <body>
        <h1>Success!</h1>
        <p>Your review: ${formData}</p>
        <p>Is it a good series? ${formData.goodSeries}</p>
        <p>We recieved your review: "${formData.rating}"</p>
        <p>The book's genre(s) was/were: ${formData.genre}.</p>
        <p>The violence rating was ${formData.violence}.</p>
        </body>`);
});//res.send sends an HTML response to the browser to confirm.
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
