import {writeFile} from 'node:fs/promises';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createSneaker} from '../model/createSneaker.mjs';
globalThis.FileReader=class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});} readAsDataURL(blob){blob.arrayBuffer().then(buffer=>{this.result='data:'+blob.type+';base64,'+Buffer.from(buffer).toString('base64');this.onloadend?.();});}};
const {root}=createSneaker();
const result=await new GLTFExporter().parseAsync(root,{binary:true});
await writeFile('public/assets/sneaker.glb',Buffer.from(result));
console.log('Exported sneaker.glb',result.byteLength,'bytes');
