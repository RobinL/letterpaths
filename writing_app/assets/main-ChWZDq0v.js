import{J as xr,b as vr,D as ht,c as _r,a as st,g as Ar,d as kr,e as Pr,f as Tr,h as $r,W as Mt,i as zt,j as Nt,M as Lr,k as Ir,T as Er}from"./shared-Dy72Hgrs.js";import{T as Dr,A as Mr}from"./session-DBZPHQUZ.js";import{c as Nr,a as Or}from"./annotations-C9tUWXB9.js";const gt=54,pt=1,mt="#ffb35c",St="#c2c2c2",ft=96,yt=320,wt=13,bt=53,xt=53,vt=26,_t=5.6,At=26,kt=0,Pt="#3f454b",Tt="#ffffff",k={...xr},L={"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0},Bt=.42,Ot=.36/Bt,Gr=.18/Bt,Me=22/26,Ne=11/26,Rr=["word","tolerance","strokeWidth","gridlineStrokeWidth","gridlineColor","showBaselineGuide","showDescenderGuide","showXHeightGuide","showAscenderGuide","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","includeInitialLeadIn","includeFinalLeadOut","directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberOffset","directionalDash","turns","starts","numbers","midpoints","offsetArrowLanes","alwaysOffsetArrowLanes","wordStrokeColor","numberColor","arrowColor"];function f({id:e,label:t,value:r,min:n,max:a,step:s,valueId:i=`${e}-value`,attrs:l=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${t}
        <strong id="${i}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${n}"
        max="${a}"
        step="${s}"
        value="${r}"
        ${l}
      />
    </label>
  `}function _(e,t,r,n=""){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        ${r?"checked":""}
        ${n}
      />
      <span>${t}</span>
    </label>
  `}function Oe(e,t,r,n=""){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}">
      <span>${t}</span>
      <input
        class="worksheet-app__color"
        id="${e}"
        type="color"
        value="${r}"
        ${n}
      />
    </label>
  `}function Ge(e,t,r=!1){return`
    <details class="worksheet-app__details" ${r?"open":""}>
      <summary>${e}</summary>
      <div class="worksheet-app__details-body">
        ${t}
      </div>
    </details>
  `}const Xt=document.querySelector("#app");if(!Xt)throw new Error("Missing #app element for writing app.");Xt.innerHTML=`
  <div class="writing-app">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <label class="writing-app__word-input-label" for="word-input">
              <span>Enter word</span>
              <input
                class="writing-app__word-input"
                id="word-input"
                type="text"
                value="zephyr"
                placeholder="zephyr"
                spellcheck="false"
                autocomplete="off"
              />
            </label>
          </div>
          <div class="writing-app__topbar-actions">
            <button class="writing-app__button" id="show-me-button" type="button">
              Animate
            </button>
            <details class="writing-app__settings writing-app__settings--options" id="settings-menu">
              <summary class="writing-app__button writing-app__button--secondary writing-app__button--summary">
                Options
              </summary>
              <div class="writing-app__settings-panel writing-app__settings-panel--options">
                ${Ge("Tracing settings",`
      ${f({id:"tolerance-slider",label:"Tolerance",value:ht,min:Lr,max:Ir,step:Er,valueId:"tolerance-value"})}
      ${f({id:"stroke-width-slider",label:"Main stroke thickness",value:gt,min:20,max:90,step:2,valueId:"stroke-width-value"})}
    `,!0)}
                ${Ge("Gridline settings",`
      ${f({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:pt,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value"})}
      ${Oe("gridline-color-picker","Gridline colour",mt)}
      <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
        ${_("show-baseline-guide","Baseline",!0)}
        ${_("show-descender-guide","Descender",!1)}
        ${_("show-x-height-guide","X-height",!0)}
        ${_("show-ascender-guide","Ascender",!1)}
      </fieldset>
    `)}
                ${Ge("Advanced settings",`
      ${f({id:"target-bend-rate-slider",label:"Target maximum bend rate",value:k.targetBendRate,min:0,max:60,step:1,valueId:"target-bend-rate-value"})}
      ${f({id:"min-sidebearing-gap-slider",label:"Minimum sidebearing gap",value:k.minSidebearingGap,min:-300,max:200,step:5,valueId:"min-sidebearing-gap-value"})}
      ${f({id:"bend-search-min-sidebearing-gap-slider",label:"Search minimum sidebearing gap",value:k.bendSearchMinSidebearingGap,min:-300,max:200,step:5,valueId:"bend-search-min-sidebearing-gap-value"})}
      ${f({id:"bend-search-max-sidebearing-gap-slider",label:"Search maximum sidebearing gap",value:k.bendSearchMaxSidebearingGap,min:-100,max:300,step:5,valueId:"bend-search-max-sidebearing-gap-value"})}
      ${f({id:"exit-handle-scale-slider",label:"p0-p1 handle scale",value:k.exitHandleScale,min:0,max:2,step:.05,valueId:"exit-handle-scale-value"})}
      ${f({id:"entry-handle-scale-slider",label:"p2-p3 handle scale",value:k.entryHandleScale,min:0,max:2,step:.05,valueId:"entry-handle-scale-value"})}
      <fieldset class="worksheet-app__checks" aria-label="Advanced writing settings">
        ${_("include-initial-lead-in","Initial lead-in",!0)}
        ${_("include-final-lead-out","Final lead-out",!0)}
      </fieldset>
    `)}
                ${Ge("Top word annotations",`
      ${f({id:"directional-dash-spacing-slider",label:"Directional dash spacing",value:ft,min:80,max:220,step:4,valueId:"directional-dash-spacing-value"})}
      ${f({id:"midpoint-density-slider",label:"Midpoint density",value:yt,min:120,max:600,step:20,valueId:"midpoint-density-value"})}
      ${f({id:"turn-radius-slider",label:"Turn radius",value:wt,min:0,max:48,step:1,valueId:"turn-radius-value"})}
      ${f({id:"u-turn-length-slider",label:"U-turn length",value:bt,min:0,max:300,step:1,valueId:"u-turn-length-value"})}
      ${f({id:"arrow-length-slider",label:"Other arrow length",value:xt,min:0,max:300,step:1,valueId:"arrow-length-value"})}
      ${f({id:"arrow-head-size-slider",label:"Arrow head size",value:vt,min:0,max:64,step:1,valueId:"arrow-head-size-value"})}
      ${f({id:"arrow-stroke-width-slider",label:"Arrow stroke width",value:_t,min:1,max:14,step:.5,valueId:"arrow-stroke-width-value"})}
      ${f({id:"number-size-slider",label:"Number size",value:At,min:8,max:72,step:1,valueId:"number-size-value"})}
      ${f({id:"number-offset-slider",label:"Number offset",value:kt,min:-80,max:80,step:1,valueId:"number-offset-value"})}
      <fieldset class="worksheet-app__checks" aria-label="Top word annotations">
        ${_("annotation-directional-dash","Directional dash",L["directional-dash"],'data-annotation-kind="directional-dash"')}
        ${_("annotation-turning-point","Turns",L["turning-point"],'data-annotation-kind="turning-point"')}
        ${_("annotation-start-arrow","Starts",L["start-arrow"],'data-annotation-kind="start-arrow"')}
        ${_("annotation-draw-order-number","Numbers",L["draw-order-number"],'data-annotation-kind="draw-order-number"')}
        ${_("annotation-midpoint-arrow","Midpoints",L["midpoint-arrow"],'data-annotation-kind="midpoint-arrow"')}
        ${_("offset-arrow-lanes","Offset lanes",!0)}
        ${_("always-offset-arrow-lanes","Always offset lanes",!1)}
      </fieldset>
      ${Oe("word-stroke-color-picker","Word stroke colour",St)}
      ${Oe("number-color-picker","Number colour",Pt)}
      ${Oe("arrow-color-picker","Arrow colour",Tt)}
    `,!0)}
              </div>
            </details>
          </div>
        </header>

        <svg
          class="writing-app__svg"
          id="trace-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting tracing area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Well done!</p>
            <button class="writing-app__button writing-app__button--next" id="next-word-button" type="button">
              Next word
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;const ge=document.querySelector("#word-input"),m=document.querySelector("#trace-svg"),oe=document.querySelector("#show-me-button"),Yt=document.querySelector("#success-overlay"),Kt=document.querySelector("#next-word-button"),pe=document.querySelector("#tolerance-slider"),jt=document.querySelector("#tolerance-value"),me=document.querySelector("#stroke-width-slider"),Jt=document.querySelector("#stroke-width-value"),Se=document.querySelector("#gridline-stroke-width-slider"),Zt=document.querySelector("#gridline-stroke-width-value"),Ve=document.querySelector("#gridline-color-picker"),We=document.querySelector("#show-baseline-guide"),Ue=document.querySelector("#show-descender-guide"),ze=document.querySelector("#show-x-height-guide"),Be=document.querySelector("#show-ascender-guide"),fe=document.querySelector("#target-bend-rate-slider"),Qt=document.querySelector("#target-bend-rate-value"),ye=document.querySelector("#min-sidebearing-gap-slider"),er=document.querySelector("#min-sidebearing-gap-value"),we=document.querySelector("#bend-search-min-sidebearing-gap-slider"),tr=document.querySelector("#bend-search-min-sidebearing-gap-value"),be=document.querySelector("#bend-search-max-sidebearing-gap-slider"),rr=document.querySelector("#bend-search-max-sidebearing-gap-value"),xe=document.querySelector("#exit-handle-scale-slider"),nr=document.querySelector("#exit-handle-scale-value"),ve=document.querySelector("#entry-handle-scale-slider"),ar=document.querySelector("#entry-handle-scale-value"),Xe=document.querySelector("#include-initial-lead-in"),Ye=document.querySelector("#include-final-lead-out"),_e=document.querySelector("#midpoint-density-slider"),ir=document.querySelector("#midpoint-density-value"),Ae=document.querySelector("#directional-dash-spacing-slider"),sr=document.querySelector("#directional-dash-spacing-value"),ke=document.querySelector("#turn-radius-slider"),or=document.querySelector("#turn-radius-value"),Pe=document.querySelector("#u-turn-length-slider"),lr=document.querySelector("#u-turn-length-value"),Te=document.querySelector("#arrow-length-slider"),cr=document.querySelector("#arrow-length-value"),$e=document.querySelector("#arrow-head-size-slider"),dr=document.querySelector("#arrow-head-size-value"),Le=document.querySelector("#arrow-stroke-width-slider"),ur=document.querySelector("#arrow-stroke-width-value"),Ie=document.querySelector("#number-size-slider"),hr=document.querySelector("#number-size-value"),Ee=document.querySelector("#number-offset-slider"),gr=document.querySelector("#number-offset-value"),Ke=document.querySelector("#offset-arrow-lanes"),je=document.querySelector("#always-offset-arrow-lanes"),Je=document.querySelector("#word-stroke-color-picker"),Ze=document.querySelector("#number-color-picker"),Qe=document.querySelector("#arrow-color-picker"),$t=Array.from(document.querySelectorAll("[data-annotation-kind]"));if(!ge||!m||!oe||!Yt||!Kt||!pe||!jt||!me||!Jt||!Se||!Zt||!Ve||!We||!Ue||!ze||!Be||!fe||!Qt||!ye||!er||!we||!tr||!be||!rr||!xe||!nr||!ve||!ar||!Xe||!Ye||!_e||!ir||!Ae||!sr||!ke||!or||!Pe||!lr||!Te||!cr||!$e||!dr||!Le||!ur||!Ie||!hr||!Ee||!gr||!Ke||!je||!Je||!Ze||!Qe||$t.length===0)throw new Error("Missing elements for writing app.");let ot=-1,P="zephyr",et=null,x=null,W=null,D=null,lt=!1,X=[],le=[],de=null,ue=[],tt=[],E=null,he=null,ce=!1,M=ht,T=gt,G=pt,K=mt,j=!0,J=!1,Z=!0,Q=!1,o={...k},ee=!0,te=!0,R=yt,C=ft,N=wt,H=bt,I=xt,S=vt,F=_t,q=At,O=kt,re=!0,ne=!1,ae=St,ie=Pt,se=Tt,h={...L};const Cr=12,Hr=2,pr=4,rt=6.5,Fr=rt/2,qr=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),Vr=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),y=(e,t)=>{e.textContent=t},Gt=e=>e.toFixed(2),mr=()=>{y(jt,`${M}px`),y(Jt,`${T}px`),y(Zt,`${G.toFixed(1)}px`),y(Qt,`${o.targetBendRate}`),y(er,`${o.minSidebearingGap}`),y(tr,`${o.bendSearchMinSidebearingGap}`),y(rr,`${o.bendSearchMaxSidebearingGap}`),y(nr,Gt(o.exitHandleScale)),y(ar,Gt(o.entryHandleScale)),y(sr,`${C}px`),y(ir,`1 per ${R}px`),y(or,`${N}px`),y(lr,`${H}px`),y(cr,`${I}px`),y(dr,`${S}px`),y(ur,`${F.toFixed(1)}px`),y(hr,`${q}px`),y(gr,`${O}px`)},De=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,Sr=e=>e.trim().toLowerCase(),fr=e=>{const t=e.step;if(!t||t==="any")return 0;const r=t.split(".")[1];return r?r.length:0},yr=(e,t)=>{const r=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),n=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),a=e.step===""||e.step==="any"?NaN:Number(e.step),s=Number.isFinite(r)?r:0;let i=t;return Number.isFinite(r)&&(i=Math.max(r,i)),Number.isFinite(n)&&(i=Math.min(n,i)),Number.isFinite(a)&&a>0&&(i=s+Math.round((i-s)/a)*a),Number.isFinite(r)&&(i=Math.max(r,i)),Number.isFinite(n)&&(i=Math.min(n,i)),Number(i.toFixed(fr(e)))},w=(e,t)=>{const r=yr(e,t);return e.value=r.toFixed(fr(e)),r},A=(e,t)=>{const r=e.get(t);if(r===null)return null;const n=r.trim().toLowerCase();return["1","true","yes","on"].includes(n)?!0:["0","false","no","off"].includes(n)?!1:null},b=(e,t,r)=>{const n=e.get(t);if(n===null)return null;const a=Number(n);return Number.isFinite(a)?yr(r,a):null},Re=(e,t)=>De(e.get(t)??""),Wr=()=>{ge.value=P,M=w(pe,M),T=w(me,T),G=w(Se,G),o={targetBendRate:w(fe,o.targetBendRate),minSidebearingGap:w(ye,o.minSidebearingGap),bendSearchMinSidebearingGap:w(we,o.bendSearchMinSidebearingGap),bendSearchMaxSidebearingGap:w(be,o.bendSearchMaxSidebearingGap),exitHandleScale:w(xe,o.exitHandleScale),entryHandleScale:w(ve,o.entryHandleScale)},C=w(Ae,C),R=w(_e,R),N=w(ke,N),H=w(Pe,H),I=w(Te,I),S=w($e,S),F=w(Le,F),q=w(Ie,q),O=w(Ee,O),We.checked=j,Ue.checked=J,ze.checked=Z,Be.checked=Q,Xe.checked=ee,Ye.checked=te,Ke.checked=re,je.checked=ne,Ve.value=K,Je.value=ae,Ze.value=ie,Qe.value=se,$t.forEach(e=>{const t=e.dataset.annotationKind;t&&(e.checked=h[t])}),mr()},Lt=()=>{const e=new URL(window.location.href);Rr.forEach(n=>{e.searchParams.delete(n)}),P!=="zephyr"&&e.searchParams.set("word",P),M!==ht&&e.searchParams.set("tolerance",String(M)),T!==gt&&e.searchParams.set("strokeWidth",String(T)),G!==pt&&e.searchParams.set("gridlineStrokeWidth",String(G)),K!==mt&&e.searchParams.set("gridlineColor",K),j!==!0&&e.searchParams.set("showBaselineGuide",j?"1":"0"),J!==!1&&e.searchParams.set("showDescenderGuide",J?"1":"0"),Z!==!0&&e.searchParams.set("showXHeightGuide",Z?"1":"0"),Q!==!1&&e.searchParams.set("showAscenderGuide",Q?"1":"0"),o.targetBendRate!==k.targetBendRate&&e.searchParams.set("targetBendRate",String(o.targetBendRate)),o.minSidebearingGap!==k.minSidebearingGap&&e.searchParams.set("minSidebearingGap",String(o.minSidebearingGap)),o.bendSearchMinSidebearingGap!==k.bendSearchMinSidebearingGap&&e.searchParams.set("bendSearchMinSidebearingGap",String(o.bendSearchMinSidebearingGap)),o.bendSearchMaxSidebearingGap!==k.bendSearchMaxSidebearingGap&&e.searchParams.set("bendSearchMaxSidebearingGap",String(o.bendSearchMaxSidebearingGap)),o.exitHandleScale!==k.exitHandleScale&&e.searchParams.set("exitHandleScale",String(o.exitHandleScale)),o.entryHandleScale!==k.entryHandleScale&&e.searchParams.set("entryHandleScale",String(o.entryHandleScale)),ee!==!0&&e.searchParams.set("includeInitialLeadIn",ee?"1":"0"),te!==!0&&e.searchParams.set("includeFinalLeadOut",te?"1":"0"),C!==ft&&e.searchParams.set("directionalDashSpacing",String(C)),R!==yt&&e.searchParams.set("midpointDensity",String(R)),N!==wt&&e.searchParams.set("turnRadius",String(N)),H!==bt&&e.searchParams.set("uTurnLength",String(H)),I!==xt&&e.searchParams.set("arrowLength",String(I)),S!==vt&&e.searchParams.set("arrowHeadSize",String(S)),F!==_t&&e.searchParams.set("arrowStrokeWidth",String(F)),q!==At&&e.searchParams.set("numberSize",String(q)),O!==kt&&e.searchParams.set("numberOffset",String(O)),h["directional-dash"]!==L["directional-dash"]&&e.searchParams.set("directionalDash",h["directional-dash"]?"1":"0"),h["turning-point"]!==L["turning-point"]&&e.searchParams.set("turns",h["turning-point"]?"1":"0"),h["start-arrow"]!==L["start-arrow"]&&e.searchParams.set("starts",h["start-arrow"]?"1":"0"),h["draw-order-number"]!==L["draw-order-number"]&&e.searchParams.set("numbers",h["draw-order-number"]?"1":"0"),h["midpoint-arrow"]!==L["midpoint-arrow"]&&e.searchParams.set("midpoints",h["midpoint-arrow"]?"1":"0"),re!==!0&&e.searchParams.set("offsetArrowLanes",re?"1":"0"),ne!==!1&&e.searchParams.set("alwaysOffsetArrowLanes",ne?"1":"0"),ae!==St&&e.searchParams.set("wordStrokeColor",ae),ie!==Pt&&e.searchParams.set("numberColor",ie),se!==Tt&&e.searchParams.set("arrowColor",se);const t=`${e.pathname}${e.search}${e.hash}`,r=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==r&&window.history.replaceState(null,"",t)},Ur=()=>{const e=new URLSearchParams(window.location.search),t=e.get("word");t!==null&&(P=Sr(t)),M=b(e,"tolerance",pe)??M,T=b(e,"strokeWidth",me)??T,G=b(e,"gridlineStrokeWidth",Se)??G,K=Re(e,"gridlineColor")??K,j=A(e,"showBaselineGuide")??j,J=A(e,"showDescenderGuide")??J,Z=A(e,"showXHeightGuide")??Z,Q=A(e,"showAscenderGuide")??Q,o={targetBendRate:b(e,"targetBendRate",fe)??o.targetBendRate,minSidebearingGap:b(e,"minSidebearingGap",ye)??o.minSidebearingGap,bendSearchMinSidebearingGap:b(e,"bendSearchMinSidebearingGap",we)??o.bendSearchMinSidebearingGap,bendSearchMaxSidebearingGap:b(e,"bendSearchMaxSidebearingGap",be)??o.bendSearchMaxSidebearingGap,exitHandleScale:b(e,"exitHandleScale",xe)??o.exitHandleScale,entryHandleScale:b(e,"entryHandleScale",ve)??o.entryHandleScale},ee=A(e,"includeInitialLeadIn")??ee,te=A(e,"includeFinalLeadOut")??te,C=b(e,"directionalDashSpacing",Ae)??C,R=b(e,"midpointDensity",_e)??R,N=b(e,"turnRadius",ke)??N,H=b(e,"uTurnLength",Pe)??H,I=b(e,"arrowLength",Te)??I,S=b(e,"arrowHeadSize",$e)??S,F=b(e,"arrowStrokeWidth",Le)??F,q=b(e,"numberSize",Ie)??q,O=b(e,"numberOffset",Ee)??O,h={"directional-dash":A(e,"directionalDash")??h["directional-dash"],"turning-point":A(e,"turns")??h["turning-point"],"start-arrow":A(e,"starts")??h["start-arrow"],"draw-order-number":A(e,"numbers")??h["draw-order-number"],"midpoint-arrow":A(e,"midpoints")??h["midpoint-arrow"]},re=A(e,"offsetArrowLanes")??re,ne=A(e,"alwaysOffsetArrowLanes")??ne,ae=Re(e,"wordStrokeColor")??ae,ie=Re(e,"numberColor")??ie,se=Re(e,"arrowColor")??se,Wr(),Lt()},zr=e=>`writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${e.kind}`,Br=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),Xr=e=>e.kind==="start-arrow"||e.kind==="midpoint-arrow",ct=e=>e.kind==="turning-point",Yr=e=>e.kind==="draw-order-number",Rt=e=>"distance"in e.source?e.source.distance:e.source.turnDistance,It=e=>e.strokes.reduce((t,r)=>t+r.totalLength,0),Kr=(e,t)=>{if(e.length===0)return{x:0,y:0};for(let n=1;n<e.length;n+=1){const a=e[n-1],s=e[n];if(!(!a||!s)&&s.distanceAlongStroke>=t){const i=s.distanceAlongStroke-a.distanceAlongStroke,l=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*l,y:a.y+(s.y-a.y)*l}}}const r=e[e.length-1];return r?{x:r.x,y:r.y}:{x:0,y:0}},qe=(e,t)=>{let r=t;for(let n=0;n<e.strokes.length;n+=1){const a=e.strokes[n];if(a){if(r<=a.totalLength||n===e.strokes.length-1)return Kr(a.samples,Math.max(0,Math.min(r,a.totalLength)));r-=a.totalLength}}return{x:0,y:0}},Et=e=>{const t=Math.hypot(e.x,e.y);return t>0?{x:e.x/t,y:e.y/t}:{x:1,y:0}},Ct=(e,t,r="center")=>{const n=It(e),a=Math.max(0,Math.min(t,n)),s=qe(e,a),i=Math.min(8,Math.max(2,n/200));let l=Math.max(0,a-i),d=Math.min(n,a+i);r==="forward"?l=a:r==="backward"&&(d=a),Math.abs(d-l)<.001&&(a<=i?d=Math.min(n,a+i):l=Math.max(0,a-i));const c=qe(e,l),g=qe(e,d);return{point:s,tangent:Et({x:g.x-c.x,y:g.y-c.y})}},Y=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),jr=(e,t)=>(e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y),Jr=(e,t,r)=>({x:e.x+(t.x-e.x)*r,y:e.y+(t.y-e.y)*r}),Zr=(e,t)=>{const r={x:-e.tangent.y,y:e.tangent.x};return{x:e.point.x+r.x*t,y:e.point.y+r.y*t}},wr=(e,t)=>{const r=Math.cos(t),n=Math.sin(t);return{x:e.x*r-e.y*n,y:e.x*n+e.y*r}},B=(e,t,r,n)=>{const a=wr({x:e.x-t.x,y:e.y-t.y},n);return{x:r.x+a.x,y:r.y+a.y}},Qr=(e,t,r,n,a)=>{const s=1-a,i=s*s,l=a*a;return{x:i*s*e.x+3*i*a*t.x+3*s*l*r.x+l*a*n.x,y:i*s*e.y+3*i*a*t.y+3*s*l*r.y+l*a*n.y}},Ce=(e,t)=>{const r=e[e.length-1];(!r||Y(r,t)>.25)&&e.push(t)},en=(e,t)=>{const r=Y(e,t),n=Math.max(1,Math.ceil(r/pr)),a=[];for(let s=1;s<=n;s+=1)a.push(Jr(e,t,s/n));return a},tn=e=>{const t=[];let r=null;return e.forEach(n=>{if(n.type==="move"){r=n.to,Ce(t,n.to);return}if(!r){r=n.to,Ce(t,n.to);return}if(n.type==="line"){en(r,n.to).forEach(i=>Ce(t,i)),r=n.to;return}const a=Y(r,n.cp1)+Y(n.cp1,n.cp2)+Y(n.cp2,n.to),s=Math.max(3,Math.ceil(a/pr));for(let i=1;i<=s;i+=1)Ce(t,Qr(r,n.cp1,n.cp2,n.to,i/s));r=n.to}),t},Ht=e=>{var s;const t=tn(e.commands),r=(s=e.head)==null?void 0:s.polygon,a=[...t,...r??[]].reduce((i,l)=>({minX:Math.min(i.minX,l.x),minY:Math.min(i.minY,l.y),maxX:Math.max(i.maxX,l.x),maxY:Math.max(i.maxY,l.y)}),{minX:Number.POSITIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY});return{pathPoints:t,...r?{headPolygon:r}:{},bounds:a}},rn=(e,t,r)=>e.minX<=t.maxX+r&&e.maxX+r>=t.minX&&e.minY<=t.maxY+r&&e.maxY+r>=t.minY,nn=(e,t,r)=>{const n=r.x-t.x,a=r.y-t.y,s=n*n+a*a;if(s===0)return Y(e,t);const i=Math.max(0,Math.min(1,((e.x-t.x)*n+(e.y-t.y)*a)/s));return Y(e,{x:t.x+n*i,y:t.y+a*i})},an=(e,t)=>t.reduce((r,n,a)=>{const s=t[(a+1)%t.length];return s?Math.min(r,nn(e,n,s)):r},Number.POSITIVE_INFINITY),dt=(e,t)=>{let r=!1;for(let n=0,a=t.length-1;n<t.length;a=n,n+=1){const s=t[n],i=t[a];if(!s||!i)continue;s.y>e.y!=i.y>e.y&&e.x<(i.x-s.x)*(e.y-s.y)/(i.y-s.y)+s.x&&(r=!r)}return r},He=(e,t,r)=>(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y),Fe=(e,t,r)=>e.x<=Math.max(t.x,r.x)&&e.x>=Math.min(t.x,r.x)&&e.y<=Math.max(t.y,r.y)&&e.y>=Math.min(t.y,r.y),sn=(e,t,r,n)=>{const a=He(e,t,r),s=He(e,t,n),i=He(r,n,e),l=He(r,n,t);return a*s<0&&i*l<0?!0:Math.abs(a)<.001&&Fe(r,e,t)||Math.abs(s)<.001&&Fe(n,e,t)||Math.abs(i)<.001&&Fe(e,r,n)||Math.abs(l)<.001&&Fe(t,r,n)},on=(e,t)=>e.length<3||t.length<3?!1:e.some((n,a)=>{const s=e[(a+1)%e.length];return!!s&&t.some((i,l)=>{const d=t[(l+1)%t.length];return!!d&&sn(n,s,i,d)})})||dt(e[0],t)||dt(t[0],e),ln=(e,t)=>{const r=rt*rt;return e.some(n=>t.some(a=>jr(n,a)<=r))},Ft=(e,t)=>t.length>=3&&e.some(r=>dt(r,t)||an(r,t)<=Fr),ut=(e,t,r)=>{const n=r.get(e)??Ht(e),a=r.get(t)??Ht(t);return r.set(e,n),r.set(t,a),n.pathPoints.length===0&&!n.headPolygon||a.pathPoints.length===0&&!a.headPolygon||!rn(n.bounds,a.bounds,rt)?!1:ln(n.pathPoints,a.pathPoints)||(n.headPolygon?Ft(a.pathPoints,n.headPolygon):!1)||(a.headPolygon?Ft(n.pathPoints,a.headPolygon):!1)||(n.headPolygon&&a.headPolygon?on(n.headPolygon,a.headPolygon):!1)},qt=(e,t)=>{const r=qe(t,e.source.turnDistance);return Math.min(Math.abs(r.y-t.bounds.minY),Math.abs(t.bounds.maxY-r.y))},cn=(e,t,r)=>{const n=qt(e,r)-qt(t,r);return Math.abs(n)>.001?n:e.source.turnDistance-t.source.turnDistance},dn=(e,t,r,n)=>e.type==="move"?{type:"move",to:B(e.to,t,r,n)}:e.type==="line"?{type:"line",to:B(e.to,t,r,n)}:{type:"cubic",cp1:B(e.cp1,t,r,n),cp2:B(e.cp2,t,r,n),to:B(e.to,t,r,n)},un=(e,t)=>{const r=It(t),n=Ct(t,e.source.turnDistance,"forward"),a=Math.max(e.source.turnDistance,Math.min(r,e.source.endDistance)),s=Ct(t,a,"backward"),i=n.point,l=s.point,d=Math.atan2(s.tangent.y,s.tangent.x)-Math.atan2(n.tangent.y,n.tangent.x),c=a-e.source.turnDistance;return{annotation:{...e,commands:e.commands.map(g=>dn(g,i,l,d)),...e.head?{head:{tip:B(e.head.tip,i,l,d),direction:Et(wr(e.head.direction,d)),polygon:e.head.polygon.map(g=>B(g,i,l,d))}}:{},source:{...e.source,startDistance:Math.min(r,e.source.startDistance+c),turnDistance:a,endDistance:Math.min(r,e.source.endDistance+c)}},distanceShift:c,targetDistance:a,targetPose:s}},hn=(e,t,r)=>({...e,point:t.targetPose.point,anchor:Zr(t.targetPose,e.metrics.offset),direction:t.targetPose.tangent,source:{...e.source,startDistance:Math.min(r,e.source.startDistance+t.distanceShift),endDistance:Math.min(r,e.source.endDistance+t.distanceShift),distance:t.targetDistance}}),gn=(e,t)=>{const r=e.filter(ct);if(r.length<2)return e;const n=new Map,a=new Map,s=[...r].sort((c,g)=>cn(c,g,t)),i=[];if(s.forEach(c=>{if(i.some(v=>ut(c,v,n))){a.set(c,un(c,t));return}i.push(c)}),a.size===0)return e;const l=It(t),d=new Map;return a.forEach((c,g)=>{d.set(g.source.sectionIndex,c)}),e.map(c=>{var g;if(ct(c))return((g=a.get(c))==null?void 0:g.annotation)??c;if(Yr(c)){const v=d.get(c.source.sectionIndex);return v?hn(c,v,l):c}return c})},pn=(e,t)=>{const r=gn(e.filter(d=>h[d.kind]),t),n=r.filter(ct),a=r.filter(Xr).sort((d,c)=>Rt(d)-Rt(c)),s=new Map,i=[],l=new Set;return a.forEach(d=>{if(n.some(v=>ut(d,v,s))){l.add(d);return}if(i.some(v=>ut(d,v,s))){l.add(d);return}i.push(d)}),r.filter(d=>!l.has(d))},mn=e=>{const t=Et(e.direction);return{x:e.anchor.x+t.x*O,y:e.anchor.y+t.y*O}},Sn=e=>{if(!h[e.kind])return"";if(e.kind==="draw-order-number"){const t=mn(e);return`
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${t.x}"
          y="${t.y}"
          fill="${ie}"
          font-size="${q}"
          text-anchor="middle"
          dominant-baseline="central"
        >${Vr(e.text)}</text>
      </g>
    `}return`
    <path
      class="${zr(e)}"
      d="${Or(e.commands)}"
    ></path>
    ${Br(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${e.kind}" points="${qr(t.polygon)}"></polygon>`).join("")}
  `},fn=(e,t,r)=>{const n=t.xHeight-t.baseline,a=r.xHeight-r.baseline,s=n!==0?a/n:1,i=r.baseline-t.baseline*s;return e*s+i},Vt=(e,t,r)=>{let n=r==="ascender"?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY,a=null;for(const s of e){if(s.trim()===""){a=null;continue}const i=s.toLowerCase(),l=a===null?kr:Pr[a],d=Ar(i,l);if(!d){a=null;continue}const c=d.guides,g=c==null?void 0:c[r];if(c&&typeof g=="number"){const v=fn(g,c,t);r==="ascender"?n=Math.min(n,v):n=Math.max(n,v)}a=Tr[i]??"low"}return Number.isFinite(n)?n:null},V=(e,t,r)=>{const n=e.guides,a=T/2,s=Math.abs(n.baseline-n.xHeight);if(r==="baseline")return n.baseline+t+a;if(r==="xHeight")return n.xHeight+t-a;if(r==="ascender"){const d=Vt(P,n,"ascender");return d!==null?d+t-a:(n.ascender??n.xHeight-Math.abs(s)*.63)+t-a}const i=Vt(P,n,"descender");return i!==null?i+t+a:(n.descender??n.baseline+Math.abs(s)*.66)+t+a},yn=(e,t,r)=>{const n=`stroke: ${K}; stroke-width: ${G};`;return`
    ${j?`
      <line
        class="writing-app__guide"
        x1="0"
        y1="${V(e,r,"baseline")}"
        x2="${t}"
        y2="${V(e,r,"baseline")}"
        style="${n}"
      ></line>
    `:""}
    ${J?`
      <line
        class="writing-app__guide"
        x1="0"
        y1="${V(e,r,"descender")}"
        x2="${t}"
        y2="${V(e,r,"descender")}"
        style="${n}"
      ></line>
    `:""}
    ${Z?`
      <line
        class="writing-app__guide"
        x1="0"
        y1="${V(e,r,"xHeight")}"
        x2="${t}"
        y2="${V(e,r,"xHeight")}"
        style="${n}"
      ></line>
    `:""}
    ${Q?`
      <line
        class="writing-app__guide"
        x1="0"
        y1="${V(e,r,"ascender")}"
        x2="${t}"
        y2="${V(e,r,"ascender")}"
        style="${n}"
      ></line>
    `:""}
  `},at=e=>{Yt.hidden=!e},nt=()=>{he!==null&&(cancelAnimationFrame(he),he=null),ce=!1,oe.disabled=!1,oe.textContent="Animate",ue.forEach((e,t)=>{const r=tt[t]??.001;e.style.strokeDasharray=`${r} ${r}`,e.style.strokeDashoffset=`${r}`}),E&&(E.style.opacity="0"),U()},Wt=()=>{x==null||x.reset(),D=null,at(!1),X.forEach((e,t)=>{const r=le[t]??.001;e.style.strokeDasharray=`${r} ${r}`,e.style.strokeDashoffset=`${r}`}),U()},U=()=>{lt||(lt=!0,requestAnimationFrame(()=>{lt=!1,xn()}))},wn=e=>{var n;if(!W)return 0;if(e.status==="complete")return W.strokes.reduce((a,s)=>a+s.totalLength,0);let t=0;for(let a=0;a<e.activeStrokeIndex;a+=1)t+=((n=W.strokes[a])==null?void 0:n.totalLength)??0;const r=W.strokes[e.activeStrokeIndex];return t+((r==null?void 0:r.totalLength)??0)*e.activeStrokeProgress},bn=e=>{if(!W)return e.cursorTangent;const t=wn(e),r=[...W.boundaries].reverse().find(n=>n.previousSegment!==n.nextSegment&&n.turnAngleDegrees>=150&&t>=n.overallDistance-Hr&&t-n.overallDistance<Cr);return(r==null?void 0:r.outgoingTangent)??e.cursorTangent},xn=()=>{if(!x||!de)return;const e=x.getState(),t=bn(e),r=Math.atan2(t.y,t.x)*(180/Math.PI);de.setAttribute("transform",`translate(${e.cursorPoint.x}, ${e.cursorPoint.y}) rotate(${r})`),de.style.opacity=ce?"0":"1";const n=new Set(e.completedStrokes);X.forEach((a,s)=>{const i=le[s]??0;if(n.has(s)){a.style.strokeDashoffset="0";return}if(s===e.activeStrokeIndex){const l=i*(1-e.activeStrokeProgress);a.style.strokeDashoffset=`${Math.max(0,l)}`;return}a.style.strokeDashoffset=`${i}`}),at(e.status==="complete")},vn=()=>{if(!et||ce)return;Wt(),nt();const e=new Mr(et,{speed:1.7,penUpSpeed:2.1,deferredDelayMs:150});ce=!0,oe.disabled=!0,oe.textContent="Showing...";const t=performance.now(),r=n=>{const a=n-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),l=new Set(i.completedStrokes);if(X.forEach((d,c)=>{const g=le[c]??.001;if(l.has(c)){d.style.strokeDashoffset="0";return}if(c===i.activeStrokeIndex){const v=g*(1-i.activeStrokeProgress);d.style.strokeDashoffset=`${Math.max(0,v)}`;return}d.style.strokeDashoffset=`${g}`}),E&&(E.setAttribute("cx",i.point.x.toFixed(2)),E.setAttribute("cy",i.point.y.toFixed(2)),E.style.opacity=a<=e.totalDuration+Nt?"1":"0"),a<e.totalDuration+Nt){he=requestAnimationFrame(r);return}nt(),Wt()};he=requestAnimationFrame(r),U()},_n=(e,t,r,n)=>{const a=_r(e);W=a,x=new Dr(a,{startTolerance:M,hitTolerance:M}),D=null;const s=e.strokes.filter(p=>p.type!=="lift"),i=s.map(p=>`<path class="writing-app__stroke-bg" d="${st(p.curves)}" style="stroke-width: ${T}; stroke: ${ae};"></path>`).join(""),l=s.map(p=>`<path class="writing-app__stroke-trace" d="${st(p.curves)}" style="stroke-width: ${T};"></path>`).join(""),d=s.map(p=>`<path class="writing-app__stroke-demo" d="${st(p.curves)}" style="stroke-width: ${T};"></path>`).join(""),c=re?N:0,g=ne?"always":"bidirectional-only",v=Nr(a,{directionalDashes:h["directional-dash"]?{spacing:C,head:{length:S,width:S*Me,tipExtension:S*Ne}}:!1,turningPoints:h["turning-point"]?{offset:N,stemLength:H*Ot,head:{length:S,width:S*Me,tipExtension:S*Ne}}:!1,startArrows:h["start-arrow"]?{length:I,minLength:I*Gr,offset:c,offsetMode:g,head:{length:S,width:S*Me,tipExtension:S*Ne}}:!1,drawOrderNumbers:h["draw-order-number"]?{offset:0}:!1,midpointArrows:h["midpoint-arrow"]?{density:R,length:I*Ot,offset:c,offsetMode:g,head:{length:S,width:S*Me,tipExtension:S*Ne}}:!1}),Dt=pn(v,a),br=[...Dt.filter(p=>p.kind!=="draw-order-number"),...Dt.filter(p=>p.kind==="draw-order-number")].map(Sn).join("");m.setAttribute("viewBox",`0 0 ${t} ${r}`),m.style.setProperty("--formation-arrow-color",se),m.style.setProperty("--formation-arrow-stroke-width",String(F)),m.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${t}" height="${r}"></rect>
    ${yn(e,t,n)}
    ${i}
    ${l}
    ${br}
    ${d}
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `,X=Array.from(m.querySelectorAll(".writing-app__stroke-trace")),ue=Array.from(m.querySelectorAll(".writing-app__stroke-demo")),de=m.querySelector("#trace-cursor"),E=m.querySelector("#demo-nib"),le=X.map(p=>{const $=p.getTotalLength();return Number.isFinite($)&&$>0?$:.001}),tt=ue.map(p=>{const $=p.getTotalLength();return Number.isFinite($)&&$>0?$:.001}),X.forEach((p,$)=>{const z=le[$]??.001;p.style.strokeDasharray=`${z} ${z}`,p.style.strokeDashoffset=`${z}`}),ue.forEach((p,$)=>{const z=tt[$]??.001;p.style.strokeDasharray=`${z} ${z}`,p.style.strokeDashoffset=`${z}`}),E&&(E.style.opacity="0"),at(!1),U()},Ut=()=>{nt(),et=null,W=null,x=null,D=null,X=[],le=[],de=null,ue=[],tt=[],E=null,m.innerHTML="",at(!1)},it=e=>{if(nt(),P=Sr(e),ge.value=P,Lt(),P.length===0){Ut();return}let t;try{t=vr(P,{joinSpacing:o,keepInitialLeadIn:ee,keepFinalLeadOut:te})}catch{Ut();return}et=t.path,_n(t.path,t.width,t.height,t.offsetY)},An=()=>{ot=$r(ot);const e=Mt[ot]??Mt[0];it(e)},kn=e=>{ce||!x||D!==null||!x.beginAt(zt(m,e))||(e.preventDefault(),D=e.pointerId,m.setPointerCapture(e.pointerId),U())},Pn=e=>{ce||!x||e.pointerId!==D||(e.preventDefault(),x.update(zt(m,e)),U())},Tn=e=>{!x||e.pointerId!==D||(x.end(),m.hasPointerCapture(e.pointerId)&&m.releasePointerCapture(e.pointerId),D=null,U())},$n=e=>{e.pointerId===D&&(x==null||x.end(),m.hasPointerCapture(e.pointerId)&&m.releasePointerCapture(e.pointerId),D=null,U())};m.addEventListener("pointerdown",kn);m.addEventListener("pointermove",Pn);m.addEventListener("pointerup",Tn);m.addEventListener("pointercancel",$n);oe.addEventListener("click",vn);Kt.addEventListener("click",An);ge.addEventListener("input",()=>{it(ge.value)});const u=()=>{mr(),Lt(),it(P)};pe.addEventListener("input",()=>{M=Number(pe.value),u()});me.addEventListener("input",()=>{T=Number(me.value),u()});Se.addEventListener("input",()=>{G=Number(Se.value),u()});Ve.addEventListener("input",()=>{const e=De(Ve.value);e&&(K=e,u())});We.addEventListener("change",()=>{j=We.checked,u()});Ue.addEventListener("change",()=>{J=Ue.checked,u()});ze.addEventListener("change",()=>{Z=ze.checked,u()});Be.addEventListener("change",()=>{Q=Be.checked,u()});fe.addEventListener("input",()=>{o={...o,targetBendRate:Number(fe.value)},u()});ye.addEventListener("input",()=>{o={...o,minSidebearingGap:Number(ye.value)},u()});we.addEventListener("input",()=>{o={...o,bendSearchMinSidebearingGap:Number(we.value)},u()});be.addEventListener("input",()=>{o={...o,bendSearchMaxSidebearingGap:Number(be.value)},u()});xe.addEventListener("input",()=>{o={...o,exitHandleScale:Number(xe.value)},u()});ve.addEventListener("input",()=>{o={...o,entryHandleScale:Number(ve.value)},u()});Xe.addEventListener("change",()=>{ee=Xe.checked,u()});Ye.addEventListener("change",()=>{te=Ye.checked,u()});_e.addEventListener("input",()=>{R=Number(_e.value),u()});Ae.addEventListener("input",()=>{C=Number(Ae.value),u()});ke.addEventListener("input",()=>{N=Number(ke.value),u()});Pe.addEventListener("input",()=>{H=Number(Pe.value),u()});Te.addEventListener("input",()=>{I=Number(Te.value),u()});$e.addEventListener("input",()=>{S=Number($e.value),u()});Le.addEventListener("input",()=>{F=Number(Le.value),u()});Ie.addEventListener("input",()=>{q=Number(Ie.value),u()});Ee.addEventListener("input",()=>{O=Number(Ee.value),u()});Ke.addEventListener("change",()=>{re=Ke.checked,u()});je.addEventListener("change",()=>{ne=je.checked,u()});Je.addEventListener("input",()=>{const e=De(Je.value);e&&(ae=e,u())});Ze.addEventListener("input",()=>{const e=De(Ze.value);e&&(ie=e,u())});Qe.addEventListener("input",()=>{const e=De(Qe.value);e&&(se=e,u())});$t.forEach(e=>{e.addEventListener("change",()=>{const t=e.dataset.annotationKind;t&&(h={...h,[t]:e.checked},u())})});Ur();it(P);
