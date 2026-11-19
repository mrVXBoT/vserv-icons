import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import fs from 'node:fs';
import {build} from 'esbuild';
import * as depth from '../dist/depth.js';
test('three depth prototypes preserve grid, currentColor and accessible names',()=>{
 for(const name of ['WalletDepth','ShoppingCartDepth','HeadphonesDepth']){
  const raw=fs.readFileSync(new URL(`../pilot-depth/svg/${name}.svg`,import.meta.url),'utf8');
  assert.match(raw,/stroke-width="1.75"/);assert.match(raw,/fill-opacity=".28"/);assert.doesNotMatch(raw,/filter=|<image|<script|#[0-9a-f]{3,8}/i);
  const markup=renderToStaticMarkup(React.createElement(depth[name],{title:'آیکون',size:24}));const doc=new JSDOM(markup).window.document;const svg=doc.querySelector('svg');assert.equal(svg.getAttribute('role'),'img');assert.equal(svg.getAttribute('stroke'),'currentColor');assert.equal(svg.getAttribute('viewBox'),'0 0 24 24');assert.equal(svg.getAttribute('aria-labelledby'),doc.querySelector('title').id);
 }
});
test('depth entry tree-shakes unused prototypes',async()=>{
 const result=await build({stdin:{contents:"import {WalletDepth} from './dist/depth.js'; console.log(WalletDepth)",resolveDir:new URL('..',import.meta.url).pathname},bundle:true,minify:true,write:false,external:['react','react/jsx-runtime'],metafile:true});
 const active=Object.values(result.metafile.outputs).flatMap(o=>Object.entries(o.inputs).filter(([,v])=>v.bytesInOutput>0).map(([p])=>p));assert.ok(active.some(p=>p.endsWith('WalletDepth.js')));assert.ok(!active.some(p=>p.endsWith('HeadphonesDepth.js')));
});
