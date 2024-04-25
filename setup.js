const { Database } = require("better-sqlite3")
const fs = require("fs")
const db = new Database("anime.db")
const data = fs.readFileSync("tables.sql", "utf-8")
db.exec(data)
db.close()

console.log("Database setup script completed, if you build the project, make sure to copy `anime.db` into the `server` folder inside the `dist` folder.")