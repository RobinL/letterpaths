import"./z-lower-cursive-bezier-entry-low-B2oMjkLV.js";import{d as N,b as ae,C as A,l as ne}from"./joiner-C8q7XHuM.js";const J=document.querySelector("#app");if(!J)throw new Error("Missing #app element for join stats.");const ie="cursive",se={xHeight:360,baseline:720},re=ne,G=[{key:"targetBendRate",label:"Target maximum bend rate",min:0,max:80,step:1,value:N.targetBendRate},{key:"minSidebearingGap",label:"Minimum sidebearing gap",min:-500,max:500,step:5,value:95},{key:"bendSearchMinSidebearingGap",label:"Search minimum sidebearing gap",min:-200,max:120,step:1,value:N.bendSearchMinSidebearingGap},{key:"bendSearchMaxSidebearingGap",label:"Search maximum sidebearing gap",min:-120,max:240,step:1,value:N.bendSearchMaxSidebearingGap},{key:"exitHandleScale",label:"p0-p1 handle scale",min:0,max:1,step:.05,value:N.exitHandleScale},{key:"entryHandleScale",label:"p2-p3 handle scale",min:0,max:1,step:.05,value:N.entryHandleScale}];J.innerHTML=`
  <main class="join-stats">
    <header class="join-stats__header">
      <div>
        <h1>Join stats</h1>
        <p>Inspect the spacing formula for adjacent cursive letters.</p>
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
            value="${ie}"
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
        ${G.map(e=>`
              <label class="join-stats__field">
                ${e.label}
                <div class="join-stats__range-row">
                  <input
                    class="join-stats__range"
                    id="join-stats-${e.key}"
                    type="range"
                    min="${e.min}"
                    max="${e.max}"
                    step="${e.step}"
                    value="${e.value}"
                  />
                  <span class="join-stats__range-value" id="join-stats-${e.key}-value">
                    ${e.value}
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
          <span>Search target, clamps, actual placement and bend rate</span>
        </div>
        <svg
          class="join-stats__svg join-stats__svg--calculation"
          id="join-stats-calculation-svg"
          viewBox="0 0 1200 800"
        ></svg>
      </article>
    </section>
  </main>
`;const D=document.querySelector("#join-stats-form"),z=document.querySelector("#join-stats-word"),E=document.querySelector("#join-stats-word-svg"),B=document.querySelector("#join-stats-calculation-svg"),I=document.querySelector("#join-stats-metrics"),R=document.querySelector("#join-stats-selection-label"),q=document.querySelector("#join-stats-pair-label");if(!D||!z||!E||!B||!I||!R||!q)throw new Error("Missing elements for join stats.");const _=Object.fromEntries(G.map(e=>[e.key,document.querySelector(`#join-stats-${e.key}`)])),V=Object.fromEntries(G.map(e=>[e.key,document.querySelector(`#join-stats-${e.key}-value`)]));if(Object.values(_).some(e=>!e)||Object.values(V).some(e=>!e))throw new Error("Missing join spacing controls for join stats.");let d=0,S=0;const oe=["previousExitX","previousRightSidebearingX","targetNextLeftSidebearingX","clampedNextLeftSidebearingX","noBackwardsNextLeftSidebearingX","actualNextLeftSidebearingX","nextEntryX"],b=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),s=(e,t=2)=>{if(!Number.isFinite(e))return"0";const a=Math.abs(e)>=100?Math.min(t,1):t;return e.toFixed(a)},F=(e,t,a)=>Math.min(a,Math.max(t,e)),x=(e,t,a)=>`<span class="join-stats__formula-token ${t}" title="${b(a)}">${b(e)}</span>`,u=(e,t,a)=>`<span class="join-stats__formula-term ${t}" title="${b(a)}">${b(e)}</span>`,O=()=>{var e,t,a,n,i,r;return{targetBendRate:Number(((e=_.targetBendRate)==null?void 0:e.value)??0),minSidebearingGap:Number(((t=_.minSidebearingGap)==null?void 0:t.value)??0),bendSearchMinSidebearingGap:Number(((a=_.bendSearchMinSidebearingGap)==null?void 0:a.value)??0),bendSearchMaxSidebearingGap:Number(((n=_.bendSearchMaxSidebearingGap)==null?void 0:n.value)??0),exitHandleScale:Number(((i=_.exitHandleScale)==null?void 0:i.value)??1),entryHandleScale:Number(((r=_.entryHandleScale)==null?void 0:r.value)??1)}},W=()=>{G.forEach(e=>{const t=_[e.key],a=V[e.key];!t||!a||(a.textContent=e.key==="targetBendRate"||e.key==="minSidebearingGap"||e.key==="bendSearchMinSidebearingGap"||e.key==="bendSearchMaxSidebearingGap"?Number(t.value).toFixed(0):Number(t.value).toFixed(2))})},le=e=>{if(e.length===0)return"";const[t,...a]=e;let n=`M ${t.p0.x} ${t.p0.y} `;return[t,...a].forEach(i=>{n+=`C ${i.p1.x} ${i.p1.y} ${i.p2.x} ${i.p2.y} ${i.p3.x} ${i.p3.y} `}),n.trim()},H=e=>`M ${e.p0.x} ${e.p0.y} C ${e.p1.x} ${e.p1.y} ${e.p2.x} ${e.p2.y} ${e.p3.x} ${e.p3.y}`,ce=(e,t,a)=>({...e,strokes:e.strokes.map(n=>({...n,curves:n.curves.map(i=>new A({x:i.p0.x+t,y:i.p0.y+a},{x:i.p1.x+t,y:i.p1.y+a},{x:i.p2.x+t,y:i.p2.y+a},{x:i.p3.x+t,y:i.p3.y+a}))})),bounds:{minX:e.bounds.minX+t,maxX:e.bounds.maxX+t,minY:e.bounds.minY+a,maxY:e.bounds.maxY+a}}),de=(e,t,a)=>new A({x:e.p0.x+t,y:e.p0.y+a},{x:e.p1.x+t,y:e.p1.y+a},{x:e.p2.x+t,y:e.p2.y+a},{x:e.p3.x+t,y:e.p3.y+a}),pe=(e,t)=>{const a={...e};return oe.forEach(n=>{a[n]=e[n]+t}),a},K=e=>{const t=[];return e.strokes.forEach(a=>{a.curves.forEach((n,i)=>{var r;((r=a.curveSegments)==null?void 0:r[i])==="join"&&t.push(n)})}),t},me=(e,t)=>{const a={"lead-in":"#5f9ed1",entry:"#2b6fa7",body:"#188977",ascender:"#315a9d",descender:"#0d7f8c",exit:"#4f8f38","lead-out":"#7cae4f",dot:"#4d9fb2"},n=["#2b6fa7","#188977","#315a9d","#4f8f38","#5f9ed1","#7cae4f"];return e?a[e]??n[t%n.length]:n[t%n.length]},ge=e=>{let t=0,a=0;return e.strokes.flatMap(n=>n.curves.map((i,r)=>{var l;const p=(l=n.curveSegments)==null?void 0:l[r],c=H(i);if(p==="join"){const g=a===d;return a+=1,`<path class="join-stats__segment-path join-stats__segment-path--join ${g?"join-stats__segment-path--selected-join":""}" d="${c}"></path>`}const m=me(p,t);return t+=1,`<path class="join-stats__segment-path" d="${c}" stroke="${m}" stroke-opacity="0.74" stroke-width="42"></path>`})).join("")},xe=e=>{const t=K(e)[d];if(!t)return"";const a=[{label:"p0",point:t.p0,type:"end"},{label:"p1",point:t.p1,type:"control"},{label:"p2",point:t.p2,type:"control"},{label:"p3",point:t.p3,type:"end"}];return`
    <g class="join-stats__anchor-overlay" aria-label="Selected join Bezier anchors">
      <line class="join-stats__anchor-handle" x1="${t.p0.x}" y1="${t.p0.y}" x2="${t.p1.x}" y2="${t.p1.y}"></line>
      <line class="join-stats__anchor-handle" x1="${t.p3.x}" y1="${t.p3.y}" x2="${t.p2.x}" y2="${t.p2.y}"></line>
      ${a.map(({label:n,point:i,type:r})=>`
            <g>
              <circle
                class="join-stats__anchor-point join-stats__anchor-point--${r}"
                cx="${i.x}"
                cy="${i.y}"
                r="${r==="control"?10:12}"
              ></circle>
              <text class="join-stats__anchor-label" x="${i.x+14}" y="${i.y-12}">${n}</text>
            </g>
          `).join("")}
    </g>
  `},ue=(e,t,a)=>{const n=[];return t.length===0||t.forEach((i,r)=>{const p=t[r-1],c=t[r+1];if(!p||p.nextChar!==i.previousChar){const $=r===0?Math.min(e.bounds.minX,0):Math.min(i.previousExitX-180,i.previousRightSidebearingX-260);n.push({index:n.length,char:i.previousChar,leftX:$+a,rightX:i.previousRightSidebearingX+a,selectPairIndex:r,nextPairIndex:r})}const l=(c==null?void 0:c.previousChar)===i.nextChar,g=n[n.length-1],h=g?Math.max(130,g.rightX-g.leftX):260,v=l?c.previousRightSidebearingX:Math.max(e.bounds.maxX,i.actualNextLeftSidebearingX+h);n.push({index:n.length,char:i.nextChar,leftX:i.actualNextLeftSidebearingX+a,rightX:v+a,selectPairIndex:l?r+1:r,previousPairIndex:r,nextPairIndex:l?r+1:void 0})}),n},U=e=>e.previousPairIndex===d||e.nextPairIndex===d,be=(e,t)=>e.map(a=>{const n=Math.min(a.leftX,a.rightX),i=Math.max(48,Math.abs(a.rightX-a.leftX)),r=n+i/2;return`
        <g
          class="join-stats__letter-zone ${U(a)?"join-stats__letter-zone--selected":""}"
          data-pair-index="${a.selectPairIndex}"
        >
          <rect x="${n}" y="20" width="${i}" height="${t-40}" rx="8"></rect>
          <text x="${r}" y="58" text-anchor="middle">${b(a.char)}</text>
        </g>
      `}).join(""),Y=(e,t)=>{e.setAttribute("viewBox","0 0 1200 520"),e.innerHTML=`
    <rect class="join-stats__bg" x="0" y="0" width="1200" height="520"></rect>
    <text class="join-stats__empty" x="600" y="270" text-anchor="middle">${b(t)}</text>
  `},he=e=>{const t=e.trim().toLowerCase();if(!t)return null;const a=ae(t,{style:"cursive",targetGuides:se,joinSpacing:O(),letters:re});if(a.strokes.length===0)return null;const n=120,i=Math.max(1e3,Math.ceil(a.bounds.maxX-a.bounds.minX+n*2)),r=Math.max(740,Math.ceil(a.bounds.maxY-a.bounds.minY+n*2)),p=n-a.bounds.minX,c=n-a.bounds.minY,m=ce(a,p,c),l=a.joinMetrics??[],g=ue(a,l,p);return{path:a,shiftedPath:m,metrics:l,slots:g,width:i,height:r,offsetX:p,offsetY:c}},$e=e=>{E.setAttribute("viewBox",`0 0 ${e.width} ${e.height}`),E.innerHTML=`
    <rect class="join-stats__bg" x="0" y="0" width="${e.width}" height="${e.height}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${e.path.guides.xHeight+e.offsetY}"
      x2="${e.width}"
      y2="${e.path.guides.xHeight+e.offsetY}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${e.path.guides.baseline+e.offsetY}"
      x2="${e.width}"
      y2="${e.path.guides.baseline+e.offsetY}"
    ></line>
    ${ge(e.shiftedPath)}
    ${be(e.slots,e.height)}
    ${xe(e.shiftedPath)}
  `},_e=e=>e.strokes.map(t=>{const a=le(t.curves);return a?`<path class="join-stats__context-path" d="${a}"></path>`:""}).join(""),fe=e=>{const t=e.metrics[d],a=K(e.shiftedPath)[d];if(!t||!a){Y(B,"Select a joinable pair to inspect the spacing calculation.");return}const n=pe(t,e.offsetX),i=de(t.searchedJoinCurve,e.offsetX,e.offsetY),r=e.slots.filter(U),p=Math.min(...r.map(L=>L.leftX),a.p0.x,i.p0.x,i.p3.x),c=Math.max(...r.map(L=>L.rightX),a.p3.x,i.p0.x,i.p3.x),m=[e.path.guides.xHeight+e.offsetY,e.path.guides.baseline+e.offsetY],l=[p,c,a.p0.x,a.p1.x,a.p2.x,a.p3.x,i.p1.x,i.p2.x,n.previousRightSidebearingX,n.targetNextLeftSidebearingX,n.clampedNextLeftSidebearingX,n.noBackwardsNextLeftSidebearingX,n.actualNextLeftSidebearingX,n.nextEntryX],g=[a.p0.y,a.p1.y,a.p2.y,a.p3.y,i.p1.y,i.p2.y,...m],h=Math.min(...l)-140,v=Math.max(...l)+140,$=Math.min(...g)-120,C=Math.max(...g)+130,X=Math.max(500,v-h),w=Math.max(440,C-$),f=$+34,j=$+58,y=C-72,M=Math.max(a.p0.y,a.p3.y)+68,k=i.getPointAt(t.searchedBendT);B.setAttribute("viewBox",`${h} ${$} ${X} ${w}`),B.innerHTML=`
    <defs>
      <marker id="join-stats-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M 0 0 L 8 4 L 0 8 z" fill="#1f2724"></path>
      </marker>
    </defs>
    <rect class="join-stats__bg" x="${h}" y="${$}" width="${X}" height="${w}"></rect>
    <line class="demo-guide demo-guide--xheight" x1="${h}" y1="${m[0]}" x2="${v}" y2="${m[0]}"></line>
    <line class="demo-guide demo-guide--baseline" x1="${h}" y1="${m[1]}" x2="${v}" y2="${m[1]}"></line>
    ${_e(e.shiftedPath)}

    <line class="join-stats__calc-line join-stats__calc-line--previous" x1="${n.previousRightSidebearingX}" y1="${j}" x2="${n.previousRightSidebearingX}" y2="${y}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--target" x1="${n.targetNextLeftSidebearingX}" y1="${j}" x2="${n.targetNextLeftSidebearingX}" y2="${y}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--minimum" x1="${n.clampedNextLeftSidebearingX}" y1="${j}" x2="${n.clampedNextLeftSidebearingX}" y2="${y}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--no-backwards" x1="${n.noBackwardsNextLeftSidebearingX}" y1="${j}" x2="${n.noBackwardsNextLeftSidebearingX}" y2="${y}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--actual" x1="${n.actualNextLeftSidebearingX}" y1="${j}" x2="${n.actualNextLeftSidebearingX}" y2="${y}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--entry" x1="${n.nextEntryX}" y1="${j}" x2="${n.nextEntryX}" y2="${y}"></line>

    <text class="join-stats__label" x="${n.previousRightSidebearingX}" y="${f}" text-anchor="middle">prev right</text>
    <text class="join-stats__label" x="${n.targetNextLeftSidebearingX}" y="${f+28}" text-anchor="middle">search target</text>
    <text class="join-stats__label" x="${n.clampedNextLeftSidebearingX}" y="${f+56}" text-anchor="middle">min sidebearing</text>
    <text class="join-stats__label" x="${n.noBackwardsNextLeftSidebearingX}" y="${f+84}" text-anchor="middle">no backwards</text>
    <text class="join-stats__label" x="${n.actualNextLeftSidebearingX}" y="${f+112}" text-anchor="middle">actual left</text>
    <text class="join-stats__label" x="${n.nextEntryX}" y="${f+140}" text-anchor="middle">next entry</text>

    <path class="join-stats__calc-join" d="${H(a)}"></path>
    <path class="join-stats__bend-measurement-join" d="${H(i)}"></path>
    <line class="join-stats__calc-handle" x1="${a.p0.x}" y1="${a.p0.y}" x2="${a.p1.x}" y2="${a.p1.y}"></line>
    <line class="join-stats__calc-handle" x1="${a.p3.x}" y1="${a.p3.y}" x2="${a.p2.x}" y2="${a.p2.y}"></line>
    <circle class="join-stats__calc-point" cx="${a.p0.x}" cy="${a.p0.y}" r="10"></circle>
    <circle class="join-stats__calc-point" cx="${a.p3.x}" cy="${a.p3.y}" r="10"></circle>
    <circle class="join-stats__calc-point join-stats__calc-point--bend" cx="${k.x}" cy="${k.y}" r="12"></circle>
    <text class="join-stats__label" x="${a.p0.x-16}" y="${a.p0.y-24}" text-anchor="end">exit</text>
    <text class="join-stats__label" x="${a.p3.x+16}" y="${a.p3.y-24}">entry</text>
    <text class="join-stats__label" x="${k.x+18}" y="${k.y+34}">
      searched bend ${s(t.searchedBendRate)} deg/0.1t
    </text>

    <line class="join-stats__measure" x1="${a.p0.x}" y1="${M}" x2="${a.p3.x}" y2="${M}"></line>
    <text class="join-stats__label" x="${(a.p0.x+a.p3.x)/2}" y="${M+32}" text-anchor="middle">
      applied gap ${s(t.appliedGap)}
    </text>
  `},o=(e,t)=>`
  <div class="join-stats__metric-row">
    <div class="join-stats__metric-label">${b(e)}</div>
    <div class="join-stats__metric-value">${b(t)}</div>
  </div>
`,T=(e,t,a)=>`
  <div class="join-stats__formula-line">
    <div class="join-stats__formula-label">${b(e)}</div>
    <div class="join-stats__formula-expression">${t}</div>
    <div class="join-stats__formula-expression">${a}</div>
  </div>
`,Q=e=>{I.innerHTML=`
    <div class="join-stats__formula">
      ${b(e)}
    </div>
  `,q.textContent="No pair selected"},je=e=>{const t=e.metrics[d];if(!t){Q("Enter at least two joinable cursive letters.");return}const a=O(),n=t.actualNextLeftSidebearingX===t.clampedNextLeftSidebearingX&&t.targetNextLeftSidebearingX<t.clampedNextLeftSidebearingX,i=s(t.targetNextLeftSidebearingX),r=s(t.clampedNextLeftSidebearingX),p=s(t.noBackwardsNextLeftSidebearingX),c=s(t.actualNextLeftSidebearingX),m=Math.max(t.targetNextLeftSidebearingX,t.clampedNextLeftSidebearingX)-t.previousRightSidebearingX,l=s(m),g=s(t.noBackwardsSidebearingGap),h=s(t.renderedSidebearingGap),v=s(t.searchedSidebearingGap),$=s(t.searchedBendRate),C=s(t.targetBendRate),X=s(t.bendSearchMinSidebearingGap),w=s(t.bendSearchMaxSidebearingGap),f=u("smallest gap","join-stats__formula-token--raw-target","smallest searched sidebearing gap that keeps bend rate at or below the target"),j=u("search range","join-stats__formula-token--computed-gap",`sidebearing gaps tested from ${X} to ${w}`),y=u("max bend rate","join-stats__formula-token--bend","greatest tangent-angle change per 0.1t on the join Bezier"),M=u("target bend rate","join-stats__formula-token--bend-weight","user configured maximum bend rate"),k=u("search target left","join-stats__formula-token--raw-target","left sidebearing x from the selected searched gap"),L=u("minimum sidebearing line","join-stats__formula-token--minimum","minimum sidebearing line"),Z=u("computed gap","join-stats__formula-token--computed-gap","sidebearing gap after raw spacing and minimum sidebearing"),ee=u("no-backwards minimum gap","join-stats__formula-token--no-backwards","minimum sidebearing gap that keeps the join Bezier moving left-to-right"),te=u("no-backwards line","join-stats__formula-token--no-backwards","left sidebearing line from the no-backwards minimum gap");u("actual left","join-stats__formula-token--actual","actual left sidebearing x"),q.textContent=`${t.pair} pair ${d+1} of ${e.metrics.length}`,I.innerHTML=`
    <div class="join-stats__formula">
      ${T("search",`${f} in ${j} where ${y} <= ${M}`,`${x(v,"join-stats__formula-token--raw-target","selected sidebearing gap")} in [${x(X,"join-stats__formula-token--computed-gap","minimum searched sidebearing gap")}, ${x(w,"join-stats__formula-token--computed-gap","maximum searched sidebearing gap")}] gives ${x($,"join-stats__formula-token--bend","selected maximum bend rate")} <= ${x(C,"join-stats__formula-token--bend-weight","target maximum bend rate")}`)}
      ${T("actual left",`max(${k}, ${L}, ${te})`,`max(${x(i,"join-stats__formula-token--raw-target","search target left sidebearing x")}, ${x(r,"join-stats__formula-token--minimum","minimum sidebearing line")}, ${x(p,"join-stats__formula-token--no-backwards","no-backwards line")}) = ${x(c,"join-stats__formula-token--actual","actual left sidebearing x")}`)}
      ${T("final gap",`max(${Z}, ${ee})`,`max(${x(l,"join-stats__formula-token--computed-gap","computed sidebearing gap before no-backwards clamp")}, ${x(g,"join-stats__formula-token--no-backwards","no-backwards minimum sidebearing gap")}) = ${x(h,"join-stats__formula-token--actual","actual sidebearing gap")}`)}
    </div>
    <div class="join-stats__metric-grid">
      ${o("Pair",t.pair)}
      ${o("Target maximum bend rate",`${s(a.targetBendRate)} deg/0.1t`)}
      ${o("p0-p1 handle scale",s(a.exitHandleScale))}
      ${o("p2-p3 handle scale",s(a.entryHandleScale))}
      ${o("Search range",`${s(t.bendSearchMinSidebearingGap)} to ${s(t.bendSearchMaxSidebearingGap)} sidebearing gap, step ${s(t.bendSearchStep)}`)}
      ${o("Selected sidebearing gap",s(t.searchedSidebearingGap))}
      ${o("Selected max bend rate",`${s(t.searchedBendRate)} deg/0.1t at t=${s(t.searchedBendT,3)}`)}
      ${o("Vertical distance",s(t.verticalDistance))}
      ${o("Previous exit to right sidebearing",s(t.previousExitToRightSidebearing))}
      ${o("Next entry from left sidebearing",s(t.nextEntryFromLeftSidebearing))}
      ${o("Search target left sidebearing x",s(t.targetNextLeftSidebearingX))}
      ${o("Minimum allowed left sidebearing x",s(t.clampedNextLeftSidebearingX))}
      ${o("Computed sidebearing gap before no-backwards",l)}
      ${o("No-backwards minimum sidebearing gap",s(t.noBackwardsSidebearingGap))}
      ${o("No-backwards left sidebearing x",s(t.noBackwardsNextLeftSidebearingX))}
      ${o("Actual left sidebearing x",s(t.actualNextLeftSidebearingX))}
      ${o("Minimum clamp applied",n?"yes":"no")}
      ${o("No-backwards clamp applied",t.actualNextLeftSidebearingX===t.noBackwardsNextLeftSidebearingX?"yes":"no")}
      ${o("Rendered sidebearing gap",s(t.renderedSidebearingGap))}
      ${o("Applied exit-to-entry gap",s(t.appliedGap))}
    </div>
  `},P=(e=!1)=>{var a;W();const t=he(z.value);if(!t){S=0,Y(E,"Enter text to render."),Y(B,"No join calculation available."),Q("Enter at least two joinable cursive letters."),R.textContent="Click a letter to select a join";return}S=t.metrics.length,e&&(d=0),d=S>0?F(d,0,S-1):0,$e(t),fe(t),je(t),R.textContent=S>0?`Selected ${((a=t.metrics[d])==null?void 0:a.pair)??""} (${d+1} of ${S})`:"Enter at least two joinable letters"};D.addEventListener("submit",e=>{e.preventDefault(),P(!0)});E.addEventListener("click",e=>{if(S===0)return;const t=e.target;if(!(t instanceof Element))return;const a=t.closest("[data-pair-index]");a&&(d=F(Number(a.dataset.pairIndex??0),0,S-1),P())});G.forEach(e=>{var t;(t=_[e.key])==null||t.addEventListener("input",()=>P())});W();P(!0);
