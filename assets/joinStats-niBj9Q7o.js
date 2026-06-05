import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{h as V,e as W,C as K,l as U}from"./joiner-BVxCW5LS.js";const R=document.querySelector("#app");if(!R)throw new Error("Missing #app element for join stats.");const Q="cursive",Z={xHeight:360,baseline:720},tt=U,b=[{key:"sidebearingGapAdjustment",label:"Letter spacing adjustment",min:-120,max:120,step:5,value:V.sidebearingGapAdjustment}];R.innerHTML=`
  <main class="join-stats">
    <header class="join-stats__header">
      <div>
        <h1>Join stats</h1>
        <p>Inspect hard-coded spacing for adjacent cursive letters.</p>
      </div>
    </header>

    <section class="join-stats__topbar">
      <form class="join-stats__form" id="join-stats-form">
        <label class="join-stats__field">
          Text to join
          <input
            class="join-stats__input"
            id="join-stats-word"
            type="text"
            value="${Q}"
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <button class="join-stats__button" type="submit">Join</button>
      </form>
    </section>

    <section class="join-stats__controls">
      <div class="join-stats__controls-title">
        <h2>Join spacing controls</h2>
        <span>Changes re-run the cursive joiner</span>
      </div>
      <div class="join-stats__slider-grid">
        ${b.map(t=>`
              <label class="join-stats__field">
                ${t.label}
                <div class="join-stats__range-row">
                  <input
                    class="join-stats__range"
                    id="join-stats-${t.key}"
                    type="range"
                    min="${t.min}"
                    max="${t.max}"
                    step="${t.step}"
                    value="${t.value}"
                  />
                  <span class="join-stats__range-value" id="join-stats-${t.key}-value">
                    ${t.value}
                  </span>
                </div>
              </label>
            `).join("")}
      </div>
    </section>

    <section class="join-stats__layout">
      <article class="join-stats__panel">
        <div class="join-stats__panel-title">
          <h2>Segments</h2>
          <span id="join-stats-selection-label">Click a letter to select a join</span>
        </div>
        <svg class="join-stats__svg" id="join-stats-word-svg" viewBox="0 0 1600 900"></svg>
      </article>

      <article class="join-stats__panel">
        <div class="join-stats__panel-title">
          <h2>Detailed calculations</h2>
          <span id="join-stats-pair-label">No pair selected</span>
        </div>
        <div class="join-stats__metrics" id="join-stats-metrics"></div>
      </article>

      <article class="join-stats__panel">
        <div class="join-stats__panel-title">
          <h2>Calculation visual</h2>
          <span>Hard-coded gap, adjustment and actual placement</span>
        </div>
        <svg
          class="join-stats__svg join-stats__svg--calculation"
          id="join-stats-calculation-svg"
          viewBox="0 0 1200 800"
        ></svg>
      </article>
    </section>
  </main>
`;const I=document.querySelector("#join-stats-form"),q=document.querySelector("#join-stats-word"),f=document.querySelector("#join-stats-word-svg"),j=document.querySelector("#join-stats-calculation-svg"),P=document.querySelector("#join-stats-metrics"),L=document.querySelector("#join-stats-selection-label"),Y=document.querySelector("#join-stats-pair-label");if(!I||!q||!f||!j||!P||!L||!Y)throw new Error("Missing elements for join stats.");const v=Object.fromEntries(b.map(t=>[t.key,document.querySelector(`#join-stats-${t.key}`)])),G=Object.fromEntries(b.map(t=>[t.key,document.querySelector(`#join-stats-${t.key}-value`)]));if(Object.values(v).some(t=>!t)||Object.values(G).some(t=>!t))throw new Error("Missing join spacing controls for join stats.");let l=0,x=0;const et=["previousExitX","previousRightSidebearingX","actualNextLeftSidebearingX","nextEntryX"],h=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),p=(t,s=2)=>{if(!Number.isFinite(t))return"0";const e=Math.abs(t)>=100?Math.min(s,1):s;return t.toFixed(e)},T=(t,s,e)=>Math.min(e,Math.max(s,t)),$=(t,s,e)=>`<span class="join-stats__formula-token ${s}" title="${h(e)}">${h(t)}</span>`,B=()=>{var t;return{sidebearingGapAdjustment:Number(((t=v.sidebearingGapAdjustment)==null?void 0:t.value)??0)}},J=()=>{b.forEach(t=>{const s=v[t.key],e=G[t.key];!s||!e||(e.textContent=Number(s.value).toFixed(0))})},st=t=>{if(t.length===0)return"";const[s,...e]=t;let a=`M ${s.p0.x} ${s.p0.y} `;return[s,...e].forEach(n=>{a+=`C ${n.p1.x} ${n.p1.y} ${n.p2.x} ${n.p2.y} ${n.p3.x} ${n.p3.y} `}),a.trim()},D=t=>`M ${t.p0.x} ${t.p0.y} C ${t.p1.x} ${t.p1.y} ${t.p2.x} ${t.p2.y} ${t.p3.x} ${t.p3.y}`,at=(t,s,e)=>({...t,strokes:t.strokes.map(a=>({...a,curves:a.curves.map(n=>new K({x:n.p0.x+s,y:n.p0.y+e},{x:n.p1.x+s,y:n.p1.y+e},{x:n.p2.x+s,y:n.p2.y+e},{x:n.p3.x+s,y:n.p3.y+e}))})),bounds:{minX:t.bounds.minX+s,maxX:t.bounds.maxX+s,minY:t.bounds.minY+e,maxY:t.bounds.maxY+e}}),nt=(t,s)=>{const e={...t};return et.forEach(a=>{e[a]=t[a]+s}),e},O=t=>{const s=[];return t.strokes.forEach(e=>{e.curves.forEach((a,n)=>{var i;((i=e.curveSegments)==null?void 0:i[n])==="join"&&s.push(a)})}),s},it=(t,s)=>{const e={"lead-in":"#5f9ed1",entry:"#2b6fa7",body:"#188977",ascender:"#315a9d",descender:"#0d7f8c",exit:"#4f8f38","lead-out":"#7cae4f",dot:"#4d9fb2"},a=["#2b6fa7","#188977","#315a9d","#4f8f38","#5f9ed1","#7cae4f"];return t?e[t]??a[s%a.length]:a[s%a.length]},ot=t=>{let s=0,e=0;return t.strokes.flatMap(a=>a.curves.map((n,i)=>{var d;const r=(d=a.curveSegments)==null?void 0:d[i],o=D(n);if(r==="join"){const c=e===l;return e+=1,`<path class="join-stats__segment-path join-stats__segment-path--join ${c?"join-stats__segment-path--selected-join":""}" d="${o}"></path>`}const g=it(r,s);return s+=1,`<path class="join-stats__segment-path" d="${o}" stroke="${g}" stroke-opacity="0.74" stroke-width="42"></path>`})).join("")},rt=t=>{const s=O(t)[l];if(!s)return"";const e=[{label:"p0",point:s.p0,type:"end"},{label:"p1",point:s.p1,type:"control"},{label:"p2",point:s.p2,type:"control"},{label:"p3",point:s.p3,type:"end"}];return`
    <g class="join-stats__anchor-overlay" aria-label="Selected join Bezier anchors">
      <line class="join-stats__anchor-handle" x1="${s.p0.x}" y1="${s.p0.y}" x2="${s.p1.x}" y2="${s.p1.y}"></line>
      <line class="join-stats__anchor-handle" x1="${s.p3.x}" y1="${s.p3.y}" x2="${s.p2.x}" y2="${s.p2.y}"></line>
      ${e.map(({label:a,point:n,type:i})=>`
            <g>
              <circle
                class="join-stats__anchor-point join-stats__anchor-point--${i}"
                cx="${n.x}"
                cy="${n.y}"
                r="${i==="control"?10:12}"
              ></circle>
              <text class="join-stats__anchor-label" x="${n.x+14}" y="${n.y-12}">${a}</text>
            </g>
          `).join("")}
    </g>
  `},lt=(t,s,e)=>{const a=[];return s.length===0||s.forEach((n,i)=>{const r=s[i-1],o=s[i+1];if(!r||r.nextChar!==n.previousChar){const y=i===0?Math.min(t.bounds.minX,0):Math.min(n.previousExitX-180,n.previousRightSidebearingX-260);a.push({index:a.length,char:n.previousChar,leftX:y+e,rightX:n.previousRightSidebearingX+e,selectPairIndex:i,nextPairIndex:i})}const d=(o==null?void 0:o.previousChar)===n.nextChar,c=a[a.length-1],_=c?Math.max(130,c.rightX-c.leftX):260,m=d?o.previousRightSidebearingX:Math.max(t.bounds.maxX,n.actualNextLeftSidebearingX+_);a.push({index:a.length,char:n.nextChar,leftX:n.actualNextLeftSidebearingX+e,rightX:m+e,selectPairIndex:d?i+1:i,previousPairIndex:i,nextPairIndex:d?i+1:void 0})}),a},z=t=>t.previousPairIndex===l||t.nextPairIndex===l,ct=(t,s)=>t.map(e=>{const a=Math.min(e.leftX,e.rightX),n=Math.max(48,Math.abs(e.rightX-e.leftX)),i=a+n/2;return`
        <g
          class="join-stats__letter-zone ${z(e)?"join-stats__letter-zone--selected":""}"
          data-pair-index="${e.selectPairIndex}"
        >
          <rect x="${a}" y="20" width="${n}" height="${s-40}" rx="8"></rect>
          <text x="${i}" y="58" text-anchor="middle">${h(e.char)}</text>
        </g>
      `}).join(""),C=(t,s)=>{t.setAttribute("viewBox","0 0 1200 520"),t.innerHTML=`
    <rect class="join-stats__bg" x="0" y="0" width="1200" height="520"></rect>
    <text class="join-stats__empty" x="600" y="270" text-anchor="middle">${h(s)}</text>
  `},dt=t=>{const s=t.trim().toLowerCase();if(!s)return null;const e=W(s,{style:"cursive",targetGuides:Z,joinSpacing:B(),letters:tt});if(e.strokes.length===0)return null;const a=120,n=Math.max(1e3,Math.ceil(e.bounds.maxX-e.bounds.minX+a*2)),i=Math.max(740,Math.ceil(e.bounds.maxY-e.bounds.minY+a*2)),r=a-e.bounds.minX,o=a-e.bounds.minY,g=at(e,r,o),d=e.joinMetrics??[],c=lt(e,d,r);return{path:e,shiftedPath:g,metrics:d,slots:c,width:n,height:i,offsetX:r,offsetY:o}},pt=t=>{f.setAttribute("viewBox",`0 0 ${t.width} ${t.height}`),f.innerHTML=`
    <rect class="join-stats__bg" x="0" y="0" width="${t.width}" height="${t.height}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${t.path.guides.xHeight+t.offsetY}"
      x2="${t.width}"
      y2="${t.path.guides.xHeight+t.offsetY}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${t.path.guides.baseline+t.offsetY}"
      x2="${t.width}"
      y2="${t.path.guides.baseline+t.offsetY}"
    ></line>
    ${ot(t.shiftedPath)}
    ${ct(t.slots,t.height)}
    ${rt(t.shiftedPath)}
  `},ut=t=>t.strokes.map(s=>{const e=st(s.curves);return e?`<path class="join-stats__context-path" d="${e}"></path>`:""}).join(""),xt=t=>{const s=t.metrics[l],e=O(t.shiftedPath)[l];if(!s||!e){C(j,"Select a joinable pair to inspect the hard-coded spacing.");return}const a=nt(s,t.offsetX),n=t.slots.filter(z),i=Math.min(...n.map(k=>k.leftX),e.p0.x),r=Math.max(...n.map(k=>k.rightX),e.p3.x),o=[t.path.guides.xHeight+t.offsetY,t.path.guides.baseline+t.offsetY],g=[i,r,e.p0.x,e.p1.x,e.p2.x,e.p3.x,a.previousRightSidebearingX,a.actualNextLeftSidebearingX,a.nextEntryX],d=[e.p0.y,e.p1.y,e.p2.y,e.p3.y,...o],c=Math.min(...g)-140,_=Math.max(...g)+140,m=Math.min(...d)-120,y=Math.max(...d)+130,N=Math.max(500,_-c),H=Math.max(440,y-m),X=m+34,M=m+58,w=y-72,E=Math.max(e.p0.y,e.p3.y)+68;j.setAttribute("viewBox",`${c} ${m} ${N} ${H}`),j.innerHTML=`
    <defs>
      <marker id="join-stats-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M 0 0 L 8 4 L 0 8 z" fill="#1f2724"></path>
      </marker>
    </defs>
    <rect class="join-stats__bg" x="${c}" y="${m}" width="${N}" height="${H}"></rect>
    <line class="demo-guide demo-guide--xheight" x1="${c}" y1="${o[0]}" x2="${_}" y2="${o[0]}"></line>
    <line class="demo-guide demo-guide--baseline" x1="${c}" y1="${o[1]}" x2="${_}" y2="${o[1]}"></line>
    ${ut(t.shiftedPath)}

    <line class="join-stats__calc-line join-stats__calc-line--previous" x1="${a.previousRightSidebearingX}" y1="${M}" x2="${a.previousRightSidebearingX}" y2="${w}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--actual" x1="${a.actualNextLeftSidebearingX}" y1="${M}" x2="${a.actualNextLeftSidebearingX}" y2="${w}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--entry" x1="${a.nextEntryX}" y1="${M}" x2="${a.nextEntryX}" y2="${w}"></line>

    <text class="join-stats__label" x="${a.previousRightSidebearingX}" y="${X}" text-anchor="middle">prev right</text>
    <text class="join-stats__label" x="${a.actualNextLeftSidebearingX}" y="${X+36}" text-anchor="middle">actual left</text>
    <text class="join-stats__label" x="${a.nextEntryX}" y="${X+72}" text-anchor="middle">next entry</text>

    <path class="join-stats__calc-join" d="${D(e)}"></path>
    <line class="join-stats__calc-handle" x1="${e.p0.x}" y1="${e.p0.y}" x2="${e.p1.x}" y2="${e.p1.y}"></line>
    <line class="join-stats__calc-handle" x1="${e.p3.x}" y1="${e.p3.y}" x2="${e.p2.x}" y2="${e.p2.y}"></line>
    <circle class="join-stats__calc-point" cx="${e.p0.x}" cy="${e.p0.y}" r="10"></circle>
    <circle class="join-stats__calc-point" cx="${e.p3.x}" cy="${e.p3.y}" r="10"></circle>
    <text class="join-stats__label" x="${e.p0.x-16}" y="${e.p0.y-24}" text-anchor="end">exit</text>
    <text class="join-stats__label" x="${e.p3.x+16}" y="${e.p3.y-24}">entry</text>

    <line class="join-stats__measure" x1="${e.p0.x}" y1="${E}" x2="${e.p3.x}" y2="${E}"></line>
    <text class="join-stats__label" x="${(e.p0.x+e.p3.x)/2}" y="${E+32}" text-anchor="middle">
      applied gap ${p(s.appliedGap)}
    </text>
  `},u=(t,s)=>`
  <div class="join-stats__metric-row">
    <div class="join-stats__metric-label">${h(t)}</div>
    <div class="join-stats__metric-value">${h(s)}</div>
  </div>
`,A=(t,s,e)=>`
  <div class="join-stats__formula-line">
    <div class="join-stats__formula-label">${h(t)}</div>
    <div class="join-stats__formula-expression">${s}</div>
    <div class="join-stats__formula-expression">${e}</div>
  </div>
`,F=t=>{P.innerHTML=`
    <div class="join-stats__formula">
      ${h(t)}
    </div>
  `,Y.textContent="No pair selected"},ht=t=>{const s=t.metrics[l];if(!s){F("Enter at least two joinable cursive letters.");return}const e=B(),a=p(s.actualNextLeftSidebearingX),n=p(s.renderedSidebearingGap),i=p(s.baseSidebearingGap),r=p(e.sidebearingGapAdjustment),o=p(s.previousRightSidebearingX);Y.textContent=`${s.pair} pair ${l+1} of ${t.metrics.length}`,P.innerHTML=`
    <div class="join-stats__formula">
      ${A("final gap","hard-coded sidebearing gap + adjustment",`${$(i,"join-stats__formula-token--actual","hard-coded sidebearing gap")} + ${$(r,"join-stats__formula-token--computed-gap","user spacing adjustment")} = ${$(n,"join-stats__formula-token--actual","actual sidebearing gap")}`)}
      ${A("actual left","previous right sidebearing x + final gap",`${$(o,"join-stats__formula-token--raw-target","previous right sidebearing x")} + ${$(n,"join-stats__formula-token--actual","actual sidebearing gap")} = ${$(a,"join-stats__formula-token--actual","actual next left sidebearing x")}`)}
    </div>
    <div class="join-stats__metric-grid">
      ${u("Pair",s.pair)}
      ${u("Kerning source",s.kerningSource)}
      ${u("Hard-coded sidebearing gap",i)}
      ${u("Spacing adjustment",r)}
      ${u("Rendered sidebearing gap",n)}
      ${u("p0-p1 handle scale",p(s.exitHandleScale))}
      ${u("p2-p3 handle scale",p(s.entryHandleScale))}
      ${u("Previous exit to right sidebearing",p(s.previousExitToRightSidebearing))}
      ${u("Next entry from left sidebearing",p(s.nextEntryFromLeftSidebearing))}
      ${u("Actual left sidebearing x",p(s.actualNextLeftSidebearingX))}
      ${u("Applied exit-to-entry gap",p(s.appliedGap))}
    </div>
  `},S=(t=!1)=>{var e;J();const s=dt(q.value);if(!s){x=0,C(f,"Enter text to render."),C(j,"No join calculation available."),F("Enter at least two joinable cursive letters."),L.textContent="Click a letter to select a join";return}x=s.metrics.length,t&&(l=0),l=x>0?T(l,0,x-1):0,pt(s),xt(s),ht(s),L.textContent=x>0?`Selected ${((e=s.metrics[l])==null?void 0:e.pair)??""} (${l+1} of ${x})`:"Enter at least two joinable letters"};I.addEventListener("submit",t=>{t.preventDefault(),S(!0)});f.addEventListener("click",t=>{if(x===0)return;const s=t.target;if(!(s instanceof Element))return;const e=s.closest("[data-pair-index]");e&&(l=T(Number(e.dataset.pairIndex??0),0,x-1),S())});b.forEach(t=>{var s;(s=v[t.key])==null||s.addEventListener("input",()=>S())});J();S(!0);
