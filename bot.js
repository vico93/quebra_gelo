/*
 *  Nome:					quebra_gelo
 *  Descrição:				Bot que gera perguntas aleatórias para animar o server do Discord
 *  Autor:					Vico
 *  Versão:					2.0
 *  Dependências:			discord.js e openai
*/

// Requer as classes discord.js necessárias
import { Client, Events, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

// CONFIG
import config from './config.json' with { type: 'json' };

// Última pergunta feita (independentemente do canal)
let last_question = "";

// Criar uma nova instância no Discord e OpenAI
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const openai = new OpenAI({
	apiKey: config.openai.api_key,
	baseURL: config.openai.base_url,
});

// Função para gerar a pergunta via OpenAI
async function gerar_pergunta_gpt() {
    try {
        const completion = await openai.chat.completions.create({
            model: config.openai.model,
            messages: [
				{ role: 'assistant', content: last_question },
                { role: 'user', content: config.openai.context },
            ],
        });

        if (!completion?.choices?.[0]?.message?.content) {
            console.error("Resposta inesperada da API OpenAI (ou compatível):", completion);
            return "Erro ao processar resposta da API OpenAI (ou compatível).";
        }

        const question = completion.choices[0].message.content;
        last_question = question;  // Store in global variable
        return question;

    } catch (error) {
        console.error("Erro na requisição para API OpenAI (ou compatível):", error);
        return "Ocorreu um erro ao se comunicar com a API OpenAI (ou compatível).";
    }
}

// Função para gerar a pergunta via .txt (padrão)
async function gerar_pergunta_txt() {
    try {
        const filePath = `${__dirname}/fonte.txt`;
        const arq_perguntas = await fs.promises.readFile(filePath, 'utf8');
        const perguntas = arq_perguntas.split("\n").filter(line => line.trim() !== '');
        
        if (perguntas.length === 0) {
            return "Nenhuma pergunta disponível.";
        }

        const question = perguntas[Math.floor(Math.random() * perguntas.length)];
        last_question = question;  // Store in global variable
        return question;

    } catch (error) {
        console.error("Erro ao ler o arquivo de perguntas:", error);
        return "Erro ao obter a pergunta.";
    }
}


// Quando o client estiver pronto, executa este código (apenas uma vez).
// A distinção entre `client: Client<boolean>` e `readyClient: Client<true>` é importante para desenvolvedores TypeScript.
// Faz com que algumas properties fiquem non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Conectado como ${client.user.tag}!`);
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
                allowedMentions: mencao ? { parse: ['everyone', 'roles', 'users'] } : {}, // Habilita menções
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
client.login(config.discord.bot_token);