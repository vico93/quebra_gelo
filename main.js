/* */

/* BIBLIOTECAS */
const fs = require('fs');
const { Client, Intents } = require('discord.js');														// Discord API
const OpenAIApi = require('openai');																	// OpenAI

/* VARIÁVEIS GLOBAIS */
const config = require(__dirname + "/config.json");														// CONFIG
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });				// Instância principal do Bot
const openai = new OpenAIApi.OpenAI({ apiKey: config.openai_apikey });									// API do OpenAI

/* FUNÇÕES */
function pergunta_aleatoria()
{
	// Lê o conteúdo do arquivo-texto aonde estão as perguntas em um array de strings
	let perguntas = fs.readFileSync(__dirname + '/fonte.txt', {encoding:'utf8', flag:'r'}).split("\n");
	// Retorna uma das linhas aleatoriamente
	return perguntas[Math.floor(Math.random() * perguntas.length)];
}
// Função para fazer a API do OpenAI gerar uma pergunta aleatória
async function pergunta_aleatoria_gpt()
{
	const completion = await openai.chat.completions.create({
		messages: [{ role: "system", content: config.openai_context }, {role: "user", content: config.openai_command}],
		model: "gpt-4",
	});
	
	return completion.choices[0].message.content;
}

/* FLUXO PRINCIPAL */
// Informa que o bot está pronto
bot.once('ready', function() {
	console.log('[INFO] Quebra-Gelo iniciado!');
});

// Quando uma mensagem é enviada ao servidor
bot.on('messageCreate', async (msg) => {
	// Filtra bots
	if (msg.author.bot) return;
	
	// Caso a mensagem venha por DM (IMPLEMENTAR POSTERIORMENTE ALGUMA ROTINA SOBRE ISSO)
	if (!msg.guild) return;
	
	// Só processa o que o membro digitou se ele tiver permissão para usar comandos de aplicativo
	if (msg.member.permissions.has("USE_APPLICATION_COMMANDS", true))
	{
		const command = msg.content.slice(config.prefix.length).split(' ')[0]
		if (command === 'help')
		{
			// Só apresenta os comandos que mencionam @everyone se o membro tiver essa permissão
			if (msg.member.permissions.has("MENTION_EVERYONE"))
			{
				msg.channel.send("- `" + config.prefix + "help` - Esta mensagem;\n- `" + config.prefix + "quebrar` - Envia uma pergunta **sem** `@everyone`;\n- `" + config.prefix + "quebrarhe` - Envia uma pergunta com `@here`\n- `" + config.prefix + "quebrarev` - Envia uma pergunta **com** `@everyone`;\n- `" + config.prefix + "quebrargpt` - Envia uma pergunta **sem** `@everyone` usando a API do OpenAI;\n- `" + config.prefix + "quebrargpthe` - Envia uma pergunta com `@here` usando a API do OpenAI;\n- `" + config.prefix + "quebrargptev` - Envia uma pergunta **com** `@everyone` usando a API do OpenAI.");
			}
			else
			{
				msg.channel.send("- `" + config.prefix + "help` - Esta mensagem;\n- `" + config.prefix + "quebrar` - Envia uma pergunta");
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
		else if (command === 'quebrargpt')
		{
			// Inicie a simulação de digitação
			msg.channel.sendTyping();
			// Puxa de forma dessíncrona uma pergunta aleatória da API do OpenAI
			let pergunta_gpt = "";
			pergunta_gpt = await pergunta_aleatoria_gpt();
			// Envia a pergunta aleatória
			msg.channel.send(pergunta_gpt);
			// Apaga a mensagem que serviu pra invocar o comando
			if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
			{
				msg.delete();
			}	
		}
		else if (command === 'quebrargpthe')
		{
			// Só executa o comando se o membro tem permissão de mencionar @everyone
			if (msg.member.permissions.has("MENTION_EVERYONE"))
			{
				// Inicie a simulação de digitação
				msg.channel.sendTyping();
				// Puxa de forma dessíncrona uma pergunta aleatória da API do OpenAI
				let pergunta_gpthe = "";
				pergunta_gpthe = await pergunta_aleatoria_gpt();
				// Envia a pergunta aleatória
				msg.channel.send("@here " + pergunta_gpthe);
			}
			// Apaga a mensagem que serviu pra invocar o comando
			if (msg.guild.me.permissions.has("MANAGE_MESSAGES"))
			{
				msg.delete();
			}
		}
		else if (command === 'quebrargptev')
		{
			// Só executa o comando se o membro tem permissão de mencionar @everyone
			if (msg.member.permissions.has("MENTION_EVERYONE"))
			{
				// Inicie a simulação de digitação
				msg.channel.sendTyping();
				// Puxa de forma dessíncrona uma pergunta aleatória da API do OpenAI
				let pergunta_gptev = "";
				pergunta_gptev = await pergunta_aleatoria_gpt();
				// Envia a pergunta aleatória
				msg.channel.send("@everyone " + pergunta_gptev);
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