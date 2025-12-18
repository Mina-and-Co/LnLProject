const http = require("http");
const fs = require("fs");
const path = require("path");

const host = 'localhost';
const port = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf'
};

const publicDir = path.resolve(__dirname);

const requestListener = (req, res) => {
    let reqPath = req.url === '/' ? '/pageone.html' : req.url;

    reqPath = reqPath.split('?')[0];

    const safePath = path.resolve(publicDir, '.' + reqPath);

    if (!safePath.startsWith(publicDir)) {
        res.writeHead(403, { 'X-Content-Type-Options': 'nosniff' });
        res.end('Forbidden');
        return;
    }

    fs.stat(safePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404, { 'X-Content-Type-Options': 'nosniff' });
            res.end('File not found');
            return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.setHeader("Content-Type", contentType);
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.writeHead(200);

        const stream = fs.createReadStream(safePath);
        stream.pipe(res);

        stream.on('error', () => {
            res.writeHead(500, { 'X-Content-Type-Options': 'nosniff' });
            res.end('Server error');
        });
    });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    console.log(`Serving static files from: ${publicDir}`);
});
