function t(t,e,i,s,n,o){function a(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var r,c=s.kind,l="getter"===c?"get":"setter"===c?"set":"value",d=!e&&t?s.static?t:t.prototype:null,h=e||(d?Object.getOwnPropertyDescriptor(d,s.name):{}),u=!1,p=i.length-1;p>=0;p--){var g={};for(var f in s)g[f]="access"===f?{}:s[f];for(var f in s.access)g.access[f]=s.access[f];g.addInitializer=function(t){if(u)throw new TypeError("Cannot add initializers after decoration has completed");o.push(a(t||null))};var m=(0,i[p])("accessor"===c?{get:h.get,set:h.set}:h[l],g);if("accessor"===c){if(void 0===m)continue;if(null===m||"object"!=typeof m)throw new TypeError("Object expected");(r=a(m.get))&&(h.get=r),(r=a(m.set))&&(h.set=r),(r=a(m.init))&&n.unshift(r)}else(r=a(m))&&("field"===c?n.unshift(r):h[l]=r)}d&&Object.defineProperty(d,s.name,h),u=!0}function e(t,e,i){for(var s=arguments.length>2,n=0;n<e.length;n++)i=s?e[n].call(t,i):e[n].call(t);return s?i:void 0}function i(...t){const e=t=>t&&"object"==typeof t;return t.reduce(((t,s)=>(Object.keys(s).forEach((n=>{const o=t[n],a=s[n];Array.isArray(o)&&Array.isArray(a)?t[n]=o.concat(...a):e(o)&&e(a)?t[n]=i(o,a):t[n]=a})),t)),{})}function s(t,e){if("number"==typeof e)return e;if(void 0===t)return 0;if("string"==typeof e){const t=parseFloat(e);if(!isNaN(t))return t}if(t.states[e]){const i=parseFloat(t.states[e].state);return isNaN(i)?0:i}return 0}function n(t,e,i){if(e.has("config")||i)return!0;for(const i of t._configArray)if(i.entity){const s=e.get("hass");if(s){if(s.states[i.entity]!==t.hass.states[i.entity])return!0;continue}return!0}return!1}function o(t,e,i){const s=t[e],n=t.slice();return n.splice(e,1),n.splice(i,0,s),n}var a,r;function c(t){return t.substr(0,t.indexOf("."))}"function"==typeof SuppressedError&&SuppressedError,function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(a||(a={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(r||(r={}));var l=["closed","locked","off"],d=function(t,e,i,s){s=s||{},i=null==i?{}:i;var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n},h={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function u(t,e){if(t in h)return h[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell"}case"binary_sensor":return e&&"off"===e?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===e?"mdi:window-closed":"mdi:window-open";case"lock":return e&&"unlocked"===e?"mdi:lock-open":"mdi:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"mdi:cast-connected":"mdi:cast";case"zwave":switch(e){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),"mdi:bookmark"}}var p=function(t){d(window,"haptic",t)},g=function(t,e){return function(t,e,i){void 0===i&&(i=!0);var s,n=c(e),o="group"===n?"homeassistant":n;switch(n){case"lock":s=i?"unlock":"lock";break;case"cover":s=i?"open_cover":"close_cover";break;default:s=i?"turn_on":"turn_off"}return t.callService(o,s,{entity_id:e})}(t,e,l.includes(t.states[e].state))},f=function(t,e,i,s){if(s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||(p("warning"),confirm(s.confirmation.text||"Are you sure you want to "+s.action+"?")))switch(s.action){case"more-info":(i.entity||i.camera_image)&&d(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":s.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),d(window,"location-changed",{replace:i})}(0,s.navigation_path);break;case"url":s.url_path&&window.open(s.url_path);break;case"toggle":i.entity&&(g(e,i.entity),p("success"));break;case"call-service":if(!s.service)return void p("failure");var n=s.service.split(".",2);e.callService(n[0],n[1],s.service_data,s.target),p("success");break;case"fire-dom-event":d(t,"ll-custom",s)}};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const m=globalThis,_=m.ShadowRoot&&(void 0===m.ShadyCSS||m.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,v=Symbol(),b=new WeakMap;let $=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==v)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(_&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=b.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&b.set(e,t))}return t}toString(){return this.cssText}};const y=_?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new $("string"==typeof t?t:t+"",void 0,v))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:A,defineProperty:w,getOwnPropertyDescriptor:x,getOwnPropertyNames:E,getOwnPropertySymbols:S,getPrototypeOf:k}=Object,C=globalThis,O=C.trustedTypes,T=O?O.emptyScript:"",P=C.reactiveElementPolyfillSupport,N=(t,e)=>t,M={toAttribute(t,e){switch(e){case Boolean:t=t?T:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},U=(t,e)=>!A(t,e),j={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:U};Symbol.metadata??=Symbol("metadata"),C.litPropertyMetadata??=new WeakMap;let R=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=j){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&w(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=x(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??j}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;const t=k(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){const t=this.properties,e=[...E(t),...S(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(y(t))}else void 0!==t&&e.push(y(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(_)t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of e){const e=document.createElement("style"),s=m.litNonce;void 0!==s&&e.setAttribute("nonce",s),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:M).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:M;this._$Em=s,this[s]=n.fromAttribute(e,t.type)??this._$Ej?.get(s)??null,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??U)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};R.elementStyles=[],R.shadowRootOptions={mode:"open"},R[N("elementProperties")]=new Map,R[N("finalized")]=new Map,P?.({ReactiveElement:R}),(C.reactiveElementVersions??=[]).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H=globalThis,I=H.trustedTypes,D=I?I.createPolicy("lit-html",{createHTML:t=>t}):void 0,z="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+V,B=`<${L}>`,q=document,W=()=>q.createComment(""),F=t=>null===t||"object"!=typeof t&&"function"!=typeof t,Y=Array.isArray,J="[ \t\n\f\r]",K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Z=/-->/g,X=/>/g,G=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),Q=/'/g,tt=/"/g,et=/^(?:script|style|textarea|title)$/i,it=Symbol.for("lit-noChange"),st=Symbol.for("lit-nothing"),nt=new WeakMap,ot=q.createTreeWalker(q,129);function at(t,e){if(!Y(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==D?D.createHTML(e):e}let rt=class t{constructor({strings:e,_$litType$:i},s){let n;this.parts=[];let o=0,a=0;const r=e.length-1,c=this.parts,[l,d]=((t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",a=K;for(let e=0;e<i;e++){const i=t[e];let r,c,l=-1,d=0;for(;d<i.length&&(a.lastIndex=d,c=a.exec(i),null!==c);)d=a.lastIndex,a===K?"!--"===c[1]?a=Z:void 0!==c[1]?a=X:void 0!==c[2]?(et.test(c[2])&&(n=RegExp("</"+c[2],"g")),a=G):void 0!==c[3]&&(a=G):a===G?">"===c[0]?(a=n??K,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,r=c[1],a=void 0===c[3]?G:'"'===c[3]?tt:Q):a===tt||a===Q?a=G:a===Z||a===X?a=K:(a=G,n=void 0);const h=a===G&&t[e+1].startsWith("/>")?" ":"";o+=a===K?i+B:l>=0?(s.push(r),i.slice(0,l)+z+i.slice(l)+V+h):i+V+(-2===l?e:h)}return[at(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]})(e,i);if(this.el=t.createElement(l,s),ot.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=ot.nextNode())&&c.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(z)){const e=d[a++],i=n.getAttribute(t).split(V),s=/([.?@])?(.*)/.exec(e);c.push({type:1,index:o,name:s[2],strings:i,ctor:"."===s[1]?ut:"?"===s[1]?pt:"@"===s[1]?gt:ht}),n.removeAttribute(t)}else t.startsWith(V)&&(c.push({type:6,index:o}),n.removeAttribute(t));if(et.test(n.tagName)){const t=n.textContent.split(V),e=t.length-1;if(e>0){n.textContent=I?I.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],W()),ot.nextNode(),c.push({type:2,index:++o});n.append(t[e],W())}}}else if(8===n.nodeType)if(n.data===L)c.push({type:2,index:o});else{let t=-1;for(;-1!==(t=n.data.indexOf(V,t+1));)c.push({type:7,index:o}),t+=V.length-1}o++}}static createElement(t,e){const i=q.createElement("template");return i.innerHTML=t,i}};function ct(t,e,i=t,s){if(e===it)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=F(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=ct(t,n._$AS(t,e.values),n,s)),e}let lt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??q).importNode(e,!0);ot.currentNode=s;let n=ot.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new dt(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new ft(n,this,t)),this._$AV.push(e),r=i[++a]}o!==r?.index&&(n=ot.nextNode(),o++)}return ot.currentNode=q,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},dt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=st,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ct(this,t,e),F(t)?t===st||null==t||""===t?(this._$AH!==st&&this._$AR(),this._$AH=st):t!==this._$AH&&t!==it&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>Y(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==st&&F(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=rt.createElement(at(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new lt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=nt.get(t.strings);return void 0===e&&nt.set(t.strings,e=new rt(t)),e}k(e){Y(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,n=0;for(const o of e)n===i.length?i.push(s=new t(this.O(W()),this.O(W()),this,this.options)):s=i[n],s._$AI(o),n++;n<i.length&&(this._$AR(s&&s._$AB.nextSibling,n),i.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}},ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=st,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=st}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=ct(this,t,e,0),o=!F(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=ct(this,s[i+a],e,a),r===it&&(r=this._$AH[a]),o||=!F(r)||r!==this._$AH[a],r===st?t=st:t!==st&&(t+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!s&&this.j(t)}j(t){t===st?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ut=class extends ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===st?void 0:t}},pt=class extends ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==st)}},gt=class extends ht{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=ct(this,t,e,0)??st)===it)return;const i=this._$AH,s=t===st&&i!==st||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==st&&(i===st||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ft=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){ct(this,t)}};const mt=H.litHtmlPolyfillSupport;mt?.(rt,dt),(H.litHtmlVersions??=[]).push("3.3.0");
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t=globalThis,vt=_t.ShadowRoot&&(void 0===_t.ShadyCSS||_t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,bt=Symbol(),$t=new WeakMap;let yt=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==bt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(vt&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=$t.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&$t.set(e,t))}return t}toString(){return this.cssText}};const At=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new yt(i,t,bt)},wt=vt?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new yt("string"==typeof t?t:t+"",void 0,bt))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:xt,defineProperty:Et,getOwnPropertyDescriptor:St,getOwnPropertyNames:kt,getOwnPropertySymbols:Ct,getPrototypeOf:Ot}=Object,Tt=globalThis,Pt=Tt.trustedTypes,Nt=Pt?Pt.emptyScript:"",Mt=Tt.reactiveElementPolyfillSupport,Ut=(t,e)=>t,jt={toAttribute(t,e){switch(e){case Boolean:t=t?Nt:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},Rt=(t,e)=>!xt(t,e),Ht={attribute:!0,type:String,converter:jt,reflect:!1,useDefault:!1,hasChanged:Rt};Symbol.metadata??=Symbol("metadata"),Tt.litPropertyMetadata??=new WeakMap;let It=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Et(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=St(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ht}static _$Ei(){if(this.hasOwnProperty(Ut("elementProperties")))return;const t=Ot(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ut("properties"))){const t=this.properties,e=[...kt(t),...Ct(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(wt(t))}else void 0!==t&&e.push(wt(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(vt)t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of e){const e=document.createElement("style"),s=_t.litNonce;void 0!==s&&e.setAttribute("nonce",s),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:jt).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:jt;this._$Em=s,this[s]=n.fromAttribute(e,t.type)??this._$Ej?.get(s)??null,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??Rt)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};It.elementStyles=[],It.shadowRootOptions={mode:"open"},It[Ut("elementProperties")]=new Map,It[Ut("finalized")]=new Map,Mt?.({ReactiveElement:It}),(Tt.reactiveElementVersions??=[]).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt=globalThis,zt=Dt.trustedTypes,Vt=zt?zt.createPolicy("lit-html",{createHTML:t=>t}):void 0,Lt="$lit$",Bt=`lit$${Math.random().toFixed(9).slice(2)}$`,qt="?"+Bt,Wt=`<${qt}>`,Ft=document,Yt=()=>Ft.createComment(""),Jt=t=>null===t||"object"!=typeof t&&"function"!=typeof t,Kt=Array.isArray,Zt="[ \t\n\f\r]",Xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Gt=/-->/g,Qt=/>/g,te=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),ee=/'/g,ie=/"/g,se=/^(?:script|style|textarea|title)$/i,ne=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),oe=Symbol.for("lit-noChange"),ae=Symbol.for("lit-nothing"),re=new WeakMap,ce=Ft.createTreeWalker(Ft,129);function le(t,e){if(!Kt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==Vt?Vt.createHTML(e):e}const de=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",a=Xt;for(let e=0;e<i;e++){const i=t[e];let r,c,l=-1,d=0;for(;d<i.length&&(a.lastIndex=d,c=a.exec(i),null!==c);)d=a.lastIndex,a===Xt?"!--"===c[1]?a=Gt:void 0!==c[1]?a=Qt:void 0!==c[2]?(se.test(c[2])&&(n=RegExp("</"+c[2],"g")),a=te):void 0!==c[3]&&(a=te):a===te?">"===c[0]?(a=n??Xt,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,r=c[1],a=void 0===c[3]?te:'"'===c[3]?ie:ee):a===ie||a===ee?a=te:a===Gt||a===Qt?a=Xt:(a=te,n=void 0);const h=a===te&&t[e+1].startsWith("/>")?" ":"";o+=a===Xt?i+Wt:l>=0?(s.push(r),i.slice(0,l)+Lt+i.slice(l)+Bt+h):i+Bt+(-2===l?e:h)}return[le(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class he{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[c,l]=de(t,e);if(this.el=he.createElement(c,i),ce.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=ce.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(Lt)){const e=l[o++],i=s.getAttribute(t).split(Bt),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?me:"?"===a[1]?_e:"@"===a[1]?ve:fe}),s.removeAttribute(t)}else t.startsWith(Bt)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(se.test(s.tagName)){const t=s.textContent.split(Bt),e=t.length-1;if(e>0){s.textContent=zt?zt.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],Yt()),ce.nextNode(),r.push({type:2,index:++n});s.append(t[e],Yt())}}}else if(8===s.nodeType)if(s.data===qt)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(Bt,t+1));)r.push({type:7,index:n}),t+=Bt.length-1}n++}}static createElement(t,e){const i=Ft.createElement("template");return i.innerHTML=t,i}}function ue(t,e,i=t,s){if(e===oe)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=Jt(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=ue(t,n._$AS(t,e.values),n,s)),e}class pe{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??Ft).importNode(e,!0);ce.currentNode=s;let n=ce.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new ge(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new be(n,this,t)),this._$AV.push(e),r=i[++a]}o!==r?.index&&(n=ce.nextNode(),o++)}return ce.currentNode=Ft,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class ge{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=ae,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ue(this,t,e),Jt(t)?t===ae||null==t||""===t?(this._$AH!==ae&&this._$AR(),this._$AH=ae):t!==this._$AH&&t!==oe&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>Kt(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==ae&&Jt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ft.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=he.createElement(le(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new pe(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=re.get(t.strings);return void 0===e&&re.set(t.strings,e=new he(t)),e}k(t){Kt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new ge(this.O(Yt()),this.O(Yt()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class fe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=ae,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=ae}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=ue(this,t,e,0),o=!Jt(t)||t!==this._$AH&&t!==oe,o&&(this._$AH=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=ue(this,s[i+a],e,a),r===oe&&(r=this._$AH[a]),o||=!Jt(r)||r!==this._$AH[a],r===ae?t=ae:t!==ae&&(t+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!s&&this.j(t)}j(t){t===ae?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class me extends fe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===ae?void 0:t}}class _e extends fe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==ae)}}class ve extends fe{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=ue(this,t,e,0)??ae)===oe)return;const i=this._$AH,s=t===ae&&i!==ae||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==ae&&(i===ae||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class be{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){ue(this,t)}}const $e=Dt.litHtmlPolyfillSupport;$e?.(he,ge),(Dt.litHtmlVersions??=[]).push("3.3.0");const ye=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Ae=class extends It{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new ge(e.insertBefore(Yt(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return oe}};Ae._$litElement$=!0,Ae.finalized=!0,ye.litElementHydrateSupport?.({LitElement:Ae});const we=ye.litElementPolyfillSupport;we?.({LitElement:Ae}),(ye.litElementVersions??=[]).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe=t=>(e,i)=>{void 0!==i?i.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};(()=>{let s,a,r=[xe("bar-card-editor")],c=[],l=Ae;(class extends l{static{a=this}static{const i="function"==typeof Symbol&&Symbol.metadata?Object.create(l[Symbol.metadata]??null):void 0;t(null,s={value:a},r,{kind:"class",name:a.name,metadata:i},null,c),a=s.value,i&&Object.defineProperty(a,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:i}),e(a,c)}hass;_config={animation:void 0,attribute:void 0,color:"",columns:0,complementary:!1,decimal:void 0,direction:"",entities:void 0,entity_row:!1,entity:"",height:"",icon:void 0,limit_value:!1,max:"",min:"",name:"",positions:void 0,severity:void 0,stack:"",target:void 0,title:"",type:"",unit_of_measurement:"",width:""};_toggle;_dragEntityIndex=null;_dragOriginalIndex=null;_dragRowElement=null;_dragStartClientY=0;_dragLastDeltaY=0;_dragRowOriginalRects=[];_bulkAddDeviceClass="";_bulkAddMatches=null;_bulkAddSelected=null;_configArray=[];_entityOptionsArray=[];_options;shouldUpdate(t){return n(this,t,!0)}setConfig(t){this._config=JSON.parse(JSON.stringify(t)),t.entity||t.entities||(this._config.entity="none"),this._config.entity&&!this._config.entities&&(this._configArray.push({entity:t.entity}),this._config.entities=[{entity:t.entity}]),this._configArray=function(t){const e=[];if(t.entities){for(const s of t.entities)if("string"==typeof s){const t=i({},{entity:s});e.push(t)}else if("object"==typeof s){const t=i({},s);e.push(t)}}else e.push(t);return e}(this._config),this._config.animation&&0===Object.entries(this._config.animation).length&&delete this._config.animation,this._config.positions&&0===Object.entries(this._config.positions).length&&delete this._config.positions;for(const t of this._configArray)t.animation&&0===Object.entries(t.animation).length&&delete t.animation,t.positions&&0===Object.entries(t.positions).length&&delete t.positions;this._config.entities=this._configArray;const e={icon:"format-list-numbered",name:"Bar",secondary:"Bar settings.",show:!1},s={icon:"numeric",name:"Value",secondary:"Value settings.",show:!1},n={icon:"card-bulleted",name:"Card",secondary:"Card settings.",show:!1},o={icon:"arrow-expand-horizontal",name:"Positions",secondary:"Set positions of card elements.",show:!1},a={icon:"exclamation-thick",name:"Severity",secondary:"Define bar colors based on value.",show:!1},r={icon:"animation",name:"Animation",secondary:"Define animation settings.",show:!1},c={show:!1,options:{positions:{...o},bar:{...e},value:{...s},severity:{...a},actions:{icon:"gesture-tap",name:"Actions",secondary:"Coming soon... Use code editor for Actions.",show:!1},animation:{...r}}};for(;this._entityOptionsArray.length<this._configArray.length;)this._entityOptionsArray.push({...c});this._options||(this._options={entities:{icon:"tune",name:"Entities",secondary:"Manage card entities.",show:!0,options:{entities:this._entityOptionsArray}},appearance:{icon:"palette",name:"Appearance",secondary:"Customize the global name, icon, etc.",show:!1,options:{positions:o,bar:e,value:s,card:n,severity:a,animation:r}}}),this.requestUpdate()}render(){return this.hass&&this._config&&this._options?ne`
      ${this._createAppearanceElement()} ${this._createEntitiesElement()}
    `:ne``}_createActionsElement(t){const e=this._options?.entities.options.entities[t].options.actions;return ne`
      <div class="sub-category" style="opacity: 0.5;">
        <div>
          <div class="row">
            <ha-icon .icon=${`mdi:${e.icon}`}></ha-icon>
            <div class="title">${e.name}</div>
          </div>
          <div class="secondary">${e.secondary}</div>
        </div>
      </div>
    `}_createEntitiesValues(){if(!this.hass||!this._config)return[ne``];const t=this._options.entities,e=[];for(const i of this._configArray){const s=this._configArray.indexOf(i);e.push(ne`
        <div class="sub-category entity-row" style="display: flex; flex-direction: row; align-items: center;">
          <ha-icon
            class="ha-icon-large drag-handle"
            icon="mdi:drag-horizontal-variant"
            @pointerdown=${this._entityDragStart}
            @pointermove=${this._entityDragMove}
            @pointerup=${this._entityDragEnd}
            @pointercancel=${this._entityDragEnd}
            .index=${s}
          ></ha-icon>
          <div class="value" style="flex-grow: 1;">
            <ha-entity-picker
              allow-custom-entity
              @value-changed=${this._valueChanged}
              .configAttribute=${"entity"}
              .configObject=${this._configArray[s]}
              .hass=${this.hass}
              .value=${i.entity}
            >
            </ha-entity-picker>
          </div>
          <ha-icon
            class="ha-icon-large"
            icon="mdi:close"
            @click=${this._removeEntity}
            .configAttribute=${"entity"}
            .configArray=${"entities"}
            .configIndex=${s}
          ></ha-icon>
          <ha-icon
            class="ha-icon-large"
            icon="mdi:pencil"
            @click=${this._toggleThing}
            .options=${t.options.entities[s]}
            .optionsTarget=${t.options.entities}
            .index=${s}
          ></ha-icon>
        </div>
        ${t.options.entities[s].show?ne`
              <div class="options">
                ${this._createBarElement(s)} ${this._createValueElement(s)}
                ${this._createPositionsElement(s)} ${this._createSeverityElement(s)}
                ${this._createAnimationElement(s)} ${this._createActionsElement(s)}
              </div>
            `:""}
      `)}return e}_createEntitiesElement(){if(!this.hass||!this._config)return ne``;const t=this._options.entities;return ne`
      <div class="card-config">
        <div class="option" @click=${this._toggleThing} .options=${t} .optionsTarget=${this._options}>
          <div class="row">
            <ha-icon .icon=${`mdi:${t.icon}`}></ha-icon>
            <div class="title">${t.name}</div>
            <ha-icon .icon=${t.show?"mdi:chevron-up":"mdi:chevron-down"} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${t.secondary}</div>
        </div>
        ${t.show?ne`
              <div class="card-background" style="max-height: 400px; overflow: auto;">
                <div class="sub-category" style="display: flex; flex-direction: row; align-items: center; flex-wrap: wrap;">
                  <label class="field-label"
                    >Bulk add by device class
                    <select .value=${this._bulkAddDeviceClass} @change=${this._bulkAddDeviceClassChanged}>
                      <option value="">-</option>
                      ${this._getAvailableDeviceClasses().map((t=>ne`<option value=${t}>${t}</option>`))}
                    </select>
                  </label>
                </div>
                ${null!==this._bulkAddMatches?ne`
                      <div class="sub-category">
                        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
                          <div class="secondary">
                            ${0===this._bulkAddMatches.length?"No matching entities found (or all already added).":`${this._bulkAddSelected?.size??0} of ${this._bulkAddMatches.length} selected.`}
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <ha-icon class="ha-icon-large" icon="mdi:close" @click=${this._cancelBulkAdd}></ha-icon>
                            ${this._bulkAddSelected&&this._bulkAddSelected.size>0?ne`<ha-icon class="ha-icon-large" icon="mdi:check-circle" @click=${this._confirmBulkAdd}></ha-icon>`:""}
                          </div>
                        </div>
                        ${this._bulkAddMatches.length>0?ne`
                              <div class="card-background" style="max-height: 200px; overflow: auto;">
                                ${this._bulkAddMatches.map((t=>ne`
                                    <div style="display: flex; flex-direction: row; align-items: center;">
                                      <input
                                        type="checkbox"
                                        .checked=${this._bulkAddSelected.has(t)}
                                        .entityId=${t}
                                        @change=${this._bulkAddToggleSelected}
                                      />
                                      <span>${this.hass.states[t]?.attributes.friendly_name??t} <span class="global-hint">(${t})</span></span>
                                    </div>
                                  `))}
                              </div>
                            `:""}
                      </div>
                    `:""}
                ${this._createEntitiesValues()}
                <div class="sub-category" style="display: flex; flex-direction: column; align-items: flex-end;">
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:plus-circle"
                    @click=${this._addEntity}
                    .configArray=${this._configArray}
                    .configAddValue=${"entity"}
                    .sourceArray=${this._config.entities}
                  ></ha-icon>
                </div>
              </div>
            `:""}
      </div>
    `}_createAppearanceElement(){if(!this.hass)return ne``;const t=this._options.appearance;return ne`
        <div class="option" @click=${this._toggleThing} .options=${t} .optionsTarget=${this._options}>
          <div class="row">
            <ha-icon .icon=${`mdi:${t.icon}`}></ha-icon>
            <div class="title">${t.name}</div>
            <ha-icon
              .icon=${t.show?"mdi:chevron-up":"mdi:chevron-down"}
              style="margin-left: auto;"
            ></ha-icon>
          </div>
          <div class="secondary">${t.secondary}</div>
        </div>
        ${t.show?ne`
                <div class="card-background">
                  ${this._createCardElement()} ${this._createBarElement(null)} ${this._createValueElement(null)}
                  ${this._createPositionsElement(null)} ${this._createSeverityElement(null)}
                  ${this._createAnimationElement(null)}
                </div>
              `:""}
      </div>`}_globalValue(t){return t.split(".").reduce(((t,e)=>null==t?void 0:t[e]),this._config)}_createBarElement(t){let e,i;return null!==t?(e=this._options.entities.options.entities[t].options.bar,i=this._configArray[t]):(e=this._options.appearance.options.bar,i=this._config),ne`
      <div class="category" id="bar">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${e}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${e.icon}`}></ha-icon>
            <div class="title">${e.name}</div>
            <ha-icon .icon=${e.show?"mdi:chevron-up":"mdi:chevron-down"} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${e.secondary}</div>
        </div>
        ${e.show?ne`
              <div class="value">
                <div>
                  <label class="field-label"
                    >Direction
                    <select
                      .value=${i.direction?i.direction:""}
                      @change=${this._valueChanged}
                      .configObject=${i}
                      .configAttribute=${"direction"}
                      .ignoreNull=${!0}
                    >
                      <option value="">-</option>
                      <option value="right">right</option>
                      <option value="up">up</option>
                    </select>
                  </label>
                  ${i.direction?ne`
                        <ha-icon
                          class="ha-icon-large"
                          icon="mdi:close"
                          @click=${this._valueChanged}
                          .value=${""}
                          .configAttribute=${"direction"}
                          .configObject=${i}
                        ></ha-icon>
                      `:""}
                  ${null!==t&&!i.direction&&this._globalValue("direction")?ne`<span class="global-hint">(globaal: ${this._globalValue("direction")})</span>`:""}
                </div>
                ${null!==t?ne`
                      <label class="field-label"
                        >Name
                        <input
                          type="text"
                          .value="${i.name?i.name:""}"
                          .configAttribute=${"name"}
                          .configObject=${i}
                          @input=${this._valueChanged}
                        />
                      </label>
                    `:""}
                <div class="value-row">
                  <label class="field-label"
                    >Icon
                    <input
                      type="text"
                      placeholder="${null!==t?this._globalValue("icon")??"":""}"
                      .value="${i.icon?i.icon:""}"
                      .configAttribute=${"icon"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Color
                    <input
                      type="text"
                      placeholder="${null!==t?this._globalValue("color")??"":""}"
                      .value="${i.color?i.color:""}"
                      .configAttribute=${"color"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
                <div class="value-row">
                  <label class="field-label"
                    >Height
                    <input
                      type="text"
                      placeholder="${null!==t?this._globalValue("height")??"":""}"
                      .value="${i.height?i.height:""}"
                      .configAttribute=${"height"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Width
                    <input
                      type="text"
                      placeholder="${null!==t?this._globalValue("width")??"":""}"
                      .value="${i.width?i.width:""}"
                      .configAttribute=${"width"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
              </div>
            `:""}
      </div>
    `}_createAnimationElement(t){let e,i;return null!==t?(e=this._options.entities.options.entities[t].options.animation,i=this._configArray[t]):(e=this._options.appearance.options.animation,i=this._config),i.animation={...i.animation},ne`
      <div class="category" id="bar">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${e}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${e.icon}`}></ha-icon>
            <div class="title">${e.name}</div>
            <ha-icon .icon=${e.show?"mdi:chevron-up":"mdi:chevron-down"} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${e.secondary}</div>
        </div>
        ${e.show?ne`
                <div class="value">
                  <div>
                    <label class="field-label"
                      >State
                      <select
                        .value=${i.animation.state?i.animation.state:""}
                        @change=${this._valueChanged}
                        .configAttribute=${"state"}
                        .configObject=${i.animation}
                        .index=${t}
                        .ignoreNull=${!0}
                      >
                        <option value="">-</option>
                        <option value="on">on</option>
                        <option value="off">off</option>
                      </select>
                    </label>
                    ${i.animation.state?ne`
                          <ha-icon
                            class="ha-icon-large"
                            icon="mdi:close"
                            @click=${this._valueChanged}
                            .value=${""}
                            .configAttribute=${"state"}
                            .configObject=${i.animation}
                            .index=${t}
                          ></ha-icon>
                        `:""}
                    ${null!==t&&!i.animation.state&&this._globalValue("animation.state")?ne`<span class="global-hint">(globaal: ${this._globalValue("animation.state")})</span>`:""}
                  </div>
                  <label class="field-label"
                    >Speed
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${null!==t?this._globalValue("animation.speed")??"":""}"
                      .value="${i.animation.speed?i.animation.speed:""}"
                      @input=${this._valueChanged}
                      .configAttribute=${"speed"}
                      .configObject=${i.animation}
                      .index=${t}
                    />
                  </label>
                </div>
              `:""}
      </div>
    `}_createSeverityElement(t){let e,i;null!==t?(e=this._options.entities.options.entities[t].options.severity,i=this._configArray[t]):(e=this._options.appearance.options.severity,i=this._config);const s=i.severity?i.severity.length:0;return ne`
      <div class="category" id="bar">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${e}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${e.icon}`}></ha-icon>
            <div class="title">${e.name}</div>
            <ha-icon .icon=${e.show?"mdi:chevron-up":"mdi:chevron-down"} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${e.secondary}</div>
        </div>
        ${e.show?ne`
              <div class="card-background" style="overflow: auto; max-height: 420px;">
                ${null!==t&&this._config.severity?.length?ne`<div class="secondary">Globale severity-regels worden ook toegepast (samengevoegd, niet overschreven).</div>`:""}
                ${s>0?ne`
                      ${this._createSeverityValues(t)}
                    `:""}
                <div class="sub-category" style="display: flex; flex-direction: column; align-items: flex-end;">
                  <ha-icon class="ha-icon-large" icon="mdi:plus-circle" @click=${this._addSeverity} .index=${t}></ha-icon>
                </div>
              </div>
            `:""}
      </div>
    `}_createSeverityValues(t){let e;e=null===t?this._config:this._configArray[t];const i=[];for(const s of e.severity){const n=e.severity.indexOf(s);i.push(ne`
        <div class="sub-category" style="display: flex; flex-direction: row; align-items: center;">
          <div class="value">
            <div style="display:flex;">
              <label class="field-label"
                >From
                <input
                  type="number"
                  class="field-number"
                  .value="${s.from||0===s.from?s.from:""}"
                  .severityAttribute=${"from"}
                  .index=${t}
                  .severityIndex=${n}
                  @input=${this._updateSeverity}
                />
              </label>
              <label class="field-label"
                >To
                <input
                  type="number"
                  class="field-number"
                  .value="${s.to?s.to:""}"
                  .severityAttribute=${"to"}
                  .index=${t}
                  .severityIndex=${n}
                  @input=${this._updateSeverity}
                />
              </label>
            </div>
            <div style="display:flex;">
              <label class="field-label"
                >Color
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input
                    type="text"
                    .value="${s.color?s.color:""}"
                    .severityAttribute=${"color"}
                    .index=${t}
                    .severityIndex=${n}
                    @input=${this._updateSeverity}
                  />
                  <input
                    type="color"
                    class="color-swatch"
                    title="Kies een kleur"
                    .value="${/^#[0-9a-fA-F]{6}$/.test(s.color)?s.color:"#ffffff"}"
                    .severityAttribute=${"color"}
                    .index=${t}
                    .severityIndex=${n}
                    @input=${this._updateSeverity}
                  />
                </div>
              </label>
              <label class="field-label"
                >Icon
                <input
                  type="text"
                  .value="${s.icon?s.icon:""}"
                  .severityAttribute=${"icon"}
                  .index=${t}
                  .severityIndex=${n}
                  @input=${this._updateSeverity}
                />
              </label>
            </div>
            <ha-switch
              .checked=${!!s.hide}
              .severityAttribute=${"hide"}
              .index=${t}
              .severityIndex=${n}
              .value=${!s.hide}
              @change=${this._updateSeverity}
              >Hide</ha-switch
            >
          </div>
          <div style="display: flex;">
            ${0!==n?ne`
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:arrow-up"
                    @click=${this._moveSeverity}
                    .configDirection=${"up"}
                    .index=${t}
                    .severityIndex=${n}
                  ></ha-icon>
                `:ne`
                  <ha-icon icon="mdi:arrow-up" style="opacity: 25%;" class="ha-icon-large"></ha-icon>
                `}
            ${n!==e.severity.length-1?ne`
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:arrow-down"
                    @click=${this._moveSeverity}
                    .configDirection=${"down"}
                    .index=${t}
                    .severityIndex=${n}
                  ></ha-icon>
                `:ne`
                  <ha-icon icon="mdi:arrow-down" style="opacity: 25%;" class="ha-icon-large"></ha-icon>
                `}
            <ha-icon
              class="ha-icon-large"
              icon="mdi:close"
              @click=${this._removeSeverity}
              .index=${t}
              .severityIndex=${n}
            ></ha-icon>
          </div>
        </div>
      `)}return i}_createCardElement(){if(!this.hass)return ne``;const t=this._config,e=this._options.appearance.options.card;return ne`
      <div class="category" id="card">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${e}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${e.icon}`}></ha-icon>
            <div class="title">${e.name}</div>
            <ha-icon .icon=${e.show?"mdi:chevron-up":"mdi:chevron-down"} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${e.secondary}</div>
        </div>
        ${e.show?ne`
              <div class="value-container">
                <label class="field-label"
                  >Header Title
                  <input
                    type="text"
                    .value="${t.title?t.title:""}"
                    .configObject=${t}
                    .configAttribute=${"title"}
                    @input=${this._valueChanged}
                  />
                </label>
                <label class="field-label"
                  >Columns
                  <input
                    type="number"
                    class="field-number"
                    .value=${t.columns?t.columns:""}
                    .configObject=${t}
                    .configAttribute=${"columns"}
                    @input=${this._valueChanged}
                  />
                </label>
                <div>
                  <ha-switch
                    .checked=${!!t.entity_row}
                    .configAttribute=${"entity_row"}
                    .configObject=${t}
                    .value=${!t.entity_row}
                    @change=${this._valueChanged}
                    >Entity Row</ha-switch
                  >
                </div>
              </div>
            `:""}
      </div>
    `}_createPositionsValues(t){let e;e=null===t?this._config:this._configArray[t],e.positions={...e.positions};const i=[],s=Object.keys({icon:"outside",indicator:"outside",name:"inside",minmax:"off",value:"inside"});for(const n of s)i.push(ne`
          <div class="value">
            <label class="field-label"
              >${n}
              <select
                .value=${e.positions[n]?e.positions[n]:""}
                @change=${this._valueChanged}
                .configAttribute=${n}
                .configObject=${e.positions}
                .ignoreNull=${!0}
              >
                <option value="">-</option>
                <option value="inside">inside</option>
                <option value="outside">outside</option>
                <option value="off">off</option>
              </select>
            </label>
            ${e.positions[n]?ne`
                  <ha-icon
                    class="ha-icon-large"
                    icon="mdi:close"
                    @click=${this._valueChanged}
                    .value=${""}
                    .configAttribute=${n}
                    .configObject=${e.positions}
                  ></ha-icon>
                `:""}
            ${null!==t&&!e.positions[n]&&this._globalValue(`positions.${n}`)?ne`<span class="global-hint">(globaal: ${this._globalValue(`positions.${n}`)})</span>`:""}
          </div>
        `);return i}_createPositionsElement(t){if(!this.hass)return ne``;let e;return e=null===t?this._options.appearance.options.positions:this._options.entities.options.entities[t].options.positions,ne`
      <div class="category">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${e}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${e.icon}`}></ha-icon>
            <div class="title">${e.name}</div>
            <ha-icon .icon=${e.show?"mdi:chevron-up":"mdi:chevron-down"} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${e.secondary}</div>
        </div>
        ${e.show?ne`
              <div class="positions-grid">${this._createPositionsValues(t)}</div>
            `:""}
      </div>
    `}_createValueElement(t){if(!this.hass)return ne``;let e,i;return null!==t?(e=this._options.entities.options.entities[t].options.value,i=this._configArray[t]):(e=this._options.appearance.options.value,i=this._config),ne`
      <div class="category" id="value">
        <div
          class="sub-category"
          @click=${this._toggleThing}
          .options=${e}
          .optionsTarget=${this._options.appearance.options}
        >
          <div class="row">
            <ha-icon .icon=${`mdi:${e.icon}`}></ha-icon>
            <div class="title">${e.name}</div>
            <ha-icon .icon=${e.show?"mdi:chevron-up":"mdi:chevron-down"} style="margin-left: auto;"></ha-icon>
          </div>
          <div class="secondary">${e.secondary}</div>
        </div>
        ${e.show?ne`
              <div class="value">
                <div class="value-row">
                  <ha-switch
                    .checked=${!!i.limit_value}
                    .configAttribute=${"limit_value"}
                    .configObject=${i}
                    .value=${!i.limit_value}
                    @change=${this._valueChanged}
                    >Limit Value</ha-switch
                  >
                  ${null!==t&&!i.limit_value&&this._globalValue("limit_value")?ne`<span class="global-hint">(globaal: aan)</span>`:""}
                  <ha-switch
                    .checked=${!!i.complementary}
                    .configAttribute=${"complementary"}
                    .configObject=${i}
                    .value=${!i.complementary}
                    @change=${this._valueChanged}
                    >Complementary</ha-switch
                  >
                  ${null!==t&&!i.complementary&&this._globalValue("complementary")?ne`<span class="global-hint">(globaal: aan)</span>`:""}
                </div>
                <div class="value-row">
                  <label class="field-label"
                    >Decimal
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${null!==t?this._globalValue("decimal")??"":""}"
                      .value="${i.decimal?i.decimal:""}"
                      .configAttribute=${"decimal"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Min
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${null!==t?this._globalValue("min")??"":""}"
                      .value="${i.min?i.min:""}"
                      .configAttribute=${"min"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Max
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${null!==t?this._globalValue("max")??"":""}"
                      .value="${i.max?i.max:""}"
                      .configAttribute=${"max"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Target
                    <input
                      type="number"
                      class="field-number"
                      placeholder="${null!==t?this._globalValue("target")??"":""}"
                      .value="${i.target?i.target:""}"
                      .configAttribute=${"target"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
                <div class="value-row">
                  <label class="field-label"
                    >Unit of Measurement
                    <input
                      type="text"
                      placeholder="${null!==t?this._globalValue("unit_of_measurement")??"":""}"
                      .value="${i.unit_of_measurement?i.unit_of_measurement:""}"
                      .configAttribute=${"unit_of_measurement"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                  <label class="field-label"
                    >Attribute
                    <input
                      type="text"
                      placeholder="${null!==t?this._globalValue("attribute")??"":""}"
                      .value="${i.attribute?i.attribute:""}"
                      .configAttribute=${"attribute"}
                      .configObject=${i}
                      @input=${this._valueChanged}
                    />
                  </label>
                </div>
              </div>
            `:""}
      </div>
    `}_toggleThing(t){const e=t.target.options,i=!e.show;if(t.target.optionsTarget)if(Array.isArray(t.target.optionsTarget))for(const e of t.target.optionsTarget)e.show=!1;else for(const[e]of Object.entries(t.target.optionsTarget))t.target.optionsTarget[e].show=!1;e.show=i,this._toggle=!this._toggle,this.requestUpdate()}_addEntity(t){if(!this._config||!this.hass)return;const e=t.target;let i;i=e.configAddObject?e.configAddObject:{[e.configAddValue]:""};const s=e.configArray.slice();s.push(i),this._config.entities=s,d(this,"config-changed",{config:this._config})}_hasNumericState(t){return!isNaN(Number(t.state))}_getAvailableDeviceClasses(){if(!this.hass)return[];const t=new Set;for(const e of Object.values(this.hass.states))e.attributes.device_class&&this._hasNumericState(e)&&t.add(e.attributes.device_class);return Array.from(t).sort()}_bulkAddDeviceClassChanged(t){if(this._bulkAddDeviceClass=t.target.value,!this._bulkAddDeviceClass)return this._bulkAddMatches=null,this._bulkAddSelected=null,void this.requestUpdate();this._findBulkAddMatches()}_findBulkAddMatches(){if(!this.hass||!this._bulkAddDeviceClass)return;const t=new Set(this._configArray.map((t=>t.entity))),e=[];for(const i of Object.values(this.hass.states))i.attributes.device_class===this._bulkAddDeviceClass&&this._hasNumericState(i)&&!t.has(i.entity_id)&&e.push(i.entity_id);this._bulkAddMatches=e.sort(),this._bulkAddSelected=new Set(this._bulkAddMatches),this.requestUpdate()}_bulkAddToggleSelected(t){this._bulkAddSelected&&(t.target.checked?this._bulkAddSelected.add(t.target.entityId):this._bulkAddSelected.delete(t.target.entityId),this.requestUpdate())}_confirmBulkAdd(){if(!this._config||!this.hass||!this._bulkAddSelected||0===this._bulkAddSelected.size)return;const t=this._configArray.slice();for(const e of this._bulkAddSelected)t.push({entity:e});this._config.entities=t,d(this,"config-changed",{config:this._config}),this._bulkAddMatches=null,this._bulkAddSelected=null}_cancelBulkAdd(){this._bulkAddMatches=null,this._bulkAddSelected=null,this.requestUpdate()}_getEntityRowElements(){return Array.from(this.shadowRoot?.querySelectorAll(".entity-row")??[])}_entityDragStart(t){const e=t.currentTarget,i=e.closest(".entity-row");!i||void 0!==t.button&&0!==t.button||(t.preventDefault(),this._dragEntityIndex=e.index,this._dragOriginalIndex=e.index,this._dragRowElement=i,this._dragStartClientY=t.clientY,this._dragLastDeltaY=0,this._dragRowOriginalRects=this._getEntityRowElements().map((t=>t.getBoundingClientRect())),e.setPointerCapture(t.pointerId),i.classList.add("dragging"))}_applyDragTransform(){if(null===this._dragEntityIndex||null===this._dragOriginalIndex||!this._dragRowElement)return;const t=this._dragRowOriginalRects[this._dragOriginalIndex]?.top,e=this._dragRowOriginalRects[this._dragEntityIndex]?.top;void 0!==t&&void 0!==e&&(this._dragRowElement.style.transform=`translateY(${t+this._dragLastDeltaY-e}px)`)}_entityDragMove(t){if(null===this._dragEntityIndex||null===this._dragOriginalIndex||!this._dragRowElement)return;this._dragLastDeltaY=t.clientY-this._dragStartClientY,this._applyDragTransform();const e=this._dragRowOriginalRects[this._dragOriginalIndex];if(!e)return;const i=e.top+e.height/2+this._dragLastDeltaY;let s=0;this._dragRowOriginalRects.forEach(((t,e)=>{const n=t.top+t.height/2,o=this._dragRowOriginalRects[s].top+this._dragRowOriginalRects[s].height/2;Math.abs(n-i)<Math.abs(o-i)&&(s=e)})),s!==this._dragEntityIndex&&(this._reorderEntities(this._dragEntityIndex,s),this._dragEntityIndex=s)}_reorderEntities(t,e){if(!this._config)return;const i=new Map;this._getEntityRowElements().forEach(((t,e)=>{const s=this._configArray[e];s&&i.set(s,t.getBoundingClientRect())})),this._configArray=o(this._configArray,t,e),this._config.entities=this._configArray,this.requestUpdate(),this.updateComplete.then((()=>{const t=this._configArray[e];this._getEntityRowElements().forEach(((e,s)=>{const n=this._configArray[s];if(n===t)return this._dragRowElement=e,e.classList.add("dragging"),e.style.transition="none",void this._applyDragTransform();const o=n&&i.get(n);if(!o)return;const a=e.getBoundingClientRect(),r=o.top-a.top;r&&(e.style.transition="none",e.style.transform=`translateY(${r}px)`,requestAnimationFrame((()=>{e.style.transition="transform 150ms ease",e.style.transform=""})))}))}))}_entityDragEnd(t){const e=t.currentTarget;null!==this._dragEntityIndex&&(e.hasPointerCapture?.(t.pointerId)&&e.releasePointerCapture(t.pointerId),this._getEntityRowElements().forEach((t=>{t.style.transition="",t.style.transform="",t.classList.remove("dragging")})),this._dragEntityIndex=null,this._dragOriginalIndex=null,this._dragRowElement=null,this._dragRowOriginalRects=[],d(this,"config-changed",{config:this._config}))}_removeEntity(t){if(!this._config||!this.hass)return;const e=t.target,i=[];let s=0;for(const t of this._configArray)e.configIndex!==s&&i.push(t),s++;const n={[e.configArray]:i};this._config=Object.assign(this._config,n),d(this,"config-changed",{config:this._config})}_addSeverity(t){if(!this._config||!this.hass)return;const e=t.target;let i;i=null===e.index?this._config.severity:this._config.entities[e.index].severity,i||(i=[]);const s=i.slice();s.push({from:"",to:"",color:""}),null===e.index?this._config.severity=s:this._configArray[e.index].severity=s,this._config.entities=this._configArray,d(this,"config-changed",{config:this._config})}_moveSeverity(t){if(!this._config||!this.hass)return;const e=t.target;let i;i=null===e.index?this._config.severity:this._config.entities[e.index].severity;let s=i.slice();"up"==e.configDirection?s=o(s,e.severityIndex,e.severityIndex-1):"down"==e.configDirection&&(s=o(s,e.severityIndex,e.severityIndex+1)),null===e.index?this._config.severity=s:this._configArray[e.index].severity=s,this._config.entities=this._configArray,d(this,"config-changed",{config:this._config})}_removeSeverity(t){if(!this._config||!this.hass)return;const e=t.target;let i;i=null===e.index?this._config.severity:this._configArray[e.index].severity;const s=i.slice(),n=[];let o=0;for(const{}of s)e.severityIndex!==o&&n.push(s[o]),o++;null===e.index?0===n.length?delete this._config.severity:this._config.severity=n:0===n.length?delete this._configArray[e.index].severity:this._configArray[e.index].severity=n,this._config.entities=this._configArray,d(this,"config-changed",{config:this._config})}_updateSeverity(t){const e=t.target;let i;i=null===e.index?this._config.severity:this._configArray[e.index].severity;const s=[];for(const t in i)if(e.severityIndex==t){const n={...i[t]},o={[e.severityAttribute]:e.value},a=Object.assign(n,o);""==e.value&&delete a[e.severityAttribute],s.push(a)}else s.push(i[t]);null===e.index?this._config.severity=s:this._configArray[e.index].severity=s,this._config.entities=this._configArray,d(this,"config-changed",{config:this._config})}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(e.configObject[e.configAttribute]!=e.value){if(e.configAdd&&""!==e.value&&(e.configObject=Object.assign(e.configObject,{[e.configAdd]:{[e.configAttribute]:e.value}})),e.configAttribute&&e.configObject&&!e.configAdd)if(""==e.value||!1===e.value){if(1==e.ignoreNull)return;delete e.configObject[e.configAttribute]}else console.log(e.configObject),e.configObject[e.configAttribute]=e.value;this._config.entities=this._configArray,d(this,"config-changed",{config:this._config})}}static get styles(){return At`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .options {
        background: var(--primary-background-color);
        border-radius: var(--ha-card-border-radius);
        cursor: pointer;
        padding: 8px;
      }
      .sub-category {
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
        margin-top: 14px;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .value {
        padding: 0px 8px;
      }
      .value-container {
        padding: 0px 8px;
        transition: all 0.5s ease-in-out;
      }
      .value-container:target {
        height: 50px;
      }
      .value-number {
        width: 100px;
      }
      .global-hint {
        color: var(--secondary-text-color);
        font-size: 12px;
        margin-left: 8px;
      }
      .field-label {
        display: inline-flex;
        flex-direction: column;
        font-size: 12px;
        color: var(--secondary-text-color);
        margin: 8px 4px 8px 0px;
      }
      .field-label select,
      .field-label input {
        font-size: 14px;
        padding: 8px 12px;
        margin-top: 4px;
        background: var(--ha-color-form-background, rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08));
        color: var(--primary-text-color);
        border: none;
        border-radius: 12px;
        box-sizing: border-box;
      }
      .field-label input {
        width: 140px;
      }
      .field-label input.field-number {
        width: 80px;
      }
      .field-label input.color-swatch {
        width: 36px;
        padding: 2px;
        cursor: pointer;
      }
      .value-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      .positions-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0px 16px;
      }
      ha-switch {
        padding: 16px 0;
      }
      .card-background {
        background: var(--ha-card-background);
        border-radius: var(--ha-card-border-radius);
        padding: 8px;
      }
      .category {
        background: #0000;
      }
      .ha-icon-large {
        cursor: pointer;
        margin: 0px 4px;
      }
      .drag-handle {
        cursor: grab;
        align-self: center;
        margin-top: auto;
        margin-bottom: auto;
        touch-action: none;
      }
      .drag-handle:active {
        cursor: grabbing;
      }
      .entity-row.dragging {
        position: relative;
        z-index: 2;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background: var(--card-background-color);
      }
      .entity-row {
        margin-bottom: 8px;
      }
    `}})})(),window.customCards=window.customCards||[],window.customCards.push({type:"bar-card",name:"Bar Card",preview:!1,description:"A customizable bar card.",getEntitySuggestion:(t,e)=>{const i=e.split(".")[0];if(!["sensor","number","input_number"].includes(i))return null;const s=t.states[e];return!s||isNaN(Number(s.state))?null:{config:{type:"custom:bar-card",entity:e}}}});const Ee={en:{common:{version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",entity_not_available:"Entity not available"}},nb:{common:{version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel"}}};function Se(t,e="",i=""){const s=t.split(".")[0],n=t.split(".")[1],o=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let a;try{a=Ee[o][s][n]}catch(t){a=Ee.en[s][n]}return void 0===a&&(a=Ee.en[s][n]),""!==e&&""!==i&&(a=a.replace(e,i)),a}const ke=ne`
  <style>
    .warning {
      display: block;
      color: black;
      background-color: #fce588;
      padding: 8px;
    }
    #states {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    #states > * {
      margin-bottom: 8px;
    }
    #states > :last-child {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    #states > :first-child {
      margin-top: 0px;
    }
    ha-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    bar-card-row {
      display: flex;
      flex-grow: 1;
    }
    bar-card-row > div {
      flex-basis: 100%;
    }
    bar-card-row:empty {
      display: none;
    }
    bar-card-card {
      display: flex;
      flex-basis: 100%;
      flex-direction: row;
      margin-right: 8px;
    }
    bar-card-card:last-child {
      margin-right: 0px;
    }
    bar-card-background {
      cursor: pointer;
      flex-grow: 1;
      position: relative;
    }
    bar-card-iconbar {
      color: var(--ha-icon-color);
      align-items: center;
      align-self: center;
      display: flex;
      height: 40px;
      justify-content: center;
      position: relative;
      width: 40px;
    }
    bar-card-currentbar,
    bar-card-backgroundbar,
    bar-card-contentbar,
    bar-card-targetbar,
    bar-card-animationbar {
      position: absolute;
      height: 100%;
      width: 100%;
      border-radius: var(--bar-card-border-radius, var(--ha-card-border-radius));
    }
    bar-card-contentbar {
      align-items: center;
      color: var(--primary-text-color);
      display: flex;
      justify-content: flex-start;
    }
    .contentbar-direction-right {
      flex-direction: row;
    }
    .contentbar-direction-up {
      flex-direction: column;
    }
    bar-card-backgroundbar {
      background: var(--bar-color);
      filter: brightness(0.5);
      opacity: 0.25;
    }
    bar-card-currentbar {
      background: linear-gradient(
        to var(--bar-direction),
        var(--bar-color) var(--bar-percent),
        #0000 var(--bar-percent),
        #0000 var(--bar-percent)
      );
    }
    bar-card-targetbar {
      background: linear-gradient(
        to var(--bar-direction),
        #0000 var(--bar-percent),
        var(--bar-color) var(--bar-percent),
        var(--bar-color) var(--bar-target-percent),
        #0000 var(--bar-target-percent)
      );
      display: var(--target-display);
      filter: brightness(0.66);
      opacity: 0.33;
    }
    bar-card-markerbar {
      background: var(--bar-color);
      filter: brightness(0.75);
      opacity: 50%;
      position: absolute;
    }
    bar-card-animationbar {
      background-repeat: no-repeat;
      filter: brightness(0.75);
      opacity: 0%;
    }
    .animationbar-horizontal {
      background: linear-gradient(to var(--animation-direction), var(--bar-color) 0%, var(--bar-color) 1%, #0000 1%);
    }
    .animationbar-vertical {
      background: linear-gradient(to var(--animation-direction), #0000 0%, #0000 1%, var(--bar-color) 1%);
    }
    @keyframes animation-increase {
      0% {
        opacity: 50%;
        background-size: var(--bar-percent) 100%;
      }
      100% {
        opacity: 0%;
        background-size: 10000% 100%;
      }
    }
    @keyframes animation-decrease {
      0% {
        opacity: 0%;
        background-size: 10000%;
      }
      100% {
        opacity: 50%;
        background-size: var(--bar-percent);
      }
    }
    @keyframes animation-increase-vertical {
      0% {
        opacity: 50%;
        background-size: 100% var(--bar-percent);
      }
      100% {
        background-size: 100% 0%;
        opacity: 0%;
      }
    }
    @keyframes animation-decrease-vertical {
      0% {
        background-size: 100% 100%;
        opacity: 0%;
      }
      100% {
        opacity: 50%;
        background-size: 100% var(--bar-percent);
      }
    }
    bar-card-indicator {
      align-self: center;
      color: var(--bar-color);
      filter: brightness(0.75);
      height: 16px;
      width: 16px;
      position: relative;
      text-align: center;
      opacity: 0;
    }
    .indicator-direction-right {
      margin-right: -16px;
      left: -6px;
    }
    .indicator-direction-up {
      margin: 4px;
    }
    .indicator-show {
      animation: bar-card-indicator-fade 2s forwards;
    }
    @keyframes bar-card-indicator-fade-a {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes bar-card-indicator-fade-b {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
    bar-card-name {
      align-items: center;
      align-self: center;
      justify-content: center;
      margin: 4px;
      overflow: hidden;
      position: relative;
      text-align: left;
      text-overflow: ellipsis;
    }
    bar-card-name,
    bar-card-value {
      line-height: 1;      /* makes line-height = font-size */
    }
    .name-outside {
      margin-left: 16px;
    }
    bar-card-value,
    bar-card-min,
    bar-card-max,
    bar-card-divider {
      align-self: center;
      position: relative;
    }
    bar-card-min,
    bar-card-max,
    bar-card-divider {
      font-size: 10px;
      margin: 2px;
      opacity: 0.5;
    }
    .min-direction-up {
      margin-top: auto;
    }
    .min-direction-right {
      margin-left: auto;
    }
    bar-card-divider {
      margin-left: 0px;
      margin-right: 0px;
    }
    bar-card-value {
      white-space: nowrap;
      margin: 4px;
    }
    .value-direction-right {
      margin-left: auto;
    }
    .value-direction-up {
      margin-top: auto;
    }
  </style>
`,Ce=6;class Oe{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const Te="ontouchstart"in window||navigator.maxTouchPoints>0;class Pe extends HTMLElement{holdTime;timer;held;cooldownStart;cooldownEnd;dblClickTimeout;constructor(){super(),this.holdTime=500,this.timer=void 0,this.held=!1,this.cooldownStart=!1,this.cooldownEnd=!1}connectedCallback(){Object.assign(this.style,{position:"absolute",width:Te?"100px":"50px",height:Te?"100px":"50px",transform:"translate(-50%, -50%)",pointerEvents:"none"});["touchcancel","mouseout","mouseup","touchmove","mousewheel","wheel","scroll"].forEach((t=>{document.addEventListener(t,(()=>{clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0}),{passive:!0})}))}bind(t,e){if(t.actionHandler)return;t.actionHandler=!0,t.addEventListener("contextmenu",(t=>{const e=t||window.event;e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0,e.returnValue=!1}));const i=t=>{if(this.cooldownStart)return;let e,i;this.held=!1,t.touches?(e=t.touches[0].pageX,i=t.touches[0].pageY):(e=t.pageX,i=t.pageY),this.timer=window.setTimeout((()=>{this.startAnimation(e,i),this.held=!0}),this.holdTime),this.cooldownStart=!0,window.setTimeout((()=>this.cooldownStart=!1),100)},s=i=>{this.cooldownEnd||["touchend","touchcancel"].includes(i.type)&&void 0===this.timer||(clearTimeout(this.timer),this.stopAnimation(),this.timer=void 0,this.held?d(t,"action",{action:"hold"}):e.hasDoubleClick?1===i.detail||"keyup"===i.type?this.dblClickTimeout=window.setTimeout((()=>{d(t,"action",{action:"tap"})}),250):(clearTimeout(this.dblClickTimeout),d(t,"action",{action:"double_tap"})):d(t,"action",{action:"tap"}),this.cooldownEnd=!0,window.setTimeout((()=>this.cooldownEnd=!1),100))};t.addEventListener("touchstart",i,{passive:!0}),t.addEventListener("touchend",s),t.addEventListener("touchcancel",s),t.addEventListener("keyup",(t=>{if(13===t.keyCode)return s(t)}));/iPhone OS 13_/.test(window.navigator.userAgent)||(t.addEventListener("mousedown",i,{passive:!0}),t.addEventListener("click",s))}startAnimation(t,e){Object.assign(this.style,{left:`${t}px`,top:`${e}px`,display:null})}stopAnimation(){this.style.display="none"}}customElements.define("action-handler-bar",Pe);const Ne=(t,e)=>{const i=(()=>{const t=document.body;if(t.querySelector("action-handler-bar"))return t.querySelector("action-handler-bar");const e=document.createElement("action-handler-bar");return t.appendChild(e),e})();i&&i.bind(t,e)};const Me=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Oe{update(t,[e,i]){t.type===Ce&&Ne(t.element,i)}render(t,e){}});console.info("%c BAR-CARD %c v5.0.0 ","color: white; font-weight: bold; background: dimgray;","color: dimgray; font-weight: bold; background: white;");let Ue=(()=>{let o,a,r=[xe("bar-card")],l=[],d=Ae;return class extends d{static{a=this}static{const i="function"==typeof Symbol&&Symbol.metadata?Object.create(d[Symbol.metadata]??null):void 0;t(null,o={value:a},r,{kind:"class",name:a.name,metadata:i},null,l),a=o.value,i&&Object.defineProperty(a,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:i}),e(a,l)}static async getConfigElement(){return document.createElement("bar-card-editor")}static getStubConfig(){return{}}_hass;_config;_configArray=[];_stateArray=[];_animationState=[];_indicatorToggle=[];_rowAmount=1;shouldUpdate(t){return n(this,t,!1)}setConfig(t){if(!t)throw new Error(Se("common.invalid_configuration"));this._config=i({animation:{state:"off",speed:5},color:"var(--bar-card-color, var(--primary-color))",columns:1,direction:"right",max:100,min:0,positions:{icon:"outside",indicator:"outside",name:"inside",minmax:"off",value:"inside"}},t),"horizontal"==this._config.stack&&(this._config.columns=this._config.entities.length),this._configArray=function(t){const e=[];if(t.entities){for(const s of t.entities)if("string"==typeof s){const n=i({},t);delete n.entities;const o=i(n,{entity:s});e.push(o)}else if("object"==typeof s){const n=i({},t);delete n.entities;const o=i(n,s);e.push(o)}}else e.push(t);return e}(this._config),this._rowAmount=this._configArray.length/this._config.columns}_showMoreInfo(t){this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))}_handleAction(t){if(this._hass&&t.detail&&t.detail.action){const e=parseInt(t.target.dataset.configIndex||"0"),i=this._configArray[e]||this._config;!function(t,e,i,s){var n;"double_tap"===s&&i.double_tap_action?n=i.double_tap_action:"hold"===s&&i.hold_action?n=i.hold_action:"tap"===s&&i.tap_action&&(n=i.tap_action),f(t,e,i,n)}(t.target,this._hass,i,t.detail.action)}}render(){return this._config&&this._hass?ne`
      <ha-card
        .header=${this._config.title?this._config.title:null}
        style="${this._config.entity_row?"background: #0000; box-shadow: none;":""}"
      >
        <div
          id="states"
          class="card-content"
          style="${this._config.entity_row?"padding: 0px;":""} ${["up","up-reverse","down","down-reverse"].includes(this._config.direction)?"":"flex-grow: 0;"}"
        >
          ${this._createBarArray()}
        </div>
      </ha-card>
      ${ke}
    `:ne``}_createBarArray(){const t=[];for(let e=0;e<this._configArray.length;e++)(t.length+1)*this._config.columns==e&&t.push(this._config.columns),this._configArray.length==e+1&&t.push(this._configArray.length-t.length*this._config.columns);const e=[];for(let i=0;i<t.length;i++){const n=[];for(let e=0;e<t[i];e++){const t=i*this._config.columns+e,o=this._configArray[t],a=this._hass.states[o.entity];if(!a){n.push(ne`
            <div class="warning" style="margin-bottom: 8px;">
              ${Se("common.entity_not_available")}: ${o.entity}
            </div>
          `);continue}let r;if(r=o.attribute?a.attributes[o.attribute]:a.state,o.severity&&this._computeSeverityVisibility(r,t))continue;let l=s(this._hass,o.max),d=s(this._hass,o.min);l<=d&&(0===l&&0===d?(d=0,l=100):l=d+Math.max(1,.1*Math.abs(d))),o.limit_value&&(r=Math.min(r,l),r=Math.max(r,d)),isNaN(Number(r))||(0==o.decimal?r=Number(r).toFixed(0):o.decimal&&(r=Number(r).toFixed(o.decimal)));const h=Math.round(2*this._getLineHeightPx()),p=o.height??h,g=["up","up-reverse","down","down-reverse"].includes(o.direction);let f,m,_,v="stretch",b="0px 0px 0px 13px",$="right",y="row",A="left",w="height: 100%; width: 2px;";switch(o.direction){case"right":case"right-reverse":$="right",A="left";break;case"left":case"left-reverse":$="left",A="right";break;case"up":case"up-reverse":b="0px",$="top",y="column-reverse",A="bottom",w="height: 2px; width: 100%;";break;case"down":case"down-reverse":b="0px",$="bottom",y="column",A="top",w="height: 2px; width: 100%;"}switch(_=this._computeSeverityIcon(r,t)?this._computeSeverityIcon(r,t):o.icon?o.icon:a.attributes.icon?a.attributes.icon:u(c(o.entity),r),o.positions.icon){case"outside":f=ne`
              <bar-card-iconbar>
                <ha-icon icon="${_}"></ha-icon>
              </bar-card-iconbar>
            `;break;case"inside":m=ne`
              <bar-card-iconbar>
                <ha-icon icon="${_}"></ha-icon>
              </bar-card-iconbar>
            `,b="0px";break;case"off":b="0px"}const x=o.name?o.name:a.attributes.friendly_name;let E,S,k,C,O,T,P;switch(o.positions.name){case"outside":E=ne`
              <bar-card-name
                class="${o.entity_row?"name-outside":""}"
                style="${g?"":o.width?`width: calc(100% - ${o.width});`:""}"
                >${x}</bar-card-name
              >
            `,b="0px";break;case"inside":S=ne`
              <bar-card-name>${x}</bar-card-name>
            `}switch(k=isNaN(Number(r))?"":o.unit_of_measurement?o.unit_of_measurement:a.attributes.unit_of_measurement,o.positions.minmax){case"outside":C=ne`
              <bar-card-min>${l}${k}</bar-card-min>
              <bar-card-divider>/</bar-card-divider>
              <bar-card-max>${l}${k}</bar-card-max>
            `;break;case"inside":O=ne`
              <bar-card-min class="${g?"min-direction-up":"min-direction-right"}"
                >${d}${k}</bar-card-min
              >
              <bar-card-divider>/</bar-card-divider>
              <bar-card-max> ${l}${k}</bar-card-max>
            `}switch(o.positions.value){case"outside":T=ne`
              <bar-card-value class="${g?"value-direction-up":"value-direction-right"}"
                >${o.complementary?l-r:r} ${k}</bar-card-value
              >
            `;break;case"inside":P=ne`
              <bar-card-value
                class="${"inside"==o.positions.minmax?"":"up"==o.direction?"value-direction-up":"value-direction-right"}"
                >${o.complementary?l-r:r} ${k}</bar-card-value
              >
            `;break;case"off":b="0px"}let N="";r>this._stateArray[t]?(N="▲","up"==o.direction?this._animationState[t]="animation-increase-vertical":this._animationState[t]="animation-increase"):r<this._stateArray[t]?(N="▼","up"==o.direction?this._animationState[t]="animation-decrease-vertical":this._animationState[t]="animation-decrease"):this._animationState[t]=this._animationState[t],isNaN(Number(r))&&(N="");const M=this._computeBarColor(r,t);let U,j;const R=this._indicatorToggle[t]?"bar-card-indicator-fade-a":"bar-card-indicator-fade-b",H=N?`opacity:1; animation: ${R} 2s forwards;`:"";switch(o.positions.indicator){case"outside":U=ne`
              <bar-card-indicator
                class="${"up"==o.direction?"":"indicator-direction-right"}"
                style="--bar-color: ${M}; ${H}"
                >${N}</bar-card-indicator
              >
            `;break;case"inside":j=ne`
              <bar-card-indicator style="--bar-color: ${M}; ${H}">${N}</bar-card-indicator>
            `}const I=this._computePercent(r,t,l,d),D=this._computePercent(o.target,t,l,d);let z=I,V=this._computePercent(o.target,t,l,d);V<z&&(z=V,V=I);let L="";o.width&&(v="center",L=`width: ${o.width}; flex-grow: 0;`);const B=this._animationState[t];let q="right",W=100*I,F="animationbar-horizontal";"animation-increase-vertical"!=B&&"animation-decrease-vertical"!=B||(q="bottom",F="animationbar-vertical",W=100*(100-I)),n.push(ne`
          <bar-card-card
            style="flex-direction: ${y}; align-items: ${v};"
          >
            ${f} ${U} ${E}
            <bar-card-background
              style="margin: ${b}; height: ${p}${"number"==typeof p?"px":""}; ${L}"
              data-config-index="${t}"
              ${Me(this,{hasDoubleClick:void 0!==o.double_tap_action})}
              @action=${this._handleAction}
            >
              <bar-card-backgroundbar style="--bar-color: ${M};"></bar-card-backgroundbar>
              ${"on"===o.animation.state?ne`
                    <bar-card-animationbar
                      style="animation: ${B} ${o.animation.speed}s infinite ease-out;
                             --bar-percent: ${W}%;
                             --bar-color: ${M};
                             --animation-direction: ${q};"
                      class="${F}"
                    ></bar-card-animationbar>
                  `:""}
              <bar-card-currentbar
                style="--bar-color: ${M};
                       --bar-percent: ${I}%;
                       --bar-direction: ${$}"
              ></bar-card-currentbar>
              ${o.target?ne`
                    <bar-card-targetbar
                      style="--bar-color: ${M};
                             --bar-percent: ${z}%;
                             --bar-target-percent: ${V}%;
                             --bar-direction: ${$};"
                    ></bar-card-targetbar>
                    <bar-card-markerbar
                      style="--bar-color: ${M};
                             --bar-target-percent: ${D}%;
                             ${A}: calc(${D}% - 1px);
                             ${w}"
                    ></bar-card-markerbar>
                  `:""}
              <bar-card-contentbar
                class="${"up"===o.direction?"contentbar-direction-up":"contentbar-direction-right"}"
              >
                ${m} ${j} ${S} ${O} ${P}
              </bar-card-contentbar>
            </bar-card-background>
            ${C} ${T}
          </bar-card-card>
        `),r!==this._stateArray[t]&&(this._stateArray[t]=r),this._indicatorToggle[t]=!this._indicatorToggle[t]}e.push(n)}let i="column";(this._config.columns||this._config.stack)&&(i="row");const n=[];for(const t of e)n.push(ne`
        <bar-card-row style="flex-direction: ${i};">${t}</bar-card-row>
      `);return n}_computeBarColor(t,e){const i=this._configArray[e];let s;return s=i.severity?this._computeSeverityColor(t,e):"unavailable"==t?`var(--bar-card-disabled-color, ${i.color})`:i.color,s}_computeSeverityColor(t,e){const i=this._configArray[e],s=Number(t),n=i.severity;let o;return isNaN(s)?n.forEach((e=>{t==e.text&&(o=e.color)})):n.forEach((t=>{s>=t.from&&s<=t.to&&(o=t.color)})),null==o&&(o=i.color),o}_computeSeverityVisibility(t,e){const i=this._configArray[e],s=Number(t),n=i.severity;let o=!1;return isNaN(s)?n.forEach((e=>{t==e.text&&(o=e.hide)})):n.forEach((t=>{s>=t.from&&s<=t.to&&(o=t.hide)})),o}_computeSeverityIcon(t,e){const i=this._configArray[e],s=Number(t),n=i.severity;let o=!1;return!!n&&(isNaN(s)?n.forEach((e=>{t==e.text&&(o=e.icon)})):n.forEach((t=>{s>=t.from&&s<=t.to&&(o=t.icon)})),o)}_computePercent(t,e,i,s){const n=this._configArray[e],o=Number(t);if("unavailable"==t)return 0;if(isNaN(o))return 100;if(i===s)return o>=i?100:0;switch(n.direction){case"right-reverse":case"left-reverse":case"up-reverse":case"down-reverse":return 100-100*(o-s)/(i-s);default:return 100*(o-s)/(i-s)}}_getLineHeightPx(){try{const t=getComputedStyle(document.body),e=parseFloat(t.lineHeight);if(!isNaN(e)&&isFinite(e))return e;const i=parseFloat(t.fontSize)||14,s=parseFloat(t.getPropertyValue("--ha-line-height-normal"));if(!isNaN(s)&&isFinite(s))return i*s}catch{}return 20}getCardSize(){if(this._config.height){const t=this._config.height.toString();return Math.trunc(Number(t.replace("px",""))/50*this._rowAmount)+1}return this._rowAmount+1}set hass(t){const e=this._hass;this._hass=t,this.requestUpdate("hass",e)}get hass(){return this._hass}},a})();export{Ue as BarCard};
