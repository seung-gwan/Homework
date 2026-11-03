import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'ex02/src/main/WebContent');
const output=path.resolve(root,'dist');
if(path.dirname(output)!==root||path.basename(output)!=='dist')throw new Error('Invalid output directory');
if(fs.existsSync(output)){
  if(fs.lstatSync(output).isSymbolicLink()||fs.realpathSync(output)!==output)throw new Error('Output must be a regular project directory');
  fs.rmSync(output,{recursive:true,force:true});
}
fs.cpSync(source,output,{recursive:true});
console.log('Built static site: dist/');
