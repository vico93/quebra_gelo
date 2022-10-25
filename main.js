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
// Informa que o bot está pronto
bot.once('ready', function() {
	console.log('[INFO] Quebra-Gelo iniciado!');
});

// Quando uma mensagem é enviada ao servidor
bot.on('messageCreate', msg => {
	// Só processa o que o membro digitou se ele tiver permissão para usar comandos de aplicativo
	if (msg.member.permissions.has("USE_APPLICATION_COMMANDS"))
	{
		const command = msg.content.slice(config.prefix.length).split(' ')[0]
		if (command === 'help')
		{
			// Só apresenta os comandos que mencionam @everyone se o membro tiver essa permissão
			if (msg.member.permissions.has("MENTION_EVERYONE"))
			{
				msg.channel.send("*Assumindo que o prefixo é `gelo!`...*\n- `help` - Esta mensagem;\n- `quebrar` - Envia uma pergunta **sem** `@everyone`;\n- `quebrarhe` - Envia uma pergunta com `@here`\n- `quebrarev` - Envia uma pergunta **com** `@everyone`.");
			}
			else
			{
				msg.channel.send("*Assumindo que o prefixo é `gelo!`...*\n- `help` - Esta mensagem;\n- `quebrar` - Envia uma pergunta");
			}

			// Apaga a mensagem que serviu pra invocar o comando
			if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
			{
				msg.delete();
			}		
		}
		else if (command === 'quebrar')
		{
			// Envia a pergunta aleatória
			msg.channel.send(pergunta_aleatoria());
			// Apaga a mensagem que serviu pra invocar o comando
			if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
			{
				msg.delete();
			}	
		}
		else if (command === 'quebrarhe')
		{
			// Só executa o comando se o membro tem permissão de mencionar @everyone
			if (msg.member.permissions.has("MENTION_EVERYONE"))
			{
				msg.channel.send("@here " + pergunta_aleatoria());
			}
			// Apaga a mensagem que serviu pra invocar o comando
			if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
			{
				msg.delete();
			}
		}
		else if (command === 'quebrarev')
		{
			// Só executa o comando se o membro tem permissão de mencionar @everyone
			if (msg.member.permissions.has("MENTION_EVERYONE"))
			{
				msg.channel.send("@everyone " + pergunta_aleatoria());
			}
			// Apaga a mensagem que serviu pra invocar o comando
			if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
			{
				msg.delete();
			}
		}
	}
});

// Conecta o bot ao Discord
bot.login(config.token);