import getNyNews  from "./nytimes";
import getNikkeiNews from "./nikkei";
import getBbcNews from "./bbc";
import { saveNews } from "./helper";
import {error,json,Router} from 'itty-router'
import { getLatest5News } from "./helper";

const router = Router()




async function ipAuth(request,env){
	
	const allowed_ipv4 = await env.allowed.get("ipv4")
	const allowed_ipv6 = await env.allowed.get("ipv6")
	const trueClientIp=request.headers.get("CF-Connecting-IP")
	
	if(trueClientIp!==allowed_ipv4&&trueClientIp!==allowed_ipv6) 
		return error(401,"Invalid Request")
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
	.all("*",ipAuth)
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
