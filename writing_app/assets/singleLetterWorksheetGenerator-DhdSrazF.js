import{l as Pe,c as de,a as he,m as Oe,g as Ie,C as ee}from"./shared-DTIWhr9c.js";import{b as xe}from"./annotations-BN2DAmNr.js";import{b as ue}from"./formation-annotation-markup-BCn9e_pS.js";const we="abcdefghijklmnopqrstuvwxyz".split(""),V="j",Ge="pre-cursive",Ne=96,Fe=320,pe=13,Me=53,He=53,We=26,ze=5.5,Ue=pe*2,Be=0,Ve="#3f454b",Ye="#ffffff",qe="#83b0dd",Xe="#d5dbe2",Ze="#ffffff",Ke="#d5dbe2",fe=38,me=7,ge=54,je=!0,ke=1,Se="#ffb35c",Y=100,Je=178,Qe=.63,et=.66,G=2,te="http://www.w3.org/2000/svg",tt=`
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
`,rt=["letter","style","previewZoom","practiceSize","practiceRepeats","strokeWidth","showStepStartDot","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","gridlineStrokeWidth","gridlineColor","keepInitialLeadIn","keepFinalLeadOut","topDirectionalDashSpacing","topMidpointDensity","topTurnRadius","topUTurnLength","topArrowLength","topArrowHeadSize","topArrowStrokeWidth","topNumberSize","topNumberPathOffset","topOffsetArrowLanes","topAlwaysOffsetArrowLanes","topStrokeColor","topPreviousStrokeColor","topRemainingStrokeColor","topNumberColor","topArrowColor","topDirectionalDash","topTurningPoint","topStartArrow","topDrawOrderNumber","topMidpointArrow","practiceDirectionalDashSpacing","practiceMidpointDensity","practiceTurnRadius","practiceUTurnLength","practiceArrowLength","practiceArrowHeadSize","practiceArrowStrokeWidth","practiceNumberSize","practiceNumberPathOffset","practiceOffsetArrowLanes","practiceAlwaysOffsetArrowLanes","practiceStrokeColor","practiceNumberColor","practiceArrowColor","practiceDirectionalDash","practiceTurningPoint","practiceStartArrow","practiceDrawOrderNumber","practiceMidpointArrow"],ot=["directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberPathOffset"],at=["offsetArrowLanes","alwaysOffsetArrowLanes"],it=["strokeColor","previousStrokeColor","remainingStrokeColor","numberColor","arrowColor"],be={"directional-dash":"DirectionalDash","turning-point":"TurningPoint","start-arrow":"StartArrow","draw-order-number":"DrawOrderNumber","midpoint-arrow":"MidpointArrow"},st={"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},nt={"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},lt={directionalDashSpacing:120,midpointDensity:140,arrowHeadSize:25,arrowStrokeWidth:8,offsetArrowLanes:!1,previousStrokeColor:"#0044b3",numberColor:"#ffffff"},ct={directionalDashSpacing:156,arrowHeadSize:44,arrowStrokeWidth:13.5,offsetArrowLanes:!1,strokeColor:"#b3bac2"},q=document.querySelector("#app");if(!q)throw new Error("Missing #app element for single letter worksheet generator.");document.body.classList.add("worksheet-body");q.classList.add("worksheet-root");const dt=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),re=(e,r,t=r,o=r)=>({directionalDashSpacing:Ne,midpointDensity:Fe,turnRadius:pe,uTurnLength:Me,arrowLength:He,arrowHeadSize:We,arrowStrokeWidth:ze,numberSize:Ue,numberPathOffset:Be,numberColor:Ve,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:dt(e),arrowColor:Ye,strokeColor:r,previousStrokeColor:t,remainingStrokeColor:o}),X=()=>({letter:V,style:Ge,previewZoom:Y,practiceRowHeightMm:fe,practiceRepeatCount:me,strokeWidth:ge,showStepStartDot:je,showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!1,showDescenderGuide:!1,gridlineStrokeWidth:ke,gridlineColor:Se,keepInitialLeadIn:!0,keepFinalLeadOut:!0,top:{...re(st,qe,Xe,Ze),...lt},practice:{...re(nt,Ke),...ct}}),h=X();let a=X();q.innerHTML=`
  <div class="worksheet-app">
    <aside class="worksheet-app__controls" aria-label="Worksheet controls">
      <div class="worksheet-app__controls-inner">
        <div class="worksheet-app__heading">
          <p class="worksheet-app__eyebrow">Worksheet generator</p>
          <h1 class="worksheet-app__title">Single letter worksheet</h1>
        </div>

        ${ht()}
        ${ut()}

        ${p({id:"preview-zoom-slider",label:"Preview zoom",value:Y,min:50,max:200,step:5,valueId:"preview-zoom-value"})}

        ${p({id:"practice-size-slider",label:"Practice size",value:fe,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${p({id:"practice-repeat-slider",label:"Practice repeats",value:me,min:1,max:14,step:1,valueId:"practice-repeat-value"})}

        ${p({id:"stroke-width-slider",label:"Main stroke thickness",value:ge,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        ${wt()}
        ${pt()}

        ${oe("top","Top formation annotations",a.top)}
        ${oe("practice","Practice annotations",a.practice)}

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
        <section class="worksheet-page worksheet-page--single-letter" id="worksheet-page" aria-label="Printable worksheet"></section>
      </div>
    </main>
  </div>
`;const M=document.querySelector("#worksheet-letter-select"),H=document.querySelector("#worksheet-style-select"),E=document.querySelector("#preview-zoom-slider"),P=document.querySelector("#practice-size-slider"),O=document.querySelector("#practice-repeat-slider"),I=document.querySelector("#stroke-width-slider"),_e=document.querySelector("#print-worksheet-button"),N=document.querySelector("#download-png-button"),ve=document.querySelector("#worksheet-page-frame"),k=document.querySelector("#worksheet-page"),A=document.querySelector("#worksheet-status");if(!M||!H||!E||!P||!O||!I||!_e||!N||!ve||!k||!A)throw new Error("Missing elements for single letter worksheet generator.");const Z=Array.from(document.querySelectorAll("[data-global-setting]")),K=Array.from(document.querySelectorAll("[data-scope][data-setting]")),$e=Array.from(document.querySelectorAll("[data-scope][data-annotation-kind]"));function ht(){return`
    <label class="worksheet-app__field" for="worksheet-letter-select">
      <span>Letter</span>
      <select class="worksheet-app__select" id="worksheet-letter-select">
        ${we.map(r=>`<option value="${r}" ${r===V?"selected":""}>${r}</option>`).join("")}
      </select>
    </label>
  `}function ut(){return`
    <label class="worksheet-app__field" for="worksheet-style-select">
      <span>Style</span>
      <select class="worksheet-app__select" id="worksheet-style-select">
        <option value="pre-cursive" selected>Pre-cursive</option>
        <option value="print">Print</option>
      </select>
    </label>
  `}function p({id:e,label:r,value:t,min:o,max:i,step:n,valueId:s=`${e}-value`,attrs:l=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${r}
        <strong id="${s}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${o}"
        max="${i}"
        step="${n}"
        value="${t}"
        ${l}
      />
    </label>
  `}function wt(){return`
    <details class="worksheet-app__details">
      <summary>Letter stroke settings</summary>
      <div class="worksheet-app__details-body">
        <fieldset class="worksheet-app__checks" aria-label="Letter stroke toggles">
          ${v("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${v("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
        </fieldset>
      </div>
    </details>
  `}function pt(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${p({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:ke,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${ft("gridline-color-picker","gridlineColor","Gridline colour",Se)}
        <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
          ${v("show-baseline-guide","showBaselineGuide","Baseline",!0)}
          ${v("show-descender-guide","showDescenderGuide","Descender",!1)}
          ${v("show-x-height-guide","showXHeightGuide","X-height",!0)}
          ${v("show-ascender-guide","showAscenderGuide","Ascender",!1)}
        </fieldset>
      </div>
    </details>
  `}function v(e,r,t,o){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${r}"
        ${o?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}function ft(e,r,t,o){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}"
        type="color"
        value="${o}"
        data-global-setting="${r}"
      />
    </label>
  `}function oe(e,r,t){return`
    <details class="worksheet-app__details" open>
      <summary>${r}</summary>
      <div class="worksheet-app__details-body">
        ${p({id:`${e}-directional-dash-spacing-slider`,label:"Directional dash spacing",value:t.directionalDashSpacing,min:80,max:220,step:4,valueId:`${e}-directional-dash-spacing-value`,attrs:`data-scope="${e}" data-setting="directionalDashSpacing"`})}
        ${p({id:`${e}-midpoint-density-slider`,label:"Midpoint density",value:t.midpointDensity,min:120,max:600,step:20,valueId:`${e}-midpoint-density-value`,attrs:`data-scope="${e}" data-setting="midpointDensity"`})}
        ${p({id:`${e}-turn-radius-slider`,label:"Turn radius",value:t.turnRadius,min:0,max:48,step:1,valueId:`${e}-turn-radius-value`,attrs:`data-scope="${e}" data-setting="turnRadius"`})}
        ${p({id:`${e}-u-turn-length-slider`,label:"U-turn length",value:t.uTurnLength,min:0,max:300,step:1,valueId:`${e}-u-turn-length-value`,attrs:`data-scope="${e}" data-setting="uTurnLength"`})}
        ${p({id:`${e}-arrow-length-slider`,label:"Other arrow length",value:t.arrowLength,min:0,max:300,step:1,valueId:`${e}-arrow-length-value`,attrs:`data-scope="${e}" data-setting="arrowLength"`})}
        ${p({id:`${e}-arrow-head-size-slider`,label:"Arrow head size",value:t.arrowHeadSize,min:0,max:64,step:1,valueId:`${e}-arrow-head-size-value`,attrs:`data-scope="${e}" data-setting="arrowHeadSize"`})}
        ${p({id:`${e}-arrow-stroke-width-slider`,label:"Arrow stroke width",value:t.arrowStrokeWidth,min:1,max:14,step:.5,valueId:`${e}-arrow-stroke-width-value`,attrs:`data-scope="${e}" data-setting="arrowStrokeWidth"`})}
        ${p({id:`${e}-number-size-slider`,label:"Number size",value:t.numberSize,min:8,max:72,step:1,valueId:`${e}-number-size-value`,attrs:`data-scope="${e}" data-setting="numberSize"`})}
        ${p({id:`${e}-number-offset-slider`,label:"Number offset",value:t.numberPathOffset,min:-80,max:80,step:1,valueId:`${e}-number-offset-value`,attrs:`data-scope="${e}" data-setting="numberPathOffset"`})}
        <fieldset class="worksheet-app__checks" aria-label="${r}">
          ${T(e,"directional-dash","Directional dash",t.visibility["directional-dash"])}
          ${T(e,"turning-point","Turns",t.visibility["turning-point"])}
          ${T(e,"start-arrow","Starts",t.visibility["start-arrow"])}
          ${e==="top"?v("show-step-start-dot","showStepStartDot","Step start dot",a.showStepStartDot):""}
          ${T(e,"draw-order-number","Numbers",t.visibility["draw-order-number"])}
          ${T(e,"midpoint-arrow","Midpoints",t.visibility["midpoint-arrow"])}
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
          ${L(e,"previousStrokeColor","Previous strokes colour",t.previousStrokeColor)}
          ${L(e,"strokeColor","Active stroke colour",t.strokeColor)}
          ${L(e,"remainingStrokeColor","Remaining strokes colour",t.remainingStrokeColor)}
        `:L(e,"strokeColor","Letter stroke colour",t.strokeColor)}
        ${L(e,"numberColor","Number colour",t.numberColor)}
        ${L(e,"arrowColor","Arrow colour",t.arrowColor)}
      </div>
    </details>
  `}function L(e,r,t,o){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}-${r}-picker">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}-${r}-picker"
        type="color"
        value="${o}"
        data-scope="${e}"
        data-setting="${r}"
      />
    </label>
  `}function T(e,r,t,o){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${r}"
        ${o?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}const Le=e=>{const[r=""]=e.trim().toLowerCase();return we.includes(r)?r:V},Ce=e=>e==="pre-cursive"||e==="print"?e:null,ye=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),j=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,Ae=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,r=""]=e.step.split(".");return r.length},Ee=(e,r)=>{const t=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),o=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),i=e.step===""||e.step==="any"?Number.NaN:Number(e.step),n=Number.isFinite(t)?t:0;let s=r;return Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(o)&&(s=Math.min(o,s)),Number.isFinite(i)&&i>0&&(s=n+Math.round((s-n)/i)*i),Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(o)&&(s=Math.min(o,s)),Number(s.toFixed(Ae(e)))},u=(e,r)=>{const t=Ee(e,r);return e.value=t.toFixed(Ae(e)),t},_=(e,r)=>{const t=e.get(r);if(t===null)return null;const o=t.trim().toLowerCase();return["1","true","yes","on"].includes(o)?!0:["0","false","no","off"].includes(o)?!1:null},f=(e,r,t)=>{const o=e.get(r);if(o===null)return null;const i=Number(o);return Number.isFinite(i)?Ee(t,i):null},y=(e,r)=>j(e.get(r)??""),F=(e,r)=>`${e}${r.charAt(0).toUpperCase()}${r.slice(1)}`,D=e=>a[e],ae=e=>{const r=D(e);K.forEach(t=>{if(t.dataset.scope!==e)return;const o=t.dataset.setting;o==="directionalDashSpacing"?r.directionalDashSpacing=u(t,r.directionalDashSpacing):o==="midpointDensity"?r.midpointDensity=u(t,r.midpointDensity):o==="turnRadius"?r.turnRadius=u(t,r.turnRadius):o==="uTurnLength"?r.uTurnLength=u(t,r.uTurnLength):o==="arrowLength"?r.arrowLength=u(t,r.arrowLength):o==="arrowHeadSize"?r.arrowHeadSize=u(t,r.arrowHeadSize):o==="arrowStrokeWidth"?r.arrowStrokeWidth=u(t,r.arrowStrokeWidth):o==="numberSize"?r.numberSize=u(t,r.numberSize):o==="numberPathOffset"?r.numberPathOffset=u(t,r.numberPathOffset):o==="offsetArrowLanes"?t.checked=r.offsetArrowLanes:o==="alwaysOffsetArrowLanes"?t.checked=r.alwaysOffsetArrowLanes:o==="arrowColor"?t.value=r.arrowColor:o==="numberColor"?t.value=r.numberColor:o==="strokeColor"?t.value=r.strokeColor:o==="previousStrokeColor"?t.value=r.previousStrokeColor:o==="remainingStrokeColor"&&(t.value=r.remainingStrokeColor)}),$e.forEach(t=>{if(t.dataset.scope!==e)return;const o=t.dataset.annotationKind;o&&(t.checked=r.visibility[o])})},mt=()=>{M.value=a.letter,H.value=a.style,a.previewZoom=u(E,a.previewZoom),a.practiceRowHeightMm=u(P,a.practiceRowHeightMm),a.practiceRepeatCount=u(O,a.practiceRepeatCount),a.strokeWidth=u(I,a.strokeWidth),Z.forEach(e=>{const r=e.dataset.globalSetting;r==="gridlineStrokeWidth"?a.gridlineStrokeWidth=u(e,a.gridlineStrokeWidth):r==="keepInitialLeadIn"?e.checked=a.keepInitialLeadIn:r==="keepFinalLeadOut"?e.checked=a.keepFinalLeadOut:r==="showStepStartDot"?e.checked=a.showStepStartDot:r==="showBaselineGuide"?e.checked=a.showBaselineGuide:r==="showXHeightGuide"?e.checked=a.showXHeightGuide:r==="showAscenderGuide"?e.checked=a.showAscenderGuide:r==="showDescenderGuide"?e.checked=a.showDescenderGuide:r==="gridlineColor"&&(e.value=a.gridlineColor)}),ae("top"),ae("practice"),Te(),J()},ie=(e,r,t,o)=>{ot.forEach(i=>{t[i]!==o[i]&&e.searchParams.set(F(r,i),String(t[i]))}),at.forEach(i=>{t[i]!==o[i]&&e.searchParams.set(F(r,i),t[i]?"1":"0")}),it.forEach(i=>{t[i]!==o[i]&&e.searchParams.set(F(r,i),t[i])}),Object.entries(be).forEach(([i,n])=>{t.visibility[i]!==o.visibility[i]&&e.searchParams.set(`${r}${n}`,t.visibility[i]?"1":"0")})},De=()=>{const e=new URL(window.location.href);rt.forEach(o=>{e.searchParams.delete(o)}),a.letter!==h.letter&&e.searchParams.set("letter",a.letter),a.style!==h.style&&e.searchParams.set("style",a.style),a.previewZoom!==h.previewZoom&&e.searchParams.set("previewZoom",String(a.previewZoom)),a.practiceRowHeightMm!==h.practiceRowHeightMm&&e.searchParams.set("practiceSize",String(a.practiceRowHeightMm)),a.practiceRepeatCount!==h.practiceRepeatCount&&e.searchParams.set("practiceRepeats",String(a.practiceRepeatCount)),a.strokeWidth!==h.strokeWidth&&e.searchParams.set("strokeWidth",String(a.strokeWidth)),a.showStepStartDot!==h.showStepStartDot&&e.searchParams.set("showStepStartDot",a.showStepStartDot?"1":"0"),a.showBaselineGuide!==h.showBaselineGuide&&e.searchParams.set("showBaselineGuide",a.showBaselineGuide?"1":"0"),a.showXHeightGuide!==h.showXHeightGuide&&e.searchParams.set("showXHeightGuide",a.showXHeightGuide?"1":"0"),a.showAscenderGuide!==h.showAscenderGuide&&e.searchParams.set("showAscenderGuide",a.showAscenderGuide?"1":"0"),a.showDescenderGuide!==h.showDescenderGuide&&e.searchParams.set("showDescenderGuide",a.showDescenderGuide?"1":"0"),a.gridlineStrokeWidth!==h.gridlineStrokeWidth&&e.searchParams.set("gridlineStrokeWidth",String(a.gridlineStrokeWidth)),a.gridlineColor!==h.gridlineColor&&e.searchParams.set("gridlineColor",a.gridlineColor),a.keepInitialLeadIn!==h.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",a.keepInitialLeadIn?"1":"0"),a.keepFinalLeadOut!==h.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",a.keepFinalLeadOut?"1":"0"),ie(e,"top",a.top,h.top),ie(e,"practice",a.practice,h.practice);const r=`${e.pathname}${e.search}${e.hash}`,t=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==t&&window.history.replaceState(null,"",r)},se=(e,r)=>{const t=D(r);K.forEach(o=>{if(o.dataset.scope!==r)return;const i=o.dataset.setting;if(!i)return;const n=F(r,i);i==="directionalDashSpacing"?t.directionalDashSpacing=f(e,n,o)??t.directionalDashSpacing:i==="midpointDensity"?t.midpointDensity=f(e,n,o)??t.midpointDensity:i==="turnRadius"?t.turnRadius=f(e,n,o)??t.turnRadius:i==="uTurnLength"?t.uTurnLength=f(e,n,o)??t.uTurnLength:i==="arrowLength"?t.arrowLength=f(e,n,o)??t.arrowLength:i==="arrowHeadSize"?t.arrowHeadSize=f(e,n,o)??t.arrowHeadSize:i==="arrowStrokeWidth"?t.arrowStrokeWidth=f(e,n,o)??t.arrowStrokeWidth:i==="numberSize"?t.numberSize=f(e,n,o)??t.numberSize:i==="numberPathOffset"?t.numberPathOffset=f(e,n,o)??t.numberPathOffset:i==="offsetArrowLanes"?t.offsetArrowLanes=_(e,n)??t.offsetArrowLanes:i==="alwaysOffsetArrowLanes"?t.alwaysOffsetArrowLanes=_(e,n)??t.alwaysOffsetArrowLanes:i==="arrowColor"?t.arrowColor=y(e,n)??t.arrowColor:i==="numberColor"?t.numberColor=y(e,n)??t.numberColor:i==="strokeColor"?t.strokeColor=y(e,n)??t.strokeColor:i==="previousStrokeColor"?t.previousStrokeColor=y(e,n)??t.previousStrokeColor:i==="remainingStrokeColor"&&(t.remainingStrokeColor=y(e,n)??t.remainingStrokeColor)}),Object.entries(be).forEach(([o,i])=>{t.visibility={...t.visibility,[o]:_(e,`${r}${i}`)??t.visibility[o]}})},gt=()=>{const e=new URLSearchParams(window.location.search);a=X();const r=e.get("letter");r!==null&&(a.letter=Le(r));const t=e.get("style");t!==null&&(a.style=Ce(t)??a.style),a.previewZoom=f(e,"previewZoom",E)??a.previewZoom,a.practiceRowHeightMm=f(e,"practiceSize",P)??a.practiceRowHeightMm,a.practiceRepeatCount=f(e,"practiceRepeats",O)??a.practiceRepeatCount,a.strokeWidth=f(e,"strokeWidth",I)??a.strokeWidth,Z.forEach(o=>{const i=o.dataset.globalSetting;i==="gridlineStrokeWidth"?a.gridlineStrokeWidth=f(e,i,o)??a.gridlineStrokeWidth:i==="keepInitialLeadIn"?a.keepInitialLeadIn=_(e,i)??a.keepInitialLeadIn:i==="keepFinalLeadOut"?a.keepFinalLeadOut=_(e,i)??a.keepFinalLeadOut:i==="showStepStartDot"?a.showStepStartDot=_(e,i)??a.showStepStartDot:i==="showBaselineGuide"?a.showBaselineGuide=_(e,i)??a.showBaselineGuide:i==="showXHeightGuide"?a.showXHeightGuide=_(e,i)??a.showXHeightGuide:i==="showAscenderGuide"?a.showAscenderGuide=_(e,i)??a.showAscenderGuide:i==="showDescenderGuide"?a.showDescenderGuide=_(e,i)??a.showDescenderGuide:i==="gridlineColor"&&(a.gridlineColor=y(e,i)??a.gridlineColor)}),se(e,"top"),se(e,"practice"),mt()},kt=()=>Math.max(1,Math.floor(Je/a.practiceRowHeightMm)),w=(e,r)=>{const t=document.querySelector(`#${e}`);t&&(t.textContent=r)},J=()=>{w("preview-zoom-value",`${a.previewZoom}%`),w("practice-size-value",`${a.practiceRowHeightMm} mm`),w("practice-repeat-value",`${a.practiceRepeatCount}`),w("stroke-width-value",`${a.strokeWidth}px`),w("gridline-stroke-width-value",`${a.gridlineStrokeWidth.toFixed(1)}px`),["top","practice"].forEach(e=>{const r=D(e);w(`${e}-directional-dash-spacing-value`,`${r.directionalDashSpacing}px`),w(`${e}-midpoint-density-value`,`1 per ${r.midpointDensity}px`),w(`${e}-turn-radius-value`,`${r.turnRadius}px`),w(`${e}-u-turn-length-value`,`${r.uTurnLength}px`),w(`${e}-arrow-length-value`,`${r.arrowLength}px`),w(`${e}-arrow-head-size-value`,`${r.arrowHeadSize}px`),w(`${e}-arrow-stroke-width-value`,`${r.arrowStrokeWidth.toFixed(1)}px`),w(`${e}-number-size-value`,`${r.numberSize}px`),w(`${e}-number-offset-value`,`${r.numberPathOffset}px`)})},Te=()=>{ve.style.setProperty("--worksheet-preview-scale",`${a.previewZoom/100}`)},U=e=>{a.previewZoom=u(E,e),Te(),J(),De()},ne=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),St=async(e,r)=>{const t=a.previewZoom;t!==e&&(U(e),await ne());try{return await r()}finally{t!==e&&(U(t),await ne())}},bt=(e,r,t)=>{const o=r.xHeight-r.baseline,i=t.xHeight-t.baseline,n=o!==0?i/o:1,s=t.baseline-r.baseline*n;return e*n+s},_t=()=>a.style==="print"?Oe(a.letter):Ie(a.letter),le=(e,r)=>{const t=_t(),o=t==null?void 0:t.guides,i=o==null?void 0:o[r];return!o||typeof i!="number"?null:bt(i,o,e)},g=(e,r)=>{const t=e.path.guides,o=a.strokeWidth/2,i=Math.abs(t.baseline-t.xHeight);if(r==="baseline")return t.baseline+e.offsetY+o;if(r==="xHeight")return t.xHeight+e.offsetY-o;if(r==="ascender"){const l=le(t,"ascender");return l!==null?l+e.offsetY-o:(t.ascender??t.xHeight-i*Qe)+e.offsetY-o}const n=le(t,"descender");return n!==null?n+e.offsetY+o:(t.descender??t.baseline+i*et)+e.offsetY+o},Re=(e,r)=>`
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
`,C=(e,r,t)=>({x:e.x+(r.x-e.x)*t,y:e.y+(r.y-e.y)*t}),ce=(e,r)=>{const t=C(e.p0,e.p1,r),o=C(e.p1,e.p2,r),i=C(e.p2,e.p3,r),n=C(t,o,r),s=C(o,i,r),l=C(n,s,r);return[new ee(e.p0,t,n,l),new ee(l,s,i,e.p3)]},vt=(e,r,t)=>{const o=e.length(),i=Math.max(0,Math.min(r,o)),n=Math.max(i,Math.min(t,o));if(n-i<=.001)return null;const s=e.getTAtLength(i),l=e.getTAtLength(n),[,c]=ce(e,s),d=s>=1?1:(l-s)/(1-s);return ce(c,d)[0]},$t=(e,r,t,o)=>{const i=[],n=[];let s=0;return e.forEach((l,c)=>{const d=l.length(),m=s,b=m+d;s=b;const $=Math.max(t,m),x=Math.min(o,b);if(x-$<=.001)return;const Q=vt(l,$-m,x-m);Q&&(i.push(Q),n.push(r==null?void 0:r[c]))}),{curves:i,curveSegments:n}},W=(e,r,t)=>{if(t-r<=.001)return{...e,strokes:[]};const o=[];let i=0;return e.strokes.forEach(n=>{if(n.type==="lift")return;const s=n.curves.reduce(($,x)=>$+x.length(),0),l=i,c=l+s;i=c;const d=Math.max(r,l),m=Math.min(t,c);if(m-d<=.001)return;const b=$t(n.curves,n.curveSegments,d-l,m-l);b.curves.length!==0&&o.push({...n,curves:b.curves,curveSegments:b.curveSegments})}),{...e,strokes:o}},Lt=e=>{const r=xe(e),t=r.sections.map(s=>s.endDistance).filter(s=>Number.isFinite(s)&&s>0),o=[];let i=0;e.strokes.forEach(s=>{i+=s.totalLength,i>0&&o.push(i)});const n=[...t,...o].map(s=>Number(s.toFixed(3))).filter((s,l,c)=>c.indexOf(s)===l).sort((s,l)=>s-l);return n.length>0?n:[r.totalLength]},Ct=e=>e.strokes.reduce((r,t)=>r+t.totalLength,0),yt=e=>{for(const r of e.strokes){const t=r.samples[0];if(t)return{x:t.x,y:t.y}}return null},At=(e,r,t)=>{const i=e.strokes.filter(s=>s.type!=="lift").map(s=>`<path class="worksheet-word__stroke" d="${he(s.curves)}"></path>`).join(""),n=ue(e,r,t);return`
    ${i}
    ${n}
  `},z=(e,r,t)=>e.strokes.filter(i=>i.type!=="lift").map(i=>`<path class="worksheet-word__stroke worksheet-word__stroke--${t}" d="${he(i.curves)}" style="stroke: ${r};"></path>`).join(""),Et=(e,r,t,o,i)=>{const n=W(e,0,r),s=W(e,r,t),l=W(e,t,o),c=de(s),d=a.showStepStartDot?yt(c):null,m=Number((a.strokeWidth*.33).toFixed(2)),b=ue(s,c,i);return`
    ${z(l,i.remainingStrokeColor,"remaining")}
    ${z(n,i.previousStrokeColor,"previous")}
    ${z(s,i.strokeColor,"active")}
    ${d&&m>0?`<circle class="worksheet-word__step-start-dot" cx="${d.x}" cy="${d.y}" r="${m}" fill="${i.arrowColor}"></circle>`:""}
    ${b}
  `},Dt=(e,r,t,o,i,n)=>{const s=Tt(e),l=Et(e.path,r,t,o,a.top);return`
    <figure class="worksheet-page__formation-step">
      <figcaption>Step ${i+1}</figcaption>
      <svg
        class="worksheet-word worksheet-word--top worksheet-word--step"
        viewBox="0 ${s.y} ${e.width} ${s.height}"
        preserveAspectRatio="xMidYMin meet"
        role="img"
        aria-label="${ye(`${a.letter} formation step ${i+1} of ${n}`)}"
        style="--formation-arrow-color: ${a.top.arrowColor}; --formation-arrow-stroke-width: ${a.top.arrowStrokeWidth}; --worksheet-word-stroke: ${a.top.strokeColor}; --worksheet-word-stroke-width: ${a.strokeWidth}; --worksheet-guide-color: ${a.gridlineColor}; --worksheet-guide-stroke-width: ${a.gridlineStrokeWidth};"
      >
        ${Re(e,e.width)}
        ${l}
      </svg>
    </figure>
  `},Tt=e=>{const r=Math.max(a.strokeWidth,a.top.turnRadius+a.top.arrowHeadSize+12,a.top.numberSize+Math.abs(a.top.numberPathOffset)+12),t=Math.max(a.strokeWidth/2+4,a.top.arrowHeadSize*.25),o=[a.showBaselineGuide?g(e,"baseline"):null,a.showDescenderGuide?g(e,"descender"):null,a.showXHeightGuide?g(e,"xHeight"):null,a.showAscenderGuide?g(e,"ascender"):null].filter(c=>c!==null),i=Math.min(e.path.bounds.minY,...o),n=Math.max(e.path.bounds.maxY,...o),s=Math.max(0,Math.floor(i-t)),l=Math.min(e.height,Math.ceil(n+r));return{y:s,height:Math.max(1,l-s)}},Rt=e=>{const r=e.path.bounds.maxX-e.path.bounds.minX,t=e.path.bounds.minX;return r+t},Pt=(e,r,t,o,i)=>{const n=Rt(e),s=e.width+n*(o-1),l=At(e.path,r,t),c=`practice-letter-${i}`,d=Array.from({length:o},(m,b)=>{const $=b*n;return`<use href="#${c}" x="${$}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${s} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${ye(`${a.letter} practice line, ${o} repeat${o===1?"":"s"}`)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${a.strokeWidth}; --worksheet-guide-color: ${a.gridlineColor}; --worksheet-guide-stroke-width: ${a.gridlineStrokeWidth};"
    >
      ${Re(e,s)}
      <defs>
        <g id="${c}">
          ${l}
        </g>
      </defs>
      ${d}
    </svg>
  `},S=()=>{a={...a,letter:Le(M.value),style:Ce(H.value)??a.style,practiceRowHeightMm:Number(P.value),practiceRepeatCount:Number(O.value),strokeWidth:Number(I.value)},J(),De();let e;try{e=Pe(a.letter,{style:a.style,keepInitialLeadIn:a.keepInitialLeadIn,keepFinalLeadOut:a.keepFinalLeadOut})}catch{k.innerHTML=`
      <div class="worksheet-page__empty">Choose a supported letter.</div>
    `,A.textContent="This letter could not be drawn.";return}const r=de(e.path),t=Lt(r),o=Ct(r),i=t.length,n=t.map((c,d)=>{const m=d===0?0:t[d-1]??0;return Dt(e,m,c,o,d,i)}).join(""),s=kt(),l=Array.from({length:s},(c,d)=>Pt(e,r,a.practice,a.practiceRepeatCount,d)).join("");k.style.setProperty("--practice-row-height",`${a.practiceRowHeightMm}mm`),k.style.setProperty("--formation-step-count",String(i)),k.innerHTML=`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
    <section class="worksheet-page__example worksheet-page__example--steps" aria-label="Formation steps">
      ${n}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${l}
    </section>
  `,A.textContent=`${i} formation step${i===1?"":"s"}, ${s} practice lines`},Ot=e=>new Promise((r,t)=>{const o=new Image;o.onload=()=>r(o),o.onerror=()=>t(new Error("Could not render worksheet image.")),o.src=e}),It=(e,r)=>{const t=URL.createObjectURL(e),o=document.createElement("a");o.href=t,o.download=r,document.body.append(o),o.click(),o.remove(),URL.revokeObjectURL(t)},R=(e,r)=>{const t=e.getBoundingClientRect();return{x:t.left-r.left,y:t.top-r.top,width:t.width,height:t.height}},B=(e,r,t,o,i,n)=>{e.save(),e.beginPath(),e.strokeStyle=i,e.lineWidth=n,e.moveTo(r,o),e.lineTo(t,o),e.stroke(),e.restore()},xt=(e,r)=>{e.save(),e.fillStyle="#23313d",e.font="700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textBaseline="alphabetic",k.querySelectorAll(".worksheet-page__meta-line span").forEach(t=>{var l;const o=R(t,r),i=((l=t.textContent)==null?void 0:l.trim())??"",n=o.y+o.height-3;e.fillText(i,o.x,n);const s=o.x+e.measureText(i).width+15;B(e,s,o.x+o.width,o.y+o.height-1,"#cfd6dc",1.3)}),e.restore()},Gt=(e,r)=>{e.save(),e.fillStyle="#5b6773",e.font="800 12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textAlign="center",e.textBaseline="alphabetic",k.querySelectorAll(".worksheet-page__formation-step figcaption").forEach(t=>{var n;const o=R(t,r),i=((n=t.textContent)==null?void 0:n.trim())??"";e.fillText(i,o.x+o.width/2,o.y+o.height-1)}),e.restore()},Nt=e=>{const r=e.cloneNode(!0);r.setAttribute("xmlns",te);const t=document.createElementNS(te,"style");return t.textContent=tt,r.insertBefore(t,r.firstChild),new XMLSerializer().serializeToString(r)},Ft=async(e,r,t)=>{const o=R(r,t),i=Nt(r),n=URL.createObjectURL(new Blob([i],{type:"image/svg+xml;charset=utf-8"}));try{const s=await Ot(n);e.drawImage(s,o.x,o.y,o.width,o.height)}finally{URL.revokeObjectURL(n)}},Mt=async()=>await St(Y,async()=>{S();const e=k.getBoundingClientRect(),r=Math.ceil(e.width),t=Math.ceil(e.height),o=document.createElement("canvas");o.width=r*G,o.height=t*G;const i=o.getContext("2d");if(!i)throw new Error("Could not prepare worksheet image.");i.fillStyle="#ffffff",i.fillRect(0,0,o.width,o.height),i.scale(G,G),xt(i,e);for(const s of k.querySelectorAll(".worksheet-word"))await Ft(i,s,e);Gt(i,e);const n=k.querySelector(".worksheet-page__example");if(n){const s=R(n,e);B(i,s.x,s.x+s.width,s.y+s.height-1,"#d7dde2",1.3)}return k.querySelectorAll(".worksheet-word--practice").forEach(s=>{const l=R(s,e);B(i,l.x,l.x+l.width,l.y+l.height-.6,"#d7dde2",1.1)}),await new Promise((s,l)=>{o.toBlob(c=>{c?s(c):l(new Error("Could not encode worksheet image."))},"image/png")})});M.addEventListener("change",S);H.addEventListener("change",S);E.addEventListener("input",()=>{U(Number(E.value))});P.addEventListener("input",S);O.addEventListener("input",S);I.addEventListener("input",S);_e.addEventListener("click",()=>{S(),window.print()});N.addEventListener("click",()=>{N.disabled=!0,A.textContent="Preparing PNG...",Mt().then(e=>{It(e,`${a.letter}-${a.style}-single-letter-worksheet.png`),A.textContent="PNG downloaded."}).catch(e=>{A.textContent=e instanceof Error?e.message:"Could not download PNG."}).finally(()=>{N.disabled=!1})});Z.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.globalSetting;if(r==="gridlineStrokeWidth")a.gridlineStrokeWidth=Number(e.value);else if(r==="keepInitialLeadIn")a.keepInitialLeadIn=e.checked;else if(r==="keepFinalLeadOut")a.keepFinalLeadOut=e.checked;else if(r==="showStepStartDot")a.showStepStartDot=e.checked;else if(r==="showBaselineGuide")a.showBaselineGuide=e.checked;else if(r==="showXHeightGuide")a.showXHeightGuide=e.checked;else if(r==="showAscenderGuide")a.showAscenderGuide=e.checked;else if(r==="showDescenderGuide")a.showDescenderGuide=e.checked;else if(r==="gridlineColor"){const t=j(e.value);if(!t)return;a.gridlineColor=t}S()})});K.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.scope,t=e.dataset.setting;if(!r||r!=="top"&&r!=="practice")return;const o=D(r);if(t==="directionalDashSpacing")o.directionalDashSpacing=Number(e.value);else if(t==="midpointDensity")o.midpointDensity=Number(e.value);else if(t==="turnRadius")o.turnRadius=Number(e.value);else if(t==="uTurnLength")o.uTurnLength=Number(e.value);else if(t==="arrowLength")o.arrowLength=Number(e.value);else if(t==="arrowHeadSize")o.arrowHeadSize=Number(e.value);else if(t==="arrowStrokeWidth")o.arrowStrokeWidth=Number(e.value);else if(t==="numberSize")o.numberSize=Number(e.value);else if(t==="numberPathOffset")o.numberPathOffset=Number(e.value);else if(t==="offsetArrowLanes")o.offsetArrowLanes=e.checked;else if(t==="alwaysOffsetArrowLanes")o.alwaysOffsetArrowLanes=e.checked;else if(t==="arrowColor"||t==="numberColor"||t==="strokeColor"||t==="previousStrokeColor"||t==="remainingStrokeColor"){const i=j(e.value);if(!i)return;o[t]=i}S()})});$e.forEach(e=>{e.addEventListener("change",()=>{const r=e.dataset.scope,t=e.dataset.annotationKind;!r||r!=="top"&&r!=="practice"||!t||(D(r).visibility={...D(r).visibility,[t]:e.checked},S())})});gt();S();
