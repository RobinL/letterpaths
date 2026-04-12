import{M as dr,a as ur,T as pr,f as gr,W as Je,b as hr,c as fr,d as yr,e as tn,A as mr,g as _n,h as en}from"./shared-DS2AaDLK.js";import{a as xr}from"./groups-Cr1poJ62.js";const Sn="/letterpaths/writing_app/assets/body-CgvmrS6c.png",wn="/letterpaths/writing_app/assets/body_bulge-3F7a2BaQ.png",_r="/letterpaths/writing_app/assets/background-BdaS-6aw.png",Se="/letterpaths/writing_app/assets/eagle_fly-B8oRwixn.png",Sr="/letterpaths/writing_app/assets/eagle_stand-BUSO6ROy.png",wr="/letterpaths/writing_app/assets/head_alt-pvLv00oI.png",kr="/letterpaths/writing_app/assets/chomp-DH3WDSaP.mp3",Er="/letterpaths/writing_app/assets/sand_moving_1-KzDrd5np.mp3",br="/letterpaths/writing_app/assets/sand_moving_2-sOe4GNi-.mp3",Ar="/letterpaths/writing_app/assets/sand_moving_3-Jh4tCIP3.mp3",vr="/letterpaths/writing_app/assets/sand_moving_4-B3GK1boP.mp3",Dr="/letterpaths/writing_app/assets/snake_facing_camera_angry-2NiXjJ76.png",Vt="/letterpaths/writing_app/assets/snake_facing_camera_happy-qG4Zd2aU.png",Ot="/letterpaths/writing_app/assets/head-CeHhv_vT.png",kn="/letterpaths/writing_app/assets/tail-Wt4Hi91f.png",nn="G-94373ZKHEE",Pr=new Set(["localhost","127.0.0.1"]),Mr=()=>{if(Pr.has(window.location.hostname))return;window.dataLayer=window.dataLayer||[],window.gtag=function(){var n;(n=window.dataLayer)==null||n.push(arguments)},window.gtag("js",new Date),window.gtag("config",nn);const t=document.createElement("script");t.async=!0,t.src=`https://www.googletagmanager.com/gtag/js?id=${nn}`,document.head.append(t)},Ir=()=>{if(!("serviceWorker"in navigator))return;const t="/letterpaths/writing_app/snake/";navigator.serviceWorker.register(`${t}sw.js`,{scope:t}).catch(e=>{console.error("Failed to register snake service worker.",e)})},Tr="🍎",En=150,rn=.75,K=76,an=115,Lr=.25,bn=.3,An=.12,$r=.42,we=10,tt=260,me=510,Nr=220,Cr=700,on=6,$={width:97.5,height:60,anchorX:.5,anchorY:.5,rotationOffset:-10},G={width:106.25,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},Fr={...G,height:G.height*(209/431/(160/435))},H={width:55,height:33.75,anchorX:.5,anchorY:.5,rotationOffset:0},et=.78,yt=44,vn=700,Or=260,Dn=800,Hr=18,Rr=.72,z={width:200,height:106},ot={width:69,height:49,anchorX:.5,anchorY:.62},Qt={width:128,height:141,anchorX:.5,anchorY:1},qr=[Er,br,Ar,vr],sn=26,Wr=22,cn=11,$e=document.querySelector("#app");if(!$e)throw new Error("Missing #app element for snake app.");Mr();Ir();$e.innerHTML=`
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
                    min="${dr}"
                    max="${ur}"
                    step="${pr}"
                    value="${En}"
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
`;$e.style.setProperty("--snake-board-image",`url("${_r}")`);const Pn=document.querySelector("#word-label"),Mn=document.querySelector("#score-summary"),g=document.querySelector("#trace-svg"),ct=document.querySelector("#show-me-button"),wt=document.querySelector("#settings-menu"),ke=document.querySelector("#tolerance-slider"),In=document.querySelector("#tolerance-value"),Ee=document.querySelector("#include-initial-lead-in"),be=document.querySelector("#include-final-lead-out"),Tn=document.querySelector("#success-overlay"),Ln=document.querySelector("#custom-word-form"),ie=document.querySelector("#custom-word-input"),lt=document.querySelector("#custom-word-error"),Ne=document.querySelector("#next-word-button");if(!Pn||!Mn||!g||!ct||!wt||!ke||!In||!Ee||!be||!Tn||!Ln||!ie||!lt||!Ne)throw new Error("Missing elements for snake app.");let Ce=-1,Ae="",Jt="current",ve=null,p=null,q=null,j=null,xe=!1,kt=[],te=[],rt=null,Et=[],ee=[],W=null,bt=null,v=!1,ne=En,$n=!0,Nn=!0,Pt=[],ce=[],k=[],Mt=[],It=null,b=1,at=null,re=1600,De=900,Fe=0,m=null,Tt=[],Xt=null,st=null,jt=null,Oe=[],Y=null,_t=null,le=new Map,O=null,zt=null,Z=null,Zt=null,_=[],M=0,Lt=0,J=null,He=0,S=0,I=0,Q=null,N=null,R=0,B=null,V=null,L=!1,C=!1,$t=0,Ht=[],ae=new Set,At=[],y="hidden",dt=null,it=null,U=0,T=null,D=!1,nt=null,mt=[],ln=!1,Kt=null,xt=[],dn=!1,Pe=-1,St=Number.POSITIVE_INFINITY;const Cn=()=>{In.textContent=`${ne}px`},Re=()=>{Ae&&nr(Ae,Ce)},Fn=()=>{lt.hidden=!0,lt.textContent=""},un=t=>{lt.hidden=!1,lt.textContent=t},On=t=>t.trim().replace(/\s+/g," ").toLowerCase(),Br=()=>{const t=new URLSearchParams(window.location.search);return Array.from(t.entries()).flatMap(([e,n])=>e!=="word"&&e!=="words"?[]:n.split(",")).map(On).filter(e=>e.length>0)},oe=Br();let vt=0;const Me=()=>{Ne.textContent=vt<oe.length?"Next queued word":"Next random word"},Gr=t=>Jt==="nextQueued"?oe[vt]??t:t,pn=()=>{if(vt>=oe.length)return null;const t=oe[vt];return vt+=1,t??null},Hn=()=>Kt||(Kt=qr.map(t=>{const e=new Audio(t);return e.preload="auto",e.volume=An,e}),Kt),Rn=()=>nt||(nt=new Audio(kr),nt.preload="auto",nt.volume=bn,nt),Ur=()=>{ln||(Rn().load(),ln=!0)},Yr=()=>{dn||(Hn().forEach(t=>{t.load()}),dn=!0)},Kr=()=>{const t=Rn(),e=t.currentSrc||t.src;if(!e)return;const n=new Audio(e);n.preload="auto",n.currentTime=0,n.volume=bn,mt.push(n),n.addEventListener("ended",()=>{mt=mt.filter(a=>a!==n)}),n.addEventListener("error",()=>{mt=mt.filter(a=>a!==n)}),n.play().catch(()=>{})},Vr=()=>{const t=Hn(),e=t[Math.floor(Math.random()*t.length)],n=(e==null?void 0:e.currentSrc)||(e==null?void 0:e.src);if(!n)return;const a=new Audio(n);a.preload="auto",a.currentTime=0,a.volume=An,xt.push(a),a.addEventListener("ended",()=>{xt=xt.filter(r=>r!==a)}),a.addEventListener("error",()=>{xt=xt.filter(r=>r!==a)}),a.play().catch(()=>{})},de=()=>{const t=b>0?b-1:-1,e=t>=0?k[t]:null;Pe=t,St=e?e.startDistance+K:Number.POSITIVE_INFINITY},Xr=t=>{if(!t.isPenDown||v||L||C||D)return;const e=b>0?b-1:-1,n=e>=0?k[e]:null;if(!n){St=Number.POSITIVE_INFINITY,Pe=e;return}e!==Pe&&de();const a=Nt(t);let r=!1;for(;a>=St&&St<=n.endDistance;)Math.random()<$r&&(r=!0),St+=K;r&&Vr()},Rt=()=>{const t=v;ce.forEach(e=>{const n=Pt[Number(e.dataset.fruitIndex)],a=t||!n||n.captured||n.groupIndex>=b;e.classList.toggle("writing-app__fruit--captured",!!(n!=null&&n.captured)),e.classList.toggle("writing-app__fruit--hidden",a)}),Mn.textContent=Pt.length===0?"Nice tracing.":"All the fruit is collected."},ut=t=>{Tn.hidden=!t},A=t=>{const e=Math.hypot(t.x,t.y);return e<=.001?{x:1,y:0}:{x:t.x/e,y:t.y/e}},pt=t=>Math.atan2(t.y,t.x)*(180/Math.PI),jr=t=>{const e=t*Math.PI/180;return{x:Math.cos(e),y:Math.sin(e)}},qt=()=>{Q!==null&&(cancelAnimationFrame(Q),Q=null)},zr=()=>{if(qt(),Math.abs(S-I)<.5){S=I,F();return}let t=null;const e=n=>{if(t===null){t=n,Q=requestAnimationFrame(e);return}const a=Math.max(0,n-t)/1e3;t=n;const r=a*Cr,o=I-S;if(Math.abs(o)<=r){S=I,Q=null,F(),qn();return}S+=Math.sign(o)*r,F(),Q=requestAnimationFrame(e)};Q=requestAnimationFrame(e)},Zr=t=>{const e=Math.max(0,t);Math.abs(e-I)<.5||(I=e,zr())},Qr=()=>{qt(),I=S,N=M,R=S},qn=()=>{if(!D||q===null||!j||!p||S>.5)return!1;const t=p.getState();return p.beginAt(t.cursorPoint)?(D=!1,N=M,R=S,p.update(j),P(),!0):!1},Jr=()=>{if(N===null)return;const t=Math.max(0,M-N),e=Math.max(0,R-t);if(Math.abs(e-S)<.5){e<=.5&&(S=0,I=0,N=null,R=0);return}S=e,I=e,e<=.5&&(S=0,I=0,N=null,R=0)},ue=t=>(m==null?void 0:m.strokes[t.activeStrokeIndex])??null,ta=t=>Tt[t.activeStrokeIndex]??null,Wn=t=>{const e=m==null?void 0:m.strokes[t.activeStrokeIndex];return((e==null?void 0:e.totalLength)??0)*t.activeStrokeProgress},Nt=t=>{var n;if(!m)return 0;if(t.status==="complete")return Fe;let e=0;for(let a=0;a<t.activeStrokeIndex;a+=1)e+=((n=m.strokes[a])==null?void 0:n.totalLength)??0;return e+Wn(t)},Ct=t=>{var e;return((e=ta(t))==null?void 0:e.deferred)===!0},qe=(t,e,n)=>{const a=Math.max(0,Math.floor(t/n)),r=Math.min(e,a);return{bodyCount:r,showTail:t>=(r+1)*n}},Bn=t=>{const e=m==null?void 0:m.strokes[t],n=e==null?void 0:e.samples[e.samples.length-1];return n?{point:{x:n.x,y:n.y},tangent:n.tangent}:null},Gn=t=>{for(let e=t.activeStrokeIndex-1;e>=0;e-=1){const n=Tt[e];if(!(!n||n.deferred))return Bn(e)}return null},ea=t=>{if(Ct(t)){const n=Gn(t);if(n)return n}const e=[..._].reverse().find(n=>n.visible);return e?{point:{x:e.x,y:e.y},tangent:jr(e.angle)}:{point:t.cursorPoint,tangent:t.cursorTangent}},We=t=>{var e;return v||t.status==="complete"||!Ct(t)?null:{strokeIndex:t.activeStrokeIndex,point:t.cursorPoint,tangent:t.cursorTangent,isDot:((e=ue(t))==null?void 0:e.isDot)===!0}},na=(t,e)=>{var n;return t===e.activeStrokeIndex&&t===dt&&((n=ue(e))==null?void 0:n.isDot)===!0&&y!=="hidden"&&y!=="waiting"},ra=t=>{if(!_t)return;const e=We(t);if(!e){_t.style.opacity="0";return}if(e.isDot){_t.style.opacity="0";return}Be(_t,{point:e.point,tangent:e.tangent,angle:pt(e.tangent)},{isDot:!1,headHref:Ot,travelledDistance:Wn(t)})},Be=(t,e,n={isDot:!1})=>{const a=t.querySelector("[data-deferred-part='head']"),r=t.querySelector("[data-deferred-part='body']"),o=t.querySelector("[data-deferred-part='tail']"),s=a==null?void 0:a.querySelector("image"),i=r==null?void 0:r.querySelector("image"),c=o==null?void 0:o.querySelector("image");if(!a||!s)return;if(t.style.opacity="1",s.setAttribute("href",n.headHref??Ot),X(a,s,{x:e.point.x,y:e.point.y,angle:e.angle,visible:!0},$.width*et,$.height*et,$.anchorX,$.anchorY,$.rotationOffset),n.isDot){r&&(r.style.opacity="0"),o&&(o.style.opacity="0");return}const u=qe(n.travelledDistance??Number.POSITIVE_INFINITY,1,yt);if(u.bodyCount===0){r&&(r.style.opacity="0"),o&&(o.style.opacity="0");return}const d={x:e.point.x-e.tangent.x*yt,y:e.point.y-e.tangent.y*yt},h={x:e.point.x-e.tangent.x*yt*2,y:e.point.y-e.tangent.y*yt*2};r&&i&&X(r,i,{x:d.x,y:d.y,angle:e.angle,visible:!0},G.width*et,G.height*et,G.anchorX,G.anchorY,G.rotationOffset),o&&c&&u.showTail?X(o,c,{x:h.x,y:h.y,angle:e.angle,visible:!0},H.width*et,H.height*et,H.anchorX,H.anchorY,H.rotationOffset):o&&(o.style.opacity="0")},gn=t=>`
  <g ${t}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${kn}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${Sn}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${Ot}" preserveAspectRatio="none"></image>
    </g>
  </g>
`,Ft=()=>{V!==null&&(cancelAnimationFrame(V),V=null),y="hidden",dt=null,it=null,O&&(O.style.opacity="0",O.classList.remove("writing-app__dot-snake--waiting")),Z&&(Z.style.opacity="0")},aa=t=>({x:t.x,y:t.y-Hr}),oa=t=>({x:t.x,y:t.y+8}),Un=(t=performance.now())=>{if(y==="hidden"||!it)return null;const e=oa(it),n=aa(it);if(y==="waiting")return{snakePoint:e,snakeHref:Vt,snakeWobble:!0};if(y==="eagle_in"){const s=Math.max(0,Math.min(1,(t-U)/vn)),i=1-(1-s)*(1-s);return{snakePoint:e,snakeHref:Vt,snakeWobble:!1,eaglePoint:{x:n.x,y:-106+(n.y+z.height)*i},eagleHref:Se,eagleWidth:z.width,eagleHeight:z.height}}if(y==="eagle_stand")return{snakePoint:e,snakeHref:Vt,snakeWobble:!1,eaglePoint:n,eagleHref:Sr,eagleWidth:Qt.width,eagleHeight:Qt.height};const a=Math.max(0,Math.min(1,(t-U)/Dn)),r=1-(1-a)*(1-a),o={x:n.x+(re+z.width-n.x)*r,y:n.y+(-106-n.y)*r};return{snakePoint:{x:o.x,y:o.y+z.height*.6},snakeHref:Dr,snakeWobble:!1,eaglePoint:o,eagleHref:Se,eagleWidth:z.width,eagleHeight:z.height}},Yn=()=>{var e;const t=p==null?void 0:p.getState();if(!(!p||!t)&&dt!==null&&t.activeStrokeIndex===dt&&(e=ue(t))!=null&&e.isDot){p.beginAt(t.cursorPoint);const n=p.getState();tr(Nt(n)),zn(n)}},sa=()=>{Yn(),Ft(),P()},Kn=t=>{if(V=null,!(y==="hidden"||y==="waiting")){if(y==="eagle_in"&&t-U>=vn)y="eagle_stand",U=t;else if(y==="eagle_stand"&&t-U>=Or)y="eagle_out",U=t;else if(y==="eagle_out"&&t-U>=Dn){sa();return}P(),V=requestAnimationFrame(Kn)}},ia=()=>{y==="waiting"&&(Yn(),y="eagle_in",U=performance.now(),V!==null&&cancelAnimationFrame(V),V=requestAnimationFrame(Kn),P())},ca=t=>{const e=We(t);if(!(e!=null&&e.isDot)){if(y!=="hidden"&&y!=="waiting")return;Ft();return}dt!==e.strokeIndex?(Ft(),dt=e.strokeIndex,it=e.point,y="waiting"):y==="waiting"&&(it=e.point)},la=(t=performance.now())=>{if(!O||!zt||!Z||!Zt)return;const e=Un(t);if(!e){O.style.opacity="0",O.classList.remove("writing-app__dot-snake--waiting"),Z.style.opacity="0";return}if(O.style.opacity="1",O.classList.toggle("writing-app__dot-snake--waiting",e.snakeWobble),zt.setAttribute("href",e.snakeHref),X(O,zt,{x:e.snakePoint.x,y:e.snakePoint.y,angle:0,visible:!0},ot.width,ot.height,ot.anchorX,ot.anchorY,0),!e.eaglePoint||!e.eagleHref||!e.eagleWidth||!e.eagleHeight){Z.style.opacity="0";return}Zt.setAttribute("href",e.eagleHref),X(Z,Zt,{x:e.eaglePoint.x,y:e.eaglePoint.y,angle:0,visible:!0},e.eagleWidth,e.eagleHeight,Qt.anchorX,Qt.anchorY,0)},da=(t,e)=>{const n=We(e);if(!n)return!1;if(n.isDot){if(y!=="waiting")return!1;const r=Un();if(!r)return!1;const o=Math.max(ot.width,ot.height)*Rr;return Math.hypot(t.x-r.snakePoint.x,t.y-r.snakePoint.y)<=o}const a=Math.max(34,$.width*.52);return Math.hypot(t.x-n.point.x,t.y-n.point.y)<=a},ua=t=>{t.completedStrokes.forEach(e=>{if(ae.has(e))return;ae.add(e);const n=Tt[e],a=m==null?void 0:m.strokes[e];if(!(n!=null&&n.deferred)||a!=null&&a.isDot)return;const r=Bn(e);r&&Ht.push({strokeIndex:e,point:r.point,tangent:r.tangent,angle:pt(r.tangent)})})},pa=()=>{le.forEach((t,e)=>{const n=Ht.find(a=>a.strokeIndex===e);if(!n){t.style.opacity="0";return}Be(t,{point:n.point,tangent:n.tangent,angle:n.angle})})},Ge=()=>{le.forEach(t=>{t.style.opacity="0"})},Ie=(t,e)=>{if(t.length===0)return{x:0,y:0};if(t.length===1||e<=0)return{x:t[0].x,y:t[0].y};for(let a=1;a<t.length;a+=1){const r=t[a-1],o=t[a];if(!r||!o||e>o.distanceAlongStroke)continue;const s=o.distanceAlongStroke-r.distanceAlongStroke,i=s>0?(e-r.distanceAlongStroke)/s:0;return{x:r.x+(o.x-r.x)*i,y:r.y+(o.y-r.y)*i}}const n=t[t.length-1];return n?{x:n.x,y:n.y}:{x:0,y:0}},Dt=(t,e)=>{let n=e;for(let a=0;a<t.strokes.length;a+=1){const r=t.strokes[a];if(r){if(n<=r.totalLength||a===t.strokes.length-1)return Ie(r.samples,Math.max(0,Math.min(n,r.totalLength)));n-=r.totalLength}}return{x:0,y:0}},Vn=(t,e,n)=>{if(n<=e)return"";const a=[];let r=0;return t.strokes.forEach(o=>{const s=r,i=r+o.totalLength;if(r=i,n<s||e>i)return;const c=Math.max(0,e-s),u=Math.min(o.totalLength,n-s);if(u<c||o.samples.length===0)return;const d=[Ie(o.samples,c),...o.samples.filter(x=>x.distanceAlongStroke>c&&x.distanceAlongStroke<u).map(x=>({x:x.x,y:x.y})),Ie(o.samples,u)],h=d.filter((x,l)=>{const f=d[l-1];return!f||Math.hypot(x.x-f.x,x.y-f.y)>.01});if(h.length===0)return;const[w,...gt]=h;a.push(`M ${w.x} ${w.y}`),gt.forEach(x=>{a.push(`L ${x.x} ${x.y}`)})}),a.join(" ")},ga=(t,e,n="center")=>{const a=t.strokes.reduce((h,w)=>h+w.totalLength,0),r=Math.max(0,Math.min(e,a)),o=Dt(t,r),s=Math.min(8,Math.max(2,a/200));let i=Math.max(0,r-s),c=Math.min(a,r+s);n==="forward"?i=r:n==="backward"&&(c=r),Math.abs(c-i)<.001&&(r<=s?c=Math.min(a,r+s):i=Math.max(0,r-s));const u=Dt(t,i),d=Dt(t,c);return{point:o,tangent:A({x:d.x-u.x,y:d.y-u.y})}},ha=(t,e)=>{const n={x:-t.tangent.y,y:t.tangent.x};return{x:t.point.x+n.x*e,y:t.point.y+n.y*e}},hn=(t,e,n,a)=>{if(n<=e)return[];const r=[e];let o=0;return t.strokes.forEach(s=>{const i=o,c=o+s.totalLength;o=c,!(n<i||e>c)&&s.samples.forEach(u=>{const d=i+u.distanceAlongStroke;d>e&&d<n&&r.push(d)})}),r.push(n),r.map((s,i)=>{const c=i===0?"forward":i===r.length-1?"backward":"center";return{distance:s,point:ha(ga(t,s,c),a)}}).filter((s,i,c)=>{const u=c[i-1];return!u||Math.hypot(s.point.x-u.point.x,s.point.y-u.point.y)>.01})},fa=t=>{const e=Math.max(0,Math.min(1,t));return e*e*(3-2*e)},ya=(t,e,n)=>({x:t.x+(e.x-t.x)*n,y:t.y+(e.y-t.y)*n}),fn=(t,e,n,a,r,o,s)=>{const i=r+o;return t.map(c=>{const u=s==="incoming"?e-c.distance:c.distance-e,d=Math.max(0,u),h={x:n.x-a.x*d,y:n.y-a.y*d};if(d<=r)return h;if(d>=i||o<=0)return c.point;const w=(d-r)/o;return ya(c.point,h,1-fa(w))}).filter((c,u,d)=>{const h=d[u-1];return!h||Math.hypot(c.x-h.x,c.y-h.y)>.01})},yn=(t,e,n=!1)=>{if(e.length===0)return;const[a,...r]=e;t.push(`${n?"M":"L"} ${a.x} ${a.y}`),r.forEach(o=>{t.push(`L ${o.x} ${o.y}`)})},ma=(t,e)=>{const n=t[t.length-1];if(!n)return A(e);for(let a=t.length-2;a>=0;a-=1){const r=t[a];if(!r)continue;if(Math.hypot(n.x-r.x,n.y-r.y)>=1)return A({x:n.x-r.x,y:n.y-r.y})}return A(e)},xa=(t,e)=>{const n=A(e),a={x:-n.y,y:n.x},r={x:t.x-n.x*sn,y:t.y-n.y*sn},o=Wr/2;return[t,{x:r.x+a.x*o,y:r.y+a.y*o},{x:r.x-a.x*o,y:r.y-a.y*o}].map(i=>`${i.x} ${i.y}`).join(" ")},_a=t=>{const e=k[t];if(!e||!m)return null;const n=Math.max(e.startDistance,e.endDistance-24),a=Dt(m,n),r=A({x:e.endPoint.x-a.x,y:e.endPoint.y-a.y});return Math.hypot(r.x,r.y)>.001?r:A({x:e.endPoint.x-e.startPoint.x,y:e.endPoint.y-e.startPoint.y})},Sa=(t,e,n,a,r,o)=>{const s=.5522847498,i={x:-a.x,y:-a.y},c={x:t.x+i.x*o,y:t.y+i.y*o},u={x:e.x+i.x*o*s,y:e.y+i.y*o*s},d={x:c.x+r.x*o*s,y:c.y+r.y*o*s},h={x:c.x-r.x*o*s,y:c.y-r.y*o*s},w={x:n.x+i.x*o*s,y:n.y+i.y*o*s};return[`C ${u.x} ${u.y} ${d.x} ${d.y} ${c.x} ${c.y}`,`C ${h.x} ${h.y} ${w.x} ${w.y} ${n.x} ${n.y}`]},Xn=()=>{if(!rt||!m)return;const t=k[b-1];if(!t){rt.setAttribute("d",""),rt.style.opacity="0";return}rt.setAttribute("d",Vn(m,t.startDistance,t.endDistance)),rt.style.opacity="1"},jn=t=>{const e=k[t];if(!e||!m)return null;const n=Math.min(e.endDistance,e.startDistance+24),a=Dt(m,n),r=A({x:a.x-e.startPoint.x,y:a.y-e.startPoint.y});return Math.hypot(r.x,r.y)>.001?r:A({x:e.endPoint.x-e.startPoint.x,y:e.endPoint.y-e.startPoint.y})},wa=()=>{b=Math.min(b+1,k.length),It=b-1<Mt.length?b-1:null,er(),Rt(),de()},zn=t=>{if(v||L||C||D||k.length<=b)return!1;const e=b-1,n=k[e];return!n||Nt(t)<n.endDistance-8?!1:(D=!0,N=null,R=0,J=n.endDistance,T=jn(e+1),T&&(Lt=pt(T),se(n.endPoint,T,!0)),wa(),p==null||p.end(),Qn(),P(),!0)},ka=(t,e)=>e.slice(0,-1).map((n,a)=>({x:n.endPoint.x,y:n.endPoint.y,pathDistance:n.endDistance,emoji:Tr,captured:!1,groupIndex:a})),Zn=()=>{b=k.length>0?1:0,It=Mt.length>0?0:null,Pt.forEach(t=>{t.captured=!1}),ce.forEach(t=>{t.style.transition="none",t.classList.remove("writing-app__fruit--captured"),t.classList.remove("writing-app__fruit--hidden"),t.getBoundingClientRect(),t.style.removeProperty("transition")}),er(),Rt()},Ue=()=>{const t=Math.max(3,Math.min(we,Math.floor(Fe/an)));return Math.min(t,1+Math.floor(M/an))},Qn=()=>{if(v||L||C){N=null,R=0;return}if(!D)return;const t=qe(M,Ue(),K).bodyCount;Zr((t+1)*K)},X=(t,e,n,a,r,o,s,i)=>{e.setAttribute("x",`${(-a*o).toFixed(2)}`),e.setAttribute("y",`${(-r*s).toFixed(2)}`),e.setAttribute("width",`${a}`),e.setAttribute("height",`${r}`),t.setAttribute("transform",`translate(${n.x.toFixed(2)} ${n.y.toFixed(2)}) rotate(${(n.angle+i).toFixed(2)})`),t.style.opacity=n.visible?"1":"0"},_e=t=>{const e=_[0]??{x:0,y:0,angle:0,distance:0,visible:!0};if(_.length<=1||t<=0)return{...e,distance:Math.max(0,t)};for(let a=1;a<_.length;a+=1){const r=_[a-1],o=_[a];if(!r||!o||t>o.distance)continue;const s=o.distance-r.distance,i=s>0?(t-r.distance)/s:0,c=r.x+(o.x-r.x)*i,u=r.y+(o.y-r.y)*i;return{x:c,y:u,angle:pt({x:o.x-r.x,y:o.y-r.y}),distance:t,visible:o.visible}}return{..._[_.length-1]??e,distance:t}},Jn=()=>{st==null||st.style.setProperty("opacity","0"),Y==null||Y.style.setProperty("opacity","0"),Oe.forEach(t=>{t.style.opacity="0"})},F=(t=performance.now())=>{if(!Xt||!st||!jt||!Y||_.length===0)return;if(v||C){Xt.style.opacity="0";return}Xt.style.opacity="1";const e=L?$t:Ue(),n=L?0:S,a=qe(M,e,K),r=a.bodyCount,o=_e(M);jt.setAttribute("href",t<He?wr:Ot),X(st,jt,{...o,angle:Lt},$.width,$.height,$.anchorX,$.anchorY,$.rotationOffset),Oe.forEach((u,d)=>{if(d>=r){u.style.opacity="0";return}const h=u.querySelector("image");if(!h)return;const w=Math.max(0,(d+1)*K-n);if(w<=on){u.style.opacity="0";return}const gt=_e(Math.max(0,M-w)),x=h.getAttribute("href")===wn?Fr:G;X(u,h,gt,x.width,x.height,x.anchorX,x.anchorY,x.rotationOffset)});const s=Y.querySelector("image");if(!s)return;const i=Math.max(0,(r+1)*K-n);if(!a.showTail||i<=on){Y.style.opacity="0";return}const c=_e(Math.max(0,M-i));X(Y,s,c,H.width,H.height,H.anchorX,H.anchorY,H.rotationOffset)},Ye=(t,e,n=!0)=>{const a=A(e);Lt=pt(a),_=[{x:t.x,y:t.y,angle:Lt,distance:0,visible:n}],M=0,He=0,S=0,I=0,N=null,R=0,J=null,T=null,D=!1,C=!1,L=!1,$t=0,qt(),B!==null&&(cancelAnimationFrame(B),B=null),F()},se=(t,e,n)=>{const a=A(e),r=pt(a);Lt=r;const o=_[_.length-1];if(!o){Ye(t,a,n);return}const s=Math.hypot(t.x-o.x,t.y-o.y);if(s<.5){o.visible===n?_[_.length-1]={...o,x:t.x,y:t.y,angle:r}:(_.push({x:t.x,y:t.y,angle:r,distance:o.distance+.001,visible:n}),M=o.distance+.001),F();return}M=o.distance+s,_.push({x:t.x,y:t.y,angle:r,distance:M,visible:n}),Jr(),F()},mn=(t,e,n)=>{const a=A(e),r=[];a.x>.001?r.push((re+tt-t.x)/a.x):a.x<-.001&&r.push((-tt-t.x)/a.x),a.y>.001?r.push((De+tt-t.y)/a.y):a.y<-.001&&r.push((-tt-t.y)/a.y);const o=r.filter(i=>Number.isFinite(i)&&i>0).reduce((i,c)=>Math.min(i,c),Number.POSITIVE_INFINITY);return(Number.isFinite(o)?o:Math.max(re,De)+tt)+(n+2)*K+tt},Ea=(t,e)=>{if(L||C)return;qt(),S=0,I=0,N=null,R=0,J=null,T=null,D=!1;const n=A(e),a=performance.now();$t=Ue();const r=mn(t,n,$t);At=Ht.map(s=>({...s,travelDistance:mn(s.point,s.tangent,0)})),L=!0,ut(!1);const o=s=>{const i=Math.max(0,s-a)/1e3,c=Math.min(r,i*me);se({x:t.x+n.x*c,y:t.y+n.y*c},n,!0),At.forEach(d=>{const h=le.get(d.strokeIndex);if(!h)return;const w=Math.min(d.travelDistance,i*me);Be(h,{point:{x:d.point.x+d.tangent.x*w,y:d.point.y+d.tangent.y*w},tangent:d.tangent,angle:d.angle})});const u=At.every(d=>i*me>=d.travelDistance);if(c>=r&&u){L=!1,C=!0,B=null,Jn(),Ge(),ut(!0);return}B=requestAnimationFrame(o)};B=requestAnimationFrame(o)},tr=t=>{let e=!1;Pt.forEach((n,a)=>{if(n.captured||n.groupIndex>=b||t+.5<n.pathDistance)return;n.captured=!0;const r=ce[a];r&&r.classList.add("writing-app__fruit--captured"),e=!0}),e&&(He=performance.now()+Nr,Kr(),Rt(),F())},er=()=>{if(!at)return;const t=It!==null?Mt[It]:void 0;if(!t){at.classList.add("writing-app__boundary-star--hidden");return}at.classList.remove("writing-app__boundary-star--hidden"),at.setAttribute("x",`${t.x}`),at.setAttribute("y",`${t.y}`)},ba=t=>{if(J!==null){if(Nt(t)+.5<J){F();return}J=null}const n=T!==null&&(D||t.isPenDown)&&T?T:t.cursorTangent;if(Ct(t)){const a=Gn(t),r=_[_.length-1];a&&(!r||Math.hypot(r.x-a.point.x,r.y-a.point.y)>.5)&&se(a.point,a.tangent,!0)}else se(t.cursorPoint,n,!0);T&&t.isPenDown&&!D&&(T=null),v||tr(Nt(t)),!v&&t.isPenDown&&(Xr(t),zn(t))},Te=()=>{bt!==null&&(cancelAnimationFrame(bt),bt=null),v=!1,ct.disabled=!1,ct.textContent="Demo",Et.forEach((t,e)=>{const n=ee[e]??.001;t.style.strokeDasharray=`${n} ${n}`,t.style.strokeDashoffset=`${n}`}),W&&(W.style.opacity="0"),Rt(),F(),P()},xn=()=>{p==null||p.reset(),q=null,j=null,ut(!1),C=!1,L=!1,$t=0,Ht=[],ae=new Set,At=[],Ft(),B!==null&&(cancelAnimationFrame(B),B=null),kt.forEach((e,n)=>{const a=te[n]??.001;e.style.strokeDasharray=`${a} ${a}`,e.style.strokeDashoffset=`${a}`}),qt(),S=0,I=0,N=null,R=0,J=null,T=null,D=!1;const t=p==null?void 0:p.getState();t?Ye(t.cursorPoint,t.cursorTangent,!0):Jn(),Ge(),Zn(),de(),P()},P=()=>{xe||(xe=!0,requestAnimationFrame(()=>{xe=!1,Aa()}))},Aa=()=>{if(!p)return;const t=p.getState();Qn(),ua(t),ca(t),la(),ra(t),pa(),Xn();const e=new Set(t.completedStrokes);if(kt.forEach((n,a)=>{const r=te[a]??0;if(e.has(a)||na(a,t)){n.style.strokeDashoffset="0";return}if(a===t.activeStrokeIndex){const o=r*(1-t.activeStrokeProgress);n.style.strokeDashoffset=`${Math.max(0,o)}`;return}n.style.strokeDashoffset=`${r}`}),!v&&!L&&!C&&!D?ba(t):F(),t.status==="complete"){if(!v&&!L&&!C){const n=ea(t);Ea(n.point,n.tangent)}ut(C);return}ut(!1)},va=()=>{if(!ve||v)return;xn(),Te();const t=new mr(ve,{speed:1.7*rn,penUpSpeed:2.1*rn,deferredDelayMs:150});v=!0,ct.disabled=!0,ct.textContent="Demo...",Rt(),F();const e=performance.now(),n=a=>{const r=a-e,o=Math.min(r,t.totalDuration),s=t.getFrame(o),i=new Set(s.completedStrokes);if(Et.forEach((c,u)=>{const d=ee[u]??.001;if(i.has(u)){c.style.strokeDashoffset="0";return}if(u===s.activeStrokeIndex){const h=d*(1-s.activeStrokeProgress);c.style.strokeDashoffset=`${Math.max(0,h)}`;return}c.style.strokeDashoffset=`${d}`}),W&&(W.setAttribute("cx",s.point.x.toFixed(2)),W.setAttribute("cy",s.point.y.toFixed(2)),W.style.opacity=r<=t.totalDuration+en?"1":"0"),r<t.totalDuration+en){bt=requestAnimationFrame(n);return}Te(),xn()};bt=requestAnimationFrame(n),P()},Da=(t,e,n,a)=>{re=e,De=n;const r=fr(t);m=r,Tt=t.strokes.filter(l=>l.type!=="lift"),Fe=r.strokes.reduce((l,f)=>l+f.totalLength,0),k=xr(r).groups,Mt=k.slice(1).map(l=>({x:l.startPoint.x,y:l.startPoint.y})),It=Mt.length>0?0:null,b=k.length>0?1:0,p=new yr(r,{startTolerance:ne,hitTolerance:ne}),q=null,Pt=ka(r,k);const s=Tt,i=Math.abs(t.guides.baseline-t.guides.xHeight)/3,c=k.map(l=>`<path class="writing-app__stroke-bg" d="${Vn(r,l.startDistance,l.endDistance)}"></path>`).join(""),u=k.map((l,f)=>{var Ze,Qe;if(l.kind!=="retrace"||f===0)return"";const E=k[f-1],ht=_a(f-1),Wt=jn(f);if(!E||!ht||!Wt)return"";const pe=A({x:Wt.x-ht.x,y:Wt.y-ht.y}),Ke={x:-pe.x,y:-pe.y},Bt=Math.min(i*.24,13),ge=i*.36,Ve=Math.min(ge*.7,Bt*5.4),he=Ve*.2,Xe=Ve-he,fe=hn(r,Math.max(E.startDistance,E.endDistance-ge),E.endDistance,Bt),je=hn(r,l.startDistance,Math.min(l.endDistance,l.startDistance+ge),Bt),ft=(Ze=fe[fe.length-1])==null?void 0:Ze.point,Gt=(Qe=je[0])==null?void 0:Qe.point;if(!ft||!Gt)return"";const ar=fn(fe,E.endDistance,ft,Ke,he,Xe,"incoming"),Ut=fn(je,l.startDistance,Gt,Ke,he,Xe,"outgoing"),or=A({x:ft.x-l.startPoint.x,y:ft.y-l.startPoint.y}),sr=Sa(l.startPoint,ft,Gt,pe,or,Bt),Yt=[];yn(Yt,ar,!0),Yt.push(...sr),yn(Yt,Ut.slice(1));const ir=Yt.join(" "),ye=ma(Ut,Wt),ze=Ut[Ut.length-1]??Gt,cr={x:ze.x+ye.x*cn,y:ze.y+ye.y*cn},lr=xa(cr,ye);return`
        <path class="writing-app__section-arrow" d="${ir}"></path>
        <polygon class="writing-app__section-arrowhead" points="${lr}"></polygon>
      `}).join(""),d=s.map(l=>`<path class="writing-app__stroke-trace" d="${tn(l.curves)}"></path>`).join(""),h=s.map(l=>`<path class="writing-app__stroke-demo" d="${tn(l.curves)}"></path>`).join(""),w=Array.from({length:we},(l,f)=>{const E=we-1-f,ht=Math.random()<Lr?wn:Sn;return`
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${E}"
      >
        <image
          href="${ht}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `}).join(""),gt=s.map((l,f)=>l.deferred?f:null).filter(l=>l!==null).map(l=>gn(`class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${l}"`)).join("");g.setAttribute("viewBox",`0 0 ${e} ${n}`),g.innerHTML=`
    <rect class="writing-app__bg" x="0" y="0" width="${e}" height="${n}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${t.guides.xHeight+a}"
      x2="${e}"
      y2="${t.guides.xHeight+a}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${t.guides.baseline+a}"
      x2="${e}"
      y2="${t.guides.baseline+a}"
    ></line>
    ${c}
    ${d}
    <path class="writing-app__stroke-next" id="next-section-stroke" d=""></path>
    ${u}
    ${h}
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
          href="${kn}"
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
          href="${Ot}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${gt}
    </g>
    ${gn('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${Vt}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${Se}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `,kt=Array.from(g.querySelectorAll(".writing-app__stroke-trace")),rt=g.querySelector("#next-section-stroke"),Et=Array.from(g.querySelectorAll(".writing-app__stroke-demo")),ce=Array.from(g.querySelectorAll(".writing-app__fruit")),at=g.querySelector("#waypoint-star"),Xt=g.querySelector("#trace-snake"),st=g.querySelector("#snake-head"),jt=g.querySelector("#snake-head-image"),Y=g.querySelector("#snake-tail"),Oe=Array.from(g.querySelectorAll(".writing-app__snake-body")).sort((l,f)=>Number(l.dataset.snakeBodyIndex)-Number(f.dataset.snakeBodyIndex)),_t=g.querySelector("#deferred-head"),le=new Map(Array.from(g.querySelectorAll("[data-deferred-trail-index]")).map(l=>[Number(l.dataset.deferredTrailIndex),l])),O=g.querySelector("#dot-snake"),zt=g.querySelector("#dot-snake-image"),Z=g.querySelector("#dot-eagle"),Zt=g.querySelector("#dot-eagle-image"),W=g.querySelector("#demo-nib"),te=kt.map(l=>{const f=l.getTotalLength();return Number.isFinite(f)&&f>0?f:.001}),ee=Et.map(l=>{const f=l.getTotalLength();return Number.isFinite(f)&&f>0?f:.001}),kt.forEach((l,f)=>{const E=te[f]??.001;l.style.strokeDasharray=`${E} ${E}`,l.style.strokeDashoffset=`${E}`}),Et.forEach((l,f)=>{const E=ee[f]??.001;l.style.strokeDasharray=`${E} ${E}`,l.style.strokeDashoffset=`${E}`}),W&&(W.style.opacity="0"),Xn();const x=p.getState();Ye(x.cursorPoint,x.cursorTangent),Ht=[],ae=new Set,At=[],Ft(),Ge(),Zn(),de(),ut(!1),P()},nr=(t,e=-1)=>{Te();const n=hr(t,{keepInitialLeadIn:$n,keepFinalLeadOut:Nn});Ae=t,Ce=e,Pn.textContent=t,ie.value=Gr(t),ve=n.path,Da(n.path,n.width,n.height,n.offsetY)},Le=(t,e=-1)=>{const n=On(t);if(!n)return un("Type a word first."),!1;try{return nr(n,e),Fn(),!0}catch{return un("Couldn't build that word. Try letters supported by the cursive set."),!1}},rr=()=>{let t=pn();for(;t;){if(Jt="nextQueued",Le(t)){Me();return}t=pn()}Jt="current";const e=gr(Ce);Le(Je[e]??Je[0],e),Me()},Pa=t=>{if(v||!p||q!==null)return;const e=_n(g,t),n=p.getState(),a=ue(n);if(Ct(n)&&!da(e,n))return;if(Ct(n)&&(a!=null&&a.isDot)){t.preventDefault(),ia();return}p.beginAt(e)&&(t.preventDefault(),D=!1,q=t.pointerId,j=e,Ur(),Yr(),S>.5&&Qr(),g.setPointerCapture(t.pointerId),P())},Ma=t=>{if(!(v||!p||t.pointerId!==q)){if(t.preventDefault(),j=_n(g,t),D){qn(),P();return}p.update(j),P()}},Ia=t=>{!p||t.pointerId!==q||(p.end(),g.hasPointerCapture(t.pointerId)&&g.releasePointerCapture(t.pointerId),q=null,j=null,P())},Ta=t=>{t.pointerId===q&&(p==null||p.end(),g.hasPointerCapture(t.pointerId)&&g.releasePointerCapture(t.pointerId),q=null,j=null,P())};g.addEventListener("pointerdown",Pa);g.addEventListener("pointermove",Ma);g.addEventListener("pointerup",Ia);g.addEventListener("pointercancel",Ta);ct.addEventListener("click",va);ke.addEventListener("input",()=>{ne=Number(ke.value),Cn(),Re()});Ee.addEventListener("change",()=>{$n=Ee.checked,Re()});be.addEventListener("change",()=>{Nn=be.checked,Re()});Ln.addEventListener("submit",t=>{t.preventDefault(),Jt="current",Le(ie.value)});Ne.addEventListener("click",rr);ie.addEventListener("input",()=>{lt.hidden||Fn()});document.addEventListener("pointerdown",t=>{if(!wt.open)return;const e=t.target;e instanceof Node&&wt.contains(e)||(wt.open=!1)});document.addEventListener("keydown",t=>{t.key==="Escape"&&(wt.open=!1)});Cn();Me();rr();
