const express = require('express');
const path = require('path');
const { json } = require('stream/consumers');
const app = express();
const port = 8000;
const fs = require("fs");
const reviewData = require("./libraryData.json")

app.use(express.static('frontend'));
//serving files from the frontend folder

app.use(express.urlencoded({ extended: true }));
app.post('/submit', (req, res) => {
    //Creates a route that listens for POST requests to '/submit'
    const formData = req.body;
    //req.body contains the form data.
    console.log('Form Data Recieved:', formData);

    fs.writeFile(
        "libraryData.json",
        JSON.stringify(formData), { flag: "a" },
        err => {
            if (err) throw err;

            console.log("Done");
        }
    )

});

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname, "/frontend/404notfound.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
