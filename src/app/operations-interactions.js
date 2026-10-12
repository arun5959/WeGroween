import { operationsPreviewEnabled } from './operations-review-config.js';
import { developmentWorkspace as state } from '../content/development-workspace.js';
import { products as catalogue } from '../content/foundation.js';
import { workField as field, saveActions } from '../components/workspace.js';
import { escapeHtml as e } from '../components/primitives.js';
import { setupAccountEditorModal } from './account-editor-modal.js';
import { setupBrandedSelects } from './branded-select.js';
import { siteUrl,mountHtml } from './hosting.js';
import { applyOperation,bulkOperation,queryRecords,operationsReport,operationsCsv,operationStates,OperationError } from './operations-model.js';
import { persistOperationsState,resetOperationsPreview,operationsStorageNotice,operationsStorageKey,synchronizeOperationsPreview,withOperationsLock,operationsRecordFingerprint } from './operations-store.js';

import { operationsReportSummary } from '../pages/operations.js';

let pendingNotice='';
const schemas={
 category:['categories',[['name','Category name',{required:true}],['description','Description',{type:'textarea'}],['position','Display position',{type:'number',max:1000}],['status','State',{choices:operationStates.categories}]]],
 customer:['customers',[['name','Full name',{required:true}],['email','Email',{type:'email',required:true}],['phone','Phone (optional)',{type:'tel'}],['notes','Service notes',{type:'textarea'}],['status','State',{choices:operationStates.customers}]]],
 enquiry:['enquiries',[['name','Kitchen',{required:true}],['contact','Contact person',{required:true}],['email','Email',{type:'email',required:true}],['produce','Produce requirements',{required:true}],['frequency','Schedule',{choices:['Still exploring','One-off','Weekly','To discuss']}],['followUp','Follow-up date',{type:'date'}],['notes','Conversation notes',{type:'textarea'}],['status','Conversation stage',{choices:operationStates.enquiries}]]],
 promotion:['promotions',[['name','Promotion name',{required:true}],['code','Sample code',{required:true}],['discount','Illustrative discount (%)',{type:'number',step:'.01',max:100,required:true}],['minimum','Minimum order value (₹)',{type:'number',step:'.01'}],['starts','Starts on',{type:'date'}],['ends','Ends on',{type:'date'}],['status','State',{choices:operationStates.promotions}]]],
 zone:['zones',[['name','Zone name',{required:true}],['pins','Sample PIN codes',{required:true,hint:'Six digits each, separated by commas.'}],['fee','Illustrative delivery fee (₹)',{type:'number',step:'.01',required:true}],['minimum','Minimum order value (₹)',{type:'number',step:'.01'}],['cutoff','Daily cut-off',{type:'time'}],['status','State',{choices:operationStates.zones}]]],
};
export function setupOperationsInteractions(root,{scroller,refresh,navigate}) {
 const workspace=root.querySelector('[data-workspace-kind="operations"]');if(!workspace||!operationsPreviewEnabled)return ()=>{};
 const controller=new AbortController(),events={signal:controller.signal},selected=new Set();
 let modal,editor,disposeModalSelects=()=>{},kind='',recordId='',returnSelector='',pageNumber=1,tableResult,editorBase=null,formDirty=false,externalRefreshNeeded=false,mutationPending=false;
 const collections={stock:'products',product:'products',order:'orders',category:'categories',customer:'customers',enquiry:'enquiries',promotion:'promotions',zone:'zones',settings:'settings'};
 const fingerprint=(action,id)=>operationsRecordFingerprint(state,collections[action],id);
 const inlineForm=workspace.querySelector('[data-work-form]');
 const inlineBase=inlineForm?fingerprint(inlineForm.dataset.workForm,inlineForm.querySelector('[name="id"]')?.value||''):null;
 const table=workspace.querySelector('[data-operations-table]'),tableKey=table?.dataset.operationsTable;
 const records=()=>tableKey==='categories'?[...state.categories].sort((a,b)=>a.position-b.position):state[tableKey==='inventory'?'products':tableKey]||[];
 const notify=message=>{workspace.querySelector('.work-status').textContent=message;};
 const params=new URLSearchParams(location.search);
 function syncQuery() {
  const query=new URLSearchParams(location.search);
  for(const [key,value] of [['q',table?.querySelector('[data-work-filter]')?.value||''],['status',table?.querySelector('[name="status-filter"]')?.value||'All statuses'],['sort',table?.querySelector('[name="admin-sort"]')?.value||'selection'],['category',table?.querySelector('[name="category-filter"]')?.value||''],['page',String(pageNumber)],['size',table?.querySelector('[name="admin-page-size"]')?.value||'6']]) {
   if(!table)break;if(['','All statuses','selection','All categories'].includes(value)||(key==='page'&&value==='1')||(key==='size'&&value==='6'))query.delete(key);else query.set(key,value);
  }
  history.replaceState(history.state,'',location.pathname+(query.size?'?'+query:'')+location.hash);
 }
 function syncSelection() {
  table?.querySelectorAll('[data-admin-select-record]').forEach(input=>input.checked=selected.has(input.value));
  const visible=tableResult?.visible||[],all=table?.querySelector('[data-admin-select-page]');if(all){all.checked=!!visible.length&&visible.every(r=>selected.has(r.id));all.indeterminate=visible.some(r=>selected.has(r.id))&&!all.checked;}
  const bulk=table?.querySelector('[data-admin-bulk]');if(bulk){bulk.hidden=!selected.size;bulk.querySelector('[data-admin-selected]').textContent=`${selected.size} selected`;}
 }
 function filter({reset=false,updateUrl=true}={}) {
  if(!table)return;if(reset)pageNumber=1;
  const rows=[...table.querySelectorAll('[data-work-row]')],byId=new Map(rows.map(row=>[row.dataset.recordId,row]));
  const category=table.querySelector('[name="category-filter"]')?.value||'';
  tableResult=queryRecords(records().filter(r=>byId.has(r.id)),{query:table.querySelector('[data-work-filter]').value,status:table.querySelector('[name="status-filter"]')?.value,sort:table.querySelector('[name="admin-sort"]').value,category,valueField:tableKey==='inventory'?'stock':'',page:pageNumber,pageSize:Number(table.querySelector('[name="admin-page-size"]').value)});
  pageNumber=tableResult.page;rows.forEach(row=>row.hidden=true);
  const tbody=table.querySelector('tbody');for(const record of tableResult.all)tbody.append(byId.get(record.id));
  for(const record of tableResult.visible)byId.get(record.id).hidden=false;
  table.querySelector('[data-work-count]').textContent=`${tableResult.count} matching record${tableResult.count===1?'':'s'} · ${Math.min(tableResult.count,(pageNumber-1)*Number(table.querySelector('[name="admin-page-size"]').value)+1)}–${Math.min(tableResult.count,pageNumber*Number(table.querySelector('[name="admin-page-size"]').value))} shown`;
  table.querySelector('[data-work-empty]').hidden=tableResult.count>0;table.querySelector('[data-admin-page]').textContent=`${pageNumber} / ${tableResult.pages}`;
  table.querySelector('[data-admin-action="previous-page"]').disabled=pageNumber===1;table.querySelector('[data-admin-action="next-page"]').disabled=pageNumber===tableResult.pages;
  // Changing a filter clears selection, keeping bulk actions limited to this view.
  if(reset)selected.clear();syncSelection();if(updateUrl)syncQuery();updateReportSummary();scroller.refresh();
 }
 if(table){
  for(const [name,key,defaultValue] of [['status-filter','status','All statuses'],['admin-sort','sort','selection'],['category-filter','category',''],['admin-page-size','size','6']]) {
   const select=table.querySelector(`[name="${name}"]`);if(!select)continue;let value=params.get(key)||defaultValue;if(name==='category-filter'&&value&&![...select.options].some(o=>o.value===value))value=state.categories.find(c=>c.name===value)?.id||'';if([...select.options].some(o=>o.value===value))select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  table.querySelector('[data-work-filter]').value=params.get('q')||'';pageNumber=Number(params.get('page'))||1;filter();
 }
 function updateReportSummary() {
  const summary=workspace.querySelector('[data-admin-report-summary]');if(!summary)return;
  const report=operationsReport(state,{period:workspace.querySelector('[name="admin-period"]').value,status:workspace.querySelector('[name="report-status"]').value,query:table.querySelector('[data-work-filter]').value,tableStatus:table.querySelector('[name="status-filter"]').value});
  summary.innerHTML=mountHtml(operationsReportSummary(report));
 }
 function readLatest() {
  const result=synchronizeOperationsPreview();if(result.conflict)throw new OperationError(result.message);return result.changed;
 }
 function validateDraft(action,id,base) {
  readLatest();if(base!==fingerprint(action,id))throw new OperationError('This record changed in another tab. Your inputs were kept. Close and reopen the editor, or refresh this page, to review the latest details.');
 }
 window.addEventListener('storage',event=>{
  if(event.key!==operationsStorageKey&&event.key!==null)return;
  const result=synchronizeOperationsPreview();if(result.conflict){notify(result.message);return;}if(!result.changed)return;
  if(modal?.isOpen()||formDirty||mutationPending){externalRefreshNeeded=true;notify('Changes from another tab are available. Your draft is kept; saving checks for conflicts.');}
  else repaint('Changes from another tab loaded.','.work-header h1');
 },events);
 function repaint(message,selector=returnSelector) {
  const y=scrollY;refresh();scroller.toPosition(y,{immediate:true});
  root.querySelector('.work-status')?.replaceChildren(document.createTextNode(message));
  let target=root.querySelector(selector||'.work-header h1');if(target?.hidden&&target.tagName==='SELECT')target=root.querySelector(`#${CSS.escape(target.id)}-trigger`);if(!target?.getClientRects().length)target=root.querySelector('.work-header h1');target?.focus({preventScroll:true});scroller.refresh();
 }
 function error(error,form) {
  const input=error.field&&form?.querySelector(`[name="${CSS.escape(error.field)}"]`);
  if(input){input.setCustomValidity(error.message);if(!input.hidden)input.reportValidity();(input.hidden?root.querySelector(`#${CSS.escape(input.id)}-trigger`):input)?.focus({preventScroll:true});}
  const feedback=form?.querySelector('[data-admin-form-error]');if(feedback)feedback.textContent=error.message;else notify(error.message);
 }
 function persist(message) {return persistOperationsState()?message:message+' '+operationsStorageNotice();}
 function dismiss(){disposeModalSelects();disposeModalSelects=()=>{};modal?.close({afterClose:()=>{if(externalRefreshNeeded)repaint('Changes from another tab loaded.');}});}
 function ensureModal(){if(modal)return;editor=document.createElement('section');editor.className='account-editor';editor.hidden=true;workspace.append(editor);modal=setupAccountEditorModal(workspace,scroller,{onDismiss:dismiss,eyebrow:'Your growing business',description:'Preview records are saved in this browser. Real operations remain separate.'});}
 function openEditor(button,action,id='') {
  const changed=readLatest();if(changed)externalRefreshNeeded=true;
  ensureModal();disposeModalSelects();kind=action;recordId=id;returnSelector=`[data-work-action="${button.dataset.workAction}"]${id?`[data-record="${CSS.escape(id)}"]`:''}`;
  if(kind==='reset') {
   editor.innerHTML='<form data-admin-form="reset" class="work-form"><p>This replaces the saved operations preview with its original sample records. It does not change the website or any real data.</p><div class="work-form-actions"><button type="submit" class="button button--primary">Reset preview records</button><button type="button" class="button button--secondary" data-work-close>Keep my changes</button></div></form>';
   modal.open(editor,'Start with a fresh workspace',button);return;
  }
  const schema=schemas[kind],record=kind==='stock'?state.products.find(p=>p.id===id):state[schema[0]].find(r=>r.id===id)||{};
  if(id&&!record)throw new OperationError('This record no longer exists. Refresh the workspace.');editorBase=fingerprint(kind,id);
  const fields=kind==='stock'?[['stock','New sample stock (packs)',{type:'number',required:true}],['reason','Reason for the adjustment',{type:'textarea',required:true}]]:schema[1];
  editor.innerHTML=mountHtml(`<form class="work-form" data-admin-form="modal">${fields.map(([name,label,options])=>field(name,label,record[name]??(['position','discount','minimum','fee'].includes(name)?0:''),options)).join('')}<p class="admin-form-error" role="alert" data-admin-form-error></p>${saveActions()}</form>`);
  modal.open(editor,kind==='stock'?'Adjust sample stock':`${id?'Edit':'Add'} ${kind}`,button);disposeModalSelects=setupBrandedSelects(editor);
 }
 function download(csv,filename) {const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 root.addEventListener('click',event=>{
  const close=event.target.closest('[data-work-close],[data-account-action="cancel-edit"]');if(close){dismiss();return;}
  const button=event.target.closest('[data-admin-action],[data-work-action]');if(!button)return;
  const action=button.dataset.adminAction||button.dataset.workAction,id=button.dataset.record;
  if(action==='refresh'){try{readLatest();repaint('Workspace refreshed.');}catch(err){error(err);}return;}
  if(action==='clear-filters'){table.querySelector('[data-work-filter]').value='';for(const name of ['status-filter','admin-sort','category-filter']){const select=table.querySelector(`[name="${name}"]`);if(select){select.selectedIndex=0;select.dispatchEvent(new Event('change',{bubbles:true}));}}filter({reset:true});return;}
  if(action==='clear-selection'){selected.clear();syncSelection();return;}
  if(action==='previous-page'||action==='next-page'){pageNumber+=action==='next-page'?1:-1;filter();return;}
  if(action==='bulk'){if(mutationPending)return;mutationPending=true;const ids=[...selected];withOperationsLock(()=>{if(!workspace.isConnected)return;readLatest();const message=bulkOperation(state,({orders:'order',products:'product',enquiries:'enquiry',promotions:'promotion',zones:'zone',customers:'customer'})[tableKey],ids,button.dataset.value);repaint(persist(message),'[data-admin-select-page]');}).catch(err=>error(err)).finally(()=>mutationPending=false);return;}
  if(action==='export') {
   const report=operationsReport(state,{period:workspace.querySelector('[name="admin-period"]')?.value||'all',status:workspace.querySelector('[name="report-status"]')?.value||'All statuses'});
   const orders=tableResult?.all||report.orders;download(operationsCsv(orders),'wegroween-sample-orders.csv');notify(`${orders.length} filtered sample orders exported.`);return;
  }
  if(action==='reset-preview'){openEditor(button,'reset');return;}
  const editorKind=action.replace(/^(new-|edit-)/,'');if(schemas[editorKind]||editorKind==='stock'){try{openEditor(button,editorKind,id);}catch(err){error(err);}}
 },events);
 function clearFormErrors(target) {
  const form=target.closest('form');if(!form)return;form.querySelectorAll('input,select,textarea').forEach(input=>input.setCustomValidity(''));const feedback=form.querySelector('[data-admin-form-error]');if(feedback)feedback.textContent='';
 }
 root.addEventListener('input',event=>{
  clearFormErrors(event.target);
  if(event.target.closest('[data-work-form]'))formDirty=true;
  if(event.target.matches('[data-work-filter]'))filter({reset:true});
  const productForm=event.target.closest('[data-work-form="product"]');if(productForm)updateProductPreview(productForm);
 },events);
 root.addEventListener('change',event=>{
  clearFormErrors(event.target);
  if(event.target.closest('[data-work-form]'))formDirty=true;
  if(event.target.matches('[data-admin-select-record]')){event.target.checked?selected.add(event.target.value):selected.delete(event.target.value);syncSelection();return;}
  if(event.target.matches('[data-admin-select-page]')){for(const record of tableResult.visible)event.target.checked?selected.add(record.id):selected.delete(record.id);syncSelection();return;}
  if(table?.contains(event.target)&&event.target.matches('select'))filter({reset:true});
  if(event.target.matches('[name="admin-period"],[name="report-status"]')){
   const query=new URLSearchParams(location.search);query.set('period',workspace.querySelector('[name="admin-period"]').value);query.set('reportStatus',workspace.querySelector('[name="report-status"]')?.value||'All statuses');history.replaceState(history.state,'',location.pathname+'?'+query);repaint('Reporting period updated.',`#${event.target.id}`);
  }
  const productForm=event.target.closest('[data-work-form="product"]');if(productForm)updateProductPreview(productForm);
 },events);
 function updateProductPreview(form) {
  const data=new FormData(form),image=catalogue.find(p=>p.slug===data.get('imageKey'));
  workspace.querySelector('[data-admin-product-name]').textContent=data.get('name')||'Your next harvest';workspace.querySelector('[data-admin-product-description]').textContent=data.get('description')||'A clear description helps every kitchen choose.';
  workspace.querySelector('[data-admin-product-price]').textContent=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(data.get('price'))||0);
  const img=workspace.querySelector('[data-admin-product-image]');if(image){img.src=siteUrl(image.image);img.alt=image.imageAlt;img.hidden=false;}else img.hidden=true;
 }
 root.addEventListener('submit',event=>{
  const form=event.target.closest('[data-work-form],[data-admin-form]');if(!form)return;event.preventDefault();
  if(form.dataset.adminPending||mutationPending)return;
  form.querySelectorAll('input[required],textarea[required]').forEach(input=>input.setCustomValidity(input.value.trim()?'':'Please enter a value.'));if(!form.reportValidity())return;
  const data=Object.fromEntries([...new FormData(form)].map(([key,value])=>[key,String(value).trim()]));
  const action=form.dataset.adminForm==='modal'?kind:form.dataset.workForm,id=form.dataset.adminForm==='modal'?recordId:data.id||'',base=form.dataset.adminForm==='modal'?editorBase:inlineBase;
  form.dataset.adminPending='true';form.setAttribute('aria-busy','true');mutationPending=true;
  const buttons=[...form.querySelectorAll('button[type="submit"]')];buttons.forEach(button=>button.disabled=true);let completed=false;
  withOperationsLock(()=>{
   if(!form.isConnected)return;
   if(form.dataset.adminForm==='reset'){
    const saved=resetOperationsPreview(),message='Original preview records restored.'+(saved?'':' '+operationsStorageNotice());disposeModalSelects();completed=true;modal.close({restoreFocus:false,afterClose:()=>repaint(message,'[data-work-action="reset-preview"]')});return;
   }
   validateDraft(action,id,base);
   for(const name of ['position','discount','minimum','fee'])if(name in data&&!data[name])data[name]='0';
   if(action==='settings')data.digest=form.querySelector('[name="digest"]').checked;
   const result=applyOperation(state,action,data,{id});const message=persist(result.message);completed=true;
   if(form.dataset.adminForm==='modal'){
    disposeModalSelects();disposeModalSelects=()=>{};modal.close({restoreFocus:false,afterClose:()=>repaint(message)});
   }else if(action==='product'){pendingNotice=message;navigate(new URL(siteUrl('/admin/products')+'?q='+encodeURIComponent(result.record.name),location.href));}
   else if(action==='settings')repaint(message,'[data-work-form="settings"] button[type="submit"]');
   else repaint(message,'[data-work-form="order"] button[type="submit"]');
  }).catch(err=>error(err,form)).finally(()=>{
   mutationPending=false;if(!completed){delete form.dataset.adminPending;form.removeAttribute('aria-busy');buttons.forEach(button=>button.disabled=false);}
  });
 },events);
 const notice=pendingNotice||operationsStorageNotice();pendingNotice='';if(notice)notify(notice);
 return ()=>{controller.abort();disposeModalSelects();modal?.dispose();};
}
