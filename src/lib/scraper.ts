// Description: This file contains the scraper for the gogoanime website.
// You can write your own, just make sure to export the same functions  
// as the ones in this file and to export the same object at the end.
import { load } from "cheerio"
import { url } from "../../cfg.json"
let base = url
async function search (query) {
	let url = base + "search.html?keyword=" + query
	let raw = await fetch(url, { redirect: "follow" }).then((res) => res.text())
	let $ = load(raw)
	let result = []
	let main = $('div.last_episodes').children().children().toArray()
	for (let i = 0; i < main.length; i++) {
		let item = main[i]
		let title = $(item).find('a').attr('title')
		if (title == undefined) continue;
		if (title == "") title = $(item).find('a').text()
		title = title.replace(/"/g, "\"")
		let image = $(item).find('img').attr('src')
		let url = $(item).find('a').attr('href')
		let obj = {
			title,
			image,
			url
		}
		result.push(obj)
	}
	return result
}

async function getImage (link) {
	let url = base + link
	let raw = await fetch(url, { redirect: "follow" }).then((res) => res.text())
	let $ = load(raw)
	let image = $('div.anime_info_body').find('img').attr('src')
	return image
}

async function newEpisodes(page): Promise<any> {
	if (page == null) page = 1;
	let url = `${base}?page=${page}&type=1`
	let raw = await fetch(url, { redirect: "follow" }).then((res) => res.text())
	let $ = load(raw)
	let result = []
	let main = $('div.last_episodes').children().children().toArray()
	for (let i = 0; i < main.length; i++) {
		let item = main[i]
		let title = $(item).find('a').attr('title')
		if (title == undefined) continue;
		if (title == "") title = $(item).find('a').text()
		title = title.replace(/"/g, "\"")
		title = title.replace(/\n/g, "")
		let image = $(item).find('img').attr('src')
		let url = $(item).find('a').attr('href')
		let animeUrl = url.split("-episode-")[0]
		let episode = $(item).find('p.episode').text().split(" ")[1]
		if (image[0] == "/") image = "https://gogoanime.tw" + image
		let obj = {
			title,
			image,
			url,
			anime: animeUrl,
			episode
		}
		result.push(obj)
	}
	return result
}

async function get (link) {
	let url = base + link
	let raw = await fetch(url, { redirect: "follow" }).then((res) => res.text())
	let $ = load(raw)
	let videos = $('div.anime_video_body').children("#episode_page").children().toArray()
	let title
	try {
		title = $("h1").text()
	} catch (e) {
		title = "N/A"
	}
	let image
	try {
		image = $("div.anime_info_body_bg").children("img").attr("src")
	} catch (e) {
		image = "https://hub.koneko.link/cdn/icons/black.png"
	}
	let description;
	try {
		description = $(".description").text()
	} catch (e) {
		description = "N/A"
	}
	let date
	try {
		date = ($("div.anime_info_body_bg").children("p.type").find("span")["3"] as any).parentElement.textContent 
	} catch (e) {
		date = "N/A"
	}
	let altName;
	try {
		altName = $("div.anime_info_body_bg").children("p.other-name").find("a").attr("title")
	} catch (e) {
		altName = "N/A"
	}
	let genres = []
	try {
		let d = $("div.anime_info_body_bg").children("p.type").find("a[title]").toArray()
		d.shift()
		for (let i = 0; i < d.length; i++) {
			genres.push(d[i].attribs.title)
		}
		genres.pop()
	} catch (e) {
		genres = ["N/A"]
	}
	let num
	try {
		num = $(videos[videos.length - 1]).html().replace(/\s+/g, "").split("ep_end")[1].split(">")[0].replace(/"/g, "").replace("=", "")
		} catch (e) {
		num = 0
	}
	let obj = {
		title,
		aliases: altName,
		image,
		description,
		episodes: num,
		date,
		genres,
	}
	return obj
}

async function getSources (link) {
	let url = base + link
	let raw = await fetch(url, { redirect: "follow" }).then((res) => res.text())
	let $ = load(raw)
	let videos = $('div.anime_muti_link').children().children().toArray()
	let result = []
	for (let i = 0; i < videos.length; i++) {
		let item = videos[i]
		let url = $(item).find('a').attr('data-video')
		result.push(url)
	}
	return result
}

export default {
	search,
	get,
	getSources,
	newEpisodes,
	getImage
}