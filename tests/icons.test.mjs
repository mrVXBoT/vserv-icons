import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import * as icons from '../dist/line.js';
const resolveIcon = name => name && Object.prototype.hasOwnProperty.call(icons,name) ? icons[name] : icons.Sparkles;
const manifest=JSON.parse(fs.readFileSync(new URL('../icons.json',import.meta.url)));
const render=(name,props={})=>new JSDOM(renderToStaticMarkup(React.createElement(icons[name],props))).window.document.querySelector('svg');
test('every documented name is covered and every source SVG yields a component',()=>{
 const inventory=JSON.parse(fs.readFileSync(new URL('../docs/inventory.json',import.meta.url)));
 for(const item of inventory.matrix)assert.ok(icons[item.lucide],item.lucide);
 for(const [name,slug] of Object.entries(manifest.icons)){
  const svg=fs.readFileSync(new URL(`../svg/${slug}.svg`,import.meta.url),'utf8');
  assert.match(svg,/viewBox="0 0 24 24"/);assert.match(svg,/stroke-width="1.75"/);assert.match(svg,/stroke="currentColor"/);
  assert.doesNotMatch(svg,/<(?:script|image|foreignObject)|\bon\w+=|#[0-9a-f]{3,8}/i);
  const node=render(name);assert.equal(node.getAttribute('stroke-width'),'1.75');assert.equal(node.getAttribute('aria-hidden'),'true');
 }
});
test('accessible naming, decorative defaults and unique title IDs',()=>{
 for(const name of Object.keys(manifest.icons)){
  const node=render(name,{title:'خرید'});assert.equal(node.getAttribute('role'),'img');assert.equal(node.getAttribute('aria-hidden'),null);assert.equal(node.querySelector('title').textContent,'خرید');assert.equal(node.getAttribute('aria-labelledby'),node.querySelector('title').id);
 }
 const labelled=render('Wallet',{'aria-label':'کیف پول',size:32,style:{color:'red'}});assert.equal(labelled.getAttribute('aria-label'),'کیف پول');assert.equal(labelled.getAttribute('width'),'32');assert.equal(labelled.getAttribute('stroke'),'currentColor');
 const html=renderToStaticMarkup(React.createElement('div',null,React.createElement(icons.Search,{title:'یک'}),React.createElement(icons.Search,{title:'دو'})));
 const ids=[...new JSDOM(html).window.document.querySelectorAll('title')].map(n=>n.id);assert.equal(new Set(ids).size,2);
});
test('legacy aliases and dynamic fallback are safe',()=>{
 for(const [alias,target] of Object.entries(manifest.aliases))assert.equal(icons[alias],icons[target]);
 for(const value of [undefined,null,'','unknown','__proto__','constructor'])assert.equal(resolveIcon(value),icons.Sparkles);
 assert.equal(resolveIcon('Wallet'),icons.Wallet);
});
test('single-icon import excludes the rest of the library',async()=>{
 const result=await build({stdin:{contents:"import { ShoppingCart } from './dist/line.js'; console.log(ShoppingCart);",resolveDir:new URL('..',import.meta.url).pathname},bundle:true,write:false,minify:true,format:'esm',external:['react','react/jsx-runtime'],metafile:true});
 const included=Object.keys(result.metafile.outputs).flatMap(k=>Object.entries(result.metafile.outputs[k].inputs).filter(([,v])=>v.bytesInOutput>0).map(([p])=>p));
 assert.ok(included.some(p=>p.endsWith('/ShoppingCart.js')));assert.ok(!included.some(p=>p.endsWith('/Wallet.js')));assert.ok(!included.some(p=>p.endsWith('/registry.js')));
 console.log('Single-icon bundle bytes:',result.outputFiles[0].contents.length);
});
test('React mount forwards refs, updates props and preserves decorative button semantics',async()=>{
 const { createRoot }=await import('react-dom/client');
 const { act }=await import('react');
 const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'https://vserv.test/'});
 const oldWindow=globalThis.window,oldDocument=globalThis.document,oldAct=globalThis.IS_REACT_ACT_ENVIRONMENT;
 globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const ref=React.createRef();const root=createRoot(dom.window.document.querySelector('#root'));
 try{
  await act(()=>root.render(React.createElement('button',{'aria-label':'خرید'},React.createElement(icons.ShoppingCart,{ref,size:20}))));
  assert.equal(ref.current.tagName.toLowerCase(),'svg');assert.equal(ref.current.getAttribute('aria-hidden'),'true');assert.equal(ref.current.getAttribute('width'),'20');
  await act(()=>root.render(React.createElement(icons.Wallet,{ref,title:'موجودی',size:32})));
  assert.equal(ref.current.getAttribute('width'),'32');assert.equal(ref.current.getAttribute('aria-hidden'),null);assert.equal(ref.current.getAttribute('role'),'img');
 }finally{await act(()=>root.unmount());globalThis.window=oldWindow;globalThis.document=oldDocument;globalThis.IS_REACT_ACT_ENVIRONMENT=oldAct;dom.window.close();}
});
