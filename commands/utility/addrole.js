const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Zarządzaj rolami użytkowników')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Dodaj role użytkownikowi')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Użytkownik, który otrzyma role')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Rola do dodania')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Usuń role użytkownikowi')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Użytkownik, który straci role')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Rola do stracenia')
                        .setRequired(true))),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const member = await interaction.guild.members.fetch(user.id);
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            if (member.roles.cache.has(role.id)) {
                return interaction.reply({ content: `Użytkownik ${user} już ma role ${role}`});
            }
            
            await member.roles.add(role);
            await interaction.reply(`Dodano role ${role} do użytkownika ${user}`);
        } else if (subcommand === 'remove') {
            if (!member.roles.cache.has(role.id)) {
                return interaction.reply({ content: `Użytkownik ${user} nie ma roli ${role}`});
            }
            
            await member.roles.remove(role);
            await interaction.reply(`Usunięto role ${role} z użytkownika ${user}`);
        }
    },
};