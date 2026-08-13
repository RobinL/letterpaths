import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as Pe}from"./style-Ye0bKBwL.js";import"./joiner-c-a6mS3a.js";import{b as Oe,a as Ne}from"./shared-xqS9M3bi.js";import{s as We,D as xe,b as Re}from"./worksheet-preview-pan-zoom-BZpEPmqq.js";import"./annotations-DHyvYmdP.js";const V="practice",Fe="cursive",X=100,Y=35,K=200,k=5,Me=20,j=12,J=2,Q=0,ee=480,te=1,re=140,ae=50,oe=10,ie=20,se=.8,ne="#9bb7d8",le="#d5dbe2",He="#83b0dd",Ue=96,de=320,ce=13,Ze=53,ze=53,ue=26,pe=5.6,Be=ce*2,qe=0,Ve="#3f454b",he="#ffffff",Xe=224,Ye=.63,Ke=.66,je=["text","word","style","previewZoom","rowHeight","rowGap","letterSpacing","wordSpacing","repeatCount","repeatGap","strokeWidth","fadeRows","initialTraceOpacity","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","guideStrokeWidth","guideColor","traceColor","keepInitialLeadIn","keepFinalLeadOut","includeNameDate"],W=document.querySelector("#app");if(!W)throw new Error("Missing #app element for fading handwriting practice.");document.body.classList.add("worksheet-body");W.classList.add("worksheet-root");const x=()=>({text:V,style:Fe,previewZoom:X,rowHeightMm:j,rowGapMm:J,letterSpacing:Q,wordSpacing:ee,repeatCount:te,repeatGap:re,strokeWidth:ae,fadeRows:oe,initialTraceOpacity:ie,showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!0,showDescenderGuide:!0,guideStrokeWidth:se,guideColor:ne,traceColor:le,keepInitialLeadIn:!0,keepFinalLeadOut:!0,includeNameDate:!1}),Je=t=>({"directional-dash":t["directional-dash"],"turning-point":t["turning-point"],"start-arrow":t["start-arrow"],"draw-order-number":t["draw-order-number"],"midpoint-arrow":t["midpoint-arrow"]}),Qe=()=>({directionalDashSpacing:Ue,midpointDensity:de,turnRadius:ce,uTurnLength:Ze,arrowLength:ze,arrowHeadSize:ue,arrowStrokeWidth:pe,numberSize:Be,numberPathOffset:qe,numberColor:Ve,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:Je(xe),arrowColor:he,strokeColor:He}),et=(t,r)=>({...t,...r,visibility:r.visibility?{...t.visibility,...r.visibility}:t.visibility}),C=et(Qe(),{directionalDashSpacing:152,midpointDensity:de,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:ue,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!1,visibility:{"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!0,"midpoint-arrow":!1}}),l=x();let e=x(),D=!1;W.innerHTML=`
  <div class="worksheet-app">
    <aside class="worksheet-app__controls" aria-label="Worksheet controls">
      <div class="worksheet-app__controls-inner">
        <div class="worksheet-app__heading">
          <h1 class="worksheet-app__title">Fading handwriting practice</h1>
        </div>

        <label class="worksheet-app__field" for="worksheet-text-input">
          <span>Word or words</span>
          <input
            class="worksheet-app__text-input"
            id="worksheet-text-input"
            type="text"
            value="${V}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${tt()}

        <div class="worksheet-app__standalone-spacing-controls" id="standalone-spacing-controls" hidden>
          ${u({id:"letter-spacing-slider",label:"Letter spacing",value:Q,min:-40,max:280,step:10,valueId:"letter-spacing-value"})}
          ${u({id:"word-spacing-slider",label:"Space width",value:ee,min:180,max:960,step:20,valueId:"word-spacing-value"})}
        </div>

        ${u({id:"row-height-slider",label:"Line height",value:j,min:8,max:24,step:1,valueId:"row-height-value"})}

        ${u({id:"row-gap-slider",label:"Line spacing",value:J,min:0,max:12,step:1,valueId:"row-gap-value"})}

        ${u({id:"repeat-count-slider",label:"Words per line",value:te,min:1,max:8,step:1,valueId:"repeat-count-value"})}

        ${u({id:"repeat-gap-slider",label:"Word spacing",value:re,min:0,max:420,step:10,valueId:"repeat-gap-value"})}

        ${u({id:"fade-rows-slider",label:"Fading trace rows",value:oe,min:2,max:20,step:1,valueId:"fade-rows-value"})}

        ${u({id:"initial-trace-opacity-slider",label:"Initial trace darkness",value:ie,min:1,max:100,step:1,valueId:"initial-trace-opacity-value"})}

        ${u({id:"stroke-width-slider",label:"Stroke thickness",value:ae,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        <fieldset class="worksheet-app__checks" aria-label="Worksheet options">
          ${g("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${g("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
          ${g("include-name-date","includeNameDate","Include name/date",!1)}
        </fieldset>

        <details class="worksheet-app__details">
          <summary>Lined paper settings</summary>
          <div class="worksheet-app__details-body">
            ${u({id:"guide-stroke-width-slider",label:"Line thickness",value:se,min:.4,max:3,step:.1,valueId:"guide-stroke-width-value",attrs:'data-global-setting="guideStrokeWidth"'})}
            ${z("guide-color-picker","guideColor","Line colour",ne)}
            ${z("trace-color-picker","traceColor","Trace colour",le)}
            <fieldset class="worksheet-app__checks" aria-label="Lined paper visibility">
              ${g("show-baseline-guide","showBaselineGuide","Baseline",!0)}
              ${g("show-descender-guide","showDescenderGuide","Descender",!0)}
              ${g("show-x-height-guide","showXHeightGuide","X-height",!0)}
              ${g("show-ascender-guide","showAscenderGuide","Ascender",!0)}
            </fieldset>
          </div>
        </details>

        <div class="worksheet-app__button-row worksheet-app__button-row--single">
          <button class="worksheet-app__button" id="print-worksheet-button" type="button">
            Print worksheet
          </button>
        </div>
        <p class="worksheet-app__status" id="worksheet-status" role="status" aria-live="polite"></p>
      </div>
    </aside>

    <main class="worksheet-app__preview" aria-label="Worksheet preview">
      <div class="worksheet-app__preview-toolbar" aria-label="Preview zoom controls">
        <button class="worksheet-app__zoom-button" id="preview-zoom-out-button" type="button" aria-label="Zoom out">&minus;</button>
        <output class="worksheet-app__zoom-value" id="preview-zoom-value" aria-live="polite">${X}%</output>
        <button class="worksheet-app__zoom-button" id="preview-zoom-in-button" type="button" aria-label="Zoom in">+</button>
        <span class="worksheet-app__gesture-hint">Scroll to pan · pinch or Ctrl + scroll to zoom</span>
      </div>
      <div
        class="worksheet-app__preview-viewport"
        id="worksheet-preview-viewport"
        tabindex="0"
        aria-label="Worksheet canvas. Scroll or drag to pan. Pinch or Control plus scroll to zoom."
      >
        <div class="worksheet-app__page-frame" id="worksheet-page-frame">
          <section class="worksheet-page worksheet-page--handwriting-practice" id="worksheet-page" aria-label="Printable worksheet"></section>
        </div>
      </div>
    </main>
  </div>
`;const P=document.querySelector("#worksheet-text-input"),O=document.querySelector("#worksheet-style-select"),we=document.querySelector("#standalone-spacing-controls"),me=document.querySelector("#preview-zoom-in-button"),ge=document.querySelector("#preview-zoom-out-button"),fe=document.querySelector("#worksheet-preview-viewport"),v=document.querySelector("#row-height-slider"),_=document.querySelector("#row-gap-slider"),S=document.querySelector("#letter-spacing-slider"),b=document.querySelector("#word-spacing-slider"),L=document.querySelector("#repeat-count-slider"),$=document.querySelector("#repeat-gap-slider"),G=document.querySelector("#fade-rows-slider"),T=document.querySelector("#initial-trace-opacity-slider"),E=document.querySelector("#stroke-width-slider"),ke=document.querySelector("#print-worksheet-button"),w=document.querySelector("#worksheet-page-frame"),m=document.querySelector("#worksheet-page"),I=document.querySelector("#worksheet-status");if(!P||!O||!we||!me||!ge||!fe||!v||!_||!S||!b||!L||!$||!G||!T||!E||!ke||!w||!m||!I)throw new Error("Missing elements for fading handwriting practice.");const R=Array.from(document.querySelectorAll("[data-global-setting]"));function tt(){return`
    <label class="worksheet-app__field" for="worksheet-style-select">
      <span>Style</span>
      <select class="worksheet-app__select" id="worksheet-style-select">
        <option value="cursive" selected>Full cursive</option>
        <option value="pre-cursive">Pre-cursive</option>
        <option value="print">Print</option>
      </select>
    </label>
  `}function u({id:t,label:r,value:a,min:i,max:s,step:o,valueId:n=`${t}-value`,attrs:y=""}){return`
    <label class="worksheet-app__field" for="${t}">
      <span>
        ${r}
        <strong id="${n}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${t}"
        type="range"
        min="${i}"
        max="${s}"
        step="${o}"
        value="${a}"
        ${y}
      />
    </label>
  `}function g(t,r,a,i){return`
    <label class="worksheet-app__check" for="${t}">
      <input
        id="${t}"
        type="checkbox"
        data-global-setting="${r}"
        ${i?"checked":""}
      />
      <span>${a}</span>
    </label>
  `}function z(t,r,a,i){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${t}">
      <span>${a}</span>
      <input
        class="worksheet-app__color"
        id="${t}"
        type="color"
        value="${i}"
        data-global-setting="${r}"
      />
    </label>
  `}const ve=t=>t.trim().replace(/\s+/g," "),_e=t=>t==="cursive"||t==="pre-cursive"||t==="print"?t:null,Se=t=>t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),N=t=>/^#[0-9a-fA-F]{6}$/.test(t)?t.toLowerCase():null,be=t=>{if(t.step==="any"||t.step.length===0)return 0;const[,r=""]=t.step.split(".");return r.length},Le=(t,r)=>{const a=t.min===""?Number.NEGATIVE_INFINITY:Number(t.min),i=t.max===""?Number.POSITIVE_INFINITY:Number(t.max),s=t.step===""||t.step==="any"?Number.NaN:Number(t.step),o=Number.isFinite(a)?a:0;let n=r;return Number.isFinite(a)&&(n=Math.max(a,n)),Number.isFinite(i)&&(n=Math.min(i,n)),Number.isFinite(s)&&s>0&&(n=o+Math.round((n-o)/s)*s),Number.isFinite(a)&&(n=Math.max(a,n)),Number.isFinite(i)&&(n=Math.min(i,n)),Number(n.toFixed(be(t)))},p=(t,r)=>{const a=Le(t,r);return t.value=a.toFixed(be(t)),a},F=t=>{const r=Math.min(K,Math.max(Y,t));return Math.round(r/k)*k},f=(t,r)=>{const a=t.get(r);if(a===null)return null;const i=a.trim().toLowerCase();return["1","true","yes","on"].includes(i)?!0:["0","false","no","off"].includes(i)?!1:null},h=(t,r,a)=>{const i=t.get(r);if(i===null)return null;const s=Number(i);return Number.isFinite(s)?Le(a,s):null},rt=t=>{const r=t.get("previewZoom");if(r===null)return null;const a=Number(r);return Number.isFinite(a)?F(a):null},B=(t,r)=>N(t.get(r)??""),$e=()=>{const t=new URL(window.location.href);je.forEach(i=>{t.searchParams.delete(i)}),e.text!==l.text&&t.searchParams.set("text",e.text),e.style!==l.style&&t.searchParams.set("style",e.style),e.rowHeightMm!==l.rowHeightMm&&t.searchParams.set("rowHeight",String(e.rowHeightMm)),e.rowGapMm!==l.rowGapMm&&t.searchParams.set("rowGap",String(e.rowGapMm)),e.letterSpacing!==l.letterSpacing&&t.searchParams.set("letterSpacing",String(e.letterSpacing)),e.wordSpacing!==l.wordSpacing&&t.searchParams.set("wordSpacing",String(e.wordSpacing)),e.repeatCount!==l.repeatCount&&t.searchParams.set("repeatCount",String(e.repeatCount)),e.repeatGap!==l.repeatGap&&t.searchParams.set("repeatGap",String(e.repeatGap)),e.strokeWidth!==l.strokeWidth&&t.searchParams.set("strokeWidth",String(e.strokeWidth)),e.fadeRows!==l.fadeRows&&t.searchParams.set("fadeRows",String(e.fadeRows)),e.initialTraceOpacity!==l.initialTraceOpacity&&t.searchParams.set("initialTraceOpacity",String(e.initialTraceOpacity)),e.showBaselineGuide!==l.showBaselineGuide&&t.searchParams.set("showBaselineGuide",e.showBaselineGuide?"1":"0"),e.showXHeightGuide!==l.showXHeightGuide&&t.searchParams.set("showXHeightGuide",e.showXHeightGuide?"1":"0"),e.showAscenderGuide!==l.showAscenderGuide&&t.searchParams.set("showAscenderGuide",e.showAscenderGuide?"1":"0"),e.showDescenderGuide!==l.showDescenderGuide&&t.searchParams.set("showDescenderGuide",e.showDescenderGuide?"1":"0"),e.guideStrokeWidth!==l.guideStrokeWidth&&t.searchParams.set("guideStrokeWidth",String(e.guideStrokeWidth)),e.guideColor!==l.guideColor&&t.searchParams.set("guideColor",e.guideColor),e.traceColor!==l.traceColor&&t.searchParams.set("traceColor",e.traceColor),e.keepInitialLeadIn!==l.keepInitialLeadIn&&t.searchParams.set("keepInitialLeadIn",e.keepInitialLeadIn?"1":"0"),e.keepFinalLeadOut!==l.keepFinalLeadOut&&t.searchParams.set("keepFinalLeadOut",e.keepFinalLeadOut?"1":"0"),e.includeNameDate!==l.includeNameDate&&t.searchParams.set("includeNameDate",e.includeNameDate?"1":"0");const r=`${t.pathname}${t.search}${t.hash}`,a=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==a&&window.history.replaceState(null,"",r)},c=(t,r)=>{const a=document.querySelector(`#${t}`);a&&(a.textContent=r)},M=()=>{c("preview-zoom-value",`${e.previewZoom}%`),c("row-height-value",`${e.rowHeightMm} mm`),c("row-gap-value",`${e.rowGapMm} mm`),c("letter-spacing-value",`${e.letterSpacing>0?"+":""}${e.letterSpacing}px`),c("word-spacing-value",`${e.wordSpacing}px`),c("repeat-count-value",`${e.repeatCount}`),c("repeat-gap-value",`${e.repeatGap}px`),c("fade-rows-value",`${e.fadeRows}`),c("initial-trace-opacity-value",`${e.initialTraceOpacity}%`),c("stroke-width-value",`${e.strokeWidth}px`),c("guide-stroke-width-value",`${e.guideStrokeWidth.toFixed(1)}px`)},at=()=>{P.value=e.text,O.value=e.style,e.previewZoom=F(e.previewZoom),e.rowHeightMm=p(v,e.rowHeightMm),e.rowGapMm=p(_,e.rowGapMm),e.letterSpacing=p(S,e.letterSpacing),e.wordSpacing=p(b,e.wordSpacing),e.repeatCount=p(L,e.repeatCount),e.repeatGap=p($,e.repeatGap),e.fadeRows=p(G,e.fadeRows),e.initialTraceOpacity=p(T,e.initialTraceOpacity),e.strokeWidth=p(E,e.strokeWidth),R.forEach(t=>{const r=t.dataset.globalSetting;r==="guideStrokeWidth"?e.guideStrokeWidth=p(t,e.guideStrokeWidth):r==="guideColor"?t.value=e.guideColor:r==="traceColor"?t.value=e.traceColor:r==="keepInitialLeadIn"?t.checked=e.keepInitialLeadIn:r==="keepFinalLeadOut"?t.checked=e.keepFinalLeadOut:r==="includeNameDate"?t.checked=e.includeNameDate:r==="showBaselineGuide"?t.checked=e.showBaselineGuide:r==="showXHeightGuide"?t.checked=e.showXHeightGuide:r==="showAscenderGuide"?t.checked=e.showAscenderGuide:r==="showDescenderGuide"&&(t.checked=e.showDescenderGuide)}),Ge(),M()},ot=()=>{const t=new URLSearchParams(window.location.search);e=x();const r=t.get("text")??t.get("word");r!==null&&(e.text=ve(r));const a=t.get("style");a!==null&&(e.style=_e(a)??e.style);const i=rt(t);i!==null?(e.previewZoom=i,D=!0):D=!1,e.rowHeightMm=h(t,"rowHeight",v)??e.rowHeightMm,e.rowGapMm=h(t,"rowGap",_)??e.rowGapMm,e.letterSpacing=h(t,"letterSpacing",S)??e.letterSpacing,e.wordSpacing=h(t,"wordSpacing",b)??e.wordSpacing,e.repeatCount=h(t,"repeatCount",L)??e.repeatCount,e.repeatGap=h(t,"repeatGap",$)??e.repeatGap,e.strokeWidth=h(t,"strokeWidth",E)??e.strokeWidth,e.fadeRows=h(t,"fadeRows",G)??e.fadeRows,e.initialTraceOpacity=h(t,"initialTraceOpacity",T)??e.initialTraceOpacity,R.forEach(s=>{const o=s.dataset.globalSetting;o==="guideStrokeWidth"?e.guideStrokeWidth=h(t,o,s)??e.guideStrokeWidth:o==="guideColor"?e.guideColor=B(t,o)??e.guideColor:o==="traceColor"?e.traceColor=B(t,o)??e.traceColor:o==="keepInitialLeadIn"?e.keepInitialLeadIn=f(t,o)??e.keepInitialLeadIn:o==="keepFinalLeadOut"?e.keepFinalLeadOut=f(t,o)??e.keepFinalLeadOut:o==="includeNameDate"?e.includeNameDate=f(t,o)??e.includeNameDate:o==="showBaselineGuide"?e.showBaselineGuide=f(t,o)??e.showBaselineGuide:o==="showXHeightGuide"?e.showXHeightGuide=f(t,o)??e.showXHeightGuide:o==="showAscenderGuide"?e.showAscenderGuide=f(t,o)??e.showAscenderGuide:o==="showDescenderGuide"&&(e.showDescenderGuide=f(t,o)??e.showDescenderGuide)}),at()},Ge=()=>{w.style.setProperty("--worksheet-preview-scale",`${e.previewZoom/100}`)},Te=(t,r={})=>{e.previewZoom=F(t),r.manual&&(D=!0),Ge(),M(),(r.syncUrl??!0)&&$e()},Ee=()=>{var n;if(D)return;const t=window.getComputedStyle(w.parentElement??w),r=Number.parseFloat(t.paddingLeft)+Number.parseFloat(t.paddingRight),a=((n=w.parentElement)==null?void 0:n.clientWidth)??w.clientWidth,i=Math.max(0,a-r-Me),s=m.offsetWidth;if(s<=0||i<=0)return;const o=Math.floor(i/s*100/k)*k;Te(o,{syncUrl:!1})},q=(t,r)=>{const a=t.path.guides,i=e.strokeWidth/2,s=Math.abs(a.baseline-a.xHeight);return r==="baseline"?a.baseline+t.offsetY+i:r==="xHeight"?a.xHeight+t.offsetY-i:r==="ascender"?(a.ascender??a.xHeight-s*Ye)+t.offsetY-i:(a.descender??a.baseline+s*Ke)+t.offsetY+i},A=(t,r,a)=>({baseline:e.showBaselineGuide,xHeight:e.showXHeightGuide,ascender:e.showAscenderGuide,descender:e.showDescenderGuide})[a]?`
    <line
      class="worksheet-word__guide worksheet-word__guide--${a}"
      x1="0"
      y1="${q(t,a)}"
      x2="${r}"
      y2="${q(t,a)}"
    ></line>
  `:"",ye=(t,r)=>`
  ${A(t,r,"ascender")}
  ${A(t,r,"xHeight")}
  ${A(t,r,"baseline")}
  ${A(t,r,"descender")}
`,H=t=>t.path.strokes.filter(r=>r.type!=="lift").map(r=>`<path class="worksheet-word__stroke" d="${Ne(r.curves)}"></path>`).join(""),it=(t,r)=>`
  ${H(t)}
  ${Re(t.path,r,C)}
`,st=t=>{const r=t.path.bounds.maxX-t.path.bounds.minX,a=t.path.bounds.minX;return r+a+e.repeatGap},nt=(t,r,a,i,s="xMidYMid meet",o=1,n="practice-word")=>{const y=st(t),U=t.width+y*(o-1),Z=H(t),Ce=o<=1?Z:`
        <defs>
          <g id="${n}">
            ${Z}
          </g>
        </defs>
        ${Array.from({length:o},(pt,Ie)=>{const De=Ie*y;return`<use href="#${n}" x="${De}" y="0"></use>`}).join("")}
      `;return`
    <svg
      class="${r}"
      viewBox="0 0 ${U} ${t.height}"
      preserveAspectRatio="${s}"
      role="img"
      aria-label="${Se(a)}"
      style="--worksheet-word-stroke: #000000; --worksheet-word-stroke-width: ${e.strokeWidth}; --worksheet-word-stroke-opacity: ${i}; --worksheet-guide-color: ${e.guideColor}; --worksheet-guide-stroke-width: ${e.guideStrokeWidth};"
    >
      ${ye(t,U)}
      ${i>0?Ce:""}
    </svg>
  `},lt=t=>{const a=e.style==="cursive"?Pe(t.path):null,i=a?it(t,a):H(t),s=a?C.strokeColor:e.traceColor,o=a?C.arrowColor:he,n=a?C.arrowStrokeWidth:pe;return`
    <svg
      class="worksheet-word worksheet-word--top"
      viewBox="0 0 ${t.width} ${t.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Se(`${e.text} handwriting example${a?" with formation annotations":""}`)}"
      style="--formation-arrow-color: ${o}; --formation-arrow-stroke-width: ${n}; --worksheet-word-stroke: ${s}; --worksheet-word-stroke-width: ${e.strokeWidth}; --worksheet-word-stroke-opacity: 1; --worksheet-guide-color: ${e.guideColor}; --worksheet-guide-stroke-width: ${e.guideStrokeWidth};"
    >
      ${ye(t,t.width)}
      ${i}
    </svg>
  `},dt=()=>Math.max(1,Math.floor((Xe+e.rowGapMm)/(e.rowHeightMm+e.rowGapMm))),ct=t=>{if(t>=e.fadeRows)return 0;const r=e.fadeRows<=1?1:t/(e.fadeRows-1),a=Math.max(0,e.initialTraceOpacity/100*(1-r));return Number(a.toFixed(3))},ut=()=>{we.hidden=e.style==="cursive"},d=()=>{if(e={...e,text:ve(P.value),style:_e(O.value)??e.style,rowHeightMm:Number(v.value),rowGapMm:Number(_.value),letterSpacing:Number(S.value),wordSpacing:Number(b.value),repeatCount:Number(L.value),repeatGap:Number($.value),fadeRows:Number(G.value),initialTraceOpacity:Number(T.value),strokeWidth:Number(E.value)},ut(),M(),$e(),e.text.length===0){m.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,I.textContent="";return}let t;try{t=Oe(e.text,{style:e.style,...e.style==="cursive"?{}:{letterSpacing:e.letterSpacing,wordSpacing:e.wordSpacing},keepInitialLeadIn:e.keepInitialLeadIn,keepFinalLeadOut:e.keepFinalLeadOut})}catch{m.innerHTML=`
      <div class="worksheet-page__empty">Use supported letters and spaces.</div>
    `,I.textContent="This text could not be drawn.";return}const r=dt(),a=Array.from({length:r},(s,o)=>nt(t,"worksheet-word worksheet-word--practice",o<e.fadeRows?`${e.text} fading trace row ${o+1}, ${e.repeatCount} word${e.repeatCount===1?"":"s"}`:`${e.text} blank practice row ${o+1}`,ct(o),"xMidYMid meet",e.repeatCount,`practice-word-${o}`)).join(""),i=e.includeNameDate?`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
  `:"";m.style.setProperty("--practice-row-height",`${e.rowHeightMm}mm`),m.style.setProperty("--practice-row-gap",`${e.rowGapMm}mm`),m.classList.toggle("worksheet-page--without-meta",!e.includeNameDate),m.innerHTML=`
    ${i}
    <section class="worksheet-page__example" aria-label="Top example">
      ${lt(t)}
    </section>
    <section class="worksheet-page__practice" aria-label="Fading handwriting practice lines">
      ${a}
    </section>
  `,I.textContent=`${r} practice lines, fading across ${Math.min(e.fadeRows,r)}, ${e.repeatCount} word${e.repeatCount===1?"":"s"} per line`},Ae=We({viewport:fe,frame:w,getZoom:()=>e.previewZoom,setZoom:t=>Te(t,{manual:!0}),minZoom:Y,maxZoom:K,zoomStep:k});P.addEventListener("input",d);O.addEventListener("change",d);ge.addEventListener("click",()=>{Ae.zoomBy(-k)});me.addEventListener("click",()=>{Ae.zoomBy(k)});v.addEventListener("input",d);_.addEventListener("input",d);S.addEventListener("input",d);b.addEventListener("input",d);L.addEventListener("input",d);$.addEventListener("input",d);G.addEventListener("input",d);T.addEventListener("input",d);E.addEventListener("input",d);ke.addEventListener("click",()=>{window.print()});R.forEach(t=>{t.addEventListener("input",()=>{const r=t.dataset.globalSetting;if(r==="guideStrokeWidth")e.guideStrokeWidth=Number(t.value);else if(r==="guideColor"){const a=N(t.value);if(!a)return;e.guideColor=a}else if(r==="traceColor"){const a=N(t.value);if(!a)return;e.traceColor=a}else r==="keepInitialLeadIn"?e.keepInitialLeadIn=t.checked:r==="keepFinalLeadOut"?e.keepFinalLeadOut=t.checked:r==="includeNameDate"?e.includeNameDate=t.checked:r==="showBaselineGuide"?e.showBaselineGuide=t.checked:r==="showXHeightGuide"?e.showXHeightGuide=t.checked:r==="showAscenderGuide"?e.showAscenderGuide=t.checked:r==="showDescenderGuide"&&(e.showDescenderGuide=t.checked);d()})});ot();d();Ee();new ResizeObserver(()=>{Ee()}).observe(w.parentElement??w);
