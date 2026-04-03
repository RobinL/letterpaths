var G=Object.defineProperty;var O=(e,s,i)=>s in e?G(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i;var p=(e,s,i)=>O(e,typeof s!="symbol"?s+"":s,i);import"./modulepreload-polyfill-B5Qt9EMX.js";import{C as I,d as _,j as R,l as Y}from"./joiner-D21mPzq9.js";class V{constructor(s,i={}){p(this,"strokes");p(this,"strokeLengths");p(this,"strokeTimings");p(this,"segments");p(this,"speed");p(this,"penUpSpeed");p(this,"minLiftDistance");p(this,"strokeDelayMs");p(this,"deferredDelayMs");p(this,"totalDuration");this.strokes=s.strokes,this.speed=i.speed??1.8,this.penUpSpeed=i.penUpSpeed??2.2,this.minLiftDistance=i.minLiftDistance??.5,this.strokeDelayMs=i.strokeDelayMs??0,this.deferredDelayMs=i.deferredDelayMs??120,this.strokeLengths=this.strokes.map(o=>o.curves.reduce((a,r)=>a+r.length(),0)),this.strokeTimings=[],this.segments=[];let t=0,n=null;this.strokes.forEach((o,a)=>{var g,h;const r=((g=o.curves[0])==null?void 0:g.p0)??{x:0,y:0},d=((h=o.curves[o.curves.length-1])==null?void 0:h.p3)??r,c=this.strokeDelayMs+(o.deferred?this.deferredDelayMs:0);if(c>0){const u=n??r;this.segments.push({kind:"pause",startTime:t,duration:c,length:0,from:u,to:u,strokeIndex:a}),t+=c}if(n){const u=Math.hypot(r.x-n.x,r.y-n.y);if(u>this.minLiftDistance){const v=u/this.penUpSpeed;this.segments.push({kind:"lift",startTime:t,duration:v,length:u,from:n,to:r,strokeIndex:a}),t+=v}}const l=this.strokeLengths[a]??0,m=l/this.speed;this.strokeTimings.push({start:t,duration:m}),this.segments.push({kind:"stroke",startTime:t,duration:m,length:l,from:r,to:d,strokeIndex:a,stroke:o}),t+=m,n=d}),this.totalDuration=t}getFrame(s){if(this.strokes.length===0||this.segments.length===0)return{point:{x:0,y:0},velocity:{x:0,y:0},isPenDown:!1,completedStrokes:[],activeStrokeIndex:-1,activeStrokeProgress:0};const i=Math.max(0,s),t=this.segments.find(m=>i>=m.startTime&&i<=m.startTime+m.duration)??this.segments[this.segments.length-1],n=t.duration>0?Math.min((i-t.startTime)/t.duration,1):1;if(t.kind==="lift"||t.kind==="pause"){const m={x:t.from.x+(t.to.x-t.from.x)*n,y:t.from.y+(t.to.y-t.from.y)*n},g=t.kind==="lift"?C({x:t.to.x-t.from.x,y:t.to.y-t.from.y}):{x:0,y:0};return{point:m,velocity:{x:g.x*this.penUpSpeed,y:g.y*this.penUpSpeed},isPenDown:!1,completedStrokes:this.collectCompletedStrokes(i),activeStrokeIndex:-1,activeStrokeProgress:0}}const o=t.strokeIndex,a=t.stroke??this.strokes[o],r=this.strokeLengths[o]??0,d=r*n,{point:c,tangent:l}=J(a,d);return{point:c,velocity:{x:l.x*this.speed,y:l.y*this.speed},isPenDown:!0,completedStrokes:this.collectCompletedStrokes(i),activeStrokeIndex:o,activeStrokeProgress:r>0?d/r:1}}collectCompletedStrokes(s){const i=[];return this.strokeTimings.forEach((t,n)=>{s>=t.start+t.duration&&i.push(n)}),i}}function J(e,s){let i=s;for(let n=0;n<e.curves.length;n+=1){const o=e.curves[n],a=o.length();if(i<=a||n===e.curves.length-1){const r=o.getTAtLength(Math.max(0,i)),d=o.getPointAt(r),c=C(o.getTangentAt(r));return{point:d,tangent:c}}i-=a}return{point:(e.curves[e.curves.length-1]??new I({x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0})).p3,tangent:{x:1,y:0}}}function C(e){const s=Math.hypot(e.x,e.y);return s===0?{x:1,y:0}:{x:e.x/s,y:e.y/s}}const F=document.querySelector("#app");if(!F)throw new Error("Missing #app element for editor demo.");const z="abcdefgh",K={xHeight:360,baseline:720},M=[{key:"verticalDistanceWeight",label:"Vertical distance influence",min:-1,max:1,step:.01,value:_.verticalDistanceWeight},{key:"angleDifferenceWeight",label:"Bend demand influence",min:-5,max:5,step:.05,value:_.angleDifferenceWeight},{key:"bendReversalWeight",label:"Reverse bend influence",min:-5,max:5,step:.05,value:_.bendReversalWeight},{key:"kerningScale",label:"Kerning scale",min:-5,max:5,step:.05,value:_.kerningScale},{key:"minSidebearingGap",label:"Minimum sidebearing gap",min:-500,max:500,step:5,value:_.minSidebearingGap}],Q=Y;F.innerHTML=`
  <div class="demo-page">
    <header class="demo-header">
      <div class="demo-header__title">
        <h1>Letterpaths handwriting demo</h1>
        <p>Type a lowercase cursive word to see the library join and animate it.</p>
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
            value="${z}"
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <div class="demo-join__slider-grid">
          ${M.map(e=>`
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
      </div>
    </section>
  </div>
`;const D=document.querySelector("#word-input"),b=document.querySelector("#join-svg"),j=document.querySelector("#join-svg-static");let S=null;if(!D||!b||!j)throw new Error("Missing input or svg elements for editor demo.");const x=Object.fromEntries(M.map(e=>[e.key,document.querySelector(`#${e.key}`)])),q=Object.fromEntries(M.map(e=>[e.key,document.querySelector(`#${e.key}-value`)]));if(Object.values(x).some(e=>!e)||Object.values(q).some(e=>!e))throw new Error("Missing join spacing controls for editor demo.");const w=()=>{S!==null&&(cancelAnimationFrame(S),S=null)},E=(e,s)=>{e.innerHTML=`
    <rect class="demo-join__bg" x="0" y="0" width="1600" height="1000"></rect>
    <text class="demo-join__empty" x="800" y="520" text-anchor="middle">
      ${s}
    </text>
  `},Z=()=>{var e,s,i,t,n;return{verticalDistanceWeight:Number(((e=x.verticalDistanceWeight)==null?void 0:e.value)??0),angleDifferenceWeight:Number(((s=x.angleDifferenceWeight)==null?void 0:s.value)??0),bendReversalWeight:Number(((i=x.bendReversalWeight)==null?void 0:i.value)??0),kerningScale:Number(((t=x.kerningScale)==null?void 0:t.value)??0),minSidebearingGap:Number(((n=x.minSidebearingGap)==null?void 0:n.value)??0)}},N=()=>{M.forEach(e=>{const s=x[e.key],i=q[e.key];!s||!i||(i.textContent=e.key==="minSidebearingGap"?Number(s.value).toFixed(0):Number(s.value).toFixed(2))})},ee=e=>{if(e.length===0)return"";const[s,...i]=e;let t=`M ${s.p0.x} ${s.p0.y} `;return[s,...i].forEach(n=>{t+=`C ${n.p1.x} ${n.p1.y} ${n.p2.x} ${n.p2.y} ${n.p3.x} ${n.p3.y} `}),t.trim()},te=(e,s,i)=>({...e,strokes:e.strokes.map(t=>({...t,curves:t.curves.map(n=>new I({x:n.p0.x+s,y:n.p0.y+i},{x:n.p1.x+s,y:n.p1.y+i},{x:n.p2.x+s,y:n.p2.y+i},{x:n.p3.x+s,y:n.p3.y+i}))})),bounds:{minX:e.bounds.minX+s,maxX:e.bounds.maxX+s,minY:e.bounds.minY+i,maxY:e.bounds.maxY+i}}),se=(e,s,i,t)=>{const n="#d13c3c",o={"lead-in":"#64b5f6",entry:"#1e88e5",body:"#26a69a",ascender:"#1565c0",descender:"#00897b",exit:"#2e7d32","lead-out":"#66bb6a",dot:"#4dd0e1"},a=["#1e88e5","#26a69a","#1565c0","#2e7d32","#64b5f6","#66bb6a"];let r=0;const d=e.strokes.flatMap(c=>c.curves.map((l,m)=>{var v;const g=(v=c.curveSegments)==null?void 0:v[m],h=`M ${l.p0.x} ${l.p0.y} C ${l.p1.x} ${l.p1.y} ${l.p2.x} ${l.p2.y} ${l.p3.x} ${l.p3.y}`;if(g==="join")return`<path class="demo-join__path-static" d="${h}" stroke="${n}" stroke-opacity="0.9" stroke-width="44"></path>`;const u=(g?o[g]:void 0)??a[r%a.length]??a[0];return r+=1,`<path class="demo-join__path-static" d="${h}" stroke="${u}" stroke-opacity="0.8" stroke-width="46"></path>`})).join("");return`
    <rect class="demo-join__bg" x="0" y="0" width="${s}" height="${i}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${e.guides.xHeight+t}"
      x2="${s}"
      y2="${e.guides.xHeight+t}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${e.guides.baseline+t}"
      x2="${s}"
      y2="${e.guides.baseline+t}"
    ></line>
    ${d}
  `},A=e=>{const s=e.trim();if(!s){E(b,"Enter a word to render joined cursive."),E(j,"Enter a word to render joined cursive."),w();return}const i=Z(),t=R(s,{targetGuides:K,joinSpacing:i,letters:Q});if(t.strokes.length===0){E(b,"No drawable points."),E(j,"No drawable points."),w();return}const n=120,o=Math.max(1e3,Math.ceil(t.bounds.maxX-t.bounds.minX+n*2)),a=Math.max(900,Math.ceil(t.bounds.maxY-t.bounds.minY+n*2)),r=n-t.bounds.minX,d=n-t.bounds.minY,c=te(t,r,d);b.setAttribute("viewBox",`0 0 ${o} ${a}`),j.setAttribute("viewBox",`0 0 ${o} ${a}`),b.innerHTML=`
    <rect class="demo-join__bg" x="0" y="0" width="${o}" height="${a}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${c.guides.xHeight+d}"
      x2="${o}"
      y2="${c.guides.xHeight+d}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${c.guides.baseline+d}"
      x2="${o}"
      y2="${c.guides.baseline+d}"
    ></line>
    ${c.strokes.map((f,y)=>{const k=ee(f.curves);return`<path class="demo-join__path" data-stroke="${y}" d="${k}"></path>`}).join("")}
    <circle class="demo-join__nib" cx="0" cy="0" r="12"></circle>
  `,j.innerHTML=se(c,o,a,d);const l=Array.from(b.querySelectorAll(".demo-join__path")),m=b.querySelector(".demo-join__nib");if(!m){w();return}const g=l.map(f=>{const y=f.getTotalLength();return Number.isFinite(y)&&y>0?y:.001});l.forEach((f,y)=>{const k=Math.max(g[y]??0,.001);f.style.strokeDasharray=`${k} ${k}`,f.style.strokeDashoffset=`${k}`});const h=new V(c,{speed:1.8,penUpSpeed:2.2,deferredDelayMs:160}),u=700,v=performance.now(),P=f=>{const y=f-v,k=h.totalDuration+u,H=y%k,X=Math.min(H,h.totalDuration),$=h.getFrame(X);m.setAttribute("cx",$.point.x.toFixed(2)),m.setAttribute("cy",$.point.y.toFixed(2));const U=new Set($.completedStrokes);l.forEach((T,L)=>{const W=Math.max(g[L]??0,.001);if(U.has(L)){T.style.strokeDashoffset="0";return}if(L===$.activeStrokeIndex){const B=W*(1-$.activeStrokeProgress);T.style.strokeDashoffset=`${Math.max(0,B)}`;return}T.style.strokeDashoffset=`${W}`}),S=requestAnimationFrame(P)};w(),S=requestAnimationFrame(P)};D.addEventListener("input",()=>A(D.value));M.forEach(e=>{var s;(s=x[e.key])==null||s.addEventListener("input",()=>{N(),A(D.value)})});N();A(D.value);
