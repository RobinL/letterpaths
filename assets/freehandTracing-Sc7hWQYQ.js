import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as ce}from"./style-DW-mNVlM.js";import"./joiner-CVeVmRQl.js";import{M as pe,d as ue,T as de,f as ge,g as j,c as he,W as V,a as _e,e as we}from"./shared-v9TOLZ3P.js";const C="zephyr",me=84,H=ge,m=12,B=5,ye=["word","tolerance"],fe=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/freehand_tracing/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register freehand tracing service worker.",t)})},z=document.querySelector("#app");if(!z)throw new Error("Missing #app element for freehand tracing app.");fe();z.innerHTML=`
  <div class="writing-app writing-app--freehand">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar writing-app__topbar--freehand">
          <div class="writing-app__title">
            <label class="writing-app__word-input-label" for="word-input">
              <span>Enter word</span>
              <input
                class="writing-app__word-input"
                id="word-input"
                type="text"
                value="${C}"
                placeholder="${C}"
                spellcheck="false"
                autocomplete="off"
              />
            </label>
          </div>
          <div class="writing-app__score-card" aria-live="polite">
            <span class="writing-app__score-label">Score</span>
            <span class="writing-app__score-value" id="score-value">--</span>
          </div>
          <div class="writing-app__score-card" aria-live="polite">
            <span class="writing-app__score-label">Progress</span>
            <span class="writing-app__score-value" id="progress-value">0%</span>
          </div>
          <div class="writing-app__topbar-actions">
            <button class="writing-app__button writing-app__button--secondary" id="reset-button" type="button">
              Reset
            </button>
            <details class="writing-app__settings" id="settings-menu">
              <summary
                class="writing-app__icon-button"
                id="settings-button"
                aria-label="Settings"
                title="Settings"
              >⚙</summary>
              <div class="writing-app__settings-panel">
                <label class="writing-app__settings-field" for="tolerance-slider">
                  <span class="writing-app__settings-label">
                    Tolerance
                    <span class="writing-app__tolerance-value" id="tolerance-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="tolerance-slider"
                    type="range"
                    min="${pe}"
                    max="${ue}"
                    step="${de}"
                    value="${H}"
                  />
                </label>
              </div>
            </details>
          </div>
        </header>

        <svg
          class="writing-app__svg"
          id="freehand-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting freehand tracing area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Trace complete</p>
            <p class="writing-app__success-copy" id="score-summary"></p>
            <div class="writing-app__success-actions">
              <button
                class="writing-app__button writing-app__button--secondary"
                id="try-again-button"
                type="button"
              >
                Try again
              </button>
              <button
                class="writing-app__button writing-app__button--next"
                id="next-word-button"
                type="button"
              >
                Next word
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
`;const _=document.querySelector("#word-input"),K=document.querySelector("#score-value"),X=document.querySelector("#progress-value"),x=document.querySelector("#tolerance-slider"),Z=document.querySelector("#tolerance-value"),J=document.querySelector("#reset-button"),i=document.querySelector("#freehand-svg"),Q=document.querySelector("#success-overlay"),Y=document.querySelector("#score-summary"),ee=document.querySelector("#try-again-button"),te=document.querySelector("#next-word-button");if(!_||!K||!X||!x||!Z||!J||!i||!Q||!Y||!ee||!te)throw new Error("Missing elements for freehand tracing app.");let ne=-1,g=C,u=H,L=null,N=null,o=[],I=[],y=null,f=null,c=null,$=null,w=null,S=null,d=null,M=null,p=0,b=[];const re=e=>e.trim().replace(/\s+/g," ").toLowerCase(),be=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,t=""]=e.step.split(".");return t.length},ae=(e,t)=>{const r=Number(e.min),n=Number(e.max),s=e.step==="any"?Number.NaN:Number(e.step),l=Number.isFinite(r)?r:0;let a=t;return Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number.isFinite(s)&&s>0&&(a=l+Math.round((a-l)/s)*s),Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number(a.toFixed(be(e)))},se=()=>{Z.textContent=`${u}px`},O=()=>{const e=new URL(window.location.href);ye.forEach(n=>{e.searchParams.delete(n)}),g!==C&&e.searchParams.set("word",g),u!==H&&e.searchParams.set("tolerance",String(u));const t=`${e.pathname}${e.search}${e.hash}`,r=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==r&&window.history.replaceState(null,"",t)},ve=()=>{const e=new URLSearchParams(window.location.search),t=e.get("word"),r=e.get("tolerance");if(t!==null&&(g=re(t)),r!==null){const n=Number(r);Number.isFinite(n)&&(u=ae(x,n))}_.value=g,x.value=String(u),se(),O()},xe=e=>e.strokes.flatMap((t,r)=>t.samples.map((n,s)=>({x:n.x,y:n.y,tangent:n.tangent,strokeIndex:r,sampleIndex:s,completed:!1,error:null}))),ie=e=>{if(e.length===0)return"";const[t,...r]=e;return`M ${t.x} ${t.y}${r.map(n=>` L ${n.x} ${n.y}`).join("")}`},$e=()=>{const e=o.slice(0,p);let t="",r=null;return e.forEach(n=>{if(n.strokeIndex!==r){t+=` M ${n.x} ${n.y}`,r=n.strokeIndex;return}t+=` L ${n.x} ${n.y}`}),t.trim()},G=()=>{if(b.length===0)return null;const e=b.reduce((r,n)=>r+n,0)/b.length;if(e<=.5)return 100;const t=Math.min(1,e/u);return Math.max(0,Math.round((1-t)*100))},Se=e=>({x:-e.y,y:e.x}),A=(e,t)=>e.x*t.x+e.y*t.y,F=(e,t)=>({x:e.x-t.x,y:e.y-t.y}),Ee=(e,t,r)=>({x:e.x+(t.x-e.x)*r,y:e.y+(t.y-e.y)*r}),Me=(e,t,r)=>{const n=Se(e.tangent),s=F(t,e),l=F(r,e),a=A(s,e.tangent),h=A(l,e.tangent);if(Math.hypot(r.x-t.x,r.y-t.y)<=.001){const U=Math.abs(A(s,n));return{distance:U,isHit:Math.abs(a)<=m&&U<=u}}if(!(a<=m&&h>=-m||h<=m&&a>=-m))return{distance:Number.POSITIVE_INFINITY,isHit:!1};const E=h-a,q=Math.abs(E)<=.001?0:Math.max(0,Math.min(1,(0-a)/E)),D=Ee(t,r,q),T=Math.abs(A(F(D,e),n));return{distance:T,isHit:T<=u}},k=e=>{Q.hidden=!e},P=()=>{const e=o.length===0?0:Math.round(p/o.length*100),t=G();X.textContent=`${e}%`,K.textContent=t===null?"--":`${t}`,$==null||$.setAttribute("d",$e()),I.forEach((n,s)=>{const l=o[s],a=s<p,h=s===p,v=s-p,E=v>=0&&v<B,q=E?Math.max(0,1-v/(B-1)):0;if(n.classList.toggle("writing-app__freehand-arrow--done",a),n.classList.toggle("writing-app__freehand-arrow--current",h),n.classList.toggle("writing-app__freehand-arrow--hidden",!E),n.style.opacity=a?"0":q.toFixed(2),a&&n.parentElement!==y?y==null||y.append(n):!a&&n.parentElement!==f&&(f==null||f.append(n)),l){const D=Math.atan2(l.tangent.y,l.tangent.x)*(180/Math.PI),T=h?1.25:1;n.setAttribute("transform",`translate(${l.x} ${l.y}) rotate(${D}) scale(${T})`)}});const r=o[p];if(c&&r){const n=Math.atan2(r.tangent.y,r.tangent.x)*(180/Math.PI);c.style.display="none",c.setAttribute("x",String(-m)),c.setAttribute("y",String(-u)),c.setAttribute("width",String(m*2)),c.setAttribute("height",String(u*2)),c.setAttribute("transform",`translate(${r.x} ${r.y}) rotate(${n})`)}else c&&(c.style.display="none");if(p>=o.length&&o.length>0){const n=G()??0,s=b.reduce((l,a)=>l+a,0)/Math.max(1,b.length);Y.textContent=`Score ${n}. Average distance from the checkpoints: ${Math.round(s)}px.`,k(!0)}},W=()=>{S=null,d=null,M=null,p=0,b=[],o=o.map(e=>({...e,completed:!1,error:null})),w==null||w.replaceChildren(),k(!1),P()},Pe=e=>{const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("class",e),t.setAttribute("d",""),t},Te=(e,t,r,n)=>{N=ce(e,{sampleRate:me}),o=xe(N);const s=e.strokes.filter(a=>a.type!=="lift").map(a=>`<path class="writing-app__freehand-guide" d="${_e(a.curves)}"></path>`).join(""),l=o.map((a,h)=>{const v=Math.atan2(a.tangent.y,a.tangent.x)*(180/Math.PI);return`
        <path
          class="writing-app__freehand-arrow"
          data-checkpoint-index="${h}"
          data-stroke-index="${a.strokeIndex}"
          data-sample-index="${a.sampleIndex}"
          d="M -22.5 -16.5 L 22.5 0 L -22.5 16.5 L -12 0 Z"
          transform="translate(${a.x} ${a.y}) rotate(${v})"
        ></path>
      `}).join("");i.setAttribute("viewBox",`0 0 ${t} ${r}`),i.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${t}" height="${r}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${e.guides.xHeight+n}"
      x2="${t}"
      y2="${e.guides.xHeight+n}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${e.guides.baseline+n}"
      x2="${t}"
      y2="${e.guides.baseline+n}"
    ></line>
    <g class="writing-app__freehand-word">${s}</g>
    <path class="writing-app__freehand-completed" id="completed-checkpoint-path" d=""></path>
    <g class="writing-app__freehand-completed-arrows" id="completed-arrows"></g>
    <rect class="writing-app__freehand-tolerance" id="tolerance-gate"></rect>
    <g class="writing-app__freehand-ink" id="user-ink"></g>
    <g class="writing-app__freehand-remaining-arrows" id="remaining-arrows">${l}</g>
  `,I=Array.from(i.querySelectorAll(".writing-app__freehand-arrow")),y=i.querySelector("#completed-arrows"),f=i.querySelector("#remaining-arrows"),c=i.querySelector("#tolerance-gate"),$=i.querySelector("#completed-checkpoint-path"),w=i.querySelector("#user-ink"),W()},R=(e,t=-1)=>{if(g=re(e),ne=t,_.value=g,O(),g.length===0){L=null,N=null,o=[],I=[],y=null,f=null,c=null,$=null,w=null,i.innerHTML="",P(),k(!1);return}try{const r=he(g);L=r.path,Te(r.path,r.width,r.height,r.offsetY)}catch{L=null,N=null,o=[],I=[],y=null,f=null,c=null,$=null,w=null,i.innerHTML="",P(),k(!1)}},oe=(e,t)=>{const r=Math.hypot(t.x-e.x,t.y-e.y)<=.001;let n=o[p];for(;n;){const s=Me(n,e,t);if(!s.isHit||(n.completed=!0,n.error=s.distance,b.push(s.distance),p+=1,r))break;n=o[p]}P()},Ae=e=>{if(!w)return;const t=Pe("writing-app__freehand-user-stroke");w.append(t),d={points:[e],pathEl:t},t.setAttribute("d",ie(d.points))},Le=e=>{if(!d)return;const t=d.points[d.points.length-1];t&&Math.hypot(e.x-t.x,e.y-t.y)<2||(d.points.push(e),d.pathEl.setAttribute("d",ie(d.points)))},Ce=e=>{if(!L||S!==null||p>=o.length)return;e.preventDefault();const t=j(i,e);S=e.pointerId,M=t,Ae(t),oe(t,t),i.setPointerCapture(e.pointerId)},Ne=e=>{if(e.pointerId!==S)return;e.preventDefault();const t=j(i,e),r=M??t;Le(t),oe(r,t),M=t},le=e=>{e.pointerId===S&&(i.hasPointerCapture(e.pointerId)&&i.releasePointerCapture(e.pointerId),S=null,d=null,M=null)},Ie=()=>{const e=we(ne);R(V[e]??V[0],e)};i.addEventListener("pointerdown",Ce);i.addEventListener("pointermove",Ne);i.addEventListener("pointerup",le);i.addEventListener("pointercancel",le);_.addEventListener("change",()=>{R(_.value)});_.addEventListener("keydown",e=>{e.key==="Enter"&&(_.blur(),R(_.value))});x.addEventListener("input",()=>{u=ae(x,Number(x.value)),se(),O(),P()});J.addEventListener("click",W);ee.addEventListener("click",W);te.addEventListener("click",Ie);ve();R(g);
