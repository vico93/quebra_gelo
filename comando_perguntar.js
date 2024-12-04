const { SlashCommandBuilder } = require('discord.js');

const perguntarCommand = new SlashCommandBuilder()
    .setName('perguntar')
    .setDescription('Faça uma pergunta direcionada.')
    .addMentionableOption(option =>
        option.setName('mencionar')
            .setDescription('Mencione um usuário ou escolha @everyone/@here')
            .setRequired(false));

const commands = [
    perguntarCommand.toJSON(),
];

module.exports = { commands };
