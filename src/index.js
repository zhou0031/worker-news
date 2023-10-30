import getNyNews  from "./nytimes";
import getNikkeiNews from "./nikkei";
import { saveNews } from "./helper";
import {error,json,Router} from 'itty-router'


const router = Router()

async function jwtAuth(request,env){
	const token = request.headers.get('Authorization')
	if (!token) return error(401, "Invalid user")
	if(token!==env.TOKEN) return error(401, "Invalid user")
}

async function getNews(env, ctx){
	
	const nyNews=await getNyNews()
	const nikkeiNews=await getNikkeiNews()
	const finalArray=[...nyNews,...nikkeiNews]
	ctx.waitUntil(saveNews(env,ctx,finalArray))
}

router
	.all("*",jwtAuth,getNews)
	.get("/nytimes",getNyNews)
	.get("/nikkei",getNikkeiNews)

export default {
	/*
	async fetch(request, env, ctx) {
		return router.handle(request,env,ctx).then(json=>saveNews(env,ctx,json)).catch(error)
	},
	*/
	async scheduled(event, env, ctx) {
		ctx.waitUntil(getNews(env,ctx))
	},
};
