/* Easy Finder Product: categories, cross-refs, photos, owner mode, image search. */
(function(){
  function efpStartExtras(){
  if(typeof RAW==='undefined'||typeof ROWS==='undefined'||!ROWS.length||!ROWS[0]._sku) return;
  if(window._efpExtrasOn) return;
  window._efpExtrasOn=true;
  const XREFS=RAW.xrefs||{};
  const IMGS=RAW.imgs||{};
  const APPROX=RAW.approx||{};
  const _approxCopy=(src, typ)=>(src?Object.assign({},src,{typ:typ,k:'approx'}):null);
  if(!APPROX['upper arm']) APPROX['upper arm']=_approxCopy(APPROX['control arm'],'upper arm')||{f:'images/approx/control-arm-fahrwerk-jpg.webp',k:'approx',typ:'upper arm',src:'Wikimedia Commons'};
  if(!APPROX['lower arm']) APPROX['lower arm']=_approxCopy(APPROX['control arm'],'lower arm')||{f:'images/approx/track-control-arm-for-a-kia-ceed-01-jpg.webp',k:'approx',typ:'lower arm',src:'Wikimedia Commons'};
  /* Prefer the other existing typical arm photo for upper arms when both files exist. */
  if(APPROX['upper arm']) APPROX['upper arm']=Object.assign({}, APPROX['upper arm'], {f:'images/approx/control-arm-fahrwerk-jpg.webp', typ:'upper arm', k:'approx', src:APPROX['upper arm'].src||'Wikimedia Commons'});
  ['upper arm bush','lower arm bush','control arm bush'].forEach(k=>{ if(!APPROX[k]) APPROX[k]=_approxCopy(APPROX['bushing'],k); });
  ['upper arm ball joint','lower arm ball joint','control arm ball joint'].forEach(k=>{ if(!APPROX[k]) APPROX[k]=_approxCopy(APPROX['ball joint'],k); });
  const SUB_RULES=[
    ["cabin filter", /\b(CABIN|POLLEN|HABITACLE|INTERIOR FILTER|FILTER,? *CABIN)\b/i],
    ["air filter (panel)", /\bAIR FILTER\b|\bAIR CLEANER ELEMENT\b|\bPANEL AIR\b/i],
    ["oil filter (cartridge)", /\bOIL FILTER\b.*\b(ELMT|ELEMENT|CARTRIDGE|INSERT)\b|\bFILTER ELMT\b|\bSET OIL-FILTER\b/i],
    ["oil filter (spin-on)", /\bOIL FILTER\b|\bSPIN.?ON\b/i],
    ["fuel filter", /\bFUEL FILTER\b|\bFILTER,? *FUEL\b/i],
    ["hydraulic filter", /\bHYDRAULIC FILTER\b|\bSTEERING FILTER\b/i],
    ["filter (other)", /\bFILTER\b/i],
    ["brake pad", /\bBRAKE PAD|\bBREAK PAD|\bDISC PAD|\bPAD FRONT|\bPAD REAR|\bPAD WITH SHIM/i],
    ["brake shoe", /\bBRAKE SHOE|\bSHOE BRAKE|\bSHOE FRONT|\bSHOE REAR/i],
    ["brake disc", /\bBRAKE DISC|\bBRAKE ROTOR|\bDISC ROTOR|\bROTOR DISC/i],
    ["brake drum", /\bBRAKE DRUM|\bDRUM BRAKE/i],
    ["brake caliper", /\bCALIPER\b/i],
    ["brake hose / line", /\bBRAKE HOSE|\bBRAKE LINE|\bBRAKE PIPE|\bBRAKE TUBE/i],
    ["brake (other)", /\bBRAKE\b|\bBRAKE BOOSTER|\bMASTER CYLINDER/i],
    ["shock absorber", /\bSHOCK ABSORBER\b|\bSHOCK ABS\b/i],
    ["strut", /\bSTRUT\b|\bMACPHERSON\b/i],
    ["coil spring", /\bCOIL SPRING\b|\bSPRING COIL\b/i],
    ["upper arm bush", /^(?!.*TIE[-\s]?ROD).*(?:\bBUSH(?:ING)?\b|\bSILENTBLOC|\bSILENT BLOCK|\bMOUNTING\b).{0,48}\bUPPER ARM\b|\bUPPER ARM\b.{0,48}(?:\bBUSH(?:ING)?\b|\bSILENTBLOC|\bSILENT BLOCK)|\bBUSH(?:ING)?\b.{0,32}\bUPPER\b.{0,20}\bARM\b/i],
    ["lower arm bush", /^(?!.*TIE[-\s]?ROD).*(?:\bBUSH(?:ING)?\b|\bSILENTBLOC|\bSILENT BLOCK|\bMOUNTING\b).{0,48}\bLOWER ARM\b|\bLOWER ARM\b.{0,48}(?:\bBUSH(?:ING)?\b|\bSILENTBLOC|\bSILENT BLOCK)|\bBUSH(?:ING)?\b.{0,32}\bLOWER\b.{0,20}\bARM\b/i],
    ["control arm bush", /^(?!.*TIE[-\s]?ROD).*(?:\bBUSH(?:ING)?\b|\bSILENTBLOC|\bSILENT BLOCK|\bMOUNTING\b).{0,48}\b(?:CONTROL ARM|WISHBONE|SUSPENSION ARM|TRACK CONTROL ARM)\b|\b(?:CONTROL ARM|WISHBONE|SUSPENSION ARM|TRACK CONTROL ARM)\b.{0,48}(?:\bBUSH(?:ING)?\b|\bSILENTBLOC|\bSILENT BLOCK|\bMOUNTING\b)/i],
    ["upper arm ball joint", /\bBALL JOINT\b.{0,48}\bUPPER ARM\b|\bUPPER ARM\b.{0,48}\bBALL JOINT\b/i],
    ["lower arm ball joint", /\bBALL JOINT\b.{0,48}\bLOWER ARM\b|\bLOWER ARM\b.{0,48}\bBALL JOINT\b/i],
    ["control arm ball joint", /\bBALL JOINT\b.{0,48}\b(?:CONTROL ARM|WISHBONE|SUSPENSION ARM)\b|\b(?:CONTROL ARM|WISHBONE|SUSPENSION ARM)\b.{0,48}\bBALL JOINT\b|\bARM BALL JOINT\b/i],
    ["upper arm", /^(?!.*TIE[-\s]?ROD)(?!.*\bBEARING,?\s*CONTROL ARM).*(?:\bUPPER ARM\b|\bUPPER (?:CONTROL|SUSPENSION|TRACK CONTROL) ARM\b|\b(?:CONTROL|SUSPENSION|TRACK CONTROL) ARM UPPER\b|\bARM UPPER\b|\bCOMPLETE UPPER WISHBONE\b|\bUPPER WISHBONE\b|\bWISHBONE FRT UPPER\b|\bWISHBONE(?:\s|,).{0,12}(?:UPPER|\bUP\b)|\bWISHBONE RR\(UP\))/i],
    ["lower arm", /^(?!.*TIE[-\s]?ROD)(?!.*\bBEARING,?\s*CONTROL ARM).*(?:\bLOWER ARM\b|\bLOWER (?:CONTROL|SUSPENSION|TRACK CONTROL) ARM\b|\b(?:CONTROL|SUSPENSION|TRACK CONTROL) ARM LOWER\b|\bARM LOWER\b|\bWISHBONE,?\s*BOTTOM\b|\bWISHBONE LOWER\b|\bWISHBONE.{0,20}\b(?:LOWER|BOTTOM|LWR)\b)/i],
    ["control arm", /^(?!.*TIE[-\s]?ROD)(?!.*\bBEARING,?\s*CONTROL ARM).*\b(?:CONTROL ARM|WISHBONE|SUSPENSION ARM|TRACK CONTROL ARM|TRACK CONTROL)\b/i],
    ["ball joint", /\bBALL JOINT\b/i],
    ["tie rod", /\bTIE ROD\b|\bTIE-ROD\b|\bDRAG LINK\b/i],
    ["stabilizer / sway bar link", /\bSTABILIZER\b|\bSWAY BAR\b|\bANTI.?ROLL\b|\bDROP LINK\b|\bKOPPEL\b/i],
    ["bushing", /\bBUSHING\b|\bBUSH\b|\bSILENTBLOC|\bSILENT BLOCK/i],
    ["wheel hub / bearing hub", /\bWHEEL HUB\b|\bHUB BEARING\b|\bHUB UNIT\b|\bHUB BALL\b|\bHUB ASSEMBLY/i],
    ["cv joint / axle", /\bCV JOINT\b|\bDRIVE SHAFT\b|\bDRIVESHAFT\b|\bCV AXLE\b|\bAXLE SHAFT\b/i],
    ["wheel bearing", /\bWHEEL BEARING\b/i],
    ["bearing", /\bBEARING\b/i],
    ["piston", /\bPISTON ASSY\b|\bPISTON\b/i],
    ["ring set", /\bPISTON RING|\bRING SET\b/i],
    ["engine valve", /\bVALVE,EXHAUST|\bVALVE,INTAKE|\bEXHAUST VALVE|\bINTAKE VALVE|\bENGINE VALVE/i],
    ["timing chain / kit", /\bTIMING CHAIN|\bCHAIN KIT\b/i],
    ["timing belt", /\bTIMING BELT\b/i],
    ["camshaft / crankshaft", /\bCAMSHAFT\b|\bCRANKSHAFT\b/i],
    ["serpentine / V-ribbed belt", /\bRIB ACE\b|\bRIBBED BELT\b|\bSERPENTINE\b|\bV-RIB|\bPK BELT\b|\bFAN BELT\b|\bDRIVE BELT\b|\bV BELT\b|\bBELT,V/i],
    ["belt tensioner", /\bTENSIONER\b|\bIDLER\b/i],
    ["pulley", /\bPULLEY\b/i],
    ["radiator cap", /\bRADIATOR CAP\b/i],
    ["radiator", /\bRADIATOR\b/i],
    ["water pump", /\bWATER PUMP\b/i],
    ["thermostat", /\bTHERMOSTAT\b/i],
    ["cooling fan", /\bCOOLING FAN\b|\bFAN MOTOR\b|\bCONDENSER FAN\b/i],
    ["blower motor", /\bBLOWER MOTOR\b|\bBLOWER\b/i],
    ["compressor / AC", /\bCOMPRESSOR\b|\bAIR COND|\bCONDENSER\b|\bEVAPORATOR\b/i],
    ["oil cooler", /\bOIL COOLER\b/i],
    ["ignition coil", /\bIGNITION COIL\b|\bCOIL,IGN/i],
    ["spark plug", /\bSPARK PLUG\b/i],
    ["glow plug", /\bGLOW PLUG\b/i],
    ["battery", /\bBATTERY\b/i],
    ["bulb H4", /\bH4\b/i],
    ["bulb H7", /\bH7\b/i],
    ["bulb H11 / HB", /\bH11\b|\bHB3\b|\bHB4\b|\bH8\b|\bH9\b/i],
    ["bulb (other)", /\bBULB\b|\bLAMP\b|\bHEADLIGHT\b|\bHEADLAMP\b/i],
    ["wiper blade", /\bWIPER\b/i],
    ["alternator", /\bALTERNATOR\b/i],
    ["starter", /\bSTARTER\b/i],
    ["sensor", /\bSENSOR\b|\bLAMBDA\b|\bO2 SENSOR\b/i],
    ["clutch kit / disc", /\bCLUTCH KIT\b|\bCLUTCH DISC\b|\bCLUTCH COVER\b|\bCLUTCH PLATE\b|\bCLUTCH PRESSURE/i],
    ["clutch release bearing", /\bCLUTCH RELEASE|\bRELEASE BEARING\b/i],
    ["clutch (other)", /\bCLUTCH\b/i],
    ["flywheel", /\bFLYWHEEL\b/i],
    ["transmission / gearbox part", /\bGEARBOX\b|\bTRANSMISSION\b|\bSYNCHRO\b|\bTRANSFER CASE\b|\bTRANSFER SHIFT/i],
    ["fuel injector", /\bINJECTOR\b/i],
    ["fuel pump", /\bFUEL PUMP\b/i],
    ["fuel line / tank", /\bFUEL LINE\b|\bFUEL PIPE\b|\bFUEL TANK\b|\bFUEL HOSE\b|\bFUEL CAP\b/i],
    ["head gasket", /\bGASKET HEAD\b|\bHEAD GASKET\b|\bGASKET,HEAD\b/i],
    ["full gasket set", /\bGASKET FULL\b|\bGASKET SET\b|\bOVERHAUL GASKET\b/i],
    ["gasket / seal", /\bGASKET\b|\bSEAL\b|\bO-RING\b|\bORING\b|\bOIL SEAL\b/i],
    ["horn", /\bHORN\b/i],
    ["hose", /\bHOSE\b/i],
    ["bolt / nut / hardware", /\bBOLT\b|\bNUT\b|\bWASHER\b|\bCLIP\b|\bCLAMP\b|\bSCREW\b/i],
    ["turbocharger", /\bTURBOCHARGER\b|\bTURBO\b/i],
    ["exhaust part", /\bEXHAUST\b|\bMUFFLER\b|\bSILENCER\b|\bCATALYTIC\b/i],
    ["engine oil", /\bENGINE OIL\b|\bMOTOR OIL\b|\b0W-|\b5W-|\b10W-|\b15W-|\b20W-/i],
    ["ATF / transmission fluid", /\bATF\b|\bDEXRON\b|\bGEAR OIL\b|\bTRANSMISSION FLUID\b/i],
    ["grease", /\bGREASE\b/i],
    ["chemical / additive", /\bCLEANER\b|\bADDITIVE\b|\bBRAKE FLUID\b|\bCOOLANT\b|\bANTIFREEZE\b|\bSPRAY\b/i],
    ["oil pump", /\bOIL PUMP\b/i],
    ["pump (other)", /\bPUMP\b/i],
  ];
  const SUB_FALLBACK={"Bearings": "bearing", "Steering & Suspension": "steering / suspension part", "Braking": "brake (other)", "Engine Internals": "engine part", "Filters": "filter (other)", "Cooling & Climate": "cooling part", "Transmission & Clutch": "clutch (other)", "Hardware & Hoses": "hose", "Belts & Pulleys": "serpentine / V-ribbed belt", "Gaskets & Seals": "gasket / seal", "Body & Lighting": "bulb (other)", "Electrical & Sensors": "sensor", "Fuel System": "fuel system part", "Pumps": "pump (other)", "Lubricants & Fluids": "engine oil", "Turbo & Exhaust": "exhaust part", "Other Parts": "automotive spare part"};
  const LUBE_RULES=[
    ["ATF / transmission fluid", /\bMTF\b|\bGL-?[1-5]\b|\bCVT\b|\bSYN OEM\b|\bGEAR OIL\b|\bTRANSMISSION (OIL|FLUID)\b/i],
    ["chemical / additive", /\bFLUSH\b|\bOCTANE\b|\bAXIS L\d|\bHYDRAULIC (OIL|FLUID)\b|\bPOWER STEERING\b|\bADDITIVE\b|\bCLEANER\b/i],
  ];
  function subtypeOf(desc, cat){
    const d=desc||'';
    if(cat==='Lubricants & Fluids'){ for(const [name,rx] of LUBE_RULES){ if(rx.test(d)) return name; } }
    for(const [name,rx] of SUB_RULES){ if(rx.test(d)) return name; }
    return SUB_FALLBACK[cat||'']||'automotive spare part';
  }
  function shippedImgs(sku, desc, cat){
    if(IMGS[sku]&&IMGS[sku].length) return IMGS[sku];
    const t=subtypeOf(desc, cat);
    const rec=APPROX[t];
    return rec?[Object.assign({},rec,{typ:t,k:'approx'})]:[];
  }
  const PIN_H='efp-owner-hash', PIN_S='efp-owner-salt', PIN_OK='efp-owner-ok';
  const IDB_NAME='efp-owner-photos', IDB_STORE='photos';
  const EMB_URL='embeddings.json';
  const MODEL_JSON='vendor/mobilenet/model.json';
  if(!DataView.prototype.getFloat16){
    DataView.prototype.getFloat16=function(byteOffset, littleEndian){
      const u=this.getUint16(byteOffset, littleEndian);
      const s=(u&0x8000)>>15, e=(u&0x7C00)>>10, f=u&0x03FF;
      if(e===0) return (s?-1:1)*Math.pow(2,-14)*(f/1024);
      if(e===0x1F) return f?NaN:((s?-1:1)*Infinity);
      return (s?-1:1)*Math.pow(2,e-15)*(1+f/1024);
    };
  }
  const MORE_N=4;
  let browse='vehicle';
  let ownerOn=false;
  let ownSkuSet=new Set();
  let myphUrls=[];
  let imgHits=null; /* [{r, score}] or null */
  let imgMsg='';
  let modelP=null, embedder=null, catalogEmb=null;
  let toastT=null;

  const PRICES=RAW.prices||{};
  const fmtAED=n=>Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  /* price: [incl_vat, ex_vat, pack, discontinued]; no price (or null) -> "Price on request" */
  function availText(r){
    const p=r._price;
    if(p && p.length>4 && p[4]!=null && p[4]!==''){
      const n=+p[4];
      if(n>0) return 'In stock: '+n;
      if(n===0) return 'Out of stock';
    }
    return 'Ask for availability';
  }
  function availHtml(r){
    const t=availText(r);
    const cls=t.startsWith('In stock')?'ok':(t==='Out of stock'?'out':'ask');
    return `<span class="stk ${cls}">${esc(t)}</span>`;
  }
  function priceHtml(r){
    const p=r._price;
    if(!p||p[0]==null) return '<div class="price none">Price on request</div>';
    const pk=(p[2]&&p[2]!=='Per unit')?` <span class="pk">\u00b7 ${esc(p[2])}</span>`:(p[2]==='Per unit'?' <span class="pk">\u00b7 per unit</span>':'');
    return `<div class="price"><span class="cur">AED</span> <b>${fmtAED(p[0])}</b> <small>incl. 5% VAT</small>${pk}${p[3]?' <span class="disc">Discontinued</span>':''}</div>`;
  }
  function priceDetail(r){
    const p=r._price;
    if(!p||p[0]==null) return '<div class="k">Price</div><div class="price none big">Price on request</div>';
    const ex=(p[1]!=null)?`<div class="k" style="margin-top:2px">AED ${fmtAED(p[1])} excl. VAT</div>`:'';
    const pk=(p[2]&&p[2]!=='Per unit')?`<div class="k" style="margin-top:2px">Pack: ${esc(p[2])}</div>`:'<div class="k" style="margin-top:2px">Per unit</div>';
    return `<div class="k">Price</div><div class="price big"><span class="cur">AED</span> <b>${fmtAED(p[0])}</b> <small>incl. 5% VAT</small>${p[3]?' <span class="disc">Discontinued</span>':''}</div>${ex}${pk}`;
  }
  ROWS.forEach(r=>{
    r._price=PRICES[r._sku]||null;
    r._xrefs=XREFS[r._sku]||[];
    r._imgs=shippedImgs(r._sku,r._desc,r._cat);
    if(r._xrefs.length){
      r.u+=' '+r._xrefs.join(' ').toUpperCase();
      r.k+=' '+r._xrefs.map(N).join(' ');
    }
    const typ=subtypeOf(r._desc,r._cat);
    r._sub=typ;
    const d=r._desc||'';
    let axle='';
    if(/\bFRONT\b|\bFRT\b/.test(d) || /\bFR\b/.test(d)) axle='front';
    if(/\bREAR\b|\bRR\b/.test(d)) axle=axle==='front'?'both':'rear';
    r._armAxle=axle;
    if(typ==='upper arm'||typ==='upper arm bush'||typ==='upper arm ball joint') r._cat='Upper arm';
    else if(typ==='lower arm'||typ==='lower arm bush'||typ==='lower arm ball joint') r._cat='Lower arm';
    else if(typ==='control arm'||typ==='control arm bush'||typ==='control arm ball joint') r._cat='Control arm';
    if(r._cat==='Upper arm'||r._cat==='Lower arm'||r._cat==='Control arm'){
      /* refresh approx thumb now that the subtype is known */
      if(!(IMGS[r._sku]&&IMGS[r._sku].length)) r._imgs=shippedImgs(r._sku,r._desc,r._cat);
    }
  });
  const bySku={};
  ROWS.forEach(r=>{ bySku[r._sku]=r; });

  /* ---------- DOM chrome ---------- */
  const style=document.createElement('style');
  style.textContent=`
.hdr-actions{margin-left:auto;display:flex;gap:8px;align-items:center}.hdr-actions .theme-toggle{margin-left:0}
.modes{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}
.xref{margin-top:4px;display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:11px;color:var(--mu)}
.xref b{font-weight:700;color:var(--mu);margin-right:2px}
.xchip{display:inline-block;border:1px solid var(--bd);background:var(--bg);color:var(--tx);
  border-radius:8px;padding:1px 7px;font-size:11px;font-weight:650;cursor:pointer;box-shadow:var(--inset)}
.xchip:hover{border-color:var(--cu);color:var(--cu)}
.xmore{border:0;background:transparent;color:var(--cu);font-weight:700;cursor:pointer;font-size:11px;padding:0 4px}
.thumb{width:48px;height:48px;object-fit:cover;border-radius:8px;background:var(--hl);border:1px solid var(--bd);flex-shrink:0}
.td-item{display:flex;gap:8px;align-items:flex-start}
.badge{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.02em;text-transform:uppercase;
  background:var(--cu);color:#fff;border-radius:6px;padding:1px 6px;margin-right:4px}
.badge.own{background:#1a7f4e}
.badge.approx{background:#8a6a00}
.gallery{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.gallery figure{margin:0;width:110px}
.gallery img{width:110px;height:110px;object-fit:cover;border-radius:10px;border:1px solid var(--bd);cursor:zoom-in;background:var(--hl)}
.gallery figcaption{font-size:10px;color:var(--mu);margin-top:3px}
#lb{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:20;padding:16px}
#lb.open{display:flex}
#lb img{max-width:100%;max-height:100%;border-radius:12px;box-shadow:0 12px 40px #000}
.modal-back{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;z-index:18;padding:16px}
.modal-back.open{display:flex}
.modal{background:var(--card);color:var(--tx);border-radius:16px;padding:18px;max-width:360px;width:100%;box-shadow:var(--shadow);border:1px solid var(--bd)}
.modal h3{margin:0 0 8px;color:var(--cu)}
.modal p{margin:0 0 10px;color:var(--mu);font-size:13px}
.modal input{margin:6px 0 10px}
.modal .row{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}
#toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#1a1214;color:#fff;
  padding:8px 14px;border-radius:10px;font-size:13px;opacity:0;pointer-events:none;z-index:30;transition:.2s}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
#clist{overflow:auto;flex:1;padding:0 6px 8px;display:none}
.side.cat-mode #mlist,.side.cat-mode #vlist,.side.cat-mode #ms,.side.cat-mode #vs,
.side.cat-mode h3.veh-h{display:none}
.side.cat-mode #clist{display:block}
#imgq-status{font-size:12px;color:var(--mu);margin:6px 0 0}
imgq-note, .imgq-note{font-size:13px;color:var(--cu);font-weight:700;margin:0 0 6px}
.price{margin-top:3px;font-size:12px;color:var(--mu)}
.price b{color:var(--cu);font-size:15px;font-weight:800}
.price .cur{font-weight:700;color:var(--cu);font-size:11px}
.price .pk{color:var(--mu)}
.price .disc{display:inline-block;background:#8a6a00;color:#fff;border-radius:6px;padding:0 6px;font-size:10px;font-weight:800;text-transform:uppercase}
.price.none{font-style:italic;color:var(--mu)}
.price.big{font-size:13px;margin-top:2px}.price.big b{font-size:22px}
.add-photo{margin-top:10px}
.del-own{display:block;margin-top:2px;font-size:10px;color:var(--cu);cursor:pointer;background:none;border:0;padding:0}
  `;
  document.head.appendChild(style);

  const th=$('th');
  if(th && !th.parentElement.classList.contains('hdr-actions')){
    const wrap=document.createElement('div');
    wrap.className='hdr-actions';
    const ob=document.createElement('button');
    ob.type='button'; ob.id='ownerBtn'; ob.className='theme-toggle';
    ob.setAttribute('aria-label','Owner mode'); ob.title='Owner mode';
    ob.textContent='Owner';
    th.parentElement.insertBefore(wrap, th);
    wrap.appendChild(ob);
    wrap.appendChild(th);
  }
  const top=document.querySelector('.top');
  if(top && !$('modes')){
    const modes=document.createElement('div');
    modes.className='modes'; modes.id='modes';
    modes.innerHTML=`<button type="button" class="chip on" data-mode="vehicle" id="mode-veh">Vehicles</button>
      <button type="button" class="chip" data-mode="category" id="mode-cat">Categories</button>
      <button type="button" class="chip" id="imgq-btn">Search by image</button>
      <button type="button" class="chip" id="myph-btn" hidden>My photos</button>
      <input type="file" id="imgq-file" accept="image/*" capture="environment" hidden>
      <input type="file" id="own-file-cam" accept="image/*" capture="environment" hidden>
      <input type="file" id="own-file-gal" accept="image/*" multiple hidden>`;
    top.insertBefore(modes, top.firstChild);
    const st=document.createElement('div');
    st.id='imgq-status';
    top.appendChild(st);
  }
  const side=document.querySelector('.side');
  if(side){
    side.querySelectorAll('h3').forEach((h,i)=>{h.classList.add('veh-h');});
    if(!$('clist')){
      const c=document.createElement('div'); c.id='clist';
      side.appendChild(c);
    }
    /* category heading */
    if(!$('cat-h')){
      const h=document.createElement('h3');
      h.id='cat-h'; h.textContent='Browse categories'; h.style.display='none';
      side.insertBefore(h, $('clist'));
    }
  }
  if(!$('lb')){
    const lb=document.createElement('div'); lb.id='lb'; lb.innerHTML='<img alt="">';
    lb.onclick=()=>lb.classList.remove('open');
    document.body.appendChild(lb);
  }
  if(!$('efp-modal')){
    const mb=document.createElement('div'); mb.className='modal-back'; mb.id='efp-modal';
    mb.innerHTML='<div class="modal" id="efp-modal-box"></div>';
    mb.addEventListener('click',e=>{ if(e.target===mb) closeModal(); });
    document.body.appendChild(mb);
  }
  if(!$('toast')){
    const t=document.createElement('div'); t.id='toast'; document.body.appendChild(t);
  }

  function toast(msg){
    const t=$('toast'); if(!t) return;
    t.textContent=msg; t.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'), 1800);
  }
  function openLightbox(src){
    const lb=$('lb'); const img=lb.querySelector('img');
    img.src=src; lb.classList.add('open');
  }
  function closeModal(){ $('efp-modal').classList.remove('open'); }
  function openModal(html){
    $('efp-modal-box').innerHTML=html;
    $('efp-modal').classList.add('open');
  }

  /* ---------- Cross-ref chips ---------- */
  function xrefHtml(r, expanded){
    const xs=r._xrefs||[];
    if(!xs.length) return '';
    const show=expanded?xs:xs.slice(0,MORE_N);
    const more=(!expanded && xs.length>MORE_N)?`<button type="button" class="xmore" data-exp="${esc(r._sku)}">+${xs.length-MORE_N} more</button>`:'';
    return `<div class="xref"><b>Cross ref:</b>${show.map(x=>`<button type="button" class="xchip" data-copy="${esc(x)}" title="Copy">${esc(x)}</button>`).join('')}${more}</div>`;
  }
  document.addEventListener('click',e=>{
    const chip=e.target.closest('.xchip');
    if(chip && chip.dataset.copy){
      e.preventDefault(); e.stopPropagation();
      const v=chip.dataset.copy;
      (navigator.clipboard&&navigator.clipboard.writeText(v)?navigator.clipboard.writeText(v):Promise.reject())
        .catch(()=>{ const i=document.createElement('input'); i.value=v; document.body.appendChild(i); i.select(); try{document.execCommand('copy');}catch(err){} i.remove(); })
        .then(()=>toast('Copied '+v));
      return;
    }
    const more=e.target.closest('.xmore');
    if(more){
      e.preventDefault(); e.stopPropagation();
      const r=bySku[more.dataset.exp]; if(!r) return;
      more.parentElement.outerHTML=xrefHtml(r,true);
    }
  });

  /* ---------- Images (shipped + owner) ---------- */
  function shippedSrc(im){ return im.f; }
  function kindLabel(im){
    if(im.own) return 'My photo';
    const k=(im.k||'photo').toLowerCase();
    if(k==='diagram') return 'Diagram';
    if(k==='image') return 'Image';
    if(k==='approx'||k==='approximate'){
      const t=im.typ||im.t||'part';
      return 'Approximate – typical '+t;
    }
    if(im.src) return 'Source: '+im.src;
    return 'Photo';
  }
  async function allImagesFor(sku){
    const own=ownerOn?await listOwn(sku):await listOwn(sku).catch(()=>[]);
    const shipped=(bySku[sku]&&bySku[sku]._imgs)||[];
    const out=[];
    (own||[]).forEach(o=>out.push({f:o.url, k:'photo', own:true, id:o.id}));
    shipped.forEach(s=>out.push(s));
    return out;
  }
  function thumbHtml(imgs){
    if(!imgs||!imgs.length) return '';
    const first=imgs[0];
    const lab=kindLabel(first);
    return `<img class="thumb" src="${esc(shippedSrc(first))}" alt="${esc(lab)}" data-full="${esc(shippedSrc(first))}">`;
  }

  /* ---------- Override draw / details / run ---------- */
  const _draw=draw;
  const _run=run;
  const _appOk=appOk;

  window.draw=function(){
    const slice=res.slice(0,shown);
    const heading=imgHits? 'Closest looking parts, confirm by part number' : null;
    if($('cnt')){
      $('cnt').textContent=res.length.toLocaleString()+(imgHits?' closest':' matches');
    }
    const rows=slice.map((r,i)=>{
      const score=imgHits && r._sim!=null? `<div class="xref">Similarity ${Math.round(r._sim*100)}%${r._simApprox?' · <span class="badge approx">Approximate – typical '+esc(r._simTyp||'part')+'</span>':''}</div>`:'';
      const imgs=r._dispImgs||r._imgs;
      const my=ownSkuSet.has(r._sku)?'<span class="badge own">My photo</span> ':'';
      return `<tr data-i="${i}">
        <td><div class="td-item">${thumbHtml(imgs)}<div><b>${esc(r._sku)}</b> ${my}${priceHtml(r)}${xrefHtml(r,false)}${score}</div></div></td>
        <td>${esc(r._desc)}</td>
        <td>${esc(r._brand)}</td>
        <td>${appText(r).map(x=>'<span class="tag">'+esc(x)+'</span>').join(' ')}</td>
        <td>${(r._years||[]).map(([a,b])=>esc(yrLab(a,b))).join(', ')}</td>
        <td>${r._eng.map(e=>'<span class="tag">'+esc(e)+'</span>').join(' ')}</td>
        <td>${esc(r._cat)}</td>
        <td>${esc(r._uom)}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="8" style="color:var(--mu);padding:20px">No matches.</td></tr>';
    $('tb').innerHTML=rows;
    $('more').style.display=shown<res.length?'':'none';
    /* attach own thumbs asynchronously */
    fillListThumbs(slice);
  };

  async function fillListThumbs(slice){
    for(let i=0;i<slice.length;i++){
      const r=slice[i];
      const imgs=await allImagesFor(r._sku);
      r._dispImgs=imgs;
      const cell=$('tb').querySelector(`tr[data-i="${i}"] .td-item`);
      if(!cell||!imgs.length) continue;
      const th=cell.querySelector('.thumb');
      if(th){ th.src=imgs[0].f; th.dataset.full=imgs[0].f; th.alt=kindLabel(imgs[0]); }
      else{
        const wrap=cell;
        wrap.insertAdjacentHTML('afterbegin', thumbHtml(imgs));
      }
    }
  }

  window.run=function(){
    if(imgHits){
      fillYearEng(imgHits.map(h=>h.r));
      let base=imgHits.map(h=>{ h.r._sim=h.score; return h.r; });
      base=base.filter(r=>(!year||yearHit(r._years,year))&&(!eng||r._eng.includes(eng)));
      if(browse==='category' && cat) base=base.filter(r=>r._cat===cat);
      else if(cat) base=base.filter(r=>r._cat===cat);
      const cc={}; base.forEach(r=>cc[r._cat]=(cc[r._cat]||0)+1);
      $('chips').innerHTML=`<button type="button" class="chip ${cat?'':'on'}" data-c="">All ${base.length}</button>`+
        Object.keys(cc).sort((a,b)=>cc[b]-cc[a]).map(c=>`<button type="button" class="chip ${c===cat?'on':''}" data-c="${esc(c)}">${esc(c)} ${cc[c]}</button>`).join('');
      res=base;
      $('vt').innerHTML='Closest looking parts, confirm by part number';
      shown=Math.max(STEP, 10);
      draw();
      return;
    }
    _run();
    if(browse==='category'){
      const bits=cat?`Category <b>${esc(cat)}</b>`:'All categories';
      const veh=(make||model!==null)?` · ${esc([make, model===null?'':(model||'Unspecified')].filter(Boolean).join(' · '))}`:'';
      $('vt').innerHTML=bits+veh;
    }
  };

  function clist(){
    const counts={};
    ROWS.forEach(r=>{ counts[r._cat]=(counts[r._cat]||0)+1; });
    const cats=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]||a.localeCompare(b));
    let h=`<div class="v ${!cat?'on':''}" data-c=""><span>All categories</span><small>${ROWS.length.toLocaleString()}</small></div>`;
    cats.forEach(c=>{
      h+=`<div class="v ${c===cat?'on':''}" data-c="${esc(c)}"><span>${esc(c)}</span><small>${counts[c].toLocaleString()}</small></div>`;
    });
    if($('clist')) $('clist').innerHTML=h;
  }
  function setBrowse(mode){
    browse=mode;
    const sideEl=document.querySelector('.side');
    if(sideEl) sideEl.classList.toggle('cat-mode', mode==='category');
    if($('mode-veh')) $('mode-veh').classList.toggle('on', mode==='vehicle');
    if($('mode-cat')) $('mode-cat').classList.toggle('on', mode==='category');
    if($('cat-h')) $('cat-h').style.display=mode==='category'?'':'none';
    if(mode==='category') clist();
    run();
  }
  if($('mode-veh')) $('mode-veh').onclick=()=>setBrowse('vehicle');
  if($('mode-cat')) $('mode-cat').onclick=()=>setBrowse('category');
  if($('clist')) $('clist').onclick=e=>{
    const d=e.target.closest('.v'); if(!d) return;
    cat=d.dataset.c||''; clist(); shown=STEP; run();
  };

  $('tb').onclick=e=>{
    if(e.target.closest('.xchip,.xmore')) return;
    const full=e.target.closest('img[data-full]');
    if(full){ e.stopPropagation(); openLightbox(full.dataset.full); return; }
    const t=e.target.closest('tr[data-i]'); if(!t) return;
    const r=res[+t.dataset.i]; if(!r) return;
    openDetails(r);
  };

  async function openDetails(r){
    const imgs=await allImagesFor(r._sku);
    const gal=imgs.length? `<div class="k">Pictures</div><div class="gallery">${imgs.map(im=>`
      <figure>
        <img src="${esc(im.f)}" alt="${esc(kindLabel(im))}" data-full="${esc(im.f)}">
        <figcaption><span class="badge ${im.own?'own':''}">${esc(kindLabel(im))}</span>${im.own&&ownerOn?`<button type="button" class="del-own" data-del="${esc(im.id)}">Remove</button>`:''}</figcaption>
      </figure>`).join('')}</div>`:`<div class="k">Pictures</div><p class="k" style="margin:4px 0 0">No picture on file for this part.</p>`;
    const add=ownerOn?`<div class="add-photo"><button type="button" id="take-photo-btn">Take photo</button><button type="button" class="ghost" id="gallery-photo-btn">Choose from gallery</button></div>`:'';
    $('det').innerHTML=`<button class="ghost" onclick="document.getElementById('det').classList.remove('open')" style="float:right">\u2715</button>
      <h2>${esc(r._sku)}</h2>
      ${priceDetail(r)}
      <div class="k">Availability</div>${availHtml(r)}
      <div class="k">Description</div>${esc(r._desc)}
      <div class="k">Brand</div>${esc(r._brand)}
      <div class="k">Category</div>${esc(r._cat)}
      <div class="k">UoM</div>${esc(r._uom)||'\u2014'}
      ${efpDiagramLink(r)}
      <div class="k">Cross ref</div>${(r._xrefs&&r._xrefs.length)?r._xrefs.map(x=>`<button type="button" class="xchip" data-copy="${esc(x)}">${esc(x)}</button>`).join(' '):'\u2014'}
      ${gal}${add}
      <div class="k">Application (from description)</div>${appText(r).join('<br>')||'\u2014'}
      <div class="k">Year in description</div>${(r._years||[]).map(([a,b])=>yrLab(a,b)).join(', ')||'\u2014'}
      <div class="k">Engine in description</div>${r._eng.join(', ')||'\u2014'}
      <p class="k">Confirm fitment before sale. These tags are parsed from the item description and are not verified fitment. Stock quantities are not shown. Prices are in AED incl. 5% VAT as per the price list; confirm before sale.</p>`;
    $('det').classList.add('open');
    $('det').querySelectorAll('img[data-full]').forEach(im=>im.onclick=ev=>{ ev.stopPropagation(); openLightbox(im.dataset.full); });
    const takeBtn=$('take-photo-btn'), galBtn=$('gallery-photo-btn');
    if(takeBtn) takeBtn.onclick=()=>{ const i=$('own-file-cam'); i.dataset.sku=r._sku; i.click(); };
    if(galBtn) galBtn.onclick=()=>{ const i=$('own-file-gal'); i.dataset.sku=r._sku; i.click(); };
    $('det').querySelectorAll('.del-own').forEach(btn=>{
      btn.onclick=async ev=>{ ev.stopPropagation(); await deleteOwn(btn.dataset.del); await refreshOwnIndex(); toast('Photo removed'); openDetails(r); draw(); if($('myphotos-sec') && !$('myphotos-sec').hidden) renderMyPhotos(); };
    });
  }

  const _csv=$('csv').onclick;
  $('csv').onclick=()=>{
    const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
    const L=[['Item No.','Description','Brand','Category','UoM','Price (AED incl. 5% VAT)','Pack','Cross refs','Application (from description)','Year','Engine'].join(',')].concat(
      res.map(r=>[r._sku,r._desc,r._brand,r._cat,r._uom,(r._price&&r._price[0]!=null)?r._price[0].toFixed(2):'Price on request',(r._price&&r._price[2])||'',(r._xrefs||[]).join(' | '),appText(r).join(' | '),(r._years||[]).map(([a,b])=>yrLab(a,b)).join(' | '),r._eng.join(' | ')].map(q).join(','))
    );
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['\ufeff'+L.join('\r\n')],{type:'text/csv'}));
    a.download='easy-finder-product-'+(make||cat||'all').replace(/\W+/g,'_')+'.csv'; a.click();
  };

  /* ---------- Owner mode (PIN hashed on device, IndexedDB photos) ---------- */
  function randSalt(){
    const a=new Uint8Array(16); crypto.getRandomValues(a);
    return [...a].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function hashPin(pin, salt){
    const buf=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt+':'+pin));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function pinOk(p){ return /^\d{4,6}$/.test(p||''); }
  function hasPin(){ try{ return !!localStorage.getItem(PIN_H); }catch(e){ return false; } }
  function isUnlocked(){ try{ return sessionStorage.getItem(PIN_OK)==='1'; }catch(e){ return false; } }
  function setUnlocked(v){ try{ v?sessionStorage.setItem(PIN_OK,'1'):sessionStorage.removeItem(PIN_OK); }catch(e){} ownerOn=!!v; updateOwnerBtn(); }
  function updateOwnerBtn(){
    const b=$('ownerBtn'); if(!b) return;
    b.textContent=ownerOn?'Owner ✓':'Owner';
    b.title=ownerOn?'Owner mode on — tap for My photos, export or lock':'Owner mode';
    const mb=$('myph-btn'); if(mb) mb.hidden=!ownerOn;
    if(!ownerOn && $('myphotos-sec')) $('myphotos-sec').hidden=true;
  }
  function ownerMenu(){
    openModal(`<h3>Owner mode</h3>
      <p>Photos you add stay on this device and work offline. Open My photos to browse them, or export a file to include them in the next published release.</p>
      <div class="row">
        <button type="button" id="own-gallery">My photos</button>
        <button type="button" class="ghost" id="own-export">Export my photos</button>
      </div>
      <div class="row">
        <button type="button" class="ghost" id="own-lock">Lock</button>
        <button type="button" class="ghost" id="own-cancel">Close</button>
      </div>`);
    $('own-cancel').onclick=closeModal;
    $('own-lock').onclick=()=>{ setUnlocked(false); closeModal(); toast('Owner mode locked'); draw(); if($('det').classList.contains('open')){ const sku=$('det').querySelector('h2'); if(sku){ const r=bySku[sku.textContent]; if(r) openDetails(r);} } };
    $('own-export').onclick=()=>{ closeModal(); exportOwn(); };
    $('own-gallery').onclick=()=>{ closeModal(); openMyPhotos(); };
  }
  function askSetPin(){
    openModal(`<h3>Set owner PIN</h3>
      <p>Choose a 4–6 digit PIN. It is stored only on this device (hashed). There is no server and no way to recover it if you forget it.</p>
      <input id="pin1" type="password" inputmode="numeric" maxlength="6" placeholder="PIN (4–6 digits)" autocomplete="new-password">
      <input id="pin2" type="password" inputmode="numeric" maxlength="6" placeholder="Confirm PIN" autocomplete="new-password">
      <div class="row"><button type="button" class="ghost" id="pin-cancel">Cancel</button><button type="button" id="pin-save">Save PIN</button></div>`);
    $('pin-cancel').onclick=closeModal;
    $('pin-save').onclick=async()=>{
      const a=$('pin1').value, b=$('pin2').value;
      if(!pinOk(a)){ toast('PIN must be 4–6 digits'); return; }
      if(a!==b){ toast('PINs do not match'); return; }
      const salt=randSalt(); const h=await hashPin(a,salt);
      try{ localStorage.setItem(PIN_S,salt); localStorage.setItem(PIN_H,h); }catch(e){ toast('Could not save PIN'); return; }
      setUnlocked(true); closeModal(); toast('Owner mode unlocked');
    };
  }
  function askUnlock(){
    openModal(`<h3>Unlock owner mode</h3>
      <p>Enter your 4–6 digit PIN. It never leaves this device.</p>
      <input id="pinu" type="password" inputmode="numeric" maxlength="6" placeholder="PIN" autocomplete="current-password">
      <div class="row"><button type="button" class="ghost" id="pin-cancel">Cancel</button><button type="button" id="pin-go">Unlock</button></div>`);
    $('pin-cancel').onclick=closeModal;
    const go=async()=>{
      const p=$('pinu').value;
      if(!pinOk(p)){ toast('PIN must be 4–6 digits'); return; }
      let salt,h; try{ salt=localStorage.getItem(PIN_S); h=localStorage.getItem(PIN_H); }catch(e){}
      if(!salt||!h){ askSetPin(); return; }
      const got=await hashPin(p,salt);
      if(got!==h){ toast('Incorrect PIN'); return; }
      setUnlocked(true); closeModal(); toast('Owner mode unlocked');
    };
    $('pin-go').onclick=go;
    $('pinu').addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
  }
  if($('ownerBtn')) $('ownerBtn').onclick=()=>{
    if(ownerOn){ ownerMenu(); return; }
    if(!hasPin()) askSetPin(); else askUnlock();
  };
  if(isUnlocked()){ ownerOn=true; updateOwnerBtn(); }

  function idb(){
    return new Promise((res,rej)=>{
      const r=indexedDB.open(IDB_NAME,1);
      r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(IDB_STORE)){ const s=db.createObjectStore(IDB_STORE,{keyPath:'id'}); s.createIndex('sku','sku',{unique:false}); } };
      r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);
    });
  }
  async function listOwn(sku){
    const db=await idb();
    return new Promise((res,rej)=>{
      const tx=db.transaction(IDB_STORE,'readonly');
      const idx=tx.objectStore(IDB_STORE).index('sku');
      const q=idx.getAll(sku);
      q.onsuccess=()=>{
        const rows=q.result||[];
        res(rows.map(p=>({id:p.id, sku:p.sku, url:URL.createObjectURL(p.blob), mime:p.mime, ts:p.ts})));
      };
      q.onerror=()=>rej(q.error);
    });
  }
  async function allOwn(){
    const db=await idb();
    return new Promise((res,rej)=>{
      const q=db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).getAll();
      q.onsuccess=()=>res(q.result||[]);
      q.onerror=()=>rej(q.error);
    });
  }
  async function saveOwn(sku, blob, mime){
    const db=await idb();
    const rec={id:sku+'__'+Date.now()+'__'+Math.random().toString(36).slice(2,8), sku, blob, mime:mime||blob.type||'image/webp', ts:Date.now(), w:0, h:0};
    return new Promise((res,rej)=>{
      const q=db.transaction(IDB_STORE,'readwrite').objectStore(IDB_STORE).put(rec);
      q.onsuccess=()=>res(rec); q.onerror=()=>rej(q.error);
    });
  }
  async function deleteOwn(id){
    const db=await idb();
    return new Promise((res,rej)=>{
      const q=db.transaction(IDB_STORE,'readwrite').objectStore(IDB_STORE).delete(id);
      q.onsuccess=()=>res(); q.onerror=()=>rej(q.error);
    });
  }
  async function compressFile(file){
    const bmp=await createImageBitmap(file);
    const scale=Math.min(1, 1000/Math.max(bmp.width,bmp.height));
    const c=document.createElement('canvas');
    c.width=Math.max(1,Math.round(bmp.width*scale));
    c.height=Math.max(1,Math.round(bmp.height*scale));
    c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
    const blob=await new Promise(r=>{
      if(c.toBlob) c.toBlob(b=>r(b),'image/webp',0.8);
      else r(null);
    });
    if(blob) return {blob, mime:'image/webp'};
    const jpg=await new Promise(r=>c.toBlob(b=>r(b),'image/jpeg',0.8));
    return {blob:jpg||file, mime:(jpg&&jpg.type)||file.type||'image/jpeg'};
  }
  async function onOwnFiles(ev){
    const sku=ev.target.dataset.sku; const files=[...ev.target.files||[]]; ev.target.value='';
    if(!sku||!files.length||!ownerOn) return;
    for(const f of files){
      try{
        const {blob,mime}=await compressFile(f);
        await saveOwn(sku, blob, mime);
      }catch(err){ toast('Could not save photo'); }
    }
    toast('Photo'+(files.length>1?'s':'')+' saved on this device');
    await refreshOwnIndex();
    const r=bySku[sku]; if(r){ openDetails(r); draw(); }
    if($('myphotos-sec') && !$('myphotos-sec').hidden) renderMyPhotos();
  }
  if($('own-file-cam')) $('own-file-cam').onchange=onOwnFiles;
  if($('own-file-gal')) $('own-file-gal').onchange=onOwnFiles;

  /* ZIP (STORE) writer for export */
  function crc32(u8){
    let c=~0; const tbl=crc32.t||(crc32.t=(()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let x=n; for(let k=0;k<8;k++) x=x&1?0xedb88320^(x>>>1):x>>>1; t[n]=x; } return t; })());
    for(let i=0;i<u8.length;i++) c=tbl[(c^u8[i])&255]^(c>>>8);
    return ~c>>>0;
  }
  function zipStore(files){
    const enc=s=>new TextEncoder().encode(s);
    const locals=[], cents=[], chunks=[];
    let offset=0;
    for(const f of files){
      const name=enc(f.name); const data=f.data;
      const crc=crc32(data);
      const loc=new ArrayBuffer(30+name.length); const lv=new DataView(loc);
      lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true);
      lv.setUint16(8,0,true); lv.setUint16(10,0,true); lv.setUint16(12,0,true);
      lv.setUint32(14,crc,true); lv.setUint32(18,data.length,true); lv.setUint32(22,data.length,true);
      lv.setUint16(26,name.length,true);
      const locU=new Uint8Array(loc); locU.set(name,30);
      chunks.push(locU, data);
      const cen=new ArrayBuffer(46+name.length); const cv=new DataView(cen);
      cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true);
      cv.setUint32(16,crc,true); cv.setUint32(20,data.length,true); cv.setUint32(24,data.length,true);
      cv.setUint16(28,name.length,true);
      cv.setUint32(42,offset,true);
      const cenU=new Uint8Array(cen); cenU.set(name,46);
      cents.push(cenU);
      offset+=locU.length+data.length;
    }
    const cdStart=offset;
    let cdLen=0; for(const c of cents){ chunks.push(c); cdLen+=c.length; offset+=c.length; }
    const end=new ArrayBuffer(22); const ev=new DataView(end);
    ev.setUint32(0,0x06054b50,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true);
    ev.setUint32(12,cdLen,true); ev.setUint32(16,cdStart,true);
    chunks.push(new Uint8Array(end));
    return new Blob(chunks,{type:'application/zip'});
  }
  async function exportOwn(){
    const recs=await allOwn();
    if(!recs.length){ toast('No photos saved on this device yet'); return; }
    const photos=[];
    const files=[];
    for(const p of recs){
      const buf=new Uint8Array(await p.blob.arrayBuffer());
      const ext=(p.mime||'').includes('jpeg')?'jpg':((p.mime||'').includes('png')?'png':'webp');
      const rel=`photos/${p.sku}/${p.id}.${ext}`;
      files.push({name:rel, data:buf});
      let b64='';
      const CHUNK=0x8000; for(let i=0;i<buf.length;i+=CHUNK) b64+=String.fromCharCode.apply(null, buf.subarray(i,i+CHUNK));
      photos.push({sku:p.sku, mime:p.mime||'image/webp', file:rel, data_b64:btoa(b64), ts:p.ts});
    }
    const manifest=JSON.stringify({version:1, app:'Easy Finder Product', exportedAt:new Date().toISOString(), photos}, null, 2);
    files.push({name:'manifest.json', data:new TextEncoder().encode(manifest)});
    files.push({name:'easy-finder-product-photos.json', data:new TextEncoder().encode(manifest)});
    const blob=zipStore(files);
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='easy-finder-product-photos.zip';
    a.click();
    toast('Export ready — share the zip to be merged into the next release');
  }

  /* ---------- Search by image ---------- */
  function imgStatus(s){ if($('imgq-status')) $('imgq-status').textContent=s||''; }
  function loadScript(src){
    return new Promise((res,rej)=>{
      const s=document.createElement('script'); s.src=src; s.onload=()=>res(); s.onerror=()=>rej(new Error('Failed to load '+src));
      document.head.appendChild(s);
    });
  }
  async function loadCatalogEmb(){
    if(catalogEmb) return catalogEmb;
    const r=await fetch(EMB_URL, {cache:'force-cache'});
    if(!r.ok) throw new Error('No embeddings file');
    const j=await r.json();
    const bin=Uint8Array.from(atob(j.embeddings_f16), c=>c.charCodeAt(0));
    const view=new DataView(bin.buffer, bin.byteOffset, bin.byteLength);
    const dim=j.dim, n=j.count, vecs=[];
    let o=0;
    for(let i=0;i<n;i++){
      const v=new Float32Array(dim);
      for(let d=0;d<dim;d++,o+=2) v[d]=view.getFloat16(o,true);
      vecs.push(v);
    }
    catalogEmb={meta:j, vecs};
    return catalogEmb;
  }
  async function loadModel(){
    if(embedder) return embedder;
    if(modelP) return modelP;
    modelP=(async()=>{
      imgStatus('Loading on-device model…');
      if(!window.tf) await loadScript('vendor/tf.min.js');
      const tf=window.tf;
      const base=await tf.loadLayersModel(MODEL_JSON);
      embedder=tf.model({inputs:base.inputs, outputs:base.getLayer('global_average_pooling2d_1').output});
      /* warmup */
      tf.tidy(()=>embedder.predict(tf.zeros([1,224,224,3])));
      return embedder;
    })();
    try{ return await modelP; }catch(e){ modelP=null; throw e; }
  }
  function cover224(img){
    const size=224, c=document.createElement('canvas');
    c.width=c.height=size;
    const ctx=c.getContext('2d');
    const w=img.width||img.naturalWidth, h=img.height||img.naturalHeight;
    const scale=Math.max(size/w, size/h);
    const nw=w*scale, nh=h*scale;
    ctx.drawImage(img, (size-nw)/2, (size-nh)/2, nw, nh);
    return c;
  }
  async function embedImage(img){
    const tf=window.tf;
    const canvas=cover224(img);
    const v=tf.tidy(()=>{
      const t=tf.browser.fromPixels(canvas).toFloat();
      const pre=t.div(127.5).sub(1).expandDims(0);
      const e=embedder.predict(pre);
      return e.squeeze().div(e.norm());
    });
    const arr=Float32Array.from(await v.data()); v.dispose();
    return arr;
  }
  function cosine(a,b){
    let s=0; const n=Math.min(a.length,b.length);
    for(let i=0;i<n;i++) s+=a[i]*b[i];
    return s;
  }
  async function ownEmbeddings(){
    const recs=await allOwn().catch(()=>[]);
    const out=[];
    if(!recs.length) return out;
    for(const p of recs){
      try{
        const url=URL.createObjectURL(p.blob);
        const img=await new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=url; });
        const v=await embedImage(img);
        URL.revokeObjectURL(url);
        out.push({sku:p.sku, v, own:true});
      }catch(e){}
    }
    return out;
  }
  async function runImageSearch(file){
    try{
      imgStatus('Preparing image search…');
      await loadModel();
      const catE=await loadCatalogEmb().catch(()=>({meta:{items:[]},vecs:[]}));
      const img=await createImageBitmap(file);
      const q=await embedImage(img);
      const ownE=await ownEmbeddings();
      const best=new Map(); /* sku -> {score, approx, typ} */
      const add=(sku,score,approx,typ)=>{
        const prev=best.get(sku);
        if(!prev || score>prev.score || (score===prev.score && prev.approx && !approx)){
          best.set(sku, {score, approx:!!approx, typ:typ||null});
        }
      };
      const approxCands=[];
      (catE.meta.items||[]).forEach((it,i)=>{
        if(!it) return;
        const score=cosine(q, catE.vecs[i]);
        if(it.k==='approx'||it.k==='approximate'){
          approxCands.push({score, typ:it.typ||'part', skus:it.skus||(it.sku?[it.sku]:[])});
          return;
        }
        if(it.sku) add(it.sku, score, false, it.typ);
      });
      ownE.forEach(o=>add(o.sku, cosine(q,o.v), false, null));
      // For each strong approx match, add up to 3 example parts (category filter applied later)
      approxCands.sort((a,b)=>b.score-a.score);
      const usedTyp=new Set();
      for(const a of approxCands.slice(0,8)){
        if(usedTyp.has(a.typ)) continue;
        usedTyp.add(a.typ);
        let n=0;
        for(const sku of a.skus){
          if(n>=3) break;
          if(!bySku[sku]) continue;
          add(sku, a.score, true, a.typ);
          n++;
        }
      }
      const ranked=[...best.entries()].sort((a,b)=>b[1].score-a[1].score).slice(0,40);
      imgHits=ranked.map(([sku,info])=>{
        const r=bySku[sku]; if(!r) return null;
        r._simApprox=!!info.approx;
        r._simTyp=info.typ||((r._imgs&&r._imgs[0]&&r._imgs[0].typ)||'');
        return {r, score:info.score};
      }).filter(Boolean);
      if(!imgHits.length){
        imgHits=null;
        imgStatus('No comparable photos on file yet. Add owner photos or wait for the next catalogue images.');
        return;
      }
      imgStatus('Showing the closest looking parts — confirm by part number. You can still use the category filter.');
      cat=''; shown=10; run();
    }catch(err){
      console.error(err);
      imgStatus('Image search could not start. Check that the model files are available, then try again.');
    }
  }
  if($('imgq-btn')) $('imgq-btn').onclick=()=>{
    if(imgHits){
      imgHits=null; imgStatus(''); $('q').value=$('q').value; run();
    }
    $('imgq-file').click();
  };
  if($('imgq-file')) $('imgq-file').onchange=ev=>{
    const f=ev.target.files&&ev.target.files[0]; ev.target.value='';
    if(f) runImageSearch(f);
  };

  /* Escape already clears search; also clear image hits */
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ imgHits=null; imgStatus(''); }
  });

  clist();
  /* first paint already happened; refresh thumbs / chips */
  draw();

  function efpDiagramLink(r){
    const hit=efpDiagramForPart(r);
    if(!hit) return '';
    return `<div class="k">Diagram</div><button type="button" class="ghost" data-open-diag="${esc(hit.sys)}" data-hot="${esc(hit.hot)}">View on diagram · ${esc(hit.title)}</button>`;
  }

  /* ---------- VIN + variant search ---------- */
  const VIN_WMI={
    JTD:'Toyota',JTE:'Toyota',JTH:'Lexus',JT2:'Toyota',JT3:'Toyota',JT4:'Toyota',JT8:'Lexus',
    JTN:'Toyota',JTK:'Toyota',JTL:'Toyota',JTM:'Toyota',JT1:'Toyota',JT7:'Toyota',
    '4T1':'Toyota','4T3':'Toyota','4TA':'Toyota','5TD':'Toyota','5TE':'Toyota','5TF':'Toyota',
    '2T1':'Toyota','7MU':'Toyota','JN1':'Nissan',JN6:'Nissan',JN8:'Nissan','1N4':'Nissan',
    '3N1':'Nissan','5N1':'Nissan',JHM:'Honda',JHL:'Honda','1HG':'Honda','2HG':'Honda',
    '19X':'Honda',SHH:'Honda',SHS:'Honda',KMH:'Hyundai',KMF:'Hyundai','5NM':'Hyundai',
    'KM8':'Hyundai',KNA:'Kia',KND:'Kia',KNC:'Kia','5XY':'Kia',JMB:'Mitsubishi',JMY:'Mitsubishi',
    JA3:'Mitsubishi',JA4:'Mitsubishi',JM1:'Mazda',JM3:'Mazda',JM7:'Mazda',JAA:'Isuzu',
    JAB:'Isuzu',JAL:'Isuzu',JAS:'Isuzu',WBA:'BMW',WBS:'BMW',WBY:'BMW',WBX:'BMW',
    '4US':'BMW',WDD:'Mercedes-Benz',WDF:'Mercedes-Benz',WDB:'Mercedes-Benz',WDY:'Mercedes-Benz',
    '4JG':'Mercedes-Benz',WVW:'Volkswagen',WV1:'Volkswagen',WV2:'Volkswagen',WVG:'Volkswagen',
    '3VW':'Volkswagen',WAU:'Audi',WA1:'Audi',TRU:'Audi',WP0:'Porsche',WP1:'Porsche',
    '1FA':'Ford','1FB':'Ford','1FM':'Ford','1FT':'Ford','1ZV':'Ford','WF0':'Ford',
    '1G1':'Chevrolet','1GC':'Chevrolet','1GN':'Chevrolet',KL1:'Chevrolet',JSA:'Suzuki',
    JS3:'Suzuki',JS2:'Suzuki',SAL:'Land Rover',SAJ:'Jaguar','1C4':'Jeep','1C6':'Ram',
    '1J4':'Jeep',VF3:'Peugeot',VF1:'Renault',VF7:'Citroen',YV1:'Volvo',YS3:'Saab',
    JF1:'Subaru',JF2:'Subaru',SBM:'Mini',TMB:'Skoda',VSS:'Seat',W0L:'Opel',
    ZFA:'Fiat',ZFF:'Ferrari',ZAM:'Maserati',NMT:'Toyota',MA1:'Mahindra',
    '1G6':'Cadillac','1GT':'GMC','2G1':'Chevrolet',JNK:'Infiniti',JNR:'Infiniti',
    JH4:'Acura','5YJ':'Tesla',SJK:'Nissan',SJN:'Nissan',KN1:'Kia',KNM:'Renault',
    LVS:'Ford',LVV:'Chery',LFV:'Volkswagen',WUA:'Audi',W1K:'Mercedes-Benz',
    W1N:'Mercedes-Benz',W1V:'Mercedes-Benz'
  };
  const VIN_YEAR={A:2010,B:2011,C:2012,D:2013,E:2014,F:2015,G:2016,H:2017,J:2018,K:2019,
    L:2020,M:2021,N:2022,P:2023,R:2024,S:2025,T:2026,V:2027,W:2028,X:2029,Y:2030,
    1:2031,2:2032,3:2033,4:2034,5:2035,6:2036,7:2037,8:2038,9:2039};
  function cleanVin(s){ return String(s||'').toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g,''); }
  function resolveMake(name){
    if(!name) return '';
    const u=name.toUpperCase().replace(/[^A-Z0-9]/g,'');
    const list=(typeof MAKE_LIST!=='undefined'&&MAKE_LIST)||[];
    return list.find(m=>m.toUpperCase().replace(/[^A-Z0-9]/g,'')===u)||'';
  }
  function decodeVin(raw){
    const v=cleanVin(raw);
    if(v.length!==17) return {ok:false, msg:'Enter a 17-character VIN (letters I, O and Q are not used).'};
    const wmi=v.slice(0,3);
    const makeName=VIN_WMI[wmi]||'';
    const make=resolveMake(makeName);
    const year=VIN_YEAR[v.charAt(9)]||'';
    return {ok:true, vin:v, wmi, makeName, make, year};
  }
  function fillVariantModels(){
    const ms=$('var_make'), md=$('var_model');
    if(!ms||!md) return;
    const mk=ms.value;
    const keep=md.value;
    let items=[];
    if(mk){
      Object.keys(modelCount).forEach(k=>{
        if(k.startsWith(mk+'|')) items.push(k.slice(mk.length+1));
      });
    }else{
      const agg={};
      Object.keys(modelCount).forEach(k=>{ const m=k.split('|').slice(1).join('|'); if(m) agg[m]=1; });
      items=Object.keys(agg);
    }
    items.sort((a,b)=>a.localeCompare(b));
    md.innerHTML='<option value="">All models</option>'+items.map(m=>`<option value="${esc(m)}">${esc(m||'Unspecified')}</option>`).join('');
    if(keep && [...md.options].some(o=>o.value===keep)) md.value=keep;
  }
  function syncVariantFromState(){
    if($('var_make')) $('var_make').value=make||'';
    fillVariantModels();
    if($('var_model')) $('var_model').value=model===null?'':model;
    if($('var_year')) $('var_year').value=year||'';
    if($('var_eng')) $('var_eng').value=eng||'';
    if($('var_q')&&$('q')) $('var_q').value=$('q').value;
  }
  function applyVariant(){
    make=$('var_make')?$('var_make').value:'';
    const mv=$('var_model')?$('var_model').value:'';
    model=mv===''?null:mv;
    year=$('var_year')?$('var_year').value:'';
    eng=$('var_eng')?$('var_eng').value:'';
    if($('q')&&$('var_q')) $('q').value=$('var_q').value;
    if($('year')) $('year').value=year;
    if($('eng')) $('eng').value=eng;
    cat=''; shown=STEP;
    mlist(); vlist(); run();
    const tbl=document.querySelector('.tbl'); if(tbl) tbl.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function efpInitHome(){
    const vinQ=$('vin_q'), vinGo=$('vin_go'), vinMsg=$('vin_msg');
    if(vinGo){
      const go=()=>{
        const d=decodeVin(vinQ&&vinQ.value);
        if(!d.ok){ if(vinMsg) vinMsg.textContent=d.msg; return; }
        make=d.make||''; model=null; year=d.year?String(d.year):''; eng=''; cat='';
        if($('q')) $('q').value='';
        if($('year')) $('year').value=year;
        if($('eng')) $('eng').value='';
        mlist(); vlist(); run();
        syncVariantFromState();
        let msg;
        if(d.make && d.year) msg=`VIN ${d.vin}: ${d.make}, ${d.year}. Showing matching parts. Confirm fitment before sale.`;
        else if(d.make) msg=`VIN ${d.vin}: ${d.make}. Year not decoded. Showing that make. Confirm fitment before sale.`;
        else if(d.year) msg=`VIN ${d.vin}: year ${d.year}. Make not recognised from the VIN prefix ${d.wmi}. Narrow the variant search if you know the make.`;
        else msg=`VIN ${d.vin} is valid, but the make (prefix ${d.wmi}) is not in this decoder. Use variant search.`;
        if(vinMsg) vinMsg.textContent=msg;
        const tbl=document.querySelector('.tbl'); if(tbl) tbl.scrollIntoView({behavior:'smooth',block:'start'});
      };
      vinGo.onclick=go;
      if(vinQ) vinQ.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); go(); } });
    }
    const vm=$('var_make');
    if(vm){
      const list=(MAKE_LIST||[]).map(m=>`<option value="${esc(m)}">${esc(m)}</option>`).join('');
      vm.innerHTML='<option value="">All makes</option>'+list;
      vm.onchange=fillVariantModels;
    }
    if($('var_go')) $('var_go').onclick=applyVariant;
    if($('var_q')) $('var_q').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); applyVariant(); } });
    // keep variant fields in sync when the side lists are used
    const hook=(el,fn)=>{ if(!el||el._efpHooked) return; el._efpHooked=true; el.addEventListener('click',()=>setTimeout(syncVariantFromState,0)); };
    hook($('mlist')); hook($('vlist')); hook($('chips'));
    if($('year')) $('year').addEventListener('change',()=>{ year=$('year').value; syncVariantFromState(); });
    if($('eng')) $('eng').addEventListener('change',()=>{ eng=$('eng').value; syncVariantFromState(); });
    syncVariantFromState();
    if($('modes') && !$('diag-btn')){
      const b=document.createElement('button');
      b.type='button'; b.className='chip'; b.id='diag-btn'; b.textContent='Diagrams';
      b.onclick=()=>{ const s=$('diagram-sec'); if(s) s.scrollIntoView({behavior:'smooth',block:'start'}); };
      $('modes').appendChild(b);
    }
    document.addEventListener('click',e=>{
      const btn=e.target.closest('[data-open-diag]');
      if(!btn) return;
      e.preventDefault();
      const s=$('diagram-sec'); if(s) s.scrollIntoView({behavior:'smooth',block:'start'});
      efpShowDiagram(btn.dataset.openDiag, btn.dataset.hot);
    });
    // vehicle-results diagram hint
    const bar=document.querySelector('.bar');
    if(bar && !$('veh-diag')){
      const b=document.createElement('button');
      b.type='button'; b.className='ghost'; b.id='veh-diag'; b.textContent='Diagrams for this vehicle';
      b.onclick=()=>{ const s=$('diagram-sec'); if(s){ s.scrollIntoView({behavior:'smooth',block:'start'}); efpShowDiagram('service'); } };
      bar.appendChild(b);
    }
    const _run2=window.run;
    window.run=function(){
      _run2();
      const on=!!(make||model!==null);
      if($('veh-diag')) $('veh-diag').style.display=on?'':'none';
      if($('year')&&$('var_year')){
        const cur=year||$('var_year').value;
        $('var_year').innerHTML=$('year').innerHTML;
        $('var_year').value=cur||'';
      }
      if($('eng')&&$('var_eng')){
        const cur=eng||$('var_eng').value;
        $('var_eng').innerHTML=$('eng').innerHTML;
        $('var_eng').value=cur||'';
      }
      syncVariantFromState();
    };
  }

  /* ---------- Hand-built schematic diagrams (vector line drawings; not manufacturer art, not AI images) ---------- */
  const DIAGS=[
    {id:'service', title:'Service parts',
      spots:[
        {id:'oil-filter', n:1, title:'Oil filter', typ:['oil filter (spin-on)','oil filter (cartridge)'], cat:'Filters', x:86, y:118},
        {id:'air-filter', n:2, title:'Air filter', typ:['air filter (panel)'], cat:'Filters', x:210, y:46},
        {id:'cabin-filter', n:3, title:'Cabin filter', typ:['cabin filter'], cat:'Filters', x:430, y:70},
        {id:'fuel-filter', n:4, title:'Fuel filter', typ:['fuel filter'], cat:'Filters', x:330, y:150},
        {id:'spark-plug', n:5, title:'Spark plug', typ:['spark plug'], cat:'Electrical & Sensors', x:168, y:78},
        {id:'engine-oil', n:6, title:'Engine oil', typ:['engine oil'], cat:'Lubricants & Fluids', x:40, y:200}
      ],
      svg:`<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <rect x="110" y="70" width="160" height="110" rx="8"/>
        <rect x="124" y="86" width="28" height="46" rx="3"/>
        <rect x="158" y="86" width="28" height="46" rx="3"/>
        <rect x="192" y="86" width="28" height="46" rx="3"/>
        <rect x="226" y="86" width="28" height="46" rx="3"/>
        <path d="M110 140 h160"/>
        <path d="M70 118 h40"/>
        <rect x="58" y="100" width="28" height="36" rx="6"/>
        <path d="M72 100 v-10"/>
        <rect x="190" y="28" width="70" height="34" rx="4"/>
        <path d="M225 62 v8"/>
        <rect x="400" y="36" width="86" height="50" rx="6"/>
        <path d="M400 50 h-40 v40"/>
        <circle cx="330" cy="150" r="16"/>
        <path d="M314 150 h-30 M346 150 h30"/>
        <path d="M168 78 v-8"/>
        <rect x="18" y="176" width="36" height="52" rx="6"/>
        <path d="M36 176 v-10 h8"/>
        <text x="190" y="200" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">Engine bay (schematic)</text>
      </g>`},
    {id:'brakes', title:'Brakes',
      spots:[
        {id:'brake-pad', n:1, title:'Brake pads', typ:['brake pad'], cat:'Braking', x:150, y:80},
        {id:'brake-disc', n:2, title:'Brake disc', typ:['brake disc'], cat:'Braking', x:150, y:150},
        {id:'brake-shoe', n:3, title:'Brake shoes', typ:['brake shoe'], cat:'Braking', x:370, y:120},
        {id:'brake-fluid', n:4, title:'Brake fluid', typ:['chemical / additive','brake (other)'], cat:'Braking', kw:/BRAKE FLUID/i, x:500, y:70}
      ],
      svg:`<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <circle cx="150" cy="120" r="54"/>
        <circle cx="150" cy="120" r="38"/>
        <circle cx="150" cy="120" r="10"/>
        <path d="M108 92 q14 28 0 56 M192 92 q-14 28 0 56"/>
        <rect x="96" y="62" width="20" height="36" rx="3"/>
        <rect x="184" y="62" width="20" height="36" rx="3"/>
        <circle cx="370" cy="120" r="50"/>
        <circle cx="370" cy="120" r="12"/>
        <path d="M338 96 q32 8 32 24 q0 16 -32 24 M402 96 q-32 8 -32 24 q0 16 32 24"/>
        <rect x="484" y="40" width="32" height="52" rx="4"/>
        <path d="M500 40 v-10"/>
        <text x="150" y="210" text-anchor="middle" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">Disc brake</text>
        <text x="370" y="210" text-anchor="middle" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">Drum brake</text>
      </g>`},
    {id:'front-suspension', title:'Front suspension',
      spots:[
        {id:'shock', n:1, title:'Shock absorber / strut', typ:['shock absorber','strut'], cat:'Steering & Suspension', x:250, y:70},
        {id:'strut-mount', n:2, title:'Strut mount', typ:['strut'], cat:'Steering & Suspension', kw:/MOUNTING KIT|STRUT MOUNT|MOUNT KIT/i, x:250, y:28},
        {id:'spring', n:3, title:'Coil spring', typ:['coil spring'], cat:'Steering & Suspension', x:292, y:110},
        {id:'link', n:4, title:'Stabilizer link', typ:['stabilizer / sway bar link'], cat:'Steering & Suspension', x:160, y:160},
        {id:'bush', n:5, title:'Bushing', typ:['bushing'], cat:'Steering & Suspension', x:360, y:168},
        {id:'upper-arm', n:6, title:'Upper arm', typ:['upper arm','upper arm bush','upper arm ball joint','control arm','control arm bush','control arm ball joint'], cat:'Upper arm', axle:'front', x:125, y:105},
        {id:'lower-arm', n:7, title:'Lower arm', typ:['lower arm','lower arm bush','lower arm ball joint','control arm','control arm bush','control arm ball joint'], cat:'Lower arm', axle:'front', x:250, y:150}
      ],
      svg:`<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M250 20 v30"/>
        <rect x="236" y="18" width="28" height="12" rx="3"/>
        <path d="M250 50 v70"/>
        <path d="M238 70 h24 M238 82 h24 M238 94 h24 M238 106 h24"/>
        <path d="M292 70 q8 10 0 20 q-8 10 0 20 q8 10 0 20 q-8 10 0 16"/>
        <path d="M250 120 v30 M210 150 h80"/>
        <circle cx="210" cy="150" r="8"/>
        <circle cx="290" cy="150" r="8"/>
        <path d="M200 105 L125 92 M200 105 L125 118"/>
        <circle cx="125" cy="105" r="5"/>
        <path d="M160 160 h50"/>
        <rect x="348" y="160" width="24" height="16" rx="4"/>
        <circle cx="180" cy="188" r="22"/>
        <circle cx="180" cy="188" r="10"/>
        <text x="250" y="226" text-anchor="middle" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">MacPherson-style front corner (schematic)</text>
      </g>`},
    {id:'rear-suspension', title:'Rear suspension',
      spots:[
        {id:'shock-r', n:1, title:'Rear shock absorber', typ:['shock absorber'], cat:'Steering & Suspension', x:250, y:60},
        {id:'spring-r', n:2, title:'Rear spring', typ:['coil spring'], cat:'Steering & Suspension', x:170, y:90},
        {id:'link-r', n:3, title:'Link', typ:['stabilizer / sway bar link'], cat:'Steering & Suspension', x:300, y:150},
        {id:'bush-r', n:4, title:'Bushing', typ:['bushing'], cat:'Steering & Suspension', x:120, y:150},
        {id:'upper-arm-r', n:5, title:'Upper arm', typ:['upper arm','upper arm bush','upper arm ball joint','control arm','control arm bush','control arm ball joint'], cat:'Upper arm', axle:'rear', x:330, y:100},
        {id:'lower-arm-r', n:6, title:'Lower arm', typ:['lower arm','lower arm bush','lower arm ball joint','control arm','control arm bush','control arm ball joint'], cat:'Lower arm', axle:'rear', x:200, y:150}
      ],
      svg:`<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M80 150 h360"/>
        <path d="M250 20 v40"/>
        <rect x="238" y="16" width="24" height="10" rx="2"/>
        <path d="M250 60 v70"/>
        <path d="M238 80 h24 M238 92 h24 M238 104 h24"/>
        <path d="M170 50 q10 12 0 24 q-10 12 0 24 q10 12 0 24"/>
        <path d="M300 150 v-40 h-50"/>
        <path d="M400 168 L330 100 L250 100"/>
        <path d="M400 168 L200 150"/>
        <rect x="108" y="142" width="24" height="16" rx="4"/>
        <circle cx="400" cy="168" r="22"/>
        <circle cx="400" cy="168" r="10"/>
        <text x="250" y="226" text-anchor="middle" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">Rear axle (schematic)</text>
      </g>`},
    {id:'cooling', title:'Cooling',
      spots:[
        {id:'radiator', n:1, title:'Radiator', typ:['radiator'], cat:'Cooling & Climate', x:120, y:110},
        {id:'rad-cap', n:2, title:'Radiator cap', typ:['radiator cap'], cat:'Cooling & Climate', x:120, y:36},
        {id:'water-pump', n:3, title:'Water pump', typ:['water pump'], cat:'Cooling & Climate', x:280, y:130},
        {id:'thermostat', n:4, title:'Thermostat', typ:['thermostat'], cat:'Cooling & Climate', x:280, y:70},
        {id:'hose', n:5, title:'Hose', typ:['hose'], cat:'Hardware & Hoses', kw:/RADIATOR HOSE|COOLANT HOSE|WATER HOSE/i, x:200, y:70}
      ],
      svg:`<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <rect x="70" y="50" width="100" height="120" rx="6"/>
        <path d="M82 70 h76 M82 90 h76 M82 110 h76 M82 130 h76 M82 150 h76"/>
        <rect x="104" y="28" width="32" height="16" rx="3"/>
        <path d="M170 70 h70 v40"/>
        <circle cx="280" cy="70" r="16"/>
        <circle cx="280" cy="130" r="22"/>
        <path d="M280 92 v16"/>
        <path d="M170 150 h70"/>
        <text x="250" y="214" text-anchor="middle" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">Cooling circuit (schematic)</text>
      </g>`},
    {id:'clutch', title:'Clutch',
      spots:[
        {id:'clutch-disc', n:1, title:'Clutch disc / kit', typ:['clutch kit / disc'], cat:'Transmission & Clutch', x:200, y:120},
        {id:'clutch-cover', n:2, title:'Clutch cover', typ:['clutch kit / disc','clutch (other)'], cat:'Transmission & Clutch', kw:/CLUTCH COVER|PRESSURE PLATE/i, x:200, y:50},
        {id:'release', n:3, title:'Release bearing', typ:['clutch release bearing'], cat:'Transmission & Clutch', x:280, y:120}
      ],
      svg:`<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <circle cx="200" cy="120" r="70"/>
        <circle cx="200" cy="120" r="54"/>
        <circle cx="200" cy="120" r="16"/>
        <path d="M200 66 v-20 h40"/>
        <path d="M160 120 h-30 M240 120 h30"/>
        <text x="200" y="220" text-anchor="middle" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">Clutch pack (schematic)</text>
      </g>`},
    {id:'ignition', title:'Ignition',
      spots:[
        {id:'coil', n:1, title:'Ignition coil', typ:['ignition coil'], cat:'Electrical & Sensors', x:140, y:80},
        {id:'plug', n:2, title:'Spark plug', typ:['spark plug'], cat:'Electrical & Sensors', x:300, y:130},
        {id:'glow', n:3, title:'Glow plug', typ:['glow plug'], cat:'Electrical & Sensors', x:420, y:80}
      ],
      svg:`<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
        <rect x="110" y="40" width="60" height="80" rx="6"/>
        <path d="M140 120 v20 h160"/>
        <path d="M300 140 v20"/>
        <path d="M292 168 h16 v28 h-16 z"/>
        <path d="M300 196 v16"/>
        <rect x="400" y="50" width="44" height="70" rx="6"/>
        <path d="M422 120 v40"/>
        <text x="250" y="230" text-anchor="middle" fill="currentColor" stroke="none" font-size="11" font-family="system-ui" font-weight="700">Ignition (schematic)</text>
      </g>`}
  ];

  function efpDiagramForPart(r){
    const typ=r._sub||subtypeOf(r._desc,r._cat);
    const prefer=r._armAxle==='rear'?'rear-suspension':r._armAxle==='front'?'front-suspension':'';
    const diags=prefer?[DIAGS.find(d=>d.id===prefer),...DIAGS.filter(d=>d.id!==prefer)]:DIAGS;
    for(const d of diags){
      if(!d) continue;
      for(const s of d.spots){
        if(s.typ && s.typ.includes(typ)) return {sys:d.id, hot:s.id, title:s.title};
        if(s.kw && s.kw.test(r._desc||'')) return {sys:d.id, hot:s.id, title:s.title};
      }
    }
    return null;
  }
  function efpPartsForSpot(spot){
    const veh=!!(make||model!==null||year||eng);
    const out=[];
    for(const r of ROWS){
      if(veh){
        if(!appOk(r)) continue;
        if(year && !yearHit(r._years,year)) continue;
        if(eng && !r._eng.includes(eng)) continue;
      }
      const typ=r._sub||subtypeOf(r._desc,r._cat);
      const typOk=spot.typ && spot.typ.includes(typ);
      const kwOk=spot.kw && spot.kw.test(r._desc||'');
      if(spot.typ || spot.kw){ if(!(typOk||kwOk)) continue; }
      else if(r._cat!==spot.cat) continue;
      if(spot.axle==='front' && r._armAxle==='rear') continue;
      if(spot.axle==='rear' && r._armAxle==='front') continue;
      out.push(r);
    }
    out.sort((a,b)=>{
      const ap=a._price&&a._price[0]!=null?0:1, bp=b._price&&b._price[0]!=null?0:1;
      if(ap!==bp) return ap-bp;
      const kind=s=>{ const t=s||''; if(/^(upper arm|lower arm)$/.test(t)) return 0; if(/^control arm$/.test(t)) return 1; if(/ball joint/.test(t)) return 2; if(/bush/.test(t)) return 3; return 1; };
      const ak=kind(a._sub), bk=kind(b._sub);
      if(ak!==bk) return ak-bk;
      const ae=(a._imgs&&a._imgs[0]&&a._imgs[0].k!=='approx')?0:1;
      const be=(b._imgs&&b._imgs[0]&&b._imgs[0].k!=='approx')?0:1;
      return ae-be;
    });
    return out;
  }
  function efpShowDiagram(id, hotId){
    const d=DIAGS.find(x=>x.id===id)||DIAGS[0];
    const stage=$('diag-stage'), tabs=$('diag-tabs'), pop=$('diag-pop');
    if(tabs){
      tabs.innerHTML=DIAGS.map(x=>`<button type="button" class="chip ${x.id===d.id?'on':''}" data-diag="${esc(x.id)}">${esc(x.title)}</button>`).join('');
      tabs.onclick=e=>{ const b=e.target.closest('[data-diag]'); if(b) efpShowDiagram(b.dataset.diag); };
    }
    if(stage){
      const marks=d.spots.map(s=>`
        <g class="hot" data-hot="${esc(s.id)}" tabindex="0" role="button" aria-label="${esc(s.n+'. '+s.title)}">
          <circle class="hot-hit" cx="${s.x}" cy="${s.y}" r="16" fill="#C8102E" fill-opacity="0.08" stroke="#C8102E" stroke-width="2"/>
          <circle class="hot-num" cx="${s.x}" cy="${s.y}" r="11"/>
          <text class="hot-n" x="${s.x}" y="${s.y+1}">${s.n}</text>
        </g>`).join('');
      stage.innerHTML=`<svg viewBox="0 0 560 250" role="img" aria-label="${esc(d.title)} schematic">${d.svg}${marks}</svg>
        <p class="diag-leg">${esc(d.title)} · tap a number. ${make||model!==null?`Filtered to ${esc([make,model||''].filter(Boolean).join(' · ')||'the selected vehicle')}.`:'No vehicle selected — showing typical parts in each group.'} Drawings are schematic only.</p>`;
      stage.querySelectorAll('.hot').forEach(g=>{
        const open=()=>efpOpenHot(d, g.dataset.hot);
        g.addEventListener('click',open);
        g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
      });
    }
    if(hotId) efpOpenHot(d, hotId);
    else if(pop) pop.hidden=true;
    document.querySelectorAll('#diag-btn').forEach(b=>b.classList.add('on'));
  }
  function efpOpenHot(d, hotId){
    const spot=d.spots.find(s=>s.id===hotId);
    const pop=$('diag-pop'); if(!spot||!pop) return;
    const parts=efpPartsForSpot(spot).slice(0,12);
    const veh=!!(make||model!==null||year||eng);
    pop.hidden=false;
    pop.innerHTML=`<h3>${esc(spot.n)}. ${esc(spot.title)}</h3>
      <p class="home-lead">${veh?'Matching parts for the selected vehicle.':'Top parts in this group. Select a vehicle in VIN or variant search to narrow the list.'}</p>
      ${parts.length?parts.map(r=>{
        const im=(r._dispImgs||r._imgs||[])[0];
        const img=im&&im.f?`<img src="${esc(im.f)}" alt="${esc(kindLabel(im))}">`:'';
        const pr=(r._price&&r._price[0]!=null)?`AED ${Number(r._price[0]).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} incl. 5% VAT`:'Price on request';
        return `<div class="diag-item" data-sku="${esc(r._sku)}">${img}<div><b>${esc(r._sku)}</b> · ${esc(r._brand)}<div>${esc(r._desc)}</div><div>${pr} · ${availText(r)}</div></div></div>`;
      }).join(''):'<p class="home-lead">No matching parts in the catalogue for this selection.</p>'}`;
    // highlight
    document.querySelectorAll('.hot').forEach(g=>g.style.opacity=g.dataset.hot===hotId?'1':'.65');
  }
  function efpInitDiagrams(){
    efpShowDiagram('service');
  }


  /* ---------- Advanced search + My photos ---------- */
  function fuelOf(desc){
    const d=desc||'';
    const tags=[];
    if(/\bDIESEL\b/i.test(d) && !/DIESEL TECHNIC/i.test(d) && !/DIESEL PARTICULATE/i.test(d)) tags.push('Diesel');
    if(/\b(PETROL|GASOLINE)\b/i.test(d)) tags.push('Petrol');
    if(/\bHYBRID\b/i.test(d)) tags.push('Hybrid');
    return tags;
  }
  function varTagsOf(desc){
    const d=desc||'';
    const tags=[];
    if(/\b2WD\b/i.test(d)) tags.push('2WD');
    if(/\b4WD\b/i.test(d) || /\b4X4\b/i.test(d)) tags.push('4WD');
    if(/\bAWD\b/i.test(d)) tags.push('AWD');
    if(/\bA\/T\b/i.test(d) || /AUTOMATIC TRANSMISSION/i.test(d) || /AUTOMATIC TRANSAXLE/i.test(d)) tags.push('Automatic');
    if(/\bM\/T\b/i.test(d) || /MANUAL TRANSMISSION/i.test(d) || /MANUAL TRANSAXLE/i.test(d)) tags.push('Manual');
    if(/\bCVT\b/i.test(d) && !/CVT-\d/i.test(d)) tags.push('CVT');
    return tags;
  }
  function yearRangeHit(ranges, y0, y1){
    if(!y0 && !y1) return true;
    if(!ranges||!ranges.length) return false;
    const from=y0?+y0:-Infinity, to=y1?+y1:Infinity;
    return ranges.some(([a,b])=>{
      const lo=a, hi=(b?b:Infinity);
      return lo<=to && hi>=from;
    });
  }
  function pnHit(r, q){
    if(!q) return true;
    const raw=q.trim(); if(!raw) return true;
    const n=(typeof N==='function'?N(raw):raw.toUpperCase().replace(/[-\s.\/]/g,''));
    if(n && (typeof N==='function'?N(r._sku):r._sku).indexOf(n)>=0) return true;
    if((r._xrefs||[]).some(x=>(typeof N==='function'?N(x):String(x).toUpperCase().replace(/[-\s.\/]/g,'')).indexOf(n)>=0)) return true;
    return false;
  }
  ROWS.forEach(r=>{
    r._fuel=fuelOf(r._desc);
    r._vtags=varTagsOf(r._desc);
    const shipped=IMGS[r._sku];
    r._exact=!!(shipped && shipped.some(im=>{ const k=(im.k||'photo').toLowerCase(); return k!=='approx' && k!=='approximate'; }));
  });
  function readAdv(){
    const num=id=>{ const el=$(id); if(!el||el.value==='') return ''; const n=+el.value; return isFinite(n)?n:''; };
    return {
      make:$('adv_make')?$('adv_make').value:'',
      model:$('adv_model')?$('adv_model').value:'',
      y0:$('adv_y0')?$('adv_y0').value:'',
      y1:$('adv_y1')?$('adv_y1').value:'',
      eng:$('adv_eng')?$('adv_eng').value:'',
      fuel:$('adv_fuel')?$('adv_fuel').value:'',
      tag:$('adv_tag')?$('adv_tag').value:'',
      cat:$('adv_cat')?$('adv_cat').value:'',
      brand:$('adv_brand')?$('adv_brand').value:'',
      pmin:num('adv_pmin'),
      pmax:num('adv_pmax'),
      pn:$('adv_pn')?$('adv_pn').value.trim():'',
      exact:!!($('adv_exact')&&$('adv_exact').checked),
      priced:!!($('adv_priced')&&$('adv_priced').checked)
    };
  }
  function advHasFilters(f){
    f=f||readAdv();
    return !!(f.make||f.model||f.y0||f.y1||f.eng||f.fuel||f.tag||f.cat||f.brand||f.pmin!==''||f.pmax!==''||f.pn||f.exact||f.priced);
  }
  function advMatch(r,f){
    if(f.make){
      const ok=r._apps.some(a=>a.make===f.make && (f.model==='' || (f.model==='__NONE__'? !a.model : a.model===f.model)));
      if(!ok) return false;
    } else if(f.model){
      const want=f.model==='__NONE__'?'':f.model;
      if(!r._apps.some(a=>a.model===want)) return false;
    }
    if(!yearRangeHit(r._years, f.y0, f.y1)) return false;
    if(f.eng && !(r._eng||[]).includes(f.eng)) return false;
    if(f.fuel && !(r._fuel||[]).includes(f.fuel)) return false;
    if(f.tag && !(r._vtags||[]).includes(f.tag)) return false;
    if(f.cat && r._cat!==f.cat) return false;
    if(f.brand && r._brand!==f.brand) return false;
    const price=(r._price&&r._price[0]!=null)?+r._price[0]:null;
    if(f.priced && price==null) return false;
    if(f.pmin!=='' || f.pmax!==''){
      if(price==null) return false;
      if(f.pmin!=='' && price<f.pmin) return false;
      if(f.pmax!=='' && price>f.pmax) return false;
    }
    if(f.exact && !r._exact) return false;
    if(f.pn && !pnHit(r,f.pn)) return false;
    return true;
  }
  function applyAdvRun(){
    const f=readAdv();
    const pool=ROWS.filter(r=>advMatch(r,f));
    const cc={}; pool.forEach(r=>cc[r._cat]=(cc[r._cat]||0)+1);
    if($('chips')) $('chips').innerHTML=`<button type="button" class="chip ${cat?'':'on'}" data-c="">All ${pool.length}</button>`+
      Object.keys(cc).sort((a,b)=>cc[b]-cc[a]).map(c=>`<button type="button" class="chip ${c===cat?'on':''}" data-c="${esc(c)}">${esc(c)} ${cc[c]}</button>`).join('');
    res=cat?pool.filter(r=>r._cat===cat):pool;
    if($('vt')) $('vt').innerHTML='Advanced search';
    shown=STEP; draw();
    if($('adv-count')) $('adv-count').textContent=res.length.toLocaleString()+' matches';
  }
  function fillAdvModels(keep){
    const mk=$('adv_make')?$('adv_make').value:'';
    const sel=$('adv_model'); if(!sel) return;
    const items=[];
    if(mk){
      Object.keys(modelCount).forEach(k=>{
        if(k.startsWith(mk+'|')) items.push({model:k.slice(mk.length+1), n:modelCount[k]});
      });
    } else {
      const agg={};
      Object.keys(modelCount).forEach(k=>{
        const md=k.split('|').slice(1).join('|');
        if(!md) return;
        agg[md]=(agg[md]||0)+modelCount[k];
      });
      Object.keys(agg).forEach(md=>items.push({model:md,n:agg[md]}));
    }
    items.sort((a,b)=>b.n-a.n||a.model.localeCompare(b.model));
    const cur=keep!=null?keep:sel.value;
    sel.innerHTML='<option value="">All models</option>'+items.map(it=>{
      const val=it.model===''?'__NONE__':it.model;
      const lab=it.model||'Unspecified (make only)';
      return `<option value="${esc(val)}"${val===cur?' selected':''}>${esc(lab)} (${it.n})</option>`;
    }).join('');
    if(cur && ![...sel.options].some(o=>o.value===cur)) sel.value='';
  }
  function fillAdvOptions(){
    const fuels=new Map(), tags=new Map(), years=new Set(), engs=new Set(), brands=new Map(), cats=new Map();
    let nExact=0, nPriced=0, pricedMin=null, pricedMax=null;
    ROWS.forEach(r=>{
      (r._fuel||[]).forEach(x=>fuels.set(x,(fuels.get(x)||0)+1));
      (r._vtags||[]).forEach(x=>tags.set(x,(tags.get(x)||0)+1));
      (r._years||[]).forEach(([a,b])=>{ if(a) years.add(a); if(b) years.add(b); });
      (r._eng||[]).forEach(e=>engs.add(e));
      if(r._brand) brands.set(r._brand,(brands.get(r._brand)||0)+1);
      if(r._cat) cats.set(r._cat,(cats.get(r._cat)||0)+1);
      if(r._exact) nExact++;
      const p=r._price&&r._price[0]!=null?+r._price[0]:null;
      if(p!=null){ nPriced++; pricedMin=pricedMin==null?p:Math.min(pricedMin,p); pricedMax=pricedMax==null?p:Math.max(pricedMax,p); }
    });
    const opt=(sel, first, entries, selected)=>{
      if(!sel) return;
      sel.innerHTML=`<option value="">${first}</option>`+entries.map(([v,n])=>`<option value="${esc(v)}">${esc(v)}${n!=null?' ('+n+')':''}</option>`).join('');
      if(selected) sel.value=selected;
    };
    opt($('adv_make'), 'All makes', (MAKE_LIST||[]).map(m=>[m, makeCount[m]]));
    fillAdvModels('');
    const ylist=[...years].sort((a,b)=>a-b);
    if($('adv_y0')) $('adv_y0').innerHTML='<option value="">Any</option>'+ylist.map(y=>`<option value="${y}">${y}</option>`).join('');
    if($('adv_y1')) $('adv_y1').innerHTML='<option value="">Any</option>'+ylist.map(y=>`<option value="${y}">${y}</option>`).join('');
    const hide=(id, on)=>{ const el=$(id); if(el) el.hidden=!on; };
    hide('adv-y0-wrap', ylist.length>0); hide('adv-y1-wrap', ylist.length>0);
    const elist=[...engs].sort();
    if($('adv_eng')) $('adv_eng').innerHTML='<option value="">All engines</option>'+elist.map(e=>`<option value="${esc(e)}">${esc(e)}</option>`).join('');
    hide('adv-eng-wrap', elist.length>0);
    const fuelArr=[...fuels.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
    opt($('adv_fuel'), 'All fuels', fuelArr);
    hide('adv-fuel-wrap', fuelArr.length>0);
    const tagArr=[...tags.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
    opt($('adv_tag'), 'All tags', tagArr);
    hide('adv-tag-wrap', tagArr.length>0);
    const catArr=[...cats.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
    opt($('adv_cat'), 'All categories', catArr);
    hide('adv-cat-wrap', catArr.length>0);
    const brandArr=[...brands.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
    opt($('adv_brand'), 'All brands', brandArr);
    hide('adv-brand-wrap', brandArr.length>0);
    hide('adv-exact-wrap', nExact>0);
    hide('adv-priced-wrap', nPriced>0);
    hide('adv-pmin-wrap', nPriced>0);
    hide('adv-pmax-wrap', nPriced>0);
    if($('adv_pmin')) $('adv_pmin').placeholder='Min';
    if($('adv_pmax')) $('adv_pmax').placeholder='Max';
    if($('adv-count')) $('adv-count').textContent=ROWS.length.toLocaleString()+' parts';
  }
  function efpInitAdv(){
    if(!$('adv-sec')) return;
    fillAdvOptions();
    const onMake=()=>{ fillAdvModels(''); bumpAdv(); };
    const bumpAdv=()=>{
      if(advHasFilters()) applyAdvRun();
      else {
        if($('adv-count')) $('adv-count').textContent=ROWS.length.toLocaleString()+' parts';
        if(typeof run==='function') run();
      }
    };
    let tmr=null;
    const live=()=>{ clearTimeout(tmr); tmr=setTimeout(bumpAdv, 120); };
    if($('adv_make')) $('adv_make').addEventListener('change', onMake);
    ['adv_model','adv_y0','adv_y1','adv_eng','adv_fuel','adv_tag','adv_cat','adv_brand','adv_exact','adv_priced'].forEach(id=>{
      const el=$(id); if(!el) return;
      el.addEventListener('change', bumpAdv);
    });
    ['adv_pmin','adv_pmax','adv_pn'].forEach(id=>{
      const el=$(id); if(!el) return;
      el.addEventListener('input', live);
    });
    if($('adv_clear')) $('adv_clear').onclick=()=>{
      ['adv_make','adv_model','adv_y0','adv_y1','adv_eng','adv_fuel','adv_tag','adv_cat','adv_brand','adv_pmin','adv_pmax','adv_pn'].forEach(id=>{ if($(id)) $(id).value=''; });
      if($('adv_exact')) $('adv_exact').checked=false;
      if($('adv_priced')) $('adv_priced').checked=false;
      fillAdvModels('');
      cat=''; shown=STEP;
      if($('adv-count')) $('adv-count').textContent=ROWS.length.toLocaleString()+' parts';
      if(typeof run==='function') run();
    };
    const _runSaved=window.run;
    window.run=function(){
      if(!imgHits && advHasFilters()){ applyAdvRun(); return; }
      _runSaved();
      if($('adv-count') && !advHasFilters()) $('adv-count').textContent=ROWS.length.toLocaleString()+' parts';
    };
  }
  async function refreshOwnIndex(){
    try{
      const all=await allOwn();
      ownSkuSet=new Set((all||[]).map(p=>p.sku));
    }catch(e){ ownSkuSet=new Set(); }
  }
  async function renderMyPhotos(){
    const grid=$('myph-grid'), empty=$('myph-empty'); if(!grid) return;
    myphUrls.forEach(u=>{ try{ URL.revokeObjectURL(u); }catch(e){} });
    myphUrls=[];
    let rows=[];
    try{ rows=await allOwn(); }catch(e){ rows=[]; }
    const q=($('myph_q')&&$('myph_q').value||'').trim().toUpperCase();
    const nq=q && (typeof N==='function'?N(q):q.replace(/[-\s.\/]/g,''));
    const items=rows.slice().sort((a,b)=> (b.ts||0)-(a.ts||0)).filter(p=>{
      if(!q) return true;
      const sku=(p.sku||'').toUpperCase();
      const r=bySku[p.sku];
      const desc=((r&&r._desc)||'').toUpperCase();
      if(sku.includes(q) || desc.includes(q)) return true;
      if(nq && (typeof N==='function'?N(p.sku):sku).includes(nq)) return true;
      return false;
    });
    grid.innerHTML=items.map(p=>{
      const url=URL.createObjectURL(p.blob);
      myphUrls.push(url);
      const r=bySku[p.sku];
      const desc=r?r._desc:'';
      return `<div class="myph-card" data-sku="${esc(p.sku)}" data-id="${esc(p.id)}">
        <img src="${esc(url)}" alt="My photo of ${esc(p.sku)}">
        <b>${esc(p.sku)}</b>
        <div class="myph-desc">${esc(desc)}</div>
        <button type="button" class="ghost myph-del" data-del="${esc(p.id)}">Remove</button>
      </div>`;
    }).join('');
    if(empty){ empty.hidden=items.length>0; empty.textContent=rows.length&&!items.length?'No photos match that part number.':'No uploaded photos yet.'; }
    grid.querySelectorAll('.myph-card').forEach(card=>{
      card.addEventListener('click', ev=>{
        if(ev.target.closest('.myph-del')) return;
        const r=bySku[card.dataset.sku];
        if(r) openDetails(r);
      });
    });
    grid.querySelectorAll('.myph-del').forEach(btn=>{
      btn.addEventListener('click', async ev=>{
        ev.stopPropagation();
        await deleteOwn(btn.dataset.del);
        await refreshOwnIndex();
        toast('Photo removed');
        renderMyPhotos();
        draw();
        if($('det').classList.contains('open')){
          const h=$('det').querySelector('h2');
          if(h && bySku[h.textContent]) openDetails(bySku[h.textContent]);
        }
      });
    });
  }
  function openMyPhotos(){
    const sec=$('myphotos-sec'); if(!sec) return;
    sec.hidden=false;
    renderMyPhotos();
    sec.scrollIntoView({behavior:'smooth', block:'start'});
    if($('myph_q')) $('myph_q').focus();
  }
  function efpInitMyPhotos(){
    if($('myph-btn')) $('myph-btn').onclick=()=>openMyPhotos();
    if($('myph_close')) $('myph_close').onclick=()=>{ if($('myphotos-sec')) $('myphotos-sec').hidden=true; };
    let t=null;
    if($('myph_q')) $('myph_q').addEventListener('input', ()=>{ clearTimeout(t); t=setTimeout(renderMyPhotos, 120); });
    refreshOwnIndex().then(()=>{ if(ownSkuSet.size) draw(); });
    updateOwnerBtn();
  }

  /* efp-v16-landing */
  window.efpRunImageSearch = runImageSearch;
  window.efpOpenMyPhotos = openMyPhotos;
  window.efpRunVin = function(raw){
    window.efpCloseSheets && window.efpCloseSheets();
    const v=cleanVin(raw||'');
    if($('vin_q')) $('vin_q').value = (raw||'').trim().toUpperCase();
    window.efpShowApp && window.efpShowApp('vin-sec');
    const d=decodeVin(raw);
    const msg=$('vin_msg') || $('scan-msg');
    if(!d.ok){ if(msg) msg.textContent=d.msg; if($('scan-msg') && $('vin_msg')!==$('scan-msg')) $('scan-msg').textContent=d.msg; return; }
    make=d.make||''; model=null; year=d.year?String(d.year):''; eng=''; cat='';
    if($('q')) $('q').value='';
    if($('dock-q')) $('dock-q').value='';
    if($('year')) $('year').value=year;
    if($('eng')) $('eng').value='';
    mlist(); vlist(); run();
    syncVariantFromState();
    let line;
    if(d.make && d.year) line=`VIN ${d.vin}: ${d.make}, ${d.year}. Showing matching parts. Confirm fitment before sale.`;
    else if(d.make) line=`VIN ${d.vin}: ${d.make}. Year not decoded. Showing that make. Confirm fitment before sale.`;
    else if(d.year) line=`VIN ${d.vin}: ${d.year}. Make not decoded. Confirm fitment before sale.`;
    else line=`VIN ${d.vin} read. Confirm fitment before sale.`;
    if($('vin_msg')) $('vin_msg').textContent=line;
    if(typeof window.efpHistAdd==='function') window.efpHistAdd({q:d.vin, kind:'vin'});
    const tbl=document.querySelector('.tbl'); if(tbl) tbl.scrollIntoView({behavior:'smooth',block:'start'});
  };

  const OIL_SKIP=/cooler|battery|cv joint|hose|filter|pump/i;
  function isGuideLube(r){
    if((r._cat||'')!=='Lubricants & Fluids') return false;
    if(OIL_SKIP.test(r._sub||'')) return false;
    if(/OIL COOLER|HOSE\.?\s*COOLER FOR ENGINE OIL/i.test(r._desc||'')) return false;
    return true;
  }
  function oilFuelOk(r, fuel){
    if(!fuel) return true;
    const tags=fuelOf(r._desc||'')||[];
    if(!tags.length) return true; /* unspecified — keep, listed as general */
    if(fuel==='Petrol') return tags.indexOf('Petrol')>=0 || tags.indexOf('Hybrid')>=0;
    return tags.indexOf(fuel)>=0;
  }
  function oilAppOk(r, st){
    if(!st.make) return true;
    if(!(r._apps&&r._apps.length)) return false;
    return r._apps.some(a=>{
      if(a.make!==st.make) return false;
      if(!st.model) return true;
      return a.model===st.model;
    });
  }
  let oilSt={step:1, make:'', model:'', year:'', eng:'', fuel:''};

  function oilPath(){
    const el=$('oil-path'); if(!el) return;
    const bits=[oilSt.make, oilSt.model, oilSt.year, oilSt.eng, oilSt.fuel].filter(Boolean);
    el.textContent=bits.join(' · ');
  }
  function oilEsc(s){ return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function oilFilter(list, q){
    const f=(q||'').trim().toUpperCase();
    if(!f) return list;
    return list.filter(x=>String(x.label||x).toUpperCase().includes(f));
  }
  function oilModels(){
    const items=[];
    Object.keys(modelCount||{}).forEach(k=>{
      if(oilSt.make && k.startsWith(oilSt.make+'|')) items.push(k.slice(oilSt.make.length+1));
    });
    items.sort((a,b)=>a.localeCompare(b));
    return items;
  }
  function oilPoolForVehicle(){
    return ROWS.filter(r=>{
      if(!isGuideLube(r)) return false;
      if(!oilAppOk(r, oilSt)) return false;
      if(oilSt.year && !yearHit(r._years, oilSt.year)) return false;
      if(oilSt.eng && !(r._eng||[]).includes(oilSt.eng)) return false;
      return true;
    });
  }
  function oilYears(){
    const set=new Set();
    ROWS.forEach(r=>{
      if(!isGuideLube(r) && !(r._apps&&r._apps.length)) return;
      if(oilSt.make && !(r._apps||[]).some(a=>a.make===oilSt.make && (!oilSt.model || a.model===oilSt.model))) return;
      (r._years||[]).forEach(([a,b])=>{
        const x=a||0, y=b||a||0;
        for(let yr=x; yr<=y && yr-x<80; yr++) if(yr>=1970 && yr<=2035) set.add(String(yr));
        if(!b && a>=1970 && a<=2035) set.add(String(a));
      });
    });
    const arr=[...set].sort((a,b)=>+b-+a);
    return arr.length?arr:Array.from({length:36},(_,i)=>String(2026-i));
  }
  function oilEngines(){
    const set=new Set();
    ROWS.forEach(r=>{
      if(oilSt.make && !(r._apps||[]).some(a=>a.make===oilSt.make && (!oilSt.model || a.model===oilSt.model))) return;
      if(oilSt.year && r._years && r._years.length && !yearHit(r._years, oilSt.year)) return;
      (r._eng||[]).forEach(e=>set.add(e));
    });
    return [...set].sort((a,b)=>a.localeCompare(b));
  }
  function oilThumb(r){
    const im=(r._imgs&&r._imgs[0]) || (typeof shippedImgs==='function' && shippedImgs(r._sku,r._desc,r._cat)||[])[0];
    return im&&im.f ? im.f : 'images/approx/motor-oil-bottles-variousbrands-jpg.webp';
  }
  function renderOilResults(){
    const body=$('oil-body'); if(!body) return;
    if($('oil-title')) $('oil-title').textContent='Matching lubricants';
    const vehicle=oilPoolForVehicle().filter(r=>oilFuelOk(r, oilSt.fuel));
    const general=ROWS.filter(r=>{
      if(!isGuideLube(r)) return false;
      if(oilAppOk(r, oilSt) && (r._apps&&r._apps.length)) return false;
      if(!(r._apps&&r._apps.length) && oilFuelOk(r, oilSt.fuel)) return true;
      return false;
    });
    const sortFn=(a,b)=>{
      const pa=(a._price&&a._price[0]!=null)?0:1, pb=(b._price&&b._price[0]!=null)?0:1;
      if(pa!==pb) return pa-pb;
      const ea=a._sub==='engine oil'?0:1, eb=b._sub==='engine oil'?0:1;
      if(ea!==eb) return ea-eb;
      return (a._sku||'').localeCompare(b._sku||'');
    };
    vehicle.sort(sortFn); general.sort(sortFn);
    function cards(list){
      if(!list.length) return '<p class="sheet-lead">None in the catalogue for this step.</p>';
      return list.map(r=>{
        const pr=priceHtml(r);
        const av=availHtml(r);
        return `<a class="oil-card" href="#part=${encodeURIComponent(r._sku)}" data-oil-sku="${oilEsc(r._sku)}">
          <img src="${oilEsc(oilThumb(r))}" alt="" width="56" height="56" loading="lazy">
          <div><b>${oilEsc(r._sku)}</b>
            <div class="oil-desc">${oilEsc(r._desc)}</div>
            <div class="feat-brand">${oilEsc(r._brand||'')} · ${oilEsc(r._sub||r._cat||'')}</div>
            ${pr}${av}
          </div></a>`;
      }).join('');
    }
    let html='';
    html+=`<p class="sheet-lead">These are catalogue items, not a recommendation of the single correct grade. Confirm fitment, specification and stock before sale.</p>`;
    html+=`<div class="oil-group">Matching this vehicle (${vehicle.length})</div>`+cards(vehicle);
    html+=`<div class="oil-group">General lubricants — confirm fitment (${general.length})</div>`+cards(general.slice(0,80));
    if(general.length>80) html+=`<p class="sheet-lead">Showing the first 80 general lubricants. Use search for more.</p>`;
    body.innerHTML=html;
    if(typeof window.efpHistAdd==='function'){
      const q=[oilSt.make,oilSt.model,oilSt.year,oilSt.eng,oilSt.fuel].filter(Boolean).join(' · ');
      window.efpHistAdd({q:q, kind:'oil', extra:Object.assign({},oilSt)});
    }
  }
  function renderOilStep(){
    const body=$('oil-body'); if(!body) return;
    oilPath();
    if(oilSt.step===6){ renderOilResults(); return; }
    const titles={1:'Choose make',2:'Choose model',3:'Choose year',4:'Choose engine',5:'Choose fuel'};
    if($('oil-title')) $('oil-title').textContent=titles[oilSt.step]||'Oil guide';
    let opts=[], anyLabel='';
    if(oilSt.step===1){
      opts=(typeof MAKE_LIST!=='undefined'?MAKE_LIST:Object.keys(makeCount||{})).map(m=>({value:m,label:m,n:makeCount[m]}));
    }else if(oilSt.step===2){
      opts=oilModels().map(m=>({value:m,label:m||'Unspecified'}));
      anyLabel='Any model';
    }else if(oilSt.step===3){
      opts=oilYears().map(y=>({value:y,label:y}));
      anyLabel='Any year';
    }else if(oilSt.step===4){
      opts=oilEngines().map(e=>({value:e,label:e}));
      anyLabel='Any engine';
    }else if(oilSt.step===5){
      opts=[{value:'Petrol',label:'Petrol'},{value:'Diesel',label:'Diesel'},{value:'Hybrid',label:'Hybrid'}];
      anyLabel='Any fuel';
    }
    body.innerHTML=`<input class="oil-q" id="oil_q" placeholder="Type to filter" autocomplete="off">
      ${anyLabel?`<button type="button" class="oil-opt" data-oil-val=""><span>${oilEsc(anyLabel)}</span></button>`:''}
      <div class="oil-list" id="oil_list"></div>`;
    const draw=()=>{
      const q=$('oil_q')?$('oil_q').value:'';
      const show=oilFilter(opts,q);
      $('oil_list').innerHTML=show.map(o=>`<button type="button" class="oil-opt" data-oil-val="${oilEsc(o.value)}"><span>${oilEsc(o.label)}</span>${o.n?`<small>${o.n}</small>`:''}</button>`).join('')
        || '<p class="sheet-lead">No matches.</p>';
    };
    draw();
    if($('oil_q')) $('oil_q').oninput=draw;
  }
  function oilPick(val){
    if(oilSt.step===1){ oilSt.make=val; oilSt.model=''; oilSt.year=''; oilSt.eng=''; oilSt.fuel=''; oilSt.step=2; }
    else if(oilSt.step===2){ oilSt.model=val; oilSt.year=''; oilSt.eng=''; oilSt.step=3; }
    else if(oilSt.step===3){ oilSt.year=val; oilSt.eng=''; oilSt.step=4; }
    else if(oilSt.step===4){ oilSt.eng=val; oilSt.step=5; }
    else if(oilSt.step===5){ oilSt.fuel=val; oilSt.step=6; }
    renderOilStep();
  }
  window.efpOpenOilGuide=function(restore){
    if(typeof ROWS==='undefined'||!ROWS||!ROWS.length||!ROWS[0]._sku){
      window.efpOpenSheet && window.efpOpenSheet('oil-sheet');
      if($('oil-body')) $('oil-body').innerHTML='<p class="sheet-lead">Loading the catalogue…</p>';
      window._efpOilOpen=restore||true;
      return;
    }
    if(restore && typeof restore==='object'){
      oilSt=Object.assign({step:6,make:'',model:'',year:'',eng:'',fuel:''}, restore, {step:6});
    }else{
      oilSt={step:1, make:'', model:'', year:'', eng:'', fuel:''};
    }
    window.efpOpenSheet && window.efpOpenSheet('oil-sheet');
    renderOilStep();
  };
  function efpInitLanding(){
    if($('menu-myphotos')){
      const show=typeof isUnlocked==='function' && isUnlocked();
      $('menu-myphotos').hidden=!show;
    }
    const oilBody=$('oil-body');
    if(oilBody){
      oilBody.addEventListener('click', ev=>{
        const skuBtn=ev.target.closest && ev.target.closest('[data-oil-sku]');
        if(skuBtn){
          ev.preventDefault();
          const sku=skuBtn.getAttribute('data-oil-sku');
          window.efpCloseSheets && window.efpCloseSheets();
          window.efpShowApp && window.efpShowApp(null);
          if(typeof window.efpOpenPart==='function') window.efpOpenPart(sku);
          return;
        }
        const opt=ev.target.closest && ev.target.closest('[data-oil-val]');
        if(opt) oilPick(opt.getAttribute('data-oil-val')||'');
      });
    }
    if($('oil-back')) $('oil-back').onclick=()=>{
      if(oilSt.step>1){ oilSt.step-=1; if(oilSt.step<6){ /* stay */ } renderOilStep(); }
      else { window.efpCloseSheets && window.efpCloseSheets(); }
    };
    if(window._efpOilOpen){
      const r=window._efpOilOpen===true?null:window._efpOilOpen;
      window._efpOilOpen=null;
      window.efpOpenOilGuide(r);
    }
  }
  /* /efp-v16-landing */

    window.efpOpenPart=function(sku){
    const r=bySku[sku]||ROWS.find(x=>x._sku===sku);
    if(!r){ toast('Part not in the catalogue'); return; }
    if($('q')){ $('q').value=sku; }
    cat=''; shown=STEP;
    if(typeof run==='function') run();
    openDetails(r);
    const row=$('tb')&&[...$('tb').querySelectorAll('tr[data-i]')].find(tr=>{
      const i=+tr.dataset.i; return res[i]&&res[i]._sku===sku;
    });
    if(row) row.scrollIntoView({block:'center',behavior:'smooth'});
  };
  efpInitLanding();
  efpInitHome();
  efpInitDiagrams();
  efpInitAdv();
  efpInitMyPhotos();
  if(window._efpOpenSku) window.efpOpenPart(window._efpOpenSku);
  }


  efpStartExtras();
  document.addEventListener('efp-data-ready', efpStartExtras);
})();
