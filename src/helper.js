import { v4 as uuidv4 } from 'uuid';

async function saveNews(env,ctx,news){
   try{
        for(const item of news){
            const value = await env.cache.get(item.title);
            if(value===null){
               ctx.waitUntil(
                     env.DB
                     .prepare("INSERT INTO News (news_id,title,content,publication_date,publisher) VALUES(?,?,?,?,1)")
                     .bind(uuidv4(),item.title,item.content.toString(),new Date().toUTCString())
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

export {saveNews}