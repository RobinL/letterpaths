import{M as He,a as We,T as Ve,D as be,W as de,b as Ye,c as Xe,d as Ue,e as j,A as ze,f as je,g as Pe,h as ge}from"./shared-goPTOAMO.js";import{c as Ke,a as Ge}from"./annotations-BhZ9h8BC.js";const Ae=document.querySelector("#app");if(!Ae)throw new Error("Missing #app element for writing app.");Ae.innerHTML=`
  <div class="writing-app">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Trace this word</p>
            <h1 class="writing-app__word" id="word-label"></h1>
            <label class="writing-app__word-input-label" for="word-input">
              <span>Word</span>
              <input
                class="writing-app__word-input"
                id="word-input"
                type="text"
                value="zephyr"
                autocomplete="off"
                spellcheck="false"
              />
            </label>
          </div>
          <div class="writing-app__controls">
            <label class="writing-app__tolerance" for="tolerance-slider">
              <span class="writing-app__tolerance-label">
                Tolerance
                <span class="writing-app__tolerance-value" id="tolerance-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="tolerance-slider"
                type="range"
                min="${He}"
                max="${We}"
                step="${Ve}"
                value="${be}"
              />
            </label>
            <label class="writing-app__tolerance" for="midpoint-density-slider">
              <span class="writing-app__tolerance-label">
                Midpoint density
                <span class="writing-app__tolerance-value" id="midpoint-density-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="midpoint-density-slider"
                type="range"
                min="120"
                max="600"
                step="20"
                value="320"
              />
            </label>
            <label class="writing-app__tolerance" for="turn-radius-slider">
              <span class="writing-app__tolerance-label">
                Turn radius
                <span class="writing-app__tolerance-value" id="turn-radius-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="turn-radius-slider"
                type="range"
                min="0"
                max="48"
                step="1"
                value="13"
              />
            </label>
            <label class="writing-app__tolerance" for="number-offset-slider">
              <span class="writing-app__tolerance-label">
                Number offset
                <span class="writing-app__tolerance-value" id="number-offset-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="number-offset-slider"
                type="range"
                min="-80"
                max="80"
                step="1"
                value="0"
              />
            </label>
            <fieldset class="writing-app__annotation-controls" aria-label="Formation annotations">
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="turning-point" checked />
                <span>Turns</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="start-arrow" checked />
                <span>Starts</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="draw-order-number" checked />
                <span>Numbers</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="midpoint-arrow" checked />
                <span>Midpoints</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input id="offset-arrow-lanes" type="checkbox" checked />
                <span>Offset lanes</span>
              </label>
              <label class="writing-app__annotation-color" for="arrow-color-picker">
                <span>Arrow colour</span>
                <input id="arrow-color-picker" type="color" value="#ffffff" />
              </label>
            </fieldset>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Show me
          </button>
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
`;const ve=document.querySelector("#word-label"),L=document.querySelector("#word-input"),d=document.querySelector("#trace-svg"),k=document.querySelector("#show-me-button"),Se=document.querySelector("#success-overlay"),ke=document.querySelector("#next-word-button"),J=document.querySelector("#tolerance-slider"),Te=document.querySelector("#tolerance-value"),Z=document.querySelector("#midpoint-density-slider"),De=document.querySelector("#midpoint-density-value"),ee=document.querySelector("#turn-radius-slider"),Me=document.querySelector("#turn-radius-value"),te=document.querySelector("#number-offset-slider"),Ee=document.querySelector("#number-offset-value"),ne=document.querySelector("#offset-arrow-lanes"),re=document.querySelector("#arrow-color-picker"),Ie=Array.from(document.querySelectorAll("[data-annotation-kind]"));if(!ve||!L||!d||!k||!Se||!ke||!J||!Te||!Z||!De||!ee||!Me||!te||!Ee||!ne||!re||Ie.length===0)throw new Error("Missing elements for writing app.");let q=-1,y="zephyr",F=null,g=null,_=null,x=null,K=!1,v=[],T=[],M=null,E=[],H=[],m=null,I=null,D=!1,W=be,ce=320,N=13,V=0,Le=!0,oe="#ffffff",Y={"turning-point":!0,"start-arrow":!0,"draw-order-number":!0,"midpoint-arrow":!0};const Be=12,Qe=2,G=26,B=22,Q=11,Ne=4,X=6.5,Je=X/2,Ze=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),et=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),$e=()=>{Te.textContent=`${W}px`},Oe=()=>{De.textContent=`1 per ${ce}px`},Ce=()=>{Me.textContent=`${N}px`},qe=()=>{Ee.textContent=`${V}px`},tt=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,nt=e=>`writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${e.kind}`,rt=e=>e.kind==="start-arrow"||e.kind==="midpoint-arrow",se=e=>e.kind==="turning-point",ot=e=>e.kind==="draw-order-number",he=e=>"distance"in e.source?e.source.distance:e.source.turnDistance,le=e=>e.strokes.reduce((t,n)=>t+n.totalLength,0),st=(e,t)=>{if(e.length===0)return{x:0,y:0};for(let r=1;r<e.length;r+=1){const o=e[r-1],s=e[r];if(!(!o||!s)&&s.distanceAlongStroke>=t){const i=s.distanceAlongStroke-o.distanceAlongStroke,a=i>0?(t-o.distanceAlongStroke)/i:0;return{x:o.x+(s.x-o.x)*a,y:o.y+(s.y-o.y)*a}}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},R=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const o=e.strokes[r];if(o){if(n<=o.totalLength||r===e.strokes.length-1)return st(o.samples,Math.max(0,Math.min(n,o.totalLength)));n-=o.totalLength}}return{x:0,y:0}},ue=e=>{const t=Math.hypot(e.x,e.y);return t>0?{x:e.x/t,y:e.y/t}:{x:1,y:0}},ye=(e,t,n="center")=>{const r=le(e),o=Math.max(0,Math.min(t,r)),s=R(e,o),i=Math.min(8,Math.max(2,r/200));let a=Math.max(0,o-i),l=Math.min(r,o+i);n==="forward"?a=o:n==="backward"&&(l=o),Math.abs(l-a)<.001&&(o<=i?l=Math.min(r,o+i):a=Math.max(0,o-i));const c=R(e,a),u=R(e,l);return{point:s,tangent:ue({x:u.x-c.x,y:u.y-c.y})}},S=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),it=(e,t)=>(e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y),at=(e,t,n)=>({x:e.x+(t.x-e.x)*n,y:e.y+(t.y-e.y)*n}),ct=(e,t)=>{const n={x:-e.tangent.y,y:e.tangent.x};return{x:e.point.x+n.x*t,y:e.point.y+n.y*t}},Re=(e,t)=>{const n=Math.cos(t),r=Math.sin(t);return{x:e.x*n-e.y*r,y:e.x*r+e.y*n}},A=(e,t,n,r)=>{const o=Re({x:e.x-t.x,y:e.y-t.y},r);return{x:n.x+o.x,y:n.y+o.y}},lt=(e,t,n,r,o)=>{const s=1-o,i=s*s,a=o*o;return{x:i*s*e.x+3*i*o*t.x+3*s*a*n.x+a*o*r.x,y:i*s*e.y+3*i*o*t.y+3*s*a*n.y+a*o*r.y}},$=(e,t)=>{const n=e[e.length-1];(!n||S(n,t)>.25)&&e.push(t)},ut=(e,t)=>{const n=S(e,t),r=Math.max(1,Math.ceil(n/Ne)),o=[];for(let s=1;s<=r;s+=1)o.push(at(e,t,s/r));return o},pt=e=>{const t=[];let n=null;return e.forEach(r=>{if(r.type==="move"){n=r.to,$(t,r.to);return}if(!n){n=r.to,$(t,r.to);return}if(r.type==="line"){ut(n,r.to).forEach(i=>$(t,i)),n=r.to;return}const o=S(n,r.cp1)+S(r.cp1,r.cp2)+S(r.cp2,r.to),s=Math.max(3,Math.ceil(o/Ne));for(let i=1;i<=s;i+=1)$(t,lt(n,r.cp1,r.cp2,r.to,i/s));n=r.to}),t},fe=e=>{var s;const t=pt(e.commands),n=(s=e.head)==null?void 0:s.polygon,o=[...t,...n??[]].reduce((i,a)=>({minX:Math.min(i.minX,a.x),minY:Math.min(i.minY,a.y),maxX:Math.max(i.maxX,a.x),maxY:Math.max(i.maxY,a.y)}),{minX:Number.POSITIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY});return{pathPoints:t,...n?{headPolygon:n}:{},bounds:o}},dt=(e,t,n)=>e.minX<=t.maxX+n&&e.maxX+n>=t.minX&&e.minY<=t.maxY+n&&e.maxY+n>=t.minY,gt=(e,t,n)=>{const r=n.x-t.x,o=n.y-t.y,s=r*r+o*o;if(s===0)return S(e,t);const i=Math.max(0,Math.min(1,((e.x-t.x)*r+(e.y-t.y)*o)/s));return S(e,{x:t.x+r*i,y:t.y+o*i})},ht=(e,t)=>t.reduce((n,r,o)=>{const s=t[(o+1)%t.length];return s?Math.min(n,gt(e,r,s)):n},Number.POSITIVE_INFINITY),ie=(e,t)=>{let n=!1;for(let r=0,o=t.length-1;r<t.length;o=r,r+=1){const s=t[r],i=t[o];if(!s||!i)continue;s.y>e.y!=i.y>e.y&&e.x<(i.x-s.x)*(e.y-s.y)/(i.y-s.y)+s.x&&(n=!n)}return n},O=(e,t,n)=>(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y),C=(e,t,n)=>e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y),yt=(e,t,n,r)=>{const o=O(e,t,n),s=O(e,t,r),i=O(n,r,e),a=O(n,r,t);return o*s<0&&i*a<0?!0:Math.abs(o)<.001&&C(n,e,t)||Math.abs(s)<.001&&C(r,e,t)||Math.abs(i)<.001&&C(e,n,r)||Math.abs(a)<.001&&C(t,n,r)},ft=(e,t)=>e.length<3||t.length<3?!1:e.some((r,o)=>{const s=e[(o+1)%e.length];return!!s&&t.some((i,a)=>{const l=t[(a+1)%t.length];return!!l&&yt(r,s,i,l)})})||ie(e[0],t)||ie(t[0],e),mt=(e,t)=>{const n=X*X;return e.some(r=>t.some(o=>it(r,o)<=n))},me=(e,t)=>t.length>=3&&e.some(n=>ie(n,t)||ht(n,t)<=Je),ae=(e,t,n)=>{const r=n.get(e)??fe(e),o=n.get(t)??fe(t);return n.set(e,r),n.set(t,o),r.pathPoints.length===0&&!r.headPolygon||o.pathPoints.length===0&&!o.headPolygon||!dt(r.bounds,o.bounds,X)?!1:mt(r.pathPoints,o.pathPoints)||(r.headPolygon?me(o.pathPoints,r.headPolygon):!1)||(o.headPolygon?me(r.pathPoints,o.headPolygon):!1)||(r.headPolygon&&o.headPolygon?ft(r.headPolygon,o.headPolygon):!1)},xe=(e,t)=>{const n=R(t,e.source.turnDistance);return Math.min(Math.abs(n.y-t.bounds.minY),Math.abs(t.bounds.maxY-n.y))},xt=(e,t,n)=>{const r=xe(e,n)-xe(t,n);return Math.abs(r)>.001?r:e.source.turnDistance-t.source.turnDistance},wt=(e,t,n,r)=>e.type==="move"?{type:"move",to:A(e.to,t,n,r)}:e.type==="line"?{type:"line",to:A(e.to,t,n,r)}:{type:"cubic",cp1:A(e.cp1,t,n,r),cp2:A(e.cp2,t,n,r),to:A(e.to,t,n,r)},_t=(e,t)=>{const n=le(t),r=ye(t,e.source.turnDistance,"forward"),o=Math.max(e.source.turnDistance,Math.min(n,e.source.endDistance)),s=ye(t,o,"backward"),i=r.point,a=s.point,l=Math.atan2(s.tangent.y,s.tangent.x)-Math.atan2(r.tangent.y,r.tangent.x),c=o-e.source.turnDistance;return{annotation:{...e,commands:e.commands.map(u=>wt(u,i,a,l)),...e.head?{head:{tip:A(e.head.tip,i,a,l),direction:ue(Re(e.head.direction,l)),polygon:e.head.polygon.map(u=>A(u,i,a,l))}}:{},source:{...e.source,startDistance:Math.min(n,e.source.startDistance+c),turnDistance:o,endDistance:Math.min(n,e.source.endDistance+c)}},distanceShift:c,targetDistance:o,targetPose:s}},bt=(e,t,n)=>({...e,point:t.targetPose.point,anchor:ct(t.targetPose,e.metrics.offset),direction:t.targetPose.tangent,source:{...e.source,startDistance:Math.min(n,e.source.startDistance+t.distanceShift),endDistance:Math.min(n,e.source.endDistance+t.distanceShift),distance:t.targetDistance}}),Pt=(e,t)=>{const n=e.filter(se);if(n.length<2)return e;const r=new Map,o=new Map,s=[...n].sort((c,u)=>xt(c,u,t)),i=[];if(s.forEach(c=>{if(i.some(h=>ae(c,h,r))){o.set(c,_t(c,t));return}i.push(c)}),o.size===0)return e;const a=le(t),l=new Map;return o.forEach((c,u)=>{l.set(u.source.sectionIndex,c)}),e.map(c=>{var u;if(se(c))return((u=o.get(c))==null?void 0:u.annotation)??c;if(ot(c)){const h=l.get(c.source.sectionIndex);return h?bt(c,h,a):c}return c})},At=(e,t)=>{const n=Pt(e.filter(l=>Y[l.kind]),t),r=n.filter(se),o=n.filter(rt).sort((l,c)=>he(l)-he(c)),s=new Map,i=[],a=new Set;return o.forEach(l=>{if(r.some(h=>ae(l,h,s))){a.add(l);return}if(i.some(h=>ae(l,h,s))){a.add(l);return}i.push(l)}),n.filter(l=>!a.has(l))},vt=e=>{const t=ue(e.direction);return{x:e.anchor.x+t.x*V,y:e.anchor.y+t.y*V}},St=e=>{if(!Y[e.kind])return"";if(e.kind==="draw-order-number"){const t=vt(e);return`
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${t.x}"
          y="${t.y}"
          font-size="${N*2}"
          text-anchor="middle"
          dominant-baseline="central"
        >${et(e.text)}</text>
      </g>
    `}return`
    <path
      class="${nt(e)}"
      d="${Ge(e.commands)}"
    ></path>
    ${e.head?`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${e.kind}" points="${Ze(e.head.polygon)}"></polygon>`:""}
  `},z=e=>{Se.hidden=!e},U=()=>{I!==null&&(cancelAnimationFrame(I),I=null),D=!1,k.disabled=!1,k.textContent="Show me",E.forEach((e,t)=>{const n=H[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),m&&(m.style.opacity="0"),b()},we=()=>{g==null||g.reset(),x=null,z(!1),v.forEach((e,t)=>{const n=T[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),b()},b=()=>{K||(K=!0,requestAnimationFrame(()=>{K=!1,Dt()}))},kt=e=>{var r;if(!_)return 0;if(e.status==="complete")return _.strokes.reduce((o,s)=>o+s.totalLength,0);let t=0;for(let o=0;o<e.activeStrokeIndex;o+=1)t+=((r=_.strokes[o])==null?void 0:r.totalLength)??0;const n=_.strokes[e.activeStrokeIndex];return t+((n==null?void 0:n.totalLength)??0)*e.activeStrokeProgress},Tt=e=>{if(!_)return e.cursorTangent;const t=kt(e),n=[..._.boundaries].reverse().find(r=>r.previousSegment!==r.nextSegment&&r.turnAngleDegrees>=150&&t>=r.overallDistance-Qe&&t-r.overallDistance<Be);return(n==null?void 0:n.outgoingTangent)??e.cursorTangent},Dt=()=>{if(!g||!M)return;const e=g.getState(),t=Tt(e),n=Math.atan2(t.y,t.x)*(180/Math.PI);M.setAttribute("transform",`translate(${e.cursorPoint.x}, ${e.cursorPoint.y}) rotate(${n})`),M.style.opacity=D?"0":"1";const r=new Set(e.completedStrokes);v.forEach((o,s)=>{const i=T[s]??0;if(r.has(s)){o.style.strokeDashoffset="0";return}if(s===e.activeStrokeIndex){const a=i*(1-e.activeStrokeProgress);o.style.strokeDashoffset=`${Math.max(0,a)}`;return}o.style.strokeDashoffset=`${i}`}),z(e.status==="complete")},Mt=()=>{if(!F||D)return;we(),U();const e=new ze(F,{speed:1.7,penUpSpeed:2.1,deferredDelayMs:150});D=!0,k.disabled=!0,k.textContent="Showing...";const t=performance.now(),n=r=>{const o=r-t,s=Math.min(o,e.totalDuration),i=e.getFrame(s),a=new Set(i.completedStrokes);if(v.forEach((l,c)=>{const u=T[c]??.001;if(a.has(c)){l.style.strokeDashoffset="0";return}if(c===i.activeStrokeIndex){const h=u*(1-i.activeStrokeProgress);l.style.strokeDashoffset=`${Math.max(0,h)}`;return}l.style.strokeDashoffset=`${u}`}),m&&(m.setAttribute("cx",i.point.x.toFixed(2)),m.setAttribute("cy",i.point.y.toFixed(2)),m.style.opacity=o<=e.totalDuration+ge?"1":"0"),o<e.totalDuration+ge){I=requestAnimationFrame(n);return}U(),we()};I=requestAnimationFrame(n),b()},Et=(e,t,n,r)=>{const o=Xe(e);_=o,g=new Ue(o,{startTolerance:W,hitTolerance:W}),x=null;const s=e.strokes.filter(p=>p.type!=="lift"),i=s.map(p=>`<path class="writing-app__stroke-bg" d="${j(p.curves)}"></path>`).join(""),a=s.map(p=>`<path class="writing-app__stroke-trace" d="${j(p.curves)}"></path>`).join(""),l=s.map(p=>`<path class="writing-app__stroke-demo" d="${j(p.curves)}"></path>`).join(""),c=Math.abs(e.guides.baseline-e.guides.xHeight)/3,u=Le?N:0,h=Ke(o,{turningPoints:{offset:N,stemLength:c*.36,head:{length:G,width:B,tipExtension:Q}},startArrows:{length:c*.42,minLength:c*.18,offset:u,head:{length:G,width:B,tipExtension:Q}},drawOrderNumbers:{offset:0},midpointArrows:{density:ce,length:c*.36,offset:u,head:{length:G,width:B,tipExtension:Q}}}),pe=At(h,o),Fe=[...pe.filter(p=>p.kind!=="draw-order-number"),...pe.filter(p=>p.kind==="draw-order-number")].map(St).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.style.setProperty("--formation-arrow-color",oe),d.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${t}" height="${n}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${e.guides.xHeight+r}"
      x2="${t}"
      y2="${e.guides.xHeight+r}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${e.guides.baseline+r}"
      x2="${t}"
      y2="${e.guides.baseline+r}"
    ></line>
    ${i}
    ${a}
    ${Fe}
    ${l}
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `,v=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),E=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),M=d.querySelector("#trace-cursor"),m=d.querySelector("#demo-nib"),T=v.map(p=>{const f=p.getTotalLength();return Number.isFinite(f)&&f>0?f:.001}),H=E.map(p=>{const f=p.getTotalLength();return Number.isFinite(f)&&f>0?f:.001}),v.forEach((p,f)=>{const P=T[f]??.001;p.style.strokeDasharray=`${P} ${P}`,p.style.strokeDashoffset=`${P}`}),E.forEach((p,f)=>{const P=H[f]??.001;p.style.strokeDasharray=`${P} ${P}`,p.style.strokeDashoffset=`${P}`}),m&&(m.style.opacity="0"),z(!1),b()},_e=()=>{U(),F=null,_=null,g=null,x=null,v=[],T=[],M=null,E=[],H=[],m=null,d.innerHTML="",z(!1)},It=e=>e.trim().toLowerCase(),w=e=>{if(U(),y=It(e),ve.textContent=y,y.length===0){_e();return}let t;try{t=Ye(y,{keepInitialLeadIn:!0,keepFinalLeadOut:!0})}catch{_e();return}F=t.path,Et(t.path,t.width,t.height,t.offsetY)},Lt=()=>{q=je(q);const e=de[q]??de[0];L.value=e,w(e)},Nt=e=>{D||!g||x!==null||!g.beginAt(Pe(d,e))||(e.preventDefault(),x=e.pointerId,d.setPointerCapture(e.pointerId),b())},$t=e=>{D||!g||e.pointerId!==x||(e.preventDefault(),g.update(Pe(d,e)),b())},Ot=e=>{!g||e.pointerId!==x||(g.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),x=null,b())},Ct=e=>{e.pointerId===x&&(g==null||g.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),x=null,b())};d.addEventListener("pointerdown",Nt);d.addEventListener("pointermove",$t);d.addEventListener("pointerup",Ot);d.addEventListener("pointercancel",Ct);k.addEventListener("click",Mt);ke.addEventListener("click",Lt);L.addEventListener("input",()=>{q=-1,w(L.value)});J.addEventListener("input",()=>{W=Number(J.value),$e(),w(y)});Z.addEventListener("input",()=>{ce=Number(Z.value),Oe(),w(y)});ee.addEventListener("input",()=>{N=Number(ee.value),Ce(),w(y)});te.addEventListener("input",()=>{V=Number(te.value),qe(),w(y)});ne.addEventListener("change",()=>{Le=ne.checked,w(y)});re.addEventListener("input",()=>{const e=tt(re.value);e&&(oe=e,d.style.setProperty("--formation-arrow-color",oe))});Ie.forEach(e=>{e.addEventListener("change",()=>{const t=e.dataset.annotationKind;t&&(Y={...Y,[t]:e.checked},w(y))})});$e();Oe();Ce();qe();L.value=y;w(y);
