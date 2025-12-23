const express = require('express');
const app = express();
const port = 8000;

app.use(express.static('public'));
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
        <h1>Success!</h1>
        <p>Thank you, ${formData.name}!</p>
        <p>We recieved your message: "${formData.message}"</p>
        <p>We'll email you at ${formData.email} soon.</p>`);
});//res.send sends an HTML response to the browser to confirm.
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
