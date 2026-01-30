const express = require('express');
const path = require('path');
const { json } = require('stream/consumers');
const app = express();
const port = 8000;
const fs = require("fs");
const file = require("./libraryData.json")
const DataArr = Object.values(file)

app.use(express.static('frontend'));
//serving files from the frontend folder

app.use(express.urlencoded({ extended: true }));
app.post('/submit', (req, res) => {
    //Creates a route that listens for POST requests to '/submit'
    const formData = req.body;
    //req.body contains the form data.
    console.log('Form Data Recieved:', formData);

    if (formData.tag && !Array.isArray(formData.tag)) {
        formData.tag = [formData.tag];
    }
    if (formData.genre && !Array.isArray(formData.genre)) {
        formData.genre = [formData.genre];
    }

    DataArr.push(formData)
    console.log("Done");

    fs.writeFile(
        "libraryData.json",
        JSON.stringify(DataArr), { encoding: 'utf-8', flag: "w" },
        err => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send('An error occurred in submission.')
            }
            //THIS IS A PLACEHOLDER!!!!!
            return res.status(200).send('Data has been submitted.');
        }
    );

});

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname, "/frontend", "404notfound.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
