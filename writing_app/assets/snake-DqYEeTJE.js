import{M as Dn,a as Pn,T as In,f as Mn,W as Tt,b as Tn,c as Ln,d as Nn,e as et,A as Cn,g as Ut,h as Lt}from"./shared-CvxpMkzH.js";import{a as Fn}from"./groups-Cr1poJ62.js";const Gt="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Yt="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",$n="/letterpaths/writing_app/assets/background-BdaS-6aw.png",st="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Hn="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",qn="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",Rn="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",On="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Wn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Bn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Un="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Gn="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",$e="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Me="/letterpaths/writing_app/assets/head-CeHhv_vT.png",Kt="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",Yn=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},tt=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Xt=150,Kn=44,Xn=180,Nt=.75,U=76,Ct=115,Vn=.25,Vt=.3,jt=.12,jn=.42,ot=10,Q=260,nt=510,zn=220,Zn=700,Ft=6,I={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},O={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Qn={...O,height:O.height*(209/431/(160/435))},C={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,ge=44,zt=700,Jn=260,Zt=800,er=18,V={width:200,height:106},ne={width:69,height:49,anchorX:.5,anchorY:.62},Be={width:128,height:141,anchorX:.5,anchorY:1},tr=[On,Wn,Bn,Un],_t=document.querySelector("#app");if(!_t)throw new Error("Missing #app element for snake app.");Yn();_t.innerHTML=`
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
                    min="${Dn}"
                    max="${Pn}"
                    step="${In}"
                    value="${Xt}"
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
`;_t.style.setProperty("--snake-board-image",`url("${$n}")`);const Qt=document.querySelector("#word-label"),Jt=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),se=document.querySelector("#show-me-button"),_e=document.querySelector("#settings-menu"),it=document.querySelector("#tolerance-slider"),en=document.querySelector("#tolerance-value"),lt=document.querySelector("#include-initial-lead-in"),ct=document.querySelector("#include-final-lead-out"),tn=document.querySelector("#success-overlay"),nn=document.querySelector("#custom-word-form"),je=document.querySelector("#custom-word-input"),oe=document.querySelector("#custom-word-error"),St=document.querySelector("#next-word-button");if(!Qt||!Jt||!d||!se||!_e||!it||!en||!lt||!ct||!tn||!nn||!je||!oe||!St)throw new Error("Missing elements for snake app.");let xt=-1,dt="",ut=null,l=null,$=null,K=null,rt=!1,Se=[],Ue=[],xe=[],Ge=[],q=null,ke=null,S=!1,Ye=Xt,rn=!0,an=!0,ie=[],ze=[],M=[],Ee=[],be=null,k=1,te=null,Ke=1600,pt=900,kt=0,_=null,ve=[],He=null,re=null,qe=null,wt=[],B=null,ye=null,Ze=new Map,N=null,Re=null,j=null,Oe=null,y=[],v=0,Ae=0,Z=null,Et=0,m=0,A=0,z=null,T=null,F=0,R=null,G=null,w=!1,D=!1,De=0,Te=[],Xe=new Set,we=[],h="hidden",le=null,ae=null,W=0,P=null,E=!1,ee=null,fe=[],$t=!1,Fe=null,he=[],Ht=!1,gt=-1,me=Number.POSITIVE_INFINITY;const sn=()=>{en.textContent=`${Ye}px`},bt=()=>{dt&&bn(dt,xt)},on=()=>{oe.hidden=!0,oe.textContent=""},qt=e=>{oe.hidden=!1,oe.textContent=e},ln=e=>e.trim().replace(/\s+/g," ").toLowerCase(),nr=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(ln).filter(t=>t.length>0)},ft=nr();let We=0;const ht=()=>{St.textContent=We<ft.length?"Next queued word":"Next random word"},Rt=()=>{if(We>=ft.length)return null;const e=ft[We];return We+=1,e??null},cn=()=>Fe||(Fe=tr.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=jt,t}),Fe),dn=()=>ee||(ee=new Audio(Rn),ee.preload="auto",ee.volume=Vt,ee),rr=()=>{$t||(dn().load(),$t=!0)},ar=()=>{Ht||(cn().forEach(e=>{e.load()}),Ht=!0)},sr=()=>{const e=dn(),t=e.currentSrc||e.src;if(!t)return;const n=new Audio(t);n.preload="auto",n.currentTime=0,n.volume=Vt,fe.push(n),n.addEventListener("ended",()=>{fe=fe.filter(r=>r!==n)}),n.addEventListener("error",()=>{fe=fe.filter(r=>r!==n)}),n.play().catch(()=>{})},or=()=>{const e=cn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=jt,he.push(r),r.addEventListener("ended",()=>{he=he.filter(a=>a!==r)}),r.addEventListener("error",()=>{he=he.filter(a=>a!==r)}),r.play().catch(()=>{})},Qe=()=>{const e=k>0?k-1:-1,t=e>=0?M[e]:null;gt=e,me=t?t.startDistance+U:Number.POSITIVE_INFINITY},ir=e=>{if(!e.isPenDown||S||w||D||E)return;const t=k>0?k-1:-1,n=t>=0?M[t]:null;if(!n){me=Number.POSITIVE_INFINITY,gt=t;return}t!==gt&&Qe();const r=Pe(e);let a=!1;for(;r>=me&&me<=n.endDistance;)Math.random()<jn&&(a=!0),me+=U;a&&or()},Le=()=>{const e=S;ze.forEach(t=>{const n=ie[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=k;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),Jt.textContent=ie.length===0?"Nice tracing.":"All the fruit is collected."},ce=e=>{tn.hidden=!e},de=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},pe=e=>Math.atan2(e.y,e.x)*(180/Math.PI),lr=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ne=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},cr=()=>{if(Ne(),Math.abs(m-A)<.5){m=A,L();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*Zn,s=A-m;if(Math.abs(s)<=a){m=A,z=null,L(),un();return}m+=Math.sign(s)*a,L(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},dr=e=>{const t=Math.max(0,e);Math.abs(t-A)<.5||(A=t,cr())},ur=()=>{Ne(),A=m,T=v,F=m},un=()=>{if(!E||$===null||!K||!l||m>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(E=!1,T=v,F=m,l.update(K),x(),!0):!1},pr=()=>{if(T===null)return;const e=Math.max(0,v-T),t=Math.max(0,F-e);if(Math.abs(t-m)<.5){t<=.5&&(m=0,A=0,T=null,F=0);return}m=t,A=t,t<=.5&&(m=0,A=0,T=null,F=0)},Je=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,gr=e=>ve[e.activeStrokeIndex]??null,pn=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Pe=e=>{var n;if(!_)return 0;if(e.status==="complete")return kt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+pn(e)},Ie=e=>{var t;return((t=gr(e))==null?void 0:t.deferred)===!0},vt=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},gn=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},fn=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=ve[t];if(!(!n||n.deferred))return gn(t)}return null},fr=e=>{if(Ie(e)){const n=fn(e);if(n)return n}const t=[...y].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:lr(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},At=e=>{var t;return S||w||D||e.status==="complete"||!Ie(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=Je(e))==null?void 0:t.isDot)===!0}},hr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===le&&((n=Je(t))==null?void 0:n.isDot)===!0&&h!=="hidden"&&h!=="waiting"},yr=e=>{if(!ye)return;const t=At(e);if(!t){ye.style.opacity="0";return}if(t.isDot){ye.style.opacity="0";return}Dt(ye,{point:t.point,tangent:t.tangent,angle:pe(t.tangent)},{isDot:!1,headHref:Me,travelledDistance:pn(e)})},Dt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Me),Y(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},I.width*J,I.height*J,I.anchorX,I.anchorY,I.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const f=vt(n.travelledDistance??Number.POSITIVE_INFINITY,1,ge);if(f.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*ge,y:t.point.y-t.tangent.y*ge},b={x:t.point.x-t.tangent.x*ge*2,y:t.point.y-t.tangent.y*ge*2};a&&c&&Y(a,c,{x:p.x,y:p.y,angle:t.angle,visible:!0},O.width*J,O.height*J,O.anchorX,O.anchorY,O.rotationOffset),s&&u&&f.showTail?Y(s,u,{x:b.x,y:b.y,angle:t.angle,visible:!0},C.width*J,C.height*J,C.anchorX,C.anchorY,C.rotationOffset):s&&(s.style.opacity="0")},Ot=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${Kt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Gt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Me}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,ue=()=>{G!==null&&(cancelAnimationFrame(G),G=null),h="hidden",le=null,ae=null,N&&(N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting")),j&&(j.style.opacity="0")},mr=e=>({x:e.x,y:e.y-er}),_r=e=>({x:e.x,y:e.y+8}),hn=(e=performance.now())=>{if(h==="hidden"||!ae)return null;const t=_r(ae),n=mr(ae);if(h==="waiting")return{snakePoint:t,snakeHref:$e,snakeWobble:!0};if(h==="eagle_in"){const i=Math.max(0,Math.min(1,(e-W)/zt)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:$e,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+V.height)*c},eagleHref:st,eagleWidth:V.width,eagleHeight:V.height}}if(h==="eagle_stand")return{snakePoint:t,snakeHref:$e,snakeWobble:!1,eaglePoint:n,eagleHref:Hn,eagleWidth:Be.width,eagleHeight:Be.height};const r=Math.max(0,Math.min(1,(e-W)/Zt)),a=1-(1-r)*(1-r),s={x:n.x+(Ke+V.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+V.height*.6},snakeHref:Gn,snakeWobble:!1,eaglePoint:s,eagleHref:st,eagleWidth:V.width,eagleHeight:V.height}},Sr=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){ue(),x();return}if(le!==null&&e.activeStrokeIndex===le&&((t=Je(e))!=null&&t.isDot)){l.beginAt(e.cursorPoint);const n=l.getState();wn(Pe(n)),_n(n)}ue(),x()},yn=e=>{if(G=null,!(h==="hidden"||h==="waiting")){if(h==="eagle_in"&&e-W>=zt)h="eagle_stand",W=e;else if(h==="eagle_stand"&&e-W>=Jn)h="eagle_out",W=e;else if(h==="eagle_out"&&e-W>=Zt){Sr();return}x(),G=requestAnimationFrame(yn)}},xr=()=>{h==="waiting"&&(h="eagle_in",W=performance.now(),G!==null&&cancelAnimationFrame(G),G=requestAnimationFrame(yn),x())},kr=e=>{const t=At(e);if(!(t!=null&&t.isDot)){ue();return}le!==t.strokeIndex?(ue(),le=t.strokeIndex,ae=t.point,h="waiting"):h==="waiting"&&(ae=t.point)},wr=(e=performance.now())=>{if(!N||!Re||!j||!Oe)return;const t=hn(e);if(!t){N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting"),j.style.opacity="0";return}if(N.style.opacity="1",N.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Re.setAttribute("href",t.snakeHref),Y(N,Re,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},ne.width,ne.height,ne.anchorX,ne.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){j.style.opacity="0";return}Oe.setAttribute("href",t.eagleHref),Y(j,Oe,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Be.anchorX,Be.anchorY,0)},Er=(e,t)=>{const n=At(t);if(!n)return!1;if(n.isDot){if(h!=="waiting")return!1;const a=hn();if(!a)return!1;const s=Math.max(ne.width,ne.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,I.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},br=e=>{e.completedStrokes.forEach(t=>{if(Xe.has(t))return;Xe.add(t);const n=ve[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=gn(t);a&&Te.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:pe(a.tangent)})})},vr=()=>{Ze.forEach((e,t)=>{const n=Te.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}Dt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},Pt=()=>{Ze.forEach(e=>{e.style.opacity="0"})},Ar=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},mn=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return Ar(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},Dr=e=>{const t=M[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=mn(_,n),a=de({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:de({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},Pr=()=>{k=Math.min(k+1,M.length),be=k-1<Ee.length?k-1:null,En(),Le(),Qe()},_n=e=>{if(S||w||D||E||M.length<=k)return!1;const t=k-1,n=M[t];return!n||Pe(e)<n.endDistance-8?!1:(E=!0,T=null,F=0,Z=n.endDistance,P=Dr(t+1),P&&(Ae=pe(P),Ve(n.endPoint,P,!0)),Pr(),l==null||l.end(),xn(),x(),!0)},Ir=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/Xn));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),f=mn(e,u);return{x:f.x,y:f.y,pathDistance:u,emoji:tt[(r+c)%tt.length]??tt[0],captured:!1,groupIndex:r}})}),Sn=()=>{k=M.length>0?1:0,be=Ee.length>0?0:null,ie.forEach(e=>{e.captured=!1}),ze.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),En(),Le()},It=()=>{const e=Math.max(3,Math.min(ot,Math.floor(kt/Ct)));return Math.min(e,1+Math.floor(v/Ct))},xn=()=>{if(S||w||D){T=null,F=0;return}if(!E)return;const e=vt(v,It(),U).bodyCount;dr((e+1)*U)},Y=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},at=e=>{const t=y[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(y.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<y.length;r+=1){const a=y[r-1],s=y[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,f=a.y+(s.y-a.y)*c;return{x:u,y:f,angle:pe({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...y[y.length-1]??t,distance:e}},kn=()=>{re==null||re.style.setProperty("opacity","0"),B==null||B.style.setProperty("opacity","0"),wt.forEach(e=>{e.style.opacity="0"})},L=(e=performance.now())=>{if(!He||!re||!qe||!B||y.length===0)return;if(S||D){He.style.opacity="0";return}He.style.opacity="1";const t=w?De:It(),n=w?0:m,r=vt(v,t,U),a=r.bodyCount,s=at(v);qe.setAttribute("href",e<Et?qn:Me),Y(re,qe,{...s,angle:Ae},I.width,I.height,I.anchorX,I.anchorY,I.rotationOffset),wt.forEach((f,p)=>{if(p>=a){f.style.opacity="0";return}const b=f.querySelector("image");if(!b)return;const X=Math.max(0,(p+1)*U-n);if(X<=Ft){f.style.opacity="0";return}const Ce=at(Math.max(0,v-X)),o=b.getAttribute("href")===Yt?Qn:O;Y(f,b,Ce,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=B.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*U-n);if(!r.showTail||c<=Ft){B.style.opacity="0";return}const u=at(Math.max(0,v-c));Y(B,i,u,C.width,C.height,C.anchorX,C.anchorY,C.rotationOffset)},Mt=(e,t,n=!0)=>{const r=de(t);Ae=pe(r),y=[{x:e.x,y:e.y,angle:Ae,distance:0,visible:n}],v=0,Et=0,m=0,A=0,T=null,F=0,Z=null,P=null,E=!1,D=!1,w=!1,De=0,Ne(),R!==null&&(cancelAnimationFrame(R),R=null),L()},Ve=(e,t,n)=>{const r=de(t),a=pe(r);Ae=a;const s=y[y.length-1];if(!s){Mt(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?y[y.length-1]={...s,x:e.x,y:e.y,angle:a}:(y.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),v=s.distance+.001),L();return}v=s.distance+i,y.push({x:e.x,y:e.y,angle:a,distance:v,visible:n}),pr(),L()},Wt=(e,t,n)=>{const r=de(t),a=[];r.x>.001?a.push((Ke+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((pt+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Ke,pt)+Q)+(n+2)*U+Q},Mr=(e,t)=>{if(w||D)return;Ne(),m=0,A=0,T=null,F=0,Z=null,P=null,E=!1;const n=de(t),r=performance.now();De=It();const a=Wt(e,n,De);we=Te.map(i=>({...i,travelDistance:Wt(i.point,i.tangent,0)})),w=!0,ce(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*nt);Ve({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),we.forEach(p=>{const b=Ze.get(p.strokeIndex);if(!b)return;const X=Math.min(p.travelDistance,c*nt);Dt(b,{point:{x:p.point.x+p.tangent.x*X,y:p.point.y+p.tangent.y*X},tangent:p.tangent,angle:p.angle})});const f=we.every(p=>c*nt>=p.travelDistance);if(u>=a&&f){w=!1,D=!0,R=null,kn(),Pt(),ce(!0);return}R=requestAnimationFrame(s)};R=requestAnimationFrame(s)},wn=e=>{let t=!1;ie.forEach((n,r)=>{if(n.captured||n.groupIndex>=k||e+.5<n.pathDistance)return;n.captured=!0;const a=ze[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(Et=performance.now()+zn,sr(),Le(),L())},En=()=>{if(!te)return;const e=be!==null?Ee[be]:void 0;if(!e){te.classList.add("writing-app__boundary-star--hidden");return}te.classList.remove("writing-app__boundary-star--hidden"),te.setAttribute("x",`${e.x}`),te.setAttribute("y",`${e.y}`)},Tr=e=>{if(Z!==null){if(Pe(e)+.5<Z){L();return}Z=null}const n=P!==null&&(E||e.isPenDown)&&P?P:e.cursorTangent;if(Ie(e)){const r=fn(e),a=y[y.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&Ve(r.point,r.tangent,!0)}else Ve(e.cursorPoint,n,!0);P&&e.isPenDown&&!E&&(P=null),S||wn(Pe(e)),!S&&e.isPenDown&&(ir(e),_n(e))},yt=()=>{ke!==null&&(cancelAnimationFrame(ke),ke=null),S=!1,se.disabled=!1,se.textContent="Demo",xe.forEach((e,t)=>{const n=Ge[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),q&&(q.style.opacity="0"),Le(),L(),x()},Bt=()=>{l==null||l.reset(),$=null,K=null,ce(!1),D=!1,w=!1,De=0,Te=[],Xe=new Set,we=[],ue(),R!==null&&(cancelAnimationFrame(R),R=null),Se.forEach((t,n)=>{const r=Ue[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ne(),m=0,A=0,T=null,F=0,Z=null,P=null,E=!1;const e=l==null?void 0:l.getState();e?Mt(e.cursorPoint,e.cursorTangent,!0):kn(),Pt(),Sn(),Qe(),x()},x=()=>{rt||(rt=!0,requestAnimationFrame(()=>{rt=!1,Lr()}))},Lr=()=>{if(!l)return;const e=l.getState();xn(),br(e),kr(e),wr(),yr(e),!w&&!D&&vr();const t=new Set(e.completedStrokes);if(Se.forEach((n,r)=>{const a=Ue[r]??0;if(t.has(r)||hr(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!S&&!w&&!D&&!E?Tr(e):L(),e.status==="complete"){if(!S&&!w&&!D){const n=fr(e);Mr(n.point,n.tangent)}ce(D);return}ce(!1)},Nr=()=>{if(!ut||S)return;Bt(),yt();const e=new Cn(ut,{speed:1.7*Nt,penUpSpeed:2.1*Nt,deferredDelayMs:150});S=!0,se.disabled=!0,se.textContent="Demo...",Le(),L();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(xe.forEach((u,f)=>{const p=Ge[f]??.001;if(c.has(f)){u.style.strokeDashoffset="0";return}if(f===i.activeStrokeIndex){const b=p*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,b)}`;return}u.style.strokeDashoffset=`${p}`}),q&&(q.setAttribute("cx",i.point.x.toFixed(2)),q.setAttribute("cy",i.point.y.toFixed(2)),q.style.opacity=a<=e.totalDuration+Lt?"1":"0"),a<e.totalDuration+Lt){ke=requestAnimationFrame(n);return}yt(),Bt()};ke=requestAnimationFrame(n),x()},Cr=(e,t,n,r)=>{Ke=t,pt=n;const a=Ln(e);_=a,ve=e.strokes.filter(o=>o.type!=="lift"),kt=a.strokes.reduce((o,g)=>o+g.totalLength,0),M=Fn(a).groups,Ee=M.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),be=Ee.length>0?0:null,k=M.length>0?1:0,l=new Nn(a,{startTolerance:Ye,hitTolerance:Ye}),$=null,ie=Ir(a,M);const i=ve,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${et(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${et(o.curves)}"></path>`).join(""),f=i.map(o=>`<path class="writing-app__stroke-demo" d="${et(o.curves)}"></path>`).join(""),p=ie.map((o,g)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${g}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${Kn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),b=Array.from({length:ot},(o,g)=>{const H=ot-1-g,An=Math.random()<Vn?Yt:Gt;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${H}"
      >
        <image
          href="${An}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),X=i.map((o,g)=>o.deferred?g:null).filter(o=>o!==null).map(o=>Ot(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
          href="${Kt}"
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
          href="${Me}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${p}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${X}
    </g>
    ${Ot('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${$e}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${st}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,Se=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),xe=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),ze=Array.from(d.querySelectorAll(".writing-app__fruit")),te=d.querySelector("#waypoint-star"),He=d.querySelector("#trace-snake"),re=d.querySelector("#snake-head"),qe=d.querySelector("#snake-head-image"),B=d.querySelector("#snake-tail"),wt=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,g)=>Number(o.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),ye=d.querySelector("#deferred-head"),Ze=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),N=d.querySelector("#dot-snake"),Re=d.querySelector("#dot-snake-image"),j=d.querySelector("#dot-eagle"),Oe=d.querySelector("#dot-eagle-image"),q=d.querySelector("#demo-nib"),Ue=Se.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Ge=xe.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Se.forEach((o,g)=>{const H=Ue[g]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),xe.forEach((o,g)=>{const H=Ge[g]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),q&&(q.style.opacity="0");const Ce=l.getState();Mt(Ce.cursorPoint,Ce.cursorTangent),Te=[],Xe=new Set,we=[],ue(),Pt(),Sn(),Qe(),ce(!1),x()},bn=(e,t=-1)=>{yt();const n=Tn(e,{keepInitialLeadIn:rn,keepFinalLeadOut:an});dt=e,xt=t,Qt.textContent=e,je.value=e,ut=n.path,Cr(n.path,n.width,n.height,n.offsetY)},mt=(e,t=-1)=>{const n=ln(e);if(!n)return qt("Type a word first."),!1;try{return bn(n,t),on(),!0}catch{return qt("Couldn't build that word. Try letters supported by the cursive set."),!1}},vn=()=>{let e=Rt();for(;e;){if(mt(e)){ht();return}e=Rt()}const t=Mn(xt);mt(Tt[t]??Tt[0],t),ht()},Fr=e=>{if(S||!l||$!==null)return;const t=Ut(d,e),n=l.getState(),r=Je(n);if(Ie(n)&&!Er(t,n))return;if(Ie(n)&&(r!=null&&r.isDot)){e.preventDefault(),xr();return}l.beginAt(t)&&(e.preventDefault(),E=!1,$=e.pointerId,K=t,rr(),ar(),m>.5&&ur(),d.setPointerCapture(e.pointerId),x())},$r=e=>{if(!(S||!l||e.pointerId!==$)){if(e.preventDefault(),K=Ut(d,e),E){un(),x();return}l.update(K),x()}},Hr=e=>{!l||e.pointerId!==$||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,x())},qr=e=>{e.pointerId===$&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,x())};d.addEventListener("pointerdown",Fr);d.addEventListener("pointermove",$r);d.addEventListener("pointerup",Hr);d.addEventListener("pointercancel",qr);se.addEventListener("click",Nr);it.addEventListener("input",()=>{Ye=Number(it.value),sn(),bt()});lt.addEventListener("change",()=>{rn=lt.checked,bt()});ct.addEventListener("change",()=>{an=ct.checked,bt()});nn.addEventListener("submit",e=>{e.preventDefault(),mt(je.value)});St.addEventListener("click",vn);je.addEventListener("input",()=>{oe.hidden||on()});document.addEventListener("pointerdown",e=>{if(!_e.open)return;const t=e.target;t instanceof Node&&_e.contains(t)||(_e.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(_e.open=!1)});sn();ht();vn();
