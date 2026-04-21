import{b as qe,c as Ze,a as Ke,g as Je,d as Qe,e as et,f as tt}from"./shared-DABULQv_.js";import{c as rt,a as at}from"./annotations-CpwQs16K.js";const $e=26,it=22,nt=11,Le=.42,ue=.36/Le,ot=.18/Le,O=it/$e,D=nt/$e,Pe=4,U=6.5,st=U/2,lt={"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0},ct={"directional-dash":!1,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},dt=(e,r,t)=>{if(!Object.values(t.visibility).some(Boolean))return"";const i=Math.max(0,t.uTurnLength),o=Math.max(0,t.arrowLength),s=Math.max(0,t.arrowHeadSize),l=t.offsetArrowLanes?t.turnRadius:0,d=t.alwaysOffsetArrowLanes?"always":"bidirectional-only",c=rt(r,{directionalDashes:t.visibility["directional-dash"]?{spacing:t.directionalDashSpacing,head:{length:s,width:s*O,tipExtension:s*D}}:!1,turningPoints:t.visibility["turning-point"]?{offset:t.turnRadius,stemLength:i*ue,head:{length:s,width:s*O,tipExtension:s*D}}:!1,startArrows:t.visibility["start-arrow"]?{length:o,minLength:o*ot,offset:l,offsetMode:d,head:{length:s,width:s*O,tipExtension:s*D}}:!1,drawOrderNumbers:t.visibility["draw-order-number"]?{offset:0}:!1,midpointArrows:t.visibility["midpoint-arrow"]?{density:t.midpointDensity,length:o*ue,offset:l,offsetMode:d,head:{length:s,width:s*O,tipExtension:s*D}}:!1}),h=Dt(c,r,t.visibility);return[...h.filter(m=>m.kind!=="draw-order-number"),...h.filter(m=>m.kind==="draw-order-number")].map(m=>Ct(m,t)).join("")},ht=e=>e.map(r=>`${r.x} ${r.y}`).join(" "),ut=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),pt=e=>`writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${e.kind}`,gt=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(r=>r!==void 0),wt=e=>e.kind==="start-arrow"||e.kind==="midpoint-arrow",Z=e=>e.kind==="turning-point",ft=e=>e.kind==="draw-order-number",pe=e=>"distance"in e.source?e.source.distance:e.source.turnDistance,re=e=>e.strokes.reduce((r,t)=>r+t.totalLength,0),mt=(e,r)=>{if(e.length===0)return{x:0,y:0};for(let a=1;a<e.length;a+=1){const i=e[a-1],o=e[a];if(!(!i||!o)&&o.distanceAlongStroke>=r){const s=o.distanceAlongStroke-i.distanceAlongStroke,l=s>0?(r-i.distanceAlongStroke)/s:0;return{x:i.x+(o.x-i.x)*l,y:i.y+(o.y-i.y)*l}}}const t=e[e.length-1];return t?{x:t.x,y:t.y}:{x:0,y:0}},W=(e,r)=>{let t=r;for(let a=0;a<e.strokes.length;a+=1){const i=e.strokes[a];if(i){if(t<=i.totalLength||a===e.strokes.length-1)return mt(i.samples,Math.max(0,Math.min(t,i.totalLength)));t-=i.totalLength}}return{x:0,y:0}},ae=e=>{const r=Math.hypot(e.x,e.y);return r>0?{x:e.x/r,y:e.y/r}:{x:1,y:0}},ge=(e,r,t="center")=>{const a=re(e),i=Math.max(0,Math.min(r,a)),o=W(e,i),s=Math.min(8,Math.max(2,a/200));let l=Math.max(0,i-s),d=Math.min(a,i+s);t==="forward"?l=i:t==="backward"&&(d=i),Math.abs(d-l)<.001&&(i<=s?d=Math.min(a,i+s):l=Math.max(0,i-s));const c=W(e,l),h=W(e,d);return{point:o,tangent:ae({x:h.x-c.x,y:h.y-c.y})}},_=(e,r)=>Math.hypot(e.x-r.x,e.y-r.y),St=(e,r)=>(e.x-r.x)*(e.x-r.x)+(e.y-r.y)*(e.y-r.y),bt=(e,r,t)=>({x:e.x+(r.x-e.x)*t,y:e.y+(r.y-e.y)*t}),kt=(e,r)=>{const t={x:-e.tangent.y,y:e.tangent.x};return{x:e.point.x+t.x*r,y:e.point.y+t.y*r}},Te=(e,r)=>{const t=Math.cos(r),a=Math.sin(r);return{x:e.x*t-e.y*a,y:e.x*a+e.y*t}},v=(e,r,t,a)=>{const i=Te({x:e.x-r.x,y:e.y-r.y},a);return{x:t.x+i.x,y:t.y+i.y}},xt=(e,r,t,a,i)=>{const o=1-i,s=o*o,l=i*i;return{x:s*o*e.x+3*s*i*r.x+3*o*l*t.x+l*i*a.x,y:s*o*e.y+3*s*i*r.y+3*o*l*t.y+l*i*a.y}},G=(e,r)=>{const t=e[e.length-1];(!t||_(t,r)>.25)&&e.push(r)},yt=(e,r)=>{const t=_(e,r),a=Math.max(1,Math.ceil(t/Pe)),i=[];for(let o=1;o<=a;o+=1)i.push(bt(e,r,o/a));return i},vt=e=>{const r=[];let t=null;return e.forEach(a=>{if(a.type==="move"){t=a.to,G(r,a.to);return}if(!t){t=a.to,G(r,a.to);return}if(a.type==="line"){yt(t,a.to).forEach(s=>G(r,s)),t=a.to;return}const i=_(t,a.cp1)+_(a.cp1,a.cp2)+_(a.cp2,a.to),o=Math.max(3,Math.ceil(i/Pe));for(let s=1;s<=o;s+=1)G(r,xt(t,a.cp1,a.cp2,a.to,s/o));t=a.to}),r},we=e=>{var o;const r=vt(e.commands),t=(o=e.head)==null?void 0:o.polygon,i=[...r,...t??[]].reduce((s,l)=>({minX:Math.min(s.minX,l.x),minY:Math.min(s.minY,l.y),maxX:Math.max(s.maxX,l.x),maxY:Math.max(s.maxY,l.y)}),{minX:Number.POSITIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY});return{pathPoints:r,...t?{headPolygon:t}:{},bounds:i}},_t=(e,r,t)=>e.minX<=r.maxX+t&&e.maxX+t>=r.minX&&e.minY<=r.maxY+t&&e.maxY+t>=r.minY,At=(e,r,t)=>{const a=t.x-r.x,i=t.y-r.y,o=a*a+i*i;if(o===0)return _(e,r);const s=Math.max(0,Math.min(1,((e.x-r.x)*a+(e.y-r.y)*i)/o));return _(e,{x:r.x+a*s,y:r.y+i*s})},$t=(e,r)=>r.reduce((t,a,i)=>{const o=r[(i+1)%r.length];return o?Math.min(t,At(e,a,o)):t},Number.POSITIVE_INFINITY),K=(e,r)=>{let t=!1;for(let a=0,i=r.length-1;a<r.length;i=a,a+=1){const o=r[a],s=r[i];if(!o||!s)continue;o.y>e.y!=s.y>e.y&&e.x<(s.x-o.x)*(e.y-o.y)/(s.y-o.y)+o.x&&(t=!t)}return t},C=(e,r,t)=>(r.y-e.y)*(t.x-r.x)-(r.x-e.x)*(t.y-r.y),N=(e,r,t)=>e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y),Lt=(e,r,t,a)=>{const i=C(e,r,t),o=C(e,r,a),s=C(t,a,e),l=C(t,a,r);return i*o<0&&s*l<0?!0:Math.abs(i)<.001&&N(t,e,r)||Math.abs(o)<.001&&N(a,e,r)||Math.abs(s)<.001&&N(e,t,a)||Math.abs(l)<.001&&N(r,t,a)},Pt=(e,r)=>{if(e.length<3||r.length<3)return!1;const t=e.some((o,s)=>{const l=e[(s+1)%e.length];return!!l&&r.some((d,c)=>{const h=r[(c+1)%r.length];return!!h&&Lt(o,l,d,h)})}),a=e[0],i=r[0];return t||!!a&&K(a,r)||!!i&&K(i,e)},Tt=(e,r)=>{const t=U*U;return e.some(a=>r.some(i=>St(a,i)<=t))},fe=(e,r)=>r.length>=3&&e.some(t=>K(t,r)||$t(t,r)<=st),J=(e,r,t)=>{const a=t.get(e)??we(e),i=t.get(r)??we(r);return t.set(e,a),t.set(r,i),a.pathPoints.length===0&&!a.headPolygon||i.pathPoints.length===0&&!i.headPolygon||!_t(a.bounds,i.bounds,U)?!1:Tt(a.pathPoints,i.pathPoints)||(a.headPolygon?fe(i.pathPoints,a.headPolygon):!1)||(i.headPolygon?fe(a.pathPoints,i.headPolygon):!1)||(a.headPolygon&&i.headPolygon?Pt(a.headPolygon,i.headPolygon):!1)},me=(e,r)=>{const t=W(r,e.source.turnDistance);return Math.min(Math.abs(t.y-r.bounds.minY),Math.abs(r.bounds.maxY-t.y))},It=(e,r,t)=>{const a=me(e,t)-me(r,t);return Math.abs(a)>.001?a:e.source.turnDistance-r.source.turnDistance},Mt=(e,r,t,a)=>e.type==="move"?{type:"move",to:v(e.to,r,t,a)}:e.type==="line"?{type:"line",to:v(e.to,r,t,a)}:{type:"cubic",cp1:v(e.cp1,r,t,a),cp2:v(e.cp2,r,t,a),to:v(e.to,r,t,a)},Rt=(e,r)=>{const t=re(r),a=ge(r,e.source.turnDistance,"forward"),i=Math.max(e.source.turnDistance,Math.min(t,e.source.endDistance)),o=ge(r,i,"backward"),s=a.point,l=o.point,d=Math.atan2(o.tangent.y,o.tangent.x)-Math.atan2(a.tangent.y,a.tangent.x),c=i-e.source.turnDistance;return{annotation:{...e,commands:e.commands.map(h=>Mt(h,s,l,d)),...e.head?{head:{tip:v(e.head.tip,s,l,d),direction:ae(Te(e.head.direction,d)),polygon:e.head.polygon.map(h=>v(h,s,l,d))}}:{},source:{...e.source,startDistance:Math.min(t,e.source.startDistance+c),turnDistance:i,endDistance:Math.min(t,e.source.endDistance+c)}},distanceShift:c,targetDistance:i,targetPose:o}},Et=(e,r,t)=>({...e,point:r.targetPose.point,anchor:kt(r.targetPose,e.metrics.offset),direction:r.targetPose.tangent,source:{...e.source,startDistance:Math.min(t,e.source.startDistance+r.distanceShift),endDistance:Math.min(t,e.source.endDistance+r.distanceShift),distance:r.targetDistance}}),Ot=(e,r)=>{const t=e.filter(Z);if(t.length<2)return e;const a=new Map,i=new Map,o=[...t].sort((c,h)=>It(c,h,r)),s=[];if(o.forEach(c=>{if(s.some(m=>J(c,m,a))){i.set(c,Rt(c,r));return}s.push(c)}),i.size===0)return e;const l=re(r),d=new Map;return i.forEach((c,h)=>{d.set(h.source.sectionIndex,c)}),e.map(c=>{var h;if(Z(c))return((h=i.get(c))==null?void 0:h.annotation)??c;if(ft(c)){const m=d.get(c.source.sectionIndex);return m?Et(c,m,l):c}return c})},Dt=(e,r,t)=>{const a=Ot(e.filter(c=>t[c.kind]),r),i=a.filter(Z),o=a.filter(wt).sort((c,h)=>pe(c)-pe(h)),s=new Map,l=[],d=new Set;return o.forEach(c=>{if(i.some(T=>J(c,T,s))){d.add(c);return}if(l.some(T=>J(c,T,s))){d.add(c);return}l.push(c)}),a.filter(c=>!d.has(c))},Gt=(e,r)=>{const t=ae(e.direction);return{x:e.anchor.x+t.x*r.numberPathOffset,y:e.anchor.y+t.y*r.numberPathOffset}},Ct=(e,r)=>{if(!r.visibility[e.kind])return"";if(e.kind==="draw-order-number"){const t=Gt(e,r);return`
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${t.x}"
          y="${t.y}"
          fill="${r.numberColor}"
          font-size="${r.numberSize}"
          text-anchor="middle"
          dominant-baseline="central"
        >${ut(e.text)}</text>
      </g>
    `}return`
    <path
      class="${pt(e)}"
      d="${at(e.commands)}"
      stroke-width="${r.arrowStrokeWidth}"
    ></path>
    ${gt(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${e.kind}" points="${ht(t.polygon)}"></polygon>`).join("")}
  `},Ie="zephyr",Nt=96,Ht=320,Me=13,Wt=53,Ft=53,zt=26,jt=5.6,Ut=Me*2,Bt=0,Vt="#3f454b",Yt="#ffffff",Xt="#83b0dd",qt="#d5dbe2",Re=24,Ee=1,Oe=54,De=1,Ge="#ffb35c",ie=100,Zt=178,Kt=.63,Jt=.66,H=2,Se="http://www.w3.org/2000/svg",Qt=`
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
`,y={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},er=["text","word","previewZoom","practiceSize","practiceRepeats","strokeWidth","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","showBaselineGuide","showXHeightGuide","showAscenderGuide","showDescenderGuide","gridlineStrokeWidth","gridlineColor","keepInitialLeadIn","keepFinalLeadOut","topDirectionalDashSpacing","topMidpointDensity","topTurnRadius","topUTurnLength","topArrowLength","topArrowHeadSize","topArrowStrokeWidth","topNumberSize","topNumberPathOffset","topOffsetArrowLanes","topAlwaysOffsetArrowLanes","topStrokeColor","topNumberColor","topArrowColor","topDirectionalDash","topTurningPoint","topStartArrow","topDrawOrderNumber","topMidpointArrow","practiceDirectionalDashSpacing","practiceMidpointDensity","practiceTurnRadius","practiceUTurnLength","practiceArrowLength","practiceArrowHeadSize","practiceArrowStrokeWidth","practiceNumberSize","practiceNumberPathOffset","practiceOffsetArrowLanes","practiceAlwaysOffsetArrowLanes","practiceStrokeColor","practiceNumberColor","practiceArrowColor","practiceDirectionalDash","practiceTurningPoint","practiceStartArrow","practiceDrawOrderNumber","practiceMidpointArrow"],tr=["directionalDashSpacing","midpointDensity","turnRadius","uTurnLength","arrowLength","arrowHeadSize","arrowStrokeWidth","numberSize","numberPathOffset"],rr=["offsetArrowLanes","alwaysOffsetArrowLanes"],ar=["strokeColor","numberColor","arrowColor"],Ce={"directional-dash":"DirectionalDash","turning-point":"TurningPoint","start-arrow":"StartArrow","draw-order-number":"DrawOrderNumber","midpoint-arrow":"MidpointArrow"},ne=document.querySelector("#app");if(!ne)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");ne.classList.add("worksheet-root");const Q=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),be=(e,r)=>({directionalDashSpacing:Nt,midpointDensity:Ht,turnRadius:Me,uTurnLength:Wt,arrowLength:Ft,arrowHeadSize:zt,arrowStrokeWidth:jt,numberSize:Ut,numberPathOffset:Bt,numberColor:Vt,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:Q(e),arrowColor:Yt,strokeColor:r}),oe=()=>({text:Ie,previewZoom:ie,practiceRowHeightMm:Re,practiceRepeatCount:Ee,strokeWidth:Oe,joinSpacing:{...y},showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!1,showDescenderGuide:!1,gridlineStrokeWidth:De,gridlineColor:Ge,keepInitialLeadIn:!0,keepFinalLeadOut:!0,top:be(lt,Xt),practice:be(ct,qt)}),u=oe();let n=oe();ne.innerHTML=`
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
            value="${Ie}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${f({id:"preview-zoom-slider",label:"Preview zoom",value:ie,min:50,max:200,step:5,valueId:"preview-zoom-value"})}

        ${f({id:"practice-size-slider",label:"Practice size",value:Re,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${f({id:"practice-repeat-slider",label:"Practice repeats",value:Ee,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${f({id:"stroke-width-slider",label:"Main stroke thickness",value:Oe,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        ${nr()}

        ${ir()}

        ${ke("top","Top word annotations",n.top)}
        ${ke("practice","Practice annotations",n.practice)}

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
`;const Y=document.querySelector("#worksheet-text-input"),L=document.querySelector("#preview-zoom-slider"),M=document.querySelector("#practice-size-slider"),R=document.querySelector("#practice-repeat-slider"),E=document.querySelector("#stroke-width-slider"),Ne=document.querySelector("#print-worksheet-button"),F=document.querySelector("#download-png-button"),He=document.querySelector("#worksheet-page-frame"),b=document.querySelector("#worksheet-page"),A=document.querySelector("#worksheet-status");if(!Y||!L||!M||!R||!E||!Ne||!F||!He||!b||!A)throw new Error("Missing elements for cursive worksheet generator.");const se=Array.from(document.querySelectorAll("[data-global-setting]")),le=Array.from(document.querySelectorAll("[data-scope][data-setting]")),We=Array.from(document.querySelectorAll("[data-scope][data-annotation-kind]"));function f({id:e,label:r,value:t,min:a,max:i,step:o,valueId:s=`${e}-value`,attrs:l=""}){return`
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
        max="${i}"
        step="${o}"
        value="${t}"
        ${l}
      />
    </label>
  `}function ir(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${f({id:"target-bend-rate-slider",label:"Target maximum bend rate",value:y.targetBendRate,min:0,max:60,step:1,valueId:"target-bend-rate-value",attrs:'data-global-setting="targetBendRate"'})}
        ${f({id:"min-sidebearing-gap-slider",label:"Minimum sidebearing gap",value:y.minSidebearingGap,min:-300,max:200,step:5,valueId:"min-sidebearing-gap-value",attrs:'data-global-setting="minSidebearingGap"'})}
        ${f({id:"bend-search-min-sidebearing-gap-slider",label:"Search minimum sidebearing gap",value:y.bendSearchMinSidebearingGap,min:-300,max:200,step:5,valueId:"bend-search-min-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMinSidebearingGap"'})}
        ${f({id:"bend-search-max-sidebearing-gap-slider",label:"Search maximum sidebearing gap",value:y.bendSearchMaxSidebearingGap,min:-100,max:300,step:5,valueId:"bend-search-max-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMaxSidebearingGap"'})}
        ${f({id:"exit-handle-scale-slider",label:"p0-p1 handle scale",value:y.exitHandleScale,min:0,max:2,step:.05,valueId:"exit-handle-scale-value",attrs:'data-global-setting="exitHandleScale"'})}
        ${f({id:"entry-handle-scale-slider",label:"p2-p3 handle scale",value:y.entryHandleScale,min:0,max:2,step:.05,valueId:"entry-handle-scale-value",attrs:'data-global-setting="entryHandleScale"'})}
        <fieldset class="worksheet-app__checks" aria-label="Advanced worksheet toggles">
          ${$("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${$("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
        </fieldset>
      </div>
    </details>
  `}function nr(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${f({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:De,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${or("gridline-color-picker","gridlineColor","Gridline colour",Ge)}
        <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
          ${$("show-baseline-guide","showBaselineGuide","Baseline",!0)}
          ${$("show-descender-guide","showDescenderGuide","Descender",!1)}
          ${$("show-x-height-guide","showXHeightGuide","X-height",!0)}
          ${$("show-ascender-guide","showAscenderGuide","Ascender",!1)}
        </fieldset>
      </div>
    </details>
  `}function $(e,r,t,a){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${r}"
        ${a?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}function or(e,r,t,a){return`
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
  `}function ke(e,r,t){return`
    <details class="worksheet-app__details" open>
      <summary>${r}</summary>
      <div class="worksheet-app__details-body">
        ${f({id:`${e}-directional-dash-spacing-slider`,label:"Directional dash spacing",value:t.directionalDashSpacing,min:80,max:220,step:4,valueId:`${e}-directional-dash-spacing-value`,attrs:`data-scope="${e}" data-setting="directionalDashSpacing"`})}
        ${f({id:`${e}-midpoint-density-slider`,label:"Midpoint density",value:t.midpointDensity,min:120,max:600,step:20,valueId:`${e}-midpoint-density-value`,attrs:`data-scope="${e}" data-setting="midpointDensity"`})}
        ${f({id:`${e}-turn-radius-slider`,label:"Turn radius",value:t.turnRadius,min:0,max:48,step:1,valueId:`${e}-turn-radius-value`,attrs:`data-scope="${e}" data-setting="turnRadius"`})}
        ${f({id:`${e}-u-turn-length-slider`,label:"U-turn length",value:t.uTurnLength,min:0,max:300,step:1,valueId:`${e}-u-turn-length-value`,attrs:`data-scope="${e}" data-setting="uTurnLength"`})}
        ${f({id:`${e}-arrow-length-slider`,label:"Other arrow length",value:t.arrowLength,min:0,max:300,step:1,valueId:`${e}-arrow-length-value`,attrs:`data-scope="${e}" data-setting="arrowLength"`})}
        ${f({id:`${e}-arrow-head-size-slider`,label:"Arrow head size",value:t.arrowHeadSize,min:0,max:64,step:1,valueId:`${e}-arrow-head-size-value`,attrs:`data-scope="${e}" data-setting="arrowHeadSize"`})}
        ${f({id:`${e}-arrow-stroke-width-slider`,label:"Arrow stroke width",value:t.arrowStrokeWidth,min:1,max:14,step:.5,valueId:`${e}-arrow-stroke-width-value`,attrs:`data-scope="${e}" data-setting="arrowStrokeWidth"`})}
        ${f({id:`${e}-number-size-slider`,label:"Number size",value:t.numberSize,min:8,max:72,step:1,valueId:`${e}-number-size-value`,attrs:`data-scope="${e}" data-setting="numberSize"`})}
        ${f({id:`${e}-number-offset-slider`,label:"Number offset",value:t.numberPathOffset,min:-80,max:80,step:1,valueId:`${e}-number-offset-value`,attrs:`data-scope="${e}" data-setting="numberPathOffset"`})}
        <fieldset class="worksheet-app__checks" aria-label="${r}">
          ${I(e,"directional-dash","Directional dash",t.visibility["directional-dash"])}
          ${I(e,"turning-point","Turns",t.visibility["turning-point"])}
          ${I(e,"start-arrow","Starts",t.visibility["start-arrow"])}
          ${I(e,"draw-order-number","Numbers",t.visibility["draw-order-number"])}
          ${I(e,"midpoint-arrow","Midpoints",t.visibility["midpoint-arrow"])}
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
        ${X(e,"strokeColor","Word stroke colour",t.strokeColor)}
        ${X(e,"numberColor","Number colour",t.numberColor)}
        ${X(e,"arrowColor","Arrow colour",t.arrowColor)}
      </div>
    </details>
  `}function X(e,r,t,a){return`
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
  `}function I(e,r,t,a){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${r}"
        ${a?"checked":""}
      />
      <span>${t}</span>
    </label>
  `}const ce=e=>e.trim().toLowerCase().replace(/\s+/g," "),Fe=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),de=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,ze=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,r=""]=e.step.split(".");return r.length},je=(e,r)=>{const t=e.min===""?Number.NEGATIVE_INFINITY:Number(e.min),a=e.max===""?Number.POSITIVE_INFINITY:Number(e.max),i=e.step===""||e.step==="any"?Number.NaN:Number(e.step),o=Number.isFinite(t)?t:0;let s=r;return Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number.isFinite(i)&&i>0&&(s=o+Math.round((s-o)/i)*i),Number.isFinite(t)&&(s=Math.max(t,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number(s.toFixed(ze(e)))},p=(e,r)=>{const t=je(e,r);return e.value=t.toFixed(ze(e)),t},k=(e,r)=>{const t=e.get(r);if(t===null)return null;const a=t.trim().toLowerCase();return["1","true","yes","on"].includes(a)?!0:["0","false","no","off"].includes(a)?!1:null},w=(e,r,t)=>{const a=e.get(r);if(a===null)return null;const i=Number(a);return Number.isFinite(i)?je(t,i):null},z=(e,r)=>de(e.get(r)??""),j=(e,r)=>`${e}${r.charAt(0).toUpperCase()}${r.slice(1)}`,xe=e=>{const r=P(e);le.forEach(t=>{if(t.dataset.scope!==e)return;const a=t.dataset.setting;a==="directionalDashSpacing"?r.directionalDashSpacing=p(t,r.directionalDashSpacing):a==="midpointDensity"?r.midpointDensity=p(t,r.midpointDensity):a==="turnRadius"?r.turnRadius=p(t,r.turnRadius):a==="uTurnLength"?r.uTurnLength=p(t,r.uTurnLength):a==="arrowLength"?r.arrowLength=p(t,r.arrowLength):a==="arrowHeadSize"?r.arrowHeadSize=p(t,r.arrowHeadSize):a==="arrowStrokeWidth"?r.arrowStrokeWidth=p(t,r.arrowStrokeWidth):a==="numberSize"?r.numberSize=p(t,r.numberSize):a==="numberPathOffset"?r.numberPathOffset=p(t,r.numberPathOffset):a==="offsetArrowLanes"?t.checked=r.offsetArrowLanes:a==="alwaysOffsetArrowLanes"?t.checked=r.alwaysOffsetArrowLanes:a==="arrowColor"?t.value=r.arrowColor:a==="numberColor"?t.value=r.numberColor:a==="strokeColor"&&(t.value=r.strokeColor)}),We.forEach(t=>{if(t.dataset.scope!==e)return;const a=t.dataset.annotationKind;a&&(t.checked=r.visibility[a])})},sr=()=>{Y.value=n.text,n.previewZoom=p(L,n.previewZoom),n.practiceRowHeightMm=p(M,n.practiceRowHeightMm),n.practiceRepeatCount=p(R,n.practiceRepeatCount),n.strokeWidth=p(E,n.strokeWidth),se.forEach(e=>{const r=e.dataset.globalSetting;r==="targetBendRate"?n.joinSpacing.targetBendRate=p(e,n.joinSpacing.targetBendRate):r==="minSidebearingGap"?n.joinSpacing.minSidebearingGap=p(e,n.joinSpacing.minSidebearingGap):r==="bendSearchMinSidebearingGap"?n.joinSpacing.bendSearchMinSidebearingGap=p(e,n.joinSpacing.bendSearchMinSidebearingGap):r==="bendSearchMaxSidebearingGap"?n.joinSpacing.bendSearchMaxSidebearingGap=p(e,n.joinSpacing.bendSearchMaxSidebearingGap):r==="exitHandleScale"?n.joinSpacing.exitHandleScale=p(e,n.joinSpacing.exitHandleScale):r==="entryHandleScale"?n.joinSpacing.entryHandleScale=p(e,n.joinSpacing.entryHandleScale):r==="gridlineStrokeWidth"?n.gridlineStrokeWidth=p(e,n.gridlineStrokeWidth):r==="keepInitialLeadIn"?e.checked=n.keepInitialLeadIn:r==="keepFinalLeadOut"?e.checked=n.keepFinalLeadOut:r==="showBaselineGuide"?e.checked=n.showBaselineGuide:r==="showXHeightGuide"?e.checked=n.showXHeightGuide:r==="showAscenderGuide"?e.checked=n.showAscenderGuide:r==="showDescenderGuide"?e.checked=n.showDescenderGuide:r==="gridlineColor"&&(e.value=n.gridlineColor)}),xe("top"),xe("practice"),Be(),he()},ye=(e,r,t,a)=>{tr.forEach(i=>{t[i]!==a[i]&&e.searchParams.set(j(r,i),String(t[i]))}),rr.forEach(i=>{t[i]!==a[i]&&e.searchParams.set(j(r,i),t[i]?"1":"0")}),ar.forEach(i=>{t[i]!==a[i]&&e.searchParams.set(j(r,i),t[i])}),Object.entries(Ce).forEach(([i,o])=>{t.visibility[i]!==a.visibility[i]&&e.searchParams.set(`${r}${o}`,t.visibility[i]?"1":"0")})},Ue=()=>{const e=new URL(window.location.href);er.forEach(a=>{e.searchParams.delete(a)}),n.text!==u.text&&e.searchParams.set("text",n.text),n.previewZoom!==u.previewZoom&&e.searchParams.set("previewZoom",String(n.previewZoom)),n.practiceRowHeightMm!==u.practiceRowHeightMm&&e.searchParams.set("practiceSize",String(n.practiceRowHeightMm)),n.practiceRepeatCount!==u.practiceRepeatCount&&e.searchParams.set("practiceRepeats",String(n.practiceRepeatCount)),n.strokeWidth!==u.strokeWidth&&e.searchParams.set("strokeWidth",String(n.strokeWidth)),n.joinSpacing.targetBendRate!==u.joinSpacing.targetBendRate&&e.searchParams.set("targetBendRate",String(n.joinSpacing.targetBendRate)),n.joinSpacing.minSidebearingGap!==u.joinSpacing.minSidebearingGap&&e.searchParams.set("minSidebearingGap",String(n.joinSpacing.minSidebearingGap)),n.joinSpacing.bendSearchMinSidebearingGap!==u.joinSpacing.bendSearchMinSidebearingGap&&e.searchParams.set("bendSearchMinSidebearingGap",String(n.joinSpacing.bendSearchMinSidebearingGap)),n.joinSpacing.bendSearchMaxSidebearingGap!==u.joinSpacing.bendSearchMaxSidebearingGap&&e.searchParams.set("bendSearchMaxSidebearingGap",String(n.joinSpacing.bendSearchMaxSidebearingGap)),n.joinSpacing.exitHandleScale!==u.joinSpacing.exitHandleScale&&e.searchParams.set("exitHandleScale",String(n.joinSpacing.exitHandleScale)),n.joinSpacing.entryHandleScale!==u.joinSpacing.entryHandleScale&&e.searchParams.set("entryHandleScale",String(n.joinSpacing.entryHandleScale)),n.showBaselineGuide!==u.showBaselineGuide&&e.searchParams.set("showBaselineGuide",n.showBaselineGuide?"1":"0"),n.showXHeightGuide!==u.showXHeightGuide&&e.searchParams.set("showXHeightGuide",n.showXHeightGuide?"1":"0"),n.showAscenderGuide!==u.showAscenderGuide&&e.searchParams.set("showAscenderGuide",n.showAscenderGuide?"1":"0"),n.showDescenderGuide!==u.showDescenderGuide&&e.searchParams.set("showDescenderGuide",n.showDescenderGuide?"1":"0"),n.gridlineStrokeWidth!==u.gridlineStrokeWidth&&e.searchParams.set("gridlineStrokeWidth",String(n.gridlineStrokeWidth)),n.gridlineColor!==u.gridlineColor&&e.searchParams.set("gridlineColor",n.gridlineColor),n.keepInitialLeadIn!==u.keepInitialLeadIn&&e.searchParams.set("keepInitialLeadIn",n.keepInitialLeadIn?"1":"0"),n.keepFinalLeadOut!==u.keepFinalLeadOut&&e.searchParams.set("keepFinalLeadOut",n.keepFinalLeadOut?"1":"0"),ye(e,"top",n.top,u.top),ye(e,"practice",n.practice,u.practice);const r=`${e.pathname}${e.search}${e.hash}`,t=`${window.location.pathname}${window.location.search}${window.location.hash}`;r!==t&&window.history.replaceState(null,"",r)},ve=(e,r)=>{const t=P(r);le.forEach(a=>{if(a.dataset.scope!==r)return;const i=a.dataset.setting;if(!i)return;const o=j(r,i);i==="directionalDashSpacing"?t.directionalDashSpacing=w(e,o,a)??t.directionalDashSpacing:i==="midpointDensity"?t.midpointDensity=w(e,o,a)??t.midpointDensity:i==="turnRadius"?t.turnRadius=w(e,o,a)??t.turnRadius:i==="uTurnLength"?t.uTurnLength=w(e,o,a)??t.uTurnLength:i==="arrowLength"?t.arrowLength=w(e,o,a)??t.arrowLength:i==="arrowHeadSize"?t.arrowHeadSize=w(e,o,a)??t.arrowHeadSize:i==="arrowStrokeWidth"?t.arrowStrokeWidth=w(e,o,a)??t.arrowStrokeWidth:i==="numberSize"?t.numberSize=w(e,o,a)??t.numberSize:i==="numberPathOffset"?t.numberPathOffset=w(e,o,a)??t.numberPathOffset:i==="offsetArrowLanes"?t.offsetArrowLanes=k(e,o)??t.offsetArrowLanes:i==="alwaysOffsetArrowLanes"?t.alwaysOffsetArrowLanes=k(e,o)??t.alwaysOffsetArrowLanes:i==="arrowColor"?t.arrowColor=z(e,o)??t.arrowColor:i==="numberColor"?t.numberColor=z(e,o)??t.numberColor:i==="strokeColor"&&(t.strokeColor=z(e,o)??t.strokeColor)}),Object.entries(Ce).forEach(([a,i])=>{t.visibility={...t.visibility,[a]:k(e,`${r}${i}`)??t.visibility[a]}})},lr=()=>{const e=new URLSearchParams(window.location.search);n=oe();const r=e.get("text")??e.get("word");r!==null&&(n.text=ce(r)),n.previewZoom=w(e,"previewZoom",L)??n.previewZoom,n.practiceRowHeightMm=w(e,"practiceSize",M)??n.practiceRowHeightMm,n.practiceRepeatCount=w(e,"practiceRepeats",R)??n.practiceRepeatCount,n.strokeWidth=w(e,"strokeWidth",E)??n.strokeWidth,se.forEach(t=>{const a=t.dataset.globalSetting;a==="targetBendRate"?n.joinSpacing.targetBendRate=w(e,a,t)??n.joinSpacing.targetBendRate:a==="minSidebearingGap"?n.joinSpacing.minSidebearingGap=w(e,a,t)??n.joinSpacing.minSidebearingGap:a==="bendSearchMinSidebearingGap"?n.joinSpacing.bendSearchMinSidebearingGap=w(e,a,t)??n.joinSpacing.bendSearchMinSidebearingGap:a==="bendSearchMaxSidebearingGap"?n.joinSpacing.bendSearchMaxSidebearingGap=w(e,a,t)??n.joinSpacing.bendSearchMaxSidebearingGap:a==="exitHandleScale"?n.joinSpacing.exitHandleScale=w(e,a,t)??n.joinSpacing.exitHandleScale:a==="entryHandleScale"?n.joinSpacing.entryHandleScale=w(e,a,t)??n.joinSpacing.entryHandleScale:a==="gridlineStrokeWidth"?n.gridlineStrokeWidth=w(e,a,t)??n.gridlineStrokeWidth:a==="keepInitialLeadIn"?n.keepInitialLeadIn=k(e,a)??n.keepInitialLeadIn:a==="keepFinalLeadOut"?n.keepFinalLeadOut=k(e,a)??n.keepFinalLeadOut:a==="showBaselineGuide"?n.showBaselineGuide=k(e,a)??n.showBaselineGuide:a==="showXHeightGuide"?n.showXHeightGuide=k(e,a)??n.showXHeightGuide:a==="showAscenderGuide"?n.showAscenderGuide=k(e,a)??n.showAscenderGuide:a==="showDescenderGuide"?n.showDescenderGuide=k(e,a)??n.showDescenderGuide:a==="gridlineColor"&&(n.gridlineColor=z(e,a)??n.gridlineColor)}),ve(e,"top"),ve(e,"practice"),sr()},P=e=>n[e],cr=()=>Math.max(1,Math.floor(Zt/n.practiceRowHeightMm)),_e=e=>e.toFixed(2),g=(e,r)=>{const t=document.querySelector(`#${e}`);t&&(t.textContent=r)},he=()=>{g("preview-zoom-value",`${n.previewZoom}%`),g("practice-size-value",`${n.practiceRowHeightMm} mm`),g("practice-repeat-value",`${n.practiceRepeatCount}`),g("stroke-width-value",`${n.strokeWidth}px`),g("gridline-stroke-width-value",`${n.gridlineStrokeWidth.toFixed(1)}px`),g("target-bend-rate-value",`${n.joinSpacing.targetBendRate}`),g("min-sidebearing-gap-value",`${n.joinSpacing.minSidebearingGap}`),g("bend-search-min-sidebearing-gap-value",`${n.joinSpacing.bendSearchMinSidebearingGap}`),g("bend-search-max-sidebearing-gap-value",`${n.joinSpacing.bendSearchMaxSidebearingGap}`),g("exit-handle-scale-value",_e(n.joinSpacing.exitHandleScale)),g("entry-handle-scale-value",_e(n.joinSpacing.entryHandleScale)),["top","practice"].forEach(e=>{const r=P(e);g(`${e}-directional-dash-spacing-value`,`${r.directionalDashSpacing}px`),g(`${e}-midpoint-density-value`,`1 per ${r.midpointDensity}px`),g(`${e}-turn-radius-value`,`${r.turnRadius}px`),g(`${e}-u-turn-length-value`,`${r.uTurnLength}px`),g(`${e}-arrow-length-value`,`${r.arrowLength}px`),g(`${e}-arrow-head-size-value`,`${r.arrowHeadSize}px`),g(`${e}-arrow-stroke-width-value`,`${r.arrowStrokeWidth.toFixed(1)}px`),g(`${e}-number-size-value`,`${r.numberSize}px`),g(`${e}-number-offset-value`,`${r.numberPathOffset}px`)})},Be=()=>{He.style.setProperty("--worksheet-preview-scale",`${n.previewZoom/100}`)},ee=e=>{n.previewZoom=p(L,e),Be(),he(),Ue()},B=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),q=(e,r)=>{const t=e.map(r);return{avgMs:Number((t.reduce((a,i)=>a+i,0)/t.length).toFixed(3)),minMs:Number(Math.min(...t).toFixed(3)),maxMs:Number(Math.max(...t).toFixed(3))}},Ve=()=>({text:n.text,practiceRepeatCount:n.practiceRepeatCount,practiceRowHeightMm:n.practiceRowHeightMm,topVisibility:Q(n.top.visibility),practiceVisibility:Q(n.practice.visibility)}),dr=async(e={})=>{const r=Math.max(1,Math.floor(e.iterations??10)),t=Math.max(0,Math.floor(e.warmupRuns??2)),a=[];for(let i=0;i<t;i+=1)S(),await B();for(let i=0;i<r;i+=1){const o=performance.now();S();const s=performance.now();await B();const l=performance.now();a.push({renderMs:s-o,paintMs:l-s,totalMs:l-o})}return{iterations:r,state:Ve(),render:q(a,i=>i.renderMs),paint:q(a,i=>i.paintMs),total:q(a,i=>i.totalMs),runs:a}},hr=async(e,r)=>{const t=n.previewZoom;t!==e&&(ee(e),await B());try{return await r()}finally{t!==e&&(ee(t),await B())}},ur=(e,r,t)=>{const a=r.xHeight-r.baseline,i=t.xHeight-t.baseline,o=a!==0?i/a:1,s=t.baseline-r.baseline*o;return e*o+s},Ae=(e,r,t)=>{let a=t==="ascender"?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY,i=null;for(const o of e){if(o.trim()===""){i=null;continue}const s=o.toLowerCase(),l=i===null?Qe:et[i],d=Je(s,l);if(!d){i=null;continue}const c=d.guides,h=c==null?void 0:c[t];if(c&&typeof h=="number"){const m=ur(h,c,r);t==="ascender"?a=Math.min(a,m):a=Math.max(a,m)}i=tt[s]??"low"}return Number.isFinite(a)?a:null},x=(e,r)=>{const t=e.path.guides,a=n.strokeWidth/2,i=Math.abs(t.baseline-t.xHeight);if(r==="baseline")return t.baseline+e.offsetY+a;if(r==="xHeight")return t.xHeight+e.offsetY-a;if(r==="ascender"){const l=Ae(n.text,t,"ascender");return l!==null?l+e.offsetY-a:(t.ascender??t.xHeight-i*Kt)+e.offsetY-a}const o=Ae(n.text,t,"descender");return o!==null?o+e.offsetY+a:(t.descender??t.baseline+i*Jt)+e.offsetY+a},Ye=(e,r)=>`
  ${n.showBaselineGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--baseline"
      x1="0"
      y1="${x(e,"baseline")}"
      x2="${r}"
      y2="${x(e,"baseline")}"
    ></line>
  `:""}
  ${n.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${x(e,"descender")}"
      x2="${r}"
      y2="${x(e,"descender")}"
    ></line>
  `:""}
  ${n.showXHeightGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--midline"
      x1="0"
      y1="${x(e,"xHeight")}"
      x2="${r}"
      y2="${x(e,"xHeight")}"
    ></line>
  `:""}
  ${n.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${x(e,"ascender")}"
      x2="${r}"
      y2="${x(e,"ascender")}"
    ></line>
  `:""}
`,Xe=(e,r,t)=>{const i=e.path.strokes.filter(s=>s.type!=="lift").map(s=>`<path class="worksheet-word__stroke" d="${Ke(s.curves)}"></path>`).join(""),o=dt(e.path,r,t);return`
    ${i}
    ${o}
  `},pr=(e,r,t,a,i)=>{const o=Xe(e,r,t);return`
    <svg
      class="${a}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Fe(i)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${n.strokeWidth}; --worksheet-guide-color: ${n.gridlineColor}; --worksheet-guide-stroke-width: ${n.gridlineStrokeWidth};"
    >
      ${Ye(e,e.width)}
      ${o}
    </svg>
  `},gr=e=>{const r=e.path.bounds.maxX-e.path.bounds.minX,t=e.path.bounds.minX;return r+t},wr=(e,r,t,a,i)=>{const o=gr(e),s=e.width+o*(a-1),l=Xe(e,r,t),d=`practice-word-${i}`,c=Array.from({length:a},(h,m)=>{const T=m*o;return`<use href="#${d}" x="${T}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${s} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Fe(`${n.text} practice line, ${a} repeat${a===1?"":"s"}`)}"
      style="--formation-arrow-color: ${t.arrowColor}; --formation-arrow-stroke-width: ${t.arrowStrokeWidth}; --worksheet-word-stroke: ${t.strokeColor}; --worksheet-word-stroke-width: ${n.strokeWidth}; --worksheet-guide-color: ${n.gridlineColor}; --worksheet-guide-stroke-width: ${n.gridlineStrokeWidth};"
    >
      ${Ye(e,s)}
      <defs>
        <g id="${d}">
          ${l}
        </g>
      </defs>
      ${c}
    </svg>
  `},S=()=>{if(n={...n,text:ce(Y.value),practiceRowHeightMm:Number(M.value),practiceRepeatCount:Number(R.value),strokeWidth:Number(E.value)},he(),Ue(),n.text.length===0){b.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,A.textContent="";return}const e={joinSpacing:n.joinSpacing,keepInitialLeadIn:n.keepInitialLeadIn,keepFinalLeadOut:n.keepFinalLeadOut};let r;try{r=qe(n.text,e)}catch{b.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,A.textContent="This text could not be drawn.";return}const t=Ze(r.path),a=pr(r,t,n.top,"worksheet-word worksheet-word--top",`${n.text} with formation annotations`),i=cr(),o=Array.from({length:i},(s,l)=>wr(r,t,n.practice,n.practiceRepeatCount,l)).join("");b.style.setProperty("--practice-row-height",`${n.practiceRowHeightMm}mm`),b.innerHTML=`
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
  `,A.textContent=`${i} practice lines, ${n.practiceRepeatCount} repeat${n.practiceRepeatCount===1?"":"s"} per line`},fr=e=>new Promise((r,t)=>{const a=new Image;a.onload=()=>r(a),a.onerror=()=>t(new Error("Could not render worksheet image.")),a.src=e}),mr=(e,r)=>{const t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download=r,document.body.append(a),a.click(),a.remove(),URL.revokeObjectURL(t)},V=(e,r)=>{const t=e.getBoundingClientRect();return{x:t.left-r.left,y:t.top-r.top,width:t.width,height:t.height}},te=(e,r,t,a,i,o)=>{e.save(),e.beginPath(),e.strokeStyle=i,e.lineWidth=o,e.moveTo(r,a),e.lineTo(t,a),e.stroke(),e.restore()},Sr=(e,r)=>{e.save(),e.fillStyle="#23313d",e.font="700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textBaseline="alphabetic",b.querySelectorAll(".worksheet-page__meta-line span").forEach(t=>{var l;const a=V(t,r),i=((l=t.textContent)==null?void 0:l.trim())??"",o=a.y+a.height-3;e.fillText(i,a.x,o);const s=a.x+e.measureText(i).width+15;te(e,s,a.x+a.width,a.y+a.height-1,"#cfd6dc",1.3)}),e.restore()},br=e=>{const r=e.cloneNode(!0);r.setAttribute("xmlns",Se);const t=document.createElementNS(Se,"style");return t.textContent=Qt,r.insertBefore(t,r.firstChild),new XMLSerializer().serializeToString(r)},kr=async(e,r,t)=>{const a=V(r,t),i=br(r),o=URL.createObjectURL(new Blob([i],{type:"image/svg+xml;charset=utf-8"}));try{const s=await fr(o);e.drawImage(s,a.x,a.y,a.width,a.height)}finally{URL.revokeObjectURL(o)}},xr=async()=>await hr(ie,async()=>{S();const e=b.getBoundingClientRect(),r=Math.ceil(e.width),t=Math.ceil(e.height),a=document.createElement("canvas");a.width=r*H,a.height=t*H;const i=a.getContext("2d");if(!i)throw new Error("Could not prepare worksheet image.");i.fillStyle="#ffffff",i.fillRect(0,0,a.width,a.height),i.scale(H,H),Sr(i,e);for(const s of b.querySelectorAll(".worksheet-word"))await kr(i,s,e);const o=b.querySelector(".worksheet-page__example");if(o){const s=V(o,e);te(i,s.x,s.x+s.width,s.y+s.height-1,"#d7dde2",1.3)}return b.querySelectorAll(".worksheet-word--practice").forEach(s=>{const l=V(s,e);te(i,l.x,l.x+l.width,l.y+l.height-.6,"#d7dde2",1.1)}),await new Promise((s,l)=>{a.toBlob(d=>{d?s(d):l(new Error("Could not encode worksheet image."))},"image/png")})});Y.addEventListener("input",S);L.addEventListener("input",()=>{ee(Number(L.value))});M.addEventListener("input",S);R.addEventListener("input",S);E.addEventListener("input",S);Ne.addEventListener("click",()=>{S(),window.print()});F.addEventListener("click",()=>{F.disabled=!0,A.textContent="Preparing PNG...",xr().then(e=>{const r=ce(n.text).replaceAll(/\s+/g,"-")||"worksheet";mr(e,`${r}-cursive-worksheet.png`),A.textContent="PNG downloaded."}).catch(e=>{A.textContent=e instanceof Error?e.message:"Could not download PNG."}).finally(()=>{F.disabled=!1})});se.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.globalSetting;if(r==="targetBendRate"||r==="minSidebearingGap"||r==="bendSearchMinSidebearingGap"||r==="bendSearchMaxSidebearingGap"||r==="exitHandleScale"||r==="entryHandleScale")n.joinSpacing={...n.joinSpacing,[r]:Number(e.value)};else if(r==="gridlineStrokeWidth")n.gridlineStrokeWidth=Number(e.value);else if(r==="keepInitialLeadIn")n.keepInitialLeadIn=e.checked;else if(r==="keepFinalLeadOut")n.keepFinalLeadOut=e.checked;else if(r==="showBaselineGuide")n.showBaselineGuide=e.checked;else if(r==="showXHeightGuide")n.showXHeightGuide=e.checked;else if(r==="showAscenderGuide")n.showAscenderGuide=e.checked;else if(r==="showDescenderGuide")n.showDescenderGuide=e.checked;else if(r==="gridlineColor"){const t=de(e.value);if(!t)return;n.gridlineColor=t}S()})});le.forEach(e=>{e.addEventListener("input",()=>{const r=e.dataset.scope,t=e.dataset.setting;if(!r||r!=="top"&&r!=="practice")return;const a=P(r);if(t==="directionalDashSpacing")a.directionalDashSpacing=Number(e.value);else if(t==="midpointDensity")a.midpointDensity=Number(e.value);else if(t==="turnRadius")a.turnRadius=Number(e.value);else if(t==="uTurnLength")a.uTurnLength=Number(e.value);else if(t==="arrowLength")a.arrowLength=Number(e.value);else if(t==="arrowHeadSize")a.arrowHeadSize=Number(e.value);else if(t==="arrowStrokeWidth")a.arrowStrokeWidth=Number(e.value);else if(t==="numberSize")a.numberSize=Number(e.value);else if(t==="numberPathOffset")a.numberPathOffset=Number(e.value);else if(t==="offsetArrowLanes")a.offsetArrowLanes=e.checked;else if(t==="alwaysOffsetArrowLanes")a.alwaysOffsetArrowLanes=e.checked;else if(t==="arrowColor"||t==="numberColor"||t==="strokeColor"){const i=de(e.value);if(!i)return;a[t]=i}S()})});We.forEach(e=>{e.addEventListener("change",()=>{const r=e.dataset.scope,t=e.dataset.annotationKind;!r||r!=="top"&&r!=="practice"||!t||(P(r).visibility={...P(r).visibility,[t]:e.checked},S())})});lr();S();window.__worksheetProfiler={getState:Ve,profileRender:dr};
