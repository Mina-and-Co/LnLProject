const { timeStamp } = require("console");
const http = require("http");

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    const data = {
        message: "This is a JSON response",
        timestamp: Date.now(),
        note: 'He said "hello"'
    };
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(data));
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

//res.setHeader("Content-Type", "application/json");
//res.writeHead(200);
//res.end(JSON.stringify(data));
