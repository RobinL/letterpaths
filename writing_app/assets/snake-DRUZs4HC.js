import{M as _n,a as Sn,T as xn,f as kn,W as Dt,b as wn,c as bn,d as En,e as je,A as vn,g as qt,h as Pt}from"./shared-CvxpMkzH.js";import{a as An}from"./groups-Cr1poJ62.js";const Ot="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Wt="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",Dn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",et="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Pn="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",In="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",Mn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Tn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Ln="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Nn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",$n="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",Le="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Ae="/letterpaths/writing_app/assets/head-CeHhv_vT.png",Bt="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",Cn=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},ze=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Ut=150,Fn=44,Hn=180,It=.75,B=76,Mt=115,Rn=.25,Gt=.12,qn=.42,tt=10,z=260,Ze=510,On=220,Wn=700,Tt=6,P={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},q={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Bn={...q,height:q.height*(209/431/(160/435))},N={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Z=.78,ce=44,Un=700,Gn=800,Yn=18,X={width:200,height:106},J={width:69,height:49,anchorX:.5,anchorY:.62},Re={width:128,height:141,anchorX:.5,anchorY:1},Xn=[Mn,Tn,Ln,Nn],gt=document.querySelector("#app");if(!gt)throw new Error("Missing #app element for snake app.");Cn();gt.innerHTML=`
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
                    min="${_n}"
                    max="${Sn}"
                    step="${xn}"
                    value="${Ut}"
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
            <form class="writing-app__success-form" id="custom-word-form">
              <label class="writing-app__success-label" for="custom-word-input">Custom word</label>
              <input
                class="writing-app__success-input"
                id="custom-word-input"
                type="text"
                autocomplete="off"
                autocapitalize="off"
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
`;gt.style.setProperty("--snake-board-image",`url("${Dn}")`);const Yt=document.querySelector("#word-label"),Xt=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),ne=document.querySelector("#show-me-button"),ge=document.querySelector("#settings-menu"),nt=document.querySelector("#tolerance-slider"),Kt=document.querySelector("#tolerance-value"),rt=document.querySelector("#include-initial-lead-in"),at=document.querySelector("#include-final-lead-out"),Vt=document.querySelector("#success-overlay"),jt=document.querySelector("#custom-word-form"),Ye=document.querySelector("#custom-word-input"),re=document.querySelector("#custom-word-error"),ft=document.querySelector("#next-word-button");if(!Yt||!Xt||!d||!ne||!ge||!nt||!Kt||!rt||!at||!Vt||!jt||!Ye||!re||!ft)throw new Error("Missing elements for snake app.");let ht=-1,st="",ot=null,l=null,C=null,G=null,Qe=!1,fe=[],qe=[],he=[],Oe=[],H=null,ye=null,_=!1,We=Ut,zt=!0,Zt=!0,ae=[],Xe=[],I=[],_e=[],Se=null,S=1,Q=null,Be=1600,it=900,yt=0,m=null,xe=[],Ne=null,ee=null,$e=null,mt=[],O=null,ue=null,Ke=new Map,L=null,Ce=null,K=null,Fe=null,h=[],b=0,ke=0,j=null,_t=0,y=0,E=0,V=null,M=null,$=0,R=null,x=!1,v=!1,we=0,De=[],Ue=new Set,me=[],W="hidden",be=null,te=null,Lt=0,D=null,k=!1,Te=null,de=[],Nt=!1,lt=-1,pe=Number.POSITIVE_INFINITY;const Qt=()=>{Kt.textContent=`${We}px`},St=()=>{st&&hn(st,ht)},Jt=()=>{re.hidden=!0,re.textContent=""},$t=e=>{re.hidden=!1,re.textContent=e},en=e=>e.trim().replace(/\s+/g," ").toLowerCase(),Kn=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(en).filter(t=>t.length>0)},ct=Kn();let He=0;const dt=()=>{ft.textContent=He<ct.length?"Next queued word":"Next random word"},Ct=()=>{if(He>=ct.length)return null;const e=ct[He];return He+=1,e??null},tn=()=>Te||(Te=Xn.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Gt,t}),Te),Vn=()=>{Nt||(tn().forEach(e=>{e.load()}),Nt=!0)},jn=()=>{const e=tn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Gt,de.push(r),r.addEventListener("ended",()=>{de=de.filter(a=>a!==r)}),r.addEventListener("error",()=>{de=de.filter(a=>a!==r)}),r.play().catch(()=>{})},Ve=()=>{const e=S>0?S-1:-1,t=e>=0?I[e]:null;lt=e,pe=t?t.startDistance+B:Number.POSITIVE_INFINITY},zn=e=>{if(!e.isPenDown||_||x||v||k)return;const t=S>0?S-1:-1,n=t>=0?I[t]:null;if(!n){pe=Number.POSITIVE_INFINITY,lt=t;return}t!==lt&&Ve();const r=Ee(e);let a=!1;for(;r>=pe&&pe<=n.endDistance;)Math.random()<qn&&(a=!0),pe+=B;a&&jn()},Pe=()=>{const e=_;Xe.forEach(t=>{const n=ae[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=S;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),Xt.textContent=ae.length===0?"Nice tracing.":"All the fruit is collected."},se=e=>{Vt.hidden=!e},oe=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},le=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Zn=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ie=()=>{V!==null&&(cancelAnimationFrame(V),V=null)},Qn=()=>{if(Ie(),Math.abs(y-E)<.5){y=E,T();return}let e=null;const t=n=>{if(e===null){e=n,V=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*Wn,s=E-y;if(Math.abs(s)<=a){y=E,V=null,T(),nn();return}y+=Math.sign(s)*a,T(),V=requestAnimationFrame(t)};V=requestAnimationFrame(t)},Jn=e=>{const t=Math.max(0,e);Math.abs(t-E)<.5||(E=t,Qn())},er=()=>{Ie(),E=y,M=b,$=y},nn=()=>{if(!k||C===null||!G||!l||y>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(k=!1,M=b,$=y,l.update(G),A(),!0):!1},tr=()=>{if(M===null)return;const e=Math.max(0,b-M),t=Math.max(0,$-e);if(Math.abs(t-y)<.5){t<=.5&&(y=0,E=0,M=null,$=0);return}y=t,E=t,t<=.5&&(y=0,E=0,M=null,$=0)},xt=e=>(m==null?void 0:m.strokes[e.activeStrokeIndex])??null,nr=e=>xe[e.activeStrokeIndex]??null,rn=e=>{const t=m==null?void 0:m.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ee=e=>{var n;if(!m)return 0;if(e.status==="complete")return yt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=m.strokes[r])==null?void 0:n.totalLength)??0;return t+rn(e)},ve=e=>{var t;return((t=nr(e))==null?void 0:t.deferred)===!0},kt=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},an=e=>{const t=m==null?void 0:m.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},sn=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=xe[t];if(!(!n||n.deferred))return an(t)}return null},rr=e=>{if(ve(e)){const n=sn(e);if(n)return n}const t=[...h].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:Zn(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},wt=e=>{var t;return _||x||v||e.status==="complete"||!ve(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=xt(e))==null?void 0:t.isDot)===!0}},ar=e=>{if(!ue)return;const t=wt(e);if(!t){ue.style.opacity="0";return}if(t.isDot){ue.style.opacity="0";return}bt(ue,{point:t.point,tangent:t.tangent,angle:le(t.tangent)},{isDot:!1,headHref:Ae,travelledDistance:rn(e)})},bt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Ae),U(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},P.width*Z,P.height*Z,P.anchorX,P.anchorY,P.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const f=kt(n.travelledDistance??Number.POSITIVE_INFINITY,1,ce);if(f.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*ce,y:t.point.y-t.tangent.y*ce},w={x:t.point.x-t.tangent.x*ce*2,y:t.point.y-t.tangent.y*ce*2};a&&c&&U(a,c,{x:p.x,y:p.y,angle:t.angle,visible:!0},q.width*Z,q.height*Z,q.anchorX,q.anchorY,q.rotationOffset),s&&u&&f.showTail?U(s,u,{x:w.x,y:w.y,angle:t.angle,visible:!0},N.width*Z,N.height*Z,N.anchorX,N.anchorY,N.rotationOffset):s&&(s.style.opacity="0")},Ft=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${Bt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Ot}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Ae}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,ie=()=>{W="hidden",be=null,te=null,L&&(L.style.opacity="0",L.classList.remove("writing-app__dot-snake--waiting")),K&&(K.style.opacity="0")},sr=e=>({x:e.x,y:e.y-Yn}),or=e=>({x:e.x,y:e.y+8}),on=(e=performance.now())=>{if(W==="hidden"||!te)return null;const t=or(te),n=sr(te);if(W==="waiting")return{snakePoint:t,snakeHref:Le,snakeWobble:!0};if(W==="eagle_in"){const i=Math.max(0,Math.min(1,(e-Lt)/Un)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:Le,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+X.height)*c},eagleHref:et,eagleWidth:X.width,eagleHeight:X.height}}if(W==="eagle_stand")return{snakePoint:t,snakeHref:Le,snakeWobble:!1,eaglePoint:n,eagleHref:Pn,eagleWidth:Re.width,eagleHeight:Re.height};const r=Math.max(0,Math.min(1,(e-Lt)/Gn)),a=1-(1-r)*(1-r),s={x:n.x+(Be+X.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+X.height*.6},snakeHref:$n,snakeWobble:!1,eaglePoint:s,eagleHref:et,eagleWidth:X.width,eagleHeight:X.height}},ir=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){ie(),A();return}if(be!==null&&e.activeStrokeIndex===be&&((t=xt(e))!=null&&t.isDot)){l.beginAt(e.cursorPoint);const n=l.getState();gn(Ee(n)),cn(n)}ie(),A()},lr=e=>{const t=wt(e);if(!(t!=null&&t.isDot)){ie();return}be!==t.strokeIndex?(ie(),be=t.strokeIndex,te=t.point,W="waiting"):W==="waiting"&&(te=t.point)},cr=(e=performance.now())=>{if(!L||!Ce||!K||!Fe)return;const t=on(e);if(!t){L.style.opacity="0",L.classList.remove("writing-app__dot-snake--waiting"),K.style.opacity="0";return}if(L.style.opacity="1",L.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ce.setAttribute("href",t.snakeHref),U(L,Ce,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},J.width,J.height,J.anchorX,J.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){K.style.opacity="0";return}Fe.setAttribute("href",t.eagleHref),U(K,Fe,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Re.anchorX,Re.anchorY,0)},dr=(e,t)=>{const n=wt(t);if(!n)return!1;if(n.isDot){if(W!=="waiting")return!1;const a=on();if(!a)return!1;const s=Math.max(J.width,J.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,P.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},ur=e=>{e.completedStrokes.forEach(t=>{if(Ue.has(t))return;Ue.add(t);const n=xe[t],r=m==null?void 0:m.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=an(t);a&&De.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:le(a.tangent)})})},pr=()=>{Ke.forEach((e,t)=>{const n=De.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}bt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},Et=()=>{Ke.forEach(e=>{e.style.opacity="0"})},gr=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},ln=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return gr(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},fr=e=>{const t=I[e];if(!t||!m)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=ln(m,n),a=oe({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:oe({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},hr=()=>{S=Math.min(S+1,I.length),Se=S-1<_e.length?S-1:null,fn(),Pe(),Ve()},cn=e=>{if(_||x||v||k||I.length<=S)return!1;const t=S-1,n=I[t];return!n||Ee(e)<n.endDistance-8?!1:(k=!0,M=null,$=0,j=n.endDistance,D=fr(t+1),D&&(ke=le(D),Ge(n.endPoint,D,!0)),hr(),l==null||l.end(),un(),A(),!0)},yr=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/Hn));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),f=ln(e,u);return{x:f.x,y:f.y,pathDistance:u,emoji:ze[(r+c)%ze.length]??ze[0],captured:!1,groupIndex:r}})}),dn=()=>{S=I.length>0?1:0,Se=_e.length>0?0:null,ae.forEach(e=>{e.captured=!1}),Xe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),fn(),Pe()},vt=()=>{const e=Math.max(3,Math.min(tt,Math.floor(yt/Mt)));return Math.min(e,1+Math.floor(b/Mt))},un=()=>{if(_||x||v){M=null,$=0;return}if(!k)return;const e=kt(b,vt(),B).bodyCount;Jn((e+1)*B)},U=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},Je=e=>{const t=h[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(h.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<h.length;r+=1){const a=h[r-1],s=h[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,f=a.y+(s.y-a.y)*c;return{x:u,y:f,angle:le({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...h[h.length-1]??t,distance:e}},pn=()=>{ee==null||ee.style.setProperty("opacity","0"),O==null||O.style.setProperty("opacity","0"),mt.forEach(e=>{e.style.opacity="0"})},T=(e=performance.now())=>{if(!Ne||!ee||!$e||!O||h.length===0)return;if(_||v){Ne.style.opacity="0";return}Ne.style.opacity="1";const t=x?we:vt(),n=x?0:y,r=kt(b,t,B),a=r.bodyCount,s=Je(b);$e.setAttribute("href",e<_t?In:Ae),U(ee,$e,{...s,angle:ke},P.width,P.height,P.anchorX,P.anchorY,P.rotationOffset),mt.forEach((f,p)=>{if(p>=a){f.style.opacity="0";return}const w=f.querySelector("image");if(!w)return;const Y=Math.max(0,(p+1)*B-n);if(Y<=Tt){f.style.opacity="0";return}const Me=Je(Math.max(0,b-Y)),o=w.getAttribute("href")===Wt?Bn:q;U(f,w,Me,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=O.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*B-n);if(!r.showTail||c<=Tt){O.style.opacity="0";return}const u=Je(Math.max(0,b-c));U(O,i,u,N.width,N.height,N.anchorX,N.anchorY,N.rotationOffset)},At=(e,t,n=!0)=>{const r=oe(t);ke=le(r),h=[{x:e.x,y:e.y,angle:ke,distance:0,visible:n}],b=0,_t=0,y=0,E=0,M=null,$=0,j=null,D=null,k=!1,v=!1,x=!1,we=0,Ie(),R!==null&&(cancelAnimationFrame(R),R=null),T()},Ge=(e,t,n)=>{const r=oe(t),a=le(r);ke=a;const s=h[h.length-1];if(!s){At(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?h[h.length-1]={...s,x:e.x,y:e.y,angle:a}:(h.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),b=s.distance+.001),T();return}b=s.distance+i,h.push({x:e.x,y:e.y,angle:a,distance:b,visible:n}),tr(),T()},Ht=(e,t,n)=>{const r=oe(t),a=[];r.x>.001?a.push((Be+z-e.x)/r.x):r.x<-.001&&a.push((-z-e.x)/r.x),r.y>.001?a.push((it+z-e.y)/r.y):r.y<-.001&&a.push((-z-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Be,it)+z)+(n+2)*B+z},mr=(e,t)=>{if(x||v)return;Ie(),y=0,E=0,M=null,$=0,j=null,D=null,k=!1;const n=oe(t),r=performance.now();we=vt();const a=Ht(e,n,we);me=De.map(i=>({...i,travelDistance:Ht(i.point,i.tangent,0)})),x=!0,se(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*Ze);Ge({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),me.forEach(p=>{const w=Ke.get(p.strokeIndex);if(!w)return;const Y=Math.min(p.travelDistance,c*Ze);bt(w,{point:{x:p.point.x+p.tangent.x*Y,y:p.point.y+p.tangent.y*Y},tangent:p.tangent,angle:p.angle})});const f=me.every(p=>c*Ze>=p.travelDistance);if(u>=a&&f){x=!1,v=!0,R=null,pn(),Et(),se(!0);return}R=requestAnimationFrame(s)};R=requestAnimationFrame(s)},gn=e=>{let t=!1;ae.forEach((n,r)=>{if(n.captured||n.groupIndex>=S||e+.5<n.pathDistance)return;n.captured=!0;const a=Xe[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(_t=performance.now()+On,Pe(),T())},fn=()=>{if(!Q)return;const e=Se!==null?_e[Se]:void 0;if(!e){Q.classList.add("writing-app__boundary-star--hidden");return}Q.classList.remove("writing-app__boundary-star--hidden"),Q.setAttribute("x",`${e.x}`),Q.setAttribute("y",`${e.y}`)},_r=e=>{if(j!==null){if(Ee(e)+.5<j){T();return}j=null}const n=D!==null&&(k||e.isPenDown)&&D?D:e.cursorTangent;if(ve(e)){const r=sn(e),a=h[h.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&Ge(r.point,r.tangent,!0)}else Ge(e.cursorPoint,n,!0);D&&e.isPenDown&&!k&&(D=null),_||gn(Ee(e)),!_&&e.isPenDown&&(zn(e),cn(e))},ut=()=>{ye!==null&&(cancelAnimationFrame(ye),ye=null),_=!1,ne.disabled=!1,ne.textContent="Demo",he.forEach((e,t)=>{const n=Oe[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),H&&(H.style.opacity="0"),Pe(),T(),A()},Rt=()=>{l==null||l.reset(),C=null,G=null,se(!1),v=!1,x=!1,we=0,De=[],Ue=new Set,me=[],ie(),R!==null&&(cancelAnimationFrame(R),R=null),fe.forEach((t,n)=>{const r=qe[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ie(),y=0,E=0,M=null,$=0,j=null,D=null,k=!1;const e=l==null?void 0:l.getState();e?At(e.cursorPoint,e.cursorTangent,!0):pn(),Et(),dn(),Ve(),A()},A=()=>{Qe||(Qe=!0,requestAnimationFrame(()=>{Qe=!1,Sr()}))},Sr=()=>{if(!l)return;const e=l.getState();un(),ur(e),lr(e),cr(),ar(e),!x&&!v&&pr();const t=new Set(e.completedStrokes);if(fe.forEach((n,r)=>{const a=qe[r]??0;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!_&&!x&&!v&&!k?_r(e):T(),e.status==="complete"){if(!_&&!x&&!v){const n=rr(e);mr(n.point,n.tangent)}se(v);return}se(!1)},xr=()=>{if(!ot||_)return;Rt(),ut();const e=new vn(ot,{speed:1.7*It,penUpSpeed:2.1*It,deferredDelayMs:150});_=!0,ne.disabled=!0,ne.textContent="Demo...",Pe(),T();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(he.forEach((u,f)=>{const p=Oe[f]??.001;if(c.has(f)){u.style.strokeDashoffset="0";return}if(f===i.activeStrokeIndex){const w=p*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,w)}`;return}u.style.strokeDashoffset=`${p}`}),H&&(H.setAttribute("cx",i.point.x.toFixed(2)),H.setAttribute("cy",i.point.y.toFixed(2)),H.style.opacity=a<=e.totalDuration+Pt?"1":"0"),a<e.totalDuration+Pt){ye=requestAnimationFrame(n);return}ut(),Rt()};ye=requestAnimationFrame(n),A()},kr=(e,t,n,r)=>{Be=t,it=n;const a=bn(e);m=a,xe=e.strokes.filter(o=>o.type!=="lift"),yt=a.strokes.reduce((o,g)=>o+g.totalLength,0),I=An(a).groups,_e=I.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),Se=_e.length>0?0:null,S=I.length>0?1:0,l=new En(a,{startTolerance:We,hitTolerance:We}),C=null,ae=yr(a,I);const i=xe,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${je(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${je(o.curves)}"></path>`).join(""),f=i.map(o=>`<path class="writing-app__stroke-demo" d="${je(o.curves)}"></path>`).join(""),p=ae.map((o,g)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${g}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${Fn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),w=Array.from({length:tt},(o,g)=>{const F=tt-1-g,mn=Math.random()<Rn?Wt:Ot;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${F}"
      >
        <image
          href="${mn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),Y=i.map((o,g)=>o.deferred?g:null).filter(o=>o!==null).map(o=>Ft(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
          href="${Bt}"
          preserveAspectRatio="none"
        ></image>
      </g>
      ${w}
      <g
        class="writing-app__snake-segment writing-app__snake-head"
        id="snake-head"
      >
        <image
          id="snake-head-image"
          href="${Ae}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${p}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${Y}
    </g>
    ${Ft('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Le}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${et}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,fe=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),he=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Xe=Array.from(d.querySelectorAll(".writing-app__fruit")),Q=d.querySelector("#waypoint-star"),Ne=d.querySelector("#trace-snake"),ee=d.querySelector("#snake-head"),$e=d.querySelector("#snake-head-image"),O=d.querySelector("#snake-tail"),mt=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,g)=>Number(o.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),ue=d.querySelector("#deferred-head"),Ke=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),L=d.querySelector("#dot-snake"),Ce=d.querySelector("#dot-snake-image"),K=d.querySelector("#dot-eagle"),Fe=d.querySelector("#dot-eagle-image"),H=d.querySelector("#demo-nib"),qe=fe.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Oe=he.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),fe.forEach((o,g)=>{const F=qe[g]??.001;o.style.strokeDasharray=`${F} ${F}`,o.style.strokeDashoffset=`${F}`}),he.forEach((o,g)=>{const F=Oe[g]??.001;o.style.strokeDasharray=`${F} ${F}`,o.style.strokeDashoffset=`${F}`}),H&&(H.style.opacity="0");const Me=l.getState();At(Me.cursorPoint,Me.cursorTangent),De=[],Ue=new Set,me=[],ie(),Et(),dn(),Ve(),se(!1),A()},hn=(e,t=-1)=>{ut();const n=wn(e,{keepInitialLeadIn:zt,keepFinalLeadOut:Zt});st=e,ht=t,Yt.textContent=e,Ye.value=e,ot=n.path,kr(n.path,n.width,n.height,n.offsetY)},pt=(e,t=-1)=>{const n=en(e);if(!n)return $t("Type a word first."),!1;try{return hn(n,t),Jt(),!0}catch{return $t("Couldn't build that word. Try letters supported by the cursive set."),!1}},yn=()=>{let e=Ct();for(;e;){if(pt(e)){dt();return}e=Ct()}const t=kn(ht);pt(Dt[t]??Dt[0],t),dt()},wr=e=>{if(_||!l||C!==null)return;const t=qt(d,e),n=l.getState(),r=xt(n);if(ve(n)&&!dr(t,n))return;if(ve(n)&&(r!=null&&r.isDot)){e.preventDefault(),ir();return}l.beginAt(t)&&(e.preventDefault(),k=!1,C=e.pointerId,G=t,Vn(),y>.5&&er(),d.setPointerCapture(e.pointerId),A())},br=e=>{if(!(_||!l||e.pointerId!==C)){if(e.preventDefault(),G=qt(d,e),k){nn(),A();return}l.update(G),A()}},Er=e=>{!l||e.pointerId!==C||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,G=null,A())},vr=e=>{e.pointerId===C&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,G=null,A())};d.addEventListener("pointerdown",wr);d.addEventListener("pointermove",br);d.addEventListener("pointerup",Er);d.addEventListener("pointercancel",vr);ne.addEventListener("click",xr);nt.addEventListener("input",()=>{We=Number(nt.value),Qt(),St()});rt.addEventListener("change",()=>{zt=rt.checked,St()});at.addEventListener("change",()=>{Zt=at.checked,St()});jt.addEventListener("submit",e=>{e.preventDefault(),pt(Ye.value)});ft.addEventListener("click",yn);Ye.addEventListener("input",()=>{re.hidden||Jt()});document.addEventListener("pointerdown",e=>{if(!ge.open)return;const t=e.target;t instanceof Node&&ge.contains(t)||(ge.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(ge.open=!1)});Qt();dt();yn();
