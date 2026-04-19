import{M as X,a as z,T as J,D as F,b as Z,c as Y,d as ee,e as C,A as te,f as re,W as D,g as H,h as O}from"./shared-O8RIojwR.js";import{c as ne,f as oe}from"./formation-arrows-DH7Wx-JM.js";const W=document.querySelector("#app");if(!W)throw new Error("Missing #app element for writing app.");W.innerHTML=`
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
              min="${X}"
              max="${z}"
              step="${J}"
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
`;const U=document.querySelector("#word-label"),o=document.querySelector("#trace-svg"),f=document.querySelector("#show-me-button"),j=document.querySelector("#success-overlay"),B=document.querySelector("#next-word-button"),L=document.querySelector("#tolerance-slider"),V=document.querySelector("#tolerance-value");if(!U||!o||!f||!j||!B||!L||!V)throw new Error("Missing elements for writing app.");let b=-1,R=null,i=null,h=null,u=null,I=!1,E=[],k=[],v=null,T=[],x=[],d=null,A=null,w=!1,P=F;const se=12,ae=2,ie=26,ce=22,le=11,pe=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),G=()=>{V.textContent=`${P}px`},N=e=>{j.hidden=!e},M=()=>{A!==null&&(cancelAnimationFrame(A),A=null),w=!1,f.disabled=!1,f.textContent="Show me",T.forEach((e,t)=>{const r=x[t]??.001;e.style.strokeDasharray=`${r} ${r}`,e.style.strokeDashoffset=`${r}`}),d&&(d.style.opacity="0"),g()},q=()=>{i==null||i.reset(),u=null,N(!1),E.forEach((e,t)=>{const r=k[t]??.001;e.style.strokeDasharray=`${r} ${r}`,e.style.strokeDashoffset=`${r}`}),g()},g=()=>{I||(I=!0,requestAnimationFrame(()=>{I=!1,ge()}))},de=e=>{var s;if(!h)return 0;if(e.status==="complete")return h.strokes.reduce((a,c)=>a+c.totalLength,0);let t=0;for(let a=0;a<e.activeStrokeIndex;a+=1)t+=((s=h.strokes[a])==null?void 0:s.totalLength)??0;const r=h.strokes[e.activeStrokeIndex];return t+((r==null?void 0:r.totalLength)??0)*e.activeStrokeProgress},ue=e=>{if(!h)return e.cursorTangent;const t=de(e),r=[...h.boundaries].reverse().find(s=>s.previousSegment!==s.nextSegment&&s.turnAngleDegrees>=150&&t>=s.overallDistance-ae&&t-s.overallDistance<se);return(r==null?void 0:r.outgoingTangent)??e.cursorTangent},ge=()=>{if(!i||!v)return;const e=i.getState(),t=ue(e),r=Math.atan2(t.y,t.x)*(180/Math.PI);v.setAttribute("transform",`translate(${e.cursorPoint.x}, ${e.cursorPoint.y}) rotate(${r})`),v.style.opacity=w?"0":"1";const s=new Set(e.completedStrokes);E.forEach((a,c)=>{const p=k[c]??0;if(s.has(c)){a.style.strokeDashoffset="0";return}if(c===e.activeStrokeIndex){const y=p*(1-e.activeStrokeProgress);a.style.strokeDashoffset=`${Math.max(0,y)}`;return}a.style.strokeDashoffset=`${p}`}),N(e.status==="complete")},_e=()=>{if(!R||w)return;q(),M();const e=new te(R,{speed:1.7,penUpSpeed:2.1,deferredDelayMs:150});w=!0,f.disabled=!0,f.textContent="Showing...";const t=performance.now(),r=s=>{const a=s-t,c=Math.min(a,e.totalDuration),p=e.getFrame(c),y=new Set(p.completedStrokes);if(T.forEach((S,m)=>{const $=x[m]??.001;if(y.has(m)){S.style.strokeDashoffset="0";return}if(m===p.activeStrokeIndex){const n=$*(1-p.activeStrokeProgress);S.style.strokeDashoffset=`${Math.max(0,n)}`;return}S.style.strokeDashoffset=`${$}`}),d&&(d.setAttribute("cx",p.point.x.toFixed(2)),d.setAttribute("cy",p.point.y.toFixed(2)),d.style.opacity=a<=e.totalDuration+O?"1":"0"),a<e.totalDuration+O){A=requestAnimationFrame(r);return}M(),q()};A=requestAnimationFrame(r),g()},he=(e,t,r,s)=>{const a=Y(e);h=a,i=new ee(a,{startTolerance:P,hitTolerance:P}),u=null;const c=e.strokes.filter(n=>n.type!=="lift"),p=c.map(n=>`<path class="writing-app__stroke-bg" d="${C(n.curves)}"></path>`).join(""),y=c.map(n=>`<path class="writing-app__stroke-trace" d="${C(n.curves)}"></path>`).join(""),S=c.map(n=>`<path class="writing-app__stroke-demo" d="${C(n.curves)}"></path>`).join(""),m=Math.abs(e.guides.baseline-e.guides.xHeight)/3,$=ne(a,{retraceTurns:{offset:Math.min(m*.24,13),stemLength:m*.36,head:{length:ie,width:ce,tipExtension:le}}}).map(n=>`
        <path
          class="writing-app__section-arrow writing-app__section-arrow--white"
          d="${oe(n.commands)}"
        ></path>
        ${n.head?`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white" points="${pe(n.head.polygon)}"></polygon>`:""}
      `).join("");o.setAttribute("viewBox",`0 0 ${t} ${r}`),o.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${t}" height="${r}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${e.guides.xHeight+s}"
      x2="${t}"
      y2="${e.guides.xHeight+s}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${e.guides.baseline+s}"
      x2="${t}"
      y2="${e.guides.baseline+s}"
    ></line>
    ${p}
    ${y}
    ${$}
    ${S}
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `,E=Array.from(o.querySelectorAll(".writing-app__stroke-trace")),T=Array.from(o.querySelectorAll(".writing-app__stroke-demo")),v=o.querySelector("#trace-cursor"),d=o.querySelector("#demo-nib"),k=E.map(n=>{const l=n.getTotalLength();return Number.isFinite(l)&&l>0?l:.001}),x=T.map(n=>{const l=n.getTotalLength();return Number.isFinite(l)&&l>0?l:.001}),E.forEach((n,l)=>{const _=k[l]??.001;n.style.strokeDasharray=`${_} ${_}`,n.style.strokeDashoffset=`${_}`}),T.forEach((n,l)=>{const _=x[l]??.001;n.style.strokeDasharray=`${_} ${_}`,n.style.strokeDashoffset=`${_}`}),d&&(d.style.opacity="0"),N(!1),g()},K=e=>{M(),U.textContent=e;const t=Z(e);R=t.path,he(t.path,t.width,t.height,t.offsetY)},Q=()=>{b=re(b),K(D[b]??D[0])},me=e=>{w||!i||u!==null||!i.beginAt(H(o,e))||(e.preventDefault(),u=e.pointerId,o.setPointerCapture(e.pointerId),g())},fe=e=>{w||!i||e.pointerId!==u||(e.preventDefault(),i.update(H(o,e)),g())},we=e=>{!i||e.pointerId!==u||(i.end(),o.hasPointerCapture(e.pointerId)&&o.releasePointerCapture(e.pointerId),u=null,g())},ye=e=>{e.pointerId===u&&(i==null||i.end(),o.hasPointerCapture(e.pointerId)&&o.releasePointerCapture(e.pointerId),u=null,g())};o.addEventListener("pointerdown",me);o.addEventListener("pointermove",fe);o.addEventListener("pointerup",we);o.addEventListener("pointercancel",ye);f.addEventListener("click",_e);B.addEventListener("click",Q);L.addEventListener("input",()=>{P=Number(L.value),G(),b>=0&&K(D[b]??D[0])});G();Q();
