# oidc-example-app
A sample web application to showcase the OpenID Connect flow.
This express.js app uses [https://github.com/panva/node-openid-client](node-oidc-client) to demonstrate the authentication flow against the OpenID Connect Provider at DNAnexus.

## How to use

### Configure app
This sample project leverages `.env` files to enable easy configuration.

These are the available env variables and their default values, adjust them to match your use case.

```
  # Application running port
  APP_PORT=3333

  # OIDC provider url  
  OIDC_PROVIDER_URL=https://oidc.dnanexus.com
  
  # your application client id
  OIDC_CLIENT_ID=exampleAppClientId
  
  # your application client secret
  OIDC_CLIENT_SECRET=your_secret
  
  # url for callback redirection
  # note that your redirect url needs to be registered within DNAnexus for it to work
  OIDC_REDIRECT_URL=http://localhost:3333/callback
  
  # white space separated list of the oidc scopes that can be requested,
  # keep in mind this needs to be a (sub-)set of scopes registered with your client at DNAnexus.
  # Note that "openid" scope is required and therefore added in the code to this list.
  OIDC_SCOPES="user_id name email"
```
----------

### JWKS:
ID Token returned by the provider are encrypted under [JWE](https://www.rfc-editor.org/rfc/rfc7516.html), 
[JWKS](https://datatracker.ietf.org/doc/html/rfc7517) are exposed under `APP_URL:APP_PORT/.well-known/jwks.json`.

A pair of keys can be provided via environment variables PUBLIC_KEY_PATH and PRIVATE_KEY_PATH, you can omit PUBLIC_KEY_PATH in case you're providing the public key from a different url outside of this application.
*If no private key is provided then both keys will be generated.*

By default and when no private key is provided this sample app generates an RSA keyPair and configures the oidc client accordingly:
on [`src/provider/oidcProvider.js`](./src/providers/oidcProvider.js#L28)

  *If you wish to use a different encryption or encoding algorithms then you'll need to change the client constructor parameters to match your client configuration.<br/>
  See [Enabling App Users to Log In with DNAnexus Credentials](https://documentation.dnanexus.com/developer/apps/enabling-app-users-to-log-in-with-dnanexus-credentials) .*

----

 ### PKCE:

[PKCE](https://datatracker.ietf.org/doc/html/rfc7636) is enabled and code verifier is provided by 
`getCodeVerifier` function in `oidcProvider.js`

**Note:** *You can explicitly request the actual user_id via user_id scope see [Pairwise Identifier](https://openid.net/specs/openid-connect-core-1_0.html#PairwiseAlg)*

## Run the oidc-example-app

In the root directory of this repository, run

```
cd oidc-example-app
npm install
npm start
```
**NOTE**: *You'll need node:18 to be installed in your system to run this app*

You should see in the console the log message `App listening at http://localhost:3333`.

Point your browser to that URL, and you can test the OIDC flow. Additional log information is printed to the console.

