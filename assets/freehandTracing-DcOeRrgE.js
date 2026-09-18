import"./Z-upper-print-bezier-o7EP_mHt.js";import{c as ue}from"./style-DEZiQ06N.js";import{a as de}from"./fullscreen-CB-OVFP5.js";import"./joiner-C20HBd4f.js";import{M as ge,d as _e,T as he,f as we,g as Z,c as fe,W as z,a as me,e as ye}from"./shared-Dlc__k-V.js";const k="zephyr",be=84,H=we,W=70,ve=0,xe=120,Se=1,G=5,Ee=["word","tolerance","frontBackTolerance"],$e=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/freehand_tracing/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register freehand tracing service worker.",t)})},U=document.querySelector("#app");if(!U)throw new Error("Missing #app element for freehand tracing app.");$e();U.innerHTML=`
  <div class="writing-app writing-app--freehand">
    <a class="writing-app__home-link" href="https://www.robinlinacre.com/letterpaths">Back to letterpaths</a>
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
                    min="${ge}"
                    max="${_e}"
                    step="${he}"
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
                    min="${ve}"
                    max="${xe}"
                    step="${Se}"
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
`;de(U.querySelector(".writing-app__topbar-actions"));const w=document.querySelector("#word-input"),J=document.querySelector("#score-value"),Q=document.querySelector("#progress-value"),x=document.querySelector("#tolerance-slider"),Y=document.querySelector("#tolerance-value"),S=document.querySelector("#front-back-tolerance-slider"),ee=document.querySelector("#front-back-tolerance-value"),te=document.querySelector("#reset-button"),i=document.querySelector("#freehand-svg"),ne=document.querySelector("#success-overlay"),re=document.querySelector("#score-summary"),ae=document.querySelector("#try-again-button"),se=document.querySelector("#next-word-button");if(!w||!J||!Q||!x||!Y||!S||!ee||!te||!i||!ne||!re||!ae||!se)throw new Error("Missing elements for freehand tracing app.");let ie=-1,_=k,d=H,c=W,P=null,C=null,o=[],L=[],m=null,y=null,p=null,f=null,E=null,g=null,A=null,u=0,b=[];const oe=e=>e.replace(/\s/g," ").trim(),Te=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,t=""]=e.step.split(".");return t.length},I=(e,t)=>{const r=Number(e.min),n=Number(e.max),s=e.step==="any"?Number.NaN:Number(e.step),l=Number.isFinite(r)?r:0;let a=t;return Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number.isFinite(s)&&s>0&&(a=l+Math.round((a-l)/s)*s),Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number(a.toFixed(Te(e)))},V=()=>{Y.textContent=`${d}px`,ee.textContent=`${c}px`},F=()=>{const e=new URL(window.location.href);Ee.forEach(n=>{e.searchParams.delete(n)}),_!==k&&e.searchParams.set("word",_),d!==H&&e.searchParams.set("tolerance",String(d)),c!==W&&e.searchParams.set("frontBackTolerance",String(c));const t=`${e.pathname}${e.search}${e.hash}`,r=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==r&&window.history.replaceState(null,"",t)},Ae=()=>{const e=new URLSearchParams(window.location.search),t=e.get("word"),r=e.get("tolerance"),n=e.get("frontBackTolerance");if(t!==null&&(_=oe(t)),r!==null){const s=Number(r);Number.isFinite(s)&&(d=I(x,s))}if(n!==null){const s=Number(n);Number.isFinite(s)&&(c=I(S,s))}w.value=_,x.value=String(d),S.value=String(c),V(),F()},Me=e=>e.strokes.flatMap((t,r)=>t.samples.map((n,s)=>({x:n.x,y:n.y,tangent:n.tangent,strokeIndex:r,sampleIndex:s,completed:!1,error:null}))),le=e=>{if(e.length===0)return"";const[t,...r]=e;return`M ${t.x} ${t.y}${r.map(n=>` L ${n.x} ${n.y}`).join("")}`},X=()=>{if(b.length===0)return null;const e=b.reduce((r,n)=>r+n,0)/b.length;if(e<=.5)return 100;const t=Math.min(1,e/d);return Math.max(0,Math.round((1-t)*100))},Ne=e=>({x:-e.y,y:e.x}),N=(e,t)=>e.x*t.x+e.y*t.y,D=(e,t)=>({x:e.x-t.x,y:e.y-t.y}),Pe=(e,t,r)=>({x:e.x+(t.x-e.x)*r,y:e.y+(t.y-e.y)*r}),ke=(e,t,r)=>{const n=Ne(e.tangent),s=D(t,e),l=D(r,e),a=N(s,e.tangent),h=N(l,e.tangent);if(Math.hypot(r.x-t.x,r.y-t.y)<=.001){const j=Math.abs(N(s,n));return{distance:j,isHit:Math.abs(a)<=c&&j<=d}}if(!(a<=c&&h>=-c||h<=c&&a>=-c))return{distance:Number.POSITIVE_INFINITY,isHit:!1};const T=h-a,q=Math.abs(T)<=.001?0:Math.max(0,Math.min(1,(0-a)/T)),B=Pe(t,r,q),M=Math.abs(N(D(B,e),n));return{distance:M,isHit:M<=d}},R=e=>{ne.hidden=!e},$=()=>{const e=o.length===0?0:Math.round(u/o.length*100),t=X();Q.textContent=`${e}%`,J.textContent=t===null?"--":`${t}`,L.forEach((n,s)=>{const l=o[s],a=s<u,h=s===u,v=s-u,T=v>=0&&v<G,q=T?Math.max(0,1-v/(G-1)):0;if(n.classList.toggle("writing-app__freehand-arrow--done",a),n.classList.toggle("writing-app__freehand-arrow--current",h),n.classList.toggle("writing-app__freehand-arrow--hidden",!T),n.style.opacity=a?"0":q.toFixed(2),a&&n.parentElement!==m?m==null||m.append(n):!a&&n.parentElement!==y&&(y==null||y.append(n)),l){const B=Math.atan2(l.tangent.y,l.tangent.x)*(180/Math.PI),M=h?1.25:1;n.setAttribute("transform",`translate(${l.x} ${l.y}) rotate(${B}) scale(${M})`)}});const r=o[u];if(p&&r){const n=Math.atan2(r.tangent.y,r.tangent.x)*(180/Math.PI);p.style.display="none",p.setAttribute("x",String(-c)),p.setAttribute("y",String(-d)),p.setAttribute("width",String(c*2)),p.setAttribute("height",String(d*2)),p.setAttribute("transform",`translate(${r.x} ${r.y}) rotate(${n})`)}else p&&(p.style.display="none");if(u>=o.length&&o.length>0){const n=X()??0,s=b.reduce((l,a)=>l+a,0)/Math.max(1,b.length);re.textContent=`Score ${n}. Average distance from the checkpoints: ${Math.round(s)}px.`,R(!0)}},K=()=>{E=null,g=null,A=null,u=0,b=[],o=o.map(e=>({...e,completed:!1,error:null})),f==null||f.replaceChildren(),R(!1),$()},Ce=e=>{const t=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("class",e),t.setAttribute("d",""),t},Le=(e,t,r,n)=>{C=ue(e,{sampleRate:be}),o=Me(C);const s=e.strokes.filter(a=>a.type!=="lift").map(a=>`<path class="writing-app__freehand-guide" d="${me(a.curves)}"></path>`).join(""),l=o.map((a,h)=>{const v=Math.atan2(a.tangent.y,a.tangent.x)*(180/Math.PI);return`
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
  `,L=Array.from(i.querySelectorAll(".writing-app__freehand-arrow")),m=i.querySelector("#completed-arrows"),y=i.querySelector("#remaining-arrows"),p=i.querySelector("#tolerance-gate"),f=i.querySelector("#user-ink"),K()},O=(e,t=-1)=>{if(_=oe(e),ie=t,w.value=_,F(),_.length===0){P=null,C=null,o=[],L=[],m=null,y=null,p=null,f=null,i.innerHTML="",$(),R(!1);return}try{const r=fe(_);P=r.path,Le(r.path,r.width,r.height,r.offsetY)}catch{P=null,C=null,o=[],L=[],m=null,y=null,p=null,f=null,i.innerHTML="",$(),R(!1)}},ce=(e,t)=>{const r=Math.hypot(t.x-e.x,t.y-e.y)<=.001;let n=o[u];for(;n;){const s=ke(n,e,t);if(!s.isHit||(n.completed=!0,n.error=s.distance,b.push(s.distance),u+=1,r))break;n=o[u]}$()},Ie=e=>{if(!f)return;const t=Ce("writing-app__freehand-user-stroke");f.append(t),g={points:[e],pathEl:t},t.setAttribute("d",le(g.points))},Re=e=>{if(!g)return;const t=g.points[g.points.length-1];t&&Math.hypot(e.x-t.x,e.y-t.y)<2||(g.points.push(e),g.pathEl.setAttribute("d",le(g.points)))},Fe=e=>{if(!P||E!==null||u>=o.length)return;e.preventDefault();const t=Z(i,e);E=e.pointerId,A=t,Ie(t),ce(t,t),i.setPointerCapture(e.pointerId)},Oe=e=>{if(e.pointerId!==E)return;e.preventDefault();const t=Z(i,e),r=A??t;Re(t),ce(r,t),A=t},pe=e=>{e.pointerId===E&&(i.hasPointerCapture(e.pointerId)&&i.releasePointerCapture(e.pointerId),E=null,g=null,A=null)},qe=()=>{const e=ye(ie);O(z[e]??z[0],e)};i.addEventListener("pointerdown",Fe);i.addEventListener("pointermove",Oe);i.addEventListener("pointerup",pe);i.addEventListener("pointercancel",pe);w.addEventListener("input",()=>{O(w.value)});w.addEventListener("keydown",e=>{e.key==="Enter"&&(w.blur(),O(w.value))});x.addEventListener("input",()=>{d=I(x,Number(x.value)),V(),F(),$()});S.addEventListener("input",()=>{c=I(S,Number(S.value)),V(),F(),$()});te.addEventListener("click",K);ae.addEventListener("click",K);se.addEventListener("click",qe);Ae();O(_);
