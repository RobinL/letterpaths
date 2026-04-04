import{M as pn,a as gn,T as fn,f as hn,W as wt,b as yn,c as mn,d as _n,e as ze,A as Sn,g as $t,h as Et}from"./shared-n7GYFNh1.js";import{a as xn}from"./groups-Cr1poJ62.js";const Lt="/letterpaths/writing_app/assets/body-DDjZTdeu.png",Nt="/letterpaths/writing_app/assets/body_bulge-CHgMxuio.png",kn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",tt="/letterpaths/writing_app/assets/eagle_fly-DH3HgPCL.png",wn="/letterpaths/writing_app/assets/eagle_stand-DGP6P_VP.png",En="/letterpaths/writing_app/assets/head_alt-vjLDS9b1.png",bn="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",An="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",vn="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",Dn="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Pn="/letterpaths/writing_app/assets/snake_facing_camera_angry-CFtVEFwY.png",Le="/letterpaths/writing_app/assets/snake_facing_camera_happy-D-RY1-aU.png",De="/letterpaths/writing_app/assets/head-7zYObEXI.png",Ft="/letterpaths/writing_app/assets/tail-q7Mcy-Q-.png",Ze=["🍎","🍐","🍊","🍓","🍇","🍒","🍉","🥝"],Ct=240,Mn=44,In=180,bt=.75,G=76,At=115,Tn=.25,Ht=.12,$n=.42,nt=10,J=260,Qe=340,Ln=220,Nn=700,vt=6,M={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},W={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Fn={...W,height:W.height*(209/431/(160/435))},N={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},ee=.78,de=44,Rt=700,Cn=260,qt=800,Hn=18,j={width:200,height:106},ne={width:69,height:49,anchorX:.5,anchorY:.62},Re={width:128,height:141,anchorX:.5,anchorY:1},Rn=[bn,An,vn,Dn],ct=document.querySelector("#app");if(!ct)throw new Error("Missing #app element for snake app.");ct.innerHTML=`
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Instructions: Drag the snake around the letters</p>
            <h1 class="writing-app__word" id="word-label"></h1>
            <div class="writing-app__fruit-progress" id="fruit-progress" aria-hidden="true"></div>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Demo
          </button>
        </header>

        <div class="writing-app__control-strip writing-app__control-strip--floating">
          <label class="writing-app__tolerance" for="tolerance-slider">
            <span class="writing-app__tolerance-label">
              Tolerance
              <span class="writing-app__tolerance-value" id="tolerance-value"></span>
            </span>
            <input
              class="writing-app__tolerance-slider"
              id="tolerance-slider"
              type="range"
              min="${pn}"
              max="${gn}"
              step="${fn}"
              value="${Ct}"
            />
          </label>
        </div>

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
`;ct.style.setProperty("--snake-board-image",`url("${kn}")`);const Ot=document.querySelector("#word-label"),qe=document.querySelector("#fruit-progress"),Wt=document.querySelector("#score-summary"),u=document.querySelector("#trace-svg"),se=document.querySelector("#show-me-button"),Bt=document.querySelector("#success-overlay"),Yt=document.querySelector("#custom-word-form"),Ve=document.querySelector("#custom-word-input"),oe=document.querySelector("#custom-word-error"),Gt=document.querySelector("#next-word-button"),rt=document.querySelector("#tolerance-slider"),Ut=document.querySelector("#tolerance-value");if(!Ot||!qe||!Wt||!u||!se||!Bt||!Yt||!Ve||!oe||!Gt||!rt||!Ut)throw new Error("Missing elements for snake app.");let ut=-1,at="",st=null,l=null,C=null,X=null,Je=!1,he=[],Oe=[],ye=[],We=[],R=null,me=null,x=!1,Be=Ct,q=[],Xe=[],Vt=[],I=[],Se=[],xe=null,S=1,te=null,Ye=1600,ot=900,dt=0,_=null,ke=[],Ne=null,re=null,Fe=null,pt=[],Y=null,ge=null,Ke=new Map,L=null,Ce=null,z=null,He=null,h=[],A=0,we=0,Q=null,gt=0,y=0,v=0,Z=null,T=null,F=0,O=null,U=null,w=!1,D=!1,Ee=0,Pe=[],Ge=new Set,_e=[],m="hidden",be=null,ae=null,B=0,P=null,E=!1,$e=null,pe=[],Dt=!1,it=-1,fe=Number.POSITIVE_INFINITY;const Xt=()=>{Ut.textContent=`${Be}px`},Kt=()=>{oe.hidden=!0,oe.textContent=""},Pt=e=>{oe.hidden=!1,oe.textContent=e},qn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),jt=()=>$e||($e=Rn.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=Ht,t}),$e),On=()=>{Dt||(jt().forEach(e=>{e.load()}),Dt=!0)},Wn=()=>{const e=jt(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=Ht,pe.push(r),r.addEventListener("ended",()=>{pe=pe.filter(a=>a!==r)}),r.addEventListener("error",()=>{pe=pe.filter(a=>a!==r)}),r.play().catch(()=>{})},je=()=>{const e=S>0?S-1:-1,t=e>=0?I[e]:null;it=e,fe=t?t.startDistance+G:Number.POSITIVE_INFINITY},Bn=e=>{if(!e.isPenDown||x||w||D||E)return;const t=S>0?S-1:-1,n=t>=0?I[t]:null;if(!n){fe=Number.POSITIVE_INFINITY,it=t;return}t!==it&&je();const r=Ae(e);let a=!1;for(;r>=fe&&fe<=n.endDistance;)Math.random()<$n&&(a=!0),fe+=G;a&&Wn()},Me=()=>{const e=x;Xe.forEach(t=>{const n=q[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=S;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),Vt.forEach((t,n)=>{const r=q[n],a=e||!r||r.groupIndex>=S;t.classList.toggle("writing-app__fruit-progress-item--captured",!!(r!=null&&r.captured)),t.classList.toggle("writing-app__fruit-progress-item--hidden",a)}),qe.classList.toggle("writing-app__fruit-progress--hidden",e||q.length===0),Wt.textContent=q.length===0?"Nice tracing.":"All the fruit is collected."},ie=e=>{Bt.hidden=!e},le=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},ue=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Yn=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},Ie=()=>{Z!==null&&(cancelAnimationFrame(Z),Z=null)},Gn=()=>{if(Ie(),Math.abs(y-v)<.5){y=v,$();return}let e=null;const t=n=>{if(e===null){e=n,Z=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*Nn,s=v-y;if(Math.abs(s)<=a){y=v,Z=null,$(),zt();return}y+=Math.sign(s)*a,$(),Z=requestAnimationFrame(t)};Z=requestAnimationFrame(t)},Un=e=>{const t=Math.max(0,e);Math.abs(t-v)<.5||(v=t,Gn())},Vn=()=>{Ie(),v=y,T=A,F=y},zt=()=>{if(!E||C===null||!X||!l||y>.5)return!1;const e=l.getState();return l.beginAt(e.cursorPoint)?(E=!1,T=A,F=y,l.update(X),k(),!0):!1},Xn=()=>{if(T===null)return;const e=Math.max(0,A-T),t=Math.max(0,F-e);if(Math.abs(t-y)<.5){t<=.5&&(y=0,v=0,T=null,F=0);return}y=t,v=t,t<=.5&&(y=0,v=0,T=null,F=0)},ft=e=>(_==null?void 0:_.strokes[e.activeStrokeIndex])??null,Kn=e=>ke[e.activeStrokeIndex]??null,Zt=e=>{const t=_==null?void 0:_.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},Ae=e=>{var n;if(!_)return 0;if(e.status==="complete")return dt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=_.strokes[r])==null?void 0:n.totalLength)??0;return t+Zt(e)},ve=e=>{var t;return((t=Kn(e))==null?void 0:t.deferred)===!0},ht=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},Qt=e=>{const t=_==null?void 0:_.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},Jt=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=ke[t];if(!(!n||n.deferred))return Qt(t)}return null},jn=e=>{if(ve(e)){const n=Jt(e);if(n)return n}const t=[...h].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:Yn(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},yt=e=>{var t;return x||w||D||e.status==="complete"||!ve(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=ft(e))==null?void 0:t.isDot)===!0}},zn=e=>{if(!ge)return;const t=yt(e);if(!t){ge.style.opacity="0";return}if(t.isDot){ge.style.opacity="0";return}mt(ge,{point:t.point,tangent:t.tangent,angle:ue(t.tangent)},{isDot:!1,headHref:De,travelledDistance:Zt(e)})},mt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),i=r==null?void 0:r.querySelector("image"),c=a==null?void 0:a.querySelector("image"),p=s==null?void 0:s.querySelector("image");if(!r||!i)return;if(e.style.opacity="1",i.setAttribute("href",n.headHref??De),V(r,i,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},M.width*ee,M.height*ee,M.anchorX,M.anchorY,M.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const f=ht(n.travelledDistance??Number.POSITIVE_INFINITY,1,de);if(f.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const g={x:t.point.x-t.tangent.x*de,y:t.point.y-t.tangent.y*de},b={x:t.point.x-t.tangent.x*de*2,y:t.point.y-t.tangent.y*de*2};a&&c&&V(a,c,{x:g.x,y:g.y,angle:t.angle,visible:!0},W.width*ee,W.height*ee,W.anchorX,W.anchorY,W.rotationOffset),s&&p&&f.showTail?V(s,p,{x:b.x,y:b.y,angle:t.angle,visible:!0},N.width*ee,N.height*ee,N.anchorX,N.anchorY,N.rotationOffset):s&&(s.style.opacity="0")},Mt=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${Ft}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Lt}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${De}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,ce=()=>{U!==null&&(cancelAnimationFrame(U),U=null),m="hidden",be=null,ae=null,L&&(L.style.opacity="0",L.classList.remove("writing-app__dot-snake--waiting")),z&&(z.style.opacity="0")},Zn=e=>({x:e.x,y:e.y-Hn}),Qn=e=>({x:e.x,y:e.y+8}),en=(e=performance.now())=>{if(m==="hidden"||!ae)return null;const t=Qn(ae),n=Zn(ae);if(m==="waiting")return{snakePoint:t,snakeHref:Le,snakeWobble:!0};if(m==="eagle_in"){const i=Math.max(0,Math.min(1,(e-B)/Rt)),c=1-(1-i)*(1-i);return{snakePoint:t,snakeHref:Le,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+j.height)*c},eagleHref:tt,eagleWidth:j.width,eagleHeight:j.height}}if(m==="eagle_stand")return{snakePoint:t,snakeHref:Le,snakeWobble:!1,eaglePoint:n,eagleHref:wn,eagleWidth:Re.width,eagleHeight:Re.height};const r=Math.max(0,Math.min(1,(e-B)/qt)),a=1-(1-r)*(1-r),s={x:n.x+(Ye+j.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+j.height*.6},snakeHref:Pn,snakeWobble:!1,eaglePoint:s,eagleHref:tt,eagleWidth:j.width,eagleHeight:j.height}},Jn=()=>{var t;const e=l==null?void 0:l.getState();if(!l||!e){ce(),k();return}if(be!==null&&e.activeStrokeIndex===be&&((t=ft(e))!=null&&t.isDot)){l.beginAt(e.cursorPoint);const n=l.getState();ln(Ae(n)),rn(n)}ce(),k()},tn=e=>{if(U=null,!(m==="hidden"||m==="waiting")){if(m==="eagle_in"&&e-B>=Rt)m="eagle_stand",B=e;else if(m==="eagle_stand"&&e-B>=Cn)m="eagle_out",B=e;else if(m==="eagle_out"&&e-B>=qt){Jn();return}k(),U=requestAnimationFrame(tn)}},er=()=>{m==="waiting"&&(m="eagle_in",B=performance.now(),U!==null&&cancelAnimationFrame(U),U=requestAnimationFrame(tn),k())},tr=e=>{const t=yt(e);if(!(t!=null&&t.isDot)){ce();return}be!==t.strokeIndex?(ce(),be=t.strokeIndex,ae=t.point,m="waiting"):m==="waiting"&&(ae=t.point)},nr=(e=performance.now())=>{if(!L||!Ce||!z||!He)return;const t=en(e);if(!t){L.style.opacity="0",L.classList.remove("writing-app__dot-snake--waiting"),z.style.opacity="0";return}if(L.style.opacity="1",L.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ce.setAttribute("href",t.snakeHref),V(L,Ce,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},ne.width,ne.height,ne.anchorX,ne.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){z.style.opacity="0";return}He.setAttribute("href",t.eagleHref),V(z,He,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Re.anchorX,Re.anchorY,0)},rr=(e,t)=>{const n=yt(t);if(!n)return!1;if(n.isDot){if(m!=="waiting")return!1;const a=en();if(!a)return!1;const s=Math.max(ne.width,ne.height)*.36;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,M.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},ar=e=>{e.completedStrokes.forEach(t=>{if(Ge.has(t))return;Ge.add(t);const n=ke[t],r=_==null?void 0:_.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=Qt(t);a&&Pe.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:ue(a.tangent)})})},sr=()=>{Ke.forEach((e,t)=>{const n=Pe.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}mt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},_t=()=>{Ke.forEach(e=>{e.style.opacity="0"})},or=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const i=s.distanceAlongStroke-a.distanceAlongStroke,c=i>0?(t-a.distanceAlongStroke)/i:0;return{x:a.x+(s.x-a.x)*c,y:a.y+(s.y-a.y)*c}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},nn=(e,t)=>{let n=t;for(let r=0;r<e.strokes.length;r+=1){const a=e.strokes[r];if(a){if(n<=a.totalLength||r===e.strokes.length-1)return or(a.samples,Math.max(0,Math.min(n,a.totalLength)));n-=a.totalLength}}return{x:0,y:0}},ir=e=>{const t=I[e];if(!t||!_)return null;const n=Math.min(t.endDistance,t.startDistance+24),r=nn(_,n),a=le({x:r.x-t.startPoint.x,y:r.y-t.startPoint.y});return Math.hypot(a.x,a.y)>.001?a:le({x:t.endPoint.x-t.startPoint.x,y:t.endPoint.y-t.startPoint.y})},lr=()=>{S=Math.min(S+1,I.length),xe=S-1<Se.length?S-1:null,cn(),Me(),je()},rn=e=>{if(x||w||D||E||I.length<=S)return!1;const t=S-1,n=I[t];return!n||Ae(e)<n.endDistance-8?!1:(E=!0,T=null,F=0,Q=n.endDistance,P=ir(t+1),P&&(we=ue(P),Ue(n.endPoint,P,!0)),lr(),l==null||l.end(),sn(),k(),!0)},cr=(e,t)=>t.flatMap((n,r)=>{const a=n.endDistance-n.startDistance;if(a<=0)return[];const s=Math.max(1,Math.round(a/In));return Array.from({length:s},(i,c)=>{const p=n.startDistance+a*(c+1)/(s+1),f=nn(e,p);return{x:f.x,y:f.y,pathDistance:p,emoji:Ze[(r+c)%Ze.length]??Ze[0],captured:!1,groupIndex:r}})}),an=()=>{S=I.length>0?1:0,xe=Se.length>0?0:null,q.forEach(e=>{e.captured=!1}),Xe.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),cn(),Me()},St=()=>{const e=Math.max(3,Math.min(nt,Math.floor(dt/At)));return Math.min(e,1+Math.floor(A/At))},sn=()=>{if(x||w||D){T=null,F=0;return}if(!E)return;const e=ht(A,St(),G).bodyCount;Un((e+1)*G)},V=(e,t,n,r,a,s,i,c)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*i).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+c).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},et=e=>{const t=h[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(h.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<h.length;r+=1){const a=h[r-1],s=h[r];if(!a||!s||e>s.distance)continue;const i=s.distance-a.distance,c=i>0?(e-a.distance)/i:0,p=a.x+(s.x-a.x)*c,f=a.y+(s.y-a.y)*c;return{x:p,y:f,angle:ue({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...h[h.length-1]??t,distance:e}},on=()=>{re==null||re.style.setProperty("opacity","0"),Y==null||Y.style.setProperty("opacity","0"),pt.forEach(e=>{e.style.opacity="0"})},$=(e=performance.now())=>{if(!Ne||!re||!Fe||!Y||h.length===0)return;if(x||D){Ne.style.opacity="0";return}Ne.style.opacity="1";const t=w?Ee:St(),n=w?0:y,r=ht(A,t,G),a=r.bodyCount,s=et(A);Fe.setAttribute("href",e<gt?En:De),V(re,Fe,{...s,angle:we},M.width,M.height,M.anchorX,M.anchorY,M.rotationOffset),pt.forEach((f,g)=>{if(g>=a){f.style.opacity="0";return}const b=f.querySelector("image");if(!b)return;const K=Math.max(0,(g+1)*G-n);if(K<=vt){f.style.opacity="0";return}const Te=et(Math.max(0,A-K)),o=b.getAttribute("href")===Nt?Fn:W;V(f,b,Te,o.width,o.height,o.anchorX,o.anchorY,o.rotationOffset)});const i=Y.querySelector("image");if(!i)return;const c=Math.max(0,(a+1)*G-n);if(!r.showTail||c<=vt){Y.style.opacity="0";return}const p=et(Math.max(0,A-c));V(Y,i,p,N.width,N.height,N.anchorX,N.anchorY,N.rotationOffset)},xt=(e,t,n=!0)=>{const r=le(t);we=ue(r),h=[{x:e.x,y:e.y,angle:we,distance:0,visible:n}],A=0,gt=0,y=0,v=0,T=null,F=0,Q=null,P=null,E=!1,D=!1,w=!1,Ee=0,Ie(),O!==null&&(cancelAnimationFrame(O),O=null),$()},Ue=(e,t,n)=>{const r=le(t),a=ue(r);we=a;const s=h[h.length-1];if(!s){xt(e,r,n);return}const i=Math.hypot(e.x-s.x,e.y-s.y);if(i<.5){s.visible===n?h[h.length-1]={...s,x:e.x,y:e.y,angle:a}:(h.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),A=s.distance+.001),$();return}A=s.distance+i,h.push({x:e.x,y:e.y,angle:a,distance:A,visible:n}),Xn(),$()},It=(e,t,n)=>{const r=le(t),a=[];r.x>.001?a.push((Ye+J-e.x)/r.x):r.x<-.001&&a.push((-J-e.x)/r.x),r.y>.001?a.push((ot+J-e.y)/r.y):r.y<-.001&&a.push((-J-e.y)/r.y);const s=a.filter(c=>Number.isFinite(c)&&c>0).reduce((c,p)=>Math.min(c,p),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Ye,ot)+J)+(n+2)*G+J},ur=(e,t)=>{if(w||D)return;Ie(),y=0,v=0,T=null,F=0,Q=null,P=null,E=!1;const n=le(t),r=performance.now();Ee=St();const a=It(e,n,Ee);_e=Pe.map(i=>({...i,travelDistance:It(i.point,i.tangent,0)})),w=!0,ie(!1);const s=i=>{const c=Math.max(0,i-r)/1e3,p=Math.min(a,c*Qe);Ue({x:e.x+n.x*p,y:e.y+n.y*p},n,!0),_e.forEach(g=>{const b=Ke.get(g.strokeIndex);if(!b)return;const K=Math.min(g.travelDistance,c*Qe);mt(b,{point:{x:g.point.x+g.tangent.x*K,y:g.point.y+g.tangent.y*K},tangent:g.tangent,angle:g.angle})});const f=_e.every(g=>c*Qe>=g.travelDistance);if(p>=a&&f){w=!1,D=!0,O=null,on(),_t(),ie(!0);return}O=requestAnimationFrame(s)};O=requestAnimationFrame(s)},ln=e=>{let t=!1;q.forEach((n,r)=>{if(n.captured||n.groupIndex>=S||e+.5<n.pathDistance)return;n.captured=!0;const a=Xe[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(gt=performance.now()+Ln,Me(),$())},cn=()=>{if(!te)return;const e=xe!==null?Se[xe]:void 0;if(!e){te.classList.add("writing-app__boundary-star--hidden");return}te.classList.remove("writing-app__boundary-star--hidden"),te.setAttribute("x",`${e.x}`),te.setAttribute("y",`${e.y}`)},dr=e=>{if(Q!==null){if(Ae(e)+.5<Q){$();return}Q=null}const n=P!==null&&(E||e.isPenDown)&&P?P:e.cursorTangent;if(ve(e)){const r=Jt(e),a=h[h.length-1];r&&(!a||Math.hypot(a.x-r.point.x,a.y-r.point.y)>.5)&&Ue(r.point,r.tangent,!0)}else Ue(e.cursorPoint,n,!0);P&&e.isPenDown&&!E&&(P=null),x||ln(Ae(e)),!x&&e.isPenDown&&(Bn(e),rn(e))},lt=()=>{me!==null&&(cancelAnimationFrame(me),me=null),x=!1,se.disabled=!1,se.textContent="Demo",ye.forEach((e,t)=>{const n=We[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),R&&(R.style.opacity="0"),Me(),$(),k()},Tt=()=>{l==null||l.reset(),C=null,X=null,ie(!1),D=!1,w=!1,Ee=0,Pe=[],Ge=new Set,_e=[],ce(),O!==null&&(cancelAnimationFrame(O),O=null),he.forEach((t,n)=>{const r=Oe[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),Ie(),y=0,v=0,T=null,F=0,Q=null,P=null,E=!1;const e=l==null?void 0:l.getState();e?xt(e.cursorPoint,e.cursorTangent,!0):on(),_t(),an(),je(),k()},k=()=>{Je||(Je=!0,requestAnimationFrame(()=>{Je=!1,pr()}))},pr=()=>{if(!l)return;const e=l.getState();sn(),ar(e),tr(e),nr(),zn(e),!w&&!D&&sr();const t=new Set(e.completedStrokes);if(he.forEach((n,r)=>{const a=Oe[r]??0;if(t.has(r)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!x&&!w&&!D&&!E?dr(e):$(),e.status==="complete"){if(!x&&!w&&!D){const n=jn(e);ur(n.point,n.tangent)}ie(D);return}ie(!1)},gr=()=>{if(!st||x)return;Tt(),lt();const e=new Sn(st,{speed:1.7*bt,penUpSpeed:2.1*bt,deferredDelayMs:150});x=!0,se.disabled=!0,se.textContent="Demo...",Me(),$();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),i=e.getFrame(s),c=new Set(i.completedStrokes);if(ye.forEach((p,f)=>{const g=We[f]??.001;if(c.has(f)){p.style.strokeDashoffset="0";return}if(f===i.activeStrokeIndex){const b=g*(1-i.activeStrokeProgress);p.style.strokeDashoffset=`${Math.max(0,b)}`;return}p.style.strokeDashoffset=`${g}`}),R&&(R.setAttribute("cx",i.point.x.toFixed(2)),R.setAttribute("cy",i.point.y.toFixed(2)),R.style.opacity=a<=e.totalDuration+Et?"1":"0"),a<e.totalDuration+Et){me=requestAnimationFrame(n);return}lt(),Tt()};me=requestAnimationFrame(n),k()},fr=(e,t,n,r)=>{Ye=t,ot=n;const a=mn(e);_=a,ke=e.strokes.filter(o=>o.type!=="lift"),dt=a.strokes.reduce((o,d)=>o+d.totalLength,0),I=xn(a).groups,Se=I.slice(1).map(o=>({x:o.startPoint.x,y:o.startPoint.y})),xe=Se.length>0?0:null,S=I.length>0?1:0,l=new _n(a,{startTolerance:Be,hitTolerance:Be}),C=null,q=cr(a,I),qe.innerHTML=q.map((o,d)=>`
        <span class="writing-app__fruit-progress-item" data-fruit-progress-index="${d}">
          ${o.emoji}
        </span>
      `).join(""),Vt=Array.from(qe.querySelectorAll(".writing-app__fruit-progress-item"));const i=ke,c=i.map(o=>`<path class="writing-app__stroke-bg" d="${ze(o.curves)}"></path>`).join(""),p=i.map(o=>`<path class="writing-app__stroke-trace" d="${ze(o.curves)}"></path>`).join(""),f=i.map(o=>`<path class="writing-app__stroke-demo" d="${ze(o.curves)}"></path>`).join(""),g=q.map((o,d)=>`
        <text
          class="writing-app__fruit"
          data-fruit-index="${d}"
          x="${o.x}"
          y="${o.y}"
          style="font-size: ${Mn}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${o.emoji}</text>
      `).join(""),b=Array.from({length:nt},(o,d)=>{const H=nt-1-d,dn=Math.random()<Tn?Nt:Lt;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${H}"
      >
        <image
          href="${dn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),K=i.map((o,d)=>o.deferred?d:null).filter(o=>o!==null).map(o=>Mt(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${o}"`)).join("");u.setAttribute("viewBox",`0 0 ${t} ${n}`),u.innerHTML=`
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
    ${p}
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
          href="${Ft}"
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
          href="${De}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    ${g}
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${K}
    </g>
    ${Mt('class="writing-app__deferred-head" id="deferred-head"')}
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
        href="${tt}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,he=Array.from(u.querySelectorAll(".writing-app__stroke-trace")),ye=Array.from(u.querySelectorAll(".writing-app__stroke-demo")),Xe=Array.from(u.querySelectorAll(".writing-app__fruit")),te=u.querySelector("#waypoint-star"),Ne=u.querySelector("#trace-snake"),re=u.querySelector("#snake-head"),Fe=u.querySelector("#snake-head-image"),Y=u.querySelector("#snake-tail"),pt=Array.from(u.querySelectorAll(".writing-app__snake-body")).sort((o,d)=>Number(o.dataset.snakeBodyIndex)-Number(d.dataset.snakeBodyIndex)),ge=u.querySelector("#deferred-head"),Ke=new Map(Array.from(u.querySelectorAll("[data-deferred-trail-index]")).map(o=>[Number(o.dataset.deferredTrailIndex),o])),L=u.querySelector("#dot-snake"),Ce=u.querySelector("#dot-snake-image"),z=u.querySelector("#dot-eagle"),He=u.querySelector("#dot-eagle-image"),R=u.querySelector("#demo-nib"),Oe=he.map(o=>{const d=o.getTotalLength();return Number.isFinite(d)&&d>0?d:.001}),We=ye.map(o=>{const d=o.getTotalLength();return Number.isFinite(d)&&d>0?d:.001}),he.forEach((o,d)=>{const H=Oe[d]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),ye.forEach((o,d)=>{const H=We[d]??.001;o.style.strokeDasharray=`${H} ${H}`,o.style.strokeDashoffset=`${H}`}),R&&(R.style.opacity="0");const Te=l.getState();xt(Te.cursorPoint,Te.cursorTangent),Pe=[],Ge=new Set,_e=[],ce(),_t(),an(),je(),ie(!1),k()},hr=(e,t=-1)=>{lt();const n=yn(e);at=e,ut=t,Ot.textContent=e,Ve.value=e,st=n.path,fr(n.path,n.width,n.height,n.offsetY)},kt=(e,t=-1)=>{const n=qn(e);if(!n)return Pt("Type a word first."),!1;try{return hr(n,t),Kt(),!0}catch{return Pt("Couldn't build that word. Try letters supported by the cursive set."),!1}},un=()=>{const e=hn(ut);kt(wt[e]??wt[0],e)},yr=e=>{if(x||!l||C!==null)return;const t=$t(u,e),n=l.getState(),r=ft(n);if(ve(n)&&!rr(t,n))return;if(ve(n)&&(r!=null&&r.isDot)){e.preventDefault(),er();return}l.beginAt(t)&&(e.preventDefault(),E=!1,C=e.pointerId,X=t,On(),y>.5&&Vn(),u.setPointerCapture(e.pointerId),k())},mr=e=>{if(!(x||!l||e.pointerId!==C)){if(e.preventDefault(),X=$t(u,e),E){zt(),k();return}l.update(X),k()}},_r=e=>{!l||e.pointerId!==C||(l.end(),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),C=null,X=null,k())},Sr=e=>{e.pointerId===C&&(l==null||l.end(),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),C=null,X=null,k())};u.addEventListener("pointerdown",yr);u.addEventListener("pointermove",mr);u.addEventListener("pointerup",_r);u.addEventListener("pointercancel",Sr);se.addEventListener("click",gr);Yt.addEventListener("submit",e=>{e.preventDefault(),kt(Ve.value)});Gt.addEventListener("click",un);Ve.addEventListener("input",()=>{oe.hidden||Kt()});rt.addEventListener("input",()=>{Be=Number(rt.value),Xt(),at&&kt(at,ut)});Xt();un();
