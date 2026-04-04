import{f as dn,W as kt,b as un,c as gn,d as pn,e as je,A as fn,g as Ft,h as wt}from"./shared-n7GYFNh1.js";import{a as hn}from"./groups-Cr1poJ62.js";const $t="/letterpaths/writing_app/assets/body-DDjZTdeu.png",Lt="/letterpaths/writing_app/assets/body_bulge-CHgMxuio.png",yn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",et="/letterpaths/writing_app/assets/eagle_fly-DH3HgPCL.png",mn="/letterpaths/writing_app/assets/eagle_stand-DGP6P_VP.png",_n="/letterpaths/writing_app/assets/head_alt-vjLDS9b1.png",Sn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",xn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",kn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",wn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",bn="/letterpaths/writing_app/assets/snake_facing_camera_angry-CFtVEFwY.png",Fe="/letterpaths/writing_app/assets/snake_facing_camera_happy-D-RY1-aU.png",De="/letterpaths/writing_app/assets/head-7zYObEXI.png",Ct="/letterpaths/writing_app/assets/tail-q7Mcy-Q-.png",En=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},ze=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],bt=150,vn=44,An=180,Et=.75,Y=76,vt=115,Dn=.25,Ht=.12,Pn=.42,tt=10,Q=260,Ze=340,Mn=220,In=700,At=6,M={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},W={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Tn={...W,height:W.height*(209/431/(160/435))},$={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,ue=44,qt=700,Nn=260,Rt=800,Fn=18,X={width:200,height:106},te={width:69,height:49,anchorX:.5,anchorY:.62},Re={width:128,height:141,anchorX:.5,anchorY:1},$n=[Sn,xn,kn,wn],ct=document.querySelector("#app");if(!ct)throw new Error("Missing #app element for snake app.");En();ct.innerHTML=`
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
`;ct.style.setProperty("--snake-board-image",`url("${yn}")`);const Wt=document.querySelector("#word-label"),Ot=document.querySelector("#score-summary"),d=document.querySelector("#trace-svg"),ae=document.querySelector("#show-me-button"),Bt=document.querySelector("#success-overlay"),Yt=document.querySelector("#custom-word-form"),Ue=document.querySelector("#custom-word-input"),se=document.querySelector("#custom-word-error"),dt=document.querySelector("#next-word-button");if(!Wt||!Ot||!d||!ae||!Bt||!Yt||!Ue||!se||!dt)throw new Error("Missing elements for snake app.");let Gt=-1,nt=null,l=null,C=null,K=null,Qe=!1,he=[],We=[],ye=[],Oe=[],q=null,me=null,S=!1,oe=[],Ke=[],I=[],Se=[],xe=null,k=1,ee=null,Be=1600,rt=900,ut=0,_=null,ke=[],$e=null,ne=null,Le=null,gt=[],B=null,pe=null,Ve=new Map,F=null,Ce=null,j=null,He=null,h=[],v=0,we=0,Z=null,pt=0,y=0,A=0,z=null,T=null,L=0,R=null,G=null,w=!1,D=!1,be=0,Pe=[],Ye=new Set,_e=[],m="hidden",Ee=null,re=null,O=0,P=null,b=!1,Ne=null,ge=[],Dt=!1,at=-1,fe=Number.POSITIVE_INFINITY;const Ut=()=>{se.hidden=!0,se.textContent=""},Pt=e=>{se.hidden=!1,se.textContent=e},Kt=e=>e.trim().replace(/\s+/g," ").toLowerCase(),Ln=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(Kt).filter(t=>t.length>0)},st=Ln();let qe=0;const ot=()=>{dt.textContent=qe<st.length?"Next queued word":"Next random word"},Mt=()=>{if(qe>=st.length)return null;const e=st[qe];return qe+=1,e??null},Vt=()=>Ne||(Ne=$n.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Ht,t}),Ne),Cn=()=>{Dt||(Vt().forEach(e=>{e.load()}),Dt=!0)},Hn=()=>{const e=Vt(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Ht,ge.push(r),r.addEventListener("ended",()=>{ge=ge.filter(a=>a!==r)}),r.addEventListener("error",()=>{ge=ge.filter(a=>a!==r)}),r.play().catch(()=>{})},Xe=()=>{const e=k>0?k-1:-1,t=e>=0?I[e]:null;at=e,fe=t?t.startDistance+Y:Number.POSITIVE_INFINITY},qn=e=>{if(!e.isPenDown||S||w||D||b)return;const t=k>0?k-1:-1,n=t>=0?I[t]:null;if(!n){fe=Number.POSITIVE_INFINITY,at=t;return}t!==at&&Xe();const r=ve(e);let a=!1;for(;r>=fe&&fe<=n.endDistance;)Math.random()<Pn&&(a=!0),fe+=Y;a&&Hn()},Me=()=>{const e=S;Ke.forEach(t=>{const n=oe[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=k;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),Ot.textContent=oe.length===0?"Nice tracing.":"All the fruit is collected."},ie=e=>{Bt.hidden=!e},le=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},de=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Rn=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ie=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},Wn=()=>{if(Ie(),Math.abs(y-A)<.5){y=A,N();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*In,s=A-y;if(Math.abs(s)<=a){y=A,z=null,N(),Xt();return}y+=Math.sign(s)*a,N(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},On=e=>{const t=Math.max(0,e);Math.abs(t-A)<.5||(A=t,Wn())},Bn=()=>{Ie(),A=y,T=v,L=y},Xt=()=>{if(!b||C===null||!K||!l||y>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(b=!1,T=v,L=y,l.update(K),x(),!0):!1},Yn=()=>{if(T===null)return;const e=Math.max(0,v-T),t=Math.max(0,L-e);if(Math.abs(t-y)<.5){t<=.5&&(y=0,A=0,T=null,L=0);return}y=t,A=t,t<=.5&&(y=0,A=0,T=null,L=0)},ft=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,Gn=e=>ke[e.activeStrokeIndex]??null,jt=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},ve=e=>{var n;if(!_)return 0;if(e.status==="complete")return ut;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+jt(e)},Ae=e=>{var t;return((t=Gn(e))==null?void 0:t.deferred)===!0},ht=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},zt=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},Zt=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=ke[t];if(!(!n||n.deferred))return zt(t)}return null},Un=e=>{if(Ae(e)){const n=Zt(e);if(n)return n}const t=[...h].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:Rn(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},yt=e=>{var t;return S||w||D||e.status==="complete"||!Ae(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=ft(e))==null?void 0:t.isDot)===!0}},Kn=e=>{if(!pe)return;const t=yt(e);if(!t){pe.style.opacity="0";return}if(t.isDot){pe.style.opacity="0";return}mt(pe,{point:t.point,tangent:t.tangent,angle:de(t.tangent)},{isDot:!1,headHref:De,travelledDistance:jt(e)})},mt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),u=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??De),U(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},M.width*J,M.height*J,M.anchorX,M.anchorY,M.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const f=ht(n.travelledDistance??Number.POSITIVE_INFINITY,1,ue);if(f.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const g={x:t.point.x-t.tangent.x*ue,y:t.point.y-t.tangent.y*ue},E={x:t.point.x-t.tangent.x*ue*2,y:t.point.y-t.tangent.y*ue*2};a&&c&&U(a,c,{x:g.x,y:g.y,angle:t.angle,visible:!0},W.width*J,W.height*J,W.anchorX,W.anchorY,W.rotationOffset),s&&u&&f.showTail?U(s,u,{x:E.x,y:E.y,angle:t.angle,visible:!0},$.width*J,$.height*J,$.anchorX,$.anchorY,$.rotationOffset):s&&(s.style.opacity="0")},It=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${Ct}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${$t}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${De}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,ce=()=>{G!==null&&(cancelAnimationFrame(G),G=null),m="hidden",Ee=null,re=null,F&&(F.style.opacity="0",F.classList.remove("writing-app__dot-snake--waiting")),j&&(j.style.opacity="0")},Vn=e=>({x:e.x,y:e.y-Fn}),Xn=e=>({x:e.x,y:e.y+8}),Qt=(e=performance.now())=>{if(m==="hidden"||!re)return null;const t=Xn(re),n=Vn(re);if(m==="waiting")return{snakePoint:t,snakeHref:Fe,snakeWobble:!0};if(m==="eagle_in"){const i=Math.max(0,Math.min(1,(e-O)/qt)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:Fe,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+X.height)*c},eagleHref:et,eagleWidth:X.width,eagleHeight:X.height}}if(m==="eagle_stand")return{snakePoint:t,snakeHref:Fe,snakeWobble:!1,eaglePoint:n,eagleHref:mn,eagleWidth:Re.width,eagleHeight:Re.height};const r=Math.max(0,Math.min(1,(e-O)/Rt)),a=1-(1-r)*(1-r),s={x:n.x+(Be+X.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+X.height*.6},snakeHref:bn,snakeWobble:!1,eaglePoint:s,eagleHref:et,eagleWidth:X.width,eagleHeight:X.height}},jn=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){ce(),x();return}if(Ee!==null&&e.activeStrokeIndex===Ee&&((t=ft(e))!=null&&t.isDot)){l.beginAt(e.cursorPoint);const n=l.getState();sn(ve(n)),tn(n)}ce(),x()},Jt=e=>{if(G=null,!(m==="hidden"||m==="waiting")){if(m==="eagle_in"&&e-O>=qt)m="eagle_stand",O=e;else if(m==="eagle_stand"&&e-O>=Nn)m="eagle_out",O=e;else if(m==="eagle_out"&&e-O>=Rt){jn();return}x(),G=requestAnimationFrame(Jt)}},zn=()=>{m==="waiting"&&(m="eagle_in",O=performance.now(),G!==null&&cancelAnimationFrame(G),G=requestAnimationFrame(Jt),x())},Zn=e=>{const t=yt(e);if(!(t!=null&&t.isDot)){ce();return}Ee!==t.strokeIndex?(ce(),Ee=t.strokeIndex,re=t.point,m="waiting"):m==="waiting"&&(re=t.point)},Qn=(e=performance.now())=>{if(!F||!Ce||!j||!He)return;const t=Qt(e);if(!t){F.style.opacity="0",F.classList.remove("writing-app__dot-snake--waiting"),j.style.opacity="0";return}if(F.style.opacity="1",F.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ce.setAttribute("href",t.snakeHref),U(F,Ce,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},te.width,te.height,te.anchorX,te.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){j.style.opacity="0";return}He.setAttribute("href",t.eagleHref),U(j,He,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Re.anchorX,Re.anchorY,0)},Jn=(e,t)=>{const n=yt(t);if(!n)return!1;if(n.isDot){if(m!=="waiting")return!1;const a=Qt();if(!a)return!1;const s=Math.max(te.width,te.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,M.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},er=e=>{e.completedStrokes.forEach(t=>{if(Ye.has(t))return;Ye.add(t);const n=ke[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=zt(t);a&&Pe.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:de(a.tangent)})})},tr=()=>{Ve.forEach((e,t)=>{const n=Pe.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}mt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},_t=()=>{Ve.forEach(e=>{e.style.opacity="0"})},nr=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},en=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return nr(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},rr=e=>{const t=I[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=en(_,n),a=le({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:le({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},ar=()=>{k=Math.min(k+1,I.length),xe=k-1<Se.length?k-1:null,on(),Me(),Xe()},tn=e=>{if(S||w||D||b||I.length<=k)return!1;const t=k-1,n=I[t];return!n||ve(e)<n.endDistance-8?!1:(b=!0,T=null,L=0,Z=n.endDistance,P=rr(t+1),P&&(we=de(P),Ge(n.endPoint,P,!0)),ar(),l==null||l.end(),rn(),x(),!0)},sr=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/An));return Array.from({length:s},(i,c)=>{const u=n.startDistance+a*(c+1)/(s+1),f=en(e,u);return{x:f.x,y:f.y,pathDistance:u,emoji:ze[(r+c)%ze.length]??ze[0],captured:!1,groupIndex:r}})}),nn=()=>{k=I.length>0?1:0,xe=Se.length>0?0:null,oe.forEach(e=>{e.captured=!1}),Ke.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),on(),Me()},St=()=>{const e=Math.max(3,Math.min(tt,Math.floor(ut/vt)));return Math.min(e,1+Math.floor(v/vt))},rn=()=>{if(S||w||D){T=null,L=0;return}if(!b)return;const e=ht(v,St(),Y).bodyCount;On((e+1)*Y)},U=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},Je=e=>{const t=h[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(h.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<h.length;r+=1){const a=h[r-1],s=h[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,u=a.x+(s.x-a.x)*c,f=a.y+(s.y-a.y)*c;return{x:u,y:f,angle:de({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...h[h.length-1]??t,distance:e}},an=()=>{ne==null||ne.style.setProperty("opacity","0"),B==null||B.style.setProperty("opacity","0"),gt.forEach(e=>{e.style.opacity="0"})},N=(e=performance.now())=>{if(!$e||!ne||!Le||!B||h.length===0)return;if(S||D){$e.style.opacity="0";return}$e.style.opacity="1";const t=w?be:St(),n=w?0:y,r=ht(v,t,Y),a=r.bodyCount,s=Je(v);Le.setAttribute("href",e<pt?_n:De),U(ne,Le,{...s,angle:we},M.width,M.height,M.anchorX,M.anchorY,M.rotationOffset),gt.forEach((f,g)=>{if(g>=a){f.style.opacity="0";return}const E=f.querySelector("image");if(!E)return;const V=Math.max(0,(g+1)*Y-n);if(V<=At){f.style.opacity="0";return}const Te=Je(Math.max(0,v-V)),o=E.getAttribute("href")===Lt?Tn:W;U(f,E,Te,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=B.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*Y-n);if(!r.showTail||c<=At){B.style.opacity="0";return}const u=Je(Math.max(0,v-c));U(B,i,u,$.width,$.height,$.anchorX,$.anchorY,$.rotationOffset)},xt=(e,t,n=!0)=>{const r=le(t);we=de(r),h=[{x:e.x,y:e.y,angle:we,distance:0,visible:n}],v=0,pt=0,y=0,A=0,T=null,L=0,Z=null,P=null,b=!1,D=!1,w=!1,be=0,Ie(),R!==null&&(cancelAnimationFrame(R),R=null),N()},Ge=(e,t,n)=>{const r=le(t),a=de(r);we=a;const s=h[h.length-1];if(!s){xt(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?h[h.length-1]={...s,x:e.x,y:e.y,angle:a}:(h.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),v=s.distance+.001),N();return}v=s.distance+i,h.push({x:e.x,y:e.y,angle:a,distance:v,visible:n}),Yn(),N()},Tt=(e,t,n)=>{const r=le(t),a=[];r.x>.001?a.push((Be+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((rt+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,u)=>Math.min(c,u),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Be,rt)+Q)+(n+2)*Y+Q},or=(e,t)=>{if(w||D)return;Ie(),y=0,A=0,T=null,L=0,Z=null,P=null,b=!1;const n=le(t),r=performance.now();be=St();const a=Tt(e,n,be);_e=Pe.map(i=>({...i,travelDistance:Tt(i.point,i.tangent,0)})),w=!0,ie(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,u=Math.min(a,c*Ze);Ge({x:e.x+n.x*u,y:e.y+n.y*u},n,!0),_e.forEach(g=>{const E=Ve.get(g.strokeIndex);if(!E)return;const V=Math.min(g.travelDistance,c*Ze);mt(E,{point:{x:g.point.x+g.tangent.x*V,y:g.point.y+g.tangent.y*V},tangent:g.tangent,angle:g.angle})});const f=_e.every(g=>c*Ze>=g.travelDistance);if(u>=a&&f){w=!1,D=!0,R=null,an(),_t(),ie(!0);return}R=requestAnimationFrame(s)};R=requestAnimationFrame(s)},sn=e=>{let t=!1;oe.forEach((n,r)=>{if(n.captured||n.groupIndex>=k||e+.5<n.pathDistance)return;n.captured=!0;const a=Ke[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(pt=performance.now()+Mn,Me(),N())},on=()=>{if(!ee)return;const e=xe!==null?Se[xe]:void 0;if(!e){ee.classList.add("writing-app__boundary-star--hidden");return}ee.classList.remove("writing-app__boundary-star--hidden"),ee.setAttribute("x",`${e.x}`),ee.setAttribute("y",`${e.y}`)},ir=e=>{if(Z!==null){if(ve(e)+.5<Z){N();return}Z=null}const n=P!==null&&(b||e.isPenDown)&&P?P:e.cursorTangent;if(Ae(e)){const r=Zt(e),a=h[h.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&Ge(r.point,r.tangent,!0)}else Ge(e.cursorPoint,n,!0);P&&e.isPenDown&&!b&&(P=null),S||sn(ve(e)),!S&&e.isPenDown&&(qn(e),tn(e))},it=()=>{me!==null&&(cancelAnimationFrame(me),me=null),S=!1,ae.disabled=!1,ae.textContent="Demo",ye.forEach((e,t)=>{const n=Oe[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),q&&(q.style.opacity="0"),Me(),N(),x()},Nt=()=>{l==null||l.reset(),C=null,K=null,ie(!1),D=!1,w=!1,be=0,Pe=[],Ye=new Set,_e=[],ce(),R!==null&&(cancelAnimationFrame(R),R=null),he.forEach((t,n)=>{const r=We[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ie(),y=0,A=0,T=null,L=0,Z=null,P=null,b=!1;const e=l==null?void 0:l.getState();e?xt(e.cursorPoint,e.cursorTangent,!0):an(),_t(),nn(),Xe(),x()},x=()=>{Qe||(Qe=!0,requestAnimationFrame(()=>{Qe=!1,lr()}))},lr=()=>{if(!l)return;const e=l.getState();rn(),er(e),Zn(e),Qn(),Kn(e),!w&&!D&&tr();const t=new Set(e.completedStrokes);if(he.forEach((n,r)=>{const a=We[r]??0;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!S&&!w&&!D&&!b?ir(e):N(),e.status==="complete"){if(!S&&!w&&!D){const n=Un(e);or(n.point,n.tangent)}ie(D);return}ie(!1)},cr=()=>{if(!nt||S)return;Nt(),it();const e=new fn(nt,{speed:1.7*Et,penUpSpeed:2.1*Et,deferredDelayMs:150});S=!0,ae.disabled=!0,ae.textContent="Demo...",Me(),N();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(ye.forEach((u,f)=>{const g=Oe[f]??.001;if(c.has(f)){u.style.strokeDashoffset="0";return}if(f===i.activeStrokeIndex){const E=g*(1-i.activeStrokeProgress);u.style.strokeDashoffset=`${Math.max(0,E)}`;return}u.style.strokeDashoffset=`${g}`}),q&&(q.setAttribute("cx",i.point.x.toFixed(2)),q.setAttribute("cy",i.point.y.toFixed(2)),q.style.opacity=a<=e.totalDuration+wt?"1":"0"),a<e.totalDuration+wt){me=requestAnimationFrame(n);return}it(),Nt()};me=requestAnimationFrame(n),x()},dr=(e,t,n,r)=>{Be=t,rt=n;const a=gn(e);_=a,ke=e.strokes.filter(o=>o.type!=="lift"),ut=a.strokes.reduce((o,p)=>o+p.totalLength,0),I=hn(a).groups,Se=I.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),xe=Se.length>0?0:null,k=I.length>0?1:0,l=new pn(a,{startTolerance:bt,hitTolerance:bt}),C=null,oe=sr(a,I);const i=ke,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${je(o.curves)}"></path>`).join(""),u=i.map(o=>`<path class="writing-app__stroke-trace" d="${je(o.curves)}"></path>`).join(""),f=i.map(o=>`<path class="writing-app__stroke-demo" d="${je(o.curves)}"></path>`).join(""),g=oe.map((o,p)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${p}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${vn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),E=Array.from({length:tt},(o,p)=>{const H=tt-1-p,cn=Math.random()<Dn?Lt:$t;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${H}"
      >
        <image
          href="${cn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),V=i.map((o,p)=>o.deferred?p:null).filter(o=>o!==null).map(o=>It(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");d.setAttribute("viewBox",`0 0 ${t} ${n}`),d.innerHTML=`
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
          href="${Ct}"
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
          href="${De}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${g}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${V}
    </g>
    ${It('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Fe}"
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
  `,he=Array.from(d.querySelectorAll(".writing-app__stroke-trace")),ye=Array.from(d.querySelectorAll(".writing-app__stroke-demo")),Ke=Array.from(d.querySelectorAll(".writing-app__fruit")),ee=d.querySelector("#waypoint-star"),$e=d.querySelector("#trace-snake"),ne=d.querySelector("#snake-head"),Le=d.querySelector("#snake-head-image"),B=d.querySelector("#snake-tail"),gt=Array.from(d.querySelectorAll(".writing-app__snake-body")).sort((o,p)=>Number(o.dataset.snakeBodyIndex)-Number(p.dataset.snakeBodyIndex)),pe=d.querySelector("#deferred-head"),Ve=new Map(Array.from(d.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),F=d.querySelector("#dot-snake"),Ce=d.querySelector("#dot-snake-image"),j=d.querySelector("#dot-eagle"),He=d.querySelector("#dot-eagle-image"),q=d.querySelector("#demo-nib"),We=he.map(o=>{const p=o.getTotalLength();return Number.isFinite(p)&&p>0?p:.001}),Oe=ye.map(o=>{const p=o.getTotalLength();return Number.isFinite(p)&&p>0?p:.001}),he.forEach((o,p)=>{const H=We[p]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),ye.forEach((o,p)=>{const H=Oe[p]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),q&&(q.style.opacity="0");const Te=l.getState();xt(Te.cursorPoint,Te.cursorTangent),Pe=[],Ye=new Set,_e=[],ce(),_t(),nn(),Xe(),ie(!1),x()},ur=(e,t=-1)=>{it();const n=un(e);Gt=t,Wt.textContent=e,Ue.value=e,nt=n.path,dr(n.path,n.width,n.height,n.offsetY)},lt=(e,t=-1)=>{const n=Kt(e);if(!n)return Pt("Type a word first."),!1;try{return ur(n,t),Ut(),!0}catch{return Pt("Couldn't build that word. Try letters supported by the cursive set."),!1}},ln=()=>{let e=Mt();for(;e;){if(lt(e)){ot();return}e=Mt()}const t=dn(Gt);lt(kt[t]??kt[0],t),ot()},gr=e=>{if(S||!l||C!==null)return;const t=Ft(d,e),n=l.getState(),r=ft(n);if(Ae(n)&&!Jn(t,n))return;if(Ae(n)&&(r!=null&&r.isDot)){e.preventDefault(),zn();return}l.beginAt(t)&&(e.preventDefault(),b=!1,C=e.pointerId,K=t,Cn(),y>.5&&Bn(),d.setPointerCapture(e.pointerId),x())},pr=e=>{if(!(S||!l||e.pointerId!==C)){if(e.preventDefault(),K=Ft(d,e),b){Xt(),x();return}l.update(K),x()}},fr=e=>{!l||e.pointerId!==C||(l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,K=null,x())},hr=e=>{e.pointerId===C&&(l==null||l.end(),d.hasPointerCapture(e.pointerId)&&d.releasePointerCapture(e.pointerId),C=null,K=null,x())};d.addEventListener("pointerdown",gr);d.addEventListener("pointermove",pr);d.addEventListener("pointerup",fr);d.addEventListener("pointercancel",hr);ae.addEventListener("click",cr);Yt.addEventListener("submit",e=>{e.preventDefault(),lt(Ue.value)});dt.addEventListener("click",ln);Ue.addEventListener("input",()=>{se.hidden||Ut()});ot();ln();
