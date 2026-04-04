import{M as Pn,a as In,T as Mn,f as Tn,W as Lt,b as Ln,c as Nn,d as Cn,e as nt,A as Fn,g as Gt,h as Nt}from"./shared-CvxpMkzH.js";import{a as $n}from"./groups-Cr1poJ62.js";const Yt="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Kt="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",Hn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",it="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",qn="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",Rn="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",On="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",Wn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Bn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Un="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Gn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Yn="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",He="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Te="/letterpaths/writing_app/assets/head-CeHhv_vT.png",Xt="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",Kn=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},rt=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Vt=150,Xn=44,Vn=180,Ct=.75,U=76,Ft=115,jn=.25,jt=.3,zt=.12,zn=.42,lt=10,Q=260,at=510,Zn=220,Qn=700,$t=6,I={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},O={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Jn={...O,height:O.height*(209/431/(160/435))},C={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,ge=44,Zt=700,er=260,Qt=800,tr=18,V={width:200,height:106},ne={width:69,height:49,anchorX:.5,anchorY:.62},Be={width:128,height:141,anchorX:.5,anchorY:1},nr=[Wn,Bn,Un,Gn],St=document.querySelector("#app");if(!St)throw new Error("Missing #app element for snake app.");Kn();St.innerHTML=`
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
                    min="${Pn}"
                    max="${In}"
                    step="${Mn}"
                    value="${Vt}"
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
`;St.style.setProperty("--snake-board-image",`url("${Hn}")`);const Jt=document.querySelector("#word-label"),en=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),se=document.querySelector("#show-me-button"),_e=document.querySelector("#settings-menu"),ct=document.querySelector("#tolerance-slider"),tn=document.querySelector("#tolerance-value"),dt=document.querySelector("#include-initial-lead-in"),ut=document.querySelector("#include-final-lead-out"),nn=document.querySelector("#success-overlay"),rn=document.querySelector("#custom-word-form"),Ze=document.querySelector("#custom-word-input"),oe=document.querySelector("#custom-word-error"),xt=document.querySelector("#next-word-button");if(!Jt||!en||!d||!se||!_e||!ct||!tn||!dt||!ut||!nn||!rn||!Ze||!oe||!xt)throw new Error("Missing elements for snake app.");let kt=-1,pt="",Ue="current",gt=null,l=null,$=null,K=null,st=!1,Se=[],Ge=[],xe=[],Ye=[],q=null,ke=null,S=!1,Ke=Vt,an=!0,sn=!0,ie=[],Qe=[],M=[],be=[],ve=null,k=1,te=null,Xe=1600,ft=900,wt=0,_=null,Ae=[],qe=null,re=null,Re=null,Et=[],B=null,ye=null,Je=new Map,N=null,Oe=null,j=null,We=null,y=[],v=0,De=0,Z=null,bt=0,m=0,A=0,z=null,T=null,F=0,R=null,G=null,w=!1,D=!1,Pe=0,Le=[],Ve=new Set,we=[],h="hidden",le=null,ae=null,W=0,P=null,E=!1,ee=null,fe=[],Ht=!1,$e=null,he=[],qt=!1,ht=-1,me=Number.POSITIVE_INFINITY;const on=()=>{tn.textContent=`${Ke}px`},vt=()=>{pt&&vn(pt,kt)},ln=()=>{oe.hidden=!0,oe.textContent=""},Rt=e=>{oe.hidden=!1,oe.textContent=e},cn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),rr=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(cn).filter(t=>t.length>0)},je=rr();let Ee=0;const yt=()=>{xt.textContent=Ee<je.length?"Next queued word":"Next random word"},ar=e=>Ue==="nextQueued"?je[Ee]??e:e,Ot=()=>{if(Ee>=je.length)return null;const e=je[Ee];return Ee+=1,e??null},dn=()=>$e||($e=nr.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=zt,t}),$e),un=()=>ee||(ee=new Audio(On),ee.preload="auto",ee.volume=jt,ee),sr=()=>{Ht||(un().load(),Ht=!0)},or=()=>{qt||(dn().forEach(e=>{e.load()}),qt=!0)},ir=()=>{const e=un(),t=e.currentSrc||e.src;if(!t)return;const n=new Audio(t);n.preload="auto",n.currentTime=0,n.volume=jt,fe.push(n),n.addEventListener("ended",()=>{fe=fe.filter(r=>r!==n)}),n.addEventListener("error",()=>{fe=fe.filter(r=>r!==n)}),n.play().catch(()=>{})},lr=()=>{const e=dn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=zt,he.push(r),r.addEventListener("ended",()=>{he=he.filter(a=>a!==r)}),r.addEventListener("error",()=>{he=he.filter(a=>a!==r)}),r.play().catch(()=>{})},et=()=>{const e=k>0?k-1:-1,t=e>=0?M[e]:null;ht=e,me=t?t.startDistance+U:Number.POSITIVE_INFINITY},cr=e=>{if(!e.isPenDown||S||w||D||E)return;const t=k>0?k-1:-1,n=t>=0?M[t]:null;if(!n){me=Number.POSITIVE_INFINITY,ht=t;return}t!==ht&&et();const r=Ie(e);let a=!1;for(;r>=me&&me<=n.endDistance;)Math.random()<zn&&(a=!0),me+=U;a&&lr()},Ne=()=>{const e=S;Qe.forEach(t=>{const n=ie[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=k;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),en.textContent=ie.length===0?"Nice tracing.":"All the fruit is collected."},ce=e=>{nn.hidden=!e},de=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},pe=e=>Math.atan2(e.y,e.x)*(180/Math.PI),dr=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ce=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},ur=()=>{if(Ce(),Math.abs(m-A)<.5){m=A,L();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*Qn,s=A-m;if(Math.abs(s)<=a){m=A,z=null,L(),pn();return}m+=Math.sign(s)*a,L(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},pr=e=>{const t=Math.max(0,e);Math.abs(t-A)<.5||(A=t,ur())},gr=()=>{Ce(),A=m,T=v,F=m},pn=()=>{if(!E||$===null||!K||!l||m>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(E=!1,T=v,F=m,l.update(K),x(),!0):!1},fr=()=>{if(T===null)return;const e=Math.max(0,v-T),t=Math.max(0,F-e);if(Math.abs(t-m)<.5){t<=.5&&(m=0,A=0,T=null,F=0);return}m=t,A=t,t<=.5&&(m=0,A=0,T=null,F=0)},tt=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,hr=e=>Ae[e.activeStrokeIndex]??null,gn=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ie=e=>{var n;if(!_)return 0;if(e.status==="complete")return wt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+gn(e)},Me=e=>{var t;return((t=hr(e))==null?void 0:t.deferred)===!0},At=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},fn=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},hn=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=Ae[t];if(!(!n||n.deferred))return fn(t)}return null},yr=e=>{if(Me(e)){const n=hn(e);if(n)return n}const t=[...y].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:dr(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},Dt=e=>{var t;return S||w||D||e.status==="complete"||!Me(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=tt(e))==null?void 0:t.isDot)===!0}},mr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===le&&((n=tt(t))==null?void 0:n.isDot)===!0&&h!=="hidden"&&h!=="waiting"},_r=e=>{if(!ye)return;const t=Dt(e);if(!t){ye.style.opacity="0";return}if(t.isDot){ye.style.opacity="0";return}Pt(ye,{point:t.point,tangent:t.tangent,angle:pe(t.tangent)},{isDot:!1,headHref:Te,travelledDistance:gn(e)})},Pt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Te),Y(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},I.width*J,I.height*J,I.anchorX,I.anchorY,I.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const f=At(n.travelledDistance??Number.POSITIVE_INFINITY,1,ge);if(f.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*ge,y:t.point.y-t.tangent.y*ge},b={x:t.point.x-t.tangent.x*ge*2,y:t.point.y-t.tangent.y*ge*2};a&&c&&Y(a,c,{x:p.x,y:p.y,angle:t.angle,visible:!0},O.width*J,O.height*J,O.anchorX,O.anchorY,O.rotationOffset),s&&u&&f.showTail?Y(s,u,{x:b.x,y:b.y,angle:t.angle,visible:!0},C.width*J,C.height*J,C.anchorX,C.anchorY,C.rotationOffset):s&&(s.style.opacity="0")},Wt=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${Xt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Yt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Te}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,ue=()=>{G!==null&&(cancelAnimationFrame(G),G=null),h="hidden",le=null,ae=null,N&&(N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting")),j&&(j.style.opacity="0")},Sr=e=>({x:e.x,y:e.y-tr}),xr=e=>({x:e.x,y:e.y+8}),yn=(e=performance.now())=>{if(h==="hidden"||!ae)return null;const t=xr(ae),n=Sr(ae);if(h==="waiting")return{snakePoint:t,snakeHref:He,snakeWobble:!0};if(h==="eagle_in"){const i=Math.max(0,Math.min(1,(e-W)/Zt)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:He,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+V.height)*c},eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}}if(h==="eagle_stand")return{snakePoint:t,snakeHref:He,snakeWobble:!1,eaglePoint:n,eagleHref:qn,eagleWidth:Be.width,eagleHeight:Be.height};const r=Math.max(0,Math.min(1,(e-W)/Qt)),a=1-(1-r)*(1-r),s={x:n.x+(Xe+V.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+V.height*.6},snakeHref:Yn,snakeWobble:!1,eaglePoint:s,eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}},kr=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){ue(),x();return}if(le!==null&&e.activeStrokeIndex===le&&((t=tt(e))!=null&&t.isDot)){l.beginAt(e.cursorPoint);const n=l.getState();En(Ie(n)),Sn(n)}ue(),x()},mn=e=>{if(G=null,!(h==="hidden"||h==="waiting")){if(h==="eagle_in"&&e-W>=Zt)h="eagle_stand",W=e;else if(h==="eagle_stand"&&e-W>=er)h="eagle_out",W=e;else if(h==="eagle_out"&&e-W>=Qt){kr();return}x(),G=requestAnimationFrame(mn)}},wr=()=>{h==="waiting"&&(h="eagle_in",W=performance.now(),G!==null&&cancelAnimationFrame(G),G=requestAnimationFrame(mn),x())},Er=e=>{const t=Dt(e);if(!(t!=null&&t.isDot)){ue();return}le!==t.strokeIndex?(ue(),le=t.strokeIndex,ae=t.point,h="waiting"):h==="waiting"&&(ae=t.point)},br=(e=performance.now())=>{if(!N||!Oe||!j||!We)return;const t=yn(e);if(!t){N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting"),j.style.opacity="0";return}if(N.style.opacity="1",N.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Oe.setAttribute("href",t.snakeHref),Y(N,Oe,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},ne.width,ne.height,ne.anchorX,ne.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){j.style.opacity="0";return}We.setAttribute("href",t.eagleHref),Y(j,We,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Be.anchorX,Be.anchorY,0)},vr=(e,t)=>{const n=Dt(t);if(!n)return!1;if(n.isDot){if(h!=="waiting")return!1;const a=yn();if(!a)return!1;const s=Math.max(ne.width,ne.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,I.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Ar=e=>{e.completedStrokes.forEach(t=>{if(Ve.has(t))return;Ve.add(t);const n=Ae[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=fn(t);a&&Le.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:pe(a.tangent)})})},Dr=()=>{Je.forEach((e,t)=>{const n=Le.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}Pt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},It=()=>{Je.forEach(e=>{e.style.opacity="0"})},Pr=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},_n=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return Pr(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},Ir=e=>{const t=M[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=_n(_,n),a=de({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:de({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},Mr=()=>{k=Math.min(k+1,M.length),ve=k-1<be.length?k-1:null,bn(),Ne(),et()},Sn=e=>{if(S||w||D||E||M.length<=k)return!1;const t=k-1,n=M[t];return!n||Ie(e)<n.endDistance-8?!1:(E=!0,T=null,F=0,Z=n.endDistance,P=Ir(t+1),P&&(De=pe(P),ze(n.endPoint,P,!0)),Mr(),l==null||l.end(),kn(),x(),!0)},Tr=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/Vn));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),f=_n(e,u);return{x:f.x,y:f.y,pathDistance:u,emoji:rt[(r+c)%rt.length]??rt[0],captured:!1,groupIndex:r}})}),xn=()=>{k=M.length>0?1:0,ve=be.length>0?0:null,ie.forEach(e=>{e.captured=!1}),Qe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),bn(),Ne()},Mt=()=>{const e=Math.max(3,Math.min(lt,Math.floor(wt/Ft)));return Math.min(e,1+Math.floor(v/Ft))},kn=()=>{if(S||w||D){T=null,F=0;return}if(!E)return;const e=At(v,Mt(),U).bodyCount;pr((e+1)*U)},Y=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},ot=e=>{const t=y[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(y.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<y.length;r+=1){const a=y[r-1],s=y[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,f=a.y+(s.y-a.y)*c;return{x:u,y:f,angle:pe({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...y[y.length-1]??t,distance:e}},wn=()=>{re==null||re.style.setProperty("opacity","0"),B==null||B.style.setProperty("opacity","0"),Et.forEach(e=>{e.style.opacity="0"})},L=(e=performance.now())=>{if(!qe||!re||!Re||!B||y.length===0)return;if(S||D){qe.style.opacity="0";return}qe.style.opacity="1";const t=w?Pe:Mt(),n=w?0:m,r=At(v,t,U),a=r.bodyCount,s=ot(v);Re.setAttribute("href",e<bt?Rn:Te),Y(re,Re,{...s,angle:De},I.width,I.height,I.anchorX,I.anchorY,I.rotationOffset),Et.forEach((f,p)=>{if(p>=a){f.style.opacity="0";return}const b=f.querySelector("image");if(!b)return;const X=Math.max(0,(p+1)*U-n);if(X<=$t){f.style.opacity="0";return}const Fe=ot(Math.max(0,v-X)),o=b.getAttribute("href")===Kt?Jn:O;Y(f,b,Fe,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=B.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*U-n);if(!r.showTail||c<=$t){B.style.opacity="0";return}const u=ot(Math.max(0,v-c));Y(B,i,u,C.width,C.height,C.anchorX,C.anchorY,C.rotationOffset)},Tt=(e,t,n=!0)=>{const r=de(t);De=pe(r),y=[{x:e.x,y:e.y,angle:De,distance:0,visible:n}],v=0,bt=0,m=0,A=0,T=null,F=0,Z=null,P=null,E=!1,D=!1,w=!1,Pe=0,Ce(),R!==null&&(cancelAnimationFrame(R),R=null),L()},ze=(e,t,n)=>{const r=de(t),a=pe(r);De=a;const s=y[y.length-1];if(!s){Tt(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?y[y.length-1]={...s,x:e.x,y:e.y,angle:a}:(y.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),v=s.distance+.001),L();return}v=s.distance+i,y.push({x:e.x,y:e.y,angle:a,distance:v,visible:n}),fr(),L()},Bt=(e,t,n)=>{const r=de(t),a=[];r.x>.001?a.push((Xe+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((ft+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Xe,ft)+Q)+(n+2)*U+Q},Lr=(e,t)=>{if(w||D)return;Ce(),m=0,A=0,T=null,F=0,Z=null,P=null,E=!1;const n=de(t),r=performance.now();Pe=Mt();const a=Bt(e,n,Pe);we=Le.map(i=>({...i,travelDistance:Bt(i.point,i.tangent,0)})),w=!0,ce(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*at);ze({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),we.forEach(p=>{const b=Je.get(p.strokeIndex);if(!b)return;const X=Math.min(p.travelDistance,c*at);Pt(b,{point:{x:p.point.x+p.tangent.x*X,y:p.point.y+p.tangent.y*X},tangent:p.tangent,angle:p.angle})});const f=we.every(p=>c*at>=p.travelDistance);if(u>=a&&f){w=!1,D=!0,R=null,wn(),It(),ce(!0);return}R=requestAnimationFrame(s)};R=requestAnimationFrame(s)},En=e=>{let t=!1;ie.forEach((n,r)=>{if(n.captured||n.groupIndex>=k||e+.5<n.pathDistance)return;n.captured=!0;const a=Qe[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(bt=performance.now()+Zn,ir(),Ne(),L())},bn=()=>{if(!te)return;const e=ve!==null?be[ve]:void 0;if(!e){te.classList.add("writing-app__boundary-star--hidden");return}te.classList.remove("writing-app__boundary-star--hidden"),te.setAttribute("x",`${e.x}`),te.setAttribute("y",`${e.y}`)},Nr=e=>{if(Z!==null){if(Ie(e)+.5<Z){L();return}Z=null}const n=P!==null&&(E||e.isPenDown)&&P?P:e.cursorTangent;if(Me(e)){const r=hn(e),a=y[y.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&ze(r.point,r.tangent,!0)}else ze(e.cursorPoint,n,!0);P&&e.isPenDown&&!E&&(P=null),S||En(Ie(e)),!S&&e.isPenDown&&(cr(e),Sn(e))},mt=()=>{ke!==null&&(cancelAnimationFrame(ke),ke=null),S=!1,se.disabled=!1,se.textContent="Demo",xe.forEach((e,t)=>{const n=Ye[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),q&&(q.style.opacity="0"),Ne(),L(),x()},Ut=()=>{l==null||l.reset(),$=null,K=null,ce(!1),D=!1,w=!1,Pe=0,Le=[],Ve=new Set,we=[],ue(),R!==null&&(cancelAnimationFrame(R),R=null),Se.forEach((t,n)=>{const r=Ge[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ce(),m=0,A=0,T=null,F=0,Z=null,P=null,E=!1;const e=l==null?void 0:l.getState();e?Tt(e.cursorPoint,e.cursorTangent,!0):wn(),It(),xn(),et(),x()},x=()=>{st||(st=!0,requestAnimationFrame(()=>{st=!1,Cr()}))},Cr=()=>{if(!l)return;const e=l.getState();kn(),Ar(e),Er(e),br(),_r(e),!w&&!D&&Dr();const t=new Set(e.completedStrokes);if(Se.forEach((n,r)=>{const a=Ge[r]??0;if(t.has(r)||mr(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!S&&!w&&!D&&!E?Nr(e):L(),e.status==="complete"){if(!S&&!w&&!D){const n=yr(e);Lr(n.point,n.tangent)}ce(D);return}ce(!1)},Fr=()=>{if(!gt||S)return;Ut(),mt();const e=new Fn(gt,{speed:1.7*Ct,penUpSpeed:2.1*Ct,deferredDelayMs:150});S=!0,se.disabled=!0,se.textContent="Demo...",Ne(),L();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(xe.forEach((u,f)=>{const p=Ye[f]??.001;if(c.has(f)){u.style.strokeDashoffset="0";return}if(f===i.activeStrokeIndex){const b=p*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,b)}`;return}u.style.strokeDashoffset=`${p}`}),q&&(q.setAttribute("cx",i.point.x.toFixed(2)),q.setAttribute("cy",i.point.y.toFixed(2)),q.style.opacity=a<=e.totalDuration+Nt?"1":"0"),a<e.totalDuration+Nt){ke=requestAnimationFrame(n);return}mt(),Ut()};ke=requestAnimationFrame(n),x()},$r=(e,t,n,r)=>{Xe=t,ft=n;const a=Nn(e);_=a,Ae=e.strokes.filter(o=>o.type!=="lift"),wt=a.strokes.reduce((o,g)=>o+g.totalLength,0),M=$n(a).groups,be=M.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),ve=be.length>0?0:null,k=M.length>0?1:0,l=new Cn(a,{startTolerance:Ke,hitTolerance:Ke}),$=null,ie=Tr(a,M);const i=Ae,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${nt(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${nt(o.curves)}"></path>`).join(""),f=i.map(o=>`<path class="writing-app__stroke-demo" d="${nt(o.curves)}"></path>`).join(""),p=ie.map((o,g)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${g}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${Xn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),b=Array.from({length:lt},(o,g)=>{const H=lt-1-g,Dn=Math.random()<jn?Kt:Yt;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${H}"
      >
        <image
          href="${Dn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),X=i.map((o,g)=>o.deferred?g:null).filter(o=>o!==null).map(o=>Wt(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
    ${f}
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
          href="${Xt}"
          preserveAspectRatio="none"
        ></image>
      </g>
      ${b}
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
    ${Wt('class="writing-app__deferred-head" id="deferred-head"')}
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
  `,Se=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),xe=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Qe=Array.from(d.querySelectorAll(".writing-app__fruit")),te=d.querySelector("#waypoint-star"),qe=d.querySelector("#trace-snake"),re=d.querySelector("#snake-head"),Re=d.querySelector("#snake-head-image"),B=d.querySelector("#snake-tail"),Et=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,g)=>Number(o.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),ye=d.querySelector("#deferred-head"),Je=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),N=d.querySelector("#dot-snake"),Oe=d.querySelector("#dot-snake-image"),j=d.querySelector("#dot-eagle"),We=d.querySelector("#dot-eagle-image"),q=d.querySelector("#demo-nib"),Ge=Se.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Ye=xe.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Se.forEach((o,g)=>{const H=Ge[g]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),xe.forEach((o,g)=>{const H=Ye[g]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),q&&(q.style.opacity="0");const Fe=l.getState();Tt(Fe.cursorPoint,Fe.cursorTangent),Le=[],Ve=new Set,we=[],ue(),It(),xn(),et(),ce(!1),x()},vn=(e,t=-1)=>{mt();const n=Ln(e,{keepInitialLeadIn:an,keepFinalLeadOut:sn});pt=e,kt=t,Jt.textContent=e,Ze.value=ar(e),gt=n.path,$r(n.path,n.width,n.height,n.offsetY)},_t=(e,t=-1)=>{const n=cn(e);if(!n)return Rt("Type a word first."),!1;try{return vn(n,t),ln(),!0}catch{return Rt("Couldn't build that word. Try letters supported by the cursive set."),!1}},An=()=>{let e=Ot();for(;e;){if(Ue="nextQueued",_t(e)){yt();return}e=Ot()}Ue="current";const t=Tn(kt);_t(Lt[t]??Lt[0],t),yt()},Hr=e=>{if(S||!l||$!==null)return;const t=Gt(d,e),n=l.getState(),r=tt(n);if(Me(n)&&!vr(t,n))return;if(Me(n)&&(r!=null&&r.isDot)){e.preventDefault(),wr();return}l.beginAt(t)&&(e.preventDefault(),E=!1,$=e.pointerId,K=t,sr(),or(),m>.5&&gr(),d.setPointerCapture(e.pointerId),x())},qr=e=>{if(!(S||!l||e.pointerId!==$)){if(e.preventDefault(),K=Gt(d,e),E){pn(),x();return}l.update(K),x()}},Rr=e=>{!l||e.pointerId!==$||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,x())},Or=e=>{e.pointerId===$&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,x())};d.addEventListener("pointerdown",Hr);d.addEventListener("pointermove",qr);d.addEventListener("pointerup",Rr);d.addEventListener("pointercancel",Or);se.addEventListener("click",Fr);ct.addEventListener("input",()=>{Ke=Number(ct.value),on(),vt()});dt.addEventListener("change",()=>{an=dt.checked,vt()});ut.addEventListener("change",()=>{sn=ut.checked,vt()});rn.addEventListener("submit",e=>{e.preventDefault(),Ue="current",_t(Ze.value)});xt.addEventListener("click",An);Ze.addEventListener("input",()=>{oe.hidden||ln()});document.addEventListener("pointerdown",e=>{if(!_e.open)return;const t=e.target;t instanceof Node&&_e.contains(t)||(_e.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(_e.open=!1)});on();yt();An();
