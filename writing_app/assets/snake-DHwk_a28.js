import{M as an,a as sn,T as on,b as bt,c as ln,d as cn,e as Ke,A as dn,W as Le,g as Pt,f as mt,h as un}from"./shared-Dp0xrYiI.js";import{a as gn}from"./groups-Cr1poJ62.js";const vt="/letterpaths/writing_app/assets/body-DDjZTdeu.png",pn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",Je="/letterpaths/writing_app/assets/eagle_fly-DH3HgPCL.png",fn="/letterpaths/writing_app/assets/eagle_stand-DGP6P_VP.png",hn="/letterpaths/writing_app/assets/head_alt-vjLDS9b1.png",yn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",mn="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",_n="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Sn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",xn="/letterpaths/writing_app/assets/snake_facing_camera_angry-CFtVEFwY.png",Me="/letterpaths/writing_app/assets/snake_facing_camera_happy-D-RY1-aU.png",Ee="/letterpaths/writing_app/assets/head-7zYObEXI.png",Dt="/letterpaths/writing_app/assets/tail-q7Mcy-Q-.png",je=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Mt=240,It=44,kn=180,_t=.75,G=76,St=115,Tt=.12,wn=.42,et=10,Q=260,Ze=340,En=220,An=700,xt=6,v={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},N={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},F={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},J=.78,le=44,$t=700,bn=260,Nt=800,Pn=18,j={width:200,height:106},te={width:69,height:49,anchorX:.5,anchorY:.62},Ce={width:128,height:141,anchorX:.5,anchorY:1},vn=[yn,mn,_n,Sn],st=document.querySelector("#app");if(!st)throw new Error("Missing #app element for snake app.");st.innerHTML=`
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Instructions: Drag the snake around the letters</p>
            <h1 class="writing-app__word" id="word-label"></h1>
            <div class="writing-app__fruit-progress" id="fruit-progress" aria-hidden="true"></div>
          </div>
          <div class="writing-app__control-strip">
            <label class="writing-app__tolerance" for="tolerance-slider">
              <span class="writing-app__tolerance-label">
                Tolerance
                <span class="writing-app__tolerance-value" id="tolerance-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="tolerance-slider"
                type="range"
                min="${an}"
                max="${sn}"
                step="${on}"
                value="${Mt}"
              />
            </label>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Show me
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
            <button class="writing-app__button writing-app__button--next" id="next-word-button" type="button">
              Next word
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;st.style.setProperty("--snake-board-image",`url("${pn}")`);const Ft=document.querySelector("#word-label"),He=document.querySelector("#fruit-progress"),Lt=document.querySelector("#score-summary"),u=document.querySelector("#trace-svg"),ae=document.querySelector("#show-me-button"),Ct=document.querySelector("#success-overlay"),Ht=document.querySelector("#next-word-button"),tt=document.querySelector("#tolerance-slider"),Rt=document.querySelector("#tolerance-value");if(!Ft||!He||!Lt||!u||!ae||!Ct||!Ht||!tt||!Rt)throw new Error("Missing elements for snake app.");let Ie=-1,ye=null,l=null,H=null,X=null,ze=!1,ge=[],Re=[],pe=[],qe=[],R=null,fe=null,w=!1,Oe=Mt,q=[],Ge=[],qt=[],M=[],me=[],_e=null,S=1,ee=null,Be=1600,nt=900,it=0,_=null,Se=[],Te=null,ne=null,$e=null,ot=[],W=null,de=null,Ue=new Map,$=null,Ne=null,Z=null,Fe=null,f=[],E=0,lt=0,h=0,A=0,z=null,I=null,L=0,O=null,U=null,k=!1,b=!1,xe=0,Ae=[],Ye=new Set,he=[],m="hidden",ke=null,re=null,Y=0,D=null,T=!1,De=null,ce=[],kt=!1,rt=-1,ue=Number.POSITIVE_INFINITY;const Ot=()=>{Rt.textContent=`${Oe}px`},Bt=()=>De||(De=vn.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Tt,t}),De),Dn=()=>{kt||(Bt().forEach(e=>{e.load()}),kt=!0)},Mn=()=>{const e=Bt(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Tt,ce.push(r),r.addEventListener("ended",()=>{ce=ce.filter(a=>a!==r)}),r.addEventListener("error",()=>{ce=ce.filter(a=>a!==r)}),r.play().catch(()=>{})},Ve=()=>{const e=S>0?S-1:-1,t=e>=0?M[e]:null;rt=e,ue=t?t.startDistance+G:Number.POSITIVE_INFINITY},In=e=>{if(!e.isPenDown||w||k||b||T)return;const t=S>0?S-1:-1,n=t>=0?M[t]:null;if(!n){ue=Number.POSITIVE_INFINITY,rt=t;return}t!==rt&&Ve();const r=Gt(e);let a=!1;for(;r>=ue&&ue<=n.endDistance;)Math.random()<wn&&(a=!0),ue+=G;a&&Mn()},be=()=>{const e=w;Ge.forEach(t=>{const n=q[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=S;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),qt.forEach((t,n)=>{const r=q[n],a=e||!r||r.groupIndex>=S;t.classList.toggle("writing-app__fruit-progress-item--captured",!!(r!=null&&r.captured)),t.classList.toggle("writing-app__fruit-progress-item--hidden",a)}),He.classList.toggle("writing-app__fruit-progress--hidden",e||q.length===0),Lt.textContent=q.length===0?"Nice tracing.":"All the fruit is collected."},se=e=>{Ct.hidden=!e},ie=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},Pe=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Tn=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},ve=()=>{z!==null&&(cancelAnimationFrame(z),z=null)},$n=()=>{if(ve(),Math.abs(h-A)<.5){h=A,C();return}let e=null;const t=n=>{if(e===null){e=n,z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*An,s=A-h;if(Math.abs(s)<=a){h=A,z=null,C(),Yt();return}h+=Math.sign(s)*a,C(),z=requestAnimationFrame(t)};z=requestAnimationFrame(t)},Nn=e=>{const t=Math.max(0,e);Math.abs(t-A)<.5||(A=t,$n())},Fn=()=>{ve(),A=h,I=E,L=h},Yt=()=>{if(!T||H===null||!X||!l||h>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(T=!1,I=E,L=h,l.update(X),x(),!0):!1},Ln=()=>{if(I===null)return;const e=Math.max(0,E-I),t=Math.max(0,L-e);if(Math.abs(t-h)<.5){t<=.5&&(h=0,A=0,I=null,L=0);return}h=t,A=t,t<=.5&&(h=0,A=0,I=null,L=0)},ct=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,Cn=e=>Se[e.activeStrokeIndex]??null,Wt=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Gt=e=>{var n;if(!_)return 0;if(e.status==="complete")return it;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+Wt(e)},we=e=>{var t;return((t=Cn(e))==null?void 0:t.deferred)===!0},dt=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},Ut=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},Vt=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=Se[t];if(!(!n||n.deferred))return Ut(t)}return null},Hn=e=>{if(we(e)){const n=Vt(e);if(n)return n}const t=[...f].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:Tn(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},ut=e=>{var t;return w||k||b||e.status==="complete"||!we(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=ct(e))==null?void 0:t.isDot)===!0}},Rn=e=>{if(!de)return;const t=ut(e);if(!t){de.style.opacity="0";return}if(t.isDot){de.style.opacity="0";return}gt(de,{point:t.point,tangent:t.tangent,angle:Pe(t.tangent)},{isDot:!1,headHref:Ee,travelledDistance:Wt(e)})},gt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),d=a==null?void 0:a.querySelector("image"),g=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??Ee),V(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},v.width*J,v.height*J,v.anchorX,v.anchorY,v.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const y=dt(n.travelledDistance??Number.POSITIVE_INFINITY,1,le);if(y.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const p={x:t.point.x-t.tangent.x*le,y:t.point.y-t.tangent.y*le},P={x:t.point.x-t.tangent.x*le*2,y:t.point.y-t.tangent.y*le*2};a&&d&&V(a,d,{x:p.x,y:p.y,angle:t.angle,visible:!0},N.width*J,N.height*J,N.anchorX,N.anchorY,N.rotationOffset),s&&g&&y.showTail?V(s,g,{x:P.x,y:P.y,angle:t.angle,visible:!0},F.width*J,F.height*J,F.anchorX,F.anchorY,F.rotationOffset):s&&(s.style.opacity="0")},wt=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${Dt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${vt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Ee}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,oe=()=>{U!==null&&(cancelAnimationFrame(U),U=null),m="hidden",ke=null,re=null,$&&($.style.opacity="0",$.classList.remove("writing-app__dot-snake--waiting")),Z&&(Z.style.opacity="0")},qn=e=>({x:e.x,y:e.y-Pn}),On=e=>({x:e.x,y:e.y+8}),Xt=(e=performance.now())=>{if(m==="hidden"||!re)return null;const t=On(re),n=qn(re);if(m==="waiting")return{snakePoint:t,snakeHref:Me,snakeWobble:!0};if(m==="eagle_in"){const i=Math.max(0,Math.min(1,(e-Y)/$t)),d=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:Me,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+j.height)*d},eagleHref:Je,eagleWidth:j.width,eagleHeight:j.height}}if(m==="eagle_stand")return{snakePoint:t,snakeHref:Me,snakeWobble:!1,eaglePoint:n,eagleHref:fn,eagleWidth:Ce.width,eagleHeight:Ce.height};const r=Math.max(0,Math.min(1,(e-Y)/Nt)),a=1-(1-r)*(1-r),s={x:n.x+(Be+j.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+j.height*.6},snakeHref:xn,snakeWobble:!1,eaglePoint:s,eagleHref:Je,eagleWidth:j.width,eagleHeight:j.height}},Bn=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){oe(),x();return}ke!==null&&e.activeStrokeIndex===ke&&((t=ct(e))!=null&&t.isDot)&&(l.beginAt(e.cursorPoint),en(e.cursorPoint),Zt(l.getState())),oe(),x()},Kt=e=>{if(U=null,!(m==="hidden"||m==="waiting")){if(m==="eagle_in"&&e-Y>=$t)m="eagle_stand",Y=e;else if(m==="eagle_stand"&&e-Y>=bn)m="eagle_out",Y=e;else if(m==="eagle_out"&&e-Y>=Nt){Bn();return}x(),U=requestAnimationFrame(Kt)}},Yn=()=>{m==="waiting"&&(m="eagle_in",Y=performance.now(),U!==null&&cancelAnimationFrame(U),U=requestAnimationFrame(Kt),x())},Wn=e=>{const t=ut(e);if(!(t!=null&&t.isDot)){oe();return}ke!==t.strokeIndex?(oe(),ke=t.strokeIndex,re=t.point,m="waiting"):m==="waiting"&&(re=t.point)},Gn=(e=performance.now())=>{if(!$||!Ne||!Z||!Fe)return;const t=Xt(e);if(!t){$.style.opacity="0",$.classList.remove("writing-app__dot-snake--waiting"),Z.style.opacity="0";return}if($.style.opacity="1",$.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ne.setAttribute("href",t.snakeHref),V($,Ne,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},te.width,te.height,te.anchorX,te.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){Z.style.opacity="0";return}Fe.setAttribute("href",t.eagleHref),V(Z,Fe,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Ce.anchorX,Ce.anchorY,0)},Un=(e,t)=>{const n=ut(t);if(!n)return!1;if(n.isDot){if(m!=="waiting")return!1;const a=Xt();if(!a)return!1;const s=Math.max(te.width,te.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,v.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Vn=e=>{e.completedStrokes.forEach(t=>{if(Ye.has(t))return;Ye.add(t);const n=Se[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=Ut(t);a&&Ae.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:Pe(a.tangent)})})},Xn=()=>{Ue.forEach((e,t)=>{const n=Ae.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}gt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},pt=()=>{Ue.forEach(e=>{e.style.opacity="0"})},Kn=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,d=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*d,y:a.y+(s.y-a.y)*d}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},jt=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return Kn(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},jn=e=>{const t=M[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=jt(_,n),a=ie({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:ie({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},Zn=()=>{S=Math.min(S+1,M.length),_e=S-1<me.length?S-1:null,tn(),be(),Ve()},Zt=e=>{if(w||k||b||T||M.length<=S)return!1;const t=S-1,n=M[t];return!n||Gt(e)<n.endDistance-8?!1:(T=!0,I=null,L=0,D=jn(t+1),D&&We(n.endPoint,D,!0),Zn(),l==null||l.end(),Qt(),x(),!0)},zn=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/kn));return Array.from({length:s},(i,d)=>{const g=jt(e,n.startDistance+a*(d+1)/(s+1));return{x:g.x,y:g.y,emoji:je[(r+d)%je.length]??je[0],captured:!1,groupIndex:r}})}),zt=()=>{S=M.length>0?1:0,_e=me.length>0?0:null,q.forEach(e=>{e.captured=!1}),Ge.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),tn(),be()},ft=()=>{const e=Math.max(3,Math.min(et,Math.floor(it/St)));return Math.min(e,1+Math.floor(E/St))},Qt=()=>{if(w||k||b){I=null,L=0;return}if(!T)return;const e=dt(E,ft(),G).bodyCount;Nn((e+1)*G)},V=(e,t,n,r,a,s,i,d)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+d).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},Qe=e=>{const t=f[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(f.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<f.length;r+=1){const a=f[r-1],s=f[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,d=i>0?(e-a.distance)/i:0,g=a.x+(s.x-a.x)*d,y=a.y+(s.y-a.y)*d;return{x:g,y,angle:Pe({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...f[f.length-1]??t,distance:e}},Jt=()=>{ne==null||ne.style.setProperty("opacity","0"),W==null||W.style.setProperty("opacity","0"),ot.forEach(e=>{e.style.opacity="0"})},C=(e=performance.now())=>{if(!Te||!ne||!$e||!W||f.length===0)return;if(w||b){Te.style.opacity="0";return}Te.style.opacity="1";const t=k?xe:ft(),n=k?0:h,r=dt(E,t,G),a=r.bodyCount,s=Qe(E);$e.setAttribute("href",e<lt?hn:Ee),V(ne,$e,s,v.width,v.height,v.anchorX,v.anchorY,v.rotationOffset),ot.forEach((y,p)=>{if(p>=a){y.style.opacity="0";return}const P=y.querySelector("image");if(!P)return;const K=Math.max(0,(p+1)*G-n);if(K<=xt){y.style.opacity="0";return}const Xe=Qe(Math.max(0,E-K));V(y,P,Xe,N.width,N.height,N.anchorX,N.anchorY,N.rotationOffset)});const i=W.querySelector("image");if(!i)return;const d=Math.max(0,(a+1)*G-n);if(!r.showTail||d<=xt){W.style.opacity="0";return}const g=Qe(Math.max(0,E-d));V(W,i,g,F.width,F.height,F.anchorX,F.anchorY,F.rotationOffset)},ht=(e,t,n=!0)=>{const r=ie(t);f=[{x:e.x,y:e.y,angle:Pe(r),distance:0,visible:n}],E=0,lt=0,h=0,A=0,I=null,L=0,D=null,T=!1,b=!1,k=!1,xe=0,ve(),O!==null&&(cancelAnimationFrame(O),O=null),C()},We=(e,t,n)=>{const r=ie(t),a=Pe(r),s=f[f.length-1];if(!s){ht(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?f[f.length-1]={...s,x:e.x,y:e.y,angle:a}:(f.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),E=s.distance+.001),C();return}E=s.distance+i,f.push({x:e.x,y:e.y,angle:a,distance:E,visible:n}),Ln(),C()},Et=(e,t,n)=>{const r=ie(t),a=[];r.x>.001?a.push((Be+Q-e.x)/r.x):r.x<-.001&&a.push((-Q-e.x)/r.x),r.y>.001?a.push((nt+Q-e.y)/r.y):r.y<-.001&&a.push((-Q-e.y)/r.y);const s=a.filter(d=>Number.isFinite(d)&&d>0).reduce((d,g)=>Math.min(d,g),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Be,nt)+Q)+(n+2)*G+Q},Qn=(e,t)=>{if(k||b)return;ve(),h=0,A=0,I=null,L=0,D=null,T=!1;const n=ie(t),r=performance.now();xe=ft();const a=Et(e,n,xe);he=Ae.map(i=>({...i,travelDistance:Et(i.point,i.tangent,0)})),k=!0,se(!1);const s=i=>{const d=Math.max(0,i-r)/1e3,g=Math.min(a,d*Ze);We({x:e.x+n.x*g,y:e.y+n.y*g},n,!0),he.forEach(p=>{const P=Ue.get(p.strokeIndex);if(!P)return;const K=Math.min(p.travelDistance,d*Ze);gt(P,{point:{x:p.point.x+p.tangent.x*K,y:p.point.y+p.tangent.y*K},tangent:p.tangent,angle:p.angle})});const y=he.every(p=>d*Ze>=p.travelDistance);if(g>=a&&y){k=!1,b=!0,O=null,Jt(),pt(),se(!0);return}O=requestAnimationFrame(s)};O=requestAnimationFrame(s)},en=e=>{let t=!1;const n=Math.max(24,It*.55);q.forEach((r,a)=>{if(r.captured||r.groupIndex>=S||Math.hypot(e.x-r.x,e.y-r.y)>n)return;r.captured=!0;const i=Ge[a];i&&i.classList.add("writing-app__fruit--captured"),t=!0}),t&&(lt=performance.now()+En,be(),C())},tn=()=>{if(!ee)return;const e=_e!==null?me[_e]:void 0;if(!e){ee.classList.add("writing-app__boundary-star--hidden");return}ee.classList.remove("writing-app__boundary-star--hidden"),ee.setAttribute("x",`${e.x}`),ee.setAttribute("y",`${e.y}`)},Jn=e=>{const t=D!==null&&(!e.isPenDown||e.activeStrokeProgress<.12);D&&!t&&(D=null);const n=t&&D?D:e.cursorTangent;if(we(e)){const r=Vt(e),a=f[f.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&We(r.point,r.tangent,!0)}else We(e.cursorPoint,n,!0);!w&&e.isPenDown&&(en(e.cursorPoint),In(e),Zt(e))},at=()=>{fe!==null&&(cancelAnimationFrame(fe),fe=null),w=!1,ae.disabled=!1,ae.textContent="Show me",pe.forEach((e,t)=>{const n=qe[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),R&&(R.style.opacity="0"),be(),C(),x()},At=()=>{l==null||l.reset(),H=null,X=null,se(!1),b=!1,k=!1,xe=0,Ae=[],Ye=new Set,he=[],oe(),O!==null&&(cancelAnimationFrame(O),O=null),ge.forEach((t,n)=>{const r=Re[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),ve(),h=0,A=0,I=null,L=0,D=null,T=!1;const e=l==null?void 0:l.getState();e?ht(e.cursorPoint,e.cursorTangent,!0):Jt(),pt(),zt(),Ve(),x()},x=()=>{ze||(ze=!0,requestAnimationFrame(()=>{ze=!1,er()}))},er=()=>{if(!l)return;const e=l.getState();Qt(),Vn(e),Wn(e),Gn(),Rn(e),!k&&!b&&Xn();const t=new Set(e.completedStrokes);if(ge.forEach((n,r)=>{const a=Re[r]??0;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!w&&!k&&!b?Jn(e):C(),e.status==="complete"){if(!w&&!k&&!b){const n=Hn(e);Qn(n.point,n.tangent)}se(b);return}se(!1)},tr=()=>{if(!ye||w)return;At(),at();const e=new dn(ye,{speed:1.7*_t,penUpSpeed:2.1*_t,deferredDelayMs:150});w=!0,ae.disabled=!0,ae.textContent="Showing...",be(),C();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),d=new Set(i.completedStrokes);if(pe.forEach((g,y)=>{const p=qe[y]??.001;if(d.has(y)){g.style.strokeDashoffset="0";return}if(y===i.activeStrokeIndex){const P=p*(1-i.activeStrokeProgress);g.style.strokeDashoffset=`${Math.max(0,P)}`;return}g.style.strokeDashoffset=`${p}`}),R&&(R.setAttribute("cx",i.point.x.toFixed(2)),R.setAttribute("cy",i.point.y.toFixed(2)),R.style.opacity=a<=e.totalDuration+mt?"1":"0"),a<e.totalDuration+mt){fe=requestAnimationFrame(n);return}at(),At()};fe=requestAnimationFrame(n),x()},nn=(e,t,n,r)=>{Be=t,nt=n;const a=ln(e);_=a,Se=e.strokes.filter(o=>o.type!=="lift"),it=a.strokes.reduce((o,c)=>o+c.totalLength,0),M=gn(a).groups,me=M.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),_e=me.length>0?0:null,S=M.length>0?1:0,l=new cn(a,{startTolerance:Oe,hitTolerance:Oe}),H=null,q=zn(a,M),He.innerHTML=q.map((o,c)=>`
        <span class="writing-app__fruit-progress-item" data-fruit-progress-index="${c}">
          ${o.emoji}
        </span>
      `).join(""),qt=Array.from(He.querySelectorAll(".writing-app__fruit-progress-item"));const i=Se,d=i.map(o=>`<path class="writing-app__stroke-bg" d="${Ke(o.curves)}"></path>`).join(""),g=i.map(o=>`<path class="writing-app__stroke-trace" d="${Ke(o.curves)}"></path>`).join(""),y=i.map(o=>`<path class="writing-app__stroke-demo" d="${Ke(o.curves)}"></path>`).join(""),p=i.flatMap(o=>o.curves.map(c=>`
          <path
            class="writing-app__debug-curve"
            d="M ${c.p0.x} ${c.p0.y} C ${c.p1.x} ${c.p1.y} ${c.p2.x} ${c.p2.y} ${c.p3.x} ${c.p3.y}"
          ></path>
        `)).join(""),P=q.map((o,c)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${c}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${It}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),K=Array.from({length:et},(o,c)=>`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${et-1-c}"
      >
        <image
          href="${vt}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `).join(""),Xe=i.map((o,c)=>o.deferred?c:null).filter(o=>o!==null).map(o=>wt(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");u.setAttribute("viewBox",`0 0 ${t} ${n}`),u.innerHTML=`
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
    ${d}
    ${p}
    ${g}
    ${y}
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
          href="${Dt}"
          preserveAspectRatio="none"
        ></image>
      </g>
      ${K}
      <g
        class="writing-app__snake-segment writing-app__snake-head"
        id="snake-head"
      >
        <image
          id="snake-head-image"
          href="${Ee}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${P}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${Xe}
    </g>
    ${wt('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Me}"
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
  `,ge=Array.from(u.querySelectorAll(".writing-app__stroke-trace")),pe=Array.from(u.querySelectorAll(".writing-app__stroke-demo")),Ge=Array.from(u.querySelectorAll(".writing-app__fruit")),ee=u.querySelector("#waypoint-star"),Te=u.querySelector("#trace-snake"),ne=u.querySelector("#snake-head"),$e=u.querySelector("#snake-head-image"),W=u.querySelector("#snake-tail"),ot=Array.from(u.querySelectorAll(".writing-app__snake-body")).sort((o,c)=>Number(o.dataset.snakeBodyIndex)-Number(c.dataset.snakeBodyIndex)),de=u.querySelector("#deferred-head"),Ue=new Map(Array.from(u.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),$=u.querySelector("#dot-snake"),Ne=u.querySelector("#dot-snake-image"),Z=u.querySelector("#dot-eagle"),Fe=u.querySelector("#dot-eagle-image"),R=u.querySelector("#demo-nib"),Re=ge.map(o=>{const c=o.getTotalLength();return Number.isFinite(c)&&c>0?c:.001}),qe=pe.map(o=>{const c=o.getTotalLength();return Number.isFinite(c)&&c>0?c:.001}),ge.forEach((o,c)=>{const B=Re[c]??.001;o.style.strokeDasharray=`${B} ${B}`,o.style.strokeDashoffset=`${B}`}),pe.forEach((o,c)=>{const B=qe[c]??.001;o.style.strokeDasharray=`${B} ${B}`,o.style.strokeDashoffset=`${B}`}),R&&(R.style.opacity="0");const yt=l.getState();ht(yt.cursorPoint,yt.cursorTangent),Ae=[],Ye=new Set,he=[],oe(),pt(),zt(),Ve(),se(!1),x()},nr=e=>{at(),Ft.textContent=e;const t=bt(e);ye=t.path,nn(t.path,t.width,t.height,t.offsetY)},rn=()=>{Ie=un(Ie),nr(Le[Ie]??Le[0])},rr=e=>{if(w||!l||H!==null)return;const t=Pt(u,e),n=l.getState(),r=ct(n);if(we(n)&&!Un(t,n))return;if(we(n)&&(r!=null&&r.isDot)){e.preventDefault(),Yn();return}l.beginAt(t)&&(e.preventDefault(),T=!1,H=e.pointerId,X=t,Dn(),h>.5&&Fn(),u.setPointerCapture(e.pointerId),x())},ar=e=>{if(!(w||!l||e.pointerId!==H)){if(e.preventDefault(),X=Pt(u,e),T){Yt(),x();return}l.update(X),x()}},sr=e=>{!l||e.pointerId!==H||(l.end(),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),H=null,X=null,x())},ir=e=>{e.pointerId===H&&(l==null||l.end(),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),H=null,X=null,x())};u.addEventListener("pointerdown",rr);u.addEventListener("pointermove",ar);u.addEventListener("pointerup",sr);u.addEventListener("pointercancel",ir);ae.addEventListener("click",tr);Ht.addEventListener("click",rn);tt.addEventListener("input",()=>{if(Oe=Number(tt.value),Ot(),ye){const e=bt(Le[Ie]??Le[0]);ye=e.path,nn(e.path,e.width,e.height,e.offsetY)}});Ot();rn();
