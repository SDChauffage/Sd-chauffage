/* Tarifs publics Buderus Belgique : chargement à la demande, aucun prix d'achat. */
(function(){
'use strict';
const source='https://www.buderus.com/be/fr/partenaires/installateurs/documentation/listes-de-prix/';
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
let articles=null,pending=null,selection=[];
const money=n=>new Intl.NumberFormat('fr-BE',{style:'currency',currency:'EUR'}).format(n);
function search(rows,query,category=''){
 const words=String(query).trim().split(/\s+/).map(norm).filter(Boolean);
 if(words.join('').length<2)return [];
 return rows.filter(a=>(!category||a.category===category)&&words.every(w=>a.search.includes(w)));
}
window.SDBuderusCore={norm,search};
window.buderusMount=function(){
 const anchor=document.querySelector('#bill-service')?.closest('.billing-catalog');
 if(!anchor||document.getElementById('buderus-picker'))return;
 anchor.insertAdjacentHTML('afterend',`<details id="buderus-picker" style="margin:16px 0" ontoggle="if(this.open)buderusLoad()"><summary style="cursor:pointer;font-weight:600">Rechercher un article Buderus</summary><p style="font-size:12px;color:var(--muted)">Prix publics conseillés HTVA · tarif juillet 2026 · import du 20/10/2026. Matériel et pièces détachées. Vérifie le prix avant de finaliser le document. <a href="${source}" target="_blank" rel="noopener noreferrer">Tarifs Buderus</a></p><div class="formgrid"><div class="field"><label for="buderus-query">Référence ou nom du produit</label><input id="buderus-query" type="search" placeholder="Ex. RC310, vase, 773…" oninput="buderusSearch()" autocomplete="off"></div><div class="field"><label for="buderus-category">Catalogue</label><select id="buderus-category" onchange="buderusSearch()"><option value="">Tous les articles</option><option value="Appareils et accessoires">Appareils et accessoires</option><option value="Pièces détachées">Pièces détachées</option></select></div></div><div class="field"><label for="buderus-vat">TVA à appliquer à l’article</label><select id="buderus-vat"><option value="21">21 %</option><option value="6">6 %</option><option value="12">12 %</option><option value="0">0 %</option></select></div><p id="buderus-status" role="status" aria-live="polite"></p><div id="buderus-results"></div></details>`);
};
window.buderusLoad=async function(){
 const status=document.getElementById('buderus-status');
 if(!status)return;
 if(articles){window.buderusSearch();return;}
 status.textContent='Chargement du catalogue Buderus…';
 try{
  if(!pending)pending=(async()=>{
   const response=await fetch('./catalogues/buderus-manifest.json?v=20261020');
   if(!response.ok)throw Error('manifest');const manifest=await response.json();
   if(!Array.isArray(manifest.files)||manifest.files.some(f=>!/^buderus-2026-\d+\.json$/.test(f)))throw Error('files');
   const parts=await Promise.all(manifest.files.map(async f=>{const r=await fetch('./catalogues/'+f+'?v=20261020');if(!r.ok)throw Error('catalogue');return r.json();}));
   const rows=parts.flat();
   if(rows.length!==manifest.count||rows.some(a=>typeof a.reference!=='string'||typeof a.name!=='string'||!Number.isFinite(a.price)||a.price<=0||!['Appareils et accessoires','Pièces détachées'].includes(a.category)))throw Error('format');
   return rows.map(a=>({...a,search:norm(a.reference+' '+a.name)}));
  })();
  articles=await pending;window.buderusSearch();
 }catch(e){pending=null;if(document.getElementById('buderus-status'))document.getElementById('buderus-status').innerHTML='Catalogue indisponible. <button type="button" class="btn soft" onclick="buderusLoad()">Réessayer</button>';}
};
window.buderusSearch=function(){
 const input=document.getElementById('buderus-query'),status=document.getElementById('buderus-status'),results=document.getElementById('buderus-results');
 if(!input||!status||!results||!articles)return;
 if(norm(input.value).length<2){selection=[];results.innerHTML='';status.textContent=articles.length.toLocaleString('fr-BE')+' articles. Saisis au moins 2 caractères.';return;}
 const all=search(articles,input.value,document.getElementById('buderus-category').value);selection=all.slice(0,30);
 status.textContent=all.length+' résultat'+(all.length===1?'':'s')+(all.length>30?' · les 30 premiers sont affichés, précise la recherche.':'.');
 results.innerHTML=selection.map((a,i)=>`<div class="actions between" style="padding:12px 0;border-bottom:1px solid var(--line,#ddd);align-items:flex-start"><div style="flex:1;min-width:180px"><b>${esc(a.name)}</b><div style="font-size:12px;color:var(--muted)">Réf. ${esc(a.reference)} · ${esc(a.category)}</div>${a.remark?`<div style="font-size:12px">${esc(a.remark)}</div>`:''}<div>${money(a.price)} HTVA</div></div><button type="button" class="btn soft" onclick="buderusAdd(${i})">Ajouter</button></div>`).join('');
};
window.buderusAdd=function(i){
 const a=selection[i];if(!a)return;
 const vat=Number(document.getElementById('buderus-vat').value);
 if(![0,6,12,21].includes(vat))return;
 if(window.billingAddProduct({...a,vat,source,tariffDate:'2026-07',importedAt:'2026-10-20'})){
  const picker=document.getElementById('buderus-picker');if(picker)picker.open=true;
  const vatSelect=document.getElementById('buderus-vat');if(vatSelect)vatSelect.value=String(vat);
  const status=document.getElementById('buderus-status');if(status)status.textContent='Article ajouté : '+a.reference+'. Recherche le suivant ou continue ton document.';
 }
};
})();
