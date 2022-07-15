/* */

/* BIBLIOTECAS */
const fs = require('fs');
const { Client, Intents } = require('discord.js');														// Discord API

/* VARIÁVEIS GLOBAIS */
const config = require(__dirname + "/config.json");														// CONFIG
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });				// Instância principal do Bot

/* FUNÇÕES */
function pergunta_aleatoria()
{
	// Lê o conteúdo do arquivo-texto aonde estão as perguntas em um array de strings
	let perguntas = fs.readFileSync(__dirname + '/fonte.txt', {encoding:'utf8', flag:'r'}).split("\n");
	// Retorna uma das linhas aleatoriamente
	return perguntas[Math.floor(Math.random() * perguntas.length)];
}

/* FLUXO PRINCIPAL */
// When the client is ready, run this code (only once)
bot.once('ready', function() {
	console.log('[INFO] Quebra-Gelo iniciado!');
});

// Quando uma mensagem é enviada ao servidor
bot.on('messageCreate', msg => {
	const command = msg.content.slice(config.prefix.length).split(' ')[0]
	if (command === 'help')
	{
		msg.channel.send("*Assumindo que o prefixo é `gelo!`...*\n- `help` - Esta mensagem;\n- `quebrar` - Envia uma pergunta **sem** `@everyone`;\n- `quebrarev` - Envia uma mensagem **com** `@everyone`.");
		if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
		{
			msg.delete();
		}		
	}
	else if (command === 'quebrar')
	{
		msg.channel.send(pergunta_aleatoria());
		if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
		{
			msg.delete();
		}	
	}
	else if (command === 'quebrarev')
	{
		msg.channel.send("@everyone " + pergunta_aleatoria());
		if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
		{
			msg.delete();
		}
	}
});

// Login to Discord with your client's token
bot.login(config.token);