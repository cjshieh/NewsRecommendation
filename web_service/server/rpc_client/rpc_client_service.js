const jayson = require('jayson');

const client = jayson.client.http({
    port: 4040,
    hostname: 'localhost'
});

module.exports = {
    add,
    getNewsDefault,
    getNewsFromSearchKey,
    getNewsSummariesForUser,
    logNewsClickForUser
};

// Test RPC methods
function add(a, b, callback) {
    client.request('add', [a, b], (err, error, response) => {
        if (err) throw err;
        console.log(response);
        callback(response);
    });
}

function getNewsDefault(callback) {
    client.request('getNewsDefault',[], (err, response) => {
        if (err) {
            throw err;
        }
        callback(response);
    })
}

function getNewsFromSearchKey(query, page_num, callback) {
    client.request('getNewsFromSearchKey', [query, page_num], (err, response) => {
        if (err) {
            throw err;
        }
        callback(response);
    });
}

function getNewsSummariesForUser(user_id, page_num, callback) {
    client.request('getNewsSummariesForUser', [user_id, page_num], (err, response) => {
        if (err) {
            throw err;
        }
        callback(response);
    });
}

function logNewsClickForUser({ userId, newsId }) {
    console.log("store clicks behaviour");
    client.request('logNewsClickForUser', [userId, newsId], (err, error, response) => {
        if(err) {
            throw err;
        }
        console.group();
        console.log("deals from log service");
        console.log(response);
        console.groupEnd();
    })
}
