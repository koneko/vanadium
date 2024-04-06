import mongoose, { get } from 'mongoose';
import { dbUrl, timeToWaitBetweenAnimeRefresh, timeToWaitBetweenCacheRefresh } from "../../cfg.json"
import crypto from 'crypto-es';
import scraper from './scraper.ts';

async function connectToMongoDB() {
	try {
		await mongoose.connect(dbUrl);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Failed to connect to MongoDB', error);
	}
}

export const createHash = (password) => {
	return crypto.SHA512(password + "7336-2242-6364").toString(crypto.enc.Hex);
}

export const createID = () =>  {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const checkAndUpdateAnimeInfo = async (id) => {
	await refreshDB()
	let anime = await Anime.findOne({ id });
	if (!anime) return false;
	let now = Date.now();
	if (now - anime.lastUpdated > timeToWaitBetweenAnimeRefresh) {
		let newInfo = await scraper.get("/category/" + anime.gogoUrl)
		anime.title = newInfo.title;
		anime.image = newInfo.image;
		anime.episodes = newInfo.episodes;
		anime.lastUpdated = now;
		await anime.save();
	}
}

export const createAnimeInDB = async (title, aliases, image, gogoUrl) => {
	// TODO: this
}

export const updateCache = async () => {
	await refreshDB()
	let lastUpdated = await CacheLastUpdated.find() as any;
	let lastUpdatedExisted = true
	if (lastUpdated.length == 0) {
		lastUpdated = new CacheLastUpdated({ lastUpdated: Date.now() });
		lastUpdatedExisted = false;
		await lastUpdated.save();
	} else {
		lastUpdated = lastUpdated[0];
	}
	let now = Date.now();
	if (!lastUpdatedExisted) {
		let recentAnime: Array<{ title; image; anime; url; episode }> = await scraper.newEpisodes(1);
		recentAnime = recentAnime.concat(await scraper.newEpisodes(2));
		// push to cache
		for (let i = 0; i < recentAnime.length; i++) {
			let anime = recentAnime[i];
			// try to find id of existing anime, and if you find put that as the id
			let animeInfo = await Anime.findOne({ title: anime.title });
			// if it doesnt exist, try finding via an alias
			if (!animeInfo) {
				animeInfo = await Anime.findOne({ aliases: { $regex: anime.title } });
			}
			if (!animeInfo) {
				// TODO: add to anime database, assume its new and log just in case
				continue;
			}
			let id = animeInfo.id;
			let cache = new Cache({ title: anime.title, src: anime.image, id, episode: anime.episode, anime: anime.anime });
			await cache.save();
		}
		return
	}
	if (now - lastUpdated.lastUpdated > timeToWaitBetweenCacheRefresh) {
		// remove all cache
		await Cache.deleteMany({});
		let recentAnime: Array<{ title; image; anime; url; episode }> = await scraper.newEpisodes(1);
		recentAnime = recentAnime.concat(await scraper.newEpisodes(2));
		// push to cache
		for (let i = 0; i < recentAnime.length; i++) {
			let anime = recentAnime[i];
			// try to find id of existing anime, and if you find put that as the id
			let animeInfo = await Anime.findOne({ title: anime.title });
			// if it doesnt exist, try finding via an alias
			if (!animeInfo) {
				animeInfo = await Anime.findOne({ aliases: { $regex: anime.title } });
			}
			let id = animeInfo ? animeInfo.id : createID();
			let cache = new Cache({ title: anime.title, src: anime.image, id, episode: anime.episode, anime: anime.anime });
			await cache.save();
		}
		lastUpdated.lastUpdated = now;
		await lastUpdated.save();
	}
}

export const refreshDB = async () => {
	if (mongoose.connection.readyState === 0) {
		await connectToMongoDB();
	}
	return mongoose.connection;
}

export const User = mongoose.model('User', new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	hash: {
		type: String,
		required: true
	},
	anime: {
		type: Array,
		default: []
	},
	history: {
		type: Array,
		default: []
	}
}))

export const Anime = mongoose.model('Anime', new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true
	},
	aliases: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	gogoUrl: {
		type: String,
		required: true
	},
	episodes: {
		type: Array,
		default: []
	},
	lastUpdated: {
		type: Number,
		default: Date.now()
	}
}))

export const Cache = mongoose.model('Cache', new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	src: {
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true
	},
	episode: {
		type: Number,
		required: true
	},
	anime: {
		type: String,
		required: true
	}
}))

export const CacheLastUpdated = mongoose.model('CacheLastUpdated', new mongoose.Schema({
	lastUpdated: {
		type: Number,
		required: true
	}
}))