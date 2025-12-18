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
