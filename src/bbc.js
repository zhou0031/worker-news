const baseUrl="https://www.bbc.com/zhongwen/simp"
const linkClassSelector = '[aria-labelledby="Top-stories"] li.ebmt73l0 h3 a'; 
const cheerio = require('cheerio');

export default async function getBbcNews(){  
   
    try {
        const response=await fetch(baseUrl,{method:"GET",headers:{
          "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
        }})
        const $ = cheerio.load(await response.text())
       
        // Extract links with the specified class selector from the current page
        const links = [];
        $(linkClassSelector).each((index, element) => {
          const link = $(element).attr('href');
          if (link) {
            const absoluteUrl = new URL(link, baseUrl).href;
            links.push(absoluteUrl);
          }
        });
        
        const news=[]
        
        let e
        for (const link in links){
          try{
            const response = await fetch(links[link], { method: "GET",headers:{
              "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
            }});
            const $ = cheerio.load(await response.text());
            const title = $("div.bbc-1151pbn").text();
            const content=[]
            const photos=[]    
            
            $('p.bbc-w2hm1d').each((index, element) => {           
                content.push($(element).text())
            });
            
            $('figure').each((index,element)=>{
              e = cheerio.load(element)
              const src=e('picture > img').attr('src')
              const alt=e('figcaption p').text()
              photos.push({src:src,alt:alt})
            })
            
            news.push({title,content,photos,publisher:3})
            
          }catch(e){
            console.log(e)
          }
        }
        
        return news     
        
        } catch (error) {
            console.log(error)
            return []
        }
        
}

