const express = require("express");
const path = require("path");

const app = express();
const port = 8000;

const bookRoutes = require("./routes/bookRoutes");

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.urlencoded({ extended: true}));
app.use(express.json({ extended: true}));

app.use("/", bookRoutes);

//The 404 route
app.use(function (_req, res) {
    res.status(404).sendFile(path.join(__dirname, "..", "frontend", "404notfound.html"));
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
