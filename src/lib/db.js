import Database from "better-sqlite3"
import cfg from "../../cfg.json"
import scraper from "./scraper.js"
const db = new Database("anime.db")
db.pragma("journal_mode = WAL")

async function updateAnimeEntry (AnimeID) {
	let entry = db.prepare("SELECT * FROM Anime WHERE AnimeID = ?").get(AnimeID)
	if (entry == undefined) {
		entry = await scraper.get(AnimeID)
	}
	const title = entry.Title
	const aliases = entry.Aliases
	const image = entry.Image
	const description = entry.Description
	const episodes = entry.Episodes
	const date = entry.Date
	const genres = entry.Genres
	const lastUpdated = Date.now()
	if (entry == undefined) {
		db.prepare("INSERT INTO Anime (AnimeID, Title, Aliases, Image, Description, Episodes, Date, Genres, LastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(AnimeID, title, aliases, image, description, episodes, date, genres, lastUpdated)
	} else {
		db.prepare("UPDATE Anime SET Aliases = ?, Image = ?, Description = ?, Episodes = ?, Date = ?, Genres = ?, LastUpdated = ? WHERE AnimeID = ?").run(aliases, image, description, episodes, date, genres, lastUpdated, AnimeID)
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

export {
	db,
	newEpisodes
}