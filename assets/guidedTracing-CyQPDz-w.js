var Jn=Object.defineProperty;var Qn=(e,t,n)=>t in e?Jn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var V=(e,t,n)=>Qn(e,typeof t!="symbol"?t+"":t,n);import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as er}from"./style-Dpvqy9X2.js";import"./joiner-BRDm9gm1.js";import{A as tr}from"./animator-CLlGrx87.js";import{d as nr,a as rr,c as ar,b as sr}from"./annotations-xxjps-9q.js";import{M as ir,d as or,T as cr,c as lr,a as an,D as jt,e as dr,W as Kt,g as sn}from"./shared-CQFdVdxm.js";class ur{constructor(t,n={}){V(this,"path");V(this,"startTolerance");V(this,"hitTolerance");V(this,"maxAdvanceSamples");V(this,"advanceBias");V(this,"state");V(this,"currentSampleIndex");this.path=t,this.startTolerance=n.startTolerance??60,this.hitTolerance=n.hitTolerance??70,this.maxAdvanceSamples=n.maxAdvanceSamples??50,this.advanceBias=n.advanceBias??.4,this.currentSampleIndex=0,this.state=this.buildInitialState()}buildInitialState(){const t=this.path.strokes[0],n=t==null?void 0:t.samples[0];return{status:"idle",cursorPoint:n?{x:n.x,y:n.y}:{x:0,y:0},cursorTangent:(n==null?void 0:n.tangent)??{x:1,y:0},completedStrokes:[],activeStrokeIndex:0,activeStrokeProgress:0,isPenDown:!1}}getState(){return{...this.state}}getPath(){return this.path}beginAt(t){const{status:n,cursorPoint:r}=this.state;if(n!=="idle"&&n!=="await_pen_up"||Math.hypot(t.x-r.x,t.y-r.y)>this.startTolerance)return!1;const s=this.path.strokes[this.state.activeStrokeIndex];return s!=null&&s.isDot?(this.completeCurrentStroke(),!0):(this.state={...this.state,status:"tracing",isPenDown:!0},!0)}update(t){if(this.state.status!=="tracing")return;const n=this.path.strokes[this.state.activeStrokeIndex];if(!n)return;const r=n.samples,a=this.currentSampleIndex,s=Math.min(a+this.maxAdvanceSamples,r.length-1);let i=a,c=1/0,m=1/0;for(let S=a;S<=s;S++){const f=r[S];if(!f)continue;const g=Math.hypot(t.x-f.x,t.y-f.y),y=(S-a)*this.advanceBias,p=g+y;p<c&&(c=p,m=g,i=S)}if(m>this.hitTolerance)return;const u=r[i];u&&(this.currentSampleIndex=i,this.state={...this.state,cursorPoint:{x:u.x,y:u.y},cursorTangent:u.tangent,activeStrokeProgress:n.totalLength>0?u.distanceAlongStroke/n.totalLength:1}),i>=r.length-1&&this.completeCurrentStroke()}end(){const t=this.state.status==="tracing"?"idle":this.state.status;this.state={...this.state,status:t,isPenDown:!1}}reset(){this.currentSampleIndex=0,this.state=this.buildInitialState()}completeCurrentStroke(){const t=[...this.state.completedStrokes,this.state.activeStrokeIndex],n=this.state.activeStrokeIndex+1;if(n>=this.path.strokes.length){this.state={...this.state,status:"complete",completedStrokes:t,activeStrokeProgress:1,isPenDown:!1};return}const r=this.path.strokes[n],a=r==null?void 0:r.samples[0];this.currentSampleIndex=0,this.state={...this.state,status:"await_pen_up",completedStrokes:t,activeStrokeIndex:n,activeStrokeProgress:0,cursorPoint:a?{x:a.x,y:a.y}:this.state.cursorPoint,cursorTangent:(a==null?void 0:a.tangent)??this.state.cursorTangent,isPenDown:!1}}}const _t="/letterpaths/assets/eagle_fly-B8oRwixn.png",gr="/letterpaths/assets/eagle_stand-BUSO6ROy.png",Yt="/letterpaths/assets/chomp-DH3WDSaP.mp3",pr="/letterpaths/assets/body-CgvmrS6c.png",hr="/letterpaths/assets/body_bulge-3F7a2BaQ.png",mr="/letterpaths/assets/background-BdaS-6aw.png",fr="/letterpaths/assets/snake_facing_camera_angry-2NiXjJ76.png",Sr="/letterpaths/assets/snake_facing_camera_happy-qG4Zd2aU.png",yr="/letterpaths/assets/head_alt-pvLv00oI.png",_r="/letterpaths/assets/head-CeHhv_vT.png",wr="/letterpaths/assets/tail-Wt4Hi91f.png",kr="/letterpaths/assets/sand_moving_1-KzDrd5np.mp3",Ar="/letterpaths/assets/sand_moving_2-sOe4GNi-.mp3",vr="/letterpaths/assets/sand_moving_3-Jh4tCIP3.mp3",br="/letterpaths/assets/sand_moving_4-B3GK1boP.mp3",Er="/letterpaths/assets/theme_park_bg-DOpd8-Mt.png",xr="/letterpaths/assets/carriage_1-DC6yaVQC.png",Ir="/letterpaths/assets/carriage_1_upside_down-BG5QUuxQ.png",Dr="/letterpaths/assets/carriage_2-Bq0wDmtr.png",Pr="/letterpaths/assets/carriage_2_upside_down-_Cm6VEPW.png",We="/letterpaths/assets/front-DZihS2IP.png",Tr="/letterpaths/assets/front_upside_down-Z8CFqsTv.png",Mr="/letterpaths/assets/rear-BWZZF1JA.png",Lr="/letterpaths/assets/rear_upside_down-DZY4fDcB.png",Cr="/letterpaths/assets/rollercoaster_scream-Cnz9sZHr.mp3",Nr="/letterpaths/assets/rollercoaster_track_1-CQOQytx_.mp3",Or="/letterpaths/assets/rollercoaster_track_2-DRqX5yMO.mp3",Zt="G-94373ZKHEE",Rr=new Set(["localhost","127.0.0.1"]),Fr=()=>{if(Rr.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",Zt);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${Zt}`,document.head.append(e)},Hr=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/guided_tracing/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register guided tracing service worker.",t)})},$r="🍎",Dt=150,Pt="plain",Tt=.7,Br=76,Xt=115,Gr=.25,qr=.3,Ur=.12,Wr=.42,wt=10,Vr=220,on=700,jr=6,Kr=44,Yr=56,Zr={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},kt={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Xr={...kt,height:kt.height*(209/431/(160/435))},zr={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Jr={width:69,height:49,anchorX:.5,anchorY:.62,rotationOffset:0},At={width:94,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},Qr={...At,height:79.3},Ye={width:100,height:82.8,anchorX:.5,anchorY:.54,rotationOffset:0},ea={...Ye,height:87.9},ta={...Ye,height:87.7},cn={width:92,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},na={...cn,height:79.9},ra={width:76,height:76,anchorX:.5,anchorY:.5,rotationOffset:0},aa={width:44,height:44,anchorX:.5,anchorY:.5,rotationOffset:0},sa={width:1,height:1,anchorX:.5,anchorY:.5,rotationOffset:0},ia={width:64,height:64,anchorX:.5,anchorY:.5,rotationOffset:0},ln=700,oa=260,dn=800,ca=18,la=.72,ne={width:200,height:106},Ze={width:128,height:141,anchorX:.5,anchorY:1},da=[kr,Ar,vr,br],ua=[Nr,Or],ga=[],nt=e=>`data:image/svg+xml,${encodeURIComponent(e)}`,zt=nt('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'),Jt=nt(`
  <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76">
    <g transform="translate(38 38)">
      <circle cx="0" cy="0" r="36" fill="#f26d4f" stroke="rgba(35, 49, 61, 0.22)" stroke-width="3"/>
      <polygon points="18,0 -12,-14 -6,0 -12,14" fill="#ffffff" stroke="rgba(35, 49, 61, 0.08)" stroke-width="1.5"/>
    </g>
  </svg>
`),pa=nt(`
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="13" fill="#95ddff" stroke="#4a90e2" stroke-width="4"/>
  </svg>
`),Qt=nt(`
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="26" fill="#ffffff" stroke="#f26d4f" stroke-width="6"/>
    <circle cx="32" cy="32" r="9" fill="#f26d4f"/>
  </svg>
`),gt=26,pt=22,ht=11,ha=250,ma=.5,fa=12,Sa=2,Mt={sidebearingGapAdjustment:0},ya=["word","skin","theme","tolerance","animationSpeed","turnRadius","offsetArrowLanes","sidebearingGapAdjustment","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","includeInitialLeadIn","includeFinalLeadOut"],Lt={plain:{id:"plain",boardImage:zt,boardOverlay:"linear-gradient(180deg, rgba(255, 252, 244, 0.96), rgba(255, 248, 235, 0.98))",instruction:"Trace the letters.",successEyebrow:"Trace complete!",successCopy:"All the checkpoints are complete.",soundEffects:{chompSrc:Yt,chompVolume:0,moveSrcs:ga,moveVolume:0,moveChance:0},segmentSpacing:64,deferredSegmentSpacing:44,head:{href:Jt,chewHref:Jt,metrics:ra},bodySprites:[{id:"plain-marker",href:pa,metrics:aa}],tail:{href:zt,metrics:sa},dotTarget:{happyHref:Qt,angryHref:Qt,metrics:ia}},classic:{id:"classic",boardImage:mr,boardOverlay:"linear-gradient(180deg, rgba(255, 252, 244, 0.72), rgba(255, 248, 235, 0.86))",instruction:"Drag the snake around the letters.",successEyebrow:"Snake fed!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:Yt,chompVolume:qr,moveSrcs:da,moveVolume:Ur,moveChance:Wr},segmentSpacing:Br,deferredSegmentSpacing:Kr,head:{href:_r,chewHref:yr,metrics:Zr},bodySprites:[{id:"body",href:pr,metrics:kt},{id:"body-bulge",href:hr,metrics:Xr}],tail:{href:wr,metrics:zr},dotTarget:{happyHref:Sr,angryHref:fr,metrics:Jr}},themePark:{id:"themePark",boardImage:Er,boardOverlay:"linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 249, 230, 0.78))",instruction:"Drag the rollercoaster around the letters.",successEyebrow:"Ride complete!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:Cr,chompVolume:.2,moveSrcs:ua,moveVolume:.1,moveChance:.36},segmentSpacing:106,deferredSegmentSpacing:Yr,head:{href:We,chewHref:We,metrics:At,upsideDown:{href:Tr,metrics:Qr}},bodySprites:[{id:"carriage-1",href:xr,metrics:Ye,upsideDown:{href:Ir,metrics:ea}},{id:"carriage-2",href:Dr,metrics:Ye,upsideDown:{href:Pr,metrics:ta}}],tail:{href:Mr,metrics:cn,upsideDown:{href:Lr,metrics:na}},dotTarget:{happyHref:We,angryHref:We,metrics:At}}};let $=Pt;const A=()=>Lt[$],C=()=>$==="plain",He=()=>A().segmentSpacing,Ct=e=>{var r;const t=((r=d==null?void 0:d.strokes[e.activeStrokeIndex])==null?void 0:r.totalLength)??0,n=t>0?t/3:Number.POSITIVE_INFINITY;return Math.max(1,Math.min(A().deferredSegmentSpacing,n))},Xe=document.querySelector("#app");if(!Xe)throw new Error("Missing #app element for guided tracing app.");Fr();Hr();Xe.innerHTML=`
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
                    min="${ir}"
                    max="${or}"
                    step="${cr}"
                    value="${Dt}"
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
                    value="${Tt}"
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
                <label class="writing-app__settings-field" for="sidebearing-gap-adjustment-slider">
                  <span class="writing-app__settings-label">
                    Letter spacing adjustment
                    <span class="writing-app__tolerance-value" id="sidebearing-gap-adjustment-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="sidebearing-gap-adjustment-slider"
                    type="range"
                    min="-120"
                    max="120"
                    step="5"
                    value="${Mt.sidebearingGapAdjustment}"
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
`;const Me=document.querySelector("#word-input"),un=document.querySelector("#snake-instruction"),gn=document.querySelector("#success-eyebrow"),pn=document.querySelector("#score-summary"),l=document.querySelector("#trace-svg"),K=document.querySelector("#show-me-button"),xe=document.querySelector("#settings-menu"),Le=document.querySelector("#tolerance-slider"),hn=document.querySelector("#tolerance-value"),Ce=document.querySelector("#turn-radius-slider"),mn=document.querySelector("#turn-radius-value"),Ne=document.querySelector("#animation-speed-slider"),fn=document.querySelector("#animation-speed-value"),ze=document.querySelector("#offset-arrow-lanes"),Oe=document.querySelector("#skin-select"),Re=document.querySelector("#sidebearing-gap-adjustment-slider"),Sn=document.querySelector("#sidebearing-gap-adjustment-value"),Je=document.querySelector("#include-initial-lead-in"),Qe=document.querySelector("#include-final-lead-out"),yn=document.querySelector("#success-overlay"),_n=document.querySelector("#next-word-button");if(!Me||!un||!gn||!pn||!l||!K||!xe||!Le||!hn||!Ce||!mn||!Ne||!fn||!ze||!Oe||!Re||!Sn||!Je||!Qe||!yn||!_n)throw new Error("Missing elements for guided tracing app.");const wn=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,t=""]=e.step.split(".");return t.length},kn=(e,t)=>{const n=Number(e.min),r=Number(e.max),a=e.step==="any"?Number.NaN:Number(e.step),s=Number.isFinite(n)?n:0;let i=t;return Number.isFinite(n)&&(i=Math.max(n,i)),Number.isFinite(r)&&(i=Math.min(r,i)),Number.isFinite(a)&&a>0&&(i=s+Math.round((i-s)/a)*a),Number.isFinite(n)&&(i=Math.max(n,i)),Number.isFinite(r)&&(i=Math.min(r,i)),Number(i.toFixed(wn(e)))},Ve=(e,t)=>{const n=kn(e,t);return e.value=n.toFixed(wn(e)),n},mt=(e,t)=>{const n=e.get(t);if(n===null)return null;const r=n.trim().toLowerCase();return["1","true","yes","on"].includes(r)?!0:["0","false","no","off"].includes(r)?!1:null},je=(e,t,n)=>{const r=e.get(t);if(r===null)return null;const a=Number(r);return Number.isFinite(a)?kn(n,a):null},An=e=>{const t=e.get("skin")??e.get("theme");if(t===null)return null;const n=t.trim().toLowerCase();return n==="plain"?"plain":["snake","classic"].includes(n)?"classic":["rollercoaster","themepark","theme-park","theme_park"].includes(n)?"themePark":null},H=()=>{const e=new URL(window.location.href);ya.forEach(r=>{e.searchParams.delete(r)}),D!=="zephyr"&&e.searchParams.set("word",D),$!==Pt&&e.searchParams.set("skin",$==="themePark"?"rollercoaster":$),N!==Dt&&e.searchParams.set("tolerance",String(N)),O!==Tt&&e.searchParams.set("animationSpeed",String(O)),R!==13&&e.searchParams.set("turnRadius",String(R)),G!==!0&&e.searchParams.set("offsetArrowLanes",G?"1":"0"),F.sidebearingGapAdjustment!==Mt.sidebearingGapAdjustment&&e.searchParams.set("sidebearingGapAdjustment",String(F.sidebearingGapAdjustment)),le!==!0&&e.searchParams.set("includeInitialLeadIn",le?"1":"0"),de!==!0&&e.searchParams.set("includeFinalLeadOut",de?"1":"0");const t=`${e.pathname}${e.search}${e.hash}`,n=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==n&&window.history.replaceState(null,"",t)};let Nt=-1,D="zephyr",B=null,o=null,P=null,U=null,ft=!1,se=[],Se=[],re=null,Ie=null,X=null,me=null,v=!1,Y=!1,N=Dt,O=Tt,R=13,G=!1,F={...Mt},le=!0,de=!0,ye=[],$e=[],et=[],k=[],_=1,ae=null,vn=1600,rt=0,d=null,ue=[],L=null,ie=null,tt=null,at=[],oe=null,x=null,De=null,Z=null,Pe=null,I=[],q=0,Fe=0,_e=0,st=0,J=[],fe=!1,z=null,h="hidden",Q=null,ce=null,j=0,Be=!1,T=!1,he=null,en=null,ve=[],vt=!1,Ke=null,tn=null,be=[],bt=!1,Et=-1,Ee=Number.POSITIVE_INFINITY;const bn=()=>{hn.textContent=`${N}px`},En=()=>{mn.textContent=`${R}px`},xn=()=>{fn.textContent=`${O.toFixed(2)}x`},In=()=>{Sn.textContent=`${F.sidebearingGapAdjustment}`},_a=()=>{Me.value=D,Oe.value=$,N=Ve(Le,N),O=Ve(Ne,O),R=Ve(Ce,R),G=!!G,ze.checked=G,F={sidebearingGapAdjustment:Ve(Re,F.sidebearingGapAdjustment)},Je.checked=le,Qe.checked=de},Ge=()=>{D&&dt(D,Nt)},Dn=e=>e.trim().replace(/\s+/g," "),wa=()=>{const e=new URLSearchParams(window.location.search),t=e.get("word");t!==null&&(D=Dn(t)),$=An(e)??$,N=je(e,"tolerance",Le)??N,O=je(e,"animationSpeed",Ne)??O,R=je(e,"turnRadius",Ce)??R,G=mt(e,"offsetArrowLanes")??G,F={sidebearingGapAdjustment:je(e,"sidebearingGapAdjustment",Re)??F.sidebearingGapAdjustment},le=mt(e,"includeInitialLeadIn")??le,de=mt(e,"includeFinalLeadOut")??de,_a(),bn(),xn(),En(),In(),Pn(),H()},Pn=()=>{const e=A();Xe.style.setProperty("--snake-board-image",`url("${e.boardImage}")`),Xe.style.setProperty("--snake-board-overlay",e.boardOverlay),un.textContent=e.instruction,gn.textContent=e.successEyebrow,Oe.value=e.id},Ot=()=>A().soundEffects,Tn=()=>{const e=A(),t=e.soundEffects;return Ke&&tn===e.id||(Ke=t.moveSrcs.map(n=>{const r=new Audio(n);return r.preload="auto",r.volume=t.moveVolume,r}),tn=e.id,bt=!1),Ke},Mn=()=>{const e=A(),t=e.soundEffects;return he&&en===e.id||(he=new Audio(t.chompSrc),he.preload="auto",he.volume=t.chompVolume,en=e.id,vt=!1),he},ka=()=>{const e=Mn();vt||(e.load(),vt=!0)},Aa=()=>{const e=Tn();bt||(e.forEach(t=>{t.load()}),bt=!0)},va=()=>{const e=Ot(),t=Mn(),n=t.currentSrc||t.src;if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=e.chompVolume,ve.push(r),r.addEventListener("ended",()=>{ve=ve.filter(a=>a!==r)}),r.addEventListener("error",()=>{ve=ve.filter(a=>a!==r)}),r.play().catch(()=>{})},ba=()=>{const e=Ot(),t=Tn(),n=t[Math.floor(Math.random()*t.length)],r=(n==null?void 0:n.currentSrc)||(n==null?void 0:n.src);if(!r)return;const a=new Audio(r);a.preload="auto",a.currentTime=0,a.volume=e.moveVolume,be.push(a),a.addEventListener("ended",()=>{be=be.filter(s=>s!==a)}),a.addEventListener("error",()=>{be=be.filter(s=>s!==a)}),a.play().catch(()=>{})},it=()=>{const e=_>0?_-1:-1,t=e>=0?k[e]:null;Et=e,Ee=t?t.startDistance+He():Number.POSITIVE_INFINITY},Ea=e=>{if(!e.isPenDown||v||T)return;const t=_>0?_-1:-1,n=t>=0?k[t]:null;if(!n){Ee=Number.POSITIVE_INFINITY,Et=t;return}t!==Et&&it();const r=Ae(e);let a=!1;for(;r>=Ee&&Ee<=n.endDistance;)Math.random()<Ot().moveChance&&(a=!0),Ee+=He();a&&ba()},we=()=>{const e=v;$e.forEach(t=>{const n=ye[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.sectionIndex>=_;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),pn.textContent=ye.length===0?"Nice tracing.":A().successCopy},ge=e=>{yn.hidden=!e},Ln=()=>{const e=o==null?void 0:o.getState();if(!((e==null?void 0:e.status)!=="complete"||!fe)){if(J.length>0){ge(!1);return}ge(!0)}},Rt=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},Ft=e=>Math.atan2(e.y,e.x)*(180/Math.PI),xa=e=>(e%360+360)%360,Ia=e=>{const t=xa(e);return t>90&&t<270},St=(e,t)=>!e.upsideDown||!Ia(t+e.metrics.rotationOffset)?e:e.upsideDown,Da=e=>{const t=e.querySelector(".writing-app__snake-head"),n=(t==null?void 0:t.querySelector("image"))??null,r=e.querySelector(".writing-app__snake-tail"),a=Array.from(e.querySelectorAll(".writing-app__snake-body")).sort((s,i)=>Number(s.dataset.snakeBodyIndex)-Number(i.dataset.snakeBodyIndex));return!t||!n||!r?null:{layerEl:e,headEl:t,headImageEl:n,bodyEls:a,tailEl:r}},Pa=()=>!L||!ie||!tt||!oe?null:{layerEl:L,headEl:ie,headImageEl:tt,bodyEls:at,tailEl:oe},Ta=e=>{e.removeAttribute("id"),e.querySelectorAll("[id]").forEach(t=>{t.removeAttribute("id")})},Ht=()=>{Be=!1,T=!1},Cn=()=>{if(!T||!Be||P===null||!U||!o)return!1;const e=o.getState();return e.status==="tracing"||o.beginAt(e.cursorPoint)?(Ht(),o.update(U),w(),!0):!1},ee=e=>(d==null?void 0:d.strokes[e.activeStrokeIndex])??null,Ma=e=>ue[e.activeStrokeIndex]??null,La=e=>{const t=d==null?void 0:d.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ae=e=>{var n;if(!d)return 0;if(e.status==="complete")return rt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=d.strokes[r])==null?void 0:n.totalLength)??0;return t+La(e)},Ca=e=>{const t=d;return t?e.isPenDown&&e.activeStrokeIndex>=0?Ae({status:"tracing",activeStrokeIndex:e.activeStrokeIndex,activeStrokeProgress:e.activeStrokeProgress}):e.completedStrokes.reduce((n,r)=>{var a;return n+(((a=t.strokes[r])==null?void 0:a.totalLength)??0)},0):0},Na=e=>{if(!d)return e.cursorTangent;const t=Ae(e),n=[...d.boundaries].reverse().find(r=>r.previousSegment!==r.nextSegment&&r.turnAngleDegrees>=150&&t>=r.overallDistance-Sa&&t-r.overallDistance<fa);return(n==null?void 0:n.outgoingTangent)??e.cursorTangent},ke=e=>{var t;return((t=Ma(e))==null?void 0:t.deferred)===!0},xt=e=>{var t;return((t=ue[e.strokeIndex])==null?void 0:t.deferred)===!0},qe=()=>{const e=_>0?_-1:-1;return e>=0?k[e]??null:null},$t=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},Nn=e=>{var t;return v||e.status==="complete"||!ke(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=ee(e))==null?void 0:t.isDot)===!0}},Oa=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===Q&&((n=ee(t))==null?void 0:n.isDot)===!0&&h!=="hidden"&&h!=="waiting"},E=()=>{z!==null&&(cancelAnimationFrame(z),z=null),h="hidden",Q=null,ce=null,x&&(x.style.opacity="0",x.classList.remove("writing-app__dot-snake--waiting")),Z&&(Z.style.opacity="0")},Ra=e=>({x:e.x,y:e.y-ca}),Fa=e=>({x:e.x,y:e.y+8}),On=(e=performance.now())=>{if(h==="hidden"||!ce)return null;const t=A(),n=Fa(ce),r=Ra(ce);if(h==="waiting")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!0};if(h==="eagle_in"){const c=Math.max(0,Math.min(1,(e-j)/ln)),m=1-(1-c)*(1-c);return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:{x:r.x,y:-106+(r.y+ne.height)*m},eagleHref:_t,eagleWidth:ne.width,eagleHeight:ne.height}}if(h==="eagle_stand")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:r,eagleHref:gr,eagleWidth:Ze.width,eagleHeight:Ze.height};const a=Math.max(0,Math.min(1,(e-j)/dn)),s=1-(1-a)*(1-a),i={x:r.x+(vn+ne.width-r.x)*s,y:r.y+(-106-r.y)*s};return{snakePoint:{x:i.x,y:i.y+ne.height*.6},snakeHref:t.dotTarget.angryHref,snakeWobble:!1,eaglePoint:i,eagleHref:_t,eagleWidth:ne.width,eagleHeight:ne.height}},Rn=()=>{var t;const e=o==null?void 0:o.getState();if(!(!o||!e)&&Q!==null&&e.activeStrokeIndex===Q&&(t=ee(e))!=null&&t.isDot){o.beginAt(e.cursorPoint);const n=o.getState();jn(Ae(n)),Un(n)}},Ha=()=>{Rn(),E(),w()},Fn=e=>{if(z=null,!(h==="hidden"||h==="waiting")){if(h==="eagle_in"&&e-j>=ln)h="eagle_stand",j=e;else if(h==="eagle_stand"&&e-j>=oa)h="eagle_out",j=e;else if(h==="eagle_out"&&e-j>=dn){Ha();return}w(),z=requestAnimationFrame(Fn)}},$a=()=>{h==="waiting"&&(Rn(),h="eagle_in",j=performance.now(),z!==null&&cancelAnimationFrame(z),z=requestAnimationFrame(Fn),w())},Ba=e=>{if(C()){E();return}const t=Nn(e);if(!(t!=null&&t.isDot)){if(h!=="hidden"&&h!=="waiting")return;E();return}Q!==t.strokeIndex?(E(),Q=t.strokeIndex,ce=t.point,h="waiting"):h==="waiting"&&(ce=t.point)},Hn=(e=performance.now())=>{if(C()){E();return}if(!x||!De||!Z||!Pe)return;const t=On(e);if(!t){x.style.opacity="0",x.classList.remove("writing-app__dot-snake--waiting"),Z.style.opacity="0";return}const n=A().dotTarget.metrics;if(x.style.opacity="1",x.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),De.setAttribute("href",t.snakeHref),Te(x,De,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},n.width,n.height,n.anchorX,n.anchorY,n.rotationOffset),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){Z.style.opacity="0";return}Pe.setAttribute("href",t.eagleHref),Te(Z,Pe,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Ze.anchorX,Ze.anchorY,0)},Ga=(e,t)=>{const n=Nn(t);if(!n)return!1;if(n.isDot){if(C()){const c=Math.max(34,A().head.metrics.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=c}if(h!=="waiting")return!1;const a=On();if(!a)return!1;const s=A().dotTarget.metrics,i=Math.max(s.width,s.height)*la;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=i}const r=Math.max(34,A().head.metrics.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},nn=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},qa=(e,t,n)=>{if(n<=t)return"";const r=[];let a=0;return e.strokes.forEach(s=>{const i=a,c=a+s.totalLength;if(a=c,n<i||t>c)return;const m=Math.max(0,t-i),u=Math.min(s.totalLength,n-i);if(u<m||s.samples.length===0)return;const S=[nn(s.samples,m),...s.samples.filter(p=>p.distanceAlongStroke>m&&p.distanceAlongStroke<u).map(p=>({x:p.x,y:p.y})),nn(s.samples,u)],f=S.filter((p,te)=>{const M=S[te-1];return!M||Math.hypot(p.x-M.x,p.y-M.y)>.01});if(f.length===0)return;const[g,...y]=f;r.push(`M ${g.x} ${g.y}`),y.forEach(p=>{r.push(`L ${p.x} ${p.y}`)})}),r.join(" ")},$n=(e,t,n)=>{const r=e.strokes[t.strokeIndex],a=n[t.strokeIndex];return r!=null&&r.isDot&&a?an(a.curves):qa(e,t.startDistance,t.endDistance)},Ua=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),Wa=e=>`writing-app__section-arrow writing-app__section-arrow--white writing-app__section-arrow--${e.kind}`,Va=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),ja=e=>e.kind==="draw-order-number"?"":`
    <path
      class="${Wa(e)}"
      d="${sr(e.commands)}"
    ></path>
    ${Va(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white writing-app__section-arrowhead--${e.kind}" points="${Ua(t.polygon)}"></polygon>`).join("")}
  `,Ue=()=>{if(!Ie||!d||!B)return;const e=qe();if(!e){X=null,Ie.innerHTML="";return}if(X===e.index)return;const t=Math.abs(B.guides.baseline-B.guides.xHeight)/3,n=G?R:0,r=ar(d,{sections:[e],drawOrderNumbers:!1,startArrows:{length:t*.42,minLength:t*.18,offset:n,head:{length:gt,width:pt,tipExtension:ht}},midpointArrows:{density:ha,length:t*.36,offset:n,head:{length:gt,width:pt,tipExtension:ht}},turningPoints:{offset:R,stemLength:t*.36,head:{length:gt,width:pt,tipExtension:ht},groups:et}}).filter(a=>a.kind!=="turning-point"||Math.abs(a.source.turnDistance-e.endDistance)<=ma);Ie.innerHTML=r.map(ja).join(""),X=e.index},Bn=()=>{if(!re||!d)return;const e=qe();if(!e){re.setAttribute("d",""),re.style.opacity="0";return}re.setAttribute("d",$n(d,e,ue)),re.style.opacity="1"},Ka=()=>{_=Math.min(_+1,k.length),Kn(),we(),Ue(),it()},Gn=(e,t)=>{const n=e.endDistance-e.startDistance;return t.startReason==="stroke-start"?.1:Math.min(8,Math.max(.1,n*.25))},qn=(e,t,n={})=>{var i,c;const r=xt(e),a=((i=d==null?void 0:d.strokes[e.strokeIndex])==null?void 0:i.isDot)===!0,s=((c=d==null?void 0:d.strokes[t.strokeIndex])==null?void 0:c.isDot)===!0;return(!r||!a)&&(lt(e.endPoint,e.endTangent,!0),Gt()),Ka(),ct(t.startPoint,t.startTangent,!s,{preserveGrowth:n.preserveGrowth}),{nextSectionDeferred:xt(t),nextSectionIsDot:s}},Un=e=>{if(v||T||k.length<=_)return!1;const t=qe(),n=k[_];if(!t||!n)return!1;const r=Ae(e),a=Gn(t,n);if(r<t.endDistance-a)return!1;o==null||o.end();const{nextSectionDeferred:s}=qn(t,n,{preserveGrowth:!0});return s?(Ht(),w(),!0):(T=!0,Be=n.startReason==="retrace-turn",Cn(),w(),!0)},Ya=(e,t)=>t.slice(0,-1).map(n=>({x:n.endPoint.x,y:n.endPoint.y,pathDistance:n.endDistance,emoji:$r,captured:!1,sectionIndex:n.index})),Wn=()=>{_=k.length>0?1:0,X=null,Ue(),ye.forEach(e=>{e.captured=!1}),$e.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),Kn(),we()},Bt=()=>C()?0:Za(Fe),Za=e=>{const t=Math.max(3,Math.min(wt,Math.floor(rt/Xt)));return Math.min(t,1+Math.floor(e/Xt))},Te=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},yt=(e,t,n=()=>null)=>{const r=e[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(t<0){const s=r.angle*Math.PI/180;return{...r,x:r.x+Math.cos(s)*t,y:r.y+Math.sin(s)*t,distance:t}}if(e.length<=1||t<=0)return{...r,distance:Math.max(0,t)};for(let s=1;s<e.length;s+=1){const i=e[s-1],c=e[s];if(!i||!c||t>c.distance)continue;const m=c.distance-i.distance,u=m>0?(t-i.distance)/m:0,S=i.x+(c.x-i.x)*u,f=i.y+(c.y-i.y)*u,g=n(t);return{x:S,y:f,angle:g??Ft({x:c.x-i.x,y:c.y-i.y}),distance:t,visible:c.visible}}return{...e[e.length-1]??r,distance:t}},ot=()=>{ie==null||ie.style.setProperty("opacity","0"),oe==null||oe.style.setProperty("opacity","0"),at.forEach(e=>{e.style.opacity="0"})},Vn=(e,t,n=performance.now())=>{if(t.trail.length===0){e.layerEl.style.opacity="0";return}e.layerEl.style.opacity="1";const r=A(),a=t.segmentSpacing??r.segmentSpacing,s=$t(t.headDistance,t.bodyCount,a),i=s.bodyCount,c=b=>t.headDistance+t.retractionDistance-b,m=b=>Math.max(0,Math.min(t.headDistance,b)),u=b=>t.retractionDistance>0&&b>=t.headDistance-jr,S=yt(t.trail,Math.min(t.headDistance,c(0)),t.getAngleOverride),f=St(r.head,t.headAngle);if(e.headImageEl.setAttribute("href",n<(t.chewUntil??0)&&f===r.head?r.head.chewHref:f.href),Te(e.headEl,e.headImageEl,{...S,angle:t.headAngle,visible:!u(c(0))},f.metrics.width,f.metrics.height,f.metrics.anchorX,f.metrics.anchorY,f.metrics.rotationOffset),r.id==="plain"){e.bodyEls.forEach(b=>{b.style.opacity="0"}),e.tailEl.style.opacity="0";return}e.bodyEls.forEach((b,Ut)=>{if(Ut>=i){b.style.opacity="0";return}const ut=b.querySelector("image");if(!ut)return;const Zn=(Ut+1)*a,Wt=c(Zn);if(u(Wt)){b.style.opacity="0";return}const Vt=yt(t.trail,m(Wt),t.getAngleOverride),Xn=r.bodySprites.find(zn=>zn.id===b.dataset.snakeBodyVariant)??r.bodySprites[0]??Lt.classic.bodySprites[0],pe=St(Xn,Vt.angle);ut.setAttribute("href",pe.href),Te(b,ut,Vt,pe.metrics.width,pe.metrics.height,pe.metrics.anchorX,pe.metrics.anchorY,pe.metrics.rotationOffset)});const g=e.tailEl.querySelector("image");if(!g)return;if(t.showTail===!1){e.tailEl.style.opacity="0";return}const y=(i+1)*a,p=c(y);if(!s.showTail||u(p)){e.tailEl.style.opacity="0";return}const te=yt(t.trail,m(p),t.getAngleOverride),M=St(r.tail,te.angle);g.setAttribute("href",M.href),Te(e.tailEl,g,te,M.metrics.width,M.metrics.height,M.metrics.anchorX,M.metrics.anchorY,M.metrics.rotationOffset)},W=(e=performance.now())=>{var i,c;const t=Pa();if(!t)return;const n=o==null?void 0:o.getState();if(!C()&&(h!=="hidden"&&n!==void 0&&Q===n.activeStrokeIndex||n!==void 0&&((i=ee(n))==null?void 0:i.isDot)===!0)){ot();return}const a=Y||n!==void 0&&ke(n)&&((c=ee(n))==null?void 0:c.isDot)!==!0,s=a&&n!==void 0?Ct(n):He();Vn(t,{trail:I,headDistance:q,headAngle:_e,bodyCount:C()?0:a?1:Bt(),segmentSpacing:s,retractionDistance:0,chewUntil:st,showTail:!C()},e)},Xa=e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove(),J=J.filter(t=>t!==e),Ln()},It=e=>{Vn(e.parts,{trail:e.trail,headDistance:e.headDistance,headAngle:e.headAngle,bodyCount:e.bodyCount,segmentSpacing:e.segmentSpacing,retractionDistance:e.retractionDistance,showTail:e.showTail})},za=(e={})=>{if(C())return 0;const t=e.isShortDeferredSnake?1:Bt(),n=e.isShortDeferredSnake?Ct({activeStrokeIndex:(o==null?void 0:o.getState().activeStrokeIndex)??0}):He();return($t(q,t,n).bodyCount+1)*n/on*1e3},Ja=e=>{let t=null;const n=r=>{if(!J.includes(e))return;if(t===null){t=r,e.animationFrameId=requestAnimationFrame(n);return}const a=Math.max(0,r-t)/1e3;t=r;const s=a*on,i=e.retractionTarget-e.retractionDistance;if(Math.abs(i)<=s){e.retractionDistance=e.retractionTarget,It(e),Xa(e);return}e.retractionDistance+=Math.sign(i)*s,It(e),e.animationFrameId=requestAnimationFrame(n)};e.animationFrameId=requestAnimationFrame(n)},Gt=()=>{var u;if(C())return;const e=L==null?void 0:L.parentElement;if(!L||!e||I.length===0)return;const t=L.cloneNode(!0);Ta(t),t.classList.add("writing-app__snake--retiring"),e.insertBefore(t,L);const n=Da(t);if(!n){t.remove();return}const r=o==null?void 0:o.getState(),a=r!==void 0&&ke(r)&&((u=ee(r))==null?void 0:u.isDot)!==!0,s=a?1:Bt(),i=a?Ct(r):He(),c=$t(q,s,i).bodyCount,m={parts:n,trail:I.map(S=>({...S})),headDistance:q,headAngle:_e,bodyCount:s,segmentSpacing:i,retractionDistance:0,retractionTarget:(c+1)*i,showTail:!0,animationFrameId:null};J.push(m),It(m),Ja(m)},qt=()=>{J.forEach(e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove()}),J=[]},ct=(e,t,n=!0,r={})=>{const a=Rt(t),s=r.preserveGrowth?Fe:0;_e=Ft(a),I=[{x:e.x,y:e.y,angle:_e,distance:0,visible:n}],q=0,Fe=s,st=0,Be=!1,T=!1,W()},lt=(e,t,n)=>{const r=Rt(t),a=Ft(r);_e=a;const s=I[I.length-1];if(!s){ct(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?I[I.length-1]={...s,x:e.x,y:e.y,angle:a}:(I.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),q=s.distance+.001),W();return}q=s.distance+i,Fe+=i,I.push({x:e.x,y:e.y,angle:a,distance:q,visible:n}),W()},jn=e=>{let t=!1;ye.forEach((n,r)=>{if(n.captured||n.sectionIndex>=_||e+.5<n.pathDistance)return;n.captured=!0;const a=$e[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(st=performance.now()+Vr,va(),we(),W())},Kn=()=>{if(!ae)return;const e=qe();if(!e||xt(e)){ae.classList.add("writing-app__boundary-star--hidden");return}ae.classList.remove("writing-app__boundary-star--hidden"),ae.setAttribute("x",`${e.endPoint.x}`),ae.setAttribute("y",`${e.endPoint.y}`)},Qa=e=>{var t;if(v||jn(Ae(e)),!(!v&&Un(e))){if(ke(e)&&((t=ee(e))==null?void 0:t.isDot)===!0){W();return}lt(e.cursorPoint,Na(e),!0),!v&&e.isPenDown&&Ea(e)}},Yn=()=>{me!==null&&(cancelAnimationFrame(me),me=null),v=!1,Y=!1,K.disabled=!1,K.textContent="Animate",we(),W(),w()},rn=()=>{o==null||o.reset(),P=null,U=null,fe=!1,ge(!1),Y=!1,E(),qt(),se.forEach((t,n)=>{const r=Se[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Be=!1,T=!1;const e=o==null?void 0:o.getState();e?ct(e.cursorPoint,e.cursorTangent,!0):ot(),Wn(),it(),w()},w=()=>{ft||(ft=!0,requestAnimationFrame(()=>{ft=!1,es()}))},es=()=>{if(!o)return;const e=o.getState();Ba(e),Hn(),Bn(),Ue();const t=new Set(e.completedStrokes);if(se.forEach((n,r)=>{const a=Se[r]??0;if(t.has(r)||Oa(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),e.status==="complete"){fe||(fe=!0,lt(e.cursorPoint,e.cursorTangent,!0),Gt()),ot(),Ln();return}!v&&!T?Qa(e):W(),fe=!1,ge(!1)},ts=(e,t)=>Math.hypot(e.velocity.x,e.velocity.y)<=.001?t:Rt(e.velocity),ns=e=>{const t=new Set(e.completedStrokes);se.forEach((n,r)=>{const a=Se[r]??.001;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`})},rs=(e,t)=>{const n=ue[e.activeStrokeIndex],r=d==null?void 0:d.strokes[e.activeStrokeIndex];return!(n!=null&&n.deferred)||e.activeStrokeIndex<0||!e.isPenDown||C()?(Y=!1,E(),!1):r!=null&&r.isDot?(Y=!1,Q=e.activeStrokeIndex,ce=e.point,h="waiting",Hn(),!0):(E(),Y=!0,!1)},as=e=>{let t=!1;const n=Ca(e);for(;k.length>_;){const r=qe(),a=k[_];if(!r||!a)break;const s=Gn(r,a);if(n<r.endDistance-s)break;qn(r,a,{preserveGrowth:!0}),t=!0}return t},ss=()=>{if(!B||v)return;rn(),Yn();const e=new tr(B,{speed:1.7*O,penUpSpeed:2.1*O,deferredDelayMs:150});v=!0,K.disabled=!0,K.textContent="Animating...",we(),W();const t=performance.now();let n=(o==null?void 0:o.getState().cursorTangent)??{x:1,y:0},r=!1,a=e.totalDuration+jt;const s=i=>{const c=i-t,m=Math.min(c,e.totalDuration),u=e.getFrame(m),S=ts(u,n);as(u);const f=rs(u);if(ns(u),u.isPenDown&&!f?(lt(u.point,S,!0),n=S):W(),!r&&c>=e.totalDuration&&(r=!0,a=e.totalDuration+Math.max(jt,za({isShortDeferredSnake:Y})),E(),Gt(),ot()),c<a||J.length>0){me=requestAnimationFrame(s);return}me=null,E(),v=!1,K.disabled=!1,K.textContent="Animate",we(),rn()};me=requestAnimationFrame(s),w()},is=e=>{const t=e.bodySprites[0]??Lt.classic.bodySprites[0],n=e.bodySprites[1];return e.id==="themePark"&&e.bodySprites.length>1?e.bodySprites[Math.floor(Math.random()*e.bodySprites.length)]??t:!n||Math.random()>=Gr?t:n},os=(e,t,n,r)=>{qt(),vn=t;const a=A(),s=er(e);d=s,ue=e.strokes.filter(g=>g.type!=="lift"),rt=s.strokes.reduce((g,y)=>g+y.totalLength,0),et=nr(s).groups,k=rr(s,{groups:et}).sections,_=k.length>0?1:0,o=new ur(s,{startTolerance:N,hitTolerance:N}),P=null,ye=Ya(s,k);const c=ue,m=k.map(g=>`<path class="writing-app__stroke-bg" d="${$n(s,g,c)}"></path>`).join(""),u=c.map(g=>`<path class="writing-app__stroke-trace" d="${an(g.curves)}"></path>`).join(""),S=Array.from({length:wt},(g,y)=>{const p=wt-1-y,te=is(a);return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${p}"
        data-snake-body-variant="${te.id}"
      >
        <image
          href="${te.href}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join("");l.setAttribute("viewBox",`0 0 ${t} ${n}`),l.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${t}" height="${n}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${e.guides.xHeight+r}"
      x2="${t}"
      y2="${e.guides.xHeight+r}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${e.guides.baseline+r}"
      x2="${t}"
      y2="${e.guides.baseline+r}"
    ></line>
    ${m}
    <path class="writing-app__stroke-next" id="next-section-stroke" d=""></path>
    ${u}
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
          href="${a.tail.href}"
          preserveAspectRatio="none"
        ></image>
      </g>
      ${S}
      <g
        class="writing-app__snake-segment writing-app__snake-head"
        id="snake-head"
      >
        <image
          id="snake-head-image"
          href="${a.head.href}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${a.dotTarget.happyHref}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${_t}"
        preserveAspectRatio="none"
      ></image>
    </g>
  `,se=Array.from(l.querySelectorAll(".writing-app__stroke-trace")),re=l.querySelector("#next-section-stroke"),Ie=l.querySelector("#section-annotations"),X=null,$e=Array.from(l.querySelectorAll(".writing-app__fruit")),ae=l.querySelector("#waypoint-star"),L=l.querySelector("#trace-snake"),ie=l.querySelector("#snake-head"),tt=l.querySelector("#snake-head-image"),oe=l.querySelector("#snake-tail"),at=Array.from(l.querySelectorAll(".writing-app__snake-body")).sort((g,y)=>Number(g.dataset.snakeBodyIndex)-Number(y.dataset.snakeBodyIndex)),x=l.querySelector("#dot-snake"),De=l.querySelector("#dot-snake-image"),Z=l.querySelector("#dot-eagle"),Pe=l.querySelector("#dot-eagle-image"),Se=se.map(g=>{const y=g.getTotalLength();return Number.isFinite(y)&&y>0?y:.001}),se.forEach((g,y)=>{const p=Se[y]??.001;g.style.strokeDasharray=`${p} ${p}`,g.style.strokeDashoffset=`${p}`}),Bn();const f=o.getState();ct(f.cursorPoint,f.cursorTangent),E(),Wn(),it(),fe=!1,ge(!1),w()},dt=(e,t=-1)=>{if(Yn(),D=Dn(e),Nt=t,Me.value=D,H(),D.length===0){B=null,o=null,d=null,P=null,U=null,se=[],Se=[],re=null,Ie=null,X=null,ye=[],$e=[],et=[],k=[],_=1,ae=null,rt=0,ue=[],L=null,ie=null,tt=null,at=[],oe=null,x=null,De=null,Z=null,Pe=null,I=[],q=0,Fe=0,_e=0,st=0,qt(),E(),l.innerHTML="",ge(!1);return}try{const n=lr(D,{joinSpacing:F,keepInitialLeadIn:le,keepFinalLeadOut:de});B=n.path,os(n.path,n.width,n.height,n.offsetY)}catch{B=null,o=null,d=null,l.innerHTML="",ge(!1)}},cs=(e,t=-1)=>(dt(e,t),B!==null),ls=()=>{const e=dr(Nt);cs(Kt[e]??Kt[0],e)},ds=e=>{if(v||!o||P!==null)return;const t=sn(l,e),n=o.getState(),r=ee(n),a=T;if(ke(n)&&!Ga(t,n))return;if(ke(n)&&(r!=null&&r.isDot)){e.preventDefault(),$a();return}o.beginAt(t)&&(e.preventDefault(),P=e.pointerId,U=t,ka(),Aa(),a?Ht():a||(T=!1),l.setPointerCapture(e.pointerId),w())},us=e=>{if(!(v||!o||e.pointerId!==P)){if(e.preventDefault(),U=sn(l,e),T){Cn(),w();return}o.update(U),w()}},gs=e=>{!o||e.pointerId!==P||(o.end(),l.hasPointerCapture(e.pointerId)&&l.releasePointerCapture(e.pointerId),P=null,U=null,w())},ps=e=>{e.pointerId===P&&(o==null||o.end(),l.hasPointerCapture(e.pointerId)&&l.releasePointerCapture(e.pointerId),P=null,U=null,w())};l.addEventListener("pointerdown",ds);l.addEventListener("pointermove",us);l.addEventListener("pointerup",gs);l.addEventListener("pointercancel",ps);K.addEventListener("click",ss);Le.addEventListener("input",()=>{N=Number(Le.value),bn(),H(),Ge()});Ne.addEventListener("input",()=>{O=Number(Ne.value),xn(),H()});Ce.addEventListener("input",()=>{R=Number(Ce.value),En(),H(),X=null,Ue()});ze.addEventListener("change",()=>{G=ze.checked,H(),X=null,Ue()});Oe.addEventListener("change",()=>{$=An(new URLSearchParams([["skin",Oe.value]]))??Pt,Pn(),H(),Ge()});Re.addEventListener("input",()=>{F={...F,sidebearingGapAdjustment:Number(Re.value)},In(),H(),Ge()});Je.addEventListener("change",()=>{le=Je.checked,H(),Ge()});Qe.addEventListener("change",()=>{de=Qe.checked,H(),Ge()});_n.addEventListener("click",ls);Me.addEventListener("input",()=>{dt(Me.value)});document.addEventListener("pointerdown",e=>{if(!xe.open)return;const t=e.target;t instanceof Node&&xe.contains(t)||(xe.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(xe.open=!1)});wa();dt(D);
