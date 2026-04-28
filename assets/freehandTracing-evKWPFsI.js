import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as ct}from"./style-C8O6UmtF.js";import"./joiner-CVeVmRQl.js";import{M as pt,d as ut,T as dt,f as gt,g as z,c as ht,W as V,a as _t,e as wt}from"./shared-DdEFG-pU.js";const C="zephyr",mt=84,O=gt,m=12,B=5,yt=["word","tolerance"],j=document.querySelector("#app");if(!j)throw new Error("Missing #app element for freehand tracing app.");j.innerHTML=`
  <div class="writing-app writing-app--freehand">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar writing-app__topbar--freehand">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Freehand tracing</p>
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
                    min="${pt}"
                    max="${ut}"
                    step="${dt}"
                    value="${O}"
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
`;const _=document.querySelector("#word-input"),K=document.querySelector("#score-value"),X=document.querySelector("#progress-value"),v=document.querySelector("#tolerance-slider"),Z=document.querySelector("#tolerance-value"),J=document.querySelector("#reset-button"),i=document.querySelector("#freehand-svg"),Q=document.querySelector("#success-overlay"),Y=document.querySelector("#score-summary"),tt=document.querySelector("#try-again-button"),et=document.querySelector("#next-word-button");if(!_||!K||!X||!v||!Z||!J||!i||!Q||!Y||!tt||!et)throw new Error("Missing elements for freehand tracing app.");let nt=-1,g=C,u=O,L=null,N=null,o=[],I=[],y=null,f=null,c=null,S=null,w=null,$=null,d=null,M=null,p=0,b=[];const rt=t=>t.trim().replace(/\s+/g," ").toLowerCase(),ft=t=>{if(t.step==="any"||t.step.length===0)return 0;const[,e=""]=t.step.split(".");return e.length},at=(t,e)=>{const r=Number(t.min),n=Number(t.max),s=t.step==="any"?Number.NaN:Number(t.step),l=Number.isFinite(r)?r:0;let a=e;return Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number.isFinite(s)&&s>0&&(a=l+Math.round((a-l)/s)*s),Number.isFinite(r)&&(a=Math.max(r,a)),Number.isFinite(n)&&(a=Math.min(n,a)),Number(a.toFixed(ft(t)))},st=()=>{Z.textContent=`${u}px`},F=()=>{const t=new URL(window.location.href);yt.forEach(n=>{t.searchParams.delete(n)}),g!==C&&t.searchParams.set("word",g),u!==O&&t.searchParams.set("tolerance",String(u));const e=`${t.pathname}${t.search}${t.hash}`,r=`${window.location.pathname}${window.location.search}${window.location.hash}`;e!==r&&window.history.replaceState(null,"",e)},bt=()=>{const t=new URLSearchParams(window.location.search),e=t.get("word"),r=t.get("tolerance");if(e!==null&&(g=rt(e)),r!==null){const n=Number(r);Number.isFinite(n)&&(u=at(v,n))}_.value=g,v.value=String(u),st(),F()},xt=t=>t.strokes.flatMap((e,r)=>e.samples.map((n,s)=>({x:n.x,y:n.y,tangent:n.tangent,strokeIndex:r,sampleIndex:s,completed:!1,error:null}))),it=t=>{if(t.length===0)return"";const[e,...r]=t;return`M ${e.x} ${e.y}${r.map(n=>` L ${n.x} ${n.y}`).join("")}`},vt=()=>{const t=o.slice(0,p);let e="",r=null;return t.forEach(n=>{if(n.strokeIndex!==r){e+=` M ${n.x} ${n.y}`,r=n.strokeIndex;return}e+=` L ${n.x} ${n.y}`}),e.trim()},G=()=>{if(b.length===0)return null;const t=b.reduce((r,n)=>r+n,0)/b.length;if(t<=.5)return 100;const e=Math.min(1,t/u);return Math.max(0,Math.round((1-e)*100))},St=t=>({x:-t.y,y:t.x}),A=(t,e)=>t.x*e.x+t.y*e.y,H=(t,e)=>({x:t.x-e.x,y:t.y-e.y}),$t=(t,e,r)=>({x:t.x+(e.x-t.x)*r,y:t.y+(e.y-t.y)*r}),Et=(t,e,r)=>{const n=St(t.tangent),s=H(e,t),l=H(r,t),a=A(s,t.tangent),h=A(l,t.tangent);if(Math.hypot(r.x-e.x,r.y-e.y)<=.001){const U=Math.abs(A(s,n));return{distance:U,isHit:Math.abs(a)<=m&&U<=u}}if(!(a<=m&&h>=-m||h<=m&&a>=-m))return{distance:Number.POSITIVE_INFINITY,isHit:!1};const E=h-a,q=Math.abs(E)<=.001?0:Math.max(0,Math.min(1,(0-a)/E)),D=$t(e,r,q),T=Math.abs(A(H(D,t),n));return{distance:T,isHit:T<=u}},k=t=>{Q.hidden=!t},P=()=>{const t=o.length===0?0:Math.round(p/o.length*100),e=G();X.textContent=`${t}%`,K.textContent=e===null?"--":`${e}`,S==null||S.setAttribute("d",vt()),I.forEach((n,s)=>{const l=o[s],a=s<p,h=s===p,x=s-p,E=x>=0&&x<B,q=E?Math.max(0,1-x/(B-1)):0;if(n.classList.toggle("writing-app__freehand-arrow--done",a),n.classList.toggle("writing-app__freehand-arrow--current",h),n.classList.toggle("writing-app__freehand-arrow--hidden",!E),n.style.opacity=a?"0":q.toFixed(2),a&&n.parentElement!==y?y==null||y.append(n):!a&&n.parentElement!==f&&(f==null||f.append(n)),l){const D=Math.atan2(l.tangent.y,l.tangent.x)*(180/Math.PI),T=h?1.25:1;n.setAttribute("transform",`translate(${l.x} ${l.y}) rotate(${D}) scale(${T})`)}});const r=o[p];if(c&&r){const n=Math.atan2(r.tangent.y,r.tangent.x)*(180/Math.PI);c.style.display="none",c.setAttribute("x",String(-m)),c.setAttribute("y",String(-u)),c.setAttribute("width",String(m*2)),c.setAttribute("height",String(u*2)),c.setAttribute("transform",`translate(${r.x} ${r.y}) rotate(${n})`)}else c&&(c.style.display="none");if(p>=o.length&&o.length>0){const n=G()??0,s=b.reduce((l,a)=>l+a,0)/Math.max(1,b.length);Y.textContent=`Score ${n}. Average distance from the checkpoints: ${Math.round(s)}px.`,k(!0)}},W=()=>{$=null,d=null,M=null,p=0,b=[],o=o.map(t=>({...t,completed:!1,error:null})),w==null||w.replaceChildren(),k(!1),P()},Mt=t=>{const e=document.createElementNS("http://www.w3.org/2000/svg","path");return e.setAttribute("class",t),e.setAttribute("d",""),e},Pt=(t,e,r,n)=>{N=ct(t,{sampleRate:mt}),o=xt(N);const s=t.strokes.filter(a=>a.type!=="lift").map(a=>`<path class="writing-app__freehand-guide" d="${_t(a.curves)}"></path>`).join(""),l=o.map((a,h)=>{const x=Math.atan2(a.tangent.y,a.tangent.x)*(180/Math.PI);return`
        <path
          class="writing-app__freehand-arrow"
          data-checkpoint-index="${h}"
          data-stroke-index="${a.strokeIndex}"
          data-sample-index="${a.sampleIndex}"
          d="M -22.5 -16.5 L 22.5 0 L -22.5 16.5 L -12 0 Z"
          transform="translate(${a.x} ${a.y}) rotate(${x})"
        ></path>
      `}).join("");i.setAttribute("viewBox",`0 0 ${e} ${r}`),i.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${e}" height="${r}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${t.guides.xHeight+n}"
      x2="${e}"
      y2="${t.guides.xHeight+n}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${t.guides.baseline+n}"
      x2="${e}"
      y2="${t.guides.baseline+n}"
    ></line>
    <g class="writing-app__freehand-word">${s}</g>
    <path class="writing-app__freehand-completed" id="completed-checkpoint-path" d=""></path>
    <g class="writing-app__freehand-completed-arrows" id="completed-arrows"></g>
    <rect class="writing-app__freehand-tolerance" id="tolerance-gate"></rect>
    <g class="writing-app__freehand-ink" id="user-ink"></g>
    <g class="writing-app__freehand-remaining-arrows" id="remaining-arrows">${l}</g>
  `,I=Array.from(i.querySelectorAll(".writing-app__freehand-arrow")),y=i.querySelector("#completed-arrows"),f=i.querySelector("#remaining-arrows"),c=i.querySelector("#tolerance-gate"),S=i.querySelector("#completed-checkpoint-path"),w=i.querySelector("#user-ink"),W()},R=(t,e=-1)=>{if(g=rt(t),nt=e,_.value=g,F(),g.length===0){L=null,N=null,o=[],I=[],y=null,f=null,c=null,S=null,w=null,i.innerHTML="",P(),k(!1);return}try{const r=ht(g);L=r.path,Pt(r.path,r.width,r.height,r.offsetY)}catch{L=null,N=null,o=[],I=[],y=null,f=null,c=null,S=null,w=null,i.innerHTML="",P(),k(!1)}},ot=(t,e)=>{const r=Math.hypot(e.x-t.x,e.y-t.y)<=.001;let n=o[p];for(;n;){const s=Et(n,t,e);if(!s.isHit||(n.completed=!0,n.error=s.distance,b.push(s.distance),p+=1,r))break;n=o[p]}P()},Tt=t=>{if(!w)return;const e=Mt("writing-app__freehand-user-stroke");w.append(e),d={points:[t],pathEl:e},e.setAttribute("d",it(d.points))},At=t=>{if(!d)return;const e=d.points[d.points.length-1];e&&Math.hypot(t.x-e.x,t.y-e.y)<2||(d.points.push(t),d.pathEl.setAttribute("d",it(d.points)))},Lt=t=>{if(!L||$!==null||p>=o.length)return;t.preventDefault();const e=z(i,t);$=t.pointerId,M=e,Tt(e),ot(e,e),i.setPointerCapture(t.pointerId)},Ct=t=>{if(t.pointerId!==$)return;t.preventDefault();const e=z(i,t),r=M??e;At(e),ot(r,e),M=e},lt=t=>{t.pointerId===$&&(i.hasPointerCapture(t.pointerId)&&i.releasePointerCapture(t.pointerId),$=null,d=null,M=null)},Nt=()=>{const t=wt(nt);R(V[t]??V[0],t)};i.addEventListener("pointerdown",Lt);i.addEventListener("pointermove",Ct);i.addEventListener("pointerup",lt);i.addEventListener("pointercancel",lt);_.addEventListener("change",()=>{R(_.value)});_.addEventListener("keydown",t=>{t.key==="Enter"&&(_.blur(),R(_.value))});v.addEventListener("input",()=>{u=at(v,Number(v.value)),st(),F(),P()});J.addEventListener("click",W);tt.addEventListener("click",W);et.addEventListener("click",Nt);bt();R(g);
