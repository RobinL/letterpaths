import"./z-lower-print-bezier-ChiVQORi.js";import{a as b,b as c,C as x,l as h}from"./joiner-BUefx173.js";const y=document.querySelector("#app");if(!y)throw new Error("Missing #app element for letter gallery.");const o={xHeight:220,baseline:460},p="print",u=[{value:"pre-cursive",label:"Pre-cursive"},{value:"print",label:"Print"}],g=Array.from(new Set(b().map(e=>e.glyph.char.toLowerCase()).filter(e=>e.length===1))).sort(),n={x:52,y:44};y.innerHTML=`
  <div class="demo-page demo-page--gallery">
    <header class="demo-header">
      <div class="demo-header__title">
        <h1>Letter gallery</h1>
        <p>Each lowercase letter rendered on its own card with a switch between pre-cursive and print.</p>
      </div>
    </header>

    <section class="demo-gallery">
      <div class="demo-gallery__toolbar">
        <div class="demo-gallery__toolbar-copy">
          <div class="demo-gallery__meta">${g.length} lowercase letters</div>
        </div>

        <div class="demo-join__field">
          Letter style
          <div class="demo-join__segmented" role="radiogroup" aria-label="Letter style">
            ${u.map(e=>`
                  <label class="demo-join__segmented-option">
                    <input
                      class="demo-join__segmented-input"
                      type="radio"
                      name="gallery-style"
                      value="${e.value}"
                      ${e.value===p?"checked":""}
                    />
                    <span class="demo-join__segmented-label">${e.label}</span>
                  </label>
                `).join("")}
          </div>
        </div>
      </div>

      <div class="demo-gallery__grid" id="gallery-grid"></div>
    </section>
  </div>
`;const _=document.querySelector("#gallery-grid"),m=Array.from(document.querySelectorAll('input[name="gallery-style"]'));if(!_||m.length===0)throw new Error("Missing controls for letter gallery.");const v=()=>{var e;return((e=m.find(t=>t.checked))==null?void 0:e.value)??p},w=e=>{if(e.length===0)return"";const[t,...s]=e;let a=`M ${t.p0.x} ${t.p0.y} `;return[t,...s].forEach(l=>{a+=`C ${l.p1.x} ${l.p1.y} ${l.p2.x} ${l.p2.y} ${l.p3.x} ${l.p3.y} `}),a.trim()},$=(e,t,s)=>({...e,strokes:e.strokes.map(a=>({...a,curves:a.curves.map(l=>new x({x:l.p0.x+t,y:l.p0.y+s},{x:l.p1.x+t,y:l.p1.y+s},{x:l.p2.x+t,y:l.p2.y+s},{x:l.p3.x+t,y:l.p3.y+s}))})),bounds:{minX:e.bounds.minX+t,maxX:e.bounds.maxX+t,minY:e.bounds.minY+s,maxY:e.bounds.maxY+s}}),I=()=>{let e=Number.POSITIVE_INFINITY,t=Number.NEGATIVE_INFINITY,s=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;return u.forEach(({value:l})=>{g.forEach(d=>{const r=c(d,{style:l,targetGuides:o,letters:h});r.strokes.length!==0&&(e=Math.min(e,r.bounds.minX),t=Math.max(t,r.bounds.maxX),s=Math.min(s,r.bounds.minY,r.guides.xHeight),a=Math.max(a,r.bounds.maxY,r.guides.baseline))})}),!Number.isFinite(e)||!Number.isFinite(t)||!Number.isFinite(s)||!Number.isFinite(a)?{width:240,height:220,offsetX:0,offsetY:0}:{width:Math.ceil(t-e+n.x*2),height:Math.ceil(a-s+n.y*2),offsetX:n.x-e,offsetY:n.y-s}},i=I(),N=(e,t)=>{const s=c(e,{style:t,targetGuides:o,letters:h});if(s.strokes.length===0)return`
      <svg class="demo-gallery__svg" viewBox="0 0 240 220" aria-hidden="true">
        <rect class="demo-gallery__bg" x="0" y="0" width="240" height="220"></rect>
        <text class="demo-gallery__empty" x="120" y="116" text-anchor="middle">No path</text>
      </svg>
    `;const a=$(s,i.offsetX,i.offsetY),l=Math.max(16,Math.round((o.baseline-o.xHeight)*.1));return`
    <svg
      class="demo-gallery__svg"
      viewBox="0 0 ${i.width} ${i.height}"
      aria-hidden="true"
      style="--gallery-stroke-width: ${l}px"
    >
      <rect
        class="demo-gallery__bg"
        x="0"
        y="0"
        width="${i.width}"
        height="${i.height}"
      ></rect>
      <line
        class="demo-guide demo-guide--xheight"
        x1="0"
        y1="${s.guides.xHeight+i.offsetY}"
        x2="${i.width}"
        y2="${s.guides.xHeight+i.offsetY}"
      ></line>
      <line
        class="demo-guide demo-guide--baseline"
        x1="0"
        y1="${s.guides.baseline+i.offsetY}"
        x2="${i.width}"
        y2="${s.guides.baseline+i.offsetY}"
      ></line>
      ${a.strokes.map(d=>`<path class="demo-gallery__path" d="${w(d.curves)}"></path>`).join("")}
    </svg>
  `},f=()=>{const e=v();_.innerHTML=g.map(t=>`
        <article class="demo-gallery__card">
          <div class="demo-gallery__card-head">
            <span class="demo-gallery__letter">${t}</span>
            <span class="demo-gallery__style">${e}</span>
          </div>
          ${N(t,e)}
        </article>
      `).join("")};m.forEach(e=>{e.addEventListener("change",f)});f();
