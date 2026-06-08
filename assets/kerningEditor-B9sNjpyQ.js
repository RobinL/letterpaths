import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{e as he,i as we,l as Se}from"./joiner-BRDm9gm1.js";const _e=["th","he","in","er","an","re","on","at","en","nd","ti","es","or","te","of","ed","is","it","al","ar","st","to","nt","ng","se","ha","as","ou","io","le","ve","co","me","de","hi","ri","ro","ic","ne","ea","ra","ce","li","ch","ll","be","ma","si","om","ur","ca","el","ta","la","ns","di","fo","ho","pe","ec","pr","no","ct","us","ac","ot","il","tr","ly","nc","et","ut","ss","so","rs","un","lo","wa","ge","ie","wh","ee","wi","em","ad","ol","rt","po","we","na","ul","ni","ts","mo","ow","pa","im","mi","ai","sh","ir","su","id","os","iv","ia","am","fi","ci","vi","pl","ig","tu","ev","ld","ry","mp","fe","bl","ab","gh","ty","op","wo","sa","ay","ex","ke","fr","oo","av","ag","if","ap","gr","od","bo","sp","rd","do","uc","bu","ei","ov","by","rm","ep","tt","oc","fa","ef","cu","rn","sc","gi","da","yo","cr","cl","du","ga","qu","ue","ff","ba","ey","ls","va","um","pp","ua","up","lu","go","ht","ru","ug","ds","lt","pi","rc","rr","eg","au","ck","ew","mu","br","bi","pt","ak","pu","ui","rg","ib","tl","ny","ki","rk","ys","ob","mm","fu","ph","og","ms","ye","ud","mb","ip","ub","oi","rl","gu","dr","hr","cc","tw","ft","wn","nu","af","hu","nn","eo","vo","rv","nf","xp","gn","sm","fl","iz","ok","nl","my","gl","aw","ju","oa","eq","sy","sl","ps","jo","lf","nv","je","nk","kn","gs","dy","hy","ze","ks","xt","bs","ik","dd","cy","rp","sk","xi","oe","oy","ws","lv","dl","rf","eu","dg","wr","xa","yi","nm","eb","rb","tm","xc","eh","tc","gy","ja","hn","yp","za","gg","ym","sw","bj","lm","cs","ii","ix","xe","oh","lk","dv","lp","ax","ox","uf","dm","iu","sf","bt","ka","yt","ek","pm","ya","gt","wl","rh","yl","hs","ah","yc","yn","rw","hm","lw","hl","ae","zi","az","lc","py","aj","iq","nj","bb","nh","uo","kl","lr","tn","gm","sn","nr","fy","mn","dw","sb","yr","dn","sq","zo","oj","yd","lb","wt","lg","ko","np","sr","nq","ky","ln","nw","tf","fs","cq","dh","sd","vy","dj","hw","xu","ao","ml","uk","uy","ej","ez","hb","nz","nb","mc","yb","tp","xh","ux","tz","bv","mf","wd","oz","yw","kh","gd","bm","mr","ku","uv","dt","hd","aa","xx","df","db","ji","kr","xo","cm","zz","nx","yg","xy","kg","tb","dc","bd","sg","wy","zy","aq","hf","cd","vu","kw","zu","bn","ih","tg","xv","uz","bc","xf","yz","km","dp","lh","wf","kf","pf","cf","mt","yu","cp","pb","td","zl","sv","hc","mg","pw","gf","pd","pn","pc","rx","tv","ij","wm","uh","wk","wb","bh","oq","kt","rq","kb","cg","vr","cn","pk","uu","yf","wp","cz","kp","dq","wu","fm","wc","md","kd","zh","gw","rz","cb","iw","xl","hp","mw","vs","fc","rj","bp","mh","hh","yh","uj","fg","fd","gb","pg","tk","kk","hq","fn","lz","vl","gp","hz","dk","yk","qi","lx","vd","zs","bw","xq","mv","uw","hg","fb","sj","ww","gk","uq","bg","sz","jr","ql","zt","hk","vc","xm","gc","fw","pz","kc","hv","xw","zw","fp","iy","pv","vt","jp","cv","zb","vp","zr","fh","yv","zg","zm","zv","qs","kv","vn","zn","qa","yx","jn","bf","mk","cw","jm","lq","jh","kj","jc","gz","js","tx","fk","jl","vm","lj","tj","jj","cj","vg","mj","jt","pj","wg","vh","bk","vv","jd","tq","vb","jf","dz","xb","jb","zc","fj","yy","qn","xs","qr","jk","jv","qq","xn","vf","px","zd","qt","zp","qo","dx","hj","gv","jw","qc","jy","gj","qb","pq","jg","bz","mx","qm","mz","qf","wj","zq","xr","zk","cx","fx","fv","bx","vw","vj","mq","qv","zf","qe","yj","gx","kx","xg","qd","xj","sx","vz","vx","wv","yq","bq","gq","vk","zj","xk","qp","hx","fz","qh","qj","jz","vq","kq","xd","qw","jx","qx","kz","wx","fq","xz","zx","jq","qg","qk","qy","qz","wq","wz"],I=new Map(_e.map((e,t)=>[e,t])),ee=document.querySelector("#app");if(!ee)throw new Error("Missing #app element for kerning editor.");const W="abcdefghijklmnopqrstuvwxyz".split(""),te=W.flatMap(e=>W.map(t=>`${e}${t}`)),z={xHeight:360,baseline:720},$e=Se,T=-500,B=500,x=0,h=2,Q=.005,qe="letterpaths-kerning-editor-handles",$="handles",je=1,ne="cursive-kerning-json",V=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),v=(e,t,n)=>Math.min(n,Math.max(t,e)),X=e=>Math.round(e*10)/10,F=e=>Math.round(e*100)/100,q=e=>e.toFixed(1),k=e=>e.toFixed(2),He=e=>`M ${e.p0.x} ${e.p0.y} C ${e.p1.x} ${e.p1.y} ${e.p2.x} ${e.p2.y} ${e.p3.x} ${e.p3.y}`,re=e=>{if(!e||typeof e!="object")return{};const t="pairs"in e&&e.pairs&&typeof e.pairs=="object"?e.pairs:e,n={};return Object.entries(t).forEach(([r,i])=>{const a=r.toLowerCase();if(!/^[a-z]{2}$/.test(a))return;const s=i&&typeof i=="object"?i:null,c=typeof i=="number"?i:s&&"sidebearingGap"in s?Number(s.sidebearingGap):Number.NaN,u=s&&"exitHandleScale"in s?Number(s.exitHandleScale):Number.NaN,b=s&&"entryHandleScale"in s?Number(s.entryHandleScale):Number.NaN,m={...Number.isFinite(c)?{sidebearingGap:X(v(c,T,B))}:{},...Number.isFinite(u)?{exitHandleScale:F(v(u,x,h))}:{},...Number.isFinite(b)?{entryHandleScale:F(v(b,x,h))}:{}};Object.keys(m).length!==0&&(n[a]=m)}),Object.fromEntries(Object.entries(n).sort(([r],[i])=>r.localeCompare(i)))},ie=()=>({schemaVersion:1,description:"Hard-coded cursive pair kerning. Each lowercase two-letter key can store sidebearingGap, exitHandleScale, and entryHandleScale.",units:"letterpath sidebearing gap and Bezier handle scale",pairs:Object.fromEntries(Object.entries(l).sort(([e],[t])=>e.localeCompare(t)))});let l=re(we),o="aa",g=null,f=null,L="packages/letterpaths/src/data/cursive-kerning.json",w=!1,y="all",G="";ee.innerHTML=`
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
`;const ae=document.querySelector("#kerning-editor-meta"),d=document.querySelector("#kerning-status"),se=document.querySelector("#kerning-open"),oe=document.querySelector("#kerning-save"),le=document.querySelector("#kerning-download"),P=document.querySelector("#kerning-load-input"),M=document.querySelector("#kerning-filter"),D=document.querySelector("#kerning-search"),p=document.querySelector("#kerning-selected"),j=document.querySelector("#kerning-grid"),ce=document.querySelector("#kerning-grid-count");if(!ae||!d||!se||!oe||!le||!P||!M||!D||!p||!j||!ce)throw new Error("Missing elements for kerning editor.");function S(e){var J;const t=l[e],n=he(e,{style:"cursive",targetGuides:z,joinKerning:t?{[e]:t}:{},letters:$e}),r=((J=n.joinMetrics)==null?void 0:J[0])??null,i=(r==null?void 0:r.renderedSidebearingGap)??(t==null?void 0:t.sidebearingGap)??0,a=(r==null?void 0:r.exitHandleScale)??(t==null?void 0:t.exitHandleScale)??1,s=(r==null?void 0:r.entryHandleScale)??(t==null?void 0:t.entryHandleScale)??1,c=120,u=110,b=n.bounds.minX-c,m=n.bounds.maxX+c,U=Math.min(n.bounds.minY,z.xHeight)-u,xe=Math.max(n.bounds.maxY,z.baseline)+u;return{path:n,metric:r,gap:i,exitHandleScale:a,entryHandleScale:s,source:t?"override":"default",viewBox:`${b} ${U} ${Math.max(420,m-b)} ${Math.max(420,xe-U)}`,minX:b,maxX:m,baselineY:z.baseline,xHeightY:z.xHeight}}function de(e){var r;const t=e.path.strokes.flatMap(i=>i.curves.map((a,s)=>{var u;return`<path class="kerning-svg__stroke ${((u=i.curveSegments)==null?void 0:u[s])==="join"?"kerning-svg__stroke--join":""}" d="${He(a)}"></path>`})).join(""),n=(r=e.metric)==null?void 0:r.actualNextLeftSidebearingX;return`
    <line class="kerning-svg__guide kerning-svg__guide--xheight" x1="${e.minX}" y1="${e.xHeightY}" x2="${e.maxX}" y2="${e.xHeightY}"></line>
    <line class="kerning-svg__guide kerning-svg__guide--baseline" x1="${e.minX}" y1="${e.baselineY}" x2="${e.maxX}" y2="${e.baselineY}"></line>
    ${n===void 0?"":`<line class="kerning-svg__sidebearing" x1="${n}" y1="${e.xHeightY-190}" x2="${n}" y2="${e.baselineY+90}"></line>`}
    ${t}
  `}function ue(e,t){const n=S(e);return`
    <svg class="${t}" viewBox="${n.viewBox}" aria-hidden="true">
      ${de(n)}
    </svg>
  `}function ge(e){const t=S(e);return`
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
      <span class="kerning-card__value">${q(t.gap)}</span>
      <span class="kerning-card__value">${t.source==="override"?`h ${k(t.exitHandleScale)}/${k(t.entryHandleScale)}`:"default"}</span>
    </div>
  `}function Ee(e){const t=!!l[e];return y==="override"&&!t||y==="default"&&t?!1:!G||e.includes(G)}function ze(e){return`
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
      ${t.length===0?'<p class="kerning-editor__empty">No pairs here.</p>':`<div class="kerning-editor__pair-grid">${t.map(ze).join("")}</div>`}
    </section>
  `}function Ce(e,t){const n=I.get(e)??Number.MAX_SAFE_INTEGER,r=I.get(t)??Number.MAX_SAFE_INTEGER;return n-r||e.localeCompare(t)}function _(){const e=te.filter(Ee),t=e.filter(r=>!l[r]).sort(Ce),n=e.filter(r=>l[r]);j.innerHTML=[y==="override"?"":Z("To do",t),y==="default"?"":Z("Done",n)].join(""),ce.textContent=y==="all"?`${t.length} to do, ${n.length} done`:`${e.length} shown`}function O(e){const t=j.querySelector(`[data-pair="${e}"]`);t&&(t.classList.toggle("kerning-card--selected",e===o),t.innerHTML=ge(e))}function H(){var n,r,i,a,s;const e=S(o),t=l[o];p.innerHTML=`
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
        <input id="kerning-selected-gap" type="number" min="${T}" max="${B}" step="0.1" value="${q(e.gap)}" />
      </label>
      <label class="kerning-editor__field">
        p0-p1 handle scale
        <input id="kerning-selected-exit-handle" type="number" min="${x}" max="${h}" step="0.05" value="${k(e.exitHandleScale)}" />
      </label>
      <label class="kerning-editor__field">
        p2-p3 handle scale
        <input id="kerning-selected-entry-handle" type="number" min="${x}" max="${h}" step="0.05" value="${k(e.entryHandleScale)}" />
      </label>
      <button class="kerning-editor__button" id="kerning-reset-selected" type="button" ${t?"":"disabled"}>Reset</button>
    </div>
    <div class="kerning-editor__metrics" id="kerning-selected-metrics">
      ${pe(e)}
    </div>
  `,(n=p.querySelector("#kerning-selected-gap"))==null||n.addEventListener("input",c=>{const u=c.currentTarget;Y(o,Number(u.value),!0)}),(r=p.querySelector("#kerning-selected-exit-handle"))==null||r.addEventListener("input",c=>{const u=c.currentTarget;N(o,"exitHandleScale",Number(u.value),!0)}),(i=p.querySelector("#kerning-selected-entry-handle"))==null||i.addEventListener("input",c=>{const u=c.currentTarget;N(o,"entryHandleScale",Number(u.value),!0)}),(a=p.querySelector("#kerning-reset-selected"))==null||a.addEventListener("click",()=>{Pe(o)}),(s=p.querySelector("#kerning-selected-preview-wrap"))==null||s.addEventListener("pointerdown",c=>{c.button===0&&(c.preventDefault(),ke(o,c,c.currentTarget))})}function pe(e){return`
    ${C("Rendered gap",q(e.gap))}
    ${e.metric?C("Base sidebearing gap",q(e.metric.baseSidebearingGap)):""}
    ${C("p0-p1 handle scale",k(e.exitHandleScale))}
    ${C("p2-p3 handle scale",k(e.entryHandleScale))}
    ${C("Source",e.source)}
  `}function K(e=!1){const t=S(o),n=l[o],r=p.querySelector("#kerning-selected-title"),i=p.querySelector("#kerning-selected-badge"),a=p.querySelector("#kerning-selected-preview-wrap"),s=p.querySelector("#kerning-selected-metrics"),c=p.querySelector("#kerning-reset-selected");if(r&&(r.textContent=o.toUpperCase()),i&&(i.textContent=t.source==="override"?"override":"default",i.classList.toggle("kerning-editor__badge--override",t.source==="override")),a&&(a.innerHTML=ue(o,"kerning-editor__preview")),s&&(s.innerHTML=pe(t)),c&&(c.disabled=!n),e){const u=p.querySelector("#kerning-selected-gap"),b=p.querySelector("#kerning-selected-exit-handle"),m=p.querySelector("#kerning-selected-entry-handle");u&&(u.value=q(t.gap)),b&&(b.value=k(t.exitHandleScale)),m&&(m.value=k(t.entryHandleScale))}}function C(e,t){return`
    <div class="kerning-editor__metric">
      <span>${V(e)}</span>
      <strong>${V(t)}</strong>
    </div>
  `}function E(){const e=Object.keys(l).length,t=w?"unsaved":"saved";ae.textContent=`${e} / ${te.length} pairs set | ${t} | ${L}`}function fe(){H(),_(),E()}function be(e){const t=o;o=e,O(t),O(o),H()}function Y(e,t,n=!1){if(!Number.isFinite(t))return;const r=!!l[e],i=X(v(t,T,B));l={...l,[e]:{...l[e],sidebearingGap:i}},w=!0,r?O(e):_(),e===o?K(!n):n||H(),E(),d.textContent=`${e.toUpperCase()} set to ${q(i)}.`}function N(e,t,n,r=!1){if(!Number.isFinite(n))return;const i=!!l[e],a=F(v(n,x,h));l={...l,[e]:{...l[e],[t]:a}},w=!0,i?O(e):_(),e===o?K(!r):r||H(),E(),d.textContent=`${e.toUpperCase()} ${t} set to ${k(a)}.`}function Le(e){const t=S(e);l={...l,[e]:{sidebearingGap:X(v(t.gap,T,B)),exitHandleScale:F(v(t.exitHandleScale,x,h)),entryHandleScale:F(v(t.entryHandleScale,x,h))}},w=!0,_(),e===o&&H(),E(),d.textContent=`${e.toUpperCase()} saved as an override.`}function Pe(e){if(!l[e])return;const t={...l};delete t[e],l=t,w=!0,_(),H(),E(),d.textContent=`${e.toUpperCase()} reset to built-in default.`}function ke(e,t,n){const r=S(e),i=n.querySelector("svg"),a=i==null?void 0:i.getBoundingClientRect(),s=(i==null?void 0:i.viewBox.baseVal.width)??600;g={pair:e,startClientX:t.clientX,startClientY:t.clientY,startGap:r.gap,startExitHandleScale:r.exitHandleScale,startEntryHandleScale:r.entryHandleScale,unitsPerPx:a&&a.width>0?s/a.width:3},document.body.classList.add("kerning-editor--dragging"),be(e)}function me(){g&&(g=null,document.body.classList.remove("kerning-editor--dragging"))}function A(e,t){const n=JSON.parse(e);l=re(n),L=t,w=!1,y="all",M.value="all",d.textContent=`Loaded ${t}.`,fe()}async function Ne(){const e=window;if(!e.showOpenFilePicker){P.click();return}try{const[t]=await e.showOpenFilePicker({id:"letterpaths-cursive-kerning",multiple:!1,types:[{description:"Kerning JSON",accept:{"application/json":[".json"]}}]});if(!t)return;f=t;const n=await t.getFile();A(await n.text(),t.name),await R(t)}catch{d.textContent="Open cancelled."}}async function Fe(e){var n,r;const t={mode:"readwrite"};try{return await((n=e.queryPermission)==null?void 0:n.call(e,t))==="granted"?!0:await((r=e.requestPermission)==null?void 0:r.call(e,t))==="granted"}catch{return!1}}async function ve(){const e=window;if(!f){if(!e.showSaveFilePicker){d.textContent="Open a writable kerning JSON file before saving.";return}try{f=await e.showSaveFilePicker({id:"letterpaths-cursive-kerning",suggestedName:"cursive-kerning.json",types:[{description:"Kerning JSON",accept:{"application/json":[".json"]}}]}),L=f.name,await R(f)}catch{d.textContent="Save cancelled.";return}}if(!await Fe(f)){d.textContent="Write permission was not granted.";return}const n=`${JSON.stringify(ie(),null,2)}
`;try{const r=await f.createWritable();if(await r.write(n),await r.truncate(n.length),await r.close(),await(await f.getFile()).text()!==n){d.textContent="Save verification failed.";return}w=!1,L=f.name,await R(f),E(),d.textContent=`Saved ${L}.`}catch{d.textContent="Failed to save kerning JSON."}}async function Me(){const e=await Ke();if(!e)return;if(await Oe(e,"read")!=="granted"){d.textContent=`Remembered ${e.name}; open it once to restore editable access.`;return}try{const n=await e.getFile();f=e,A(await n.text(),e.name),d.textContent=`Restored editable ${e.name}.`}catch{f=null,d.textContent="Remembered kerning file could not be restored."}}async function Oe(e,t){var n;try{return await((n=e.queryPermission)==null?void 0:n.call(e,{mode:t}))??"prompt"}catch{return"prompt"}}async function R(e){try{const t=await ye();return await Te(t,e),t.close(),!0}catch{return d.textContent="Opened kerning file; reload restore is unavailable in this browser.",!1}}async function Ke(){try{const e=await ye(),t=await Be(e);return e.close(),t}catch{return null}}function ye(){return new Promise((e,t)=>{const n=indexedDB.open(qe,je);n.addEventListener("upgradeneeded",()=>{const r=n.result;r.objectStoreNames.contains($)||r.createObjectStore($)}),n.addEventListener("success",()=>e(n.result)),n.addEventListener("error",()=>t(n.error))})}function Te(e,t){return new Promise((n,r)=>{const i=e.transaction($,"readwrite");i.objectStore($).put({handle:t,name:t.name,updatedAt:Date.now()},ne),i.addEventListener("complete",()=>n()),i.addEventListener("error",()=>r(i.error)),i.addEventListener("abort",()=>r(i.error))})}function Be(e){return new Promise((t,n)=>{const a=e.transaction($,"readonly").objectStore($).get(ne);a.addEventListener("success",()=>{const s=a.result;t((s==null?void 0:s.handle)??null)}),a.addEventListener("error",()=>n(a.error))})}function Ge(){const e=`${JSON.stringify(ie(),null,2)}
`,t=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="cursive-kerning.json",r.click(),URL.revokeObjectURL(n)}j.addEventListener("pointerdown",e=>{var n,r;if(e.button!==0||(n=e.target)!=null&&n.closest("[data-pair-save]"))return;const t=(r=e.target)==null?void 0:r.closest("[data-pair]");t&&(e.preventDefault(),ke(t.dataset.pair??o,e,t))});j.addEventListener("click",e=>{var n;const t=(n=e.target)==null?void 0:n.closest("[data-pair-save]");t&&(e.preventDefault(),e.stopPropagation(),Le(t.dataset.pairSave??o))});window.addEventListener("pointermove",e=>{if(!g)return;const t=(g.startClientY-e.clientY)*Q;if(e.shiftKey){const r=g.startEntryHandleScale+(e.clientX-g.startClientX)*Q;N(g.pair,"exitHandleScale",g.startExitHandleScale+t),N(g.pair,"entryHandleScale",r);return}const n=g.startGap+(e.clientX-g.startClientX)*g.unitsPerPx;Y(g.pair,n),N(g.pair,"exitHandleScale",g.startExitHandleScale+t)});window.addEventListener("pointerup",me);window.addEventListener("pointercancel",me);function De(e){return e instanceof HTMLElement?e.isContentEditable||e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement:!1}window.addEventListener("keydown",e=>{e.key.toLowerCase()!=="s"||e.metaKey||e.ctrlKey||e.altKey||De(e.target)||(e.preventDefault(),ve())});j.addEventListener("keydown",e=>{var a;const t=(a=e.target)==null?void 0:a.closest("[data-pair]");if(!t)return;const n=t.dataset.pair??o;if(e.key==="Enter"||e.key===" "){e.preventDefault(),be(n);return}if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return;e.preventDefault();const r=e.key==="ArrowRight"?1:-1,i=e.shiftKey?5:1;Y(n,S(n).gap+r*i)});se.addEventListener("click",()=>{Ne()});oe.addEventListener("click",()=>{ve()});le.addEventListener("click",Ge);P.addEventListener("change",async()=>{var t;const e=(t=P.files)==null?void 0:t[0];e&&(f=null,A(await e.text(),e.name),P.value="")});M.addEventListener("change",()=>{y=M.value,_()});D.addEventListener("input",()=>{G=D.value.trim().toLowerCase(),_()});fe();d.textContent="Loaded built-in kerning settings.";Me();
