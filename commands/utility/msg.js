const { SlashCommandBuilder } = require('discord.js');
const { setWelcomeMessage, getWelcomeMessage, removeWelcomeMessage } = require('../../utility/welcomeMessages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Zarządzaj wiadomościami powitalnymi na serwerze')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Ustaw wiadomość powitalną')
                .addStringOption(option => 
                    option.setName('message')
                        .setDescription('Treść wiadomości (użyj {user} jako placeholder)')
                        .setRequired(true)
                )
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Kanał dla wiadomości powitalnej')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Usuń obecną wiadomość powitalną')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Pokaż obecną konfigurację powitalną')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'set') {
            const message = interaction.options.getString('message');
            const channel = interaction.options.getChannel('channel');
            
            setWelcomeMessage(interaction.guildId, message, channel.id);
            await interaction.reply({
                content: `✅ Ustawiono wiadomość powitalną na kanale ${channel}`,
                ephemeral: true
            });
        }
        else if (subcommand === 'remove') {
            const removed = removeWelcomeMessage(interaction.guildId);
            await interaction.reply({
                content: removed ? '🗑️ Usunięto wiadomość powitalną' : '❌ Brak wiadomości do usunięcia',
                ephemeral: true
            });
        }
        else if (subcommand === 'show') {
            const config = getWelcomeMessage(interaction.guildId);
            await interaction.reply({
                content: config 
                    ? `📜 Obecna wiadomość: "${config.message}" na kanale <#${config.channelId}>`
                    : 'ℹ️ Nie ustawiono wiadomości powitalnej',
                ephemeral: true
            });
        }
    }
};