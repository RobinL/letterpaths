import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as Ce}from"./style-Dpvqy9X2.js";import{g as Re,d as Oe,c as xe,a as Ne}from"./joiner-sHEGOHEe.js";import{E as Pe,D as Ge,b as We}from"./formation-annotation-markup-DJdE7J28.js";import{c as Me,a as Fe}from"./shared-CXvkCPg-.js";import"./annotations-xxjps-9q.js";const te="zephyr",re=96,G=320,ae=13,He=53,ze=53,W=26,Ue=5.6,je=ae*2,Ve=0,Be="#3f454b",Ze="#ffffff",Xe="#83b0dd",Ye="#d5dbe2",ie=24,oe=1,ne=54,se=1,de="#ffb35c",le=100,qe=35,Ke=200,$=5,Je=20,Qe=178,et=.63,tt=.66,ce={sidebearingGapAdjustment:0},rt=["text","word","previewZoom","practiceSize","practiceRepeats","strokeWidth","sidebearingGapAdjustment","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","gridlineStrokeWidth","gridlineColor","keepInitialLeadIn","keepFinalLeadOut","includeNameDate","topDirectionalDashSpacing","topMidpointDensity","topTurnRadius","topUTurnLength","topArrowLength","topArrowHeadSize","topArrowStrokeWidth","topNumberSize","topNumberPathOffset","topOffsetArrowLanes","topAlwaysOffsetArrowLanes","topStrokeColor","topNumberColor","topArrowColor","topDirectionalDash","topTurningPoint","topStartArrow","topDrawOrderNumber","topMidpointArrow","practiceDirectionalDashSpacing","practiceMidpointDensity","practiceTurnRadius","practiceUTurnLength","practiceArrowLength","practiceArrowHeadSize","practiceArrowStrokeWidth","practiceNumberSize","practiceNumberPathOffset","practiceOffsetArrowLanes","practiceAlwaysOffsetArrowLanes","practiceStrokeColor","practiceNumberColor","practiceArrowColor","practiceDirectionalDash","practiceTurningPoint","practiceStartArrow","practiceDrawOrderNumber","practiceMidpointArrow"],at=["directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberPathOffset"],it=["offsetArrowLanes","alwaysOffsetArrowLanes"],ot=["strokeColor","numberColor","arrowColor"],ue={"directional-dash":"DirectionalDash","turning-point":"TurningPoint","start-arrow":"StartArrow","draw-order-number":"DrawOrderNumber","midpoint-arrow":"MidpointArrow"},H=document.querySelector("#app");if(!H)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");H.classList.add("worksheet-root");const M=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),he=(e,r)=>({directionalDashSpacing:re,midpointDensity:G,turnRadius:ae,uTurnLength:He,arrowLength:ze,arrowHeadSize:W,arrowStrokeWidth:Ue,numberSize:je,numberPathOffset:Ve,numberColor:Be,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:M(e),arrowColor:Ze,strokeColor:r}),pe=(e,r)=>({...e,...r,visibility:r.visibility?{...e.visibility,...r.visibility}:e.visibility}),we=()=>he(Ge,Xe),me={outside:{directionalDashSpacing:re,midpointDensity:G,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:W,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!0,arrowColor:"#ff0000",visibility:{"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0}},inside:{directionalDashSpacing:152,midpointDensity:G,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:W,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!1,visibility:{"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!0,"midpoint-arrow":!1}},"inside-two-lanes":{directionalDashSpacing:124,midpointDensity:160,turnRadius:13,uTurnLength:58,arrowLength:90,arrowHeadSize:31,arrowStrokeWidth:6.5,numberSize:40,numberPathOffset:-55,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:{"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0}}},z=()=>({text:te,previewZoom:le,practiceRowHeightMm:ie,practiceRepeatCount:oe,strokeWidth:ne,joinSpacing:{...ce},showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!1,showDescenderGuide:!1,gridlineStrokeWidth:se,gridlineColor:de,keepInitialLeadIn:!0,keepFinalLeadOut:!0,includeNameDate:!0,top:pe(we(),me.inside),practice:he(Pe,Ye)}),d=z();let a=z(),R=!1,Y=0;H.innerHTML=`
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
            value="${te}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${c({id:"practice-size-slider",label:"Practice size",value:ie,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${c({id:"practice-repeat-slider",label:"Practice repeats",value:oe,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${c({id:"sidebearing-gap-adjustment-slider",label:"Letter spacing",value:ce.sidebearingGapAdjustment,min:-120,max:120,step:5,valueId:"sidebearing-gap-adjustment-value",attrs:'data-global-setting="sidebearingGapAdjustment"'})}

        ${c({id:"stroke-width-slider",label:"Stroke thickness",value:ne,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        <fieldset class="worksheet-app__checks" aria-label="Lead strokes">
          ${_("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${_("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
          ${v("top","draw-order-number","Show numeric steps",a.top.visibility["draw-order-number"])}
          ${_("include-name-date","includeNameDate","Include name/date",!0)}
        </fieldset>

        <fieldset class="worksheet-app__preset-buttons" aria-label="Top word annotation presets">
          <legend>Top word annotation presets</legend>
          <button class="worksheet-app__button worksheet-app__button--secondary" type="button" data-top-annotation-preset="outside">
            Outside letters
          </button>
          <button class="worksheet-app__button worksheet-app__button--secondary" type="button" data-top-annotation-preset="inside">
            Inside letters, middle
          </button>
          <button class="worksheet-app__button worksheet-app__button--secondary" type="button" data-top-annotation-preset="inside-two-lanes">
            Inside letters, two lanes
          </button>
        </fieldset>

        ${dt()}

        ${st()}

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
        <output class="worksheet-app__zoom-value" id="preview-zoom-value" aria-live="polite">${le}%</output>
        <button class="worksheet-app__zoom-button" id="preview-zoom-in-button" type="button" aria-label="Zoom in">+</button>
      </div>
      <div class="worksheet-app__page-frame" id="worksheet-page-frame">
        <section class="worksheet-page" id="worksheet-page" aria-label="Printable worksheet"></section>
      </div>
    </main>
  </div>
`;const O=document.querySelector("#worksheet-text-input"),fe=document.querySelector("#preview-zoom-in-button"),ge=document.querySelector("#preview-zoom-out-button"),L=document.querySelector("#practice-size-slider"),E=document.querySelector("#practice-repeat-slider"),D=document.querySelector("#stroke-width-slider"),nt=Array.from(document.querySelectorAll("[data-top-annotation-preset]")),be=document.querySelector("#print-worksheet-button"),b=document.querySelector("#worksheet-page-frame"),S=document.querySelector("#worksheet-page"),y=document.querySelector("#worksheet-status");if(!O||!fe||!ge||!L||!E||!D||!be||!b||!S||!y)throw new Error("Missing elements for cursive worksheet generator.");const U=Array.from(document.querySelectorAll("[data-global-setting]")),j=Array.from(document.querySelectorAll("[data-scope][data-setting]")),ke=Array.from(document.querySelectorAll("[data-scope][data-annotation-kind]"));function c({id:e,label:r,value:t,min:i,max:o,step:n,valueId:s=`${e}-value`,attrs:w=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${r}
        <strong id="${s}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${i}"
        max="${o}"
        step="${n}"
        value="${t}"
        ${w}
      />
    </label>
  `}function st(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${q("top","Top word annotations",a.top)}
        ${q("practice","Practice annotations",a.practice)}
      </div>
    </details>
  `}function dt(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${c({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:se,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${lt("gridline-color-picker","gridlineColor","Gridline colour",de)}
        <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
          ${_("show-baseline-guide","showBaselineGuide","Baseline",!0)}
          ${_("show-descender-guide","showDescenderGuide","Descender",!1)}
          ${_("show-x-height-guide","showXHeightGuide","X-height",!0)}
          ${_("show-ascender-guide","showAscenderGuide","Ascender",!1)}
        </fieldset>
      </div>
    </details>
  `}function _(e,r,t,i){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${r}"
        ${i?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}function lt(e,r,t,i){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}"
        type="color"
        value="${i}"
        data-global-setting="${r}"
      />
    </label>
  `}function q(e,r,t){return`
    <details class="worksheet-app__details">
      <summary>${r}</summary>
      <div class="worksheet-app__details-body">
        ${c({id:`${e}-directional-dash-spacing-slider`,label:"Directional dash spacing",value:t.directionalDashSpacing,min:80,max:220,step:4,valueId:`${e}-directional-dash-spacing-value`,attrs:`data-scope="${e}" data-setting="directionalDashSpacing"`})}
        ${c({id:`${e}-midpoint-density-slider`,label:"Midpoint density",value:t.midpointDensity,min:120,max:600,step:20,valueId:`${e}-midpoint-density-value`,attrs:`data-scope="${e}" data-setting="midpointDensity"`})}
        ${c({id:`${e}-turn-radius-slider`,label:"Turn radius",value:t.turnRadius,min:0,max:48,step:1,valueId:`${e}-turn-radius-value`,attrs:`data-scope="${e}" data-setting="turnRadius"`})}
        ${c({id:`${e}-u-turn-length-slider`,label:"U-turn length",value:t.uTurnLength,min:0,max:300,step:1,valueId:`${e}-u-turn-length-value`,attrs:`data-scope="${e}" data-setting="uTurnLength"`})}
        ${c({id:`${e}-arrow-length-slider`,label:"Other arrow length",value:t.arrowLength,min:0,max:300,step:1,valueId:`${e}-arrow-length-value`,attrs:`data-scope="${e}" data-setting="arrowLength"`})}
        ${c({id:`${e}-arrow-head-size-slider`,label:"Arrow head size",value:t.arrowHeadSize,min:0,max:64,step:1,valueId:`${e}-arrow-head-size-value`,attrs:`data-scope="${e}" data-setting="arrowHeadSize"`})}
        ${c({id:`${e}-arrow-stroke-width-slider`,label:"Arrow stroke width",value:t.arrowStrokeWidth,min:1,max:14,step:.5,valueId:`${e}-arrow-stroke-width-value`,attrs:`data-scope="${e}" data-setting="arrowStrokeWidth"`})}
        ${c({id:`${e}-number-size-slider`,label:"Number size",value:t.numberSize,min:8,max:72,step:1,valueId:`${e}-number-size-value`,attrs:`data-scope="${e}" data-setting="numberSize"`})}
        ${c({id:`${e}-number-offset-slider`,label:"Number offset",value:t.numberPathOffset,min:-80,max:80,step:1,valueId:`${e}-number-offset-value`,attrs:`data-scope="${e}" data-setting="numberPathOffset"`})}
        <fieldset class="worksheet-app__checks" aria-label="${r}">
          ${v(e,"directional-dash","Directional dash",t.visibility["directional-dash"])}
          ${v(e,"turning-point","Turns",t.visibility["turning-point"])}
          ${v(e,"start-arrow","Starts",t.visibility["start-arrow"])}
          ${e==="practice"?v(e,"draw-order-number","Numbers",t.visibility["draw-order-number"]):""}
          ${v(e,"midpoint-arrow","Midpoints",t.visibility["midpoint-arrow"])}
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
  `}function N(e,r,t,i){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}-${r}-picker">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}-${r}-picker"
        type="color"
        value="${i}"
        data-scope="${e}"
        data-setting="${r}"
      />
    </label>
  `}function v(e,r,t,i){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${r}"
        ${i?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}const Se=e=>e.trim().replace(/\s+/g," "),_e=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),V=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,ve=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,r=""]=e.step.split(".");return r.length},$e=(e,r)=>{const t=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),i=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),o=e.step===""||e.step==="any"?Number.NaN:Number(e.step),n=Number.isFinite(t)?t:0;let s=r;return Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(i)&&(s=Math.min(i,s)),Number.isFinite(o)&&o>0&&(s=n+Math.round((s-n)/o)*o),Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(i)&&(s=Math.min(i,s)),Number(s.toFixed(ve(e)))},B=e=>{const r=Math.min(Ke,Math.max(qe,e));return Math.round(r/$)*$},u=(e,r)=>{const t=$e(e,r);return e.value=t.toFixed(ve(e)),t},m=(e,r)=>{const t=e.get(r);if(t===null)return null;const i=t.trim().toLowerCase();return["1","true","yes","on"].includes(i)?!0:["0","false","no","off"].includes(i)?!1:null},h=(e,r,t)=>{const i=e.get(r);if(i===null)return null;const o=Number(i);return Number.isFinite(o)?$e(t,o):null},ct=e=>{const r=e.get("previewZoom");if(r===null)return null;const t=Number(r);return Number.isFinite(t)?B(t):null},T=(e,r)=>V(e.get(r)??""),C=(e,r)=>`${e}${r.charAt(0).toUpperCase()}${r.slice(1)}`,F=e=>{const r=A(e);j.forEach(t=>{if(t.dataset.scope!==e)return;const i=t.dataset.setting;i==="directionalDashSpacing"?r.directionalDashSpacing=u(t,r.directionalDashSpacing):i==="midpointDensity"?r.midpointDensity=u(t,r.midpointDensity):i==="turnRadius"?r.turnRadius=u(t,r.turnRadius):i==="uTurnLength"?r.uTurnLength=u(t,r.uTurnLength):i==="arrowLength"?r.arrowLength=u(t,r.arrowLength):i==="arrowHeadSize"?r.arrowHeadSize=u(t,r.arrowHeadSize):i==="arrowStrokeWidth"?r.arrowStrokeWidth=u(t,r.arrowStrokeWidth):i==="numberSize"?r.numberSize=u(t,r.numberSize):i==="numberPathOffset"?r.numberPathOffset=u(t,r.numberPathOffset):i==="offsetArrowLanes"?t.checked=r.offsetArrowLanes:i==="alwaysOffsetArrowLanes"?t.checked=r.alwaysOffsetArrowLanes:i==="arrowColor"?t.value=r.arrowColor:i==="numberColor"?t.value=r.numberColor:i==="strokeColor"&&(t.value=r.strokeColor)}),ke.forEach(t=>{if(t.dataset.scope!==e)return;const i=t.dataset.annotationKind;i&&(t.checked=r.visibility[i])})},ut=()=>{O.value=a.text,a.previewZoom=B(a.previewZoom),a.practiceRowHeightMm=u(L,a.practiceRowHeightMm),a.practiceRepeatCount=u(E,a.practiceRepeatCount),a.strokeWidth=u(D,a.strokeWidth),U.forEach(e=>{const r=e.dataset.globalSetting;r==="sidebearingGapAdjustment"?a.joinSpacing.sidebearingGapAdjustment=u(e,a.joinSpacing.sidebearingGapAdjustment):r==="gridlineStrokeWidth"?a.gridlineStrokeWidth=u(e,a.gridlineStrokeWidth):r==="keepInitialLeadIn"?e.checked=a.keepInitialLeadIn:r==="keepFinalLeadOut"?e.checked=a.keepFinalLeadOut:r==="includeNameDate"?e.checked=a.includeNameDate:r==="showBaselineGuide"?e.checked=a.showBaselineGuide:r==="showXHeightGuide"?e.checked=a.showXHeightGuide:r==="showAscenderGuide"?e.checked=a.showAscenderGuide:r==="showDescenderGuide"?e.checked=a.showDescenderGuide:r==="gridlineColor"&&(e.value=a.gridlineColor)}),F("top"),F("practice"),Le(),Z()},K=(e,r,t,i)=>{at.forEach(o=>{t[o]!==i[o]&&e.searchParams.set(C(r,o),String(t[o]))}),it.forEach(o=>{t[o]!==i[o]&&e.searchParams.set(C(r,o),t[o]?"1":"0")}),ot.forEach(o=>{t[o]!==i[o]&&e.searchParams.set(C(r,o),t[o])}),Object.entries(ue).forEach(([o,n])=>{t.visibility[o]!==i.visibility[o]&&e.searchParams.set(`${r}${n}`,t.visibility[o]?"1":"0")})},Ae=()=>{const e=new URL(window.location.href);rt.forEach(i=>{e.searchParams.delete(i)}),a.text!==d.text&&e.searchParams.set("text",a.text),a.practiceRowHeightMm!==d.practiceRowHeightMm&&e.searchParams.set("practiceSize",String(a.practiceRowHeightMm)),a.practiceRepeatCount!==d.practiceRepeatCount&&e.searchParams.set("practiceRepeats",String(a.practiceRepeatCount)),a.strokeWidth!==d.strokeWidth&&e.searchParams.set("strokeWidth",String(a.strokeWidth)),a.joinSpacing.sidebearingGapAdjustment!==d.joinSpacing.sidebearingGapAdjustment&&e.searchParams.set("sidebearingGapAdjustment",String(a.joinSpacing.sidebearingGapAdjustment)),a.showBaselineGuide!==d.showBaselineGuide&&e.searchParams.set("showBaselineGuide",a.showBaselineGuide?"1":"0"),a.showXHeightGuide!==d.showXHeightGuide&&e.searchParams.set("showXHeightGuide",a.showXHeightGuide?"1":"0"),a.showAscenderGuide!==d.showAscenderGuide&&e.searchParams.set("showAscenderGuide",a.showAscenderGuide?"1":"0"),a.showDescenderGuide!==d.showDescenderGuide&&e.searchParams.set("showDescenderGuide",a.showDescenderGuide?"1":"0"),a.gridlineStrokeWidth!==d.gridlineStrokeWidth&&e.searchParams.set("gridlineStrokeWidth",String(a.gridlineStrokeWidth)),a.gridlineColor!==d.gridlineColor&&e.searchParams.set("gridlineColor",a.gridlineColor),a.keepInitialLeadIn!==d.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",a.keepInitialLeadIn?"1":"0"),a.keepFinalLeadOut!==d.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",a.keepFinalLeadOut?"1":"0"),a.includeNameDate!==d.includeNameDate&&e.searchParams.set("includeNameDate",a.includeNameDate?"1":"0"),K(e,"top",a.top,d.top),K(e,"practice",a.practice,d.practice);const r=`${e.pathname}${e.search}${e.hash}`,t=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==t&&window.history.replaceState(null,"",r)},J=(e,r)=>{const t=A(r);j.forEach(i=>{if(i.dataset.scope!==r)return;const o=i.dataset.setting;if(!o)return;const n=C(r,o);o==="directionalDashSpacing"?t.directionalDashSpacing=h(e,n,i)??t.directionalDashSpacing:o==="midpointDensity"?t.midpointDensity=h(e,n,i)??t.midpointDensity:o==="turnRadius"?t.turnRadius=h(e,n,i)??t.turnRadius:o==="uTurnLength"?t.uTurnLength=h(e,n,i)??t.uTurnLength:o==="arrowLength"?t.arrowLength=h(e,n,i)??t.arrowLength:o==="arrowHeadSize"?t.arrowHeadSize=h(e,n,i)??t.arrowHeadSize:o==="arrowStrokeWidth"?t.arrowStrokeWidth=h(e,n,i)??t.arrowStrokeWidth:o==="numberSize"?t.numberSize=h(e,n,i)??t.numberSize:o==="numberPathOffset"?t.numberPathOffset=h(e,n,i)??t.numberPathOffset:o==="offsetArrowLanes"?t.offsetArrowLanes=m(e,n)??t.offsetArrowLanes:o==="alwaysOffsetArrowLanes"?t.alwaysOffsetArrowLanes=m(e,n)??t.alwaysOffsetArrowLanes:o==="arrowColor"?t.arrowColor=T(e,n)??t.arrowColor:o==="numberColor"?t.numberColor=T(e,n)??t.numberColor:o==="strokeColor"&&(t.strokeColor=T(e,n)??t.strokeColor)}),Object.entries(ue).forEach(([i,o])=>{t.visibility={...t.visibility,[i]:m(e,`${r}${o}`)??t.visibility[i]}})},ht=()=>{const e=new URLSearchParams(window.location.search);a=z();const r=e.get("text")??e.get("word");r!==null&&(a.text=Se(r));const t=ct(e);t!==null?(a.previewZoom=t,R=!0):R=!1,a.practiceRowHeightMm=h(e,"practiceSize",L)??a.practiceRowHeightMm,a.practiceRepeatCount=h(e,"practiceRepeats",E)??a.practiceRepeatCount,a.strokeWidth=h(e,"strokeWidth",D)??a.strokeWidth,U.forEach(i=>{const o=i.dataset.globalSetting;o==="sidebearingGapAdjustment"?a.joinSpacing.sidebearingGapAdjustment=h(e,o,i)??a.joinSpacing.sidebearingGapAdjustment:o==="gridlineStrokeWidth"?a.gridlineStrokeWidth=h(e,o,i)??a.gridlineStrokeWidth:o==="keepInitialLeadIn"?a.keepInitialLeadIn=m(e,o)??a.keepInitialLeadIn:o==="keepFinalLeadOut"?a.keepFinalLeadOut=m(e,o)??a.keepFinalLeadOut:o==="includeNameDate"?a.includeNameDate=m(e,o)??a.includeNameDate:o==="showBaselineGuide"?a.showBaselineGuide=m(e,o)??a.showBaselineGuide:o==="showXHeightGuide"?a.showXHeightGuide=m(e,o)??a.showXHeightGuide:o==="showAscenderGuide"?a.showAscenderGuide=m(e,o)??a.showAscenderGuide:o==="showDescenderGuide"?a.showDescenderGuide=m(e,o)??a.showDescenderGuide:o==="gridlineColor"&&(a.gridlineColor=T(e,o)??a.gridlineColor)}),J(e,"top"),J(e,"practice"),ut()},A=e=>a[e],pt=()=>Math.max(1,Math.floor(Qe/a.practiceRowHeightMm)),l=(e,r)=>{const t=document.querySelector(`#${e}`);t&&(t.textContent=r)},Z=()=>{l("preview-zoom-value",`${a.previewZoom}%`),l("practice-size-value",`${a.practiceRowHeightMm} mm`),l("practice-repeat-value",`${a.practiceRepeatCount}`),l("stroke-width-value",`${a.strokeWidth}px`),l("gridline-stroke-width-value",`${a.gridlineStrokeWidth.toFixed(1)}px`),l("sidebearing-gap-adjustment-value",`${a.joinSpacing.sidebearingGapAdjustment}`),["top","practice"].forEach(e=>{const r=A(e);l(`${e}-directional-dash-spacing-value`,`${r.directionalDashSpacing}px`),l(`${e}-midpoint-density-value`,`1 per ${r.midpointDensity}px`),l(`${e}-turn-radius-value`,`${r.turnRadius}px`),l(`${e}-u-turn-length-value`,`${r.uTurnLength}px`),l(`${e}-arrow-length-value`,`${r.arrowLength}px`),l(`${e}-arrow-head-size-value`,`${r.arrowHeadSize}px`),l(`${e}-arrow-stroke-width-value`,`${r.arrowStrokeWidth.toFixed(1)}px`),l(`${e}-number-size-value`,`${r.numberSize}px`),l(`${e}-number-offset-value`,`${r.numberPathOffset}px`)})},Le=()=>{b.style.setProperty("--worksheet-preview-scale",`${a.previewZoom/100}`)},wt=()=>{const e=++Y;requestAnimationFrame(()=>{requestAnimationFrame(()=>{e===Y&&p()})})},X=(e,r={})=>{const t=a.previewZoom;a.previewZoom=B(e),r.manual&&(R=!0),Le(),Z(),(r.syncUrl??!0)&&Ae(),(r.refreshAfterScale??!0)&&a.previewZoom!==t&&wt()},Ee=()=>{var s;if(R)return;const e=window.getComputedStyle(b.parentElement??b),r=Number.parseFloat(e.paddingLeft)+Number.parseFloat(e.paddingRight),t=((s=b.parentElement)==null?void 0:s.clientWidth)??b.clientWidth,i=Math.max(0,t-r-Je),o=S.offsetWidth;if(o<=0||i<=0)return;const n=Math.floor(i/o*100/$)*$;X(n,{syncUrl:!1})},Q=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),P=(e,r)=>{const t=e.map(r);return{avgMs:Number((t.reduce((i,o)=>i+o,0)/t.length).toFixed(3)),minMs:Number(Math.min(...t).toFixed(3)),maxMs:Number(Math.max(...t).toFixed(3))}},De=()=>({text:a.text,practiceRepeatCount:a.practiceRepeatCount,practiceRowHeightMm:a.practiceRowHeightMm,topVisibility:M(a.top.visibility),practiceVisibility:M(a.practice.visibility)}),mt=async(e={})=>{const r=Math.max(1,Math.floor(e.iterations??10)),t=Math.max(0,Math.floor(e.warmupRuns??2)),i=[];for(let o=0;o<t;o+=1)p(),await Q();for(let o=0;o<r;o+=1){const n=performance.now();p();const s=performance.now();await Q();const w=performance.now();i.push({renderMs:s-n,paintMs:w-s,totalMs:w-n})}return{iterations:r,state:De(),render:P(i,o=>o.renderMs),paint:P(i,o=>o.paintMs),total:P(i,o=>o.totalMs),runs:i}},ft=(e,r,t)=>{const i=r.xHeight-r.baseline,o=t.xHeight-t.baseline,n=i!==0?o/i:1,s=t.baseline-r.baseline*n;return e*n+s},ee=(e,r,t)=>{let i=t==="ascender"?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY,o=null;for(const n of e){if(n.trim()===""){o=null;continue}const s=n.toLowerCase(),w=o===null?Oe:xe[o],f=Re(s,w);if(!f){o=null;continue}const k=f.guides,x=k==null?void 0:k[t];if(k&&typeof x=="number"){const I=ft(x,k,r);t==="ascender"?i=Math.min(i,I):i=Math.max(i,I)}o=Ne[s]??"low"}return Number.isFinite(i)?i:null},g=(e,r)=>{const t=e.path.guides,i=a.strokeWidth/2,o=Math.abs(t.baseline-t.xHeight);if(r==="baseline")return t.baseline+e.offsetY+i;if(r==="xHeight")return t.xHeight+e.offsetY-i;if(r==="ascender"){const w=ee(a.text,t,"ascender");return w!==null?w+e.offsetY-i:(t.ascender??t.xHeight-o*et)+e.offsetY-i}const n=ee(a.text,t,"descender");return n!==null?n+e.offsetY+i:(t.descender??t.baseline+o*tt)+e.offsetY+i},Ie=(e,r)=>`
  ${a.showBaselineGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--baseline"
      x1="0"
      y1="${g(e,"baseline")}"
      x2="${r}"
      y2="${g(e,"baseline")}"
    ></line>
  `:""}
  ${a.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${g(e,"descender")}"
      x2="${r}"
      y2="${g(e,"descender")}"
    ></line>
  `:""}
  ${a.showXHeightGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--midline"
      x1="0"
      y1="${g(e,"xHeight")}"
      x2="${r}"
      y2="${g(e,"xHeight")}"
    ></line>
  `:""}
  ${a.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${g(e,"ascender")}"
      x2="${r}"
      y2="${g(e,"ascender")}"
    ></line>
  `:""}
`,ye=(e,r,t)=>{const o=e.path.strokes.filter(s=>s.type!=="lift").map(s=>`<path class="worksheet-word__stroke" d="${Fe(s.curves)}"></path>`).join(""),n=We(e.path,r,t);return`
    ${o}
    ${n}
  `},gt=(e,r,t,i,o)=>{const n=ye(e,r,t);return`
    <svg
      class="${i}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${_e(o)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${a.strokeWidth}; --worksheet-guide-color: ${a.gridlineColor}; --worksheet-guide-stroke-width: ${a.gridlineStrokeWidth};"
    >
      ${Ie(e,e.width)}
      ${n}
    </svg>
  `},bt=e=>{const r=e.path.bounds.maxX-e.path.bounds.minX,t=e.path.bounds.minX;return r+t},kt=(e,r,t,i,o)=>{const n=bt(e),s=e.width+n*(i-1),w=ye(e,r,t),f=`practice-word-${o}`,k=Array.from({length:i},(x,I)=>{const Te=I*n;return`<use href="#${f}" x="${Te}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${s} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${_e(`${a.text} practice line, ${i} repeat${i===1?"":"s"}`)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${a.strokeWidth}; --worksheet-guide-color: ${a.gridlineColor}; --worksheet-guide-stroke-width: ${a.gridlineStrokeWidth};"
    >
      ${Ie(e,s)}
      <defs>
        <g id="${f}">
          ${w}
        </g>
      </defs>
      ${k}
    </svg>
  `},p=()=>{if(a={...a,text:Se(O.value),practiceRowHeightMm:Number(L.value),practiceRepeatCount:Number(E.value),strokeWidth:Number(D.value)},Z(),Ae(),a.text.length===0){S.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,y.textContent="";return}const e={joinSpacing:a.joinSpacing,keepInitialLeadIn:a.keepInitialLeadIn,keepFinalLeadOut:a.keepFinalLeadOut};let r;try{r=Me(a.text,e)}catch{S.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,y.textContent="This text could not be drawn.";return}const t=Ce(r.path),i=gt(r,t,a.top,"worksheet-word worksheet-word--top",`${a.text} with formation annotations`),o=pt(),n=Array.from({length:o},(w,f)=>kt(r,t,a.practice,a.practiceRepeatCount,f)).join(""),s=a.includeNameDate?`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
  `:"";S.style.setProperty("--practice-row-height",`${a.practiceRowHeightMm}mm`),S.classList.toggle("worksheet-page--without-meta",!a.includeNameDate),S.innerHTML=`
    ${s}
    <section class="worksheet-page__example" aria-label="Top example">
      ${i}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${n}
    </section>
  `,y.textContent=`${o} practice lines, ${a.practiceRepeatCount} repeat${a.practiceRepeatCount===1?"":"s"} per line`};O.addEventListener("input",p);ge.addEventListener("click",()=>{X(a.previewZoom-$,{manual:!0})});fe.addEventListener("click",()=>{X(a.previewZoom+$,{manual:!0})});L.addEventListener("input",p);E.addEventListener("input",p);D.addEventListener("input",p);be.addEventListener("click",()=>{p(),window.print()});U.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.globalSetting;if(r==="sidebearingGapAdjustment")a.joinSpacing={...a.joinSpacing,[r]:Number(e.value)};else if(r==="gridlineStrokeWidth")a.gridlineStrokeWidth=Number(e.value);else if(r==="keepInitialLeadIn")a.keepInitialLeadIn=e.checked;else if(r==="keepFinalLeadOut")a.keepFinalLeadOut=e.checked;else if(r==="includeNameDate")a.includeNameDate=e.checked;else if(r==="showBaselineGuide")a.showBaselineGuide=e.checked;else if(r==="showXHeightGuide")a.showXHeightGuide=e.checked;else if(r==="showAscenderGuide")a.showAscenderGuide=e.checked;else if(r==="showDescenderGuide")a.showDescenderGuide=e.checked;else if(r==="gridlineColor"){const t=V(e.value);if(!t)return;a.gridlineColor=t}p()})});j.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.scope,t=e.dataset.setting;if(!r||r!=="top"&&r!=="practice")return;const i=A(r);if(t==="directionalDashSpacing")i.directionalDashSpacing=Number(e.value);else if(t==="midpointDensity")i.midpointDensity=Number(e.value);else if(t==="turnRadius")i.turnRadius=Number(e.value);else if(t==="uTurnLength")i.uTurnLength=Number(e.value);else if(t==="arrowLength")i.arrowLength=Number(e.value);else if(t==="arrowHeadSize")i.arrowHeadSize=Number(e.value);else if(t==="arrowStrokeWidth")i.arrowStrokeWidth=Number(e.value);else if(t==="numberSize")i.numberSize=Number(e.value);else if(t==="numberPathOffset")i.numberPathOffset=Number(e.value);else if(t==="offsetArrowLanes")i.offsetArrowLanes=e.checked;else if(t==="alwaysOffsetArrowLanes")i.alwaysOffsetArrowLanes=e.checked;else if(t==="arrowColor"||t==="numberColor"||t==="strokeColor"){const o=V(e.value);if(!o)return;i[t]=o}p()})});ke.forEach(e=>{e.addEventListener("change",()=>{const r=e.dataset.scope,t=e.dataset.annotationKind;!r||r!=="top"&&r!=="practice"||!t||(A(r).visibility={...A(r).visibility,[t]:e.checked},p())})});nt.forEach(e=>{e.addEventListener("click",()=>{const r=e.dataset.topAnnotationPreset;if(r!=="outside"&&r!=="inside"&&r!=="inside-two-lanes")return;const t=me[r];a.top=pe(we(),t),F("top"),p()})});ht();p();Ee();new ResizeObserver(()=>{Ee()}).observe(b.parentElement??b);window.__worksheetProfiler={getState:De,profileRender:mt};
