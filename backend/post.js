const MAX_BODY = 1 * 1024 * 1024; //something about memory

const host = req.headers.host || 'localhost:8000';
const url = new URL(req.url, `http://${host}`);


function parseJSONBody(req, res) {
    return new Promise((resolve, reject) => {
        let body = '';
        let received = 0;

        const contentType = req.headers['content-type'] || '';
        if (!contentType.startsWith('application/json')) {
            res.writeHead(415, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unsupported Content-Type' }));
            return reject(new Error('Unsupported Content-Type'));
        }

        req.on('data', chunk => {
            received += chunk.length;

            if (received > MAX_BODY) {
                received.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Payload too large' }));
            }
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                if (!body) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Empty request body' }));
                    return reject(new Error('Empty request body'));
                }

                const data = JSON.parse(body);
                if (typeof data != 'object' || data === null || Array.isArray(data)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON object' }));
                    return reject(new Error('Invalid JSON object'));
                }
                resolve(data);
            } catch (parseError) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Malformed JSON' }));
                console.error('JSON parse error:', parseError.message);
            }

        });
        req.on('error', (error) => {
            console.error('Request error:', error.message);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(Json.stringify({ error: 'Request error' }));
        });
    });
}
//this is all just security precautions
