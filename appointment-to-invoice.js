/* Conversion rendez-vous vers facture - ajout isolé. */
(function(){
'use strict';
const css=document.createElement('style');
css.textContent='.btn.event-to-invoice{background:#18794e;color:#fff;border:1px solid #12633e}.btn.event-to-invoice:hover{background:#12633e}';
document.head.appendChild(css);
const original=window.openEvent;
window.openEvent=function(i,...args){
 original(i,...args);
 if(i===null||i===undefined||!db.events[i]||db.events[i].kind==='note')return;
 const actions=document.querySelector('#mb .actions');
 if(!actions)return;
 const button=document.createElement('button');
 button.type='button';button.className='btn event-to-invoice';
 button.textContent='📄 Transformer en facture';
 button.addEventListener('click',()=>window.invoiceFromAppointment(i));
 actions.appendChild(button);
};
window.invoiceFromAppointment=function(i){
 const e=db.events[i];if(!e)return;
 const linked=db.invoices.findIndex(d=>d.sourceAppointmentId&&d.sourceAppointmentId===e.invoiceLinkId);
 if(linked>=0){closeModal();openDocNumber('invoices',linked);return;}
 const client=eventClientRecord(e);
 if(!client){alert('Sélectionne une fiche client dans le rendez-vous et enregistre-le avant de créer la facture.');return;}
 const key=e.invoiceLinkId||('rdv-'+Date.now()+'-'+Math.random().toString(36).slice(2));
 const date=today();
 const prefix='FAC-'+new Date().getFullYear()+'-';
 const max=db.invoices.reduce((n,d)=>d.number?.startsWith(prefix)?Math.max(n,Number(d.number.slice(prefix.length))||0):n,0);
 const doc={number:prefix+String(max+1).padStart(4,'0'),client:client.name,clientSnapshot:JSON.parse(JSON.stringify(client)),date,dueDate:(()=>{const x=new Date(date+'T12:00:00');x.setDate(x.getDate()+7);return x.toISOString().slice(0,10)})(),status:'Brouillon',subject:e.type||'Intervention',notes:e.notes||'',lines:[{description:e.type||'Intervention',quantity:1,unitPrice:0,discount:0,vat:21}],pricesIncludeVat:false,sourceAppointmentId:key};
 const oldLink=e.invoiceLinkId;
 e.invoiceLinkId=key;db.invoices.push(doc);
 try{save()}catch(err){db.invoices.pop();if(oldLink)e.invoiceLinkId=oldLink;else delete e.invoiceLinkId;alert('Impossible de créer le brouillon.');return;}
 closeModal();openDocNumber('invoices',db.invoices.length-1);
};
})();