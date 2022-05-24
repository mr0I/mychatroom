const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/socket-db');
const db = mongoose.connection;

// User Schema
const userSchema = mongoose.Schema({
    email:{
        type:String,
        index:true
    },
    password:{
        type:String,
    },
    name:{
        type:String,
    }
});
const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};
// module.exports.getUserByUsername = function (username, callback) {
//     const query = {username:username};
//     User.findOne(query, callback);
// };
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        callback(null, isMatch);
    })
};
module.exports.createUser= function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};