const config = require('../config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString, { useNewUrlParser: true, autoIndex: false });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user_model')
}