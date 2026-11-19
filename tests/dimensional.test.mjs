import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import * as icons from '../dist/index.js';
import {resolveIcon} from '../dist/registry.js';
import {WalletRender,ShoppingCartRender,HeadphonesRender} from '../dist/renders.js';
const root=new URL('..',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('icons.json',root)));
test('all dimensional sources are safe, rendered, and covered by exports',()=>{
 for(const [name,slug] of Object.entries(manifest.icons)){
  const svg=fs.readFileSync(new URL(`dimensional/svg/${slug}.svg`,root),'utf8');
  assert.match(svg,/viewBox="0 0 24 24"/);assert.match(svg,/<linearGradient/);assert.doesNotMatch(svg,/<script|<image|<foreignObject|\son\w+=/i);
  const doc=new JSDOM(svg,{contentType:'image/svg+xml'}).window.document;
  const ids=[...doc.querySelectorAll('[id]')].map(n=>n.id);assert.equal(ids.length,new Set(ids).size);
  for(const ref of svg.matchAll(/url\(#([^\)]+)\)/g))assert.ok(ids.includes(ref[1]),`${name} missing paint ${ref[1]}`);
  assert.ok(icons[name],name);
  for(const size of [64,256,512])assert.ok(fs.statSync(new URL(`dimensional/png/${size}/${slug}.png`,root)).size>0);
 }
 const report=JSON.parse(fs.readFileSync(new URL('dimensional/raster-validation.json',root)));assert.equal(report.checked,157);assert.equal(report.nonemptyAndUnclipped,true);
});
test('paint servers and title IDs stay unique across repeated SSR components',()=>{
 const tree=React.createElement('div',null,...Object.keys(manifest.icons).slice(0,20).flatMap(name=>[React.createElement(icons[name],{key:name+'a',title:name}),React.createElement(icons[name],{key:name+'b',title:name})]));
 const html=renderToStaticMarkup(tree);const doc=new JSDOM(html).window.document;
 const ids=[...doc.querySelectorAll('[id]')].map(n=>n.id);assert.equal(ids.length,new Set(ids).size);
 for(const paint of html.matchAll(/url\(#([^\)]+)\)/g))assert.ok(ids.includes(paint[1]));
 for(const svg of doc.querySelectorAll('svg')){assert.equal(svg.getAttribute('role'),'img');assert.ok(doc.getElementById(svg.getAttribute('aria-labelledby')));}
 const decorative=new JSDOM(renderToStaticMarkup(React.createElement(icons.Wallet))).window.document.querySelector('svg');assert.equal(decorative.getAttribute('aria-hidden'),'true');
});
test('dimensional aliases, optional registry and image render accessibility',()=>{
 for(const [alias,target] of Object.entries(manifest.aliases))assert.equal(icons[alias],icons[target]);
 for(const value of [undefined,null,'unknown','__proto__','constructor'])assert.equal(resolveIcon(value),icons.Sparkles);
 assert.equal(resolveIcon('Wallet'),icons.Wallet);
 for(const C of [WalletRender,ShoppingCartRender,HeadphonesRender]){
  const img=new JSDOM(renderToStaticMarkup(React.createElement(C,{alt:'کیف پول',size:96}))).window.document.querySelector('img');assert.equal(img.alt,'کیف پول');assert.equal(img.getAttribute('width'),'96');assert.match(img.src,/\.png$/);
 }
});
test('dimensional named import excludes other icon geometry',async()=>{
 const result=await build({stdin:{contents:"import { Wallet } from './dist/index.js'; console.log(Wallet);",resolveDir:root.pathname},bundle:true,minify:true,write:false,format:'esm',external:['react','react/jsx-runtime'],metafile:true});
 const active=Object.values(result.metafile.outputs).flatMap(o=>Object.entries(o.inputs).filter(([,v])=>v.bytesInOutput>0).map(([p])=>p));
 assert.ok(active.some(p=>p.endsWith('/Wallet.js')));assert.ok(!active.some(p=>p.endsWith('/ShoppingCart.js')));assert.ok(!active.some(p=>p.endsWith('/registry.js')));
 console.log('Dimensional Wallet minified bytes, React external:',result.outputFiles[0].contents.length);
});
test('gallery executes search, category filters, theme and copy fallback',async()=>{
 const html=fs.readFileSync(new URL('preview/index.html',root),'utf8');
 const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://vserv.test/'});const doc=dom.window.document;
 for(const script of doc.querySelectorAll('script')){new vm.Script(script.textContent);dom.window.eval(script.textContent);}
 assert.equal(doc.querySelectorAll('article').length,157);
 const input=doc.querySelector('input');input.value='Wallet';input.dispatchEvent(new dom.window.Event('input'));assert.equal(doc.querySelectorAll('article:not([hidden])').length,1);
 input.value='';input.dispatchEvent(new dom.window.Event('input'));const select=doc.querySelector('select');select.value='support';select.dispatchEvent(new dom.window.Event('change'));assert.ok(doc.querySelectorAll('article:not([hidden])').length>1);
 doc.querySelector('#theme').click();assert.equal(doc.querySelector('#theme').getAttribute('aria-pressed'),'true');
 doc.querySelector('[data-copy="Wallet"]').click();await new Promise(r=>setTimeout(r,0));assert.match(doc.querySelector('#code').textContent,/import \{ Wallet \}/);dom.window.close();
});
