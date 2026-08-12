import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as ne}from"./style-BFFVReQ1.js";import{b as Ge,g as We,C as Q}from"./joiner-CaP30BL7.js";import{a as Me}from"./annotations-DHyvYmdP.js";import{b as le}from"./formation-annotation-markup-DpjoQJbn.js";import{b as Fe,a as ce}from"./shared-BgZ7yO6P.js";import{s as ze}from"./worksheet-preview-pan-zoom-DPuInSr4.js";const de="abcdefghijklmnopqrstuvwxyz".split(""),U="j",He="pre-cursive",Ue=96,Be=320,ue=13,Ze=53,Ve=53,Ye=26,Xe=5.5,qe=ue*2,Ke=0,je="#3f454b",Je="#ffffff",Qe="#83b0dd",et="#d5dbe2",tt="#ffffff",rt="#d5dbe2",he=38,pe=7,we=180,me=54,ot=!0,fe=1,ge="#ffb35c",Se=100,ke=35,be=200,$=5,at=20,it=178,st=.63,nt=.66,lt=["letter","style","previewZoom","practiceSize","practiceRepeats","practiceRepeatSpacing","strokeWidth","showStepStartDot","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","gridlineStrokeWidth","gridlineColor","keepInitialLeadIn","keepFinalLeadOut","includeNameDate","topDirectionalDashSpacing","topMidpointDensity","topTurnRadius","topUTurnLength","topArrowLength","topArrowHeadSize","topArrowStrokeWidth","topNumberSize","topNumberPathOffset","topOffsetArrowLanes","topAlwaysOffsetArrowLanes","topStrokeColor","topPreviousStrokeColor","topRemainingStrokeColor","topNumberColor","topArrowColor","topDirectionalDash","topTurningPoint","topStartArrow","topDrawOrderNumber","topMidpointArrow","practiceDirectionalDashSpacing","practiceMidpointDensity","practiceTurnRadius","practiceUTurnLength","practiceArrowLength","practiceArrowHeadSize","practiceArrowStrokeWidth","practiceNumberSize","practiceNumberPathOffset","practiceOffsetArrowLanes","practiceAlwaysOffsetArrowLanes","practiceStrokeColor","practiceNumberColor","practiceArrowColor","practiceDirectionalDash","practiceTurningPoint","practiceStartArrow","practiceDrawOrderNumber","practiceMidpointArrow"],ct=["directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberPathOffset"],dt=["offsetArrowLanes","alwaysOffsetArrowLanes"],ut=["strokeColor","previousStrokeColor","remainingStrokeColor","numberColor","arrowColor"],ve={"directional-dash":"DirectionalDash","turning-point":"TurningPoint","start-arrow":"StartArrow","draw-order-number":"DrawOrderNumber","midpoint-arrow":"MidpointArrow"},ht={"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},pt={"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},wt={directionalDashSpacing:120,midpointDensity:140,arrowHeadSize:25,arrowStrokeWidth:8,offsetArrowLanes:!1,previousStrokeColor:"#0044b3",numberColor:"#ffffff"},mt={directionalDashSpacing:156,arrowHeadSize:44,arrowStrokeWidth:13.5,offsetArrowLanes:!1,strokeColor:"#b3bac2"},B=document.querySelector("#app");if(!B)throw new Error("Missing #app element for single letter worksheet generator.");document.body.classList.add("worksheet-body");B.classList.add("worksheet-root");const ft=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),ee=(e,r,t=r,a=r)=>({directionalDashSpacing:Ue,midpointDensity:Be,turnRadius:ue,uTurnLength:Ze,arrowLength:Ve,arrowHeadSize:Ye,arrowStrokeWidth:Xe,numberSize:qe,numberPathOffset:Ke,numberColor:je,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:ft(e),arrowColor:Je,strokeColor:r,previousStrokeColor:t,remainingStrokeColor:a}),Z=()=>({letter:U,style:He,previewZoom:Se,practiceRowHeightMm:he,practiceRepeatCount:pe,practiceRepeatSpacing:we,strokeWidth:me,showStepStartDot:ot,showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!1,showDescenderGuide:!1,gridlineStrokeWidth:fe,gridlineColor:ge,keepInitialLeadIn:!0,keepFinalLeadOut:!0,includeNameDate:!0,top:{...ee(ht,Qe,et,tt),...wt},practice:{...ee(pt,rt),...mt}}),d=Z();let o=Z(),G=!1;B.innerHTML=`
  <div class="worksheet-app">
    <aside class="worksheet-app__controls" aria-label="Worksheet controls">
      <div class="worksheet-app__controls-inner">
        <div class="worksheet-app__heading">
          <h1 class="worksheet-app__title">UK handwriting letter worksheet generator</h1>
        </div>

        ${gt()}
        ${St()}

        ${w({id:"practice-size-slider",label:"Practice size",value:he,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${w({id:"practice-repeat-slider",label:"Practice repeats",value:pe,min:1,max:14,step:1,valueId:"practice-repeat-value"})}

        ${w({id:"practice-repeat-spacing-slider",label:"Repeat spacing",value:we,min:0,max:360,step:10,valueId:"practice-repeat-spacing-value"})}

        ${w({id:"stroke-width-slider",label:"Stroke thickness",value:me,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        <fieldset class="worksheet-app__checks" aria-label="Worksheet options">
          ${v("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${v("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
          ${v("include-name-date","includeNameDate","Include name/date",!0)}
        </fieldset>

        ${bt()}

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
        <output class="worksheet-app__zoom-value" id="preview-zoom-value" aria-live="polite">${Se}%</output>
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
          <section class="worksheet-page worksheet-page--single-letter" id="worksheet-page" aria-label="Printable worksheet"></section>
        </div>
      </div>
    </main>
  </div>
`;const W=document.querySelector("#worksheet-letter-select"),M=document.querySelector("#worksheet-style-select"),_e=document.querySelector("#preview-zoom-in-button"),$e=document.querySelector("#preview-zoom-out-button"),y=document.querySelector("#practice-size-slider"),P=document.querySelector("#practice-repeat-slider"),I=document.querySelector("#practice-repeat-spacing-slider"),O=document.querySelector("#stroke-width-slider"),Le=document.querySelector("#print-worksheet-button"),T=document.querySelector("#worksheet-preview-viewport"),V=document.querySelector("#worksheet-page-frame"),_=document.querySelector("#worksheet-page"),H=document.querySelector("#worksheet-status");if(!W||!M||!_e||!$e||!y||!P||!I||!O||!Le||!T||!V||!_||!H)throw new Error("Missing elements for single letter worksheet generator.");const Y=Array.from(document.querySelectorAll("[data-global-setting]")),X=Array.from(document.querySelectorAll("[data-scope][data-setting]")),De=Array.from(document.querySelectorAll("[data-scope][data-annotation-kind]"));function gt(){return`
    <label class="worksheet-app__field" for="worksheet-letter-select">
      <span>Letter</span>
      <select class="worksheet-app__select" id="worksheet-letter-select">
        ${de.map(r=>`<option value="${r}" ${r===U?"selected":""}>${r}</option>`).join("")}
      </select>
    </label>
  `}function St(){return`
    <label class="worksheet-app__field" for="worksheet-style-select">
      <span>Style</span>
      <select class="worksheet-app__select" id="worksheet-style-select">
        <option value="pre-cursive" selected>Pre-cursive</option>
        <option value="print">Print</option>
      </select>
    </label>
  `}function w({id:e,label:r,value:t,min:a,max:i,step:s,valueId:n=`${e}-value`,attrs:l=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${r}
        <strong id="${n}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${a}"
        max="${i}"
        step="${s}"
        value="${t}"
        ${l}
      />
    </label>
  `}function kt(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${te("top","Top formation annotations",o.top)}
        ${te("practice","Practice annotations",o.practice)}
      </div>
    </details>
  `}function bt(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${w({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:fe,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${vt("gridline-color-picker","gridlineColor","Gridline colour",ge)}
        <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
          ${v("show-baseline-guide","showBaselineGuide","Baseline",!0)}
          ${v("show-descender-guide","showDescenderGuide","Descender",!1)}
          ${v("show-x-height-guide","showXHeightGuide","X-height",!0)}
          ${v("show-ascender-guide","showAscenderGuide","Ascender",!1)}
        </fieldset>
      </div>
    </details>
  `}function v(e,r,t,a){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${r}"
        ${a?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}function vt(e,r,t,a){return`
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
  `}function te(e,r,t){return`
    <details class="worksheet-app__details">
      <summary>${r}</summary>
      <div class="worksheet-app__details-body">
        ${w({id:`${e}-directional-dash-spacing-slider`,label:"Directional dash spacing",value:t.directionalDashSpacing,min:80,max:220,step:4,valueId:`${e}-directional-dash-spacing-value`,attrs:`data-scope="${e}" data-setting="directionalDashSpacing"`})}
        ${w({id:`${e}-midpoint-density-slider`,label:"Midpoint density",value:t.midpointDensity,min:120,max:600,step:20,valueId:`${e}-midpoint-density-value`,attrs:`data-scope="${e}" data-setting="midpointDensity"`})}
        ${w({id:`${e}-turn-radius-slider`,label:"Turn radius",value:t.turnRadius,min:0,max:48,step:1,valueId:`${e}-turn-radius-value`,attrs:`data-scope="${e}" data-setting="turnRadius"`})}
        ${w({id:`${e}-u-turn-length-slider`,label:"U-turn length",value:t.uTurnLength,min:0,max:300,step:1,valueId:`${e}-u-turn-length-value`,attrs:`data-scope="${e}" data-setting="uTurnLength"`})}
        ${w({id:`${e}-arrow-length-slider`,label:"Other arrow length",value:t.arrowLength,min:0,max:300,step:1,valueId:`${e}-arrow-length-value`,attrs:`data-scope="${e}" data-setting="arrowLength"`})}
        ${w({id:`${e}-arrow-head-size-slider`,label:"Arrow head size",value:t.arrowHeadSize,min:0,max:64,step:1,valueId:`${e}-arrow-head-size-value`,attrs:`data-scope="${e}" data-setting="arrowHeadSize"`})}
        ${w({id:`${e}-arrow-stroke-width-slider`,label:"Arrow stroke width",value:t.arrowStrokeWidth,min:1,max:14,step:.5,valueId:`${e}-arrow-stroke-width-value`,attrs:`data-scope="${e}" data-setting="arrowStrokeWidth"`})}
        ${w({id:`${e}-number-size-slider`,label:"Number size",value:t.numberSize,min:8,max:72,step:1,valueId:`${e}-number-size-value`,attrs:`data-scope="${e}" data-setting="numberSize"`})}
        ${w({id:`${e}-number-offset-slider`,label:"Number offset",value:t.numberPathOffset,min:-80,max:80,step:1,valueId:`${e}-number-offset-value`,attrs:`data-scope="${e}" data-setting="numberPathOffset"`})}
        <fieldset class="worksheet-app__checks" aria-label="${r}">
          ${R(e,"directional-dash","Directional dash",t.visibility["directional-dash"])}
          ${R(e,"turning-point","Turns",t.visibility["turning-point"])}
          ${R(e,"start-arrow","Starts",t.visibility["start-arrow"])}
          ${e==="top"?v("show-step-start-dot","showStepStartDot","Step start dot",o.showStepStartDot):""}
          ${R(e,"draw-order-number","Numbers",t.visibility["draw-order-number"])}
          ${R(e,"midpoint-arrow","Midpoints",t.visibility["midpoint-arrow"])}
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
        ${e==="top"?`
          ${D(e,"previousStrokeColor","Previous strokes colour",t.previousStrokeColor)}
          ${D(e,"strokeColor","Active stroke colour",t.strokeColor)}
          ${D(e,"remainingStrokeColor","Remaining strokes colour",t.remainingStrokeColor)}
        `:D(e,"strokeColor","Letter stroke colour",t.strokeColor)}
        ${D(e,"numberColor","Number colour",t.numberColor)}
        ${D(e,"arrowColor","Arrow colour",t.arrowColor)}
      </div>
    </details>
  `}function D(e,r,t,a){return`
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
  `}function R(e,r,t,a){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${r}"
        ${a?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}const Ae=e=>{const[r=""]=e.trim().toLowerCase();return de.includes(r)?r:U},Ce=e=>e==="pre-cursive"||e==="print"?e:null,Ee=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),q=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,Re=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,r=""]=e.step.split(".");return r.length},Te=(e,r)=>{const t=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),a=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),i=e.step===""||e.step==="any"?Number.NaN:Number(e.step),s=Number.isFinite(t)?t:0;let n=r;return Number.isFinite(t)&&(n=Math.max(t,n)),Number.isFinite(a)&&(n=Math.min(a,n)),Number.isFinite(i)&&i>0&&(n=s+Math.round((n-s)/i)*i),Number.isFinite(t)&&(n=Math.max(t,n)),Number.isFinite(a)&&(n=Math.min(a,n)),Number(n.toFixed(Re(e)))},K=e=>{const r=Math.min(be,Math.max(ke,e));return Math.round(r/$)*$},m=(e,r)=>{const t=Te(e,r);return e.value=t.toFixed(Re(e)),t},k=(e,r)=>{const t=e.get(r);if(t===null)return null;const a=t.trim().toLowerCase();return["1","true","yes","on"].includes(a)?!0:["0","false","no","off"].includes(a)?!1:null},f=(e,r,t)=>{const a=e.get(r);if(a===null)return null;const i=Number(a);return Number.isFinite(i)?Te(t,i):null},_t=e=>{const r=e.get("previewZoom");if(r===null)return null;const t=Number(r);return Number.isFinite(t)?K(t):null},C=(e,r)=>q(e.get(r)??""),x=(e,r)=>`${e}${r.charAt(0).toUpperCase()}${r.slice(1)}`,E=e=>o[e],re=e=>{const r=E(e);X.forEach(t=>{if(t.dataset.scope!==e)return;const a=t.dataset.setting;a==="directionalDashSpacing"?r.directionalDashSpacing=m(t,r.directionalDashSpacing):a==="midpointDensity"?r.midpointDensity=m(t,r.midpointDensity):a==="turnRadius"?r.turnRadius=m(t,r.turnRadius):a==="uTurnLength"?r.uTurnLength=m(t,r.uTurnLength):a==="arrowLength"?r.arrowLength=m(t,r.arrowLength):a==="arrowHeadSize"?r.arrowHeadSize=m(t,r.arrowHeadSize):a==="arrowStrokeWidth"?r.arrowStrokeWidth=m(t,r.arrowStrokeWidth):a==="numberSize"?r.numberSize=m(t,r.numberSize):a==="numberPathOffset"?r.numberPathOffset=m(t,r.numberPathOffset):a==="offsetArrowLanes"?t.checked=r.offsetArrowLanes:a==="alwaysOffsetArrowLanes"?t.checked=r.alwaysOffsetArrowLanes:a==="arrowColor"?t.value=r.arrowColor:a==="numberColor"?t.value=r.numberColor:a==="strokeColor"?t.value=r.strokeColor:a==="previousStrokeColor"?t.value=r.previousStrokeColor:a==="remainingStrokeColor"&&(t.value=r.remainingStrokeColor)}),De.forEach(t=>{if(t.dataset.scope!==e)return;const a=t.dataset.annotationKind;a&&(t.checked=r.visibility[a])})},$t=()=>{W.value=o.letter,M.value=o.style,o.previewZoom=K(o.previewZoom),o.practiceRowHeightMm=m(y,o.practiceRowHeightMm),o.practiceRepeatCount=m(P,o.practiceRepeatCount),o.practiceRepeatSpacing=m(I,o.practiceRepeatSpacing),o.strokeWidth=m(O,o.strokeWidth),Y.forEach(e=>{const r=e.dataset.globalSetting;r==="gridlineStrokeWidth"?o.gridlineStrokeWidth=m(e,o.gridlineStrokeWidth):r==="keepInitialLeadIn"?e.checked=o.keepInitialLeadIn:r==="keepFinalLeadOut"?e.checked=o.keepFinalLeadOut:r==="includeNameDate"?e.checked=o.includeNameDate:r==="showStepStartDot"?e.checked=o.showStepStartDot:r==="showBaselineGuide"?e.checked=o.showBaselineGuide:r==="showXHeightGuide"?e.checked=o.showXHeightGuide:r==="showAscenderGuide"?e.checked=o.showAscenderGuide:r==="showDescenderGuide"?e.checked=o.showDescenderGuide:r==="gridlineColor"&&(e.value=o.gridlineColor)}),re("top"),re("practice"),Pe(),j()},oe=(e,r,t,a)=>{ct.forEach(i=>{t[i]!==a[i]&&e.searchParams.set(x(r,i),String(t[i]))}),dt.forEach(i=>{t[i]!==a[i]&&e.searchParams.set(x(r,i),t[i]?"1":"0")}),ut.forEach(i=>{t[i]!==a[i]&&e.searchParams.set(x(r,i),t[i])}),Object.entries(ve).forEach(([i,s])=>{t.visibility[i]!==a.visibility[i]&&e.searchParams.set(`${r}${s}`,t.visibility[i]?"1":"0")})},ye=()=>{const e=new URL(window.location.href);lt.forEach(a=>{e.searchParams.delete(a)}),o.letter!==d.letter&&e.searchParams.set("letter",o.letter),o.style!==d.style&&e.searchParams.set("style",o.style),o.practiceRowHeightMm!==d.practiceRowHeightMm&&e.searchParams.set("practiceSize",String(o.practiceRowHeightMm)),o.practiceRepeatCount!==d.practiceRepeatCount&&e.searchParams.set("practiceRepeats",String(o.practiceRepeatCount)),o.practiceRepeatSpacing!==d.practiceRepeatSpacing&&e.searchParams.set("practiceRepeatSpacing",String(o.practiceRepeatSpacing)),o.strokeWidth!==d.strokeWidth&&e.searchParams.set("strokeWidth",String(o.strokeWidth)),o.showStepStartDot!==d.showStepStartDot&&e.searchParams.set("showStepStartDot",o.showStepStartDot?"1":"0"),o.showBaselineGuide!==d.showBaselineGuide&&e.searchParams.set("showBaselineGuide",o.showBaselineGuide?"1":"0"),o.showXHeightGuide!==d.showXHeightGuide&&e.searchParams.set("showXHeightGuide",o.showXHeightGuide?"1":"0"),o.showAscenderGuide!==d.showAscenderGuide&&e.searchParams.set("showAscenderGuide",o.showAscenderGuide?"1":"0"),o.showDescenderGuide!==d.showDescenderGuide&&e.searchParams.set("showDescenderGuide",o.showDescenderGuide?"1":"0"),o.gridlineStrokeWidth!==d.gridlineStrokeWidth&&e.searchParams.set("gridlineStrokeWidth",String(o.gridlineStrokeWidth)),o.gridlineColor!==d.gridlineColor&&e.searchParams.set("gridlineColor",o.gridlineColor),o.keepInitialLeadIn!==d.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",o.keepInitialLeadIn?"1":"0"),o.keepFinalLeadOut!==d.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",o.keepFinalLeadOut?"1":"0"),o.includeNameDate!==d.includeNameDate&&e.searchParams.set("includeNameDate",o.includeNameDate?"1":"0"),oe(e,"top",o.top,d.top),oe(e,"practice",o.practice,d.practice);const r=`${e.pathname}${e.search}${e.hash}`,t=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==t&&window.history.replaceState(null,"",r)},ae=(e,r)=>{const t=E(r);X.forEach(a=>{if(a.dataset.scope!==r)return;const i=a.dataset.setting;if(!i)return;const s=x(r,i);i==="directionalDashSpacing"?t.directionalDashSpacing=f(e,s,a)??t.directionalDashSpacing:i==="midpointDensity"?t.midpointDensity=f(e,s,a)??t.midpointDensity:i==="turnRadius"?t.turnRadius=f(e,s,a)??t.turnRadius:i==="uTurnLength"?t.uTurnLength=f(e,s,a)??t.uTurnLength:i==="arrowLength"?t.arrowLength=f(e,s,a)??t.arrowLength:i==="arrowHeadSize"?t.arrowHeadSize=f(e,s,a)??t.arrowHeadSize:i==="arrowStrokeWidth"?t.arrowStrokeWidth=f(e,s,a)??t.arrowStrokeWidth:i==="numberSize"?t.numberSize=f(e,s,a)??t.numberSize:i==="numberPathOffset"?t.numberPathOffset=f(e,s,a)??t.numberPathOffset:i==="offsetArrowLanes"?t.offsetArrowLanes=k(e,s)??t.offsetArrowLanes:i==="alwaysOffsetArrowLanes"?t.alwaysOffsetArrowLanes=k(e,s)??t.alwaysOffsetArrowLanes:i==="arrowColor"?t.arrowColor=C(e,s)??t.arrowColor:i==="numberColor"?t.numberColor=C(e,s)??t.numberColor:i==="strokeColor"?t.strokeColor=C(e,s)??t.strokeColor:i==="previousStrokeColor"?t.previousStrokeColor=C(e,s)??t.previousStrokeColor:i==="remainingStrokeColor"&&(t.remainingStrokeColor=C(e,s)??t.remainingStrokeColor)}),Object.entries(ve).forEach(([a,i])=>{t.visibility={...t.visibility,[a]:k(e,`${r}${i}`)??t.visibility[a]}})},Lt=()=>{const e=new URLSearchParams(window.location.search);o=Z();const r=e.get("letter");r!==null&&(o.letter=Ae(r));const t=e.get("style");t!==null&&(o.style=Ce(t)??o.style);const a=_t(e);a!==null?(o.previewZoom=a,G=!0):G=!1,o.practiceRowHeightMm=f(e,"practiceSize",y)??o.practiceRowHeightMm,o.practiceRepeatCount=f(e,"practiceRepeats",P)??o.practiceRepeatCount,o.practiceRepeatSpacing=f(e,"practiceRepeatSpacing",I)??o.practiceRepeatSpacing,o.strokeWidth=f(e,"strokeWidth",O)??o.strokeWidth,Y.forEach(i=>{const s=i.dataset.globalSetting;s==="gridlineStrokeWidth"?o.gridlineStrokeWidth=f(e,s,i)??o.gridlineStrokeWidth:s==="keepInitialLeadIn"?o.keepInitialLeadIn=k(e,s)??o.keepInitialLeadIn:s==="keepFinalLeadOut"?o.keepFinalLeadOut=k(e,s)??o.keepFinalLeadOut:s==="includeNameDate"?o.includeNameDate=k(e,s)??o.includeNameDate:s==="showStepStartDot"?o.showStepStartDot=k(e,s)??o.showStepStartDot:s==="showBaselineGuide"?o.showBaselineGuide=k(e,s)??o.showBaselineGuide:s==="showXHeightGuide"?o.showXHeightGuide=k(e,s)??o.showXHeightGuide:s==="showAscenderGuide"?o.showAscenderGuide=k(e,s)??o.showAscenderGuide:s==="showDescenderGuide"?o.showDescenderGuide=k(e,s)??o.showDescenderGuide:s==="gridlineColor"&&(o.gridlineColor=C(e,s)??o.gridlineColor)}),ae(e,"top"),ae(e,"practice"),$t()},Dt=()=>Math.max(1,Math.floor(it/o.practiceRowHeightMm)),p=(e,r)=>{const t=document.querySelector(`#${e}`);t&&(t.textContent=r)},j=()=>{p("preview-zoom-value",`${o.previewZoom}%`),p("practice-size-value",`${o.practiceRowHeightMm} mm`),p("practice-repeat-value",`${o.practiceRepeatCount}`),p("practice-repeat-spacing-value",`${o.practiceRepeatSpacing}px`),p("stroke-width-value",`${o.strokeWidth}px`),p("gridline-stroke-width-value",`${o.gridlineStrokeWidth.toFixed(1)}px`),["top","practice"].forEach(e=>{const r=E(e);p(`${e}-directional-dash-spacing-value`,`${r.directionalDashSpacing}px`),p(`${e}-midpoint-density-value`,`1 per ${r.midpointDensity}px`),p(`${e}-turn-radius-value`,`${r.turnRadius}px`),p(`${e}-u-turn-length-value`,`${r.uTurnLength}px`),p(`${e}-arrow-length-value`,`${r.arrowLength}px`),p(`${e}-arrow-head-size-value`,`${r.arrowHeadSize}px`),p(`${e}-arrow-stroke-width-value`,`${r.arrowStrokeWidth.toFixed(1)}px`),p(`${e}-number-size-value`,`${r.numberSize}px`),p(`${e}-number-offset-value`,`${r.numberPathOffset}px`)})},Pe=()=>{V.style.setProperty("--worksheet-preview-scale",`${o.previewZoom/100}`)},Ie=(e,r={})=>{o.previewZoom=K(e),r.manual&&(G=!0),Pe(),j(),(r.syncUrl??!0)&&ye()},Oe=()=>{if(G)return;const e=window.getComputedStyle(T),r=Number.parseFloat(e.paddingLeft)+Number.parseFloat(e.paddingRight),t=T.clientWidth,a=Math.max(0,t-r-at),i=_.offsetWidth;if(i<=0||a<=0)return;const s=Math.floor(a/i*100/$)*$;Ie(s,{syncUrl:!1})},At=(e,r,t)=>{const a=r.xHeight-r.baseline,i=t.xHeight-t.baseline,s=a!==0?i/a:1,n=t.baseline-r.baseline*s;return e*s+n},Ct=()=>o.style==="print"?Ge(o.letter):We(o.letter),ie=(e,r)=>{const t=Ct(),a=t==null?void 0:t.guides,i=a==null?void 0:a[r];return!a||typeof i!="number"?null:At(i,a,e)},S=(e,r)=>{const t=e.path.guides,a=o.strokeWidth/2,i=Math.abs(t.baseline-t.xHeight);if(r==="baseline")return t.baseline+e.offsetY+a;if(r==="xHeight")return t.xHeight+e.offsetY-a;if(r==="ascender"){const l=ie(t,"ascender");return l!==null?l+e.offsetY-a:(t.ascender??t.xHeight-i*st)+e.offsetY-a}const s=ie(t,"descender");return s!==null?s+e.offsetY+a:(t.descender??t.baseline+i*nt)+e.offsetY+a},Ne=(e,r)=>`
  ${o.showBaselineGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--baseline"
      x1="0"
      y1="${S(e,"baseline")}"
      x2="${r}"
      y2="${S(e,"baseline")}"
    ></line>
  `:""}
  ${o.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${S(e,"descender")}"
      x2="${r}"
      y2="${S(e,"descender")}"
    ></line>
  `:""}
  ${o.showXHeightGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--midline"
      x1="0"
      y1="${S(e,"xHeight")}"
      x2="${r}"
      y2="${S(e,"xHeight")}"
    ></line>
  `:""}
  ${o.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${S(e,"ascender")}"
      x2="${r}"
      y2="${S(e,"ascender")}"
    ></line>
  `:""}
`,A=(e,r,t)=>({x:e.x+(r.x-e.x)*t,y:e.y+(r.y-e.y)*t}),se=(e,r)=>{const t=A(e.p0,e.p1,r),a=A(e.p1,e.p2,r),i=A(e.p2,e.p3,r),s=A(t,a,r),n=A(a,i,r),l=A(s,n,r);return[new Q(e.p0,t,s,l),new Q(l,n,i,e.p3)]},Et=(e,r,t)=>{const a=e.length(),i=Math.max(0,Math.min(r,a)),s=Math.max(i,Math.min(t,a));if(s-i<=.001)return null;const n=e.getTAtLength(i),l=e.getTAtLength(s),[,c]=se(e,n),g=n>=1?1:(l-n)/(1-n);return se(c,g)[0]},Rt=(e,r,t,a)=>{const i=[],s=[];let n=0;return e.forEach((l,c)=>{const g=l.length(),h=n,u=h+g;n=u;const L=Math.max(t,h),N=Math.min(a,u);if(N-L<=.001)return;const J=Et(l,L-h,N-h);J&&(i.push(J),s.push(r==null?void 0:r[c]))}),{curves:i,curveSegments:s}},F=(e,r,t)=>{if(t-r<=.001)return{...e,strokes:[]};const a=[];let i=0;return e.strokes.forEach(s=>{if(s.type==="lift")return;const n=s.curves.reduce((L,N)=>L+N.length(),0),l=i,c=l+n;i=c;const g=Math.max(r,l),h=Math.min(t,c);if(h-g<=.001)return;const u=Rt(s.curves,s.curveSegments,g-l,h-l);u.curves.length!==0&&a.push({...s,curves:u.curves,curveSegments:u.curveSegments})}),{...e,strokes:a}},Tt=e=>{const r=Me(e),t=r.sections.map(n=>n.endDistance).filter(n=>Number.isFinite(n)&&n>0),a=[];let i=0;e.strokes.forEach(n=>{i+=n.totalLength,i>0&&a.push(i)});const s=[...t,...a].map(n=>Number(n.toFixed(3))).filter((n,l,c)=>c.indexOf(n)===l).sort((n,l)=>n-l);return s.length>0?s:[r.totalLength]},yt=e=>e.strokes.reduce((r,t)=>r+t.totalLength,0),Pt=e=>{for(const r of e.strokes){const t=r.samples[0];if(t)return{x:t.x,y:t.y}}return null},It=(e,r,t)=>{const i=e.strokes.filter(n=>n.type!=="lift").map(n=>`<path class="worksheet-word__stroke" d="${ce(n.curves)}"></path>`).join(""),s=le(e,r,t);return`
    ${i}
    ${s}
  `},z=(e,r,t)=>e.strokes.filter(i=>i.type!=="lift").map(i=>`<path class="worksheet-word__stroke worksheet-word__stroke--${t}" d="${ce(i.curves)}" style="stroke: ${r};"></path>`).join(""),Ot=(e,r,t,a,i)=>{const s=F(e,0,r),n=F(e,r,t),l=F(e,t,a),c=ne(n),g=o.showStepStartDot?Pt(c):null,h=Number((o.strokeWidth*.33).toFixed(2)),u=le(n,c,i);return`
    ${z(l,i.remainingStrokeColor,"remaining")}
    ${z(s,i.previousStrokeColor,"previous")}
    ${z(n,i.strokeColor,"active")}
    ${g&&h>0?`<circle class="worksheet-word__step-start-dot" cx="${g.x}" cy="${g.y}" r="${h}" fill="${i.arrowColor}"></circle>`:""}
    ${u}
  `},Nt=(e,r,t,a,i,s)=>{const n=xt(e),l=Ot(e.path,r,t,a,o.top);return`
    <figure class="worksheet-page__formation-step">
      <figcaption>Step ${i+1}</figcaption>
      <svg
        class="worksheet-word worksheet-word--top worksheet-word--step"
        viewBox="0 ${n.y} ${e.width} ${n.height}"
        preserveAspectRatio="xMidYMin meet"
        role="img"
        aria-label="${Ee(`${o.letter} formation step ${i+1} of ${s}`)}"
        style="--formation-arrow-color: ${o.top.arrowColor}; --formation-arrow-stroke-width: ${o.top.arrowStrokeWidth}; --worksheet-word-stroke: ${o.top.strokeColor}; --worksheet-word-stroke-width: ${o.strokeWidth}; --worksheet-guide-color: ${o.gridlineColor}; --worksheet-guide-stroke-width: ${o.gridlineStrokeWidth};"
      >
        ${Ne(e,e.width)}
        ${l}
      </svg>
    </figure>
  `},xt=e=>{const r=Math.max(o.strokeWidth,o.top.turnRadius+o.top.arrowHeadSize+12,o.top.numberSize+Math.abs(o.top.numberPathOffset)+12),t=Math.max(o.strokeWidth/2+4,o.top.arrowHeadSize*.25),a=[o.showBaselineGuide?S(e,"baseline"):null,o.showDescenderGuide?S(e,"descender"):null,o.showXHeightGuide?S(e,"xHeight"):null,o.showAscenderGuide?S(e,"ascender"):null].filter(c=>c!==null),i=Math.min(e.path.bounds.minY,...a),s=Math.max(e.path.bounds.maxY,...a),n=Math.max(0,Math.floor(i-t)),l=Math.min(e.height,Math.ceil(s+r));return{y:n,height:Math.max(1,l-n)}},Gt=e=>e.path.bounds.maxX-e.path.bounds.minX+o.practiceRepeatSpacing,Wt=(e,r,t,a,i)=>{const s=Gt(e),n=e.width+s*(a-1),l=`practice-letter-${i}`,c=Array.from({length:a},(g,h)=>{const u=h*s;return`<use href="#${l}" x="${u}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${n} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Ee(`${o.letter} practice line, ${a} repeat${a===1?"":"s"}`)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${o.strokeWidth}; --worksheet-guide-color: ${o.gridlineColor}; --worksheet-guide-stroke-width: ${o.gridlineStrokeWidth};"
    >
      ${Ne(e,n)}
      <defs>
        <g id="${l}">
          ${r}
        </g>
      </defs>
      ${c}
    </svg>
  `},b=()=>{o={...o,letter:Ae(W.value),style:Ce(M.value)??o.style,practiceRowHeightMm:Number(y.value),practiceRepeatCount:Number(P.value),practiceRepeatSpacing:Number(I.value),strokeWidth:Number(O.value)},j(),ye();let e;try{e=Fe(o.letter,{style:o.style,keepInitialLeadIn:o.keepInitialLeadIn,keepFinalLeadOut:o.keepFinalLeadOut})}catch{_.innerHTML=`
      <div class="worksheet-page__empty">Choose a supported letter.</div>
    `,H.textContent="This letter could not be drawn.";return}const r=ne(e.path),t=Tt(r),a=yt(r),i=t.length,s=t.map((h,u)=>{const L=u===0?0:t[u-1]??0;return Nt(e,L,h,a,u,i)}).join(""),n=Dt(),l=It(e.path,r,o.practice),c=Array.from({length:n},(h,u)=>Wt(e,l,o.practice,o.practiceRepeatCount,u)).join(""),g=o.includeNameDate?`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
  `:"";_.style.setProperty("--practice-row-height",`${o.practiceRowHeightMm}mm`),_.style.setProperty("--formation-step-count",String(i)),_.classList.toggle("worksheet-page--without-meta",!o.includeNameDate),_.innerHTML=`
    ${g}
    <section class="worksheet-page__example worksheet-page__example--steps" aria-label="Formation steps">
      ${s}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${c}
    </section>
  `,H.textContent=`${i} formation step${i===1?"":"s"}, ${n} practice lines`},xe=ze({viewport:T,frame:V,getZoom:()=>o.previewZoom,setZoom:e=>Ie(e,{manual:!0}),minZoom:ke,maxZoom:be,zoomStep:$});W.addEventListener("change",b);M.addEventListener("change",b);$e.addEventListener("click",()=>{xe.zoomBy(-$)});_e.addEventListener("click",()=>{xe.zoomBy($)});y.addEventListener("input",b);P.addEventListener("input",b);I.addEventListener("input",b);O.addEventListener("input",b);Le.addEventListener("click",()=>{b(),window.print()});Y.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.globalSetting;if(r==="gridlineStrokeWidth")o.gridlineStrokeWidth=Number(e.value);else if(r==="keepInitialLeadIn")o.keepInitialLeadIn=e.checked;else if(r==="keepFinalLeadOut")o.keepFinalLeadOut=e.checked;else if(r==="includeNameDate")o.includeNameDate=e.checked;else if(r==="showStepStartDot")o.showStepStartDot=e.checked;else if(r==="showBaselineGuide")o.showBaselineGuide=e.checked;else if(r==="showXHeightGuide")o.showXHeightGuide=e.checked;else if(r==="showAscenderGuide")o.showAscenderGuide=e.checked;else if(r==="showDescenderGuide")o.showDescenderGuide=e.checked;else if(r==="gridlineColor"){const t=q(e.value);if(!t)return;o.gridlineColor=t}b()})});X.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.scope,t=e.dataset.setting;if(!r||r!=="top"&&r!=="practice")return;const a=E(r);if(t==="directionalDashSpacing")a.directionalDashSpacing=Number(e.value);else if(t==="midpointDensity")a.midpointDensity=Number(e.value);else if(t==="turnRadius")a.turnRadius=Number(e.value);else if(t==="uTurnLength")a.uTurnLength=Number(e.value);else if(t==="arrowLength")a.arrowLength=Number(e.value);else if(t==="arrowHeadSize")a.arrowHeadSize=Number(e.value);else if(t==="arrowStrokeWidth")a.arrowStrokeWidth=Number(e.value);else if(t==="numberSize")a.numberSize=Number(e.value);else if(t==="numberPathOffset")a.numberPathOffset=Number(e.value);else if(t==="offsetArrowLanes")a.offsetArrowLanes=e.checked;else if(t==="alwaysOffsetArrowLanes")a.alwaysOffsetArrowLanes=e.checked;else if(t==="arrowColor"||t==="numberColor"||t==="strokeColor"||t==="previousStrokeColor"||t==="remainingStrokeColor"){const i=q(e.value);if(!i)return;a[t]=i}b()})});De.forEach(e=>{e.addEventListener("change",()=>{const r=e.dataset.scope,t=e.dataset.annotationKind;!r||r!=="top"&&r!=="practice"||!t||(E(r).visibility={...E(r).visibility,[t]:e.checked},b())})});Lt();b();Oe();new ResizeObserver(()=>{Oe()}).observe(T);
