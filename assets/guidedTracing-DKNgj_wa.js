var ca=Object.defineProperty;var la=(e,t,n)=>t in e?ca(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var X=(e,t,n)=>la(e,typeof t!="symbol"?t+"":t,n);import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as da}from"./style-DW-mNVlM.js";import"./joiner-CVeVmRQl.js";import{A as ua}from"./animator-hV1LCJak.js";import{d as ga,a as pa,c as ha,b as Sa}from"./annotations-xxjps-9q.js";import{M as ma,d as fa,T as ya,c as _a,a as un,D as Jt,e as ba,W as Qt,g as gn}from"./shared-v9TOLZ3P.js";class wa{constructor(t,n={}){X(this,"path");X(this,"startTolerance");X(this,"hitTolerance");X(this,"maxAdvanceSamples");X(this,"advanceBias");X(this,"state");X(this,"currentSampleIndex");this.path=t,this.startTolerance=n.startTolerance??60,this.hitTolerance=n.hitTolerance??70,this.maxAdvanceSamples=n.maxAdvanceSamples??50,this.advanceBias=n.advanceBias??.4,this.currentSampleIndex=0,this.state=this.buildInitialState()}buildInitialState(){const t=this.path.strokes[0],n=t==null?void 0:t.samples[0];return{status:"idle",cursorPoint:n?{x:n.x,y:n.y}:{x:0,y:0},cursorTangent:(n==null?void 0:n.tangent)??{x:1,y:0},completedStrokes:[],activeStrokeIndex:0,activeStrokeProgress:0,isPenDown:!1}}getState(){return{...this.state}}getPath(){return this.path}beginAt(t){const{status:n,cursorPoint:a}=this.state;if(n!=="idle"&&n!=="await_pen_up"||Math.hypot(t.x-a.x,t.y-a.y)>this.startTolerance)return!1;const s=this.path.strokes[this.state.activeStrokeIndex];return s!=null&&s.isDot?(this.completeCurrentStroke(),!0):(this.state={...this.state,status:"tracing",isPenDown:!0},!0)}update(t){if(this.state.status!=="tracing")return;const n=this.path.strokes[this.state.activeStrokeIndex];if(!n)return;const a=n.samples,r=this.currentSampleIndex,s=Math.min(r+this.maxAdvanceSamples,a.length-1);let i=r,l=1/0,m=1/0;for(let y=r;y<=s;y++){const f=a[y];if(!f)continue;const p=Math.hypot(t.x-f.x,t.y-f.y),_=(y-r)*this.advanceBias,h=p+_;h<l&&(l=h,m=p,i=y)}if(m>this.hitTolerance)return;const g=a[i];g&&(this.currentSampleIndex=i,this.state={...this.state,cursorPoint:{x:g.x,y:g.y},cursorTangent:g.tangent,activeStrokeProgress:n.totalLength>0?g.distanceAlongStroke/n.totalLength:1}),i>=a.length-1&&this.completeCurrentStroke()}end(){const t=this.state.status==="tracing"?"idle":this.state.status;this.state={...this.state,status:t,isPenDown:!1}}reset(){this.currentSampleIndex=0,this.state=this.buildInitialState()}completeCurrentStroke(){const t=[...this.state.completedStrokes,this.state.activeStrokeIndex],n=this.state.activeStrokeIndex+1;if(n>=this.path.strokes.length){this.state={...this.state,status:"complete",completedStrokes:t,activeStrokeProgress:1,isPenDown:!1};return}const a=this.path.strokes[n],r=a==null?void 0:a.samples[0];this.currentSampleIndex=0,this.state={...this.state,status:"await_pen_up",completedStrokes:t,activeStrokeIndex:n,activeStrokeProgress:0,cursorPoint:r?{x:r.x,y:r.y}:this.state.cursorPoint,cursorTangent:(r==null?void 0:r.tangent)??this.state.cursorTangent,isPenDown:!1}}}const At="/letterpaths/assets/eagle_fly-B8oRwixn.png",xa="/letterpaths/assets/eagle_stand-BUSO6ROy.png",en="/letterpaths/assets/chomp-DH3WDSaP.mp3",ka="/letterpaths/assets/body-CgvmrS6c.png",va="/letterpaths/assets/body_bulge-3F7a2BaQ.png",Ea="/letterpaths/assets/background-BdaS-6aw.png",Aa="/letterpaths/assets/snake_facing_camera_angry-2NiXjJ76.png",Ia="/letterpaths/assets/snake_facing_camera_happy-qG4Zd2aU.png",Da="/letterpaths/assets/head_alt-pvLv00oI.png",Pa="/letterpaths/assets/head-CeHhv_vT.png",Ta="/letterpaths/assets/tail-Wt4Hi91f.png",Ma="/letterpaths/assets/sand_moving_1-KzDrd5np.mp3",La="/letterpaths/assets/sand_moving_2-sOe4GNi-.mp3",Ca="/letterpaths/assets/sand_moving_3-Jh4tCIP3.mp3",Na="/letterpaths/assets/sand_moving_4-B3GK1boP.mp3",Ra="/letterpaths/assets/theme_park_bg-DOpd8-Mt.png",Oa="/letterpaths/assets/carriage_1-DC6yaVQC.png",Ha="/letterpaths/assets/carriage_1_upside_down-BG5QUuxQ.png",Fa="/letterpaths/assets/carriage_2-Bq0wDmtr.png",Ga="/letterpaths/assets/carriage_2_upside_down-_Cm6VEPW.png",Qe="/letterpaths/assets/front-DZihS2IP.png",$a="/letterpaths/assets/front_upside_down-Z8CFqsTv.png",Ba="/letterpaths/assets/rear-BWZZF1JA.png",qa="/letterpaths/assets/rear_upside_down-DZY4fDcB.png",Ua="/letterpaths/assets/rollercoaster_scream-Cnz9sZHr.mp3",Va="/letterpaths/assets/rollercoaster_track_1-CQOQytx_.mp3",Wa="/letterpaths/assets/rollercoaster_track_2-DRqX5yMO.mp3",tn="G-94373ZKHEE",Ka=new Set(["localhost","127.0.0.1"]),Ya=()=>{if(Ka.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",tn);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${tn}`,document.head.append(e)},Za=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/guided_tracing/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register guided tracing service worker.",t)})},Xa="🍎",Rt=150,Ot="plain",Ht=.7,za=76,nn=115,ja=.25,Ja=.3,Qa=.12,er=.42,It=10,tr=220,pn=700,nr=6,ar=44,rr=56,sr={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},Dt={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},ir={...Dt,height:Dt.height*(209/431/(160/435))},or={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},cr={width:69,height:49,anchorX:.5,anchorY:.62,rotationOffset:0},Pt={width:94,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},lr={...Pt,height:79.3},tt={width:100,height:82.8,anchorX:.5,anchorY:.54,rotationOffset:0},dr={...tt,height:87.9},ur={...tt,height:87.7},hn={width:92,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},gr={...hn,height:79.9},pr={width:76,height:76,anchorX:.5,anchorY:.5,rotationOffset:0},hr={width:44,height:44,anchorX:.5,anchorY:.5,rotationOffset:0},Sr={width:1,height:1,anchorX:.5,anchorY:.5,rotationOffset:0},mr={width:64,height:64,anchorX:.5,anchorY:.5,rotationOffset:0},Sn=700,fr=260,mn=800,yr=18,_r=.72,ie={width:200,height:106},nt={width:128,height:141,anchorX:.5,anchorY:1},br=[Ma,La,Ca,Na],wr=[Va,Wa],xr=[],lt=e=>`data:image/svg+xml,${encodeURIComponent(e)}`,an=lt('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'),rn=lt(`
  <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76">
    <g transform="translate(38 38)">
      <circle cx="0" cy="0" r="36" fill="#f26d4f" stroke="rgba(35, 49, 61, 0.22)" stroke-width="3"/>
      <polygon points="18,0 -12,-14 -6,0 -12,14" fill="#ffffff" stroke="rgba(35, 49, 61, 0.08)" stroke-width="1.5"/>
    </g>
  </svg>
`),kr=lt(`
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="13" fill="#95ddff" stroke="#4a90e2" stroke-width="4"/>
  </svg>
`),sn=lt(`
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="26" fill="#ffffff" stroke="#f26d4f" stroke-width="6"/>
    <circle cx="32" cy="32" r="9" fill="#f26d4f"/>
  </svg>
`),_t=26,bt=22,wt=11,vr=250,Er=.5,Ar=12,Ir=2,I={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},Dr=["word","skin","theme","tolerance","animationSpeed","turnRadius","offsetArrowLanes","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","includeInitialLeadIn","includeFinalLeadOut"],Ft={plain:{id:"plain",boardImage:an,boardOverlay:"linear-gradient(180deg, rgba(255, 252, 244, 0.96), rgba(255, 248, 235, 0.98))",instruction:"Trace the letters.",successEyebrow:"Trace complete!",successCopy:"All the checkpoints are complete.",soundEffects:{chompSrc:en,chompVolume:0,moveSrcs:xr,moveVolume:0,moveChance:0},segmentSpacing:64,deferredSegmentSpacing:44,head:{href:rn,chewHref:rn,metrics:pr},bodySprites:[{id:"plain-marker",href:kr,metrics:hr}],tail:{href:an,metrics:Sr},dotTarget:{happyHref:sn,angryHref:sn,metrics:mr}},classic:{id:"classic",boardImage:Ea,boardOverlay:"linear-gradient(180deg, rgba(255, 252, 244, 0.72), rgba(255, 248, 235, 0.86))",instruction:"Drag the snake around the letters.",successEyebrow:"Snake fed!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:en,chompVolume:Ja,moveSrcs:br,moveVolume:Qa,moveChance:er},segmentSpacing:za,deferredSegmentSpacing:ar,head:{href:Pa,chewHref:Da,metrics:sr},bodySprites:[{id:"body",href:ka,metrics:Dt},{id:"body-bulge",href:va,metrics:ir}],tail:{href:Ta,metrics:or},dotTarget:{happyHref:Ia,angryHref:Aa,metrics:cr}},themePark:{id:"themePark",boardImage:Ra,boardOverlay:"linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 249, 230, 0.78))",instruction:"Drag the rollercoaster around the letters.",successEyebrow:"Ride complete!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:Ua,chompVolume:.2,moveSrcs:wr,moveVolume:.1,moveChance:.36},segmentSpacing:106,deferredSegmentSpacing:rr,head:{href:Qe,chewHref:Qe,metrics:Pt,upsideDown:{href:$a,metrics:lr}},bodySprites:[{id:"carriage-1",href:Oa,metrics:tt,upsideDown:{href:Ha,metrics:dr}},{id:"carriage-2",href:Fa,metrics:tt,upsideDown:{href:Ga,metrics:ur}}],tail:{href:Ba,metrics:hn,upsideDown:{href:qa,metrics:gr}},dotTarget:{happyHref:Qe,angryHref:Qe,metrics:Pt}}};let U=Ot;const v=()=>Ft[U],O=()=>U==="plain",Ze=()=>v().segmentSpacing,Gt=e=>{var a;const t=((a=u==null?void 0:u.strokes[e.activeStrokeIndex])==null?void 0:a.totalLength)??0,n=t>0?t/3:Number.POSITIVE_INFINITY;return Math.max(1,Math.min(v().deferredSegmentSpacing,n))},at=document.querySelector("#app");if(!at)throw new Error("Missing #app element for guided tracing app.");Ya();Za();at.innerHTML=`
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow" id="snake-instruction">Drag the snake around the letters.</p>
            <label class="writing-app__word-input-label" for="word-input">
              <span>Enter word</span>
              <input
                class="writing-app__word-input"
                id="word-input"
                type="text"
                value="zephyr"
                placeholder="zephyr"
                spellcheck="false"
                autocomplete="off"
              />
            </label>
          </div>
          <div class="writing-app__topbar-actions">
            <button class="writing-app__button" id="show-me-button" type="button">
              Animate
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
                    min="${ma}"
                    max="${fa}"
                    step="${ya}"
                    value="${Rt}"
                  />
                </label>
                <label class="writing-app__settings-field" for="turn-radius-slider">
                  <span class="writing-app__settings-label">
                    Turn radius
                    <span class="writing-app__tolerance-value" id="turn-radius-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="turn-radius-slider"
                    type="range"
                    min="0"
                    max="48"
                    step="1"
                    value="13"
                  />
                </label>
                <label class="writing-app__settings-field" for="animation-speed-slider">
                  <span class="writing-app__settings-label">
                    Animation speed
                    <span class="writing-app__tolerance-value" id="animation-speed-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="animation-speed-slider"
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.05"
                    value="${Ht}"
                  />
                </label>
                <label class="writing-app__settings-toggle" for="offset-arrow-lanes">
                  <input
                    id="offset-arrow-lanes"
                    type="checkbox"
                  />
                  <span>Offset lanes</span>
                </label>
                <label class="writing-app__settings-field" for="skin-select">
                  <span class="writing-app__settings-label">Skin</span>
                  <select class="writing-app__settings-select" id="skin-select">
                    <option value="plain">Plain</option>
                    <option value="classic">Snake</option>
                    <option value="themePark">Rollercoaster</option>
                  </select>
                </label>
                <label class="writing-app__settings-field" for="target-bend-rate-slider">
                  <span class="writing-app__settings-label">
                    Target maximum bend rate
                    <span class="writing-app__tolerance-value" id="target-bend-rate-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="target-bend-rate-slider"
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value="${I.targetBendRate}"
                  />
                </label>
                <label class="writing-app__settings-field" for="min-sidebearing-gap-slider">
                  <span class="writing-app__settings-label">
                    Minimum sidebearing gap
                    <span class="writing-app__tolerance-value" id="min-sidebearing-gap-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="min-sidebearing-gap-slider"
                    type="range"
                    min="-300"
                    max="200"
                    step="5"
                    value="${I.minSidebearingGap}"
                  />
                </label>
                <label class="writing-app__settings-field" for="bend-search-min-sidebearing-gap-slider">
                  <span class="writing-app__settings-label">
                    Search minimum sidebearing gap
                    <span class="writing-app__tolerance-value" id="bend-search-min-sidebearing-gap-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="bend-search-min-sidebearing-gap-slider"
                    type="range"
                    min="-300"
                    max="200"
                    step="5"
                    value="${I.bendSearchMinSidebearingGap}"
                  />
                </label>
                <label class="writing-app__settings-field" for="bend-search-max-sidebearing-gap-slider">
                  <span class="writing-app__settings-label">
                    Search maximum sidebearing gap
                    <span class="writing-app__tolerance-value" id="bend-search-max-sidebearing-gap-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="bend-search-max-sidebearing-gap-slider"
                    type="range"
                    min="-100"
                    max="300"
                    step="5"
                    value="${I.bendSearchMaxSidebearingGap}"
                  />
                </label>
                <label class="writing-app__settings-field" for="exit-handle-scale-slider">
                  <span class="writing-app__settings-label">
                    p0-p1 handle scale
                    <span class="writing-app__tolerance-value" id="exit-handle-scale-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="exit-handle-scale-slider"
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value="${I.exitHandleScale}"
                  />
                </label>
                <label class="writing-app__settings-field" for="entry-handle-scale-slider">
                  <span class="writing-app__settings-label">
                    p2-p3 handle scale
                    <span class="writing-app__tolerance-value" id="entry-handle-scale-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="entry-handle-scale-slider"
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value="${I.entryHandleScale}"
                  />
                </label>
                <label class="writing-app__settings-toggle" for="include-initial-lead-in">
                  <input
                    id="include-initial-lead-in"
                    type="checkbox"
                    checked
                  />
                  <span>Initial lead-in</span>
                </label>
                <label class="writing-app__settings-toggle" for="include-final-lead-out">
                  <input
                    id="include-final-lead-out"
                    type="checkbox"
                    checked
                  />
                  <span>Final lead-out</span>
                </label>
              </div>
            </details>
          </div>
        </header>

        <svg
          class="writing-app__svg"
          id="trace-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting guided tracing area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow" id="success-eyebrow">Snake fed!</p>
            <p class="writing-app__success-copy" id="score-summary"></p>
            <div class="writing-app__success-actions">
              <button
                class="writing-app__button writing-app__button--secondary writing-app__button--next"
                id="next-word-button"
                type="button"
              >
                Next random word
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
`;const Oe=document.querySelector("#word-input"),fn=document.querySelector("#snake-instruction"),yn=document.querySelector("#success-eyebrow"),_n=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),j=document.querySelector("#show-me-button"),Me=document.querySelector("#settings-menu"),He=document.querySelector("#tolerance-slider"),bn=document.querySelector("#tolerance-value"),Fe=document.querySelector("#turn-radius-slider"),wn=document.querySelector("#turn-radius-value"),Ge=document.querySelector("#animation-speed-slider"),xn=document.querySelector("#animation-speed-value"),rt=document.querySelector("#offset-arrow-lanes"),$e=document.querySelector("#skin-select"),Be=document.querySelector("#target-bend-rate-slider"),kn=document.querySelector("#target-bend-rate-value"),qe=document.querySelector("#min-sidebearing-gap-slider"),vn=document.querySelector("#min-sidebearing-gap-value"),Ue=document.querySelector("#bend-search-min-sidebearing-gap-slider"),En=document.querySelector("#bend-search-min-sidebearing-gap-value"),Ve=document.querySelector("#bend-search-max-sidebearing-gap-slider"),An=document.querySelector("#bend-search-max-sidebearing-gap-value"),We=document.querySelector("#exit-handle-scale-slider"),In=document.querySelector("#exit-handle-scale-value"),Ke=document.querySelector("#entry-handle-scale-slider"),Dn=document.querySelector("#entry-handle-scale-value"),st=document.querySelector("#include-initial-lead-in"),it=document.querySelector("#include-final-lead-out"),Pn=document.querySelector("#success-overlay"),Tn=document.querySelector("#next-word-button");if(!Oe||!fn||!yn||!_n||!d||!j||!Me||!He||!bn||!Fe||!wn||!Ge||!xn||!rt||!$e||!Be||!kn||!qe||!vn||!Ue||!En||!Ve||!An||!We||!In||!Ke||!Dn||!st||!it||!Pn||!Tn)throw new Error("Missing elements for guided tracing app.");const Mn=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,t=""]=e.step.split(".");return t.length},Ln=(e,t)=>{const n=Number(e.min),a=Number(e.max),r=e.step==="any"?Number.NaN:Number(e.step),s=Number.isFinite(n)?n:0;let i=t;return Number.isFinite(n)&&(i=Math.max(n,i)),Number.isFinite(a)&&(i=Math.min(a,i)),Number.isFinite(r)&&r>0&&(i=s+Math.round((i-s)/r)*r),Number.isFinite(n)&&(i=Math.max(n,i)),Number.isFinite(a)&&(i=Math.min(a,i)),Number(i.toFixed(Mn(e)))},B=(e,t)=>{const n=Ln(e,t);return e.value=n.toFixed(Mn(e)),n},xt=(e,t)=>{const n=e.get(t);if(n===null)return null;const a=n.trim().toLowerCase();return["1","true","yes","on"].includes(a)?!0:["0","false","no","off"].includes(a)?!1:null},q=(e,t,n)=>{const a=e.get(t);if(a===null)return null;const r=Number(a);return Number.isFinite(r)?Ln(n,r):null},Cn=e=>{const t=e.get("skin")??e.get("theme");if(t===null)return null;const n=t.trim().toLowerCase();return n==="plain"?"plain":["snake","classic"].includes(n)?"classic":["rollercoaster","themepark","theme-park","theme_park"].includes(n)?"themePark":null},x=()=>{const e=new URL(window.location.href);Dr.forEach(a=>{e.searchParams.delete(a)}),M!=="zephyr"&&e.searchParams.set("word",M),U!==Ot&&e.searchParams.set("skin",U==="themePark"?"rollercoaster":U),H!==Rt&&e.searchParams.set("tolerance",String(H)),F!==Ht&&e.searchParams.set("animationSpeed",String(F)),G!==13&&e.searchParams.set("turnRadius",String(G)),W!==!0&&e.searchParams.set("offsetArrowLanes",W?"1":"0"),c.targetBendRate!==I.targetBendRate&&e.searchParams.set("targetBendRate",String(c.targetBendRate)),c.minSidebearingGap!==I.minSidebearingGap&&e.searchParams.set("minSidebearingGap",String(c.minSidebearingGap)),c.bendSearchMinSidebearingGap!==I.bendSearchMinSidebearingGap&&e.searchParams.set("bendSearchMinSidebearingGap",String(c.bendSearchMinSidebearingGap)),c.bendSearchMaxSidebearingGap!==I.bendSearchMaxSidebearingGap&&e.searchParams.set("bendSearchMaxSidebearingGap",String(c.bendSearchMaxSidebearingGap)),c.exitHandleScale!==I.exitHandleScale&&e.searchParams.set("exitHandleScale",String(c.exitHandleScale)),c.entryHandleScale!==I.entryHandleScale&&e.searchParams.set("entryHandleScale",String(c.entryHandleScale)),pe!==!0&&e.searchParams.set("includeInitialLeadIn",pe?"1":"0"),he!==!0&&e.searchParams.set("includeFinalLeadOut",he?"1":"0");const t=`${e.pathname}${e.search}${e.hash}`,n=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==n&&window.history.replaceState(null,"",t)};let $t=-1,M="zephyr",V=null,o=null,L=null,Y=null,kt=!1,le=[],xe=[],oe=null,Le=null,ee=null,be=null,E=!1,J=!1,H=Rt,F=Ht,G=13,W=!1,c={...I},pe=!0,he=!0,ke=[],Xe=[],ot=[],k=[],b=1,ce=null,Nn=1600,dt=0,u=null,Se=[],R=null,de=null,ct=null,ut=[],ue=null,P=null,Ce=null,Q=null,Ne=null,T=[],K=0,Ye=0,ve=0,gt=0,ne=[],we=!1,te=null,S="hidden",ae=null,ge=null,z=0,ze=!1,C=!1,_e=null,on=null,De=[],Tt=!1,et=null,cn=null,Pe=[],Mt=!1,Lt=-1,Te=Number.POSITIVE_INFINITY;const Rn=()=>{bn.textContent=`${H}px`},On=()=>{wn.textContent=`${G}px`},Hn=()=>{xn.textContent=`${F.toFixed(2)}x`},fe=()=>{kn.textContent=`${c.targetBendRate}`,vn.textContent=`${c.minSidebearingGap}`,En.textContent=`${c.bendSearchMinSidebearingGap}`,An.textContent=`${c.bendSearchMaxSidebearingGap}`,In.textContent=c.exitHandleScale.toFixed(2),Dn.textContent=c.entryHandleScale.toFixed(2)},Pr=()=>{Oe.value=M,$e.value=U,H=B(He,H),F=B(Ge,F),G=B(Fe,G),W=!!W,rt.checked=W,c={targetBendRate:B(Be,c.targetBendRate),minSidebearingGap:B(qe,c.minSidebearingGap),bendSearchMinSidebearingGap:B(Ue,c.bendSearchMinSidebearingGap),bendSearchMaxSidebearingGap:B(Ve,c.bendSearchMaxSidebearingGap),exitHandleScale:B(We,c.exitHandleScale),entryHandleScale:B(Ke,c.entryHandleScale)},st.checked=pe,it.checked=he},$=()=>{M&&ft(M,$t)},Fn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),Tr=()=>{const e=new URLSearchParams(window.location.search),t=e.get("word");t!==null&&(M=Fn(t)),U=Cn(e)??U,H=q(e,"tolerance",He)??H,F=q(e,"animationSpeed",Ge)??F,G=q(e,"turnRadius",Fe)??G,W=xt(e,"offsetArrowLanes")??W,c={targetBendRate:q(e,"targetBendRate",Be)??c.targetBendRate,minSidebearingGap:q(e,"minSidebearingGap",qe)??c.minSidebearingGap,bendSearchMinSidebearingGap:q(e,"bendSearchMinSidebearingGap",Ue)??c.bendSearchMinSidebearingGap,bendSearchMaxSidebearingGap:q(e,"bendSearchMaxSidebearingGap",Ve)??c.bendSearchMaxSidebearingGap,exitHandleScale:q(e,"exitHandleScale",We)??c.exitHandleScale,entryHandleScale:q(e,"entryHandleScale",Ke)??c.entryHandleScale},pe=xt(e,"includeInitialLeadIn")??pe,he=xt(e,"includeFinalLeadOut")??he,Pr(),Rn(),Hn(),On(),fe(),Gn(),x()},Gn=()=>{const e=v();at.style.setProperty("--snake-board-image",`url("${e.boardImage}")`),at.style.setProperty("--snake-board-overlay",e.boardOverlay),fn.textContent=e.instruction,yn.textContent=e.successEyebrow,$e.value=e.id},Bt=()=>v().soundEffects,$n=()=>{const e=v(),t=e.soundEffects;return et&&cn===e.id||(et=t.moveSrcs.map(n=>{const a=new Audio(n);return a.preload="auto",a.volume=t.moveVolume,a}),cn=e.id,Mt=!1),et},Bn=()=>{const e=v(),t=e.soundEffects;return _e&&on===e.id||(_e=new Audio(t.chompSrc),_e.preload="auto",_e.volume=t.chompVolume,on=e.id,Tt=!1),_e},Mr=()=>{const e=Bn();Tt||(e.load(),Tt=!0)},Lr=()=>{const e=$n();Mt||(e.forEach(t=>{t.load()}),Mt=!0)},Cr=()=>{const e=Bt(),t=Bn(),n=t.currentSrc||t.src;if(!n)return;const a=new Audio(n);a.preload="auto",a.currentTime=0,a.volume=e.chompVolume,De.push(a),a.addEventListener("ended",()=>{De=De.filter(r=>r!==a)}),a.addEventListener("error",()=>{De=De.filter(r=>r!==a)}),a.play().catch(()=>{})},Nr=()=>{const e=Bt(),t=$n(),n=t[Math.floor(Math.random()*t.length)],a=(n==null?void 0:n.currentSrc)||(n==null?void 0:n.src);if(!a)return;const r=new Audio(a);r.preload="auto",r.currentTime=0,r.volume=e.moveVolume,Pe.push(r),r.addEventListener("ended",()=>{Pe=Pe.filter(s=>s!==r)}),r.addEventListener("error",()=>{Pe=Pe.filter(s=>s!==r)}),r.play().catch(()=>{})},pt=()=>{const e=b>0?b-1:-1,t=e>=0?k[e]:null;Lt=e,Te=t?t.startDistance+Ze():Number.POSITIVE_INFINITY},Rr=e=>{if(!e.isPenDown||E||C)return;const t=b>0?b-1:-1,n=t>=0?k[t]:null;if(!n){Te=Number.POSITIVE_INFINITY,Lt=t;return}t!==Lt&&pt();const a=Ie(e);let r=!1;for(;a>=Te&&Te<=n.endDistance;)Math.random()<Bt().moveChance&&(r=!0),Te+=Ze();r&&Nr()},Ee=()=>{const e=E;Xe.forEach(t=>{const n=ke[Number(t.dataset.fruitIndex)],a=e||!n||n.captured||n.sectionIndex>=b;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",a)}),_n.textContent=ke.length===0?"Nice tracing.":v().successCopy},me=e=>{Pn.hidden=!e},qn=()=>{const e=o==null?void 0:o.getState();if(!((e==null?void 0:e.status)!=="complete"||!we)){if(ne.length>0){me(!1);return}me(!0)}},qt=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},Ut=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Or=e=>(e%360+360)%360,Hr=e=>{const t=Or(e);return t>90&&t<270},vt=(e,t)=>!e.upsideDown||!Hr(t+e.metrics.rotationOffset)?e:e.upsideDown,Fr=e=>{const t=e.querySelector(".writing-app__snake-head"),n=(t==null?void 0:t.querySelector("image"))??null,a=e.querySelector(".writing-app__snake-tail"),r=Array.from(e.querySelectorAll(".writing-app__snake-body")).sort((s,i)=>Number(s.dataset.snakeBodyIndex)-Number(i.dataset.snakeBodyIndex));return!t||!n||!a?null:{layerEl:e,headEl:t,headImageEl:n,bodyEls:r,tailEl:a}},Gr=()=>!R||!de||!ct||!ue?null:{layerEl:R,headEl:de,headImageEl:ct,bodyEls:ut,tailEl:ue},$r=e=>{e.removeAttribute("id"),e.querySelectorAll("[id]").forEach(t=>{t.removeAttribute("id")})},Vt=()=>{ze=!1,C=!1},Un=()=>{if(!C||!ze||L===null||!Y||!o)return!1;const e=o.getState();return e.status==="tracing"||o.beginAt(e.cursorPoint)?(Vt(),o.update(Y),w(),!0):!1},re=e=>(u==null?void 0:u.strokes[e.activeStrokeIndex])??null,Br=e=>Se[e.activeStrokeIndex]??null,qr=e=>{const t=u==null?void 0:u.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ie=e=>{var n;if(!u)return 0;if(e.status==="complete")return dt;let t=0;for(let a=0;a<e.activeStrokeIndex;a+=1)t+=((n=u.strokes[a])==null?void 0:n.totalLength)??0;return t+qr(e)},Ur=e=>{const t=u;return t?e.isPenDown&&e.activeStrokeIndex>=0?Ie({status:"tracing",activeStrokeIndex:e.activeStrokeIndex,activeStrokeProgress:e.activeStrokeProgress}):e.completedStrokes.reduce((n,a)=>{var r;return n+(((r=t.strokes[a])==null?void 0:r.totalLength)??0)},0):0},Vr=e=>{if(!u)return e.cursorTangent;const t=Ie(e),n=[...u.boundaries].reverse().find(a=>a.previousSegment!==a.nextSegment&&a.turnAngleDegrees>=150&&t>=a.overallDistance-Ir&&t-a.overallDistance<Ar);return(n==null?void 0:n.outgoingTangent)??e.cursorTangent},Ae=e=>{var t;return((t=Br(e))==null?void 0:t.deferred)===!0},Ct=e=>{var t;return((t=Se[e.strokeIndex])==null?void 0:t.deferred)===!0},je=()=>{const e=b>0?b-1:-1;return e>=0?k[e]??null:null},Wt=(e,t,n)=>{const a=Math.max(0,Math.floor(e/n)),r=Math.min(t,a);return{bodyCount:r,showTail:e>=(r+1)*n}},Vn=e=>{var t;return E||e.status==="complete"||!Ae(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=re(e))==null?void 0:t.isDot)===!0}},Wr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===ae&&((n=re(t))==null?void 0:n.isDot)===!0&&S!=="hidden"&&S!=="waiting"},D=()=>{te!==null&&(cancelAnimationFrame(te),te=null),S="hidden",ae=null,ge=null,P&&(P.style.opacity="0",P.classList.remove("writing-app__dot-snake--waiting")),Q&&(Q.style.opacity="0")},Kr=e=>({x:e.x,y:e.y-yr}),Yr=e=>({x:e.x,y:e.y+8}),Wn=(e=performance.now())=>{if(S==="hidden"||!ge)return null;const t=v(),n=Yr(ge),a=Kr(ge);if(S==="waiting")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!0};if(S==="eagle_in"){const l=Math.max(0,Math.min(1,(e-z)/Sn)),m=1-(1-l)*(1-l);return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:{x:a.x,y:-106+(a.y+ie.height)*m},eagleHref:At,eagleWidth:ie.width,eagleHeight:ie.height}}if(S==="eagle_stand")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:a,eagleHref:xa,eagleWidth:nt.width,eagleHeight:nt.height};const r=Math.max(0,Math.min(1,(e-z)/mn)),s=1-(1-r)*(1-r),i={x:a.x+(Nn+ie.width-a.x)*s,y:a.y+(-106-a.y)*s};return{snakePoint:{x:i.x,y:i.y+ie.height*.6},snakeHref:t.dotTarget.angryHref,snakeWobble:!1,eaglePoint:i,eagleHref:At,eagleWidth:ie.width,eagleHeight:ie.height}},Kn=()=>{var t;const e=o==null?void 0:o.getState();if(!(!o||!e)&&ae!==null&&e.activeStrokeIndex===ae&&(t=re(e))!=null&&t.isDot){o.beginAt(e.cursorPoint);const n=o.getState();na(Ie(n)),Qn(n)}},Zr=()=>{Kn(),D(),w()},Yn=e=>{if(te=null,!(S==="hidden"||S==="waiting")){if(S==="eagle_in"&&e-z>=Sn)S="eagle_stand",z=e;else if(S==="eagle_stand"&&e-z>=fr)S="eagle_out",z=e;else if(S==="eagle_out"&&e-z>=mn){Zr();return}w(),te=requestAnimationFrame(Yn)}},Xr=()=>{S==="waiting"&&(Kn(),S="eagle_in",z=performance.now(),te!==null&&cancelAnimationFrame(te),te=requestAnimationFrame(Yn),w())},zr=e=>{if(O()){D();return}const t=Vn(e);if(!(t!=null&&t.isDot)){if(S!=="hidden"&&S!=="waiting")return;D();return}ae!==t.strokeIndex?(D(),ae=t.strokeIndex,ge=t.point,S="waiting"):S==="waiting"&&(ge=t.point)},Zn=(e=performance.now())=>{if(O()){D();return}if(!P||!Ce||!Q||!Ne)return;const t=Wn(e);if(!t){P.style.opacity="0",P.classList.remove("writing-app__dot-snake--waiting"),Q.style.opacity="0";return}const n=v().dotTarget.metrics;if(P.style.opacity="1",P.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ce.setAttribute("href",t.snakeHref),Re(P,Ce,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},n.width,n.height,n.anchorX,n.anchorY,n.rotationOffset),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){Q.style.opacity="0";return}Ne.setAttribute("href",t.eagleHref),Re(Q,Ne,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,nt.anchorX,nt.anchorY,0)},jr=(e,t)=>{const n=Vn(t);if(!n)return!1;if(n.isDot){if(O()){const l=Math.max(34,v().head.metrics.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=l}if(S!=="waiting")return!1;const r=Wn();if(!r)return!1;const s=v().dotTarget.metrics,i=Math.max(s.width,s.height)*_r;return Math.hypot(e.x-r.snakePoint.x,e.y-r.snakePoint.y)<=i}const a=Math.max(34,v().head.metrics.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=a},ln=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let a=1;a<e.length;a+=1){const r=e[a-1],s=e[a];if(!r||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-r.distanceAlongStroke,l=i>0?(t-r.distanceAlongStroke)/i:0;return{x:r.x+(s.x-r.x)*l,y:r.y+(s.y-r.y)*l}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Jr=(e,t,n)=>{if(n<=t)return"";const a=[];let r=0;return e.strokes.forEach(s=>{const i=r,l=r+s.totalLength;if(r=l,n<i||t>l)return;const m=Math.max(0,t-i),g=Math.min(s.totalLength,n-i);if(g<m||s.samples.length===0)return;const y=[ln(s.samples,m),...s.samples.filter(h=>h.distanceAlongStroke>m&&h.distanceAlongStroke<g).map(h=>({x:h.x,y:h.y})),ln(s.samples,g)],f=y.filter((h,se)=>{const N=y[se-1];return!N||Math.hypot(h.x-N.x,h.y-N.y)>.01});if(f.length===0)return;const[p,..._]=f;a.push(`M ${p.x} ${p.y}`),_.forEach(h=>{a.push(`L ${h.x} ${h.y}`)})}),a.join(" ")},Xn=(e,t,n)=>{const a=e.strokes[t.strokeIndex],r=n[t.strokeIndex];return a!=null&&a.isDot&&r?un(r.curves):Jr(e,t.startDistance,t.endDistance)},Qr=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),es=e=>`writing-app__section-arrow writing-app__section-arrow--white writing-app__section-arrow--${e.kind}`,ts=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),ns=e=>e.kind==="draw-order-number"?"":`
    <path
      class="${es(e)}"
      d="${Sa(e.commands)}"
    ></path>
    ${ts(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white writing-app__section-arrowhead--${e.kind}" points="${Qr(t.polygon)}"></polygon>`).join("")}
  `,Je=()=>{if(!Le||!u||!V)return;const e=je();if(!e){ee=null,Le.innerHTML="";return}if(ee===e.index)return;const t=Math.abs(V.guides.baseline-V.guides.xHeight)/3,n=W?G:0,a=ha(u,{sections:[e],drawOrderNumbers:!1,startArrows:{length:t*.42,minLength:t*.18,offset:n,head:{length:_t,width:bt,tipExtension:wt}},midpointArrows:{density:vr,length:t*.36,offset:n,head:{length:_t,width:bt,tipExtension:wt}},turningPoints:{offset:G,stemLength:t*.36,head:{length:_t,width:bt,tipExtension:wt},groups:ot}}).filter(r=>r.kind!=="turning-point"||Math.abs(r.source.turnDistance-e.endDistance)<=Er);Le.innerHTML=a.map(ns).join(""),ee=e.index},zn=()=>{if(!oe||!u)return;const e=je();if(!e){oe.setAttribute("d",""),oe.style.opacity="0";return}oe.setAttribute("d",Xn(u,e,Se)),oe.style.opacity="1"},as=()=>{b=Math.min(b+1,k.length),aa(),Ee(),Je(),pt()},jn=(e,t)=>{const n=e.endDistance-e.startDistance;return t.startReason==="stroke-start"?.1:Math.min(8,Math.max(.1,n*.25))},Jn=(e,t,n={})=>{var i,l;const a=Ct(e),r=((i=u==null?void 0:u.strokes[e.strokeIndex])==null?void 0:i.isDot)===!0,s=((l=u==null?void 0:u.strokes[t.strokeIndex])==null?void 0:l.isDot)===!0;return(!a||!r)&&(mt(e.endPoint,e.endTangent,!0),Yt()),as(),St(t.startPoint,t.startTangent,!s,{preserveGrowth:n.preserveGrowth}),{nextSectionDeferred:Ct(t),nextSectionIsDot:s}},Qn=e=>{if(E||C||k.length<=b)return!1;const t=je(),n=k[b];if(!t||!n)return!1;const a=Ie(e),r=jn(t,n);if(a<t.endDistance-r)return!1;o==null||o.end();const{nextSectionDeferred:s}=Jn(t,n,{preserveGrowth:!0});return s?(Vt(),w(),!0):(C=!0,ze=n.startReason==="retrace-turn",Un(),w(),!0)},rs=(e,t)=>t.slice(0,-1).map(n=>({x:n.endPoint.x,y:n.endPoint.y,pathDistance:n.endDistance,emoji:Xa,captured:!1,sectionIndex:n.index})),ea=()=>{b=k.length>0?1:0,ee=null,Je(),ke.forEach(e=>{e.captured=!1}),Xe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),aa(),Ee()},Kt=()=>O()?0:ss(Ye),ss=e=>{const t=Math.max(3,Math.min(It,Math.floor(dt/nn)));return Math.min(t,1+Math.floor(e/nn))},Re=(e,t,n,a,r,s,i,l)=>{t.setAttribute("x",`${(-a*s).toFixed(2)}`),t.setAttribute("y",`${(-r*i).toFixed(2)}`),t.setAttribute("width",`${a}`),t.setAttribute("height",`${r}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+l).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},Et=(e,t,n=()=>null)=>{const a=e[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(t<0){const s=a.angle*Math.PI/180;return{...a,x:a.x+Math.cos(s)*t,y:a.y+Math.sin(s)*t,distance:t}}if(e.length<=1||t<=0)return{...a,distance:Math.max(0,t)};for(let s=1;s<e.length;s+=1){const i=e[s-1],l=e[s];if(!i||!l||t>l.distance)continue;const m=l.distance-i.distance,g=m>0?(t-i.distance)/m:0,y=i.x+(l.x-i.x)*g,f=i.y+(l.y-i.y)*g,p=n(t);return{x:y,y:f,angle:p??Ut({x:l.x-i.x,y:l.y-i.y}),distance:t,visible:l.visible}}return{...e[e.length-1]??a,distance:t}},ht=()=>{de==null||de.style.setProperty("opacity","0"),ue==null||ue.style.setProperty("opacity","0"),ut.forEach(e=>{e.style.opacity="0"})},ta=(e,t,n=performance.now())=>{if(t.trail.length===0){e.layerEl.style.opacity="0";return}e.layerEl.style.opacity="1";const a=v(),r=t.segmentSpacing??a.segmentSpacing,s=Wt(t.headDistance,t.bodyCount,r),i=s.bodyCount,l=A=>t.headDistance+t.retractionDistance-A,m=A=>Math.max(0,Math.min(t.headDistance,A)),g=A=>t.retractionDistance>0&&A>=t.headDistance-nr,y=Et(t.trail,Math.min(t.headDistance,l(0)),t.getAngleOverride),f=vt(a.head,t.headAngle);if(e.headImageEl.setAttribute("href",n<(t.chewUntil??0)&&f===a.head?a.head.chewHref:f.href),Re(e.headEl,e.headImageEl,{...y,angle:t.headAngle,visible:!g(l(0))},f.metrics.width,f.metrics.height,f.metrics.anchorX,f.metrics.anchorY,f.metrics.rotationOffset),a.id==="plain"){e.bodyEls.forEach(A=>{A.style.opacity="0"}),e.tailEl.style.opacity="0";return}e.bodyEls.forEach((A,Xt)=>{if(Xt>=i){A.style.opacity="0";return}const yt=A.querySelector("image");if(!yt)return;const sa=(Xt+1)*r,zt=l(sa);if(g(zt)){A.style.opacity="0";return}const jt=Et(t.trail,m(zt),t.getAngleOverride),ia=a.bodySprites.find(oa=>oa.id===A.dataset.snakeBodyVariant)??a.bodySprites[0]??Ft.classic.bodySprites[0],ye=vt(ia,jt.angle);yt.setAttribute("href",ye.href),Re(A,yt,jt,ye.metrics.width,ye.metrics.height,ye.metrics.anchorX,ye.metrics.anchorY,ye.metrics.rotationOffset)});const p=e.tailEl.querySelector("image");if(!p)return;if(t.showTail===!1){e.tailEl.style.opacity="0";return}const _=(i+1)*r,h=l(_);if(!s.showTail||g(h)){e.tailEl.style.opacity="0";return}const se=Et(t.trail,m(h),t.getAngleOverride),N=vt(a.tail,se.angle);p.setAttribute("href",N.href),Re(e.tailEl,p,se,N.metrics.width,N.metrics.height,N.metrics.anchorX,N.metrics.anchorY,N.metrics.rotationOffset)},Z=(e=performance.now())=>{var i,l;const t=Gr();if(!t)return;const n=o==null?void 0:o.getState();if(!O()&&(S!=="hidden"&&n!==void 0&&ae===n.activeStrokeIndex||n!==void 0&&((i=re(n))==null?void 0:i.isDot)===!0)){ht();return}const r=J||n!==void 0&&Ae(n)&&((l=re(n))==null?void 0:l.isDot)!==!0,s=r&&n!==void 0?Gt(n):Ze();ta(t,{trail:T,headDistance:K,headAngle:ve,bodyCount:O()?0:r?1:Kt(),segmentSpacing:s,retractionDistance:0,chewUntil:gt,showTail:!O()},e)},is=e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove(),ne=ne.filter(t=>t!==e),qn()},Nt=e=>{ta(e.parts,{trail:e.trail,headDistance:e.headDistance,headAngle:e.headAngle,bodyCount:e.bodyCount,segmentSpacing:e.segmentSpacing,retractionDistance:e.retractionDistance,showTail:e.showTail})},os=(e={})=>{if(O())return 0;const t=e.isShortDeferredSnake?1:Kt(),n=e.isShortDeferredSnake?Gt({activeStrokeIndex:(o==null?void 0:o.getState().activeStrokeIndex)??0}):Ze();return(Wt(K,t,n).bodyCount+1)*n/pn*1e3},cs=e=>{let t=null;const n=a=>{if(!ne.includes(e))return;if(t===null){t=a,e.animationFrameId=requestAnimationFrame(n);return}const r=Math.max(0,a-t)/1e3;t=a;const s=r*pn,i=e.retractionTarget-e.retractionDistance;if(Math.abs(i)<=s){e.retractionDistance=e.retractionTarget,Nt(e),is(e);return}e.retractionDistance+=Math.sign(i)*s,Nt(e),e.animationFrameId=requestAnimationFrame(n)};e.animationFrameId=requestAnimationFrame(n)},Yt=()=>{var g;if(O())return;const e=R==null?void 0:R.parentElement;if(!R||!e||T.length===0)return;const t=R.cloneNode(!0);$r(t),t.classList.add("writing-app__snake--retiring"),e.insertBefore(t,R);const n=Fr(t);if(!n){t.remove();return}const a=o==null?void 0:o.getState(),r=a!==void 0&&Ae(a)&&((g=re(a))==null?void 0:g.isDot)!==!0,s=r?1:Kt(),i=r?Gt(a):Ze(),l=Wt(K,s,i).bodyCount,m={parts:n,trail:T.map(y=>({...y})),headDistance:K,headAngle:ve,bodyCount:s,segmentSpacing:i,retractionDistance:0,retractionTarget:(l+1)*i,showTail:!0,animationFrameId:null};ne.push(m),Nt(m),cs(m)},Zt=()=>{ne.forEach(e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove()}),ne=[]},St=(e,t,n=!0,a={})=>{const r=qt(t),s=a.preserveGrowth?Ye:0;ve=Ut(r),T=[{x:e.x,y:e.y,angle:ve,distance:0,visible:n}],K=0,Ye=s,gt=0,ze=!1,C=!1,Z()},mt=(e,t,n)=>{const a=qt(t),r=Ut(a);ve=r;const s=T[T.length-1];if(!s){St(e,a,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?T[T.length-1]={...s,x:e.x,y:e.y,angle:r}:(T.push({x:e.x,y:e.y,angle:r,distance:s.distance+.001,visible:n}),K=s.distance+.001),Z();return}K=s.distance+i,Ye+=i,T.push({x:e.x,y:e.y,angle:r,distance:K,visible:n}),Z()},na=e=>{let t=!1;ke.forEach((n,a)=>{if(n.captured||n.sectionIndex>=b||e+.5<n.pathDistance)return;n.captured=!0;const r=Xe[a];r&&r.classList.add("writing-app__fruit--captured"),t=!0}),t&&(gt=performance.now()+tr,Cr(),Ee(),Z())},aa=()=>{if(!ce)return;const e=je();if(!e||Ct(e)){ce.classList.add("writing-app__boundary-star--hidden");return}ce.classList.remove("writing-app__boundary-star--hidden"),ce.setAttribute("x",`${e.endPoint.x}`),ce.setAttribute("y",`${e.endPoint.y}`)},ls=e=>{var t;if(E||na(Ie(e)),!(!E&&Qn(e))){if(Ae(e)&&((t=re(e))==null?void 0:t.isDot)===!0){Z();return}mt(e.cursorPoint,Vr(e),!0),!E&&e.isPenDown&&Rr(e)}},ra=()=>{be!==null&&(cancelAnimationFrame(be),be=null),E=!1,J=!1,j.disabled=!1,j.textContent="Animate",Ee(),Z(),w()},dn=()=>{o==null||o.reset(),L=null,Y=null,we=!1,me(!1),J=!1,D(),Zt(),le.forEach((t,n)=>{const a=xe[n]??.001;t.style.strokeDasharray=`${a} ${a}`,t.style.strokeDashoffset=`${a}`}),ze=!1,C=!1;const e=o==null?void 0:o.getState();e?St(e.cursorPoint,e.cursorTangent,!0):ht(),ea(),pt(),w()},w=()=>{kt||(kt=!0,requestAnimationFrame(()=>{kt=!1,ds()}))},ds=()=>{if(!o)return;const e=o.getState();zr(e),Zn(),zn(),Je();const t=new Set(e.completedStrokes);if(le.forEach((n,a)=>{const r=xe[a]??0;if(t.has(a)||Wr(a,e)){n.style.strokeDashoffset="0";return}if(a===e.activeStrokeIndex){const s=r*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${r}`}),e.status==="complete"){we||(we=!0,mt(e.cursorPoint,e.cursorTangent,!0),Yt()),ht(),qn();return}!E&&!C?ls(e):Z(),we=!1,me(!1)},us=(e,t)=>Math.hypot(e.velocity.x,e.velocity.y)<=.001?t:qt(e.velocity),gs=e=>{const t=new Set(e.completedStrokes);le.forEach((n,a)=>{const r=xe[a]??.001;if(t.has(a)){n.style.strokeDashoffset="0";return}if(a===e.activeStrokeIndex){const s=r*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${r}`})},ps=(e,t)=>{const n=Se[e.activeStrokeIndex],a=u==null?void 0:u.strokes[e.activeStrokeIndex];return!(n!=null&&n.deferred)||e.activeStrokeIndex<0||!e.isPenDown||O()?(J=!1,D(),!1):a!=null&&a.isDot?(J=!1,ae=e.activeStrokeIndex,ge=e.point,S="waiting",Zn(),!0):(D(),J=!0,!1)},hs=e=>{let t=!1;const n=Ur(e);for(;k.length>b;){const a=je(),r=k[b];if(!a||!r)break;const s=jn(a,r);if(n<a.endDistance-s)break;Jn(a,r,{preserveGrowth:!0}),t=!0}return t},Ss=()=>{if(!V||E)return;dn(),ra();const e=new ua(V,{speed:1.7*F,penUpSpeed:2.1*F,deferredDelayMs:150});E=!0,j.disabled=!0,j.textContent="Animating...",Ee(),Z();const t=performance.now();let n=(o==null?void 0:o.getState().cursorTangent)??{x:1,y:0},a=!1,r=e.totalDuration+Jt;const s=i=>{const l=i-t,m=Math.min(l,e.totalDuration),g=e.getFrame(m),y=us(g,n);hs(g);const f=ps(g);if(gs(g),g.isPenDown&&!f?(mt(g.point,y,!0),n=y):Z(),!a&&l>=e.totalDuration&&(a=!0,r=e.totalDuration+Math.max(Jt,os({isShortDeferredSnake:J})),D(),Yt(),ht()),l<r||ne.length>0){be=requestAnimationFrame(s);return}be=null,D(),E=!1,j.disabled=!1,j.textContent="Animate",Ee(),dn()};be=requestAnimationFrame(s),w()},ms=e=>{const t=e.bodySprites[0]??Ft.classic.bodySprites[0],n=e.bodySprites[1];return e.id==="themePark"&&e.bodySprites.length>1?e.bodySprites[Math.floor(Math.random()*e.bodySprites.length)]??t:!n||Math.random()>=ja?t:n},fs=(e,t,n,a)=>{Zt(),Nn=t;const r=v(),s=da(e);u=s,Se=e.strokes.filter(p=>p.type!=="lift"),dt=s.strokes.reduce((p,_)=>p+_.totalLength,0),ot=ga(s).groups,k=pa(s,{groups:ot}).sections,b=k.length>0?1:0,o=new wa(s,{startTolerance:H,hitTolerance:H}),L=null,ke=rs(s,k);const l=Se,m=k.map(p=>`<path class="writing-app__stroke-bg" d="${Xn(s,p,l)}"></path>`).join(""),g=l.map(p=>`<path class="writing-app__stroke-trace" d="${un(p.curves)}"></path>`).join(""),y=Array.from({length:It},(p,_)=>{const h=It-1-_,se=ms(r);return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${h}"
        data-snake-body-variant="${se.id}"
      >
        <image
          href="${se.href}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${t}" height="${n}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${e.guides.xHeight+a}"
      x2="${t}"
      y2="${e.guides.xHeight+a}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${e.guides.baseline+a}"
      x2="${t}"
      y2="${e.guides.baseline+a}"
    ></line>
    ${m}
    <path class="writing-app__stroke-next" id="next-section-stroke" d=""></path>
    ${g}
    <g class="writing-app__section-annotations" id="section-annotations"></g>
    <text
      class="writing-app__boundary-star"
      id="waypoint-star"
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="middle"
    >🍎</text>
    <g class="writing-app__snake" id="trace-snake">
      <g
        class="writing-app__snake-segment writing-app__snake-tail"
        id="snake-tail"
      >
        <image
          href="${r.tail.href}"
          preserveAspectRatio="none"
        ></image>
      </g>
      ${y}
      <g
        class="writing-app__snake-segment writing-app__snake-head"
        id="snake-head"
      >
        <image
          id="snake-head-image"
          href="${r.head.href}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${r.dotTarget.happyHref}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${At}"
        preserveAspectRatio="none"
      ></image>
    </g>
  `,le=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),oe=d.querySelector("#next-section-stroke"),Le=d.querySelector("#section-annotations"),ee=null,Xe=Array.from(d.querySelectorAll(".writing-app__fruit")),ce=d.querySelector("#waypoint-star"),R=d.querySelector("#trace-snake"),de=d.querySelector("#snake-head"),ct=d.querySelector("#snake-head-image"),ue=d.querySelector("#snake-tail"),ut=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((p,_)=>Number(p.dataset.snakeBodyIndex)-Number(_.dataset.snakeBodyIndex)),P=d.querySelector("#dot-snake"),Ce=d.querySelector("#dot-snake-image"),Q=d.querySelector("#dot-eagle"),Ne=d.querySelector("#dot-eagle-image"),xe=le.map(p=>{const _=p.getTotalLength();return Number.isFinite(_)&&_>0?_:.001}),le.forEach((p,_)=>{const h=xe[_]??.001;p.style.strokeDasharray=`${h} ${h}`,p.style.strokeDashoffset=`${h}`}),zn();const f=o.getState();St(f.cursorPoint,f.cursorTangent),D(),ea(),pt(),we=!1,me(!1),w()},ft=(e,t=-1)=>{if(ra(),M=Fn(e),$t=t,Oe.value=M,x(),M.length===0){V=null,o=null,u=null,L=null,Y=null,le=[],xe=[],oe=null,Le=null,ee=null,ke=[],Xe=[],ot=[],k=[],b=1,ce=null,dt=0,Se=[],R=null,de=null,ct=null,ut=[],ue=null,P=null,Ce=null,Q=null,Ne=null,T=[],K=0,Ye=0,ve=0,gt=0,Zt(),D(),d.innerHTML="",me(!1);return}try{const n=_a(M,{joinSpacing:c,keepInitialLeadIn:pe,keepFinalLeadOut:he});V=n.path,fs(n.path,n.width,n.height,n.offsetY)}catch{V=null,o=null,u=null,d.innerHTML="",me(!1)}},ys=(e,t=-1)=>(ft(e,t),V!==null),_s=()=>{const e=ba($t);ys(Qt[e]??Qt[0],e)},bs=e=>{if(E||!o||L!==null)return;const t=gn(d,e),n=o.getState(),a=re(n),r=C;if(Ae(n)&&!jr(t,n))return;if(Ae(n)&&(a!=null&&a.isDot)){e.preventDefault(),Xr();return}o.beginAt(t)&&(e.preventDefault(),L=e.pointerId,Y=t,Mr(),Lr(),r?Vt():r||(C=!1),d.setPointerCapture(e.pointerId),w())},ws=e=>{if(!(E||!o||e.pointerId!==L)){if(e.preventDefault(),Y=gn(d,e),C){Un(),w();return}o.update(Y),w()}},xs=e=>{!o||e.pointerId!==L||(o.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),L=null,Y=null,w())},ks=e=>{e.pointerId===L&&(o==null||o.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),L=null,Y=null,w())};d.addEventListener("pointerdown",bs);d.addEventListener("pointermove",ws);d.addEventListener("pointerup",xs);d.addEventListener("pointercancel",ks);j.addEventListener("click",Ss);He.addEventListener("input",()=>{H=Number(He.value),Rn(),x(),$()});Ge.addEventListener("input",()=>{F=Number(Ge.value),Hn(),x()});Fe.addEventListener("input",()=>{G=Number(Fe.value),On(),x(),ee=null,Je()});rt.addEventListener("change",()=>{W=rt.checked,x(),ee=null,Je()});$e.addEventListener("change",()=>{U=Cn(new URLSearchParams([["skin",$e.value]]))??Ot,Gn(),x(),$()});Be.addEventListener("input",()=>{c={...c,targetBendRate:Number(Be.value)},fe(),x(),$()});qe.addEventListener("input",()=>{c={...c,minSidebearingGap:Number(qe.value)},fe(),x(),$()});Ue.addEventListener("input",()=>{c={...c,bendSearchMinSidebearingGap:Number(Ue.value)},fe(),x(),$()});Ve.addEventListener("input",()=>{c={...c,bendSearchMaxSidebearingGap:Number(Ve.value)},fe(),x(),$()});We.addEventListener("input",()=>{c={...c,exitHandleScale:Number(We.value)},fe(),x(),$()});Ke.addEventListener("input",()=>{c={...c,entryHandleScale:Number(Ke.value)},fe(),x(),$()});st.addEventListener("change",()=>{pe=st.checked,x(),$()});it.addEventListener("change",()=>{he=it.checked,x(),$()});Tn.addEventListener("click",_s);Oe.addEventListener("input",()=>{ft(Oe.value)});document.addEventListener("pointerdown",e=>{if(!Me.open)return;const t=e.target;t instanceof Node&&Me.contains(t)||(Me.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(Me.open=!1)});Tr();ft(M);
