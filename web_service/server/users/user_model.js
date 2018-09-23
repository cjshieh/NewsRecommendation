const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, index: true, unique: true, required: true },
    password: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);