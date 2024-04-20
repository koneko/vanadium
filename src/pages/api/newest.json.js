import { newEpisodes } from '../../lib/db'
export async function GET ({ params, request }) {
	const resp = new Response(JSON.stringify(await newEpisodes()))
	resp.headers.set('Content-Type', 'application/json')
	return resp
}