import{f as an,W as yt,b as sn,c as on,d as ln,e as Xe,A as cn,g as vt,h as mt}from"./shared-n7GYFNh1.js";import{a as dn}from"./groups-Cr1poJ62.js";const Pt="/letterpaths/writing_app/assets/body-DDjZTdeu.png",Mt="/letterpaths/writing_app/assets/body_bulge-CHgMxuio.png",un="/letterpaths/writing_app/assets/background-BdaS-6aw.png",Je="/letterpaths/writing_app/assets/eagle_fly-DH3HgPCL.png",gn="/letterpaths/writing_app/assets/eagle_stand-DGP6P_VP.png",pn="/letterpaths/writing_app/assets/head_alt-vjLDS9b1.png",fn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",hn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",yn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",mn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",_n="/letterpaths/writing_app/assets/snake_facing_camera_angry-CFtVEFwY.png",Ne="/letterpaths/writing_app/assets/snake_facing_camera_happy-D-RY1-aU.png",ve="/letterpaths/writing_app/assets/head-7zYObEXI.png",It="/letterpaths/writing_app/assets/tail-q7Mcy-Q-.png",je=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],_t=150,Sn=44,xn=180,St=.75,Y=76,xt=115,kn=.25,Tt=.12,wn=.42,et=10,Q=260,ze=340,bn=220,En=700,kt=6,M={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},O={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Dn={...O,height:O.height*(209/431/(160/435))},$={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,ue=44,Ft=700,An=260,Nt=800,vn=18,X={width:200,height:106},te={width:69,height:49,anchorX:.5,anchorY:.62},qe={width:128,height:141,anchorX:.5,anchorY:1},Pn=[fn,hn,yn,mn],st=document.querySelector("#app");if(!st)throw new Error("Missing #app element for snake app.");st.innerHTML=`
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Drag the snake around the letters.</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Demo
          </button>
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
`;st.style.setProperty("--snake-board-image",`url("${un}")`);const $t=document.querySelector("#word-label"),Lt=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),ae=document.querySelector("#show-me-button"),Ct=document.querySelector("#success-overlay"),Ht=document.querySelector("#custom-word-form"),Ge=document.querySelector("#custom-word-input"),se=document.querySelector("#custom-word-error"),qt=document.querySelector("#next-word-button");if(!$t||!Lt||!d||!ae||!Ct||!Ht||!Ge||!se||!qt)throw new Error("Missing elements for snake app.");let Rt=-1,tt=null,l=null,C=null,K=null,Ze=!1,he=[],Re=[],ye=[],Oe=[],q=null,me=null,S=!1,oe=[],Ue=[],I=[],Se=[],xe=null,k=1,ee=null,We=1600,nt=900,ot=0,_=null,ke=[],$e=null,ne=null,Le=null,it=[],B=null,pe=null,Ke=new Map,N=null,Ce=null,j=null,He=null,h=[],D=0,we=0,Z=null,lt=0,y=0,A=0,z=null,T=null,L=0,R=null,G=null,w=!1,v=!1,be=0,Pe=[],Be=new Set,_e=[],m="hidden",Ee=null,re=null,W=0,P=null,b=!1,Fe=null,ge=[],wt=!1,rt=-1,fe=Number.POSITIVE_INFINITY;const Ot=()=>{se.hidden=!0,se.textContent=""},bt=e=>{se.hidden=!1,se.textContent=e},Mn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),Wt=()=>Fe||(Fe=Pn.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Tt,t}),Fe),In=()=>{wt||(Wt().forEach(e=>{e.load()}),wt=!0)},Tn=()=>{const e=Wt(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Tt,ge.push(r),r.addEventListener("ended",()=>{ge=ge.filter(a=>a!==r)}),r.addEventListener("error",()=>{ge=ge.filter(a=>a!==r)}),r.play().catch(()=>{})},Ve=()=>{const e=k>0?k-1:-1,t=e>=0?I[e]:null;rt=e,fe=t?t.startDistance+Y:Number.POSITIVE_INFINITY},Fn=e=>{if(!e.isPenDown||S||w||v||b)return;const t=k>0?k-1:-1,n=t>=0?I[t]:null;if(!n){fe=Number.POSITIVE_INFINITY,rt=t;return}t!==rt&&Ve();const r=De(e);let a=!1;for(;r>=fe&&fe<=n.endDistance;)Math.random()<wn&&(a=!0),fe+=Y;a&&Tn()},Me=()=>{const e=S;Ue.forEach(t=>{const n=oe[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=k;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),Lt.textContent=oe.length===0?"Nice tracing.":"All the fruit is collected."},ie=e=>{Ct.hidden=!e},le=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},de=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Nn=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ie=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},$n=()=>{if(Ie(),Math.abs(y-A)<.5){y=A,F();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*En,s=A-y;if(Math.abs(s)<=a){y=A,z=null,F(),Bt();return}y+=Math.sign(s)*a,F(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},Ln=e=>{const t=Math.max(0,e);Math.abs(t-A)<.5||(A=t,$n())},Cn=()=>{Ie(),A=y,T=D,L=y},Bt=()=>{if(!b||C===null||!K||!l||y>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(b=!1,T=D,L=y,l.update(K),x(),!0):!1},Hn=()=>{if(T===null)return;const e=Math.max(0,D-T),t=Math.max(0,L-e);if(Math.abs(t-y)<.5){t<=.5&&(y=0,A=0,T=null,L=0);return}y=t,A=t,t<=.5&&(y=0,A=0,T=null,L=0)},ct=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,qn=e=>ke[e.activeStrokeIndex]??null,Yt=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},De=e=>{var n;if(!_)return 0;if(e.status==="complete")return ot;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+Yt(e)},Ae=e=>{var t;return((t=qn(e))==null?void 0:t.deferred)===!0},dt=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},Gt=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},Ut=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=ke[t];if(!(!n||n.deferred))return Gt(t)}return null},Rn=e=>{if(Ae(e)){const n=Ut(e);if(n)return n}const t=[...h].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:Nn(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},ut=e=>{var t;return S||w||v||e.status==="complete"||!Ae(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=ct(e))==null?void 0:t.isDot)===!0}},On=e=>{if(!pe)return;const t=ut(e);if(!t){pe.style.opacity="0";return}if(t.isDot){pe.style.opacity="0";return}gt(pe,{point:t.point,tangent:t.tangent,angle:de(t.tangent)},{isDot:!1,headHref:ve,travelledDistance:Yt(e)})},gt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??ve),U(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},M.width*J,M.height*J,M.anchorX,M.anchorY,M.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const f=dt(n.travelledDistance??Number.POSITIVE_INFINITY,1,ue);if(f.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const g={x:t.point.x-t.tangent.x*ue,y:t.point.y-t.tangent.y*ue},E={x:t.point.x-t.tangent.x*ue*2,y:t.point.y-t.tangent.y*ue*2};a&&c&&U(a,c,{x:g.x,y:g.y,angle:t.angle,visible:!0},O.width*J,O.height*J,O.anchorX,O.anchorY,O.rotationOffset),s&&u&&f.showTail?U(s,u,{x:E.x,y:E.y,angle:t.angle,visible:!0},$.width*J,$.height*J,$.anchorX,$.anchorY,$.rotationOffset):s&&(s.style.opacity="0")},Et=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${It}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Pt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${ve}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,ce=()=>{G!==null&&(cancelAnimationFrame(G),G=null),m="hidden",Ee=null,re=null,N&&(N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting")),j&&(j.style.opacity="0")},Wn=e=>({x:e.x,y:e.y-vn}),Bn=e=>({x:e.x,y:e.y+8}),Kt=(e=performance.now())=>{if(m==="hidden"||!re)return null;const t=Bn(re),n=Wn(re);if(m==="waiting")return{snakePoint:t,snakeHref:Ne,snakeWobble:!0};if(m==="eagle_in"){const i=Math.max(0,Math.min(1,(e-W)/Ft)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:Ne,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+X.height)*c},eagleHref:Je,eagleWidth:X.width,eagleHeight:X.height}}if(m==="eagle_stand")return{snakePoint:t,snakeHref:Ne,snakeWobble:!1,eaglePoint:n,eagleHref:gn,eagleWidth:qe.width,eagleHeight:qe.height};const r=Math.max(0,Math.min(1,(e-W)/Nt)),a=1-(1-r)*(1-r),s={x:n.x+(We+X.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+X.height*.6},snakeHref:_n,snakeWobble:!1,eaglePoint:s,eagleHref:Je,eagleWidth:X.width,eagleHeight:X.height}},Yn=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){ce(),x();return}if(Ee!==null&&e.activeStrokeIndex===Ee&&((t=ct(e))!=null&&t.isDot)){l.beginAt(e.cursorPoint);const n=l.getState();Jt(De(n)),jt(n)}ce(),x()},Vt=e=>{if(G=null,!(m==="hidden"||m==="waiting")){if(m==="eagle_in"&&e-W>=Ft)m="eagle_stand",W=e;else if(m==="eagle_stand"&&e-W>=An)m="eagle_out",W=e;else if(m==="eagle_out"&&e-W>=Nt){Yn();return}x(),G=requestAnimationFrame(Vt)}},Gn=()=>{m==="waiting"&&(m="eagle_in",W=performance.now(),G!==null&&cancelAnimationFrame(G),G=requestAnimationFrame(Vt),x())},Un=e=>{const t=ut(e);if(!(t!=null&&t.isDot)){ce();return}Ee!==t.strokeIndex?(ce(),Ee=t.strokeIndex,re=t.point,m="waiting"):m==="waiting"&&(re=t.point)},Kn=(e=performance.now())=>{if(!N||!Ce||!j||!He)return;const t=Kt(e);if(!t){N.style.opacity="0",N.classList.remove("writing-app__dot-snake--waiting"),j.style.opacity="0";return}if(N.style.opacity="1",N.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ce.setAttribute("href",t.snakeHref),U(N,Ce,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},te.width,te.height,te.anchorX,te.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){j.style.opacity="0";return}He.setAttribute("href",t.eagleHref),U(j,He,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,qe.anchorX,qe.anchorY,0)},Vn=(e,t)=>{const n=ut(t);if(!n)return!1;if(n.isDot){if(m!=="waiting")return!1;const a=Kt();if(!a)return!1;const s=Math.max(te.width,te.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,M.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Xn=e=>{e.completedStrokes.forEach(t=>{if(Be.has(t))return;Be.add(t);const n=ke[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=Gt(t);a&&Pe.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:de(a.tangent)})})},jn=()=>{Ke.forEach((e,t)=>{const n=Pe.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}gt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},pt=()=>{Ke.forEach(e=>{e.style.opacity="0"})},zn=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Xt=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return zn(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},Zn=e=>{const t=I[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=Xt(_,n),a=le({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:le({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},Qn=()=>{k=Math.min(k+1,I.length),xe=k-1<Se.length?k-1:null,en(),Me(),Ve()},jt=e=>{if(S||w||v||b||I.length<=k)return!1;const t=k-1,n=I[t];return!n||De(e)<n.endDistance-8?!1:(b=!0,T=null,L=0,Z=n.endDistance,P=Zn(t+1),P&&(we=de(P),Ye(n.endPoint,P,!0)),Qn(),l==null||l.end(),Zt(),x(),!0)},Jn=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/xn));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),f=Xt(e,u);return{x:f.x,y:f.y,pathDistance:u,emoji:je[(r+c)%je.length]??je[0],captured:!1,groupIndex:r}})}),zt=()=>{k=I.length>0?1:0,xe=Se.length>0?0:null,oe.forEach(e=>{e.captured=!1}),Ue.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),en(),Me()},ft=()=>{const e=Math.max(3,Math.min(et,Math.floor(ot/xt)));return Math.min(e,1+Math.floor(D/xt))},Zt=()=>{if(S||w||v){T=null,L=0;return}if(!b)return;const e=dt(D,ft(),Y).bodyCount;Ln((e+1)*Y)},U=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},Qe=e=>{const t=h[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(h.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<h.length;r+=1){const a=h[r-1],s=h[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,f=a.y+(s.y-a.y)*c;return{x:u,y:f,angle:de({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...h[h.length-1]??t,distance:e}},Qt=()=>{ne==null||ne.style.setProperty("opacity","0"),B==null||B.style.setProperty("opacity","0"),it.forEach(e=>{e.style.opacity="0"})},F=(e=performance.now())=>{if(!$e||!ne||!Le||!B||h.length===0)return;if(S||v){$e.style.opacity="0";return}$e.style.opacity="1";const t=w?be:ft(),n=w?0:y,r=dt(D,t,Y),a=r.bodyCount,s=Qe(D);Le.setAttribute("href",e<lt?pn:ve),U(ne,Le,{...s,angle:we},M.width,M.height,M.anchorX,M.anchorY,M.rotationOffset),it.forEach((f,g)=>{if(g>=a){f.style.opacity="0";return}const E=f.querySelector("image");if(!E)return;const V=Math.max(0,(g+1)*Y-n);if(V<=kt){f.style.opacity="0";return}const Te=Qe(Math.max(0,D-V)),o=E.getAttribute("href")===Mt?Dn:O;U(f,E,Te,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=B.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*Y-n);if(!r.showTail||c<=kt){B.style.opacity="0";return}const u=Qe(Math.max(0,D-c));U(B,i,u,$.width,$.height,$.anchorX,$.anchorY,$.rotationOffset)},ht=(e,t,n=!0)=>{const r=le(t);we=de(r),h=[{x:e.x,y:e.y,angle:we,distance:0,visible:n}],D=0,lt=0,y=0,A=0,T=null,L=0,Z=null,P=null,b=!1,v=!1,w=!1,be=0,Ie(),R!==null&&(cancelAnimationFrame(R),R=null),F()},Ye=(e,t,n)=>{const r=le(t),a=de(r);we=a;const s=h[h.length-1];if(!s){ht(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?h[h.length-1]={...s,x:e.x,y:e.y,angle:a}:(h.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),D=s.distance+.001),F();return}D=s.distance+i,h.push({x:e.x,y:e.y,angle:a,distance:D,visible:n}),Hn(),F()},Dt=(e,t,n)=>{const r=le(t),a=[];r.x>.001?a.push((We+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((nt+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(We,nt)+Q)+(n+2)*Y+Q},er=(e,t)=>{if(w||v)return;Ie(),y=0,A=0,T=null,L=0,Z=null,P=null,b=!1;const n=le(t),r=performance.now();be=ft();const a=Dt(e,n,be);_e=Pe.map(i=>({...i,travelDistance:Dt(i.point,i.tangent,0)})),w=!0,ie(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*ze);Ye({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),_e.forEach(g=>{const E=Ke.get(g.strokeIndex);if(!E)return;const V=Math.min(g.travelDistance,c*ze);gt(E,{point:{x:g.point.x+g.tangent.x*V,y:g.point.y+g.tangent.y*V},tangent:g.tangent,angle:g.angle})});const f=_e.every(g=>c*ze>=g.travelDistance);if(u>=a&&f){w=!1,v=!0,R=null,Qt(),pt(),ie(!0);return}R=requestAnimationFrame(s)};R=requestAnimationFrame(s)},Jt=e=>{let t=!1;oe.forEach((n,r)=>{if(n.captured||n.groupIndex>=k||e+.5<n.pathDistance)return;n.captured=!0;const a=Ue[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(lt=performance.now()+bn,Me(),F())},en=()=>{if(!ee)return;const e=xe!==null?Se[xe]:void 0;if(!e){ee.classList.add("writing-app__boundary-star--hidden");return}ee.classList.remove("writing-app__boundary-star--hidden"),ee.setAttribute("x",`${e.x}`),ee.setAttribute("y",`${e.y}`)},tr=e=>{if(Z!==null){if(De(e)+.5<Z){F();return}Z=null}const n=P!==null&&(b||e.isPenDown)&&P?P:e.cursorTangent;if(Ae(e)){const r=Ut(e),a=h[h.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&Ye(r.point,r.tangent,!0)}else Ye(e.cursorPoint,n,!0);P&&e.isPenDown&&!b&&(P=null),S||Jt(De(e)),!S&&e.isPenDown&&(Fn(e),jt(e))},at=()=>{me!==null&&(cancelAnimationFrame(me),me=null),S=!1,ae.disabled=!1,ae.textContent="Demo",ye.forEach((e,t)=>{const n=Oe[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),q&&(q.style.opacity="0"),Me(),F(),x()},At=()=>{l==null||l.reset(),C=null,K=null,ie(!1),v=!1,w=!1,be=0,Pe=[],Be=new Set,_e=[],ce(),R!==null&&(cancelAnimationFrame(R),R=null),he.forEach((t,n)=>{const r=Re[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ie(),y=0,A=0,T=null,L=0,Z=null,P=null,b=!1;const e=l==null?void 0:l.getState();e?ht(e.cursorPoint,e.cursorTangent,!0):Qt(),pt(),zt(),Ve(),x()},x=()=>{Ze||(Ze=!0,requestAnimationFrame(()=>{Ze=!1,nr()}))},nr=()=>{if(!l)return;const e=l.getState();Zt(),Xn(e),Un(e),Kn(),On(e),!w&&!v&&jn();const t=new Set(e.completedStrokes);if(he.forEach((n,r)=>{const a=Re[r]??0;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!S&&!w&&!v&&!b?tr(e):F(),e.status==="complete"){if(!S&&!w&&!v){const n=Rn(e);er(n.point,n.tangent)}ie(v);return}ie(!1)},rr=()=>{if(!tt||S)return;At(),at();const e=new cn(tt,{speed:1.7*St,penUpSpeed:2.1*St,deferredDelayMs:150});S=!0,ae.disabled=!0,ae.textContent="Demo...",Me(),F();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(ye.forEach((u,f)=>{const g=Oe[f]??.001;if(c.has(f)){u.style.strokeDashoffset="0";return}if(f===i.activeStrokeIndex){const E=g*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,E)}`;return}u.style.strokeDashoffset=`${g}`}),q&&(q.setAttribute("cx",i.point.x.toFixed(2)),q.setAttribute("cy",i.point.y.toFixed(2)),q.style.opacity=a<=e.totalDuration+mt?"1":"0"),a<e.totalDuration+mt){me=requestAnimationFrame(n);return}at(),At()};me=requestAnimationFrame(n),x()},ar=(e,t,n,r)=>{We=t,nt=n;const a=on(e);_=a,ke=e.strokes.filter(o=>o.type!=="lift"),ot=a.strokes.reduce((o,p)=>o+p.totalLength,0),I=dn(a).groups,Se=I.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),xe=Se.length>0?0:null,k=I.length>0?1:0,l=new ln(a,{startTolerance:_t,hitTolerance:_t}),C=null,oe=Jn(a,I);const i=ke,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${Xe(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${Xe(o.curves)}"></path>`).join(""),f=i.map(o=>`<path class="writing-app__stroke-demo" d="${Xe(o.curves)}"></path>`).join(""),g=oe.map((o,p)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${p}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${Sn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),E=Array.from({length:et},(o,p)=>{const H=et-1-p,rn=Math.random()<kn?Mt:Pt;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${H}"
      >
        <image
          href="${rn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),V=i.map((o,p)=>o.deferred?p:null).filter(o=>o!==null).map(o=>Et(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
          href="${It}"
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
          href="${ve}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${g}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${V}
    </g>
    ${Et('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Ne}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${Je}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,he=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),ye=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Ue=Array.from(d.querySelectorAll(".writing-app__fruit")),ee=d.querySelector("#waypoint-star"),$e=d.querySelector("#trace-snake"),ne=d.querySelector("#snake-head"),Le=d.querySelector("#snake-head-image"),B=d.querySelector("#snake-tail"),it=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,p)=>Number(o.dataset.snakeBodyIndex)-Number(p.dataset.snakeBodyIndex)),pe=d.querySelector("#deferred-head"),Ke=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),N=d.querySelector("#dot-snake"),Ce=d.querySelector("#dot-snake-image"),j=d.querySelector("#dot-eagle"),He=d.querySelector("#dot-eagle-image"),q=d.querySelector("#demo-nib"),Re=he.map(o=>{const p=o.getTotalLength();return Number.isFinite(p)&&p>0?p:.001}),Oe=ye.map(o=>{const p=o.getTotalLength();return Number.isFinite(p)&&p>0?p:.001}),he.forEach((o,p)=>{const H=Re[p]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),ye.forEach((o,p)=>{const H=Oe[p]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),q&&(q.style.opacity="0");const Te=l.getState();ht(Te.cursorPoint,Te.cursorTangent),Pe=[],Be=new Set,_e=[],ce(),pt(),zt(),Ve(),ie(!1),x()},sr=(e,t=-1)=>{at();const n=sn(e);Rt=t,$t.textContent=e,Ge.value=e,tt=n.path,ar(n.path,n.width,n.height,n.offsetY)},tn=(e,t=-1)=>{const n=Mn(e);if(!n)return bt("Type a word first."),!1;try{return sr(n,t),Ot(),!0}catch{return bt("Couldn't build that word. Try letters supported by the cursive set."),!1}},nn=()=>{const e=an(Rt);tn(yt[e]??yt[0],e)},or=e=>{if(S||!l||C!==null)return;const t=vt(d,e),n=l.getState(),r=ct(n);if(Ae(n)&&!Vn(t,n))return;if(Ae(n)&&(r!=null&&r.isDot)){e.preventDefault(),Gn();return}l.beginAt(t)&&(e.preventDefault(),b=!1,C=e.pointerId,K=t,In(),y>.5&&Cn(),d.setPointerCapture(e.pointerId),x())},ir=e=>{if(!(S||!l||e.pointerId!==C)){if(e.preventDefault(),K=vt(d,e),b){Bt(),x();return}l.update(K),x()}},lr=e=>{!l||e.pointerId!==C||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,K=null,x())},cr=e=>{e.pointerId===C&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,K=null,x())};d.addEventListener("pointerdown",or);d.addEventListener("pointermove",ir);d.addEventListener("pointerup",lr);d.addEventListener("pointercancel",cr);ae.addEventListener("click",rr);Ht.addEventListener("submit",e=>{e.preventDefault(),tn(Ge.value)});qt.addEventListener("click",nn);Ge.addEventListener("input",()=>{se.hidden||Ot()});nn();
