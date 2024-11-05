"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[402],{7402:(q,O,L)=>{L.r(O),L.d(O,{startInputShims:()=>Z});var g=L(467),l=L(4878),P=L(7849),y=L(1656),R=L(5680);const T=new WeakMap,M=(e,t,s,o=0,r=!1)=>{T.has(e)!==s&&(s?j(e,t,o,r):G(e,t))},j=(e,t,s,o=!1)=>{const r=t.parentNode,n=t.cloneNode(!1);n.classList.add("cloned-input"),n.tabIndex=-1,o&&(n.disabled=!0),r.appendChild(n),T.set(e,n);const a="rtl"===e.ownerDocument.dir?9999:-9999;e.style.pointerEvents="none",t.style.transform=`translate3d(${a}px,${s}px,0) scale(0)`},G=(e,t)=>{const s=T.get(e);s&&(T.delete(e),s.remove()),e.style.pointerEvents="",t.style.transform=""},C="input, textarea, [no-blur], [contenteditable]",N="$ionPaddingTimer",B=(e,t,s)=>{const o=e[N];o&&clearTimeout(o),t>0?e.style.setProperty("--keyboard-offset",`${t}px`):e[N]=setTimeout(()=>{e.style.setProperty("--keyboard-offset","0px"),s&&s()},120)},U=(e,t,s)=>{e.addEventListener("focusout",()=>{t&&B(t,0,s)},{once:!0})};let A=0;const x="data-ionic-skip-scroll-assist",V=(e,t,s,o,r,n,i,a=!1)=>{const S=n&&(void 0===i||i.mode===R.a.None);let m=!1;const u=void 0!==l.w?l.w.innerHeight:0,f=h=>{!1!==m?k(e,t,s,o,h.detail.keyboardHeight,S,a,u,!1):m=!0},c=()=>{m=!1,null==l.w||l.w.removeEventListener("ionKeyboardDidShow",f),e.removeEventListener("focusout",c)},_=function(){var h=(0,g.A)(function*(){t.hasAttribute(x)?t.removeAttribute(x):(k(e,t,s,o,r,S,a,u),null==l.w||l.w.addEventListener("ionKeyboardDidShow",f),e.addEventListener("focusout",c))});return function(){return h.apply(this,arguments)}}();return e.addEventListener("focusin",_),()=>{e.removeEventListener("focusin",_),null==l.w||l.w.removeEventListener("ionKeyboardDidShow",f),e.removeEventListener("focusout",c)}},p=e=>{document.activeElement!==e&&(e.setAttribute(x,"true"),e.focus())},k=function(){var e=(0,g.A)(function*(t,s,o,r,n,i,a=!1,S=0,m=!0){if(!o&&!r)return;const u=((e,t,s,o)=>{var r;return((e,t,s,o)=>{const r=e.top,n=e.bottom,i=t.top,S=i+15,u=Math.min(t.bottom,o-s)-50-n,f=S-r,c=Math.round(u<0?-u:f>0?-f:0),_=Math.min(c,r-i),w=Math.abs(_)/.3;return{scrollAmount:_,scrollDuration:Math.min(400,Math.max(150,w)),scrollPadding:s,inputSafeY:4-(r-S)}})((null!==(r=e.closest("ion-item,[ion-item]"))&&void 0!==r?r:e).getBoundingClientRect(),t.getBoundingClientRect(),s,o)})(t,o||r,n,S);if(o&&Math.abs(u.scrollAmount)<4)return p(s),void(i&&null!==o&&(B(o,A),U(s,o,()=>A=0)));if(M(t,s,!0,u.inputSafeY,a),p(s),(0,y.r)(()=>t.click()),i&&o&&(A=u.scrollPadding,B(o,A)),typeof window<"u"){let f;const c=function(){var h=(0,g.A)(function*(){void 0!==f&&clearTimeout(f),window.removeEventListener("ionKeyboardDidShow",_),window.removeEventListener("ionKeyboardDidShow",c),o&&(yield(0,P.c)(o,0,u.scrollAmount,u.scrollDuration)),M(t,s,!1,u.inputSafeY),p(s),i&&U(s,o,()=>A=0)});return function(){return h.apply(this,arguments)}}(),_=()=>{window.removeEventListener("ionKeyboardDidShow",_),window.addEventListener("ionKeyboardDidShow",c)};if(o){const h=yield(0,P.g)(o);if(m&&u.scrollAmount>h.scrollHeight-h.clientHeight-h.scrollTop)return"password"===s.type?(u.scrollAmount+=50,window.addEventListener("ionKeyboardDidShow",_)):window.addEventListener("ionKeyboardDidShow",c),void(f=setTimeout(c,1e3))}c()}});return function(s,o,r,n,i,a){return e.apply(this,arguments)}}(),Z=function(){var e=(0,g.A)(function*(t,s){if(void 0===l.d)return;const o="ios"===s,r="android"===s,n=t.getNumber("keyboardHeight",290),i=t.getBoolean("scrollAssist",!0),a=t.getBoolean("hideCaretOnScroll",o),S=t.getBoolean("inputBlurring",!1),m=t.getBoolean("scrollPadding",!0),u=Array.from(l.d.querySelectorAll("ion-input, ion-textarea")),f=new WeakMap,c=new WeakMap,_=yield R.K.getResizeMode(),h=function(){var v=(0,g.A)(function*(d){yield new Promise(I=>(0,y.c)(d,I));const K=d.shadowRoot||d,b=K.querySelector("input")||K.querySelector("textarea"),D=(0,P.a)(d),H=D?null:d.closest("ion-footer");if(b){if(D&&a&&!f.has(d)){const I=((e,t,s)=>{if(!s||!t)return()=>{};const o=a=>{(e=>e===e.getRootNode().activeElement)(t)&&M(e,t,a)},r=()=>M(e,t,!1),n=()=>o(!0),i=()=>o(!1);return(0,y.a)(s,"ionScrollStart",n),(0,y.a)(s,"ionScrollEnd",i),t.addEventListener("blur",r),()=>{(0,y.b)(s,"ionScrollStart",n),(0,y.b)(s,"ionScrollEnd",i),t.removeEventListener("blur",r)}})(d,b,D);f.set(d,I)}if("date"!==b.type&&"datetime-local"!==b.type&&(D||H)&&i&&!c.has(d)){const I=V(d,b,D,H,n,m,_,r);c.set(d,I)}}});return function(K){return v.apply(this,arguments)}}();S&&(()=>{let e=!0,t=!1;const s=document;(0,y.a)(s,"ionScrollStart",()=>{t=!0}),s.addEventListener("focusin",()=>{e=!0},!0),s.addEventListener("touchend",i=>{if(t)return void(t=!1);const a=s.activeElement;if(!a||a.matches(C))return;const S=i.target;S!==a&&(S.matches(C)||S.closest(C)||(e=!1,setTimeout(()=>{e||a.blur()},50)))},!1)})();for(const v of u)h(v);l.d.addEventListener("ionInputDidLoad",v=>{h(v.detail)}),l.d.addEventListener("ionInputDidUnload",v=>{(v=>{if(a){const d=f.get(v);d&&d(),f.delete(v)}if(i){const d=c.get(v);d&&d(),c.delete(v)}})(v.detail)})});return function(s,o){return e.apply(this,arguments)}}()}}]);