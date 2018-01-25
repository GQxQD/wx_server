const crypto = require('crypto');
const http = require('http');
const url = require('url');
const service = require('./service');
const port = 80;
let server = http.createServer(async (req, res) => {
    try {
        const method = req.method.toLowerCase();
        if (method === 'post') {
            let result = await service.post(req, res);
            console.log(result);
            res.end(result);
        } else {
            res.end(service.get(req, res));
        }
    } catch (e) {
        res.end(e.toString());
    }
});
server.listen(port, (err) => {
    console.log('Your server is running on ' + port + '...');
});