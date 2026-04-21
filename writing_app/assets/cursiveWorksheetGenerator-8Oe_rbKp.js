import{b as Pe,c as Ie,d as Me}from"./shared-BptrW1eh.js";import{c as Ee,a as Re}from"./annotations-RfTLeyof.js";const ue=26,Le=22,Oe=11,he=.42,te=.36/he,De=.18/he,y=Le/ue,S=Oe/ue,pe=4,L=6.5,Ne=L/2,Ce={"directional-dash":!1,"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0},He={"directional-dash":!1,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1},Ge=(e,t,r)=>{if(!Object.values(r.visibility).some(Boolean))return"";const a=Math.max(0,r.uTurnLength),i=Math.max(0,r.arrowLength),o=Math.max(0,r.arrowHeadSize),s=r.offsetArrowLanes?r.turnRadius:0,u=Ee(t,{directionalDashes:r.visibility["directional-dash"]?{spacing:r.directionalDashSpacing,head:{length:o,width:o*y,tipExtension:o*S}}:!1,turningPoints:r.visibility["turning-point"]?{offset:r.turnRadius,stemLength:a*te,head:{length:o,width:o*y,tipExtension:o*S}}:!1,startArrows:r.visibility["start-arrow"]?{length:i,minLength:i*De,offset:s,head:{length:o,width:o*y,tipExtension:o*S}}:!1,drawOrderNumbers:r.visibility["draw-order-number"]?{offset:0}:!1,midpointArrows:r.visibility["midpoint-arrow"]?{density:r.midpointDensity,length:i*te,offset:s,head:{length:o,width:o*y,tipExtension:o*S}}:!1}),c=dt(u,t,r.visibility);return[...c.filter(d=>d.kind!=="draw-order-number"),...c.filter(d=>d.kind==="draw-order-number")].map(d=>ht(d,r)).join("")},We=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),Fe=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),ze=e=>`writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${e.kind}`,Ue=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),Ye=e=>e.kind==="start-arrow"||e.kind==="midpoint-arrow",W=e=>e.kind==="turning-point",qe=e=>e.kind==="draw-order-number",re=e=>"distance"in e.source?e.source.distance:e.source.turnDistance,B=e=>e.strokes.reduce((t,r)=>t+r.totalLength,0),Be=(e,t)=>{if(e.length===0)return{x:0,y:0};for(let n=1;n<e.length;n+=1){const a=e[n-1],i=e[n];if(!(!a||!i)&&i.distanceAlongStroke>=t){const o=i.distanceAlongStroke-a.distanceAlongStroke,s=o>0?(t-a.distanceAlongStroke)/o:0;return{x:a.x+(i.x-a.x)*s,y:a.y+(i.y-a.y)*s}}}const r=e[e.length-1];return r?{x:r.x,y:r.y}:{x:0,y:0}},E=(e,t)=>{let r=t;for(let n=0;n<e.strokes.length;n+=1){const a=e.strokes[n];if(a){if(r<=a.totalLength||n===e.strokes.length-1)return Be(a.samples,Math.max(0,Math.min(r,a.totalLength)));r-=a.totalLength}}return{x:0,y:0}},j=e=>{const t=Math.hypot(e.x,e.y);return t>0?{x:e.x/t,y:e.y/t}:{x:1,y:0}},ne=(e,t,r="center")=>{const n=B(e),a=Math.max(0,Math.min(t,n)),i=E(e,a),o=Math.min(8,Math.max(2,n/200));let s=Math.max(0,a-o),u=Math.min(n,a+o);r==="forward"?s=a:r==="backward"&&(u=a),Math.abs(u-s)<.001&&(a<=o?u=Math.min(n,a+o):s=Math.max(0,a-o));const c=E(e,s),d=E(e,u);return{point:i,tangent:j({x:d.x-c.x,y:d.y-c.y})}},k=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),je=(e,t)=>(e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y),Ve=(e,t,r)=>({x:e.x+(t.x-e.x)*r,y:e.y+(t.y-e.y)*r}),Xe=(e,t)=>{const r={x:-e.tangent.y,y:e.tangent.x};return{x:e.point.x+r.x*t,y:e.point.y+r.y*t}},we=(e,t)=>{const r=Math.cos(t),n=Math.sin(t);return{x:e.x*r-e.y*n,y:e.x*n+e.y*r}},b=(e,t,r,n)=>{const a=we({x:e.x-t.x,y:e.y-t.y},n);return{x:r.x+a.x,y:r.y+a.y}},Ze=(e,t,r,n,a)=>{const i=1-a,o=i*i,s=a*a;return{x:o*i*e.x+3*o*a*t.x+3*i*s*r.x+s*a*n.x,y:o*i*e.y+3*o*a*t.y+3*i*s*r.y+s*a*n.y}},$=(e,t)=>{const r=e[e.length-1];(!r||k(r,t)>.25)&&e.push(t)},Ke=(e,t)=>{const r=k(e,t),n=Math.max(1,Math.ceil(r/pe)),a=[];for(let i=1;i<=n;i+=1)a.push(Ve(e,t,i/n));return a},Je=e=>{const t=[];let r=null;return e.forEach(n=>{if(n.type==="move"){r=n.to,$(t,n.to);return}if(!r){r=n.to,$(t,n.to);return}if(n.type==="line"){Ke(r,n.to).forEach(o=>$(t,o)),r=n.to;return}const a=k(r,n.cp1)+k(n.cp1,n.cp2)+k(n.cp2,n.to),i=Math.max(3,Math.ceil(a/pe));for(let o=1;o<=i;o+=1)$(t,Ze(r,n.cp1,n.cp2,n.to,o/i));r=n.to}),t},ae=e=>{var i;const t=Je(e.commands),r=(i=e.head)==null?void 0:i.polygon,a=[...t,...r??[]].reduce((o,s)=>({minX:Math.min(o.minX,s.x),minY:Math.min(o.minY,s.y),maxX:Math.max(o.maxX,s.x),maxY:Math.max(o.maxY,s.y)}),{minX:Number.POSITIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY});return{pathPoints:t,...r?{headPolygon:r}:{},bounds:a}},Qe=(e,t,r)=>e.minX<=t.maxX+r&&e.maxX+r>=t.minX&&e.minY<=t.maxY+r&&e.maxY+r>=t.minY,et=(e,t,r)=>{const n=r.x-t.x,a=r.y-t.y,i=n*n+a*a;if(i===0)return k(e,t);const o=Math.max(0,Math.min(1,((e.x-t.x)*n+(e.y-t.y)*a)/i));return k(e,{x:t.x+n*o,y:t.y+a*o})},tt=(e,t)=>t.reduce((r,n,a)=>{const i=t[(a+1)%t.length];return i?Math.min(r,et(e,n,i)):r},Number.POSITIVE_INFINITY),F=(e,t)=>{let r=!1;for(let n=0,a=t.length-1;n<t.length;a=n,n+=1){const i=t[n],o=t[a];if(!i||!o)continue;i.y>e.y!=o.y>e.y&&e.x<(o.x-i.x)*(e.y-i.y)/(o.y-i.y)+i.x&&(r=!r)}return r},A=(e,t,r)=>(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y),T=(e,t,r)=>e.x<=Math.max(t.x,r.x)&&e.x>=Math.min(t.x,r.x)&&e.y<=Math.max(t.y,r.y)&&e.y>=Math.min(t.y,r.y),rt=(e,t,r,n)=>{const a=A(e,t,r),i=A(e,t,n),o=A(r,n,e),s=A(r,n,t);return a*i<0&&o*s<0?!0:Math.abs(a)<.001&&T(r,e,t)||Math.abs(i)<.001&&T(n,e,t)||Math.abs(o)<.001&&T(e,r,n)||Math.abs(s)<.001&&T(t,r,n)},nt=(e,t)=>{if(e.length<3||t.length<3)return!1;const r=e.some((i,o)=>{const s=e[(o+1)%e.length];return!!s&&t.some((u,c)=>{const d=t[(c+1)%t.length];return!!d&&rt(i,s,u,d)})}),n=e[0],a=t[0];return r||!!n&&F(n,t)||!!a&&F(a,e)},at=(e,t)=>{const r=L*L;return e.some(n=>t.some(a=>je(n,a)<=r))},oe=(e,t)=>t.length>=3&&e.some(r=>F(r,t)||tt(r,t)<=Ne),z=(e,t,r)=>{const n=r.get(e)??ae(e),a=r.get(t)??ae(t);return r.set(e,n),r.set(t,a),n.pathPoints.length===0&&!n.headPolygon||a.pathPoints.length===0&&!a.headPolygon||!Qe(n.bounds,a.bounds,L)?!1:at(n.pathPoints,a.pathPoints)||(n.headPolygon?oe(a.pathPoints,n.headPolygon):!1)||(a.headPolygon?oe(n.pathPoints,a.headPolygon):!1)||(n.headPolygon&&a.headPolygon?nt(n.headPolygon,a.headPolygon):!1)},ie=(e,t)=>{const r=E(t,e.source.turnDistance);return Math.min(Math.abs(r.y-t.bounds.minY),Math.abs(t.bounds.maxY-r.y))},ot=(e,t,r)=>{const n=ie(e,r)-ie(t,r);return Math.abs(n)>.001?n:e.source.turnDistance-t.source.turnDistance},it=(e,t,r,n)=>e.type==="move"?{type:"move",to:b(e.to,t,r,n)}:e.type==="line"?{type:"line",to:b(e.to,t,r,n)}:{type:"cubic",cp1:b(e.cp1,t,r,n),cp2:b(e.cp2,t,r,n),to:b(e.to,t,r,n)},st=(e,t)=>{const r=B(t),n=ne(t,e.source.turnDistance,"forward"),a=Math.max(e.source.turnDistance,Math.min(r,e.source.endDistance)),i=ne(t,a,"backward"),o=n.point,s=i.point,u=Math.atan2(i.tangent.y,i.tangent.x)-Math.atan2(n.tangent.y,n.tangent.x),c=a-e.source.turnDistance;return{annotation:{...e,commands:e.commands.map(d=>it(d,o,s,u)),...e.head?{head:{tip:b(e.head.tip,o,s,u),direction:j(we(e.head.direction,u)),polygon:e.head.polygon.map(d=>b(d,o,s,u))}}:{},source:{...e.source,startDistance:Math.min(r,e.source.startDistance+c),turnDistance:a,endDistance:Math.min(r,e.source.endDistance+c)}},distanceShift:c,targetDistance:a,targetPose:i}},lt=(e,t,r)=>({...e,point:t.targetPose.point,anchor:Xe(t.targetPose,e.metrics.offset),direction:t.targetPose.tangent,source:{...e.source,startDistance:Math.min(r,e.source.startDistance+t.distanceShift),endDistance:Math.min(r,e.source.endDistance+t.distanceShift),distance:t.targetDistance}}),ct=(e,t)=>{const r=e.filter(W);if(r.length<2)return e;const n=new Map,a=new Map,i=[...r].sort((c,d)=>ot(c,d,t)),o=[];if(i.forEach(c=>{if(o.some(m=>z(c,m,n))){a.set(c,st(c,t));return}o.push(c)}),a.size===0)return e;const s=B(t),u=new Map;return a.forEach((c,d)=>{u.set(d.source.sectionIndex,c)}),e.map(c=>{var d;if(W(c))return((d=a.get(c))==null?void 0:d.annotation)??c;if(qe(c)){const m=u.get(c.source.sectionIndex);return m?lt(c,m,s):c}return c})},dt=(e,t,r)=>{const n=ct(e.filter(c=>r[c.kind]),t),a=n.filter(W),i=n.filter(Ye).sort((c,d)=>re(c)-re(d)),o=new Map,s=[],u=new Set;return i.forEach(c=>{if(a.some(_=>z(c,_,o))){u.add(c);return}if(s.some(_=>z(c,_,o))){u.add(c);return}s.push(c)}),n.filter(c=>!u.has(c))},ut=(e,t)=>{const r=j(e.direction);return{x:e.anchor.x+r.x*t.numberPathOffset,y:e.anchor.y+r.y*t.numberPathOffset}},ht=(e,t)=>{if(!t.visibility[e.kind])return"";if(e.kind==="draw-order-number"){const r=ut(e,t);return`
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${r.x}"
          y="${r.y}"
          fill="${t.numberColor}"
          font-size="${t.numberSize}"
          text-anchor="middle"
          dominant-baseline="central"
        >${Fe(e.text)}</text>
      </g>
    `}return`
    <path
      class="${ze(e)}"
      d="${Re(e.commands)}"
      stroke-width="${t.arrowStrokeWidth}"
    ></path>
    ${Ue(e).map(r=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${e.kind}" points="${We(r.polygon)}"></polygon>`).join("")}
  `},ge="zephyr",pt=96,wt=320,me=13,gt=53,mt=53,ft=26,bt=5.6,kt=me*2,xt=0,_t="#3f454b",vt="#ffffff",yt="#bac4ce",St="#d5dbe2",fe=24,be=1,ke=54,V=100,$t=178,At=.63,Tt=.66,P=2,se="http://www.w3.org/2000/svg",Pt=`
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
`,f={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},X=document.querySelector("#app");if(!X)throw new Error("Missing #app element for cursive worksheet generator.");document.body.classList.add("worksheet-body");X.classList.add("worksheet-root");const U=e=>({"directional-dash":e["directional-dash"],"turning-point":e["turning-point"],"start-arrow":e["start-arrow"],"draw-order-number":e["draw-order-number"],"midpoint-arrow":e["midpoint-arrow"]}),le=(e,t)=>({directionalDashSpacing:pt,midpointDensity:wt,turnRadius:me,uTurnLength:gt,arrowLength:mt,arrowHeadSize:ft,arrowStrokeWidth:bt,numberSize:kt,numberPathOffset:xt,numberColor:_t,offsetArrowLanes:!0,visibility:U(e),arrowColor:vt,strokeColor:t});let l={text:ge,previewZoom:V,practiceRowHeightMm:fe,practiceRepeatCount:be,strokeWidth:ke,joinSpacing:{...f},showAscenderGuide:!1,showDescenderGuide:!1,keepInitialLeadIn:!0,keepFinalLeadOut:!0,top:le(Ce,yt),practice:le(He,St)};X.innerHTML=`
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

        ${p({id:"preview-zoom-slider",label:"Preview zoom",value:V,min:50,max:200,step:5,valueId:"preview-zoom-value"})}

        ${p({id:"practice-size-slider",label:"Practice size",value:fe,min:14,max:38,step:1,valueId:"practice-size-value"})}

        ${p({id:"practice-repeat-slider",label:"Practice repeats",value:be,min:1,max:6,step:1,valueId:"practice-repeat-value"})}

        ${p({id:"stroke-width-slider",label:"Main stroke thickness",value:ke,min:20,max:90,step:2,valueId:"stroke-width-value"})}

        ${It()}

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
`;const Z=document.querySelector("#worksheet-text-input"),O=document.querySelector("#preview-zoom-slider"),K=document.querySelector("#practice-size-slider"),J=document.querySelector("#practice-repeat-slider"),Q=document.querySelector("#stroke-width-slider"),xe=document.querySelector("#print-worksheet-button"),R=document.querySelector("#download-png-button"),_e=document.querySelector("#worksheet-page-frame"),g=document.querySelector("#worksheet-page"),x=document.querySelector("#worksheet-status");if(!Z||!O||!K||!J||!Q||!xe||!R||!_e||!g||!x)throw new Error("Missing elements for cursive worksheet generator.");function p({id:e,label:t,value:r,min:n,max:a,step:i,valueId:o=`${e}-value`,attrs:s=""}){return`
    <label class="worksheet-app__field" for="${e}">
      <span>
        ${t}
        <strong id="${o}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${e}"
        type="range"
        min="${n}"
        max="${a}"
        step="${i}"
        value="${r}"
        ${s}
      />
    </label>
  `}function It(){return`
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
  `}const ve=e=>e.trim().toLowerCase().replace(/\s+/g," "),ye=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),Mt=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,D=e=>l[e],Et=()=>Math.max(1,Math.floor($t/l.practiceRowHeightMm)),de=e=>e.toFixed(2),h=(e,t)=>{const r=document.querySelector(`#${e}`);r&&(r.textContent=t)},ee=()=>{h("preview-zoom-value",`${l.previewZoom}%`),h("practice-size-value",`${l.practiceRowHeightMm} mm`),h("practice-repeat-value",`${l.practiceRepeatCount}`),h("stroke-width-value",`${l.strokeWidth}px`),h("target-bend-rate-value",`${l.joinSpacing.targetBendRate}`),h("min-sidebearing-gap-value",`${l.joinSpacing.minSidebearingGap}`),h("bend-search-min-sidebearing-gap-value",`${l.joinSpacing.bendSearchMinSidebearingGap}`),h("bend-search-max-sidebearing-gap-value",`${l.joinSpacing.bendSearchMaxSidebearingGap}`),h("exit-handle-scale-value",de(l.joinSpacing.exitHandleScale)),h("entry-handle-scale-value",de(l.joinSpacing.entryHandleScale)),["top","practice"].forEach(e=>{const t=D(e);h(`${e}-directional-dash-spacing-value`,`${t.directionalDashSpacing}px`),h(`${e}-midpoint-density-value`,`1 per ${t.midpointDensity}px`),h(`${e}-turn-radius-value`,`${t.turnRadius}px`),h(`${e}-u-turn-length-value`,`${t.uTurnLength}px`),h(`${e}-arrow-length-value`,`${t.arrowLength}px`),h(`${e}-arrow-head-size-value`,`${t.arrowHeadSize}px`),h(`${e}-arrow-stroke-width-value`,`${t.arrowStrokeWidth.toFixed(1)}px`),h(`${e}-number-size-value`,`${t.numberSize}px`),h(`${e}-number-offset-value`,`${t.numberPathOffset}px`)})},Se=()=>{_e.style.setProperty("--worksheet-preview-scale",`${l.previewZoom/100}`)},Y=e=>{l.previewZoom=e,O.value=`${e}`,Se(),ee()},N=()=>new Promise(e=>{requestAnimationFrame(()=>e())}),G=(e,t)=>{const r=e.map(t);return{avgMs:Number((r.reduce((n,a)=>n+a,0)/r.length).toFixed(3)),minMs:Number(Math.min(...r).toFixed(3)),maxMs:Number(Math.max(...r).toFixed(3))}},$e=()=>({text:l.text,practiceRepeatCount:l.practiceRepeatCount,practiceRowHeightMm:l.practiceRowHeightMm,topVisibility:U(l.top.visibility),practiceVisibility:U(l.practice.visibility)}),Rt=async(e={})=>{const t=Math.max(1,Math.floor(e.iterations??10)),r=Math.max(0,Math.floor(e.warmupRuns??2)),n=[];for(let a=0;a<r;a+=1)w(),await N();for(let a=0;a<t;a+=1){const i=performance.now();w();const o=performance.now();await N();const s=performance.now();n.push({renderMs:o-i,paintMs:s-o,totalMs:s-i})}return{iterations:t,state:$e(),render:G(n,a=>a.renderMs),paint:G(n,a=>a.paintMs),total:G(n,a=>a.totalMs),runs:n}},Lt=async(e,t)=>{const r=l.previewZoom;r!==e&&(Y(e),await N());try{return await t()}finally{r!==e&&(Y(r),await N())}},M=(e,t)=>{const r=e.path.guides,n=Math.abs(r.baseline-r.xHeight);return(t==="ascender"?r.ascender??r.xHeight-n*At:r.descender??r.baseline+n*Tt)+e.offsetY},Ae=(e,t)=>`
  ${l.showAscenderGuide?`
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${M(e,"ascender")}"
      x2="${t}"
      y2="${M(e,"ascender")}"
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
      y1="${M(e,"descender")}"
      x2="${t}"
      y2="${M(e,"descender")}"
    ></line>
  `:""}
`,Te=(e,t,r)=>{const a=e.path.strokes.filter(o=>o.type!=="lift").map(o=>`<path class="worksheet-word__stroke" d="${Me(o.curves)}"></path>`).join(""),i=Ge(e.path,t,r);return`
    ${a}
    ${i}
  `},Ot=(e,t,r,n,a)=>{const i=Te(e,t,r);return`
    <svg
      class="${n}"
      viewBox="0 0 ${e.width} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${ye(a)}"
      style="--formation-arrow-color: ${r.arrowColor}; --formation-arrow-stroke-width: ${r.arrowStrokeWidth}; --worksheet-word-stroke: ${r.strokeColor}; --worksheet-word-stroke-width: ${l.strokeWidth};"
    >
      ${Ae(e,e.width)}
      ${i}
    </svg>
  `},Dt=e=>{const t=e.path.bounds.maxX-e.path.bounds.minX,r=e.path.bounds.minX;return t+r},Nt=(e,t,r,n,a)=>{const i=Dt(e),o=e.width+i*(n-1),s=Te(e,t,r),u=`practice-word-${a}`,c=Array.from({length:n},(d,m)=>{const _=m*i;return`<use href="#${u}" x="${_}" y="0"></use>`}).join("");return`
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${o} ${e.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${ye(`${l.text} practice line, ${n} repeat${n===1?"":"s"}`)}"
      style="--formation-arrow-color: ${r.arrowColor}; --formation-arrow-stroke-width: ${r.arrowStrokeWidth}; --worksheet-word-stroke: ${r.strokeColor}; --worksheet-word-stroke-width: ${l.strokeWidth};"
    >
      ${Ae(e,o)}
      <defs>
        <g id="${u}">
          ${s}
        </g>
      </defs>
      ${c}
    </svg>
  `},w=()=>{if(l={...l,text:ve(Z.value),practiceRowHeightMm:Number(K.value),practiceRepeatCount:Number(J.value),strokeWidth:Number(Q.value)},ee(),l.text.length===0){g.innerHTML=`
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `,x.textContent="";return}const e={joinSpacing:l.joinSpacing,keepInitialLeadIn:l.keepInitialLeadIn,keepFinalLeadOut:l.keepFinalLeadOut};let t;try{t=Pe(l.text,e)}catch{g.innerHTML=`
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `,x.textContent="This text could not be drawn.";return}const r=Ie(t.path),n=Ot(t,r,l.top,"worksheet-word worksheet-word--top",`${l.text} with formation annotations`),a=Et(),i=Array.from({length:a},(o,s)=>Nt(t,r,l.practice,l.practiceRepeatCount,s)).join("");g.style.setProperty("--practice-row-height",`${l.practiceRowHeightMm}mm`),g.innerHTML=`
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
      ${i}
    </section>
  `,x.textContent=`${a} practice lines, ${l.practiceRepeatCount} repeat${l.practiceRepeatCount===1?"":"s"} per line`},Ct=e=>new Promise((t,r)=>{const n=new Image;n.onload=()=>t(n),n.onerror=()=>r(new Error("Could not render worksheet image.")),n.src=e}),Ht=(e,t)=>{const r=URL.createObjectURL(e),n=document.createElement("a");n.href=r,n.download=t,document.body.append(n),n.click(),n.remove(),URL.revokeObjectURL(r)},C=(e,t)=>{const r=e.getBoundingClientRect();return{x:r.left-t.left,y:r.top-t.top,width:r.width,height:r.height}},q=(e,t,r,n,a,i)=>{e.save(),e.beginPath(),e.strokeStyle=a,e.lineWidth=i,e.moveTo(t,n),e.lineTo(r,n),e.stroke(),e.restore()},Gt=(e,t)=>{e.save(),e.fillStyle="#23313d",e.font="700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",e.textBaseline="alphabetic",g.querySelectorAll(".worksheet-page__meta-line span").forEach(r=>{var s;const n=C(r,t),a=((s=r.textContent)==null?void 0:s.trim())??"",i=n.y+n.height-3;e.fillText(a,n.x,i);const o=n.x+e.measureText(a).width+15;q(e,o,n.x+n.width,n.y+n.height-1,"#cfd6dc",1.3)}),e.restore()},Wt=e=>{const t=e.cloneNode(!0);t.setAttribute("xmlns",se);const r=document.createElementNS(se,"style");return r.textContent=Pt,t.insertBefore(r,t.firstChild),new XMLSerializer().serializeToString(t)},Ft=async(e,t,r)=>{const n=C(t,r),a=Wt(t),i=URL.createObjectURL(new Blob([a],{type:"image/svg+xml;charset=utf-8"}));try{const o=await Ct(i);e.drawImage(o,n.x,n.y,n.width,n.height)}finally{URL.revokeObjectURL(i)}},zt=async()=>await Lt(V,async()=>{w();const e=g.getBoundingClientRect(),t=Math.ceil(e.width),r=Math.ceil(e.height),n=document.createElement("canvas");n.width=t*P,n.height=r*P;const a=n.getContext("2d");if(!a)throw new Error("Could not prepare worksheet image.");a.fillStyle="#ffffff",a.fillRect(0,0,n.width,n.height),a.scale(P,P),Gt(a,e);for(const o of g.querySelectorAll(".worksheet-word"))await Ft(a,o,e);const i=g.querySelector(".worksheet-page__example");if(i){const o=C(i,e);q(a,o.x,o.x+o.width,o.y+o.height-1,"#d7dde2",1.3)}return g.querySelectorAll(".worksheet-word--practice").forEach(o=>{const s=C(o,e);q(a,s.x,s.x+s.width,s.y+s.height-.6,"#d7dde2",1.1)}),await new Promise((o,s)=>{n.toBlob(u=>{u?o(u):s(new Error("Could not encode worksheet image."))},"image/png")})});Z.addEventListener("input",w);O.addEventListener("input",()=>{Y(Number(O.value))});K.addEventListener("input",w);J.addEventListener("input",w);Q.addEventListener("input",w);xe.addEventListener("click",()=>{w(),window.print()});R.addEventListener("click",()=>{R.disabled=!0,x.textContent="Preparing PNG...",zt().then(e=>{const t=ve(l.text).replaceAll(/\s+/g,"-")||"worksheet";Ht(e,`${t}-cursive-worksheet.png`),x.textContent="PNG downloaded."}).catch(e=>{x.textContent=e instanceof Error?e.message:"Could not download PNG."}).finally(()=>{R.disabled=!1})});document.querySelectorAll("[data-global-setting]").forEach(e=>{e.addEventListener("input",()=>{const t=e.dataset.globalSetting;t==="targetBendRate"||t==="minSidebearingGap"||t==="bendSearchMinSidebearingGap"||t==="bendSearchMaxSidebearingGap"||t==="exitHandleScale"||t==="entryHandleScale"?l.joinSpacing={...l.joinSpacing,[t]:Number(e.value)}:t==="keepInitialLeadIn"?l.keepInitialLeadIn=e.checked:t==="keepFinalLeadOut"?l.keepFinalLeadOut=e.checked:t==="showAscenderGuide"?l.showAscenderGuide=e.checked:t==="showDescenderGuide"&&(l.showDescenderGuide=e.checked),w()})});document.querySelectorAll("[data-scope][data-setting]").forEach(e=>{e.addEventListener("input",()=>{const t=e.dataset.scope,r=e.dataset.setting;if(!t||t!=="top"&&t!=="practice")return;const n=D(t);if(r==="directionalDashSpacing")n.directionalDashSpacing=Number(e.value);else if(r==="midpointDensity")n.midpointDensity=Number(e.value);else if(r==="turnRadius")n.turnRadius=Number(e.value);else if(r==="uTurnLength")n.uTurnLength=Number(e.value);else if(r==="arrowLength")n.arrowLength=Number(e.value);else if(r==="arrowHeadSize")n.arrowHeadSize=Number(e.value);else if(r==="arrowStrokeWidth")n.arrowStrokeWidth=Number(e.value);else if(r==="numberSize")n.numberSize=Number(e.value);else if(r==="numberPathOffset")n.numberPathOffset=Number(e.value);else if(r==="offsetArrowLanes")n.offsetArrowLanes=e.checked;else if(r==="arrowColor"||r==="numberColor"||r==="strokeColor"){const a=Mt(e.value);if(!a)return;n[r]=a}w()})});document.querySelectorAll("[data-scope][data-annotation-kind]").forEach(e=>{e.addEventListener("change",()=>{const t=e.dataset.scope,r=e.dataset.annotationKind;!t||t!=="top"&&t!=="practice"||!r||(D(t).visibility={...D(t).visibility,[r]:e.checked},w())})});ee();Se();w();window.__worksheetProfiler={getState:$e,profileRender:Rt};
