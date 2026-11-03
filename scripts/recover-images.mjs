// Restore the user's original instructional screenshots as local assets.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const directory=path.join(root,'ex02/src/main/WebContent/assets/screens');
fs.mkdirSync(directory,{recursive:true});
const files=execFileSync('git',['ls-tree','-r','--name-only','54e015e','--','ex02/src/main/WebContent'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(f=>/1\.html$|\/job\.html$/.test(f));
const urls=new Set();
for(const file of files){
  const html=execFileSync('git',['show','54e015e:'+file],{cwd:root,encoding:'utf8'});
  [...html.matchAll(/<img[^>]*src=["']([^"']+)["']/gi)].slice(2).forEach(m=>urls.add(m[1]));
}
const queue=[...urls];let success=0;const failures=[];
await Promise.all(Array.from({length:5},async()=>{
  while(queue.length){
    const url=queue.shift();const name=new URL(url).pathname.split('/')[1]+'.png';
    if(fs.existsSync(path.join(directory,name))){success++;continue;}
    try{
      const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const bytes=Buffer.from(await response.arrayBuffer());
      if(bytes.subarray(1,4).toString()!=='PNG')throw new Error('Expected PNG image');
      fs.writeFileSync(path.join(directory,name),bytes);
      success++;console.log(name,bytes.readUInt32BE(16)+'x'+bytes.readUInt32BE(20),Math.round(bytes.length/1024)+' KB');
    }catch(e){failures.push({url,error:e.message});}
  }
}));
console.log(JSON.stringify({downloaded:success,failures}));
if(failures.length)process.exitCode=1;
