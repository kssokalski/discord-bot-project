const welcomeData = new Map();

module.exports = {
    setWelcomeMessage: (guildId, message, channelId) => {
        welcomeData.set(guildId, { message, channelId });
    },
    getWelcomeMessage: (guildId) => {
        return welcomeData.get(guildId);
    },
    removeWelcomeMessage: (guildId) => {
        return welcomeData.delete(guildId);
    }
};