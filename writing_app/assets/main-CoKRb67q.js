import{M as Q,a as X,T as z,D as F,b as G,c as J,d as K,e as A,A as Z,f as Y,W as v,g as N,h as M}from"./shared-n7GYFNh1.js";const R=document.querySelector("#app");if(!R)throw new Error("Missing #app element for writing app.");R.innerHTML=`
  <div class="writing-app">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Trace this word</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
          <label class="writing-app__tolerance" for="tolerance-slider">
            <span class="writing-app__tolerance-label">
              Tolerance
              <span class="writing-app__tolerance-value" id="tolerance-value"></span>
            </span>
            <input
              class="writing-app__tolerance-slider"
              id="tolerance-slider"
              type="range"
              min="${Q}"
              max="${X}"
              step="${z}"
              value="${F}"
            />
          </label>
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
`;const W=document.querySelector("#word-label"),n=document.querySelector("#trace-svg"),m=document.querySelector("#show-me-button"),O=document.querySelector("#success-overlay"),H=document.querySelector("#next-word-button"),P=document.querySelector("#tolerance-slider"),B=document.querySelector("#tolerance-value");if(!W||!n||!m||!O||!H||!P||!B)throw new Error("Missing elements for writing app.");let f=-1,L=null,a=null,d=null,D=!1,w=[],E=[],S=null,b=[],k=[],u=null,$=null,y=!1,x=F;const U=()=>{B.textContent=`${x}px`},I=e=>{O.hidden=!e},C=()=>{$!==null&&(cancelAnimationFrame($),$=null),y=!1,m.disabled=!1,m.textContent="Show me",b.forEach((e,r)=>{const s=k[r]??.001;e.style.strokeDasharray=`${s} ${s}`,e.style.strokeDashoffset=`${s}`}),u&&(u.style.opacity="0"),h()},q=()=>{a==null||a.reset(),d=null,I(!1),w.forEach((e,r)=>{const s=E[r]??.001;e.style.strokeDasharray=`${s} ${s}`,e.style.strokeDashoffset=`${s}`}),h()},h=()=>{D||(D=!0,requestAnimationFrame(()=>{D=!1,ee()}))},ee=()=>{if(!a||!S)return;const e=a.getState(),r=Math.atan2(e.cursorTangent.y,e.cursorTangent.x)*(180/Math.PI);S.setAttribute("transform",`translate(${e.cursorPoint.x}, ${e.cursorPoint.y}) rotate(${r})`),S.style.opacity=y?"0":"1";const s=new Set(e.completedStrokes);w.forEach((i,l)=>{const g=E[l]??0;if(s.has(l)){i.style.strokeDashoffset="0";return}if(l===e.activeStrokeIndex){const c=g*(1-e.activeStrokeProgress);i.style.strokeDashoffset=`${Math.max(0,c)}`;return}i.style.strokeDashoffset=`${g}`}),I(e.status==="complete")},te=()=>{if(!L||y)return;q(),C();const e=new Z(L,{speed:1.7,penUpSpeed:2.1,deferredDelayMs:150});y=!0,m.disabled=!0,m.textContent="Showing...";const r=performance.now(),s=i=>{const l=i-r,g=Math.min(l,e.totalDuration),c=e.getFrame(g),T=new Set(c.completedStrokes);if(b.forEach((_,t)=>{const o=k[t]??.001;if(T.has(t)){_.style.strokeDashoffset="0";return}if(t===c.activeStrokeIndex){const p=o*(1-c.activeStrokeProgress);_.style.strokeDashoffset=`${Math.max(0,p)}`;return}_.style.strokeDashoffset=`${o}`}),u&&(u.setAttribute("cx",c.point.x.toFixed(2)),u.setAttribute("cy",c.point.y.toFixed(2)),u.style.opacity=l<=e.totalDuration+M?"1":"0"),l<e.totalDuration+M){$=requestAnimationFrame(s);return}C(),q()};$=requestAnimationFrame(s),h()},re=(e,r,s,i)=>{const l=J(e);a=new K(l,{startTolerance:x,hitTolerance:x}),d=null;const g=e.strokes.filter(t=>t.type!=="lift"),c=g.map(t=>`<path class="writing-app__stroke-bg" d="${A(t.curves)}"></path>`).join(""),T=g.map(t=>`<path class="writing-app__stroke-trace" d="${A(t.curves)}"></path>`).join(""),_=g.map(t=>`<path class="writing-app__stroke-demo" d="${A(t.curves)}"></path>`).join("");n.setAttribute("viewBox",`0 0 ${r} ${s}`),n.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${r}" height="${s}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${e.guides.xHeight+i}"
      x2="${r}"
      y2="${e.guides.xHeight+i}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${e.guides.baseline+i}"
      x2="${r}"
      y2="${e.guides.baseline+i}"
    ></line>
    ${c}
    ${T}
    ${_}
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `,w=Array.from(n.querySelectorAll(".writing-app__stroke-trace")),b=Array.from(n.querySelectorAll(".writing-app__stroke-demo")),S=n.querySelector("#trace-cursor"),u=n.querySelector("#demo-nib"),E=w.map(t=>{const o=t.getTotalLength();return Number.isFinite(o)&&o>0?o:.001}),k=b.map(t=>{const o=t.getTotalLength();return Number.isFinite(o)&&o>0?o:.001}),w.forEach((t,o)=>{const p=E[o]??.001;t.style.strokeDasharray=`${p} ${p}`,t.style.strokeDashoffset=`${p}`}),b.forEach((t,o)=>{const p=k[o]??.001;t.style.strokeDasharray=`${p} ${p}`,t.style.strokeDashoffset=`${p}`}),u&&(u.style.opacity="0"),I(!1),h()},j=e=>{C(),W.textContent=e;const r=G(e);L=r.path,re(r.path,r.width,r.height,r.offsetY)},V=()=>{f=Y(f),j(v[f]??v[0])},ne=e=>{y||!a||d!==null||!a.beginAt(N(n,e))||(e.preventDefault(),d=e.pointerId,n.setPointerCapture(e.pointerId),h())},se=e=>{y||!a||e.pointerId!==d||(e.preventDefault(),a.update(N(n,e)),h())},ae=e=>{!a||e.pointerId!==d||(a.end(),n.hasPointerCapture(e.pointerId)&&n.releasePointerCapture(e.pointerId),d=null,h())},oe=e=>{e.pointerId===d&&(a==null||a.end(),n.hasPointerCapture(e.pointerId)&&n.releasePointerCapture(e.pointerId),d=null,h())};n.addEventListener("pointerdown",ne);n.addEventListener("pointermove",se);n.addEventListener("pointerup",ae);n.addEventListener("pointercancel",oe);m.addEventListener("click",te);H.addEventListener("click",V);P.addEventListener("input",()=>{x=Number(P.value),U(),f>=0&&j(v[f]??v[0])});U();V();
