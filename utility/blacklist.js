const fs = require('fs');
const path = require('path');
const blacklistPath = path.join(__dirname, '../blacklist.json');

// Funkcja pobierająca czarną listę
function getBlacklist() {
    const data = fs.readFileSync(blacklistPath, 'utf-8');
    return JSON.parse(data).words;
}

// Funkcja zapisująca czarną listę do pliku
function saveBlacklist(words) {
    fs.writeFileSync(blacklistPath, JSON.stringify({ words }, null, 2));
}

// Funkcja dodająca słowo do czarnej listy
function addToBlacklist(word) {
    const words = getBlacklist();
    if (!words.includes(word)) {
        words.push(word);
        saveBlacklist(words);
        return true;
    }
    return false;
}

// Funkcja usuwająca słowo z czarnej listy
function removeFromBlacklist(word) {
    let words = getBlacklist();
    if (words.includes(word)) {
        words = words.filter(w => w !== word);
        saveBlacklist(words);
        return true;
    }
    return false;
}

module.exports = {
    getBlacklist,
    addToBlacklist,
    removeFromBlacklist
};
