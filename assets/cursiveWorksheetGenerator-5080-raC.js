import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as Le}from"./style-DW-mNVlM.js";import{g as ye,d as Ae,c as Ge,a as Re}from"./joiner-CVeVmRQl.js";import{E as Ee,D as Ce,b as Ie}from"./formation-annotation-markup-O4NIeVLg.js";import{c as Te,a as Me}from"./shared-v9TOLZ3P.js";import"./annotations-xxjps-9q.js";const ne="zephyr",Oe=96,De=320,oe=13,He=53,Pe=53,Ne=26,We=5.6,Fe=oe*2,je=0,ze="#3f454b",Ue="#ffffff",Be="#83b0dd",Ve="#d5dbe2",se=24,de=1,le=54,ce=1,he="#ffb35c",z=100,Xe=178,Ye=.63,Ze=.66,E=2,K="http://www.w3.org/2000/svg",qe=`
  .worksheet-word__stroke {
    fill: none;
    stroke: var(--worksheet-word-stroke, #d5dbe2);
    stroke-width: var(--worksheet-word-stroke-width, 54);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-opacity: 0.92;
  }
  .worksheet-word--top .worksheet-word__stroke {
    stroke: var(--worksheet-word-stroke, #bac4ce);
    stroke-opacity: 1;
  }
  .worksheet-word__guide {
    stroke: var(--worksheet-guide-color, #b3bec7);
    stroke-width: var(--worksheet-guide-stroke-width, 2);
    vector-effect: non-scaling-stroke;
  }
  .writing-app__section-arrow {
    fill: none;
    stroke-width: var(--formation-arrow-stroke-width, 5.6);
    stroke-linecap: butt;
    stroke-linejoin: round;
  }
  .writing-app__section-arrow--formation {
    stroke: var(--formation-arrow-color, #ffffff);
  }
  .writing-app__section-arrowhead--formation {
    fill: var(--formation-arrow-color, #ffffff);
    stroke: none;
  }
  .writing-app__annotation-number {
    font-weight: 800;
  }
`,k={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},Ke=["text","word","previewZoom","practiceSize","practiceRepeats","strokeWidth","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","gridlineStrokeWidth","gridlineColor","keepInitialLeadIn","keepFinalLeadOut","topDirectionalDashSpacing","topMidpointDensity","topTurnRadius","topUTurnLength","topArrowLength","topArrowHeadSize","topArrowStrokeWidth","topNumberSize","topNumberPathOffset","topOffsetArrowLanes","topAlwaysOffsetArrowLanes","topStrokeColor","topNumberColor","topArrowColor","topDirectionalDash","topTurningPoint","topStartArrow","topDrawOrderNumber","topMidpointArrow","practiceDirectionalDashSpacing","practiceMidpointDensity","practiceTurnRadius","practiceUTurnLength","practiceArrowLength","practiceArrowHeadSize","practiceArrowStrokeWidth","practiceNumberSize","practiceNumberPathOffset","practiceOffsetArrowLanes","practiceAlwaysOffsetArrowLanes","practiceStrokeColor","practiceNumberColor","practiceArrowColor","practiceDirectionalDash","practiceTurningPoint","practiceStartArrow","practiceDrawOrderNumber","practiceMidpointArrow"],Je=["directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberPathOffset"],Qe=["offsetArrowLanes","alwaysOffsetArrowLanes"],et=["strokeColor","numberColor","arrowColor"],pe={"directional-dash":"DirectionalDash","turning-point":"TurningPoint","start-arrow":"StartArrow","draw-order-number":"DrawOrderNumber","midpoint-arrow":"MidpointArrow"},U=document.querySelector("#app");if(!U)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");U.classList.add("worksheet-root");const W=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),J=(e,r)=>({directionalDashSpacing:Oe,midpointDensity:De,turnRadius:oe,uTurnLength:He,arrowLength:Pe,arrowHeadSize:Ne,arrowStrokeWidth:We,numberSize:Fe,numberPathOffset:je,numberColor:ze,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:W(e),arrowColor:Ue,strokeColor:r}),B=()=>({text:ne,previewZoom:z,practiceRowHeightMm:se,practiceRepeatCount:de,strokeWidth:le,joinSpacing:{...k},showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!1,showDescenderGuide:!1,gridlineStrokeWidth:ce,gridlineColor:he,keepInitialLeadIn:!0,keepFinalLeadOut:!0,top:J(Ce,Be),practice:J(Ee,Ve)}),l=B();let i=B();U.innerHTML=`
  <div class="worksheet-app">
    <aside class="worksheet-app__controls" aria-label="Worksheet controls">
      <div class="worksheet-app__controls-inner">
        <div class="worksheet-app__heading">
          <p class="worksheet-app__eyebrow">Worksheet generator</p>
          <h1 class="worksheet-app__title">Cursive worksheet</h1>
        </div>

        <label class="worksheet-app__field" for="worksheet-text-input">
          <span>Word or words</span>
          <input
            class="worksheet-app__text-input"
            id="worksheet-text-input"
            type="text"
            value="${ne}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${u({id:"preview-zoom-slider",label:"Preview zoom",value:z,min:50,max:200,step:5,valueId:"preview-zoom-value"})}

        ${u({id:"practice-size-slider",label:"Practice size",value:se,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${u({id:"practice-repeat-slider",label:"Practice repeats",value:de,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${u({id:"stroke-width-slider",label:"Main stroke thickness",value:le,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        ${rt()}

        ${tt()}

        ${Q("top","Top word annotations",i.top)}
        ${Q("practice","Practice annotations",i.practice)}

        <div class="worksheet-app__button-row">
          <button class="worksheet-app__button" id="print-worksheet-button" type="button">
            Print worksheet
          </button>
          <button class="worksheet-app__button worksheet-app__button--secondary" id="download-png-button" type="button">
            Download PNG
          </button>
        </div>
        <p class="worksheet-app__status" id="worksheet-status" role="status" aria-live="polite"></p>
      </div>
    </aside>

    <main class="worksheet-app__preview" aria-label="Worksheet preview">
      <div class="worksheet-app__page-frame" id="worksheet-page-frame">
        <section class="worksheet-page" id="worksheet-page" aria-label="Printable worksheet"></section>
      </div>
    </main>
  </div>
`;const D=document.querySelector("#worksheet-text-input"),$=document.querySelector("#preview-zoom-slider"),y=document.querySelector("#practice-size-slider"),A=document.querySelector("#practice-repeat-slider"),G=document.querySelector("#stroke-width-slider"),ue=document.querySelector("#print-worksheet-button"),C=document.querySelector("#download-png-button"),we=document.querySelector("#worksheet-page-frame"),g=document.querySelector("#worksheet-page"),v=document.querySelector("#worksheet-status");if(!D||!$||!y||!A||!G||!ue||!C||!we||!g||!v)throw new Error("Missing elements for cursive worksheet generator.");const V=Array.from(document.querySelectorAll("[data-global-setting]")),X=Array.from(document.querySelectorAll("[data-scope][data-setting]")),ge=Array.from(document.querySelectorAll("[data-scope][data-annotation-kind]"));function u({id:e,label:r,value:t,min:a,max:n,step:o,valueId:s=`${e}-value`,attrs:d=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${r}
        <strong id="${s}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${a}"
        max="${n}"
        step="${o}"
        value="${t}"
        ${d}
      />
    </label>
  `}function tt(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${u({id:"target-bend-rate-slider",label:"Target maximum bend rate",value:k.targetBendRate,min:0,max:60,step:1,valueId:"target-bend-rate-value",attrs:'data-global-setting="targetBendRate"'})}
        ${u({id:"min-sidebearing-gap-slider",label:"Minimum sidebearing gap",value:k.minSidebearingGap,min:-300,max:200,step:5,valueId:"min-sidebearing-gap-value",attrs:'data-global-setting="minSidebearingGap"'})}
        ${u({id:"bend-search-min-sidebearing-gap-slider",label:"Search minimum sidebearing gap",value:k.bendSearchMinSidebearingGap,min:-300,max:200,step:5,valueId:"bend-search-min-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMinSidebearingGap"'})}
        ${u({id:"bend-search-max-sidebearing-gap-slider",label:"Search maximum sidebearing gap",value:k.bendSearchMaxSidebearingGap,min:-100,max:300,step:5,valueId:"bend-search-max-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMaxSidebearingGap"'})}
        ${u({id:"exit-handle-scale-slider",label:"p0-p1 handle scale",value:k.exitHandleScale,min:0,max:2,step:.05,valueId:"exit-handle-scale-value",attrs:'data-global-setting="exitHandleScale"'})}
        ${u({id:"entry-handle-scale-slider",label:"p2-p3 handle scale",value:k.entryHandleScale,min:0,max:2,step:.05,valueId:"entry-handle-scale-value",attrs:'data-global-setting="entryHandleScale"'})}
        <fieldset class="worksheet-app__checks" aria-label="Advanced worksheet toggles">
          ${_("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${_("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
        </fieldset>
      </div>
    </details>
  `}function rt(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${u({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:ce,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${at("gridline-color-picker","gridlineColor","Gridline colour",he)}
        <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
          ${_("show-baseline-guide","showBaselineGuide","Baseline",!0)}
          ${_("show-descender-guide","showDescenderGuide","Descender",!1)}
          ${_("show-x-height-guide","showXHeightGuide","X-height",!0)}
          ${_("show-ascender-guide","showAscenderGuide","Ascender",!1)}
        </fieldset>
      </div>
    </details>
  `}function _(e,r,t,a){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${r}"
        ${a?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}function at(e,r,t,a){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}"
        type="color"
        value="${a}"
        data-global-setting="${r}"
      />
    </label>
  `}function Q(e,r,t){return`
    <details class="worksheet-app__details" open>
      <summary>${r}</summary>
      <div class="worksheet-app__details-body">
        ${u({id:`${e}-directional-dash-spacing-slider`,label:"Directional dash spacing",value:t.directionalDashSpacing,min:80,max:220,step:4,valueId:`${e}-directional-dash-spacing-value`,attrs:`data-scope="${e}" data-setting="directionalDashSpacing"`})}
        ${u({id:`${e}-midpoint-density-slider`,label:"Midpoint density",value:t.midpointDensity,min:120,max:600,step:20,valueId:`${e}-midpoint-density-value`,attrs:`data-scope="${e}" data-setting="midpointDensity"`})}
        ${u({id:`${e}-turn-radius-slider`,label:"Turn radius",value:t.turnRadius,min:0,max:48,step:1,valueId:`${e}-turn-radius-value`,attrs:`data-scope="${e}" data-setting="turnRadius"`})}
        ${u({id:`${e}-u-turn-length-slider`,label:"U-turn length",value:t.uTurnLength,min:0,max:300,step:1,valueId:`${e}-u-turn-length-value`,attrs:`data-scope="${e}" data-setting="uTurnLength"`})}
        ${u({id:`${e}-arrow-length-slider`,label:"Other arrow length",value:t.arrowLength,min:0,max:300,step:1,valueId:`${e}-arrow-length-value`,attrs:`data-scope="${e}" data-setting="arrowLength"`})}
        ${u({id:`${e}-arrow-head-size-slider`,label:"Arrow head size",value:t.arrowHeadSize,min:0,max:64,step:1,valueId:`${e}-arrow-head-size-value`,attrs:`data-scope="${e}" data-setting="arrowHeadSize"`})}
        ${u({id:`${e}-arrow-stroke-width-slider`,label:"Arrow stroke width",value:t.arrowStrokeWidth,min:1,max:14,step:.5,valueId:`${e}-arrow-stroke-width-value`,attrs:`data-scope="${e}" data-setting="arrowStrokeWidth"`})}
        ${u({id:`${e}-number-size-slider`,label:"Number size",value:t.numberSize,min:8,max:72,step:1,valueId:`${e}-number-size-value`,attrs:`data-scope="${e}" data-setting="numberSize"`})}
        ${u({id:`${e}-number-offset-slider`,label:"Number offset",value:t.numberPathOffset,min:-80,max:80,step:1,valueId:`${e}-number-offset-value`,attrs:`data-scope="${e}" data-setting="numberPathOffset"`})}
        <fieldset class="worksheet-app__checks" aria-label="${r}">
          ${L(e,"directional-dash","Directional dash",t.visibility["directional-dash"])}
          ${L(e,"turning-point","Turns",t.visibility["turning-point"])}
          ${L(e,"start-arrow","Starts",t.visibility["start-arrow"])}
          ${L(e,"draw-order-number","Numbers",t.visibility["draw-order-number"])}
          ${L(e,"midpoint-arrow","Midpoints",t.visibility["midpoint-arrow"])}
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
        ${P(e,"strokeColor","Word stroke colour",t.strokeColor)}
        ${P(e,"numberColor","Number colour",t.numberColor)}
        ${P(e,"arrowColor","Arrow colour",t.arrowColor)}
      </div>
    </details>
  `}function P(e,r,t,a){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}-${r}-picker">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}-${r}-picker"
        type="color"
        value="${a}"
        data-scope="${e}"
        data-setting="${r}"
      />
    </label>
  `}function L(e,r,t,a){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${r}"
        ${a?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}const Y=e=>e.trim().toLowerCase().replace(/\s+/g," "),me=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),Z=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,fe=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,r=""]=e.step.split(".");return r.length},Se=(e,r)=>{const t=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),a=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),n=e.step===""||e.step==="any"?Number.NaN:Number(e.step),o=Number.isFinite(t)?t:0;let s=r;return Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number.isFinite(n)&&n>0&&(s=o+Math.round((s-o)/n)*n),Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number(s.toFixed(fe(e)))},c=(e,r)=>{const t=Se(e,r);return e.value=t.toFixed(fe(e)),t},f=(e,r)=>{const t=e.get(r);if(t===null)return null;const a=t.trim().toLowerCase();return["1","true","yes","on"].includes(a)?!0:["0","false","no","off"].includes(a)?!1:null},p=(e,r,t)=>{const a=e.get(r);if(a===null)return null;const n=Number(a);return Number.isFinite(n)?Se(t,n):null},I=(e,r)=>Z(e.get(r)??""),T=(e,r)=>`${e}${r.charAt(0).toUpperCase()}${r.slice(1)}`,ee=e=>{const r=x(e);X.forEach(t=>{if(t.dataset.scope!==e)return;const a=t.dataset.setting;a==="directionalDashSpacing"?r.directionalDashSpacing=c(t,r.directionalDashSpacing):a==="midpointDensity"?r.midpointDensity=c(t,r.midpointDensity):a==="turnRadius"?r.turnRadius=c(t,r.turnRadius):a==="uTurnLength"?r.uTurnLength=c(t,r.uTurnLength):a==="arrowLength"?r.arrowLength=c(t,r.arrowLength):a==="arrowHeadSize"?r.arrowHeadSize=c(t,r.arrowHeadSize):a==="arrowStrokeWidth"?r.arrowStrokeWidth=c(t,r.arrowStrokeWidth):a==="numberSize"?r.numberSize=c(t,r.numberSize):a==="numberPathOffset"?r.numberPathOffset=c(t,r.numberPathOffset):a==="offsetArrowLanes"?t.checked=r.offsetArrowLanes:a==="alwaysOffsetArrowLanes"?t.checked=r.alwaysOffsetArrowLanes:a==="arrowColor"?t.value=r.arrowColor:a==="numberColor"?t.value=r.numberColor:a==="strokeColor"&&(t.value=r.strokeColor)}),ge.forEach(t=>{if(t.dataset.scope!==e)return;const a=t.dataset.annotationKind;a&&(t.checked=r.visibility[a])})},it=()=>{D.value=i.text,i.previewZoom=c($,i.previewZoom),i.practiceRowHeightMm=c(y,i.practiceRowHeightMm),i.practiceRepeatCount=c(A,i.practiceRepeatCount),i.strokeWidth=c(G,i.strokeWidth),V.forEach(e=>{const r=e.dataset.globalSetting;r==="targetBendRate"?i.joinSpacing.targetBendRate=c(e,i.joinSpacing.targetBendRate):r==="minSidebearingGap"?i.joinSpacing.minSidebearingGap=c(e,i.joinSpacing.minSidebearingGap):r==="bendSearchMinSidebearingGap"?i.joinSpacing.bendSearchMinSidebearingGap=c(e,i.joinSpacing.bendSearchMinSidebearingGap):r==="bendSearchMaxSidebearingGap"?i.joinSpacing.bendSearchMaxSidebearingGap=c(e,i.joinSpacing.bendSearchMaxSidebearingGap):r==="exitHandleScale"?i.joinSpacing.exitHandleScale=c(e,i.joinSpacing.exitHandleScale):r==="entryHandleScale"?i.joinSpacing.entryHandleScale=c(e,i.joinSpacing.entryHandleScale):r==="gridlineStrokeWidth"?i.gridlineStrokeWidth=c(e,i.gridlineStrokeWidth):r==="keepInitialLeadIn"?e.checked=i.keepInitialLeadIn:r==="keepFinalLeadOut"?e.checked=i.keepFinalLeadOut:r==="showBaselineGuide"?e.checked=i.showBaselineGuide:r==="showXHeightGuide"?e.checked=i.showXHeightGuide:r==="showAscenderGuide"?e.checked=i.showAscenderGuide:r==="showDescenderGuide"?e.checked=i.showDescenderGuide:r==="gridlineColor"&&(e.value=i.gridlineColor)}),ee("top"),ee("practice"),ke(),q()},te=(e,r,t,a)=>{Je.forEach(n=>{t[n]!==a[n]&&e.searchParams.set(T(r,n),String(t[n]))}),Qe.forEach(n=>{t[n]!==a[n]&&e.searchParams.set(T(r,n),t[n]?"1":"0")}),et.forEach(n=>{t[n]!==a[n]&&e.searchParams.set(T(r,n),t[n])}),Object.entries(pe).forEach(([n,o])=>{t.visibility[n]!==a.visibility[n]&&e.searchParams.set(`${r}${o}`,t.visibility[n]?"1":"0")})},be=()=>{const e=new URL(window.location.href);Ke.forEach(a=>{e.searchParams.delete(a)}),i.text!==l.text&&e.searchParams.set("text",i.text),i.previewZoom!==l.previewZoom&&e.searchParams.set("previewZoom",String(i.previewZoom)),i.practiceRowHeightMm!==l.practiceRowHeightMm&&e.searchParams.set("practiceSize",String(i.practiceRowHeightMm)),i.practiceRepeatCount!==l.practiceRepeatCount&&e.searchParams.set("practiceRepeats",String(i.practiceRepeatCount)),i.strokeWidth!==l.strokeWidth&&e.searchParams.set("strokeWidth",String(i.strokeWidth)),i.joinSpacing.targetBendRate!==l.joinSpacing.targetBendRate&&e.searchParams.set("targetBendRate",String(i.joinSpacing.targetBendRate)),i.joinSpacing.minSidebearingGap!==l.joinSpacing.minSidebearingGap&&e.searchParams.set("minSidebearingGap",String(i.joinSpacing.minSidebearingGap)),i.joinSpacing.bendSearchMinSidebearingGap!==l.joinSpacing.bendSearchMinSidebearingGap&&e.searchParams.set("bendSearchMinSidebearingGap",String(i.joinSpacing.bendSearchMinSidebearingGap)),i.joinSpacing.bendSearchMaxSidebearingGap!==l.joinSpacing.bendSearchMaxSidebearingGap&&e.searchParams.set("bendSearchMaxSidebearingGap",String(i.joinSpacing.bendSearchMaxSidebearingGap)),i.joinSpacing.exitHandleScale!==l.joinSpacing.exitHandleScale&&e.searchParams.set("exitHandleScale",String(i.joinSpacing.exitHandleScale)),i.joinSpacing.entryHandleScale!==l.joinSpacing.entryHandleScale&&e.searchParams.set("entryHandleScale",String(i.joinSpacing.entryHandleScale)),i.showBaselineGuide!==l.showBaselineGuide&&e.searchParams.set("showBaselineGuide",i.showBaselineGuide?"1":"0"),i.showXHeightGuide!==l.showXHeightGuide&&e.searchParams.set("showXHeightGuide",i.showXHeightGuide?"1":"0"),i.showAscenderGuide!==l.showAscenderGuide&&e.searchParams.set("showAscenderGuide",i.showAscenderGuide?"1":"0"),i.showDescenderGuide!==l.showDescenderGuide&&e.searchParams.set("showDescenderGuide",i.showDescenderGuide?"1":"0"),i.gridlineStrokeWidth!==l.gridlineStrokeWidth&&e.searchParams.set("gridlineStrokeWidth",String(i.gridlineStrokeWidth)),i.gridlineColor!==l.gridlineColor&&e.searchParams.set("gridlineColor",i.gridlineColor),i.keepInitialLeadIn!==l.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",i.keepInitialLeadIn?"1":"0"),i.keepFinalLeadOut!==l.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",i.keepFinalLeadOut?"1":"0"),te(e,"top",i.top,l.top),te(e,"practice",i.practice,l.practice);const r=`${e.pathname}${e.search}${e.hash}`,t=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==t&&window.history.replaceState(null,"",r)},re=(e,r)=>{const t=x(r);X.forEach(a=>{if(a.dataset.scope!==r)return;const n=a.dataset.setting;if(!n)return;const o=T(r,n);n==="directionalDashSpacing"?t.directionalDashSpacing=p(e,o,a)??t.directionalDashSpacing:n==="midpointDensity"?t.midpointDensity=p(e,o,a)??t.midpointDensity:n==="turnRadius"?t.turnRadius=p(e,o,a)??t.turnRadius:n==="uTurnLength"?t.uTurnLength=p(e,o,a)??t.uTurnLength:n==="arrowLength"?t.arrowLength=p(e,o,a)??t.arrowLength:n==="arrowHeadSize"?t.arrowHeadSize=p(e,o,a)??t.arrowHeadSize:n==="arrowStrokeWidth"?t.arrowStrokeWidth=p(e,o,a)??t.arrowStrokeWidth:n==="numberSize"?t.numberSize=p(e,o,a)??t.numberSize:n==="numberPathOffset"?t.numberPathOffset=p(e,o,a)??t.numberPathOffset:n==="offsetArrowLanes"?t.offsetArrowLanes=f(e,o)??t.offsetArrowLanes:n==="alwaysOffsetArrowLanes"?t.alwaysOffsetArrowLanes=f(e,o)??t.alwaysOffsetArrowLanes:n==="arrowColor"?t.arrowColor=I(e,o)??t.arrowColor:n==="numberColor"?t.numberColor=I(e,o)??t.numberColor:n==="strokeColor"&&(t.strokeColor=I(e,o)??t.strokeColor)}),Object.entries(pe).forEach(([a,n])=>{t.visibility={...t.visibility,[a]:f(e,`${r}${n}`)??t.visibility[a]}})},nt=()=>{const e=new URLSearchParams(window.location.search);i=B();const r=e.get("text")??e.get("word");r!==null&&(i.text=Y(r)),i.previewZoom=p(e,"previewZoom",$)??i.previewZoom,i.practiceRowHeightMm=p(e,"practiceSize",y)??i.practiceRowHeightMm,i.practiceRepeatCount=p(e,"practiceRepeats",A)??i.practiceRepeatCount,i.strokeWidth=p(e,"strokeWidth",G)??i.strokeWidth,V.forEach(t=>{const a=t.dataset.globalSetting;a==="targetBendRate"?i.joinSpacing.targetBendRate=p(e,a,t)??i.joinSpacing.targetBendRate:a==="minSidebearingGap"?i.joinSpacing.minSidebearingGap=p(e,a,t)??i.joinSpacing.minSidebearingGap:a==="bendSearchMinSidebearingGap"?i.joinSpacing.bendSearchMinSidebearingGap=p(e,a,t)??i.joinSpacing.bendSearchMinSidebearingGap:a==="bendSearchMaxSidebearingGap"?i.joinSpacing.bendSearchMaxSidebearingGap=p(e,a,t)??i.joinSpacing.bendSearchMaxSidebearingGap:a==="exitHandleScale"?i.joinSpacing.exitHandleScale=p(e,a,t)??i.joinSpacing.exitHandleScale:a==="entryHandleScale"?i.joinSpacing.entryHandleScale=p(e,a,t)??i.joinSpacing.entryHandleScale:a==="gridlineStrokeWidth"?i.gridlineStrokeWidth=p(e,a,t)??i.gridlineStrokeWidth:a==="keepInitialLeadIn"?i.keepInitialLeadIn=f(e,a)??i.keepInitialLeadIn:a==="keepFinalLeadOut"?i.keepFinalLeadOut=f(e,a)??i.keepFinalLeadOut:a==="showBaselineGuide"?i.showBaselineGuide=f(e,a)??i.showBaselineGuide:a==="showXHeightGuide"?i.showXHeightGuide=f(e,a)??i.showXHeightGuide:a==="showAscenderGuide"?i.showAscenderGuide=f(e,a)??i.showAscenderGuide:a==="showDescenderGuide"?i.showDescenderGuide=f(e,a)??i.showDescenderGuide:a==="gridlineColor"&&(i.gridlineColor=I(e,a)??i.gridlineColor)}),re(e,"top"),re(e,"practice"),it()},x=e=>i[e],ot=()=>Math.max(1,Math.floor(Xe/i.practiceRowHeightMm)),ae=e=>e.toFixed(2),h=(e,r)=>{const t=document.querySelector(`#${e}`);t&&(t.textContent=r)},q=()=>{h("preview-zoom-value",`${i.previewZoom}%`),h("practice-size-value",`${i.practiceRowHeightMm} mm`),h("practice-repeat-value",`${i.practiceRepeatCount}`),h("stroke-width-value",`${i.strokeWidth}px`),h("gridline-stroke-width-value",`${i.gridlineStrokeWidth.toFixed(1)}px`),h("target-bend-rate-value",`${i.joinSpacing.targetBendRate}`),h("min-sidebearing-gap-value",`${i.joinSpacing.minSidebearingGap}`),h("bend-search-min-sidebearing-gap-value",`${i.joinSpacing.bendSearchMinSidebearingGap}`),h("bend-search-max-sidebearing-gap-value",`${i.joinSpacing.bendSearchMaxSidebearingGap}`),h("exit-handle-scale-value",ae(i.joinSpacing.exitHandleScale)),h("entry-handle-scale-value",ae(i.joinSpacing.entryHandleScale)),["top","practice"].forEach(e=>{const r=x(e);h(`${e}-directional-dash-spacing-value`,`${r.directionalDashSpacing}px`),h(`${e}-midpoint-density-value`,`1 per ${r.midpointDensity}px`),h(`${e}-turn-radius-value`,`${r.turnRadius}px`),h(`${e}-u-turn-length-value`,`${r.uTurnLength}px`),h(`${e}-arrow-length-value`,`${r.arrowLength}px`),h(`${e}-arrow-head-size-value`,`${r.arrowHeadSize}px`),h(`${e}-arrow-stroke-width-value`,`${r.arrowStrokeWidth.toFixed(1)}px`),h(`${e}-number-size-value`,`${r.numberSize}px`),h(`${e}-number-offset-value`,`${r.numberPathOffset}px`)})},ke=()=>{we.style.setProperty("--worksheet-preview-scale",`${i.previewZoom/100}`)},F=e=>{i.previewZoom=c($,e),ke(),q(),be()},M=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),N=(e,r)=>{const t=e.map(r);return{avgMs:Number((t.reduce((a,n)=>a+n,0)/t.length).toFixed(3)),minMs:Number(Math.min(...t).toFixed(3)),maxMs:Number(Math.max(...t).toFixed(3))}},ve=()=>({text:i.text,practiceRepeatCount:i.practiceRepeatCount,practiceRowHeightMm:i.practiceRowHeightMm,topVisibility:W(i.top.visibility),practiceVisibility:W(i.practice.visibility)}),st=async(e={})=>{const r=Math.max(1,Math.floor(e.iterations??10)),t=Math.max(0,Math.floor(e.warmupRuns??2)),a=[];for(let n=0;n<t;n+=1)w(),await M();for(let n=0;n<r;n+=1){const o=performance.now();w();const s=performance.now();await M();const d=performance.now();a.push({renderMs:s-o,paintMs:d-s,totalMs:d-o})}return{iterations:r,state:ve(),render:N(a,n=>n.renderMs),paint:N(a,n=>n.paintMs),total:N(a,n=>n.totalMs),runs:a}},dt=async(e,r)=>{const t=i.previewZoom;t!==e&&(F(e),await M());try{return await r()}finally{t!==e&&(F(t),await M())}},lt=(e,r,t)=>{const a=r.xHeight-r.baseline,n=t.xHeight-t.baseline,o=a!==0?n/a:1,s=t.baseline-r.baseline*o;return e*o+s},ie=(e,r,t)=>{let a=t==="ascender"?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY,n=null;for(const o of e){if(o.trim()===""){n=null;continue}const s=o.toLowerCase(),d=n===null?Ae:Ge[n],m=ye(s,d);if(!m){n=null;continue}const b=m.guides,H=b==null?void 0:b[t];if(b&&typeof H=="number"){const R=lt(H,b,r);t==="ascender"?a=Math.min(a,R):a=Math.max(a,R)}n=Re[s]??"low"}return Number.isFinite(a)?a:null},S=(e,r)=>{const t=e.path.guides,a=i.strokeWidth/2,n=Math.abs(t.baseline-t.xHeight);if(r==="baseline")return t.baseline+e.offsetY+a;if(r==="xHeight")return t.xHeight+e.offsetY-a;if(r==="ascender"){const d=ie(i.text,t,"ascender");return d!==null?d+e.offsetY-a:(t.ascender??t.xHeight-n*Ye)+e.offsetY-a}const o=ie(i.text,t,"descender");return o!==null?o+e.offsetY+a:(t.descender??t.baseline+n*Ze)+e.offsetY+a},_e=(e,r)=>`
  ${i.showBaselineGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--baseline"
      x1="0"
      y1="${S(e,"baseline")}"
      x2="${r}"
      y2="${S(e,"baseline")}"
    ></line>
  `:""}
  ${i.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${S(e,"descender")}"
      x2="${r}"
      y2="${S(e,"descender")}"
    ></line>
  `:""}
  ${i.showXHeightGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--midline"
      x1="0"
      y1="${S(e,"xHeight")}"
      x2="${r}"
      y2="${S(e,"xHeight")}"
    ></line>
  `:""}
  ${i.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${S(e,"ascender")}"
      x2="${r}"
      y2="${S(e,"ascender")}"
    ></line>
  `:""}
`,$e=(e,r,t)=>{const n=e.path.strokes.filter(s=>s.type!=="lift").map(s=>`<path class="worksheet-word__stroke" d="${Me(s.curves)}"></path>`).join(""),o=Ie(e.path,r,t);return`
    ${n}
    ${o}
  `},ct=(e,r,t,a,n)=>{const o=$e(e,r,t);return`
    <svg
      class="${a}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${me(n)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${i.strokeWidth}; --worksheet-guide-color: ${i.gridlineColor}; --worksheet-guide-stroke-width: ${i.gridlineStrokeWidth};"
    >
      ${_e(e,e.width)}
      ${o}
    </svg>
  `},ht=e=>{const r=e.path.bounds.maxX-e.path.bounds.minX,t=e.path.bounds.minX;return r+t},pt=(e,r,t,a,n)=>{const o=ht(e),s=e.width+o*(a-1),d=$e(e,r,t),m=`practice-word-${n}`,b=Array.from({length:a},(H,R)=>{const xe=R*o;return`<use href="#${m}" x="${xe}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${s} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${me(`${i.text} practice line, ${a} repeat${a===1?"":"s"}`)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${i.strokeWidth}; --worksheet-guide-color: ${i.gridlineColor}; --worksheet-guide-stroke-width: ${i.gridlineStrokeWidth};"
    >
      ${_e(e,s)}
      <defs>
        <g id="${m}">
          ${d}
        </g>
      </defs>
      ${b}
    </svg>
  `},w=()=>{if(i={...i,text:Y(D.value),practiceRowHeightMm:Number(y.value),practiceRepeatCount:Number(A.value),strokeWidth:Number(G.value)},q(),be(),i.text.length===0){g.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,v.textContent="";return}const e={joinSpacing:i.joinSpacing,keepInitialLeadIn:i.keepInitialLeadIn,keepFinalLeadOut:i.keepFinalLeadOut};let r;try{r=Te(i.text,e)}catch{g.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,v.textContent="This text could not be drawn.";return}const t=Le(r.path),a=ct(r,t,i.top,"worksheet-word worksheet-word--top",`${i.text} with formation annotations`),n=ot(),o=Array.from({length:n},(s,d)=>pt(r,t,i.practice,i.practiceRepeatCount,d)).join("");g.style.setProperty("--practice-row-height",`${i.practiceRowHeightMm}mm`),g.innerHTML=`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
    <section class="worksheet-page__example" aria-label="Top example">
      ${a}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${o}
    </section>
  `,v.textContent=`${n} practice lines, ${i.practiceRepeatCount} repeat${i.practiceRepeatCount===1?"":"s"} per line`},ut=e=>new Promise((r,t)=>{const a=new Image;a.onload=()=>r(a),a.onerror=()=>t(new Error("Could not render worksheet image.")),a.src=e}),wt=(e,r)=>{const t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download=r,document.body.append(a),a.click(),a.remove(),URL.revokeObjectURL(t)},O=(e,r)=>{const t=e.getBoundingClientRect();return{x:t.left-r.left,y:t.top-r.top,width:t.width,height:t.height}},j=(e,r,t,a,n,o)=>{e.save(),e.beginPath(),e.strokeStyle=n,e.lineWidth=o,e.moveTo(r,a),e.lineTo(t,a),e.stroke(),e.restore()},gt=(e,r)=>{e.save(),e.fillStyle="#23313d",e.font="700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textBaseline="alphabetic",g.querySelectorAll(".worksheet-page__meta-line span").forEach(t=>{var d;const a=O(t,r),n=((d=t.textContent)==null?void 0:d.trim())??"",o=a.y+a.height-3;e.fillText(n,a.x,o);const s=a.x+e.measureText(n).width+15;j(e,s,a.x+a.width,a.y+a.height-1,"#cfd6dc",1.3)}),e.restore()},mt=e=>{const r=e.cloneNode(!0);r.setAttribute("xmlns",K);const t=document.createElementNS(K,"style");return t.textContent=qe,r.insertBefore(t,r.firstChild),new XMLSerializer().serializeToString(r)},ft=async(e,r,t)=>{const a=O(r,t),n=mt(r),o=URL.createObjectURL(new Blob([n],{type:"image/svg+xml;charset=utf-8"}));try{const s=await ut(o);e.drawImage(s,a.x,a.y,a.width,a.height)}finally{URL.revokeObjectURL(o)}},St=async()=>await dt(z,async()=>{w();const e=g.getBoundingClientRect(),r=Math.ceil(e.width),t=Math.ceil(e.height),a=document.createElement("canvas");a.width=r*E,a.height=t*E;const n=a.getContext("2d");if(!n)throw new Error("Could not prepare worksheet image.");n.fillStyle="#ffffff",n.fillRect(0,0,a.width,a.height),n.scale(E,E),gt(n,e);for(const s of g.querySelectorAll(".worksheet-word"))await ft(n,s,e);const o=g.querySelector(".worksheet-page__example");if(o){const s=O(o,e);j(n,s.x,s.x+s.width,s.y+s.height-1,"#d7dde2",1.3)}return g.querySelectorAll(".worksheet-word--practice").forEach(s=>{const d=O(s,e);j(n,d.x,d.x+d.width,d.y+d.height-.6,"#d7dde2",1.1)}),await new Promise((s,d)=>{a.toBlob(m=>{m?s(m):d(new Error("Could not encode worksheet image."))},"image/png")})});D.addEventListener("input",w);$.addEventListener("input",()=>{F(Number($.value))});y.addEventListener("input",w);A.addEventListener("input",w);G.addEventListener("input",w);ue.addEventListener("click",()=>{w(),window.print()});C.addEventListener("click",()=>{C.disabled=!0,v.textContent="Preparing PNG...",St().then(e=>{const r=Y(i.text).replaceAll(/\s+/g,"-")||"worksheet";wt(e,`${r}-cursive-worksheet.png`),v.textContent="PNG downloaded."}).catch(e=>{v.textContent=e instanceof Error?e.message:"Could not download PNG."}).finally(()=>{C.disabled=!1})});V.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.globalSetting;if(r==="targetBendRate"||r==="minSidebearingGap"||r==="bendSearchMinSidebearingGap"||r==="bendSearchMaxSidebearingGap"||r==="exitHandleScale"||r==="entryHandleScale")i.joinSpacing={...i.joinSpacing,[r]:Number(e.value)};else if(r==="gridlineStrokeWidth")i.gridlineStrokeWidth=Number(e.value);else if(r==="keepInitialLeadIn")i.keepInitialLeadIn=e.checked;else if(r==="keepFinalLeadOut")i.keepFinalLeadOut=e.checked;else if(r==="showBaselineGuide")i.showBaselineGuide=e.checked;else if(r==="showXHeightGuide")i.showXHeightGuide=e.checked;else if(r==="showAscenderGuide")i.showAscenderGuide=e.checked;else if(r==="showDescenderGuide")i.showDescenderGuide=e.checked;else if(r==="gridlineColor"){const t=Z(e.value);if(!t)return;i.gridlineColor=t}w()})});X.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.scope,t=e.dataset.setting;if(!r||r!=="top"&&r!=="practice")return;const a=x(r);if(t==="directionalDashSpacing")a.directionalDashSpacing=Number(e.value);else if(t==="midpointDensity")a.midpointDensity=Number(e.value);else if(t==="turnRadius")a.turnRadius=Number(e.value);else if(t==="uTurnLength")a.uTurnLength=Number(e.value);else if(t==="arrowLength")a.arrowLength=Number(e.value);else if(t==="arrowHeadSize")a.arrowHeadSize=Number(e.value);else if(t==="arrowStrokeWidth")a.arrowStrokeWidth=Number(e.value);else if(t==="numberSize")a.numberSize=Number(e.value);else if(t==="numberPathOffset")a.numberPathOffset=Number(e.value);else if(t==="offsetArrowLanes")a.offsetArrowLanes=e.checked;else if(t==="alwaysOffsetArrowLanes")a.alwaysOffsetArrowLanes=e.checked;else if(t==="arrowColor"||t==="numberColor"||t==="strokeColor"){const n=Z(e.value);if(!n)return;a[t]=n}w()})});ge.forEach(e=>{e.addEventListener("change",()=>{const r=e.dataset.scope,t=e.dataset.annotationKind;!r||r!=="top"&&r!=="practice"||!t||(x(r).visibility={...x(r).visibility,[t]:e.checked},w())})});nt();w();window.__worksheetProfiler={getState:ve,profileRender:st};
