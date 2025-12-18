const http = require("http");

const host = 'localhost';
const port = 8000;

const books = JSON.stringify([
    { title: "The Alchemist", author: "Author", tags: [], reviewCount: 0, reviewAverage: 0, },
    { title: "The Prophet", author: "Kahlil Gibran", tags: [], reviewCount: 0, reviewAverage: 0 }
]);

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    switch (req.url) {
        case "/":
            console.log("Home");
        case "/books":
            res.writeHead(200);
            res.end(books);
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Resource not found" }));
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
