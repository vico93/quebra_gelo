import { REST, Routes } from 'discord.js';
import config from './config.json' with { type: 'json' };
import { commands } from './comando_perguntar.js';

const rest = new REST({ version: '10' }).setToken(config.discord.bot_token);

(async () => {
    try {
        console.log('Iniciando registro de comandos...');

        await rest.put(
            Routes.applicationGuildCommands(config.discord.client_id, config.discord.guild_id),
            { body: commands }
        );

        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar os comandos:', error);
    }
})();