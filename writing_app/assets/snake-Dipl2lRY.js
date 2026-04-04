import{M as Tn,a as Ln,T as Nn,f as Cn,W as Lt,b as Fn,c as $n,d as Rn,e as nt,A as Hn,g as Kt,h as Nt}from"./shared-CvxpMkzH.js";import{a as qn}from"./groups-Cr1poJ62.js";const Xt="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Vt="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",On="/letterpaths/writing_app/assets/background-BdaS-6aw.png",it="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Wn="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",Bn="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",Un="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",Gn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Yn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Kn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Xn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Vn="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",Re="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Te="/letterpaths/writing_app/assets/head-CeHhv_vT.png",jt="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",jn=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},rt=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],zt=150,zn=44,Zn=180,Ct=.75,U=76,Ft=115,Qn=.25,Zt=.3,Qt=.12,Jn=.42,lt=10,Q=260,at=510,er=220,tr=700,$t=6,I={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},O={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},nr={...O,height:O.height*(209/431/(160/435))},C={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,fe=44,Jt=700,rr=260,en=800,ar=18,sr=.72,V={width:200,height:106},ne={width:69,height:49,anchorX:.5,anchorY:.62},Be={width:128,height:141,anchorX:.5,anchorY:1},or=[Gn,Yn,Kn,Xn],St=document.querySelector("#app");if(!St)throw new Error("Missing #app element for snake app.");jn();St.innerHTML=`
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
                    min="${Tn}"
                    max="${Ln}"
                    step="${Nn}"
                    value="${zt}"
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
`;St.style.setProperty("--snake-board-image",`url("${On}")`);const tn=document.querySelector("#word-label"),nn=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),se=document.querySelector("#show-me-button"),Se=document.querySelector("#settings-menu"),ct=document.querySelector("#tolerance-slider"),rn=document.querySelector("#tolerance-value"),dt=document.querySelector("#include-initial-lead-in"),ut=document.querySelector("#include-final-lead-out"),an=document.querySelector("#success-overlay"),sn=document.querySelector("#custom-word-form"),Ze=document.querySelector("#custom-word-input"),oe=document.querySelector("#custom-word-error"),xt=document.querySelector("#next-word-button");if(!tn||!nn||!d||!se||!Se||!ct||!rn||!dt||!ut||!an||!sn||!Ze||!oe||!xt)throw new Error("Missing elements for snake app.");let kt=-1,pt="",Ue="current",gt=null,l=null,$=null,K=null,st=!1,xe=[],Ge=[],ke=[],Ye=[],H=null,we=null,S=!1,Ke=zt,on=!0,ln=!0,ie=[],Qe=[],M=[],be=[],Ae=null,x=1,te=null,Xe=1600,ft=900,wt=0,_=null,le=[],He=null,re=null,qe=null,Et=[],B=null,me=null,Je=new Map,N=null,Oe=null,j=null,We=null,y=[],v=0,De=0,Z=null,vt=0,m=0,b=0,z=null,T=null,F=0,q=null,G=null,A=!1,P=!1,Pe=0,Le=[],Ve=new Set,Ee=[],f="hidden",ce=null,ae=null,W=0,D=null,k=!1,ee=null,he=[],Rt=!1,$e=null,ye=[],Ht=!1,ht=-1,_e=Number.POSITIVE_INFINITY;const cn=()=>{rn.textContent=`${Ke}px`},bt=()=>{pt&&Pn(pt,kt)},dn=()=>{oe.hidden=!0,oe.textContent=""},qt=e=>{oe.hidden=!1,oe.textContent=e},un=e=>e.trim().replace(/\s+/g," ").toLowerCase(),ir=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(un).filter(t=>t.length>0)},je=ir();let ve=0;const yt=()=>{xt.textContent=ve<je.length?"Next queued word":"Next random word"},lr=e=>Ue==="nextQueued"?je[ve]??e:e,Ot=()=>{if(ve>=je.length)return null;const e=je[ve];return ve+=1,e??null},pn=()=>$e||($e=or.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Qt,t}),$e),gn=()=>ee||(ee=new Audio(Un),ee.preload="auto",ee.volume=Zt,ee),cr=()=>{Rt||(gn().load(),Rt=!0)},dr=()=>{Ht||(pn().forEach(e=>{e.load()}),Ht=!0)},ur=()=>{const e=gn(),t=e.currentSrc||e.src;if(!t)return;const n=new Audio(t);n.preload="auto",n.currentTime=0,n.volume=Zt,he.push(n),n.addEventListener("ended",()=>{he=he.filter(r=>r!==n)}),n.addEventListener("error",()=>{he=he.filter(r=>r!==n)}),n.play().catch(()=>{})},pr=()=>{const e=pn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Qt,ye.push(r),r.addEventListener("ended",()=>{ye=ye.filter(a=>a!==r)}),r.addEventListener("error",()=>{ye=ye.filter(a=>a!==r)}),r.play().catch(()=>{})},et=()=>{const e=x>0?x-1:-1,t=e>=0?M[e]:null;ht=e,_e=t?t.startDistance+U:Number.POSITIVE_INFINITY},gr=e=>{if(!e.isPenDown||S||A||P||k)return;const t=x>0?x-1:-1,n=t>=0?M[t]:null;if(!n){_e=Number.POSITIVE_INFINITY,ht=t;return}t!==ht&&et();const r=Ie(e);let a=!1;for(;r>=_e&&_e<=n.endDistance;)Math.random()<Jn&&(a=!0),_e+=U;a&&pr()},Ne=()=>{const e=S;Qe.forEach(t=>{const n=ie[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=x;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),nn.textContent=ie.length===0?"Nice tracing.":"All the fruit is collected."},de=e=>{an.hidden=!e},ue=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},ge=e=>Math.atan2(e.y,e.x)*(180/Math.PI),fr=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ce=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},hr=()=>{if(Ce(),Math.abs(m-b)<.5){m=b,L();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*tr,s=b-m;if(Math.abs(s)<=a){m=b,z=null,L(),fn();return}m+=Math.sign(s)*a,L(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},yr=e=>{const t=Math.max(0,e);Math.abs(t-b)<.5||(b=t,hr())},mr=()=>{Ce(),b=m,T=v,F=m},fn=()=>{if(!k||$===null||!K||!l||m>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(k=!1,T=v,F=m,l.update(K),w(),!0):!1},_r=()=>{if(T===null)return;const e=Math.max(0,v-T),t=Math.max(0,F-e);if(Math.abs(t-m)<.5){t<=.5&&(m=0,b=0,T=null,F=0);return}m=t,b=t,t<=.5&&(m=0,b=0,T=null,F=0)},tt=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,Sr=e=>le[e.activeStrokeIndex]??null,hn=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ie=e=>{var n;if(!_)return 0;if(e.status==="complete")return wt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+hn(e)},pe=e=>{var t;return((t=Sr(e))==null?void 0:t.deferred)===!0},xr=e=>e.status==="complete"||!pe(e)?!1:le.slice(e.activeStrokeIndex).every(t=>(t==null?void 0:t.deferred)===!0),At=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},yn=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},mn=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=le[t];if(!(!n||n.deferred))return yn(t)}return null},Wt=e=>{if(pe(e)){const n=mn(e);if(n)return n}const t=[...y].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:fr(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},Dt=e=>{var t;return S||e.status==="complete"||!pe(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=tt(e))==null?void 0:t.isDot)===!0}},kr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===ce&&((n=tt(t))==null?void 0:n.isDot)===!0&&f!=="hidden"&&f!=="waiting"},wr=e=>{if(!me)return;const t=Dt(e);if(!t){me.style.opacity="0";return}if(t.isDot){me.style.opacity="0";return}Pt(me,{point:t.point,tangent:t.tangent,angle:ge(t.tangent)},{isDot:!1,headHref:Te,travelledDistance:hn(e)})},Pt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Te),Y(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},I.width*J,I.height*J,I.anchorX,I.anchorY,I.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const h=At(n.travelledDistance??Number.POSITIVE_INFINITY,1,fe);if(h.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*fe,y:t.point.y-t.tangent.y*fe},E={x:t.point.x-t.tangent.x*fe*2,y:t.point.y-t.tangent.y*fe*2};a&&c&&Y(a,c,{x:p.x,y:p.y,angle:t.angle,visible:!0},O.width*J,O.height*J,O.anchorX,O.anchorY,O.rotationOffset),s&&u&&h.showTail?Y(s,u,{x:E.x,y:E.y,angle:t.angle,visible:!0},C.width*J,C.height*J,C.anchorX,C.anchorY,C.rotationOffset):s&&(s.style.opacity="0")},Bt=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${jt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Xt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Te}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,Me=()=>{G!==null&&(cancelAnimationFrame(G),G=null),f="hidden",ce=null,ae=null,N&&(N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting")),j&&(j.style.opacity="0")},Er=e=>({x:e.x,y:e.y-ar}),vr=e=>({x:e.x,y:e.y+8}),_n=(e=performance.now())=>{if(f==="hidden"||!ae)return null;const t=vr(ae),n=Er(ae);if(f==="waiting")return{snakePoint:t,snakeHref:Re,snakeWobble:!0};if(f==="eagle_in"){const i=Math.max(0,Math.min(1,(e-W)/Jt)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:Re,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+V.height)*c},eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}}if(f==="eagle_stand")return{snakePoint:t,snakeHref:Re,snakeWobble:!1,eaglePoint:n,eagleHref:Wn,eagleWidth:Be.width,eagleHeight:Be.height};const r=Math.max(0,Math.min(1,(e-W)/en)),a=1-(1-r)*(1-r),s={x:n.x+(Xe+V.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+V.height*.6},snakeHref:Vn,snakeWobble:!1,eaglePoint:s,eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}},Sn=()=>{var t;const e=l==null?void 0:l.getState();if(!(!l||!e)&&ce!==null&&e.activeStrokeIndex===ce&&(t=tt(e))!=null&&t.isDot){l.beginAt(e.cursorPoint);const n=l.getState();An(Ie(n)),wn(n)}},br=()=>{Sn(),Me(),w()},xn=e=>{if(G=null,!(f==="hidden"||f==="waiting")){if(f==="eagle_in"&&e-W>=Jt)f="eagle_stand",W=e;else if(f==="eagle_stand"&&e-W>=rr)f="eagle_out",W=e;else if(f==="eagle_out"&&e-W>=en){br();return}w(),G=requestAnimationFrame(xn)}},Ar=()=>{f==="waiting"&&(Sn(),f="eagle_in",W=performance.now(),G!==null&&cancelAnimationFrame(G),G=requestAnimationFrame(xn),w())},Dr=e=>{const t=Dt(e);if(!(t!=null&&t.isDot)){if(f!=="hidden"&&f!=="waiting")return;Me();return}ce!==t.strokeIndex?(Me(),ce=t.strokeIndex,ae=t.point,f="waiting"):f==="waiting"&&(ae=t.point)},Pr=(e=performance.now())=>{if(!N||!Oe||!j||!We)return;const t=_n(e);if(!t){N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting"),j.style.opacity="0";return}if(N.style.opacity="1",N.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Oe.setAttribute("href",t.snakeHref),Y(N,Oe,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},ne.width,ne.height,ne.anchorX,ne.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){j.style.opacity="0";return}We.setAttribute("href",t.eagleHref),Y(j,We,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Be.anchorX,Be.anchorY,0)},Ir=(e,t)=>{const n=Dt(t);if(!n)return!1;if(n.isDot){if(f!=="waiting")return!1;const a=_n();if(!a)return!1;const s=Math.max(ne.width,ne.height)*sr;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,I.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Mr=e=>{e.completedStrokes.forEach(t=>{if(Ve.has(t))return;Ve.add(t);const n=le[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=yn(t);a&&Le.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:ge(a.tangent)})})},Tr=()=>{Je.forEach((e,t)=>{const n=Le.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}Pt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},It=()=>{Je.forEach(e=>{e.style.opacity="0"})},Lr=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},kn=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return Lr(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},Nr=e=>{const t=M[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=kn(_,n),a=ue({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:ue({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},Cr=()=>{x=Math.min(x+1,M.length),Ae=x-1<be.length?x-1:null,Dn(),Ne(),et()},wn=e=>{if(S||A||P||k||M.length<=x)return!1;const t=x-1,n=M[t];return!n||Ie(e)<n.endDistance-8?!1:(k=!0,T=null,F=0,Z=n.endDistance,D=Nr(t+1),D&&(De=ge(D),ze(n.endPoint,D,!0)),Cr(),l==null||l.end(),vn(),w(),!0)},Fr=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/Zn));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),h=kn(e,u);return{x:h.x,y:h.y,pathDistance:u,emoji:rt[(r+c)%rt.length]??rt[0],captured:!1,groupIndex:r}})}),En=()=>{x=M.length>0?1:0,Ae=be.length>0?0:null,ie.forEach(e=>{e.captured=!1}),Qe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),Dn(),Ne()},Mt=()=>{const e=Math.max(3,Math.min(lt,Math.floor(wt/Ft)));return Math.min(e,1+Math.floor(v/Ft))},vn=()=>{if(S||A||P){T=null,F=0;return}if(!k)return;const e=At(v,Mt(),U).bodyCount;yr((e+1)*U)},Y=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},ot=e=>{const t=y[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(y.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<y.length;r+=1){const a=y[r-1],s=y[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,h=a.y+(s.y-a.y)*c;return{x:u,y:h,angle:ge({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...y[y.length-1]??t,distance:e}},bn=()=>{re==null||re.style.setProperty("opacity","0"),B==null||B.style.setProperty("opacity","0"),Et.forEach(e=>{e.style.opacity="0"})},L=(e=performance.now())=>{if(!He||!re||!qe||!B||y.length===0)return;if(S||P){He.style.opacity="0";return}He.style.opacity="1";const t=A?Pe:Mt(),n=A?0:m,r=At(v,t,U),a=r.bodyCount,s=ot(v);qe.setAttribute("href",e<vt?Bn:Te),Y(re,qe,{...s,angle:De},I.width,I.height,I.anchorX,I.anchorY,I.rotationOffset),Et.forEach((h,p)=>{if(p>=a){h.style.opacity="0";return}const E=h.querySelector("image");if(!E)return;const X=Math.max(0,(p+1)*U-n);if(X<=$t){h.style.opacity="0";return}const Fe=ot(Math.max(0,v-X)),o=E.getAttribute("href")===Vt?nr:O;Y(h,E,Fe,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=B.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*U-n);if(!r.showTail||c<=$t){B.style.opacity="0";return}const u=ot(Math.max(0,v-c));Y(B,i,u,C.width,C.height,C.anchorX,C.anchorY,C.rotationOffset)},Tt=(e,t,n=!0)=>{const r=ue(t);De=ge(r),y=[{x:e.x,y:e.y,angle:De,distance:0,visible:n}],v=0,vt=0,m=0,b=0,T=null,F=0,Z=null,D=null,k=!1,P=!1,A=!1,Pe=0,Ce(),q!==null&&(cancelAnimationFrame(q),q=null),L()},ze=(e,t,n)=>{const r=ue(t),a=ge(r);De=a;const s=y[y.length-1];if(!s){Tt(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?y[y.length-1]={...s,x:e.x,y:e.y,angle:a}:(y.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),v=s.distance+.001),L();return}v=s.distance+i,y.push({x:e.x,y:e.y,angle:a,distance:v,visible:n}),_r(),L()},Ut=(e,t,n)=>{const r=ue(t),a=[];r.x>.001?a.push((Xe+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((ft+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Xe,ft)+Q)+(n+2)*U+Q},Gt=(e,t)=>{if(A||P)return;Ce(),m=0,b=0,T=null,F=0,Z=null,D=null,k=!1;const n=ue(t),r=performance.now();Pe=Mt();const a=Ut(e,n,Pe);Ee=Le.map(i=>({...i,travelDistance:Ut(i.point,i.tangent,0)})),A=!0,de(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*at);ze({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),Ee.forEach(p=>{const E=Je.get(p.strokeIndex);if(!E)return;const X=Math.min(p.travelDistance,c*at);Pt(E,{point:{x:p.point.x+p.tangent.x*X,y:p.point.y+p.tangent.y*X},tangent:p.tangent,angle:p.angle})});const h=Ee.every(p=>c*at>=p.travelDistance);if(u>=a&&h){A=!1,P=!0,q=null,bn(),It(),de(!0);return}q=requestAnimationFrame(s)};q=requestAnimationFrame(s)},An=e=>{let t=!1;ie.forEach((n,r)=>{if(n.captured||n.groupIndex>=x||e+.5<n.pathDistance)return;n.captured=!0;const a=Qe[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(vt=performance.now()+er,ur(),Ne(),L())},Dn=()=>{if(!te)return;const e=Ae!==null?be[Ae]:void 0;if(!e){te.classList.add("writing-app__boundary-star--hidden");return}te.classList.remove("writing-app__boundary-star--hidden"),te.setAttribute("x",`${e.x}`),te.setAttribute("y",`${e.y}`)},$r=e=>{if(Z!==null){if(Ie(e)+.5<Z){L();return}Z=null}const n=D!==null&&(k||e.isPenDown)&&D?D:e.cursorTangent;if(pe(e)){const r=mn(e),a=y[y.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&ze(r.point,r.tangent,!0)}else ze(e.cursorPoint,n,!0);D&&e.isPenDown&&!k&&(D=null),S||An(Ie(e)),!S&&e.isPenDown&&(gr(e),wn(e))},mt=()=>{we!==null&&(cancelAnimationFrame(we),we=null),S=!1,se.disabled=!1,se.textContent="Demo",ke.forEach((e,t)=>{const n=Ye[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),H&&(H.style.opacity="0"),Ne(),L(),w()},Yt=()=>{l==null||l.reset(),$=null,K=null,de(!1),P=!1,A=!1,Pe=0,Le=[],Ve=new Set,Ee=[],Me(),q!==null&&(cancelAnimationFrame(q),q=null),xe.forEach((t,n)=>{const r=Ge[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ce(),m=0,b=0,T=null,F=0,Z=null,D=null,k=!1;const e=l==null?void 0:l.getState();e?Tt(e.cursorPoint,e.cursorTangent,!0):bn(),It(),En(),et(),w()},w=()=>{st||(st=!0,requestAnimationFrame(()=>{st=!1,Rr()}))},Rr=()=>{if(!l)return;const e=l.getState();vn(),Mr(e),Dr(e),Pr(),wr(e),Tr();const t=new Set(e.completedStrokes);if(xe.forEach((n,r)=>{const a=Ge[r]??0;if(t.has(r)||kr(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!S&&!A&&!P&&!k?$r(e):L(),!S&&!A&&!P&&xr(e)){const n=Wt(e);Gt(n.point,n.tangent)}if(e.status==="complete"){if(!S&&!A&&!P){const n=Wt(e);Gt(n.point,n.tangent)}de(P);return}de(!1)},Hr=()=>{if(!gt||S)return;Yt(),mt();const e=new Hn(gt,{speed:1.7*Ct,penUpSpeed:2.1*Ct,deferredDelayMs:150});S=!0,se.disabled=!0,se.textContent="Demo...",Ne(),L();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(ke.forEach((u,h)=>{const p=Ye[h]??.001;if(c.has(h)){u.style.strokeDashoffset="0";return}if(h===i.activeStrokeIndex){const E=p*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,E)}`;return}u.style.strokeDashoffset=`${p}`}),H&&(H.setAttribute("cx",i.point.x.toFixed(2)),H.setAttribute("cy",i.point.y.toFixed(2)),H.style.opacity=a<=e.totalDuration+Nt?"1":"0"),a<e.totalDuration+Nt){we=requestAnimationFrame(n);return}mt(),Yt()};we=requestAnimationFrame(n),w()},qr=(e,t,n,r)=>{Xe=t,ft=n;const a=$n(e);_=a,le=e.strokes.filter(o=>o.type!=="lift"),wt=a.strokes.reduce((o,g)=>o+g.totalLength,0),M=qn(a).groups,be=M.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),Ae=be.length>0?0:null,x=M.length>0?1:0,l=new Rn(a,{startTolerance:Ke,hitTolerance:Ke}),$=null,ie=Fr(a,M);const i=le,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${nt(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${nt(o.curves)}"></path>`).join(""),h=i.map(o=>`<path class="writing-app__stroke-demo" d="${nt(o.curves)}"></path>`).join(""),p=ie.map((o,g)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${g}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${zn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),E=Array.from({length:lt},(o,g)=>{const R=lt-1-g,Mn=Math.random()<Qn?Vt:Xt;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${R}"
      >
        <image
          href="${Mn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),X=i.map((o,g)=>o.deferred?g:null).filter(o=>o!==null).map(o=>Bt(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
          href="${jt}"
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
    ${Bt('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Re}"
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
  `,xe=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),ke=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Qe=Array.from(d.querySelectorAll(".writing-app__fruit")),te=d.querySelector("#waypoint-star"),He=d.querySelector("#trace-snake"),re=d.querySelector("#snake-head"),qe=d.querySelector("#snake-head-image"),B=d.querySelector("#snake-tail"),Et=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,g)=>Number(o.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),me=d.querySelector("#deferred-head"),Je=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),N=d.querySelector("#dot-snake"),Oe=d.querySelector("#dot-snake-image"),j=d.querySelector("#dot-eagle"),We=d.querySelector("#dot-eagle-image"),H=d.querySelector("#demo-nib"),Ge=xe.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Ye=ke.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),xe.forEach((o,g)=>{const R=Ge[g]??.001;o.style.strokeDasharray=`${R} ${R}`,o.style.strokeDashoffset=`${R}`}),ke.forEach((o,g)=>{const R=Ye[g]??.001;o.style.strokeDasharray=`${R} ${R}`,o.style.strokeDashoffset=`${R}`}),H&&(H.style.opacity="0");const Fe=l.getState();Tt(Fe.cursorPoint,Fe.cursorTangent),Le=[],Ve=new Set,Ee=[],Me(),It(),En(),et(),de(!1),w()},Pn=(e,t=-1)=>{mt();const n=Fn(e,{keepInitialLeadIn:on,keepFinalLeadOut:ln});pt=e,kt=t,tn.textContent=e,Ze.value=lr(e),gt=n.path,qr(n.path,n.width,n.height,n.offsetY)},_t=(e,t=-1)=>{const n=un(e);if(!n)return qt("Type a word first."),!1;try{return Pn(n,t),dn(),!0}catch{return qt("Couldn't build that word. Try letters supported by the cursive set."),!1}},In=()=>{let e=Ot();for(;e;){if(Ue="nextQueued",_t(e)){yt();return}e=Ot()}Ue="current";const t=Cn(kt);_t(Lt[t]??Lt[0],t),yt()},Or=e=>{if(S||!l||$!==null)return;const t=Kt(d,e),n=l.getState(),r=tt(n);if(pe(n)&&!Ir(t,n))return;if(pe(n)&&(r!=null&&r.isDot)){e.preventDefault(),Ar();return}l.beginAt(t)&&(e.preventDefault(),k=!1,$=e.pointerId,K=t,cr(),dr(),m>.5&&mr(),d.setPointerCapture(e.pointerId),w())},Wr=e=>{if(!(S||!l||e.pointerId!==$)){if(e.preventDefault(),K=Kt(d,e),k){fn(),w();return}l.update(K),w()}},Br=e=>{!l||e.pointerId!==$||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,w())},Ur=e=>{e.pointerId===$&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,w())};d.addEventListener("pointerdown",Or);d.addEventListener("pointermove",Wr);d.addEventListener("pointerup",Br);d.addEventListener("pointercancel",Ur);se.addEventListener("click",Hr);ct.addEventListener("input",()=>{Ke=Number(ct.value),cn(),bt()});dt.addEventListener("change",()=>{on=dt.checked,bt()});ut.addEventListener("change",()=>{ln=ut.checked,bt()});sn.addEventListener("submit",e=>{e.preventDefault(),Ue="current",_t(Ze.value)});xt.addEventListener("click",In);Ze.addEventListener("input",()=>{oe.hidden||dn()});document.addEventListener("pointerdown",e=>{if(!Se.open)return;const t=e.target;t instanceof Node&&Se.contains(t)||(Se.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(Se.open=!1)});cn();yt();In();
