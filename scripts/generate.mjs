import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'icons.json'),'utf8'));
const out=path.join(root,'src');
fs.mkdirSync(path.join(out,'icons'),{recursive:true});
const exports=[];
for(const [name,slug] of Object.entries(manifest.icons)) {
 const svg=fs.readFileSync(path.join(root,'svg',slug+'.svg'),'utf8');
 const body=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replace(/stroke-width=/g,'strokeWidth=').replace(/stroke-linecap=/g,'strokeLinecap=').replace(/stroke-linejoin=/g,'strokeLinejoin=');
 fs.writeFileSync(path.join(out,'icons',name+'.tsx'),`// Generated from svg/${slug}.svg. Edit SVG, then npm run generate.\nimport { forwardRef } from 'react';\nimport { IconBase, type IconProps } from '../IconBase.js';\nexport const ${name} = /* @__PURE__ */ forwardRef<SVGSVGElement, IconProps>(function ${name}(props, ref) { return <IconBase {...props} ref={ref}>${body}</IconBase>; });\n`);
 exports.push(`export { ${name} } from './icons/${name}.js';`);
}
for(const [alias,target] of Object.entries(manifest.aliases)) {
 if(!manifest.icons[target])throw Error('Unknown alias target '+target);
 fs.writeFileSync(path.join(out,'icons',alias+'.tsx'),`export { ${target} as ${alias} } from './${target}.js';\n`);
 exports.push(`export { ${alias} } from './icons/${alias}.js';`);
}
fs.writeFileSync(path.join(out,'index.ts'),exports.join('\n')+"\nexport type { IconProps } from './IconBase.js';\n");
const names=[...Object.keys(manifest.icons),...Object.keys(manifest.aliases)].sort();
fs.writeFileSync(path.join(out,'registry.ts'),`// Opt-in registry: imports all icons. Avoid in static consumers.\nimport * as icons from './index.js';\nexport type IconName = ${names.map(n=>JSON.stringify(n)).join(' | ')};\nexport const iconRegistry = icons;\nexport function resolveIcon(name: string | null | undefined) { return name && Object.hasOwn(icons, name) ? icons[name as IconName] : icons.Sparkles; }\n`.replace('Object.hasOwn(icons, name)','Object.prototype.hasOwnProperty.call(icons, name)'));
const cells=Object.entries(manifest.icons).map(([name,slug])=>{const body=fs.readFileSync(path.join(root,'svg',slug+'.svg'),'utf8');return `<article data-name="${name.toLowerCase()}"><div class="sizes">${[16,20,24,32].map(s=>body.replace('<svg ',`<svg width="${s}" height="${s}" aria-hidden="true" `)).join('')}</div><code>${name}</code></article>`;}).join('\n');
fs.writeFileSync(path.join(root,'preview/index.html'),`<!doctype html><html lang="fa" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>V-SERV Signature Cut</title><style>*{box-sizing:border-box}body{margin:0;background:#101413;color:#bceaff;font:16px system-ui;padding:32px}body.light{background:#f4f8fa;color:#193641}header{max-width:1000px;margin:0 auto 32px}h1{font-size:36px;margin:12px 0}p{color:inherit;opacity:.75}button,input{font:inherit;padding:12px 16px;border:1px solid currentColor;border-radius:12px;color:inherit;background:transparent}button{cursor:pointer}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:12px}article{border:1px solid #66889955;border-radius:18px 6px 18px 18px;padding:22px 15px;min-width:0}.sizes{display:flex;direction:ltr;align-items:center;justify-content:space-around;height:48px}code{display:block;text-align:center;font-size:12px;margin-top:12px}article[hidden]{display:none}:focus-visible{outline:3px solid #42a5f5;outline-offset:4px}</style><header><span dir="ltr">V-SERV / SIGNATURE CUT / 0.1.0</span><h1>یک زبان، برای تمام مسیرها.</h1><p>گرید ۲۴ · استروک ۱٫۷۵ · اندازه‌های ۱۶، ۲۰، ۲۴، ۳۲</p><input type="search" aria-label="جستجوی آیکون" placeholder="Search icons" dir="ltr"><button type="button" aria-pressed="false">تغییر تم</button></header><main>${cells}</main><script>document.querySelector('button').onclick=e=>{document.body.classList.toggle('light');e.currentTarget.setAttribute('aria-pressed',String(document.body.classList.contains('light')))};document.querySelector('input').oninput=e=>{document.querySelectorAll('article').forEach(a=>a.hidden=!a.dataset.name.includes(e.target.value.toLowerCase()))}</script></html>`);
console.log(`Generated ${names.length} exports, ${Object.keys(manifest.icons).length} SVGs and gallery.`);
