const RateLimit = require("express-rate-limit");
const googleBotVerify = require('googlebot-verify');

const apiLimiterGoogleHandler = async function (req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let isGoogleBot = false;
  try {
    isGoogleBot = await googleBotVerify(ip);
  } catch (e) {
    console.error('googlebot-verify', e.message);
    isGoogleBot = false;
  }

  if (isGoogleBot) {
    next();
  } else {
    // 429 status = Too Many Requests (RFC 6585)
    res.status(429).send("Too many requests, please try again later.");
  }
};

const apiLimiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 150, // limit each IP to 150 requests per windowMs
  handler: apiLimiterGoogleHandler,
});
const pageLimiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 150,
  // max: 100000000,
  handler: apiLimiterGoogleHandler,
});
const filesApiLimiter = RateLimit({
  windowMs: 60 * 1000,
  max: 400,
  handler: apiLimiterGoogleHandler,
});
const suggestionsApiLimiter = RateLimit({
  windowMs: 60 * 1000,
  max: 80,
});
const authApiLimiter = RateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

module.exports = {
  apiLimiter,
  pageLimiter,
  filesApiLimiter,
  suggestionsApiLimiter,
  authApiLimiter,
};