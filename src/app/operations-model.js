import { products as catalogue } from '../content/foundation.js';

export const operationStates = Object.freeze({
  orders:['Preparing','Ready','Out for delivery','Delivered','Cancelled'],
  products:['Draft','Published','Archived'], categories:['Draft','Published'],
  customers:['Active','Inactive'], enquiries:['New','Discussing','Agreed','Closed'],
  promotions:['Draft','Active','Ended'], zones:['Draft','Active','Paused'],
});
const lists = {product:'products',category:'categories',customer:'customers',enquiry:'enquiries',promotion:'promotions',zone:'zones'};
export class OperationError extends Error { constructor(message,field='') {super(message);this.field=field;} }
const reject = (message,field) => {throw new OperationError(message,field);};
const text = (value,max=160) => String(value ?? '').trim().slice(0,max);
const required = (data,key,label) => { const value=text(data[key],key==='description'||key==='notes'?1200:160);if(!value)reject(`${label} is required.`,key);return value; };
const number = (data,key,label,max=1000000,integer=false) => {const n=Number(data[key]);if(text(data[key])===''||!Number.isFinite(n)||n<0||n>max||(integer&&!Number.isInteger(n)))reject(`${label} must be ${integer?'a whole number':'a number'} from 0 to ${max}.`,key);return n;};
const email = data => {const value=required(data,'email','Email');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))reject('Enter a valid email address.','email');return value;};
function stateValue(collection,data) {if(!operationStates[collection].includes(data.status))reject('Choose a valid state.','status');return data.status;}
function dateValue(data,key) {const value=text(data[key]);if(value&&!/^\d{4}-\d{2}-\d{2}$/.test(value))reject('Choose a valid date.',key);if(value&&(!Number.isFinite(Date.parse(value+'T12:00:00Z'))||new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value))reject('Choose a valid date.',key);return value;}
export function orderDate(order) {
  if(order.placedAt)return order.placedAt;
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const [day,month,year]=order.date.split(' ');return `${year}-${String(months.indexOf(month)+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
export function nextOrderStates(order) { const sequence=operationStates.orders.slice(0,4),index=sequence.indexOf(order.status);return index<0||index===3?[order.status]:[order.status,sequence[index+1],'Cancelled']; }
export function recordActivity(state,message,now=new Date().toISOString()) {
  state.activity ??=[];state.activity.unshift({id:crypto.randomUUID(),message:text(message,500),at:now});state.activity=state.activity.slice(0,200);
}
export function applyOperation(state,kind,data,{id='',now=new Date().toISOString()}={}) {
  if(kind==='order') {
    const record=state.orders.find(o=>o.id===id);if(!record)reject('This order no longer exists.');
    if(!nextOrderStates(record).includes(data.status))reject('Advance one fulfilment step at a time. Completed orders stay closed.','status');
    const note=text(data.note,1200);
    if(data.status==='Cancelled'&&!note)reject('Record a reason before cancelling this order.','note');
    if(record.status===data.status&&!note)reject('Choose the next step or add a note.','note');
    const from=record.status;record.status=data.status;record.history ??=[];
    record.history.push({from,to:record.status,note,at:now});
    const message=from===record.status?`Note added to ${id}.`:`${id}: ${from} → ${record.status}.`;
    recordActivity(state,message,now);return {record,message};
  }
  if(kind==='stock') {
    const record=state.products.find(p=>p.id===id);if(!record)reject('This product no longer exists.');
    const stock=number(data,'stock','Stock',1000000,true),reason=required(data,'reason','Adjustment reason');
    if(stock===record.stock)reject('Enter a different stock quantity.','stock');
    const message=`${record.name}: ${record.stock} → ${stock} packs · ${reason}`;
    state.inventoryLog.unshift({id:crypto.randomUUID(),productId:id,productName:record.name,from:record.stock,to:stock,reason,at:now,message});
    record.stock=stock;recordActivity(state,message,now);return {record,message};
  }
  if(kind==='settings') {
    const record={name:required(data,'name','Business name'),email:email(data),phone:text(data.phone),ordering:data.ordering,lowStockThreshold:number(data,'lowStockThreshold','Low-stock threshold',1000,true),digest:!!data.digest};
    if(!['Closed','Preview only'].includes(record.ordering))reject('Ordering remains closed in this preview.','ordering');
    Object.assign(state.settings,record);recordActivity(state,'Workspace preferences updated.',now);return {record:state.settings,message:'Sample settings updated. Saved in this browser.'};
  }
  const collection=lists[kind];if(!collection)reject('Unknown operations action.');
  const existing=state[collection].find(r=>r.id===id);if(id&&!existing)reject('This record no longer exists.');
  const record={name:required(data,'name','Name'),status:stateValue(collection,data)};
  if(kind==='product') {
    const category=state.categories.find(c=>c.id===data.category);if(!category)reject('Choose an existing category.','category');
    Object.assign(record,{description:text(data.description,1200),category:category.id,pack:required(data,'pack','Pack size'),price:Math.round(number(data,'price','Price')*100)/100,stock:number(data,'stock','Stock',1000000,true)});
    const image=catalogue.find(p=>p.slug===data.imageKey);
    if(data.imageKey&&!image)reject('Choose an approved product photograph.','imageKey');
    if(record.status==='Published'&&!image)reject('Choose a photograph before publishing.','imageKey');
    if(image)Object.assign(record,{imageKey:image.slug,image:image.image,imageAlt:image.imageAlt,imageSrcSet:image.imageSrcSet});
    else Object.assign(record,{imageKey:'',image:'',imageAlt:'',imageSrcSet:''});
    if(existing&&record.stock!==existing.stock) {
      required(data,'reason','Stock adjustment reason');
      // Validate the full record before committing its reasoned stock movement.
      applyOperation(state,'stock',{stock:record.stock,reason:data.reason},{id,now});
    }
  } else if(kind==='category') {if(state.categories.some(c=>c.id!==id&&c.name.toLocaleLowerCase()===record.name.toLocaleLowerCase()))reject('This category name is already in use.','name');Object.assign(record,{description:text(data.description,1200),position:number(data,'position','Display position',1000,true)});}
  else if(kind==='customer')Object.assign(record,{email:email(data),phone:text(data.phone),notes:text(data.notes,1200)});
  else if(kind==='enquiry') Object.assign(record,{contact:required(data,'contact','Contact person'),email:email(data),produce:required(data,'produce','Produce requirements'),frequency:text(data.frequency),followUp:dateValue(data,'followUp'),notes:text(data.notes,1200)});
  else if(kind==='promotion') {
    const code=required(data,'code','Promotion code').toUpperCase();if(!/^[A-Z0-9_-]{3,24}$/.test(code))reject('Use 3–24 letters, numbers, underscores or hyphens.','code');
    if(state.promotions.some(p=>p.id!==id&&p.code.toUpperCase()===code))reject('This code is already in use.','code');
    Object.assign(record,{code,discount:number(data,'discount','Discount',100),minimum:number(data,'minimum','Minimum order value'),starts:dateValue(data,'starts'),ends:dateValue(data,'ends')});
    if(record.starts&&record.ends&&record.ends<record.starts)reject('The end date must follow the start date.','ends');
  } else if(kind==='zone') {
    const pins=required(data,'pins','PIN codes').split(/[\s,]+/).filter(Boolean);if(pins.some(pin=>!/^\d{6}$/.test(pin)))reject('Use six-digit PIN codes separated by commas.','pins');
    if(state.zones.some(z=>z.id!==id&&z.pins.split(/[\s,]+/).some(pin=>pins.includes(pin))))reject('A PIN code already belongs to another zone.','pins');
    Object.assign(record,{pins:[...new Set(pins)].join(', '),fee:number(data,'fee','Delivery fee'),minimum:number(data,'minimum','Minimum order value'),cutoff:text(data.cutoff)});
    if(record.cutoff&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(record.cutoff))reject('Use a valid cut-off time.','cutoff');
  }
  if(existing)Object.assign(existing,record);else {record.id=`sample-${kind}-${crypto.randomUUID()}`;state[collection].push(record);}
  const saved=existing||record,message=`${record.name} ${existing?'updated':'added'}.`;recordActivity(state,message,now);return {record:saved,message};
}
export function bulkOperation(state,kind,ids,value) {
  const collection=lists[kind]||(kind==='order'?'orders':null);if(!collection)reject('Choose a supported action.');
  const records=ids.map(id=>state[collection].find(r=>r.id===id));if(!records.length||records.some(r=>!r))reject('Select existing records first.');
  if(kind==='order') {if(value!=='Ready'||records.some(r=>r.status!=='Preparing'))reject('Only preparing orders can be marked Ready together.');}
  else if(!operationStates[collection].includes(value))reject('Choose a valid state.');
  if(kind==='product'&&value==='Published'&&records.some(p=>!p.image||!p.pack||!state.categories.some(c=>c.id===p.category)))reject('All selected products need a photograph, pack and category before publishing.');
  for(const record of records) {if(kind==='order')applyOperation(state,kind,{status:value},{id:record.id});else record.status=value;}
  const message=`${records.length} selected record${records.length===1?'':'s'} set to ${value}.`;recordActivity(state,message);return message;
}
export function queryRecords(records,{query='',status='All statuses',sort='selection',category='',page=1,pageSize=6,valueField=''}={}) {
  pageSize=Number.isInteger(Number(pageSize))&&Number(pageSize)>0&&Number(pageSize)<=100?Number(pageSize):6;
  const needle=query.trim().toLocaleLowerCase();let rows=records.filter(r=>(status==='All statuses'||r.status===status)&&(!category||category==='all'||r.category===category)&&(!needle||[r.id,r.name,r.customer,r.email,r.produce,r.pack,r.code,r.pins].join(' ').toLocaleLowerCase().includes(needle)));
  const value=r=>valueField?(r[valueField]??0):(r.total??r.price??r.fee??r.discount??r.stock??0);
  const compare={ 'name-asc':(a,b)=>(a.name||a.customer||a.id).localeCompare(b.name||b.customer||b.id),'name-desc':(a,b)=>(b.name||b.customer||b.id).localeCompare(a.name||a.customer||a.id),'value-asc':(a,b)=>value(a)-value(b),'value-desc':(a,b)=>value(b)-value(a),'stock-asc':(a,b)=>a.stock-b.stock,'date-desc':(a,b)=>orderDate(b).localeCompare(orderDate(a)),'date-asc':(a,b)=>orderDate(a).localeCompare(orderDate(b)) }[sort];
  if(compare)rows=[...rows].sort(compare);const pages=Math.max(1,Math.ceil(rows.length/pageSize)),current=Math.max(1,Math.min(pages,Math.floor(Number(page))||1));return {all:rows,visible:rows.slice((current-1)*pageSize,current*pageSize),page:current,pages,count:rows.length};
}
export function operationsReport(state,{period='all',status='All statuses'}={}) {
  if(!['all','7','30'].includes(period))period='all';
  if(!['All statuses',...operationStates.orders].includes(status))status='All statuses';
  const anchor=state.orders.map(orderDate).sort().at(-1)||new Date().toISOString().slice(0,10);
  const from=period==='all'?'':new Date(Date.parse(anchor+'T12:00:00Z')-(Number(period)-1)*86400000).toISOString().slice(0,10);
  const orders=state.orders.filter(o=>(!from||orderDate(o)>=from)&&(status==='All statuses'||o.status===status));
  const accepted=orders.filter(o=>o.status!=='Cancelled'),value=accepted.reduce((n,o)=>n+o.total,0),daily=new Map(),items=new Map();
  for(const order of orders){const date=orderDate(order),day=daily.get(date)||{date,count:0,value:0};day.count++;if(order.status!=='Cancelled')day.value+=order.total;daily.set(date,day);}
  for(const order of accepted)for(const item of order.items){const current=items.get(item.slug)||{id:item.slug,quantity:0,value:0};current.quantity+=item.quantity;current.value+=(item.amount??0)*item.quantity;items.set(item.slug,current);}
  return {orders,value,average:accepted.length?value/accepted.length:0,delivered:orders.filter(o=>o.status==='Delivered').length,from,anchor,daily:[...daily.values()].sort((a,b)=>a.date.localeCompare(b.date)),items:[...items.values()].sort((a,b)=>b.quantity-a.quantity)};
}
export function operationsCsv(orders) {
  const cell=value=>{let s=String(value??'');if(/^\s*[=+\-@]|^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
  return [['Sample order','Customer','Date','Status','Illustrative total'],...orders.map(o=>[o.id,o.customer,o.date,o.status,o.total])].map(row=>row.map(cell).join(',')).join('\r\n');
}
