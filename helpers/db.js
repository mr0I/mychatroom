const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/socket-db');
const db = mongoose.connection
    .once('open',()=>{console.log('mongo connected:)')})
    .on('error', (error) => {console.warn(error)});


module.exports = {
    mongoose,
    db
};

