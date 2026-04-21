import{M as Xe,a as Ue,T as ze,D as ve,W as he,b as je,c as Ke,d as B,e as Ge,g as Ae,f as ye}from"./shared-BptrW1eh.js";import{T as Be,A as Qe}from"./session-DFnIrfII.js";import{c as Je,a as Ze}from"./annotations-RfTLeyof.js";const Se=document.querySelector("#app");if(!Se)throw new Error("Missing #app element for writing app.");Se.innerHTML=`
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
                min="${Xe}"
                max="${Ue}"
                step="${ze}"
                value="${ve}"
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
            <label class="writing-app__tolerance" for="directional-dash-spacing-slider">
              <span class="writing-app__tolerance-label">
                Directional dash spacing
                <span class="writing-app__tolerance-value" id="directional-dash-spacing-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="directional-dash-spacing-slider"
                type="range"
                min="80"
                max="220"
                step="4"
                value="96"
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
                <input type="checkbox" data-annotation-kind="directional-dash" checked />
                <span>Directional dash</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="turning-point" />
                <span>Turns</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="start-arrow" />
                <span>Starts</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="draw-order-number" />
                <span>Numbers</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="midpoint-arrow" />
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
`;const ke=document.querySelector("#word-label"),L=document.querySelector("#word-input"),d=document.querySelector("#trace-svg"),k=document.querySelector("#show-me-button"),De=document.querySelector("#success-overlay"),Te=document.querySelector("#next-word-button"),J=document.querySelector("#tolerance-slider"),Me=document.querySelector("#tolerance-value"),Z=document.querySelector("#midpoint-density-slider"),Ee=document.querySelector("#midpoint-density-value"),ee=document.querySelector("#directional-dash-spacing-slider"),Ie=document.querySelector("#directional-dash-spacing-value"),te=document.querySelector("#turn-radius-slider"),Le=document.querySelector("#turn-radius-value"),ne=document.querySelector("#number-offset-slider"),Ne=document.querySelector("#number-offset-value"),re=document.querySelector("#offset-arrow-lanes"),oe=document.querySelector("#arrow-color-picker"),$e=Array.from(document.querySelectorAll("[data-annotation-kind]"));if(!ke||!L||!d||!k||!De||!Te||!J||!Me||!Z||!Ee||!ee||!Ie||!te||!Le||!ne||!Ne||!re||!oe||$e.length===0)throw new Error("Missing elements for writing app.");let H=-1,h="zephyr",V=null,g=null,w=null,x=null,Q=!1,A=[],D=[],M=null,E=[],Y=[],m=null,I=null,T=!1,X=ve,le=320,ue=96,N=13,U=0,Oe=!0,se="#ffffff",z={"directional-dash":!0,"turning-point":!1,"start-arrow":!1,"draw-order-number":!1,"midpoint-arrow":!1};const et=12,tt=2,$=26,O=22,C=11,Ce=4,j=6.5,nt=j/2,rt=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),ot=e=>e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"),qe=()=>{Me.textContent=`${X}px`},Re=()=>{Ee.textContent=`1 per ${le}px`},Fe=()=>{Ie.textContent=`${ue}px`},He=()=>{Le.textContent=`${N}px`},We=()=>{Ne.textContent=`${U}px`},st=e=>/^#[0-9a-fA-F]{6}$/.test(e)?e.toLowerCase():null,it=e=>`writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${e.kind}`,at=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),ct=e=>e.kind==="start-arrow"||e.kind==="midpoint-arrow",ie=e=>e.kind==="turning-point",lt=e=>e.kind==="draw-order-number",fe=e=>"distance"in e.source?e.source.distance:e.source.turnDistance,pe=e=>e.strokes.reduce((t,n)=>t+n.totalLength,0),ut=(e,t)=>{if(e.length===0)return{x:0,y:0};for(let r=1;r<e.length;r+=1){const o=e[r-1],s=e[r];if(!(!o||!s)&&s.distanceAlongStroke>=t){const i=s.distanceAlongStroke-o.distanceAlongStroke,a=i>0?(t-o.distanceAlongStroke)/i:0;return{x:o.x+(s.x-o.x)*a,y:o.y+(s.y-o.y)*a}}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},W=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const o=e.strokes[r];if(o){if(n<=o.totalLength||r===e.strokes.length-1)return ut(o.samples,Math.max(0,Math.min(n,o.totalLength)));n-=o.totalLength}}return{x:0,y:0}},de=e=>{const t=Math.hypot(e.x,e.y);return t>0?{x:e.x/t,y:e.y/t}:{x:1,y:0}},me=(e,t,n="center")=>{const r=pe(e),o=Math.max(0,Math.min(t,r)),s=W(e,o),i=Math.min(8,Math.max(2,r/200));let a=Math.max(0,o-i),l=Math.min(r,o+i);n==="forward"?a=o:n==="backward"&&(l=o),Math.abs(l-a)<.001&&(o<=i?l=Math.min(r,o+i):a=Math.max(0,o-i));const c=W(e,a),u=W(e,l);return{point:s,tangent:de({x:u.x-c.x,y:u.y-c.y})}},S=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y),pt=(e,t)=>(e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y),dt=(e,t,n)=>({x:e.x+(t.x-e.x)*n,y:e.y+(t.y-e.y)*n}),gt=(e,t)=>{const n={x:-e.tangent.y,y:e.tangent.x};return{x:e.point.x+n.x*t,y:e.point.y+n.y*t}},Ve=(e,t)=>{const n=Math.cos(t),r=Math.sin(t);return{x:e.x*n-e.y*r,y:e.x*r+e.y*n}},v=(e,t,n,r)=>{const o=Ve({x:e.x-t.x,y:e.y-t.y},r);return{x:n.x+o.x,y:n.y+o.y}},ht=(e,t,n,r,o)=>{const s=1-o,i=s*s,a=o*o;return{x:i*s*e.x+3*i*o*t.x+3*s*a*n.x+a*o*r.x,y:i*s*e.y+3*i*o*t.y+3*s*a*n.y+a*o*r.y}},q=(e,t)=>{const n=e[e.length-1];(!n||S(n,t)>.25)&&e.push(t)},yt=(e,t)=>{const n=S(e,t),r=Math.max(1,Math.ceil(n/Ce)),o=[];for(let s=1;s<=r;s+=1)o.push(dt(e,t,s/r));return o},ft=e=>{const t=[];let n=null;return e.forEach(r=>{if(r.type==="move"){n=r.to,q(t,r.to);return}if(!n){n=r.to,q(t,r.to);return}if(r.type==="line"){yt(n,r.to).forEach(i=>q(t,i)),n=r.to;return}const o=S(n,r.cp1)+S(r.cp1,r.cp2)+S(r.cp2,r.to),s=Math.max(3,Math.ceil(o/Ce));for(let i=1;i<=s;i+=1)q(t,ht(n,r.cp1,r.cp2,r.to,i/s));n=r.to}),t},xe=e=>{var s;const t=ft(e.commands),n=(s=e.head)==null?void 0:s.polygon,o=[...t,...n??[]].reduce((i,a)=>({minX:Math.min(i.minX,a.x),minY:Math.min(i.minY,a.y),maxX:Math.max(i.maxX,a.x),maxY:Math.max(i.maxY,a.y)}),{minX:Number.POSITIVE_INFINITY,minY:Number.POSITIVE_INFINITY,maxX:Number.NEGATIVE_INFINITY,maxY:Number.NEGATIVE_INFINITY});return{pathPoints:t,...n?{headPolygon:n}:{},bounds:o}},mt=(e,t,n)=>e.minX<=t.maxX+n&&e.maxX+n>=t.minX&&e.minY<=t.maxY+n&&e.maxY+n>=t.minY,xt=(e,t,n)=>{const r=n.x-t.x,o=n.y-t.y,s=r*r+o*o;if(s===0)return S(e,t);const i=Math.max(0,Math.min(1,((e.x-t.x)*r+(e.y-t.y)*o)/s));return S(e,{x:t.x+r*i,y:t.y+o*i})},_t=(e,t)=>t.reduce((n,r,o)=>{const s=t[(o+1)%t.length];return s?Math.min(n,xt(e,r,s)):n},Number.POSITIVE_INFINITY),ae=(e,t)=>{let n=!1;for(let r=0,o=t.length-1;r<t.length;o=r,r+=1){const s=t[r],i=t[o];if(!s||!i)continue;s.y>e.y!=i.y>e.y&&e.x<(i.x-s.x)*(e.y-s.y)/(i.y-s.y)+s.x&&(n=!n)}return n},R=(e,t,n)=>(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y),F=(e,t,n)=>e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y),wt=(e,t,n,r)=>{const o=R(e,t,n),s=R(e,t,r),i=R(n,r,e),a=R(n,r,t);return o*s<0&&i*a<0?!0:Math.abs(o)<.001&&F(n,e,t)||Math.abs(s)<.001&&F(r,e,t)||Math.abs(i)<.001&&F(e,n,r)||Math.abs(a)<.001&&F(t,n,r)},bt=(e,t)=>e.length<3||t.length<3?!1:e.some((r,o)=>{const s=e[(o+1)%e.length];return!!s&&t.some((i,a)=>{const l=t[(a+1)%t.length];return!!l&&wt(r,s,i,l)})})||ae(e[0],t)||ae(t[0],e),Pt=(e,t)=>{const n=j*j;return e.some(r=>t.some(o=>pt(r,o)<=n))},_e=(e,t)=>t.length>=3&&e.some(n=>ae(n,t)||_t(n,t)<=nt),ce=(e,t,n)=>{const r=n.get(e)??xe(e),o=n.get(t)??xe(t);return n.set(e,r),n.set(t,o),r.pathPoints.length===0&&!r.headPolygon||o.pathPoints.length===0&&!o.headPolygon||!mt(r.bounds,o.bounds,j)?!1:Pt(r.pathPoints,o.pathPoints)||(r.headPolygon?_e(o.pathPoints,r.headPolygon):!1)||(o.headPolygon?_e(r.pathPoints,o.headPolygon):!1)||(r.headPolygon&&o.headPolygon?bt(r.headPolygon,o.headPolygon):!1)},we=(e,t)=>{const n=W(t,e.source.turnDistance);return Math.min(Math.abs(n.y-t.bounds.minY),Math.abs(t.bounds.maxY-n.y))},vt=(e,t,n)=>{const r=we(e,n)-we(t,n);return Math.abs(r)>.001?r:e.source.turnDistance-t.source.turnDistance},At=(e,t,n,r)=>e.type==="move"?{type:"move",to:v(e.to,t,n,r)}:e.type==="line"?{type:"line",to:v(e.to,t,n,r)}:{type:"cubic",cp1:v(e.cp1,t,n,r),cp2:v(e.cp2,t,n,r),to:v(e.to,t,n,r)},St=(e,t)=>{const n=pe(t),r=me(t,e.source.turnDistance,"forward"),o=Math.max(e.source.turnDistance,Math.min(n,e.source.endDistance)),s=me(t,o,"backward"),i=r.point,a=s.point,l=Math.atan2(s.tangent.y,s.tangent.x)-Math.atan2(r.tangent.y,r.tangent.x),c=o-e.source.turnDistance;return{annotation:{...e,commands:e.commands.map(u=>At(u,i,a,l)),...e.head?{head:{tip:v(e.head.tip,i,a,l),direction:de(Ve(e.head.direction,l)),polygon:e.head.polygon.map(u=>v(u,i,a,l))}}:{},source:{...e.source,startDistance:Math.min(n,e.source.startDistance+c),turnDistance:o,endDistance:Math.min(n,e.source.endDistance+c)}},distanceShift:c,targetDistance:o,targetPose:s}},kt=(e,t,n)=>({...e,point:t.targetPose.point,anchor:gt(t.targetPose,e.metrics.offset),direction:t.targetPose.tangent,source:{...e.source,startDistance:Math.min(n,e.source.startDistance+t.distanceShift),endDistance:Math.min(n,e.source.endDistance+t.distanceShift),distance:t.targetDistance}}),Dt=(e,t)=>{const n=e.filter(ie);if(n.length<2)return e;const r=new Map,o=new Map,s=[...n].sort((c,u)=>vt(c,u,t)),i=[];if(s.forEach(c=>{if(i.some(y=>ce(c,y,r))){o.set(c,St(c,t));return}i.push(c)}),o.size===0)return e;const a=pe(t),l=new Map;return o.forEach((c,u)=>{l.set(u.source.sectionIndex,c)}),e.map(c=>{var u;if(ie(c))return((u=o.get(c))==null?void 0:u.annotation)??c;if(lt(c)){const y=l.get(c.source.sectionIndex);return y?kt(c,y,a):c}return c})},Tt=(e,t)=>{const n=Dt(e.filter(l=>z[l.kind]),t),r=n.filter(ie),o=n.filter(ct).sort((l,c)=>fe(l)-fe(c)),s=new Map,i=[],a=new Set;return o.forEach(l=>{if(r.some(y=>ce(l,y,s))){a.add(l);return}if(i.some(y=>ce(l,y,s))){a.add(l);return}i.push(l)}),n.filter(l=>!a.has(l))},Mt=e=>{const t=de(e.direction);return{x:e.anchor.x+t.x*U,y:e.anchor.y+t.y*U}},Et=e=>{if(!z[e.kind])return"";if(e.kind==="draw-order-number"){const t=Mt(e);return`
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${t.x}"
          y="${t.y}"
          font-size="${N*2}"
          text-anchor="middle"
          dominant-baseline="central"
        >${ot(e.text)}</text>
      </g>
    `}return`
    <path
      class="${it(e)}"
      d="${Ze(e.commands)}"
    ></path>
    ${at(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${e.kind}" points="${rt(t.polygon)}"></polygon>`).join("")}
  `},G=e=>{De.hidden=!e},K=()=>{I!==null&&(cancelAnimationFrame(I),I=null),T=!1,k.disabled=!1,k.textContent="Show me",E.forEach((e,t)=>{const n=Y[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),m&&(m.style.opacity="0"),b()},be=()=>{g==null||g.reset(),x=null,G(!1),A.forEach((e,t)=>{const n=D[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),b()},b=()=>{Q||(Q=!0,requestAnimationFrame(()=>{Q=!1,Nt()}))},It=e=>{var r;if(!w)return 0;if(e.status==="complete")return w.strokes.reduce((o,s)=>o+s.totalLength,0);let t=0;for(let o=0;o<e.activeStrokeIndex;o+=1)t+=((r=w.strokes[o])==null?void 0:r.totalLength)??0;const n=w.strokes[e.activeStrokeIndex];return t+((n==null?void 0:n.totalLength)??0)*e.activeStrokeProgress},Lt=e=>{if(!w)return e.cursorTangent;const t=It(e),n=[...w.boundaries].reverse().find(r=>r.previousSegment!==r.nextSegment&&r.turnAngleDegrees>=150&&t>=r.overallDistance-tt&&t-r.overallDistance<et);return(n==null?void 0:n.outgoingTangent)??e.cursorTangent},Nt=()=>{if(!g||!M)return;const e=g.getState(),t=Lt(e),n=Math.atan2(t.y,t.x)*(180/Math.PI);M.setAttribute("transform",`translate(${e.cursorPoint.x}, ${e.cursorPoint.y}) rotate(${n})`),M.style.opacity=T?"0":"1";const r=new Set(e.completedStrokes);A.forEach((o,s)=>{const i=D[s]??0;if(r.has(s)){o.style.strokeDashoffset="0";return}if(s===e.activeStrokeIndex){const a=i*(1-e.activeStrokeProgress);o.style.strokeDashoffset=`${Math.max(0,a)}`;return}o.style.strokeDashoffset=`${i}`}),G(e.status==="complete")},$t=()=>{if(!V||T)return;be(),K();const e=new Qe(V,{speed:1.7,penUpSpeed:2.1,deferredDelayMs:150});T=!0,k.disabled=!0,k.textContent="Showing...";const t=performance.now(),n=r=>{const o=r-t,s=Math.min(o,e.totalDuration),i=e.getFrame(s),a=new Set(i.completedStrokes);if(A.forEach((l,c)=>{const u=D[c]??.001;if(a.has(c)){l.style.strokeDashoffset="0";return}if(c===i.activeStrokeIndex){const y=u*(1-i.activeStrokeProgress);l.style.strokeDashoffset=`${Math.max(0,y)}`;return}l.style.strokeDashoffset=`${u}`}),m&&(m.setAttribute("cx",i.point.x.toFixed(2)),m.setAttribute("cy",i.point.y.toFixed(2)),m.style.opacity=o<=e.totalDuration+ye?"1":"0"),o<e.totalDuration+ye){I=requestAnimationFrame(n);return}K(),be()};I=requestAnimationFrame(n),b()},Ot=(e,t,n,r)=>{const o=Ke(e);w=o,g=new Be(o,{startTolerance:X,hitTolerance:X}),x=null;const s=e.strokes.filter(p=>p.type!=="lift"),i=s.map(p=>`<path class="writing-app__stroke-bg" d="${B(p.curves)}"></path>`).join(""),a=s.map(p=>`<path class="writing-app__stroke-trace" d="${B(p.curves)}"></path>`).join(""),l=s.map(p=>`<path class="writing-app__stroke-demo" d="${B(p.curves)}"></path>`).join(""),c=Math.abs(e.guides.baseline-e.guides.xHeight)/3,u=Oe?N:0,y=Je(o,{directionalDashes:{spacing:ue,head:{length:$,width:O,tipExtension:C}},turningPoints:{offset:N,stemLength:c*.36,head:{length:$,width:O,tipExtension:C}},startArrows:{length:c*.42,minLength:c*.18,offset:u,head:{length:$,width:O,tipExtension:C}},drawOrderNumbers:{offset:0},midpointArrows:{density:le,length:c*.36,offset:u,head:{length:$,width:O,tipExtension:C}}}),ge=Tt(y,o),Ye=[...ge.filter(p=>p.kind!=="draw-order-number"),...ge.filter(p=>p.kind==="draw-order-number")].map(Et).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.style.setProperty("--formation-arrow-color",se),d.innerHTML=`
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
    ${Ye}
    ${l}
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `,A=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),E=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),M=d.querySelector("#trace-cursor"),m=d.querySelector("#demo-nib"),D=A.map(p=>{const f=p.getTotalLength();return Number.isFinite(f)&&f>0?f:.001}),Y=E.map(p=>{const f=p.getTotalLength();return Number.isFinite(f)&&f>0?f:.001}),A.forEach((p,f)=>{const P=D[f]??.001;p.style.strokeDasharray=`${P} ${P}`,p.style.strokeDashoffset=`${P}`}),E.forEach((p,f)=>{const P=Y[f]??.001;p.style.strokeDasharray=`${P} ${P}`,p.style.strokeDashoffset=`${P}`}),m&&(m.style.opacity="0"),G(!1),b()},Pe=()=>{K(),V=null,w=null,g=null,x=null,A=[],D=[],M=null,E=[],Y=[],m=null,d.innerHTML="",G(!1)},Ct=e=>e.trim().toLowerCase(),_=e=>{if(K(),h=Ct(e),ke.textContent=h,h.length===0){Pe();return}let t;try{t=je(h,{keepInitialLeadIn:!0,keepFinalLeadOut:!0})}catch{Pe();return}V=t.path,Ot(t.path,t.width,t.height,t.offsetY)},qt=()=>{H=Ge(H);const e=he[H]??he[0];L.value=e,_(e)},Rt=e=>{T||!g||x!==null||!g.beginAt(Ae(d,e))||(e.preventDefault(),x=e.pointerId,d.setPointerCapture(e.pointerId),b())},Ft=e=>{T||!g||e.pointerId!==x||(e.preventDefault(),g.update(Ae(d,e)),b())},Ht=e=>{!g||e.pointerId!==x||(g.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),x=null,b())},Wt=e=>{e.pointerId===x&&(g==null||g.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),x=null,b())};d.addEventListener("pointerdown",Rt);d.addEventListener("pointermove",Ft);d.addEventListener("pointerup",Ht);d.addEventListener("pointercancel",Wt);k.addEventListener("click",$t);Te.addEventListener("click",qt);L.addEventListener("input",()=>{H=-1,_(L.value)});J.addEventListener("input",()=>{X=Number(J.value),qe(),_(h)});Z.addEventListener("input",()=>{le=Number(Z.value),Re(),_(h)});ee.addEventListener("input",()=>{ue=Number(ee.value),Fe(),_(h)});te.addEventListener("input",()=>{N=Number(te.value),He(),_(h)});ne.addEventListener("input",()=>{U=Number(ne.value),We(),_(h)});re.addEventListener("change",()=>{Oe=re.checked,_(h)});oe.addEventListener("input",()=>{const e=st(oe.value);e&&(se=e,d.style.setProperty("--formation-arrow-color",se))});$e.forEach(e=>{e.addEventListener("change",()=>{const t=e.dataset.annotationKind;t&&(z={...z,[t]:e.checked},_(h))})});qe();Re();Fe();He();We();L.value=h;_(h);
