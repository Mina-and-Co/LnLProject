const fs = require("fs");
const { type } = require("os");
const path = require("path");

async function login(password) {
    try {
        const isPackaged = typeof process.pkg !== "undefined";
        let filePath;
        if (isPackaged) {
            const binaryFolder = path.dirname(process.execPath);
            filePath = path.join(binaryFolder, "..", "data.txt");
        } else {
            filePath = path.join(__dirname, "..", "..", "data.txt");
        }
        const actual = fs.readFileSync(filePath, "utf8").trim();
        return password === actual;
    } catch (err) {
        console.error("Error reading password file.");
        throw err;
    }
}

module.exports = { login };
