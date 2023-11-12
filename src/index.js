import getNyNews  from "./nytimes";
import getNikkeiNews from "./nikkei";
import getBbcNews from "./bbc";
import { saveNews } from "./helper";
import {error,json,Router} from 'itty-router'
import { getLatest5News } from "./helper";

const router = Router()

async function jwtAuth(request,env){
	const token = request.headers.get('Authorization')
	if (!token) return error(401, "Invalid user")
	if(token!==env.TOKEN) return error(401, "Invalid user")
}

async function getNews(env, ctx){
	
	const nyNews=await getNyNews()
	//const nikkeiNews=await getNikkeiNews()
	const bbcNews=await getBbcNews()
	const finalArray=[...nyNews,...bbcNews]
	ctx.waitUntil(saveNews(env,ctx,finalArray))
}

async function getLatestNews(env,ctx){
	return getLatest5News(env,ctx)
}

router
	.all("*",jwtAuth)
	.get("/nytimes",getNyNews)
	.get("/nikkei",getNikkeiNews)
	.get("/bbc",getBbcNews)
	.get("/latestNews",getLatestNews)

export default {
	
	async fetch(request, env, ctx) {
		return router.handle(request,env,ctx).then(json).catch(error)
	},
	
	async scheduled(event, env, ctx) {
		ctx.waitUntil(getNews(env,ctx))
	},
};
