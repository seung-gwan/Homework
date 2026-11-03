import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../ex02/src/main/WebContent');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'guides.js'),'utf8'),sandbox);
const d=sandbox.window.APPLE_TREE;
assert.equal(d.guides.length,9);
assert.equal(new Set(d.guides.map(g=>g.id)).size,d.guides.length);
for(const g of d.guides){
  assert.ok(d.categories.some(c=>c.id===g.category),g.id+': invalid category');
  assert.ok(g.steps.length>=3,g.id+': incomplete guide');
  for(const s of g.steps)assert.ok(s.title&&s.body&&s.tip&&s.mock,g.id+': incomplete step');
  for(const [,url]of g.sources)assert.equal(new URL(url).protocol,'https:');
}
new vm.Script(fs.readFileSync(path.join(root,'app.js'),'utf8'));
const html=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
for(const f of html){
  const s=fs.readFileSync(path.join(root,f),'utf8');
  assert.match(s,/<html lang="ko">/,f+': missing Korean language');
  assert.match(s,/name="viewport"/,f+': missing viewport');
  for(const [,url]of s.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)){
    if(/^(https?:|data:|#)/.test(url))continue;
    assert.ok(fs.existsSync(path.resolve(root,url)),f+': missing '+url);
  }
}
console.log(`PASS: ${d.guides.length} guides, ${d.guides.reduce((n,g)=>n+g.steps.length,0)} steps, ${d.regions.length} region choices, ${html.length} HTML routes; scripts and local assets valid.`);
