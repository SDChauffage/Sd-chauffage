/* Paiement SEPA EPC069-12 v3.1. Encodage local, aucune requête réseau. */
(function(){
'use strict';
const defaultFooter='Merci de régler cette facture avant la date d’échéance indiquée, en mentionnant sa référence.\nMerci de votre confiance !';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s??'').replace(/[\r\n\t]+/g,' ').trim();
const ibanText=s=>String(s??'').replace(/\s/g,'').toUpperCase();
function validIban(value){
 const iban=ibanText(value);
 if(!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)||(iban.startsWith('BE')&&iban.length!==16))return false;
 const digits=(iban.slice(4)+iban.slice(0,4)).replace(/[A-Z]/g,c=>String(c.charCodeAt(0)-55));
 let mod=0;for(const c of digits)mod=(mod*10+Number(c))%97;
 return mod===1;
}
function payload({iban,bic='',name,amount,reference}){
 iban=ibanText(iban);bic=clean(bic).replace(/\s/g,'').toUpperCase();name=clean(name);reference=clean(reference);
 if(!validIban(iban))throw Error('Renseigne un IBAN valide.');
 if(bic&&!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic))throw Error('Le BIC doit comporter 8 ou 11 caractères.');
 if(!name||[...name].length>70)throw Error('Le bénéficiaire doit comporter entre 1 et 70 caractères.');
 if(!Number.isFinite(amount)||amount<0.01||amount>999999999.99)throw Error('Montant hors limites du QR SEPA.');
 if(!reference||[...reference].length>140)throw Error('La référence de paiement doit comporter entre 1 et 140 caractères.');
 const data=['BCD','002','1','SCT',bic,name,iban,'EUR'+amount.toFixed(2),'','',reference].join('\n');
 if(new TextEncoder().encode(data).length>331)throw Error('Les coordonnées sont trop longues pour le QR SEPA.');
 return data;
}
function qrSvg(data){
 if(typeof qrcode!=='function')throw Error('Générateur QR indisponible.');
 qrcode.stringToBytes=s=>Array.from(new TextEncoder().encode(s));
 const qr=qrcode(0,'M');qr.addData(data,'Byte');qr.make();const size=qr.getModuleCount();
 if(size>69)throw Error('QR SEPA trop grand.');
 let path='';for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(qr.isDark(y,x))path+=`M${x+4} ${y+4}h1v1h-1z`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size+8} ${size+8}" width="170" height="170" role="img" aria-label="QR code de paiement SEPA" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><path d="${path}" fill="black"/></svg>`;
}
function render(settings,fallback,amount,number,footer=''){
 const iban=settings.iban||fallback.iban||'',bic=settings.bic||fallback.bic||'';
 const name=settings.paymentName||settings.company||fallback.paymentName||fallback.company||'';
 const reference=clean(number);
 if(!iban)return '';
 let qr='';
 if((settings.paymentQr??fallback.paymentQr)!==false&&amount<=0){qr='<div class="billing-qr-pending" style="font-size:10px;color:#71808b;align-self:center">QR code disponible dès que le montant de la facture est supérieur à 0 €.</div>';}
 if((settings.paymentQr??fallback.paymentQr)!==false&&amount>0){
  try{qr=`<figure class="billing-payment-qr">${qrSvg(payload({iban,bic,name,amount,reference}))}<figcaption>Scanner pour préparer le virement<br>Avec une application bancaire compatible</figcaption></figure>`;}catch(e){console.warn('QR paiement indisponible :',e);qr='<div class="billing-payment-qr billing-qr-error" role="status">QR indisponible : vérifier IBAN, bénéficiaire et communication.</div>';}
 }
 return `<section class="billing-payment"><div class="billing-payment-left"><div class="billing-payment-details"><b>Paiement par virement</b><p>IBAN : <b>${escape(iban)}</b>${bic?' · BIC : '+escape(bic):''} · Communication : <b>${escape(reference)}</b> · ${escape(new Intl.NumberFormat('fr-BE',{style:'currency',currency:'EUR'}).format(amount))}</p></div>${footer?`<div class="billing-invoice-footer">${escape(footer)}</div>`:''}</div>${qr}</section>`;
}
window.SDPayment={defaultFooter,validIban,payload,qrSvg,render};
})();
