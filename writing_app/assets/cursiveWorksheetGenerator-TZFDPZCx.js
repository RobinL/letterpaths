import{b as Me,c as Re,d as Oe,h as De,i as Ne,j as Ce,k as He}from"./shared-F4opZx_N.js";import{c as Ge,a as We}from"./annotations-B9qpxeBj.js";const he=26,Fe=22,ze=11,pe=.42,te=.36/pe,Ue=.18/pe,S=Fe/he,A=ze/he,we=4,R=6.5,Ye=R/2,Be={"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0},Ve={"directional-dash":!1,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},qe=(e,t,r)=>{if(!Object.values(r.visibility).some(Boolean))return"";const a=Math.max(0,r.uTurnLength),o=Math.max(0,r.arrowLength),i=Math.max(0,r.arrowHeadSize),l=r.offsetArrowLanes?r.turnRadius:0,c=r.alwaysOffsetArrowLanes?"always":"bidirectional-only",d=Ge(t,{directionalDashes:r.visibility["directional-dash"]?{spacing:r.directionalDashSpacing,head:{length:i,width:i*S,tipExtension:i*A}}:!1,turningPoints:r.visibility["turning-point"]?{offset:r.turnRadius,stemLength:a*te,head:{length:i,width:i*S,tipExtension:i*A}}:!1,startArrows:r.visibility["start-arrow"]?{length:o,minLength:o*Ue,offset:l,offsetMode:c,head:{length:i,width:i*S,tipExtension:i*A}}:!1,drawOrderNumbers:r.visibility["draw-order-number"]?{offset:0}:!1,midpointArrows:r.visibility["midpoint-arrow"]?{density:r.midpointDensity,length:o*te,offset:l,offsetMode:c,head:{length:i,width:i*S,tipExtension:i*A}}:!1}),u=bt(d,t,r.visibility);return[...u.filter(w=>w.kind!=="draw-order-number"),...u.filter(w=>w.kind==="draw-order-number")].map(w=>xt(w,r)).join("")},je=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),Xe=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),Ze=e=>`writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${e.kind}`,Ke=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),Je=e=>e.kind==="start-arrow"||e.kind==="midpoint-arrow",W=e=>e.kind==="turning-point",Qe=e=>e.kind==="draw-order-number",re=e=>"distance"in e.source?e.source.distance:e.source.turnDistance,V=e=>e.strokes.reduce((t,r)=>t+r.totalLength,0),et=(e,t)=>{if(e.length===0)return{x:0,y:0};for(let n=1;n<e.length;n+=1){const a=e[n-1],o=e[n];if(!(!a||!o)&&o.distanceAlongStroke>=t){const i=o.distanceAlongStroke-a.distanceAlongStroke,l=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(o.x-a.x)*l,y:a.y+(o.y-a.y)*l}}}const r=e[e.length-1];return r?{x:r.x,y:r.y}:{x:0,y:0}},L=(e,t)=>{let r=t;for(let n=0;n<e.strokes.length;n+=1){const a=e.strokes[n];if(a){if(r<=a.totalLength||n===e.strokes.length-1)return et(a.samples,Math.max(0,Math.min(r,a.totalLength)));r-=a.totalLength}}return{x:0,y:0}},q=e=>{const t=Math.hypot(e.x,e.y);return t>0?{x:e.x/t,y:e.y/t}:{x:1,y:0}},ne=(e,t,r="center")=>{const n=V(e),a=Math.max(0,Math.min(t,n)),o=L(e,a),i=Math.min(8,Math.max(2,n/200));let l=Math.max(0,a-i),c=Math.min(n,a+i);r==="forward"?l=a:r==="backward"&&(c=a),Math.abs(c-l)<.001&&(a<=i?c=Math.min(n,a+i):l=Math.max(0,a-i));const d=L(e,l),u=L(e,c);return{point:o,tangent:q({x:u.x-d.x,y:u.y-d.y})}},x=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),tt=(e,t)=>(e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y),rt=(e,t,r)=>({x:e.x+(t.x-e.x)*r,y:e.y+(t.y-e.y)*r}),nt=(e,t)=>{const r={x:-e.tangent.y,y:e.tangent.x};return{x:e.point.x+r.x*t,y:e.point.y+r.y*t}},ge=(e,t)=>{const r=Math.cos(t),n=Math.sin(t);return{x:e.x*r-e.y*n,y:e.x*n+e.y*r}},k=(e,t,r,n)=>{const a=ge({x:e.x-t.x,y:e.y-t.y},n);return{x:r.x+a.x,y:r.y+a.y}},at=(e,t,r,n,a)=>{const o=1-a,i=o*o,l=a*a;return{x:i*o*e.x+3*i*a*t.x+3*o*l*r.x+l*a*n.x,y:i*o*e.y+3*i*a*t.y+3*o*l*r.y+l*a*n.y}},T=(e,t)=>{const r=e[e.length-1];(!r||x(r,t)>.25)&&e.push(t)},it=(e,t)=>{const r=x(e,t),n=Math.max(1,Math.ceil(r/we)),a=[];for(let o=1;o<=n;o+=1)a.push(rt(e,t,o/n));return a},ot=e=>{const t=[];let r=null;return e.forEach(n=>{if(n.type==="move"){r=n.to,T(t,n.to);return}if(!r){r=n.to,T(t,n.to);return}if(n.type==="line"){it(r,n.to).forEach(i=>T(t,i)),r=n.to;return}const a=x(r,n.cp1)+x(n.cp1,n.cp2)+x(n.cp2,n.to),o=Math.max(3,Math.ceil(a/we));for(let i=1;i<=o;i+=1)T(t,at(r,n.cp1,n.cp2,n.to,i/o));r=n.to}),t},ae=e=>{var o;const t=ot(e.commands),r=(o=e.head)==null?void 0:o.polygon,a=[...t,...r??[]].reduce((i,l)=>({minX:Math.min(i.minX,l.x),minY:Math.min(i.minY,l.y),maxX:Math.max(i.maxX,l.x),maxY:Math.max(i.maxY,l.y)}),{minX:Number.POSITIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY});return{pathPoints:t,...r?{headPolygon:r}:{},bounds:a}},st=(e,t,r)=>e.minX<=t.maxX+r&&e.maxX+r>=t.minX&&e.minY<=t.maxY+r&&e.maxY+r>=t.minY,lt=(e,t,r)=>{const n=r.x-t.x,a=r.y-t.y,o=n*n+a*a;if(o===0)return x(e,t);const i=Math.max(0,Math.min(1,((e.x-t.x)*n+(e.y-t.y)*a)/o));return x(e,{x:t.x+n*i,y:t.y+a*i})},dt=(e,t)=>t.reduce((r,n,a)=>{const o=t[(a+1)%t.length];return o?Math.min(r,lt(e,n,o)):r},Number.POSITIVE_INFINITY),F=(e,t)=>{let r=!1;for(let n=0,a=t.length-1;n<t.length;a=n,n+=1){const o=t[n],i=t[a];if(!o||!i)continue;o.y>e.y!=i.y>e.y&&e.x<(i.x-o.x)*(e.y-o.y)/(i.y-o.y)+o.x&&(r=!r)}return r},I=(e,t,r)=>(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y),P=(e,t,r)=>e.x<=Math.max(t.x,r.x)&&e.x>=Math.min(t.x,r.x)&&e.y<=Math.max(t.y,r.y)&&e.y>=Math.min(t.y,r.y),ct=(e,t,r,n)=>{const a=I(e,t,r),o=I(e,t,n),i=I(r,n,e),l=I(r,n,t);return a*o<0&&i*l<0?!0:Math.abs(a)<.001&&P(r,e,t)||Math.abs(o)<.001&&P(n,e,t)||Math.abs(i)<.001&&P(e,r,n)||Math.abs(l)<.001&&P(t,r,n)},ut=(e,t)=>{if(e.length<3||t.length<3)return!1;const r=e.some((o,i)=>{const l=e[(i+1)%e.length];return!!l&&t.some((c,d)=>{const u=t[(d+1)%t.length];return!!u&&ct(o,l,c,u)})}),n=e[0],a=t[0];return r||!!n&&F(n,t)||!!a&&F(a,e)},ht=(e,t)=>{const r=R*R;return e.some(n=>t.some(a=>tt(n,a)<=r))},ie=(e,t)=>t.length>=3&&e.some(r=>F(r,t)||dt(r,t)<=Ye),z=(e,t,r)=>{const n=r.get(e)??ae(e),a=r.get(t)??ae(t);return r.set(e,n),r.set(t,a),n.pathPoints.length===0&&!n.headPolygon||a.pathPoints.length===0&&!a.headPolygon||!st(n.bounds,a.bounds,R)?!1:ht(n.pathPoints,a.pathPoints)||(n.headPolygon?ie(a.pathPoints,n.headPolygon):!1)||(a.headPolygon?ie(n.pathPoints,a.headPolygon):!1)||(n.headPolygon&&a.headPolygon?ut(n.headPolygon,a.headPolygon):!1)},oe=(e,t)=>{const r=L(t,e.source.turnDistance);return Math.min(Math.abs(r.y-t.bounds.minY),Math.abs(t.bounds.maxY-r.y))},pt=(e,t,r)=>{const n=oe(e,r)-oe(t,r);return Math.abs(n)>.001?n:e.source.turnDistance-t.source.turnDistance},wt=(e,t,r,n)=>e.type==="move"?{type:"move",to:k(e.to,t,r,n)}:e.type==="line"?{type:"line",to:k(e.to,t,r,n)}:{type:"cubic",cp1:k(e.cp1,t,r,n),cp2:k(e.cp2,t,r,n),to:k(e.to,t,r,n)},gt=(e,t)=>{const r=V(t),n=ne(t,e.source.turnDistance,"forward"),a=Math.max(e.source.turnDistance,Math.min(r,e.source.endDistance)),o=ne(t,a,"backward"),i=n.point,l=o.point,c=Math.atan2(o.tangent.y,o.tangent.x)-Math.atan2(n.tangent.y,n.tangent.x),d=a-e.source.turnDistance;return{annotation:{...e,commands:e.commands.map(u=>wt(u,i,l,c)),...e.head?{head:{tip:k(e.head.tip,i,l,c),direction:q(ge(e.head.direction,c)),polygon:e.head.polygon.map(u=>k(u,i,l,c))}}:{},source:{...e.source,startDistance:Math.min(r,e.source.startDistance+d),turnDistance:a,endDistance:Math.min(r,e.source.endDistance+d)}},distanceShift:d,targetDistance:a,targetPose:o}},mt=(e,t,r)=>({...e,point:t.targetPose.point,anchor:nt(t.targetPose,e.metrics.offset),direction:t.targetPose.tangent,source:{...e.source,startDistance:Math.min(r,e.source.startDistance+t.distanceShift),endDistance:Math.min(r,e.source.endDistance+t.distanceShift),distance:t.targetDistance}}),ft=(e,t)=>{const r=e.filter(W);if(r.length<2)return e;const n=new Map,a=new Map,o=[...r].sort((d,u)=>pt(d,u,t)),i=[];if(o.forEach(d=>{if(i.some(w=>z(d,w,n))){a.set(d,gt(d,t));return}i.push(d)}),a.size===0)return e;const l=V(t),c=new Map;return a.forEach((d,u)=>{c.set(u.source.sectionIndex,d)}),e.map(d=>{var u;if(W(d))return((u=a.get(d))==null?void 0:u.annotation)??d;if(Qe(d)){const w=c.get(d.source.sectionIndex);return w?mt(d,w,l):d}return d})},bt=(e,t,r)=>{const n=ft(e.filter(d=>r[d.kind]),t),a=n.filter(W),o=n.filter(Je).sort((d,u)=>re(d)-re(u)),i=new Map,l=[],c=new Set;return o.forEach(d=>{if(a.some(y=>z(d,y,i))){c.add(d);return}if(l.some(y=>z(d,y,i))){c.add(d);return}l.push(d)}),n.filter(d=>!c.has(d))},kt=(e,t)=>{const r=q(e.direction);return{x:e.anchor.x+r.x*t.numberPathOffset,y:e.anchor.y+r.y*t.numberPathOffset}},xt=(e,t)=>{if(!t.visibility[e.kind])return"";if(e.kind==="draw-order-number"){const r=kt(e,t);return`
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${r.x}"
          y="${r.y}"
          fill="${t.numberColor}"
          font-size="${t.numberSize}"
          text-anchor="middle"
          dominant-baseline="central"
        >${Xe(e.text)}</text>
      </g>
    `}return`
    <path
      class="${Ze(e)}"
      d="${We(e.commands)}"
      stroke-width="${t.arrowStrokeWidth}"
    ></path>
    ${Ke(e).map(r=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${e.kind}" points="${je(r.polygon)}"></polygon>`).join("")}
  `},me="zephyr",vt=96,_t=320,fe=13,yt=53,$t=53,St=26,At=5.6,Tt=fe*2,It=0,Pt="#3f454b",Et="#ffffff",Lt="#83b0dd",Mt="#d5dbe2",be=24,ke=1,xe=54,ve=1,_e="#ffb35c",j=100,Rt=178,Ot=.63,Dt=.66,E=2,se="http://www.w3.org/2000/svg",Nt=`
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
`,b={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},X=document.querySelector("#app");if(!X)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");X.classList.add("worksheet-root");const U=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),le=(e,t)=>({directionalDashSpacing:vt,midpointDensity:_t,turnRadius:fe,uTurnLength:yt,arrowLength:$t,arrowHeadSize:St,arrowStrokeWidth:At,numberSize:Tt,numberPathOffset:It,numberColor:Pt,offsetArrowLanes:!0,alwaysOffsetArrowLanes:!1,visibility:U(e),arrowColor:Et,strokeColor:t});let s={text:me,previewZoom:j,practiceRowHeightMm:be,practiceRepeatCount:ke,strokeWidth:xe,joinSpacing:{...b},showBaselineGuide:!0,showXHeightGuide:!0,showAscenderGuide:!0,showDescenderGuide:!0,gridlineStrokeWidth:ve,gridlineColor:_e,keepInitialLeadIn:!0,keepFinalLeadOut:!0,top:le(Be,Lt),practice:le(Ve,Mt)};X.innerHTML=`
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
            value="${me}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${p({id:"preview-zoom-slider",label:"Preview zoom",value:j,min:50,max:200,step:5,valueId:"preview-zoom-value"})}

        ${p({id:"practice-size-slider",label:"Practice size",value:be,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${p({id:"practice-repeat-slider",label:"Practice repeats",value:ke,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${p({id:"stroke-width-slider",label:"Main stroke thickness",value:xe,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        ${Ht()}

        ${Ct()}

        ${de("top","Top word annotations",s.top)}
        ${de("practice","Practice annotations",s.practice)}

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
`;const Z=document.querySelector("#worksheet-text-input"),O=document.querySelector("#preview-zoom-slider"),K=document.querySelector("#practice-size-slider"),J=document.querySelector("#practice-repeat-slider"),Q=document.querySelector("#stroke-width-slider"),ye=document.querySelector("#print-worksheet-button"),M=document.querySelector("#download-png-button"),$e=document.querySelector("#worksheet-page-frame"),m=document.querySelector("#worksheet-page"),v=document.querySelector("#worksheet-status");if(!Z||!O||!K||!J||!Q||!ye||!M||!$e||!m||!v)throw new Error("Missing elements for cursive worksheet generator.");function p({id:e,label:t,value:r,min:n,max:a,step:o,valueId:i=`${e}-value`,attrs:l=""}){return`
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
        step="${o}"
        value="${r}"
        ${l}
      />
    </label>
  `}function Ct(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${p({id:"target-bend-rate-slider",label:"Target maximum bend rate",value:b.targetBendRate,min:0,max:60,step:1,valueId:"target-bend-rate-value",attrs:'data-global-setting="targetBendRate"'})}
        ${p({id:"min-sidebearing-gap-slider",label:"Minimum sidebearing gap",value:b.minSidebearingGap,min:-300,max:200,step:5,valueId:"min-sidebearing-gap-value",attrs:'data-global-setting="minSidebearingGap"'})}
        ${p({id:"bend-search-min-sidebearing-gap-slider",label:"Search minimum sidebearing gap",value:b.bendSearchMinSidebearingGap,min:-300,max:200,step:5,valueId:"bend-search-min-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMinSidebearingGap"'})}
        ${p({id:"bend-search-max-sidebearing-gap-slider",label:"Search maximum sidebearing gap",value:b.bendSearchMaxSidebearingGap,min:-100,max:300,step:5,valueId:"bend-search-max-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMaxSidebearingGap"'})}
        ${p({id:"exit-handle-scale-slider",label:"p0-p1 handle scale",value:b.exitHandleScale,min:0,max:2,step:.05,valueId:"exit-handle-scale-value",attrs:'data-global-setting="exitHandleScale"'})}
        ${p({id:"entry-handle-scale-slider",label:"p2-p3 handle scale",value:b.entryHandleScale,min:0,max:2,step:.05,valueId:"entry-handle-scale-value",attrs:'data-global-setting="entryHandleScale"'})}
        <fieldset class="worksheet-app__checks" aria-label="Advanced worksheet toggles">
          ${_("include-initial-lead-in","keepInitialLeadIn","Initial lead-in")}
          ${_("include-final-lead-out","keepFinalLeadOut","Final lead-out")}
        </fieldset>
      </div>
    </details>
  `}function Ht(){return`
    <details class="worksheet-app__details">
      <summary>Gridline settings</summary>
      <div class="worksheet-app__details-body">
        ${p({id:"gridline-stroke-width-slider",label:"Gridline thickness",value:ve,min:.5,max:8,step:.5,valueId:"gridline-stroke-width-value",attrs:'data-global-setting="gridlineStrokeWidth"'})}
        ${Gt("gridline-color-picker","gridlineColor","Gridline colour",_e)}
        <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
          ${_("show-baseline-guide","showBaselineGuide","Baseline")}
          ${_("show-descender-guide","showDescenderGuide","Descender")}
          ${_("show-x-height-guide","showXHeightGuide","X-height")}
          ${_("show-ascender-guide","showAscenderGuide","Ascender")}
        </fieldset>
      </div>
    </details>
  `}function _(e,t,r,n){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${t}"
        checked
      />
      <span>${r}</span>
    </label>
  `}function Gt(e,t,r,n){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}">
      <span>${r}</span>
      <input
        class="worksheet-app__color"
        id="${e}"
        type="color"
        value="${n}"
        data-global-setting="${t}"
      />
    </label>
  `}function de(e,t,r){return`
    <details class="worksheet-app__details" open>
      <summary>${t}</summary>
      <div class="worksheet-app__details-body">
        ${p({id:`${e}-directional-dash-spacing-slider`,label:"Directional dash spacing",value:r.directionalDashSpacing,min:80,max:220,step:4,valueId:`${e}-directional-dash-spacing-value`,attrs:`data-scope="${e}" data-setting="directionalDashSpacing"`})}
        ${p({id:`${e}-midpoint-density-slider`,label:"Midpoint density",value:r.midpointDensity,min:120,max:600,step:20,valueId:`${e}-midpoint-density-value`,attrs:`data-scope="${e}" data-setting="midpointDensity"`})}
        ${p({id:`${e}-turn-radius-slider`,label:"Turn radius",value:r.turnRadius,min:0,max:48,step:1,valueId:`${e}-turn-radius-value`,attrs:`data-scope="${e}" data-setting="turnRadius"`})}
        ${p({id:`${e}-u-turn-length-slider`,label:"U-turn length",value:r.uTurnLength,min:0,max:300,step:1,valueId:`${e}-u-turn-length-value`,attrs:`data-scope="${e}" data-setting="uTurnLength"`})}
        ${p({id:`${e}-arrow-length-slider`,label:"Other arrow length",value:r.arrowLength,min:0,max:300,step:1,valueId:`${e}-arrow-length-value`,attrs:`data-scope="${e}" data-setting="arrowLength"`})}
        ${p({id:`${e}-arrow-head-size-slider`,label:"Arrow head size",value:r.arrowHeadSize,min:0,max:64,step:1,valueId:`${e}-arrow-head-size-value`,attrs:`data-scope="${e}" data-setting="arrowHeadSize"`})}
        ${p({id:`${e}-arrow-stroke-width-slider`,label:"Arrow stroke width",value:r.arrowStrokeWidth,min:1,max:14,step:.5,valueId:`${e}-arrow-stroke-width-value`,attrs:`data-scope="${e}" data-setting="arrowStrokeWidth"`})}
        ${p({id:`${e}-number-size-slider`,label:"Number size",value:r.numberSize,min:8,max:72,step:1,valueId:`${e}-number-size-value`,attrs:`data-scope="${e}" data-setting="numberSize"`})}
        ${p({id:`${e}-number-offset-slider`,label:"Number offset",value:r.numberPathOffset,min:-80,max:80,step:1,valueId:`${e}-number-offset-value`,attrs:`data-scope="${e}" data-setting="numberPathOffset"`})}
        <fieldset class="worksheet-app__checks" aria-label="${t}">
          ${$(e,"directional-dash","Directional dash",r.visibility["directional-dash"])}
          ${$(e,"turning-point","Turns",r.visibility["turning-point"])}
          ${$(e,"start-arrow","Starts",r.visibility["start-arrow"])}
          ${$(e,"draw-order-number","Numbers",r.visibility["draw-order-number"])}
          ${$(e,"midpoint-arrow","Midpoints",r.visibility["midpoint-arrow"])}
          <label class="worksheet-app__check">
            <input
              type="checkbox"
              data-scope="${e}"
              data-setting="offsetArrowLanes"
              ${r.offsetArrowLanes?"checked":""}
            />
            <span>Offset lanes</span>
          </label>
          <label class="worksheet-app__check">
            <input
              type="checkbox"
              data-scope="${e}"
              data-setting="alwaysOffsetArrowLanes"
              ${r.alwaysOffsetArrowLanes?"checked":""}
            />
            <span>Always offset lanes</span>
          </label>
        </fieldset>
        ${H(e,"strokeColor","Word stroke colour",r.strokeColor)}
        ${H(e,"numberColor","Number colour",r.numberColor)}
        ${H(e,"arrowColor","Arrow colour",r.arrowColor)}
      </div>
    </details>
  `}function H(e,t,r,n){return`
    <label class="worksheet-app__field worksheet-app__field--inline" for="${e}-${t}-picker">
      <span>${r}</span>
      <input
        class="worksheet-app__color"
        id="${e}-${t}-picker"
        type="color"
        value="${n}"
        data-scope="${e}"
        data-setting="${t}"
      />
    </label>
  `}function $(e,t,r,n){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${t}"
        ${n?"checked":""}
      />
      <span>${r}</span>
    </label>
  `}const Se=e=>e.trim().toLowerCase().replace(/\s+/g," "),Ae=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),Te=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,D=e=>s[e],Wt=()=>Math.max(1,Math.floor(Rt/s.practiceRowHeightMm)),ce=e=>e.toFixed(2),h=(e,t)=>{const r=document.querySelector(`#${e}`);r&&(r.textContent=t)},ee=()=>{h("preview-zoom-value",`${s.previewZoom}%`),h("practice-size-value",`${s.practiceRowHeightMm} mm`),h("practice-repeat-value",`${s.practiceRepeatCount}`),h("stroke-width-value",`${s.strokeWidth}px`),h("gridline-stroke-width-value",`${s.gridlineStrokeWidth.toFixed(1)}px`),h("target-bend-rate-value",`${s.joinSpacing.targetBendRate}`),h("min-sidebearing-gap-value",`${s.joinSpacing.minSidebearingGap}`),h("bend-search-min-sidebearing-gap-value",`${s.joinSpacing.bendSearchMinSidebearingGap}`),h("bend-search-max-sidebearing-gap-value",`${s.joinSpacing.bendSearchMaxSidebearingGap}`),h("exit-handle-scale-value",ce(s.joinSpacing.exitHandleScale)),h("entry-handle-scale-value",ce(s.joinSpacing.entryHandleScale)),["top","practice"].forEach(e=>{const t=D(e);h(`${e}-directional-dash-spacing-value`,`${t.directionalDashSpacing}px`),h(`${e}-midpoint-density-value`,`1 per ${t.midpointDensity}px`),h(`${e}-turn-radius-value`,`${t.turnRadius}px`),h(`${e}-u-turn-length-value`,`${t.uTurnLength}px`),h(`${e}-arrow-length-value`,`${t.arrowLength}px`),h(`${e}-arrow-head-size-value`,`${t.arrowHeadSize}px`),h(`${e}-arrow-stroke-width-value`,`${t.arrowStrokeWidth.toFixed(1)}px`),h(`${e}-number-size-value`,`${t.numberSize}px`),h(`${e}-number-offset-value`,`${t.numberPathOffset}px`)})},Ie=()=>{$e.style.setProperty("--worksheet-preview-scale",`${s.previewZoom/100}`)},Y=e=>{s.previewZoom=e,O.value=`${e}`,Ie(),ee()},N=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),G=(e,t)=>{const r=e.map(t);return{avgMs:Number((r.reduce((n,a)=>n+a,0)/r.length).toFixed(3)),minMs:Number(Math.min(...r).toFixed(3)),maxMs:Number(Math.max(...r).toFixed(3))}},Pe=()=>({text:s.text,practiceRepeatCount:s.practiceRepeatCount,practiceRowHeightMm:s.practiceRowHeightMm,topVisibility:U(s.top.visibility),practiceVisibility:U(s.practice.visibility)}),Ft=async(e={})=>{const t=Math.max(1,Math.floor(e.iterations??10)),r=Math.max(0,Math.floor(e.warmupRuns??2)),n=[];for(let a=0;a<r;a+=1)g(),await N();for(let a=0;a<t;a+=1){const o=performance.now();g();const i=performance.now();await N();const l=performance.now();n.push({renderMs:i-o,paintMs:l-i,totalMs:l-o})}return{iterations:t,state:Pe(),render:G(n,a=>a.renderMs),paint:G(n,a=>a.paintMs),total:G(n,a=>a.totalMs),runs:n}},zt=async(e,t)=>{const r=s.previewZoom;r!==e&&(Y(e),await N());try{return await t()}finally{r!==e&&(Y(r),await N())}},Ut=(e,t,r)=>{const n=t.xHeight-t.baseline,a=r.xHeight-r.baseline,o=n!==0?a/n:1,i=r.baseline-t.baseline*o;return e*o+i},ue=(e,t,r)=>{let n=r==="ascender"?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY,a=null;for(const o of e){if(o.trim()===""){a=null;continue}const i=o.toLowerCase(),l=a===null?Ne:Ce[a],c=De(i,l);if(!c){a=null;continue}const d=c.guides,u=d==null?void 0:d[r];if(d&&typeof u=="number"){const w=Ut(u,d,t);r==="ascender"?n=Math.min(n,w):n=Math.max(n,w)}a=He[i]??"low"}return Number.isFinite(n)?n:null},f=(e,t)=>{const r=e.path.guides,n=s.strokeWidth/2,a=Math.abs(r.baseline-r.xHeight);if(t==="baseline")return r.baseline+e.offsetY+n;if(t==="xHeight")return r.xHeight+e.offsetY-n;if(t==="ascender"){const l=ue(s.text,r,"ascender");return l!==null?l+e.offsetY-n:(r.ascender??r.xHeight-a*Ot)+e.offsetY-n}const o=ue(s.text,r,"descender");return o!==null?o+e.offsetY+n:(r.descender??r.baseline+a*Dt)+e.offsetY+n},Ee=(e,t)=>`
  ${s.showBaselineGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--baseline"
      x1="0"
      y1="${f(e,"baseline")}"
      x2="${t}"
      y2="${f(e,"baseline")}"
    ></line>
  `:""}
  ${s.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${f(e,"descender")}"
      x2="${t}"
      y2="${f(e,"descender")}"
    ></line>
  `:""}
  ${s.showXHeightGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--midline"
      x1="0"
      y1="${f(e,"xHeight")}"
      x2="${t}"
      y2="${f(e,"xHeight")}"
    ></line>
  `:""}
  ${s.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${f(e,"ascender")}"
      x2="${t}"
      y2="${f(e,"ascender")}"
    ></line>
  `:""}
`,Le=(e,t,r)=>{const a=e.path.strokes.filter(i=>i.type!=="lift").map(i=>`<path class="worksheet-word__stroke" d="${Oe(i.curves)}"></path>`).join(""),o=qe(e.path,t,r);return`
    ${a}
    ${o}
  `},Yt=(e,t,r,n,a)=>{const o=Le(e,t,r);return`
    <svg
      class="${n}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Ae(a)}"
      style="--formation-arrow-color: ${r.arrowColor}; --formation-arrow-stroke-width: ${r.arrowStrokeWidth}; --worksheet-word-stroke: ${r.strokeColor}; --worksheet-word-stroke-width: ${s.strokeWidth}; --worksheet-guide-color: ${s.gridlineColor}; --worksheet-guide-stroke-width: ${s.gridlineStrokeWidth};"
    >
      ${Ee(e,e.width)}
      ${o}
    </svg>
  `},Bt=e=>{const t=e.path.bounds.maxX-e.path.bounds.minX,r=e.path.bounds.minX;return t+r},Vt=(e,t,r,n,a)=>{const o=Bt(e),i=e.width+o*(n-1),l=Le(e,t,r),c=`practice-word-${a}`,d=Array.from({length:n},(u,w)=>{const y=w*o;return`<use href="#${c}" x="${y}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${i} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${Ae(`${s.text} practice line, ${n} repeat${n===1?"":"s"}`)}"
      style="--formation-arrow-color: ${r.arrowColor}; --formation-arrow-stroke-width: ${r.arrowStrokeWidth}; --worksheet-word-stroke: ${r.strokeColor}; --worksheet-word-stroke-width: ${s.strokeWidth}; --worksheet-guide-color: ${s.gridlineColor}; --worksheet-guide-stroke-width: ${s.gridlineStrokeWidth};"
    >
      ${Ee(e,i)}
      <defs>
        <g id="${c}">
          ${l}
        </g>
      </defs>
      ${d}
    </svg>
  `},g=()=>{if(s={...s,text:Se(Z.value),practiceRowHeightMm:Number(K.value),practiceRepeatCount:Number(J.value),strokeWidth:Number(Q.value)},ee(),s.text.length===0){m.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,v.textContent="";return}const e={joinSpacing:s.joinSpacing,keepInitialLeadIn:s.keepInitialLeadIn,keepFinalLeadOut:s.keepFinalLeadOut};let t;try{t=Me(s.text,e)}catch{m.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,v.textContent="This text could not be drawn.";return}const r=Re(t.path),n=Yt(t,r,s.top,"worksheet-word worksheet-word--top",`${s.text} with formation annotations`),a=Wt(),o=Array.from({length:a},(i,l)=>Vt(t,r,s.practice,s.practiceRepeatCount,l)).join("");m.style.setProperty("--practice-row-height",`${s.practiceRowHeightMm}mm`),m.innerHTML=`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
    <section class="worksheet-page__example" aria-label="Top example">
      ${n}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${o}
    </section>
  `,v.textContent=`${a} practice lines, ${s.practiceRepeatCount} repeat${s.practiceRepeatCount===1?"":"s"} per line`},qt=e=>new Promise((t,r)=>{const n=new Image;n.onload=()=>t(n),n.onerror=()=>r(new Error("Could not render worksheet image.")),n.src=e}),jt=(e,t)=>{const r=URL.createObjectURL(e),n=document.createElement("a");n.href=r,n.download=t,document.body.append(n),n.click(),n.remove(),URL.revokeObjectURL(r)},C=(e,t)=>{const r=e.getBoundingClientRect();return{x:r.left-t.left,y:r.top-t.top,width:r.width,height:r.height}},B=(e,t,r,n,a,o)=>{e.save(),e.beginPath(),e.strokeStyle=a,e.lineWidth=o,e.moveTo(t,n),e.lineTo(r,n),e.stroke(),e.restore()},Xt=(e,t)=>{e.save(),e.fillStyle="#23313d",e.font="700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textBaseline="alphabetic",m.querySelectorAll(".worksheet-page__meta-line span").forEach(r=>{var l;const n=C(r,t),a=((l=r.textContent)==null?void 0:l.trim())??"",o=n.y+n.height-3;e.fillText(a,n.x,o);const i=n.x+e.measureText(a).width+15;B(e,i,n.x+n.width,n.y+n.height-1,"#cfd6dc",1.3)}),e.restore()},Zt=e=>{const t=e.cloneNode(!0);t.setAttribute("xmlns",se);const r=document.createElementNS(se,"style");return r.textContent=Nt,t.insertBefore(r,t.firstChild),new XMLSerializer().serializeToString(t)},Kt=async(e,t,r)=>{const n=C(t,r),a=Zt(t),o=URL.createObjectURL(new Blob([a],{type:"image/svg+xml;charset=utf-8"}));try{const i=await qt(o);e.drawImage(i,n.x,n.y,n.width,n.height)}finally{URL.revokeObjectURL(o)}},Jt=async()=>await zt(j,async()=>{g();const e=m.getBoundingClientRect(),t=Math.ceil(e.width),r=Math.ceil(e.height),n=document.createElement("canvas");n.width=t*E,n.height=r*E;const a=n.getContext("2d");if(!a)throw new Error("Could not prepare worksheet image.");a.fillStyle="#ffffff",a.fillRect(0,0,n.width,n.height),a.scale(E,E),Xt(a,e);for(const i of m.querySelectorAll(".worksheet-word"))await Kt(a,i,e);const o=m.querySelector(".worksheet-page__example");if(o){const i=C(o,e);B(a,i.x,i.x+i.width,i.y+i.height-1,"#d7dde2",1.3)}return m.querySelectorAll(".worksheet-word--practice").forEach(i=>{const l=C(i,e);B(a,l.x,l.x+l.width,l.y+l.height-.6,"#d7dde2",1.1)}),await new Promise((i,l)=>{n.toBlob(c=>{c?i(c):l(new Error("Could not encode worksheet image."))},"image/png")})});Z.addEventListener("input",g);O.addEventListener("input",()=>{Y(Number(O.value))});K.addEventListener("input",g);J.addEventListener("input",g);Q.addEventListener("input",g);ye.addEventListener("click",()=>{g(),window.print()});M.addEventListener("click",()=>{M.disabled=!0,v.textContent="Preparing PNG...",Jt().then(e=>{const t=Se(s.text).replaceAll(/\s+/g,"-")||"worksheet";jt(e,`${t}-cursive-worksheet.png`),v.textContent="PNG downloaded."}).catch(e=>{v.textContent=e instanceof Error?e.message:"Could not download PNG."}).finally(()=>{M.disabled=!1})});document.querySelectorAll("[data-global-setting]").forEach(e=>{e.addEventListener("input",()=>{const t=e.dataset.globalSetting;if(t==="targetBendRate"||t==="minSidebearingGap"||t==="bendSearchMinSidebearingGap"||t==="bendSearchMaxSidebearingGap"||t==="exitHandleScale"||t==="entryHandleScale")s.joinSpacing={...s.joinSpacing,[t]:Number(e.value)};else if(t==="gridlineStrokeWidth")s.gridlineStrokeWidth=Number(e.value);else if(t==="keepInitialLeadIn")s.keepInitialLeadIn=e.checked;else if(t==="keepFinalLeadOut")s.keepFinalLeadOut=e.checked;else if(t==="showBaselineGuide")s.showBaselineGuide=e.checked;else if(t==="showXHeightGuide")s.showXHeightGuide=e.checked;else if(t==="showAscenderGuide")s.showAscenderGuide=e.checked;else if(t==="showDescenderGuide")s.showDescenderGuide=e.checked;else if(t==="gridlineColor"){const r=Te(e.value);if(!r)return;s.gridlineColor=r}g()})});document.querySelectorAll("[data-scope][data-setting]").forEach(e=>{e.addEventListener("input",()=>{const t=e.dataset.scope,r=e.dataset.setting;if(!t||t!=="top"&&t!=="practice")return;const n=D(t);if(r==="directionalDashSpacing")n.directionalDashSpacing=Number(e.value);else if(r==="midpointDensity")n.midpointDensity=Number(e.value);else if(r==="turnRadius")n.turnRadius=Number(e.value);else if(r==="uTurnLength")n.uTurnLength=Number(e.value);else if(r==="arrowLength")n.arrowLength=Number(e.value);else if(r==="arrowHeadSize")n.arrowHeadSize=Number(e.value);else if(r==="arrowStrokeWidth")n.arrowStrokeWidth=Number(e.value);else if(r==="numberSize")n.numberSize=Number(e.value);else if(r==="numberPathOffset")n.numberPathOffset=Number(e.value);else if(r==="offsetArrowLanes")n.offsetArrowLanes=e.checked;else if(r==="alwaysOffsetArrowLanes")n.alwaysOffsetArrowLanes=e.checked;else if(r==="arrowColor"||r==="numberColor"||r==="strokeColor"){const a=Te(e.value);if(!a)return;n[r]=a}g()})});document.querySelectorAll("[data-scope][data-annotation-kind]").forEach(e=>{e.addEventListener("change",()=>{const t=e.dataset.scope,r=e.dataset.annotationKind;!t||t!=="top"&&t!=="practice"||!r||(D(t).visibility={...D(t).visibility,[r]:e.checked},g())})});ee();Ie();g();window.__worksheetProfiler={getState:Pe,profileRender:Ft};
