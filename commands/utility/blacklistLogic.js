const { SlashCommandBuilder } = require('discord.js');
const { addToBlacklist, removeFromBlacklist, getBlacklist } = require('../../utility/blacklist.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('Zarzadzaj czarna lista slow')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Dodaj slowo do czarnej listy')
				.addStringOption(option => option.setName('word').setDescription('Slowo do dodania').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Usun slowo z czarnej listy')
				.addStringOption(option => option.setName('word').setDescription('Slowo do usuniecia').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('Pokaz aktualna czarne liste')),
				
	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		const word = interaction.options.getString('word');

		if (sub === 'add') {
			const added = addToBlacklist(word);
			if (added) {
				await interaction.reply(`✅ Slowo \`${word}\` zostalo dodane do czarnej listy.`);
			} else {
				await interaction.reply(`⚠️ Slowo \`${word}\` juz znajduje sie na czarnej liscie.`);
			}
		} else if (sub === 'remove') {
			const removed = removeFromBlacklist(word);
			if (removed) {
				await interaction.reply(`🗑️ Slowo \`${word}\` zostalo usuniete z czarnej listy.`);
			} else {
				await interaction.reply(`❌ Slowo \`${word}\` nie istnieje na czarnej liscie.`);
			}
		} else if (sub === 'list') {
			const list = getBlacklist();
			await interaction.reply(`📜 Czarna lista zawiera ${list.length} slowo(a):\n\`\`\`${list.join(', ')}\`\`\``);
		}
	}
};