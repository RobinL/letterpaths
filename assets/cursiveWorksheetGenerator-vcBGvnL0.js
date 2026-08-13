import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as Me}from"./style-Ye0bKBwL.js";import{g as ze,d as Fe,c as He,a as Ue}from"./joiner-c-a6mS3a.js";import{a as je}from"./annotations-DHyvYmdP.js";import{s as Be,E as Ve,D as Ze,b as qe}from"./worksheet-preview-pan-zoom-BZpEPmqq.js";import{c as Xe,a as Ye}from"./shared-xqS9M3bi.js";const re="path, polygon, polyline, line, rect, circle, ellipse, text",Ke=1e4,Je=e=>Array.from(e.querySelectorAll("svg")).reduce((r,t)=>{const i=t.querySelectorAll(re).length,o=Array.from(t.querySelectorAll("defs")).reduce((l,m)=>l+m.querySelectorAll(re).length,0),n=t.querySelectorAll("use").length,s=o*Math.max(1,n);return r+Math.max(0,i-o)+s},0),Qe=(e,r=Ke)=>Je(e)>r,de="zephyr",ce=96,U=320,ue=13,et=53,tt=53,j=26,rt=5.6,it=ue*2,at=0,ot="#3f454b",nt="#ffffff",st="#83b0dd",lt="#d5dbe2",he=24,we=1,pe=54,me=1,fe="#ffb35c",q=100,ge=35,be=200,A=5,dt=20,ct=178,ut=.63,ht=.66,x=2,ie="http://www.w3.org/2000/svg",wt=`
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
    paint-order: stroke fill;
    stroke: #ffffff;
    stroke-linejoin: round;
    stroke-width: 8px;
  }
`,ke={sidebearingGapAdjustment:0},pt=["text","word","previewZoom","practiceSize","practiceRepeats","strokeWidth","sidebearingGapAdjustment","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","gridlineStrokeWidth","gridlineColor","keepInitialLeadIn","keepFinalLeadOut","includeNameDate","topDirectionalDashSpacing","topMidpointDensity","topTurnRadius","topUTurnLength","topArrowLength","topArrowHeadSize","topArrowStrokeWidth","topNumberSize","topNumberPathOffset","topOffsetArrowLanes","topAlwaysOffsetArrowLanes","topStrokeColor","topNumberColor","topArrowColor","topDirectionalDash","topTurningPoint","topStartArrow","topDrawOrderNumber","topMidpointArrow","practiceDirectionalDashSpacing","practiceMidpointDensity","practiceTurnRadius","practiceUTurnLength","practiceArrowLength","practiceArrowHeadSize","practiceArrowStrokeWidth","practiceNumberSize","practiceNumberPathOffset","practiceOffsetArrowLanes","practiceAlwaysOffsetArrowLanes","practiceStrokeColor","practiceNumberColor","practiceArrowColor","practiceDirectionalDash","practiceTurningPoint","practiceStartArrow","practiceDrawOrderNumber","practiceMidpointArrow"],mt=["directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberPathOffset"],ft=["offsetArrowLanes","alwaysOffsetArrowLanes"],gt=["strokeColor","numberColor","arrowColor"],Se={"directional-dash":"DirectionalDash","turning-point":"TurningPoint","start-arrow":"StartArrow","draw-order-number":"DrawOrderNumber","midpoint-arrow":"MidpointArrow"},X=document.querySelector("#app");if(!X)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");X.classList.add("worksheet-root");const B=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),ve=(e,r)=>({directionalDashSpacing:ce,midpointDensity:U,turnRadius:ue,uTurnLength:et,arrowLength:tt,arrowHeadSize:j,arrowStrokeWidth:rt,numberSize:it,numberPathOffset:at,numberColor:ot,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:B(e),arrowColor:nt,strokeColor:r}),_e=(e,r)=>({...e,...r,visibility:r.visibility?{...e.visibility,...r.visibility}:e.visibility}),Ae=()=>ve(Ze,st),$e={outside:{directionalDashSpacing:ce,midpointDensity:U,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:j,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!0,arrowColor:"#ff0000",visibility:{"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0}},inside:{directionalDashSpacing:152,midpointDensity:U,turnRadius:48,uTurnLength:52,arrowLength:149,arrowHeadSize:j,arrowStrokeWidth:5.5,numberSize:64,numberPathOffset:-77,offsetArrowLanes:!1,visibility:{"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!0,"midpoint-arrow":!1}},"inside-two-lanes":{directionalDashSpacing:124,midpointDensity:160,turnRadius:13,uTurnLength:58,arrowLength:90,arrowHeadSize:31,arrowStrokeWidth:6.5,numberSize:40,numberPathOffset:-55,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:{"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0}}},Y=()=>({text:de,previewZoom:q,practiceRowHeightMm:he,practiceRepeatCount:we,strokeWidth:pe,joinSpacing:{...ke},showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!1,showDescenderGuide:!1,gridlineStrokeWidth:me,gridlineColor:fe,keepInitialLeadIn:!0,keepFinalLeadOut:!0,includeNameDate:!0,top:_e(Ae(),$e.inside),practice:ve(Ve,lt)}),d=Y();let a=Y(),O=!1,ae=0;X.innerHTML=`
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
            value="${de}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${u({id:"practice-size-slider",label:"Practice size",value:he,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${u({id:"practice-repeat-slider",label:"Practice repeats",value:we,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${u({id:"sidebearing-gap-adjustment-slider",label:"Letter spacing",value:ke.sidebearingGapAdjustment,min:-120,max:120,step:5,valueId:"sidebearing-gap-adjustment-value",attrs:'data-global-setting="sidebearingGapAdjustment"'})}

        ${u({id:"stroke-width-slider",label:"Stroke thickness",value:pe,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        <fieldset class="worksheet-app__checks" aria-label="Lead strokes">
          ${_("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${_("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
          ${L("top","draw-order-number","Show numeric steps",a.top.visibility["draw-order-number"])}
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

        ${St()}

        ${kt()}

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
        <output class="worksheet-app__zoom-value" id="preview-zoom-value" aria-live="polite">${q}%</output>
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
          <section class="worksheet-page" id="worksheet-page" aria-label="Printable worksheet"></section>
        </div>
      </div>
    </main>
  </div>
`;const M=document.querySelector("#worksheet-text-input"),Le=document.querySelector("#preview-zoom-in-button"),ye=document.querySelector("#preview-zoom-out-button"),I=document.querySelector("#practice-size-slider"),T=document.querySelector("#practice-repeat-slider"),R=document.querySelector("#stroke-width-slider"),bt=Array.from(document.querySelectorAll("[data-top-annotation-preset]")),N=document.querySelector("#print-worksheet-button"),C=document.querySelector("#worksheet-preview-viewport"),z=document.querySelector("#worksheet-page-frame"),p=document.querySelector("#worksheet-page"),b=document.querySelector("#worksheet-status");if(!M||!Le||!ye||!I||!T||!R||!N||!C||!z||!p||!b)throw new Error("Missing elements for cursive worksheet generator.");const K=Array.from(document.querySelectorAll("[data-global-setting]")),J=Array.from(document.querySelectorAll("[data-scope][data-setting]")),Ee=Array.from(document.querySelectorAll("[data-scope][data-annotation-kind]"));function u({id:e,label:r,value:t,min:i,max:o,step:n,valueId:s=`${e}-value`,attrs:l=""}){return`
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
        ${l}
      />
    </label>
  `}function kt(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${oe("top","Top word annotations",a.top)}
        ${oe("practice","Practice annotations",a.practice)}
      </div>
    </details>
  `}function St(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${u({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:me,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${vt("gridline-color-picker","gridlineColor","Gridline colour",fe)}
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
  `}function vt(e,r,t,i){return`
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
  `}function oe(e,r,t){return`
    <details class="worksheet-app__details">
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
          ${e==="practice"?L(e,"draw-order-number","Numbers",t.visibility["draw-order-number"]):""}
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
        ${F(e,"strokeColor","Word stroke colour",t.strokeColor)}
        ${F(e,"numberColor","Number colour",t.numberColor)}
        ${F(e,"arrowColor","Arrow colour",t.arrowColor)}
      </div>
    </details>
  `}function F(e,r,t,i){return`
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
  `}function L(e,r,t,i){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${r}"
        ${i?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}const Ce=e=>e.trim().replace(/\s+/g," "),Ie=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),Q=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,Te=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,r=""]=e.step.split(".");return r.length},Re=(e,r)=>{const t=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),i=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),o=e.step===""||e.step==="any"?Number.NaN:Number(e.step),n=Number.isFinite(t)?t:0;let s=r;return Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(i)&&(s=Math.min(i,s)),Number.isFinite(o)&&o>0&&(s=n+Math.round((s-n)/o)*o),Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(i)&&(s=Math.min(i,s)),Number(s.toFixed(Te(e)))},ee=e=>{const r=Math.min(be,Math.max(ge,e));return Math.round(r/A)*A},h=(e,r)=>{const t=Re(e,r);return e.value=t.toFixed(Te(e)),t},g=(e,r)=>{const t=e.get(r);if(t===null)return null;const i=t.trim().toLowerCase();return["1","true","yes","on"].includes(i)?!0:["0","false","no","off"].includes(i)?!1:null},w=(e,r,t)=>{const i=e.get(r);if(i===null)return null;const o=Number(i);return Number.isFinite(o)?Re(t,o):null},_t=e=>{const r=e.get("previewZoom");if(r===null)return null;const t=Number(r);return Number.isFinite(t)?ee(t):null},D=(e,r)=>Q(e.get(r)??""),P=(e,r)=>`${e}${r.charAt(0).toUpperCase()}${r.slice(1)}`,V=e=>{const r=y(e);J.forEach(t=>{if(t.dataset.scope!==e)return;const i=t.dataset.setting;i==="directionalDashSpacing"?r.directionalDashSpacing=h(t,r.directionalDashSpacing):i==="midpointDensity"?r.midpointDensity=h(t,r.midpointDensity):i==="turnRadius"?r.turnRadius=h(t,r.turnRadius):i==="uTurnLength"?r.uTurnLength=h(t,r.uTurnLength):i==="arrowLength"?r.arrowLength=h(t,r.arrowLength):i==="arrowHeadSize"?r.arrowHeadSize=h(t,r.arrowHeadSize):i==="arrowStrokeWidth"?r.arrowStrokeWidth=h(t,r.arrowStrokeWidth):i==="numberSize"?r.numberSize=h(t,r.numberSize):i==="numberPathOffset"?r.numberPathOffset=h(t,r.numberPathOffset):i==="offsetArrowLanes"?t.checked=r.offsetArrowLanes:i==="alwaysOffsetArrowLanes"?t.checked=r.alwaysOffsetArrowLanes:i==="arrowColor"?t.value=r.arrowColor:i==="numberColor"?t.value=r.numberColor:i==="strokeColor"&&(t.value=r.strokeColor)}),Ee.forEach(t=>{if(t.dataset.scope!==e)return;const i=t.dataset.annotationKind;i&&(t.checked=r.visibility[i])})},At=()=>{M.value=a.text,a.previewZoom=ee(a.previewZoom),a.practiceRowHeightMm=h(I,a.practiceRowHeightMm),a.practiceRepeatCount=h(T,a.practiceRepeatCount),a.strokeWidth=h(R,a.strokeWidth),K.forEach(e=>{const r=e.dataset.globalSetting;r==="sidebearingGapAdjustment"?a.joinSpacing.sidebearingGapAdjustment=h(e,a.joinSpacing.sidebearingGapAdjustment):r==="gridlineStrokeWidth"?a.gridlineStrokeWidth=h(e,a.gridlineStrokeWidth):r==="keepInitialLeadIn"?e.checked=a.keepInitialLeadIn:r==="keepFinalLeadOut"?e.checked=a.keepFinalLeadOut:r==="includeNameDate"?e.checked=a.includeNameDate:r==="showBaselineGuide"?e.checked=a.showBaselineGuide:r==="showXHeightGuide"?e.checked=a.showXHeightGuide:r==="showAscenderGuide"?e.checked=a.showAscenderGuide:r==="showDescenderGuide"?e.checked=a.showDescenderGuide:r==="gridlineColor"&&(e.value=a.gridlineColor)}),V("top"),V("practice"),De(),te()},ne=(e,r,t,i)=>{mt.forEach(o=>{t[o]!==i[o]&&e.searchParams.set(P(r,o),String(t[o]))}),ft.forEach(o=>{t[o]!==i[o]&&e.searchParams.set(P(r,o),t[o]?"1":"0")}),gt.forEach(o=>{t[o]!==i[o]&&e.searchParams.set(P(r,o),t[o])}),Object.entries(Se).forEach(([o,n])=>{t.visibility[o]!==i.visibility[o]&&e.searchParams.set(`${r}${n}`,t.visibility[o]?"1":"0")})},xe=()=>{const e=new URL(window.location.href);pt.forEach(i=>{e.searchParams.delete(i)}),a.text!==d.text&&e.searchParams.set("text",a.text),a.practiceRowHeightMm!==d.practiceRowHeightMm&&e.searchParams.set("practiceSize",String(a.practiceRowHeightMm)),a.practiceRepeatCount!==d.practiceRepeatCount&&e.searchParams.set("practiceRepeats",String(a.practiceRepeatCount)),a.strokeWidth!==d.strokeWidth&&e.searchParams.set("strokeWidth",String(a.strokeWidth)),a.joinSpacing.sidebearingGapAdjustment!==d.joinSpacing.sidebearingGapAdjustment&&e.searchParams.set("sidebearingGapAdjustment",String(a.joinSpacing.sidebearingGapAdjustment)),a.showBaselineGuide!==d.showBaselineGuide&&e.searchParams.set("showBaselineGuide",a.showBaselineGuide?"1":"0"),a.showXHeightGuide!==d.showXHeightGuide&&e.searchParams.set("showXHeightGuide",a.showXHeightGuide?"1":"0"),a.showAscenderGuide!==d.showAscenderGuide&&e.searchParams.set("showAscenderGuide",a.showAscenderGuide?"1":"0"),a.showDescenderGuide!==d.showDescenderGuide&&e.searchParams.set("showDescenderGuide",a.showDescenderGuide?"1":"0"),a.gridlineStrokeWidth!==d.gridlineStrokeWidth&&e.searchParams.set("gridlineStrokeWidth",String(a.gridlineStrokeWidth)),a.gridlineColor!==d.gridlineColor&&e.searchParams.set("gridlineColor",a.gridlineColor),a.keepInitialLeadIn!==d.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",a.keepInitialLeadIn?"1":"0"),a.keepFinalLeadOut!==d.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",a.keepFinalLeadOut?"1":"0"),a.includeNameDate!==d.includeNameDate&&e.searchParams.set("includeNameDate",a.includeNameDate?"1":"0"),ne(e,"top",a.top,d.top),ne(e,"practice",a.practice,d.practice);const r=`${e.pathname}${e.search}${e.hash}`,t=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==t&&window.history.replaceState(null,"",r)},se=(e,r)=>{const t=y(r);J.forEach(i=>{if(i.dataset.scope!==r)return;const o=i.dataset.setting;if(!o)return;const n=P(r,o);o==="directionalDashSpacing"?t.directionalDashSpacing=w(e,n,i)??t.directionalDashSpacing:o==="midpointDensity"?t.midpointDensity=w(e,n,i)??t.midpointDensity:o==="turnRadius"?t.turnRadius=w(e,n,i)??t.turnRadius:o==="uTurnLength"?t.uTurnLength=w(e,n,i)??t.uTurnLength:o==="arrowLength"?t.arrowLength=w(e,n,i)??t.arrowLength:o==="arrowHeadSize"?t.arrowHeadSize=w(e,n,i)??t.arrowHeadSize:o==="arrowStrokeWidth"?t.arrowStrokeWidth=w(e,n,i)??t.arrowStrokeWidth:o==="numberSize"?t.numberSize=w(e,n,i)??t.numberSize:o==="numberPathOffset"?t.numberPathOffset=w(e,n,i)??t.numberPathOffset:o==="offsetArrowLanes"?t.offsetArrowLanes=g(e,n)??t.offsetArrowLanes:o==="alwaysOffsetArrowLanes"?t.alwaysOffsetArrowLanes=g(e,n)??t.alwaysOffsetArrowLanes:o==="arrowColor"?t.arrowColor=D(e,n)??t.arrowColor:o==="numberColor"?t.numberColor=D(e,n)??t.numberColor:o==="strokeColor"&&(t.strokeColor=D(e,n)??t.strokeColor)}),Object.entries(Se).forEach(([i,o])=>{t.visibility={...t.visibility,[i]:g(e,`${r}${o}`)??t.visibility[i]}})},$t=()=>{const e=new URLSearchParams(window.location.search);a=Y();const r=e.get("text")??e.get("word");r!==null&&(a.text=Ce(r));const t=_t(e);t!==null?(a.previewZoom=t,O=!0):O=!1,a.practiceRowHeightMm=w(e,"practiceSize",I)??a.practiceRowHeightMm,a.practiceRepeatCount=w(e,"practiceRepeats",T)??a.practiceRepeatCount,a.strokeWidth=w(e,"strokeWidth",R)??a.strokeWidth,K.forEach(i=>{const o=i.dataset.globalSetting;o==="sidebearingGapAdjustment"?a.joinSpacing.sidebearingGapAdjustment=w(e,o,i)??a.joinSpacing.sidebearingGapAdjustment:o==="gridlineStrokeWidth"?a.gridlineStrokeWidth=w(e,o,i)??a.gridlineStrokeWidth:o==="keepInitialLeadIn"?a.keepInitialLeadIn=g(e,o)??a.keepInitialLeadIn:o==="keepFinalLeadOut"?a.keepFinalLeadOut=g(e,o)??a.keepFinalLeadOut:o==="includeNameDate"?a.includeNameDate=g(e,o)??a.includeNameDate:o==="showBaselineGuide"?a.showBaselineGuide=g(e,o)??a.showBaselineGuide:o==="showXHeightGuide"?a.showXHeightGuide=g(e,o)??a.showXHeightGuide:o==="showAscenderGuide"?a.showAscenderGuide=g(e,o)??a.showAscenderGuide:o==="showDescenderGuide"?a.showDescenderGuide=g(e,o)??a.showDescenderGuide:o==="gridlineColor"&&(a.gridlineColor=D(e,o)??a.gridlineColor)}),se(e,"top"),se(e,"practice"),At()},y=e=>a[e],Lt=()=>Math.max(1,Math.floor(ct/a.practiceRowHeightMm)),c=(e,r)=>{const t=document.querySelector(`#${e}`);t&&(t.textContent=r)},te=()=>{c("preview-zoom-value",`${a.previewZoom}%`),c("practice-size-value",`${a.practiceRowHeightMm} mm`),c("practice-repeat-value",`${a.practiceRepeatCount}`),c("stroke-width-value",`${a.strokeWidth}px`),c("gridline-stroke-width-value",`${a.gridlineStrokeWidth.toFixed(1)}px`),c("sidebearing-gap-adjustment-value",`${a.joinSpacing.sidebearingGapAdjustment}`),["top","practice"].forEach(e=>{const r=y(e);c(`${e}-directional-dash-spacing-value`,`${r.directionalDashSpacing}px`),c(`${e}-midpoint-density-value`,`1 per ${r.midpointDensity}px`),c(`${e}-turn-radius-value`,`${r.turnRadius}px`),c(`${e}-u-turn-length-value`,`${r.uTurnLength}px`),c(`${e}-arrow-length-value`,`${r.arrowLength}px`),c(`${e}-arrow-head-size-value`,`${r.arrowHeadSize}px`),c(`${e}-arrow-stroke-width-value`,`${r.arrowStrokeWidth.toFixed(1)}px`),c(`${e}-number-size-value`,`${r.numberSize}px`),c(`${e}-number-offset-value`,`${r.numberPathOffset}px`)})},De=()=>{z.style.setProperty("--worksheet-preview-scale",`${a.previewZoom/100}`)},yt=()=>{const e=++ae;requestAnimationFrame(()=>{requestAnimationFrame(()=>{e===ae&&f()})})},G=(e,r={})=>{const t=a.previewZoom;a.previewZoom=ee(e),r.manual&&(O=!0),De(),te(),(r.syncUrl??!0)&&xe(),(r.refreshAfterScale??!0)&&a.previewZoom!==t&&yt()},Pe=()=>{if(O)return;const e=window.getComputedStyle(C),r=Number.parseFloat(e.paddingLeft)+Number.parseFloat(e.paddingRight),t=C.clientWidth,i=Math.max(0,t-r-dt),o=p.offsetWidth;if(o<=0||i<=0)return;const n=Math.floor(i/o*100/A)*A;G(n,{syncUrl:!1})},E=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),H=(e,r)=>{const t=e.map(r);return{avgMs:Number((t.reduce((i,o)=>i+o,0)/t.length).toFixed(3)),minMs:Number(Math.min(...t).toFixed(3)),maxMs:Number(Math.max(...t).toFixed(3))}},Oe=()=>({text:a.text,practiceRepeatCount:a.practiceRepeatCount,practiceRowHeightMm:a.practiceRowHeightMm,topVisibility:B(a.top.visibility),practiceVisibility:B(a.practice.visibility)}),Et=async(e={})=>{const r=Math.max(1,Math.floor(e.iterations??10)),t=Math.max(0,Math.floor(e.warmupRuns??2)),i=[];for(let o=0;o<t;o+=1)f(),await E();for(let o=0;o<r;o+=1){const n=performance.now();f();const s=performance.now();await E();const l=performance.now();i.push({renderMs:s-n,paintMs:l-s,totalMs:l-n})}return{iterations:r,state:Oe(),render:H(i,o=>o.renderMs),paint:H(i,o=>o.paintMs),total:H(i,o=>o.totalMs),runs:i}},Ct=async(e,r)=>{const t=a.previewZoom;t!==e&&(G(e,{syncUrl:!1,refreshAfterScale:!1}),await E());try{return await r()}finally{t!==e&&(G(t,{syncUrl:!1,refreshAfterScale:!1}),await E())}},It=(e,r,t)=>{const i=r.xHeight-r.baseline,o=t.xHeight-t.baseline,n=i!==0?o/i:1,s=t.baseline-r.baseline*n;return e*n+s},le=(e,r,t)=>{let i=t==="ascender"?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY,o=null;for(const n of e){if(n.trim()===""){o=null;continue}const s=n.toLowerCase(),l=o===null?Fe:He[o],m=ze(s,l);if(!m){o=null;continue}const k=m.guides,v=k==null?void 0:k[t];if(k&&typeof v=="number"){const $=It(v,k,r);t==="ascender"?i=Math.min(i,$):i=Math.max(i,$)}o=Ue[s]??"low"}return Number.isFinite(i)?i:null},S=(e,r)=>{const t=e.path.guides,i=a.strokeWidth/2,o=Math.abs(t.baseline-t.xHeight);if(r==="baseline")return t.baseline+e.offsetY+i;if(r==="xHeight")return t.xHeight+e.offsetY-i;if(r==="ascender"){const l=le(a.text,t,"ascender");return l!==null?l+e.offsetY-i:(t.ascender??t.xHeight-o*ut)+e.offsetY-i}const n=le(a.text,t,"descender");return n!==null?n+e.offsetY+i:(t.descender??t.baseline+o*ht)+e.offsetY+i},Ne=(e,r)=>`
  ${a.showBaselineGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--baseline"
      x1="0"
      y1="${S(e,"baseline")}"
      x2="${r}"
      y2="${S(e,"baseline")}"
    ></line>
  `:""}
  ${a.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${S(e,"descender")}"
      x2="${r}"
      y2="${S(e,"descender")}"
    ></line>
  `:""}
  ${a.showXHeightGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--midline"
      x1="0"
      y1="${S(e,"xHeight")}"
      x2="${r}"
      y2="${S(e,"xHeight")}"
    ></line>
  `:""}
  ${a.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${S(e,"ascender")}"
      x2="${r}"
      y2="${S(e,"ascender")}"
    ></line>
  `:""}
`,Ge=(e,r,t,i)=>{const n=e.path.strokes.filter(l=>l.type!=="lift").map(l=>`<path class="worksheet-word__stroke" d="${Ye(l.curves)}"></path>`).join(""),s=qe(e.path,r,t,i);return`
    ${n}
    ${s}
  `},Tt=(e,r,t,i,o,n)=>{const s=Ge(e,r,t,n);return`
    <svg
      class="${i}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Ie(o)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${a.strokeWidth}; --worksheet-guide-color: ${a.gridlineColor}; --worksheet-guide-stroke-width: ${a.gridlineStrokeWidth};"
    >
      ${Ne(e,e.width)}
      ${s}
    </svg>
  `},Rt=e=>{const r=e.path.bounds.maxX-e.path.bounds.minX,t=e.path.bounds.minX;return r+t},xt=(e,r,t,i,o)=>{const n=Rt(e),s=e.width+n*(i-1),l=`practice-word-${o}`,m=Array.from({length:i},(k,v)=>{const $=v*n;return`<use href="#${l}" x="${$}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${s} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Ie(`${a.text} practice line, ${i} repeat${i===1?"":"s"}`)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${a.strokeWidth}; --worksheet-guide-color: ${a.gridlineColor}; --worksheet-guide-stroke-width: ${a.gridlineStrokeWidth};"
    >
      ${Ne(e,s)}
      <defs>
        <g id="${l}">
          ${r}
        </g>
      </defs>
      ${m}
    </svg>
  `},f=()=>{if(a={...a,text:Ce(M.value),practiceRowHeightMm:Number(I.value),practiceRepeatCount:Number(T.value),strokeWidth:Number(R.value)},te(),xe(),a.text.length===0){p.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,b.textContent="";return}const e={joinSpacing:a.joinSpacing,keepInitialLeadIn:a.keepInitialLeadIn,keepFinalLeadOut:a.keepFinalLeadOut};let r;try{r=Xe(a.text,e)}catch{p.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,b.textContent="This text could not be drawn.";return}const t=Me(r.path),o=[a.top,a.practice].some(v=>Object.values(v.visibility).some(Boolean))?je(t).sections:void 0,n=Tt(r,t,a.top,"worksheet-word worksheet-word--top",`${a.text} with formation annotations`,o),s=Lt(),l=Ge(r,t,a.practice,o),m=Array.from({length:s},(v,$)=>xt(r,l,a.practice,a.practiceRepeatCount,$)).join(""),k=a.includeNameDate?`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
  `:"";p.style.setProperty("--practice-row-height",`${a.practiceRowHeightMm}mm`),p.classList.toggle("worksheet-page--without-meta",!a.includeNameDate),p.innerHTML=`
    ${k}
    <section class="worksheet-page__example" aria-label="Top example">
      ${n}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${m}
    </section>
  `,b.textContent=`${s} practice lines, ${a.practiceRepeatCount} repeat${a.practiceRepeatCount===1?"":"s"} per line`},Dt=e=>new Promise((r,t)=>{const i=new Image;i.onload=()=>r(i),i.onerror=()=>t(new Error("Could not render worksheet image.")),i.src=e}),W=(e,r)=>{const t=e.getBoundingClientRect();return{x:t.left-r.left,y:t.top-r.top,width:t.width,height:t.height}},Z=(e,r,t,i,o,n)=>{e.save(),e.beginPath(),e.strokeStyle=o,e.lineWidth=n,e.moveTo(r,i),e.lineTo(t,i),e.stroke(),e.restore()},Pt=(e,r)=>{e.save(),e.fillStyle="#23313d",e.font="700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textBaseline="alphabetic",p.querySelectorAll(".worksheet-page__meta-line span").forEach(t=>{var l;const i=W(t,r),o=((l=t.textContent)==null?void 0:l.trim())??"",n=i.y+i.height-3;e.fillText(o,i.x,n);const s=i.x+e.measureText(o).width+15;Z(e,s,i.x+i.width,i.y+i.height-1,"#cfd6dc",1.3)}),e.restore()},Ot=e=>{const r=e.cloneNode(!0);r.setAttribute("xmlns",ie);const t=document.createElementNS(ie,"style");return t.textContent=wt,r.insertBefore(t,r.firstChild),new XMLSerializer().serializeToString(r)},Nt=async(e,r,t)=>{const i=W(r,t),o=Ot(r),n=URL.createObjectURL(new Blob([o],{type:"image/svg+xml;charset=utf-8"}));try{const s=await Dt(n);e.drawImage(s,i.x,i.y,i.width,i.height)}finally{URL.revokeObjectURL(n)}},Gt=async()=>await Ct(q,async()=>{const e=p.getBoundingClientRect(),r=Math.ceil(e.width),t=Math.ceil(e.height),i=document.createElement("canvas");i.width=r*x,i.height=t*x;const o=i.getContext("2d");if(!o)throw new Error("Could not prepare worksheet image.");o.fillStyle="#ffffff",o.fillRect(0,0,i.width,i.height),o.scale(x,x),Pt(o,e);for(const s of p.querySelectorAll(".worksheet-word"))await Nt(o,s,e);const n=p.querySelector(".worksheet-page__example");if(n){const s=W(n,e);Z(o,s.x,s.x+s.width,s.y+s.height-1,"#d7dde2",1.3)}return p.querySelectorAll(".worksheet-word--practice").forEach(s=>{const l=W(s,e);Z(o,l.x,l.x+l.width,l.y+l.height-.6,"#d7dde2",1.1)}),await new Promise((s,l)=>{i.toBlob(m=>{m?s(m):l(new Error("Could not encode worksheet image."))},"image/png")})}),Wt=e=>new Promise((r,t)=>{e.addEventListener("load",()=>r(),{once:!0}),e.addEventListener("error",()=>t(new Error("Could not prepare the optimized worksheet for printing.")),{once:!0})}),Mt=async()=>{if(!Qe(p)){window.print();return}const e=b.textContent??"";N.disabled=!0,b.textContent="Preparing a printer-friendly worksheet…";let r=null,t=null;const i=()=>{document.body.classList.remove("worksheet-body--raster-print"),r==null||r.remove(),t&&URL.revokeObjectURL(t),N.disabled=!1,b.textContent=e};try{const o=await Gt();t=URL.createObjectURL(o),r=document.createElement("img"),r.className="worksheet-page__print-raster",r.alt="",r.setAttribute("aria-hidden","true");const n=Wt(r);r.src=t,z.append(r),await n,document.body.classList.add("worksheet-body--raster-print"),b.textContent="Printer-friendly worksheet ready.",await E(),await E(),window.print()}catch(o){console.error(o),b.textContent="Could not optimize this worksheet; opening the standard print view.",window.print()}finally{i()}},We=Be({viewport:C,frame:z,getZoom:()=>a.previewZoom,setZoom:e=>G(e,{manual:!0}),minZoom:ge,maxZoom:be,zoomStep:A});M.addEventListener("input",f);ye.addEventListener("click",()=>{We.zoomBy(-A)});Le.addEventListener("click",()=>{We.zoomBy(A)});I.addEventListener("input",f);T.addEventListener("input",f);R.addEventListener("input",f);N.addEventListener("click",()=>{Mt()});K.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.globalSetting;if(r==="sidebearingGapAdjustment")a.joinSpacing={...a.joinSpacing,[r]:Number(e.value)};else if(r==="gridlineStrokeWidth")a.gridlineStrokeWidth=Number(e.value);else if(r==="keepInitialLeadIn")a.keepInitialLeadIn=e.checked;else if(r==="keepFinalLeadOut")a.keepFinalLeadOut=e.checked;else if(r==="includeNameDate")a.includeNameDate=e.checked;else if(r==="showBaselineGuide")a.showBaselineGuide=e.checked;else if(r==="showXHeightGuide")a.showXHeightGuide=e.checked;else if(r==="showAscenderGuide")a.showAscenderGuide=e.checked;else if(r==="showDescenderGuide")a.showDescenderGuide=e.checked;else if(r==="gridlineColor"){const t=Q(e.value);if(!t)return;a.gridlineColor=t}f()})});J.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.scope,t=e.dataset.setting;if(!r||r!=="top"&&r!=="practice")return;const i=y(r);if(t==="directionalDashSpacing")i.directionalDashSpacing=Number(e.value);else if(t==="midpointDensity")i.midpointDensity=Number(e.value);else if(t==="turnRadius")i.turnRadius=Number(e.value);else if(t==="uTurnLength")i.uTurnLength=Number(e.value);else if(t==="arrowLength")i.arrowLength=Number(e.value);else if(t==="arrowHeadSize")i.arrowHeadSize=Number(e.value);else if(t==="arrowStrokeWidth")i.arrowStrokeWidth=Number(e.value);else if(t==="numberSize")i.numberSize=Number(e.value);else if(t==="numberPathOffset")i.numberPathOffset=Number(e.value);else if(t==="offsetArrowLanes")i.offsetArrowLanes=e.checked;else if(t==="alwaysOffsetArrowLanes")i.alwaysOffsetArrowLanes=e.checked;else if(t==="arrowColor"||t==="numberColor"||t==="strokeColor"){const o=Q(e.value);if(!o)return;i[t]=o}f()})});Ee.forEach(e=>{e.addEventListener("change",()=>{const r=e.dataset.scope,t=e.dataset.annotationKind;!r||r!=="top"&&r!=="practice"||!t||(y(r).visibility={...y(r).visibility,[t]:e.checked},f())})});bt.forEach(e=>{e.addEventListener("click",()=>{const r=e.dataset.topAnnotationPreset;if(r!=="outside"&&r!=="inside"&&r!=="inside-two-lanes")return;const t=$e[r];a.top=_e(Ae(),t),V("top"),f()})});$t();f();Pe();new ResizeObserver(()=>{Pe()}).observe(C);window.__worksheetProfiler={getState:Oe,profileRender:Et};
