// Requer as classes discord.js necessárias
const { Client, Events, GatewayIntentBits } = require('discord.js');
const Groq = require('groq-sdk');
const fs = require('fs');

// CONFIG
require('dotenv').config();
const { DISCORD_TOKEN, GROQ_API_KEY } = process.env;

// Criar uma nova instância client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const groq = new Groq({ apiKey: GROQ_API_KEY });

// Função para gerar a pergunta via Groq
async function gerar_pergunta_gpt() {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Gere uma pergunta aleatória em português do brasil para um grupo de amigos. Retorne apenas a pergunta, por gentileza",
            },
        ],
        model: "llama3-8b-8192",
    });

    return completion.choices[0]?.message?.content || "Não foi possível gerar uma pergunta.";
}

// Função para gerar a pergunta via .txt (padrão)
async function gerar_pergunta_txt() {
    try {
        // Lê o conteúdo do arquivo-texto onde estão as perguntas
        const arq_perguntas = await fs.promises.readFile(__dirname + '/fonte.txt', 'utf8');
        // Separa as perguntas em um array de strings
        const perguntas = arq_perguntas.split("\n").filter(line => line.trim() !== '');
        // Retorna uma das linhas aleatoriamente
        return perguntas.length > 0 ? perguntas[Math.floor(Math.random() * perguntas.length)] : "Nenhuma pergunta disponível.";
    } catch (error) {
        console.error("Erro ao ler o arquivo de perguntas:", error);
        return "Erro ao obter a pergunta.";
    }
}


// Quando o client estiver pronto, executa este código (apenas uma vez).
// A distinção entre `client: Client<boolean>` e `readyClient: Client<true>` é importante para desenvolvedores TypeScript.
// Faz com que algumas properties fiquem non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Pronto! Logado como ${readyClient.user.tag}`);
});

// Manusear a interação do comando
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'perguntar') {
        await interaction.deferReply(); // Indica que o bot está processando

        try {
			const fonte = interaction.options.getString('fonte') || 'txt';
			const mensagem = fonte === 'gpt' ? await gerar_pergunta_gpt() : await gerar_pergunta_txt();
            const mencao = interaction.options.getMentionable('mencionar'); // Obtém a menção opcional

            // Prefixa a menção, se existir
            const resposta = mencao ? `${mencao} ${mensagem}` : mensagem;

            await interaction.editReply({
                content: resposta,
                allowed_mentions: mencao ? { parse: ['everyone', 'roles', 'users'] } : {}, // Habilita menções
            });
        } catch (error) {
            console.error('Erro ao responder:', error);
            await interaction.editReply({
                content: 'Houve um erro ao processar sua pergunta.',
                ephemeral: true,
            });
        }
    }
});



// Entre no Discord com o token do seu cliente
client.login(DISCORD_TOKEN);