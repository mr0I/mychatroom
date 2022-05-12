const redis = require('redis');
const config = require('../config');

const redisHost = config.redis_host || '127.0.0.1';
const redisPort = config.redis_port || '6379';
var client = redis.createClient(redisPort, redisHost);
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then(() => {
    console.log(`Connected to Redis on port ${redisPort}.`);
});

var get = (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
};

var hgetall = (key) => {
    return new Promise((resolve, reject) => {
        if(key === null) reject();
        client.hgetall(key, (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
};

var lrange = (key) => {
    return new Promise((resolve, reject) => {
        client.lrange(key, [0, -1], (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
};

module.exports.get = get;
module.exports.hgetall = hgetall;
module.exports.lrange = lrange;
module.exports.client = client;
