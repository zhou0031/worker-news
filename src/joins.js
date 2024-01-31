const baseUrl = 'https://chinese.joins.com/';
const linkClassSelectors = ['#skin-55 .item > a', '#skin-57 .item a', '#skin-12 .item > a'];
const cheerio = require('cheerio');

export default async function getJoinsNews() {
	try {
		const response = await fetch(baseUrl, {
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
			},
		});
		const $ = cheerio.load(await response.text());
		// Extract links with the specified class selector from the current page
		const links = [];

		linkClassSelectors.forEach((linkClassSelector) => {
			$(linkClassSelector).each((index, element) => {
				const link = $(element).attr('href');
				const absoluteUrl = new URL(link, baseUrl).href;
				if (link && !links.includes(absoluteUrl)) links.push(absoluteUrl);
			});
		});

		const news = [];

		for (const link of links) {
			try {
				const response = await fetch(link, {
					method: 'GET',
					headers: {
						'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
					},
				});
				const $ = cheerio.load(await response.text());
				const title = $('div.article-head-title').text();
				const publication_date = $('[property="article:published_time"]').attr('content');
				const content = [];
				const photos = [];

				$('[itemprop="articleBody"] > p').each((index, element) => {
					content.push($(element).text().trim());
				});

				$('.IMGFLOATING > img').each((index, element) => {
					const relativePath = $(element).attr('src');
					const absoluteUrl = new URL(relativePath, baseUrl).href;
					photos.push({ src: absoluteUrl, alt: $(element).attr('alt').trim() });
				});

				if (title.length > 0 && content.length > 0) news.push({ title, content, publication_date, photos, publisher: 4 });
			} catch (e) {
				console.log(e);
			}
		}

		return news;
	} catch (error) {
		console.log(error);
		return [];
	}
}
