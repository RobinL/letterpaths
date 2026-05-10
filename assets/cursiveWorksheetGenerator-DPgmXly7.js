import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as De}from"./style-C7wl_Z-J.js";import{g as Te,d as Ce,c as Oe,a as Ne}from"./joiner-CtOGZvQI.js";import{E as Me,D as Pe,b as He}from"./formation-annotation-markup-CrgeHxOq.js";import{c as We,a as Fe}from"./shared-CCQY4f2Y.js";import"./annotations-xxjps-9q.js";const re="zephyr",ie=96,P=320,ne=13,ze=53,je=53,H=26,Ue=5.6,Be=ne*2,Ve=0,Ze="#3f454b",Xe="#ffffff",Ye="#83b0dd",qe="#d5dbe2",oe=24,se=1,de=54,le=1,ce="#ffb35c",ue=100,Ke=35,Je=200,L=5,Qe=20,et=178,tt=.63,at=.66,k={targetBendRate:4.7,minSidebearingGap:130,bendSearchMinSidebearingGap:-50,bendSearchMaxSidebearingGap:75,exitHandleScale:.75,entryHandleScale:.75},rt=["text","word","previewZoom","practiceSize","practiceRepeats","strokeWidth","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","gridlineStrokeWidth","gridlineColor","keepInitialLeadIn","keepFinalLeadOut","includeNameDate","topDirectionalDashSpacing","topMidpointDensity","topTurnRadius","topUTurnLength","topArrowLength","topArrowHeadSize","topArrowStrokeWidth","topNumberSize","topNumberPathOffset","topOffsetArrowLanes","topAlwaysOffsetArrowLanes","topStrokeColor","topNumberColor","topArrowColor","topDirectionalDash","topTurningPoint","topStartArrow","topDrawOrderNumber","topMidpointArrow","practiceDirectionalDashSpacing","practiceMidpointDensity","practiceTurnRadius","practiceUTurnLength","practiceArrowLength","practiceArrowHeadSize","practiceArrowStrokeWidth","practiceNumberSize","practiceNumberPathOffset","practiceOffsetArrowLanes","practiceAlwaysOffsetArrowLanes","practiceStrokeColor","practiceNumberColor","practiceArrowColor","practiceDirectionalDash","practiceTurningPoint","practiceStartArrow","practiceDrawOrderNumber","practiceMidpointArrow"],it=["directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberPathOffset"],nt=["offsetArrowLanes","alwaysOffsetArrowLanes"],ot=["strokeColor","numberColor","arrowColor"],he={"directional-dash":"DirectionalDash","turning-point":"TurningPoint","start-arrow":"StartArrow","draw-order-number":"DrawOrderNumber","midpoint-arrow":"MidpointArrow"},z=document.querySelector("#app");if(!z)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");z.classList.add("worksheet-root");const W=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),pe=(e,a)=>({directionalDashSpacing:ie,midpointDensity:P,turnRadius:ne,uTurnLength:ze,arrowLength:je,arrowHeadSize:H,arrowStrokeWidth:Ue,numberSize:Be,numberPathOffset:Ve,numberColor:Ze,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:W(e),arrowColor:Xe,strokeColor:a}),we=(e,a)=>({...e,...a,visibility:a.visibility?{...e.visibility,...a.visibility}:e.visibility}),me=()=>pe(Pe,Ye),ge={outside:{directionalDashSpacing:ie,midpointDensity:P,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:H,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!0,arrowColor:"#ff0000",visibility:{"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0}},inside:{directionalDashSpacing:152,midpointDensity:P,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:H,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!1,visibility:{"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!0,"midpoint-arrow":!1}}},j=()=>({text:re,previewZoom:ue,practiceRowHeightMm:oe,practiceRepeatCount:se,strokeWidth:de,joinSpacing:{...k},showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!1,showDescenderGuide:!1,gridlineStrokeWidth:le,gridlineColor:ce,keepInitialLeadIn:!0,keepFinalLeadOut:!0,includeNameDate:!0,top:we(me(),ge.inside),practice:pe(Me,qe)}),d=j();let r=j(),T=!1,q=0;z.innerHTML=`
  <div class="worksheet-app">
    <aside class="worksheet-app__controls" aria-label="Worksheet controls">
      <div class="worksheet-app__controls-inner">
        <div class="worksheet-app__heading">
          <h1 class="worksheet-app__title">UK cursive handwriting worksheet generator</h1>
        </div>

        <label class="worksheet-app__field" for="worksheet-text-input">
          <span>Word or words</span>
          <input
            class="worksheet-app__text-input"
            id="worksheet-text-input"
            type="text"
            value="${re}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${h({id:"practice-size-slider",label:"Practice size",value:oe,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${h({id:"practice-repeat-slider",label:"Practice repeats",value:se,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${h({id:"min-sidebearing-gap-slider",label:"Letter spacing",value:k.minSidebearingGap,min:-300,max:300,step:5,valueId:"min-sidebearing-gap-value",attrs:'data-global-setting="minSidebearingGap"'})}

        ${h({id:"stroke-width-slider",label:"Stroke thickness",value:de,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        <fieldset class="worksheet-app__checks" aria-label="Lead strokes">
          ${_("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${_("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
          ${$("top","draw-order-number","Show numeric steps",r.top.visibility["draw-order-number"])}
          ${_("include-name-date","includeNameDate","Include name/date",!0)}
        </fieldset>

        <fieldset class="worksheet-app__preset-buttons" aria-label="Top word annotation presets">
          <legend>Top word annotation presets</legend>
          <button class="worksheet-app__button worksheet-app__button--secondary" type="button" data-top-annotation-preset="outside">
            Outside letters
          </button>
          <button class="worksheet-app__button worksheet-app__button--secondary" type="button" data-top-annotation-preset="inside">
            Inside letters
          </button>
        </fieldset>

        ${lt()}

        ${dt()}

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
        <output class="worksheet-app__zoom-value" id="preview-zoom-value" aria-live="polite">${ue}%</output>
        <button class="worksheet-app__zoom-button" id="preview-zoom-in-button" type="button" aria-label="Zoom in">+</button>
      </div>
      <div class="worksheet-app__page-frame" id="worksheet-page-frame">
        <section class="worksheet-page" id="worksheet-page" aria-label="Printable worksheet"></section>
      </div>
    </main>
  </div>
`;const C=document.querySelector("#worksheet-text-input"),fe=document.querySelector("#preview-zoom-in-button"),Se=document.querySelector("#preview-zoom-out-button"),A=document.querySelector("#practice-size-slider"),y=document.querySelector("#practice-repeat-slider"),G=document.querySelector("#stroke-width-slider"),st=Array.from(document.querySelectorAll("[data-top-annotation-preset]")),be=document.querySelector("#print-worksheet-button"),S=document.querySelector("#worksheet-page-frame"),v=document.querySelector("#worksheet-page"),E=document.querySelector("#worksheet-status");if(!C||!fe||!Se||!A||!y||!G||!be||!S||!v||!E)throw new Error("Missing elements for cursive worksheet generator.");const U=Array.from(document.querySelectorAll("[data-global-setting]")),B=Array.from(document.querySelectorAll("[data-scope][data-setting]")),ke=Array.from(document.querySelectorAll("[data-scope][data-annotation-kind]"));function h({id:e,label:a,value:t,min:i,max:n,step:o,valueId:s=`${e}-value`,attrs:w=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${a}
        <strong id="${s}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${i}"
        max="${n}"
        step="${o}"
        value="${t}"
        ${w}
      />
    </label>
  `}function dt(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        <details class="worksheet-app__details">
          <summary>Bezier curve settings</summary>
          <div class="worksheet-app__details-body">
            ${h({id:"target-bend-rate-slider",label:"Target maximum bend rate",value:k.targetBendRate,min:0,max:20,step:.1,valueId:"target-bend-rate-value",attrs:'data-global-setting="targetBendRate"'})}
            ${h({id:"bend-search-min-sidebearing-gap-slider",label:"Search minimum sidebearing gap",value:k.bendSearchMinSidebearingGap,min:-300,max:200,step:5,valueId:"bend-search-min-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMinSidebearingGap"'})}
            ${h({id:"bend-search-max-sidebearing-gap-slider",label:"Search maximum sidebearing gap",value:k.bendSearchMaxSidebearingGap,min:-100,max:300,step:5,valueId:"bend-search-max-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMaxSidebearingGap"'})}
            ${h({id:"exit-handle-scale-slider",label:"p0-p1 handle scale",value:k.exitHandleScale,min:0,max:2,step:.05,valueId:"exit-handle-scale-value",attrs:'data-global-setting="exitHandleScale"'})}
            ${h({id:"entry-handle-scale-slider",label:"p2-p3 handle scale",value:k.entryHandleScale,min:0,max:2,step:.05,valueId:"entry-handle-scale-value",attrs:'data-global-setting="entryHandleScale"'})}
          </div>
        </details>
        ${K("top","Top word annotations",r.top)}
        ${K("practice","Practice annotations",r.practice)}
      </div>
    </details>
  `}function lt(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${h({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:le,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${ct("gridline-color-picker","gridlineColor","Gridline colour",ce)}
        <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
          ${_("show-baseline-guide","showBaselineGuide","Baseline",!0)}
          ${_("show-descender-guide","showDescenderGuide","Descender",!1)}
          ${_("show-x-height-guide","showXHeightGuide","X-height",!0)}
          ${_("show-ascender-guide","showAscenderGuide","Ascender",!1)}
        </fieldset>
      </div>
    </details>
  `}function _(e,a,t,i){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${a}"
        ${i?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}function ct(e,a,t,i){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}"
        type="color"
        value="${i}"
        data-global-setting="${a}"
      />
    </label>
  `}function K(e,a,t){return`
    <details class="worksheet-app__details">
      <summary>${a}</summary>
      <div class="worksheet-app__details-body">
        ${h({id:`${e}-directional-dash-spacing-slider`,label:"Directional dash spacing",value:t.directionalDashSpacing,min:80,max:220,step:4,valueId:`${e}-directional-dash-spacing-value`,attrs:`data-scope="${e}" data-setting="directionalDashSpacing"`})}
        ${h({id:`${e}-midpoint-density-slider`,label:"Midpoint density",value:t.midpointDensity,min:120,max:600,step:20,valueId:`${e}-midpoint-density-value`,attrs:`data-scope="${e}" data-setting="midpointDensity"`})}
        ${h({id:`${e}-turn-radius-slider`,label:"Turn radius",value:t.turnRadius,min:0,max:48,step:1,valueId:`${e}-turn-radius-value`,attrs:`data-scope="${e}" data-setting="turnRadius"`})}
        ${h({id:`${e}-u-turn-length-slider`,label:"U-turn length",value:t.uTurnLength,min:0,max:300,step:1,valueId:`${e}-u-turn-length-value`,attrs:`data-scope="${e}" data-setting="uTurnLength"`})}
        ${h({id:`${e}-arrow-length-slider`,label:"Other arrow length",value:t.arrowLength,min:0,max:300,step:1,valueId:`${e}-arrow-length-value`,attrs:`data-scope="${e}" data-setting="arrowLength"`})}
        ${h({id:`${e}-arrow-head-size-slider`,label:"Arrow head size",value:t.arrowHeadSize,min:0,max:64,step:1,valueId:`${e}-arrow-head-size-value`,attrs:`data-scope="${e}" data-setting="arrowHeadSize"`})}
        ${h({id:`${e}-arrow-stroke-width-slider`,label:"Arrow stroke width",value:t.arrowStrokeWidth,min:1,max:14,step:.5,valueId:`${e}-arrow-stroke-width-value`,attrs:`data-scope="${e}" data-setting="arrowStrokeWidth"`})}
        ${h({id:`${e}-number-size-slider`,label:"Number size",value:t.numberSize,min:8,max:72,step:1,valueId:`${e}-number-size-value`,attrs:`data-scope="${e}" data-setting="numberSize"`})}
        ${h({id:`${e}-number-offset-slider`,label:"Number offset",value:t.numberPathOffset,min:-80,max:80,step:1,valueId:`${e}-number-offset-value`,attrs:`data-scope="${e}" data-setting="numberPathOffset"`})}
        <fieldset class="worksheet-app__checks" aria-label="${a}">
          ${$(e,"directional-dash","Directional dash",t.visibility["directional-dash"])}
          ${$(e,"turning-point","Turns",t.visibility["turning-point"])}
          ${$(e,"start-arrow","Starts",t.visibility["start-arrow"])}
          ${e==="practice"?$(e,"draw-order-number","Numbers",t.visibility["draw-order-number"]):""}
          ${$(e,"midpoint-arrow","Midpoints",t.visibility["midpoint-arrow"])}
          <label class="worksheet-app__check">
            <input
              type="checkbox"
              data-scope="${e}"
              data-setting="offsetArrowLanes"
              ${t.offsetArrowLanes?"checked":""}
            />
            <span>Offset lanes</span>
          </label>
          <label class="worksheet-app__check">
            <input
              type="checkbox"
              data-scope="${e}"
              data-setting="alwaysOffsetArrowLanes"
              ${t.alwaysOffsetArrowLanes?"checked":""}
            />
            <span>Always offset lanes</span>
          </label>
        </fieldset>
        ${N(e,"strokeColor","Word stroke colour",t.strokeColor)}
        ${N(e,"numberColor","Number colour",t.numberColor)}
        ${N(e,"arrowColor","Arrow colour",t.arrowColor)}
      </div>
    </details>
  `}function N(e,a,t,i){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}-${a}-picker">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}-${a}-picker"
        type="color"
        value="${i}"
        data-scope="${e}"
        data-setting="${a}"
      />
    </label>
  `}function $(e,a,t,i){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${a}"
        ${i?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}const ve=e=>e.trim().toLowerCase().replace(/\s+/g," "),_e=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),V=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,$e=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,a=""]=e.step.split(".");return a.length},Le=(e,a)=>{const t=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),i=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),n=e.step===""||e.step==="any"?Number.NaN:Number(e.step),o=Number.isFinite(t)?t:0;let s=a;return Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(i)&&(s=Math.min(i,s)),Number.isFinite(n)&&n>0&&(s=o+Math.round((s-o)/n)*n),Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(i)&&(s=Math.min(i,s)),Number(s.toFixed($e(e)))},Z=e=>{const a=Math.min(Je,Math.max(Ke,e));return Math.round(a/L)*L},c=(e,a)=>{const t=Le(e,a);return e.value=t.toFixed($e(e)),t},m=(e,a)=>{const t=e.get(a);if(t===null)return null;const i=t.trim().toLowerCase();return["1","true","yes","on"].includes(i)?!0:["0","false","no","off"].includes(i)?!1:null},u=(e,a,t)=>{const i=e.get(a);if(i===null)return null;const n=Number(i);return Number.isFinite(n)?Le(t,n):null},ut=e=>{const a=e.get("previewZoom");if(a===null)return null;const t=Number(a);return Number.isFinite(t)?Z(t):null},R=(e,a)=>V(e.get(a)??""),D=(e,a)=>`${e}${a.charAt(0).toUpperCase()}${a.slice(1)}`,F=e=>{const a=x(e);B.forEach(t=>{if(t.dataset.scope!==e)return;const i=t.dataset.setting;i==="directionalDashSpacing"?a.directionalDashSpacing=c(t,a.directionalDashSpacing):i==="midpointDensity"?a.midpointDensity=c(t,a.midpointDensity):i==="turnRadius"?a.turnRadius=c(t,a.turnRadius):i==="uTurnLength"?a.uTurnLength=c(t,a.uTurnLength):i==="arrowLength"?a.arrowLength=c(t,a.arrowLength):i==="arrowHeadSize"?a.arrowHeadSize=c(t,a.arrowHeadSize):i==="arrowStrokeWidth"?a.arrowStrokeWidth=c(t,a.arrowStrokeWidth):i==="numberSize"?a.numberSize=c(t,a.numberSize):i==="numberPathOffset"?a.numberPathOffset=c(t,a.numberPathOffset):i==="offsetArrowLanes"?t.checked=a.offsetArrowLanes:i==="alwaysOffsetArrowLanes"?t.checked=a.alwaysOffsetArrowLanes:i==="arrowColor"?t.value=a.arrowColor:i==="numberColor"?t.value=a.numberColor:i==="strokeColor"&&(t.value=a.strokeColor)}),ke.forEach(t=>{if(t.dataset.scope!==e)return;const i=t.dataset.annotationKind;i&&(t.checked=a.visibility[i])})},ht=()=>{C.value=r.text,r.previewZoom=Z(r.previewZoom),r.practiceRowHeightMm=c(A,r.practiceRowHeightMm),r.practiceRepeatCount=c(y,r.practiceRepeatCount),r.strokeWidth=c(G,r.strokeWidth),U.forEach(e=>{const a=e.dataset.globalSetting;a==="targetBendRate"?r.joinSpacing.targetBendRate=c(e,r.joinSpacing.targetBendRate):a==="minSidebearingGap"?r.joinSpacing.minSidebearingGap=c(e,r.joinSpacing.minSidebearingGap):a==="bendSearchMinSidebearingGap"?r.joinSpacing.bendSearchMinSidebearingGap=c(e,r.joinSpacing.bendSearchMinSidebearingGap):a==="bendSearchMaxSidebearingGap"?r.joinSpacing.bendSearchMaxSidebearingGap=c(e,r.joinSpacing.bendSearchMaxSidebearingGap):a==="exitHandleScale"?r.joinSpacing.exitHandleScale=c(e,r.joinSpacing.exitHandleScale):a==="entryHandleScale"?r.joinSpacing.entryHandleScale=c(e,r.joinSpacing.entryHandleScale):a==="gridlineStrokeWidth"?r.gridlineStrokeWidth=c(e,r.gridlineStrokeWidth):a==="keepInitialLeadIn"?e.checked=r.keepInitialLeadIn:a==="keepFinalLeadOut"?e.checked=r.keepFinalLeadOut:a==="includeNameDate"?e.checked=r.includeNameDate:a==="showBaselineGuide"?e.checked=r.showBaselineGuide:a==="showXHeightGuide"?e.checked=r.showXHeightGuide:a==="showAscenderGuide"?e.checked=r.showAscenderGuide:a==="showDescenderGuide"?e.checked=r.showDescenderGuide:a==="gridlineColor"&&(e.value=r.gridlineColor)}),F("top"),F("practice"),Ae(),X()},J=(e,a,t,i)=>{it.forEach(n=>{t[n]!==i[n]&&e.searchParams.set(D(a,n),String(t[n]))}),nt.forEach(n=>{t[n]!==i[n]&&e.searchParams.set(D(a,n),t[n]?"1":"0")}),ot.forEach(n=>{t[n]!==i[n]&&e.searchParams.set(D(a,n),t[n])}),Object.entries(he).forEach(([n,o])=>{t.visibility[n]!==i.visibility[n]&&e.searchParams.set(`${a}${o}`,t.visibility[n]?"1":"0")})},xe=()=>{const e=new URL(window.location.href);rt.forEach(i=>{e.searchParams.delete(i)}),r.text!==d.text&&e.searchParams.set("text",r.text),r.practiceRowHeightMm!==d.practiceRowHeightMm&&e.searchParams.set("practiceSize",String(r.practiceRowHeightMm)),r.practiceRepeatCount!==d.practiceRepeatCount&&e.searchParams.set("practiceRepeats",String(r.practiceRepeatCount)),r.strokeWidth!==d.strokeWidth&&e.searchParams.set("strokeWidth",String(r.strokeWidth)),r.joinSpacing.targetBendRate!==d.joinSpacing.targetBendRate&&e.searchParams.set("targetBendRate",String(r.joinSpacing.targetBendRate)),r.joinSpacing.minSidebearingGap!==d.joinSpacing.minSidebearingGap&&e.searchParams.set("minSidebearingGap",String(r.joinSpacing.minSidebearingGap)),r.joinSpacing.bendSearchMinSidebearingGap!==d.joinSpacing.bendSearchMinSidebearingGap&&e.searchParams.set("bendSearchMinSidebearingGap",String(r.joinSpacing.bendSearchMinSidebearingGap)),r.joinSpacing.bendSearchMaxSidebearingGap!==d.joinSpacing.bendSearchMaxSidebearingGap&&e.searchParams.set("bendSearchMaxSidebearingGap",String(r.joinSpacing.bendSearchMaxSidebearingGap)),r.joinSpacing.exitHandleScale!==d.joinSpacing.exitHandleScale&&e.searchParams.set("exitHandleScale",String(r.joinSpacing.exitHandleScale)),r.joinSpacing.entryHandleScale!==d.joinSpacing.entryHandleScale&&e.searchParams.set("entryHandleScale",String(r.joinSpacing.entryHandleScale)),r.showBaselineGuide!==d.showBaselineGuide&&e.searchParams.set("showBaselineGuide",r.showBaselineGuide?"1":"0"),r.showXHeightGuide!==d.showXHeightGuide&&e.searchParams.set("showXHeightGuide",r.showXHeightGuide?"1":"0"),r.showAscenderGuide!==d.showAscenderGuide&&e.searchParams.set("showAscenderGuide",r.showAscenderGuide?"1":"0"),r.showDescenderGuide!==d.showDescenderGuide&&e.searchParams.set("showDescenderGuide",r.showDescenderGuide?"1":"0"),r.gridlineStrokeWidth!==d.gridlineStrokeWidth&&e.searchParams.set("gridlineStrokeWidth",String(r.gridlineStrokeWidth)),r.gridlineColor!==d.gridlineColor&&e.searchParams.set("gridlineColor",r.gridlineColor),r.keepInitialLeadIn!==d.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",r.keepInitialLeadIn?"1":"0"),r.keepFinalLeadOut!==d.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",r.keepFinalLeadOut?"1":"0"),r.includeNameDate!==d.includeNameDate&&e.searchParams.set("includeNameDate",r.includeNameDate?"1":"0"),J(e,"top",r.top,d.top),J(e,"practice",r.practice,d.practice);const a=`${e.pathname}${e.search}${e.hash}`,t=`${window.location.pathname}${window.location.search}${window.location.hash}`;a!==t&&window.history.replaceState(null,"",a)},Q=(e,a)=>{const t=x(a);B.forEach(i=>{if(i.dataset.scope!==a)return;const n=i.dataset.setting;if(!n)return;const o=D(a,n);n==="directionalDashSpacing"?t.directionalDashSpacing=u(e,o,i)??t.directionalDashSpacing:n==="midpointDensity"?t.midpointDensity=u(e,o,i)??t.midpointDensity:n==="turnRadius"?t.turnRadius=u(e,o,i)??t.turnRadius:n==="uTurnLength"?t.uTurnLength=u(e,o,i)??t.uTurnLength:n==="arrowLength"?t.arrowLength=u(e,o,i)??t.arrowLength:n==="arrowHeadSize"?t.arrowHeadSize=u(e,o,i)??t.arrowHeadSize:n==="arrowStrokeWidth"?t.arrowStrokeWidth=u(e,o,i)??t.arrowStrokeWidth:n==="numberSize"?t.numberSize=u(e,o,i)??t.numberSize:n==="numberPathOffset"?t.numberPathOffset=u(e,o,i)??t.numberPathOffset:n==="offsetArrowLanes"?t.offsetArrowLanes=m(e,o)??t.offsetArrowLanes:n==="alwaysOffsetArrowLanes"?t.alwaysOffsetArrowLanes=m(e,o)??t.alwaysOffsetArrowLanes:n==="arrowColor"?t.arrowColor=R(e,o)??t.arrowColor:n==="numberColor"?t.numberColor=R(e,o)??t.numberColor:n==="strokeColor"&&(t.strokeColor=R(e,o)??t.strokeColor)}),Object.entries(he).forEach(([i,n])=>{t.visibility={...t.visibility,[i]:m(e,`${a}${n}`)??t.visibility[i]}})},pt=()=>{const e=new URLSearchParams(window.location.search);r=j();const a=e.get("text")??e.get("word");a!==null&&(r.text=ve(a));const t=ut(e);t!==null?(r.previewZoom=t,T=!0):T=!1,r.practiceRowHeightMm=u(e,"practiceSize",A)??r.practiceRowHeightMm,r.practiceRepeatCount=u(e,"practiceRepeats",y)??r.practiceRepeatCount,r.strokeWidth=u(e,"strokeWidth",G)??r.strokeWidth,U.forEach(i=>{const n=i.dataset.globalSetting;n==="targetBendRate"?r.joinSpacing.targetBendRate=u(e,n,i)??r.joinSpacing.targetBendRate:n==="minSidebearingGap"?r.joinSpacing.minSidebearingGap=u(e,n,i)??r.joinSpacing.minSidebearingGap:n==="bendSearchMinSidebearingGap"?r.joinSpacing.bendSearchMinSidebearingGap=u(e,n,i)??r.joinSpacing.bendSearchMinSidebearingGap:n==="bendSearchMaxSidebearingGap"?r.joinSpacing.bendSearchMaxSidebearingGap=u(e,n,i)??r.joinSpacing.bendSearchMaxSidebearingGap:n==="exitHandleScale"?r.joinSpacing.exitHandleScale=u(e,n,i)??r.joinSpacing.exitHandleScale:n==="entryHandleScale"?r.joinSpacing.entryHandleScale=u(e,n,i)??r.joinSpacing.entryHandleScale:n==="gridlineStrokeWidth"?r.gridlineStrokeWidth=u(e,n,i)??r.gridlineStrokeWidth:n==="keepInitialLeadIn"?r.keepInitialLeadIn=m(e,n)??r.keepInitialLeadIn:n==="keepFinalLeadOut"?r.keepFinalLeadOut=m(e,n)??r.keepFinalLeadOut:n==="includeNameDate"?r.includeNameDate=m(e,n)??r.includeNameDate:n==="showBaselineGuide"?r.showBaselineGuide=m(e,n)??r.showBaselineGuide:n==="showXHeightGuide"?r.showXHeightGuide=m(e,n)??r.showXHeightGuide:n==="showAscenderGuide"?r.showAscenderGuide=m(e,n)??r.showAscenderGuide:n==="showDescenderGuide"?r.showDescenderGuide=m(e,n)??r.showDescenderGuide:n==="gridlineColor"&&(r.gridlineColor=R(e,n)??r.gridlineColor)}),Q(e,"top"),Q(e,"practice"),ht()},x=e=>r[e],wt=()=>Math.max(1,Math.floor(et/r.practiceRowHeightMm)),ee=e=>e.toFixed(2),l=(e,a)=>{const t=document.querySelector(`#${e}`);t&&(t.textContent=a)},X=()=>{l("preview-zoom-value",`${r.previewZoom}%`),l("practice-size-value",`${r.practiceRowHeightMm} mm`),l("practice-repeat-value",`${r.practiceRepeatCount}`),l("stroke-width-value",`${r.strokeWidth}px`),l("gridline-stroke-width-value",`${r.gridlineStrokeWidth.toFixed(1)}px`),l("target-bend-rate-value",`${r.joinSpacing.targetBendRate}`),l("min-sidebearing-gap-value",`${r.joinSpacing.minSidebearingGap}`),l("bend-search-min-sidebearing-gap-value",`${r.joinSpacing.bendSearchMinSidebearingGap}`),l("bend-search-max-sidebearing-gap-value",`${r.joinSpacing.bendSearchMaxSidebearingGap}`),l("exit-handle-scale-value",ee(r.joinSpacing.exitHandleScale)),l("entry-handle-scale-value",ee(r.joinSpacing.entryHandleScale)),["top","practice"].forEach(e=>{const a=x(e);l(`${e}-directional-dash-spacing-value`,`${a.directionalDashSpacing}px`),l(`${e}-midpoint-density-value`,`1 per ${a.midpointDensity}px`),l(`${e}-turn-radius-value`,`${a.turnRadius}px`),l(`${e}-u-turn-length-value`,`${a.uTurnLength}px`),l(`${e}-arrow-length-value`,`${a.arrowLength}px`),l(`${e}-arrow-head-size-value`,`${a.arrowHeadSize}px`),l(`${e}-arrow-stroke-width-value`,`${a.arrowStrokeWidth.toFixed(1)}px`),l(`${e}-number-size-value`,`${a.numberSize}px`),l(`${e}-number-offset-value`,`${a.numberPathOffset}px`)})},Ae=()=>{S.style.setProperty("--worksheet-preview-scale",`${r.previewZoom/100}`)},mt=()=>{const e=++q;requestAnimationFrame(()=>{requestAnimationFrame(()=>{e===q&&p()})})},Y=(e,a={})=>{const t=r.previewZoom;r.previewZoom=Z(e),a.manual&&(T=!0),Ae(),X(),(a.syncUrl??!0)&&xe(),(a.refreshAfterScale??!0)&&r.previewZoom!==t&&mt()},ye=()=>{var s;if(T)return;const e=window.getComputedStyle(S.parentElement??S),a=Number.parseFloat(e.paddingLeft)+Number.parseFloat(e.paddingRight),t=((s=S.parentElement)==null?void 0:s.clientWidth)??S.clientWidth,i=Math.max(0,t-a-Qe),n=v.offsetWidth;if(n<=0||i<=0)return;const o=Math.floor(i/n*100/L)*L;Y(o,{syncUrl:!1})},te=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),M=(e,a)=>{const t=e.map(a);return{avgMs:Number((t.reduce((i,n)=>i+n,0)/t.length).toFixed(3)),minMs:Number(Math.min(...t).toFixed(3)),maxMs:Number(Math.max(...t).toFixed(3))}},Ge=()=>({text:r.text,practiceRepeatCount:r.practiceRepeatCount,practiceRowHeightMm:r.practiceRowHeightMm,topVisibility:W(r.top.visibility),practiceVisibility:W(r.practice.visibility)}),gt=async(e={})=>{const a=Math.max(1,Math.floor(e.iterations??10)),t=Math.max(0,Math.floor(e.warmupRuns??2)),i=[];for(let n=0;n<t;n+=1)p(),await te();for(let n=0;n<a;n+=1){const o=performance.now();p();const s=performance.now();await te();const w=performance.now();i.push({renderMs:s-o,paintMs:w-s,totalMs:w-o})}return{iterations:a,state:Ge(),render:M(i,n=>n.renderMs),paint:M(i,n=>n.paintMs),total:M(i,n=>n.totalMs),runs:i}},ft=(e,a,t)=>{const i=a.xHeight-a.baseline,n=t.xHeight-t.baseline,o=i!==0?n/i:1,s=t.baseline-a.baseline*o;return e*o+s},ae=(e,a,t)=>{let i=t==="ascender"?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY,n=null;for(const o of e){if(o.trim()===""){n=null;continue}const s=o.toLowerCase(),w=n===null?Ce:Oe[n],g=Te(s,w);if(!g){n=null;continue}const b=g.guides,O=b==null?void 0:b[t];if(b&&typeof O=="number"){const I=ft(O,b,a);t==="ascender"?i=Math.min(i,I):i=Math.max(i,I)}n=Ne[s]??"low"}return Number.isFinite(i)?i:null},f=(e,a)=>{const t=e.path.guides,i=r.strokeWidth/2,n=Math.abs(t.baseline-t.xHeight);if(a==="baseline")return t.baseline+e.offsetY+i;if(a==="xHeight")return t.xHeight+e.offsetY-i;if(a==="ascender"){const w=ae(r.text,t,"ascender");return w!==null?w+e.offsetY-i:(t.ascender??t.xHeight-n*tt)+e.offsetY-i}const o=ae(r.text,t,"descender");return o!==null?o+e.offsetY+i:(t.descender??t.baseline+n*at)+e.offsetY+i},Ie=(e,a)=>`
  ${r.showBaselineGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--baseline"
      x1="0"
      y1="${f(e,"baseline")}"
      x2="${a}"
      y2="${f(e,"baseline")}"
    ></line>
  `:""}
  ${r.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${f(e,"descender")}"
      x2="${a}"
      y2="${f(e,"descender")}"
    ></line>
  `:""}
  ${r.showXHeightGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--midline"
      x1="0"
      y1="${f(e,"xHeight")}"
      x2="${a}"
      y2="${f(e,"xHeight")}"
    ></line>
  `:""}
  ${r.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${f(e,"ascender")}"
      x2="${a}"
      y2="${f(e,"ascender")}"
    ></line>
  `:""}
`,Ee=(e,a,t)=>{const n=e.path.strokes.filter(s=>s.type!=="lift").map(s=>`<path class="worksheet-word__stroke" d="${Fe(s.curves)}"></path>`).join(""),o=He(e.path,a,t);return`
    ${n}
    ${o}
  `},St=(e,a,t,i,n)=>{const o=Ee(e,a,t);return`
    <svg
      class="${i}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${_e(n)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${r.strokeWidth}; --worksheet-guide-color: ${r.gridlineColor}; --worksheet-guide-stroke-width: ${r.gridlineStrokeWidth};"
    >
      ${Ie(e,e.width)}
      ${o}
    </svg>
  `},bt=e=>{const a=e.path.bounds.maxX-e.path.bounds.minX,t=e.path.bounds.minX;return a+t},kt=(e,a,t,i,n)=>{const o=bt(e),s=e.width+o*(i-1),w=Ee(e,a,t),g=`practice-word-${n}`,b=Array.from({length:i},(O,I)=>{const Re=I*o;return`<use href="#${g}" x="${Re}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${s} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${_e(`${r.text} practice line, ${i} repeat${i===1?"":"s"}`)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${r.strokeWidth}; --worksheet-guide-color: ${r.gridlineColor}; --worksheet-guide-stroke-width: ${r.gridlineStrokeWidth};"
    >
      ${Ie(e,s)}
      <defs>
        <g id="${g}">
          ${w}
        </g>
      </defs>
      ${b}
    </svg>
  `},p=()=>{if(r={...r,text:ve(C.value),practiceRowHeightMm:Number(A.value),practiceRepeatCount:Number(y.value),strokeWidth:Number(G.value)},X(),xe(),r.text.length===0){v.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,E.textContent="";return}const e={joinSpacing:r.joinSpacing,keepInitialLeadIn:r.keepInitialLeadIn,keepFinalLeadOut:r.keepFinalLeadOut};let a;try{a=We(r.text,e)}catch{v.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,E.textContent="This text could not be drawn.";return}const t=De(a.path),i=St(a,t,r.top,"worksheet-word worksheet-word--top",`${r.text} with formation annotations`),n=wt(),o=Array.from({length:n},(w,g)=>kt(a,t,r.practice,r.practiceRepeatCount,g)).join(""),s=r.includeNameDate?`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
  `:"";v.style.setProperty("--practice-row-height",`${r.practiceRowHeightMm}mm`),v.classList.toggle("worksheet-page--without-meta",!r.includeNameDate),v.innerHTML=`
    ${s}
    <section class="worksheet-page__example" aria-label="Top example">
      ${i}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${o}
    </section>
  `,E.textContent=`${n} practice lines, ${r.practiceRepeatCount} repeat${r.practiceRepeatCount===1?"":"s"} per line`};C.addEventListener("input",p);Se.addEventListener("click",()=>{Y(r.previewZoom-L,{manual:!0})});fe.addEventListener("click",()=>{Y(r.previewZoom+L,{manual:!0})});A.addEventListener("input",p);y.addEventListener("input",p);G.addEventListener("input",p);be.addEventListener("click",()=>{p(),window.print()});U.forEach(e=>{e.addEventListener("input",()=>{const a=e.dataset.globalSetting;if(a==="targetBendRate"||a==="minSidebearingGap"||a==="bendSearchMinSidebearingGap"||a==="bendSearchMaxSidebearingGap"||a==="exitHandleScale"||a==="entryHandleScale")r.joinSpacing={...r.joinSpacing,[a]:Number(e.value)};else if(a==="gridlineStrokeWidth")r.gridlineStrokeWidth=Number(e.value);else if(a==="keepInitialLeadIn")r.keepInitialLeadIn=e.checked;else if(a==="keepFinalLeadOut")r.keepFinalLeadOut=e.checked;else if(a==="includeNameDate")r.includeNameDate=e.checked;else if(a==="showBaselineGuide")r.showBaselineGuide=e.checked;else if(a==="showXHeightGuide")r.showXHeightGuide=e.checked;else if(a==="showAscenderGuide")r.showAscenderGuide=e.checked;else if(a==="showDescenderGuide")r.showDescenderGuide=e.checked;else if(a==="gridlineColor"){const t=V(e.value);if(!t)return;r.gridlineColor=t}p()})});B.forEach(e=>{e.addEventListener("input",()=>{const a=e.dataset.scope,t=e.dataset.setting;if(!a||a!=="top"&&a!=="practice")return;const i=x(a);if(t==="directionalDashSpacing")i.directionalDashSpacing=Number(e.value);else if(t==="midpointDensity")i.midpointDensity=Number(e.value);else if(t==="turnRadius")i.turnRadius=Number(e.value);else if(t==="uTurnLength")i.uTurnLength=Number(e.value);else if(t==="arrowLength")i.arrowLength=Number(e.value);else if(t==="arrowHeadSize")i.arrowHeadSize=Number(e.value);else if(t==="arrowStrokeWidth")i.arrowStrokeWidth=Number(e.value);else if(t==="numberSize")i.numberSize=Number(e.value);else if(t==="numberPathOffset")i.numberPathOffset=Number(e.value);else if(t==="offsetArrowLanes")i.offsetArrowLanes=e.checked;else if(t==="alwaysOffsetArrowLanes")i.alwaysOffsetArrowLanes=e.checked;else if(t==="arrowColor"||t==="numberColor"||t==="strokeColor"){const n=V(e.value);if(!n)return;i[t]=n}p()})});ke.forEach(e=>{e.addEventListener("change",()=>{const a=e.dataset.scope,t=e.dataset.annotationKind;!a||a!=="top"&&a!=="practice"||!t||(x(a).visibility={...x(a).visibility,[t]:e.checked},p())})});st.forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.topAnnotationPreset;if(a!=="outside"&&a!=="inside")return;const t=ge[a];r.top=we(me(),t),F("top"),p()})});pt();p();ye();new ResizeObserver(()=>{ye()}).observe(S.parentElement??S);window.__worksheetProfiler={getState:Ge,profileRender:gt};
