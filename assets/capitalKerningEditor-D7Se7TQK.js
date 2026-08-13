import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{a as ne}from"./bigram-frequency-BYeZ3rJA.js";import{j as ie,e as ae,l as re}from"./joiner-c-a6mS3a.js";const X=document.querySelector("#app");if(!X)throw new Error("Missing #app element for capital kerning editor.");const u={xHeight:360,baseline:720},m=ne.map(e=>{var t;return`${(t=e[0])==null?void 0:t.toUpperCase()}${e[1]}`}),A=new Map(m.map((e,t)=>[e,t])),R=-400,T=500,G=40,D=e=>Math.round(e*10)/10,B=e=>Math.min(T,Math.max(R,e)),k=e=>e.toFixed(1),J=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");let r=W(ie),a=m[0]??"Th",d="withLeadIn",E="all",U="",h=null,x="packages/letterpaths/src/data/capital-to-lowercase-kerning.json",f=!1,g=null;X.innerHTML=`
  <main class="kerning-editor capital-kerning-editor">
    <header class="kerning-editor__header">
      <div>
        <h1>Capital kerning editor</h1>
        <p>Adjust the visible gap from each print capital to the following cursive lowercase letter. New or missing pairs start at a ${G}-unit gap.</p>
      </div>
      <div class="kerning-editor__meta" id="capital-meta"></div>
    </header>

    <section class="kerning-editor__toolbar">
      <button class="kerning-editor__button" id="capital-open" type="button">Open kerning JSON</button>
      <button class="kerning-editor__button kerning-editor__button--primary" id="capital-save" type="button">Save</button>
      <button class="kerning-editor__button" id="capital-download" type="button">Download JSON</button>
      <input id="capital-load-input" type="file" accept="application/json,.json" hidden />
      <label class="kerning-editor__field">
        Lowercase form
        <select id="capital-mode">
          <option value="withLeadIn">With lead-in</option>
          <option value="withoutLeadIn">Without lead-in</option>
        </select>
      </label>
      <label class="kerning-editor__field">
        Review status
        <select id="capital-filter">
          <option value="all">All pairs</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </label>
      <label class="kerning-editor__field">
        Search
        <input id="capital-search" type="search" placeholder="Th" autocomplete="off" />
      </label>
      <span class="kerning-editor__status" id="capital-status"></span>
    </section>

    <section class="kerning-editor__workspace">
      <aside class="kerning-editor__selected" id="capital-selected"></aside>
      <section class="kerning-editor__grid-shell">
        <div class="kerning-editor__grid-header">
          <h2>Pairs in English frequency order</h2>
          <span class="kerning-editor__status" id="capital-count"></span>
        </div>
        <div class="kerning-editor__pair-grid capital-kerning-editor__grid" id="capital-grid"></div>
      </section>
    </section>
  </main>
`;const oe=document.querySelector("#capital-meta"),_=document.querySelector("#capital-status"),p=document.querySelector("#capital-selected"),j=document.querySelector("#capital-grid"),se=document.querySelector("#capital-count"),M=document.querySelector("#capital-mode"),O=document.querySelector("#capital-filter"),C=document.querySelector("#capital-search"),L=document.querySelector("#capital-load-input");function W(e){const t=e&&typeof e=="object"&&"pairs"in e?e.pairs:e,n=t&&typeof t=="object"?t:{},i={};for(const c of m){const s=n[c],l=s&&typeof s=="object"?s:{};i[c]={withLeadIn:N(l.withLeadIn),withoutLeadIn:N(l.withoutLeadIn),reviewed:l.reviewed===!0}}return i}function N(e){const t=Number(e);return Number.isFinite(t)?D(B(t)):G}function Y(){return{schemaVersion:1,description:"Manual visible-gap kerning between a print capital and the following cursive lowercase letter. Each pair stores separate values for lowercase forms with and without an initial lead-in.",units:"letterpath visible curve gap",pairs:Object.fromEntries(Object.entries(r).sort(([e],[t])=>e.localeCompare(t)))}}function le(e,t=d){var I;const n=r[e]??{withLeadIn:0,withoutLeadIn:0},i=ae(e,{style:"cursive",targetGuides:u,keepInitialLeadIn:t==="withLeadIn",capitalKerning:{[e]:n},letters:re}),c=100,s=90,l=i.bounds.minX-c,w=i.bounds.maxX+c,o=Math.min(i.bounds.minY,u.xHeight)-s,te=Math.max(i.bounds.maxY,u.baseline)+s;return{path:i,metric:((I=i.capitalKerningMetrics)==null?void 0:I[0])??null,viewBox:`${l} ${o} ${Math.max(420,w-l)} ${Math.max(420,te-o)}`,minX:l,maxX:w}}function ce(e){return`M ${e.p0.x} ${e.p0.y} C ${e.p1.x} ${e.p1.y} ${e.p2.x} ${e.p2.y} ${e.p3.x} ${e.p3.y}`}function b(e,t,n=d){var l;const i=le(e,n),c=i.path.strokes.flatMap(w=>w.curves.map(o=>`<path class="kerning-svg__stroke" d="${ce(o)}"></path>`)).join(""),s=(l=i.metric)==null?void 0:l.previousVisibleRightX;return`
    <svg class="${t}" viewBox="${i.viewBox}" preserveAspectRatio="xMidYMid meet" aria-label="${J(e)} preview">
      <line class="kerning-svg__guide kerning-svg__guide--xheight" x1="${i.minX}" y1="${u.xHeight}" x2="${i.maxX}" y2="${u.xHeight}"></line>
      <line class="kerning-svg__guide kerning-svg__guide--baseline" x1="${i.minX}" y1="${u.baseline}" x2="${i.maxX}" y2="${u.baseline}"></line>
      ${s===void 0?"":`<line class="kerning-svg__sidebearing" x1="${s}" y1="${u.xHeight-180}" x2="${s}" y2="${u.baseline+80}"></line>`}
      ${c}
    </svg>
  `}function K(){const e=U.trim().toLowerCase();return m.filter(t=>{var n,i;return!(e&&!t.toLowerCase().includes(e)||E==="reviewed"&&!((n=r[t])!=null&&n.reviewed)||E==="unreviewed"&&((i=r[t])!=null&&i.reviewed))})}function $(){var n,i,c,s,l,w;const e=r[a],t=(A.get(a)??0)+1;p.innerHTML=`
    <div class="kerning-editor__selected-top">
      <div>
        <h2>${J(a)}</h2>
        <span class="capital-kerning-editor__rank">frequency rank ${t} / ${m.length}</span>
      </div>
      <span class="kerning-editor__badge ${e.reviewed?"kerning-editor__badge--override":""}">${e.reviewed?"reviewed":"unreviewed"}</span>
    </div>
    <div id="capital-preview-wrap">${b(a,"kerning-editor__preview")}</div>
    <label class="kerning-editor__field capital-kerning-editor__gap-field">
      Visible gap (${d==="withLeadIn"?"with lead-in":"without lead-in"})
      <input id="capital-gap" type="number" min="${R}" max="${T}" step="1" value="${k(e[d])}" />
    </label>
    <div class="capital-kerning-editor__comparison">
      <button type="button" data-mode="withLeadIn" class="capital-kerning-editor__comparison-card ${d==="withLeadIn"?"is-active":""}">
        <span>With lead-in · ${k(e.withLeadIn)}</span>
        ${b(a,"capital-kerning-editor__comparison-svg","withLeadIn")}
      </button>
      <button type="button" data-mode="withoutLeadIn" class="capital-kerning-editor__comparison-card ${d==="withoutLeadIn"?"is-active":""}">
        <span>Without lead-in · ${k(e.withoutLeadIn)}</span>
        ${b(a,"capital-kerning-editor__comparison-svg","withoutLeadIn")}
      </button>
    </div>
    <div class="capital-kerning-editor__nav">
      <button class="kerning-editor__button" id="capital-previous" type="button">Previous</button>
      <button class="kerning-editor__button kerning-editor__button--primary" id="capital-review-next" type="button">${e.reviewed?"Reviewed · next":"Mark reviewed · next"}</button>
      <button class="kerning-editor__button" id="capital-next" type="button">Next</button>
    </div>
    <p class="capital-kerning-editor__hint">Drag the large preview horizontally to adjust the active gap. Use ←/→ to move through pairs.</p>
  `,(n=p.querySelector("#capital-gap"))==null||n.addEventListener("input",o=>{V(a,Number(o.currentTarget.value))}),(i=p.querySelector("#capital-gap"))==null||i.addEventListener("change",()=>{$(),v()}),(c=p.querySelector("#capital-preview-wrap"))==null||c.addEventListener("pointerdown",o=>{o.button===0&&(o.preventDefault(),ue(o,o.currentTarget))}),p.querySelectorAll("[data-mode]").forEach(o=>{o.addEventListener("click",()=>z(o.dataset.mode))}),(s=p.querySelector("#capital-previous"))==null||s.addEventListener("click",()=>y(-1)),(l=p.querySelector("#capital-next"))==null||l.addEventListener("click",()=>y(1)),(w=p.querySelector("#capital-review-next"))==null||w.addEventListener("click",pe)}function v(){const e=K();se.textContent=`${e.length} shown`,j.innerHTML=e.map(t=>{const n=r[t];return`
      <button class="kerning-card capital-kerning-card ${t===a?"kerning-card--selected":""}" data-pair="${t}" type="button">
        <span class="kerning-card__header">
          <span class="kerning-card__pair">${t}</span>
          <span class="kerning-card__tools">
            <span class="capital-kerning-editor__rank">#${(A.get(t)??0)+1}</span>
            <span class="kerning-card__source ${n.reviewed?"kerning-card__source--override":""}"></span>
          </span>
        </span>
        ${b(t,"kerning-card__svg")}
        <span class="kerning-card__footer">
          <span class="kerning-card__value">${k(n[d])}</span>
          <span class="kerning-card__value">${n.reviewed?"reviewed":"todo"}</span>
        </span>
      </button>
    `}).join(""),j.querySelectorAll("[data-pair]").forEach(t=>{t.addEventListener("click",()=>de(t.dataset.pair??a))})}function S(){const e=Object.values(r).filter(t=>t.reviewed).length;oe.textContent=`${e} / ${m.length} reviewed · ${f?"unsaved":"saved"} · ${x}`}function q(){$(),v(),S()}function V(e,t,n=!1){if(Number.isFinite(t)){if(r={...r,[e]:{...r[e],[d]:D(B(t))}},f=!0,n)$();else{const i=p.querySelector("#capital-preview-wrap");i&&(i.innerHTML=b(e,"kerning-editor__preview"))}S(),n||(_.textContent=`${e} ${d==="withLeadIn"?"with":"without"} lead-in set to ${k(r[e][d])}.`)}}function z(e){d=e,M.value=e,q()}function de(e){a=e,$(),v()}function y(e){const t=K();if(t.length===0)return;const n=Math.max(0,t.indexOf(a));a=t[(n+e+t.length)%t.length],$(),v()}function pe(){r={...r,[a]:{...r[a],reviewed:!0}},f=!0,y(1),S()}function ue(e,t){const n=t.querySelector("svg"),i=n==null?void 0:n.getBoundingClientRect(),c=(n==null?void 0:n.viewBox.baseVal.width)??600;g={pair:a,startX:e.clientX,startGap:r[a][d],unitsPerPixel:i&&i.width>0?c/i.width:3},document.body.classList.add("kerning-editor--dragging")}function Q(){g&&v(),g=null,document.body.classList.remove("kerning-editor--dragging")}async function ge(){const e=window;try{if(e.showOpenFilePicker){const[t]=await e.showOpenFilePicker({multiple:!1,types:[{description:"Kerning JSON",accept:{"application/json":[".json"]}}]});if(!t)return;h=t,Z(await(await t.getFile()).text(),t.name)}else L.click()}catch{_.textContent="Open cancelled."}}function Z(e,t){r=W(JSON.parse(e)),x=t,f=!1,_.textContent=`Loaded ${t}.`,q()}async function we(){const e=window;try{if(!h&&e.showSaveFilePicker&&(h=await e.showSaveFilePicker({suggestedName:"capital-to-lowercase-kerning.json",types:[{description:"Kerning JSON",accept:{"application/json":[".json"]}}]})),!h){ee();return}const t=await h.createWritable();await t.write(`${JSON.stringify(Y(),null,2)}
`),await t.close(),x=h.name,f=!1,_.textContent=`Saved ${x}.`,S()}catch{_.textContent="Save cancelled or unavailable."}}function ee(){const e=new Blob([`${JSON.stringify(Y(),null,2)}
`],{type:"application/json"}),t=URL.createObjectURL(e),n=document.createElement("a");n.href=t,n.download="capital-to-lowercase-kerning.json",n.click(),URL.revokeObjectURL(t),_.textContent="Downloaded capital-to-lowercase-kerning.json."}var F;(F=document.querySelector("#capital-open"))==null||F.addEventListener("click",ge);var P;(P=document.querySelector("#capital-save"))==null||P.addEventListener("click",we);var H;(H=document.querySelector("#capital-download"))==null||H.addEventListener("click",ee);M.addEventListener("change",()=>z(M.value));O.addEventListener("change",()=>{E=O.value,v()});C.addEventListener("input",()=>{U=C.value,v()});L.addEventListener("change",async()=>{var t;const e=(t=L.files)==null?void 0:t[0];e&&Z(await e.text(),e.name),L.value=""});window.addEventListener("pointermove",e=>{g&&V(g.pair,g.startGap+(e.clientX-g.startX)*g.unitsPerPixel,!0)});window.addEventListener("pointerup",Q);window.addEventListener("pointercancel",Q);window.addEventListener("keydown",e=>{e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||(e.key==="ArrowLeft"&&y(-1),e.key==="ArrowRight"&&y(1))});window.addEventListener("beforeunload",e=>{f&&e.preventDefault()});q();
