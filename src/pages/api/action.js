import * as manager from '../../lib/manage'
export async function POST ({ request }) {
	let response = null
	let body = await request.formData()
	let action = body.get('action')
	let AnimeID = body.get('AnimeID')
	let token = request.headers.get('Authorization')
	if (token == undefined) return new Response("No token provided", { status: 401 })
	token = token.replace("Bearer ", "")
	if (action == "updateStatus") {
		let status = body.get('status')
		response = new Response(JSON.stringify(await manager.updateStatus(AnimeID, status, token)))
	} else if (action == "removeFromList") {
		response = new Response(JSON.stringify(await manager.removeFromList(AnimeID, token)))
	} else if (action == "addToList") {
		response = new Response(JSON.stringify(await manager.addAnimeToList(AnimeID, token)))
	}
	response.headers.set('Content-Type', 'application/json')
	return response
}