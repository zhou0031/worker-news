import { v4 as uuidv4 } from 'uuid';

async function saveNews(env,ctx,news){
   try{
        for(const item of news){
            const value = await env.cache.get(item.title);
            if(value===null){
               ctx.waitUntil(
                     env.DB
                     .prepare("INSERT INTO News (news_id,title,content,publication_date,photos,publisher) VALUES(?,?,?,?,?,?)")
                     .bind(uuidv4(),item.title,item.content.toString(),new Date().getTime(),JSON.stringify(item.photos),item.publisher)
                     .all()           
                  )
               ctx.waitUntil(env.cache.put(item.title,JSON.stringify({timestamp:new Date().getTime()})))   
            }
         }
      return new Response(JSON.stringify({"ok":true}))
      
   }catch(e){
    return new Response(JSON.stringify({"ok":false}))
   }
  
}

async function getLatest5News(req,env,ctx){
   try{
      const news=await env.DB.prepare("SELECT * FROM News ORDER BY publication_date DESC LIMIT 5").all()
      return news
   }catch(e){
      console.log(e)
   }

}


export {saveNews,getLatest5News}