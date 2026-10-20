// Offline cache: the game shell up front, fighter art and songs as they are first used.
const V='bp-v11',CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.headers.has('range'))return;
 const isPage=r.mode==='navigate'||r.url.endsWith('index.html');
 e.respondWith(isPage?fetch(r).then(res=>{caches.open(V).then(c=>c.put(r,res.clone()));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
  :caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)caches.open(V).then(c=>c.put(r,res.clone()));return res})))});
