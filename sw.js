/* S.D Chauffage : démarrage hors ligne. Ne jamais stocker les réponses Supabase. */
const CACHE='sd-chauffage-shell-v4';
const CORE=['./index.html','./design-tiffany-v3.js','./vendor/qrcode.js','./invoice-payment.js','./billing-editor.js','./appointment-to-invoice.js','./buderus-catalogue.js','./maintenance-reminders.js','./client-installations.js','./agenda-maintenance.js','./cloud-config.js','./cloud-sync.js'];
const OPTIONAL=['./manifest.webmanifest','./sd-chauffage-icon.png','./sd-chauffage-document-logo.svg'];
const shellURL=new URL('./index.html',self.registration.scope).href;
function isAppRequest(request){
 const url=new URL(request.url);
 return url.origin===self.location.origin&&url.pathname.startsWith(new URL(self.registration.scope).pathname);
}
async function fetchAndCache(cache,path){
 const url=new URL(path,self.registration.scope);
 const response=await fetch(url,{cache:'reload'});
 if(!response.ok)throw Error('Cache HTTP '+response.status+' '+path);
 await cache.put(url.href,response.clone());
 return response;
}
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // Un seul fichier manquant ne doit pas empêcher de mettre en cache les autres.
  const results=await Promise.allSettled(CORE.map(path=>fetchAndCache(cache,path)));
  if(results.some(result=>result.status==='rejected'))throw Error('Fichiers essentiels non disponibles pour le mode hors ligne');
  await Promise.allSettled(OPTIONAL.map(path=>fetchAndCache(cache,path)));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  if(await cache.match(shellURL)){
   for(const name of await caches.keys())if(name.startsWith('sd-chauffage-shell-')&&name!==CACHE)await caches.delete(name);
  }
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||!isAppRequest(req))return;
 const url=new URL(req.url);
 if(url.pathname.endsWith('/sw.js'))return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const response=await fetch(req);
    if(response.ok){const cache=await caches.open(CACHE);await cache.put(shellURL,response.clone());}
    return response;
   }catch{
    const cached=await caches.match(shellURL);
    return cached||new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><title>SD Chauffage</title><body>Ouvre SD Chauffage avec Internet une fois pour activer le mode hors ligne.</body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'},status:503});
   }
  })());
  return;
 }
 event.respondWith((async()=>{
  const cached=await caches.match(req,{ignoreSearch:true});
  if(cached)return cached;
  try{
   const response=await fetch(req);
   if(response.ok){const cache=await caches.open(CACHE);await cache.put(req,response.clone());}
   return response;
  }catch{return Response.error();}
 })());
});
