import{M as pa,k as ga,T as ha,h as ma,W as Jt,b as Sa,c as fa,l as _a,a as dn,j as en,i as un}from"./shared-Dy72Hgrs.js";import{T as ya,A as ba}from"./session-DBZPHQUZ.js";import{b as wa,c as ka,a as xa}from"./annotations-C9tUWXB9.js";const bt="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Ea="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",va="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",Aa="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Da="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",Ia="/letterpaths/writing_app/assets/background-BdaS-6aw.png",Pa="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",Ta="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Ma="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",Ca="/letterpaths/writing_app/assets/head-CeHhv_vT.png",La="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",Na="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Ra="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Ha="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Oa="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Fa="/letterpaths/writing_app/assets/theme_park_bg-DOpd8-Mt.png",Ga="/letterpaths/writing_app/assets/carriage_1-DC6yaVQC.png",$a="/letterpaths/writing_app/assets/carriage_1_upside_down-BG5QUuxQ.png",qa="/letterpaths/writing_app/assets/carriage_2-Bq0wDmtr.png",Ba="/letterpaths/writing_app/assets/carriage_2_upside_down-_Cm6VEPW.png",Ve="/letterpaths/writing_app/assets/front-DZihS2IP.png",Wa="/letterpaths/writing_app/assets/front_upside_down-Z8CFqsTv.png",Ua="/letterpaths/writing_app/assets/rear-BWZZF1JA.png",Va="/letterpaths/writing_app/assets/rear_upside_down-DZY4fDcB.png",Ka="/letterpaths/writing_app/assets/rollercoaster_scream-Cnz9sZHr.mp3",Ya="/letterpaths/writing_app/assets/rollercoaster_track_1-CQOQytx_.mp3",Za="/letterpaths/writing_app/assets/rollercoaster_track_2-DRqX5yMO.mp3",tn="G-94373ZKHEE",Xa=new Set(["localhost","127.0.0.1"]),za=()=>{if(Xa.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",tn);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${tn}`,document.head.append(e)},ja=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},Qa="🍎",Nt=150,pn="classic",Rt=.7,Ja=76,nn=115,er=.25,tr=.3,nr=.12,ar=.42,wt=10,rr=220,gn=700,ir=6,sr=44,or=56,cr={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},kt={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},lr={...kt,height:kt.height*(209/431/(160/435))},dr={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},ur={width:69,height:49,anchorX:.5,anchorY:.62,rotationOffset:0},xt={width:94,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},pr={...xt,height:79.3},ze={width:100,height:82.8,anchorX:.5,anchorY:.54,rotationOffset:0},gr={...ze,height:87.9},hr={...ze,height:87.7},hn={width:92,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},mr={...hn,height:79.9},mn=700,Sr=260,Sn=800,fr=18,_r=.72,Q={width:200,height:106},je={width:128,height:141,anchorX:.5,anchorY:1},yr=[Na,Ra,Ha,Oa],br=[Ya,Za],gt=26,ht=22,mt=11,wr=250,kr=.5,xr=12,Er=2,E={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},vr=["skin","theme","tolerance","animationSpeed","turnRadius","offsetArrowLanes","targetBendRate","minSidebearingGap","bendSearchMinSidebearingGap","bendSearchMaxSidebearingGap","exitHandleScale","entryHandleScale","includeInitialLeadIn","includeFinalLeadOut"],Ht={classic:{id:"classic",boardImage:Ia,boardOverlay:"linear-gradient(180deg, rgba(255, 252, 244, 0.72), rgba(255, 248, 235, 0.86))",instruction:"Drag the snake around the letters.",successEyebrow:"Snake fed!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:va,chompVolume:tr,moveSrcs:yr,moveVolume:nr,moveChance:ar},segmentSpacing:Ja,deferredSegmentSpacing:sr,head:{href:Ca,chewHref:Ma,metrics:cr},bodySprites:[{id:"body",href:Aa,metrics:kt},{id:"body-bulge",href:Da,metrics:lr}],tail:{href:La,metrics:dr},dotTarget:{happyHref:Ta,angryHref:Pa,metrics:ur}},themePark:{id:"themePark",boardImage:Fa,boardOverlay:"linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 249, 230, 0.78))",instruction:"Drag the rollercoaster around the letters.",successEyebrow:"Ride complete!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:Ka,chompVolume:.2,moveSrcs:br,moveVolume:.1,moveChance:.36},segmentSpacing:106,deferredSegmentSpacing:or,head:{href:Ve,chewHref:Ve,metrics:xt,upsideDown:{href:Wa,metrics:pr}},bodySprites:[{id:"carriage-1",href:Ga,metrics:ze,upsideDown:{href:$a,metrics:gr}},{id:"carriage-2",href:qa,metrics:ze,upsideDown:{href:Ba,metrics:hr}}],tail:{href:Ua,metrics:hn,upsideDown:{href:Va,metrics:mr}},dotTarget:{happyHref:Ve,angryHref:Ve,metrics:xt}}};let Se=pn;const A=()=>Ht[Se],qe=()=>A().segmentSpacing,Ot=e=>{var a;const t=((a=u==null?void 0:u.strokes[e.activeStrokeIndex])==null?void 0:a.totalLength)??0,n=t>0?t/3:Number.POSITIVE_INFINITY;return Math.max(1,Math.min(A().deferredSegmentSpacing,n))},Qe=document.querySelector("#app");if(!Qe)throw new Error("Missing #app element for snake app.");za();ja();Qe.innerHTML=`
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow" id="snake-instruction">Drag the snake around the letters.</p>
            <h1 class="writing-app__word" id="word-label"></h1>
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
                    min="${pa}"
                    max="${ga}"
                    step="${ha}"
                    value="${Nt}"
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
                    value="${Rt}"
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
                    value="${E.targetBendRate}"
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
                    value="${E.minSidebearingGap}"
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
                    value="${E.bendSearchMinSidebearingGap}"
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
                    value="${E.bendSearchMaxSidebearingGap}"
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
                    value="${E.exitHandleScale}"
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
                    value="${E.entryHandleScale}"
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
            <form class="writing-app__success-form" id="custom-word-form" autocomplete="off">
              <label class="writing-app__success-label" for="custom-word-input">Custom word</label>
              <input
                class="writing-app__success-input"
                id="custom-word-input"
                type="search"
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
                inputmode="search"
                enterkeyhint="search"
                spellcheck="false"
                placeholder="Type a word"
              />
              <p class="writing-app__success-error" id="custom-word-error" hidden></p>
              <div class="writing-app__success-actions">
                <button class="writing-app__button" type="submit">Play custom word</button>
                <button
                  class="writing-app__button writing-app__button--secondary writing-app__button--next"
                  id="next-word-button"
                  type="button"
                >
                  Next random word
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
`;const fn=document.querySelector("#word-label"),_n=document.querySelector("#snake-instruction"),yn=document.querySelector("#success-eyebrow"),bn=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),U=document.querySelector("#show-me-button"),ve=document.querySelector("#settings-menu"),Ie=document.querySelector("#tolerance-slider"),wn=document.querySelector("#tolerance-value"),Pe=document.querySelector("#turn-radius-slider"),kn=document.querySelector("#turn-radius-value"),Te=document.querySelector("#animation-speed-slider"),xn=document.querySelector("#animation-speed-value"),Je=document.querySelector("#offset-arrow-lanes"),et=document.querySelector("#theme-park-toggle"),Me=document.querySelector("#target-bend-rate-slider"),En=document.querySelector("#target-bend-rate-value"),Ce=document.querySelector("#min-sidebearing-gap-slider"),vn=document.querySelector("#min-sidebearing-gap-value"),Le=document.querySelector("#bend-search-min-sidebearing-gap-slider"),An=document.querySelector("#bend-search-min-sidebearing-gap-value"),Ne=document.querySelector("#bend-search-max-sidebearing-gap-slider"),Dn=document.querySelector("#bend-search-max-sidebearing-gap-value"),Re=document.querySelector("#exit-handle-scale-slider"),In=document.querySelector("#exit-handle-scale-value"),He=document.querySelector("#entry-handle-scale-slider"),Pn=document.querySelector("#entry-handle-scale-value"),tt=document.querySelector("#include-initial-lead-in"),nt=document.querySelector("#include-final-lead-out"),Tn=document.querySelector("#success-overlay"),Mn=document.querySelector("#custom-word-form"),st=document.querySelector("#custom-word-input"),fe=document.querySelector("#custom-word-error"),Ft=document.querySelector("#next-word-button");if(!fn||!_n||!yn||!bn||!d||!U||!ve||!Ie||!wn||!Pe||!kn||!Te||!xn||!Je||!et||!Me||!En||!Ce||!vn||!Le||!An||!Ne||!Dn||!Re||!In||!He||!Pn||!tt||!nt||!Tn||!Mn||!st||!fe||!Ft)throw new Error("Missing elements for snake app.");const Cn=e=>{if(e.step==="any"||e.step.length===0)return 0;const[,t=""]=e.step.split(".");return t.length},Ln=(e,t)=>{const n=Number(e.min),a=Number(e.max),r=e.step==="any"?Number.NaN:Number(e.step),i=Number.isFinite(n)?n:0;let s=t;return Number.isFinite(n)&&(s=Math.max(n,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number.isFinite(r)&&r>0&&(s=i+Math.round((s-i)/r)*r),Number.isFinite(n)&&(s=Math.max(n,s)),Number.isFinite(a)&&(s=Math.min(a,s)),Number(s.toFixed(Cn(e)))},O=(e,t)=>{const n=Ln(e,t);return e.value=n.toFixed(Cn(e)),n},St=(e,t)=>{const n=e.get(t);if(n===null)return null;const a=n.trim().toLowerCase();return["1","true","yes","on"].includes(a)?!0:["0","false","no","off"].includes(a)?!1:null},F=(e,t,n)=>{const a=e.get(t);if(a===null)return null;const r=Number(a);return Number.isFinite(r)?Ln(n,r):null},Ar=e=>{const t=e.get("skin")??e.get("theme");if(t===null)return null;const n=t.trim().toLowerCase();return n==="classic"?"classic":["themepark","theme-park","theme_park"].includes(n)?"themePark":null},k=()=>{const e=new URL(window.location.href);vr.forEach(a=>{e.searchParams.delete(a)}),Se!==pn&&e.searchParams.set("skin",Se==="themePark"?"theme-park":"classic"),L!==Nt&&e.searchParams.set("tolerance",String(L)),N!==Rt&&e.searchParams.set("animationSpeed",String(N)),R!==13&&e.searchParams.set("turnRadius",String(R)),$!==!0&&e.searchParams.set("offsetArrowLanes",$?"1":"0"),c.targetBendRate!==E.targetBendRate&&e.searchParams.set("targetBendRate",String(c.targetBendRate)),c.minSidebearingGap!==E.minSidebearingGap&&e.searchParams.set("minSidebearingGap",String(c.minSidebearingGap)),c.bendSearchMinSidebearingGap!==E.bendSearchMinSidebearingGap&&e.searchParams.set("bendSearchMinSidebearingGap",String(c.bendSearchMinSidebearingGap)),c.bendSearchMaxSidebearingGap!==E.bendSearchMaxSidebearingGap&&e.searchParams.set("bendSearchMaxSidebearingGap",String(c.bendSearchMaxSidebearingGap)),c.exitHandleScale!==E.exitHandleScale&&e.searchParams.set("exitHandleScale",String(c.exitHandleScale)),c.entryHandleScale!==E.entryHandleScale&&e.searchParams.set("entryHandleScale",String(c.entryHandleScale)),ae!==!0&&e.searchParams.set("includeInitialLeadIn",ae?"1":"0"),re!==!0&&e.searchParams.set("includeFinalLeadOut",re?"1":"0");const t=`${e.pathname}${e.search}${e.hash}`,n=`${window.location.pathname}${window.location.search}${window.location.hash}`;t!==n&&window.history.replaceState(null,"",t)};let Gt=-1,Et="",at="current",de=null,o=null,C=null,Y=null,ft=!1,ue=[],Oe=[],ce=null,Ye=null,ee=null,pe=null,w=!1,te=!1,L=Nt,N=Rt,R=13,$=!1,c={...E},ae=!0,re=!0,Fe=[],ot=[],vt=[],v=[],_=1,le=null,Nn=1600,$t=0,u=null,_e=[],G=null,ge=null,At=null,qt=[],he=null,T=null,Ze=null,J=null,Xe=null,M=[],V=0,rt=0,Ge=0,Bt=0,Z=[],me=!1,K=null,g="hidden",X=null,ne=null,W=0,Be=!1,I=!1,oe=null,an=null,ke=[],Dt=!1,Ke=null,rn=null,xe=[],It=!1,Pt=-1,Ee=Number.POSITIVE_INFINITY;const Rn=()=>{wn.textContent=`${L}px`},Hn=()=>{kn.textContent=`${R}px`},On=()=>{xn.textContent=`${N.toFixed(2)}x`},ie=()=>{En.textContent=`${c.targetBendRate}`,vn.textContent=`${c.minSidebearingGap}`,An.textContent=`${c.bendSearchMinSidebearingGap}`,Dn.textContent=`${c.bendSearchMaxSidebearingGap}`,In.textContent=c.exitHandleScale.toFixed(2),Pn.textContent=c.entryHandleScale.toFixed(2)},Dr=()=>{L=O(Ie,L),N=O(Te,N),R=O(Pe,R),$=!!$,Je.checked=$,c={targetBendRate:O(Me,c.targetBendRate),minSidebearingGap:O(Ce,c.minSidebearingGap),bendSearchMinSidebearingGap:O(Le,c.bendSearchMinSidebearingGap),bendSearchMaxSidebearingGap:O(Ne,c.bendSearchMaxSidebearingGap),exitHandleScale:O(Re,c.exitHandleScale),entryHandleScale:O(He,c.entryHandleScale)},tt.checked=ae,nt.checked=re},H=()=>{Et&&oa(Et,Gt)},Fn=()=>{fe.hidden=!0,fe.textContent=""},sn=e=>{fe.hidden=!1,fe.textContent=e},Gn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),Ir=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(Gn).filter(t=>t.length>0)},it=Ir();let Ae=0;const Pr=()=>{const e=new URLSearchParams(window.location.search);Se=Ar(e)??Se,L=F(e,"tolerance",Ie)??L,N=F(e,"animationSpeed",Te)??N,R=F(e,"turnRadius",Pe)??R,$=St(e,"offsetArrowLanes")??$,c={targetBendRate:F(e,"targetBendRate",Me)??c.targetBendRate,minSidebearingGap:F(e,"minSidebearingGap",Ce)??c.minSidebearingGap,bendSearchMinSidebearingGap:F(e,"bendSearchMinSidebearingGap",Le)??c.bendSearchMinSidebearingGap,bendSearchMaxSidebearingGap:F(e,"bendSearchMaxSidebearingGap",Ne)??c.bendSearchMaxSidebearingGap,exitHandleScale:F(e,"exitHandleScale",Re)??c.exitHandleScale,entryHandleScale:F(e,"entryHandleScale",He)??c.entryHandleScale},ae=St(e,"includeInitialLeadIn")??ae,re=St(e,"includeFinalLeadOut")??re,Dr(),Rn(),On(),Hn(),ie(),$n(),k()},Tt=()=>{Ft.textContent=Ae<it.length?"Next queued word":"Next random word"},$n=()=>{const e=A();Qe.style.setProperty("--snake-board-image",`url("${e.boardImage}")`),Qe.style.setProperty("--snake-board-overlay",e.boardOverlay),_n.textContent=e.instruction,yn.textContent=e.successEyebrow,et.checked=e.id==="themePark"},Tr=e=>at==="nextQueued"?it[Ae]??e:e,on=()=>{if(Ae>=it.length)return null;const e=it[Ae];return Ae+=1,e??null},Wt=()=>A().soundEffects,qn=()=>{const e=A(),t=e.soundEffects;return Ke&&rn===e.id||(Ke=t.moveSrcs.map(n=>{const a=new Audio(n);return a.preload="auto",a.volume=t.moveVolume,a}),rn=e.id,It=!1),Ke},Bn=()=>{const e=A(),t=e.soundEffects;return oe&&an===e.id||(oe=new Audio(t.chompSrc),oe.preload="auto",oe.volume=t.chompVolume,an=e.id,Dt=!1),oe},Mr=()=>{const e=Bn();Dt||(e.load(),Dt=!0)},Cr=()=>{const e=qn();It||(e.forEach(t=>{t.load()}),It=!0)},Lr=()=>{const e=Wt(),t=Bn(),n=t.currentSrc||t.src;if(!n)return;const a=new Audio(n);a.preload="auto",a.currentTime=0,a.volume=e.chompVolume,ke.push(a),a.addEventListener("ended",()=>{ke=ke.filter(r=>r!==a)}),a.addEventListener("error",()=>{ke=ke.filter(r=>r!==a)}),a.play().catch(()=>{})},Nr=()=>{const e=Wt(),t=qn(),n=t[Math.floor(Math.random()*t.length)],a=(n==null?void 0:n.currentSrc)||(n==null?void 0:n.src);if(!a)return;const r=new Audio(a);r.preload="auto",r.currentTime=0,r.volume=e.moveVolume,xe.push(r),r.addEventListener("ended",()=>{xe=xe.filter(i=>i!==r)}),r.addEventListener("error",()=>{xe=xe.filter(i=>i!==r)}),r.play().catch(()=>{})},ct=()=>{const e=_>0?_-1:-1,t=e>=0?v[e]:null;Pt=e,Ee=t?t.startDistance+qe():Number.POSITIVE_INFINITY},Rr=e=>{if(!e.isPenDown||w||I)return;const t=_>0?_-1:-1,n=t>=0?v[t]:null;if(!n){Ee=Number.POSITIVE_INFINITY,Pt=t;return}t!==Pt&&ct();const a=we(e);let r=!1;for(;a>=Ee&&Ee<=n.endDistance;)Math.random()<Wt().moveChance&&(r=!0),Ee+=qe();r&&Nr()},ye=()=>{const e=w;ot.forEach(t=>{const n=Fe[Number(t.dataset.fruitIndex)],a=e||!n||n.captured||n.sectionIndex>=_;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",a)}),bn.textContent=Fe.length===0?"Nice tracing.":A().successCopy},$e=e=>{Tn.hidden=!e},Wn=()=>{const e=o==null?void 0:o.getState();if(!((e==null?void 0:e.status)!=="complete"||!me)){if(Z.length>0){$e(!1);return}$e(!0)}},Ut=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},Vt=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Hr=e=>(e%360+360)%360,Or=e=>{const t=Hr(e);return t>90&&t<270},_t=(e,t)=>!e.upsideDown||!Or(t+e.metrics.rotationOffset)?e:e.upsideDown,Fr=e=>{const t=e.querySelector(".writing-app__snake-head"),n=(t==null?void 0:t.querySelector("image"))??null,a=e.querySelector(".writing-app__snake-tail"),r=Array.from(e.querySelectorAll(".writing-app__snake-body")).sort((i,s)=>Number(i.dataset.snakeBodyIndex)-Number(s.dataset.snakeBodyIndex));return!t||!n||!a?null:{layerEl:e,headEl:t,headImageEl:n,bodyEls:r,tailEl:a}},Gr=()=>!G||!ge||!At||!he?null:{layerEl:G,headEl:ge,headImageEl:At,bodyEls:qt,tailEl:he},$r=e=>{e.removeAttribute("id"),e.querySelectorAll("[id]").forEach(t=>{t.removeAttribute("id")})},Kt=()=>{Be=!1,I=!1},Un=()=>{if(!I||!Be||C===null||!Y||!o)return!1;const e=o.getState();return e.status==="tracing"||o.beginAt(e.cursorPoint)?(Kt(),o.update(Y),b(),!0):!1},z=e=>(u==null?void 0:u.strokes[e.activeStrokeIndex])??null,qr=e=>_e[e.activeStrokeIndex]??null,Br=e=>{const t=u==null?void 0:u.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},we=e=>{var n;if(!u)return 0;if(e.status==="complete")return $t;let t=0;for(let a=0;a<e.activeStrokeIndex;a+=1)t+=((n=u.strokes[a])==null?void 0:n.totalLength)??0;return t+Br(e)},Wr=e=>{const t=u;return t?e.isPenDown&&e.activeStrokeIndex>=0?we({status:"tracing",activeStrokeIndex:e.activeStrokeIndex,activeStrokeProgress:e.activeStrokeProgress}):e.completedStrokes.reduce((n,a)=>{var r;return n+(((r=t.strokes[a])==null?void 0:r.totalLength)??0)},0):0},Ur=e=>{if(!u)return e.cursorTangent;const t=we(e),n=[...u.boundaries].reverse().find(a=>a.previousSegment!==a.nextSegment&&a.turnAngleDegrees>=150&&t>=a.overallDistance-Er&&t-a.overallDistance<xr);return(n==null?void 0:n.outgoingTangent)??e.cursorTangent},be=e=>{var t;return((t=qr(e))==null?void 0:t.deferred)===!0},Mt=e=>{var t;return((t=_e[e.strokeIndex])==null?void 0:t.deferred)===!0},We=()=>{const e=_>0?_-1:-1;return e>=0?v[e]??null:null},Yt=(e,t,n)=>{const a=Math.max(0,Math.floor(e/n)),r=Math.min(t,a);return{bodyCount:r,showTail:e>=(r+1)*n}},Vn=e=>{var t;return w||e.status==="complete"||!be(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=z(e))==null?void 0:t.isDot)===!0}},Vr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===X&&((n=z(t))==null?void 0:n.isDot)===!0&&g!=="hidden"&&g!=="waiting"},q=()=>{K!==null&&(cancelAnimationFrame(K),K=null),g="hidden",X=null,ne=null,T&&(T.style.opacity="0",T.classList.remove("writing-app__dot-snake--waiting")),J&&(J.style.opacity="0")},Kr=e=>({x:e.x,y:e.y-fr}),Yr=e=>({x:e.x,y:e.y+8}),Kn=(e=performance.now())=>{if(g==="hidden"||!ne)return null;const t=A(),n=Yr(ne),a=Kr(ne);if(g==="waiting")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!0};if(g==="eagle_in"){const l=Math.max(0,Math.min(1,(e-W)/mn)),S=1-(1-l)*(1-l);return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:{x:a.x,y:-106+(a.y+Q.height)*S},eagleHref:bt,eagleWidth:Q.width,eagleHeight:Q.height}}if(g==="eagle_stand")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:a,eagleHref:Ea,eagleWidth:je.width,eagleHeight:je.height};const r=Math.max(0,Math.min(1,(e-W)/Sn)),i=1-(1-r)*(1-r),s={x:a.x+(Nn+Q.width-a.x)*i,y:a.y+(-106-a.y)*i};return{snakePoint:{x:s.x,y:s.y+Q.height*.6},snakeHref:t.dotTarget.angryHref,snakeWobble:!1,eaglePoint:s,eagleHref:bt,eagleWidth:Q.width,eagleHeight:Q.height}},Yn=()=>{var t;const e=o==null?void 0:o.getState();if(!(!o||!e)&&X!==null&&e.activeStrokeIndex===X&&(t=z(e))!=null&&t.isDot){o.beginAt(e.cursorPoint);const n=o.getState();ra(we(n)),ea(n)}},Zr=()=>{Yn(),q(),b()},Zn=e=>{if(K=null,!(g==="hidden"||g==="waiting")){if(g==="eagle_in"&&e-W>=mn)g="eagle_stand",W=e;else if(g==="eagle_stand"&&e-W>=Sr)g="eagle_out",W=e;else if(g==="eagle_out"&&e-W>=Sn){Zr();return}b(),K=requestAnimationFrame(Zn)}},Xr=()=>{g==="waiting"&&(Yn(),g="eagle_in",W=performance.now(),K!==null&&cancelAnimationFrame(K),K=requestAnimationFrame(Zn),b())},zr=e=>{const t=Vn(e);if(!(t!=null&&t.isDot)){if(g!=="hidden"&&g!=="waiting")return;q();return}X!==t.strokeIndex?(q(),X=t.strokeIndex,ne=t.point,g="waiting"):g==="waiting"&&(ne=t.point)},Xn=(e=performance.now())=>{if(!T||!Ze||!J||!Xe)return;const t=Kn(e);if(!t){T.style.opacity="0",T.classList.remove("writing-app__dot-snake--waiting"),J.style.opacity="0";return}const n=A().dotTarget.metrics;if(T.style.opacity="1",T.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ze.setAttribute("href",t.snakeHref),De(T,Ze,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},n.width,n.height,n.anchorX,n.anchorY,n.rotationOffset),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){J.style.opacity="0";return}Xe.setAttribute("href",t.eagleHref),De(J,Xe,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,je.anchorX,je.anchorY,0)},jr=(e,t)=>{const n=Vn(t);if(!n)return!1;if(n.isDot){if(g!=="waiting")return!1;const r=Kn();if(!r)return!1;const i=A().dotTarget.metrics,s=Math.max(i.width,i.height)*_r;return Math.hypot(e.x-r.snakePoint.x,e.y-r.snakePoint.y)<=s}const a=Math.max(34,A().head.metrics.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=a},cn=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let a=1;a<e.length;a+=1){const r=e[a-1],i=e[a];if(!r||!i||t>i.distanceAlongStroke)continue;const s=i.distanceAlongStroke-r.distanceAlongStroke,l=s>0?(t-r.distanceAlongStroke)/s:0;return{x:r.x+(i.x-r.x)*l,y:r.y+(i.y-r.y)*l}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Qr=(e,t,n)=>{if(n<=t)return"";const a=[];let r=0;return e.strokes.forEach(i=>{const s=r,l=r+i.totalLength;if(r=l,n<s||t>l)return;const S=Math.max(0,t-s),h=Math.min(i.totalLength,n-s);if(h<S||i.samples.length===0)return;const x=[cn(i.samples,S),...i.samples.filter(m=>m.distanceAlongStroke>S&&m.distanceAlongStroke<h).map(m=>({x:m.x,y:m.y})),cn(i.samples,h)],f=x.filter((m,j)=>{const P=x[j-1];return!P||Math.hypot(m.x-P.x,m.y-P.y)>.01});if(f.length===0)return;const[p,...y]=f;a.push(`M ${p.x} ${p.y}`),y.forEach(m=>{a.push(`L ${m.x} ${m.y}`)})}),a.join(" ")},zn=(e,t,n)=>{const a=e.strokes[t.strokeIndex],r=n[t.strokeIndex];return a!=null&&a.isDot&&r?dn(r.curves):Qr(e,t.startDistance,t.endDistance)},Jr=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),ei=e=>`writing-app__section-arrow writing-app__section-arrow--white writing-app__section-arrow--${e.kind}`,ti=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),ni=e=>e.kind==="draw-order-number"?"":`
    <path
      class="${ei(e)}"
      d="${xa(e.commands)}"
    ></path>
    ${ti(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white writing-app__section-arrowhead--${e.kind}" points="${Jr(t.polygon)}"></polygon>`).join("")}
  `,Ue=()=>{if(!Ye||!u||!de)return;const e=We();if(!e){ee=null,Ye.innerHTML="";return}if(ee===e.index)return;const t=Math.abs(de.guides.baseline-de.guides.xHeight)/3,n=$?R:0,a=ka(u,{sections:[e],drawOrderNumbers:!1,startArrows:{length:t*.42,minLength:t*.18,offset:n,head:{length:gt,width:ht,tipExtension:mt}},midpointArrows:{density:wr,length:t*.36,offset:n,head:{length:gt,width:ht,tipExtension:mt}},turningPoints:{offset:R,stemLength:t*.36,head:{length:gt,width:ht,tipExtension:mt},groups:vt}}).filter(r=>r.kind!=="turning-point"||Math.abs(r.source.turnDistance-e.endDistance)<=kr);Ye.innerHTML=a.map(ni).join(""),ee=e.index},jn=()=>{if(!ce||!u)return;const e=We();if(!e){ce.setAttribute("d",""),ce.style.opacity="0";return}ce.setAttribute("d",zn(u,e,_e)),ce.style.opacity="1"},ai=()=>{_=Math.min(_+1,v.length),ia(),ye(),Ue(),ct()},Qn=(e,t)=>{const n=e.endDistance-e.startDistance;return t.startReason==="stroke-start"?.1:Math.min(8,Math.max(.1,n*.25))},Jn=(e,t,n={})=>{var s,l;const a=Mt(e),r=((s=u==null?void 0:u.strokes[e.strokeIndex])==null?void 0:s.isDot)===!0,i=((l=u==null?void 0:u.strokes[t.strokeIndex])==null?void 0:l.isDot)===!0;return(!a||!r)&&(ut(e.endPoint,e.endTangent,!0),Xt()),ai(),dt(t.startPoint,t.startTangent,!i,{preserveGrowth:n.preserveGrowth}),{nextSectionDeferred:Mt(t),nextSectionIsDot:i}},ea=e=>{if(w||I||v.length<=_)return!1;const t=We(),n=v[_];if(!t||!n)return!1;const a=we(e),r=Qn(t,n);if(a<t.endDistance-r)return!1;o==null||o.end();const{nextSectionDeferred:i}=Jn(t,n,{preserveGrowth:!0});return i?(Kt(),b(),!0):(I=!0,Be=n.startReason==="retrace-turn",Un(),b(),!0)},ri=(e,t)=>t.slice(0,-1).map(n=>({x:n.endPoint.x,y:n.endPoint.y,pathDistance:n.endDistance,emoji:Qa,captured:!1,sectionIndex:n.index})),ta=()=>{_=v.length>0?1:0,ee=null,Ue(),Fe.forEach(e=>{e.captured=!1}),ot.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),ia(),ye()},Zt=()=>ii(rt),ii=e=>{const t=Math.max(3,Math.min(wt,Math.floor($t/nn)));return Math.min(t,1+Math.floor(e/nn))},De=(e,t,n,a,r,i,s,l)=>{t.setAttribute("x",`${(-a*i).toFixed(2)}`),t.setAttribute("y",`${(-r*s).toFixed(2)}`),t.setAttribute("width",`${a}`),t.setAttribute("height",`${r}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+l).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},yt=(e,t,n=()=>null)=>{const a=e[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(t<0){const i=a.angle*Math.PI/180;return{...a,x:a.x+Math.cos(i)*t,y:a.y+Math.sin(i)*t,distance:t}}if(e.length<=1||t<=0)return{...a,distance:Math.max(0,t)};for(let i=1;i<e.length;i+=1){const s=e[i-1],l=e[i];if(!s||!l||t>l.distance)continue;const S=l.distance-s.distance,h=S>0?(t-s.distance)/S:0,x=s.x+(l.x-s.x)*h,f=s.y+(l.y-s.y)*h,p=n(t);return{x,y:f,angle:p??Vt({x:l.x-s.x,y:l.y-s.y}),distance:t,visible:l.visible}}return{...e[e.length-1]??a,distance:t}},lt=()=>{ge==null||ge.style.setProperty("opacity","0"),he==null||he.style.setProperty("opacity","0"),qt.forEach(e=>{e.style.opacity="0"})},na=(e,t,n=performance.now())=>{if(t.trail.length===0){e.layerEl.style.opacity="0";return}e.layerEl.style.opacity="1";const a=A(),r=t.segmentSpacing??a.segmentSpacing,i=Yt(t.headDistance,t.bodyCount,r),s=i.bodyCount,l=D=>t.headDistance+t.retractionDistance-D,S=D=>Math.max(0,Math.min(t.headDistance,D)),h=D=>t.retractionDistance>0&&D>=t.headDistance-ir,x=yt(t.trail,Math.min(t.headDistance,l(0)),t.getAngleOverride),f=_t(a.head,t.headAngle);e.headImageEl.setAttribute("href",n<(t.chewUntil??0)&&f===a.head?a.head.chewHref:f.href),De(e.headEl,e.headImageEl,{...x,angle:t.headAngle,visible:!h(l(0))},f.metrics.width,f.metrics.height,f.metrics.anchorX,f.metrics.anchorY,f.metrics.rotationOffset),e.bodyEls.forEach((D,zt)=>{if(zt>=s){D.style.opacity="0";return}const pt=D.querySelector("image");if(!pt)return;const la=(zt+1)*r,jt=l(la);if(h(jt)){D.style.opacity="0";return}const Qt=yt(t.trail,S(jt),t.getAngleOverride),da=a.bodySprites.find(ua=>ua.id===D.dataset.snakeBodyVariant)??a.bodySprites[0]??Ht.classic.bodySprites[0],se=_t(da,Qt.angle);pt.setAttribute("href",se.href),De(D,pt,Qt,se.metrics.width,se.metrics.height,se.metrics.anchorX,se.metrics.anchorY,se.metrics.rotationOffset)});const p=e.tailEl.querySelector("image");if(!p)return;if(t.showTail===!1){e.tailEl.style.opacity="0";return}const y=(s+1)*r,m=l(y);if(!i.showTail||h(m)){e.tailEl.style.opacity="0";return}const j=yt(t.trail,S(m),t.getAngleOverride),P=_t(a.tail,j.angle);p.setAttribute("href",P.href),De(e.tailEl,p,j,P.metrics.width,P.metrics.height,P.metrics.anchorX,P.metrics.anchorY,P.metrics.rotationOffset)},B=(e=performance.now())=>{var s,l;const t=Gr();if(!t)return;const n=o==null?void 0:o.getState();if(g!=="hidden"&&n!==void 0&&X===n.activeStrokeIndex||n!==void 0&&((s=z(n))==null?void 0:s.isDot)===!0){lt();return}const r=te||n!==void 0&&be(n)&&((l=z(n))==null?void 0:l.isDot)!==!0,i=r&&n!==void 0?Ot(n):qe();na(t,{trail:M,headDistance:V,headAngle:Ge,bodyCount:r?1:Zt(),segmentSpacing:i,retractionDistance:0,chewUntil:Bt,showTail:!0},e)},si=e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove(),Z=Z.filter(t=>t!==e),Wn()},Ct=e=>{na(e.parts,{trail:e.trail,headDistance:e.headDistance,headAngle:e.headAngle,bodyCount:e.bodyCount,segmentSpacing:e.segmentSpacing,retractionDistance:e.retractionDistance,showTail:e.showTail})},oi=(e={})=>{const t=e.isShortDeferredSnake?1:Zt(),n=e.isShortDeferredSnake?Ot({activeStrokeIndex:(o==null?void 0:o.getState().activeStrokeIndex)??0}):qe();return(Yt(V,t,n).bodyCount+1)*n/gn*1e3},ci=e=>{let t=null;const n=a=>{if(!Z.includes(e))return;if(t===null){t=a,e.animationFrameId=requestAnimationFrame(n);return}const r=Math.max(0,a-t)/1e3;t=a;const i=r*gn,s=e.retractionTarget-e.retractionDistance;if(Math.abs(s)<=i){e.retractionDistance=e.retractionTarget,Ct(e),si(e);return}e.retractionDistance+=Math.sign(s)*i,Ct(e),e.animationFrameId=requestAnimationFrame(n)};e.animationFrameId=requestAnimationFrame(n)},Xt=()=>{var h;const e=G==null?void 0:G.parentElement;if(!G||!e||M.length===0)return;const t=G.cloneNode(!0);$r(t),t.classList.add("writing-app__snake--retiring"),e.insertBefore(t,G);const n=Fr(t);if(!n){t.remove();return}const a=o==null?void 0:o.getState(),r=a!==void 0&&be(a)&&((h=z(a))==null?void 0:h.isDot)!==!0,i=r?1:Zt(),s=r?Ot(a):qe(),l=Yt(V,i,s).bodyCount,S={parts:n,trail:M.map(x=>({...x})),headDistance:V,headAngle:Ge,bodyCount:i,segmentSpacing:s,retractionDistance:0,retractionTarget:(l+1)*s,showTail:!0,animationFrameId:null};Z.push(S),Ct(S),ci(S)},aa=()=>{Z.forEach(e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove()}),Z=[]},dt=(e,t,n=!0,a={})=>{const r=Ut(t),i=a.preserveGrowth?rt:0;Ge=Vt(r),M=[{x:e.x,y:e.y,angle:Ge,distance:0,visible:n}],V=0,rt=i,Bt=0,Be=!1,I=!1,B()},ut=(e,t,n)=>{const a=Ut(t),r=Vt(a);Ge=r;const i=M[M.length-1];if(!i){dt(e,a,n);return}const s=Math.hypot(e.x-i.x,e.y-i.y);if(s<.5){i.visible===n?M[M.length-1]={...i,x:e.x,y:e.y,angle:r}:(M.push({x:e.x,y:e.y,angle:r,distance:i.distance+.001,visible:n}),V=i.distance+.001),B();return}V=i.distance+s,rt+=s,M.push({x:e.x,y:e.y,angle:r,distance:V,visible:n}),B()},ra=e=>{let t=!1;Fe.forEach((n,a)=>{if(n.captured||n.sectionIndex>=_||e+.5<n.pathDistance)return;n.captured=!0;const r=ot[a];r&&r.classList.add("writing-app__fruit--captured"),t=!0}),t&&(Bt=performance.now()+rr,Lr(),ye(),B())},ia=()=>{if(!le)return;const e=We();if(!e||Mt(e)){le.classList.add("writing-app__boundary-star--hidden");return}le.classList.remove("writing-app__boundary-star--hidden"),le.setAttribute("x",`${e.endPoint.x}`),le.setAttribute("y",`${e.endPoint.y}`)},li=e=>{var t;if(w||ra(we(e)),!(!w&&ea(e))){if(be(e)&&((t=z(e))==null?void 0:t.isDot)===!0){B();return}ut(e.cursorPoint,Ur(e),!0),!w&&e.isPenDown&&Rr(e)}},sa=()=>{pe!==null&&(cancelAnimationFrame(pe),pe=null),w=!1,te=!1,U.disabled=!1,U.textContent="Animate",ye(),B(),b()},ln=()=>{o==null||o.reset(),C=null,Y=null,me=!1,$e(!1),te=!1,q(),aa(),ue.forEach((t,n)=>{const a=Oe[n]??.001;t.style.strokeDasharray=`${a} ${a}`,t.style.strokeDashoffset=`${a}`}),Be=!1,I=!1;const e=o==null?void 0:o.getState();e?dt(e.cursorPoint,e.cursorTangent,!0):lt(),ta(),ct(),b()},b=()=>{ft||(ft=!0,requestAnimationFrame(()=>{ft=!1,di()}))},di=()=>{if(!o)return;const e=o.getState();zr(e),Xn(),jn(),Ue();const t=new Set(e.completedStrokes);if(ue.forEach((n,a)=>{const r=Oe[a]??0;if(t.has(a)||Vr(a,e)){n.style.strokeDashoffset="0";return}if(a===e.activeStrokeIndex){const i=r*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,i)}`;return}n.style.strokeDashoffset=`${r}`}),e.status==="complete"){me||(me=!0,ut(e.cursorPoint,e.cursorTangent,!0),Xt()),lt(),Wn();return}!w&&!I?li(e):B(),me=!1,$e(!1)},ui=(e,t)=>Math.hypot(e.velocity.x,e.velocity.y)<=.001?t:Ut(e.velocity),pi=e=>{const t=new Set(e.completedStrokes);ue.forEach((n,a)=>{const r=Oe[a]??.001;if(t.has(a)){n.style.strokeDashoffset="0";return}if(a===e.activeStrokeIndex){const i=r*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,i)}`;return}n.style.strokeDashoffset=`${r}`})},gi=(e,t)=>{const n=_e[e.activeStrokeIndex],a=u==null?void 0:u.strokes[e.activeStrokeIndex];return!(n!=null&&n.deferred)||e.activeStrokeIndex<0||!e.isPenDown?(te=!1,q(),!1):a!=null&&a.isDot?(te=!1,X=e.activeStrokeIndex,ne=e.point,g="waiting",Xn(),!0):(q(),te=!0,!1)},hi=e=>{let t=!1;const n=Wr(e);for(;v.length>_;){const a=We(),r=v[_];if(!a||!r)break;const i=Qn(a,r);if(n<a.endDistance-i)break;Jn(a,r,{preserveGrowth:!0}),t=!0}return t},mi=()=>{if(!de||w)return;ln(),sa();const e=new ba(de,{speed:1.7*N,penUpSpeed:2.1*N,deferredDelayMs:150});w=!0,U.disabled=!0,U.textContent="Animating...",ye(),B();const t=performance.now();let n=(o==null?void 0:o.getState().cursorTangent)??{x:1,y:0},a=!1,r=e.totalDuration+en;const i=s=>{const l=s-t,S=Math.min(l,e.totalDuration),h=e.getFrame(S),x=ui(h,n);hi(h);const f=gi(h);if(pi(h),h.isPenDown&&!f?(ut(h.point,x,!0),n=x):B(),!a&&l>=e.totalDuration&&(a=!0,r=e.totalDuration+Math.max(en,oi({isShortDeferredSnake:te})),q(),Xt(),lt()),l<r||Z.length>0){pe=requestAnimationFrame(i);return}pe=null,q(),w=!1,U.disabled=!1,U.textContent="Animate",ye(),ln()};pe=requestAnimationFrame(i),b()},Si=e=>{const t=e.bodySprites[0]??Ht.classic.bodySprites[0],n=e.bodySprites[1];return e.id==="themePark"&&e.bodySprites.length>1?e.bodySprites[Math.floor(Math.random()*e.bodySprites.length)]??t:!n||Math.random()>=er?t:n},fi=(e,t,n,a)=>{aa(),Nn=t;const r=A(),i=fa(e);u=i,_e=e.strokes.filter(p=>p.type!=="lift"),$t=i.strokes.reduce((p,y)=>p+y.totalLength,0),vt=_a(i).groups,v=wa(i,{groups:vt}).sections,_=v.length>0?1:0,o=new ya(i,{startTolerance:L,hitTolerance:L}),C=null,Fe=ri(i,v);const l=_e,S=v.map(p=>`<path class="writing-app__stroke-bg" d="${zn(i,p,l)}"></path>`).join(""),h=l.map(p=>`<path class="writing-app__stroke-trace" d="${dn(p.curves)}"></path>`).join(""),x=Array.from({length:wt},(p,y)=>{const m=wt-1-y,j=Si(r);return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${m}"
        data-snake-body-variant="${j.id}"
      >
        <image
          href="${j.href}"
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
    ${S}
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
      ${x}
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
        href="${bt}"
        preserveAspectRatio="none"
      ></image>
    </g>
  `,ue=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),ce=d.querySelector("#next-section-stroke"),Ye=d.querySelector("#section-annotations"),ee=null,ot=Array.from(d.querySelectorAll(".writing-app__fruit")),le=d.querySelector("#waypoint-star"),G=d.querySelector("#trace-snake"),ge=d.querySelector("#snake-head"),At=d.querySelector("#snake-head-image"),he=d.querySelector("#snake-tail"),qt=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((p,y)=>Number(p.dataset.snakeBodyIndex)-Number(y.dataset.snakeBodyIndex)),T=d.querySelector("#dot-snake"),Ze=d.querySelector("#dot-snake-image"),J=d.querySelector("#dot-eagle"),Xe=d.querySelector("#dot-eagle-image"),Oe=ue.map(p=>{const y=p.getTotalLength();return Number.isFinite(y)&&y>0?y:.001}),ue.forEach((p,y)=>{const m=Oe[y]??.001;p.style.strokeDasharray=`${m} ${m}`,p.style.strokeDashoffset=`${m}`}),jn();const f=o.getState();dt(f.cursorPoint,f.cursorTangent),q(),ta(),ct(),me=!1,$e(!1),b()},oa=(e,t=-1)=>{sa();const n=Sa(e,{joinSpacing:c,keepInitialLeadIn:ae,keepFinalLeadOut:re});Et=e,Gt=t,fn.textContent=e,st.value=Tr(e),de=n.path,fi(n.path,n.width,n.height,n.offsetY)},Lt=(e,t=-1)=>{const n=Gn(e);if(!n)return sn("Type a word first."),!1;try{return oa(n,t),Fn(),!0}catch{return sn("Couldn't build that word. Try letters supported by the cursive set."),!1}},ca=()=>{let e=on();for(;e;){if(at="nextQueued",Lt(e)){Tt();return}e=on()}at="current";const t=ma(Gt);Lt(Jt[t]??Jt[0],t),Tt()},_i=e=>{if(w||!o||C!==null)return;const t=un(d,e),n=o.getState(),a=z(n),r=I;if(be(n)&&!jr(t,n))return;if(be(n)&&(a!=null&&a.isDot)){e.preventDefault(),Xr();return}o.beginAt(t)&&(e.preventDefault(),C=e.pointerId,Y=t,Mr(),Cr(),r?Kt():r||(I=!1),d.setPointerCapture(e.pointerId),b())},yi=e=>{if(!(w||!o||e.pointerId!==C)){if(e.preventDefault(),Y=un(d,e),I){Un(),b();return}o.update(Y),b()}},bi=e=>{!o||e.pointerId!==C||(o.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,Y=null,b())},wi=e=>{e.pointerId===C&&(o==null||o.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,Y=null,b())};d.addEventListener("pointerdown",_i);d.addEventListener("pointermove",yi);d.addEventListener("pointerup",bi);d.addEventListener("pointercancel",wi);U.addEventListener("click",mi);Ie.addEventListener("input",()=>{L=Number(Ie.value),Rn(),k(),H()});Te.addEventListener("input",()=>{N=Number(Te.value),On(),k()});Pe.addEventListener("input",()=>{R=Number(Pe.value),Hn(),k(),ee=null,Ue()});Je.addEventListener("change",()=>{$=Je.checked,k(),ee=null,Ue()});et.addEventListener("change",()=>{Se=et.checked?"themePark":"classic",$n(),k(),H()});Me.addEventListener("input",()=>{c={...c,targetBendRate:Number(Me.value)},ie(),k(),H()});Ce.addEventListener("input",()=>{c={...c,minSidebearingGap:Number(Ce.value)},ie(),k(),H()});Le.addEventListener("input",()=>{c={...c,bendSearchMinSidebearingGap:Number(Le.value)},ie(),k(),H()});Ne.addEventListener("input",()=>{c={...c,bendSearchMaxSidebearingGap:Number(Ne.value)},ie(),k(),H()});Re.addEventListener("input",()=>{c={...c,exitHandleScale:Number(Re.value)},ie(),k(),H()});He.addEventListener("input",()=>{c={...c,entryHandleScale:Number(He.value)},ie(),k(),H()});tt.addEventListener("change",()=>{ae=tt.checked,k(),H()});nt.addEventListener("change",()=>{re=nt.checked,k(),H()});Mn.addEventListener("submit",e=>{e.preventDefault(),at="current",Lt(st.value)});Ft.addEventListener("click",ca);st.addEventListener("input",()=>{fe.hidden||Fn()});document.addEventListener("pointerdown",e=>{if(!ve.open)return;const t=e.target;t instanceof Node&&ve.contains(t)||(ve.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(ve.open=!1)});Pr();Tt();ca();
