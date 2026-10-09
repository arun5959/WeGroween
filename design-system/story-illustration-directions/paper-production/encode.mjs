import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../..');
// Delivery encoding only: no compositing, retouching, cropping or colour edits.
// Pass the available sharp module path; this does not add app dependencies.
const sharp=createRequire(import.meta.url)(process.argv[2]||'sharp');
const records=JSON.parse(fs.readFileSync(path.join(dir,'prompts.json'),'utf8')).images;
const out=path.join(root,'public/media/story/paper');fs.mkdirSync(out,{recursive:true});
const manifest=[];
for(const record of records){const source=path.join(dir,record.copiedOriginal);const meta=await sharp(source).metadata();if(meta.width/meta.height!==1.5)throw Error('Unexpected art ratio: '+record.id);for(const width of [768,1536]){const file=record.id+'-'+width+'.webp';const info=await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:86,effort:6}).toFile(path.join(out,file));manifest.push({file,width:info.width,height:info.height,bytes:info.size});}}
fs.writeFileSync(path.join(dir,'delivery-manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
