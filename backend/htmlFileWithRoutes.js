const http = require("http");
const fs = require('fs').promises;

let indexFile;

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(indexFile);

};

const server = http.createServer(requestListener);

fs.readFile(__dirname + "/pageone.html")
    .then(contents => {
        indexFile = contents;
        server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.error(`Could not read pageone.html file: ${err}`);
        process.exit(1);
    })

const host = req.headers.host || 'localhost:8000';
const url = new URL(req.url, `http://${host}`);

switch (url.pathname) {
    case '/books':
        // Validate HTTP method - only GET allowed for this endpoint
        if (req.method !== 'GET') {
            res.writeHead(405, { 'Allow': 'GET' });
            return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        res.writeHead(200);
        return res.end(books);

    case '/authors':
        if (req.method !== 'GET') {
            res.writeHead(405, { 'Allow': 'GET' });
            return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        res.writeHead(200);
        return res.end(authors);

    default:
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'Resource not found' }));
}

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
