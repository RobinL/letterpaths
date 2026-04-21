var le=Object.defineProperty;var de=(e,t,n)=>t in e?le(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var y=(e,t,n)=>de(e,typeof t!="symbol"?t+"":t,n);import"./z-lower-cursive-bezier-entry-low-B2oMjkLV.js";import{C as Z,d as O,b as ue,l as me}from"./joiner-C8q7XHuM.js";class ge{constructor(t,n={}){y(this,"strokes");y(this,"strokeLengths");y(this,"strokeTimings");y(this,"segments");y(this,"speed");y(this,"penUpSpeed");y(this,"minLiftDistance");y(this,"strokeDelayMs");y(this,"deferredDelayMs");y(this,"totalDuration");this.strokes=t.strokes,this.speed=n.speed??1.8,this.penUpSpeed=n.penUpSpeed??2.2,this.minLiftDistance=n.minLiftDistance??.5,this.strokeDelayMs=n.strokeDelayMs??0,this.deferredDelayMs=n.deferredDelayMs??120,this.strokeLengths=this.strokes.map(o=>o.curves.reduce((a,r)=>a+r.length(),0)),this.strokeTimings=[],this.segments=[];let s=0,i=null;this.strokes.forEach((o,a)=>{var g,f;const r=((g=o.curves[0])==null?void 0:g.p0)??{x:0,y:0},d=((f=o.curves[o.curves.length-1])==null?void 0:f.p3)??r,c=this.strokeDelayMs+(o.deferred?this.deferredDelayMs:0);if(c>0){const u=i??r;this.segments.push({kind:"pause",startTime:s,duration:c,length:0,from:u,to:u,strokeIndex:a}),s+=c}if(i){const u=Math.hypot(r.x-i.x,r.y-i.y);if(u>this.minLiftDistance){const p=u/this.penUpSpeed;this.segments.push({kind:"lift",startTime:s,duration:p,length:u,from:i,to:r,strokeIndex:a}),s+=p}}const l=this.strokeLengths[a]??0,m=l/this.speed;this.strokeTimings.push({start:s,duration:m}),this.segments.push({kind:"stroke",startTime:s,duration:m,length:l,from:r,to:d,strokeIndex:a,stroke:o}),s+=m,i=d}),this.totalDuration=s}getFrame(t){if(this.strokes.length===0||this.segments.length===0)return{point:{x:0,y:0},velocity:{x:0,y:0},isPenDown:!1,completedStrokes:[],activeStrokeIndex:-1,activeStrokeProgress:0};const n=Math.max(0,t),s=this.segments.find(m=>n>=m.startTime&&n<=m.startTime+m.duration)??this.segments[this.segments.length-1],i=s.duration>0?Math.min((n-s.startTime)/s.duration,1):1;if(s.kind==="lift"||s.kind==="pause"){const m={x:s.from.x+(s.to.x-s.from.x)*i,y:s.from.y+(s.to.y-s.from.y)*i},g=s.kind==="lift"?ee({x:s.to.x-s.from.x,y:s.to.y-s.from.y}):{x:0,y:0};return{point:m,velocity:{x:g.x*this.penUpSpeed,y:g.y*this.penUpSpeed},isPenDown:!1,completedStrokes:this.collectCompletedStrokes(n),activeStrokeIndex:-1,activeStrokeProgress:0}}const o=s.strokeIndex,a=s.stroke??this.strokes[o],r=this.strokeLengths[o]??0,d=r*i,{point:c,tangent:l}=he(a,d);return{point:c,velocity:{x:l.x*this.speed,y:l.y*this.speed},isPenDown:!0,completedStrokes:this.collectCompletedStrokes(n),activeStrokeIndex:o,activeStrokeProgress:r>0?d/r:1}}collectCompletedStrokes(t){const n=[];return this.strokeTimings.forEach((s,i)=>{t>=s.start+s.duration&&n.push(i)}),n}}function he(e,t){let n=t;for(let i=0;i<e.curves.length;i+=1){const o=e.curves[i],a=o.length();if(n<=a||i===e.curves.length-1){const r=o.getTAtLength(Math.max(0,n)),d=o.getPointAt(r),c=ee(o.getTangentAt(r));return{point:d,tangent:c}}n-=a}return{point:(e.curves[e.curves.length-1]??new Z({x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0})).p3,tangent:{x:1,y:0}}}function ee(e){const t=Math.hypot(e.x,e.y);return t===0?{x:1,y:0}:{x:e.x/t,y:e.y/t}}function pe(e,t={}){const n=t.sampleRate??2,s=[];let i=0;const o=[];return e.strokes.filter(a=>a.type!=="lift").forEach(a=>{var g,f;const r=[];let d=0,c=0;for(const u of a.curves)d+=u.length();for(let u=0;u<a.curves.length-1;u+=1){const p=a.curves[u],_=a.curves[u+1];if(!p||!_)continue;const $=p.length(),S=(g=a.curveSegments)==null?void 0:g[u],v=(f=a.curveSegments)==null?void 0:f[u+1],b=E(p.getTangentAt(1)),I=E(_.getTangentAt(0)),R=xe(b.x*I.x+b.y*I.y);s.push({overallDistance:i+c+$,point:{x:p.p3.x,y:p.p3.y},previousSegment:S,nextSegment:v,incomingTangent:b,outgoingTangent:I,turnAngleDegrees:Math.acos(R)*(180/Math.PI)}),c+=$}const l=d<n;if(l){const u=a.curves[0];if(u){const p=E(u.getTangentAt(0));r.push({x:u.p0.x,y:u.p0.y,tangent:p,distanceAlongStroke:0})}o.push({samples:r,totalLength:d,isDot:l}),i+=d;return}const m=Math.max(2,Math.ceil(d/n));for(let u=0;u<=m;u++){const p=u/m*d,{point:_,tangent:$}=ye(a.curves,p);r.push({x:_.x,y:_.y,tangent:$,distanceAlongStroke:p})}o.push({samples:r,totalLength:d,isDot:l}),i+=d}),{strokes:o,boundaries:s,guides:e.guides,bounds:e.bounds}}function ye(e,t){let n=t;for(let i=0;i<e.length;i++){const o=e[i],a=o.length();if(n<=a||i===e.length-1){const r=o.getTAtLength(Math.max(0,n)),d=o.getPointAt(r),c=E(o.getTangentAt(r));return{point:d,tangent:c}}n-=a}const s=e[e.length-1];return s?{point:s.p3,tangent:E(s.getTangentAt(1))}:{point:{x:0,y:0},tangent:{x:1,y:0}}}function E(e){const t=Math.hypot(e.x,e.y);return t===0?{x:1,y:0}:{x:e.x/t,y:e.y/t}}function xe(e){return Math.max(-1,Math.min(1,e))}class fe{constructor(t,n={}){y(this,"path");y(this,"startTolerance");y(this,"hitTolerance");y(this,"maxAdvanceSamples");y(this,"advanceBias");y(this,"state");y(this,"currentSampleIndex");this.path=t,this.startTolerance=n.startTolerance??60,this.hitTolerance=n.hitTolerance??70,this.maxAdvanceSamples=n.maxAdvanceSamples??50,this.advanceBias=n.advanceBias??.4,this.currentSampleIndex=0,this.state=this.buildInitialState()}buildInitialState(){const t=this.path.strokes[0],n=t==null?void 0:t.samples[0];return{status:"idle",cursorPoint:n?{x:n.x,y:n.y}:{x:0,y:0},cursorTangent:(n==null?void 0:n.tangent)??{x:1,y:0},completedStrokes:[],activeStrokeIndex:0,activeStrokeProgress:0,isPenDown:!1}}getState(){return{...this.state}}getPath(){return this.path}beginAt(t){const{status:n,cursorPoint:s}=this.state;if(n!=="idle"&&n!=="await_pen_up"||Math.hypot(t.x-s.x,t.y-s.y)>this.startTolerance)return!1;const o=this.path.strokes[this.state.activeStrokeIndex];return o!=null&&o.isDot?(this.completeCurrentStroke(),!0):(this.state={...this.state,status:"tracing",isPenDown:!0},!0)}update(t){if(this.state.status!=="tracing")return;const n=this.path.strokes[this.state.activeStrokeIndex];if(!n)return;const s=n.samples,i=this.currentSampleIndex,o=Math.min(i+this.maxAdvanceSamples,s.length-1);let a=i,r=1/0,d=1/0;for(let l=i;l<=o;l++){const m=s[l];if(!m)continue;const g=Math.hypot(t.x-m.x,t.y-m.y),f=(l-i)*this.advanceBias,u=g+f;u<r&&(r=u,d=g,a=l)}if(d>this.hitTolerance)return;const c=s[a];c&&(this.currentSampleIndex=a,this.state={...this.state,cursorPoint:{x:c.x,y:c.y},cursorTangent:c.tangent,activeStrokeProgress:n.totalLength>0?c.distanceAlongStroke/n.totalLength:1}),a>=s.length-1&&this.completeCurrentStroke()}end(){const t=this.state.status==="tracing"?"idle":this.state.status;this.state={...this.state,status:t,isPenDown:!1}}reset(){this.currentSampleIndex=0,this.state=this.buildInitialState()}completeCurrentStroke(){const t=[...this.state.completedStrokes,this.state.activeStrokeIndex],n=this.state.activeStrokeIndex+1;if(n>=this.path.strokes.length){this.state={...this.state,status:"complete",completedStrokes:t,activeStrokeProgress:1,isPenDown:!1};return}const s=this.path.strokes[n],i=s==null?void 0:s.samples[0];this.currentSampleIndex=0,this.state={...this.state,status:"await_pen_up",completedStrokes:t,activeStrokeIndex:n,activeStrokeProgress:0,cursorPoint:i?{x:i.x,y:i.y}:this.state.cursorPoint,cursorTangent:(i==null?void 0:i.tangent)??this.state.cursorTangent,isPenDown:!1}}}const K="G-94373ZKHEE",ve=new Set(["localhost","127.0.0.1"]),be=()=>{if(ve.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",K);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${K}`,document.head.append(e)};be();const te=document.querySelector("#app");if(!te)throw new Error("Missing #app element for editor demo.");const Se="cursive",ne="cursive",ke={xHeight:360,baseline:720},_e=[{value:"print",label:"Print"},{value:"pre-cursive",label:"Pre-cursive"},{value:"cursive",label:"Cursive"}],H=[{key:"targetBendRate",label:"Target maximum bend rate",min:0,max:80,step:1,value:O.targetBendRate},{key:"minSidebearingGap",label:"Minimum sidebearing gap",min:-500,max:500,step:5,value:95},{key:"bendSearchMinSidebearingGap",label:"Search minimum sidebearing gap",min:-200,max:120,step:1,value:O.bendSearchMinSidebearingGap},{key:"bendSearchMaxSidebearingGap",label:"Search maximum sidebearing gap",min:-120,max:240,step:1,value:O.bendSearchMaxSidebearingGap}],$e=me;te.innerHTML=`
  <div class="demo-page">
    <header class="demo-header">
      <div class="demo-header__title">
        <h1>Letterpaths handwriting demo</h1>

      </div>
    </header>
    <section class="demo-join">
      <div class="demo-join__controls">
        <label class="demo-join__field">
          Text to join
          <input
            class="demo-join__input"
            id="word-input"
            type="text"
            value="${Se}"
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <div class="demo-join__field">
          Handwriting style
          <div class="demo-join__segmented" role="radiogroup" aria-label="Handwriting style">
            ${_e.map(e=>`
                <label class="demo-join__segmented-option">
                  <input
                    class="demo-join__segmented-input"
                    type="radio"
                    name="handwriting-style"
                    value="${e.value}"
                    ${e.value===ne?"checked":""}
                  />
                  <span class="demo-join__segmented-label">${e.label}</span>
                </label>
              `).join("")}
          </div>
        </div>
        <details class="demo-join__disclosure" id="join-controls" open>
          <summary class="demo-join__disclosure-summary">Join spacing controls</summary>
          <div class="demo-join__slider-grid">
            ${H.map(e=>`
                  <label class="demo-join__field demo-join__field--range">
                    ${e.label}
                    <div class="demo-join__range-row">
                      <input
                        class="demo-join__range"
                        id="${e.key}"
                        type="range"
                        min="${e.min}"
                        max="${e.max}"
                        step="${e.step}"
                        value="${e.value}"
                      />
                      <span class="demo-join__range-value" id="${e.key}-value">${e.value}</span>
                    </div>
                  </label>
                `).join("")}
          </div>
        </details>
      </div>
      <div class="demo-join__canvases">
        <div class="demo-join__canvas">
          <div class="demo-join__canvas-title">Animated</div>
          <svg class="demo-join__svg" id="join-svg" viewBox="0 0 1600 1000"></svg>
        </div>
        <div class="demo-join__canvas">
          <div class="demo-join__canvas-title">Segments</div>
          <svg class="demo-join__svg" id="join-svg-static" viewBox="0 0 1600 1000"></svg>
        </div>
        <div class="demo-join__canvas demo-join__canvas--trace">
          <div class="demo-join__canvas-header">
            <div class="demo-join__canvas-title">Tracing</div>
            <button class="demo-join__button" id="reset-button" type="button">Reset trace</button>
          </div>
          <div class="demo-trace__canvas-container">
            <svg class="demo-trace__svg" id="trace-svg" viewBox="0 0 1600 1000"></svg>
            <div class="demo-trace__complete-message" id="complete-message">Well done!</div>
          </div>
        </div>
      </div>
    </section>
  </div>
`;const T=document.querySelector("#word-input"),w=document.querySelector("#join-svg"),L=document.querySelector("#join-svg-static"),h=document.querySelector("#trace-svg"),se=document.querySelector("#reset-button"),D=document.querySelector("#complete-message"),J=document.querySelector("#join-controls"),z=Array.from(document.querySelectorAll('input[name="handwriting-style"]'));if(!T||!w||!L||!h||!se||!D||!J||z.length===0)throw new Error("Missing elements for handwriting demo.");const j=Object.fromEntries(H.map(e=>[e.key,document.querySelector(`#${e.key}`)])),ie=Object.fromEntries(H.map(e=>[e.key,document.querySelector(`#${e.key}-value`)]));if(Object.values(j).some(e=>!e)||Object.values(ie).some(e=>!e))throw new Error("Missing join spacing controls for editor demo.");let C=null,x=null,k=null,Y=!1,M=[],F=null,B=[];const we=()=>{var e;return((e=z.find(t=>t.checked))==null?void 0:e.value)??ne},je=e=>{const t=e==="cursive";J.hidden=!t,J.open=t},q=()=>{C!==null&&(cancelAnimationFrame(C),C=null)},G=(e,t)=>{e.innerHTML=`
    <rect class="demo-join__bg" x="0" y="0" width="1600" height="1000"></rect>
    <text class="demo-join__empty" x="800" y="520" text-anchor="middle">
      ${t}
    </text>
  `},Q=e=>{h.innerHTML=`
    <rect class="demo-trace__bg" x="0" y="0" width="1600" height="1000"></rect>
    <text class="demo-trace__empty" x="800" y="520" text-anchor="middle">
      ${e}
    </text>
  `,M=[],F=null,B=[],x=null,k=null,D.classList.remove("visible")},Me=()=>{var e,t,n,s;return{targetBendRate:Number(((e=j.targetBendRate)==null?void 0:e.value)??0),minSidebearingGap:Number(((t=j.minSidebearingGap)==null?void 0:t.value)??0),bendSearchMinSidebearingGap:Number(((n=j.bendSearchMinSidebearingGap)==null?void 0:n.value)??0),bendSearchMaxSidebearingGap:Number(((s=j.bendSearchMaxSidebearingGap)==null?void 0:s.value)??0)}},ae=()=>{H.forEach(e=>{const t=j[e.key],n=ie[e.key];!t||!n||(n.textContent=e.key==="targetBendRate"||e.key==="minSidebearingGap"||e.key==="bendSearchMinSidebearingGap"||e.key==="bendSearchMaxSidebearingGap"?Number(t.value).toFixed(0):Number(t.value).toFixed(2))})},V=e=>{if(e.length===0)return"";const[t,...n]=e;let s=`M ${t.p0.x} ${t.p0.y} `;return[t,...n].forEach(i=>{s+=`C ${i.p1.x} ${i.p1.y} ${i.p2.x} ${i.p2.y} ${i.p3.x} ${i.p3.y} `}),s.trim()},Te=(e,t,n)=>({...e,strokes:e.strokes.map(s=>({...s,curves:s.curves.map(i=>new Z({x:i.p0.x+t,y:i.p0.y+n},{x:i.p1.x+t,y:i.p1.y+n},{x:i.p2.x+t,y:i.p2.y+n},{x:i.p3.x+t,y:i.p3.y+n}))})),bounds:{minX:e.bounds.minX+t,maxX:e.bounds.maxX+t,minY:e.bounds.minY+n,maxY:e.bounds.maxY+n}}),De=(e,t,n,s)=>{const i="#d13c3c",o={"lead-in":"#64b5f6",entry:"#1e88e5",body:"#26a69a",ascender:"#1565c0",descender:"#00897b",exit:"#2e7d32","lead-out":"#66bb6a",dot:"#4dd0e1"},a=["#1e88e5","#26a69a","#1565c0","#2e7d32","#64b5f6","#66bb6a"];let r=0;const d=e.strokes.flatMap(c=>c.curves.map((l,m)=>{var p;const g=(p=c.curveSegments)==null?void 0:p[m],f=`M ${l.p0.x} ${l.p0.y} C ${l.p1.x} ${l.p1.y} ${l.p2.x} ${l.p2.y} ${l.p3.x} ${l.p3.y}`;if(g==="join")return`<path class="demo-join__path-static" d="${f}" stroke="${i}" stroke-opacity="0.9" stroke-width="44"></path>`;const u=(g?o[g]:void 0)??a[r%a.length]??a[0];return r+=1,`<path class="demo-join__path-static" d="${f}" stroke="${u}" stroke-opacity="0.8" stroke-width="46"></path>`})).join("");return`
    <rect class="demo-join__bg" x="0" y="0" width="${t}" height="${n}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${e.guides.xHeight+s}"
      x2="${t}"
      y2="${e.guides.xHeight+s}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${e.guides.baseline+s}"
      x2="${t}"
      y2="${e.guides.baseline+s}"
    ></line>
    ${d}
  `},P=()=>{Y||(Y=!0,requestAnimationFrame(()=>{Y=!1,Pe()}))},Pe=()=>{if(!x||!F)return;const e=x.getState(),t=Math.atan2(e.cursorTangent.y,e.cursorTangent.x)*(180/Math.PI);F.setAttribute("transform",`translate(${e.cursorPoint.x}, ${e.cursorPoint.y}) rotate(${t})`);const n=new Set(e.completedStrokes);if(M.forEach((s,i)=>{const o=B[i]??0;if(n.has(i)){s.style.strokeDashoffset="0";return}if(i===e.activeStrokeIndex){const a=o*(1-e.activeStrokeProgress);s.style.strokeDashoffset=`${Math.max(0,a)}`;return}s.style.strokeDashoffset=`${o}`}),e.status==="complete"){D.classList.add("visible");return}D.classList.remove("visible")},Ie=(e,t,n,s)=>{const i=pe(e);x=new fe(i),k=null;const o=e.strokes.filter(d=>d.type!=="lift"),a=o.map(d=>`<path class="demo-trace__stroke-bg" d="${V(d.curves)}"></path>`).join(""),r=o.map(d=>`<path class="demo-trace__stroke-trace" d="${V(d.curves)}"></path>`).join("");h.setAttribute("viewBox",`0 0 ${t} ${n}`),h.innerHTML=`
    <rect class="demo-trace__bg" x="0" y="0" width="${t}" height="${n}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${e.guides.xHeight+s}"
      x2="${t}"
      y2="${e.guides.xHeight+s}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${e.guides.baseline+s}"
      x2="${t}"
      y2="${e.guides.baseline+s}"
    ></line>
    ${a}
    ${r}
    <g class="demo-trace__cursor" id="trace-cursor">
      <circle class="demo-trace__cursor-bg" cx="0" cy="0" r="36"></circle>
      <polygon class="demo-trace__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `,M=Array.from(h.querySelectorAll(".demo-trace__stroke-trace")),F=h.querySelector("#trace-cursor"),B=M.map(d=>{const c=d.getTotalLength();return Number.isFinite(c)&&c>0?c:.001}),M.forEach((d,c)=>{const l=B[c]??.001;d.style.strokeDasharray=`${l} ${l}`,d.style.strokeDashoffset=`${l}`}),D.classList.remove("visible"),P()},N=e=>{const t=we();je(t);const n=e.trim().toLowerCase();if(!n){G(w,"Enter text to render."),G(L,"Enter text to render."),Q("Enter a word to trace."),q();return}const s=Me(),i=ue(n,{style:t,targetGuides:ke,joinSpacing:s,letters:$e});if(i.strokes.length===0){G(w,"No drawable points."),G(L,"No drawable points."),Q("No drawable paths."),q();return}const o=120,a=Math.max(1e3,Math.ceil(i.bounds.maxX-i.bounds.minX+o*2)),r=Math.max(900,Math.ceil(i.bounds.maxY-i.bounds.minY+o*2)),d=o-i.bounds.minX,c=o-i.bounds.minY,l=Te(i,d,c);w.setAttribute("viewBox",`0 0 ${a} ${r}`),L.setAttribute("viewBox",`0 0 ${a} ${r}`),w.innerHTML=`
    <rect class="demo-join__bg" x="0" y="0" width="${a}" height="${r}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${l.guides.xHeight+c}"
      x2="${a}"
      y2="${l.guides.xHeight+c}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${l.guides.baseline+c}"
      x2="${a}"
      y2="${l.guides.baseline+c}"
    ></line>
    ${l.strokes.map((S,v)=>{const b=V(S.curves);return`<path class="demo-join__path" data-stroke="${v}" d="${b}"></path>`}).join("")}
    <circle class="demo-join__nib" cx="0" cy="0" r="12"></circle>
  `,L.innerHTML=De(l,a,r,c),Ie(l,a,r,c);const m=Array.from(w.querySelectorAll(".demo-join__path")),g=w.querySelector(".demo-join__nib");if(!g){q();return}const f=m.map(S=>{const v=S.getTotalLength();return Number.isFinite(v)&&v>0?v:.001});m.forEach((S,v)=>{const b=Math.max(f[v]??0,.001);S.style.strokeDasharray=`${b} ${b}`,S.style.strokeDashoffset=`${b}`});const u=new ge(l,{speed:1.8,penUpSpeed:2.2,deferredDelayMs:160}),p=700,_=performance.now(),$=S=>{const v=S-_,b=u.totalDuration+p,I=v%b,R=Math.min(I,u.totalDuration),A=u.getFrame(R);g.setAttribute("cx",A.point.x.toFixed(2)),g.setAttribute("cy",A.point.y.toFixed(2));const re=new Set(A.completedStrokes);m.forEach((X,U)=>{const W=Math.max(f[U]??0,.001);if(re.has(U)){X.style.strokeDashoffset="0";return}if(U===A.activeStrokeIndex){const ce=W*(1-A.activeStrokeProgress);X.style.strokeDashoffset=`${Math.max(0,ce)}`;return}X.style.strokeDashoffset=`${W}`}),C=requestAnimationFrame($)};q(),C=requestAnimationFrame($)},oe=e=>{const t=h.getScreenCTM();if(t){const a=h.createSVGPoint();a.x=e.clientX,a.y=e.clientY;const r=a.matrixTransform(t.inverse());return{x:r.x,y:r.y}}const n=h.getBoundingClientRect(),s=h.viewBox.baseVal,i=s.width/n.width,o=s.height/n.height;return{x:(e.clientX-n.left)*i+s.x,y:(e.clientY-n.top)*o+s.y}},Ae=e=>{if(!x||k!==null)return;const t=oe(e);x.beginAt(t)&&(k=e.pointerId,h.setPointerCapture(e.pointerId),P())},Le=e=>{!x||e.pointerId!==k||(x.update(oe(e)),P())},Ee=e=>{!x||e.pointerId!==k||(x.end(),h.hasPointerCapture(e.pointerId)&&h.releasePointerCapture(e.pointerId),k=null,P())},Ce=e=>{e.pointerId===k&&(x==null||x.end(),h.hasPointerCapture(e.pointerId)&&h.releasePointerCapture(e.pointerId),k=null,P())};h.addEventListener("pointerdown",Ae);h.addEventListener("pointermove",Le);h.addEventListener("pointerup",Ee);h.addEventListener("pointercancel",Ce);T.addEventListener("input",()=>N(T.value));z.forEach(e=>{e.addEventListener("change",()=>N(T.value))});H.forEach(e=>{var t;(t=j[e.key])==null||t.addEventListener("input",()=>{ae(),N(T.value)})});se.addEventListener("click",()=>{x&&(x.reset(),M.forEach((e,t)=>{const n=B[t]??.001;e.style.strokeDashoffset=`${n}`}),D.classList.remove("visible"),P())});ae();N(T.value);
