import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'icons.json'),'utf8'));
const svgDir=path.join(root,'dimensional/svg');
fs.mkdirSync(svgDir,{recursive:true});fs.mkdirSync(path.join(root,'src/dimensional'),{recursive:true});
const defs=`<defs>
<linearGradient id="ice" x1=".15" y1="0" x2=".7" y2="1"><stop stop-color="#c0f6ff"/><stop offset=".32" stop-color="#69e6ff"/><stop offset=".7" stop-color="#22baff"/><stop offset="1" stop-color="#1679df"/></linearGradient>
<linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#157cff"/><stop offset=".55" stop-color="#0755da"/><stop offset="1" stop-color="#03328b"/></linearGradient>
<linearGradient id="matte" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#414b5b"/><stop offset=".48" stop-color="#262f3c"/><stop offset="1" stop-color="#151c28"/></linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#baf8ff"/><stop offset=".5" stop-color="#5bdfff"/><stop offset="1" stop-color="#159de7"/></linearGradient>
<radialGradient id="button" cx=".28" cy=".18" r=".85"><stop stop-color="#b2f6ff"/><stop offset=".5" stop-color="#54ddff"/><stop offset="1" stop-color="#1388dc"/></radialGradient>
</defs>`;
const P=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const custom={};
// The three core silhouettes are authored as solid surfaces, not recolored line art.
custom.Wallet=`<g stroke="none">
${P('M5 8L13.5 3.6Q15 3 15.4 4.5L16 8Z','url(#blue)')}
${P('M5 7.5L12 3.1Q13.3 2.5 14 4L15.1 7.5Z','url(#ice)')}
${P('M5 7H18Q20.8 7 20.8 9.7V18.5Q20.8 21 18.3 21H6Q3.6 21 3.6 18.4V9.3Q3.6 7 5 7Z','url(#blue)')}
${P('M5 6.3H16.2Q17.4 6.3 18.3 7.2L19.5 8.5V17.8Q19.5 20.2 17 20.2H5.5Q3 20.2 3 17.7V8.5Q3 6.3 5 6.3Z','url(#matte)')}
${P('M5 6.3H16Q17.4 6.3 18.3 7.2L19.5 8.5H16.6L16 8H6.2L11.2 13.9Q11.8 14.6 12.6 14L15.2 11.7 14.4 14Q12.6 17 10.6 15L4.5 8Q3.5 7 3.6 7Z','url(#ice)')}
${P('M19.5 11H16Q14.2 11 14.2 12.8V14.3Q14.2 16 16 16H20Q21 16 21 14.8V12Q21 11 19.5 11Z','url(#blue)')}
<circle cx="17.5" cy="13.5" r="1.05" fill="url(#button)"/>
${P('M4.1 10V17.5Q4.1 19.2 5.7 19.2','none','stroke="#b7c6d8" stroke-opacity=".22" stroke-width=".22"')}
</g>`;
custom.ShoppingCart=`<g stroke-linecap="round" stroke-linejoin="round">
${P('M15.4 6.5L16.1 3.5Q16.4 2.5 17.4 2.5H18.7','none','stroke="url(#matte)" stroke-width="1.75"')}
${P('M17.3 2.4H19.1','none','stroke="url(#blue)" stroke-width="2.4"')}
${P('M3.5 7.7H19.5Q21 7.7 20.8 9L19 16Q18.7 17.3 17.3 17.6L11 18.7Q9.4 19 8.5 17.7Z','url(#blue)')}
${P('M3 6.5H18.5Q20.2 6.5 19.8 8.4L18.3 14.9Q18 16 16.6 16.2L10.7 17.5Q9.6 17.8 8.8 16.8L2.5 8.4Q1.7 7.2 3 6.5Z','url(#matte)')}
${P('M3 6.5H18.4Q20.3 6.5 19.8 8.3L19.5 9.6Q19.4 8.2 18.1 8.2H5.6L10.7 14.9Q11.3 15.6 12.2 15.3L17 14.1Q18 13.8 18.5 13L18.2 15.1Q18 16 16.6 16.2L10.7 17.5Q9.6 17.8 8.8 16.8L2.5 8.4Q1.7 7.2 3 6.5Z','url(#ice)')}
${[10.5,13.1,15.7].map(x=>P(`M${x} 10L${x-.5} 12.5`,'none','stroke="url(#ice)" stroke-width="1.05"')).join('')}
<circle cx="9" cy="20.3" r="2" fill="url(#matte)" stroke="none"/><circle cx="16.7" cy="20.3" r="2" fill="url(#matte)" stroke="none"/><circle cx="9" cy="20.3" r=".95" fill="url(#button)" stroke="none"/><circle cx="16.7" cy="20.3" r=".95" fill="url(#button)" stroke="none"/>
</g>`;
custom.Headphones=`<g stroke-linecap="round" stroke-linejoin="round">
${P('M3.5 13V10A8.5 8.5 0 0 1 20.5 10v3','none','stroke="url(#matte)" stroke-width="2.4"')}
${P('M5.1 5.5a8.5 8.5 0 0 1 13.8 0','none','stroke="url(#ice)" stroke-width="2.5"')}
${P('M8 8H16.8Q19 8 19 10.3V16Q19 18.3 16.7 18.3H11L6 21l.6-3.3Q5.5 17 5.5 15.5V10.3Q5.5 8 8 8Z','url(#blue)')}
${P('M7.1 7.3H15.4Q16.7 7.3 17.5 8.1L18.1 8.7V14.8Q18.1 17 15.8 17H10.4L5.4 20.2 6 16.9Q4.6 16.4 4.6 15V9.6Q4.6 7.3 7.1 7.3Z','url(#matte)')}
${P('M7.1 7.3H15.4Q16.7 7.3 17.5 8.1L18.1 8.7V10.2Q17.1 8.8 15.6 8.8H7.6Q6.3 8.8 6.3 10.3V16.7L5.4 20.2 6 16.9Q4.6 16.4 4.6 15V9.6Q4.6 7.3 7.1 7.3Z','url(#ice)')}
${P('M6.1 18.4Q9.2 14.8 13.6 14.7 16.6 14.5 18.1 12.9V14.8Q18.1 17 15.8 17H10.4L5.4 20.2Z','url(#blue)')}
<rect x="1.5" y="10.1" width="3.1" height="6.2" rx="1.5" fill="url(#blue)" stroke="none"/><rect x="19.3" y="10.1" width="3.1" height="6.2" rx="1.5" fill="url(#blue)" stroke="none"/>
${P('M20.4 16Q20.4 21 15 21','none','stroke="url(#matte)" stroke-width="1.1"')}
<rect x="12.3" y="19.8" width="3.6" height="2.2" rx="1.1" fill="url(#ice)" stroke="none"/>
</g>`;
function dimensionalBody(name,slug){
 if(custom[name])return defs+custom[name];
 const original=fs.readFileSync(path.join(root,'svg',slug+'.svg'),'utf8').replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
 const elements=original.match(/<(?:path|circle|rect|ellipse|line|polyline|polygon)\b[^>]*\/>/g);
 if(!elements?.length)throw Error('No geometry: '+name);
 const geometry=elements.join('').replace(/\s(?:stroke|fill|opacity|fill-opacity|stroke-width)="[^"]*"/g,'');
 let front=elements.map((el,i)=>{
  const isSurface=i===0&&(/Z[^"]*"/i.test(el)||/^<(?:rect|circle)/.test(el));
  return el.replace(/\s(?:stroke|fill|opacity|fill-opacity|stroke-width)="[^"]*"/g,'').replace('/>',` fill="${isSurface?'url(#matte)':'none'}"/>`);
 }).join('');
 return defs+`<g transform="translate(1.4 .9) scale(.86)" stroke-linecap="round" stroke-linejoin="round">
<g transform="translate(.8 1)" stroke="#071b3c" stroke-width="2.2" fill="none">${geometry}</g>
<g transform="translate(.55 .7)" stroke="url(#blue)" stroke-width="2.1" fill="none">${geometry}</g>
<g transform="translate(.3 .4)" stroke="url(#blue)" stroke-width="2" fill="none">${geometry}</g>
<g stroke="url(#ice)" stroke-width="1.75">${front}</g>
<g transform="translate(-.13 -.16)" stroke="#d4faff" stroke-opacity=".38" stroke-width=".22" fill="none">${geometry}</g>
</g>`;
}
function jsx(body){return body.replace(/([a-z]+)-([a-z]+)=/g,(_,a,b)=>a+b[0].toUpperCase()+b.slice(1)+'=').replace(/id="([^"]+)"/g,(_,key)=>`id={id+'-${key}'}`).replace(/"url\(#([^\)]+)\)"/g,(_,key)=>`{'url(#'+id+'-${key})'}`);}
const exports=[];
for(const [name,slug] of Object.entries(manifest.icons)){
 const assetPath=path.join(svgDir,slug+'.svg');
 const body=fs.existsSync(assetPath)?fs.readFileSync(assetPath,'utf8').replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,''):dimensionalBody(name,slug);
 fs.writeFileSync(path.join(svgDir,slug+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${body}</svg>\n`);
 fs.writeFileSync(path.join(root,'src/dimensional',name+'.tsx'),`// Generated dimensional asset. Source: dimensional/svg/${slug}.svg\nimport { forwardRef, useId } from 'react';\nimport { IconBase, type IconProps } from '../IconBase.js';\nexport const ${name} = /* @__PURE__ */ forwardRef<SVGSVGElement, IconProps>(function ${name}(props, ref) { const id=useId(); return <IconBase {...props} ref={ref}><g stroke="none">${jsx(body)}</g></IconBase>; });\n`);
 exports.push(`export { ${name} } from './dimensional/${name}.js';`);
}
for(const [alias,target] of Object.entries(manifest.aliases)){
 fs.writeFileSync(path.join(root,'src/dimensional',alias+'.tsx'),`export { ${target} as ${alias} } from './${target}.js';\n`);
 exports.push(`export { ${alias} } from './dimensional/${alias}.js';`);
}
fs.copyFileSync(path.join(root,'src/index.ts'),path.join(root,'src/line.ts'));
fs.writeFileSync(path.join(root,'src/index.ts'),exports.join('\n')+"\nexport type { IconProps } from './IconBase.js';\n");
fs.writeFileSync(path.join(root,'dimensional/materials.json'),JSON.stringify({version:'0.2.0',direction:'V-SERV Soft Depth',lighting:'top left',materials:{body:['#414b5b','#262f3c','#151c28'],rim:['#c0f6ff','#69e6ff','#22baff','#1679df'],side:['#157cff','#0755da','#03328b']},coreCustom:Object.keys(custom),canonicalCount:Object.keys(manifest.icons).length,exportCount:exports.length,notes:'Three solid-surface core designs; remaining glyphs use layered vector extrusion. These are SVG dimensional illustrations, not 3D mesh files or raster renders.'},null,2)+'\n');
console.log(`Built ${exports.length} dimensional exports, ${Object.keys(manifest.icons).length} SVG sources; 3 custom solid-surface cores.`);
