import{M as Bn,a as Gn,T as Un,f as Yn,W as Ht,b as Kn,c as Vn,i as Xn,d as jn,e as Ot,A as Qn,g as en,h as Wt}from"./shared-O8RIojwR.js";import{c as zn,f as Zn}from"./formation-arrows-DH7Wx-JM.js";const tn="/letterpaths/writing_app/assets/body-CgvmrS6c.png",nn="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",Jn="/letterpaths/writing_app/assets/background-BdaS-6aw.png",gt="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",er="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",tr="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",nr="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",rr="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",ar="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",sr="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",or="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",ir="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",Ge="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Oe="/letterpaths/writing_app/assets/head-CeHhv_vT.png",rn="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",qt="G-94373ZKHEE",lr=new Set(["localhost","127.0.0.1"]),cr=()=>{if(lr.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",qt);const e=document.createElement("script");e.async=!0,e.src=`https://www.googletagmanager.com/gtag/js?id=${qt}`,document.head.append(e)},ur=()=>{if(!("serviceWorker"in navigator))return;const e="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${e}sw.js`,{scope:e}).catch(t=>{console.error("Failed to register snake service worker.",t)})},dr="🍎",an=150,Bt=.75,G=76,Gt=115,pr=.25,sn=.3,on=.12,gr=.42,ft=10,re=260,ut=510,fr=220,hr=700,Ut=6,vt=12,Yt=24,yr=.65,L={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},K={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},mr={...K,height:K.height*(209/431/(160/435))},$={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},ae=.78,Se=44,ln=700,_r=260,cn=800,Sr=18,xr=.72,z={width:200,height:106},le={width:69,height:49,anchorX:.5,anchorY:.62},Xe={width:128,height:141,anchorX:.5,anchorY:1},wr=[rr,ar,sr,or],kr=26,Er=22,Ar=11,bt=document.querySelector("#app");if(!bt)throw new Error("Missing #app element for snake app.");cr();ur();bt.innerHTML=`
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
                    min="${Bn}"
                    max="${Gn}"
                    step="${Un}"
                    value="${an}"
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
`;bt.style.setProperty("--snake-board-image",`url("${Jn}")`);const un=document.querySelector("#word-label"),dn=document.querySelector("#score-summary"),u=document.querySelector("#trace-svg"),de=document.querySelector("#show-me-button"),Ae=document.querySelector("#settings-menu"),ht=document.querySelector("#tolerance-slider"),pn=document.querySelector("#tolerance-value"),yt=document.querySelector("#include-initial-lead-in"),mt=document.querySelector("#include-final-lead-out"),gn=document.querySelector("#success-overlay"),fn=document.querySelector("#custom-word-form"),rt=document.querySelector("#custom-word-input"),pe=document.querySelector("#custom-word-error"),Dt=document.querySelector("#next-word-button");if(!un||!dn||!u||!de||!Ae||!ht||!pn||!yt||!mt||!gn||!fn||!rt||!pe||!Dt)throw new Error("Missing elements for snake app.");let Tt=-1,_t="",je="current",St=null,c=null,W=null,O=null,dt=!1,ve=[],Qe=[],oe=null,be=[],ze=[],B=null,De=null,v=!1,Ze=an,hn=!0,yn=!0,Me=[],at=[],b=[],Le=[],Ne=null,E=1,ie=null,Je=1600,xt=900,Pt=0,S=null,Ce=[],Ue=null,ce=null,Ye=null,It=[],X=null,ke=null,st=new Map,R=null,Ke=null,Z=null,Ve=null,x=[],D=0,et=0,Re=0,ee=null,Mt=0,w=0,A=0,J=null,H=null,U=0,Y=null,j=null,I=!1,N=!1,$e=0,We=[],tt=new Set,Te=[],y="hidden",ge=null,ue=null,V=0,_=null,f=null,F=null,T=!1,te=null,se=null,xe=[],Kt=!1,Be=null,we=[],Vt=!1,wt=-1,Ee=Number.POSITIVE_INFINITY;const mn=()=>{pn.textContent=`${Ze}px`},Lt=()=>{_t&&On(_t,Tt)},_n=()=>{pe.hidden=!0,pe.textContent=""},Xt=e=>{pe.hidden=!1,pe.textContent=e},Sn=e=>e.trim().replace(/\s+/g," ").toLowerCase(),vr=()=>{const e=new URLSearchParams(window.location.search);return Array.from(e.entries()).flatMap(([t,n])=>t!=="word"&&t!=="words"?[]:n.split(",")).map(Sn).filter(t=>t.length>0)},nt=vr();let Pe=0;const kt=()=>{Dt.textContent=Pe<nt.length?"Next queued word":"Next random word"},br=e=>je==="nextQueued"?nt[Pe]??e:e,jt=()=>{if(Pe>=nt.length)return null;const e=nt[Pe];return Pe+=1,e??null},xn=()=>Be||(Be=wr.map(e=>{const t=new Audio(e);return t.preload="auto",t.volume=on,t}),Be),wn=()=>se||(se=new Audio(nr),se.preload="auto",se.volume=sn,se),Dr=()=>{Kt||(wn().load(),Kt=!0)},Tr=()=>{Vt||(xn().forEach(e=>{e.load()}),Vt=!0)},Pr=()=>{const e=wn(),t=e.currentSrc||e.src;if(!t)return;const n=new Audio(t);n.preload="auto",n.currentTime=0,n.volume=sn,xe.push(n),n.addEventListener("ended",()=>{xe=xe.filter(r=>r!==n)}),n.addEventListener("error",()=>{xe=xe.filter(r=>r!==n)}),n.play().catch(()=>{})},Ir=()=>{const e=xn(),t=e[Math.floor(Math.random()*e.length)],n=(t==null?void 0:t.currentSrc)||(t==null?void 0:t.src);if(!n)return;const r=new Audio(n);r.preload="auto",r.currentTime=0,r.volume=on,we.push(r),r.addEventListener("ended",()=>{we=we.filter(a=>a!==r)}),r.addEventListener("error",()=>{we=we.filter(a=>a!==r)}),r.play().catch(()=>{})},ot=()=>{const e=E>0?E-1:-1,t=e>=0?b[e]:null;wt=e,Ee=t?t.startDistance+G:Number.POSITIVE_INFINITY},Mr=e=>{if(!e.isPenDown||v||I||N||T)return;const t=E>0?E-1:-1,n=t>=0?b[t]:null;if(!n){Ee=Number.POSITIVE_INFINITY,wt=t;return}t!==wt&&ot();const r=ye(e);let a=!1;for(;r>=Ee&&Ee<=n.endDistance;)Math.random()<gr&&(a=!0),Ee+=G;a&&Ir()},qe=()=>{const e=v;at.forEach(t=>{const n=Me[Number(t.dataset.fruitIndex)],r=e||!n||n.captured||n.groupIndex>=E;t.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),t.classList.toggle("writing-app__fruit--hidden",r)}),dn.textContent=Me.length===0?"Nice tracing.":"All the fruit is collected."},fe=e=>{gn.hidden=!e},he=e=>{const t=Math.hypot(e.x,e.y);return t<=.001?{x:1,y:0}:{x:e.x/t,y:e.y/t}},ne=e=>Math.atan2(e.y,e.x)*(180/Math.PI),Lr=e=>{const t=e*Math.PI/180;return{x:Math.cos(t),y:Math.sin(t)}},me=()=>{J!==null&&(cancelAnimationFrame(J),J=null)},Nr=()=>{if(me(),Math.abs(w-A)<.5){w=A,M();return}let e=null;const t=n=>{if(e===null){e=n,J=requestAnimationFrame(t);return}const r=Math.max(0,n-e)/1e3;e=n;const a=r*hr,s=A-w;if(Math.abs(s)<=a){w=A,J=null,M(),kn();return}w+=Math.sign(s)*a,M(),J=requestAnimationFrame(t)};J=requestAnimationFrame(t)},Cr=e=>{const t=Math.max(0,e);Math.abs(t-A)<.5||(A=t,Nr())},Rr=()=>{me(),A=w,H=D,U=w},it=()=>Math.abs(w-A)<.5,$r=()=>{it()||(me(),w=A,M())},Fr=(e,t)=>{const n=he(_??t.cursorTangent),r=te??(f==null?void 0:f.point)??t.cursorPoint,a={x:e.x-r.x,y:e.y-r.y};if(Math.hypot(a.x,a.y)<Yt)return!1;const o=he(a),l=o.x*n.x+o.y*n.y,p=a.x*n.x+a.y*n.y;return l>=yr&&p>=Yt},kn=()=>{if(!T||W===null||!O||!c||!it())return!1;const e=c.getState(),t=(f==null?void 0:f.point)??e.cursorPoint,n=_??e.cursorTangent;return e.status==="tracing"||c.beginAt(e.cursorPoint)?($n(t,n),c.update(O),P(),!0):!1},En=e=>f?Math.max(0,ye(e)-f.overallDistance):0,Hr=e=>{if(!f||!_)return null;const t=En(e);return!T&&t>=vt?null:{point:{x:f.point.x+_.x*t,y:f.point.y+_.y*t},tangent:_}},Or=e=>!f||!_||F===null||D-F>=vt||D<=F||e>F||F-e>G?null:ne(_),Wr=()=>{if(H===null)return;const e=Math.max(0,D-H),t=Math.max(0,U-e);if(Math.abs(t-w)<.5){t<=.5&&(w=0,A=0,H=null,U=0);return}w=t,A=t,t<=.5&&(w=0,A=0,H=null,U=0)},lt=e=>(S==null?void 0:S.strokes[e.activeStrokeIndex])??null,qr=e=>Ce[e.activeStrokeIndex]??null,An=e=>{const t=S==null?void 0:S.strokes[e.activeStrokeIndex];return((t==null?void 0:t.totalLength)??0)*e.activeStrokeProgress},ye=e=>{var n;if(!S)return 0;if(e.status==="complete")return Pt;let t=0;for(let r=0;r<e.activeStrokeIndex;r+=1)t+=((n=S.strokes[r])==null?void 0:n.totalLength)??0;return t+An(e)},Fe=e=>{var t;return((t=qr(e))==null?void 0:t.deferred)===!0},Nt=(e,t,n)=>{const r=Math.max(0,Math.floor(e/n)),a=Math.min(t,r);return{bodyCount:a,showTail:e>=(a+1)*n}},vn=e=>{const t=S==null?void 0:S.strokes[e],n=t==null?void 0:t.samples[t.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},bn=e=>{for(let t=e.activeStrokeIndex-1;t>=0;t-=1){const n=Ce[t];if(!(!n||n.deferred))return vn(t)}return null},Br=e=>{if(Fe(e)){const n=bn(e);if(n)return n}const t=[...x].reverse().find(n=>n.visible);return t?{point:{x:t.x,y:t.y},tangent:Lr(t.angle)}:{point:e.cursorPoint,tangent:e.cursorTangent}},Ct=e=>{var t;return v||e.status==="complete"||!Fe(e)?null:{strokeIndex:e.activeStrokeIndex,point:e.cursorPoint,tangent:e.cursorTangent,isDot:((t=lt(e))==null?void 0:t.isDot)===!0}},Gr=(e,t)=>{var n;return e===t.activeStrokeIndex&&e===ge&&((n=lt(t))==null?void 0:n.isDot)===!0&&y!=="hidden"&&y!=="waiting"},Ur=e=>{if(!ke)return;const t=Ct(e);if(!t){ke.style.opacity="0";return}if(t.isDot){ke.style.opacity="0";return}Rt(ke,{point:t.point,tangent:t.tangent,angle:ne(t.tangent)},{isDot:!1,headHref:Oe,travelledDistance:An(e)})},Rt=(e,t,n={isDot:!1})=>{const r=e.querySelector("[data-deferred-part='head']"),a=e.querySelector("[data-deferred-part='body']"),s=e.querySelector("[data-deferred-part='tail']"),o=r==null?void 0:r.querySelector("image"),l=a==null?void 0:a.querySelector("image"),p=s==null?void 0:s.querySelector("image");if(!r||!o)return;if(e.style.opacity="1",o.setAttribute("href",n.headHref??Oe),Q(r,o,{x:t.point.x,y:t.point.y,angle:t.angle,visible:!0},L.width*ae,L.height*ae,L.anchorX,L.anchorY,L.rotationOffset),n.isDot){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const h=Nt(n.travelledDistance??Number.POSITIVE_INFINITY,1,Se);if(h.bodyCount===0){a&&(a.style.opacity="0"),s&&(s.style.opacity="0");return}const d={x:t.point.x-t.tangent.x*Se,y:t.point.y-t.tangent.y*Se},k={x:t.point.x-t.tangent.x*Se*2,y:t.point.y-t.tangent.y*Se*2};a&&l&&Q(a,l,{x:d.x,y:d.y,angle:t.angle,visible:!0},K.width*ae,K.height*ae,K.anchorX,K.anchorY,K.rotationOffset),s&&p&&h.showTail?Q(s,p,{x:k.x,y:k.y,angle:t.angle,visible:!0},$.width*ae,$.height*ae,$.anchorX,$.anchorY,$.rotationOffset):s&&(s.style.opacity="0")},Qt=e=>`
  <g ${e}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${rn}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${tn}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Oe}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,He=()=>{j!==null&&(cancelAnimationFrame(j),j=null),y="hidden",ge=null,ue=null,R&&(R.style.opacity="0",R.classList.remove("writing-app__dot-snake--waiting")),Z&&(Z.style.opacity="0")},Yr=e=>({x:e.x,y:e.y-Sr}),Kr=e=>({x:e.x,y:e.y+8}),Dn=(e=performance.now())=>{if(y==="hidden"||!ue)return null;const t=Kr(ue),n=Yr(ue);if(y==="waiting")return{snakePoint:t,snakeHref:Ge,snakeWobble:!0};if(y==="eagle_in"){const o=Math.max(0,Math.min(1,(e-V)/ln)),l=1-(1-o)*(1-o);return{snakePoint:t,snakeHref:Ge,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+z.height)*l},eagleHref:gt,eagleWidth:z.width,eagleHeight:z.height}}if(y==="eagle_stand")return{snakePoint:t,snakeHref:Ge,snakeWobble:!1,eaglePoint:n,eagleHref:er,eagleWidth:Xe.width,eagleHeight:Xe.height};const r=Math.max(0,Math.min(1,(e-V)/cn)),a=1-(1-r)*(1-r),s={x:n.x+(Je+z.width-n.x)*a,y:n.y+(-106-n.y)*a};return{snakePoint:{x:s.x,y:s.y+z.height*.6},snakeHref:ir,snakeWobble:!1,eaglePoint:s,eagleHref:gt,eagleWidth:z.width,eagleHeight:z.height}},Tn=()=>{var t;const e=c==null?void 0:c.getState();if(!(!c||!e)&&ge!==null&&e.activeStrokeIndex===ge&&(t=lt(e))!=null&&t.isDot){c.beginAt(e.cursorPoint);const n=c.getState();Fn(ye(n)),Ln(n)}},Vr=()=>{Tn(),He(),P()},Pn=e=>{if(j=null,!(y==="hidden"||y==="waiting")){if(y==="eagle_in"&&e-V>=ln)y="eagle_stand",V=e;else if(y==="eagle_stand"&&e-V>=_r)y="eagle_out",V=e;else if(y==="eagle_out"&&e-V>=cn){Vr();return}P(),j=requestAnimationFrame(Pn)}},Xr=()=>{y==="waiting"&&(Tn(),y="eagle_in",V=performance.now(),j!==null&&cancelAnimationFrame(j),j=requestAnimationFrame(Pn),P())},jr=e=>{const t=Ct(e);if(!(t!=null&&t.isDot)){if(y!=="hidden"&&y!=="waiting")return;He();return}ge!==t.strokeIndex?(He(),ge=t.strokeIndex,ue=t.point,y="waiting"):y==="waiting"&&(ue=t.point)},Qr=(e=performance.now())=>{if(!R||!Ke||!Z||!Ve)return;const t=Dn(e);if(!t){R.style.opacity="0",R.classList.remove("writing-app__dot-snake--waiting"),Z.style.opacity="0";return}if(R.style.opacity="1",R.classList.toggle("writing-app__dot-snake--waiting",t.snakeWobble),Ke.setAttribute("href",t.snakeHref),Q(R,Ke,{x:t.snakePoint.x,y:t.snakePoint.y,angle:0,visible:!0},le.width,le.height,le.anchorX,le.anchorY,0),!t.eaglePoint||!t.eagleHref||!t.eagleWidth||!t.eagleHeight){Z.style.opacity="0";return}Ve.setAttribute("href",t.eagleHref),Q(Z,Ve,{x:t.eaglePoint.x,y:t.eaglePoint.y,angle:0,visible:!0},t.eagleWidth,t.eagleHeight,Xe.anchorX,Xe.anchorY,0)},zr=(e,t)=>{const n=Ct(t);if(!n)return!1;if(n.isDot){if(y!=="waiting")return!1;const a=Dn();if(!a)return!1;const s=Math.max(le.width,le.height)*xr;return Math.hypot(e.x-a.snakePoint.x,e.y-a.snakePoint.y)<=s}const r=Math.max(34,L.width*.52);return Math.hypot(e.x-n.point.x,e.y-n.point.y)<=r},Zr=e=>{e.completedStrokes.forEach(t=>{if(tt.has(t))return;tt.add(t);const n=Ce[t],r=S==null?void 0:S.strokes[t];if(!(n!=null&&n.deferred)||r!=null&&r.isDot)return;const a=vn(t);a&&We.push({strokeIndex:t,point:a.point,tangent:a.tangent,angle:ne(a.tangent)})})},Jr=()=>{st.forEach((e,t)=>{const n=We.find(r=>r.strokeIndex===t);if(!n){e.style.opacity="0";return}Rt(e,{point:n.point,tangent:n.tangent,angle:n.angle})})},$t=()=>{st.forEach(e=>{e.style.opacity="0"})},zt=(e,t)=>{if(e.length===0)return{x:0,y:0};if(e.length===1||t<=0)return{x:e[0].x,y:e[0].y};for(let r=1;r<e.length;r+=1){const a=e[r-1],s=e[r];if(!a||!s||t>s.distanceAlongStroke)continue;const o=s.distanceAlongStroke-a.distanceAlongStroke,l=o>0?(t-a.distanceAlongStroke)/o:0;return{x:a.x+(s.x-a.x)*l,y:a.y+(s.y-a.y)*l}}const n=e[e.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},In=(e,t,n)=>{if(n<=t)return"";const r=[];let a=0;return e.strokes.forEach(s=>{const o=a,l=a+s.totalLength;if(a=l,n<o||t>l)return;const p=Math.max(0,t-o),h=Math.min(s.totalLength,n-o);if(h<p||s.samples.length===0)return;const d=[zt(s.samples,p),...s.samples.filter(m=>m.distanceAlongStroke>p&&m.distanceAlongStroke<h).map(m=>({x:m.x,y:m.y})),zt(s.samples,h)],k=d.filter((m,i)=>{const g=d[i-1];return!g||Math.hypot(m.x-g.x,m.y-g.y)>.01});if(k.length===0)return;const[C,..._e]=k;r.push(`M ${C.x} ${C.y}`),_e.forEach(m=>{r.push(`L ${m.x} ${m.y}`)})}),r.join(" ")},ea=e=>e.map(t=>`${t.x} ${t.y}`).join(" "),Mn=()=>{if(!oe||!S)return;const e=b[E-1];if(!e){oe.setAttribute("d",""),oe.style.opacity="0";return}oe.setAttribute("d",In(S,e.startDistance,e.endDistance)),oe.style.opacity="1"},ta=e=>S?S.boundaries.find(t=>Math.abs(t.overallDistance-e)<=.5)??null:null,na=e=>{const t=b[e];return t?ta(t.endDistance):null},ra=()=>{E=Math.min(E+1,b.length),Ne=E-1<Le.length?E-1:null,Hn(),qe(),ot()},Ln=e=>{if(v||I||N||T||b.length<=E)return!1;const t=E-1,n=b[t];if(!n)return!1;const r=na(t);return ye(e)<n.endDistance-8?!1:(T=!0,H=null,U=0,ee=(r==null?void 0:r.overallDistance)??n.endDistance,f=r,_=(r==null?void 0:r.outgoingTangent)??null,te=O??e.cursorPoint,_&&(Re=ne(_),Ie((r==null?void 0:r.point)??n.endPoint,_,!0),F=D),ra(),c==null||c.end(),Cn(),P(),!0)},aa=(e,t)=>t.slice(0,-1).map((n,r)=>({x:n.endPoint.x,y:n.endPoint.y,pathDistance:n.endDistance,emoji:dr,captured:!1,groupIndex:r})),Nn=()=>{E=b.length>0?1:0,Ne=Le.length>0?0:null,Me.forEach(e=>{e.captured=!1}),at.forEach(e=>{e.style.transition="none",e.classList.remove("writing-app__fruit--captured"),e.classList.remove("writing-app__fruit--hidden"),e.getBoundingClientRect(),e.style.removeProperty("transition")}),Hn(),qe()},Ft=()=>{const e=Math.max(3,Math.min(ft,Math.floor(Pt/Gt)));return Math.min(e,1+Math.floor(et/Gt))},Cn=()=>{if(v||I||N){H=null,U=0;return}if(!T)return;const e=Nt(D,Ft(),G).bodyCount;Cr((e+1)*G)},Q=(e,t,n,r,a,s,o,l)=>{t.setAttribute("x",`${(-r*s).toFixed(2)}`),t.setAttribute("y",`${(-a*o).toFixed(2)}`),t.setAttribute("width",`${r}`),t.setAttribute("height",`${a}`),e.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+l).toFixed(2)})`),e.style.opacity=n.visible?"1":"0"},pt=e=>{const t=x[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(x.length<=1||e<=0)return{...t,distance:Math.max(0,e)};for(let r=1;r<x.length;r+=1){const a=x[r-1],s=x[r];if(!a||!s||e>s.distance)continue;const o=s.distance-a.distance,l=o>0?(e-a.distance)/o:0,p=a.x+(s.x-a.x)*l,h=a.y+(s.y-a.y)*l,d=Or(e);return{x:p,y:h,angle:d??ne({x:s.x-a.x,y:s.y-a.y}),distance:e,visible:s.visible}}return{...x[x.length-1]??t,distance:e}},Rn=()=>{ce==null||ce.style.setProperty("opacity","0"),X==null||X.style.setProperty("opacity","0"),It.forEach(e=>{e.style.opacity="0"})},M=(e=performance.now())=>{if(!Ue||!ce||!Ye||!X||x.length===0)return;if(v||N){Ue.style.opacity="0";return}Ue.style.opacity="1";const t=I?$e:Ft(),n=I?0:w,r=Nt(D,t,G),a=r.bodyCount,s=pt(D);Ye.setAttribute("href",e<Mt?tr:Oe),Q(ce,Ye,{...s,angle:Re},L.width,L.height,L.anchorX,L.anchorY,L.rotationOffset),It.forEach((h,d)=>{if(d>=a){h.style.opacity="0";return}const k=h.querySelector("image");if(!k)return;const C=Math.max(0,(d+1)*G-n);if(C<=Ut){h.style.opacity="0";return}const _e=pt(Math.max(0,D-C)),m=k.getAttribute("href")===nn?mr:K;Q(h,k,_e,m.width,m.height,m.anchorX,m.anchorY,m.rotationOffset)});const o=X.querySelector("image");if(!o)return;const l=Math.max(0,(a+1)*G-n);if(!r.showTail||l<=Ut){X.style.opacity="0";return}const p=pt(Math.max(0,D-l));Q(X,o,p,$.width,$.height,$.anchorX,$.anchorY,$.rotationOffset)},ct=(e,t,n=!0,r={})=>{const a=he(t),s=r.preserveGrowth?et:0,o=r.preserveQueuedTurn?f:null,l=r.preserveQueuedTurn?_:null;Re=ne(a),x=[{x:e.x,y:e.y,angle:Re,distance:0,visible:n}],D=0,et=s,Mt=0,w=0,A=0,H=null,U=0,ee=null,f=o,_=l,F=null,te=null,T=!1,N=!1,I=!1,$e=0,me(),Y!==null&&(cancelAnimationFrame(Y),Y=null),M()},$n=(e,t)=>{ct(e,t,!0,{preserveGrowth:!0,preserveQueuedTurn:!0})},Ie=(e,t,n)=>{const r=he(t),a=ne(r);Re=a;const s=x[x.length-1];if(!s){ct(e,r,n);return}const o=Math.hypot(e.x-s.x,e.y-s.y);if(o<.5){s.visible===n?x[x.length-1]={...s,x:e.x,y:e.y,angle:a}:(x.push({x:e.x,y:e.y,angle:a,distance:s.distance+.001,visible:n}),D=s.distance+.001),M();return}D=s.distance+o,et+=o,x.push({x:e.x,y:e.y,angle:a,distance:D,visible:n}),Wr(),M()},Zt=(e,t,n)=>{const r=he(t),a=[];r.x>.001?a.push((Je+re-e.x)/r.x):r.x<-.001&&a.push((-re-e.x)/r.x),r.y>.001?a.push((xt+re-e.y)/r.y):r.y<-.001&&a.push((-re-e.y)/r.y);const s=a.filter(l=>Number.isFinite(l)&&l>0).reduce((l,p)=>Math.min(l,p),Number.POSITIVE_INFINITY);return(Number.isFinite(s)?s:Math.max(Je,xt)+re)+(n+2)*G+re},sa=(e,t)=>{if(I||N)return;me(),w=0,A=0,H=null,U=0,ee=null,f=null,_=null,F=null,te=null,T=!1;const n=he(t),r=performance.now();$e=Ft();const a=Zt(e,n,$e);Te=We.map(o=>({...o,travelDistance:Zt(o.point,o.tangent,0)})),I=!0,fe(!1);const s=o=>{const l=Math.max(0,o-r)/1e3,p=Math.min(a,l*ut);Ie({x:e.x+n.x*p,y:e.y+n.y*p},n,!0),Te.forEach(d=>{const k=st.get(d.strokeIndex);if(!k)return;const C=Math.min(d.travelDistance,l*ut);Rt(k,{point:{x:d.point.x+d.tangent.x*C,y:d.point.y+d.tangent.y*C},tangent:d.tangent,angle:d.angle})});const h=Te.every(d=>l*ut>=d.travelDistance);if(p>=a&&h){I=!1,N=!0,Y=null,Rn(),$t(),fe(!0);return}Y=requestAnimationFrame(s)};Y=requestAnimationFrame(s)},Fn=e=>{let t=!1;Me.forEach((n,r)=>{if(n.captured||n.groupIndex>=E||e+.5<n.pathDistance)return;n.captured=!0;const a=at[r];a&&a.classList.add("writing-app__fruit--captured"),t=!0}),t&&(Mt=performance.now()+fr,Pr(),qe(),M())},Hn=()=>{if(!ie)return;const e=Ne!==null?Le[Ne]:void 0;if(!e){ie.classList.add("writing-app__boundary-star--hidden");return}ie.classList.remove("writing-app__boundary-star--hidden"),ie.setAttribute("x",`${e.x}`),ie.setAttribute("y",`${e.y}`)},oa=e=>{if(ee!==null){if(ye(e)+.5<ee){M();return}ee=null}const t=Hr(e);if(Fe(e)){const n=bn(e),r=x[x.length-1];n&&(!r||Math.hypot(r.x-n.point.x,r.y-n.point.y)>.5)&&Ie(n.point,n.tangent,!0)}else t?Ie(t.point,t.tangent,!0):Ie(e.cursorPoint,e.cursorTangent,!0);_&&f&&!T&&En(e)>=vt&&(f=null,_=null,F=null,te=null),v||Fn(ye(e)),!v&&e.isPenDown&&(Mr(e),Ln(e))},Et=()=>{De!==null&&(cancelAnimationFrame(De),De=null),v=!1,de.disabled=!1,de.textContent="Demo",be.forEach((e,t)=>{const n=ze[t]??.001;e.style.strokeDasharray=`${n} ${n}`,e.style.strokeDashoffset=`${n}`}),B&&(B.style.opacity="0"),qe(),M(),P()},Jt=()=>{c==null||c.reset(),W=null,O=null,fe(!1),N=!1,I=!1,$e=0,We=[],tt=new Set,Te=[],He(),Y!==null&&(cancelAnimationFrame(Y),Y=null),ve.forEach((t,n)=>{const r=Qe[n]??.001;t.style.strokeDasharray=`${r} ${r}`,t.style.strokeDashoffset=`${r}`}),me(),w=0,A=0,H=null,U=0,ee=null,f=null,_=null,F=null,te=null,T=!1;const e=c==null?void 0:c.getState();e?ct(e.cursorPoint,e.cursorTangent,!0):Rn(),$t(),Nn(),ot(),P()},P=()=>{dt||(dt=!0,requestAnimationFrame(()=>{dt=!1,ia()}))},ia=()=>{if(!c)return;const e=c.getState();Cn(),Zr(e),jr(e),Qr(),Ur(e),Jr(),Mn();const t=new Set(e.completedStrokes);if(ve.forEach((n,r)=>{const a=Qe[r]??0;if(t.has(r)||Gr(r,e)){n.style.strokeDashoffset="0";return}if(r===e.activeStrokeIndex){const s=a*(1-e.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,s)}`;return}n.style.strokeDashoffset=`${a}`}),!v&&!I&&!N&&!T?oa(e):M(),e.status==="complete"){if(!v&&!I&&!N){const n=Br(e);sa(n.point,n.tangent)}fe(N);return}fe(!1)},la=()=>{if(!St||v)return;Jt(),Et();const e=new Qn(St,{speed:1.7*Bt,penUpSpeed:2.1*Bt,deferredDelayMs:150});v=!0,de.disabled=!0,de.textContent="Demo...",qe(),M();const t=performance.now(),n=r=>{const a=r-t,s=Math.min(a,e.totalDuration),o=e.getFrame(s),l=new Set(o.completedStrokes);if(be.forEach((p,h)=>{const d=ze[h]??.001;if(l.has(h)){p.style.strokeDashoffset="0";return}if(h===o.activeStrokeIndex){const k=d*(1-o.activeStrokeProgress);p.style.strokeDashoffset=`${Math.max(0,k)}`;return}p.style.strokeDashoffset=`${d}`}),B&&(B.setAttribute("cx",o.point.x.toFixed(2)),B.setAttribute("cy",o.point.y.toFixed(2)),B.style.opacity=a<=e.totalDuration+Wt?"1":"0"),a<e.totalDuration+Wt){De=requestAnimationFrame(n);return}Et(),Jt()};De=requestAnimationFrame(n),P()},ca=(e,t,n,r)=>{Je=t,xt=n;const a=Vn(e);S=a,Ce=e.strokes.filter(i=>i.type!=="lift"),Pt=a.strokes.reduce((i,g)=>i+g.totalLength,0),b=Xn(a).groups,Le=b.slice(1).map(i=>({x:i.startPoint.x,y:i.startPoint.y})),Ne=Le.length>0?0:null,E=b.length>0?1:0,c=new jn(a,{startTolerance:Ze,hitTolerance:Ze}),W=null,Me=aa(a,b);const o=Ce,l=Math.abs(e.guides.baseline-e.guides.xHeight)/3,p=b.map(i=>`<path class="writing-app__stroke-bg" d="${In(a,i.startDistance,i.endDistance)}"></path>`).join(""),h=zn(a,{retraceTurns:{offset:Math.min(l*.24,13),stemLength:l*.36,head:{length:kr,width:Er,tipExtension:Ar},groups:b}}).map(i=>`
        <path
          class="writing-app__section-arrow"
          d="${Zn(i.commands)}"
        ></path>
        ${i.head?`<polygon class="writing-app__section-arrowhead" points="${ea(i.head.polygon)}"></polygon>`:""}
      `).join(""),d=o.map(i=>`<path class="writing-app__stroke-trace" d="${Ot(i.curves)}"></path>`).join(""),k=o.map(i=>`<path class="writing-app__stroke-demo" d="${Ot(i.curves)}"></path>`).join(""),C=Array.from({length:ft},(i,g)=>{const q=ft-1-g,qn=Math.random()<pr?nn:tn;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${q}"
      >
        <image
          href="${qn}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),_e=o.map((i,g)=>i.deferred?g:null).filter(i=>i!==null).map(i=>Qt(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${i}"`)).join("");u.setAttribute("viewBox",`0 0 ${t} ${n}`),u.innerHTML=`
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
    ${p}
    ${d}
    <path class="writing-app__stroke-next" id="next-section-stroke" d=""></path>
    ${h}
    ${k}
    <text
      class="writing-app__boundary-star"
      id="waypoint-star"
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="middle"
    >🍎</text>
    <g class="writing-app__snake" id="trace-snake">
      <g
        class="writing-app__snake-segment writing-app__snake-tail"
        id="snake-tail"
      >
        <image
          href="${rn}"
          preserveAspectRatio="none"
        ></image>
      </g>
      ${C}
      <g
        class="writing-app__snake-segment writing-app__snake-head"
        id="snake-head"
      >
        <image
          id="snake-head-image"
          href="${Oe}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${_e}
    </g>
    ${Qt('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Ge}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${gt}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,ve=Array.from(u.querySelectorAll(".writing-app__stroke-trace")),oe=u.querySelector("#next-section-stroke"),be=Array.from(u.querySelectorAll(".writing-app__stroke-demo")),at=Array.from(u.querySelectorAll(".writing-app__fruit")),ie=u.querySelector("#waypoint-star"),Ue=u.querySelector("#trace-snake"),ce=u.querySelector("#snake-head"),Ye=u.querySelector("#snake-head-image"),X=u.querySelector("#snake-tail"),It=Array.from(u.querySelectorAll(".writing-app__snake-body")).sort((i,g)=>Number(i.dataset.snakeBodyIndex)-Number(g.dataset.snakeBodyIndex)),ke=u.querySelector("#deferred-head"),st=new Map(Array.from(u.querySelectorAll("[data-deferred-trail-index]")).map(i=>[Number(i.dataset.deferredTrailIndex),i])),R=u.querySelector("#dot-snake"),Ke=u.querySelector("#dot-snake-image"),Z=u.querySelector("#dot-eagle"),Ve=u.querySelector("#dot-eagle-image"),B=u.querySelector("#demo-nib"),Qe=ve.map(i=>{const g=i.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),ze=be.map(i=>{const g=i.getTotalLength();return Number.isFinite(g)&&g>0?g:.001}),ve.forEach((i,g)=>{const q=Qe[g]??.001;i.style.strokeDasharray=`${q} ${q}`,i.style.strokeDashoffset=`${q}`}),be.forEach((i,g)=>{const q=ze[g]??.001;i.style.strokeDasharray=`${q} ${q}`,i.style.strokeDashoffset=`${q}`}),B&&(B.style.opacity="0"),Mn();const m=c.getState();ct(m.cursorPoint,m.cursorTangent),We=[],tt=new Set,Te=[],He(),$t(),Nn(),ot(),fe(!1),P()},On=(e,t=-1)=>{Et();const n=Kn(e,{keepInitialLeadIn:hn,keepFinalLeadOut:yn});_t=e,Tt=t,un.textContent=e,rt.value=br(e),St=n.path,ca(n.path,n.width,n.height,n.offsetY)},At=(e,t=-1)=>{const n=Sn(e);if(!n)return Xt("Type a word first."),!1;try{return On(n,t),_n(),!0}catch{return Xt("Couldn't build that word. Try letters supported by the cursive set."),!1}},Wn=()=>{let e=jt();for(;e;){if(je="nextQueued",At(e)){kt();return}e=jt()}je="current";const t=Yn(Tt);At(Ht[t]??Ht[0],t),kt()},ua=e=>{if(v||!c||W!==null)return;const t=en(u,e),n=c.getState(),r=lt(n),a=T,s=(f==null?void 0:f.point)??n.cursorPoint,o=_??n.cursorTangent;if(Fe(n)&&!zr(t,n))return;if(Fe(n)&&(r!=null&&r.isDot)){e.preventDefault(),Xr();return}c.beginAt(t)&&(e.preventDefault(),a&&(te=t),W=e.pointerId,O=t,Dr(),Tr(),a&&it()?$n(s,o):a||(T=!1),!a&&w>.5&&Rr(),u.setPointerCapture(e.pointerId),P())},da=e=>{if(!(v||!c||e.pointerId!==W)){if(e.preventDefault(),O=en(u,e),T){const t=c.getState();!it()&&Fr(O,t)&&$r(),kn(),P();return}c.update(O),P()}},pa=e=>{!c||e.pointerId!==W||(c.end(),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),W=null,O=null,P())},ga=e=>{e.pointerId===W&&(c==null||c.end(),u.hasPointerCapture(e.pointerId)&&u.releasePointerCapture(e.pointerId),W=null,O=null,P())};u.addEventListener("pointerdown",ua);u.addEventListener("pointermove",da);u.addEventListener("pointerup",pa);u.addEventListener("pointercancel",ga);de.addEventListener("click",la);ht.addEventListener("input",()=>{Ze=Number(ht.value),mn(),Lt()});yt.addEventListener("change",()=>{hn=yt.checked,Lt()});mt.addEventListener("change",()=>{yn=mt.checked,Lt()});fn.addEventListener("submit",e=>{e.preventDefault(),je="current",At(rt.value)});Dt.addEventListener("click",Wn);rt.addEventListener("input",()=>{pe.hidden||_n()});document.addEventListener("pointerdown",e=>{if(!Ae.open)return;const t=e.target;t instanceof Node&&Ae.contains(t)||(Ae.open=!1)});document.addEventListener("keydown",e=>{e.key==="Escape"&&(Ae.open=!1)});mn();kt();Wn();
