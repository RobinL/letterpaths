import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as ue}from"./style-Dpvqy9X2.js";import"./joiner-BVxCW5LS.js";import{M as de,d as ge,T as _e,f as he,g as X,c as we,W as j,a as fe,e as me}from"./shared-dPyTwZsy.js";const k="zephyr",ye=84,H=he,W=70,be=0,ve=120,xe=1,z=5,Ee=["word","tolerance","frontBackTolerance"],Se=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/freehand_tracing/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register freehand tracing service worker.",t)})},Z=document.querySelector("#app");if(!Z)throw new Error("Missing #app element for freehand tracing app.");Se();Z.innerHTML=`
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
                value="${k}"
                placeholder="${k}"
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
                    Side-to-side tolerance
                    <span class="writing-app__tolerance-value" id="tolerance-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="tolerance-slider"
                    type="range"
                    min="${de}"
                    max="${ge}"
                    step="${_e}"
                    value="${H}"
                  />
                </label>
                <label class="writing-app__settings-field" for="front-back-tolerance-slider">
                  <span class="writing-app__settings-label">
                    Front/back tolerance
                    <span class="writing-app__tolerance-value" id="front-back-tolerance-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="front-back-tolerance-slider"
                    type="range"
                    min="${be}"
                    max="${ve}"
                    step="${xe}"
                    value="${W}"
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
`;const w=document.querySelector("#word-input"),J=document.querySelector("#score-value"),Q=document.querySelector("#progress-value"),x=document.querySelector("#tolerance-slider"),Y=document.querySelector("#tolerance-value"),E=document.querySelector("#front-back-tolerance-slider"),ee=document.querySelector("#front-back-tolerance-value"),te=document.querySelector("#reset-button"),i=document.querySelector("#freehand-svg"),ne=document.querySelector("#success-overlay"),re=document.querySelector("#score-summary"),ae=document.querySelector("#try-again-button"),se=document.querySelector("#next-word-button");if(!w||!J||!Q||!x||!Y||!E||!ee||!te||!i||!ne||!re||!ae||!se)throw new Error("Missing elements for freehand tracing app.");let ie=-1,_=k,d=H,c=W,P=null,C=null,o=[],L=[],m=null,y=null,p=null,f=null,S=null,g=null,A=null,u=0,b=[];const oe=e=>e.trim().replace(/\s+/g," "),$e=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,t=""]=e.step.split(".");return t.length},I=(e,t)=>{const r=Number(e.min),n=Number(e.max),s=e.step==="any"?Number.NaN:Number(e.step),l=Number.isFinite(r)?r:0;let a=t;return Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number.isFinite(s)&&s>0&&(a=l+Math.round((a-l)/s)*s),Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number(a.toFixed($e(e)))},U=()=>{Y.textContent=`${d}px`,ee.textContent=`${c}px`},F=()=>{const e=new URL(window.location.href);Ee.forEach(n=>{e.searchParams.delete(n)}),_!==k&&e.searchParams.set("word",_),d!==H&&e.searchParams.set("tolerance",String(d)),c!==W&&e.searchParams.set("frontBackTolerance",String(c));const t=`${e.pathname}${e.search}${e.hash}`,r=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==r&&window.history.replaceState(null,"",t)},Te=()=>{const e=new URLSearchParams(window.location.search),t=e.get("word"),r=e.get("tolerance"),n=e.get("frontBackTolerance");if(t!==null&&(_=oe(t)),r!==null){const s=Number(r);Number.isFinite(s)&&(d=I(x,s))}if(n!==null){const s=Number(n);Number.isFinite(s)&&(c=I(E,s))}w.value=_,x.value=String(d),E.value=String(c),U(),F()},Ae=e=>e.strokes.flatMap((t,r)=>t.samples.map((n,s)=>({x:n.x,y:n.y,tangent:n.tangent,strokeIndex:r,sampleIndex:s,completed:!1,error:null}))),le=e=>{if(e.length===0)return"";const[t,...r]=e;return`M ${t.x} ${t.y}${r.map(n=>` L ${n.x} ${n.y}`).join("")}`},G=()=>{if(b.length===0)return null;const e=b.reduce((r,n)=>r+n,0)/b.length;if(e<=.5)return 100;const t=Math.min(1,e/d);return Math.max(0,Math.round((1-t)*100))},Me=e=>({x:-e.y,y:e.x}),N=(e,t)=>e.x*t.x+e.y*t.y,D=(e,t)=>({x:e.x-t.x,y:e.y-t.y}),Ne=(e,t,r)=>({x:e.x+(t.x-e.x)*r,y:e.y+(t.y-e.y)*r}),Pe=(e,t,r)=>{const n=Me(e.tangent),s=D(t,e),l=D(r,e),a=N(s,e.tangent),h=N(l,e.tangent);if(Math.hypot(r.x-t.x,r.y-t.y)<=.001){const K=Math.abs(N(s,n));return{distance:K,isHit:Math.abs(a)<=c&&K<=d}}if(!(a<=c&&h>=-c||h<=c&&a>=-c))return{distance:Number.POSITIVE_INFINITY,isHit:!1};const T=h-a,q=Math.abs(T)<=.001?0:Math.max(0,Math.min(1,(0-a)/T)),B=Ne(t,r,q),M=Math.abs(N(D(B,e),n));return{distance:M,isHit:M<=d}},R=e=>{ne.hidden=!e},$=()=>{const e=o.length===0?0:Math.round(u/o.length*100),t=G();Q.textContent=`${e}%`,J.textContent=t===null?"--":`${t}`,L.forEach((n,s)=>{const l=o[s],a=s<u,h=s===u,v=s-u,T=v>=0&&v<z,q=T?Math.max(0,1-v/(z-1)):0;if(n.classList.toggle("writing-app__freehand-arrow--done",a),n.classList.toggle("writing-app__freehand-arrow--current",h),n.classList.toggle("writing-app__freehand-arrow--hidden",!T),n.style.opacity=a?"0":q.toFixed(2),a&&n.parentElement!==m?m==null||m.append(n):!a&&n.parentElement!==y&&(y==null||y.append(n)),l){const B=Math.atan2(l.tangent.y,l.tangent.x)*(180/Math.PI),M=h?1.25:1;n.setAttribute("transform",`translate(${l.x} ${l.y}) rotate(${B}) scale(${M})`)}});const r=o[u];if(p&&r){const n=Math.atan2(r.tangent.y,r.tangent.x)*(180/Math.PI);p.style.display="none",p.setAttribute("x",String(-c)),p.setAttribute("y",String(-d)),p.setAttribute("width",String(c*2)),p.setAttribute("height",String(d*2)),p.setAttribute("transform",`translate(${r.x} ${r.y}) rotate(${n})`)}else p&&(p.style.display="none");if(u>=o.length&&o.length>0){const n=G()??0,s=b.reduce((l,a)=>l+a,0)/Math.max(1,b.length);re.textContent=`Score ${n}. Average distance from the checkpoints: ${Math.round(s)}px.`,R(!0)}},V=()=>{S=null,g=null,A=null,u=0,b=[],o=o.map(e=>({...e,completed:!1,error:null})),f==null||f.replaceChildren(),R(!1),$()},ke=e=>{const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("class",e),t.setAttribute("d",""),t},Ce=(e,t,r,n)=>{C=ue(e,{sampleRate:ye}),o=Ae(C);const s=e.strokes.filter(a=>a.type!=="lift").map(a=>`<path class="writing-app__freehand-guide" d="${fe(a.curves)}"></path>`).join(""),l=o.map((a,h)=>{const v=Math.atan2(a.tangent.y,a.tangent.x)*(180/Math.PI);return`
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
    <g class="writing-app__freehand-completed-arrows" id="completed-arrows"></g>
    <rect class="writing-app__freehand-tolerance" id="tolerance-gate"></rect>
    <g class="writing-app__freehand-ink" id="user-ink"></g>
    <g class="writing-app__freehand-remaining-arrows" id="remaining-arrows">${l}</g>
  `,L=Array.from(i.querySelectorAll(".writing-app__freehand-arrow")),m=i.querySelector("#completed-arrows"),y=i.querySelector("#remaining-arrows"),p=i.querySelector("#tolerance-gate"),f=i.querySelector("#user-ink"),V()},O=(e,t=-1)=>{if(_=oe(e),ie=t,w.value=_,F(),_.length===0){P=null,C=null,o=[],L=[],m=null,y=null,p=null,f=null,i.innerHTML="",$(),R(!1);return}try{const r=we(_);P=r.path,Ce(r.path,r.width,r.height,r.offsetY)}catch{P=null,C=null,o=[],L=[],m=null,y=null,p=null,f=null,i.innerHTML="",$(),R(!1)}},ce=(e,t)=>{const r=Math.hypot(t.x-e.x,t.y-e.y)<=.001;let n=o[u];for(;n;){const s=Pe(n,e,t);if(!s.isHit||(n.completed=!0,n.error=s.distance,b.push(s.distance),u+=1,r))break;n=o[u]}$()},Le=e=>{if(!f)return;const t=ke("writing-app__freehand-user-stroke");f.append(t),g={points:[e],pathEl:t},t.setAttribute("d",le(g.points))},Ie=e=>{if(!g)return;const t=g.points[g.points.length-1];t&&Math.hypot(e.x-t.x,e.y-t.y)<2||(g.points.push(e),g.pathEl.setAttribute("d",le(g.points)))},Re=e=>{if(!P||S!==null||u>=o.length)return;e.preventDefault();const t=X(i,e);S=e.pointerId,A=t,Le(t),ce(t,t),i.setPointerCapture(e.pointerId)},Fe=e=>{if(e.pointerId!==S)return;e.preventDefault();const t=X(i,e),r=A??t;Ie(t),ce(r,t),A=t},pe=e=>{e.pointerId===S&&(i.hasPointerCapture(e.pointerId)&&i.releasePointerCapture(e.pointerId),S=null,g=null,A=null)},Oe=()=>{const e=me(ie);O(j[e]??j[0],e)};i.addEventListener("pointerdown",Re);i.addEventListener("pointermove",Fe);i.addEventListener("pointerup",pe);i.addEventListener("pointercancel",pe);w.addEventListener("input",()=>{O(w.value)});w.addEventListener("keydown",e=>{e.key==="Enter"&&(w.blur(),O(w.value))});x.addEventListener("input",()=>{d=I(x,Number(x.value)),U(),F(),$()});E.addEventListener("input",()=>{c=I(E,Number(E.value)),U(),F(),$()});te.addEventListener("click",V);ae.addEventListener("click",V);se.addEventListener("click",Oe);Te();O(_);
