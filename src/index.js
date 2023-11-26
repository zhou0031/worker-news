import getNyNews  from "./nytimes";
import getNikkeiNews from "./nikkei";
import getBbcNews from "./bbc";
import { saveNews } from "./helper";
import {error,json,Router} from 'itty-router'
import { getLatest5News } from "./helper";

const router = Router()

async function auth(request,env,ctx){
	const authResponse = await env.auth.fetch(request.clone())
	if (authResponse.status !== 200) 
		return error(401,"Invalid Request")	
}

/*
async function getNews(env, ctx){
	
	const nyNews=await getNyNews()
	const nikkeiNews=await getNikkeiNews()
	const bbcNews=await getBbcNews()
	const finalArray=[...nyNews,...nikkeiNews]
	ctx.waitUntil(saveNews(env,ctx,finalArray))
}
*/

async function getLatestNews(env,ctx){
	return getLatest5News(env,ctx)
}

router
	.all("*",auth)
	.get("/nytimes",getNyNews)
	.get("/nikkei",getNikkeiNews)
	.get("/bbc",getBbcNews)
	.post("/saveNews",saveNews)
	.get("/latestNews",getLatestNews)

export default {
	
	async fetch(request, env, ctx) {
		return router.handle(request,env,ctx).then(json).catch(error)
	},

	/*
	async scheduled(event, env, ctx) {
		ctx.waitUntil(getNews(env,ctx))
	},
	*/
};
