import { updateStatus, removeFromList, addAnimeToList, alterFavourite } from "../../lib/manage";
export async function POST ({ request }) {
	let response = null
	let body = await request.formData()
	let action = body.get('action')
	let AnimeID = body.get('AnimeID')
	let token = request.headers.get('Authorization')
	if (token == undefined) return new Response("No token provided", { status: 401 })
	token = token.replace("Bearer ", "")
	if (action == "editStatus") {
		let status = body.get('status')
		status = parseInt(status)
		response = new Response(JSON.stringify(await updateStatus(AnimeID, status, token)))
	} else if (action == "removeFromList") {
		response = new Response(JSON.stringify(await removeFromList(AnimeID, token)))
	} else if (action == "addToList") {
		response = new Response(JSON.stringify(await addAnimeToList(AnimeID, token)))
	} else if (action == "favourite") {
		response = new Response(JSON.stringify(await alterFavourite(AnimeID, token)))
	}
	response.headers.set('Content-Type', 'application/json')
	return response
}