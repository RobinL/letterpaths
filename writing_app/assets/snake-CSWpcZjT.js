import{M as zn,a as Qn,T as Jn,e as er,W as Ht,b as tr,c as nr,h as rr,d as Yt,g as Zt,f as ar}from"./shared-BptrW1eh.js";import{T as sr,A as ir}from"./session-DFnIrfII.js";import{b as or,c as cr,a as lr}from"./annotations-DoBsaDCT.js";const Qe="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",dr="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",ur="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",pr="/letterpaths/writing_app/assets/body-CgvmrS6c.png",gr="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",hr="/letterpaths/writing_app/assets/background-BdaS-6aw.png",mr="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",fr="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Sr="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",_r="/letterpaths/writing_app/assets/head-CeHhv_vT.png",yr="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",wr="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",br="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Er="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",kr="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",xr="/letterpaths/writing_app/assets/theme_park_bg-DOpd8-Mt.png",vr="/letterpaths/writing_app/assets/carriage_1-DC6yaVQC.png",Ar="/letterpaths/writing_app/assets/carriage_1_upside_down-BG5QUuxQ.png",Dr="/letterpaths/writing_app/assets/carriage_2-Bq0wDmtr.png",Ir="/letterpaths/writing_app/assets/carriage_2_upside_down-_Cm6VEPW.png",xe="/letterpaths/writing_app/assets/front-DZihS2IP.png",Tr="/letterpaths/writing_app/assets/front_upside_down-Z8CFqsTv.png",Pr="/letterpaths/writing_app/assets/rear-BWZZF1JA.png",Mr="/letterpaths/writing_app/assets/rear_upside_down-DZY4fDcB.png",Cr="/letterpaths/writing_app/assets/rollercoaster_scream-Cnz9sZHr.mp3",Lr="/letterpaths/writing_app/assets/rollercoaster_track_1-CQOQytx_.mp3",Nr="/letterpaths/writing_app/assets/rollercoaster_track_2-DRqX5yMO.mp3",Ft="G-94373ZKHEE",Or=new Set(["localhost","127.0.0.1"]),Rr=()=>{if(Or.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",Ft);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${Ft}`,document.head.append(e)},Hr=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},Fr="🍎",Xt=150,$t=.7,$r=76,qt=115,qr=.25,Wr=.3,Gr=.12,Br=.42,Je=10,Ur=220,Vr=700,Kr=6,Yr=44,Zr=56,Xr={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},et={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},jr={...et,height:et.height*(209/431/(160/435))},zr={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Qr={width:69,height:49,anchorX:.5,anchorY:.62,rotationOffset:0},tt={width:94,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},Jr={...tt,height:79.3},Te={width:100,height:82.8,anchorX:.5,anchorY:.54,rotationOffset:0},ea={...Te,height:87.9},ta={...Te,height:87.7},jt={width:92,height:76.5,anchorX:.5,anchorY:.54,rotationOffset:0},na={...jt,height:79.9},zt=700,ra=260,Qt=800,aa=18,sa=.72,G={width:200,height:106},Pe={width:128,height:141,anchorX:.5,anchorY:1},ia=[wr,br,Er,kr],oa=[Lr,Nr],Ke=26,Ye=22,Ze=11,ca=250,la=.5,da=12,ua=2,B={targetBendRate:16,minSidebearingGap:80,bendSearchMinSidebearingGap:-30,bendSearchMaxSidebearingGap:240,exitHandleScale:.75,entryHandleScale:.75},kt={classic:{id:"classic",boardImage:hr,boardOverlay:"linear-gradient(180deg, rgba(255, 252, 244, 0.72), rgba(255, 248, 235, 0.86))",instruction:"Drag the snake around the letters.",successEyebrow:"Snake fed!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:ur,chompVolume:Wr,moveSrcs:ia,moveVolume:Gr,moveChance:Br},segmentSpacing:$r,deferredSegmentSpacing:Yr,head:{href:_r,chewHref:Sr,metrics:Xr},bodySprites:[{id:"body",href:pr,metrics:et},{id:"body-bulge",href:gr,metrics:jr}],tail:{href:yr,metrics:zr},dotTarget:{happyHref:fr,angryHref:mr,metrics:Qr}},themePark:{id:"themePark",boardImage:xr,boardOverlay:"linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 249, 230, 0.78))",instruction:"Drag the rollercoaster around the letters.",successEyebrow:"Ride complete!",successCopy:"All the fruit is collected.",soundEffects:{chompSrc:Cr,chompVolume:.2,moveSrcs:oa,moveVolume:.1,moveChance:.36},segmentSpacing:106,deferredSegmentSpacing:Zr,head:{href:xe,chewHref:xe,metrics:tt,upsideDown:{href:Tr,metrics:Jr}},bodySprites:[{id:"carriage-1",href:vr,metrics:Te,upsideDown:{href:Ar,metrics:ea}},{id:"carriage-2",href:Dr,metrics:Te,upsideDown:{href:Ir,metrics:ta}}],tail:{href:Pr,metrics:jt,upsideDown:{href:Mr,metrics:na}},dotTarget:{happyHref:xe,angryHref:xe,metrics:tt}}};let Jt="classic";const k=()=>kt[Jt],Fe=()=>k().segmentSpacing,en=e=>{var r;const t=((r=d==null?void 0:d.strokes[e.activeStrokeIndex])==null?void 0:r.totalLength)??0,n=t>0?t/3:Number.POSITIVE_INFINITY;return Math.max(1,Math.min(k().deferredSegmentSpacing,n))},Me=document.querySelector("#app");if(!Me)throw new Error("Missing #app element for snake app.");Rr();Hr();Me.innerHTML=`
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
              Demo
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
                    min="${zn}"
                    max="${Qn}"
                    step="${Jn}"
                    value="${Xt}"
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
                <label class="writing-app__settings-toggle" for="offset-arrow-lanes">
                  <input
                    id="offset-arrow-lanes"
                    type="checkbox"
                    checked
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
                    value="${B.targetBendRate}"
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
                    value="${B.minSidebearingGap}"
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
                    value="${B.bendSearchMinSidebearingGap}"
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
                    value="${B.bendSearchMaxSidebearingGap}"
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
                    value="${B.exitHandleScale}"
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
                    value="${B.entryHandleScale}"
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
`;const tn=document.querySelector("#word-label"),nn=document.querySelector("#snake-instruction"),rn=document.querySelector("#success-eyebrow"),an=document.querySelector("#score-summary"),l=document.querySelector("#trace-svg"),O=document.querySelector("#show-me-button"),he=document.querySelector("#settings-menu"),nt=document.querySelector("#tolerance-slider"),sn=document.querySelector("#tolerance-value"),rt=document.querySelector("#turn-radius-slider"),on=document.querySelector("#turn-radius-value"),at=document.querySelector("#offset-arrow-lanes"),Ce=document.querySelector("#theme-park-toggle"),st=document.querySelector("#target-bend-rate-slider"),cn=document.querySelector("#target-bend-rate-value"),it=document.querySelector("#min-sidebearing-gap-slider"),ln=document.querySelector("#min-sidebearing-gap-value"),ot=document.querySelector("#bend-search-min-sidebearing-gap-slider"),dn=document.querySelector("#bend-search-min-sidebearing-gap-value"),ct=document.querySelector("#bend-search-max-sidebearing-gap-slider"),un=document.querySelector("#bend-search-max-sidebearing-gap-value"),lt=document.querySelector("#exit-handle-scale-slider"),pn=document.querySelector("#exit-handle-scale-value"),dt=document.querySelector("#entry-handle-scale-slider"),gn=document.querySelector("#entry-handle-scale-value"),ut=document.querySelector("#include-initial-lead-in"),pt=document.querySelector("#include-final-lead-out"),hn=document.querySelector("#success-overlay"),mn=document.querySelector("#custom-word-form"),$e=document.querySelector("#custom-word-input"),oe=document.querySelector("#custom-word-error"),xt=document.querySelector("#next-word-button");if(!tn||!nn||!rn||!an||!l||!O||!he||!nt||!sn||!rt||!on||!at||!Ce||!st||!cn||!it||!ln||!ot||!dn||!ct||!un||!lt||!pn||!dt||!gn||!ut||!pt||!hn||!mn||!$e||!oe||!xt)throw new Error("Missing elements for snake app.");let vt=-1,gt="",Le="current",ee=null,o=null,P=null,H=null,Xe=!1,te=[],Se=[],Q=null,Ae=null,V=null,ne=null,w=!1,re=!1,Ne=Xt,Oe=13,fn=!0,f={...B},Sn=!0,_n=!0,_e=[],qe=[],ht=[],v=[],b=1,J=null,yn=1600,At=0,d=null,ce=[],C=null,ae=null,mt=null,Dt=[],se=null,I=null,De=null,U=null,Ie=null,T=[],K=0,Re=0,ye=0,It=0,Z=[],ie=!1,R=null,p="hidden",F=null,Y=null,N=0,be=!1,A=!1,z=null,Wt=null,ue=[],ft=!1,ve=null,Gt=null,pe=[],St=!1,_t=-1,ge=Number.POSITIVE_INFINITY;const wn=()=>{sn.textContent=`${Ne}px`},bn=()=>{on.textContent=`${Oe}px`},X=()=>{cn.textContent=`${f.targetBendRate}`,ln.textContent=`${f.minSidebearingGap}`,dn.textContent=`${f.bendSearchMinSidebearingGap}`,un.textContent=`${f.bendSearchMaxSidebearingGap}`,pn.textContent=f.exitHandleScale.toFixed(2),gn.textContent=f.entryHandleScale.toFixed(2)},M=()=>{gt&&Kn(gt,vt)},En=()=>{oe.hidden=!0,oe.textContent=""},Bt=e=>{oe.hidden=!1,oe.textContent=e},kn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),pa=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(kn).filter(t=>t.length>0)},He=pa();let me=0;const yt=()=>{xt.textContent=me<He.length?"Next queued word":"Next random word"},xn=()=>{const e=k();Me.style.setProperty("--snake-board-image",`url("${e.boardImage}")`),Me.style.setProperty("--snake-board-overlay",e.boardOverlay),nn.textContent=e.instruction,rn.textContent=e.successEyebrow,Ce.checked=e.id==="themePark"},ga=e=>Le==="nextQueued"?He[me]??e:e,Ut=()=>{if(me>=He.length)return null;const e=He[me];return me+=1,e??null},Tt=()=>k().soundEffects,vn=()=>{const e=k(),t=e.soundEffects;return ve&&Gt===e.id||(ve=t.moveSrcs.map(n=>{const r=new Audio(n);return r.preload="auto",r.volume=t.moveVolume,r}),Gt=e.id,St=!1),ve},An=()=>{const e=k(),t=e.soundEffects;return z&&Wt===e.id||(z=new Audio(t.chompSrc),z.preload="auto",z.volume=t.chompVolume,Wt=e.id,ft=!1),z},ha=()=>{const e=An();ft||(e.load(),ft=!0)},ma=()=>{const e=vn();St||(e.forEach(t=>{t.load()}),St=!0)},fa=()=>{const e=Tt(),t=An(),n=t.currentSrc||t.src;if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=e.chompVolume,ue.push(r),r.addEventListener("ended",()=>{ue=ue.filter(a=>a!==r)}),r.addEventListener("error",()=>{ue=ue.filter(a=>a!==r)}),r.play().catch(()=>{})},Sa=()=>{const e=Tt(),t=vn(),n=t[Math.floor(Math.random()*t.length)],r=(n==null?void 0:n.currentSrc)||(n==null?void 0:n.src);if(!r)return;const a=new Audio(r);a.preload="auto",a.currentTime=0,a.volume=e.moveVolume,pe.push(a),a.addEventListener("ended",()=>{pe=pe.filter(s=>s!==a)}),a.addEventListener("error",()=>{pe=pe.filter(s=>s!==a)}),a.play().catch(()=>{})},We=()=>{const e=b>0?b-1:-1,t=e>=0?v[e]:null;_t=e,ge=t?t.startDistance+Fe():Number.POSITIVE_INFINITY},_a=e=>{if(!e.isPenDown||w||A)return;const t=b>0?b-1:-1,n=t>=0?v[t]:null;if(!n){ge=Number.POSITIVE_INFINITY,_t=t;return}t!==_t&&We();const r=Ee(e);let a=!1;for(;r>=ge&&ge<=n.endDistance;)Math.random()<Tt().moveChance&&(a=!0),ge+=Fe();a&&Sa()},le=()=>{const e=w;qe.forEach(t=>{const n=_e[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.sectionIndex>=b;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),an.textContent=_e.length===0?"Nice tracing.":k().successCopy},we=e=>{hn.hidden=!e},Dn=()=>{const e=o==null?void 0:o.getState();if(!((e==null?void 0:e.status)!=="complete"||!ie)){if(Z.length>0){we(!1);return}we(!0)}},Pt=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},Mt=e=>Math.atan2(e.y,e.x)*(180/Math.PI),ya=e=>(e%360+360)%360,wa=e=>{const t=ya(e);return t>90&&t<270},je=(e,t)=>!e.upsideDown||!wa(t+e.metrics.rotationOffset)?e:e.upsideDown,ba=e=>{const t=e.querySelector(".writing-app__snake-head"),n=(t==null?void 0:t.querySelector("image"))??null,r=e.querySelector(".writing-app__snake-tail"),a=Array.from(e.querySelectorAll(".writing-app__snake-body")).sort((s,i)=>Number(s.dataset.snakeBodyIndex)-Number(i.dataset.snakeBodyIndex));return!t||!n||!r?null:{layerEl:e,headEl:t,headImageEl:n,bodyEls:a,tailEl:r}},Ea=()=>!C||!ae||!mt||!se?null:{layerEl:C,headEl:ae,headImageEl:mt,bodyEls:Dt,tailEl:se},ka=e=>{e.removeAttribute("id"),e.querySelectorAll("[id]").forEach(t=>{t.removeAttribute("id")})},Ct=()=>{be=!1,A=!1},In=()=>{if(!A||!be||P===null||!H||!o)return!1;const e=o.getState();return e.status==="tracing"||o.beginAt(e.cursorPoint)?(Ct(),o.update(H),y(),!0):!1},$=e=>(d==null?void 0:d.strokes[e.activeStrokeIndex])??null,xa=e=>ce[e.activeStrokeIndex]??null,va=e=>{const t=d==null?void 0:d.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ee=e=>{var n;if(!d)return 0;if(e.status==="complete")return At;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=d.strokes[r])==null?void 0:n.totalLength)??0;return t+va(e)},Aa=e=>{if(!d)return e.cursorTangent;const t=Ee(e),n=[...d.boundaries].reverse().find(r=>r.previousSegment!==r.nextSegment&&r.turnAngleDegrees>=150&&t>=r.overallDistance-ua&&t-r.overallDistance<da);return(n==null?void 0:n.outgoingTangent)??e.cursorTangent},de=e=>{var t;return((t=xa(e))==null?void 0:t.deferred)===!0},wt=e=>{var t;return((t=ce[e.strokeIndex])==null?void 0:t.deferred)===!0},Ge=()=>{const e=b>0?b-1:-1;return e>=0?v[e]??null:null},Tn=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},Pn=e=>{var t;return w||e.status==="complete"||!de(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=$(e))==null?void 0:t.isDot)===!0}},Da=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===F&&((n=$(t))==null?void 0:n.isDot)===!0&&p!=="hidden"&&p!=="waiting"},q=()=>{R!==null&&(cancelAnimationFrame(R),R=null),p="hidden",F=null,Y=null,I&&(I.style.opacity="0",I.classList.remove("writing-app__dot-snake--waiting")),U&&(U.style.opacity="0")},Ia=e=>({x:e.x,y:e.y-aa}),Ta=e=>({x:e.x,y:e.y+8}),Mn=(e=performance.now())=>{if(p==="hidden"||!Y)return null;const t=k(),n=Ta(Y),r=Ia(Y);if(p==="waiting")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!0};if(p==="eagle_in"){const c=Math.max(0,Math.min(1,(e-N)/zt)),g=1-(1-c)*(1-c);return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:{x:r.x,y:-106+(r.y+G.height)*g},eagleHref:Qe,eagleWidth:G.width,eagleHeight:G.height}}if(p==="eagle_stand")return{snakePoint:n,snakeHref:t.dotTarget.happyHref,snakeWobble:!1,eaglePoint:r,eagleHref:dr,eagleWidth:Pe.width,eagleHeight:Pe.height};const a=Math.max(0,Math.min(1,(e-N)/Qt)),s=1-(1-a)*(1-a),i={x:r.x+(yn+G.width-r.x)*s,y:r.y+(-106-r.y)*s};return{snakePoint:{x:i.x,y:i.y+G.height*.6},snakeHref:t.dotTarget.angryHref,snakeWobble:!1,eaglePoint:i,eagleHref:Qe,eagleWidth:G.width,eagleHeight:G.height}},Cn=()=>{var t;const e=o==null?void 0:o.getState();if(!(!o||!e)&&F!==null&&e.activeStrokeIndex===F&&(t=$(e))!=null&&t.isDot){o.beginAt(e.cursorPoint);const n=o.getState();Bn(Ee(n)),Hn(n)}},Pa=()=>{Cn(),q(),y()},Ln=e=>{if(R=null,!(p==="hidden"||p==="waiting")){if(p==="eagle_in"&&e-N>=zt)p="eagle_stand",N=e;else if(p==="eagle_stand"&&e-N>=ra)p="eagle_out",N=e;else if(p==="eagle_out"&&e-N>=Qt){Pa();return}y(),R=requestAnimationFrame(Ln)}},Ma=()=>{p==="waiting"&&(Cn(),p="eagle_in",N=performance.now(),R!==null&&cancelAnimationFrame(R),R=requestAnimationFrame(Ln),y())},Ca=e=>{const t=Pn(e);if(!(t!=null&&t.isDot)){if(p!=="hidden"&&p!=="waiting")return;q();return}F!==t.strokeIndex?(q(),F=t.strokeIndex,Y=t.point,p="waiting"):p==="waiting"&&(Y=t.point)},Nn=(e=performance.now())=>{if(!I||!De||!U||!Ie)return;const t=Mn(e);if(!t){I.style.opacity="0",I.classList.remove("writing-app__dot-snake--waiting"),U.style.opacity="0";return}const n=k().dotTarget.metrics;if(I.style.opacity="1",I.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),De.setAttribute("href",t.snakeHref),fe(I,De,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},n.width,n.height,n.anchorX,n.anchorY,n.rotationOffset),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){U.style.opacity="0";return}Ie.setAttribute("href",t.eagleHref),fe(U,Ie,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Pe.anchorX,Pe.anchorY,0)},La=(e,t)=>{const n=Pn(t);if(!n)return!1;if(n.isDot){if(p!=="waiting")return!1;const a=Mn();if(!a)return!1;const s=k().dotTarget.metrics,i=Math.max(s.width,s.height)*sa;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=i}const r=Math.max(34,k().head.metrics.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Vt=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Na=(e,t,n)=>{if(n<=t)return"";const r=[];let a=0;return e.strokes.forEach(s=>{const i=a,c=a+s.totalLength;if(a=c,n<i||t>c)return;const g=Math.max(0,t-i),m=Math.min(s.totalLength,n-i);if(m<g||s.samples.length===0)return;const E=[Vt(s.samples,g),...s.samples.filter(h=>h.distanceAlongStroke>g&&h.distanceAlongStroke<m).map(h=>({x:h.x,y:h.y})),Vt(s.samples,m)],S=E.filter((h,W)=>{const D=E[W-1];return!D||Math.hypot(h.x-D.x,h.y-D.y)>.01});if(S.length===0)return;const[u,..._]=S;r.push(`M ${u.x} ${u.y}`),_.forEach(h=>{r.push(`L ${h.x} ${h.y}`)})}),r.join(" ")},On=(e,t,n)=>{const r=e.strokes[t.strokeIndex],a=n[t.strokeIndex];return r!=null&&r.isDot&&a?Yt(a.curves):Na(e,t.startDistance,t.endDistance)},Oa=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),Ra=e=>`writing-app__section-arrow writing-app__section-arrow--white writing-app__section-arrow--${e.kind}`,Ha=e=>["head"in e?e.head:void 0,"tailHead"in e?e.tailHead:void 0].filter(t=>t!==void 0),Fa=e=>e.kind==="draw-order-number"?"":`
    <path
      class="${Ra(e)}"
      d="${lr(e.commands)}"
    ></path>
    ${Ha(e).map(t=>`<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white writing-app__section-arrowhead--${e.kind}" points="${Oa(t.polygon)}"></polygon>`).join("")}
  `,ke=()=>{if(!Ae||!d||!ee)return;const e=Ge();if(!e){V=null,Ae.innerHTML="";return}if(V===e.index)return;const t=Math.abs(ee.guides.baseline-ee.guides.xHeight)/3,n=fn?Oe:0,r=cr(d,{sections:[e],drawOrderNumbers:!1,startArrows:{length:t*.42,minLength:t*.18,offset:n,head:{length:Ke,width:Ye,tipExtension:Ze}},midpointArrows:{density:ca,length:t*.36,offset:n,head:{length:Ke,width:Ye,tipExtension:Ze}},turningPoints:{offset:Oe,stemLength:t*.36,head:{length:Ke,width:Ye,tipExtension:Ze},groups:ht}}).filter(a=>a.kind!=="turning-point"||Math.abs(a.source.turnDistance-e.endDistance)<=la);Ae.innerHTML=r.map(Fa).join(""),V=e.index},Rn=()=>{if(!Q||!d)return;const e=Ge();if(!e){Q.setAttribute("d",""),Q.style.opacity="0";return}Q.setAttribute("d",On(d,e,ce)),Q.style.opacity="1"},$a=()=>{b=Math.min(b+1,v.length),Un(),le(),ke(),We()},Hn=e=>{var E,S;if(w||A||v.length<=b)return!1;const t=Ge(),n=v[b];if(!t||!n)return!1;const r=Ee(e),a=t.endDistance-t.startDistance,s=n.startReason==="stroke-start"?.1:Math.min(8,Math.max(.1,a*.25));if(r<t.endDistance-s)return!1;const i=wt(t),c=((E=d==null?void 0:d.strokes[t.strokeIndex])==null?void 0:E.isDot)===!0,g=wt(n),m=((S=d==null?void 0:d.strokes[n.strokeIndex])==null?void 0:S.isDot)===!0;return(!i||!c)&&(Ue(t.endPoint,t.endTangent,!0),Wn()),$a(),o==null||o.end(),Be(n.startPoint,n.startTangent,!m,{preserveGrowth:!0}),g?(Ct(),y(),!0):(A=!0,be=n.startReason==="retrace-turn",In(),y(),!0)},qa=(e,t)=>t.slice(0,-1).map(n=>({x:n.endPoint.x,y:n.endPoint.y,pathDistance:n.endDistance,emoji:Fr,captured:!1,sectionIndex:n.index})),Fn=()=>{b=v.length>0?1:0,V=null,ke(),_e.forEach(e=>{e.captured=!1}),qe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),Un(),le()},$n=()=>Wa(Re),Wa=e=>{const t=Math.max(3,Math.min(Je,Math.floor(At/qt)));return Math.min(t,1+Math.floor(e/qt))},fe=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},ze=(e,t,n=()=>null)=>{const r=e[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(t<0){const s=r.angle*Math.PI/180;return{...r,x:r.x+Math.cos(s)*t,y:r.y+Math.sin(s)*t,distance:t}}if(e.length<=1||t<=0)return{...r,distance:Math.max(0,t)};for(let s=1;s<e.length;s+=1){const i=e[s-1],c=e[s];if(!i||!c||t>c.distance)continue;const g=c.distance-i.distance,m=g>0?(t-i.distance)/g:0,E=i.x+(c.x-i.x)*m,S=i.y+(c.y-i.y)*m,u=n(t);return{x:E,y:S,angle:u??Mt({x:c.x-i.x,y:c.y-i.y}),distance:t,visible:c.visible}}return{...e[e.length-1]??r,distance:t}},Lt=()=>{ae==null||ae.style.setProperty("opacity","0"),se==null||se.style.setProperty("opacity","0"),Dt.forEach(e=>{e.style.opacity="0"})},qn=(e,t,n=performance.now())=>{if(t.trail.length===0){e.layerEl.style.opacity="0";return}e.layerEl.style.opacity="1";const r=k(),a=t.segmentSpacing??r.segmentSpacing,s=Tn(t.headDistance,t.bodyCount,a),i=s.bodyCount,c=x=>t.headDistance+t.retractionDistance-x,g=x=>Math.max(0,Math.min(t.headDistance,x)),m=x=>t.retractionDistance>0&&x>=t.headDistance-Kr,E=ze(t.trail,Math.min(t.headDistance,c(0)),t.getAngleOverride),S=je(r.head,t.headAngle);e.headImageEl.setAttribute("href",n<(t.chewUntil??0)&&S===r.head?r.head.chewHref:S.href),fe(e.headEl,e.headImageEl,{...E,angle:t.headAngle,visible:!m(c(0))},S.metrics.width,S.metrics.height,S.metrics.anchorX,S.metrics.anchorY,S.metrics.rotationOffset),e.bodyEls.forEach((x,Nt)=>{if(Nt>=i){x.style.opacity="0";return}const Ve=x.querySelector("image");if(!Ve)return;const Zn=(Nt+1)*a,Ot=c(Zn);if(m(Ot)){x.style.opacity="0";return}const Rt=ze(t.trail,g(Ot),t.getAngleOverride),Xn=r.bodySprites.find(jn=>jn.id===x.dataset.snakeBodyVariant)??r.bodySprites[0]??kt.classic.bodySprites[0],j=je(Xn,Rt.angle);Ve.setAttribute("href",j.href),fe(x,Ve,Rt,j.metrics.width,j.metrics.height,j.metrics.anchorX,j.metrics.anchorY,j.metrics.rotationOffset)});const u=e.tailEl.querySelector("image");if(!u)return;if(t.showTail===!1){e.tailEl.style.opacity="0";return}const _=(i+1)*a,h=c(_);if(!s.showTail||m(h)){e.tailEl.style.opacity="0";return}const W=ze(t.trail,g(h),t.getAngleOverride),D=je(r.tail,W.angle);u.setAttribute("href",D.href),fe(e.tailEl,u,W,D.metrics.width,D.metrics.height,D.metrics.anchorX,D.metrics.anchorY,D.metrics.rotationOffset)},L=(e=performance.now())=>{var i,c;const t=Ea();if(!t)return;const n=o==null?void 0:o.getState();if(p!=="hidden"&&n!==void 0&&F===n.activeStrokeIndex||n!==void 0&&((i=$(n))==null?void 0:i.isDot)===!0){Lt();return}const a=re||n!==void 0&&de(n)&&((c=$(n))==null?void 0:c.isDot)!==!0,s=a&&n!==void 0?en(n):Fe();qn(t,{trail:T,headDistance:K,headAngle:ye,bodyCount:a?1:$n(),segmentSpacing:s,retractionDistance:0,chewUntil:It,showTail:!0},e)},Ga=e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove(),Z=Z.filter(t=>t!==e),Dn()},bt=e=>{qn(e.parts,{trail:e.trail,headDistance:e.headDistance,headAngle:e.headAngle,bodyCount:e.bodyCount,segmentSpacing:e.segmentSpacing,retractionDistance:e.retractionDistance,showTail:e.showTail})},Ba=e=>{let t=null;const n=r=>{if(!Z.includes(e))return;if(t===null){t=r,e.animationFrameId=requestAnimationFrame(n);return}const a=Math.max(0,r-t)/1e3;t=r;const s=a*Vr,i=e.retractionTarget-e.retractionDistance;if(Math.abs(i)<=s){e.retractionDistance=e.retractionTarget,bt(e),Ga(e);return}e.retractionDistance+=Math.sign(i)*s,bt(e),e.animationFrameId=requestAnimationFrame(n)};e.animationFrameId=requestAnimationFrame(n)},Wn=()=>{var m;const e=C==null?void 0:C.parentElement;if(!C||!e||T.length===0)return;const t=C.cloneNode(!0);ka(t),t.classList.add("writing-app__snake--retiring"),e.insertBefore(t,C);const n=ba(t);if(!n){t.remove();return}const r=o==null?void 0:o.getState(),a=r!==void 0&&de(r)&&((m=$(r))==null?void 0:m.isDot)!==!0,s=a?1:$n(),i=a?en(r):Fe(),c=Tn(K,s,i).bodyCount,g={parts:n,trail:T.map(E=>({...E})),headDistance:K,headAngle:ye,bodyCount:s,segmentSpacing:i,retractionDistance:0,retractionTarget:(c+1)*i,showTail:!0,animationFrameId:null};Z.push(g),bt(g),Ba(g)},Gn=()=>{Z.forEach(e=>{e.animationFrameId!==null&&(cancelAnimationFrame(e.animationFrameId),e.animationFrameId=null),e.parts.layerEl.remove()}),Z=[]},Be=(e,t,n=!0,r={})=>{const a=Pt(t),s=r.preserveGrowth?Re:0;ye=Mt(a),T=[{x:e.x,y:e.y,angle:ye,distance:0,visible:n}],K=0,Re=s,It=0,be=!1,A=!1,L()},Ue=(e,t,n)=>{const r=Pt(t),a=Mt(r);ye=a;const s=T[T.length-1];if(!s){Be(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?T[T.length-1]={...s,x:e.x,y:e.y,angle:a}:(T.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),K=s.distance+.001),L();return}K=s.distance+i,Re+=i,T.push({x:e.x,y:e.y,angle:a,distance:K,visible:n}),L()},Bn=e=>{let t=!1;_e.forEach((n,r)=>{if(n.captured||n.sectionIndex>=b||e+.5<n.pathDistance)return;n.captured=!0;const a=qe[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(It=performance.now()+Ur,fa(),le(),L())},Un=()=>{if(!J)return;const e=Ge();if(!e||wt(e)){J.classList.add("writing-app__boundary-star--hidden");return}J.classList.remove("writing-app__boundary-star--hidden"),J.setAttribute("x",`${e.endPoint.x}`),J.setAttribute("y",`${e.endPoint.y}`)},Ua=e=>{var t;if(w||Bn(Ee(e)),!(!w&&Hn(e))){if(de(e)&&((t=$(e))==null?void 0:t.isDot)===!0){L();return}Ue(e.cursorPoint,Aa(e),!0),!w&&e.isPenDown&&_a(e)}},Vn=()=>{ne!==null&&(cancelAnimationFrame(ne),ne=null),w=!1,re=!1,O.disabled=!1,O.textContent="Demo",le(),L(),y()},Kt=()=>{o==null||o.reset(),P=null,H=null,ie=!1,we(!1),re=!1,q(),Gn(),te.forEach((t,n)=>{const r=Se[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),be=!1,A=!1;const e=o==null?void 0:o.getState();e?Be(e.cursorPoint,e.cursorTangent,!0):Lt(),Fn(),We(),y()},y=()=>{Xe||(Xe=!0,requestAnimationFrame(()=>{Xe=!1,Va()}))},Va=()=>{if(!o)return;const e=o.getState();Ca(e),Nn(),Rn(),ke();const t=new Set(e.completedStrokes);if(te.forEach((n,r)=>{const a=Se[r]??0;if(t.has(r)||Da(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),e.status==="complete"){ie||(ie=!0,Ue(e.cursorPoint,e.cursorTangent,!0),Wn()),Lt(),Dn();return}!w&&!A?Ua(e):L(),ie=!1,we(!1)},Ka=(e,t)=>Math.hypot(e.velocity.x,e.velocity.y)<=.001?t:Pt(e.velocity),Ya=e=>{const t=new Set(e.completedStrokes);te.forEach((n,r)=>{const a=Se[r]??.001;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`})},Za=(e,t)=>{const n=ce[e.activeStrokeIndex],r=d==null?void 0:d.strokes[e.activeStrokeIndex];return!(n!=null&&n.deferred)||e.activeStrokeIndex<0||!e.isPenDown?(re=!1,q(),!1):r!=null&&r.isDot?(re=!1,F=e.activeStrokeIndex,Y=e.point,p="waiting",Nn(),!0):(q(),re=!0,!1)},Xa=()=>{if(!ee||w)return;Kt(),Vn();const e=new ir(ee,{speed:1.7*$t,penUpSpeed:2.1*$t,deferredDelayMs:150});w=!0,O.disabled=!0,O.textContent="Demo...",le(),L();const t=performance.now();let n=(o==null?void 0:o.getState().cursorTangent)??{x:1,y:0};const r=a=>{const s=a-t,i=Math.min(s,e.totalDuration),c=e.getFrame(i),g=Ka(c,n),m=Za(c);if(Ya(c),c.isPenDown&&!m?(Ue(c.point,g,!0),n=g):L(),s<e.totalDuration+ar){ne=requestAnimationFrame(r);return}ne=null,q(),w=!1,O.disabled=!1,O.textContent="Demo",le(),Kt()};ne=requestAnimationFrame(r),y()},ja=e=>{const t=e.bodySprites[0]??kt.classic.bodySprites[0],n=e.bodySprites[1];return e.id==="themePark"&&e.bodySprites.length>1?e.bodySprites[Math.floor(Math.random()*e.bodySprites.length)]??t:!n||Math.random()>=qr?t:n},za=(e,t,n,r)=>{Gn(),yn=t;const a=k(),s=nr(e);d=s,ce=e.strokes.filter(u=>u.type!=="lift"),At=s.strokes.reduce((u,_)=>u+_.totalLength,0),ht=rr(s).groups,v=or(s,{groups:ht}).sections,b=v.length>0?1:0,o=new sr(s,{startTolerance:Ne,hitTolerance:Ne}),P=null,_e=qa(s,v);const c=ce,g=v.map(u=>`<path class="writing-app__stroke-bg" d="${On(s,u,c)}"></path>`).join(""),m=c.map(u=>`<path class="writing-app__stroke-trace" d="${Yt(u.curves)}"></path>`).join(""),E=Array.from({length:Je},(u,_)=>{const h=Je-1-_,W=ja(a);return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${h}"
        data-snake-body-variant="${W.id}"
      >
        <image
          href="${W.href}"
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
    ${g}
    <path class="writing-app__stroke-next" id="next-section-stroke" d=""></path>
    ${m}
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
      ${E}
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
        href="${Qe}"
        preserveAspectRatio="none"
      ></image>
    </g>
  `,te=Array.from(l.querySelectorAll(".writing-app__stroke-trace")),Q=l.querySelector("#next-section-stroke"),Ae=l.querySelector("#section-annotations"),V=null,qe=Array.from(l.querySelectorAll(".writing-app__fruit")),J=l.querySelector("#waypoint-star"),C=l.querySelector("#trace-snake"),ae=l.querySelector("#snake-head"),mt=l.querySelector("#snake-head-image"),se=l.querySelector("#snake-tail"),Dt=Array.from(l.querySelectorAll(".writing-app__snake-body")).sort((u,_)=>Number(u.dataset.snakeBodyIndex)-Number(_.dataset.snakeBodyIndex)),I=l.querySelector("#dot-snake"),De=l.querySelector("#dot-snake-image"),U=l.querySelector("#dot-eagle"),Ie=l.querySelector("#dot-eagle-image"),Se=te.map(u=>{const _=u.getTotalLength();return Number.isFinite(_)&&_>0?_:.001}),te.forEach((u,_)=>{const h=Se[_]??.001;u.style.strokeDasharray=`${h} ${h}`,u.style.strokeDashoffset=`${h}`}),Rn();const S=o.getState();Be(S.cursorPoint,S.cursorTangent),q(),Fn(),We(),ie=!1,we(!1),y()},Kn=(e,t=-1)=>{Vn();const n=tr(e,{joinSpacing:f,keepInitialLeadIn:Sn,keepFinalLeadOut:_n});gt=e,vt=t,tn.textContent=e,$e.value=ga(e),ee=n.path,za(n.path,n.width,n.height,n.offsetY)},Et=(e,t=-1)=>{const n=kn(e);if(!n)return Bt("Type a word first."),!1;try{return Kn(n,t),En(),!0}catch{return Bt("Couldn't build that word. Try letters supported by the cursive set."),!1}},Yn=()=>{let e=Ut();for(;e;){if(Le="nextQueued",Et(e)){yt();return}e=Ut()}Le="current";const t=er(vt);Et(Ht[t]??Ht[0],t),yt()},Qa=e=>{if(w||!o||P!==null)return;const t=Zt(l,e),n=o.getState(),r=$(n),a=A;if(de(n)&&!La(t,n))return;if(de(n)&&(r!=null&&r.isDot)){e.preventDefault(),Ma();return}o.beginAt(t)&&(e.preventDefault(),P=e.pointerId,H=t,ha(),ma(),a?Ct():a||(A=!1),l.setPointerCapture(e.pointerId),y())},Ja=e=>{if(!(w||!o||e.pointerId!==P)){if(e.preventDefault(),H=Zt(l,e),A){In(),y();return}o.update(H),y()}},es=e=>{!o||e.pointerId!==P||(o.end(),l.hasPointerCapture(e.pointerId)&&l.releasePointerCapture(e.pointerId),P=null,H=null,y())},ts=e=>{e.pointerId===P&&(o==null||o.end(),l.hasPointerCapture(e.pointerId)&&l.releasePointerCapture(e.pointerId),P=null,H=null,y())};l.addEventListener("pointerdown",Qa);l.addEventListener("pointermove",Ja);l.addEventListener("pointerup",es);l.addEventListener("pointercancel",ts);O.addEventListener("click",Xa);nt.addEventListener("input",()=>{Ne=Number(nt.value),wn(),M()});rt.addEventListener("input",()=>{Oe=Number(rt.value),bn(),V=null,ke()});at.addEventListener("change",()=>{fn=at.checked,V=null,ke()});Ce.addEventListener("change",()=>{Jt=Ce.checked?"themePark":"classic",xn(),M()});st.addEventListener("input",()=>{f={...f,targetBendRate:Number(st.value)},X(),M()});it.addEventListener("input",()=>{f={...f,minSidebearingGap:Number(it.value)},X(),M()});ot.addEventListener("input",()=>{f={...f,bendSearchMinSidebearingGap:Number(ot.value)},X(),M()});ct.addEventListener("input",()=>{f={...f,bendSearchMaxSidebearingGap:Number(ct.value)},X(),M()});lt.addEventListener("input",()=>{f={...f,exitHandleScale:Number(lt.value)},X(),M()});dt.addEventListener("input",()=>{f={...f,entryHandleScale:Number(dt.value)},X(),M()});ut.addEventListener("change",()=>{Sn=ut.checked,M()});pt.addEventListener("change",()=>{_n=pt.checked,M()});mn.addEventListener("submit",e=>{e.preventDefault(),Le="current",Et($e.value)});xt.addEventListener("click",Yn);$e.addEventListener("input",()=>{oe.hidden||En()});document.addEventListener("pointerdown",e=>{if(!he.open)return;const t=e.target;t instanceof Node&&he.contains(t)||(he.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(he.open=!1)});wn();bn();X();yt();xn();Yn();
