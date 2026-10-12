import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createWorkspace} from '../../src/content/development-workspace.js';
import {applyOperation,bulkOperation,operationsReport,queryRecords,operationsCsv,nextOrderStates} from '../../src/app/operations-model.js';
import {operationsSnapshot,parseOperationsSnapshot,hydrateOperationsState,operationsStorageKey} from '../../src/app/operations-store.js';
const now='2026-10-11T12:00:00.000Z';
test('stock movements are reasoned, whole nonnegative quantities and atomic on invalid inputs',()=>{
 const s=createWorkspace(),p=s.products[0],before=structuredClone(s);
 for(const stock of [-1,1.5,'bad',Infinity])assert.throws(()=>applyOperation(s,'stock',{stock,reason:'Recount'},{id:p.id,now}));
 assert.throws(()=>applyOperation(s,'stock',{stock:40,reason:''},{id:p.id,now}));assert.deepEqual(s,before);
 applyOperation(s,'stock',{stock:40,reason:'Recount'},{id:p.id,now});assert.equal(p.stock,40);assert.equal(s.inventoryLog[0].from,36);assert.equal(s.inventoryLog[0].to,40);assert.equal(s.activity[0].at,now);
});
test('fulfilment moves one stage, retains purchased snapshots and records cancellation reasons',()=>{
 const s=createWorkspace(),o=s.orders[0],items=structuredClone(o.items);assert.deepEqual(nextOrderStates(o),['Preparing','Ready','Cancelled']);
 assert.throws(()=>applyOperation(s,'order',{status:'Delivered'},{id:o.id,now}));
 applyOperation(s,'order',{status:'Ready',note:'Packs reviewed'},{id:o.id,now});assert.equal(o.status,'Ready');assert.deepEqual(o.items,items);
 assert.throws(()=>applyOperation(s,'order',{status:'Cancelled',note:''},{id:o.id,now}));
 applyOperation(s,'order',{status:'Cancelled',note:'Sample customer request'},{id:o.id,now});assert.equal(o.history.length,2);assert.deepEqual(nextOrderStates(o),['Cancelled']);assert.deepEqual(o.items,items);
});
test('bulk fulfilment validates the whole selection before changing anything',()=>{
 const s=createWorkspace(),before=structuredClone(s);assert.throws(()=>bulkOperation(s,'order',[s.orders[0].id,s.orders[1].id],'Ready'));assert.deepEqual(s,before);
 bulkOperation(s,'order',[s.orders[0].id],'Ready');assert.equal(s.orders[0].status,'Ready');
});
test('product edits require stock reasons and cannot mutate order prices or amounts',()=>{
 const s=createWorkspace(),p=s.products[0],order=structuredClone(s.orders[0]);
 const data={...p,name:'Updated harvest',price:175.25,stock:40};assert.throws(()=>applyOperation(s,'product',data,{id:p.id,now}));assert.equal(p.price,140);
 applyOperation(s,'product',{...data,reason:'Fresh harvest recount'},{id:p.id,now});assert.equal(p.price,175.25);assert.equal(p.stock,40);assert.deepEqual(s.orders[0],order);
 assert.throws(()=>applyOperation(s,'product',{...p,imageKey:'not-approved'},{id:p.id,now}));
 assert.throws(()=>applyOperation(s,'product',{...p,imageKey:'',status:'Published'},{id:p.id,now}));
 applyOperation(s,'product',{...p,imageKey:'',status:'Draft'},{id:p.id,now});assert.equal(p.image,'');
 assert.equal(parseOperationsSnapshot(JSON.stringify(operationsSnapshot(s))).products[0].image,undefined);
});
test('promotion codes and date windows and delivery PINs remain valid and unique',()=>{
 const s=createWorkspace();assert.throws(()=>applyOperation(s,'promotion',{name:'Invalid',code:'SAMPLE10',discount:10,minimum:0,status:'Draft'}));
 assert.throws(()=>applyOperation(s,'promotion',{name:'Invalid',code:'OTHER',discount:101,minimum:0,status:'Draft'}));
 assert.throws(()=>applyOperation(s,'promotion',{name:'Invalid',code:'OTHER',discount:10,minimum:0,starts:'2026-10-15',ends:'2026-10-11',status:'Draft'}));
 assert.throws(()=>applyOperation(s,'zone',{name:'Invalid',pins:'12',fee:0,minimum:0,status:'Draft'}));
 assert.throws(()=>applyOperation(s,'zone',{name:'Duplicate',pins:'000000',fee:0,minimum:0,status:'Draft'}));
 const result=applyOperation(s,'zone',{name:'New zone',pins:'111111, 111111, 222222',fee:30,minimum:200,cutoff:'16:00',status:'Draft'});assert.equal(result.record.pins,'111111, 222222');
});
test('settings cannot open ordering and define a whole stock alert threshold',()=>{
 const s=createWorkspace();assert.throws(()=>applyOperation(s,'settings',{...s.settings,ordering:'Open'}));assert.throws(()=>applyOperation(s,'settings',{...s.settings,lowStockThreshold:1.5}));
 applyOperation(s,'settings',{...s.settings,lowStockThreshold:20});assert.equal(s.settings.lowStockThreshold,20);assert.equal(s.settings.ordering,'Closed');
});
test('reports derive date series, sample value and quantities from the same selected ledger',()=>{
 const s=createWorkspace(),all=operationsReport(s),week=operationsReport(s,{period:'7'}),cancelled=operationsReport(s,{status:'Cancelled'});
 assert.equal(all.orders.length,7);assert.equal(week.orders.length,4);assert.equal(all.value,1760);assert.equal(week.value,1290);assert.equal(cancelled.value,0);assert.equal(cancelled.average,0);assert.equal(cancelled.items.length,0);
 assert.equal(all.daily.reduce((n,d)=>n+d.count,0),all.orders.length);assert.equal(all.items.reduce((n,i)=>n+i.value,0),all.value);
});
test('record queries combine status, name, category and sort with safe pagination',()=>{
 const s=createWorkspace(),found=queryRecords(s.products,{query:'mushroom',status:'Draft',category:'mushrooms',sort:'value-desc',page:900,pageSize:2});assert.equal(found.page,found.pages);assert.equal(found.count,6);
 const stock=queryRecords(s.products,{sort:'value-asc',valueField:'stock'});assert.equal(stock.all[0].stock,6);
 assert.equal(queryRecords(s.orders,{query:'missing'}).count,0);assert.equal(queryRecords(s.orders,{query:'missing'}).page,1);assert.equal(queryRecords(s.orders,{page:1.5}).page,1);
});
test('CSV exports exactly the selected records and neutralizes spreadsheet formulas',()=>{
 const s=createWorkspace(),selection=operationsReport(s,{status:'Ready'}).orders;const csv=operationsCsv(selection);assert.match(csv,/SAMPLE-1048/);assert.doesNotMatch(csv,/SAMPLE-1050/);
 selection[0].customer='  =HYPERLINK("bad")';assert.match(operationsCsv(selection),/"'  =HYPERLINK/);
});
test('versioned storage restores operations only and recovers from malformed or invalid snapshots',()=>{
 const s=createWorkspace();s.basket.push({id:s.products[0].id,quantity:1});applyOperation(s,'stock',{stock:40,reason:'Recount'},{id:s.products[0].id,now});
 const raw=JSON.stringify(operationsSnapshot(s)),parsed=parseOperationsSnapshot(raw);assert(!('basket' in parsed));assert(!('lastOrder' in parsed));
 const target=createWorkspace();assert.equal(hydrateOperationsState({getItem:key=>key===operationsStorageKey?raw:null},target).ok,true);assert.equal(target.products[0].stock,40);assert.deepEqual(target.basket,[]);
 for(const raw of ['{broken',JSON.stringify({...parsed,version:99}),JSON.stringify({...parsed,products:[{...parsed.products[0],stock:-1}]})])assert.equal(hydrateOperationsState({getItem:()=>raw},createWorkspace()).ok,false);
 assert.equal(hydrateOperationsState({getItem:()=>{throw Error('Unavailable');}},createWorkspace()).ok,false);
});

test('published operations renders fictional editors without authorising staff data or checkout', async()=>{
 const {renderPage}=await import('../../src/app/render-page.js');
 const {accessDecision}=await import('../../src/app/session.js');
 for(const path of ['/admin','/admin/orders','/admin/orders/SAMPLE-1050','/admin/products/new','/admin/inventory','/admin/settings']){
  const result=renderPage(path,{operationsReview:true});assert.equal(result.status,200);assert.match(result.html,/data-workspace-kind="operations"/);assert.doesNotMatch(result.html,/Go to sign in/);
 }
 assert.equal(renderPage('/admin/orders/unknown',{operationsReview:true}).status,404);
 assert.equal(renderPage('/checkout',{operationsReview:true}).status,403);
 assert.equal(renderPage('/account',{operationsReview:true,accountReview:false}).status,403);
 assert.equal(accessDecision({access:'staff'}).allowed,false);
});
