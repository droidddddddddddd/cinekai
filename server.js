const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname;
const types={
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml',
  '.webp':'image/webp',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.png':'image/png',
  '.ico':'image/x-icon',
  '.txt':'text/plain; charset=utf-8'
};
http.createServer((req,res)=>{
  let url;
  try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}
  catch{res.writeHead(400);return res.end('Bad request')}
  let file=path.resolve(root,'.'+(url==='/'?'/index.html':url));
  if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){
    res.writeHead(403);return res.end('Forbidden')
  }
  fs.stat(file,(e,s)=>{
    if(e||!s.isFile()){res.writeHead(404);return res.end('Not found')}
    res.writeHead(200,{
      'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream',
      'Cache-Control':'public, max-age=300'
    });
    fs.createReadStream(file).pipe(res)
  })
}).listen(process.env.PORT||10000,'0.0.0.0');
