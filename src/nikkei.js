const baseUrl="https://cn.nikkei.com/"
const linkClassSelector = '.column-1 dt > a'; 
const cheerio = require('cheerio');

export default async function getNikkeiNews(){  
   
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
            } });
            const $ = cheerio.load(await response.text());
            const title = $("h2.style01").text();
            const content=[]
            const photos=[]

            //no pagination bar
            if(!$('.newsText div').hasClass('pagenavbar')){
              $('.newsText > p').each((index, element) => {
                  e = cheerio.load(element) 
                  if(e('a').length==0 && e('div').length==0)
                    content.push($(element).text().trim())            
              });

              $(".newsText table").each((index,element)=>{
                e = cheerio.load(element) 
                if(e('td img').length>0){
                  const relativePath=e('td img').attr('src')
                  const absoluteUrl=new URL(relativePath,baseUrl).href
                  photos.push({src:absoluteUrl,alt:e('td > span').text().trim()})
                }
              })
            }

            if(content.length>0)
              news.push({title,content,photos,publisher:2})
            
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

