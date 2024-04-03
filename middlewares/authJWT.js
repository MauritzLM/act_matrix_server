
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
// const { auth } = require('express-oauth2-jwt-bearer');
require('dotenv').config();


// middleware for checking the JWT
module.exports = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-zjk4ooufkrhlmh82.us.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  audience: 'http://localhost:3000', //replace with your API's audience, available at Dashboard > APIs
  issuer: 'https://dev-zjk4ooufkrhlmh82.us.auth0.com/',
  algorithms: ['RS256']
});

// module.exports = auth({
//   audience: 'http://localhost:3000',
//   issuerBaseURL: 'https://dev-zjk4ooufkrhlmh82.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });