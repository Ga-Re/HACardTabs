const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let s=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=n.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n.set(i,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const n=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new s(n,t,i)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:r,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:_}=Object,p=globalThis,u=p.trustedTypes,b=u?u.emptyScript:"",m=p.reactiveElementPolyfillSupport,g=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!r(t,e),y={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&c(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:s}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const o=n?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(e)i.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of n){const n=document.createElement("style"),s=t.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=e.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=n;const o=s.fromAttribute(e,t.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,e,i,n=!1,s){if(void 0!==t){const o=this.constructor;if(!1===n&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??v)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[g("elementProperties")]=new Map,x[g("finalized")]=new Map,m?.({ReactiveElement:x}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=t=>t,T=w.trustedTypes,S=T?T.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,E=`<${C}>`,M=document,N=()=>M.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,B="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,U=/>/g,j=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,R=/"/g,I=/^(?:script|style|textarea|title)$/i,H=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,K=M.createTreeWalker(M,129);function V(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,n=[];let s,o=2===e?"<svg>":3===e?"<math>":"",a=O;for(let e=0;e<i;e++){const i=t[e];let r,c,l=-1,d=0;for(;d<i.length&&(a.lastIndex=d,c=a.exec(i),null!==c);)d=a.lastIndex,a===O?"!--"===c[1]?a=D:void 0!==c[1]?a=U:void 0!==c[2]?(I.test(c[2])&&(s=RegExp("</"+c[2],"g")),a=j):void 0!==c[3]&&(a=j):a===j?">"===c[0]?(a=s??O,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,r=c[1],a=void 0===c[3]?j:'"'===c[3]?R:L):a===R||a===L?a=j:a===D||a===U?a=O:(a=j,s=void 0);const h=a===j&&t[e+1].startsWith("/>")?" ":"";o+=a===O?i+E:l>=0?(n.push(r),i.slice(0,l)+A+i.slice(l)+k+h):i+k+(-2===l?e:h)}return[V(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class Y{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,o=0;const a=t.length-1,r=this.parts,[c,l]=X(t,e);if(this.el=Y.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=K.nextNode())&&r.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(A)){const e=l[o++],i=n.getAttribute(t).split(k),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:s,name:a[2],strings:i,ctor:"."===a[1]?tt:"?"===a[1]?et:"@"===a[1]?it:Q}),n.removeAttribute(t)}else t.startsWith(k)&&(r.push({type:6,index:s}),n.removeAttribute(t));if(I.test(n.tagName)){const t=n.textContent.split(k),e=t.length-1;if(e>0){n.textContent=T?T.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],N()),K.nextNode(),r.push({type:2,index:++s});n.append(t[e],N())}}}else if(8===n.nodeType)if(n.data===C)r.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(k,t+1));)r.push({type:7,index:s}),t+=k.length-1}s++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,n){if(e===F)return e;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const o=P(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(e=G(t,s._$AS(t,e.values),s,n)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??M).importNode(e,!0);K.currentNode=n;let s=K.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new J(s,s.nextSibling,this,t):1===r.type?e=new r.ctor(s,r.name,r.strings,this,t):6===r.type&&(e=new nt(s,this,t)),this._$AV.push(e),r=i[++a]}o!==r?.index&&(s=K.nextNode(),o++)}return K.currentNode=M,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),P(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new Z(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Y(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new J(this.O(N()),this.O(N()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,n){const s=this.strings;let o=!1;if(void 0===s)t=G(this,t,e,0),o=!P(t)||t!==this._$AH&&t!==F,o&&(this._$AH=t);else{const n=t;let a,r;for(t=s[0],a=0;a<s.length-1;a++)r=G(this,n[i+a],e,a),r===F&&(r=this._$AH[a]),o||=!P(r)||r!==this._$AH[a],r===W?t=W:t!==W&&(t+=(r??"")+s[a+1]),this._$AH[a]=r}o&&!n&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends Q{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??W)===F)return;const i=this._$AH,n=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==W&&(i===W||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(Y,J),(w.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;let at=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let s=n._$litPart$;if(void 0===s){const t=i?.renderBefore??null;n._$litPart$=s=new J(e.insertBefore(N(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const rt=ot.litElementPolyfillSupport;rt?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.2");const ct=1,lt=t=>(...e)=>({_$litDirective$:t,values:e});let dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const ht=lt(class extends dt{constructor(t){if(super(t),t.type!==ct||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const n=!!e[t];n===this.st.has(t)||this.nt?.has(t)||(n?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return F}}),_t="important",pt=" !"+_t,ut=lt(class extends dt{constructor(t){if(super(t),t.type!==ct||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const n=t[i];return null==n?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const n=e[t];if(null!=n){this.ft.add(t);const e="string"==typeof n&&n.endsWith(pt);t.includes("-")||e?i.setProperty(t,e?n.slice(0,-11):n,e?_t:""):i[t]=n}}return F}}),bt={},mt=lt(class extends dt{constructor(){super(...arguments),this.key=W}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&(((t,e=bt)=>{t._$AH=e})(t),this.key=e),i}}),gt="hacard-tabs",ft="hacard-tabs-editor",vt="hacard-tabs-editor-select",yt={default_tab:0,remember_tab:!1,tab_bar:"show",tab_bar_auto_hide:4,tab_position:"top",tab_style:"underline",tab_alignment:"start",tab_content:"icon_name",icon_position:"start",tab_overflow:"scroll",sliding_indicator:!0,card_background:!0,inner_cards_background:!0,hide_single_tab:!1,animation:"fade",animation_duration:300,animation_easing:"ease",swipe:!0,swipe_follow:!0,card_gap:8,return_to_default:0,sync_mode:"both",mobile_breakpoint:600},xt=["tab_bar","tab_position","tab_style","tab_alignment","tab_content","icon_position","animation"],wt=["input_select","select","input_text","input_number","number"],$t={enabled:!1,interval:10,pause_on_interaction:30,pause_on_hover:!0,show_progress:!0,progress_position:"bar",progress_height:3},Tt=["bar","content_end","card_top","card_bottom","tab"],St=["primary","accent","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","grey","blue-grey","black","white","disabled"],At=["mon","tue","wed","thu","fri","sat","sun"],kt=["state","numeric_state","user","screen","time","template"],Ct={state:"mdi:state-machine",numeric_state:"mdi:numeric",user:"mdi:account",screen:"mdi:responsive",time:"mdi:clock-outline",template:"mdi:code-braces",and:"mdi:ampersand",or:"mdi:gate-or",not:"mdi:not-equal-variant"},Et={mobile:"(max-width: 767px)",tablet:"(min-width: 768px) and (max-width: 1023px)",desktop:"(min-width: 1024px)",wide:"(min-width: 1280px)"},Mt=t=>null==t?[]:Array.isArray(t)?t:[t];function Nt(t){if(t)return t.condition?t.condition:t.entity?"state":void 0}function Pt(t,e,i){const n=t?.states?.[e];if(n)return i?n.attributes?.[i]:n.state}function zt(t,e){if(null!=e&&""!==e)return Number("string"==typeof e&&t?.states?.[e]?t.states[e].state:e)}function Bt(t){if(!t||"string"!=typeof t)return;const[e,i="0",n="0"]=t.split(":"),s=3600*Number(e)+60*Number(i)+Number(n);return Number.isNaN(s)?void 0:s}function Ot(t){if("string"==typeof t){const e=t.trim().toLowerCase();return!["","false","off","no","0","none","unknown","unavailable"].includes(e)}return Boolean(t)}function Dt(t,e){const{hass:i}=e;switch(Nt(t)){case"state":{const e=Pt(i,t.entity,t.attribute),n=void 0===e?void 0:String(e);return void 0!==t.state?Mt(t.state).map(String).includes(n):void 0!==t.state_not?!Mt(t.state_not).map(String).includes(n):void 0!==n}case"numeric_state":{const e=Number(Pt(i,t.entity,t.attribute));if(Number.isNaN(e))return!1;const n=zt(i,t.above),s=zt(i,t.below);return(void 0===n||e>n)&&(void 0===s||e<s)}case"user":return Mt(t.users).includes(i?.user?.id);case"screen":return!t.media_query||window.matchMedia(t.media_query).matches;case"time":{const i=e.now||new Date,n=Mt(t.weekdays);if(n.length&&!n.includes(At[(i.getDay()+6)%7]))return!1;const s=3600*i.getHours()+60*i.getMinutes()+i.getSeconds(),o=Bt(t.after),a=Bt(t.before);return void 0!==o&&void 0!==a&&o>a?s>=o||s<a:!(void 0!==o&&s<o)&&!(void 0!==a&&s>=a)}case"template":return Ot(e.templates?.get(t.value_template));case"and":return Mt(t.conditions).every(t=>Dt(t,e));case"or":return Mt(t.conditions).some(t=>Dt(t,e));case"not":return!Mt(t.conditions).some(t=>Dt(t,e));default:return!0}}function Ut(t,e,i){const n=Mt(t);return!n.length||("any"===e?n.some(t=>Dt(t,i)):n.every(t=>Dt(t,i)))}function jt(t){const e=[],i=t=>{for(const n of Mt(t))n&&"object"==typeof n&&(e.push(n),n.conditions&&i(n.conditions))};return i(t),e}function Lt(t){return jt(t).filter(t=>"template"===Nt(t)&&t.value_template).map(t=>String(t.value_template))}const Rt="perspective(1200px)",It={fade:()=>({in:[{opacity:0},{opacity:1}],out:[{opacity:1},{opacity:0}]}),slide:t=>({in:[{transform:`translateX(${100*t}%)`},{transform:"translateX(0)"}],out:[{transform:"translateX(0)"},{transform:`translateX(${100*-t}%)`}]}),slide_vertical:t=>({in:[{transform:`translateY(${40*t}px)`,opacity:0},{transform:"translateY(0)",opacity:1}],out:[{transform:"translateY(0)",opacity:1},{transform:`translateY(${40*-t}px)`,opacity:0}]}),zoom:()=>({in:[{transform:"scale(0.88)",opacity:0},{transform:"scale(1)",opacity:1}],out:[{transform:"scale(1)",opacity:1},{transform:"scale(1.08)",opacity:0}]}),flip:t=>({sequential:!0,in:[{transform:`${Rt} rotateY(${90*-t}deg)`,opacity:.3},{transform:`${Rt} rotateY(0deg)`,opacity:1}],out:[{transform:`${Rt} rotateY(0deg)`,opacity:1},{transform:`${Rt} rotateY(${90*t}deg)`,opacity:.3}]}),cube:t=>{const e=t>0?"left center":"right center",i=t>0?"right center":"left center";return{in:[{transformOrigin:e,transform:`${Rt} translateX(${100*t}%) rotateY(${90*t}deg)`},{transformOrigin:e,transform:`${Rt} translateX(0) rotateY(0deg)`}],out:[{transformOrigin:i,transform:`${Rt} translateX(0) rotateY(0deg)`},{transformOrigin:i,transform:`${Rt} translateX(${100*-t}%) rotateY(${90*-t}deg)`}]}},blur:()=>({in:[{filter:"blur(12px)",opacity:0},{filter:"blur(0px)",opacity:1}],out:[{filter:"blur(0px)",opacity:1},{filter:"blur(12px)",opacity:0}]}),bounce:()=>({easing:"ease-out",in:[{transform:"translateY(40px) scale(0.96)",opacity:0,offset:0},{transform:"translateY(-8px) scale(1)",opacity:1,offset:.6},{transform:"translateY(3px)",offset:.8},{transform:"translateY(0)",opacity:1,offset:1}],out:[{opacity:1},{opacity:0}]})},Ht=["none",...Object.keys(It),"random"],Ft={ease:"ease",ease_in_out:"ease-in-out",ease_out:"ease-out",linear:"linear",spring:"cubic-bezier(0.34, 1.56, 0.64, 1)"};const Wt={en:{card:{name:"Card Tabs",description:"Tabs with their own sections of cards – colors, icons, conditions and auto-rotation.",no_tabs:"No tabs configured. Open the editor to add tabs.",hidden_tab:"Hidden by conditions",stub_tab_1:"Tab 1",stub_tab_2:"Tab 2",stub_text_1:"## Tab 1\nAdd cards to this tab in the editor.",stub_text_2:"## Tab 2\nEvery tab is its own section.",more_tabs:"More tabs",show_tabs:"Show tabs",disabled_tab:"Disabled"},editor:{page_tabs:"Tabs",page_appearance:"Appearance",page_behavior:"Behavior",add_tab:"Add tab",new_tab:"Tab {n}",move_left:"Move left",move_right:"Move right",duplicate:"Duplicate",delete:"Delete",delete_tab_confirm:'Delete tab "{name}" including its cards?',tab_general:"General",tab_cards:"Cards",tab_conditions:"Conditions",tab_style:"Style",no_tabs:"No tabs yet – add your first tab.",name:"Name",icon:"Icon",badge_entity:"Badge entity (shows its state on the tab)",columns:"Columns in this section",skip_cycle:"Skip during automatic rotation",cycle_duration:"Display duration for rotation (s, empty = global)",color:"Accent color (active tab)",text_color:"Text / icon color",active_text_color:"Text / icon color (active)",background_color:"Background color",color_helper:"Hex value (#ff9800), CSS color, var(--…) or Home Assistant color name (red, primary …). Empty = default.",tab_colors_helper:'Overrides the global colors from the "Appearance" page for this tab only.',pick_color:"Pick color",clear:"Reset",add_card:"Add card",card_n:"Card {n}",toggle_editor:"Toggle code / visual editor",move_up:"Move up",move_down:"Move down",copy:"Copy",move_to_tab:"Move to tab …",no_cards:"This tab has no cards yet.",loading:"Loading editor …",conditions_helper:"The tab is only shown when the conditions are met. Without conditions it is always shown. In edit mode hidden tabs are shown greyed out.",condition_mode:"Show tab when",condition_mode_all:"all conditions are met (AND)",condition_mode_any:"at least one condition is met (OR)",add_condition:"Add condition",cond_state:"Entity state",cond_numeric_state:"Numeric value",cond_user:"User",cond_screen:"Screen size",cond_time:"Time / weekday",cond_template:"Template",cond_and:"AND group",cond_or:"OR group",cond_not:"NOT group",cond_yaml_only:"This condition can only be edited in the code editor.",entity:"Entity",attribute:"Attribute (optional)",operator:"Operator",op_is:"is",op_is_not:"is not",state:"State",state_helper:"Separate multiple values with commas.",above:"Above",below:"Below",users:"Users",media_query:"Screen / media query",screen_mobile:"Mobile (< 768px)",screen_tablet:"Tablet (768–1023px)",screen_desktop:"Desktop (≥ 1024px)",screen_wide:"Wide (≥ 1280px)",after:"From",before:"Until",weekdays:"Weekdays",mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday",value_template:"Template (true = show)",tab_position:"Tab bar position",pos_top:"Top",pos_bottom:"Bottom",pos_left:"Left",pos_right:"Right",tab_style:"Tab style",style_underline:"Underline",style_pills:"Pills",style_buttons:"Buttons",style_segmented:"Segmented",tab_alignment:"Alignment",align_start:"Start",align_center:"Center",align_end:"End",align_stretch:"Fill width",tab_content:"Tab content",content_icon_name:"Icon and name",content_icon:"Icon only",content_name:"Name only",icon_position:"Icon position",icon_start:"Next to the name",icon_top:"Above the name",card_background:"Show card background",inner_cards_background:"Show background of the cards inside the tabs",hide_single_tab:"Hide tab bar when only one tab is visible",animation:"Animation when switching",anim_none:"None",anim_fade:"Fade",anim_slide:"Slide horizontally",card_gap:"Gap between cards (px)",global_colors:"Colors (all tabs)",default_tab:"Default tab",remember_tab:"Remember last tab (per device)",swipe:"Change tabs by swiping (touch)",return_to_default:"Return to default tab after inactivity (s, 0 = off)",auto_cycle:"Automatic rotation",auto_cycle_enabled:"Switch tabs automatically",interval:"Interval (seconds)",pause_on_interaction:"Pause after interaction (s, 0 = no pause)",pause_on_hover:"Pause while the mouse is over the card",show_progress:"Show progress bar",progress_position:"Progress bar position",progress_height:"Thickness (px)",progress_bar:"Next to the tab bar",progress_content_end:"Opposite end of the content",progress_card_top:"Top edge of the card",progress_card_bottom:"Bottom edge of the card",progress_tab:"Inside the active tab",auto_cycle_helper:"Rotation is paused in edit mode and in the editor preview.",id:"ID (optional)",id_helper:"Used to control the tab from an entity or automation. Default: the name.",disabled:"Disable tab (hide without deleting)",section_badge:"Badge",badge:"Badge text or template",badge_helper:"E.g. {{ states.light | selectattr('state','eq','on') | list | count }}. Empty, 0 or false hides the badge.",badge_dot:"Show as dot only",badge_color:"Badge color",section_dynamic:"Dynamic (templates)",name_template:"Name template",icon_template:"Icon template",color_template:"Color template",template_helper:"Overrides the static value while the template returns something.",section_actions:"Actions",actions_helper:"Tapping a tab always opens it. Additional actions on hold or double tap:",hold_action:"Hold action",double_tap_action:"Double tap action",section_jump:"Jump to this tab automatically",jump_helper:"When these conditions become true, the card switches to this tab (e.g. doorbell rings, washing machine done).",jump_condition_mode:"Jump when",jump_return:"Return to the previous tab after (s, 0 = stay)",jump_return_helper:"Automatic rotation pauses for this time.",section_general:"General",section_tab_bar:"Tab bar",section_animation:"Animation",section_sizes:"Sizes & spacing",section_mobile:"Mobile / narrow card",section_sync:"Control via entity",tab_bar:"Tab bar",bar_show:"Always visible",bar_auto:"Hide automatically",bar_hidden:"Hidden",tab_bar_auto_hide:"Hide after (s)",tab_overflow:"Many tabs",overflow_scroll:"Scroll",overflow_arrows:"Scroll with arrows",overflow_menu:"Scroll + menu",overflow_wrap:"Wrap to multiple lines",sliding_indicator:"Sliding indicator",anim_slide_vertical:"Slide vertically",anim_zoom:"Zoom",anim_flip:"Flip (3D)",anim_cube:"Cube (3D)",anim_blur:"Blur",anim_bounce:"Bounce",anim_random:"Random",animation_duration:"Duration (ms)",animation_easing:"Easing",easing_ease:"Smooth",easing_ease_in_out:"Slow – fast – slow",easing_ease_out:"Decelerate",easing_linear:"Linear",easing_spring:"Spring",title:"Title (optional)",tab_font_size:"Font size (px)",tab_icon_size:"Icon size (px)",tab_height:"Tab height (px)",tab_spacing:"Space between tabs (px)",tab_radius:"Corner radius (px)",content_padding:"Content padding (px)",content_height:"Fixed height (px, 0 = automatic)",content_height_helper:"With a fixed height the dashboard does not jump when switching; the content scrolls.",mobile_helper:"These options apply when the card is narrower than the breakpoint (phone or narrow column).",mobile_breakpoint:"Breakpoint (px)",mobile_breakpoint_helper:"Card width below which the mobile options apply.",same_as_default:"Same as default",swipe_follow:"Content follows the finger",sync_helper:"Links the active tab to a helper (input_select, input_text, input_number). Automations can then switch the tab, e.g. input_select.select_option. Option names must match the tab ID or name (input_number: tab number starting at 1). The same tab is then shown on all devices.",sync_entity:"Entity",sync_entity_helper:"Tip: create an input_select with the tab names as options.",sync_mode:"Direction",sync_both:"Both directions",sync_read:"Only follow the entity",sync_write:"Only write to the entity"}},de:{card:{name:"Card Tabs",description:"Tabs mit eigenen Sektionen für Karten – Farben, Icons, Bedingungen und automatischer Wechsel.",no_tabs:"Keine Tabs konfiguriert. Öffne den Editor, um Tabs hinzuzufügen.",hidden_tab:"Durch Bedingungen ausgeblendet",stub_tab_1:"Tab 1",stub_tab_2:"Tab 2",stub_text_1:"## Tab 1\nFüge diesem Tab im Editor Karten hinzu.",stub_text_2:"## Tab 2\nJeder Tab ist eine eigene Sektion.",more_tabs:"Weitere Tabs",show_tabs:"Tabs anzeigen",disabled_tab:"Deaktiviert"},editor:{page_tabs:"Tabs",page_appearance:"Darstellung",page_behavior:"Verhalten",add_tab:"Tab hinzufügen",new_tab:"Tab {n}",move_left:"Nach links",move_right:"Nach rechts",duplicate:"Duplizieren",delete:"Löschen",delete_tab_confirm:'Tab "{name}" inklusive aller Karten löschen?',tab_general:"Allgemein",tab_cards:"Karten",tab_conditions:"Bedingungen",tab_style:"Stil",no_tabs:"Noch keine Tabs – füge deinen ersten Tab hinzu.",name:"Name",icon:"Icon",badge_entity:"Badge-Entität (zeigt ihren Zustand am Tab)",columns:"Spalten in dieser Sektion",skip_cycle:"Beim automatischen Wechsel überspringen",cycle_duration:"Anzeigedauer beim Wechsel (s, leer = global)",color:"Akzentfarbe (aktiver Tab)",text_color:"Text-/Iconfarbe",active_text_color:"Text-/Iconfarbe (aktiv)",background_color:"Hintergrundfarbe",color_helper:"Hex-Wert (#ff9800), CSS-Farbe, var(--…) oder Home-Assistant-Farbname (red, primary …). Leer = Standard.",tab_colors_helper:"Überschreibt für diesen Tab die globalen Farben aus „Darstellung“.",pick_color:"Farbe wählen",clear:"Zurücksetzen",add_card:"Karte hinzufügen",card_n:"Karte {n}",toggle_editor:"Code-/Visuellen Editor umschalten",move_up:"Nach oben",move_down:"Nach unten",copy:"Kopieren",move_to_tab:"In Tab verschieben …",no_cards:"Dieser Tab enthält noch keine Karten.",loading:"Editor wird geladen …",conditions_helper:"Der Tab wird nur angezeigt, wenn die Bedingungen erfüllt sind. Ohne Bedingungen ist er immer sichtbar. Im Bearbeitungsmodus werden ausgeblendete Tabs ausgegraut angezeigt.",condition_mode:"Tab anzeigen, wenn",condition_mode_all:"alle Bedingungen erfüllt sind (UND)",condition_mode_any:"mindestens eine Bedingung erfüllt ist (ODER)",add_condition:"Bedingung hinzufügen",cond_state:"Entitätszustand",cond_numeric_state:"Numerischer Wert",cond_user:"Benutzer",cond_screen:"Bildschirmgröße",cond_time:"Uhrzeit / Wochentag",cond_template:"Template",cond_and:"UND-Gruppe",cond_or:"ODER-Gruppe",cond_not:"NICHT-Gruppe",cond_yaml_only:"Diese Bedingung kann nur im Code-Editor bearbeitet werden.",entity:"Entität",attribute:"Attribut (optional)",operator:"Operator",op_is:"ist",op_is_not:"ist nicht",state:"Zustand",state_helper:"Mehrere Werte mit Komma trennen.",above:"Über",below:"Unter",users:"Benutzer",media_query:"Bildschirm / Media Query",screen_mobile:"Mobil (< 768px)",screen_tablet:"Tablet (768–1023px)",screen_desktop:"Desktop (≥ 1024px)",screen_wide:"Breit (≥ 1280px)",after:"Ab",before:"Bis",weekdays:"Wochentage",mon:"Montag",tue:"Dienstag",wed:"Mittwoch",thu:"Donnerstag",fri:"Freitag",sat:"Samstag",sun:"Sonntag",value_template:"Template (true = anzeigen)",tab_position:"Position der Tab-Leiste",pos_top:"Oben",pos_bottom:"Unten",pos_left:"Links",pos_right:"Rechts",tab_style:"Tab-Stil",style_underline:"Unterstrichen",style_pills:"Pillen",style_buttons:"Buttons",style_segmented:"Segmentiert",tab_alignment:"Ausrichtung",align_start:"Anfang",align_center:"Mitte",align_end:"Ende",align_stretch:"Volle Breite",tab_content:"Tab-Inhalt",content_icon_name:"Icon und Name",content_icon:"Nur Icon",content_name:"Nur Name",icon_position:"Icon-Position",icon_start:"Neben dem Namen",icon_top:"Über dem Namen",card_background:"Kartenhintergrund anzeigen",inner_cards_background:"Hintergrund der Karten in den Tabs anzeigen",hide_single_tab:"Tab-Leiste ausblenden, wenn nur ein Tab sichtbar ist",animation:"Animation beim Wechsel",anim_none:"Keine",anim_fade:"Einblenden",anim_slide:"Horizontal schieben",card_gap:"Abstand zwischen Karten (px)",global_colors:"Farben (alle Tabs)",default_tab:"Standard-Tab",remember_tab:"Zuletzt gewählten Tab merken (pro Gerät)",swipe:"Tabs per Wischgeste wechseln (Touch)",return_to_default:"Nach Inaktivität zum Standard-Tab zurück (s, 0 = aus)",auto_cycle:"Automatischer Wechsel",auto_cycle_enabled:"Tabs automatisch wechseln",interval:"Intervall (Sekunden)",pause_on_interaction:"Pause nach Interaktion (s, 0 = keine Pause)",pause_on_hover:"Pausieren, solange die Maus über der Karte ist",show_progress:"Fortschrittsbalken anzeigen",progress_position:"Position des Fortschrittsbalkens",progress_height:"Dicke (px)",progress_bar:"An der Tab-Leiste",progress_content_end:"Am anderen Ende des Inhalts",progress_card_top:"Oberer Kartenrand",progress_card_bottom:"Unterer Kartenrand",progress_tab:"Im aktiven Tab",auto_cycle_helper:"Im Bearbeitungsmodus und in der Editor-Vorschau ist der automatische Wechsel pausiert.",id:"ID (optional)",id_helper:"Zum Steuern des Tabs per Entität/Automation. Standard: der Name.",disabled:"Tab deaktivieren (ausblenden ohne zu löschen)",section_badge:"Badge",badge:"Badge-Text oder Template",badge_helper:"Z. B. {{ states.light | selectattr('state','eq','on') | list | count }}. Leer, 0 oder false blendet das Badge aus.",badge_dot:"Nur als Punkt anzeigen",badge_color:"Badge-Farbe",section_dynamic:"Dynamisch (Templates)",name_template:"Name-Template",icon_template:"Icon-Template",color_template:"Farb-Template",template_helper:"Überschreibt den festen Wert, solange das Template etwas liefert.",section_actions:"Aktionen",actions_helper:"Tippen öffnet immer den Tab. Zusätzliche Aktionen beim Halten oder Doppeltippen:",hold_action:"Aktion beim Halten",double_tap_action:"Aktion beim Doppeltippen",section_jump:"Automatisch zu diesem Tab springen",jump_helper:"Werden diese Bedingungen wahr, wechselt die Karte zu diesem Tab (z. B. Türklingel, Waschmaschine fertig).",jump_condition_mode:"Springen, wenn",jump_return:"Danach zurück zum vorherigen Tab (s, 0 = bleiben)",jump_return_helper:"Der automatische Wechsel pausiert so lange.",section_general:"Allgemein",section_tab_bar:"Tab-Leiste",section_animation:"Animation",section_sizes:"Größen & Abstände",section_mobile:"Mobil / schmale Karte",section_sync:"Steuerung per Entität",tab_bar:"Tab-Leiste",bar_show:"Immer sichtbar",bar_auto:"Automatisch ausblenden",bar_hidden:"Ausgeblendet",tab_bar_auto_hide:"Ausblenden nach (s)",tab_overflow:"Viele Tabs",overflow_scroll:"Scrollen",overflow_arrows:"Scrollen mit Pfeilen",overflow_menu:"Scrollen + Menü",overflow_wrap:"Mehrzeilig umbrechen",sliding_indicator:"Gleitender Indikator",anim_slide_vertical:"Vertikal schieben",anim_zoom:"Zoom",anim_flip:"Umblättern (3D)",anim_cube:"Würfel (3D)",anim_blur:"Unschärfe",anim_bounce:"Abprallen",anim_random:"Zufällig",animation_duration:"Dauer (ms)",animation_easing:"Verlauf",easing_ease:"Weich",easing_ease_in_out:"Langsam – schnell – langsam",easing_ease_out:"Abbremsend",easing_linear:"Linear",easing_spring:"Federnd",title:"Überschrift (optional)",tab_font_size:"Schriftgröße (px)",tab_icon_size:"Icongröße (px)",tab_height:"Tab-Höhe (px)",tab_spacing:"Abstand zwischen Tabs (px)",tab_radius:"Eckenradius (px)",content_padding:"Innenabstand Inhalt (px)",content_height:"Feste Höhe (px, 0 = automatisch)",content_height_helper:"Mit fester Höhe springt das Dashboard beim Wechseln nicht; der Inhalt scrollt.",mobile_helper:"Diese Optionen gelten, wenn die Karte schmaler als der Umbruchpunkt ist (Handy oder schmale Spalte).",mobile_breakpoint:"Umbruchpunkt (px)",mobile_breakpoint_helper:"Kartenbreite, unter der die Mobil-Optionen gelten.",same_as_default:"Wie Standard",swipe_follow:"Inhalt folgt dem Finger",sync_helper:"Verknüpft den aktiven Tab mit einem Helfer (input_select, input_text, input_number). Automationen können so den Tab wechseln, z. B. mit input_select.select_option. Die Optionen müssen der Tab-ID oder dem Namen entsprechen (input_number: Tab-Nummer ab 1). Auf allen Geräten wird dann derselbe Tab angezeigt.",sync_entity:"Entität",sync_entity_helper:"Tipp: Lege einen input_select mit den Tab-Namen als Optionen an.",sync_mode:"Richtung",sync_both:"Beide Richtungen",sync_read:"Nur der Entität folgen",sync_write:"Nur in die Entität schreiben"}}};function qt(t,e){return e.split(".").reduce((t,e)=>null==t?void 0:t[e],Wt[t])}function Kt(t,e,i){let n=qt((t?.locale?.language||t?.language||navigator.language||"en").split("-")[0].toLowerCase(),e)??qt("en",e)??e;if(i)for(const[t,e]of Object.entries(i))n=n.replace(`{${t}}`,e);return n}const Vt=o`
  :host {
    display: block;
  }
  :host([hidden]) {
    display: none !important;
  }
  ha-card {
    position: relative;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  ha-card.menu-open {
    overflow: visible;
    z-index: 2;
  }
  .title {
    padding: 12px 16px 4px;
    font-family: var(--ha-card-header-font-family, inherit);
    font-size: var(--ha-card-header-font-size, 20px);
    font-weight: 500;
    line-height: 1.3;
    color: var(--ha-card-header-color, var(--primary-text-color));
  }
  .no-bg .title {
    padding-left: 0;
    padding-right: 0;
  }
  ha-card.no-bg {
    background: none;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
  }
  .root.pos-bottom {
    flex-direction: column-reverse;
  }
  .root.pos-left {
    flex-direction: row;
  }
  .root.pos-right {
    flex-direction: row-reverse;
  }

  /* ---------- tab bar ---------- */
  .bar-wrap {
    flex: 0 0 auto;
    display: grid;
    grid-template-rows: 1fr;
    min-width: 0;
    transition:
      grid-template-rows 0.3s ease,
      grid-template-columns 0.3s ease,
      opacity 0.3s ease;
  }
  .bar-wrap.vertical {
    grid-template-rows: none;
    grid-template-columns: 1fr;
    max-width: 40%;
  }
  .bar-wrap.collapsed {
    grid-template-rows: 0fr;
    opacity: 0;
    pointer-events: none;
  }
  .bar-wrap.vertical.collapsed {
    grid-template-columns: 0fr;
  }
  .bar-wrap.edit-only {
    opacity: 0.55;
  }
  .bar-inner {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
  .bar-row {
    display: flex;
    align-items: center;
    min-width: 0;
  }
  .bar-wrap.vertical .bar-row {
    flex-direction: column;
    align-items: stretch;
    height: 100%;
  }
  .bar-btn {
    all: unset;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    color: var(--secondary-text-color);
  }
  .bar-btn:hover:not([disabled]) {
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .bar-btn[disabled] {
    opacity: 0.3;
    cursor: default;
  }
  .bar-btn ha-icon {
    --mdc-icon-size: 22px;
  }
  .bar-handle {
    all: unset;
    flex: 0 0 auto;
    align-self: center;
    width: 44px;
    height: 5px;
    margin: 6px auto;
    border-radius: 3px;
    background: var(--divider-color, rgba(0, 0, 0, 0.2));
    cursor: pointer;
  }
  .pos-left .bar-handle,
  .pos-right .bar-handle {
    width: 5px;
    height: 44px;
    margin: auto 6px;
  }
  .tabbar {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    gap: var(--hct-tab-gap, 4px);
    padding: 6px 8px 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    box-sizing: border-box;
    min-width: 0;
  }
  .tabbar.wrap {
    flex-wrap: wrap;
    overflow: visible;
  }
  .tabbar::-webkit-scrollbar {
    display: none;
  }
  .no-bg .tabbar {
    padding-left: 0;
    padding-right: 0;
  }
  .pos-bottom .tabbar {
    padding: 0 8px 6px;
  }
  .tabbar.vertical {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 8px 0 8px 8px;
  }
  .pos-right .tabbar.vertical {
    padding: 8px 8px 8px 0;
  }
  .tabbar.align-center {
    justify-content: center;
  }
  .tabbar.align-end {
    justify-content: flex-end;
  }
  .tabbar.align-stretch .tab {
    flex: 1 1 0;
    justify-content: center;
  }
  .tabbar.style-underline:not(.vertical) {
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .pos-bottom .tabbar.style-underline {
    border-bottom: none;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .pos-left .tabbar.style-underline {
    border-right: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .pos-right .tabbar.style-underline {
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .tabbar.style-segmented {
    margin: 8px 8px 0;
    padding: 4px;
    gap: var(--hct-tab-gap, 2px);
    border-radius: calc(var(--hct-radius, 9px) + 3px);
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .no-bg .tabbar.style-segmented {
    margin-left: 0;
    margin-right: 0;
  }
  .pos-bottom .tabbar.style-segmented {
    margin: 0 8px 8px;
  }
  .tabbar.vertical.style-segmented {
    margin: 8px 0 8px 8px;
  }
  .pos-right .tabbar.vertical.style-segmented {
    margin: 8px 8px 8px 0;
  }

  /* ---------- tab ---------- */
  .tab {
    --_color: var(--hct-color, var(--primary-color));
    all: unset;
    box-sizing: border-box;
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 6px;
    z-index: 1;
    min-height: var(--hct-tab-height, 40px);
    padding: 8px 14px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
    font-size: var(--hct-font-size, var(--hacard-tabs-font-size, 14px));
    font-weight: 500;
    line-height: 1.2;
    color: var(--hct-text, var(--secondary-text-color));
    background: var(--hct-bg, transparent);
    border-radius: var(--hct-radius, 8px) var(--hct-radius, 8px) 0 0;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      opacity 0.2s ease;
  }
  .tab:hover {
    background-color: var(--hct-bg, rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.05));
  }
  .tab:focus-visible {
    outline: 2px solid var(--_color);
    outline-offset: -2px;
  }
  .tab ha-icon {
    --mdc-icon-size: var(--hct-icon-size, var(--hacard-tabs-icon-size, 20px));
    flex: 0 0 auto;
  }
  .tab.icon-top {
    flex-direction: column;
    gap: 2px;
    padding: 6px 12px;
    font-size: var(--hct-font-size, var(--hacard-tabs-font-size, 12px));
  }
  .tab .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tab .badge {
    min-width: 18px;
    padding: 1px 6px;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary-color, #fff);
    background: var(--hct-badge, var(--_color));
  }
  .badge.dot {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 0;
    width: 9px;
    height: 9px;
    padding: 0;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--card-background-color, #fff);
  }
  .tab.icon-top .badge {
    position: absolute;
    top: 2px;
    right: 2px;
  }
  .tab .cond-icon {
    --mdc-icon-size: 14px;
    opacity: 0.8;
  }
  .tab.cond-hidden {
    opacity: 0.45;
    outline: 1px dashed var(--secondary-text-color);
    outline-offset: -3px;
  }
  .vertical .tab {
    border-radius: var(--hct-radius, 8px) 0 0 var(--hct-radius, 8px);
  }
  .pos-right .vertical .tab {
    border-radius: 0 var(--hct-radius, 8px) var(--hct-radius, 8px) 0;
  }
  .pos-bottom .tab {
    border-radius: 0 0 var(--hct-radius, 8px) var(--hct-radius, 8px);
  }

  /* underline */
  .style-underline .tab.active {
    color: var(--hct-active-text, var(--_color));
  }
  .style-underline .tab::after {
    content: "";
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: var(--_color);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
  .style-underline .tab.active::after {
    transform: scaleX(1);
  }
  .pos-bottom .style-underline .tab::after {
    bottom: auto;
    top: 0;
    border-radius: 0 0 3px 3px;
  }
  .vertical.style-underline .tab::after {
    left: auto;
    right: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    height: auto;
    border-radius: 3px 0 0 3px;
    transform: scaleY(0);
  }
  .vertical.style-underline .tab.active::after {
    transform: scaleY(1);
  }
  .pos-right .vertical.style-underline .tab::after {
    right: auto;
    left: 0;
    border-radius: 0 3px 3px 0;
  }

  /* pills / buttons / segmented */
  .style-pills .tab {
    border-radius: var(--hct-radius, 999px);
  }
  .style-pills,
  .style-buttons {
    padding-bottom: 6px;
  }
  .pos-bottom .style-pills,
  .pos-bottom .style-buttons {
    padding-top: 6px;
  }
  .style-buttons .tab {
    border-radius: var(--hct-radius, 12px);
    background: var(--hct-bg, rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06));
  }
  .style-segmented .tab {
    border-radius: var(--hct-radius, 9px);
    min-height: var(--hct-tab-height, 34px);
  }
  .style-pills .tab.active,
  .style-buttons .tab.active,
  .style-segmented .tab.active {
    background: var(--_color);
    color: var(--hct-active-text, var(--text-primary-color, #fff));
  }
  .style-pills .tab.active .badge:not(.dot),
  .style-buttons .tab.active .badge:not(.dot),
  .style-segmented .tab.active .badge:not(.dot) {
    background: var(--card-background-color, #fff);
    color: var(--_color);
  }

  /* sliding indicator */
  .indicator {
    --_color: var(--hct-color, var(--primary-color));
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    z-index: 0;
    opacity: 0;
    pointer-events: none;
    transition:
      left var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      top var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      width var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      height var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      opacity 0.2s ease;
  }
  .indicator.instant {
    transition: none;
  }
  .indicator::after {
    content: "";
    position: absolute;
    background: var(--_color);
    border-radius: inherit;
    transition: background-color 0.3s ease;
  }
  .style-underline .indicator::after {
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }
  .pos-bottom .style-underline .indicator::after {
    bottom: auto;
    top: 0;
    border-radius: 0 0 3px 3px;
  }
  .vertical.style-underline .indicator::after {
    left: auto;
    right: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    height: auto;
    border-radius: 3px 0 0 3px;
  }
  .pos-right .vertical.style-underline .indicator::after {
    right: auto;
    left: 0;
    border-radius: 0 3px 3px 0;
  }
  .style-pills .indicator {
    border-radius: var(--hct-radius, 999px);
  }
  .style-buttons .indicator {
    border-radius: var(--hct-radius, 12px);
  }
  .style-segmented .indicator {
    border-radius: var(--hct-radius, 9px);
  }
  .style-pills .indicator::after,
  .style-buttons .indicator::after,
  .style-segmented .indicator::after {
    inset: 0;
  }
  .tabbar.sliding .tab::after {
    display: none;
  }
  .tabbar.sliding.style-pills .tab.active,
  .tabbar.sliding.style-buttons .tab.active,
  .tabbar.sliding.style-segmented .tab.active {
    background: transparent;
  }

  /* overflow menu */
  .menu {
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 180px;
    max-width: 280px;
    max-height: 320px;
    overflow-y: auto;
    padding: 6px;
    box-sizing: border-box;
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22);
  }
  .menu-item {
    --_color: var(--hct-color, var(--primary-color));
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--primary-text-color);
  }
  .menu-item:hover {
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .menu-item.active {
    color: var(--_color);
    font-weight: 500;
  }
  .menu-item ha-icon {
    --mdc-icon-size: 20px;
    color: var(--_color);
  }
  .menu-item .spacer {
    width: 20px;
  }
  .menu-item .label {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .menu-item .badge {
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-primary-color, #fff);
    background: var(--hct-badge, var(--_color));
  }

  /* ---------- body ---------- */
  .body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  }
  .pos-bottom .body {
    flex-direction: column-reverse;
  }
  .progress {
    height: var(--hct-progress-height, 3px);
    flex: 0 0 auto;
    overflow: hidden;
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .progress .bar {
    height: 100%;
    background: var(--hct-color, var(--primary-color));
    transform-origin: left center;
    animation-name: hct-progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  .progress .bar.paused {
    animation-play-state: paused;
  }
  /* progress inside the active tab: uses the tab's text color */
  .progress.progress-tab {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 5px;
    border-radius: 2px;
    background: none;
    pointer-events: none;
  }
  .progress.progress-tab::before {
    content: "";
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0.25;
  }
  .progress.progress-tab .bar {
    position: relative;
    background: currentColor;
  }
  .tab.icon-top .progress.progress-tab {
    bottom: 2px;
  }
  .pos-bottom .style-underline .progress.progress-tab {
    bottom: auto;
    top: 5px;
  }
  @keyframes hct-progress {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 8px));
    min-width: 0;
    flex: 1 1 auto;
    box-sizing: border-box;
  }
  .content.fixed-height {
    overflow-y: auto;
  }
  .no-bg .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 8px 0 0 0));
  }
  .no-bg.bar-bottom .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 0 0 8px 0));
  }
  .no-bg.bar-left .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 0 0 0 8px));
  }
  .no-bg.bar-right .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 0 8px 0 0));
  }
  .viewport {
    position: relative;
  }
  .viewport.animating,
  .viewport.dragging {
    overflow: hidden;
  }
  .viewport > .leaving,
  .viewport > .drag-neighbor {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .viewport > .leaving {
    pointer-events: none;
  }
  .viewport.animating > .section {
    backface-visibility: hidden;
  }
  .viewport.dragging > .section {
    will-change: transform;
  }
  .section {
    display: grid;
    grid-template-columns: repeat(var(--hct-columns, 1), minmax(0, 1fr));
    gap: var(--hct-gap, 8px);
    align-items: start;
  }
  .section > * {
    min-width: 0;
  }
  .flat-inner .section {
    --ha-card-background: transparent;
    --ha-card-box-shadow: none;
    --ha-card-border-width: 0;
    --ha-card-border-color: transparent;
  }
  :host([editing]) .section:empty::before {
    content: attr(data-empty);
    display: block;
    padding: 24px 8px;
    text-align: center;
    color: var(--secondary-text-color);
    border: 1px dashed var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: 8px;
  }
  @media (prefers-reduced-motion: reduce) {
    .tab,
    .tab::after,
    .indicator,
    .bar-wrap {
      animation: none !important;
      transition: none !important;
    }
  }
  .empty {
    padding: 16px;
    color: var(--secondary-text-color);
  }
`;function Xt(t){if(null==t||""===t)return;if(Array.isArray(t)&&t.length>=3)return`rgb(${t.slice(0,3).join(", ")})`;const e=String(t).trim();return St.includes(e)?`var(--${e}-color)`:e}function Yt(t,e,i,n={}){const s=new CustomEvent(e,{bubbles:n.bubbles??!0,composed:n.composed??!0,cancelable:Boolean(n.cancelable),detail:i});return t.dispatchEvent(s),s}let Gt;function Zt(){return Gt||(Gt=window.loadCardHelpers?window.loadCardHelpers():Promise.resolve(void 0)),Gt}const Jt=(t,e)=>Promise.race([t,new Promise(t=>setTimeout(t,e))]);async function Qt(t,e,i){const n=`hui-${e}-card`;let s=customElements.get(n);!s&&t&&(t.createCardElement({type:e,...i}),await Jt(customElements.whenDefined(n),5e3),s=customElements.get(n)),s?.getConfigElement&&await s.getConfigElement()}let te;const ee=["color","text_color","active_text_color","background_color"],ie=t=>null==t?[]:Array.isArray(t)?t:[t],ne=t=>null==t||""===t||Array.isArray(t)&&0===t.length;function se(t){const e=[];for(const i of t)"grid"===i.type||"expandable"===i.type?e.push(...se(i.schema)):i.name&&e.push(i.name);return e}function oe(t,e,i,n={}){const s={...t};for(const t of i){const i=e[t];ne(i)||t in n&&n[t]===i?delete s[t]:s[t]=i}return s}class ae extends at{static properties={hass:{attribute:!1},lovelace:{attribute:!1},_config:{state:!0},_page:{state:!0},_selectedTab:{state:!0},_tabPage:{state:!0},_selectedCard:{state:!0},_guiMode:{state:!0},_guiModeAvailable:{state:!0},_loaded:{state:!0},_users:{state:!0}};constructor(){super(),this._page="tabs",this._selectedTab=0,this._tabPage="general",this._selectedCard=0,this._guiMode=!0,this._guiModeAvailable=!0,this._loaded=!1}setConfig(t){this._config={...t,tabs:Array.isArray(t?.tabs)?t.tabs:[]};const e=this._config.tabs.length;this._selectedTab>=e&&(this._selectedTab=Math.max(0,e-1))}connectedCallback(){super.connectedCallback(),(te||(te=(async()=>{const t=["ha-form","hui-card-element-editor","hui-card-picker"];if(t.every(t=>customElements.get(t)))return;const e=await Zt();try{await Qt(e,"vertical-stack",{cards:[]})}catch(t){}try{await Qt(e,"entities",{entities:[]})}catch(t){}await Jt(Promise.all(t.map(t=>customElements.whenDefined(t))),1e4)})()),te).catch(()=>{}).then(()=>{this._loaded=!0}),this._syncPreview()}disconnectedCallback(){super.disconnectedCallback(),delete window.__hacardTabsEditorSelection}_t(t,e){return Kt(this.hass,`editor.${t}`,e)}get _tabs(){return this._config?.tabs||[]}_tabName(t,e){return t?.name||this._t("new_tab",{n:e+1})}_commit(t){this._config=t,Yt(this,"config-changed",{config:t}),this._syncPreview()}_syncPreview(){this._config&&(window.__hacardTabsEditorSelection={key:JSON.stringify(this._config.tabs||[]),index:this._selectedTab},setTimeout(()=>window.dispatchEvent(new CustomEvent(vt)),0))}_setTabs(t,e={}){this._commit({...this._config,...e,tabs:t})}_updateTab(t,e){const i=[...this._tabs];i[t]=e({...i[t]||{}}),this._setTabs(i)}_iconButton(t,e,i,n=!1,s=""){return H`
      <button
        class="icon-btn ${s}"
        type="button"
        title=${e}
        aria-label=${e}
        ?disabled=${n}
        @click=${i}
      >
        <ha-icon .icon=${t}></ha-icon>
      </button>
    `}_form(t,e,i,n=this._computeLabel){return H`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${e}
        .computeLabel=${n}
        .computeHelper=${this._computeHelper}
        @value-changed=${t=>{t.stopPropagation(),i({...t.detail.value})}}
      ></ha-form>
    `}_panel(t,e,i,n=!1){return H`
      <details class="panel" ?open=${n}>
        <summary>
          <ha-icon .icon=${e}></ha-icon>
          <span>${this._t(t)}</span>
          <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="panel-body">${i}</div>
      </details>
    `}_computeLabel=t=>this._t({media_query:"media_query",value_template:"value_template"}[t.name]||t.name);_computeHelper=t=>{const e={state:"state_helper",id:"id_helper",badge:"badge_helper",name_template:"template_helper",icon_template:"template_helper",color_template:"template_helper",jump_return:"jump_return_helper",sync_entity:"sync_entity_helper",mobile_breakpoint:"mobile_breakpoint_helper",content_height:"content_height_helper"};return e[t.name]?this._t(e[t.name]):void 0};render(){if(!this.hass||!this._config)return W;return H`
      <div class="pages" role="tablist">
        ${[["tabs","mdi:tab"],["appearance","mdi:palette-outline"],["behavior","mdi:cog-outline"]].map(([t,e])=>H`
            <button
              type="button"
              role="tab"
              class="page-btn ${this._page===t?"active":""}"
              aria-selected=${this._page===t?"true":"false"}
              @click=${()=>{this._page=t}}
            >
              <ha-icon .icon=${e}></ha-icon>
              <span>${this._t(`page_${t}`)}</span>
            </button>
          `)}
      </div>
      ${"tabs"===this._page?this._renderTabsPage():"appearance"===this._page?this._renderAppearancePage():this._renderBehaviorPage()}
    `}_renderTabsPage(){const t=this._tabs;return H`
      <div class="chips">
        ${t.map((t,e)=>H`
            <button
              type="button"
              class="chip ${e===this._selectedTab?"active":""} ${t.disabled?"disabled":""}"
              style=${Xt(t.color)?`--chip-color: ${Xt(t.color)}`:""}
              @click=${()=>this._selectTab(e)}
            >
              ${t.icon?H`<ha-icon .icon=${t.icon}></ha-icon>`:W}
              <span>${this._tabName(t,e)}</span>
              ${t.disabled?H`<ha-icon class="mini" icon="mdi:cancel"></ha-icon>`:ie(t.conditions).length?H`<ha-icon class="mini" icon="mdi:eye-check-outline"></ha-icon>`:W}
              ${ie(t.jump_conditions).length?H`<ha-icon class="mini" icon="mdi:debug-step-into"></ha-icon>`:W}
            </button>
          `)}
        <button type="button" class="chip add" @click=${this._addTab}>
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("add_tab")}</span>
        </button>
      </div>
      ${t.length?this._renderTabEditor(this._selectedTab):H`<div class="hint">${this._t("no_tabs")}</div>`}
    `}_renderTabEditor(t){const e=this._tabs[t]||{},i=ie(e.conditions).length,n=ie(e.cards).length;return H`
      <div class="tab-editor">
        <div class="toolbar">
          <div class="subnav">
            ${[["general","mdi:form-textbox"],["cards","mdi:cards-outline"],["conditions","mdi:eye-check-outline"],["style","mdi:palette-swatch-outline"]].map(([t,s])=>H`
                <button
                  type="button"
                  class="sub-btn ${this._tabPage===t?"active":""}"
                  @click=${()=>{this._tabPage=t}}
                >
                  <ha-icon .icon=${s}></ha-icon>
                  <span>${this._t(`tab_${t}`)}</span>
                  ${"cards"===t?H`<span class="count">${n}</span>`:W}
                  ${"conditions"===t&&i+ie(e.jump_conditions).length?H`<span class="count">${i+ie(e.jump_conditions).length}</span>`:W}
                </button>
              `)}
          </div>
          <div class="actions">
            ${this._iconButton("mdi:arrow-left",this._t("move_left"),()=>this._moveTab(t,-1),0===t)}
            ${this._iconButton("mdi:arrow-right",this._t("move_right"),()=>this._moveTab(t,1),t===this._tabs.length-1)}
            ${this._iconButton("mdi:content-duplicate",this._t("duplicate"),()=>this._duplicateTab(t))}
            ${this._iconButton("mdi:delete-outline",this._t("delete"),()=>this._deleteTab(t),!1,"danger")}
          </div>
        </div>
        <div class="tab-body">
          ${"general"===this._tabPage?this._renderTabGeneral(t,e):"cards"===this._tabPage?this._renderTabCards(t,e):"conditions"===this._tabPage?this._renderTabConditions(t,e):this._renderTabStyle(t,e)}
        </div>
      </div>
    `}_renderTabGeneral(t,e){const i=(e,i={})=>n=>{void 0!==n.columns&&(n.columns=Number(n.columns)||void 0),this._updateTab(t,t=>oe(t,n,e,i))},n=[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{type:"grid",name:"",schema:[{name:"columns",selector:{number:{min:1,max:6,mode:"box"}}},{name:"id",selector:{text:{}}}]},{name:"disabled",selector:{boolean:{}}}];this._config.auto_cycle?.enabled&&n.push({type:"grid",name:"",schema:[{name:"cycle_duration",selector:{number:{min:1,max:86400,mode:"box",unit_of_measurement:"s"}}},{name:"skip_cycle",selector:{boolean:{}}}]});const s=[{name:"badge_entity",selector:{entity:{}}},{name:"badge",selector:{text:{}}},{name:"badge_dot",selector:{boolean:{}}}],o=[{name:"name_template",selector:{template:{}}},{name:"icon_template",selector:{template:{}}},{name:"color_template",selector:{template:{}}}],a=[{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}],r=o.some(t=>e[t.name]),c=a.some(t=>e[t.name]);return H`
      ${this._form({columns:1,...e},n,i(se(n),{columns:1,skip_cycle:!1,disabled:!1}))}
      ${this._panel("section_badge","mdi:numeric-1-circle-outline",H`
          ${this._form(e,s,i(se(s),{badge_dot:!1}))}
          ${this._renderColorField("badge_color",e.badge_color,e=>this._updateTab(t,t=>oe(t,{badge_color:e},["badge_color"])))}
        `,Boolean(e.badge_entity||e.badge))}
      ${this._panel("section_dynamic","mdi:code-braces",this._form(e,o,i(se(o))),r)}
      ${this._panel("section_actions","mdi:gesture-tap-hold",H`<div class="hint small">${this._t("actions_helper")}</div>
          ${this._form(e,a,i(se(a)))}`,c)}
    `}_renderTabStyle(t,e){return H`
      <div class="hint">${this._t("tab_colors_helper")}</div>
      ${ee.map(i=>this._renderColorField(i,e[i],e=>this._updateTab(t,t=>oe(t,{[i]:e},[i]))))}
      <div class="hint small">${this._t("color_helper")}</div>
    `}_renderColorField(t,e,i){const n=Xt(e);return H`
      <div class="color-field">
        <label
          class="swatch ${n?"":"empty"}"
          title=${this._t("pick_color")}
          style=${n?`background: ${n}`:""}
        >
          <input
            type="color"
            .value=${function(t){const e=Xt(t);if(!e)return"#03a9f4";const i=/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(e);if(i)return`#${i[1]}${i[1]}${i[2]}${i[2]}${i[3]}${i[3]}`.toLowerCase();if(/^#[0-9a-f]{6}$/i.test(e))return e.toLowerCase();try{const t=document.createElement("span");t.style.color=e,t.style.display="none",document.body.appendChild(t);const i=getComputedStyle(t).color;t.remove();const n=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(i);if(n)return`#${n.slice(1,4).map(t=>Number(t).toString(16).padStart(2,"0")).join("")}`}catch(t){}return"#03a9f4"}(e)}
            @change=${t=>i(t.target.value)}
            aria-label=${this._t("pick_color")}
          />
          ${n?W:H`<ha-icon icon="mdi:palette-outline"></ha-icon>`}
        </label>
        <ha-form
          class="grow"
          .hass=${this.hass}
          .data=${{[t]:e??""}}
          .schema=${[{name:t,selector:{text:{}}}]}
          .computeLabel=${this._computeLabel}
          @value-changed=${e=>{e.stopPropagation(),i(e.detail.value[t])}}
        ></ha-form>
        ${e?this._iconButton("mdi:close",this._t("clear"),()=>i(void 0)):W}
      </div>
    `}_renderTabCards(t,e){const i=ie(e.cards),n=Math.min(this._selectedCard,i.length);return this._loaded?H`
      <div class="chips small">
        ${i.map((t,e)=>H`
            <button
              type="button"
              class="chip small ${e===n?"active":""}"
              title=${t?.type||""}
              @click=${()=>this._selectCard(e)}
            >
              <span>${e+1}</span>
              <span class="card-type">${String(t?.type||"").replace(/^custom:/,"")}</span>
            </button>
          `)}
        <button
          type="button"
          class="chip small add ${n===i.length?"active":""}"
          @click=${()=>this._selectCard(i.length)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("add_card")}</span>
        </button>
      </div>
      ${n<i.length?H`
            <div class="card-toolbar">
              <div class="actions">
                ${this._iconButton(this._guiMode?"mdi:code-braces":"mdi:list-box-outline",this._t("toggle_editor"),this._toggleCardMode,this._guiMode&&!this._guiModeAvailable)}
                ${this._iconButton("mdi:arrow-up",this._t("move_up"),()=>this._moveCard(t,n,-1),0===n)}
                ${this._iconButton("mdi:arrow-down",this._t("move_down"),()=>this._moveCard(t,n,1),n===i.length-1)}
                ${this._iconButton("mdi:content-copy",this._t("copy"),()=>this._copyCard(t,n))}
                ${this._tabs.length>1?H`
                      <select
                        class="move-select"
                        title=${this._t("move_to_tab")}
                        @change=${e=>{const i=Number(e.target.value);e.target.value="",Number.isNaN(i)||this._moveCardToTab(t,n,i)}}
                      >
                        <option value="">${this._t("move_to_tab")}</option>
                        ${this._tabs.map((e,i)=>i===t?W:H`<option value=${i}>${this._tabName(e,i)}</option>`)}
                      </select>
                    `:W}
                ${this._iconButton("mdi:delete-outline",this._t("delete"),()=>this._deleteCard(t,n),!1,"danger")}
              </div>
            </div>
            ${mt(`${t}-${n}`,H`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${i[n]}
                  @config-changed=${e=>this._cardChanged(e,t,n)}
                  @GUImode-changed=${this._guiModeChanged}
                ></hui-card-element-editor>
              `)}
          `:H`
            <hui-card-picker
              .hass=${this.hass}
              .lovelace=${this.lovelace}
              @config-changed=${e=>this._cardPicked(e,t)}
            ></hui-card-picker>
          `}
    `:H`<div class="hint">${this._t("loading")}</div>`}_selectCard(t){this._selectedCard=t,this._guiMode=!0,this._guiModeAvailable=!0}_toggleCardMode=()=>{this.renderRoot.querySelector("hui-card-element-editor")?.toggleMode?.()};_guiModeChanged=t=>{t.stopPropagation(),this._guiMode=t.detail.guiMode,this._guiModeAvailable=t.detail.guiModeAvailable};_cardChanged(t,e,i){t.stopPropagation();const n=t.detail?.config;t.detail&&"guiModeAvailable"in t.detail&&(this._guiModeAvailable=t.detail.guiModeAvailable),n&&this._updateTab(e,t=>{const e=[...ie(t.cards)];return e[i]=n,{...t,cards:e}})}_cardPicked(t,e){t.stopPropagation();const i=t.detail?.config;if(!i)return;const n=[...ie(this._tabs[e]?.cards),i];this._updateTab(e,t=>({...t,cards:n})),this._selectCard(n.length-1)}_moveCard(t,e,i){const n=e+i;this._updateTab(t,t=>{const i=[...ie(t.cards)];return n<0||n>=i.length?t:([i[e],i[n]]=[i[n],i[e]],{...t,cards:i})}),this._selectedCard=n}_copyCard(t,e){this._updateTab(t,t=>{const i=[...ie(t.cards)];return i.splice(e+1,0,structuredClone(i[e])),{...t,cards:i}}),this._selectCard(e+1)}_deleteCard(t,e){this._updateTab(t,t=>{const i=[...ie(t.cards)];return i.splice(e,1),{...t,cards:i}}),this._selectCard(Math.max(0,e-1))}_moveCardToTab(t,e,i){const n=this._tabs.map(t=>({...t})),s=[...ie(n[t].cards)],[o]=s.splice(e,1);n[t].cards=s,n[i].cards=[...ie(n[i].cards),o],this._setTabs(n),this._selectCard(Math.max(0,e-1))}_renderTabConditions(t,e){this._users||this._loadUsers();const i=ie(e.jump_conditions).length;return H`
      <div class="hint">${this._t("conditions_helper")}</div>
      ${this._renderConditionList(t,e,"conditions","condition_mode")}
      ${this._panel("section_jump","mdi:debug-step-into",H`
          <div class="hint">${this._t("jump_helper")}</div>
          ${this._renderConditionList(t,e,"jump_conditions","jump_condition_mode")}
          ${i?this._form(e,[{name:"jump_return",selector:{number:{min:0,max:86400,mode:"box",unit_of_measurement:"s"}}}],e=>this._updateTab(t,t=>oe(t,e,["jump_return"],{jump_return:0}))):W}
        `,i>0)}
    `}_renderConditionList(t,e,i,n){const s=ie(e[i]);return H`
      ${s.length>1?this._form({[n]:e[n]||"all"},[{name:n,selector:{select:{mode:"dropdown",options:[{value:"all",label:this._t("condition_mode_all")},{value:"any",label:this._t("condition_mode_any")}]}}}],e=>this._updateTab(t,t=>oe(t,e,[n],{[n]:"all"})),()=>this._t("conditions"===i?"condition_mode":"jump_condition_mode")):W}
      ${s.map((e,s)=>this._renderCondition(t,e,s,i,n))}
      <div class="add-condition">
        <div class="label">${this._t("add_condition")}</div>
        <div class="chips small">
          ${kt.map(e=>H`
              <button type="button" class="chip small" @click=${()=>this._addCondition(t,e,i)}>
                <ha-icon .icon=${Ct[e]}></ha-icon>
                <span>${this._t(`cond_${e}`)}</span>
              </button>
            `)}
        </div>
      </div>
    `}_renderCondition(t,e,i,n,s){const o=Nt(e),a=this._conditionSchema(o,e);return H`
      <div class="condition">
        <div class="condition-header">
          <ha-icon .icon=${Ct[o]||"mdi:help-circle-outline"}></ha-icon>
          <span>${Ct[o]?this._t(`cond_${o}`):o||"?"}</span>
          ${this._iconButton("mdi:delete-outline",this._t("delete"),()=>this._removeCondition(t,i,n,s),!1,"danger")}
        </div>
        ${a?this._form(this._conditionToForm(o,e),a,e=>this._setCondition(t,i,this._formToCondition(o,e),n)):H`
              <div class="hint small">${this._t("cond_yaml_only")}</div>
              <pre>${JSON.stringify(e,null,2)}</pre>
            `}
      </div>
    `}_conditionSchema(t,e){switch(t){case"state":return[{name:"entity",selector:{entity:{}}},{name:"attribute",selector:{attribute:{entity_id:e.entity}}},{type:"grid",name:"",schema:[{name:"operator",selector:{select:{mode:"dropdown",options:[{value:"is",label:this._t("op_is")},{value:"is_not",label:this._t("op_is_not")}]}}},{name:"state",selector:{text:{}}}]}];case"numeric_state":return[{name:"entity",selector:{entity:{}}},{name:"attribute",selector:{attribute:{entity_id:e.entity}}},{type:"grid",name:"",schema:[{name:"above",selector:{number:{mode:"box",step:"any"}}},{name:"below",selector:{number:{mode:"box",step:"any"}}}]}];case"user":{const t=[...this._users||[]];for(const i of ie(e.users))t.some(t=>t.value===i)||t.push({value:i,label:i});return[{name:"users",selector:{select:{mode:"list",multiple:!0,options:t}}}]}case"screen":return[{name:"media_query",selector:{select:{mode:"dropdown",custom_value:!0,options:Object.entries(Et).map(([t,e])=>({value:e,label:this._t(`screen_${t}`)}))}}}];case"time":return[{type:"grid",name:"",schema:[{name:"after",selector:{time:{}}},{name:"before",selector:{time:{}}}]},{name:"weekdays",selector:{select:{mode:"list",multiple:!0,options:At.map(t=>({value:t,label:this._t(t)}))}}}];case"template":return[{name:"value_template",selector:{template:{}}}];default:return}}_conditionToForm(t,e){if("state"===t){const t=void 0===e.state&&void 0!==e.state_not;return{entity:e.entity,attribute:e.attribute,operator:t?"is_not":"is",state:ie(t?e.state_not:e.state).join(", ")}}return{...e}}_formToCondition(t,e){const i={condition:t};if("state"===t){const t=String(e.state??"").split(",").map(t=>t.trim()).filter(t=>""!==t);return e.entity&&(i.entity=e.entity),e.attribute&&(i.attribute=e.attribute),t.length?i["is_not"===e.operator?"state_not":"state"]=1===t.length?t[0]:t:"is_not"===e.operator?i.state_not="":i.state="",i}for(const[t,n]of Object.entries(e))"condition"===t||ne(n)||(i[t]=n);return i}_addCondition(t,e,i="conditions"){const n={state:{condition:"state",entity:"",state:"on"},numeric_state:{condition:"numeric_state",entity:""},user:{condition:"user",users:this.hass?.user?.id?[this.hass.user.id]:[]},screen:{condition:"screen",media_query:Et.desktop},time:{condition:"time",after:"08:00:00",before:"20:00:00"},template:{condition:"template",value_template:"{{ true }}"}};this._updateTab(t,t=>({...t,[i]:[...ie(t[i]),n[e]||{condition:e}]}))}_setCondition(t,e,i,n="conditions"){this._updateTab(t,t=>{const s=[...ie(t[n])];return s[e]=i,{...t,[n]:s}})}_removeCondition(t,e,i="conditions",n="condition_mode"){this._updateTab(t,t=>{const s=[...ie(t[i])];s.splice(e,1);const o={...t,[i]:s};return s.length||(delete o[i],delete o[n],"jump_conditions"===i&&delete o.jump_return),o})}async _loadUsers(){if(!this._usersLoading){this._usersLoading=!0;try{const t=await this.hass.callWS({type:"config/auth/list"});this._users=t.filter(t=>!t.system_generated&&!1!==t.is_active).map(t=>({value:t.id,label:t.name||t.id}))}catch(t){this._users=this.hass?.user?[{value:this.hass.user.id,label:this.hass.user.name}]:[]}}}_selectTab(t){this._selectedTab=t,this._selectedCard=0,this._guiMode=!0,this._guiModeAvailable=!0,this._syncPreview()}_addTab=()=>{const t=[...this._tabs];t.push({name:this._t("new_tab",{n:t.length+1}),icon:"mdi:tab",cards:[]}),this._selectedTab=t.length-1,this._selectedCard=0,this._tabPage="general",this._setTabs(t)};_moveTab(t,e){const i=t+e,n=[...this._tabs];if(i<0||i>=n.length)return;[n[t],n[i]]=[n[i],n[t]];const s={},o=Number(this._config.default_tab)||0;o===t?s.default_tab=i:o===i&&(s.default_tab=t),this._selectedTab=i,this._setTabs(n,this._cleanDefaultTab(s))}_duplicateTab(t){const e=[...this._tabs];e.splice(t+1,0,structuredClone(e[t]));const i={},n=Number(this._config.default_tab)||0;n>t&&(i.default_tab=n+1),this._selectedTab=t+1,this._setTabs(e,i)}_deleteTab(t){const e=this._tabs[t];if(!window.confirm(this._t("delete_tab_confirm",{name:this._tabName(e,t)})))return;const i=[...this._tabs];i.splice(t,1);const n={},s=Number(this._config.default_tab)||0;s===t?n.default_tab=0:s>t&&(n.default_tab=s-1),this._selectedTab=Math.max(0,Math.min(t,i.length-1)),this._selectedCard=0,this._setTabs(i,this._cleanDefaultTab(n))}_cleanDefaultTab(t){if(0===t.default_tab){const e={...this._config};delete e.default_tab,this._config=e,delete t.default_tab}return t}_select(t,e){return{name:t,selector:{select:{mode:"dropdown",options:e.map(([t,e])=>({value:t,label:this._t(e)}))}}}}_options(t){const e={tab_bar:[["show","bar_show"],["auto","bar_auto"],["hidden","bar_hidden"]],tab_position:[["top","pos_top"],["bottom","pos_bottom"],["left","pos_left"],["right","pos_right"]],tab_style:[["underline","style_underline"],["pills","style_pills"],["buttons","style_buttons"],["segmented","style_segmented"]],tab_alignment:[["start","align_start"],["center","align_center"],["end","align_end"],["stretch","align_stretch"]],tab_content:[["icon_name","content_icon_name"],["icon","content_icon"],["name","content_name"]],icon_position:[["start","icon_start"],["top","icon_top"]],tab_overflow:[["scroll","overflow_scroll"],["arrows","overflow_arrows"],["menu","overflow_menu"],["wrap","overflow_wrap"]],animation:Ht.map(t=>[t,`anim_${t}`]),animation_easing:Object.keys(Ft).map(t=>[t,`easing_${t}`]),progress_position:Tt.map(t=>[t,`progress_${t}`]),sync_mode:[["both","sync_both"],["read","sync_read"],["write","sync_write"]]};return e[t]}_selectField(t,e=!1){const i=this._options(t).map(([t,e])=>({value:t,label:this._t(e)}));return e&&i.unshift({value:"default",label:this._t("same_as_default")}),{name:t,selector:{select:{mode:"dropdown",options:i}}}}_grid(...t){return{type:"grid",name:"",schema:t}}_numberField(t,e,i,n,s="box"){return{name:t,selector:{number:{min:e,max:i,mode:s,unit_of_measurement:n}}}}_renderAppearancePage(){const t=this._config,e={...yt,...t},i=t=>e=>this._commit(oe(this._config,e,t,yt)),n=[this._grid(this._selectField("tab_bar"),this._selectField("tab_position")),..."auto"===e.tab_bar||"auto"===t.mobile?.tab_bar?[this._numberField("tab_bar_auto_hide",1,600,"s")]:[],this._grid(this._selectField("tab_style"),this._selectField("tab_alignment")),this._grid(this._selectField("tab_content"),this._selectField("icon_position")),this._selectField("tab_overflow"),{name:"sliding_indicator",selector:{boolean:{}}},{name:"hide_single_tab",selector:{boolean:{}}}],s=[this._selectField("animation"),this._grid(this._numberField("animation_duration",50,3e3,"ms"),this._selectField("animation_easing"))],o=[{name:"title",selector:{text:{}}},this._grid(this._numberField("tab_font_size",8,40,"px"),this._numberField("tab_icon_size",8,64,"px")),this._grid(this._numberField("tab_height",20,120,"px"),this._numberField("tab_spacing",0,48,"px")),this._grid(this._numberField("tab_radius",0,999,"px"),this._numberField("content_padding",0,64,"px")),this._grid(this._numberField("card_gap",0,64,"px"),this._numberField("content_height",0,4e3,"px")),{name:"card_background",selector:{boolean:{}}},{name:"inner_cards_background",selector:{boolean:{}}}],a=[this._numberField("mobile_breakpoint",200,2e3,"px"),...xt.map(t=>this._selectField(t,!0))],r={mobile_breakpoint:e.mobile_breakpoint};for(const e of xt)r[e]=t.mobile?.[e]??"default";return H`
      ${this._panel("section_tab_bar","mdi:tab",this._form(e,n,i(se(n))),!0)}
      ${this._panel("section_animation","mdi:animation-play-outline",this._form(e,s,i(se(s))))}
      ${this._panel("section_sizes","mdi:ruler-square",this._form(e,o,i(se(o))))}
      ${this._panel("section_mobile","mdi:cellphone",H`<div class="hint small">${this._t("mobile_helper")}</div>
          ${this._form(r,a,t=>{const e={...this._config},i={};for(const e of xt)t[e]&&"default"!==t[e]&&(i[e]=t[e]);Object.keys(i).length?e.mobile=i:delete e.mobile,this._commit(oe(e,t,["mobile_breakpoint"],yt))})}`,Boolean(t.mobile))}
      ${this._panel("global_colors","mdi:palette-outline",H`
          ${ee.map(t=>this._renderColorField(t,this._config[t],e=>this._commit(oe(this._config,{[t]:e},[t]))))}
          <div class="hint small">${this._t("color_helper")}</div>
        `)}
    `}_renderBehaviorPage(){const t=this._tabs.map((t,e)=>({value:String(e),label:this._tabName(t,e)})),e=[...t.length?[{name:"default_tab",selector:{select:{mode:"dropdown",options:t}}}]:[],{name:"remember_tab",selector:{boolean:{}}},this._grid({name:"swipe",selector:{boolean:{}}},{name:"swipe_follow",selector:{boolean:{}}}),this._numberField("return_to_default",0,86400,"s")],i=se(e),n=[{name:"sync_entity",selector:{entity:{domain:wt}}},...this._config.sync_entity?[this._selectField("sync_mode")]:[]],s={...$t,...this._config.auto_cycle||{}},o=[{name:"enabled",selector:{boolean:{}}}];s.enabled&&(o.push(this._grid(this._numberField("interval",1,86400,"s"),this._numberField("pause_on_interaction",0,86400,"s")),{name:"pause_on_hover",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}}),s.show_progress&&o.push(this._grid(this._selectField("progress_position"),this._numberField("progress_height",1,20,"px"))));const a=se(o),r={...yt,...this._config};return r.default_tab=String(Number(r.default_tab)||0),H`
      ${this._panel("section_general","mdi:cog-outline",this._form(r,e,t=>{void 0!==t.default_tab&&(t.default_tab=Number(t.default_tab)||0),this._commit(oe(this._config,t,i,yt))}),!0)}
      ${this._panel("auto_cycle","mdi:autorenew",H`
          ${this._form(s,o,t=>{const e=oe(this._config.auto_cycle||{},t,a,$t),i={...this._config,auto_cycle:e};Object.keys(e).length||delete i.auto_cycle,this._commit(i)},t=>this._t("enabled"===t.name?"auto_cycle_enabled":t.name))}
          <div class="hint small">${this._t("auto_cycle_helper")}</div>
        `,Boolean(s.enabled))}
      ${this._panel("section_sync","mdi:sync",H`
          <div class="hint small">${this._t("sync_helper")}</div>
          ${this._form(r,n,t=>this._commit(oe(this._config,t,se(n),yt)))}
        `,Boolean(this._config.sync_entity))}
    `}static styles=o`
    :host {
      display: block;
      --hct-radius: 10px;
    }
    .pages {
      display: flex;
      gap: 4px;
      padding: 4px;
      margin-bottom: 16px;
      border-radius: 12px;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
    }
    button {
      font: inherit;
      color: inherit;
    }
    .page-btn {
      flex: 1 1 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 10px;
      border: none;
      border-radius: 9px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-weight: 500;
    }
    .page-btn.active {
      background: var(--card-background-color, #fff);
      color: var(--primary-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
    .page-btn ha-icon,
    .sub-btn ha-icon,
    .chip ha-icon {
      --mdc-icon-size: 18px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .chip {
      --chip-color: var(--primary-color);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      padding: 6px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 999px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .chip span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chip.active {
      border-color: var(--chip-color);
      background: var(--chip-color);
      color: var(--text-primary-color, #fff);
    }
    .chip.add {
      border-style: dashed;
      color: var(--primary-color);
    }
    .chip.add.active {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .chip.small {
      padding: 4px 10px;
      font-size: 13px;
    }
    .chip .card-type {
      opacity: 0.7;
      font-size: 12px;
    }
    .chip .mini {
      --mdc-icon-size: 14px;
      opacity: 0.8;
    }
    .tab-editor {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--hct-radius);
      overflow: hidden;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      padding: 4px 8px;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.04);
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    .subnav {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }
    .sub-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 10px;
      border: none;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-weight: 500;
    }
    .sub-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .count {
      min-width: 18px;
      padding: 0 5px;
      border-radius: 9px;
      font-size: 11px;
      line-height: 18px;
      text-align: center;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.1);
    }
    .actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 2px;
    }
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .icon-btn:hover:not([disabled]) {
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.08);
      color: var(--primary-text-color);
    }
    .icon-btn[disabled] {
      opacity: 0.35;
      cursor: default;
    }
    .icon-btn.danger:hover:not([disabled]) {
      color: var(--error-color, #db4437);
    }
    .tab-body {
      padding: 12px;
    }
    .card-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .move-select {
      height: 32px;
      max-width: 180px;
      padding: 0 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
    }
    .hint {
      margin: 0 0 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
    .hint.small {
      font-size: 12px;
      margin-top: 8px;
    }
    h3 {
      margin: 24px 0 8px;
      font-size: 15px;
      font-weight: 500;
    }
    .color-field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .color-field .grow {
      flex: 1 1 auto;
      min-width: 0;
    }
    .swatch {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
      cursor: pointer;
      overflow: hidden;
      color: var(--secondary-text-color);
    }
    .swatch input {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      border: none;
      padding: 0;
    }
    .condition {
      margin-bottom: 12px;
      padding: 8px 12px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--hct-radius);
    }
    .condition-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      font-weight: 500;
    }
    .condition-header span {
      flex: 1 1 auto;
    }
    .add-condition .label {
      margin: 8px 0 6px;
      font-weight: 500;
    }
    pre {
      margin: 0;
      padding: 8px;
      overflow: auto;
      font-size: 12px;
      border-radius: 6px;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
    }
    ha-form {
      display: block;
    }
    .panel {
      margin: 12px 0 0;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--hct-radius);
      overflow: hidden;
    }
    .panel > summary {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      cursor: pointer;
      list-style: none;
      font-weight: 500;
      user-select: none;
    }
    .panel > summary::-webkit-details-marker {
      display: none;
    }
    .panel > summary span {
      flex: 1 1 auto;
    }
    .panel > summary ha-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }
    .panel > summary .chevron {
      transition: transform 0.2s ease;
    }
    .panel[open] > summary .chevron {
      transform: rotate(180deg);
    }
    .panel[open] > summary {
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    .panel-body {
      padding: 12px;
    }
    .chip.disabled span {
      text-decoration: line-through;
      opacity: 0.7;
    }
  `}customElements.get(ft)||customElements.define(ft,ae);const re=t=>"string"==typeof t&&/\{\{|\{%/.test(t),ce=t=>Boolean(t&&t.action&&"none"!==t.action),le=t=>null==t||""===t||Number.isNaN(Number(t))?void 0:`${Number(t)}px`;class de extends at{static properties={_config:{state:!0},_active:{state:!0}};static styles=Vt;static getConfigElement(){return document.createElement(ft)}static getStubConfig(t){return{tabs:[{name:Kt(t,"card.stub_tab_1"),icon:"mdi:home",cards:[{type:"markdown",content:Kt(t,"card.stub_text_1")}]},{name:Kt(t,"card.stub_tab_2"),icon:"mdi:star",cards:[{type:"markdown",content:Kt(t,"card.stub_text_2")}]}]}}constructor(){super(),this._sections=new Map,this._templates=new Map,this._templateSubs=new Map,this._watchers=[],this._visibility=[],this._shown=[],this._editMode=!1,this._preview=!1,this._buildToken=0,this._cycleKey=0,this._cycleActive=!1,this._cyclePaused=!1,this._pausedUntil=0,this._hovering=!1,this._narrow=!1,this._barRevealed=!0,this._menuOpen=!1,this._overflow={over:!1,start:!1,end:!1},this._onEditorSelect=()=>this._applyEditorSelection(),this._onWindowPointer=t=>this._handleWindowPointer(t)}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration");if(void 0!==t.tabs&&!Array.isArray(t.tabs))throw new Error("'tabs' must be a list");const e=(t.tabs||[]).map(t=>t&&"object"==typeof t?t:{});this._config={...yt,...t,auto_cycle:{...$t,...t.auto_cycle||{}},tabs:e},this._tabsKey=JSON.stringify(t.tabs||[]),this._resetSections(),this._syncSeen=void 0,this._jumpStates=void 0,(void 0===this._active||this._active>=e.length)&&(this._active=this._initialTab()),this._applyEditorSelection(),this.isConnected&&(this._setupWatchers(),this._updateTemplateSubscriptions(),this._scheduleCycle(),this._revealBar())}set hass(t){const e=!this._hass;this._hass=t;for(const e of this._sections.values())for(const i of e.cards)i.hass=t;e&&this._updateTemplateSubscriptions(),this.requestUpdate()}get hass(){return this._hass}set editMode(t){this._setEditing("_editMode",t)}get editMode(){return this._editMode}set preview(t){this._setEditing("_preview",t)}get preview(){return this._preview}async getCardSize(){if(!this._config)return 1;const t=Number(this._config.content_height);if(t>0)return 1+Math.ceil(t/50);const e=this._active??0,i=this._sections.get(e),n=this._config.tabs[e],s=Math.max(1,Number(n?.columns)||1);let o=0;if(i&&i.cards.length){o=(await Promise.all(i.cards.map(t=>"function"==typeof t.getCardSize?t.getCardSize():1))).reduce((t,e)=>t+(Number(e)||1),0)}else o=2*(n?.cards?.length||0);return 1+Math.ceil(o/s)}getGridOptions(){return{columns:12,min_columns:3}}connectedCallback(){super.connectedCallback(),window.addEventListener(vt,this._onEditorSelect),"undefined"!=typeof ResizeObserver&&(this._resizeObserver=new ResizeObserver(t=>this._onResize(t)),this._resizeObserver.observe(this),this._observedBar=void 0),this._config&&(this._setupWatchers(),this._updateTemplateSubscriptions(),this._applyEditorSelection(),this._scheduleCycle(),this._revealBar())}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(vt,this._onEditorSelect),window.removeEventListener("pointerdown",this._onWindowPointer,!0),this._resizeObserver?.disconnect(),this._resizeObserver=void 0,this._clearWatchers(),this._unsubscribeTemplates();for(const t of["_cycleTimer","_returnTimer","_jumpTimer","_barTimer","_holdTimer","_tapTimer"])clearTimeout(this[t]),this[t]=void 0;this._cycleActive=!1,this._menuOpen=!1}willUpdate(){if(!this._config)return;const t=this._config.tabs,e={hass:this._hass,templates:this._templates};if(this._visibility=t.map(t=>this._hass?function(t,e){return!t?.disabled&&Ut(t?.conditions,t?.condition_mode,e)}(t,e):!t.disabled),this._shown=t.map((t,e)=>e).filter(t=>this._isEditing||this._visibility[t]),this._syncFromEntity(),this._checkJumps(e),!this._shown.includes(this._active)){const t=this._initialTab();this._active=this._shown.includes(t)?t:this._shown[0]}const i=!this._isEditing&&t.length>0&&0===this._shown.length;i!==Boolean(this._hostHidden)&&(this._hostHidden=i,this.toggleAttribute("hidden",i),Yt(this,"card-visibility-changed",{value:!i})),this.toggleAttribute("editing",this._isEditing)}updated(){this._syncContent();const t=this.renderRoot.querySelector(".tabbar");this._resizeObserver&&t!==this._observedBar&&(this._observedBar&&this._resizeObserver.unobserve(this._observedBar),t&&this._resizeObserver.observe(t),this._observedBar=t),this._positionIndicator(),this._measureOverflow(),this._active!==this._scrolledFor&&(this._scrolledFor=this._active,this._scrollTabIntoView()),!this._config||this._active===this._cycleForTab&&this._canCycle()===this._cycleForState||this._scheduleCycle()}_eff(t){const e=this._config.mobile;return this._narrow&&e&&void 0!==e[t]&&""!==e[t]&&"default"!==e[t]?e[t]:this._config[t]}_onResize(t){for(const e of t){if(e.target!==this||!this._config)continue;const t=this._config.mobile,i=Number(this._config.mobile_breakpoint)||yt.mobile_breakpoint,n=e.contentRect.width,s=Boolean(t&&Object.keys(t).length&&n>0&&n<i);s!==this._narrow&&(this._narrow=s,this.requestUpdate())}this._positionIndicator(),this._measureOverflow()}render(){const t=this._config;if(!t)return W;if(!t.tabs.length)return H`<ha-card><div class="empty">${Kt(this._hass,"card.no_tabs")}</div></ha-card>`;const e=["top","bottom","left","right"].includes(this._eff("tab_position"))?this._eff("tab_position"):"top",i="left"===e||"right"===e,n=le(t.content_height),s={"--hct-gap":`${Number(t.card_gap)>=0?Number(t.card_gap):8}px`,"--hct-font-size":le(t.tab_font_size),"--hct-icon-size":le(t.tab_icon_size),"--hct-tab-height":le(t.tab_height),"--hct-tab-gap":le(t.tab_spacing),"--hct-radius":le(t.tab_radius),"--hct-padding":le(t.content_padding),"--hct-anim-duration":`${this._animationDuration()}ms`,"--hct-anim-easing":Ft[t.animation_easing]||"ease","--hct-progress-height":le(t.auto_cycle.progress_height)};return H`
      <ha-card
        class=${ht({"no-bg":!1===t.card_background,"flat-inner":!1===t.inner_cards_background,"menu-open":this._menuOpen,[`bar-${e}`]:!0})}
        style=${ut(s)}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerenter=${this._onPointerEnter}
        @pointerleave=${this._onPointerLeave}
        @touchstart=${{handleEvent:t=>this._onTouchStart(t),passive:!0}}
        @touchmove=${{handleEvent:t=>this._onTouchMove(t),passive:!0}}
        @touchend=${{handleEvent:t=>this._onTouchEnd(t),passive:!0}}
        @touchcancel=${{handleEvent:()=>this._onTouchCancel(),passive:!0}}
      >
        ${this._renderProgress("card_top")} ${t.title?H`<div class="title">${t.title}</div>`:W}
        <div class="root pos-${e}">
          ${this._renderBar(e,i)}
          <div class="body">
            ${this._renderProgress("bar")}
            <div
              class=${ht({content:!0,"fixed-height":Boolean(n)})}
              style=${ut({height:n})}
              role="tabpanel"
            >
              <div class="viewport"></div>
            </div>
            ${this._renderProgress("content_end")}
          </div>
        </div>
        ${this._renderProgress("card_bottom")} ${this._renderMenu()}
      </ha-card>
    `}_renderBar(t,e){const i=this._config,n=this._eff("tab_bar")||"show";if(i.hide_single_tab&&!this._isEditing&&this._shown.length<=1)return W;if("hidden"===n&&!this._isEditing)return W;const s="auto"===n&&!this._barRevealed&&!this._isEditing,o=e?"scroll":i.tab_overflow||"scroll",a=this._eff("tab_style")||"underline",r=!1!==i.sliding_indicator,c="arrows"===o&&this._overflow.over,l="menu"===o&&this._overflow.over,d=this._config.tabs[this._active]||{};return H`
      <div
        class=${ht({"bar-wrap":!0,vertical:e,collapsed:s,"edit-only":"hidden"===n})}
      >
        <div class="bar-inner">
          <div class="bar-row">
            ${c?H`<button
                  type="button"
                  class="bar-btn"
                  ?disabled=${!this._overflow.start}
                  aria-label="‹"
                  @click=${()=>this._scrollBar(-1)}
                >
                  <ha-icon icon="mdi:chevron-left"></ha-icon>
                </button>`:W}
            <div
              class=${ht({tabbar:!0,vertical:e,sliding:r,wrap:"wrap"===o&&!e,[`style-${a}`]:!0,[`align-${this._eff("tab_alignment")||"start"}`]:!0})}
              role="tablist"
              aria-orientation=${e?"vertical":"horizontal"}
              @keydown=${this._onKeyDown}
              @scroll=${this._measureOverflow}
            >
              ${r?H`<div
                    class="indicator"
                    style=${ut(this._tabVars(d,this._tabDisplay(this._active).color))}
                  ></div>`:W}
              ${this._shown.map(t=>this._renderTab(t))}
            </div>
            ${c?H`<button
                  type="button"
                  class="bar-btn"
                  ?disabled=${!this._overflow.end}
                  aria-label="›"
                  @click=${()=>this._scrollBar(1)}
                >
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </button>`:W}
            ${l?H`<button
                  type="button"
                  class="bar-btn more-btn"
                  aria-haspopup="menu"
                  aria-expanded=${this._menuOpen?"true":"false"}
                  aria-label=${Kt(this._hass,"card.more_tabs")}
                  title=${Kt(this._hass,"card.more_tabs")}
                  @click=${this._toggleMenu}
                >
                  <ha-icon icon="mdi:dots-horizontal"></ha-icon>
                </button>`:W}
          </div>
        </div>
      </div>
      ${s?H`<button
            type="button"
            class="bar-handle"
            aria-label=${Kt(this._hass,"card.show_tabs")}
            @click=${()=>this._revealBar(!0)}
          ></button>`:W}
    `}_renderTab(t){const e=this._config.tabs[t]||{},i=this._tabDisplay(t),n=t===this._active,s=Boolean(e.disabled),o=!s&&!this._visibility[t],a=this._eff("tab_content"),r=Boolean(i.icon)&&"name"!==a,c="icon"!==a||!i.icon;let l=i.name;return s?l=`${i.name} – ${Kt(this._hass,"card.disabled_tab")}`:o&&(l=`${i.name} – ${Kt(this._hass,"card.hidden_tab")}`),H`
      <button
        class=${ht({tab:!0,active:n,"cond-hidden":o||s,"icon-top":"top"===this._eff("icon_position")&&r&&c})}
        role="tab"
        type="button"
        aria-selected=${n?"true":"false"}
        aria-label=${i.name}
        tabindex=${n?"0":"-1"}
        title=${l}
        data-index=${t}
        style=${ut(this._tabVars(e,i.color))}
        @click=${()=>this._onTabClick(t)}
        @pointerdown=${()=>this._onTabPointerDown(t)}
        @pointerup=${this._cancelHold}
        @pointerleave=${this._cancelHold}
        @pointercancel=${this._cancelHold}
        @contextmenu=${t=>ce(e.hold_action)&&t.preventDefault()}
      >
        ${r?H`<ha-icon .icon=${i.icon}></ha-icon>`:W}
        ${c?H`<span class="label">${i.name}</span>`:W}
        ${n?this._renderProgress("tab"):W}
        ${void 0!==i.badge?H`<span
              class=${ht({badge:!0,dot:Boolean(e.badge_dot)})}
              style=${ut({"--hct-badge":Xt(e.badge_color)})}
              >${e.badge_dot?W:i.badge}</span
            >`:W}
        ${s?H`<ha-icon class="cond-icon" icon="mdi:cancel"></ha-icon>`:o?H`<ha-icon class="cond-icon" icon="mdi:eye-off"></ha-icon>`:W}
      </button>
    `}_renderProgress(t){const e=this._config.auto_cycle;if(!this._cycleActive||!e.show_progress)return W;if((Tt.includes(e.progress_position)?e.progress_position:"bar")!==t)return W;const i=Xt(this._tabDisplay(this._active).color)??Xt(this._config.color);return mt(this._cycleKey,H`<div class="progress progress-${t}">
        <div
          class=${ht({bar:!0,paused:this._cyclePaused})}
          style=${ut({animationDuration:`${this._cycleDuration}ms`,"--hct-color":i})}
        ></div>
      </div>`)}_renderMenu(){if(!this._menuOpen)return W;const t=this._menuPos||{};return H`
      <div
        class="menu"
        role="menu"
        style=${ut({top:void 0!==t.top?`${t.top}px`:void 0,bottom:void 0!==t.bottom?`${t.bottom}px`:void 0,right:`${t.right??8}px`})}
      >
        ${this._shown.map(t=>{const e=this._tabDisplay(t),i=this._config.tabs[t]||{};return H`
            <button
              type="button"
              role="menuitem"
              class=${ht({"menu-item":!0,active:t===this._active})}
              style=${ut(this._tabVars(i,e.color))}
              @click=${()=>{this._closeMenu(),this._selectByUser(t)}}
            >
              ${e.icon?H`<ha-icon .icon=${e.icon}></ha-icon>`:H`<span class="spacer"></span>`}
              <span class="label">${e.name}</span>
              ${void 0===e.badge||i.badge_dot?W:H`<span class="badge" style=${ut({"--hct-badge":Xt(i.badge_color)})}
                    >${e.badge}</span
                  >`}
            </button>
          `})}
      </div>
    `}_tabDisplay(t){const e=this._config.tabs[t]||{},i=t=>{if(!e[t])return;const i=this._templates.get(String(e[t]));return null!=i&&""!==i&&String(i).trim()||void 0};let n;if(void 0!==e.badge&&null!==e.badge&&""!==e.badge){const t=re(e.badge)?this._templates.get(String(e.badge)):e.badge;n=void 0!==t&&Ot(t)?String(t).trim():void 0}else n=this._entityBadge(e.badge_entity);return{name:i("name_template")||e.name||Kt(this._hass,"editor.new_tab",{n:t+1}),icon:i("icon_template")||e.icon,color:i("color_template")||e.color,badge:n}}_tabVars(t,e){const i=this._config,n={"--hct-color":Xt(e)??Xt(i.color),"--hct-text":Xt(t.text_color)??Xt(i.text_color),"--hct-active-text":Xt(t.active_text_color)??Xt(i.active_text_color),"--hct-bg":Xt(t.background_color)??Xt(i.background_color)};return Object.fromEntries(Object.entries(n).filter(([,t])=>t))}_entityBadge(t){if(!t||!this._hass)return;const e=this._hass.states[t];if(!e||["unavailable","unknown"].includes(e.state))return;if("function"==typeof this._hass.formatEntityState)return this._hass.formatEntityState(e);const i=e.attributes?.unit_of_measurement;return i?`${e.state} ${i}`:e.state}_positionIndicator(){const t=this.renderRoot?.querySelector(".tabbar"),e=t?.querySelector(".indicator");if(!e)return;const i=t.querySelector(`.tab[data-index="${this._active}"]`);if(!i||!i.offsetWidth)return void(e.style.opacity="0");const n=!e.dataset.placed;n&&e.classList.add("instant"),e.style.opacity="1",e.style.left=`${i.offsetLeft}px`,e.style.top=`${i.offsetTop}px`,e.style.width=`${i.offsetWidth}px`,e.style.height=`${i.offsetHeight}px`,e.dataset.placed="1",n&&(e.offsetWidth,e.classList.remove("instant"))}_scrollTabIntoView(){const t=this.renderRoot?.querySelector(".tabbar"),e=t?.querySelector(`.tab[data-index="${this._active}"]`);if(!e)return;const i=t.classList.contains("vertical"),n=i?e.offsetTop:e.offsetLeft,s=i?e.offsetHeight:e.offsetWidth,o=i?t.scrollTop:t.scrollLeft,a=i?t.clientHeight:t.clientWidth;let r;n<o?r=n-16:n+s>o+a&&(r=n+s-a+16),void 0!==r&&t.scrollTo({[i?"top":"left"]:Math.max(0,r),behavior:"smooth"})}_measureOverflow(){const t=this.renderRoot?.querySelector(".tabbar");if(!t)return;const e=t.classList.contains("vertical"),i=e?t.scrollHeight:t.scrollWidth,n=e?t.clientHeight:t.clientWidth,s=e?t.scrollTop:t.scrollLeft,o={over:i>n+1,start:s>1,end:s+n<i-1},a=`${o.over}|${o.start}|${o.end}`;a!==this._overflowKey&&(this._overflowKey=a,this._overflow=o,this.requestUpdate())}_scrollBar(t){const e=this.renderRoot.querySelector(".tabbar");e?.scrollBy({left:t*e.clientWidth*.7,behavior:"smooth"})}_toggleMenu(t){if(t.stopPropagation(),this._menuOpen)return void this._closeMenu();const e=this.renderRoot.querySelector("ha-card").getBoundingClientRect(),i=t.currentTarget.getBoundingClientRect(),n="bottom"===this._eff("tab_position");this._menuPos=n?{bottom:e.bottom-i.top+4,right:e.right-i.right}:{top:i.bottom-e.top+4,right:e.right-i.right},this._menuOpen=!0,window.addEventListener("pointerdown",this._onWindowPointer,!0),this.requestUpdate()}_handleWindowPointer(t){const e=t.composedPath(),i=this.renderRoot.querySelector(".menu"),n=this.renderRoot.querySelector(".more-btn");i&&e.includes(i)||n&&e.includes(n)||this._closeMenu()}_closeMenu(){this._menuOpen&&(this._menuOpen=!1,window.removeEventListener("pointerdown",this._onWindowPointer,!0),this.requestUpdate())}_revealBar(t=!1){if(!this._config||"auto"!==(this._eff("tab_bar")||"show"))return;const e=Date.now();if(!t&&this._barRevealed&&e-(this._barRevealedAt||0)<500)return;this._barRevealedAt=e,clearTimeout(this._barTimer),this._barRevealed||(this._barRevealed=!0,this.requestUpdate());const i=1e3*Math.max(1,Number(this._config.tab_bar_auto_hide)||yt.tab_bar_auto_hide);this._barTimer=setTimeout(()=>{this._menuOpen||this._hovering&&this._hoverInBar?this._revealBar(!0):(this._barRevealed=!1,this.requestUpdate())},i)}get _isEditing(){return this._editMode||this._preview}_setEditing(t,e){const i=Boolean(e);if(this[t]!==i){this[t]=i;for(const t of this._sections.values())for(const e of t.cards)this._applyCardMode(e);this._applyEditorSelection(),this.requestUpdate()}}_applyCardMode(t){const e=this._isEditing;"HUI-CARD"===t.tagName||(t.editMode=e),t.preview=e}_resetSections(){this._buildToken+=1,this._finishTransition(),this._sections.clear(),this._displayedIndex=void 0,this._currentSection=void 0;const t=this.renderRoot?.querySelector?.(".viewport");t&&t.replaceChildren()}_getSection(t){let e=this._sections.get(t);if(e)return e;const i=this._config.tabs[t]||{},n=document.createElement("div");return n.className="section",n.dataset.empty=Kt(this._hass,"editor.no_cards"),n.style.setProperty("--hct-columns",String(Math.max(1,Number(i.columns)||1))),n.addEventListener("card-visibility-changed",t=>t.stopPropagation()),e={section:n,cards:[]},this._sections.set(t,e),this._buildSection(i,e,this._buildToken),e}async _buildSection(t,e,i){const n=Array.isArray(t.cards)?t.cards:[];if(!n.length)return;const s=Boolean(customElements.get("hui-card"))?void 0:await Zt();if(i===this._buildToken)for(const t of n){const i=this._createCard(t,s,e);e.cards.push(i),e.section.append(i)}}_createCard(t,e,i){let n;if(customElements.get("hui-card"))n=document.createElement("hui-card"),n.hass=this._hass,n.preview=this._isEditing,n.config=t,"function"==typeof n.load&&n.load();else{if(!e)return n=document.createElement("div"),n.textContent="Home Assistant card helpers are not available.",n;n=e.createCardElement(t),n.hass=this._hass,this._isEditing&&this._applyCardMode(n)}return n.addEventListener("ll-rebuild",s=>{s.stopPropagation();const o=this._createCard(t,e,i),a=i.cards.indexOf(n);a>=0&&(i.cards[a]=o),n.replaceWith(o)},{once:!0}),n}_animationDuration(){const t=Number(this._config.animation_duration);return Math.min(3e3,Math.max(50,Number.isFinite(t)&&t>0?t:yt.animation_duration))}_animationName(){return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"none":this._eff("animation")||"none"}_syncContent(){if(this._drag||this._dragSettling)return;const t=this.renderRoot.querySelector(".viewport");if(!t||!this._config)return;const e=this._shown.includes(this._active)?this._active:void 0,i=void 0===e?void 0:this._getSection(e).section;if(i===this._currentSection&&(!i||i.parentNode===t))return;const n=this._currentSection&&this._currentSection.parentNode===t?this._currentSection:void 0,s=this._displayedIndex;this._finishTransition(),this._currentSection=i,this._displayedIndex=e,i&&(i.classList.remove("leaving"),t.append(i));for(const e of[...t.children])e!==i&&e!==n&&e.remove();if(!n||n===i)return;let o;if(i&&void 0!==s&&"function"==typeof i.animate){const t=this._shown.indexOf(e)>=this._shown.indexOf(s);o=function(t,e){let i=t;if("random"===i){const t=Object.keys(It);i=t[Math.floor(Math.random()*t.length)]}const n=It[i];return n?n(e>=0?1:-1):void 0}(this._animationName(),t?1:-1)}o?this._runTransition(t,n,i,o):n.remove()}_runTransition(t,e,i,n){const s=this._animationDuration(),o=n.easing||Ft[this._config.animation_easing]||"ease",a=n.sequential?s/2:s;t.classList.add("animating"),e.classList.add("leaving");const r=[];n.out&&r.push(e.animate(n.out,{duration:a,easing:o,fill:"forwards"})),r.push(i.animate(n.in,{duration:a,delay:n.sequential?a:0,easing:o,fill:"backwards"}));const c={done:!1};c.cleanup=()=>{if(!c.done){c.done=!0;for(const t of r)t.cancel();e.classList.remove("leaving"),e!==this._currentSection&&e.remove(),t.classList.remove("animating"),this._transition===c&&(this._transition=void 0)}},this._transition=c,Promise.all(r.map(t=>t.finished)).then(c.cleanup,()=>{})}_finishTransition(){this._transition?.cleanup(),this._transition=void 0}get _storageKey(){const t=this._config.storage_key||function(t){let e=0;for(let i=0;i<t.length;i+=1)e=31*e+t.charCodeAt(i)|0;return(e>>>0).toString(36)}(`${window.location.pathname}|${this._config.tabs.map(t=>t.name||"").join("|")}`);return`hacard-tabs:${t}`}_defaultIndex(){const t=this._config.tabs.length,e=Number(this._config.default_tab)||0;return Math.min(Math.max(0,e),Math.max(0,t-1))}_initialTab(){if(this._config.remember_tab)try{const t=Number(window.localStorage.getItem(this._storageKey));if(Number.isInteger(t)&&t>=0&&t<this._config.tabs.length)return t}catch(t){}return this._defaultIndex()}_setActive(t,e){if(void 0!==t&&t!==this._active&&(this._active=t,this._config.remember_tab&&("user"===e||"return"===e)))try{window.localStorage.setItem(this._storageKey,String(t))}catch(t){}}_selectByUser(t){clearTimeout(this._jumpTimer),this._jumpTimer=void 0;const e=t!==this._active;this._setActive(t,"user"),this._onInteraction(!0),e&&this._writeSync(t)}_onTabPointerDown(t){this._holdFired=!1,clearTimeout(this._holdTimer);const e=this._config.tabs[t]||{};ce(e.hold_action)&&(this._holdTimer=setTimeout(()=>{this._holdFired=!0,this._fireAction(t,"hold")},500))}_cancelHold=()=>{clearTimeout(this._holdTimer),this._holdTimer=void 0};_onTabClick(t){if(this._holdFired)return void(this._holdFired=!1);const e=this._config.tabs[t]||{};if(ce(e.double_tap_action)){if(this._tapTimer&&this._tapIndex===t)return clearTimeout(this._tapTimer),this._tapTimer=void 0,void this._fireAction(t,"double_tap");clearTimeout(this._tapTimer),this._tapIndex=t,this._tapTimer=setTimeout(()=>{this._tapTimer=void 0,this._selectByUser(t)},250)}else this._selectByUser(t)}_fireAction(t,e){const i=this._config.tabs[t]||{};Yt(this,"hass-action",{config:{entity:i.badge_entity,tap_action:{action:"none"},hold_action:i.hold_action,double_tap_action:i.double_tap_action},action:e})}_step(t,{wrap:e=!0}={}){const i=this._shown;if(i.length<2)return;let n=i.indexOf(this._active)+t;if(n<0||n>=i.length){if(!e)return;n=(n+i.length)%i.length}return i[n]}_onKeyDown(t){const e={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};let i;if(t.key in e)i=this._step(e[t.key]);else if("Home"===t.key)i=this._shown[0];else{if("End"!==t.key)return;i=this._shown[this._shown.length-1]}t.preventDefault(),void 0!==i&&(this._selectByUser(i),this.updateComplete.then(()=>{this.renderRoot.querySelector(`.tab[data-index="${i}"]`)?.focus()}))}_applyEditorSelection(){const t=window.__hacardTabsEditorSelection;if(!t||!this._config||t.key!==this._tabsKey)return;const e=Number(t.index);Number.isInteger(e)&&e>=0&&e<this._config.tabs.length&&(this._active=e)}_indexFromValue(t){const e=String(t??"").trim().toLowerCase();if(!e||"unknown"===e||"unavailable"===e)return;const i=this._config.tabs;let n=i.findIndex(t=>void 0!==t.id&&String(t.id).toLowerCase()===e);if(n>=0)return n;if(n=i.findIndex(t=>t.name&&String(t.name).toLowerCase()===e),n>=0)return n;const s=Number(e);return Number.isFinite(s)&&Math.round(s)>=1&&Math.round(s)<=i.length?Math.round(s)-1:void 0}_syncFromEntity(){const t=this._config.sync_entity;if(!t||"write"===this._config.sync_mode||!this._hass||this._isEditing)return;const e=this._hass.states[t]?.state;if(void 0===e||e===this._syncSeen)return;this._syncSeen=e;const i=this._indexFromValue(e);void 0!==i&&this._visibility[i]&&this._setActive(i,"entity")}_writeSync(t){const e=this._config.sync_entity;if(!e||"read"===this._config.sync_mode||!this._hass)return;const i=this._hass.states[e];if(!i)return;const n=e.split(".")[0],s=this._config.tabs[t]||{},o=String(s.id??s.name??t+1);if("input_select"===n||"select"===n){const s=(i.attributes?.options||[]).map(String),a=s.find(t=>t.toLowerCase()===o.toLowerCase())??s.find(e=>e===String(t+1));if(void 0===a||a===i.state)return;this._hass.callService(n,"select_option",{entity_id:e,option:a})}else"input_text"===n?i.state!==o&&this._hass.callService(n,"set_value",{entity_id:e,value:o}):"input_number"!==n&&"number"!==n||Number(i.state)!==t+1&&this._hass.callService(n,"set_value",{entity_id:e,value:t+1})}_checkJumps(t){const e=this._config.tabs,i=e.map(e=>{if(this._hass&&Array.isArray(e.jump_conditions)&&e.jump_conditions.length&&!Lt(e.jump_conditions).some(t=>!this._templates.has(t)))return Ut(e.jump_conditions,e.jump_condition_mode,t)}),n=this._jumpStates;if(this._jumpStates=i,!n||this._isEditing)return;const s=i.findIndex((t,e)=>!0===t&&!1===n[e]&&this._visibility[e]);if(s<0)return;const o=this._active;this._setActive(s,"jump"),clearTimeout(this._jumpTimer),this._jumpTimer=void 0;const a=Number(e[s].jump_return)||0,r=this._config.auto_cycle,c=a>0?a:Number(r.pause_on_interaction)||0;r.enabled&&c>0&&(this._pausedUntil=Date.now()+1e3*c),a>0&&void 0!==o&&o!==s&&(this._jumpTimer=setTimeout(()=>{this._jumpTimer=void 0,this._active===s&&this._visibility[o]&&this._setActive(o,"jump")},1e3*a))}_onPointerDown(){this._revealBar(!0),this._onInteraction(!1)}_onPointerMove(t){"mouse"===t.pointerType&&(this._hoverInBar=Boolean(t.composedPath().some(t=>t?.classList?.contains?.("bar-wrap"))),this._revealBar())}_onInteraction(t){if(!this._config)return;const e=this._config.auto_cycle,i=Number(e.pause_on_interaction)||0;e.enabled&&i>0?(this._pausedUntil=Date.now()+1e3*i,this._scheduleCycle()):t&&this._scheduleCycle(),this._armReturnTimer()}_armReturnTimer(){clearTimeout(this._returnTimer);const t=Number(this._config.return_to_default)||0;t<=0||this._isEditing||(this._returnTimer=setTimeout(()=>{const t=this._defaultIndex();this._visibility[t]&&this._setActive(t,"return")},1e3*t))}_onTouchStart(t){if(this._touch=void 0,this._revealBar(!0),!1===this._config?.swipe||1!==t.touches.length||this._drag)return;if(t.composedPath().some(t=>t instanceof Element&&"function"==typeof t.matches&&t.matches("input, textarea, select, [role='slider'], ha-slider, ha-control-slider, ha-control-circular-slider, ha-control-select, ha-map, ha-chart-base, ha-more-info-control-select-container, .tabbar, .bar-row")))return;const e=t.touches[0];this._touch={x:e.clientX,y:e.clientY,time:Date.now(),axis:void 0}}_onTouchMove(t){const e=this._touch;if(!e||1!==t.touches.length)return;const i=t.touches[0],n=i.clientX-e.x,s=i.clientY-e.y;if(!e.axis){if(Math.abs(n)<10&&Math.abs(s)<10)return;e.axis=Math.abs(n)>1.2*Math.abs(s)?"x":"y","x"===e.axis&&!1!==this._config.swipe_follow&&this._dragStart()}"x"===e.axis&&this._drag&&this._dragMove(n)}_onTouchEnd(t){const e=this._touch;if(this._touch=void 0,!e)return;const i=t.changedTouches[0],n=i?i.clientX-e.x:0,s=i?i.clientY-e.y:0,o=Date.now()-e.time;if(this._drag)return void this._dragEnd(n,o);if(Math.abs(n)<50||Math.abs(n)<1.5*Math.abs(s)||o>800)return;const a=this._step(n<0?1:-1,{wrap:!1});void 0!==a&&this._selectByUser(a)}_onTouchCancel(){this._touch=void 0,this._drag&&this._dragEnd(0,1/0)}_dragStart(){const t=this.renderRoot.querySelector(".viewport"),e=this._currentSection;t&&e&&e.parentNode===t&&(this._finishTransition(),this._drag={viewport:t,current:e,width:t.clientWidth||1,sign:0,offset:0},t.classList.add("dragging"))}_dragMove(t){const e=this._drag,i=t<0?1:-1;i!==e.sign&&(e.neighbor&&(e.neighbor.classList.remove("drag-neighbor"),e.neighbor.style.transform="",e.neighbor.remove()),e.sign=i,e.target=this._step(i,{wrap:!1}),e.neighbor=void 0!==e.target?this._getSection(e.target).section:void 0,e.neighbor&&(e.neighbor.classList.add("drag-neighbor"),e.viewport.append(e.neighbor))),e.offset=e.neighbor?t:.3*t,e.current.style.transform=`translateX(${e.offset}px)`,e.neighbor&&(e.neighbor.style.transform=`translateX(${e.offset+i*e.width}px)`)}_dragEnd(t,e){const i=this._drag;this._drag=void 0;const n=Math.abs(t)/Math.max(1,e),s=Boolean(i.neighbor&&Math.sign(-t)===i.sign&&(Math.abs(t)>.25*i.width||n>.4&&Math.abs(t)>30)),o=s?-i.sign*i.width:0,a={duration:220,easing:"ease-out",fill:"forwards"},r=[];"function"==typeof i.current.animate&&(r.push(i.current.animate([{transform:`translateX(${i.offset}px)`},{transform:`translateX(${o}px)`}],a)),i.neighbor&&r.push(i.neighbor.animate([{transform:`translateX(${i.offset+i.sign*i.width}px)`},{transform:`translateX(${s?0:i.sign*i.width}px)`}],a))),this._dragSettling=!0;const c=()=>{for(const t of r)t.cancel();i.current.style.transform="",i.viewport.classList.remove("dragging"),i.neighbor&&(i.neighbor.style.transform="",i.neighbor.classList.remove("drag-neighbor")),this._dragSettling=!1,s?(i.current.remove(),this._currentSection=i.neighbor,this._displayedIndex=i.target,this._selectByUser(i.target)):i.neighbor?.remove(),this.requestUpdate()};Promise.all(r.map(t=>t.finished)).then(c,c)}_onPointerEnter(t){"mouse"===t.pointerType&&(this._hovering=!0,this._cycleActive&&!this._cyclePaused&&this._config.auto_cycle.pause_on_hover&&(clearTimeout(this._cycleTimer),this._cycleTimer=void 0,this._cycleRemaining=Math.max(0,this._cycleRemaining-(Date.now()-this._cycleStartedAt)),this._cyclePaused=!0,this.requestUpdate()))}_onPointerLeave(t){"mouse"===t.pointerType&&(this._hovering=!1,this._hoverInBar=!1,this._cycleActive&&this._cyclePaused&&(this._cyclePaused=!1,this._startCycleTimer(),this.requestUpdate()))}_cycleOrder(){return this._shown.filter(t=>this._visibility[t])}_canCycle(){const t=this._config?.auto_cycle;if(!t?.enabled||!this.isConnected||this._isEditing)return!1;const e=this._cycleOrder();return e.length>=2&&e.some(t=>!this._config.tabs[t]?.skip_cycle)}_nextCycleTab(){const t=this._cycleOrder(),e=Math.max(0,t.indexOf(this._active));for(let i=1;i<=t.length;i+=1){const n=t[(e+i)%t.length];if(!this._config.tabs[n]?.skip_cycle)return n}}_scheduleCycle(){clearTimeout(this._cycleTimer),this._cycleTimer=void 0;const t=this._canCycle();if(this._cycleForTab=this._active,this._cycleForState=t,!t)return void(this._cycleActive&&(this._cycleActive=!1,this.requestUpdate()));const e=Date.now();if(this._pausedUntil>e)return this._cycleActive=!1,this._cycleTimer=setTimeout(()=>this._scheduleCycle(),this._pausedUntil-e),void this.requestUpdate();const i=this._config.tabs[this._active]||{},n=Number(i.cycle_duration)>0?Number(i.cycle_duration):Number(this._config.auto_cycle.interval)||10;this._cycleDuration=1e3*Math.max(1,n),this._cycleRemaining=this._cycleDuration,this._cycleKey+=1,this._cycleActive=!0,this._cyclePaused=this._hovering&&this._config.auto_cycle.pause_on_hover,this._cyclePaused||this._startCycleTimer(),this.requestUpdate()}_startCycleTimer(){clearTimeout(this._cycleTimer),this._cycleStartedAt=Date.now(),this._cycleTimer=setTimeout(()=>{if(this._cycleTimer=void 0,this._drag)return void this._scheduleCycle();const t=this._nextCycleTab();void 0!==t&&t!==this._active&&this._setActive(t,"cycle"),this._scheduleCycle()},this._cycleRemaining)}_setupWatchers(){this._clearWatchers();const t=(e=this._config.tabs,Mt(e).flatMap(t=>[...jt(t?.conditions),...jt(t?.jump_conditions)]));var e;const i=new Set(t.filter(t=>"screen"===Nt(t)&&t.media_query).map(t=>t.media_query));for(const t of i)try{const e=window.matchMedia(t),i=()=>this.requestUpdate();e.addEventListener("change",i),this._watchers.push(()=>e.removeEventListener("change",i))}catch(t){}if(t.some(t=>"time"===Nt(t))){const t=setInterval(()=>this.requestUpdate(),15e3);this._watchers.push(()=>clearInterval(t))}}_clearWatchers(){for(const t of this._watchers)t();this._watchers=[]}_wantedTemplates(){const t=new Set;for(const e of this._config.tabs){for(const i of Lt(e.conditions))t.add(i);for(const i of Lt(e.jump_conditions))t.add(i);for(const i of["name_template","icon_template","color_template"])e[i]&&t.add(String(e[i]));re(e.badge)&&t.add(e.badge)}return t}_updateTemplateSubscriptions(){if(!this._hass?.connection||!this.isConnected||!this._config)return;const t=this._wantedTemplates();for(const[e,i]of this._templateSubs)t.has(e)||(this._templateSubs.delete(e),this._templates.delete(e),i.then(t=>t?.()).catch(()=>{}));for(const e of t){if(this._templateSubs.has(e))continue;const t=this._hass.connection.subscribeMessage(t=>{this._templates.set(e,!(!t||!("result"in t))&&t.result),this.requestUpdate()},{type:"render_template",template:e,variables:{user:this._hass.user?.name}}).catch(t=>{console.warn("hacard-tabs: template error",t),this._templates.set(e,!1),this.requestUpdate()});this._templateSubs.set(e,t)}}_unsubscribeTemplates(){for(const t of this._templateSubs.values())t.then(t=>t?.()).catch(()=>{});this._templateSubs.clear()}}customElements.get(gt)||customElements.define(gt,de),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===gt)||window.customCards.push({type:gt,name:"Card Tabs",description:Kt(void 0,"card.description"),preview:!0,documentationURL:"https://github.com/Ga-Re/HACardTabs"}),console.info("%c CARD-TABS %c v1.2.0 ","color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");export{de as HACardTabs};
