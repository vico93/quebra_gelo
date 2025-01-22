const { SlashCommandBuilder } = require('discord.js');

const perguntarCommand = new SlashCommandBuilder()
    .setName('perguntar')
    .setDescription('Faça uma pergunta direcionada.')
    .addStringOption(option => 
        option.setName('fonte')
            .setDescription('Escolha a fonte da pergunta: API GPT ou arquivo de texto')
            .setRequired(true)
            .addChoices(
                { name: 'GPT (API OpenAI)', value: 'gpt' },
                { name: 'Arquivo de texto', value: 'txt' }
            ))
    .addMentionableOption(option =>
        option.setName('mencionar')
            .setDescription('Mencione um usuário ou escolha @everyone/@here')
            .setRequired(false));

const commands = [
    perguntarCommand.toJSON(),
];

module.exports = { commands };
