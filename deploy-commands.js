const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { commands } = require('./comando_perguntar.js');
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log('Iniciando registro de comandos...');

        await rest.put(
            Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
            { body: commands }
        );

        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }
})();