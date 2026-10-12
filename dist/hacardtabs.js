const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:r,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,_=globalThis,p=_.trustedTypes,b=p?p.emptyScript:"",m=_.reactiveElementPolyfillSupport,g=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!r(t,e),v={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);n?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=s;const a=n.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const a=this.constructor;if(!1===s&&(n=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==n||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,m?.({ReactiveElement:$}),(_.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=t=>t,T=x.trustedTypes,A=T?T.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+S,E=`<${k}>`,P=document,M=()=>P.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,z="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,B=/>/g,H=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,R=/"/g,I=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,F=P.createTreeWalker(P,129);function V(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let n,a=2===e?"<svg>":3===e?"<math>":"",o=O;for(let e=0;e<i;e++){const i=t[e];let r,c,l=-1,d=0;for(;d<i.length&&(o.lastIndex=d,c=o.exec(i),null!==c);)d=o.lastIndex,o===O?"!--"===c[1]?o=D:void 0!==c[1]?o=B:void 0!==c[2]?(I.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=H):void 0!==c[3]&&(o=H):o===H?">"===c[0]?(o=n??O,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,r=c[1],o=void 0===c[3]?H:'"'===c[3]?R:L):o===R||o===L?o=H:o===D||o===B?o=O:(o=H,n=void 0);const h=o===H&&t[e+1].startsWith("/>")?" ":"";a+=o===O?i+E:l>=0?(s.push(r),i.slice(0,l)+C+i.slice(l)+S+h):i+S+(-2===l?e:h)}return[V(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,a=0;const o=t.length-1,r=this.parts,[c,l]=G(t,e);if(this.el=X.createElement(c,i),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=F.nextNode())&&r.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=l[a++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(S)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=T?T.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),F.nextNode(),r.push({type:2,index:++n});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===k)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)r.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===W)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const a=N(e)?void 0:e._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),void 0===a?n=void 0:(n=new a(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Z(t,n._$AS(t,e.values),n,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);F.currentNode=s;let n=F.nextNode(),a=0,o=0,r=i[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new Y(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new st(n,this,t)),this._$AV.push(e),r=i[++o]}a!==r?.index&&(n=F.nextNode(),a++)}return F.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),N(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new X(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Y(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,s){const n=this.strings;let a=!1;if(void 0===n)t=Z(this,t,e,0),a=!N(t)||t!==this._$AH&&t!==W,a&&(this._$AH=t);else{const s=t;let o,r;for(t=n[0],o=0;o<n.length-1;o++)r=Z(this,s[i+o],e,o),r===W&&(r=this._$AH[o]),a||=!N(r)||r!==this._$AH[o],r===q?t=q:t!==q&&(t+=(r??"")+n[o+1]),this._$AH[o]=r}a&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class it extends Q{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??q)===W)return;const i=this._$AH,s=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==q&&(i===q||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(X,Y),(x.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;let ot=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Y(e.insertBefore(M(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};ot._$litElement$=!0,ot.finalized=!0,at.litElementHydrateSupport?.({LitElement:ot});const rt=at.litElementPolyfillSupport;rt?.({LitElement:ot}),(at.litElementVersions??=[]).push("4.2.2");const ct=1,lt=t=>(...e)=>({_$litDirective$:t,values:e});let dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const ht=lt(class extends dt{constructor(t){if(super(t),t.type!==ct||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return W}}),ut="important",_t=" !"+ut,pt=lt(class extends dt{constructor(t){if(super(t),t.type!==ct||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(_t);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?ut:""):i[t]=s}}return W}}),bt={},mt=lt(class extends dt{constructor(){super(...arguments),this.key=q}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&(((t,e=bt)=>{t._$AH=e})(t),this.key=e),i}}),gt="hacard-tabs",ft="hacard-tabs-editor",yt="hacard-tabs-editor-select",vt={default_tab:0,remember_tab:!1,tab_position:"top",tab_style:"underline",tab_alignment:"start",tab_content:"icon_name",icon_position:"start",card_background:!0,inner_cards_background:!0,hide_single_tab:!1,animation:"fade",swipe:!0,card_gap:8,return_to_default:0},$t={enabled:!1,interval:10,pause_on_interaction:30,pause_on_hover:!0,show_progress:!0},xt=["primary","accent","red","pink","purple","deep-purple","indigo","blue","light-blue","cyan","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","grey","blue-grey","black","white","disabled"],wt=["mon","tue","wed","thu","fri","sat","sun"],Tt=["state","numeric_state","user","screen","time","template"],At={state:"mdi:state-machine",numeric_state:"mdi:numeric",user:"mdi:account",screen:"mdi:responsive",time:"mdi:clock-outline",template:"mdi:code-braces",and:"mdi:ampersand",or:"mdi:gate-or",not:"mdi:not-equal-variant"},Ct={mobile:"(max-width: 767px)",tablet:"(min-width: 768px) and (max-width: 1023px)",desktop:"(min-width: 1024px)",wide:"(min-width: 1280px)"},St=t=>null==t?[]:Array.isArray(t)?t:[t];function kt(t){if(t)return t.condition?t.condition:t.entity?"state":void 0}function Et(t,e,i){const s=t?.states?.[e];if(s)return i?s.attributes?.[i]:s.state}function Pt(t,e){if(null!=e&&""!==e)return Number("string"==typeof e&&t?.states?.[e]?t.states[e].state:e)}function Mt(t){if(!t||"string"!=typeof t)return;const[e,i="0",s="0"]=t.split(":"),n=3600*Number(e)+60*Number(i)+Number(s);return Number.isNaN(n)?void 0:n}function Nt(t,e){const{hass:i}=e;switch(kt(t)){case"state":{const e=Et(i,t.entity,t.attribute),s=void 0===e?void 0:String(e);return void 0!==t.state?St(t.state).map(String).includes(s):void 0!==t.state_not?!St(t.state_not).map(String).includes(s):void 0!==s}case"numeric_state":{const e=Number(Et(i,t.entity,t.attribute));if(Number.isNaN(e))return!1;const s=Pt(i,t.above),n=Pt(i,t.below);return(void 0===s||e>s)&&(void 0===n||e<n)}case"user":return St(t.users).includes(i?.user?.id);case"screen":return!t.media_query||window.matchMedia(t.media_query).matches;case"time":{const i=e.now||new Date,s=St(t.weekdays);if(s.length&&!s.includes(wt[(i.getDay()+6)%7]))return!1;const n=3600*i.getHours()+60*i.getMinutes()+i.getSeconds(),a=Mt(t.after),o=Mt(t.before);return void 0!==a&&void 0!==o&&a>o?n>=a||n<o:!(void 0!==a&&n<a)&&!(void 0!==o&&n>=o)}case"template":return function(t){if("string"==typeof t){const e=t.trim().toLowerCase();return!["","false","off","no","0","none","unknown","unavailable"].includes(e)}return Boolean(t)}(e.templates?.get(t.value_template));case"and":return St(t.conditions).every(t=>Nt(t,e));case"or":return St(t.conditions).some(t=>Nt(t,e));case"not":return!St(t.conditions).some(t=>Nt(t,e));default:return!0}}function Ut(t){const e=[],i=t=>{for(const s of St(t))s&&"object"==typeof s&&(e.push(s),s.conditions&&i(s.conditions))};for(const e of St(t))i(e?.conditions);return e}const zt={en:{card:{name:"Card Tabs",description:"Tabs with their own sections of cards – colors, icons, conditions and auto-rotation.",no_tabs:"No tabs configured. Open the editor to add tabs.",hidden_tab:"Hidden by conditions",stub_tab_1:"Tab 1",stub_tab_2:"Tab 2",stub_text_1:"## Tab 1\nAdd cards to this tab in the editor.",stub_text_2:"## Tab 2\nEvery tab is its own section."},editor:{page_tabs:"Tabs",page_appearance:"Appearance",page_behavior:"Behavior",add_tab:"Add tab",new_tab:"Tab {n}",move_left:"Move left",move_right:"Move right",duplicate:"Duplicate",delete:"Delete",delete_tab_confirm:'Delete tab "{name}" including its cards?',tab_general:"General",tab_cards:"Cards",tab_conditions:"Conditions",tab_style:"Style",no_tabs:"No tabs yet – add your first tab.",name:"Name",icon:"Icon",badge_entity:"Badge entity (shows its state on the tab)",columns:"Columns in this section",skip_cycle:"Skip during automatic rotation",cycle_duration:"Display duration for rotation (s, empty = global)",color:"Accent color (active tab)",text_color:"Text / icon color",active_text_color:"Text / icon color (active)",background_color:"Background color",color_helper:"Hex value (#ff9800), CSS color, var(--…) or Home Assistant color name (red, primary …). Empty = default.",tab_colors_helper:'Overrides the global colors from the "Appearance" page for this tab only.',pick_color:"Pick color",clear:"Reset",add_card:"Add card",card_n:"Card {n}",toggle_editor:"Toggle code / visual editor",move_up:"Move up",move_down:"Move down",copy:"Copy",move_to_tab:"Move to tab …",no_cards:"This tab has no cards yet.",loading:"Loading editor …",conditions_helper:"The tab is only shown when the conditions are met. Without conditions it is always shown. In edit mode hidden tabs are shown greyed out.",condition_mode:"Show tab when",condition_mode_all:"all conditions are met (AND)",condition_mode_any:"at least one condition is met (OR)",add_condition:"Add condition",cond_state:"Entity state",cond_numeric_state:"Numeric value",cond_user:"User",cond_screen:"Screen size",cond_time:"Time / weekday",cond_template:"Template",cond_and:"AND group",cond_or:"OR group",cond_not:"NOT group",cond_yaml_only:"This condition can only be edited in the code editor.",entity:"Entity",attribute:"Attribute (optional)",operator:"Operator",op_is:"is",op_is_not:"is not",state:"State",state_helper:"Separate multiple values with commas.",above:"Above",below:"Below",users:"Users",media_query:"Screen / media query",screen_mobile:"Mobile (< 768px)",screen_tablet:"Tablet (768–1023px)",screen_desktop:"Desktop (≥ 1024px)",screen_wide:"Wide (≥ 1280px)",after:"From",before:"Until",weekdays:"Weekdays",mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday",value_template:"Template (true = show)",tab_position:"Tab bar position",pos_top:"Top",pos_bottom:"Bottom",pos_left:"Left",pos_right:"Right",tab_style:"Tab style",style_underline:"Underline",style_pills:"Pills",style_buttons:"Buttons",style_segmented:"Segmented",tab_alignment:"Alignment",align_start:"Start",align_center:"Center",align_end:"End",align_stretch:"Fill width",tab_content:"Tab content",content_icon_name:"Icon and name",content_icon:"Icon only",content_name:"Name only",icon_position:"Icon position",icon_start:"Next to the name",icon_top:"Above the name",card_background:"Show card background",inner_cards_background:"Show background of the cards inside the tabs",hide_single_tab:"Hide tab bar when only one tab is visible",animation:"Animation when switching",anim_none:"None",anim_fade:"Fade",anim_slide:"Slide",card_gap:"Gap between cards (px)",global_colors:"Colors (all tabs)",default_tab:"Default tab",remember_tab:"Remember last tab (per device)",swipe:"Change tabs by swiping (touch)",return_to_default:"Return to default tab after inactivity (s, 0 = off)",auto_cycle:"Automatic rotation",auto_cycle_enabled:"Switch tabs automatically",interval:"Interval (seconds)",pause_on_interaction:"Pause after interaction (s, 0 = no pause)",pause_on_hover:"Pause while the mouse is over the card",show_progress:"Show progress bar",auto_cycle_helper:"Rotation is paused in edit mode and in the editor preview."}},de:{card:{name:"Card Tabs",description:"Tabs mit eigenen Sektionen für Karten – Farben, Icons, Bedingungen und automatischer Wechsel.",no_tabs:"Keine Tabs konfiguriert. Öffne den Editor, um Tabs hinzuzufügen.",hidden_tab:"Durch Bedingungen ausgeblendet",stub_tab_1:"Tab 1",stub_tab_2:"Tab 2",stub_text_1:"## Tab 1\nFüge diesem Tab im Editor Karten hinzu.",stub_text_2:"## Tab 2\nJeder Tab ist eine eigene Sektion."},editor:{page_tabs:"Tabs",page_appearance:"Darstellung",page_behavior:"Verhalten",add_tab:"Tab hinzufügen",new_tab:"Tab {n}",move_left:"Nach links",move_right:"Nach rechts",duplicate:"Duplizieren",delete:"Löschen",delete_tab_confirm:'Tab "{name}" inklusive aller Karten löschen?',tab_general:"Allgemein",tab_cards:"Karten",tab_conditions:"Bedingungen",tab_style:"Stil",no_tabs:"Noch keine Tabs – füge deinen ersten Tab hinzu.",name:"Name",icon:"Icon",badge_entity:"Badge-Entität (zeigt ihren Zustand am Tab)",columns:"Spalten in dieser Sektion",skip_cycle:"Beim automatischen Wechsel überspringen",cycle_duration:"Anzeigedauer beim Wechsel (s, leer = global)",color:"Akzentfarbe (aktiver Tab)",text_color:"Text-/Iconfarbe",active_text_color:"Text-/Iconfarbe (aktiv)",background_color:"Hintergrundfarbe",color_helper:"Hex-Wert (#ff9800), CSS-Farbe, var(--…) oder Home-Assistant-Farbname (red, primary …). Leer = Standard.",tab_colors_helper:"Überschreibt für diesen Tab die globalen Farben aus „Darstellung“.",pick_color:"Farbe wählen",clear:"Zurücksetzen",add_card:"Karte hinzufügen",card_n:"Karte {n}",toggle_editor:"Code-/Visuellen Editor umschalten",move_up:"Nach oben",move_down:"Nach unten",copy:"Kopieren",move_to_tab:"In Tab verschieben …",no_cards:"Dieser Tab enthält noch keine Karten.",loading:"Editor wird geladen …",conditions_helper:"Der Tab wird nur angezeigt, wenn die Bedingungen erfüllt sind. Ohne Bedingungen ist er immer sichtbar. Im Bearbeitungsmodus werden ausgeblendete Tabs ausgegraut angezeigt.",condition_mode:"Tab anzeigen, wenn",condition_mode_all:"alle Bedingungen erfüllt sind (UND)",condition_mode_any:"mindestens eine Bedingung erfüllt ist (ODER)",add_condition:"Bedingung hinzufügen",cond_state:"Entitätszustand",cond_numeric_state:"Numerischer Wert",cond_user:"Benutzer",cond_screen:"Bildschirmgröße",cond_time:"Uhrzeit / Wochentag",cond_template:"Template",cond_and:"UND-Gruppe",cond_or:"ODER-Gruppe",cond_not:"NICHT-Gruppe",cond_yaml_only:"Diese Bedingung kann nur im Code-Editor bearbeitet werden.",entity:"Entität",attribute:"Attribut (optional)",operator:"Operator",op_is:"ist",op_is_not:"ist nicht",state:"Zustand",state_helper:"Mehrere Werte mit Komma trennen.",above:"Über",below:"Unter",users:"Benutzer",media_query:"Bildschirm / Media Query",screen_mobile:"Mobil (< 768px)",screen_tablet:"Tablet (768–1023px)",screen_desktop:"Desktop (≥ 1024px)",screen_wide:"Breit (≥ 1280px)",after:"Ab",before:"Bis",weekdays:"Wochentage",mon:"Montag",tue:"Dienstag",wed:"Mittwoch",thu:"Donnerstag",fri:"Freitag",sat:"Samstag",sun:"Sonntag",value_template:"Template (true = anzeigen)",tab_position:"Position der Tab-Leiste",pos_top:"Oben",pos_bottom:"Unten",pos_left:"Links",pos_right:"Rechts",tab_style:"Tab-Stil",style_underline:"Unterstrichen",style_pills:"Pillen",style_buttons:"Buttons",style_segmented:"Segmentiert",tab_alignment:"Ausrichtung",align_start:"Anfang",align_center:"Mitte",align_end:"Ende",align_stretch:"Volle Breite",tab_content:"Tab-Inhalt",content_icon_name:"Icon und Name",content_icon:"Nur Icon",content_name:"Nur Name",icon_position:"Icon-Position",icon_start:"Neben dem Namen",icon_top:"Über dem Namen",card_background:"Kartenhintergrund anzeigen",inner_cards_background:"Hintergrund der Karten in den Tabs anzeigen",hide_single_tab:"Tab-Leiste ausblenden, wenn nur ein Tab sichtbar ist",animation:"Animation beim Wechsel",anim_none:"Keine",anim_fade:"Einblenden",anim_slide:"Schieben",card_gap:"Abstand zwischen Karten (px)",global_colors:"Farben (alle Tabs)",default_tab:"Standard-Tab",remember_tab:"Zuletzt gewählten Tab merken (pro Gerät)",swipe:"Tabs per Wischgeste wechseln (Touch)",return_to_default:"Nach Inaktivität zum Standard-Tab zurück (s, 0 = aus)",auto_cycle:"Automatischer Wechsel",auto_cycle_enabled:"Tabs automatisch wechseln",interval:"Intervall (Sekunden)",pause_on_interaction:"Pause nach Interaktion (s, 0 = keine Pause)",pause_on_hover:"Pausieren, solange die Maus über der Karte ist",show_progress:"Fortschrittsbalken anzeigen",auto_cycle_helper:"Im Bearbeitungsmodus und in der Editor-Vorschau ist der automatische Wechsel pausiert."}}};function Ot(t,e){return e.split(".").reduce((t,e)=>null==t?void 0:t[e],zt[t])}function Dt(t,e,i){let s=Ot((t?.locale?.language||t?.language||navigator.language||"en").split("-")[0].toLowerCase(),e)??Ot("en",e)??e;if(i)for(const[t,e]of Object.entries(i))s=s.replace(`{${t}}`,e);return s}const Bt=a`
  :host {
    display: block;
  }
  :host([hidden]) {
    display: none !important;
  }
  ha-card {
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
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
  .tabbar {
    display: flex;
    gap: 4px;
    padding: 6px 8px 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    flex: 0 0 auto;
    box-sizing: border-box;
    min-width: 0;
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
    max-width: 40%;
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
    gap: 2px;
    border-radius: 12px;
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
    min-height: 40px;
    padding: 8px 14px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
    font-size: var(--hacard-tabs-font-size, 14px);
    font-weight: 500;
    line-height: 1.2;
    color: var(--hct-text, var(--secondary-text-color));
    background: var(--hct-bg, transparent);
    border-radius: 8px 8px 0 0;
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
    --mdc-icon-size: var(--hacard-tabs-icon-size, 20px);
    flex: 0 0 auto;
  }
  .tab.icon-top {
    flex-direction: column;
    gap: 2px;
    padding: 6px 12px;
    font-size: var(--hacard-tabs-font-size, 12px);
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
    background: var(--_color);
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
    border-radius: 8px 0 0 8px;
  }
  .pos-right .vertical .tab {
    border-radius: 0 8px 8px 0;
  }
  .pos-bottom .tab {
    border-radius: 0 0 8px 8px;
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
    border-radius: 999px;
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
    border-radius: 12px;
    background: var(--hct-bg, rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06));
  }
  .style-segmented .tab {
    border-radius: 9px;
    min-height: 34px;
  }
  .style-pills .tab.active,
  .style-buttons .tab.active,
  .style-segmented .tab.active {
    background: var(--_color);
    color: var(--hct-active-text, var(--text-primary-color, #fff));
  }
  .style-pills .tab.active .badge,
  .style-buttons .tab.active .badge,
  .style-segmented .tab.active .badge {
    background: var(--card-background-color, #fff);
    color: var(--_color);
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
    height: 3px;
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
  @keyframes hct-progress {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  .content {
    padding: var(--hacard-tabs-padding, 8px);
    min-width: 0;
    flex: 1 1 auto;
  }
  .no-bg .content {
    padding: var(--hacard-tabs-padding, 8px 0 0 0);
  }
  .no-bg.bar-bottom .content {
    padding: var(--hacard-tabs-padding, 0 0 8px 0);
  }
  .no-bg.bar-left .content {
    padding: var(--hacard-tabs-padding, 0 0 0 8px);
  }
  .no-bg.bar-right .content {
    padding: var(--hacard-tabs-padding, 0 8px 0 0);
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
  .section.anim-fade {
    animation: hct-fade 0.25s ease;
  }
  .section.anim-slide-next {
    animation: hct-slide-next 0.25s ease;
  }
  .section.anim-slide-prev {
    animation: hct-slide-prev 0.25s ease;
  }
  @keyframes hct-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes hct-slide-next {
    from {
      opacity: 0;
      transform: translateX(24px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes hct-slide-prev {
    from {
      opacity: 0;
      transform: translateX(-24px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .section,
    .tab,
    .tab::after {
      animation: none !important;
      transition: none !important;
    }
  }
  .empty {
    padding: 16px;
    color: var(--secondary-text-color);
  }
`;function Ht(t){if(null==t||""===t)return;if(Array.isArray(t)&&t.length>=3)return`rgb(${t.slice(0,3).join(", ")})`;const e=String(t).trim();return xt.includes(e)?`var(--${e}-color)`:e}function Lt(t,e,i,s={}){const n=new CustomEvent(e,{bubbles:s.bubbles??!0,composed:s.composed??!0,cancelable:Boolean(s.cancelable),detail:i});return t.dispatchEvent(n),n}let Rt;function It(){return Rt||(Rt=window.loadCardHelpers?window.loadCardHelpers():Promise.resolve(void 0)),Rt}const jt=(t,e)=>Promise.race([t,new Promise(t=>setTimeout(t,e))]);async function Wt(t,e,i){const s=`hui-${e}-card`;let n=customElements.get(s);!n&&t&&(t.createCardElement({type:e,...i}),await jt(customElements.whenDefined(s),5e3),n=customElements.get(s)),n?.getConfigElement&&await n.getConfigElement()}let qt;const Kt=["color","text_color","active_text_color","background_color"],Ft=t=>null==t?[]:Array.isArray(t)?t:[t],Vt=t=>null==t||""===t||Array.isArray(t)&&0===t.length;function Gt(t){const e=[];for(const i of t)"grid"===i.type||"expandable"===i.type?e.push(...Gt(i.schema)):i.name&&e.push(i.name);return e}function Xt(t,e,i,s={}){const n={...t};for(const t of i){const i=e[t];Vt(i)||t in s&&s[t]===i?delete n[t]:n[t]=i}return n}class Zt extends ot{static properties={hass:{attribute:!1},lovelace:{attribute:!1},_config:{state:!0},_page:{state:!0},_selectedTab:{state:!0},_tabPage:{state:!0},_selectedCard:{state:!0},_guiMode:{state:!0},_guiModeAvailable:{state:!0},_loaded:{state:!0},_users:{state:!0}};constructor(){super(),this._page="tabs",this._selectedTab=0,this._tabPage="general",this._selectedCard=0,this._guiMode=!0,this._guiModeAvailable=!0,this._loaded=!1}setConfig(t){this._config={...t,tabs:Array.isArray(t?.tabs)?t.tabs:[]};const e=this._config.tabs.length;this._selectedTab>=e&&(this._selectedTab=Math.max(0,e-1))}connectedCallback(){super.connectedCallback(),(qt||(qt=(async()=>{const t=["ha-form","hui-card-element-editor","hui-card-picker"];if(t.every(t=>customElements.get(t)))return;const e=await It();try{await Wt(e,"vertical-stack",{cards:[]})}catch(t){}try{await Wt(e,"entities",{entities:[]})}catch(t){}await jt(Promise.all(t.map(t=>customElements.whenDefined(t))),1e4)})()),qt).catch(()=>{}).then(()=>{this._loaded=!0}),this._syncPreview()}disconnectedCallback(){super.disconnectedCallback(),delete window.__hacardTabsEditorSelection}_t(t,e){return Dt(this.hass,`editor.${t}`,e)}get _tabs(){return this._config?.tabs||[]}_tabName(t,e){return t?.name||this._t("new_tab",{n:e+1})}_commit(t){this._config=t,Lt(this,"config-changed",{config:t}),this._syncPreview()}_syncPreview(){this._config&&(window.__hacardTabsEditorSelection={key:JSON.stringify(this._config.tabs||[]),index:this._selectedTab},setTimeout(()=>window.dispatchEvent(new CustomEvent(yt)),0))}_setTabs(t,e={}){this._commit({...this._config,...e,tabs:t})}_updateTab(t,e){const i=[...this._tabs];i[t]=e({...i[t]||{}}),this._setTabs(i)}_iconButton(t,e,i,s=!1,n=""){return j`
      <button
        class="icon-btn ${n}"
        type="button"
        title=${e}
        aria-label=${e}
        ?disabled=${s}
        @click=${i}
      >
        <ha-icon .icon=${t}></ha-icon>
      </button>
    `}_computeLabel=t=>this._t({media_query:"media_query",value_template:"value_template"}[t.name]||t.name);_computeHelper=t=>{if("state"===t.name)return this._t("state_helper")};render(){if(!this.hass||!this._config)return q;return j`
      <div class="pages" role="tablist">
        ${[["tabs","mdi:tab"],["appearance","mdi:palette-outline"],["behavior","mdi:cog-outline"]].map(([t,e])=>j`
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
    `}_renderTabsPage(){const t=this._tabs;return j`
      <div class="chips">
        ${t.map((t,e)=>j`
            <button
              type="button"
              class="chip ${e===this._selectedTab?"active":""}"
              style=${Ht(t.color)?`--chip-color: ${Ht(t.color)}`:""}
              @click=${()=>this._selectTab(e)}
            >
              ${t.icon?j`<ha-icon .icon=${t.icon}></ha-icon>`:q}
              <span>${this._tabName(t,e)}</span>
              ${Ft(t.conditions).length?j`<ha-icon class="mini" icon="mdi:eye-check-outline"></ha-icon>`:q}
            </button>
          `)}
        <button type="button" class="chip add" @click=${this._addTab}>
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("add_tab")}</span>
        </button>
      </div>
      ${t.length?this._renderTabEditor(this._selectedTab):j`<div class="hint">${this._t("no_tabs")}</div>`}
    `}_renderTabEditor(t){const e=this._tabs[t]||{},i=Ft(e.conditions).length,s=Ft(e.cards).length;return j`
      <div class="tab-editor">
        <div class="toolbar">
          <div class="subnav">
            ${[["general","mdi:form-textbox"],["cards","mdi:cards-outline"],["conditions","mdi:eye-check-outline"],["style","mdi:palette-swatch-outline"]].map(([t,e])=>j`
                <button
                  type="button"
                  class="sub-btn ${this._tabPage===t?"active":""}"
                  @click=${()=>{this._tabPage=t}}
                >
                  <ha-icon .icon=${e}></ha-icon>
                  <span>${this._t(`tab_${t}`)}</span>
                  ${"cards"===t?j`<span class="count">${s}</span>`:q}
                  ${"conditions"===t&&i?j`<span class="count">${i}</span>`:q}
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
    `}_renderTabGeneral(t,e){const i=[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{type:"grid",name:"",schema:[{name:"badge_entity",selector:{entity:{}}},{name:"columns",selector:{number:{min:1,max:6,mode:"box"}}}]}];this._config.auto_cycle?.enabled&&i.push({type:"grid",name:"",schema:[{name:"cycle_duration",selector:{number:{min:1,max:86400,mode:"box",unit_of_measurement:"s"}}},{name:"skip_cycle",selector:{boolean:{}}}]});const s=Gt(i);return j`
      <ha-form
        .hass=${this.hass}
        .data=${{columns:1,...e}}
        .schema=${i}
        .computeLabel=${this._computeLabel}
        @value-changed=${e=>{e.stopPropagation();const i={...e.detail.value};void 0!==i.columns&&(i.columns=Number(i.columns)||void 0),this._updateTab(t,t=>Xt(t,i,s,{columns:1,skip_cycle:!1}))}}
      ></ha-form>
    `}_renderTabStyle(t,e){return j`
      <div class="hint">${this._t("tab_colors_helper")}</div>
      ${Kt.map(i=>this._renderColorField(i,e[i],e=>this._updateTab(t,t=>Xt(t,{[i]:e},[i]))))}
      <div class="hint small">${this._t("color_helper")}</div>
    `}_renderColorField(t,e,i){const s=Ht(e);return j`
      <div class="color-field">
        <label
          class="swatch ${s?"":"empty"}"
          title=${this._t("pick_color")}
          style=${s?`background: ${s}`:""}
        >
          <input
            type="color"
            .value=${function(t){const e=Ht(t);if(!e)return"#03a9f4";const i=/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(e);if(i)return`#${i[1]}${i[1]}${i[2]}${i[2]}${i[3]}${i[3]}`.toLowerCase();if(/^#[0-9a-f]{6}$/i.test(e))return e.toLowerCase();try{const t=document.createElement("span");t.style.color=e,t.style.display="none",document.body.appendChild(t);const i=getComputedStyle(t).color;t.remove();const s=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(i);if(s)return`#${s.slice(1,4).map(t=>Number(t).toString(16).padStart(2,"0")).join("")}`}catch(t){}return"#03a9f4"}(e)}
            @change=${t=>i(t.target.value)}
            aria-label=${this._t("pick_color")}
          />
          ${s?q:j`<ha-icon icon="mdi:palette-outline"></ha-icon>`}
        </label>
        <ha-form
          class="grow"
          .hass=${this.hass}
          .data=${{[t]:e??""}}
          .schema=${[{name:t,selector:{text:{}}}]}
          .computeLabel=${this._computeLabel}
          @value-changed=${e=>{e.stopPropagation(),i(e.detail.value[t])}}
        ></ha-form>
        ${e?this._iconButton("mdi:close",this._t("clear"),()=>i(void 0)):q}
      </div>
    `}_renderTabCards(t,e){const i=Ft(e.cards),s=Math.min(this._selectedCard,i.length);return this._loaded?j`
      <div class="chips small">
        ${i.map((t,e)=>j`
            <button
              type="button"
              class="chip small ${e===s?"active":""}"
              title=${t?.type||""}
              @click=${()=>this._selectCard(e)}
            >
              <span>${e+1}</span>
              <span class="card-type">${String(t?.type||"").replace(/^custom:/,"")}</span>
            </button>
          `)}
        <button
          type="button"
          class="chip small add ${s===i.length?"active":""}"
          @click=${()=>this._selectCard(i.length)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("add_card")}</span>
        </button>
      </div>
      ${s<i.length?j`
            <div class="card-toolbar">
              <div class="actions">
                ${this._iconButton(this._guiMode?"mdi:code-braces":"mdi:list-box-outline",this._t("toggle_editor"),this._toggleCardMode,this._guiMode&&!this._guiModeAvailable)}
                ${this._iconButton("mdi:arrow-up",this._t("move_up"),()=>this._moveCard(t,s,-1),0===s)}
                ${this._iconButton("mdi:arrow-down",this._t("move_down"),()=>this._moveCard(t,s,1),s===i.length-1)}
                ${this._iconButton("mdi:content-copy",this._t("copy"),()=>this._copyCard(t,s))}
                ${this._tabs.length>1?j`
                      <select
                        class="move-select"
                        title=${this._t("move_to_tab")}
                        @change=${e=>{const i=Number(e.target.value);e.target.value="",Number.isNaN(i)||this._moveCardToTab(t,s,i)}}
                      >
                        <option value="">${this._t("move_to_tab")}</option>
                        ${this._tabs.map((e,i)=>i===t?q:j`<option value=${i}>${this._tabName(e,i)}</option>`)}
                      </select>
                    `:q}
                ${this._iconButton("mdi:delete-outline",this._t("delete"),()=>this._deleteCard(t,s),!1,"danger")}
              </div>
            </div>
            ${mt(`${t}-${s}`,j`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${i[s]}
                  @config-changed=${e=>this._cardChanged(e,t,s)}
                  @GUImode-changed=${this._guiModeChanged}
                ></hui-card-element-editor>
              `)}
          `:j`
            <hui-card-picker
              .hass=${this.hass}
              .lovelace=${this.lovelace}
              @config-changed=${e=>this._cardPicked(e,t)}
            ></hui-card-picker>
          `}
    `:j`<div class="hint">${this._t("loading")}</div>`}_selectCard(t){this._selectedCard=t,this._guiMode=!0,this._guiModeAvailable=!0}_toggleCardMode=()=>{this.renderRoot.querySelector("hui-card-element-editor")?.toggleMode?.()};_guiModeChanged=t=>{t.stopPropagation(),this._guiMode=t.detail.guiMode,this._guiModeAvailable=t.detail.guiModeAvailable};_cardChanged(t,e,i){t.stopPropagation();const s=t.detail?.config;t.detail&&"guiModeAvailable"in t.detail&&(this._guiModeAvailable=t.detail.guiModeAvailable),s&&this._updateTab(e,t=>{const e=[...Ft(t.cards)];return e[i]=s,{...t,cards:e}})}_cardPicked(t,e){t.stopPropagation();const i=t.detail?.config;if(!i)return;const s=[...Ft(this._tabs[e]?.cards),i];this._updateTab(e,t=>({...t,cards:s})),this._selectCard(s.length-1)}_moveCard(t,e,i){const s=e+i;this._updateTab(t,t=>{const i=[...Ft(t.cards)];return s<0||s>=i.length?t:([i[e],i[s]]=[i[s],i[e]],{...t,cards:i})}),this._selectedCard=s}_copyCard(t,e){this._updateTab(t,t=>{const i=[...Ft(t.cards)];return i.splice(e+1,0,structuredClone(i[e])),{...t,cards:i}}),this._selectCard(e+1)}_deleteCard(t,e){this._updateTab(t,t=>{const i=[...Ft(t.cards)];return i.splice(e,1),{...t,cards:i}}),this._selectCard(Math.max(0,e-1))}_moveCardToTab(t,e,i){const s=this._tabs.map(t=>({...t})),n=[...Ft(s[t].cards)],[a]=n.splice(e,1);s[t].cards=n,s[i].cards=[...Ft(s[i].cards),a],this._setTabs(s),this._selectCard(Math.max(0,e-1))}_renderTabConditions(t,e){const i=Ft(e.conditions);return this._users||this._loadUsers(),j`
      <div class="hint">${this._t("conditions_helper")}</div>
      ${i.length>1?j`
            <ha-form
              .hass=${this.hass}
              .data=${{condition_mode:e.condition_mode||"all"}}
              .schema=${[{name:"condition_mode",selector:{select:{mode:"dropdown",options:[{value:"all",label:this._t("condition_mode_all")},{value:"any",label:this._t("condition_mode_any")}]}}}]}
              .computeLabel=${this._computeLabel}
              @value-changed=${e=>{e.stopPropagation();const i=e.detail.value.condition_mode;this._updateTab(t,t=>Xt(t,{condition_mode:i},["condition_mode"],{condition_mode:"all"}))}}
            ></ha-form>
          `:q}
      ${i.map((e,i)=>this._renderCondition(t,e,i))}
      <div class="add-condition">
        <div class="label">${this._t("add_condition")}</div>
        <div class="chips small">
          ${Tt.map(e=>j`
              <button type="button" class="chip small" @click=${()=>this._addCondition(t,e)}>
                <ha-icon .icon=${At[e]}></ha-icon>
                <span>${this._t(`cond_${e}`)}</span>
              </button>
            `)}
        </div>
      </div>
    `}_renderCondition(t,e,i){const s=kt(e),n=this._conditionSchema(s,e);return j`
      <div class="condition">
        <div class="condition-header">
          <ha-icon .icon=${At[s]||"mdi:help-circle-outline"}></ha-icon>
          <span>${At[s]?this._t(`cond_${s}`):s||"?"}</span>
          ${this._iconButton("mdi:delete-outline",this._t("delete"),()=>this._removeCondition(t,i),!1,"danger")}
        </div>
        ${n?j`
              <ha-form
                .hass=${this.hass}
                .data=${this._conditionToForm(s,e)}
                .schema=${n}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${e=>{e.stopPropagation(),this._setCondition(t,i,this._formToCondition(s,e.detail.value))}}
              ></ha-form>
            `:j`
              <div class="hint small">${this._t("cond_yaml_only")}</div>
              <pre>${JSON.stringify(e,null,2)}</pre>
            `}
      </div>
    `}_conditionSchema(t,e){switch(t){case"state":return[{name:"entity",selector:{entity:{}}},{name:"attribute",selector:{attribute:{entity_id:e.entity}}},{type:"grid",name:"",schema:[{name:"operator",selector:{select:{mode:"dropdown",options:[{value:"is",label:this._t("op_is")},{value:"is_not",label:this._t("op_is_not")}]}}},{name:"state",selector:{text:{}}}]}];case"numeric_state":return[{name:"entity",selector:{entity:{}}},{name:"attribute",selector:{attribute:{entity_id:e.entity}}},{type:"grid",name:"",schema:[{name:"above",selector:{number:{mode:"box",step:"any"}}},{name:"below",selector:{number:{mode:"box",step:"any"}}}]}];case"user":{const t=[...this._users||[]];for(const i of Ft(e.users))t.some(t=>t.value===i)||t.push({value:i,label:i});return[{name:"users",selector:{select:{mode:"list",multiple:!0,options:t}}}]}case"screen":return[{name:"media_query",selector:{select:{mode:"dropdown",custom_value:!0,options:Object.entries(Ct).map(([t,e])=>({value:e,label:this._t(`screen_${t}`)}))}}}];case"time":return[{type:"grid",name:"",schema:[{name:"after",selector:{time:{}}},{name:"before",selector:{time:{}}}]},{name:"weekdays",selector:{select:{mode:"list",multiple:!0,options:wt.map(t=>({value:t,label:this._t(t)}))}}}];case"template":return[{name:"value_template",selector:{template:{}}}];default:return}}_conditionToForm(t,e){if("state"===t){const t=void 0===e.state&&void 0!==e.state_not;return{entity:e.entity,attribute:e.attribute,operator:t?"is_not":"is",state:Ft(t?e.state_not:e.state).join(", ")}}return{...e}}_formToCondition(t,e){const i={condition:t};if("state"===t){const t=String(e.state??"").split(",").map(t=>t.trim()).filter(t=>""!==t);return e.entity&&(i.entity=e.entity),e.attribute&&(i.attribute=e.attribute),t.length?i["is_not"===e.operator?"state_not":"state"]=1===t.length?t[0]:t:"is_not"===e.operator?i.state_not="":i.state="",i}for(const[t,s]of Object.entries(e))"condition"===t||Vt(s)||(i[t]=s);return i}_addCondition(t,e){const i={state:{condition:"state",entity:"",state:"on"},numeric_state:{condition:"numeric_state",entity:""},user:{condition:"user",users:this.hass?.user?.id?[this.hass.user.id]:[]},screen:{condition:"screen",media_query:Ct.desktop},time:{condition:"time",after:"08:00:00",before:"20:00:00"},template:{condition:"template",value_template:"{{ true }}"}};this._updateTab(t,t=>({...t,conditions:[...Ft(t.conditions),i[e]||{condition:e}]}))}_setCondition(t,e,i){this._updateTab(t,t=>{const s=[...Ft(t.conditions)];return s[e]=i,{...t,conditions:s}})}_removeCondition(t,e){this._updateTab(t,t=>{const i=[...Ft(t.conditions)];i.splice(e,1);const s={...t,conditions:i};return i.length||(delete s.conditions,delete s.condition_mode),s})}async _loadUsers(){if(!this._usersLoading){this._usersLoading=!0;try{const t=await this.hass.callWS({type:"config/auth/list"});this._users=t.filter(t=>!t.system_generated&&!1!==t.is_active).map(t=>({value:t.id,label:t.name||t.id}))}catch(t){this._users=this.hass?.user?[{value:this.hass.user.id,label:this.hass.user.name}]:[]}}}_selectTab(t){this._selectedTab=t,this._selectedCard=0,this._guiMode=!0,this._guiModeAvailable=!0,this._syncPreview()}_addTab=()=>{const t=[...this._tabs];t.push({name:this._t("new_tab",{n:t.length+1}),icon:"mdi:tab",cards:[]}),this._selectedTab=t.length-1,this._selectedCard=0,this._tabPage="general",this._setTabs(t)};_moveTab(t,e){const i=t+e,s=[...this._tabs];if(i<0||i>=s.length)return;[s[t],s[i]]=[s[i],s[t]];const n={},a=Number(this._config.default_tab)||0;a===t?n.default_tab=i:a===i&&(n.default_tab=t),this._selectedTab=i,this._setTabs(s,this._cleanDefaultTab(n))}_duplicateTab(t){const e=[...this._tabs];e.splice(t+1,0,structuredClone(e[t]));const i={},s=Number(this._config.default_tab)||0;s>t&&(i.default_tab=s+1),this._selectedTab=t+1,this._setTabs(e,i)}_deleteTab(t){const e=this._tabs[t];if(!window.confirm(this._t("delete_tab_confirm",{name:this._tabName(e,t)})))return;const i=[...this._tabs];i.splice(t,1);const s={},n=Number(this._config.default_tab)||0;n===t?s.default_tab=0:n>t&&(s.default_tab=n-1),this._selectedTab=Math.max(0,Math.min(t,i.length-1)),this._selectedCard=0,this._setTabs(i,this._cleanDefaultTab(s))}_cleanDefaultTab(t){if(0===t.default_tab){const e={...this._config};delete e.default_tab,this._config=e,delete t.default_tab}return t}_select(t,e){return{name:t,selector:{select:{mode:"dropdown",options:e.map(([t,e])=>({value:t,label:this._t(e)}))}}}}_renderAppearancePage(){const t=[{type:"grid",name:"",schema:[this._select("tab_position",[["top","pos_top"],["bottom","pos_bottom"],["left","pos_left"],["right","pos_right"]]),this._select("tab_style",[["underline","style_underline"],["pills","style_pills"],["buttons","style_buttons"],["segmented","style_segmented"]])]},{type:"grid",name:"",schema:[this._select("tab_alignment",[["start","align_start"],["center","align_center"],["end","align_end"],["stretch","align_stretch"]]),this._select("tab_content",[["icon_name","content_icon_name"],["icon","content_icon"],["name","content_name"]])]},{type:"grid",name:"",schema:[this._select("icon_position",[["start","icon_start"],["top","icon_top"]]),this._select("animation",[["none","anim_none"],["fade","anim_fade"],["slide","anim_slide"]])]},{name:"card_gap",selector:{number:{min:0,max:48,mode:"slider",unit_of_measurement:"px"}}},{name:"card_background",selector:{boolean:{}}},{name:"inner_cards_background",selector:{boolean:{}}},{name:"hide_single_tab",selector:{boolean:{}}}],e=Gt(t);return j`
      <ha-form
        .hass=${this.hass}
        .data=${{...vt,...this._config}}
        .schema=${t}
        .computeLabel=${this._computeLabel}
        @value-changed=${t=>{t.stopPropagation(),this._commit(Xt(this._config,t.detail.value,e,vt))}}
      ></ha-form>
      <h3>${this._t("global_colors")}</h3>
      ${Kt.map(t=>this._renderColorField(t,this._config[t],e=>this._commit(Xt(this._config,{[t]:e},[t]))))}
      <div class="hint small">${this._t("color_helper")}</div>
    `}_renderBehaviorPage(){const t=this._tabs.map((t,e)=>({value:String(e),label:this._tabName(t,e)})),e=[...t.length?[{name:"default_tab",selector:{select:{mode:"dropdown",options:t}}}]:[],{name:"remember_tab",selector:{boolean:{}}},{name:"swipe",selector:{boolean:{}}},{name:"return_to_default",selector:{number:{min:0,max:86400,mode:"box",unit_of_measurement:"s"}}}],i=Gt(e),s={...$t,...this._config.auto_cycle||{}},n=[{name:"enabled",selector:{boolean:{}}}];s.enabled&&n.push({type:"grid",name:"",schema:[{name:"interval",selector:{number:{min:1,max:86400,mode:"box",unit_of_measurement:"s"}}},{name:"pause_on_interaction",selector:{number:{min:0,max:86400,mode:"box",unit_of_measurement:"s"}}}]},{name:"pause_on_hover",selector:{boolean:{}}},{name:"show_progress",selector:{boolean:{}}});const a=Gt(n),o={...vt,...this._config};return o.default_tab=String(Number(o.default_tab)||0),j`
      <ha-form
        .hass=${this.hass}
        .data=${o}
        .schema=${e}
        .computeLabel=${this._computeLabel}
        @value-changed=${t=>{t.stopPropagation();const e={...t.detail.value};void 0!==e.default_tab&&(e.default_tab=Number(e.default_tab)||0),this._commit(Xt(this._config,e,i,vt))}}
      ></ha-form>
      <h3>${this._t("auto_cycle")}</h3>
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${n}
        .computeLabel=${t=>this._t("enabled"===t.name?"auto_cycle_enabled":t.name)}
        @value-changed=${t=>{t.stopPropagation();const e=Xt(this._config.auto_cycle||{},t.detail.value,a,$t),i={...this._config,auto_cycle:e};Object.keys(e).length||delete i.auto_cycle,this._commit(i)}}
      ></ha-form>
      <div class="hint small">${this._t("auto_cycle_helper")}</div>
    `}static styles=a`
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
  `}customElements.get(ft)||customElements.define(ft,Zt);class Jt extends ot{static properties={_config:{state:!0},_active:{state:!0}};static styles=Bt;static getConfigElement(){return document.createElement(ft)}static getStubConfig(t){return{tabs:[{name:Dt(t,"card.stub_tab_1"),icon:"mdi:home",cards:[{type:"markdown",content:Dt(t,"card.stub_text_1")}]},{name:Dt(t,"card.stub_tab_2"),icon:"mdi:star",cards:[{type:"markdown",content:Dt(t,"card.stub_text_2")}]}]}}constructor(){super(),this._sections=new Map,this._templates=new Map,this._templateSubs=new Map,this._watchers=[],this._visibility=[],this._shown=[],this._editMode=!1,this._preview=!1,this._buildToken=0,this._cycleKey=0,this._cycleActive=!1,this._cyclePaused=!1,this._pausedUntil=0,this._hovering=!1,this._onEditorSelect=()=>this._applyEditorSelection()}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration");if(void 0!==t.tabs&&!Array.isArray(t.tabs))throw new Error("'tabs' must be a list");const e=(t.tabs||[]).map(t=>t&&"object"==typeof t?t:{});this._config={...vt,...t,auto_cycle:{...$t,...t.auto_cycle||{}},tabs:e},this._tabsKey=JSON.stringify(t.tabs||[]),this._resetSections(),(void 0===this._active||this._active>=e.length)&&(this._active=this._initialTab()),this._applyEditorSelection(),this.isConnected&&(this._setupWatchers(),this._updateTemplateSubscriptions(),this._scheduleCycle())}set hass(t){const e=!this._hass;this._hass=t;for(const e of this._sections.values())for(const i of e.cards)i.hass=t;e&&this._updateTemplateSubscriptions(),this.requestUpdate()}get hass(){return this._hass}set editMode(t){this._setEditing("_editMode",t)}get editMode(){return this._editMode}set preview(t){this._setEditing("_preview",t)}get preview(){return this._preview}async getCardSize(){if(!this._config)return 1;const t=this._active??0,e=this._sections.get(t),i=this._config.tabs[t],s=Math.max(1,Number(i?.columns)||1);let n=0;if(e&&e.cards.length){n=(await Promise.all(e.cards.map(t=>"function"==typeof t.getCardSize?t.getCardSize():1))).reduce((t,e)=>t+(Number(e)||1),0)}else n=2*(i?.cards?.length||0);return 1+Math.ceil(n/s)}getGridOptions(){return{columns:12,min_columns:3}}connectedCallback(){super.connectedCallback(),window.addEventListener(yt,this._onEditorSelect),this._config&&(this._setupWatchers(),this._updateTemplateSubscriptions(),this._applyEditorSelection(),this._scheduleCycle())}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(yt,this._onEditorSelect),this._clearWatchers(),this._unsubscribeTemplates(),clearTimeout(this._cycleTimer),clearTimeout(this._returnTimer),this._cycleTimer=void 0,this._cycleActive=!1}willUpdate(){if(!this._config)return;const t=this._config.tabs,e={hass:this._hass,templates:this._templates};if(this._visibility=t.map(t=>!this._hass||function(t,e){const i=St(t?.conditions);return!i.length||("any"===t.condition_mode?i.some(t=>Nt(t,e)):i.every(t=>Nt(t,e)))}(t,e)),this._shown=t.map((t,e)=>e).filter(t=>this._isEditing||this._visibility[t]),!this._shown.includes(this._active)){const t=this._initialTab();this._active=this._shown.includes(t)?t:this._shown[0]}const i=!this._isEditing&&t.length>0&&0===this._shown.length;i!==Boolean(this._hostHidden)&&(this._hostHidden=i,this.toggleAttribute("hidden",i),Lt(this,"card-visibility-changed",{value:!i})),this.toggleAttribute("editing",this._isEditing)}updated(){this._syncContent(),!this._config||this._active===this._cycleForTab&&this._canCycle()===this._cycleForState||this._scheduleCycle()}render(){const t=this._config;if(!t)return q;const e=["top","bottom","left","right"].includes(t.tab_position)?t.tab_position:"top",i="left"===e||"right"===e,s=t.hide_single_tab&&!this._isEditing&&this._shown.length<=1;return t.tabs.length?j`
      <ha-card
        class=${ht({"no-bg":!1===t.card_background,"flat-inner":!1===t.inner_cards_background,[`bar-${e}`]:!0})}
        style=${pt({"--hct-gap":`${Number(t.card_gap)>=0?Number(t.card_gap):8}px`})}
        @pointerdown=${this._onPointerDown}
        @pointerenter=${this._onPointerEnter}
        @pointerleave=${this._onPointerLeave}
        @touchstart=${{handleEvent:t=>this._onTouchStart(t),passive:!0}}
        @touchend=${{handleEvent:t=>this._onTouchEnd(t),passive:!0}}
      >
        <div class="root pos-${e}">
          ${s?q:j`
                <div
                  class=${ht({tabbar:!0,vertical:i,[`style-${t.tab_style||"underline"}`]:!0,[`align-${t.tab_alignment||"start"}`]:!0})}
                  role="tablist"
                  aria-orientation=${i?"vertical":"horizontal"}
                  @keydown=${this._onKeyDown}
                >
                  ${this._shown.map(t=>this._renderTab(t))}
                </div>
              `}
          <div class="body">
            ${this._renderProgress()}
            <div class="content" role="tabpanel"></div>
          </div>
        </div>
      </ha-card>
    `:j`<ha-card><div class="empty">${Dt(this._hass,"card.no_tabs")}</div></ha-card>`}_renderTab(t){const e=this._config,i=e.tabs[t]||{},s=t===this._active,n=!this._visibility[t],a=i.name||Dt(this._hass,"editor.new_tab",{n:t+1}),o=Boolean(i.icon)&&"name"!==e.tab_content,r="icon"!==e.tab_content||!i.icon,c=this._badgeText(i),l=n?`${a} – ${Dt(this._hass,"card.hidden_tab")}`:a;return j`
      <button
        class=${ht({tab:!0,active:s,"cond-hidden":n,"icon-top":"top"===e.icon_position&&o&&r})}
        role="tab"
        type="button"
        aria-selected=${s?"true":"false"}
        aria-label=${a}
        tabindex=${s?"0":"-1"}
        title=${l}
        data-index=${t}
        style=${pt(this._tabVars(i))}
        @click=${()=>this._onTabClick(t)}
      >
        ${o?j`<ha-icon .icon=${i.icon}></ha-icon>`:q}
        ${r?j`<span class="label">${a}</span>`:q}
        ${void 0!==c?j`<span class="badge">${c}</span>`:q}
        ${n?j`<ha-icon class="cond-icon" icon="mdi:eye-off"></ha-icon>`:q}
      </button>
    `}_renderProgress(){const t=this._config.auto_cycle;if(!this._cycleActive||!t.show_progress)return q;const e=Ht((this._config.tabs[this._active]||{}).color)??Ht(this._config.color);return mt(this._cycleKey,j`<div class="progress">
        <div
          class=${ht({bar:!0,paused:this._cyclePaused})}
          style=${pt({animationDuration:`${this._cycleDuration}ms`,...e?{"--hct-color":e}:{}})}
        ></div>
      </div>`)}_tabVars(t){const e=this._config,i=i=>Ht(t[i])??Ht(e[i]),s={},n={color:"--hct-color",text_color:"--hct-text",active_text_color:"--hct-active-text",background_color:"--hct-bg"};for(const[t,e]of Object.entries(n)){const n=i(t);n&&(s[e]=n)}return s}_badgeText(t){if(!t.badge_entity||!this._hass)return;const e=this._hass.states[t.badge_entity];if(!e||["unavailable","unknown"].includes(e.state))return;if("function"==typeof this._hass.formatEntityState)return this._hass.formatEntityState(e);const i=e.attributes?.unit_of_measurement;return i?`${e.state} ${i}`:e.state}get _isEditing(){return this._editMode||this._preview}_setEditing(t,e){const i=Boolean(e);if(this[t]!==i){this[t]=i;for(const t of this._sections.values())for(const e of t.cards)this._applyCardMode(e);this._applyEditorSelection(),this.requestUpdate()}}_applyCardMode(t){const e=this._isEditing;"HUI-CARD"===t.tagName||(t.editMode=e),t.preview=e}_resetSections(){this._buildToken+=1,this._sections.clear(),this._displayedIndex=void 0;const t=this.renderRoot?.querySelector?.(".content");t&&t.replaceChildren()}_getSection(t){let e=this._sections.get(t);if(e)return e;const i=this._config.tabs[t]||{},s=document.createElement("div");return s.className="section",s.dataset.empty=Dt(this._hass,"editor.no_cards"),s.style.setProperty("--hct-columns",String(Math.max(1,Number(i.columns)||1))),s.addEventListener("card-visibility-changed",t=>t.stopPropagation()),e={section:s,cards:[]},this._sections.set(t,e),this._buildSection(i,e,this._buildToken),e}async _buildSection(t,e,i){const s=Array.isArray(t.cards)?t.cards:[];if(!s.length)return;const n=Boolean(customElements.get("hui-card"))?void 0:await It();if(i===this._buildToken)for(const t of s){const i=this._createCard(t,n,e);e.cards.push(i),e.section.append(i)}}_createCard(t,e,i){let s;if(customElements.get("hui-card"))s=document.createElement("hui-card"),s.hass=this._hass,s.preview=this._isEditing,s.config=t,"function"==typeof s.load&&s.load();else{if(!e)return s=document.createElement("div"),s.textContent="Home Assistant card helpers are not available.",s;s=e.createCardElement(t),s.hass=this._hass,this._isEditing&&this._applyCardMode(s)}return s.addEventListener("ll-rebuild",n=>{n.stopPropagation();const a=this._createCard(t,e,i),o=i.cards.indexOf(s);o>=0&&(i.cards[o]=a),s.replaceWith(a)},{once:!0}),s}_syncContent(){const t=this.renderRoot.querySelector(".content");if(!t||!this._config)return;const e=this._shown.includes(this._active)?this._active:void 0,i=void 0===e?void 0:this._getSection(e).section;if(i&&t.firstElementChild===i&&1===t.childElementCount)return;if(!i&&0===t.childElementCount)return;const s=this._displayedIndex;i?t.replaceChildren(i):t.replaceChildren(),this._displayedIndex=e,i&&void 0!==s&&s!==e&&this._animate(i,s,e)}_animate(t,e,i){const s=this._config.animation;if(t.classList.remove("anim-fade","anim-slide-next","anim-slide-prev"),s&&"none"!==s)if(t.offsetWidth,"slide"===s){const s=this._shown.indexOf(i)>=this._shown.indexOf(e);t.classList.add(s?"anim-slide-next":"anim-slide-prev")}else t.classList.add("anim-fade")}get _storageKey(){const t=this._config.storage_key||function(t){let e=0;for(let i=0;i<t.length;i+=1)e=31*e+t.charCodeAt(i)|0;return(e>>>0).toString(36)}(`${window.location.pathname}|${this._config.tabs.map(t=>t.name||"").join("|")}`);return`hacard-tabs:${t}`}_defaultIndex(){const t=this._config.tabs.length,e=Number(this._config.default_tab)||0;return Math.min(Math.max(0,e),Math.max(0,t-1))}_initialTab(){if(this._config.remember_tab)try{const t=Number(window.localStorage.getItem(this._storageKey));if(Number.isInteger(t)&&t>=0&&t<this._config.tabs.length)return t}catch(t){}return this._defaultIndex()}_setActive(t,e){if(void 0!==t&&t!==this._active&&(this._active=t,this._config.remember_tab&&"cycle"!==e))try{window.localStorage.setItem(this._storageKey,String(t))}catch(t){}}_onTabClick(t){this._setActive(t,"user"),this._onInteraction(!0)}_step(t,{wrap:e=!0,onlyVisible:i=!1}={}){const s=i?this._shown.filter(t=>this._visibility[t]):this._shown;if(s.length<2)return;let n=s.indexOf(this._active)+t;if(n<0||n>=s.length){if(!e)return;n=(n+s.length)%s.length}return s[n]}_onKeyDown(t){const e={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};let i;if(t.key in e)i=this._step(e[t.key]);else if("Home"===t.key)i=this._shown[0];else{if("End"!==t.key)return;i=this._shown[this._shown.length-1]}t.preventDefault(),void 0!==i&&(this._setActive(i,"user"),this._onInteraction(!0),this.updateComplete.then(()=>{this.renderRoot.querySelector(`.tab[data-index="${i}"]`)?.focus()}))}_applyEditorSelection(){const t=window.__hacardTabsEditorSelection;if(!t||!this._config||t.key!==this._tabsKey)return;const e=Number(t.index);Number.isInteger(e)&&e>=0&&e<this._config.tabs.length&&(this._active=e)}_onPointerDown(){this._onInteraction(!1)}_onInteraction(t){if(!this._config)return;const e=this._config.auto_cycle,i=Number(e.pause_on_interaction)||0;e.enabled&&i>0?(this._pausedUntil=Date.now()+1e3*i,this._scheduleCycle()):t&&this._scheduleCycle(),this._armReturnTimer()}_armReturnTimer(){clearTimeout(this._returnTimer);const t=Number(this._config.return_to_default)||0;t<=0||this._isEditing||(this._returnTimer=setTimeout(()=>{const t=this._defaultIndex();this._visibility[t]&&this._setActive(t,"return")},1e3*t))}_onTouchStart(t){if(this._touch=void 0,!1===this._config?.swipe||1!==t.touches.length)return;if(t.composedPath().some(t=>t instanceof Element&&"function"==typeof t.matches&&t.matches("input, textarea, select, [role='slider'], ha-slider, ha-control-slider, ha-control-circular-slider, ha-control-select, ha-map, ha-chart-base, ha-more-info-control-select-container, .tabbar")))return;const e=t.touches[0];this._touch={x:e.clientX,y:e.clientY,time:Date.now()}}_onTouchEnd(t){const e=this._touch;if(this._touch=void 0,!e||!t.changedTouches.length)return;const i=t.changedTouches[0],s=i.clientX-e.x,n=i.clientY-e.y;if(Math.abs(s)<50||Math.abs(s)<1.5*Math.abs(n)||Date.now()-e.time>800)return;const a=this._step(s<0?1:-1,{wrap:!1});void 0!==a&&(this._setActive(a,"user"),this._onInteraction(!0))}_onPointerEnter(t){"mouse"===t.pointerType&&(this._hovering=!0,this._cycleActive&&!this._cyclePaused&&this._config.auto_cycle.pause_on_hover&&(clearTimeout(this._cycleTimer),this._cycleTimer=void 0,this._cycleRemaining=Math.max(0,this._cycleRemaining-(Date.now()-this._cycleStartedAt)),this._cyclePaused=!0,this.requestUpdate()))}_onPointerLeave(t){"mouse"===t.pointerType&&(this._hovering=!1,this._cycleActive&&this._cyclePaused&&(this._cyclePaused=!1,this._startCycleTimer(),this.requestUpdate()))}_cycleOrder(){return this._shown.filter(t=>this._visibility[t])}_canCycle(){const t=this._config?.auto_cycle;if(!t?.enabled||!this.isConnected||this._isEditing)return!1;const e=this._cycleOrder();return e.length>=2&&e.some(t=>!this._config.tabs[t]?.skip_cycle)}_nextCycleTab(){const t=this._cycleOrder(),e=Math.max(0,t.indexOf(this._active));for(let i=1;i<=t.length;i+=1){const s=t[(e+i)%t.length];if(!this._config.tabs[s]?.skip_cycle)return s}}_scheduleCycle(){clearTimeout(this._cycleTimer),this._cycleTimer=void 0;const t=this._canCycle();if(this._cycleForTab=this._active,this._cycleForState=t,!t)return void(this._cycleActive&&(this._cycleActive=!1,this.requestUpdate()));const e=Date.now();if(this._pausedUntil>e)return this._cycleActive=!1,this._cycleTimer=setTimeout(()=>this._scheduleCycle(),this._pausedUntil-e),void this.requestUpdate();const i=this._config.tabs[this._active]||{},s=Number(i.cycle_duration)>0?Number(i.cycle_duration):Number(this._config.auto_cycle.interval)||10;this._cycleDuration=1e3*Math.max(1,s),this._cycleRemaining=this._cycleDuration,this._cycleKey+=1,this._cycleActive=!0,this._cyclePaused=this._hovering&&this._config.auto_cycle.pause_on_hover,this._cyclePaused||this._startCycleTimer(),this.requestUpdate()}_startCycleTimer(){clearTimeout(this._cycleTimer),this._cycleStartedAt=Date.now(),this._cycleTimer=setTimeout(()=>{this._cycleTimer=void 0;const t=this._nextCycleTab();void 0!==t&&t!==this._active&&this._setActive(t,"cycle"),this._scheduleCycle()},this._cycleRemaining)}_setupWatchers(){this._clearWatchers();const t=Ut(this._config.tabs),e=new Set(t.filter(t=>"screen"===kt(t)&&t.media_query).map(t=>t.media_query));for(const t of e)try{const e=window.matchMedia(t),i=()=>this.requestUpdate();e.addEventListener("change",i),this._watchers.push(()=>e.removeEventListener("change",i))}catch(t){}if(t.some(t=>"time"===kt(t))){const t=setInterval(()=>this.requestUpdate(),15e3);this._watchers.push(()=>clearInterval(t))}}_clearWatchers(){for(const t of this._watchers)t();this._watchers=[]}_updateTemplateSubscriptions(){if(!this._hass?.connection||!this.isConnected||!this._config)return;const t=new Set(Ut(this._config.tabs).filter(t=>"template"===kt(t)&&t.value_template).map(t=>String(t.value_template)));for(const[e,i]of this._templateSubs)t.has(e)||(this._templateSubs.delete(e),this._templates.delete(e),i.then(t=>t?.()).catch(()=>{}));for(const e of t){if(this._templateSubs.has(e))continue;const t=this._hass.connection.subscribeMessage(t=>{this._templates.set(e,!(!t||!("result"in t))&&t.result),this.requestUpdate()},{type:"render_template",template:e,variables:{user:this._hass.user?.name}}).catch(t=>{console.warn("hacard-tabs: template error",t),this._templates.set(e,!1),this.requestUpdate()});this._templateSubs.set(e,t)}}_unsubscribeTemplates(){for(const t of this._templateSubs.values())t.then(t=>t?.()).catch(()=>{});this._templateSubs.clear()}}customElements.get(gt)||customElements.define(gt,Jt),window.customCards=window.customCards||[],window.customCards.some(t=>t.type===gt)||window.customCards.push({type:gt,name:"Card Tabs",description:Dt(void 0,"card.description"),preview:!0,documentationURL:"https://github.com/Ga-Re/HACardTabs"}),console.info("%c CARD-TABS %c v1.0.0 ","color: white; background: #03a9f4; font-weight: 700;","color: #03a9f4; background: white; font-weight: 700;");export{Jt as HACardTabs};
