require('dotenv').config();

const cfg = {
  port: process.env['APP_PORT'] ?? 3333,  
  oidc: {        
    oidc_provider_url: process.env['OIDC_PROVIDER_URL'] ?? 'http://localhost:3000',
    client_id: process.env['OIDC_CLIENT_ID'] ?? 'exampleAppClientId',        
    client_secret: process.env['OIDC_CLIENT_SECRET'] ?? 'exampleAppClientSecret',    
    redirect_url: process.env['OIDC_REDIRECT_URL'] ?? `http://localhost:${process.env['APP_PORT'] ?? 3333}/callback`,
    scopes: process.env['OIDC_SCOPES'] ?? 'user_id name email' //Note: "openid" scope is required and added by default
  } 
};

module.exports = cfg;
