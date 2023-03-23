const { expressjwt } = require("express-jwt");
function authJwt() {
  const secret = "secret";
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      "/users/login",
      "/users/register",
    ],
  });
}
async function isRevoked(req, token) {
  if (!token.payload.isAdmin) {
    console.log("no es admin");
    return true;
  }
  console.log("es admin");
  return false;
}
module.exports = authJwt;
