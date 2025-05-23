// Necessary discord.js classes
const fs = require('node:fs'); //native node file system utility
const path = require('node:path'); //native node path utility module
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const blacklistPath = path.join(__dirname, 'blacklist.json');
const { getWelcomeMessage } = require('./commands/utility/msg.js');

// Create a new client instance
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.MessageContent, 
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages
	] });

client.commands = new Collection();

// When the client is ready, run this code
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


// Load commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Loop through each command folder
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// Loop through each command in the folder
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		// Verify both data and execute properties exist
		if ('data' in command && 'execute' in command) {
			// Add the command to the client.commands collection
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
		
});
var blacklist = [];
//event working when message is sent
client.on(Events.MessageCreate, async message => {
	//if message is private message, return
	if(message.guild == null) return;
	//if bot wrote the message, return
	if(message.author.bot) return;
	
	try {
		const data = fs.readFileSync(blacklistPath, 'utf-8');
		blacklist = JSON.parse(data).words;
		console.log('Czarna lista załadowana:', blacklist);
	} catch (error) {
		console.error('Błąd ładowania czarnej listy:', error);
	  }
	

	var foundWords = blacklist.filter(word => message.content.toLowerCase().includes(word.toLowerCase()));

	if (foundWords.length > 0) {
		message.channel.send("ZLE SLOWKO!!");
		message.author.send("Na serwerze "+message.guild.name+" słowo/a ```"+foundWords+"``` jest/są zakazane.")
		message.delete();
	} 
});

client.on('guildMemberAdd', async member => {
    console.log(`New member joined: ${member.user.tag}`); // Debug log
    
    try {
        const welcomeData = getWelcomeMessage(member.guild.id);
        if (!welcomeData) {
            console.log('No welcome message set for guild:', member.guild.id);
            return;
        }
        
        const channel = member.guild.channels.cache.get(welcomeData.channelId);
        if (!channel) {
            console.error('Channel not found:', welcomeData.channelId);
            return;
        }
        
        const welcomeMessage = welcomeData.message.replace('{user}', member.toString());
        console.log('Sending welcome to channel:', channel.name);
        
        await channel.send(welcomeMessage);
    } catch (error) {
        console.error('Error in guildMemberAdd:', error);
    }
});

client.on('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // TEST: sending a test message
    const testChannelId = '1358347573500313613';
    const channel = client.channels.cache.get(testChannelId);

    if (channel) {
        channel.send('SIEMANECZKO MORDKI')
            .then(() => console.log('Wysłano testową wiadomość'))
            .catch(err => console.error('Błąd wysyłania:', err));
    } else {
        console.error('Nie znaleziono kanału o ID:', testChannelId);
        console.log('Dostępne kanały:', client.channels.cache.map(c => `${c.name} (${c.id})`));
    }
});

// // Funkcja do załadowania czarnej listy
// let blacklist = [];

// function loadBlacklist() {
//   try {
//     const data = fs.readFileSync(blacklistPath, 'utf-8');
//     blacklist = JSON.parse(data).words;
//     console.log('Czarna lista załadowana:', blacklist);
//   } catch (error) {
//     console.error('Błąd ładowania czarnej listy:', error);
//   }
// }

// // Załaduj czarną listę przy starcie bota
// loadBlacklist();

// // Co 5 sekund sprawdzaj, czy plik został zmodyfikowany
// setInterval(() => {
//   loadBlacklist(); // Przeładuj czarną listę
// }, 1000); // Co 1 sekund

// // Normalizacja tekstu (usuwanie nie-alfanumerycznych znaków)
// const normalize = text => text.toLowerCase().replace(/[^a-zA-Z0-9ąćęłńóśźż]/g, '');

// client.on(Events.MessageCreate, async message => {
//   if (message.guild == null || message.author.bot) return;

//   const cleanedMessage = normalize(message.content);
//   const foundWords = blacklist.filter(word => cleanedMessage.includes(normalize(word)));

//   if (foundWords.length > 0) {
//     try {
//       await message.channel.send("ZLE SLOWKO!!");
//       await message.delete();
//       try {
//         await message.author.send(`Na serwerze **${message.guild.name}** słowo/a \`\`\`${foundWords.join(', ')}\`\`\` jest/sa zakazane.`);
//       } catch (dmError) {
//         console.warn(`Nie udało się wysłać wiadomości prywatnej do ${message.author.tag}`);
//       }
//     } catch (error) {
//       console.error('Błąd przy obsłudze zakazanego słowa:', error);
//     }
//   }
// });


// Log in to Discord with your client's token
client.login(token);