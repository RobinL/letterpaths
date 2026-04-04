import{M as In,a as Mn,T as Tn,f as Ln,W as Lt,b as Nn,c as Cn,d as Fn,e as nt,A as $n,g as Gt,h as Nt}from"./shared-CvxpMkzH.js";import{a as Hn}from"./groups-Cr1poJ62.js";const Yt="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Kt="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",qn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",it="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Rn="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",On="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",Wn="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",Bn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Un="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Gn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Yn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Kn="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",He="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Te="/letterpaths/writing_app/assets/head-CeHhv_vT.png",Xt="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",Xn=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},rt=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Vt=150,Vn=44,jn=180,Ct=.75,U=76,Ft=115,zn=.25,jt=.3,zt=.12,Zn=.42,lt=10,Q=260,at=510,Qn=220,Jn=700,$t=6,I={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},O={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},er={...O,height:O.height*(209/431/(160/435))},C={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,pe=44,Zt=700,tr=260,Qt=800,nr=18,V={width:200,height:106},ne={width:69,height:49,anchorX:.5,anchorY:.62},Be={width:128,height:141,anchorX:.5,anchorY:1},rr=[Bn,Un,Gn,Yn],St=document.querySelector("#app");if(!St)throw new Error("Missing #app element for snake app.");Xn();St.innerHTML=`
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
                    min="${In}"
                    max="${Mn}"
                    step="${Tn}"
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
`;St.style.setProperty("--snake-board-image",`url("${qn}")`);const Jt=document.querySelector("#word-label"),en=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),se=document.querySelector("#show-me-button"),me=document.querySelector("#settings-menu"),ct=document.querySelector("#tolerance-slider"),tn=document.querySelector("#tolerance-value"),dt=document.querySelector("#include-initial-lead-in"),ut=document.querySelector("#include-final-lead-out"),nn=document.querySelector("#success-overlay"),rn=document.querySelector("#custom-word-form"),Ze=document.querySelector("#custom-word-input"),oe=document.querySelector("#custom-word-error"),xt=document.querySelector("#next-word-button");if(!Jt||!en||!d||!se||!me||!ct||!tn||!dt||!ut||!nn||!rn||!Ze||!oe||!xt)throw new Error("Missing elements for snake app.");let kt=-1,pt="",Ue="current",gt=null,l=null,$=null,K=null,st=!1,_e=[],Ge=[],Se=[],Ye=[],q=null,xe=null,S=!1,Ke=Vt,an=!0,sn=!0,ie=[],Qe=[],M=[],Ee=[],be=null,x=1,te=null,Xe=1600,ft=900,wt=0,_=null,ve=[],qe=null,re=null,Re=null,Et=[],B=null,he=null,Je=new Map,N=null,Oe=null,j=null,We=null,y=[],v=0,Ae=0,Z=null,bt=0,m=0,A=0,z=null,T=null,F=0,R=null,G=null,k=!1,D=!1,De=0,Le=[],Ve=new Set,ke=[],f="hidden",le=null,ae=null,W=0,P=null,w=!1,ee=null,ge=[],Ht=!1,$e=null,fe=[],qt=!1,ht=-1,ye=Number.POSITIVE_INFINITY;const on=()=>{tn.textContent=`${Ke}px`},vt=()=>{pt&&An(pt,kt)},ln=()=>{oe.hidden=!0,oe.textContent=""},Rt=e=>{oe.hidden=!1,oe.textContent=e},cn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),ar=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(cn).filter(t=>t.length>0)},je=ar();let we=0;const yt=()=>{xt.textContent=we<je.length?"Next queued word":"Next random word"},sr=e=>Ue==="nextQueued"?je[we]??e:e,Ot=()=>{if(we>=je.length)return null;const e=je[we];return we+=1,e??null},dn=()=>$e||($e=rr.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=zt,t}),$e),un=()=>ee||(ee=new Audio(Wn),ee.preload="auto",ee.volume=jt,ee),or=()=>{Ht||(un().load(),Ht=!0)},ir=()=>{qt||(dn().forEach(e=>{e.load()}),qt=!0)},lr=()=>{const e=un(),t=e.currentSrc||e.src;if(!t)return;const n=new Audio(t);n.preload="auto",n.currentTime=0,n.volume=jt,ge.push(n),n.addEventListener("ended",()=>{ge=ge.filter(r=>r!==n)}),n.addEventListener("error",()=>{ge=ge.filter(r=>r!==n)}),n.play().catch(()=>{})},cr=()=>{const e=dn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=zt,fe.push(r),r.addEventListener("ended",()=>{fe=fe.filter(a=>a!==r)}),r.addEventListener("error",()=>{fe=fe.filter(a=>a!==r)}),r.play().catch(()=>{})},et=()=>{const e=x>0?x-1:-1,t=e>=0?M[e]:null;ht=e,ye=t?t.startDistance+U:Number.POSITIVE_INFINITY},dr=e=>{if(!e.isPenDown||S||k||D||w)return;const t=x>0?x-1:-1,n=t>=0?M[t]:null;if(!n){ye=Number.POSITIVE_INFINITY,ht=t;return}t!==ht&&et();const r=Pe(e);let a=!1;for(;r>=ye&&ye<=n.endDistance;)Math.random()<Zn&&(a=!0),ye+=U;a&&cr()},Ne=()=>{const e=S;Qe.forEach(t=>{const n=ie[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=x;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),en.textContent=ie.length===0?"Nice tracing.":"All the fruit is collected."},ce=e=>{nn.hidden=!e},de=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},ue=e=>Math.atan2(e.y,e.x)*(180/Math.PI),ur=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ce=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},pr=()=>{if(Ce(),Math.abs(m-A)<.5){m=A,L();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*Jn,s=A-m;if(Math.abs(s)<=a){m=A,z=null,L(),pn();return}m+=Math.sign(s)*a,L(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},gr=e=>{const t=Math.max(0,e);Math.abs(t-A)<.5||(A=t,pr())},fr=()=>{Ce(),A=m,T=v,F=m},pn=()=>{if(!w||$===null||!K||!l||m>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(w=!1,T=v,F=m,l.update(K),E(),!0):!1},hr=()=>{if(T===null)return;const e=Math.max(0,v-T),t=Math.max(0,F-e);if(Math.abs(t-m)<.5){t<=.5&&(m=0,A=0,T=null,F=0);return}m=t,A=t,t<=.5&&(m=0,A=0,T=null,F=0)},tt=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,yr=e=>ve[e.activeStrokeIndex]??null,gn=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Pe=e=>{var n;if(!_)return 0;if(e.status==="complete")return wt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+gn(e)},Ie=e=>{var t;return((t=yr(e))==null?void 0:t.deferred)===!0},At=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},fn=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},hn=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=ve[t];if(!(!n||n.deferred))return fn(t)}return null},mr=e=>{if(Ie(e)){const n=hn(e);if(n)return n}const t=[...y].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:ur(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},Dt=e=>{var t;return S||k||D||e.status==="complete"||!Ie(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=tt(e))==null?void 0:t.isDot)===!0}},_r=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===le&&((n=tt(t))==null?void 0:n.isDot)===!0&&f!=="hidden"&&f!=="waiting"},Sr=e=>{if(!he)return;const t=Dt(e);if(!t){he.style.opacity="0";return}if(t.isDot){he.style.opacity="0";return}Pt(he,{point:t.point,tangent:t.tangent,angle:ue(t.tangent)},{isDot:!1,headHref:Te,travelledDistance:gn(e)})},Pt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Te),Y(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},I.width*J,I.height*J,I.anchorX,I.anchorY,I.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const h=At(n.travelledDistance??Number.POSITIVE_INFINITY,1,pe);if(h.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*pe,y:t.point.y-t.tangent.y*pe},b={x:t.point.x-t.tangent.x*pe*2,y:t.point.y-t.tangent.y*pe*2};a&&c&&Y(a,c,{x:p.x,y:p.y,angle:t.angle,visible:!0},O.width*J,O.height*J,O.anchorX,O.anchorY,O.rotationOffset),s&&u&&h.showTail?Y(s,u,{x:b.x,y:b.y,angle:t.angle,visible:!0},C.width*J,C.height*J,C.anchorX,C.anchorY,C.rotationOffset):s&&(s.style.opacity="0")},Wt=e=>`
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
`,Me=()=>{G!==null&&(cancelAnimationFrame(G),G=null),f="hidden",le=null,ae=null,N&&(N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting")),j&&(j.style.opacity="0")},xr=e=>({x:e.x,y:e.y-nr}),kr=e=>({x:e.x,y:e.y+8}),yn=(e=performance.now())=>{if(f==="hidden"||!ae)return null;const t=kr(ae),n=xr(ae);if(f==="waiting")return{snakePoint:t,snakeHref:He,snakeWobble:!0};if(f==="eagle_in"){const i=Math.max(0,Math.min(1,(e-W)/Zt)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:He,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+V.height)*c},eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}}if(f==="eagle_stand")return{snakePoint:t,snakeHref:He,snakeWobble:!1,eaglePoint:n,eagleHref:Rn,eagleWidth:Be.width,eagleHeight:Be.height};const r=Math.max(0,Math.min(1,(e-W)/Qt)),a=1-(1-r)*(1-r),s={x:n.x+(Xe+V.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+V.height*.6},snakeHref:Kn,snakeWobble:!1,eaglePoint:s,eagleHref:it,eagleWidth:V.width,eagleHeight:V.height}},mn=()=>{var t;const e=l==null?void 0:l.getState();if(!(!l||!e)&&le!==null&&e.activeStrokeIndex===le&&(t=tt(e))!=null&&t.isDot){l.beginAt(e.cursorPoint);const n=l.getState();bn(Pe(n)),xn(n)}},wr=()=>{mn(),Me(),E()},_n=e=>{if(G=null,!(f==="hidden"||f==="waiting")){if(f==="eagle_in"&&e-W>=Zt)f="eagle_stand",W=e;else if(f==="eagle_stand"&&e-W>=tr)f="eagle_out",W=e;else if(f==="eagle_out"&&e-W>=Qt){wr();return}E(),G=requestAnimationFrame(_n)}},Er=()=>{f==="waiting"&&(mn(),f="eagle_in",W=performance.now(),G!==null&&cancelAnimationFrame(G),G=requestAnimationFrame(_n),E())},br=e=>{const t=Dt(e);if(!(t!=null&&t.isDot)){if(f!=="hidden"&&f!=="waiting")return;Me();return}le!==t.strokeIndex?(Me(),le=t.strokeIndex,ae=t.point,f="waiting"):f==="waiting"&&(ae=t.point)},vr=(e=performance.now())=>{if(!N||!Oe||!j||!We)return;const t=yn(e);if(!t){N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting"),j.style.opacity="0";return}if(N.style.opacity="1",N.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Oe.setAttribute("href",t.snakeHref),Y(N,Oe,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},ne.width,ne.height,ne.anchorX,ne.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){j.style.opacity="0";return}We.setAttribute("href",t.eagleHref),Y(j,We,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Be.anchorX,Be.anchorY,0)},Ar=(e,t)=>{const n=Dt(t);if(!n)return!1;if(n.isDot){if(f!=="waiting")return!1;const a=yn();if(!a)return!1;const s=Math.max(ne.width,ne.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,I.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Dr=e=>{e.completedStrokes.forEach(t=>{if(Ve.has(t))return;Ve.add(t);const n=ve[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=fn(t);a&&Le.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:ue(a.tangent)})})},Pr=()=>{Je.forEach((e,t)=>{const n=Le.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}Pt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},It=()=>{Je.forEach(e=>{e.style.opacity="0"})},Ir=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Sn=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return Ir(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},Mr=e=>{const t=M[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=Sn(_,n),a=de({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:de({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},Tr=()=>{x=Math.min(x+1,M.length),be=x-1<Ee.length?x-1:null,vn(),Ne(),et()},xn=e=>{if(S||k||D||w||M.length<=x)return!1;const t=x-1,n=M[t];return!n||Pe(e)<n.endDistance-8?!1:(w=!0,T=null,F=0,Z=n.endDistance,P=Mr(t+1),P&&(Ae=ue(P),ze(n.endPoint,P,!0)),Tr(),l==null||l.end(),wn(),E(),!0)},Lr=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/jn));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),h=Sn(e,u);return{x:h.x,y:h.y,pathDistance:u,emoji:rt[(r+c)%rt.length]??rt[0],captured:!1,groupIndex:r}})}),kn=()=>{x=M.length>0?1:0,be=Ee.length>0?0:null,ie.forEach(e=>{e.captured=!1}),Qe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),vn(),Ne()},Mt=()=>{const e=Math.max(3,Math.min(lt,Math.floor(wt/Ft)));return Math.min(e,1+Math.floor(v/Ft))},wn=()=>{if(S||k||D){T=null,F=0;return}if(!w)return;const e=At(v,Mt(),U).bodyCount;gr((e+1)*U)},Y=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},ot=e=>{const t=y[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(y.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<y.length;r+=1){const a=y[r-1],s=y[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,h=a.y+(s.y-a.y)*c;return{x:u,y:h,angle:ue({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...y[y.length-1]??t,distance:e}},En=()=>{re==null||re.style.setProperty("opacity","0"),B==null||B.style.setProperty("opacity","0"),Et.forEach(e=>{e.style.opacity="0"})},L=(e=performance.now())=>{if(!qe||!re||!Re||!B||y.length===0)return;if(S||D){qe.style.opacity="0";return}qe.style.opacity="1";const t=k?De:Mt(),n=k?0:m,r=At(v,t,U),a=r.bodyCount,s=ot(v);Re.setAttribute("href",e<bt?On:Te),Y(re,Re,{...s,angle:Ae},I.width,I.height,I.anchorX,I.anchorY,I.rotationOffset),Et.forEach((h,p)=>{if(p>=a){h.style.opacity="0";return}const b=h.querySelector("image");if(!b)return;const X=Math.max(0,(p+1)*U-n);if(X<=$t){h.style.opacity="0";return}const Fe=ot(Math.max(0,v-X)),o=b.getAttribute("href")===Kt?er:O;Y(h,b,Fe,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=B.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*U-n);if(!r.showTail||c<=$t){B.style.opacity="0";return}const u=ot(Math.max(0,v-c));Y(B,i,u,C.width,C.height,C.anchorX,C.anchorY,C.rotationOffset)},Tt=(e,t,n=!0)=>{const r=de(t);Ae=ue(r),y=[{x:e.x,y:e.y,angle:Ae,distance:0,visible:n}],v=0,bt=0,m=0,A=0,T=null,F=0,Z=null,P=null,w=!1,D=!1,k=!1,De=0,Ce(),R!==null&&(cancelAnimationFrame(R),R=null),L()},ze=(e,t,n)=>{const r=de(t),a=ue(r);Ae=a;const s=y[y.length-1];if(!s){Tt(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?y[y.length-1]={...s,x:e.x,y:e.y,angle:a}:(y.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),v=s.distance+.001),L();return}v=s.distance+i,y.push({x:e.x,y:e.y,angle:a,distance:v,visible:n}),hr(),L()},Bt=(e,t,n)=>{const r=de(t),a=[];r.x>.001?a.push((Xe+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((ft+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Xe,ft)+Q)+(n+2)*U+Q},Nr=(e,t)=>{if(k||D)return;Ce(),m=0,A=0,T=null,F=0,Z=null,P=null,w=!1;const n=de(t),r=performance.now();De=Mt();const a=Bt(e,n,De);ke=Le.map(i=>({...i,travelDistance:Bt(i.point,i.tangent,0)})),k=!0,ce(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*at);ze({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),ke.forEach(p=>{const b=Je.get(p.strokeIndex);if(!b)return;const X=Math.min(p.travelDistance,c*at);Pt(b,{point:{x:p.point.x+p.tangent.x*X,y:p.point.y+p.tangent.y*X},tangent:p.tangent,angle:p.angle})});const h=ke.every(p=>c*at>=p.travelDistance);if(u>=a&&h){k=!1,D=!0,R=null,En(),It(),ce(!0);return}R=requestAnimationFrame(s)};R=requestAnimationFrame(s)},bn=e=>{let t=!1;ie.forEach((n,r)=>{if(n.captured||n.groupIndex>=x||e+.5<n.pathDistance)return;n.captured=!0;const a=Qe[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(bt=performance.now()+Qn,lr(),Ne(),L())},vn=()=>{if(!te)return;const e=be!==null?Ee[be]:void 0;if(!e){te.classList.add("writing-app__boundary-star--hidden");return}te.classList.remove("writing-app__boundary-star--hidden"),te.setAttribute("x",`${e.x}`),te.setAttribute("y",`${e.y}`)},Cr=e=>{if(Z!==null){if(Pe(e)+.5<Z){L();return}Z=null}const n=P!==null&&(w||e.isPenDown)&&P?P:e.cursorTangent;if(Ie(e)){const r=hn(e),a=y[y.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&ze(r.point,r.tangent,!0)}else ze(e.cursorPoint,n,!0);P&&e.isPenDown&&!w&&(P=null),S||bn(Pe(e)),!S&&e.isPenDown&&(dr(e),xn(e))},mt=()=>{xe!==null&&(cancelAnimationFrame(xe),xe=null),S=!1,se.disabled=!1,se.textContent="Demo",Se.forEach((e,t)=>{const n=Ye[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),q&&(q.style.opacity="0"),Ne(),L(),E()},Ut=()=>{l==null||l.reset(),$=null,K=null,ce(!1),D=!1,k=!1,De=0,Le=[],Ve=new Set,ke=[],Me(),R!==null&&(cancelAnimationFrame(R),R=null),_e.forEach((t,n)=>{const r=Ge[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ce(),m=0,A=0,T=null,F=0,Z=null,P=null,w=!1;const e=l==null?void 0:l.getState();e?Tt(e.cursorPoint,e.cursorTangent,!0):En(),It(),kn(),et(),E()},E=()=>{st||(st=!0,requestAnimationFrame(()=>{st=!1,Fr()}))},Fr=()=>{if(!l)return;const e=l.getState();wn(),Dr(e),br(e),vr(),Sr(e),!k&&!D&&Pr();const t=new Set(e.completedStrokes);if(_e.forEach((n,r)=>{const a=Ge[r]??0;if(t.has(r)||_r(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!S&&!k&&!D&&!w?Cr(e):L(),e.status==="complete"){if(!S&&!k&&!D){const n=mr(e);Nr(n.point,n.tangent)}ce(D);return}ce(!1)},$r=()=>{if(!gt||S)return;Ut(),mt();const e=new $n(gt,{speed:1.7*Ct,penUpSpeed:2.1*Ct,deferredDelayMs:150});S=!0,se.disabled=!0,se.textContent="Demo...",Ne(),L();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(Se.forEach((u,h)=>{const p=Ye[h]??.001;if(c.has(h)){u.style.strokeDashoffset="0";return}if(h===i.activeStrokeIndex){const b=p*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,b)}`;return}u.style.strokeDashoffset=`${p}`}),q&&(q.setAttribute("cx",i.point.x.toFixed(2)),q.setAttribute("cy",i.point.y.toFixed(2)),q.style.opacity=a<=e.totalDuration+Nt?"1":"0"),a<e.totalDuration+Nt){xe=requestAnimationFrame(n);return}mt(),Ut()};xe=requestAnimationFrame(n),E()},Hr=(e,t,n,r)=>{Xe=t,ft=n;const a=Cn(e);_=a,ve=e.strokes.filter(o=>o.type!=="lift"),wt=a.strokes.reduce((o,g)=>o+g.totalLength,0),M=Hn(a).groups,Ee=M.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),be=Ee.length>0?0:null,x=M.length>0?1:0,l=new Fn(a,{startTolerance:Ke,hitTolerance:Ke}),$=null,ie=Lr(a,M);const i=ve,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${nt(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${nt(o.curves)}"></path>`).join(""),h=i.map(o=>`<path class="writing-app__stroke-demo" d="${nt(o.curves)}"></path>`).join(""),p=ie.map((o,g)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${g}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${Vn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),b=Array.from({length:lt},(o,g)=>{const H=lt-1-g,Pn=Math.random()<zn?Kt:Yt;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${H}"
      >
        <image
          href="${Pn}"
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
  `,_e=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),Se=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Qe=Array.from(d.querySelectorAll(".writing-app__fruit")),te=d.querySelector("#waypoint-star"),qe=d.querySelector("#trace-snake"),re=d.querySelector("#snake-head"),Re=d.querySelector("#snake-head-image"),B=d.querySelector("#snake-tail"),Et=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,g)=>Number(o.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),he=d.querySelector("#deferred-head"),Je=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),N=d.querySelector("#dot-snake"),Oe=d.querySelector("#dot-snake-image"),j=d.querySelector("#dot-eagle"),We=d.querySelector("#dot-eagle-image"),q=d.querySelector("#demo-nib"),Ge=_e.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Ye=Se.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),_e.forEach((o,g)=>{const H=Ge[g]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),Se.forEach((o,g)=>{const H=Ye[g]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),q&&(q.style.opacity="0");const Fe=l.getState();Tt(Fe.cursorPoint,Fe.cursorTangent),Le=[],Ve=new Set,ke=[],Me(),It(),kn(),et(),ce(!1),E()},An=(e,t=-1)=>{mt();const n=Nn(e,{keepInitialLeadIn:an,keepFinalLeadOut:sn});pt=e,kt=t,Jt.textContent=e,Ze.value=sr(e),gt=n.path,Hr(n.path,n.width,n.height,n.offsetY)},_t=(e,t=-1)=>{const n=cn(e);if(!n)return Rt("Type a word first."),!1;try{return An(n,t),ln(),!0}catch{return Rt("Couldn't build that word. Try letters supported by the cursive set."),!1}},Dn=()=>{let e=Ot();for(;e;){if(Ue="nextQueued",_t(e)){yt();return}e=Ot()}Ue="current";const t=Ln(kt);_t(Lt[t]??Lt[0],t),yt()},qr=e=>{if(S||!l||$!==null)return;const t=Gt(d,e),n=l.getState(),r=tt(n);if(Ie(n)&&!Ar(t,n))return;if(Ie(n)&&(r!=null&&r.isDot)){e.preventDefault(),Er();return}l.beginAt(t)&&(e.preventDefault(),w=!1,$=e.pointerId,K=t,or(),ir(),m>.5&&fr(),d.setPointerCapture(e.pointerId),E())},Rr=e=>{if(!(S||!l||e.pointerId!==$)){if(e.preventDefault(),K=Gt(d,e),w){pn(),E();return}l.update(K),E()}},Or=e=>{!l||e.pointerId!==$||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,E())},Wr=e=>{e.pointerId===$&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,K=null,E())};d.addEventListener("pointerdown",qr);d.addEventListener("pointermove",Rr);d.addEventListener("pointerup",Or);d.addEventListener("pointercancel",Wr);se.addEventListener("click",$r);ct.addEventListener("input",()=>{Ke=Number(ct.value),on(),vt()});dt.addEventListener("change",()=>{an=dt.checked,vt()});ut.addEventListener("change",()=>{sn=ut.checked,vt()});rn.addEventListener("submit",e=>{e.preventDefault(),Ue="current",_t(Ze.value)});xt.addEventListener("click",Dn);Ze.addEventListener("input",()=>{oe.hidden||ln()});document.addEventListener("pointerdown",e=>{if(!me.open)return;const t=e.target;t instanceof Node&&me.contains(t)||(me.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(me.open=!1)});on();yt();Dn();
