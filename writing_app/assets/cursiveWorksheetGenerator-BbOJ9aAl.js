import{b as J,c as Q,d as Te}from"./shared-BptrW1eh.js";import{c as Pe,a as Ie}from"./annotations-DVpM9QG8.js";const ue=26,Ee=22,Le=11,he=.42,ee=.36/he,Re=.18/he,y=Ee/ue,S=Le/ue,pe=4,M=6.5,Me=M/2,Oe={"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0},De={"directional-dash":!1,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},Ne=(e,t,r)=>{const n=Math.max(0,r.uTurnLength),a=Math.max(0,r.arrowLength),o=Math.max(0,r.arrowHeadSize),i=r.offsetArrowLanes?r.turnRadius:0,s=Pe(t,{directionalDashes:{spacing:r.directionalDashSpacing,head:{length:o,width:o*y,tipExtension:o*S}},turningPoints:{offset:r.turnRadius,stemLength:n*ee,head:{length:o,width:o*y,tipExtension:o*S}},startArrows:{length:a,minLength:a*Re,offset:i,head:{length:o,width:o*y,tipExtension:o*S}},drawOrderNumbers:{offset:0},midpointArrows:{density:r.midpointDensity,length:a*ee,offset:i,head:{length:o,width:o*y,tipExtension:o*S}}}),d=st(s,t,r.visibility);return[...d.filter(c=>c.kind!=="draw-order-number"),...d.filter(c=>c.kind==="draw-order-number")].map(c=>lt(c,r)).join("")},Ce=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),He=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),Ge=e=>`writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${e.kind}`,We=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),Fe=e=>e.kind==="start-arrow"||e.kind==="midpoint-arrow",H=e=>e.kind==="turning-point",ze=e=>e.kind==="draw-order-number",te=e=>"distance"in e.source?e.source.distance:e.source.turnDistance,U=e=>e.strokes.reduce((t,r)=>t+r.totalLength,0),Ue=(e,t)=>{if(e.length===0)return{x:0,y:0};for(let n=1;n<e.length;n+=1){const a=e[n-1],o=e[n];if(!(!a||!o)&&o.distanceAlongStroke>=t){const i=o.distanceAlongStroke-a.distanceAlongStroke,s=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(o.x-a.x)*s,y:a.y+(o.y-a.y)*s}}}const r=e[e.length-1];return r?{x:r.x,y:r.y}:{x:0,y:0}},L=(e,t)=>{let r=t;for(let n=0;n<e.strokes.length;n+=1){const a=e.strokes[n];if(a){if(r<=a.totalLength||n===e.strokes.length-1)return Ue(a.samples,Math.max(0,Math.min(r,a.totalLength)));r-=a.totalLength}}return{x:0,y:0}},Y=e=>{const t=Math.hypot(e.x,e.y);return t>0?{x:e.x/t,y:e.y/t}:{x:1,y:0}},re=(e,t,r="center")=>{const n=U(e),a=Math.max(0,Math.min(t,n)),o=L(e,a),i=Math.min(8,Math.max(2,n/200));let s=Math.max(0,a-i),d=Math.min(n,a+i);r==="forward"?s=a:r==="backward"&&(d=a),Math.abs(d-s)<.001&&(a<=i?d=Math.min(n,a+i):s=Math.max(0,a-i));const c=L(e,s),u=L(e,d);return{point:o,tangent:Y({x:u.x-c.x,y:u.y-c.y})}},b=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),Ye=(e,t)=>(e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y),qe=(e,t,r)=>({x:e.x+(t.x-e.x)*r,y:e.y+(t.y-e.y)*r}),Be=(e,t)=>{const r={x:-e.tangent.y,y:e.tangent.x};return{x:e.point.x+r.x*t,y:e.point.y+r.y*t}},we=(e,t)=>{const r=Math.cos(t),n=Math.sin(t);return{x:e.x*r-e.y*n,y:e.x*n+e.y*r}},k=(e,t,r,n)=>{const a=we({x:e.x-t.x,y:e.y-t.y},n);return{x:r.x+a.x,y:r.y+a.y}},je=(e,t,r,n,a)=>{const o=1-a,i=o*o,s=a*a;return{x:i*o*e.x+3*i*a*t.x+3*o*s*r.x+s*a*n.x,y:i*o*e.y+3*i*a*t.y+3*o*s*r.y+s*a*n.y}},$=(e,t)=>{const r=e[e.length-1];(!r||b(r,t)>.25)&&e.push(t)},Xe=(e,t)=>{const r=b(e,t),n=Math.max(1,Math.ceil(r/pe)),a=[];for(let o=1;o<=n;o+=1)a.push(qe(e,t,o/n));return a},Ve=e=>{const t=[];let r=null;return e.forEach(n=>{if(n.type==="move"){r=n.to,$(t,n.to);return}if(!r){r=n.to,$(t,n.to);return}if(n.type==="line"){Xe(r,n.to).forEach(i=>$(t,i)),r=n.to;return}const a=b(r,n.cp1)+b(n.cp1,n.cp2)+b(n.cp2,n.to),o=Math.max(3,Math.ceil(a/pe));for(let i=1;i<=o;i+=1)$(t,je(r,n.cp1,n.cp2,n.to,i/o));r=n.to}),t},ne=e=>{var o;const t=Ve(e.commands),r=(o=e.head)==null?void 0:o.polygon,a=[...t,...r??[]].reduce((i,s)=>({minX:Math.min(i.minX,s.x),minY:Math.min(i.minY,s.y),maxX:Math.max(i.maxX,s.x),maxY:Math.max(i.maxY,s.y)}),{minX:Number.POSITIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY});return{pathPoints:t,...r?{headPolygon:r}:{},bounds:a}},Ze=(e,t,r)=>e.minX<=t.maxX+r&&e.maxX+r>=t.minX&&e.minY<=t.maxY+r&&e.maxY+r>=t.minY,Ke=(e,t,r)=>{const n=r.x-t.x,a=r.y-t.y,o=n*n+a*a;if(o===0)return b(e,t);const i=Math.max(0,Math.min(1,((e.x-t.x)*n+(e.y-t.y)*a)/o));return b(e,{x:t.x+n*i,y:t.y+a*i})},Je=(e,t)=>t.reduce((r,n,a)=>{const o=t[(a+1)%t.length];return o?Math.min(r,Ke(e,n,o)):r},Number.POSITIVE_INFINITY),G=(e,t)=>{let r=!1;for(let n=0,a=t.length-1;n<t.length;a=n,n+=1){const o=t[n],i=t[a];if(!o||!i)continue;o.y>e.y!=i.y>e.y&&e.x<(i.x-o.x)*(e.y-o.y)/(i.y-o.y)+o.x&&(r=!r)}return r},A=(e,t,r)=>(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y),T=(e,t,r)=>e.x<=Math.max(t.x,r.x)&&e.x>=Math.min(t.x,r.x)&&e.y<=Math.max(t.y,r.y)&&e.y>=Math.min(t.y,r.y),Qe=(e,t,r,n)=>{const a=A(e,t,r),o=A(e,t,n),i=A(r,n,e),s=A(r,n,t);return a*o<0&&i*s<0?!0:Math.abs(a)<.001&&T(r,e,t)||Math.abs(o)<.001&&T(n,e,t)||Math.abs(i)<.001&&T(e,r,n)||Math.abs(s)<.001&&T(t,r,n)},et=(e,t)=>{if(e.length<3||t.length<3)return!1;const r=e.some((o,i)=>{const s=e[(i+1)%e.length];return!!s&&t.some((d,c)=>{const u=t[(c+1)%t.length];return!!u&&Qe(o,s,d,u)})}),n=e[0],a=t[0];return r||!!n&&G(n,t)||!!a&&G(a,e)},tt=(e,t)=>{const r=M*M;return e.some(n=>t.some(a=>Ye(n,a)<=r))},ae=(e,t)=>t.length>=3&&e.some(r=>G(r,t)||Je(r,t)<=Me),W=(e,t,r)=>{const n=r.get(e)??ne(e),a=r.get(t)??ne(t);return r.set(e,n),r.set(t,a),n.pathPoints.length===0&&!n.headPolygon||a.pathPoints.length===0&&!a.headPolygon||!Ze(n.bounds,a.bounds,M)?!1:tt(n.pathPoints,a.pathPoints)||(n.headPolygon?ae(a.pathPoints,n.headPolygon):!1)||(a.headPolygon?ae(n.pathPoints,a.headPolygon):!1)||(n.headPolygon&&a.headPolygon?et(n.headPolygon,a.headPolygon):!1)},oe=(e,t)=>{const r=L(t,e.source.turnDistance);return Math.min(Math.abs(r.y-t.bounds.minY),Math.abs(t.bounds.maxY-r.y))},rt=(e,t,r)=>{const n=oe(e,r)-oe(t,r);return Math.abs(n)>.001?n:e.source.turnDistance-t.source.turnDistance},nt=(e,t,r,n)=>e.type==="move"?{type:"move",to:k(e.to,t,r,n)}:e.type==="line"?{type:"line",to:k(e.to,t,r,n)}:{type:"cubic",cp1:k(e.cp1,t,r,n),cp2:k(e.cp2,t,r,n),to:k(e.to,t,r,n)},at=(e,t)=>{const r=U(t),n=re(t,e.source.turnDistance,"forward"),a=Math.max(e.source.turnDistance,Math.min(r,e.source.endDistance)),o=re(t,a,"backward"),i=n.point,s=o.point,d=Math.atan2(o.tangent.y,o.tangent.x)-Math.atan2(n.tangent.y,n.tangent.x),c=a-e.source.turnDistance;return{annotation:{...e,commands:e.commands.map(u=>nt(u,i,s,d)),...e.head?{head:{tip:k(e.head.tip,i,s,d),direction:Y(we(e.head.direction,d)),polygon:e.head.polygon.map(u=>k(u,i,s,d))}}:{},source:{...e.source,startDistance:Math.min(r,e.source.startDistance+c),turnDistance:a,endDistance:Math.min(r,e.source.endDistance+c)}},distanceShift:c,targetDistance:a,targetPose:o}},ot=(e,t,r)=>({...e,point:t.targetPose.point,anchor:Be(t.targetPose,e.metrics.offset),direction:t.targetPose.tangent,source:{...e.source,startDistance:Math.min(r,e.source.startDistance+t.distanceShift),endDistance:Math.min(r,e.source.endDistance+t.distanceShift),distance:t.targetDistance}}),it=(e,t)=>{const r=e.filter(H);if(r.length<2)return e;const n=new Map,a=new Map,o=[...r].sort((c,u)=>rt(c,u,t)),i=[];if(o.forEach(c=>{if(i.some(m=>W(c,m,n))){a.set(c,at(c,t));return}i.push(c)}),a.size===0)return e;const s=U(t),d=new Map;return a.forEach((c,u)=>{d.set(u.source.sectionIndex,c)}),e.map(c=>{var u;if(H(c))return((u=a.get(c))==null?void 0:u.annotation)??c;if(ze(c)){const m=d.get(c.source.sectionIndex);return m?ot(c,m,s):c}return c})},st=(e,t,r)=>{const n=it(e.filter(c=>r[c.kind]),t),a=n.filter(H),o=n.filter(Fe).sort((c,u)=>te(c)-te(u)),i=new Map,s=[],d=new Set;return o.forEach(c=>{if(a.some(x=>W(c,x,i))){d.add(c);return}if(s.some(x=>W(c,x,i))){d.add(c);return}s.push(c)}),n.filter(c=>!d.has(c))},ct=(e,t)=>{const r=Y(e.direction);return{x:e.anchor.x+r.x*t.numberPathOffset,y:e.anchor.y+r.y*t.numberPathOffset}},lt=(e,t)=>{if(!t.visibility[e.kind])return"";if(e.kind==="draw-order-number"){const r=ct(e,t);return`
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${r.x}"
          y="${r.y}"
          fill="${t.numberColor}"
          font-size="${t.numberSize}"
          text-anchor="middle"
          dominant-baseline="central"
        >${He(e.text)}</text>
      </g>
    `}return`
    <path
      class="${Ge(e)}"
      d="${Ie(e.commands)}"
      stroke-width="${t.arrowStrokeWidth}"
    ></path>
    ${We(e).map(r=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${e.kind}" points="${Ce(r.polygon)}"></polygon>`).join("")}
  `},ge="zephyr",dt=96,ut=320,me=13,ht=53,pt=53,wt=26,gt=5.6,mt=me*2,ft=0,kt="#3f454b",bt="#ffffff",_t="#bac4ce",xt="#d5dbe2",fe=24,ke=1,be=54,q=100,vt=178,yt=.63,St=.66,P=2,ie="http://www.w3.org/2000/svg",$t=`
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
    stroke: rgba(35, 49, 61, 0.14);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
  .worksheet-word__guide--baseline {
    stroke: rgba(47, 125, 104, 0.72);
  }
  .worksheet-word__guide--midline {
    stroke: rgba(202, 83, 72, 0.45);
  }
  .worksheet-word__guide--ascender {
    stroke: rgba(49, 90, 157, 0.38);
  }
  .worksheet-word__guide--descender {
    stroke: rgba(13, 127, 140, 0.38);
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
`,f={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},B=document.querySelector("#app");if(!B)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");B.classList.add("worksheet-root");const At=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),se=(e,t)=>({directionalDashSpacing:dt,midpointDensity:ut,turnRadius:me,uTurnLength:ht,arrowLength:pt,arrowHeadSize:wt,arrowStrokeWidth:gt,numberSize:mt,numberPathOffset:ft,numberColor:kt,offsetArrowLanes:!0,visibility:At(e),arrowColor:bt,strokeColor:t});let l={text:ge,previewZoom:q,practiceRowHeightMm:fe,practiceRepeatCount:ke,strokeWidth:be,joinSpacing:{...f},showAscenderGuide:!1,showDescenderGuide:!1,keepInitialLeadIn:!0,keepFinalLeadOut:!0,top:se(Oe,_t),practice:se(De,xt)};B.innerHTML=`
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
            value="${ge}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${p({id:"preview-zoom-slider",label:"Preview zoom",value:q,min:50,max:200,step:5,valueId:"preview-zoom-value"})}

        ${p({id:"practice-size-slider",label:"Practice size",value:fe,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${p({id:"practice-repeat-slider",label:"Practice repeats",value:ke,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${p({id:"stroke-width-slider",label:"Main stroke thickness",value:be,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        ${Tt()}

        ${ce("top","Top word annotations",l.top)}
        ${ce("practice","Practice annotations",l.practice)}

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
`;const j=document.querySelector("#worksheet-text-input"),O=document.querySelector("#preview-zoom-slider"),X=document.querySelector("#practice-size-slider"),V=document.querySelector("#practice-repeat-slider"),Z=document.querySelector("#stroke-width-slider"),_e=document.querySelector("#print-worksheet-button"),R=document.querySelector("#download-png-button"),xe=document.querySelector("#worksheet-page-frame"),w=document.querySelector("#worksheet-page"),_=document.querySelector("#worksheet-status");if(!j||!O||!X||!V||!Z||!_e||!R||!xe||!w||!_)throw new Error("Missing elements for cursive worksheet generator.");function p({id:e,label:t,value:r,min:n,max:a,step:o,valueId:i=`${e}-value`,attrs:s=""}){return`
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
        ${s}
      />
    </label>
  `}function Tt(){return`
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${p({id:"target-bend-rate-slider",label:"Target maximum bend rate",value:f.targetBendRate,min:0,max:60,step:1,valueId:"target-bend-rate-value",attrs:'data-global-setting="targetBendRate"'})}
        ${p({id:"min-sidebearing-gap-slider",label:"Minimum sidebearing gap",value:f.minSidebearingGap,min:-300,max:200,step:5,valueId:"min-sidebearing-gap-value",attrs:'data-global-setting="minSidebearingGap"'})}
        ${p({id:"bend-search-min-sidebearing-gap-slider",label:"Search minimum sidebearing gap",value:f.bendSearchMinSidebearingGap,min:-300,max:200,step:5,valueId:"bend-search-min-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMinSidebearingGap"'})}
        ${p({id:"bend-search-max-sidebearing-gap-slider",label:"Search maximum sidebearing gap",value:f.bendSearchMaxSidebearingGap,min:-100,max:300,step:5,valueId:"bend-search-max-sidebearing-gap-value",attrs:'data-global-setting="bendSearchMaxSidebearingGap"'})}
        ${p({id:"exit-handle-scale-slider",label:"p0-p1 handle scale",value:f.exitHandleScale,min:0,max:2,step:.05,valueId:"exit-handle-scale-value",attrs:'data-global-setting="exitHandleScale"'})}
        ${p({id:"entry-handle-scale-slider",label:"p2-p3 handle scale",value:f.entryHandleScale,min:0,max:2,step:.05,valueId:"entry-handle-scale-value",attrs:'data-global-setting="entryHandleScale"'})}
        <fieldset class="worksheet-app__checks" aria-label="Advanced worksheet toggles">
          ${I("include-initial-lead-in","keepInitialLeadIn","Initial lead-in",!0)}
          ${I("include-final-lead-out","keepFinalLeadOut","Final lead-out",!0)}
          ${I("show-ascender-guide","showAscenderGuide","Ascender gridline",!1)}
          ${I("show-descender-guide","showDescenderGuide","Descender gridline",!1)}
        </fieldset>
      </div>
    </details>
  `}function I(e,t,r,n){return`
    <label class="worksheet-app__check" for="${e}">
      <input
        id="${e}"
        type="checkbox"
        data-global-setting="${t}"
        ${n?"checked":""}
      />
      <span>${r}</span>
    </label>
  `}function ce(e,t,r){return`
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
          ${v(e,"directional-dash","Directional dash",r.visibility["directional-dash"])}
          ${v(e,"turning-point","Turns",r.visibility["turning-point"])}
          ${v(e,"start-arrow","Starts",r.visibility["start-arrow"])}
          ${v(e,"draw-order-number","Numbers",r.visibility["draw-order-number"])}
          ${v(e,"midpoint-arrow","Midpoints",r.visibility["midpoint-arrow"])}
          <label class="worksheet-app__check">
            <input
              type="checkbox"
              data-scope="${e}"
              data-setting="offsetArrowLanes"
              ${r.offsetArrowLanes?"checked":""}
            />
            <span>Offset lanes</span>
          </label>
        </fieldset>
        ${C(e,"strokeColor","Word stroke colour",r.strokeColor)}
        ${C(e,"numberColor","Number colour",r.numberColor)}
        ${C(e,"arrowColor","Arrow colour",r.arrowColor)}
      </div>
    </details>
  `}function C(e,t,r,n){return`
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
  `}function v(e,t,r,n){return`
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${e}"
        data-annotation-kind="${t}"
        ${n?"checked":""}
      />
      <span>${r}</span>
    </label>
  `}const ve=e=>e.trim().toLowerCase().replace(/\s+/g," "),ye=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),Pt=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,D=e=>l[e],It=()=>Math.max(1,Math.floor(vt/l.practiceRowHeightMm)),le=e=>e.toFixed(2),h=(e,t)=>{const r=document.querySelector(`#${e}`);r&&(r.textContent=t)},K=()=>{h("preview-zoom-value",`${l.previewZoom}%`),h("practice-size-value",`${l.practiceRowHeightMm} mm`),h("practice-repeat-value",`${l.practiceRepeatCount}`),h("stroke-width-value",`${l.strokeWidth}px`),h("target-bend-rate-value",`${l.joinSpacing.targetBendRate}`),h("min-sidebearing-gap-value",`${l.joinSpacing.minSidebearingGap}`),h("bend-search-min-sidebearing-gap-value",`${l.joinSpacing.bendSearchMinSidebearingGap}`),h("bend-search-max-sidebearing-gap-value",`${l.joinSpacing.bendSearchMaxSidebearingGap}`),h("exit-handle-scale-value",le(l.joinSpacing.exitHandleScale)),h("entry-handle-scale-value",le(l.joinSpacing.entryHandleScale)),["top","practice"].forEach(e=>{const t=D(e);h(`${e}-directional-dash-spacing-value`,`${t.directionalDashSpacing}px`),h(`${e}-midpoint-density-value`,`1 per ${t.midpointDensity}px`),h(`${e}-turn-radius-value`,`${t.turnRadius}px`),h(`${e}-u-turn-length-value`,`${t.uTurnLength}px`),h(`${e}-arrow-length-value`,`${t.arrowLength}px`),h(`${e}-arrow-head-size-value`,`${t.arrowHeadSize}px`),h(`${e}-arrow-stroke-width-value`,`${t.arrowStrokeWidth.toFixed(1)}px`),h(`${e}-number-size-value`,`${t.numberSize}px`),h(`${e}-number-offset-value`,`${t.numberPathOffset}px`)})},Se=()=>{xe.style.setProperty("--worksheet-preview-scale",`${l.previewZoom/100}`)},F=e=>{l.previewZoom=e,O.value=`${e}`,Se(),K()},de=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),Et=async(e,t)=>{const r=l.previewZoom;r!==e&&(F(e),await de());try{return await t()}finally{r!==e&&(F(r),await de())}},E=(e,t)=>{const r=e.path.guides,n=Math.abs(r.baseline-r.xHeight);return(t==="ascender"?r.ascender??r.xHeight-n*yt:r.descender??r.baseline+n*St)+e.offsetY},$e=(e,t)=>`
  ${l.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${E(e,"ascender")}"
      x2="${t}"
      y2="${E(e,"ascender")}"
    ></line>
  `:""}
  <line
    class="worksheet-word__guide worksheet-word__guide--midline"
    x1="0"
    y1="${e.path.guides.xHeight+e.offsetY}"
    x2="${t}"
    y2="${e.path.guides.xHeight+e.offsetY}"
  ></line>
  <line
    class="worksheet-word__guide worksheet-word__guide--baseline"
    x1="0"
    y1="${e.path.guides.baseline+e.offsetY}"
    x2="${t}"
    y2="${e.path.guides.baseline+e.offsetY}"
  ></line>
  ${l.showDescenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${E(e,"descender")}"
      x2="${t}"
      y2="${E(e,"descender")}"
    ></line>
  `:""}
`,Ae=(e,t,r)=>{const a=e.path.strokes.filter(i=>i.type!=="lift").map(i=>`<path class="worksheet-word__stroke" d="${Te(i.curves)}"></path>`).join(""),o=Ne(e.path,t,r);return`
    ${a}
    ${o}
  `},Lt=(e,t,r,n,a)=>{const o=Ae(e,t,r);return`
    <svg
      class="${n}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${ye(a)}"
      style="--formation-arrow-color: ${r.arrowColor}; --formation-arrow-stroke-width: ${r.arrowStrokeWidth}; --worksheet-word-stroke: ${r.strokeColor}; --worksheet-word-stroke-width: ${l.strokeWidth};"
    >
      ${$e(e,e.width)}
      ${o}
    </svg>
  `},Rt=e=>{const t=e.path.bounds.maxX-e.path.bounds.minX,r=e.path.bounds.minX;return t+r},Mt=(e,t,r,n,a)=>{const o=Rt(e),i=e.width+o*(n-1),s=Ae(e,t,r),d=`practice-word-${a}`,c=Array.from({length:n},(u,m)=>{const x=m*o;return`<use href="#${d}" x="${x}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${i} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${ye(`${l.text} practice line, ${n} repeat${n===1?"":"s"}`)}"
      style="--formation-arrow-color: ${r.arrowColor}; --formation-arrow-stroke-width: ${r.arrowStrokeWidth}; --worksheet-word-stroke: ${r.strokeColor}; --worksheet-word-stroke-width: ${l.strokeWidth};"
    >
      ${$e(e,i)}
      <defs>
        <g id="${d}">
          ${s}
        </g>
      </defs>
      ${c}
    </svg>
  `},g=()=>{if(l={...l,text:ve(j.value),practiceRowHeightMm:Number(X.value),practiceRepeatCount:Number(V.value),strokeWidth:Number(Z.value)},K(),l.text.length===0){w.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,_.textContent="";return}const e={joinSpacing:l.joinSpacing,keepInitialLeadIn:l.keepInitialLeadIn,keepFinalLeadOut:l.keepFinalLeadOut};let t,r;try{t=J(l.text,e),r=J(l.text,e)}catch{w.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,_.textContent="This text could not be drawn.";return}const n=Q(t.path),a=Q(r.path),o=Lt(t,n,l.top,"worksheet-word worksheet-word--top",`${l.text} with formation annotations`),i=It(),s=Array.from({length:i},(d,c)=>Mt(r,a,l.practice,l.practiceRepeatCount,c)).join("");w.style.setProperty("--practice-row-height",`${l.practiceRowHeightMm}mm`),w.innerHTML=`
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
    <section class="worksheet-page__example" aria-label="Top example">
      ${o}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${s}
    </section>
  `,_.textContent=`${i} practice lines, ${l.practiceRepeatCount} repeat${l.practiceRepeatCount===1?"":"s"} per line`},Ot=e=>new Promise((t,r)=>{const n=new Image;n.onload=()=>t(n),n.onerror=()=>r(new Error("Could not render worksheet image.")),n.src=e}),Dt=(e,t)=>{const r=URL.createObjectURL(e),n=document.createElement("a");n.href=r,n.download=t,document.body.append(n),n.click(),n.remove(),URL.revokeObjectURL(r)},N=(e,t)=>{const r=e.getBoundingClientRect();return{x:r.left-t.left,y:r.top-t.top,width:r.width,height:r.height}},z=(e,t,r,n,a,o)=>{e.save(),e.beginPath(),e.strokeStyle=a,e.lineWidth=o,e.moveTo(t,n),e.lineTo(r,n),e.stroke(),e.restore()},Nt=(e,t)=>{e.save(),e.fillStyle="#23313d",e.font="700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textBaseline="alphabetic",w.querySelectorAll(".worksheet-page__meta-line span").forEach(r=>{var s;const n=N(r,t),a=((s=r.textContent)==null?void 0:s.trim())??"",o=n.y+n.height-3;e.fillText(a,n.x,o);const i=n.x+e.measureText(a).width+15;z(e,i,n.x+n.width,n.y+n.height-1,"#cfd6dc",1.3)}),e.restore()},Ct=e=>{const t=e.cloneNode(!0);t.setAttribute("xmlns",ie);const r=document.createElementNS(ie,"style");return r.textContent=$t,t.insertBefore(r,t.firstChild),new XMLSerializer().serializeToString(t)},Ht=async(e,t,r)=>{const n=N(t,r),a=Ct(t),o=URL.createObjectURL(new Blob([a],{type:"image/svg+xml;charset=utf-8"}));try{const i=await Ot(o);e.drawImage(i,n.x,n.y,n.width,n.height)}finally{URL.revokeObjectURL(o)}},Gt=async()=>await Et(q,async()=>{g();const e=w.getBoundingClientRect(),t=Math.ceil(e.width),r=Math.ceil(e.height),n=document.createElement("canvas");n.width=t*P,n.height=r*P;const a=n.getContext("2d");if(!a)throw new Error("Could not prepare worksheet image.");a.fillStyle="#ffffff",a.fillRect(0,0,n.width,n.height),a.scale(P,P),Nt(a,e);for(const i of w.querySelectorAll(".worksheet-word"))await Ht(a,i,e);const o=w.querySelector(".worksheet-page__example");if(o){const i=N(o,e);z(a,i.x,i.x+i.width,i.y+i.height-1,"#d7dde2",1.3)}return w.querySelectorAll(".worksheet-word--practice").forEach(i=>{const s=N(i,e);z(a,s.x,s.x+s.width,s.y+s.height-.6,"#d7dde2",1.1)}),await new Promise((i,s)=>{n.toBlob(d=>{d?i(d):s(new Error("Could not encode worksheet image."))},"image/png")})});j.addEventListener("input",g);O.addEventListener("input",()=>{F(Number(O.value))});X.addEventListener("input",g);V.addEventListener("input",g);Z.addEventListener("input",g);_e.addEventListener("click",()=>{g(),window.print()});R.addEventListener("click",()=>{R.disabled=!0,_.textContent="Preparing PNG...",Gt().then(e=>{const t=ve(l.text).replaceAll(/\s+/g,"-")||"worksheet";Dt(e,`${t}-cursive-worksheet.png`),_.textContent="PNG downloaded."}).catch(e=>{_.textContent=e instanceof Error?e.message:"Could not download PNG."}).finally(()=>{R.disabled=!1})});document.querySelectorAll("[data-global-setting]").forEach(e=>{e.addEventListener("input",()=>{const t=e.dataset.globalSetting;t==="targetBendRate"||t==="minSidebearingGap"||t==="bendSearchMinSidebearingGap"||t==="bendSearchMaxSidebearingGap"||t==="exitHandleScale"||t==="entryHandleScale"?l.joinSpacing={...l.joinSpacing,[t]:Number(e.value)}:t==="keepInitialLeadIn"?l.keepInitialLeadIn=e.checked:t==="keepFinalLeadOut"?l.keepFinalLeadOut=e.checked:t==="showAscenderGuide"?l.showAscenderGuide=e.checked:t==="showDescenderGuide"&&(l.showDescenderGuide=e.checked),g()})});document.querySelectorAll("[data-scope][data-setting]").forEach(e=>{e.addEventListener("input",()=>{const t=e.dataset.scope,r=e.dataset.setting;if(!t||t!=="top"&&t!=="practice")return;const n=D(t);if(r==="directionalDashSpacing")n.directionalDashSpacing=Number(e.value);else if(r==="midpointDensity")n.midpointDensity=Number(e.value);else if(r==="turnRadius")n.turnRadius=Number(e.value);else if(r==="uTurnLength")n.uTurnLength=Number(e.value);else if(r==="arrowLength")n.arrowLength=Number(e.value);else if(r==="arrowHeadSize")n.arrowHeadSize=Number(e.value);else if(r==="arrowStrokeWidth")n.arrowStrokeWidth=Number(e.value);else if(r==="numberSize")n.numberSize=Number(e.value);else if(r==="numberPathOffset")n.numberPathOffset=Number(e.value);else if(r==="offsetArrowLanes")n.offsetArrowLanes=e.checked;else if(r==="arrowColor"||r==="numberColor"||r==="strokeColor"){const a=Pt(e.value);if(!a)return;n[r]=a}g()})});document.querySelectorAll("[data-scope][data-annotation-kind]").forEach(e=>{e.addEventListener("change",()=>{const t=e.dataset.scope,r=e.dataset.annotationKind;!t||t!=="top"&&t!=="practice"||!r||(D(t).visibility={...D(t).visibility,[r]:e.checked},g())})});K();Se();g();
