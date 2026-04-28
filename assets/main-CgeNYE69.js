import"./modulepreload-polyfill-B5Qt9EMX.js";import"./joiner-CVeVmRQl.js";import{A as _}from"./animator-hV1LCJak.js";import{b,a as g,J as k}from"./shared-v9TOLZ3P.js";const $="letterpaths",S=900,A=r=>{const e=r.curves.reduce((t,a)=>t+a.length(),0);return Number.isFinite(e)&&e>0?e:.001},v=(r,e)=>Math.hypot(r.velocity.x,r.velocity.y)<=.001?e:Math.atan2(r.velocity.y,r.velocity.x)*(180/Math.PI),x=(r,e,t,a=1)=>{r.setAttribute("transform",`translate(${e.x} ${e.y}) rotate(${t})`),r.style.opacity=String(a)},D=(r,e)=>{const t=new Set(e.completedStrokes);r.forEach(({el:a,length:o},i)=>{if(t.has(i)){a.style.strokeDashoffset="0";return}if(i===e.activeStrokeIndex){a.style.strokeDashoffset=`${Math.max(0,o*(1-e.activeStrokeProgress))}`;return}a.style.strokeDashoffset=`${o}`})},m=(r,e)=>{r.forEach(({el:t})=>{t.style.strokeDashoffset="0"}),e.style.opacity="0"},P=()=>{const r=document.querySelector("[data-letterpaths-title]"),e=document.querySelector("[data-letterpaths-title-svg]");if(!r||!e)return;const t=b($,{style:"cursive",joinSpacing:k,keepInitialLeadIn:!0,keepFinalLeadOut:!0}),a=t.path.strokes.filter(s=>s.type!=="lift"),o=a.map(s=>`<path class="brand-title__stroke brand-title__stroke--bg" d="${g(s.curves)}"></path>`).join(""),i=a.map(s=>`<path class="brand-title__stroke brand-title__stroke--trace" d="${g(s.curves)}"></path>`).join("");e.setAttribute("viewBox",`0 0 ${t.width} ${t.height}`),e.innerHTML=`
    <line
      class="brand-title__guide brand-title__guide--midline"
      x1="0"
      y1="${t.path.guides.xHeight+t.offsetY}"
      x2="${t.width}"
      y2="${t.path.guides.xHeight+t.offsetY}"
    ></line>
    <line
      class="brand-title__guide brand-title__guide--baseline"
      x1="0"
      y1="${t.path.guides.baseline+t.offsetY}"
      x2="${t.width}"
      y2="${t.path.guides.baseline+t.offsetY}"
    ></line>
    ${o}
    ${i}
    <g class="brand-title__pen" data-letterpaths-title-pen>
      <circle class="brand-title__pen-bg" cx="0" cy="0" r="38"></circle>
      <polygon class="brand-title__pen-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `;const d=Array.from(e.querySelectorAll(".brand-title__stroke--trace")).map((s,c)=>{const n=A(a[c]??a[0]);return s.style.strokeDasharray=`${n} ${n}`,s.style.strokeDashoffset=`${n}`,{el:s,length:n}}),l=e.querySelector("[data-letterpaths-title-pen]");if(!l)return;r.classList.add("brand-title--ready");const p=new _(t.path,{speed:2.15,penUpSpeed:2.8,deferredDelayMs:120});if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){m(d,l);return}let u=performance.now(),h=0;const y=s=>{const c=p.totalDuration+S,n=(s-u)%c;if(s-u>=c&&(u=s-n),n>=p.totalDuration){m(d,l),requestAnimationFrame(y);return}const f=p.getFrame(n);h=v(f,h),D(d,f),x(l,f.point,h,1),requestAnimationFrame(y)};requestAnimationFrame(y)};P();
