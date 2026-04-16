const express = require("express");
const path = require("path");

const port = 8000;


async function start() {
    try {
        const bookRoutes = require("./routes/bookRoutes");
        const app = express();

        app.use(express.static(path.join(__dirname, "..", "frontend")));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json({ extended: true }));

        app.use("/", bookRoutes);

        //The 404 route
        app.use(function (_req, res) {
            res.status(404).sendFile(path.join(__dirname, "..", "frontend", "404notfound.html"));
        });

        await bookRoutes.dbReady;

        app.listen(port, () => {
            console.log(`Server is running at localhost:${port}`);
        });
        //do i need this??
    } catch (err) {
        console.error("Router/DB failed to initialize:", err);
        process.exit(1);
    }
}

start();
