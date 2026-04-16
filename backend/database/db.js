const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const isPackaged = typeof process.pkg !== "undefined";
let dbPath;
if (isPackaged) {
    const binaryFolder = path.dirname(process.execPath);
    dbPath = path.join(binaryFolder, '..', 'library.db');
} else {
    dbPath = path.join(__dirname, '..', '..', 'library.db');
}

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const dbExists = fs.existsSync(dbPath);
//create connection to the database

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite Database.');
    }
});

db.ready = new Promise((resolve, reject) => {
    db.serialize(() => {
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('Pragma error:', err.message);
                return reject(err);
            }

            if (!dbExists) {
                console.log("No DB found. Initializing schema.");
                try {
                    const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
                    db.exec(schema, (err) => {
                        if (err) {
                            console.error("Error initializing database:", err.message);
                            return reject(err);
                        } else {
                            console.log("Database initialized successfully.");
                            resolve();
                        }
                    });
                } catch (err) {
                    console.err("Could not read schema file:", err.message);
                    return reject(err);
                }
            } else {
                resolve();
            }

        });
    });
});

//Promisify database methods for async/await

// Use this for actions that change things in the database (e.g. insert, update, delete)
db.runAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                // lastID is the ID of the row that was created in the database
                // changes is how many rows were affected by the operation
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

// Use this one when you want exactly one result from the database, e.g. looking for a single book by id
// Returns a single javascript object or undefined if the item is not found
db.getAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

//This returns multiple results, e.g. all the books with ths genre.
//Returns an array of objects or an empty array if nothing is found.
db.allAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = db;
