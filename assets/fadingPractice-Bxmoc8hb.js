import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as Ge}from"./style-GuMfYcru.js";import"./joiner-CaP30BL7.js";import{b as Se,a as $e}from"./shared-BgZ7yO6P.js";import{D as Le,b as Ee}from"./formation-annotation-markup-DpjoQJbn.js";import"./annotations-DHyvYmdP.js";const z="practice",Ae="cursive",X=100,Te=35,Ce=200,k=5,De=20,V=12,q=2,Y=1,K=140,j=50,J=10,Q=.8,ee="#9bb7d8",te="#d5dbe2",Ie="#83b0dd",We=96,re=320,oe=13,Re=53,ye=53,ae=26,se=5.6,Ne=oe*2,Pe=0,xe="#3f454b",ie="#ffffff",Fe=224,Me=.63,Oe=.66,He=["text","word","style","previewZoom","rowHeight","rowGap","repeatCount","repeatGap","strokeWidth","fadeRows","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","guideStrokeWidth","guideColor","traceColor","keepInitialLeadIn","keepFinalLeadOut","includeNameDate"],R=document.querySelector("#app");if(!R)throw new Error("Missing #app element for fading handwriting practice.");document.body.classList.add("worksheet-body");R.classList.add("worksheet-root");const y=()=>({text:z,style:Ae,previewZoom:X,rowHeightMm:V,rowGapMm:q,repeatCount:Y,repeatGap:K,strokeWidth:j,fadeRows:J,showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!0,showDescenderGuide:!0,guideStrokeWidth:Q,guideColor:ee,traceColor:te,keepInitialLeadIn:!0,keepFinalLeadOut:!0,includeNameDate:!1}),Ue=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),Ze=()=>({directionalDashSpacing:We,midpointDensity:re,turnRadius:oe,uTurnLength:Re,arrowLength:ye,arrowHeadSize:ae,arrowStrokeWidth:se,numberSize:Ne,numberPathOffset:Pe,numberColor:xe,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:Ue(Le),arrowColor:ie,strokeColor:Ie}),Be=(e,r)=>({...e,...r,visibility:r.visibility?{...e.visibility,...r.visibility}:e.visibility}),A=Be(Ze(),{directionalDashSpacing:152,midpointDensity:re,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:ae,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!1,visibility:{"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!0,"midpoint-arrow":!1}}),d=y();let t=y(),C=!1;R.innerHTML=`
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
            value="${z}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${ze()}

        ${p({id:"row-height-slider",label:"Line height",value:V,min:8,max:24,step:1,valueId:"row-height-value"})}

        ${p({id:"row-gap-slider",label:"Line spacing",value:q,min:0,max:12,step:1,valueId:"row-gap-value"})}

        ${p({id:"repeat-count-slider",label:"Words per line",value:Y,min:1,max:8,step:1,valueId:"repeat-count-value"})}

        ${p({id:"repeat-gap-slider",label:"Word spacing",value:K,min:0,max:420,step:10,valueId:"repeat-gap-value"})}

        ${p({id:"fade-rows-slider",label:"Fading trace rows",value:J,min:2,max:20,step:1,valueId:"fade-rows-value"})}

        ${p({id:"stroke-width-slider",label:"Stroke thickness",value:j,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        <fieldset class="worksheet-app__checks" aria-label="Worksheet options">
          ${w("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${w("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
          ${w("include-name-date","includeNameDate","Include name/date",!1)}
        </fieldset>

        <details class="worksheet-app__details">
          <summary>Lined paper settings</summary>
          <div class="worksheet-app__details-body">
            ${p({id:"guide-stroke-width-slider",label:"Line thickness",value:Q,min:.4,max:3,step:.1,valueId:"guide-stroke-width-value",attrs:'data-global-setting="guideStrokeWidth"'})}
            ${U("guide-color-picker","guideColor","Line colour",ee)}
            ${U("trace-color-picker","traceColor","Trace colour",te)}
            <fieldset class="worksheet-app__checks" aria-label="Lined paper visibility">
              ${w("show-baseline-guide","showBaselineGuide","Baseline",!0)}
              ${w("show-descender-guide","showDescenderGuide","Descender",!0)}
              ${w("show-x-height-guide","showXHeightGuide","X-height",!0)}
              ${w("show-ascender-guide","showAscenderGuide","Ascender",!0)}
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
      </div>
      <div class="worksheet-app__page-frame" id="worksheet-page-frame">
        <section class="worksheet-page worksheet-page--handwriting-practice" id="worksheet-page" aria-label="Printable worksheet"></section>
      </div>
    </main>
  </div>
`;const D=document.querySelector("#worksheet-text-input"),I=document.querySelector("#worksheet-style-select"),ne=document.querySelector("#preview-zoom-in-button"),de=document.querySelector("#preview-zoom-out-button"),_=document.querySelector("#row-height-slider"),v=document.querySelector("#row-gap-slider"),b=document.querySelector("#repeat-count-slider"),G=document.querySelector("#repeat-gap-slider"),S=document.querySelector("#fade-rows-slider"),$=document.querySelector("#stroke-width-slider"),le=document.querySelector("#print-worksheet-button"),h=document.querySelector("#worksheet-page-frame"),u=document.querySelector("#worksheet-page"),T=document.querySelector("#worksheet-status");if(!D||!I||!ne||!de||!_||!v||!b||!G||!S||!$||!le||!h||!u||!T)throw new Error("Missing elements for fading handwriting practice.");const N=Array.from(document.querySelectorAll("[data-global-setting]"));function ze(){return`
    <label class="worksheet-app__field" for="worksheet-style-select">
      <span>Style</span>
      <select class="worksheet-app__select" id="worksheet-style-select">
        <option value="cursive" selected>Full cursive</option>
        <option value="pre-cursive">Pre-cursive</option>
        <option value="print">Print</option>
      </select>
    </label>
  `}function p({id:e,label:r,value:o,min:s,max:i,step:a,valueId:n=`${e}-value`,attrs:L=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${r}
        <strong id="${n}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${s}"
        max="${i}"
        step="${a}"
        value="${o}"
        ${L}
      />
    </label>
  `}function w(e,r,o,s){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${r}"
        ${s?"checked":""}
      />
      <span>${o}</span>
    </label>
  `}function U(e,r,o,s){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}">
      <span>${o}</span>
      <input
        class="worksheet-app__color"
        id="${e}"
        type="color"
        value="${s}"
        data-global-setting="${r}"
      />
    </label>
  `}const ce=e=>e.trim().replace(/\s+/g," "),ue=e=>e==="cursive"||e==="pre-cursive"||e==="print"?e:null,he=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),W=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,pe=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,r=""]=e.step.split(".");return r.length},we=(e,r)=>{const o=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),s=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),i=e.step===""||e.step==="any"?Number.NaN:Number(e.step),a=Number.isFinite(o)?o:0;let n=r;return Number.isFinite(o)&&(n=Math.max(o,n)),Number.isFinite(s)&&(n=Math.min(s,n)),Number.isFinite(i)&&i>0&&(n=a+Math.round((n-a)/i)*i),Number.isFinite(o)&&(n=Math.max(o,n)),Number.isFinite(s)&&(n=Math.min(s,n)),Number(n.toFixed(pe(e)))},m=(e,r)=>{const o=we(e,r);return e.value=o.toFixed(pe(e)),o},P=e=>{const r=Math.min(Ce,Math.max(Te,e));return Math.round(r/k)*k},g=(e,r)=>{const o=e.get(r);if(o===null)return null;const s=o.trim().toLowerCase();return["1","true","yes","on"].includes(s)?!0:["0","false","no","off"].includes(s)?!1:null},f=(e,r,o)=>{const s=e.get(r);if(s===null)return null;const i=Number(s);return Number.isFinite(i)?we(o,i):null},Xe=e=>{const r=e.get("previewZoom");if(r===null)return null;const o=Number(r);return Number.isFinite(o)?P(o):null},Z=(e,r)=>W(e.get(r)??""),me=()=>{const e=new URL(window.location.href);He.forEach(s=>{e.searchParams.delete(s)}),t.text!==d.text&&e.searchParams.set("text",t.text),t.style!==d.style&&e.searchParams.set("style",t.style),t.rowHeightMm!==d.rowHeightMm&&e.searchParams.set("rowHeight",String(t.rowHeightMm)),t.rowGapMm!==d.rowGapMm&&e.searchParams.set("rowGap",String(t.rowGapMm)),t.repeatCount!==d.repeatCount&&e.searchParams.set("repeatCount",String(t.repeatCount)),t.repeatGap!==d.repeatGap&&e.searchParams.set("repeatGap",String(t.repeatGap)),t.strokeWidth!==d.strokeWidth&&e.searchParams.set("strokeWidth",String(t.strokeWidth)),t.fadeRows!==d.fadeRows&&e.searchParams.set("fadeRows",String(t.fadeRows)),t.showBaselineGuide!==d.showBaselineGuide&&e.searchParams.set("showBaselineGuide",t.showBaselineGuide?"1":"0"),t.showXHeightGuide!==d.showXHeightGuide&&e.searchParams.set("showXHeightGuide",t.showXHeightGuide?"1":"0"),t.showAscenderGuide!==d.showAscenderGuide&&e.searchParams.set("showAscenderGuide",t.showAscenderGuide?"1":"0"),t.showDescenderGuide!==d.showDescenderGuide&&e.searchParams.set("showDescenderGuide",t.showDescenderGuide?"1":"0"),t.guideStrokeWidth!==d.guideStrokeWidth&&e.searchParams.set("guideStrokeWidth",String(t.guideStrokeWidth)),t.guideColor!==d.guideColor&&e.searchParams.set("guideColor",t.guideColor),t.traceColor!==d.traceColor&&e.searchParams.set("traceColor",t.traceColor),t.keepInitialLeadIn!==d.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",t.keepInitialLeadIn?"1":"0"),t.keepFinalLeadOut!==d.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",t.keepFinalLeadOut?"1":"0"),t.includeNameDate!==d.includeNameDate&&e.searchParams.set("includeNameDate",t.includeNameDate?"1":"0");const r=`${e.pathname}${e.search}${e.hash}`,o=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==o&&window.history.replaceState(null,"",r)},c=(e,r)=>{const o=document.querySelector(`#${e}`);o&&(o.textContent=r)},x=()=>{c("preview-zoom-value",`${t.previewZoom}%`),c("row-height-value",`${t.rowHeightMm} mm`),c("row-gap-value",`${t.rowGapMm} mm`),c("repeat-count-value",`${t.repeatCount}`),c("repeat-gap-value",`${t.repeatGap}px`),c("fade-rows-value",`${t.fadeRows}`),c("stroke-width-value",`${t.strokeWidth}px`),c("guide-stroke-width-value",`${t.guideStrokeWidth.toFixed(1)}px`)},Ve=()=>{D.value=t.text,I.value=t.style,t.previewZoom=P(t.previewZoom),t.rowHeightMm=m(_,t.rowHeightMm),t.rowGapMm=m(v,t.rowGapMm),t.repeatCount=m(b,t.repeatCount),t.repeatGap=m(G,t.repeatGap),t.fadeRows=m(S,t.fadeRows),t.strokeWidth=m($,t.strokeWidth),N.forEach(e=>{const r=e.dataset.globalSetting;r==="guideStrokeWidth"?t.guideStrokeWidth=m(e,t.guideStrokeWidth):r==="guideColor"?e.value=t.guideColor:r==="traceColor"?e.value=t.traceColor:r==="keepInitialLeadIn"?e.checked=t.keepInitialLeadIn:r==="keepFinalLeadOut"?e.checked=t.keepFinalLeadOut:r==="includeNameDate"?e.checked=t.includeNameDate:r==="showBaselineGuide"?e.checked=t.showBaselineGuide:r==="showXHeightGuide"?e.checked=t.showXHeightGuide:r==="showAscenderGuide"?e.checked=t.showAscenderGuide:r==="showDescenderGuide"&&(e.checked=t.showDescenderGuide)}),ge(),x()},qe=()=>{const e=new URLSearchParams(window.location.search);t=y();const r=e.get("text")??e.get("word");r!==null&&(t.text=ce(r));const o=e.get("style");o!==null&&(t.style=ue(o)??t.style);const s=Xe(e);s!==null?(t.previewZoom=s,C=!0):C=!1,t.rowHeightMm=f(e,"rowHeight",_)??t.rowHeightMm,t.rowGapMm=f(e,"rowGap",v)??t.rowGapMm,t.repeatCount=f(e,"repeatCount",b)??t.repeatCount,t.repeatGap=f(e,"repeatGap",G)??t.repeatGap,t.strokeWidth=f(e,"strokeWidth",$)??t.strokeWidth,t.fadeRows=f(e,"fadeRows",S)??t.fadeRows,N.forEach(i=>{const a=i.dataset.globalSetting;a==="guideStrokeWidth"?t.guideStrokeWidth=f(e,a,i)??t.guideStrokeWidth:a==="guideColor"?t.guideColor=Z(e,a)??t.guideColor:a==="traceColor"?t.traceColor=Z(e,a)??t.traceColor:a==="keepInitialLeadIn"?t.keepInitialLeadIn=g(e,a)??t.keepInitialLeadIn:a==="keepFinalLeadOut"?t.keepFinalLeadOut=g(e,a)??t.keepFinalLeadOut:a==="includeNameDate"?t.includeNameDate=g(e,a)??t.includeNameDate:a==="showBaselineGuide"?t.showBaselineGuide=g(e,a)??t.showBaselineGuide:a==="showXHeightGuide"?t.showXHeightGuide=g(e,a)??t.showXHeightGuide:a==="showAscenderGuide"?t.showAscenderGuide=g(e,a)??t.showAscenderGuide:a==="showDescenderGuide"&&(t.showDescenderGuide=g(e,a)??t.showDescenderGuide)}),Ve()},ge=()=>{h.style.setProperty("--worksheet-preview-scale",`${t.previewZoom/100}`)},F=(e,r={})=>{t.previewZoom=P(e),r.manual&&(C=!0),ge(),x(),(r.syncUrl??!0)&&me()},fe=()=>{var n;if(C)return;const e=window.getComputedStyle(h.parentElement??h),r=Number.parseFloat(e.paddingLeft)+Number.parseFloat(e.paddingRight),o=((n=h.parentElement)==null?void 0:n.clientWidth)??h.clientWidth,s=Math.max(0,o-r-De),i=u.offsetWidth;if(i<=0||s<=0)return;const a=Math.floor(s/i*100/k)*k;F(a,{syncUrl:!1})},B=(e,r)=>{const o=e.path.guides,s=t.strokeWidth/2,i=Math.abs(o.baseline-o.xHeight);return r==="baseline"?o.baseline+e.offsetY+s:r==="xHeight"?o.xHeight+e.offsetY-s:r==="ascender"?(o.ascender??o.xHeight-i*Me)+e.offsetY-s:(o.descender??o.baseline+i*Oe)+e.offsetY+s},E=(e,r,o)=>({baseline:t.showBaselineGuide,xHeight:t.showXHeightGuide,ascender:t.showAscenderGuide,descender:t.showDescenderGuide})[o]?`
    <line
      class="worksheet-word__guide worksheet-word__guide--${o}"
      x1="0"
      y1="${B(e,o)}"
      x2="${r}"
      y2="${B(e,o)}"
    ></line>
  `:"",ke=(e,r)=>`
  ${E(e,r,"ascender")}
  ${E(e,r,"xHeight")}
  ${E(e,r,"baseline")}
  ${E(e,r,"descender")}
`,M=e=>e.path.strokes.filter(r=>r.type!=="lift").map(r=>`<path class="worksheet-word__stroke" d="${$e(r.curves)}"></path>`).join(""),Ye=(e,r)=>`
  ${M(e)}
  ${Ee(e.path,r,A)}
`,Ke=e=>{const r=e.path.bounds.maxX-e.path.bounds.minX,o=e.path.bounds.minX;return r+o+t.repeatGap},je=(e,r,o,s,i="xMidYMid meet",a=1,n="practice-word")=>{const L=Ke(e),O=e.width+L*(a-1),H=M(e),_e=a<=1?H:`
        <defs>
          <g id="${n}">
            ${H}
          </g>
        </defs>
        ${Array.from({length:a},(tt,ve)=>{const be=ve*L;return`<use href="#${n}" x="${be}" y="0"></use>`}).join("")}
      `;return`
    <svg
      class="${r}"
      viewBox="0 0 ${O} ${e.height}"
      preserveAspectRatio="${i}"
      role="img"
      aria-label="${he(o)}"
      style="--worksheet-word-stroke: ${t.traceColor}; --worksheet-word-stroke-width: ${t.strokeWidth}; --worksheet-word-stroke-opacity: ${s}; --worksheet-guide-color: ${t.guideColor}; --worksheet-guide-stroke-width: ${t.guideStrokeWidth};"
    >
      ${ke(e,O)}
      ${s>0?_e:""}
    </svg>
  `},Je=e=>{const o=t.style==="cursive"?Ge(e.path):null,s=o?Ye(e,o):M(e),i=o?A.strokeColor:t.traceColor,a=o?A.arrowColor:ie,n=o?A.arrowStrokeWidth:se;return`
    <svg
      class="worksheet-word worksheet-word--top"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${he(`${t.text} handwriting example${o?" with formation annotations":""}`)}"
      style="--formation-arrow-color: ${a}; --formation-arrow-stroke-width: ${n}; --worksheet-word-stroke: ${i}; --worksheet-word-stroke-width: ${t.strokeWidth}; --worksheet-word-stroke-opacity: 1; --worksheet-guide-color: ${t.guideColor}; --worksheet-guide-stroke-width: ${t.guideStrokeWidth};"
    >
      ${ke(e,e.width)}
      ${s}
    </svg>
  `},Qe=()=>Math.max(1,Math.floor((Fe+t.rowGapMm)/(t.rowHeightMm+t.rowGapMm))),et=e=>{if(e>=t.fadeRows)return 0;const r=t.fadeRows<=1?1:e/(t.fadeRows-1),o=Math.max(0,.9*(1-r));return Number(o.toFixed(3))},l=()=>{if(t={...t,text:ce(D.value),style:ue(I.value)??t.style,rowHeightMm:Number(_.value),rowGapMm:Number(v.value),repeatCount:Number(b.value),repeatGap:Number(G.value),fadeRows:Number(S.value),strokeWidth:Number($.value)},x(),me(),t.text.length===0){u.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,T.textContent="";return}let e;try{e=Se(t.text,{style:t.style,keepInitialLeadIn:t.keepInitialLeadIn,keepFinalLeadOut:t.keepFinalLeadOut})}catch{u.innerHTML=`
      <div class="worksheet-page__empty">Use supported letters and spaces.</div>
    `,T.textContent="This text could not be drawn.";return}const r=Qe(),o=Array.from({length:r},(i,a)=>je(e,"worksheet-word worksheet-word--practice",a<t.fadeRows?`${t.text} fading trace row ${a+1}, ${t.repeatCount} word${t.repeatCount===1?"":"s"}`:`${t.text} blank practice row ${a+1}`,et(a),"xMidYMid meet",t.repeatCount,`practice-word-${a}`)).join(""),s=t.includeNameDate?`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
  `:"";u.style.setProperty("--practice-row-height",`${t.rowHeightMm}mm`),u.style.setProperty("--practice-row-gap",`${t.rowGapMm}mm`),u.classList.toggle("worksheet-page--without-meta",!t.includeNameDate),u.innerHTML=`
    ${s}
    <section class="worksheet-page__example" aria-label="Top example">
      ${Je(e)}
    </section>
    <section class="worksheet-page__practice" aria-label="Fading handwriting practice lines">
      ${o}
    </section>
  `,T.textContent=`${r} practice lines, fading across ${Math.min(t.fadeRows,r)}, ${t.repeatCount} word${t.repeatCount===1?"":"s"} per line`};D.addEventListener("input",l);I.addEventListener("change",l);de.addEventListener("click",()=>{F(t.previewZoom-k,{manual:!0})});ne.addEventListener("click",()=>{F(t.previewZoom+k,{manual:!0})});_.addEventListener("input",l);v.addEventListener("input",l);b.addEventListener("input",l);G.addEventListener("input",l);S.addEventListener("input",l);$.addEventListener("input",l);le.addEventListener("click",()=>{l(),window.print()});N.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.globalSetting;if(r==="guideStrokeWidth")t.guideStrokeWidth=Number(e.value);else if(r==="guideColor"){const o=W(e.value);if(!o)return;t.guideColor=o}else if(r==="traceColor"){const o=W(e.value);if(!o)return;t.traceColor=o}else r==="keepInitialLeadIn"?t.keepInitialLeadIn=e.checked:r==="keepFinalLeadOut"?t.keepFinalLeadOut=e.checked:r==="includeNameDate"?t.includeNameDate=e.checked:r==="showBaselineGuide"?t.showBaselineGuide=e.checked:r==="showXHeightGuide"?t.showXHeightGuide=e.checked:r==="showAscenderGuide"?t.showAscenderGuide=e.checked:r==="showDescenderGuide"&&(t.showDescenderGuide=e.checked);l()})});qe();l();fe();new ResizeObserver(()=>{fe()}).observe(h.parentElement??h);
