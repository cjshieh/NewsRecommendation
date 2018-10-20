const expressJwt = require("express-jwt");
const config = require("../config.json");
const userService = require("../users/user_service");

module.exports = jwt;

function jwt() {
  const secret = config.secret;
  const unportedPath = [
    "/users/authenticate",
    "/users/register",
    "/news/default",
    /\/news\/search*/
  ];
  return expressJwt({ secret, isRevoked }).unless({
    // public routes that don't require authentication
    path: unportedPath
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
}
