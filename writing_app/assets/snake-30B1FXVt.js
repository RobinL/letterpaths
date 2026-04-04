import{M as bn,a as En,T as vn,f as An,W as It,b as Dn,c as Pn,d as In,e as Ze,A as Mn,g as Bt,h as Mt}from"./shared-CvxpMkzH.js";import{a as Tn}from"./groups-Cr1poJ62.js";const Ut="/letterpaths/writing_app/assets/body-CgvmrS6c.png",Gt="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",Ln="/letterpaths/writing_app/assets/background-BdaS-6aw.png",nt="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Nn="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",Cn="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",$n="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",Fn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",Hn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Rn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",qn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",On="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",Ce="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Pe="/letterpaths/writing_app/assets/head-CeHhv_vT.png",Yt="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",Wn=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},Qe=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Kt=150,Bn=44,Un=180,Tt=.75,B=76,Lt=115,Gn=.25,Xt=.3,Vt=.12,Yn=.42,rt=10,z=260,Je=510,Kn=220,Xn=700,Nt=6,P={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},q={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Vn={...q,height:q.height*(209/431/(160/435))},N={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Z=.78,de=44,jn=700,zn=800,Zn=18,K={width:200,height:106},ee={width:69,height:49,anchorX:.5,anchorY:.62},Oe={width:128,height:141,anchorX:.5,anchorY:1},Qn=[Fn,Hn,Rn,qn],ht=document.querySelector("#app");if(!ht)throw new Error("Missing #app element for snake app.");Wn();ht.innerHTML=`
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
                    min="${bn}"
                    max="${En}"
                    step="${vn}"
                    value="${Kt}"
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
`;ht.style.setProperty("--snake-board-image",`url("${Ln}")`);const jt=document.querySelector("#word-label"),zt=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),re=document.querySelector("#show-me-button"),he=document.querySelector("#settings-menu"),at=document.querySelector("#tolerance-slider"),Zt=document.querySelector("#tolerance-value"),st=document.querySelector("#include-initial-lead-in"),ot=document.querySelector("#include-final-lead-out"),Qt=document.querySelector("#success-overlay"),Jt=document.querySelector("#custom-word-form"),Xe=document.querySelector("#custom-word-input"),ae=document.querySelector("#custom-word-error"),yt=document.querySelector("#next-word-button");if(!jt||!zt||!d||!re||!he||!at||!Zt||!st||!ot||!Qt||!Jt||!Xe||!ae||!yt)throw new Error("Missing elements for snake app.");let mt=-1,it="",lt=null,l=null,$=null,G=null,et=!1,ye=[],We=[],me=[],Be=[],H=null,_e=null,_=!1,Ue=Kt,en=!0,tn=!0,se=[],Ve=[],I=[],xe=[],ke=null,S=1,J=null,Ge=1600,ct=900,_t=0,m=null,we=[],$e=null,te=null,Fe=null,St=[],O=null,ge=null,je=new Map,L=null,He=null,X=null,Re=null,h=[],b=0,be=0,j=null,xt=0,y=0,E=0,V=null,M=null,C=0,R=null,x=!1,v=!1,Ee=0,Ie=[],Ye=new Set,Se=[],W="hidden",ve=null,ne=null,Ct=0,D=null,k=!1,Q=null,ue=[],$t=!1,Ne=null,pe=[],Ft=!1,dt=-1,fe=Number.POSITIVE_INFINITY;const nn=()=>{Zt.textContent=`${Ue}px`},kt=()=>{it&&xn(it,mt)},rn=()=>{ae.hidden=!0,ae.textContent=""},Ht=e=>{ae.hidden=!1,ae.textContent=e},an=e=>e.trim().replace(/\s+/g," ").toLowerCase(),Jn=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(an).filter(t=>t.length>0)},ut=Jn();let qe=0;const pt=()=>{yt.textContent=qe<ut.length?"Next queued word":"Next random word"},Rt=()=>{if(qe>=ut.length)return null;const e=ut[qe];return qe+=1,e??null},sn=()=>Ne||(Ne=Qn.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Vt,t}),Ne),on=()=>Q||(Q=new Audio($n),Q.preload="auto",Q.volume=Xt,Q),er=()=>{$t||(on().load(),$t=!0)},tr=()=>{Ft||(sn().forEach(e=>{e.load()}),Ft=!0)},nr=()=>{const e=on(),t=e.currentSrc||e.src;if(!t)return;const n=new Audio(t);n.preload="auto",n.currentTime=0,n.volume=Xt,ue.push(n),n.addEventListener("ended",()=>{ue=ue.filter(r=>r!==n)}),n.addEventListener("error",()=>{ue=ue.filter(r=>r!==n)}),n.play().catch(()=>{})},rr=()=>{const e=sn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Vt,pe.push(r),r.addEventListener("ended",()=>{pe=pe.filter(a=>a!==r)}),r.addEventListener("error",()=>{pe=pe.filter(a=>a!==r)}),r.play().catch(()=>{})},ze=()=>{const e=S>0?S-1:-1,t=e>=0?I[e]:null;dt=e,fe=t?t.startDistance+B:Number.POSITIVE_INFINITY},ar=e=>{if(!e.isPenDown||_||x||v||k)return;const t=S>0?S-1:-1,n=t>=0?I[t]:null;if(!n){fe=Number.POSITIVE_INFINITY,dt=t;return}t!==dt&&ze();const r=Ae(e);let a=!1;for(;r>=fe&&fe<=n.endDistance;)Math.random()<Yn&&(a=!0),fe+=B;a&&rr()},Me=()=>{const e=_;Ve.forEach(t=>{const n=se[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=S;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),zt.textContent=se.length===0?"Nice tracing.":"All the fruit is collected."},oe=e=>{Qt.hidden=!e},ie=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},ce=e=>Math.atan2(e.y,e.x)*(180/Math.PI),sr=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Te=()=>{V!==null&&(cancelAnimationFrame(V),V=null)},or=()=>{if(Te(),Math.abs(y-E)<.5){y=E,T();return}let e=null;const t=n=>{if(e===null){e=n,V=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*Xn,s=E-y;if(Math.abs(s)<=a){y=E,V=null,T(),ln();return}y+=Math.sign(s)*a,T(),V=requestAnimationFrame(t)};V=requestAnimationFrame(t)},ir=e=>{const t=Math.max(0,e);Math.abs(t-E)<.5||(E=t,or())},lr=()=>{Te(),E=y,M=b,C=y},ln=()=>{if(!k||$===null||!G||!l||y>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(k=!1,M=b,C=y,l.update(G),A(),!0):!1},cr=()=>{if(M===null)return;const e=Math.max(0,b-M),t=Math.max(0,C-e);if(Math.abs(t-y)<.5){t<=.5&&(y=0,E=0,M=null,C=0);return}y=t,E=t,t<=.5&&(y=0,E=0,M=null,C=0)},wt=e=>(m==null?void 0:m.strokes[e.activeStrokeIndex])??null,dr=e=>we[e.activeStrokeIndex]??null,cn=e=>{const t=m==null?void 0:m.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ae=e=>{var n;if(!m)return 0;if(e.status==="complete")return _t;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=m.strokes[r])==null?void 0:n.totalLength)??0;return t+cn(e)},De=e=>{var t;return((t=dr(e))==null?void 0:t.deferred)===!0},bt=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},dn=e=>{const t=m==null?void 0:m.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},un=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=we[t];if(!(!n||n.deferred))return dn(t)}return null},ur=e=>{if(De(e)){const n=un(e);if(n)return n}const t=[...h].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:sr(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},Et=e=>{var t;return _||x||v||e.status==="complete"||!De(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=wt(e))==null?void 0:t.isDot)===!0}},pr=e=>{if(!ge)return;const t=Et(e);if(!t){ge.style.opacity="0";return}if(t.isDot){ge.style.opacity="0";return}vt(ge,{point:t.point,tangent:t.tangent,angle:ce(t.tangent)},{isDot:!1,headHref:Pe,travelledDistance:cn(e)})},vt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Pe),U(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},P.width*Z,P.height*Z,P.anchorX,P.anchorY,P.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const f=bt(n.travelledDistance??Number.POSITIVE_INFINITY,1,de);if(f.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*de,y:t.point.y-t.tangent.y*de},w={x:t.point.x-t.tangent.x*de*2,y:t.point.y-t.tangent.y*de*2};a&&c&&U(a,c,{x:p.x,y:p.y,angle:t.angle,visible:!0},q.width*Z,q.height*Z,q.anchorX,q.anchorY,q.rotationOffset),s&&u&&f.showTail?U(s,u,{x:w.x,y:w.y,angle:t.angle,visible:!0},N.width*Z,N.height*Z,N.anchorX,N.anchorY,N.rotationOffset):s&&(s.style.opacity="0")},qt=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${Yt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Ut}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Pe}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,le=()=>{W="hidden",ve=null,ne=null,L&&(L.style.opacity="0",L.classList.remove("writing-app__dot-snake--waiting")),X&&(X.style.opacity="0")},gr=e=>({x:e.x,y:e.y-Zn}),fr=e=>({x:e.x,y:e.y+8}),pn=(e=performance.now())=>{if(W==="hidden"||!ne)return null;const t=fr(ne),n=gr(ne);if(W==="waiting")return{snakePoint:t,snakeHref:Ce,snakeWobble:!0};if(W==="eagle_in"){const i=Math.max(0,Math.min(1,(e-Ct)/jn)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:Ce,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+K.height)*c},eagleHref:nt,eagleWidth:K.width,eagleHeight:K.height}}if(W==="eagle_stand")return{snakePoint:t,snakeHref:Ce,snakeWobble:!1,eaglePoint:n,eagleHref:Nn,eagleWidth:Oe.width,eagleHeight:Oe.height};const r=Math.max(0,Math.min(1,(e-Ct)/zn)),a=1-(1-r)*(1-r),s={x:n.x+(Ge+K.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+K.height*.6},snakeHref:On,snakeWobble:!1,eaglePoint:s,eagleHref:nt,eagleWidth:K.width,eagleHeight:K.height}},hr=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){le(),A();return}if(ve!==null&&e.activeStrokeIndex===ve&&((t=wt(e))!=null&&t.isDot)){l.beginAt(e.cursorPoint);const n=l.getState();_n(Ae(n)),fn(n)}le(),A()},yr=e=>{const t=Et(e);if(!(t!=null&&t.isDot)){le();return}ve!==t.strokeIndex?(le(),ve=t.strokeIndex,ne=t.point,W="waiting"):W==="waiting"&&(ne=t.point)},mr=(e=performance.now())=>{if(!L||!He||!X||!Re)return;const t=pn(e);if(!t){L.style.opacity="0",L.classList.remove("writing-app__dot-snake--waiting"),X.style.opacity="0";return}if(L.style.opacity="1",L.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),He.setAttribute("href",t.snakeHref),U(L,He,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},ee.width,ee.height,ee.anchorX,ee.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){X.style.opacity="0";return}Re.setAttribute("href",t.eagleHref),U(X,Re,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Oe.anchorX,Oe.anchorY,0)},_r=(e,t)=>{const n=Et(t);if(!n)return!1;if(n.isDot){if(W!=="waiting")return!1;const a=pn();if(!a)return!1;const s=Math.max(ee.width,ee.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,P.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Sr=e=>{e.completedStrokes.forEach(t=>{if(Ye.has(t))return;Ye.add(t);const n=we[t],r=m==null?void 0:m.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=dn(t);a&&Ie.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:ce(a.tangent)})})},xr=()=>{je.forEach((e,t)=>{const n=Ie.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}vt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},At=()=>{je.forEach(e=>{e.style.opacity="0"})},kr=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},gn=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return kr(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},wr=e=>{const t=I[e];if(!t||!m)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=gn(m,n),a=ie({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:ie({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},br=()=>{S=Math.min(S+1,I.length),ke=S-1<xe.length?S-1:null,Sn(),Me(),ze()},fn=e=>{if(_||x||v||k||I.length<=S)return!1;const t=S-1,n=I[t];return!n||Ae(e)<n.endDistance-8?!1:(k=!0,M=null,C=0,j=n.endDistance,D=wr(t+1),D&&(be=ce(D),Ke(n.endPoint,D,!0)),br(),l==null||l.end(),yn(),A(),!0)},Er=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/Un));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),f=gn(e,u);return{x:f.x,y:f.y,pathDistance:u,emoji:Qe[(r+c)%Qe.length]??Qe[0],captured:!1,groupIndex:r}})}),hn=()=>{S=I.length>0?1:0,ke=xe.length>0?0:null,se.forEach(e=>{e.captured=!1}),Ve.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),Sn(),Me()},Dt=()=>{const e=Math.max(3,Math.min(rt,Math.floor(_t/Lt)));return Math.min(e,1+Math.floor(b/Lt))},yn=()=>{if(_||x||v){M=null,C=0;return}if(!k)return;const e=bt(b,Dt(),B).bodyCount;ir((e+1)*B)},U=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},tt=e=>{const t=h[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(h.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<h.length;r+=1){const a=h[r-1],s=h[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,f=a.y+(s.y-a.y)*c;return{x:u,y:f,angle:ce({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...h[h.length-1]??t,distance:e}},mn=()=>{te==null||te.style.setProperty("opacity","0"),O==null||O.style.setProperty("opacity","0"),St.forEach(e=>{e.style.opacity="0"})},T=(e=performance.now())=>{if(!$e||!te||!Fe||!O||h.length===0)return;if(_||v){$e.style.opacity="0";return}$e.style.opacity="1";const t=x?Ee:Dt(),n=x?0:y,r=bt(b,t,B),a=r.bodyCount,s=tt(b);Fe.setAttribute("href",e<xt?Cn:Pe),U(te,Fe,{...s,angle:be},P.width,P.height,P.anchorX,P.anchorY,P.rotationOffset),St.forEach((f,p)=>{if(p>=a){f.style.opacity="0";return}const w=f.querySelector("image");if(!w)return;const Y=Math.max(0,(p+1)*B-n);if(Y<=Nt){f.style.opacity="0";return}const Le=tt(Math.max(0,b-Y)),o=w.getAttribute("href")===Gt?Vn:q;U(f,w,Le,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=O.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*B-n);if(!r.showTail||c<=Nt){O.style.opacity="0";return}const u=tt(Math.max(0,b-c));U(O,i,u,N.width,N.height,N.anchorX,N.anchorY,N.rotationOffset)},Pt=(e,t,n=!0)=>{const r=ie(t);be=ce(r),h=[{x:e.x,y:e.y,angle:be,distance:0,visible:n}],b=0,xt=0,y=0,E=0,M=null,C=0,j=null,D=null,k=!1,v=!1,x=!1,Ee=0,Te(),R!==null&&(cancelAnimationFrame(R),R=null),T()},Ke=(e,t,n)=>{const r=ie(t),a=ce(r);be=a;const s=h[h.length-1];if(!s){Pt(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?h[h.length-1]={...s,x:e.x,y:e.y,angle:a}:(h.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),b=s.distance+.001),T();return}b=s.distance+i,h.push({x:e.x,y:e.y,angle:a,distance:b,visible:n}),cr(),T()},Ot=(e,t,n)=>{const r=ie(t),a=[];r.x>.001?a.push((Ge+z-e.x)/r.x):r.x<-.001&&a.push((-z-e.x)/r.x),r.y>.001?a.push((ct+z-e.y)/r.y):r.y<-.001&&a.push((-z-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Ge,ct)+z)+(n+2)*B+z},vr=(e,t)=>{if(x||v)return;Te(),y=0,E=0,M=null,C=0,j=null,D=null,k=!1;const n=ie(t),r=performance.now();Ee=Dt();const a=Ot(e,n,Ee);Se=Ie.map(i=>({...i,travelDistance:Ot(i.point,i.tangent,0)})),x=!0,oe(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*Je);Ke({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),Se.forEach(p=>{const w=je.get(p.strokeIndex);if(!w)return;const Y=Math.min(p.travelDistance,c*Je);vt(w,{point:{x:p.point.x+p.tangent.x*Y,y:p.point.y+p.tangent.y*Y},tangent:p.tangent,angle:p.angle})});const f=Se.every(p=>c*Je>=p.travelDistance);if(u>=a&&f){x=!1,v=!0,R=null,mn(),At(),oe(!0);return}R=requestAnimationFrame(s)};R=requestAnimationFrame(s)},_n=e=>{let t=!1;se.forEach((n,r)=>{if(n.captured||n.groupIndex>=S||e+.5<n.pathDistance)return;n.captured=!0;const a=Ve[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(xt=performance.now()+Kn,nr(),Me(),T())},Sn=()=>{if(!J)return;const e=ke!==null?xe[ke]:void 0;if(!e){J.classList.add("writing-app__boundary-star--hidden");return}J.classList.remove("writing-app__boundary-star--hidden"),J.setAttribute("x",`${e.x}`),J.setAttribute("y",`${e.y}`)},Ar=e=>{if(j!==null){if(Ae(e)+.5<j){T();return}j=null}const n=D!==null&&(k||e.isPenDown)&&D?D:e.cursorTangent;if(De(e)){const r=un(e),a=h[h.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&Ke(r.point,r.tangent,!0)}else Ke(e.cursorPoint,n,!0);D&&e.isPenDown&&!k&&(D=null),_||_n(Ae(e)),!_&&e.isPenDown&&(ar(e),fn(e))},gt=()=>{_e!==null&&(cancelAnimationFrame(_e),_e=null),_=!1,re.disabled=!1,re.textContent="Demo",me.forEach((e,t)=>{const n=Be[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),H&&(H.style.opacity="0"),Me(),T(),A()},Wt=()=>{l==null||l.reset(),$=null,G=null,oe(!1),v=!1,x=!1,Ee=0,Ie=[],Ye=new Set,Se=[],le(),R!==null&&(cancelAnimationFrame(R),R=null),ye.forEach((t,n)=>{const r=We[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Te(),y=0,E=0,M=null,C=0,j=null,D=null,k=!1;const e=l==null?void 0:l.getState();e?Pt(e.cursorPoint,e.cursorTangent,!0):mn(),At(),hn(),ze(),A()},A=()=>{et||(et=!0,requestAnimationFrame(()=>{et=!1,Dr()}))},Dr=()=>{if(!l)return;const e=l.getState();yn(),Sr(e),yr(e),mr(),pr(e),!x&&!v&&xr();const t=new Set(e.completedStrokes);if(ye.forEach((n,r)=>{const a=We[r]??0;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!_&&!x&&!v&&!k?Ar(e):T(),e.status==="complete"){if(!_&&!x&&!v){const n=ur(e);vr(n.point,n.tangent)}oe(v);return}oe(!1)},Pr=()=>{if(!lt||_)return;Wt(),gt();const e=new Mn(lt,{speed:1.7*Tt,penUpSpeed:2.1*Tt,deferredDelayMs:150});_=!0,re.disabled=!0,re.textContent="Demo...",Me(),T();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(me.forEach((u,f)=>{const p=Be[f]??.001;if(c.has(f)){u.style.strokeDashoffset="0";return}if(f===i.activeStrokeIndex){const w=p*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,w)}`;return}u.style.strokeDashoffset=`${p}`}),H&&(H.setAttribute("cx",i.point.x.toFixed(2)),H.setAttribute("cy",i.point.y.toFixed(2)),H.style.opacity=a<=e.totalDuration+Mt?"1":"0"),a<e.totalDuration+Mt){_e=requestAnimationFrame(n);return}gt(),Wt()};_e=requestAnimationFrame(n),A()},Ir=(e,t,n,r)=>{Ge=t,ct=n;const a=Pn(e);m=a,we=e.strokes.filter(o=>o.type!=="lift"),_t=a.strokes.reduce((o,g)=>o+g.totalLength,0),I=Tn(a).groups,xe=I.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),ke=xe.length>0?0:null,S=I.length>0?1:0,l=new In(a,{startTolerance:Ue,hitTolerance:Ue}),$=null,se=Er(a,I);const i=we,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${Ze(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${Ze(o.curves)}"></path>`).join(""),f=i.map(o=>`<path class="writing-app__stroke-demo" d="${Ze(o.curves)}"></path>`).join(""),p=se.map((o,g)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${g}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${Bn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),w=Array.from({length:rt},(o,g)=>{const F=rt-1-g,wn=Math.random()<Gn?Gt:Ut;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${F}"
      >
        <image
          href="${wn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),Y=i.map((o,g)=>o.deferred?g:null).filter(o=>o!==null).map(o=>qt(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
          href="${Yt}"
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
          href="${Pe}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${p}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${Y}
    </g>
    ${qt('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Ce}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${nt}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,ye=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),me=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Ve=Array.from(d.querySelectorAll(".writing-app__fruit")),J=d.querySelector("#waypoint-star"),$e=d.querySelector("#trace-snake"),te=d.querySelector("#snake-head"),Fe=d.querySelector("#snake-head-image"),O=d.querySelector("#snake-tail"),St=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,g)=>Number(o.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),ge=d.querySelector("#deferred-head"),je=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),L=d.querySelector("#dot-snake"),He=d.querySelector("#dot-snake-image"),X=d.querySelector("#dot-eagle"),Re=d.querySelector("#dot-eagle-image"),H=d.querySelector("#demo-nib"),We=ye.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),Be=me.map(o=>{const g=o.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),ye.forEach((o,g)=>{const F=We[g]??.001;o.style.strokeDasharray=`${F} ${F}`,o.style.strokeDashoffset=`${F}`}),me.forEach((o,g)=>{const F=Be[g]??.001;o.style.strokeDasharray=`${F} ${F}`,o.style.strokeDashoffset=`${F}`}),H&&(H.style.opacity="0");const Le=l.getState();Pt(Le.cursorPoint,Le.cursorTangent),Ie=[],Ye=new Set,Se=[],le(),At(),hn(),ze(),oe(!1),A()},xn=(e,t=-1)=>{gt();const n=Dn(e,{keepInitialLeadIn:en,keepFinalLeadOut:tn});it=e,mt=t,jt.textContent=e,Xe.value=e,lt=n.path,Ir(n.path,n.width,n.height,n.offsetY)},ft=(e,t=-1)=>{const n=an(e);if(!n)return Ht("Type a word first."),!1;try{return xn(n,t),rn(),!0}catch{return Ht("Couldn't build that word. Try letters supported by the cursive set."),!1}},kn=()=>{let e=Rt();for(;e;){if(ft(e)){pt();return}e=Rt()}const t=An(mt);ft(It[t]??It[0],t),pt()},Mr=e=>{if(_||!l||$!==null)return;const t=Bt(d,e),n=l.getState(),r=wt(n);if(De(n)&&!_r(t,n))return;if(De(n)&&(r!=null&&r.isDot)){e.preventDefault(),hr();return}l.beginAt(t)&&(e.preventDefault(),k=!1,$=e.pointerId,G=t,er(),tr(),y>.5&&lr(),d.setPointerCapture(e.pointerId),A())},Tr=e=>{if(!(_||!l||e.pointerId!==$)){if(e.preventDefault(),G=Bt(d,e),k){ln(),A();return}l.update(G),A()}},Lr=e=>{!l||e.pointerId!==$||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,G=null,A())},Nr=e=>{e.pointerId===$&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),$=null,G=null,A())};d.addEventListener("pointerdown",Mr);d.addEventListener("pointermove",Tr);d.addEventListener("pointerup",Lr);d.addEventListener("pointercancel",Nr);re.addEventListener("click",Pr);at.addEventListener("input",()=>{Ue=Number(at.value),nn(),kt()});st.addEventListener("change",()=>{en=st.checked,kt()});ot.addEventListener("change",()=>{tn=ot.checked,kt()});Jt.addEventListener("submit",e=>{e.preventDefault(),ft(Xe.value)});yt.addEventListener("click",kn);Xe.addEventListener("input",()=>{ae.hidden||rn()});document.addEventListener("pointerdown",e=>{if(!he.open)return;const t=e.target;t instanceof Node&&he.contains(t)||(he.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(he.open=!1)});nn();pt();kn();
