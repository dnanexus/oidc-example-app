
const { getAuthUrl, getTokenSet, getCodeVerifier, getJWKSPair }  = require('../providers/oidcProvider');
const jose = require('jose');

async function login (req,res, next) {    
  try {
    const selectedScopes = req.body.scope;
    const scopes = Array.isArray(selectedScopes) ? selectedScopes.join(' ') : selectedScopes;  
    console.info('Selected scopes:', scopes);    
    const codeVerifier = getCodeVerifier();
    req.session.codeVerifier = codeVerifier;
    const authUrl = await getAuthUrl(scopes,codeVerifier);
    
    console.log(`Redirecting to ${authUrl}`);
    res.redirect(authUrl);
  } catch (err) {
    next(err);
  }
}

async function callback(req, res, next) {
  try {  
    const tokenSet = await getTokenSet(req) 
    req.session.tokenSet = tokenSet;
    console.log('Token set:', tokenSet);
    const tokenSetPretty = JSON.stringify(tokenSet, null, 2);
    const decodedToken = jose.decodeJwt(tokenSet.id_token)
    const decodedTokenPretty = JSON.stringify(decodedToken, null, 2);

  res.send(`
    <h1>Logged in!</h1>
    <fieldset>
      <legend>Token Set</legend>
      <pre>${tokenSetPretty}</pre>
    </fieldset>
    <br/>
    <fieldset>
      <legend>Decoded ID Token</legend>
      <pre>${decodedTokenPretty}</pre>
    </fieldset>
    <br/>
    <fieldset>
      <legend>The user info</legend>
      <ul>
        ${tokenSet.scope.includes('user_id') ? `<li><strong>User ID:</strong> <pre>${decodedToken.user_id}</pre></li>` : ''}
        ${tokenSet.scope.includes('name') ? `<li><strong>Full Name:</strong> <pre>${decodedToken.name}</pre></li>` : ''}
        ${tokenSet.scope.includes('email') ? `<li><strong>Email:</strong> <pre>${decodedToken.email}</pre></li>` : ''}
      </ul>
    </fieldset>
  `);
  } catch (err) {
   next(err);
  }
}

/** 
 * Expose public key to enable oidc-provider token encryption
 * see https://datatracker.ietf.org/doc/html/rfc7517
 */
async function getJWKS(req, res, next) {
  const {publicKey, kid } = await getJWKSPair();
  res.type = 'application/jwk-set+json; charset=utf-8';
  
  res.send({
    keys: [{...publicKey, use:'enc', kid}]
  });
}

module.exports = {
  login,
  callback,
  getJWKS
}
