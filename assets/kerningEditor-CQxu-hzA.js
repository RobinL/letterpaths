import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{b as W}from"./bigram-frequency-BYeZ3rJA.js";import{e as xe,i as _e,l as he}from"./joiner-CaP30BL7.js";const ee=document.querySelector("#app");if(!ee)throw new Error("Missing #app element for kerning editor.");const z="abcdefghijklmnopqrstuvwxyz".split(""),te=z.flatMap(e=>z.map(t=>`${e}${t}`)),P={xHeight:360,baseline:720},we=he,B=-500,G=500,S=0,x=2,Q=.005,$e="letterpaths-kerning-editor-handles",$="handles",He=1,ne="cursive-kerning-json",V=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),v=(e,t,n)=>Math.min(n,Math.max(t,e)),Y=e=>Math.round(e*10)/10,M=e=>Math.round(e*100)/100,H=e=>e.toFixed(1),k=e=>e.toFixed(2),Ee=e=>`M ${e.p0.x} ${e.p0.y} C ${e.p1.x} ${e.p1.y} ${e.p2.x} ${e.p2.y} ${e.p3.x} ${e.p3.y}`,re=e=>{if(!e||typeof e!="object")return{};const t="pairs"in e&&e.pairs&&typeof e.pairs=="object"?e.pairs:e,n={};return Object.entries(t).forEach(([r,i])=>{const a=r.toLowerCase();if(!/^[a-z]{2}$/.test(a))return;const s=i&&typeof i=="object"?i:null,c=typeof i=="number"?i:s&&"sidebearingGap"in s?Number(s.sidebearingGap):Number.NaN,u=s&&"exitHandleScale"in s?Number(s.exitHandleScale):Number.NaN,b=s&&"entryHandleScale"in s?Number(s.entryHandleScale):Number.NaN,m={...Number.isFinite(c)?{sidebearingGap:Y(v(c,B,G))}:{},...Number.isFinite(u)?{exitHandleScale:M(v(u,S,x))}:{},...Number.isFinite(b)?{entryHandleScale:M(v(b,S,x))}:{}};Object.keys(m).length!==0&&(n[a]=m)}),Object.fromEntries(Object.entries(n).sort(([r],[i])=>r.localeCompare(i)))},ie=()=>({schemaVersion:1,description:"Hard-coded cursive pair kerning. Each lowercase two-letter key can store sidebearingGap, exitHandleScale, and entryHandleScale.",units:"letterpath sidebearing gap and Bezier handle scale",pairs:Object.fromEntries(Object.entries(l).sort(([e],[t])=>e.localeCompare(t)))});let l=re(_e),o="aa",g=null,f=null,j="packages/letterpaths/src/data/cursive-kerning.json",_=!1,y="all",D="";ee.innerHTML=`
  <main class="kerning-editor">
    <header class="kerning-editor__header">
      <div>
        <h1>Cursive kerning editor</h1>
        <p>Edit default pair spacing for joined lowercase letters.</p>
      </div>
      <div class="kerning-editor__meta" id="kerning-editor-meta"></div>
    </header>

    <section class="kerning-editor__toolbar">
      <button class="kerning-editor__button" id="kerning-open" type="button">Open kerning JSON</button>
      <button class="kerning-editor__button kerning-editor__button--primary" id="kerning-save" type="button">Save</button>
      <button class="kerning-editor__button" id="kerning-download" type="button">Download JSON</button>
      <input id="kerning-load-input" type="file" accept="application/json,.json" hidden />
      <label class="kerning-editor__field">
        Filter
        <select id="kerning-filter">
          <option value="all">All pairs</option>
          <option value="override">Overrides</option>
          <option value="default">Built-in defaults</option>
        </select>
      </label>
      <label class="kerning-editor__field">
        Search
        <input id="kerning-search" type="search" placeholder="aa" autocomplete="off" />
      </label>
      <div class="kerning-editor__status" id="kerning-status"></div>
    </section>

    <section class="kerning-editor__workspace">
      <aside class="kerning-editor__selected" id="kerning-selected"></aside>
      <section class="kerning-editor__grid-shell">
        <div class="kerning-editor__grid-header">
          <h2>Pairs</h2>
          <span class="kerning-editor__status" id="kerning-grid-count"></span>
        </div>
        <div class="kerning-editor__grid" id="kerning-grid"></div>
      </section>
    </section>
  </main>
`;const ae=document.querySelector("#kerning-editor-meta"),d=document.querySelector("#kerning-status"),se=document.querySelector("#kerning-open"),oe=document.querySelector("#kerning-save"),le=document.querySelector("#kerning-download"),q=document.querySelector("#kerning-load-input"),O=document.querySelector("#kerning-filter"),R=document.querySelector("#kerning-search"),p=document.querySelector("#kerning-selected"),E=document.querySelector("#kerning-grid"),ce=document.querySelector("#kerning-grid-count");if(!ae||!d||!se||!oe||!le||!q||!O||!R||!p||!E||!ce)throw new Error("Missing elements for kerning editor.");function h(e){var I;const t=l[e],n=xe(e,{style:"cursive",targetGuides:P,joinKerning:t?{[e]:t}:{},letters:we}),r=((I=n.joinMetrics)==null?void 0:I[0])??null,i=(r==null?void 0:r.renderedSidebearingGap)??(t==null?void 0:t.sidebearingGap)??0,a=(r==null?void 0:r.exitHandleScale)??(t==null?void 0:t.exitHandleScale)??1,s=(r==null?void 0:r.entryHandleScale)??(t==null?void 0:t.entryHandleScale)??1,c=120,u=110,b=n.bounds.minX-c,m=n.bounds.maxX+c,J=Math.min(n.bounds.minY,P.xHeight)-u,Se=Math.max(n.bounds.maxY,P.baseline)+u;return{path:n,metric:r,gap:i,exitHandleScale:a,entryHandleScale:s,source:t?"override":"default",viewBox:`${b} ${J} ${Math.max(420,m-b)} ${Math.max(420,Se-J)}`,minX:b,maxX:m,baselineY:P.baseline,xHeightY:P.xHeight}}function de(e){var r;const t=e.path.strokes.flatMap(i=>i.curves.map((a,s)=>{var u;return`<path class="kerning-svg__stroke ${((u=i.curveSegments)==null?void 0:u[s])==="join"?"kerning-svg__stroke--join":""}" d="${Ee(a)}"></path>`})).join(""),n=(r=e.metric)==null?void 0:r.actualNextLeftSidebearingX;return`
    <line class="kerning-svg__guide kerning-svg__guide--xheight" x1="${e.minX}" y1="${e.xHeightY}" x2="${e.maxX}" y2="${e.xHeightY}"></line>
    <line class="kerning-svg__guide kerning-svg__guide--baseline" x1="${e.minX}" y1="${e.baselineY}" x2="${e.maxX}" y2="${e.baselineY}"></line>
    ${n===void 0?"":`<line class="kerning-svg__sidebearing" x1="${n}" y1="${e.xHeightY-190}" x2="${n}" y2="${e.baselineY+90}"></line>`}
    ${t}
  `}function ue(e,t){const n=h(e);return`
    <svg class="${t}" viewBox="${n.viewBox}" aria-hidden="true">
      ${de(n)}
    </svg>
  `}function ge(e){const t=h(e);return`
    <div class="kerning-card__header">
      <span class="kerning-card__pair">${e.toUpperCase()}</span>
      <div class="kerning-card__tools">
        <span class="kerning-card__source ${t.source==="override"?"kerning-card__source--override":""}" title="${t.source}"></span>
        <button
          class="kerning-card__save"
          type="button"
          data-pair-save="${e}"
          title="Save this pair"
          aria-label="Save ${e.toUpperCase()} kerning pair"
        >
          Save
        </button>
      </div>
    </div>
    <svg class="kerning-card__svg" viewBox="${t.viewBox}" aria-hidden="true">
      ${de(t)}
    </svg>
    <div class="kerning-card__footer">
      <span class="kerning-card__value">${H(t.gap)}</span>
      <span class="kerning-card__value">${t.source==="override"?`h ${k(t.exitHandleScale)}/${k(t.entryHandleScale)}`:"default"}</span>
    </div>
  `}function Ce(e){const t=!!l[e];return y==="override"&&!t||y==="default"&&t?!1:!D||e.includes(D)}function Le(e){return`
    <article
      class="kerning-card ${e===o?"kerning-card--selected":""}"
      data-pair="${e}"
      tabindex="0"
      aria-label="${e.toUpperCase()} kerning pair"
    >
      ${ge(e)}
    </article>
  `}function Z(e,t){return`
    <section class="kerning-editor__pair-section" aria-label="${e} pairs">
      <div class="kerning-editor__pair-section-header">
        <h3>${e}</h3>
        <span class="kerning-editor__status">${t.length}</span>
      </div>
      ${t.length===0?'<p class="kerning-editor__empty">No pairs here.</p>':`<div class="kerning-editor__pair-grid">${t.map(Le).join("")}</div>`}
    </section>
  `}function Pe(e,t){const n=W.get(e)??Number.MAX_SAFE_INTEGER,r=W.get(t)??Number.MAX_SAFE_INTEGER;return n-r||e.localeCompare(t)}function w(){const e=te.filter(Ce),t=e.filter(r=>!l[r]).sort(Pe),n=e.filter(r=>l[r]);E.innerHTML=[y==="override"?"":Z("To do",t),y==="default"?"":Z("Done",n)].join(""),ce.textContent=y==="all"?`${t.length} to do, ${n.length} done`:`${e.length} shown`}function K(e){const t=E.querySelector(`[data-pair="${e}"]`);t&&(t.classList.toggle("kerning-card--selected",e===o),t.innerHTML=ge(e))}function C(){var n,r,i,a,s;const e=h(o),t=l[o];p.innerHTML=`
    <div class="kerning-editor__selected-top">
      <h2 id="kerning-selected-title">${o.toUpperCase()}</h2>
      <span
        class="kerning-editor__badge ${e.source==="override"?"kerning-editor__badge--override":""}"
        id="kerning-selected-badge"
      >
        ${e.source==="override"?"override":"default"}
      </span>
    </div>
    <div id="kerning-selected-preview-wrap">
      ${ue(o,"kerning-editor__preview")}
    </div>
    <div class="kerning-editor__selected-actions">
      <label class="kerning-editor__field">
        Sidebearing gap
        <input id="kerning-selected-gap" type="number" min="${B}" max="${G}" step="0.1" value="${H(e.gap)}" />
      </label>
      <label class="kerning-editor__field">
        p0-p1 handle scale
        <input id="kerning-selected-exit-handle" type="number" min="${S}" max="${x}" step="0.05" value="${k(e.exitHandleScale)}" />
      </label>
      <label class="kerning-editor__field">
        p2-p3 handle scale
        <input id="kerning-selected-entry-handle" type="number" min="${S}" max="${x}" step="0.05" value="${k(e.entryHandleScale)}" />
      </label>
      <button class="kerning-editor__button" id="kerning-reset-selected" type="button" ${t?"":"disabled"}>Reset</button>
    </div>
    <div class="kerning-editor__metrics" id="kerning-selected-metrics">
      ${pe(e)}
    </div>
  `,(n=p.querySelector("#kerning-selected-gap"))==null||n.addEventListener("input",c=>{const u=c.currentTarget;A(o,Number(u.value),!0)}),(r=p.querySelector("#kerning-selected-exit-handle"))==null||r.addEventListener("input",c=>{const u=c.currentTarget;F(o,"exitHandleScale",Number(u.value),!0)}),(i=p.querySelector("#kerning-selected-entry-handle"))==null||i.addEventListener("input",c=>{const u=c.currentTarget;F(o,"entryHandleScale",Number(u.value),!0)}),(a=p.querySelector("#kerning-reset-selected"))==null||a.addEventListener("click",()=>{je(o)}),(s=p.querySelector("#kerning-selected-preview-wrap"))==null||s.addEventListener("pointerdown",c=>{c.button===0&&(c.preventDefault(),ke(o,c,c.currentTarget))})}function pe(e){return`
    ${N("Rendered gap",H(e.gap))}
    ${e.metric?N("Base sidebearing gap",H(e.metric.baseSidebearingGap)):""}
    ${N("p0-p1 handle scale",k(e.exitHandleScale))}
    ${N("p2-p3 handle scale",k(e.entryHandleScale))}
    ${N("Source",e.source)}
  `}function T(e=!1){const t=h(o),n=l[o],r=p.querySelector("#kerning-selected-title"),i=p.querySelector("#kerning-selected-badge"),a=p.querySelector("#kerning-selected-preview-wrap"),s=p.querySelector("#kerning-selected-metrics"),c=p.querySelector("#kerning-reset-selected");if(r&&(r.textContent=o.toUpperCase()),i&&(i.textContent=t.source==="override"?"override":"default",i.classList.toggle("kerning-editor__badge--override",t.source==="override")),a&&(a.innerHTML=ue(o,"kerning-editor__preview")),s&&(s.innerHTML=pe(t)),c&&(c.disabled=!n),e){const u=p.querySelector("#kerning-selected-gap"),b=p.querySelector("#kerning-selected-exit-handle"),m=p.querySelector("#kerning-selected-entry-handle");u&&(u.value=H(t.gap)),b&&(b.value=k(t.exitHandleScale)),m&&(m.value=k(t.entryHandleScale))}}function N(e,t){return`
    <div class="kerning-editor__metric">
      <span>${V(e)}</span>
      <strong>${V(t)}</strong>
    </div>
  `}function L(){const e=Object.keys(l).length,t=_?"unsaved":"saved";ae.textContent=`${e} / ${te.length} pairs set | ${t} | ${j}`}function fe(){C(),w(),L()}function be(e){const t=o;o=e,K(t),K(o),C()}function A(e,t,n=!1){if(!Number.isFinite(t))return;const r=!!l[e],i=Y(v(t,B,G));l={...l,[e]:{...l[e],sidebearingGap:i}},_=!0,r?K(e):w(),e===o?T(!n):n||C(),L(),d.textContent=`${e.toUpperCase()} set to ${H(i)}.`}function F(e,t,n,r=!1){if(!Number.isFinite(n))return;const i=!!l[e],a=M(v(n,S,x));l={...l,[e]:{...l[e],[t]:a}},_=!0,i?K(e):w(),e===o?T(!r):r||C(),L(),d.textContent=`${e.toUpperCase()} ${t} set to ${k(a)}.`}function Ne(e){const t=h(e);l={...l,[e]:{sidebearingGap:Y(v(t.gap,B,G)),exitHandleScale:M(v(t.exitHandleScale,S,x)),entryHandleScale:M(v(t.entryHandleScale,S,x))}},_=!0,w(),e===o&&C(),L(),d.textContent=`${e.toUpperCase()} saved as an override.`}function je(e){if(!l[e])return;const t={...l};delete t[e],l=t,_=!0,w(),C(),L(),d.textContent=`${e.toUpperCase()} reset to built-in default.`}function ke(e,t,n){const r=h(e),i=n.querySelector("svg"),a=i==null?void 0:i.getBoundingClientRect(),s=(i==null?void 0:i.viewBox.baseVal.width)??600;g={pair:e,startClientX:t.clientX,startClientY:t.clientY,startGap:r.gap,startExitHandleScale:r.exitHandleScale,startEntryHandleScale:r.entryHandleScale,unitsPerPx:a&&a.width>0?s/a.width:3},document.body.classList.add("kerning-editor--dragging"),be(e)}function me(){g&&(g=null,document.body.classList.remove("kerning-editor--dragging"))}function U(e,t){const n=JSON.parse(e);l=re(n),j=t,_=!1,y="all",O.value="all",d.textContent=`Loaded ${t}.`,fe()}async function qe(){const e=window;if(!e.showOpenFilePicker){q.click();return}try{const[t]=await e.showOpenFilePicker({id:"letterpaths-cursive-kerning",multiple:!1,types:[{description:"Kerning JSON",accept:{"application/json":[".json"]}}]});if(!t)return;f=t;const n=await t.getFile();U(await n.text(),t.name),await X(t)}catch{d.textContent="Open cancelled."}}async function Fe(e){var n,r;const t={mode:"readwrite"};try{return await((n=e.queryPermission)==null?void 0:n.call(e,t))==="granted"?!0:await((r=e.requestPermission)==null?void 0:r.call(e,t))==="granted"}catch{return!1}}async function ve(){const e=window;if(!f){if(!e.showSaveFilePicker){d.textContent="Open a writable kerning JSON file before saving.";return}try{f=await e.showSaveFilePicker({id:"letterpaths-cursive-kerning",suggestedName:"cursive-kerning.json",types:[{description:"Kerning JSON",accept:{"application/json":[".json"]}}]}),j=f.name,await X(f)}catch{d.textContent="Save cancelled.";return}}if(!await Fe(f)){d.textContent="Write permission was not granted.";return}const n=`${JSON.stringify(ie(),null,2)}
`;try{const r=await f.createWritable();if(await r.write(n),await r.truncate(n.length),await r.close(),await(await f.getFile()).text()!==n){d.textContent="Save verification failed.";return}_=!1,j=f.name,await X(f),L(),d.textContent=`Saved ${j}.`}catch{d.textContent="Failed to save kerning JSON."}}async function Me(){const e=await Ke();if(!e)return;if(await Oe(e,"read")!=="granted"){d.textContent=`Remembered ${e.name}; open it once to restore editable access.`;return}try{const n=await e.getFile();f=e,U(await n.text(),e.name),d.textContent=`Restored editable ${e.name}.`}catch{f=null,d.textContent="Remembered kerning file could not be restored."}}async function Oe(e,t){var n;try{return await((n=e.queryPermission)==null?void 0:n.call(e,{mode:t}))??"prompt"}catch{return"prompt"}}async function X(e){try{const t=await ye();return await Te(t,e),t.close(),!0}catch{return d.textContent="Opened kerning file; reload restore is unavailable in this browser.",!1}}async function Ke(){try{const e=await ye(),t=await Be(e);return e.close(),t}catch{return null}}function ye(){return new Promise((e,t)=>{const n=indexedDB.open($e,He);n.addEventListener("upgradeneeded",()=>{const r=n.result;r.objectStoreNames.contains($)||r.createObjectStore($)}),n.addEventListener("success",()=>e(n.result)),n.addEventListener("error",()=>t(n.error))})}function Te(e,t){return new Promise((n,r)=>{const i=e.transaction($,"readwrite");i.objectStore($).put({handle:t,name:t.name,updatedAt:Date.now()},ne),i.addEventListener("complete",()=>n()),i.addEventListener("error",()=>r(i.error)),i.addEventListener("abort",()=>r(i.error))})}function Be(e){return new Promise((t,n)=>{const a=e.transaction($,"readonly").objectStore($).get(ne);a.addEventListener("success",()=>{const s=a.result;t((s==null?void 0:s.handle)??null)}),a.addEventListener("error",()=>n(a.error))})}function Ge(){const e=`${JSON.stringify(ie(),null,2)}
`,t=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="cursive-kerning.json",r.click(),URL.revokeObjectURL(n)}E.addEventListener("pointerdown",e=>{var n,r;if(e.button!==0||(n=e.target)!=null&&n.closest("[data-pair-save]"))return;const t=(r=e.target)==null?void 0:r.closest("[data-pair]");t&&(e.preventDefault(),ke(t.dataset.pair??o,e,t))});E.addEventListener("click",e=>{var n;const t=(n=e.target)==null?void 0:n.closest("[data-pair-save]");t&&(e.preventDefault(),e.stopPropagation(),Ne(t.dataset.pairSave??o))});window.addEventListener("pointermove",e=>{if(!g)return;const t=(g.startClientY-e.clientY)*Q;if(e.shiftKey){const r=g.startEntryHandleScale+(e.clientX-g.startClientX)*Q;F(g.pair,"exitHandleScale",g.startExitHandleScale+t),F(g.pair,"entryHandleScale",r);return}const n=g.startGap+(e.clientX-g.startClientX)*g.unitsPerPx;A(g.pair,n),F(g.pair,"exitHandleScale",g.startExitHandleScale+t)});window.addEventListener("pointerup",me);window.addEventListener("pointercancel",me);function De(e){return e instanceof HTMLElement?e.isContentEditable||e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement:!1}window.addEventListener("keydown",e=>{e.key.toLowerCase()!=="s"||e.metaKey||e.ctrlKey||e.altKey||De(e.target)||(e.preventDefault(),ve())});E.addEventListener("keydown",e=>{var a;const t=(a=e.target)==null?void 0:a.closest("[data-pair]");if(!t)return;const n=t.dataset.pair??o;if(e.key==="Enter"||e.key===" "){e.preventDefault(),be(n);return}if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return;e.preventDefault();const r=e.key==="ArrowRight"?1:-1,i=e.shiftKey?5:1;A(n,h(n).gap+r*i)});se.addEventListener("click",()=>{qe()});oe.addEventListener("click",()=>{ve()});le.addEventListener("click",Ge);q.addEventListener("change",async()=>{var t;const e=(t=q.files)==null?void 0:t[0];e&&(f=null,U(await e.text(),e.name),q.value="")});O.addEventListener("change",()=>{y=O.value,w()});R.addEventListener("input",()=>{D=R.value.trim().toLowerCase(),w()});fe();d.textContent="Loaded built-in kerning settings.";Me();
