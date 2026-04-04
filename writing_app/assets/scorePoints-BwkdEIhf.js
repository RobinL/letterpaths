import{M as bt,a as St,T as $t,D as at,b as vt,c as Et,d as kt,e as X,A as At,f as Pt,W as x,g as st,h as rt}from"./shared-n7GYFNh1.js";import{a as Tt}from"./groups-Cr1poJ62.js";const j=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],ot=44,It=24,Mt=72,Dt=2,it=220,Ft=100,Lt=420,Ct=10,ct=document.querySelector("#app");if(!ct)throw new Error("Missing #app element for score points app.");ct.innerHTML=`
  <div class="writing-app">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar writing-app__topbar--score">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Collect the fruit</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
          <div class="writing-app__score-card" aria-live="polite">
            <span class="writing-app__score-label">Score</span>
            <span class="writing-app__score-value"><span id="score-value">0</span>/<span id="score-total">0</span></span>
          </div>
          <div class="writing-app__control-strip">
            <label class="writing-app__tolerance" for="tolerance-slider">
              <span class="writing-app__tolerance-label">
                Tolerance
                <span class="writing-app__tolerance-value" id="tolerance-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="tolerance-slider"
                type="range"
                min="${bt}"
                max="${St}"
                step="${$t}"
                value="${at}"
              />
            </label>
            <label class="writing-app__tolerance" for="fruit-size-slider">
              <span class="writing-app__tolerance-label">
                Fruit size
                <span class="writing-app__tolerance-value" id="fruit-size-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="fruit-size-slider"
                type="range"
                min="${It}"
                max="${Mt}"
                step="${Dt}"
                value="${ot}"
              />
            </label>
            <label class="writing-app__tolerance" for="fruit-spacing-slider">
              <span class="writing-app__tolerance-label">
                Fruit spacing
                <span class="writing-app__tolerance-value" id="fruit-spacing-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="fruit-spacing-slider"
                type="range"
                min="${Ft}"
                max="${Lt}"
                step="${Ct}"
                value="${it}"
              />
            </label>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Show me
          </button>
        </header>

        <svg
          class="writing-app__svg"
          id="trace-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting fruit collection area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Round complete!</p>
            <p class="writing-app__success-copy" id="score-summary"></p>
            <button class="writing-app__button writing-app__button--next" id="next-word-button" type="button">
              Next word
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;const lt=document.querySelector("#word-label"),pt=document.querySelector("#score-value"),ut=document.querySelector("#score-total"),dt=document.querySelector("#score-summary"),l=document.querySelector("#trace-svg"),A=document.querySelector("#show-me-button"),gt=document.querySelector("#success-overlay"),yt=document.querySelector("#next-word-button"),B=document.querySelector("#tolerance-slider"),ft=document.querySelector("#tolerance-value"),V=document.querySelector("#fruit-size-slider"),_t=document.querySelector("#fruit-size-value"),Y=document.querySelector("#fruit-spacing-slider"),mt=document.querySelector("#fruit-spacing-value");if(!lt||!pt||!ut||!dt||!l||!A||!gt||!yt||!B||!ft||!V||!_t||!Y||!mt)throw new Error("Missing elements for score points app.");let f=-1,Z=null,p=null,_=null,H=!1,I=[],q=[],L=null,M=[],N=[],y=null,D=null,S=!1,U=at,F=ot,K=it,$=[],W=[],k=[],P=[],g=null,h=1,E=null,z=0,C=1600,R=900;const ht=()=>{ft.textContent=`${U}px`},tt=()=>{_t.textContent=`${F}px`,mt.textContent=`${K}px`},O=()=>{const t=$.filter(e=>e.groupIndex<h).length;pt.textContent=`${z}`,ut.textContent=`${t}`,dt.textContent=t===0?"No fruit on this round.":`You collected ${z} of ${t} fruit.`},et=t=>{gt.hidden=!t},Rt=(t,e)=>{const n=C/2,a=R/2;let r=e.x-n,i=e.y-a;r===0&&i===0&&(r=.35,i=-1);const c=Math.hypot(r,i)||1,u=r/c,d=i/c,m=Math.max(C,R)*.8,v=e.x+u*m,T=e.y+d*m,s=Math.min(C+160,Math.max(-160,v)),o=Math.min(R+160,Math.max(-160,T));t.style.setProperty("--fruit-fly-x",`${(s-e.x).toFixed(2)}px`),t.style.setProperty("--fruit-fly-y",`${(o-e.y).toFixed(2)}px`),t.style.setProperty("--fruit-fly-rotate",`${(u*28).toFixed(2)}deg`)},qt=(t,e)=>{if(t.length===0)return{x:0,y:0};if(t.length===1||e<=0)return{x:t[0].x,y:t[0].y};for(let a=1;a<t.length;a+=1){const r=t[a-1],i=t[a];if(!r||!i||e>i.distanceAlongStroke)continue;const c=i.distanceAlongStroke-r.distanceAlongStroke,u=c>0?(e-r.distanceAlongStroke)/c:0;return{x:r.x+(i.x-r.x)*u,y:r.y+(i.y-r.y)*u}}const n=t[t.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Nt=(t,e)=>{let n=e;for(let a=0;a<t.strokes.length;a+=1){const r=t.strokes[a];if(r){if(n<=r.totalLength||a===t.strokes.length-1)return qt(r.samples,Math.max(0,Math.min(n,r.totalLength)));n-=r.totalLength}}return{x:0,y:0}},Ut=(t,e)=>e.flatMap((n,a)=>{const r=n.endDistance-n.startDistance;if(r<=0)return[];const i=Math.max(1,Math.round(r/K));return Array.from({length:i},(c,u)=>{const d=Nt(t,n.startDistance+r*(u+1)/(i+1));return{x:d.x,y:d.y,emoji:j[(a+u)%j.length]??j[0],captured:!1,groupIndex:a}})}),xt=()=>{z=0,h=k.length>0?1:0,g=P.length>0?0:null,$.forEach(t=>{t.captured=!1}),W.forEach(t=>{t.style.transition="none",t.classList.remove("writing-app__fruit--captured"),t.style.removeProperty("--fruit-fly-x"),t.style.removeProperty("--fruit-fly-y"),t.style.removeProperty("--fruit-fly-rotate");const e=$[Number(t.dataset.fruitIndex)];t.classList.toggle("writing-app__fruit--hidden",e?e.groupIndex>=h:!0),t.getBoundingClientRect(),t.style.removeProperty("transition")}),J(),O()},zt=t=>{let e=!1;const n=Math.max(24,F*.55);$.forEach((a,r)=>{if(a.captured||a.groupIndex>=h||Math.hypot(t.x-a.x,t.y-a.y)>n)return;a.captured=!0,z+=1;const c=W[r];c&&(Rt(c,a),c.classList.add("writing-app__fruit--captured")),e=!0}),e&&O()},J=()=>{if(!E)return;const t=g!==null?P[g]:void 0;if(!t){E.classList.add("writing-app__boundary-star--hidden");return}E.classList.remove("writing-app__boundary-star--hidden"),E.setAttribute("x",`${t.x}`),E.setAttribute("y",`${t.y}`)},Wt=t=>{if(g===null)return;const e=P[g];if(!e){g=null,J();return}const n=Math.hypot(t.x-e.x,t.y-e.y),a=Math.max(26,F*.6);n>a||(h=Math.min(h+1,k.length),W.forEach(r=>{const i=$[Number(r.dataset.fruitIndex)];r.classList.toggle("writing-app__fruit--hidden",i?i.groupIndex>=h:!0)}),g+=1,g>=P.length&&(g=null),J(),O())},Q=()=>{D!==null&&(cancelAnimationFrame(D),D=null),S=!1,A.disabled=!1,A.textContent="Show me",M.forEach((t,e)=>{const n=N[e]??.001;t.style.strokeDasharray=`${n} ${n}`,t.style.strokeDashoffset=`${n}`}),y&&(y.style.opacity="0"),w()},nt=()=>{p==null||p.reset(),_=null,et(!1),I.forEach((t,e)=>{const n=q[e]??.001;t.style.strokeDasharray=`${n} ${n}`,t.style.strokeDashoffset=`${n}`}),xt(),w()},w=()=>{H||(H=!0,requestAnimationFrame(()=>{H=!1,Ot()}))},Ot=()=>{if(!p||!L)return;const t=p.getState(),e=Math.atan2(t.cursorTangent.y,t.cursorTangent.x)*(180/Math.PI);L.setAttribute("transform",`translate(${t.cursorPoint.x}, ${t.cursorPoint.y}) rotate(${e})`),L.style.opacity=S?"0":"1";const n=new Set(t.completedStrokes);I.forEach((a,r)=>{const i=q[r]??0;if(n.has(r)){a.style.strokeDashoffset="0";return}if(r===t.activeStrokeIndex){const c=i*(1-t.activeStrokeProgress);a.style.strokeDashoffset=`${Math.max(0,c)}`;return}a.style.strokeDashoffset=`${i}`}),S||(zt(t.cursorPoint),Wt(t.cursorPoint)),et(t.status==="complete")},Gt=()=>{if(!Z||S)return;nt(),Q();const t=new At(Z,{speed:1.7,penUpSpeed:2.1,deferredDelayMs:150});S=!0,A.disabled=!0,A.textContent="Showing...";const e=performance.now(),n=a=>{const r=a-e,i=Math.min(r,t.totalDuration),c=t.getFrame(i),u=new Set(c.completedStrokes);if(M.forEach((d,m)=>{const v=N[m]??.001;if(u.has(m)){d.style.strokeDashoffset="0";return}if(m===c.activeStrokeIndex){const T=v*(1-c.activeStrokeProgress);d.style.strokeDashoffset=`${Math.max(0,T)}`;return}d.style.strokeDashoffset=`${v}`}),y&&(y.setAttribute("cx",c.point.x.toFixed(2)),y.setAttribute("cy",c.point.y.toFixed(2)),y.style.opacity=r<=t.totalDuration+rt?"1":"0"),r<t.totalDuration+rt){D=requestAnimationFrame(n);return}Q(),nt()};D=requestAnimationFrame(n),w()},Xt=(t,e,n,a)=>{C=e,R=n;const r=Et(t);k=Tt(r).groups,P=k.slice(1).map(s=>({x:s.startPoint.x,y:s.startPoint.y})),g=P.length>0?0:null,h=k.length>0?1:0,p=new kt(r,{startTolerance:U,hitTolerance:U}),_=null,$=Ut(r,k);const c=t.strokes.filter(s=>s.type!=="lift"),u=c.map(s=>`<path class="writing-app__stroke-bg" d="${X(s.curves)}"></path>`).join(""),d=c.map(s=>`<path class="writing-app__stroke-trace" d="${X(s.curves)}"></path>`).join(""),m=c.map(s=>`<path class="writing-app__stroke-demo" d="${X(s.curves)}"></path>`).join(""),v=c.flatMap(s=>s.curves.map(o=>`
          <path
            class="writing-app__debug-curve"
            d="M ${o.p0.x} ${o.p0.y} C ${o.p1.x} ${o.p1.y} ${o.p2.x} ${o.p2.y} ${o.p3.x} ${o.p3.y}"
          ></path>
        `)).join(""),T=$.map((s,o)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${o}"
          x="${s.x}"
          y="${s.y}"
          style="font-size: ${F}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${s.emoji}</text>
      `).join("");l.setAttribute("viewBox",`0 0 ${e} ${n}`),l.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${e}" height="${n}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${t.guides.xHeight+a}"
      x2="${e}"
      y2="${t.guides.xHeight+a}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${t.guides.baseline+a}"
      x2="${e}"
      y2="${t.guides.baseline+a}"
    ></line>
    ${u}
    ${v}
    ${d}
    ${m}
    ${T}
    <text
      class="writing-app__boundary-star"
      id="waypoint-star"
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="middle"
    >⭐</text>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `,I=Array.from(l.querySelectorAll(".writing-app__stroke-trace")),M=Array.from(l.querySelectorAll(".writing-app__stroke-demo")),W=Array.from(l.querySelectorAll(".writing-app__fruit")),E=l.querySelector("#waypoint-star"),L=l.querySelector("#trace-cursor"),y=l.querySelector("#demo-nib"),q=I.map(s=>{const o=s.getTotalLength();return Number.isFinite(o)&&o>0?o:.001}),N=M.map(s=>{const o=s.getTotalLength();return Number.isFinite(o)&&o>0?o:.001}),I.forEach((s,o)=>{const b=q[o]??.001;s.style.strokeDasharray=`${b} ${b}`,s.style.strokeDashoffset=`${b}`}),M.forEach((s,o)=>{const b=N[o]??.001;s.style.strokeDasharray=`${b} ${b}`,s.style.strokeDashoffset=`${b}`}),y&&(y.style.opacity="0"),xt(),et(!1),w()},G=t=>{Q(),lt.textContent=t;const e=vt(t);Z=e.path,Xt(e.path,e.width,e.height,e.offsetY)},wt=()=>{f=Pt(f),G(x[f]??x[0])},jt=t=>{S||!p||_!==null||!p.beginAt(st(l,t))||(t.preventDefault(),_=t.pointerId,l.setPointerCapture(t.pointerId),w())},Ht=t=>{S||!p||t.pointerId!==_||(t.preventDefault(),p.update(st(l,t)),w())},Bt=t=>{!p||t.pointerId!==_||(p.end(),l.hasPointerCapture(t.pointerId)&&l.releasePointerCapture(t.pointerId),_=null,w())},Vt=t=>{t.pointerId===_&&(p==null||p.end(),l.hasPointerCapture(t.pointerId)&&l.releasePointerCapture(t.pointerId),_=null,w())};l.addEventListener("pointerdown",jt);l.addEventListener("pointermove",Ht);l.addEventListener("pointerup",Bt);l.addEventListener("pointercancel",Vt);A.addEventListener("click",Gt);yt.addEventListener("click",wt);B.addEventListener("input",()=>{U=Number(B.value),ht(),f>=0&&G(x[f]??x[0])});V.addEventListener("input",()=>{F=Number(V.value),tt(),f>=0&&G(x[f]??x[0])});Y.addEventListener("input",()=>{K=Number(Y.value),tt(),f>=0&&G(x[f]??x[0])});ht();tt();O();wt();
