const {mongoose} = require('../../helpers/db');
const bcrypt = require('bcryptjs');


// User Schema
const user = mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        index:true,
        required:[true,'email is required!']
    },
    password:{
        type:String,
        required:true
    },
    google_id:{
        type:String,
        required:false
    }
});
// const User = mongoose.model('User', user);
const User = module.exports = mongoose.model('User', user);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};
module.exports.getUserByGoogleID = function (gid, callback) {
    const query = {google_id:gid};
    User.findOne(query, callback);
};
module.exports.getUserByEmail = function (email, callback) {
    const query = {email:email};
    User.findOne(query, callback);
};
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
