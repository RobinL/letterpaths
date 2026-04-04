import{M as Ln,a as Nn,T as Cn,f as Fn,W as Lt,b as $n,c as Hn,d as Rn,e as nt,A as On,g as Xt,h as Nt}from"./shared-CvxpMkzH.js";import{a as qn}from"./groups-Cr1poJ62.js";const Vt="/letterpaths/writing_app/assets/body-CgvmrS6c.png",jt="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",Wn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",it="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Bn="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",Un="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",Gn="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",Yn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Kn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Xn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Vn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",jn="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",He="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Te="/letterpaths/writing_app/assets/head-CeHhv_vT.png",zt="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",Ct="G-94373ZKHEE",zn=new Set(["localhost","127.0.0.1"]),Zn=()=>{if(zn.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",Ct);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${Ct}`,document.head.append(e)},Qn=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},rt=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Zt=150,Jn=44,er=180,Ft=.75,U=76,$t=115,tr=.25,Qt=.3,Jt=.12,nr=.42,lt=10,Q=260,at=510,rr=220,ar=700,Ht=6,P={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},q={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},or={...q,height:q.height*(209/431/(160/435))},C={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,fe=44,en=700,sr=260,tn=800,ir=18,lr=.72,V={width:200,height:106},ne={width:69,height:49,anchorX:.5,anchorY:.62},Be={width:128,height:141,anchorX:.5,anchorY:1},cr=[Yn,Kn,Xn,Vn],St=document.querySelector("#app");if(!St)throw new Error("Missing #app element for snake app.");Zn();Qn();St.innerHTML=`
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Drag the snake around the letters.</p>
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
                    min="${Ln}"
                    max="${Nn}"
                    step="${Cn}"
                    value="${Zt}"
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
            <p class="writing-app__success-eyebrow">Snake fed!</p>
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
`;St.style.setProperty("--snake-board-image",`url("${Wn}")`);const nn=document.querySelector("#word-label"),rn=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),oe=document.querySelector("#show-me-button"),Se=document.querySelector("#settings-menu"),ct=document.querySelector("#tolerance-slider"),an=document.querySelector("#tolerance-value"),dt=document.querySelector("#include-initial-lead-in"),ut=document.querySelector("#include-final-lead-out"),on=document.querySelector("#success-overlay"),sn=document.querySelector("#custom-word-form"),Ze=document.querySelector("#custom-word-input"),se=document.querySelector("#custom-word-error"),xt=document.querySelector("#next-word-button");if(!nn||!rn||!d||!oe||!Se||!ct||!an||!dt||!ut||!on||!sn||!Ze||!se||!xt)throw new Error("Missing elements for snake app.");let wt=-1,pt="",Ue="current",gt=null,l=null,$=null,K=null,ot=!1,xe=[],Ge=[],we=[],Ye=[],R=null,ke=null,S=!1,Ke=Zt,ln=!0,cn=!0,ie=[],Qe=[],M=[],be=[],Ae=null,x=1,te=null,Xe=1600,ft=900,kt=0,_=null,le=[],Re=null,re=null,Oe=null,Et=[],B=null,me=null,Je=new Map,N=null,qe=null,j=null,We=null,y=[],v=0,De=0,Z=null,vt=0,m=0,b=0,z=null,T=null,F=0,O=null,G=null,A=!1,I=!1,Ie=0,Le=[],Ve=new Set,Ee=[],f="hidden",ce=null,ae=null,W=0,D=null,w=!1,ee=null,he=[],Rt=!1,$e=null,ye=[],Ot=!1,ht=-1,_e=Number.POSITIVE_INFINITY;const dn=()=>{an.textContent=`${Ke}px`},bt=()=>{pt&&Pn(pt,wt)},un=()=>{se.hidden=!0,se.textContent=""},qt=e=>{se.hidden=!1,se.textContent=e},pn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),dr=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(pn).filter(t=>t.length>0)},je=dr();let ve=0;const yt=()=>{xt.textContent=ve<je.length?"Next queued word":"Next random word"},ur=e=>Ue==="nextQueued"?je[ve]??e:e,Wt=()=>{if(ve>=je.length)return null;const e=je[ve];return ve+=1,e??null},gn=()=>$e||($e=cr.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Jt,t}),$e),fn=()=>ee||(ee=new Audio(Gn),ee.preload="auto",ee.volume=Qt,ee),pr=()=>{Rt||(fn().load(),Rt=!0)},gr=()=>{Ot||(gn().forEach(e=>{e.load()}),Ot=!0)},fr=()=>{const e=fn(),t=e.currentSrc||e.src;if(!t)return;const n=new Audio(t);n.preload="auto",n.currentTime=0,n.volume=Qt,he.push(n),n.addEventListener("ended",()=>{he=he.filter(r=>r!==n)}),n.addEventListener("error",()=>{he=he.filter(r=>r!==n)}),n.play().catch(()=>{})},hr=()=>{const e=gn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Jt,ye.push(r),r.addEventListener("ended",()=>{ye=ye.filter(a=>a!==r)}),r.addEventListener("error",()=>{ye=ye.filter(a=>a!==r)}),r.play().catch(()=>{})},et=()=>{const e=x>0?x-1:-1,t=e>=0?M[e]:null;ht=e,_e=t?t.startDistance+U:Number.POSITIVE_INFINITY},yr=e=>{if(!e.isPenDown||S||A||I||w)return;const t=x>0?x-1:-1,n=t>=0?M[t]:null;if(!n){_e=Number.POSITIVE_INFINITY,ht=t;return}t!==ht&&et();const r=Pe(e);let a=!1;for(;r>=_e&&_e<=n.endDistance;)Math.random()<nr&&(a=!0),_e+=U;a&&hr()},Ne=()=>{const e=S;Qe.forEach(t=>{const n=ie[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=x;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),rn.textContent=ie.length===0?"Nice tracing.":"All the fruit is collected."},de=e=>{on.hidden=!e},ue=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},ge=e=>Math.atan2(e.y,e.x)*(180/Math.PI),mr=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ce=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},_r=()=>{if(Ce(),Math.abs(m-b)<.5){m=b,L();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*ar,o=b-m;if(Math.abs(o)<=a){m=b,z=null,L(),hn();return}m+=Math.sign(o)*a,L(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},Sr=e=>{const t=Math.max(0,e);Math.abs(t-b)<.5||(b=t,_r())},xr=()=>{Ce(),b=m,T=v,F=m},hn=()=>{if(!w||$===null||!K||!l||m>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(w=!1,T=v,F=m,l.update(K),k(),!0):!1},wr=()=>{if(T===null)return;const e=Math.max(0,v-T),t=Math.max(0,F-e);if(Math.abs(t-m)<.5){t<=.5&&(m=0,b=0,T=null,F=0);return}m=t,b=t,t<=.5&&(m=0,b=0,T=null,F=0)},tt=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,kr=e=>le[e.activeStrokeIndex]??null,yn=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Pe=e=>{var n;if(!_)return 0;if(e.status==="complete")return kt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+yn(e)},pe=e=>{var t;return((t=kr(e))==null?void 0:t.deferred)===!0},Er=e=>e.status==="complete"||!pe(e)?!1:le.slice(e.activeStrokeIndex).every(t=>(t==null?void 0:t.deferred)===!0),At=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},mn=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},_n=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=le[t];if(!(!n||n.deferred))return mn(t)}return null},Bt=e=>{if(pe(e)){const n=_n(e);if(n)return n}const t=[...y].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:mr(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},Dt=e=>{var t;return S||e.status==="complete"||!pe(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=tt(e))==null?void 0:t.isDot)===!0}},vr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===ce&&((n=tt(t))==null?void 0:n.isDot)===!0&&f!=="hidden"&&f!=="waiting"},br=e=>{if(!me)return;const t=Dt(e);if(!t){me.style.opacity="0";return}if(t.isDot){me.style.opacity="0";return}It(me,{point:t.point,tangent:t.tangent,angle:ge(t.tangent)},{isDot:!1,headHref:Te,travelledDistance:yn(e)})},It=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),o=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=o==null?void 0:o.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Te),Y(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},P.width*J,P.height*J,P.anchorX,P.anchorY,P.rotationOffset),n.isDot){a&&(a.style.opacity="0"),o&&(o.style.opacity="0");return}const h=At(n.travelledDistance??Number.POSITIVE_INFINITY,1,fe);if(h.bodyCount===0){a&&(a.style.opacity="0"),o&&(o.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*fe,y:t.point.y-t.tangent.y*fe},E={x:t.point.x-t.tangent.x*fe*2,y:t.point.y-t.tangent.y*fe*2};a&&c&&Y(a,c,{x:p.x,y:p.y,angle:t.angle,visible:!0},q.width*J,q.height*J,q.anchorX,q.anchorY,q.rotationOffset),o&&u&&h.showTail?Y(o,u,{x:E.x,y:E.y,angle:t.angle,visible:!0},C.width*J,C.height*J,C.anchorX,C.anchorY,C.rotationOffset):o&&(o.style.opacity="0")},Ut=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${zt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Vt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Te}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,Me=()=>{G!==null&&(cancelAnimationFrame(G),G=null),f="hidden",ce=null,ae=null,N&&(N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting")),j&&(j.style.opacity="0")},Ar=e=>({x:e.x,y:e.y-ir}),Dr=e=>({x:e.x,y:e.y+8}),Sn=(e=performance.now())=>{if(f==="hidden"||!ae)return null;const t=Dr(ae),n=Ar(ae);if(f==="waiting")return{snakePoint:t,snakeHref:He,snakeWobble:!0};if(f==="eagle_in"){const i=Math.max(0,Math.min(1,(e-W)/en)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:He,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+V.height)*c},eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}}if(f==="eagle_stand")return{snakePoint:t,snakeHref:He,snakeWobble:!1,eaglePoint:n,eagleHref:Bn,eagleWidth:Be.width,eagleHeight:Be.height};const r=Math.max(0,Math.min(1,(e-W)/tn)),a=1-(1-r)*(1-r),o={x:n.x+(Xe+V.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:o.x,y:o.y+V.height*.6},snakeHref:jn,snakeWobble:!1,eaglePoint:o,eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}},xn=()=>{var t;const e=l==null?void 0:l.getState();if(!(!l||!e)&&ce!==null&&e.activeStrokeIndex===ce&&(t=tt(e))!=null&&t.isDot){l.beginAt(e.cursorPoint);const n=l.getState();Dn(Pe(n)),En(n)}},Ir=()=>{xn(),Me(),k()},wn=e=>{if(G=null,!(f==="hidden"||f==="waiting")){if(f==="eagle_in"&&e-W>=en)f="eagle_stand",W=e;else if(f==="eagle_stand"&&e-W>=sr)f="eagle_out",W=e;else if(f==="eagle_out"&&e-W>=tn){Ir();return}k(),G=requestAnimationFrame(wn)}},Pr=()=>{f==="waiting"&&(xn(),f="eagle_in",W=performance.now(),G!==null&&cancelAnimationFrame(G),G=requestAnimationFrame(wn),k())},Mr=e=>{const t=Dt(e);if(!(t!=null&&t.isDot)){if(f!=="hidden"&&f!=="waiting")return;Me();return}ce!==t.strokeIndex?(Me(),ce=t.strokeIndex,ae=t.point,f="waiting"):f==="waiting"&&(ae=t.point)},Tr=(e=performance.now())=>{if(!N||!qe||!j||!We)return;const t=Sn(e);if(!t){N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting"),j.style.opacity="0";return}if(N.style.opacity="1",N.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),qe.setAttribute("href",t.snakeHref),Y(N,qe,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},ne.width,ne.height,ne.anchorX,ne.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){j.style.opacity="0";return}We.setAttribute("href",t.eagleHref),Y(j,We,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Be.anchorX,Be.anchorY,0)},Lr=(e,t)=>{const n=Dt(t);if(!n)return!1;if(n.isDot){if(f!=="waiting")return!1;const a=Sn();if(!a)return!1;const o=Math.max(ne.width,ne.height)*lr;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=o}const r=Math.max(34,P.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Nr=e=>{e.completedStrokes.forEach(t=>{if(Ve.has(t))return;Ve.add(t);const n=le[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=mn(t);a&&Le.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:ge(a.tangent)})})},Cr=()=>{Je.forEach((e,t)=>{const n=Le.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}It(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},Pt=()=>{Je.forEach(e=>{e.style.opacity="0"})},Fr=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],o=e[r];if(!a||!o||t>o.distanceAlongStroke)continue;const i=o.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(o.x-a.x)*c,y:a.y+(o.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},kn=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return Fr(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},$r=e=>{const t=M[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=kn(_,n),a=ue({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:ue({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},Hr=()=>{x=Math.min(x+1,M.length),Ae=x-1<be.length?x-1:null,In(),Ne(),et()},En=e=>{if(S||A||I||w||M.length<=x)return!1;const t=x-1,n=M[t];return!n||Pe(e)<n.endDistance-8?!1:(w=!0,T=null,F=0,Z=n.endDistance,D=$r(t+1),D&&(De=ge(D),ze(n.endPoint,D,!0)),Hr(),l==null||l.end(),bn(),k(),!0)},Rr=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const o=Math.max(1,Math.round(a/er));return Array.from({length:o},(i,c)=>{const u=n.startDistance+a*(c+1)/(o+1),h=kn(e,u);return{x:h.x,y:h.y,pathDistance:u,emoji:rt[(r+c)%rt.length]??rt[0],captured:!1,groupIndex:r}})}),vn=()=>{x=M.length>0?1:0,Ae=be.length>0?0:null,ie.forEach(e=>{e.captured=!1}),Qe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),In(),Ne()},Mt=()=>{const e=Math.max(3,Math.min(lt,Math.floor(kt/$t)));return Math.min(e,1+Math.floor(v/$t))},bn=()=>{if(S||A||I){T=null,F=0;return}if(!w)return;const e=At(v,Mt(),U).bodyCount;Sr((e+1)*U)},Y=(e,t,n,r,a,o,i,c)=>{t.setAttribute("x",`${(-r*o).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},st=e=>{const t=y[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(y.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<y.length;r+=1){const a=y[r-1],o=y[r];if(!a||!o||e>o.distance)continue;const i=o.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(o.x-a.x)*c,h=a.y+(o.y-a.y)*c;return{x:u,y:h,angle:ge({x:o.x-a.x,y:o.y-a.y}),distance:e,visible:o.visible}}return{...y[y.length-1]??t,distance:e}},An=()=>{re==null||re.style.setProperty("opacity","0"),B==null||B.style.setProperty("opacity","0"),Et.forEach(e=>{e.style.opacity="0"})},L=(e=performance.now())=>{if(!Re||!re||!Oe||!B||y.length===0)return;if(S||I){Re.style.opacity="0";return}Re.style.opacity="1";const t=A?Ie:Mt(),n=A?0:m,r=At(v,t,U),a=r.bodyCount,o=st(v);Oe.setAttribute("href",e<vt?Un:Te),Y(re,Oe,{...o,angle:De},P.width,P.height,P.anchorX,P.anchorY,P.rotationOffset),Et.forEach((h,p)=>{if(p>=a){h.style.opacity="0";return}const E=h.querySelector("image");if(!E)return;const X=Math.max(0,(p+1)*U-n);if(X<=Ht){h.style.opacity="0";return}const Fe=st(Math.max(0,v-X)),s=E.getAttribute("href")===jt?or:q;Y(h,E,Fe,s.width,s.height,s.anchorX,s.anchorY,s.rotationOffset)});const i=B.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*U-n);if(!r.showTail||c<=Ht){B.style.opacity="0";return}const u=st(Math.max(0,v-c));Y(B,i,u,C.width,C.height,C.anchorX,C.anchorY,C.rotationOffset)},Tt=(e,t,n=!0)=>{const r=ue(t);De=ge(r),y=[{x:e.x,y:e.y,angle:De,distance:0,visible:n}],v=0,vt=0,m=0,b=0,T=null,F=0,Z=null,D=null,w=!1,I=!1,A=!1,Ie=0,Ce(),O!==null&&(cancelAnimationFrame(O),O=null),L()},ze=(e,t,n)=>{const r=ue(t),a=ge(r);De=a;const o=y[y.length-1];if(!o){Tt(e,r,n);return}const i=Math.hypot(e.x-o.x,e.y-o.y);if(i<.5){o.visible===n?y[y.length-1]={...o,x:e.x,y:e.y,angle:a}:(y.push({x:e.x,y:e.y,angle:a,distance:o.distance+.001,visible:n}),v=o.distance+.001),L();return}v=o.distance+i,y.push({x:e.x,y:e.y,angle:a,distance:v,visible:n}),wr(),L()},Gt=(e,t,n)=>{const r=ue(t),a=[];r.x>.001?a.push((Xe+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((ft+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const o=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(o)?o:Math.max(Xe,ft)+Q)+(n+2)*U+Q},Yt=(e,t)=>{if(A||I)return;Ce(),m=0,b=0,T=null,F=0,Z=null,D=null,w=!1;const n=ue(t),r=performance.now();Ie=Mt();const a=Gt(e,n,Ie);Ee=Le.map(i=>({...i,travelDistance:Gt(i.point,i.tangent,0)})),A=!0,de(!1);const o=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*at);ze({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),Ee.forEach(p=>{const E=Je.get(p.strokeIndex);if(!E)return;const X=Math.min(p.travelDistance,c*at);It(E,{point:{x:p.point.x+p.tangent.x*X,y:p.point.y+p.tangent.y*X},tangent:p.tangent,angle:p.angle})});const h=Ee.every(p=>c*at>=p.travelDistance);if(u>=a&&h){A=!1,I=!0,O=null,An(),Pt(),de(!0);return}O=requestAnimationFrame(o)};O=requestAnimationFrame(o)},Dn=e=>{let t=!1;ie.forEach((n,r)=>{if(n.captured||n.groupIndex>=x||e+.5<n.pathDistance)return;n.captured=!0;const a=Qe[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(vt=performance.now()+rr,fr(),Ne(),L())},In=()=>{if(!te)return;const e=Ae!==null?be[Ae]:void 0;if(!e){te.classList.add("writing-app__boundary-star--hidden");return}te.classList.remove("writing-app__boundary-star--hidden"),te.setAttribute("x",`${e.x}`),te.setAttribute("y",`${e.y}`)},Or=e=>{if(Z!==null){if(Pe(e)+.5<Z){L();return}Z=null}const n=D!==null&&(w||e.isPenDown)&&D?D:e.cursorTangent;if(pe(e)){const r=_n(e),a=y[y.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&ze(r.point,r.tangent,!0)}else ze(e.cursorPoint,n,!0);D&&e.isPenDown&&!w&&(D=null),S||Dn(Pe(e)),!S&&e.isPenDown&&(yr(e),En(e))},mt=()=>{ke!==null&&(cancelAnimationFrame(ke),ke=null),S=!1,oe.disabled=!1,oe.textContent="Demo",we.forEach((e,t)=>{const n=Ye[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),R&&(R.style.opacity="0"),Ne(),L(),k()},Kt=()=>{l==null||l.reset(),$=null,K=null,de(!1),I=!1,A=!1,Ie=0,Le=[],Ve=new Set,Ee=[],Me(),O!==null&&(cancelAnimationFrame(O),O=null),xe.forEach((t,n)=>{const r=Ge[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ce(),m=0,b=0,T=null,F=0,Z=null,D=null,w=!1;const e=l==null?void 0:l.getState();e?Tt(e.cursorPoint,e.cursorTangent,!0):An(),Pt(),vn(),et(),k()},k=()=>{ot||(ot=!0,requestAnimationFrame(()=>{ot=!1,qr()}))},qr=()=>{if(!l)return;const e=l.getState();bn(),Nr(e),Mr(e),Tr(),br(e),Cr();const t=new Set(e.completedStrokes);if(xe.forEach((n,r)=>{const a=Ge[r]??0;if(t.has(r)||vr(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const o=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,o)}`;return}n.style.strokeDashoffset=`${a}`}),!S&&!A&&!I&&!w?Or(e):L(),!S&&!A&&!I&&Er(e)){const n=Bt(e);Yt(n.point,n.tangent)}if(e.status==="complete"){if(!S&&!A&&!I){const n=Bt(e);Yt(n.point,n.tangent)}de(I);return}de(!1)},Wr=()=>{if(!gt||S)return;Kt(),mt();const e=new On(gt,{speed:1.7*Ft,penUpSpeed:2.1*Ft,deferredDelayMs:150});S=!0,oe.disabled=!0,oe.textContent="Demo...",Ne(),L();const t=performance.now(),n=r=>{const a=r-t,o=Math.min(a,e.totalDuration),i=e.getFrame(o),c=new Set(i.completedStrokes);if(we.forEach((u,h)=>{const p=Ye[h]??.001;if(c.has(h)){u.style.strokeDashoffset="0";return}if(h===i.activeStrokeIndex){const E=p*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,E)}`;return}u.style.strokeDashoffset=`${p}`}),R&&(R.setAttribute("cx",i.point.x.toFixed(2)),R.setAttribute("cy",i.point.y.toFixed(2)),R.style.opacity=a<=e.totalDuration+Nt?"1":"0"),a<e.totalDuration+Nt){ke=requestAnimationFrame(n);return}mt(),Kt()};ke=requestAnimationFrame(n),k()},Br=(e,t,n,r)=>{Xe=t,ft=n;const a=Hn(e);_=a,le=e.strokes.filter(s=>s.type!=="lift"),kt=a.strokes.reduce((s,g)=>s+g.totalLength,0),M=qn(a).groups,be=M.slice(1).map(s=>({x:s.startPoint.x,y:s.startPoint.y})),Ae=be.length>0?0:null,x=M.length>0?1:0,l=new Rn(a,{startTolerance:Ke,hitTolerance:Ke}),$=null,ie=Rr(a,M);const i=le,c=i.map(s=>`<path class="writing-app__stroke-bg" d="${nt(s.curves)}"></path>`).join(""),u=i.map(s=>`<path class="writing-app__stroke-trace" d="${nt(s.curves)}"></path>`).join(""),h=i.map(s=>`<path class="writing-app__stroke-demo" d="${nt(s.curves)}"></path>`).join(""),p=ie.map((s,g)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${g}"
          x="${s.x}"
          y="${s.y}"
          style="font-size: ${Jn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${s.emoji}</text>
      `).join(""),E=Array.from({length:lt},(s,g)=>{const H=lt-1-g,Tn=Math.random()<tr?jt:Vt;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${H}"
      >
        <image
          href="${Tn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),X=i.map((s,g)=>s.deferred?g:null).filter(s=>s!==null).map(s=>Ut(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${s}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
    ${c}
    ${u}
    ${h}
    <text
      class="writing-app__boundary-star"
      id="waypoint-star"
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="middle"
    >⭐</text>
    <g class="writing-app__snake" id="trace-snake">
      <g
        class="writing-app__snake-segment writing-app__snake-tail"
        id="snake-tail"
      >
        <image
          href="${zt}"
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
          href="${Te}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${p}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${X}
    </g>
    ${Ut('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${He}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${it}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,xe=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),we=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Qe=Array.from(d.querySelectorAll(".writing-app__fruit")),te=d.querySelector("#waypoint-star"),Re=d.querySelector("#trace-snake"),re=d.querySelector("#snake-head"),Oe=d.querySelector("#snake-head-image"),B=d.querySelector("#snake-tail"),Et=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((s,g)=>Number(s.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),me=d.querySelector("#deferred-head"),Je=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(s=>[Number(s.dataset.deferredTrailIndex),s])),N=d.querySelector("#dot-snake"),qe=d.querySelector("#dot-snake-image"),j=d.querySelector("#dot-eagle"),We=d.querySelector("#dot-eagle-image"),R=d.querySelector("#demo-nib"),Ge=xe.map(s=>{const g=s.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Ye=we.map(s=>{const g=s.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),xe.forEach((s,g)=>{const H=Ge[g]??.001;s.style.strokeDasharray=`${H} ${H}`,s.style.strokeDashoffset=`${H}`}),we.forEach((s,g)=>{const H=Ye[g]??.001;s.style.strokeDasharray=`${H} ${H}`,s.style.strokeDashoffset=`${H}`}),R&&(R.style.opacity="0");const Fe=l.getState();Tt(Fe.cursorPoint,Fe.cursorTangent),Le=[],Ve=new Set,Ee=[],Me(),Pt(),vn(),et(),de(!1),k()},Pn=(e,t=-1)=>{mt();const n=$n(e,{keepInitialLeadIn:ln,keepFinalLeadOut:cn});pt=e,wt=t,nn.textContent=e,Ze.value=ur(e),gt=n.path,Br(n.path,n.width,n.height,n.offsetY)},_t=(e,t=-1)=>{const n=pn(e);if(!n)return qt("Type a word first."),!1;try{return Pn(n,t),un(),!0}catch{return qt("Couldn't build that word. Try letters supported by the cursive set."),!1}},Mn=()=>{let e=Wt();for(;e;){if(Ue="nextQueued",_t(e)){yt();return}e=Wt()}Ue="current";const t=Fn(wt);_t(Lt[t]??Lt[0],t),yt()},Ur=e=>{if(S||!l||$!==null)return;const t=Xt(d,e),n=l.getState(),r=tt(n);if(pe(n)&&!Lr(t,n))return;if(pe(n)&&(r!=null&&r.isDot)){e.preventDefault(),Pr();return}l.beginAt(t)&&(e.preventDefault(),w=!1,$=e.pointerId,K=t,pr(),gr(),m>.5&&xr(),d.setPointerCapture(e.pointerId),k())},Gr=e=>{if(!(S||!l||e.pointerId!==$)){if(e.preventDefault(),K=Xt(d,e),w){hn(),k();return}l.update(K),k()}},Yr=e=>{!l||e.pointerId!==$||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,k())},Kr=e=>{e.pointerId===$&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,k())};d.addEventListener("pointerdown",Ur);d.addEventListener("pointermove",Gr);d.addEventListener("pointerup",Yr);d.addEventListener("pointercancel",Kr);oe.addEventListener("click",Wr);ct.addEventListener("input",()=>{Ke=Number(ct.value),dn(),bt()});dt.addEventListener("change",()=>{ln=dt.checked,bt()});ut.addEventListener("change",()=>{cn=ut.checked,bt()});sn.addEventListener("submit",e=>{e.preventDefault(),Ue="current",_t(Ze.value)});xt.addEventListener("click",Mn);Ze.addEventListener("input",()=>{se.hidden||un()});document.addEventListener("pointerdown",e=>{if(!Se.open)return;const t=e.target;t instanceof Node&&Se.contains(t)||(Se.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(Se.open=!1)});dn();yt();Mn();
