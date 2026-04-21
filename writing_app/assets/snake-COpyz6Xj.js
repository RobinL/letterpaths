import{M as ea,j as ta,T as na,b as aa,c as ra,l as ia,a as nn,i as Zt,k as sa,W as zt,h as an}from"./shared-DABULQv_.js";import{T as oa,A as ca}from"./session-BQ-vfymk.js";import{b as la,c as da,a as ua}from"./annotations-CpwQs16K.js";const xt="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",pa="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",ga="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",ha="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Sa="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",ma="/letterpaths/writing_app/assets/background-BdaS-6aw.png",fa="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",_a="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",ya="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",ba="/letterpaths/writing_app/assets/head-CeHhv_vT.png",wa="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",ka="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",xa="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Ea="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",va="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Aa="/letterpaths/writing_app/assets/theme_park_bg-DOpd8-Mt.png",Da="/letterpaths/writing_app/assets/carriage_1-DC6yaVQC.png",Ia="/letterpaths/writing_app/assets/carriage_1_upside_down-BG5QUuxQ.png",Pa="/letterpaths/writing_app/assets/carriage_2-Bq0wDmtr.png",Ta="/letterpaths/writing_app/assets/carriage_2_upside_down-_Cm6VEPW.png",Xe="/letterpaths/writing_app/assets/front-DZihS2IP.png",Ma="/letterpaths/writing_app/assets/front_upside_down-Z8CFqsTv.png",La="/letterpaths/writing_app/assets/rear-BWZZF1JA.png",Ca="/letterpaths/writing_app/assets/rear_upside_down-DZY4fDcB.png",Na="/letterpaths/writing_app/assets/rollercoaster_scream-Cnz9sZHr.mp3",Ra="/letterpaths/writing_app/assets/rollercoaster_track_1-CQOQytx_.mp3",Ha="/letterpaths/writing_app/assets/rollercoaster_track_2-DRqX5yMO.mp3",Xt="G-94373ZKHEE",Oa=new Set(["localhost","127.0.0.1"]),Fa=()=>{if(Oa.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",Xt);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${Xt}`,document.head.append(e)},Ga=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},$a="🍎",Lt=150,rn="classic",Ct=.7,qa=76,jt=115,Ba=.25,Ua=.3,Va=.12,Wa=.42,Et=10,Ka=220,sn=700,Ya=6,Za=44,za=56,Xa={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},vt={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},ja={...vt,height:vt.height*(209/431/(160/435))},Ja={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Qa={width:69,height:49,anchorX:.5,anchorY:.62,rotationOffset:0},At={width:94,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},er={...At,height:79.3},Je={width:100,height:82.8,anchorX:.5,anchorY:.54,rotationOffset:0},tr={...Je,height:87.9},nr={...Je,height:87.7},on={width:92,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},ar={...on,height:79.9},cn=700,rr=260,ln=800,ir=18,sr=.72,ne={width:200,height:106},Qe={width:128,height:141,anchorX:.5,anchorY:1},or=[ka,xa,Ea,va],cr=[Ra,Ha],mt=26,ft=22,_t=11,lr=250,dr=.5,ur=12,pr=2,v={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},gr=["word","skin","theme","tolerance","animationSpeed","turnRadius","offsetArrowLanes","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","includeInitialLeadIn","includeFinalLeadOut"],Nt={classic:{id:"classic",boardImage:ma,boardOverlay:"linear-gradient(180deg, rgba(255, 252, 244, 0.72), rgba(255, 248, 235, 0.86))",instruction:"Drag the snake around the letters.",successEyebrow:"Snake fed!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:ga,chompVolume:Ua,moveSrcs:or,moveVolume:Va,moveChance:Wa},segmentSpacing:qa,deferredSegmentSpacing:Za,head:{href:ba,chewHref:ya,metrics:Xa},bodySprites:[{id:"body",href:ha,metrics:vt},{id:"body-bulge",href:Sa,metrics:ja}],tail:{href:wa,metrics:Ja},dotTarget:{happyHref:_a,angryHref:fa,metrics:Qa}},themePark:{id:"themePark",boardImage:Aa,boardOverlay:"linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 249, 230, 0.78))",instruction:"Drag the rollercoaster around the letters.",successEyebrow:"Ride complete!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:Na,chompVolume:.2,moveSrcs:cr,moveVolume:.1,moveChance:.36},segmentSpacing:106,deferredSegmentSpacing:za,head:{href:Xe,chewHref:Xe,metrics:At,upsideDown:{href:Ma,metrics:er}},bodySprites:[{id:"carriage-1",href:Da,metrics:Je,upsideDown:{href:Ia,metrics:tr}},{id:"carriage-2",href:Pa,metrics:Je,upsideDown:{href:Ta,metrics:nr}}],tail:{href:La,metrics:on,upsideDown:{href:Ca,metrics:ar}},dotTarget:{happyHref:Xe,angryHref:Xe,metrics:At}}};let ye=rn;const A=()=>Nt[ye],We=()=>A().segmentSpacing,Rt=e=>{var a;const t=((a=u==null?void 0:u.strokes[e.activeStrokeIndex])==null?void 0:a.totalLength)??0,n=t>0?t/3:Number.POSITIVE_INFINITY;return Math.max(1,Math.min(A().deferredSegmentSpacing,n))},et=document.querySelector("#app");if(!et)throw new Error("Missing #app element for snake app.");Fa();Ga();et.innerHTML=`
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
                    min="${ea}"
                    max="${ta}"
                    step="${na}"
                    value="${Lt}"
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
                    value="${Ct}"
                  />
                </label>
                <label class="writing-app__settings-toggle" for="offset-arrow-lanes">
                  <input
                    id="offset-arrow-lanes"
                    type="checkbox"
                  />
                  <span>Offset lanes</span>
                </label>
                <label class="writing-app__settings-toggle" for="theme-park-toggle">
                  <input
                    id="theme-park-toggle"
                    type="checkbox"
                  />
                  <span>Theme park</span>
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
                    value="${v.targetBendRate}"
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
                    value="${v.minSidebearingGap}"
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
                    value="${v.bendSearchMinSidebearingGap}"
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
                    value="${v.bendSearchMaxSidebearingGap}"
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
                    value="${v.exitHandleScale}"
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
                    value="${v.entryHandleScale}"
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
          aria-label="Handwriting snake tracing area"
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
`;const Ne=document.querySelector("#word-input"),dn=document.querySelector("#snake-instruction"),un=document.querySelector("#success-eyebrow"),pn=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),Z=document.querySelector("#show-me-button"),Pe=document.querySelector("#settings-menu"),Re=document.querySelector("#tolerance-slider"),gn=document.querySelector("#tolerance-value"),He=document.querySelector("#turn-radius-slider"),hn=document.querySelector("#turn-radius-value"),Oe=document.querySelector("#animation-speed-slider"),Sn=document.querySelector("#animation-speed-value"),tt=document.querySelector("#offset-arrow-lanes"),nt=document.querySelector("#theme-park-toggle"),Fe=document.querySelector("#target-bend-rate-slider"),mn=document.querySelector("#target-bend-rate-value"),Ge=document.querySelector("#min-sidebearing-gap-slider"),fn=document.querySelector("#min-sidebearing-gap-value"),$e=document.querySelector("#bend-search-min-sidebearing-gap-slider"),_n=document.querySelector("#bend-search-min-sidebearing-gap-value"),qe=document.querySelector("#bend-search-max-sidebearing-gap-slider"),yn=document.querySelector("#bend-search-max-sidebearing-gap-value"),Be=document.querySelector("#exit-handle-scale-slider"),bn=document.querySelector("#exit-handle-scale-value"),Ue=document.querySelector("#entry-handle-scale-slider"),wn=document.querySelector("#entry-handle-scale-value"),at=document.querySelector("#include-initial-lead-in"),rt=document.querySelector("#include-final-lead-out"),kn=document.querySelector("#success-overlay"),xn=document.querySelector("#next-word-button");if(!Ne||!dn||!un||!pn||!d||!Z||!Pe||!Re||!gn||!He||!hn||!Oe||!Sn||!tt||!nt||!Fe||!mn||!Ge||!fn||!$e||!_n||!qe||!yn||!Be||!bn||!Ue||!wn||!at||!rt||!kn||!xn)throw new Error("Missing elements for snake app.");const En=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,t=""]=e.step.split(".");return t.length},vn=(e,t)=>{const n=Number(e.min),a=Number(e.max),r=e.step==="any"?Number.NaN:Number(e.step),i=Number.isFinite(n)?n:0;let s=t;return Number.isFinite(n)&&(s=Math.max(n,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number.isFinite(r)&&r>0&&(s=i+Math.round((s-i)/r)*r),Number.isFinite(n)&&(s=Math.max(n,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number(s.toFixed(En(e)))},$=(e,t)=>{const n=vn(e,t);return e.value=n.toFixed(En(e)),n},yt=(e,t)=>{const n=e.get(t);if(n===null)return null;const a=n.trim().toLowerCase();return["1","true","yes","on"].includes(a)?!0:["0","false","no","off"].includes(a)?!1:null},q=(e,t,n)=>{const a=e.get(t);if(a===null)return null;const r=Number(a);return Number.isFinite(r)?vn(n,r):null},hr=e=>{const t=e.get("skin")??e.get("theme");if(t===null)return null;const n=t.trim().toLowerCase();return n==="classic"?"classic":["themepark","theme-park","theme_park"].includes(n)?"themePark":null},w=()=>{const e=new URL(window.location.href);gr.forEach(a=>{e.searchParams.delete(a)}),T!=="zephyr"&&e.searchParams.set("word",T),ye!==rn&&e.searchParams.set("skin",ye==="themePark"?"theme-park":"classic"),R!==Lt&&e.searchParams.set("tolerance",String(R)),H!==Ct&&e.searchParams.set("animationSpeed",String(H)),O!==13&&e.searchParams.set("turnRadius",String(O)),U!==!0&&e.searchParams.set("offsetArrowLanes",U?"1":"0"),c.targetBendRate!==v.targetBendRate&&e.searchParams.set("targetBendRate",String(c.targetBendRate)),c.minSidebearingGap!==v.minSidebearingGap&&e.searchParams.set("minSidebearingGap",String(c.minSidebearingGap)),c.bendSearchMinSidebearingGap!==v.bendSearchMinSidebearingGap&&e.searchParams.set("bendSearchMinSidebearingGap",String(c.bendSearchMinSidebearingGap)),c.bendSearchMaxSidebearingGap!==v.bendSearchMaxSidebearingGap&&e.searchParams.set("bendSearchMaxSidebearingGap",String(c.bendSearchMaxSidebearingGap)),c.exitHandleScale!==v.exitHandleScale&&e.searchParams.set("exitHandleScale",String(c.exitHandleScale)),c.entryHandleScale!==v.entryHandleScale&&e.searchParams.set("entryHandleScale",String(c.entryHandleScale)),de!==!0&&e.searchParams.set("includeInitialLeadIn",de?"1":"0"),ue!==!0&&e.searchParams.set("includeFinalLeadOut",ue?"1":"0");const t=`${e.pathname}${e.search}${e.hash}`,n=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==n&&window.history.replaceState(null,"",t)};let Ht=-1,T="zephyr",B=null,o=null,M=null,W=null,bt=!1,ie=[],be=[],ae=null,Te=null,X=null,fe=null,x=!1,se=!1,R=Lt,H=Ct,O=13,U=!1,c={...v},de=!0,ue=!0,we=[],Ke=[],it=[],k=[],_=1,re=null,An=1600,ot=0,u=null,pe=[],N=null,oe=null,st=null,ct=[],ce=null,I=null,Me=null,z=null,Le=null,P=[],V=0,Ve=0,ke=0,lt=0,J=[],_e=!1,j=null,g="hidden",Q=null,le=null,Y=0,Ye=!1,L=!1,me=null,Jt=null,Ae=[],Dt=!1,je=null,Qt=null,De=[],It=!1,Pt=-1,Ie=Number.POSITIVE_INFINITY;const Dn=()=>{gn.textContent=`${R}px`},In=()=>{hn.textContent=`${O}px`},Pn=()=>{Sn.textContent=`${H.toFixed(2)}x`},he=()=>{mn.textContent=`${c.targetBendRate}`,fn.textContent=`${c.minSidebearingGap}`,_n.textContent=`${c.bendSearchMinSidebearingGap}`,yn.textContent=`${c.bendSearchMaxSidebearingGap}`,bn.textContent=c.exitHandleScale.toFixed(2),wn.textContent=c.entryHandleScale.toFixed(2)},Sr=()=>{Ne.value=T,R=$(Re,R),H=$(Oe,H),O=$(He,O),U=!!U,tt.checked=U,c={targetBendRate:$(Fe,c.targetBendRate),minSidebearingGap:$(Ge,c.minSidebearingGap),bendSearchMinSidebearingGap:$($e,c.bendSearchMinSidebearingGap),bendSearchMaxSidebearingGap:$(qe,c.bendSearchMaxSidebearingGap),exitHandleScale:$(Be,c.exitHandleScale),entryHandleScale:$(Ue,c.entryHandleScale)},at.checked=de,rt.checked=ue},G=()=>{T&&ht(T,Ht)},Tn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),mr=()=>{const e=new URLSearchParams(window.location.search),t=e.get("word");t!==null&&(T=Tn(t)),ye=hr(e)??ye,R=q(e,"tolerance",Re)??R,H=q(e,"animationSpeed",Oe)??H,O=q(e,"turnRadius",He)??O,U=yt(e,"offsetArrowLanes")??U,c={targetBendRate:q(e,"targetBendRate",Fe)??c.targetBendRate,minSidebearingGap:q(e,"minSidebearingGap",Ge)??c.minSidebearingGap,bendSearchMinSidebearingGap:q(e,"bendSearchMinSidebearingGap",$e)??c.bendSearchMinSidebearingGap,bendSearchMaxSidebearingGap:q(e,"bendSearchMaxSidebearingGap",qe)??c.bendSearchMaxSidebearingGap,exitHandleScale:q(e,"exitHandleScale",Be)??c.exitHandleScale,entryHandleScale:q(e,"entryHandleScale",Ue)??c.entryHandleScale},de=yt(e,"includeInitialLeadIn")??de,ue=yt(e,"includeFinalLeadOut")??ue,Sr(),Dn(),Pn(),In(),he(),Mn(),w()},Mn=()=>{const e=A();et.style.setProperty("--snake-board-image",`url("${e.boardImage}")`),et.style.setProperty("--snake-board-overlay",e.boardOverlay),dn.textContent=e.instruction,un.textContent=e.successEyebrow,nt.checked=e.id==="themePark"},Ot=()=>A().soundEffects,Ln=()=>{const e=A(),t=e.soundEffects;return je&&Qt===e.id||(je=t.moveSrcs.map(n=>{const a=new Audio(n);return a.preload="auto",a.volume=t.moveVolume,a}),Qt=e.id,It=!1),je},Cn=()=>{const e=A(),t=e.soundEffects;return me&&Jt===e.id||(me=new Audio(t.chompSrc),me.preload="auto",me.volume=t.chompVolume,Jt=e.id,Dt=!1),me},fr=()=>{const e=Cn();Dt||(e.load(),Dt=!0)},_r=()=>{const e=Ln();It||(e.forEach(t=>{t.load()}),It=!0)},yr=()=>{const e=Ot(),t=Cn(),n=t.currentSrc||t.src;if(!n)return;const a=new Audio(n);a.preload="auto",a.currentTime=0,a.volume=e.chompVolume,Ae.push(a),a.addEventListener("ended",()=>{Ae=Ae.filter(r=>r!==a)}),a.addEventListener("error",()=>{Ae=Ae.filter(r=>r!==a)}),a.play().catch(()=>{})},br=()=>{const e=Ot(),t=Ln(),n=t[Math.floor(Math.random()*t.length)],a=(n==null?void 0:n.currentSrc)||(n==null?void 0:n.src);if(!a)return;const r=new Audio(a);r.preload="auto",r.currentTime=0,r.volume=e.moveVolume,De.push(r),r.addEventListener("ended",()=>{De=De.filter(i=>i!==r)}),r.addEventListener("error",()=>{De=De.filter(i=>i!==r)}),r.play().catch(()=>{})},dt=()=>{const e=_>0?_-1:-1,t=e>=0?k[e]:null;Pt=e,Ie=t?t.startDistance+We():Number.POSITIVE_INFINITY},wr=e=>{if(!e.isPenDown||x||L)return;const t=_>0?_-1:-1,n=t>=0?k[t]:null;if(!n){Ie=Number.POSITIVE_INFINITY,Pt=t;return}t!==Pt&&dt();const a=ve(e);let r=!1;for(;a>=Ie&&Ie<=n.endDistance;)Math.random()<Ot().moveChance&&(r=!0),Ie+=We();r&&br()},xe=()=>{const e=x;Ke.forEach(t=>{const n=we[Number(t.dataset.fruitIndex)],a=e||!n||n.captured||n.sectionIndex>=_;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",a)}),pn.textContent=we.length===0?"Nice tracing.":A().successCopy},ge=e=>{kn.hidden=!e},Nn=()=>{const e=o==null?void 0:o.getState();if(!((e==null?void 0:e.status)!=="complete"||!_e)){if(J.length>0){ge(!1);return}ge(!0)}},Ft=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},Gt=e=>Math.atan2(e.y,e.x)*(180/Math.PI),kr=e=>(e%360+360)%360,xr=e=>{const t=kr(e);return t>90&&t<270},wt=(e,t)=>!e.upsideDown||!xr(t+e.metrics.rotationOffset)?e:e.upsideDown,Er=e=>{const t=e.querySelector(".writing-app__snake-head"),n=(t==null?void 0:t.querySelector("image"))??null,a=e.querySelector(".writing-app__snake-tail"),r=Array.from(e.querySelectorAll(".writing-app__snake-body")).sort((i,s)=>Number(i.dataset.snakeBodyIndex)-Number(s.dataset.snakeBodyIndex));return!t||!n||!a?null:{layerEl:e,headEl:t,headImageEl:n,bodyEls:r,tailEl:a}},vr=()=>!N||!oe||!st||!ce?null:{layerEl:N,headEl:oe,headImageEl:st,bodyEls:ct,tailEl:ce},Ar=e=>{e.removeAttribute("id"),e.querySelectorAll("[id]").forEach(t=>{t.removeAttribute("id")})},$t=()=>{Ye=!1,L=!1},Rn=()=>{if(!L||!Ye||M===null||!W||!o)return!1;const e=o.getState();return e.status==="tracing"||o.beginAt(e.cursorPoint)?($t(),o.update(W),b(),!0):!1},ee=e=>(u==null?void 0:u.strokes[e.activeStrokeIndex])??null,Dr=e=>pe[e.activeStrokeIndex]??null,Ir=e=>{const t=u==null?void 0:u.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},ve=e=>{var n;if(!u)return 0;if(e.status==="complete")return ot;let t=0;for(let a=0;a<e.activeStrokeIndex;a+=1)t+=((n=u.strokes[a])==null?void 0:n.totalLength)??0;return t+Ir(e)},Pr=e=>{const t=u;return t?e.isPenDown&&e.activeStrokeIndex>=0?ve({status:"tracing",activeStrokeIndex:e.activeStrokeIndex,activeStrokeProgress:e.activeStrokeProgress}):e.completedStrokes.reduce((n,a)=>{var r;return n+(((r=t.strokes[a])==null?void 0:r.totalLength)??0)},0):0},Tr=e=>{if(!u)return e.cursorTangent;const t=ve(e),n=[...u.boundaries].reverse().find(a=>a.previousSegment!==a.nextSegment&&a.turnAngleDegrees>=150&&t>=a.overallDistance-pr&&t-a.overallDistance<ur);return(n==null?void 0:n.outgoingTangent)??e.cursorTangent},Ee=e=>{var t;return((t=Dr(e))==null?void 0:t.deferred)===!0},Tt=e=>{var t;return((t=pe[e.strokeIndex])==null?void 0:t.deferred)===!0},Ze=()=>{const e=_>0?_-1:-1;return e>=0?k[e]??null:null},qt=(e,t,n)=>{const a=Math.max(0,Math.floor(e/n)),r=Math.min(t,a);return{bodyCount:r,showTail:e>=(r+1)*n}},Hn=e=>{var t;return x||e.status==="complete"||!Ee(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=ee(e))==null?void 0:t.isDot)===!0}},Mr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===Q&&((n=ee(t))==null?void 0:n.isDot)===!0&&g!=="hidden"&&g!=="waiting"},F=()=>{j!==null&&(cancelAnimationFrame(j),j=null),g="hidden",Q=null,le=null,I&&(I.style.opacity="0",I.classList.remove("writing-app__dot-snake--waiting")),z&&(z.style.opacity="0")},Lr=e=>({x:e.x,y:e.y-ir}),Cr=e=>({x:e.x,y:e.y+8}),On=(e=performance.now())=>{if(g==="hidden"||!le)return null;const t=A(),n=Cr(le),a=Lr(le);if(g==="waiting")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!0};if(g==="eagle_in"){const l=Math.max(0,Math.min(1,(e-Y)/cn)),m=1-(1-l)*(1-l);return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:{x:a.x,y:-106+(a.y+ne.height)*m},eagleHref:xt,eagleWidth:ne.width,eagleHeight:ne.height}}if(g==="eagle_stand")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:a,eagleHref:pa,eagleWidth:Qe.width,eagleHeight:Qe.height};const r=Math.max(0,Math.min(1,(e-Y)/ln)),i=1-(1-r)*(1-r),s={x:a.x+(An+ne.width-a.x)*i,y:a.y+(-106-a.y)*i};return{snakePoint:{x:s.x,y:s.y+ne.height*.6},snakeHref:t.dotTarget.angryHref,snakeWobble:!1,eaglePoint:s,eagleHref:xt,eagleWidth:ne.width,eagleHeight:ne.height}},Fn=()=>{var t;const e=o==null?void 0:o.getState();if(!(!o||!e)&&Q!==null&&e.activeStrokeIndex===Q&&(t=ee(e))!=null&&t.isDot){o.beginAt(e.cursorPoint);const n=o.getState();Zn(ve(n)),Wn(n)}},Nr=()=>{Fn(),F(),b()},Gn=e=>{if(j=null,!(g==="hidden"||g==="waiting")){if(g==="eagle_in"&&e-Y>=cn)g="eagle_stand",Y=e;else if(g==="eagle_stand"&&e-Y>=rr)g="eagle_out",Y=e;else if(g==="eagle_out"&&e-Y>=ln){Nr();return}b(),j=requestAnimationFrame(Gn)}},Rr=()=>{g==="waiting"&&(Fn(),g="eagle_in",Y=performance.now(),j!==null&&cancelAnimationFrame(j),j=requestAnimationFrame(Gn),b())},Hr=e=>{const t=Hn(e);if(!(t!=null&&t.isDot)){if(g!=="hidden"&&g!=="waiting")return;F();return}Q!==t.strokeIndex?(F(),Q=t.strokeIndex,le=t.point,g="waiting"):g==="waiting"&&(le=t.point)},$n=(e=performance.now())=>{if(!I||!Me||!z||!Le)return;const t=On(e);if(!t){I.style.opacity="0",I.classList.remove("writing-app__dot-snake--waiting"),z.style.opacity="0";return}const n=A().dotTarget.metrics;if(I.style.opacity="1",I.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Me.setAttribute("href",t.snakeHref),Ce(I,Me,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},n.width,n.height,n.anchorX,n.anchorY,n.rotationOffset),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){z.style.opacity="0";return}Le.setAttribute("href",t.eagleHref),Ce(z,Le,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Qe.anchorX,Qe.anchorY,0)},Or=(e,t)=>{const n=Hn(t);if(!n)return!1;if(n.isDot){if(g!=="waiting")return!1;const r=On();if(!r)return!1;const i=A().dotTarget.metrics,s=Math.max(i.width,i.height)*sr;return Math.hypot(e.x-r.snakePoint.x,e.y-r.snakePoint.y)<=s}const a=Math.max(34,A().head.metrics.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=a},en=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let a=1;a<e.length;a+=1){const r=e[a-1],i=e[a];if(!r||!i||t>i.distanceAlongStroke)continue;const s=i.distanceAlongStroke-r.distanceAlongStroke,l=s>0?(t-r.distanceAlongStroke)/s:0;return{x:r.x+(i.x-r.x)*l,y:r.y+(i.y-r.y)*l}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Fr=(e,t,n)=>{if(n<=t)return"";const a=[];let r=0;return e.strokes.forEach(i=>{const s=r,l=r+i.totalLength;if(r=l,n<s||t>l)return;const m=Math.max(0,t-s),h=Math.min(i.totalLength,n-s);if(h<m||i.samples.length===0)return;const E=[en(i.samples,m),...i.samples.filter(S=>S.distanceAlongStroke>m&&S.distanceAlongStroke<h).map(S=>({x:S.x,y:S.y})),en(i.samples,h)],f=E.filter((S,te)=>{const C=E[te-1];return!C||Math.hypot(S.x-C.x,S.y-C.y)>.01});if(f.length===0)return;const[p,...y]=f;a.push(`M ${p.x} ${p.y}`),y.forEach(S=>{a.push(`L ${S.x} ${S.y}`)})}),a.join(" ")},qn=(e,t,n)=>{const a=e.strokes[t.strokeIndex],r=n[t.strokeIndex];return a!=null&&a.isDot&&r?nn(r.curves):Fr(e,t.startDistance,t.endDistance)},Gr=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),$r=e=>`writing-app__section-arrow writing-app__section-arrow--white writing-app__section-arrow--${e.kind}`,qr=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),Br=e=>e.kind==="draw-order-number"?"":`
    <path
      class="${$r(e)}"
      d="${ua(e.commands)}"
    ></path>
    ${qr(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white writing-app__section-arrowhead--${e.kind}" points="${Gr(t.polygon)}"></polygon>`).join("")}
  `,ze=()=>{if(!Te||!u||!B)return;const e=Ze();if(!e){X=null,Te.innerHTML="";return}if(X===e.index)return;const t=Math.abs(B.guides.baseline-B.guides.xHeight)/3,n=U?O:0,a=da(u,{sections:[e],drawOrderNumbers:!1,startArrows:{length:t*.42,minLength:t*.18,offset:n,head:{length:mt,width:ft,tipExtension:_t}},midpointArrows:{density:lr,length:t*.36,offset:n,head:{length:mt,width:ft,tipExtension:_t}},turningPoints:{offset:O,stemLength:t*.36,head:{length:mt,width:ft,tipExtension:_t},groups:it}}).filter(r=>r.kind!=="turning-point"||Math.abs(r.source.turnDistance-e.endDistance)<=dr);Te.innerHTML=a.map(Br).join(""),X=e.index},Bn=()=>{if(!ae||!u)return;const e=Ze();if(!e){ae.setAttribute("d",""),ae.style.opacity="0";return}ae.setAttribute("d",qn(u,e,pe)),ae.style.opacity="1"},Ur=()=>{_=Math.min(_+1,k.length),zn(),xe(),ze(),dt()},Un=(e,t)=>{const n=e.endDistance-e.startDistance;return t.startReason==="stroke-start"?.1:Math.min(8,Math.max(.1,n*.25))},Vn=(e,t,n={})=>{var s,l;const a=Tt(e),r=((s=u==null?void 0:u.strokes[e.strokeIndex])==null?void 0:s.isDot)===!0,i=((l=u==null?void 0:u.strokes[t.strokeIndex])==null?void 0:l.isDot)===!0;return(!a||!r)&&(gt(e.endPoint,e.endTangent,!0),Ut()),Ur(),pt(t.startPoint,t.startTangent,!i,{preserveGrowth:n.preserveGrowth}),{nextSectionDeferred:Tt(t),nextSectionIsDot:i}},Wn=e=>{if(x||L||k.length<=_)return!1;const t=Ze(),n=k[_];if(!t||!n)return!1;const a=ve(e),r=Un(t,n);if(a<t.endDistance-r)return!1;o==null||o.end();const{nextSectionDeferred:i}=Vn(t,n,{preserveGrowth:!0});return i?($t(),b(),!0):(L=!0,Ye=n.startReason==="retrace-turn",Rn(),b(),!0)},Vr=(e,t)=>t.slice(0,-1).map(n=>({x:n.endPoint.x,y:n.endPoint.y,pathDistance:n.endDistance,emoji:$a,captured:!1,sectionIndex:n.index})),Kn=()=>{_=k.length>0?1:0,X=null,ze(),we.forEach(e=>{e.captured=!1}),Ke.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),zn(),xe()},Bt=()=>Wr(Ve),Wr=e=>{const t=Math.max(3,Math.min(Et,Math.floor(ot/jt)));return Math.min(t,1+Math.floor(e/jt))},Ce=(e,t,n,a,r,i,s,l)=>{t.setAttribute("x",`${(-a*i).toFixed(2)}`),t.setAttribute("y",`${(-r*s).toFixed(2)}`),t.setAttribute("width",`${a}`),t.setAttribute("height",`${r}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+l).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},kt=(e,t,n=()=>null)=>{const a=e[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(t<0){const i=a.angle*Math.PI/180;return{...a,x:a.x+Math.cos(i)*t,y:a.y+Math.sin(i)*t,distance:t}}if(e.length<=1||t<=0)return{...a,distance:Math.max(0,t)};for(let i=1;i<e.length;i+=1){const s=e[i-1],l=e[i];if(!s||!l||t>l.distance)continue;const m=l.distance-s.distance,h=m>0?(t-s.distance)/m:0,E=s.x+(l.x-s.x)*h,f=s.y+(l.y-s.y)*h,p=n(t);return{x:E,y:f,angle:p??Gt({x:l.x-s.x,y:l.y-s.y}),distance:t,visible:l.visible}}return{...e[e.length-1]??a,distance:t}},ut=()=>{oe==null||oe.style.setProperty("opacity","0"),ce==null||ce.style.setProperty("opacity","0"),ct.forEach(e=>{e.style.opacity="0"})},Yn=(e,t,n=performance.now())=>{if(t.trail.length===0){e.layerEl.style.opacity="0";return}e.layerEl.style.opacity="1";const a=A(),r=t.segmentSpacing??a.segmentSpacing,i=qt(t.headDistance,t.bodyCount,r),s=i.bodyCount,l=D=>t.headDistance+t.retractionDistance-D,m=D=>Math.max(0,Math.min(t.headDistance,D)),h=D=>t.retractionDistance>0&&D>=t.headDistance-Ya,E=kt(t.trail,Math.min(t.headDistance,l(0)),t.getAngleOverride),f=wt(a.head,t.headAngle);e.headImageEl.setAttribute("href",n<(t.chewUntil??0)&&f===a.head?a.head.chewHref:f.href),Ce(e.headEl,e.headImageEl,{...E,angle:t.headAngle,visible:!h(l(0))},f.metrics.width,f.metrics.height,f.metrics.anchorX,f.metrics.anchorY,f.metrics.rotationOffset),e.bodyEls.forEach((D,Wt)=>{if(Wt>=s){D.style.opacity="0";return}const St=D.querySelector("image");if(!St)return;const jn=(Wt+1)*r,Kt=l(jn);if(h(Kt)){D.style.opacity="0";return}const Yt=kt(t.trail,m(Kt),t.getAngleOverride),Jn=a.bodySprites.find(Qn=>Qn.id===D.dataset.snakeBodyVariant)??a.bodySprites[0]??Nt.classic.bodySprites[0],Se=wt(Jn,Yt.angle);St.setAttribute("href",Se.href),Ce(D,St,Yt,Se.metrics.width,Se.metrics.height,Se.metrics.anchorX,Se.metrics.anchorY,Se.metrics.rotationOffset)});const p=e.tailEl.querySelector("image");if(!p)return;if(t.showTail===!1){e.tailEl.style.opacity="0";return}const y=(s+1)*r,S=l(y);if(!i.showTail||h(S)){e.tailEl.style.opacity="0";return}const te=kt(t.trail,m(S),t.getAngleOverride),C=wt(a.tail,te.angle);p.setAttribute("href",C.href),Ce(e.tailEl,p,te,C.metrics.width,C.metrics.height,C.metrics.anchorX,C.metrics.anchorY,C.metrics.rotationOffset)},K=(e=performance.now())=>{var s,l;const t=vr();if(!t)return;const n=o==null?void 0:o.getState();if(g!=="hidden"&&n!==void 0&&Q===n.activeStrokeIndex||n!==void 0&&((s=ee(n))==null?void 0:s.isDot)===!0){ut();return}const r=se||n!==void 0&&Ee(n)&&((l=ee(n))==null?void 0:l.isDot)!==!0,i=r&&n!==void 0?Rt(n):We();Yn(t,{trail:P,headDistance:V,headAngle:ke,bodyCount:r?1:Bt(),segmentSpacing:i,retractionDistance:0,chewUntil:lt,showTail:!0},e)},Kr=e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove(),J=J.filter(t=>t!==e),Nn()},Mt=e=>{Yn(e.parts,{trail:e.trail,headDistance:e.headDistance,headAngle:e.headAngle,bodyCount:e.bodyCount,segmentSpacing:e.segmentSpacing,retractionDistance:e.retractionDistance,showTail:e.showTail})},Yr=(e={})=>{const t=e.isShortDeferredSnake?1:Bt(),n=e.isShortDeferredSnake?Rt({activeStrokeIndex:(o==null?void 0:o.getState().activeStrokeIndex)??0}):We();return(qt(V,t,n).bodyCount+1)*n/sn*1e3},Zr=e=>{let t=null;const n=a=>{if(!J.includes(e))return;if(t===null){t=a,e.animationFrameId=requestAnimationFrame(n);return}const r=Math.max(0,a-t)/1e3;t=a;const i=r*sn,s=e.retractionTarget-e.retractionDistance;if(Math.abs(s)<=i){e.retractionDistance=e.retractionTarget,Mt(e),Kr(e);return}e.retractionDistance+=Math.sign(s)*i,Mt(e),e.animationFrameId=requestAnimationFrame(n)};e.animationFrameId=requestAnimationFrame(n)},Ut=()=>{var h;const e=N==null?void 0:N.parentElement;if(!N||!e||P.length===0)return;const t=N.cloneNode(!0);Ar(t),t.classList.add("writing-app__snake--retiring"),e.insertBefore(t,N);const n=Er(t);if(!n){t.remove();return}const a=o==null?void 0:o.getState(),r=a!==void 0&&Ee(a)&&((h=ee(a))==null?void 0:h.isDot)!==!0,i=r?1:Bt(),s=r?Rt(a):We(),l=qt(V,i,s).bodyCount,m={parts:n,trail:P.map(E=>({...E})),headDistance:V,headAngle:ke,bodyCount:i,segmentSpacing:s,retractionDistance:0,retractionTarget:(l+1)*s,showTail:!0,animationFrameId:null};J.push(m),Mt(m),Zr(m)},Vt=()=>{J.forEach(e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove()}),J=[]},pt=(e,t,n=!0,a={})=>{const r=Ft(t),i=a.preserveGrowth?Ve:0;ke=Gt(r),P=[{x:e.x,y:e.y,angle:ke,distance:0,visible:n}],V=0,Ve=i,lt=0,Ye=!1,L=!1,K()},gt=(e,t,n)=>{const a=Ft(t),r=Gt(a);ke=r;const i=P[P.length-1];if(!i){pt(e,a,n);return}const s=Math.hypot(e.x-i.x,e.y-i.y);if(s<.5){i.visible===n?P[P.length-1]={...i,x:e.x,y:e.y,angle:r}:(P.push({x:e.x,y:e.y,angle:r,distance:i.distance+.001,visible:n}),V=i.distance+.001),K();return}V=i.distance+s,Ve+=s,P.push({x:e.x,y:e.y,angle:r,distance:V,visible:n}),K()},Zn=e=>{let t=!1;we.forEach((n,a)=>{if(n.captured||n.sectionIndex>=_||e+.5<n.pathDistance)return;n.captured=!0;const r=Ke[a];r&&r.classList.add("writing-app__fruit--captured"),t=!0}),t&&(lt=performance.now()+Ka,yr(),xe(),K())},zn=()=>{if(!re)return;const e=Ze();if(!e||Tt(e)){re.classList.add("writing-app__boundary-star--hidden");return}re.classList.remove("writing-app__boundary-star--hidden"),re.setAttribute("x",`${e.endPoint.x}`),re.setAttribute("y",`${e.endPoint.y}`)},zr=e=>{var t;if(x||Zn(ve(e)),!(!x&&Wn(e))){if(Ee(e)&&((t=ee(e))==null?void 0:t.isDot)===!0){K();return}gt(e.cursorPoint,Tr(e),!0),!x&&e.isPenDown&&wr(e)}},Xn=()=>{fe!==null&&(cancelAnimationFrame(fe),fe=null),x=!1,se=!1,Z.disabled=!1,Z.textContent="Animate",xe(),K(),b()},tn=()=>{o==null||o.reset(),M=null,W=null,_e=!1,ge(!1),se=!1,F(),Vt(),ie.forEach((t,n)=>{const a=be[n]??.001;t.style.strokeDasharray=`${a} ${a}`,t.style.strokeDashoffset=`${a}`}),Ye=!1,L=!1;const e=o==null?void 0:o.getState();e?pt(e.cursorPoint,e.cursorTangent,!0):ut(),Kn(),dt(),b()},b=()=>{bt||(bt=!0,requestAnimationFrame(()=>{bt=!1,Xr()}))},Xr=()=>{if(!o)return;const e=o.getState();Hr(e),$n(),Bn(),ze();const t=new Set(e.completedStrokes);if(ie.forEach((n,a)=>{const r=be[a]??0;if(t.has(a)||Mr(a,e)){n.style.strokeDashoffset="0";return}if(a===e.activeStrokeIndex){const i=r*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,i)}`;return}n.style.strokeDashoffset=`${r}`}),e.status==="complete"){_e||(_e=!0,gt(e.cursorPoint,e.cursorTangent,!0),Ut()),ut(),Nn();return}!x&&!L?zr(e):K(),_e=!1,ge(!1)},jr=(e,t)=>Math.hypot(e.velocity.x,e.velocity.y)<=.001?t:Ft(e.velocity),Jr=e=>{const t=new Set(e.completedStrokes);ie.forEach((n,a)=>{const r=be[a]??.001;if(t.has(a)){n.style.strokeDashoffset="0";return}if(a===e.activeStrokeIndex){const i=r*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,i)}`;return}n.style.strokeDashoffset=`${r}`})},Qr=(e,t)=>{const n=pe[e.activeStrokeIndex],a=u==null?void 0:u.strokes[e.activeStrokeIndex];return!(n!=null&&n.deferred)||e.activeStrokeIndex<0||!e.isPenDown?(se=!1,F(),!1):a!=null&&a.isDot?(se=!1,Q=e.activeStrokeIndex,le=e.point,g="waiting",$n(),!0):(F(),se=!0,!1)},ei=e=>{let t=!1;const n=Pr(e);for(;k.length>_;){const a=Ze(),r=k[_];if(!a||!r)break;const i=Un(a,r);if(n<a.endDistance-i)break;Vn(a,r,{preserveGrowth:!0}),t=!0}return t},ti=()=>{if(!B||x)return;tn(),Xn();const e=new ca(B,{speed:1.7*H,penUpSpeed:2.1*H,deferredDelayMs:150});x=!0,Z.disabled=!0,Z.textContent="Animating...",xe(),K();const t=performance.now();let n=(o==null?void 0:o.getState().cursorTangent)??{x:1,y:0},a=!1,r=e.totalDuration+Zt;const i=s=>{const l=s-t,m=Math.min(l,e.totalDuration),h=e.getFrame(m),E=jr(h,n);ei(h);const f=Qr(h);if(Jr(h),h.isPenDown&&!f?(gt(h.point,E,!0),n=E):K(),!a&&l>=e.totalDuration&&(a=!0,r=e.totalDuration+Math.max(Zt,Yr({isShortDeferredSnake:se})),F(),Ut(),ut()),l<r||J.length>0){fe=requestAnimationFrame(i);return}fe=null,F(),x=!1,Z.disabled=!1,Z.textContent="Animate",xe(),tn()};fe=requestAnimationFrame(i),b()},ni=e=>{const t=e.bodySprites[0]??Nt.classic.bodySprites[0],n=e.bodySprites[1];return e.id==="themePark"&&e.bodySprites.length>1?e.bodySprites[Math.floor(Math.random()*e.bodySprites.length)]??t:!n||Math.random()>=Ba?t:n},ai=(e,t,n,a)=>{Vt(),An=t;const r=A(),i=ra(e);u=i,pe=e.strokes.filter(p=>p.type!=="lift"),ot=i.strokes.reduce((p,y)=>p+y.totalLength,0),it=ia(i).groups,k=la(i,{groups:it}).sections,_=k.length>0?1:0,o=new oa(i,{startTolerance:R,hitTolerance:R}),M=null,we=Vr(i,k);const l=pe,m=k.map(p=>`<path class="writing-app__stroke-bg" d="${qn(i,p,l)}"></path>`).join(""),h=l.map(p=>`<path class="writing-app__stroke-trace" d="${nn(p.curves)}"></path>`).join(""),E=Array.from({length:Et},(p,y)=>{const S=Et-1-y,te=ni(r);return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${S}"
        data-snake-body-variant="${te.id}"
      >
        <image
          href="${te.href}"
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
    ${h}
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
      ${E}
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
        href="${xt}"
        preserveAspectRatio="none"
      ></image>
    </g>
  `,ie=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),ae=d.querySelector("#next-section-stroke"),Te=d.querySelector("#section-annotations"),X=null,Ke=Array.from(d.querySelectorAll(".writing-app__fruit")),re=d.querySelector("#waypoint-star"),N=d.querySelector("#trace-snake"),oe=d.querySelector("#snake-head"),st=d.querySelector("#snake-head-image"),ce=d.querySelector("#snake-tail"),ct=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((p,y)=>Number(p.dataset.snakeBodyIndex)-Number(y.dataset.snakeBodyIndex)),I=d.querySelector("#dot-snake"),Me=d.querySelector("#dot-snake-image"),z=d.querySelector("#dot-eagle"),Le=d.querySelector("#dot-eagle-image"),be=ie.map(p=>{const y=p.getTotalLength();return Number.isFinite(y)&&y>0?y:.001}),ie.forEach((p,y)=>{const S=be[y]??.001;p.style.strokeDasharray=`${S} ${S}`,p.style.strokeDashoffset=`${S}`}),Bn();const f=o.getState();pt(f.cursorPoint,f.cursorTangent),F(),Kn(),dt(),_e=!1,ge(!1),b()},ht=(e,t=-1)=>{if(Xn(),T=Tn(e),Ht=t,Ne.value=T,w(),T.length===0){B=null,o=null,u=null,M=null,W=null,ie=[],be=[],ae=null,Te=null,X=null,we=[],Ke=[],it=[],k=[],_=1,re=null,ot=0,pe=[],N=null,oe=null,st=null,ct=[],ce=null,I=null,Me=null,z=null,Le=null,P=[],V=0,Ve=0,ke=0,lt=0,Vt(),F(),d.innerHTML="",ge(!1);return}try{const n=aa(T,{joinSpacing:c,keepInitialLeadIn:de,keepFinalLeadOut:ue});B=n.path,ai(n.path,n.width,n.height,n.offsetY)}catch{B=null,o=null,u=null,d.innerHTML="",ge(!1)}},ri=(e,t=-1)=>(ht(e,t),B!==null),ii=()=>{const e=sa(Ht);ri(zt[e]??zt[0],e)},si=e=>{if(x||!o||M!==null)return;const t=an(d,e),n=o.getState(),a=ee(n),r=L;if(Ee(n)&&!Or(t,n))return;if(Ee(n)&&(a!=null&&a.isDot)){e.preventDefault(),Rr();return}o.beginAt(t)&&(e.preventDefault(),M=e.pointerId,W=t,fr(),_r(),r?$t():r||(L=!1),d.setPointerCapture(e.pointerId),b())},oi=e=>{if(!(x||!o||e.pointerId!==M)){if(e.preventDefault(),W=an(d,e),L){Rn(),b();return}o.update(W),b()}},ci=e=>{!o||e.pointerId!==M||(o.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),M=null,W=null,b())},li=e=>{e.pointerId===M&&(o==null||o.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),M=null,W=null,b())};d.addEventListener("pointerdown",si);d.addEventListener("pointermove",oi);d.addEventListener("pointerup",ci);d.addEventListener("pointercancel",li);Z.addEventListener("click",ti);Re.addEventListener("input",()=>{R=Number(Re.value),Dn(),w(),G()});Oe.addEventListener("input",()=>{H=Number(Oe.value),Pn(),w()});He.addEventListener("input",()=>{O=Number(He.value),In(),w(),X=null,ze()});tt.addEventListener("change",()=>{U=tt.checked,w(),X=null,ze()});nt.addEventListener("change",()=>{ye=nt.checked?"themePark":"classic",Mn(),w(),G()});Fe.addEventListener("input",()=>{c={...c,targetBendRate:Number(Fe.value)},he(),w(),G()});Ge.addEventListener("input",()=>{c={...c,minSidebearingGap:Number(Ge.value)},he(),w(),G()});$e.addEventListener("input",()=>{c={...c,bendSearchMinSidebearingGap:Number($e.value)},he(),w(),G()});qe.addEventListener("input",()=>{c={...c,bendSearchMaxSidebearingGap:Number(qe.value)},he(),w(),G()});Be.addEventListener("input",()=>{c={...c,exitHandleScale:Number(Be.value)},he(),w(),G()});Ue.addEventListener("input",()=>{c={...c,entryHandleScale:Number(Ue.value)},he(),w(),G()});at.addEventListener("change",()=>{de=at.checked,w(),G()});rt.addEventListener("change",()=>{ue=rt.checked,w(),G()});xn.addEventListener("click",ii);Ne.addEventListener("input",()=>{ht(Ne.value)});document.addEventListener("pointerdown",e=>{if(!Pe.open)return;const t=e.target;t instanceof Node&&Pe.contains(t)||(Pe.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(Pe.open=!1)});mr();ht(T);
