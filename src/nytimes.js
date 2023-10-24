const baseUrl="https://cn.nytimes.com/"
const linkClassSelector = '.regularSummaryHeadline > a'; 
const cheerio = require('cheerio');

export default async function getNyNews(){  
   
    try {
        const response=await fetch(baseUrl,{method:"GET"})
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
            const response = await fetch(links[link], { method: "GET" });
            const $ = cheerio.load(await response.text());
            const title = $(".article-header h1").text();
            const content=[]
          
            $('.article-paragraph').each((index, element) => {
                
              e = cheerio.load(element)  
              if(e('img').length==0)  
                content.push($(element).text())            
            });
           
            news.push({title,content})
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

