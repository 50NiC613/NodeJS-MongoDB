const { expressjwt } = require("express-jwt")
function authJwt(){
    const secret = 'secret';
    return expressjwt({
         secret,
         algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url : /\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url : /\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            '/users/login', '/users/register']
    })
}
async function isRevoked(req, payload, done) {
    const user = await User.findById(payload.sub);
    if (user) {
        return done(null, false);
    }
    return done(null, true);
}
module.exports = authJwt;