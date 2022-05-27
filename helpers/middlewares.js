function checkAuth(req, res, next)
{
    if (req.isAuthenticated()) return next();
    else res.redirect('/auth');
}

function isGuest(req,res,next)
{
    if (! req.isAuthenticated()) return next();
    else res.redirect('/');
}


module.exports = {
    checkAuth,
    isGuest
};