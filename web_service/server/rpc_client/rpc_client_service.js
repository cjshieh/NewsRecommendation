const jayson = require('jayson');

const client = jayson.client.http({
    port: 4040,
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

function getNewsSummariesForUser(user_id, page_num, callback) {
    console.log("load news is called");
    client.request('getNewsSummariesForUser', [user_id, page_num], (err, error, response) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(response);
        callback(response);
    });
}

module.exports = {
    add,
    getNewsSummariesForUser
};
