import getNyNews from './nytimes';
import getNikkeiNews from './nikkei';
import getBbcNews from './bbc';
import getJoinsNews from './joins';
import { saveNews } from './helper';
import { error, json, Router } from 'itty-router';
import { getLatest5News, findNews } from './helper';

const router = Router();

async function auth(request, env, ctx) {
	const authResponse = await env.auth.fetch(request.clone());
	if (authResponse.status !== 200) return error(401, 'Invalid request');
}

async function getNews(env, ctx) {
	let nyNews, bbcNews, nikkeiNews;
	try {
		nyNews = await getNyNews();
	} catch {
		nyNews = [];
	}
	try {
		bbcNews = await getBbcNews();
	} catch {
		bbcNews = [];
	}
	try {
		nikkeiNews = await getNikkeiNews();
	} catch {
		nikkeiNews = [];
	}
	let finalArray = [];
	finalArray = [...nyNews, ...bbcNews, ...nikkeiNews];
	return finalArray;
	/*
	ctx.waitUntil(saveNews(env,ctx,nyNews))
	ctx.waitUntil(saveNews(env,ctx,bbcNews))
	*/
}

async function getLatestNews(env, ctx) {
	return getLatest5News(env, ctx);
}

router
	.all('*', auth)
	.get('/nytimes', getNyNews)
	.get('/nikkei', getNikkeiNews)
	.get('/bbc', getBbcNews)
	.get('/joins', getJoinsNews)
	.get('/latestNews', getLatestNews)
	.get('/findNews/:id', findNews)
	.get('/getNews', getNews);

export default {
	async fetch(request, env, ctx) {
		return router.handle(request, env, ctx).then(json).catch(error);
	},
	/*
	async scheduled(event, env, ctx) {
		ctx.waitUntil(getNews(env,ctx))
	},
	*/
};
