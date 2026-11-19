import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'tests/results');fs.mkdirSync(out,{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});const context=await browser.newContext({viewport:{width:1280,height:900},deviceScaleFactor:1});const page=await context.newPage();
 await page.route('https://vserv.test/**',async route=>{
  const pathname=new URL(route.request().url()).pathname;
  const file=pathname==='/'?path.join(root,'preview/index.html'):path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep))return route.abort();
  const ext=path.extname(file);const type=({'.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'})[ext]||'application/octet-stream';
  try{await route.fulfill({contentType:type,body:fs.readFileSync(file)});}catch{await route.fulfill({status:404,body:'Not found'});}
 });
 await page.goto('https://vserv.test/');
 // Load every gallery image before capturing a full-page baseline.
 await page.locator('img').evaluateAll(async images => {
  for (const image of images) image.loading = 'eager';
  await Promise.all(images.map(image => image.decode()));
 });
 await page.evaluate(() => document.fonts.ready);
 const reports=[];
 for(const theme of ['dark','light'])for(const dir of ['rtl','ltr']){
  await page.evaluate(({theme,dir})=>{document.body.classList.toggle('light',theme==='light');document.documentElement.dir=dir;document.querySelector('#theme').setAttribute('aria-pressed',String(theme==='light'))},{theme,dir});
  const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  reports.push({theme,dir,violations:a11y.violations});
  const screenshot=await page.screenshot({path:path.join(out,`${theme}-${dir}.png`),fullPage:true});
  const baseline=path.join(root,'tests/baselines',`${theme}-${dir}.png`);
  if(process.env.UPDATE_VISUAL==='1') { fs.mkdirSync(path.dirname(baseline),{recursive:true});fs.writeFileSync(baseline,screenshot); }
  else { assert.ok(fs.existsSync(baseline),'Review gallery, then run UPDATE_VISUAL=1 npm run test:visual to establish baselines.');assert.ok(screenshot.equals(fs.readFileSync(baseline)),`Visual mismatch: ${theme}/${dir}`); }
 }
 await page.getByRole('searchbox').fill('wallet');assert.equal(await page.locator('article:visible').count(),1);
 await page.getByRole('searchbox').fill('');await page.locator('#theme').focus();assert.equal(await page.locator('#theme').evaluate(el=>el===document.activeElement),true);
 fs.writeFileSync(path.join(out,'accessibility.json'),JSON.stringify(reports,null,2));
 assert.equal(reports.flatMap(r=>r.violations).length,0,'Axe violations; inspect tests/results/accessibility.json');
 console.log('Gallery: 4 theme/direction screenshots; 0 axe violations; search and keyboard focus passed.');
}finally{await browser?.close();}
