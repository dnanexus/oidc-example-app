const { Issuer, generators } = require('openid-client');
const config = require('../config/config');
const jose = require('jose');
const { randomUUID } = require('crypto');

let client = null;
let keyPair = null;

/**
 * Initializes an OIDC client.
 * 
 * @returns {Promise} - The OIDC client
 */
async function getClient() {
  if (client !== null) return client;

  const url = `${config.oidc.oidc_provider_url}/.well-known/openid-configuration`;
  console.info(`Discovering OpenID Connect configuration from ${url}`);
  const oidcIssuer = await Issuer.discover(url);
  const {privateKey, kid } = await getJWKSPair();

  client = new oidcIssuer.Client(
    {
      client_id: config.oidc.client_id,
      client_secret: config.oidc.client_secret,
      redirect_uris: [config.oidc.redirect_url],
      response_types: ['code'],
      scope: config.oidc.scopes,    
      id_token_signed_response_alg: 'RS256',
      id_token_encrypted_response_alg: 'RSA-OAEP-256',
      id_token_encrypted_response_enc: 'A256GCM',
      token_endpoint_auth_method: 'client_secret_basic'
    },
    {
      keys: [{...privateKey, kid}] // private key for token decryption
    }
  );

  console.info('OIDC client created');
  return client;
}

/**
 * Retrieves tokenSet from oidc provider.
 * 
 * Calls oidc provider with the request parameters received in the callback.
 * automatically decrypts the tokenSet using the private key set up on client initialization.
 * 
 * @param {Request} req - The request object
 */
async function getTokenSet(req) {
  const oidcClient = await getClient();
  const params = oidcClient.callbackParams(req);
  console.log('Received callback with params:', params);
  return oidcClient.callback(config.oidc.redirect_url, params, { code_verifier: req.session.codeVerifier });
}

/**
 * Builds the auth URL to redirect the user to the oidc provider.
 * 
 * @param {string} scopes - The scopes requested by the client
 * @param {string} codeVerifier - The code verifier used in the authorization code flow
 * 
 * @returns {string} - The URL to redirect the user to the oidc provider
 */
async function getAuthUrl(scopes, codeVerifier) {
  const oidcClient = await getClient();
  return oidcClient.authorizationUrl({
    code_challenge_method: 'S256',
    code_challenge: generators.codeChallenge(codeVerifier),
    scope: `openid ${scopes}` //Note: openid scope is required
  });
}

/**
 * Wrapper for openid-client's codeVerifier generator
 * @returns {string} - A random code verifier
 */
function getCodeVerifier() {
  return generators.codeVerifier();
}

/**
 * Generate key pair for token encryption
 * 
 * @returns {Object} - The generated JWKS key pair
 */
async function getJWKSPair() {
  if (keyPair !== null) return keyPair;

  const { publicKey, privateKey } = await jose.generateKeyPair('PS256');

  keyPair = {
    kid: randomUUID(),
    publicKey: await jose.exportJWK(publicKey),
    privateKey:await jose.exportJWK(privateKey)
  };  
 
  return keyPair;
}

module.exports = {
  getTokenSet,
  getAuthUrl,
  getCodeVerifier,
  getJWKSPair
};
