import { db } from "./db.js"

export let STATUS = {
	"Watching": 1,
	"Completed": 2,
	"On Hold": 3,
	"Dropped": 4,
	"Plan to Watch": 5
}

export function numberToStatus (number) {
	switch (number) {
		case 1:
			return "Watching"
		case 2:
			return "Completed"
		case 3:
			return "On Hold"
		case 4:
			return "Dropped"
		case 5:
			return "Plan to Watch"
	}
}

export function addAnimeToList (anime, token) {
	const user = db.prepare("SELECT * FROM Users WHERE Token = ?").get(token)
	if (user == undefined) return 403 // Forbidden
	const animeEntry = db.prepare("SELECT * FROM Anime WHERE AnimeID = ?").get(anime)
	if (animeEntry == undefined) return 404 // Not Found
	const userList = JSON.parse(user.Anime)
	if (userList.includes(anime)) return 409 // Conflict
	let object = {
		AnimeID: anime,
		CurrentEpisode: 0,
		Status: STATUS.Watching,
		LastUpdated: Date.now()
	}
	userList.push(object)
	db.prepare("UPDATE Users SET Anime = ? WHERE Token = ?").run(JSON.stringify(userList), token)
	return 200 // OK
}

export async function getAnimeFromList (animeID, token) {
	const user = db.prepare("SELECT * FROM Users WHERE Token = ?").get(token)
	if (user == undefined) return 403 // Forbidden
	const userList = JSON.parse(user.Anime)
	for (let i = 0; i < userList.length; i++) {
		if (userList[i].AnimeID == animeID) {
			return userList[i]
		}
	}
	return 404 // Not Found
}

export async function updateCurrentEpisode (animeID, episode, token) {
	const user = db.prepare("SELECT * FROM Users WHERE Token = ?").get(token)
	if (user == undefined) return 403 // Forbidden
	const userList = JSON.parse(user.Anime)
	for (let i = 0; i < userList.length; i++) {
		if (userList[i].AnimeID == animeID) {
			userList[i].CurrentEpisode = episode
			userList[i].LastUpdated = Date.now()
			db.prepare("UPDATE Users SET Anime = ? WHERE Token = ?").run(JSON.stringify(userList), token)
			return 200 // OK
		}
	}
	return 404 // Not Found
}

export async function updateStatus (animeID, status, token) {
	const user = db.prepare("SELECT * FROM Users WHERE Token = ?").get(token)
	if (user == undefined) return 403 // Forbidden
	const userList = JSON.parse(user.Anime)
	for (let i = 0; i < userList.length; i++) {
		if (userList[i].AnimeID == animeID) {
			userList[i].Status = status
			userList[i].LastUpdated = Date.now()
			db.prepare("UPDATE Users SET Anime = ? WHERE Token = ?").run(JSON.stringify(userList), token)
			return 200 // OK
		}
	}
	return 404 // Not Found
}

export async function removeFromList (animeID, token) {
	const user = db.prepare("SELECT * FROM Users WHERE Token = ?").get(token)
	if (user == undefined) return 403 // Forbidden
	const userList = JSON.parse(user.Anime)
	for (let i = 0; i < userList.length; i++) {
		if (userList[i].AnimeID == animeID) {
			userList.splice(i, 1)
			db.prepare("UPDATE Users SET Anime = ? WHERE Token = ?").run(JSON.stringify(userList), token)
			return 200 // OK
		}
	}
	return 404 // Not Found
}

export async function getUserList (token) {
	const user = db.prepare("SELECT * FROM Users WHERE Token = ?").get(token)
	if (user == undefined) return 403 // Forbidden
	const userList = JSON.parse(user.Anime)
	return userList
}