const { ipcRenderer } = require('electron')
const { session } = require('electron')
const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();

let config; 

// Appends the HTML of the log file
function log(line) {
	var con = document.getElementById("console");
	
	con.innerHTML += `
	<div class="line">
		${line}
	</div>
	`;
	con.scrollTop = con.scrollHeight;
}

log("Initialized.")
// Is sent to main.js as the first script execued
ipcRenderer.send('request_config', null)

// config.json has been loaded and the config variable set to its value
ipcRenderer.on('config_loaded', (event, arg) => {
	config = arg;
	log('Config loaded.')
	log('Logging in with token...');
	// Call the discord login function with the token passed in config
	client.login(config['token'])
	.catch( e =>  log(e) )
})

// Whenever a message is received then append the messages window with the message and its HTML
client.on('message', msg => {
	var msgs = document.getElementById("messages");
	
	var msghtml = `	<div class='message'>
						<div class='avatar'>
							<div style='border-radius: 50%; background-image: url("${msg.author.avatarURL}"); width: 100%; height: 100%; background-size: 100% 100%;'>
							
							</div>
						</div>
						<div class='content'>
							<div class='header'>
								${msg.author.tag}
							</div>
							<div class='content'>
								${msg.content}
							</div>
						</div>
					</div>
	`;
	
	msgs.innerHTML += msghtml;
	msgs.scrollTop = msgs.scrollHeight;
});
/*
	When config has been loaded then the ready event is fired. Go through he list of joined guilds and 
	join each of them using an invite using a POST request, which is undocumented in the API
*/
client.on('ready', () => {
	log(`Logged in as ${client.user.tag}!`);
	var n = client.guilds.array().length;
	log(`Number of servers joined: ${n}`);
	
	log(`${config["invites"].length} invites.`);
	config["invites"].forEach(function (invite) {
		
		
		const options = {
			url: `https://discordapp.com/api/v6/invites/${invite}?with_counts=true`,
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Authorization': config["token"],
			}
		};

		request(options, function(err, res, body) {
				var json = JSON.parse(body);
				log(`Joined ${json['guild']['name']}`);
		});
		
	});
});
