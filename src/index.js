import getNyNews  from "./nytimes";
import getNikkeiNews from "./nikkei";
import {error,json,Router} from 'itty-router'


const router = Router()

async function jwtAuth(request,env){
	const token = request.headers.get('Authorization')
	if (!token) return error(401, "Invalid user")
	if(token!==env.TOKEN) return error(401, "Invalid user")
}

router
	.all("*",jwtAuth)
	.get("/nytimes",()=>getNyNews())
	.get("/nikkei",()=>getNikkeiNews())

export default {
	async fetch(request, env, ctx) {
		return router.handle(request,env,ctx).then(json).catch(error)
	},
};
