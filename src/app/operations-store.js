import { operationsPreviewEnabled } from './operations-review-config.js';
import { createWorkspace, developmentWorkspace as state } from '../content/development-workspace.js';
import { sampleAccount } from '../content/sample-account.js';
import { products as approvedProducts } from '../content/foundation.js';
import { operationStates,orderDate } from './operations-model.js';

export const operationsStorageKey='wegroween.operations.preview.v1';
const fields={products:['id','name','description','category','pack','price','stock','status','imageKey','image','imageAlt','imageSrcSet'],categories:['id','name','description','status','position'],customers:['id','name','email','phone','status','notes'],enquiries:['id','name','contact','email','produce','frequency','status','followUp','notes'],promotions:['id','name','code','discount','minimum','starts','ends','status'],zones:['id','name','pins','fee','minimum','cutoff','status']};
const pick=(record,keys)=>Object.fromEntries(keys.filter(key=>key in record).map(key=>[key,record[key]]));
const finite=(n,max=1000000)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=max;
const string=(v,max=1200)=>typeof v==='string'&&v.length<=max;
export function operationsSnapshot(source) {
  const snapshot={version:1,settings:pick(source.settings,['name','email','phone','ordering','lowStockThreshold','digest']),orders:structuredClone(source.orders),inventoryLog:structuredClone(source.inventoryLog),activity:structuredClone(source.activity||[])};
  for(const [key,keys]of Object.entries(fields))snapshot[key]=source[key].map(r=>pick(r,keys));return snapshot;
}
export function parseOperationsSnapshot(raw) {
  const data=JSON.parse(raw);if(data.version!==1)throw Error('Unsupported preview version.');
  for(const [key,keys]of Object.entries(fields)) {
    if(!Array.isArray(data[key])||data[key].length>2000)throw Error('Invalid records.');const ids=new Set();
    for(const r of data[key]) {
      if(!string(r.id,100)||!/^[-a-zA-Z0-9]+$/.test(r.id)||ids.has(r.id)||!string(r.name,160)||!r.name.trim()||!operationStates[key].includes(r.status))throw Error('Invalid record.');ids.add(r.id);
      for(const field of keys)if(r[field]!==undefined&&!['price','stock','discount','fee','minimum','position'].includes(field)&&!string(r[field],field==='imageSrcSet'?2000:1200))throw Error('Invalid field.');
    }
    data[key]=data[key].map(r=>pick(r,keys));
  }
  for(const p of data.products){
    if(!finite(p.price)||!finite(p.stock)||!Number.isInteger(p.stock)||!data.categories.some(c=>c.id===p.category)||!string(p.pack,160)||!p.pack)throw Error('Invalid product.');
    const image=approvedProducts.find(a=>a.slug===p.imageKey);
    if(p.imageKey&&!image)throw Error('Invalid approved photograph.');
    if(image){p.image=image.image;p.imageAlt=image.imageAlt;p.imageSrcSet=image.imageSrcSet;}
    else {delete p.image;delete p.imageAlt;delete p.imageSrcSet;}
  }
  for(const c of data.categories)if(!finite(c.position,1000)||!Number.isInteger(c.position))throw Error('Invalid category position.');
  for(const p of data.promotions)if(!finite(p.discount,100)||!finite(p.minimum))throw Error('Invalid promotion.');
  for(const z of data.zones)if(!finite(z.fee)||!finite(z.minimum)||!z.pins.split(/[\s,]+/).every(pin=>/^\d{6}$/.test(pin)))throw Error('Invalid zone.');
  if(!Array.isArray(data.orders)||data.orders.length>2000)throw Error('Invalid orders.');
  for(const o of data.orders) {
    if(!string(o.id,100)||!string(o.customer,160)||!string(o.date,100)||!string(o.address)||!string(o.payment,160)||!operationStates.orders.includes(o.status)||!finite(o.total)||!Array.isArray(o.items)||!o.items.length)throw Error('Invalid order.');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(orderDate(o))||!Number.isFinite(Date.parse(orderDate(o)+'T12:00:00Z')))throw Error('Invalid order date.');
    for(const line of o.items)if(!string(line.slug,100)||!Number.isInteger(line.quantity)||line.quantity<1||!finite(line.amount))throw Error('Invalid order item.');
    for(const line of o.items){if(line.name!==undefined&&!string(line.name,160))throw Error('Invalid purchased name.');line.name??=approvedProducts.find(p=>p.slug===line.slug)?.name||line.slug;}
    if(Math.abs(o.total-o.items.reduce((n,l)=>n+l.amount*l.quantity,0))>.01)throw Error('Invalid order total.');
    if(o.history!==undefined&&(!Array.isArray(o.history)||o.history.some(h=>!string(h.note)||!string(h.at,100)||!Number.isFinite(Date.parse(h.at))||!operationStates.orders.includes(h.to))))throw Error('Invalid order history.');
  }
  if(!Array.isArray(data.activity)||data.activity.length>200||data.activity.some(a=>!string(a.message,500)||!string(a.at,100)||!Number.isFinite(Date.parse(a.at))))throw Error('Invalid activity.');
  if(!Array.isArray(data.inventoryLog)||data.inventoryLog.length>5000||data.inventoryLog.some(l=>typeof l==='string'?!string(l):!finite(l.from)||!finite(l.to)||!string(l.reason)||!string(l.message)||!Number.isFinite(Date.parse(l.at))))throw Error('Invalid inventory log.');
  const s=data.settings;if(!s||!string(s.name,160)||!string(s.email,160)||!string(s.phone,160)||!['Closed','Preview only'].includes(s.ordering)||!finite(s.lowStockThreshold,1000)||!Number.isInteger(s.lowStockThreshold)||typeof s.digest!=='boolean')throw Error('Invalid settings.');
  return data;
}
export function restoreOperationsState(target,snapshot) {
  for(const key of [...Object.keys(fields),'orders','inventoryLog','activity','settings'])target[key]=structuredClone(snapshot[key]);
  syncAccountOrders(target);
}
function syncAccountOrders(source) {for(const accountOrder of sampleAccount.orders){const order=source.orders.find(o=>o.id===accountOrder.id);if(order){accountOrder.status=order.status;accountOrder.delivered=order.status==='Delivered'?'Delivered in this preview':'Awaiting delivery in this preview';}}}
export function hydrateOperationsState(storage,target=state) {
  try {const raw=storage.getItem(operationsStorageKey);if(raw)restoreOperationsState(target,parseOperationsSnapshot(raw));return {ok:true};}
  catch{return {ok:false,message:'Saved preview records could not be loaded. The original sample workspace is available.'};}
}
let storage,storageNotice='';
export function initializeOperationsPreview() {
  if(!operationsPreviewEnabled||typeof window==='undefined')return;
  try{storage=window.localStorage;storageNotice=hydrateOperationsState(storage).message||'';}catch{storageNotice='Browser storage is unavailable. Changes will remain in this tab.';}
}
export const operationsStorageNotice=()=>storageNotice;
export function persistOperationsState() {
  syncAccountOrders(state);
  try{if(!storage)throw Error();storage.setItem(operationsStorageKey,JSON.stringify(operationsSnapshot(state)));storageNotice='';return true;}
  catch{storageNotice='Browser storage is unavailable or full. This change remains in this tab.';return false;}
}
export function resetOperationsPreview() {
  restoreOperationsState(state,operationsSnapshot(createWorkspace()));
  try{if(!storage)throw Error();storage.removeItem(operationsStorageKey);storageNotice='';return true;}catch{storageNotice='Browser storage is unavailable. The reset applies to this tab; saved records may return after reload.';return false;}
}
