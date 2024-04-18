import Database from "better-sqlite3"
import cfg from "../../cfg.json"
import scraper from "./scraper.js"
const db = new Database("anime.db")
db.pragma("journal_mode = WAL")

async function getAnimeEntry (AnimeID) {
	await updateAnimeEntry(AnimeID)
	let entry = db.prepare("SELECT * FROM Anime WHERE AnimeID = ?").get(AnimeID)
	if (entry == null) return null
	return db.prepare("SELECT * FROM Anime WHERE AnimeID = ?").get(AnimeID)
}

async function updateAnimeEntry (AnimeID) {
	let entry = db.prepare("SELECT * FROM Anime WHERE AnimeID = ?").get(AnimeID)
	let shouldInsert = false
	if (entry == undefined) {
		shouldInsert = true
		entry = await scraper.get(AnimeID)
	}
	if (entry.Title == "Error 404") return null
	const title = entry.Title
	const aliases = entry.Aliases
	const image = entry.Image
	const description = entry.Description
	const episodes = entry.Episodes
	const date = entry.Date
	const genres = entry.Genres
	const lastUpdated = Date.now()
	if (shouldInsert) {
		db.prepare("INSERT INTO Anime (AnimeID, Title, Aliases, Image, Description, Episodes, Date, Genres, LastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(AnimeID, title, aliases, image, description, episodes, date, genres, lastUpdated)
	} else {
		if ((Date.now() - entry.LastUpdated) / 1000 >= cfg.timeToWaitBetweenAnimeRefresh)
			db.prepare("UPDATE Anime SET Title = ?, Aliases = ?, Image = ?, Description = ?, Episodes = ?, Date = ?, Genres = ?, LastUpdated = ? WHERE AnimeID = ?").run(title, aliases, image, description, episodes, date, genres, lastUpdated, AnimeID)
	}
}

async function newEpisodes () {
	let lastUpdatedTriggered = false
	try {
		const lastUpdated = db.prepare("SELECT * FROM CacheLastUpdated").get()
		if (lastUpdated == undefined) {
			// upon first ever run of app, this will run.
			let time = Date.now()
			db.prepare("INSERT INTO CacheLastUpdated (Time) VALUES (?)").run(time)
			lastUpdatedTriggered = true
			lastUpdated.Time = time
		}
		const lastUpdatedTime = lastUpdated.Time
		const currentTime = Date.now()
		let timeDifference = currentTime - lastUpdatedTime
		timeDifference = Math.round(timeDifference / 1000)
		console.log(timeDifference, cfg.timeToWaitBetweenCacheRefresh)
		if (timeDifference >= cfg.timeToWaitBetweenCacheRefresh || lastUpdatedTriggered) {
			let newEpisodes = await scraper.newEpisodes(1);
			newEpisodes = newEpisodes.concat(await scraper.newEpisodes(2));
			newEpisodes = newEpisodes.concat(await scraper.newEpisodes(3));
			db.prepare("DELETE FROM Cache").run()
			for (let i = 0; i < newEpisodes.length; i++) {
				const episode = newEpisodes[i]
				updateAnimeEntry(episode.animeID)
				db.prepare("INSERT INTO Cache (title, image, episodeUrl, animeID, episode) VALUES (?, ?, ?, ?, ?)").run(episode.title, episode.image, episode.episodeUrl, episode.animeID, episode.episode)
			}
			let time = Date.now()
			db.prepare("UPDATE CacheLastUpdated SET Time = ?").run(time)

		}
		const cache = db.prepare("SELECT * FROM Cache").all()
		return cache
	} catch (error) {
		console.log(error);
	}
}

async function searchFromDB (query) {
	let results = db.prepare("SELECT * FROM Anime WHERE Title LIKE ? OR Aliases LIKE ?").all(`%${query}%`, `%${query}%`)
	return results
}

async function search (query) {
	let results = await scraper.search(query)
	results.forEach(item => {
		updateAnimeEntry(item.AnimeID)
	});
	return results
}

export {
	db,
	search,
	searchFromDB,
	newEpisodes,
	getAnimeEntry
}