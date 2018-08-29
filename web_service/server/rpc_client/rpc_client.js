const jayson = require('jayson');

const client = jayson.client.http({
    port: 8080,
    hostname: 'localhost'
});

// Test RPC methods
function add(a, b, callback) {
    client.request('add', [a, b], (err, error, response) => {
        if (err) throw err;
        console.log(response);
        callback(response);
    });
}

module.exports = {
    add
};
