const config = require('../config/config');

function home(req, res) {
  const scopes = config.oidc.scopes.split(' ');

  const scopeCheckboxes = scopes.map(scope =>
    `<label>
      <input type="checkbox" name="scope" value="${scope}">${scope}
    </label>`
  ).join('<br/>');

  res.send(
    `<h1>Welcome</h1>
  <form action="/login" method="post">    
    <p>Select scopes for the authentication:</p>
    ${scopeCheckboxes}    
    <p>
    <input type="hidden" name="_csrf" value="${req.csrfToken()}">
    <button type="submit">Log in with DNAnexus</button>
    </p>
  </form>`);
}

module.exports = {
  home,
}
