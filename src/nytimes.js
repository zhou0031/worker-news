const baseUrl="https://cn.nytimes.com/"
const linkClassSelector = '.regularSummaryHeadline > a'; 
const headlineSelector = ['.leadHeadline > a','.photoWrapper > a']
const cheerio = require('cheerio');

export default async function getNyNews(){  
   
    try {
        const response=await fetch(baseUrl,{method:"GET",headers:{
          "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
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
        
       for(const l of headlineSelector){
        const link=$(l).attr('href')
        const absoluteUrl = new URL(link, baseUrl).href;
        links.push(absoluteUrl);
       }



        const news=[]
        let e
        for (const link in links){
          
          try{
            const response = await fetch(links[link], { method: "GET",headers:{
              "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
            } });
            const $ = cheerio.load(await response.text());
            const title = $(".article-header h1").text();
            const publication_date=$(".article-header time").attr('datetime');
            const content=[]
            const photos=[]
      
            /* head image */
            const headImage=$(".article-span-photo > img").attr('src')
            const headAlt=$(".article-span-photo > img").attr('alt')
            photos.push({src:headImage,alt:headAlt})

            $('.article-paragraph').each((index, element) => {
              e = cheerio.load(element)  
              if(e('img').length==0)  
                content.push($(element).text())
              else
                photos.push({src:e('img').attr('src'),alt:e('img').attr('alt')})
            });
            
            news.push({title, content, publication_date, photos, publisher:1})
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

