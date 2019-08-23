# HaxcordZero

Consists of three files. main.js, index.html and renderer.js
.
When index.html is loaded it executes renderer. It sends a message 'request_config' to main.js.
Config.json is then loaded and passed to renderer.js via the 'config_loaded' event. There Client.login() is called logging in the Dicord client instance using the token. The client instance (token) is then used to join the account to servers via an undocumented API feature in the client's 'ready' event.

The client's 'message' event responds to new messages being sent and appends them to the message log.

Buids:
  - Linux
    https://file.io/Ig7dyE
