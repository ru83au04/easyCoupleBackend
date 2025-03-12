import{$ as v,Mb as g,Nb as d,V as ae,W as ce,Y as y,_a as m,ba as S,bb as H,ca as I,db as Z,eb as Y,ic as le,kc as fe,l as ue,lb as T,mb as de,ya as G}from"./chunk-55BIBHTM.js";var Ee=null;function W(){return Ee}function qt(e){Ee??=e}var he=class{};var ne=new v(""),ie=(()=>{class e{historyGo(t){throw new Error("")}static \u0275fac=function(i){return new(i||e)};static \u0275prov=y({token:e,factory:()=>I(ve),providedIn:"platform"})}return e})(),Jt=new v(""),ve=(()=>{class e extends ie{_location;_history;_doc=I(ne);constructor(){super(),this._location=window.location,this._history=window.history}getBaseHrefFromDOM(){return W().getBaseHref(this._doc)}onPopState(t){let i=W().getGlobalEventTarget(this._doc,"window");return i.addEventListener("popstate",t,!1),()=>i.removeEventListener("popstate",t)}onHashChange(t){let i=W().getGlobalEventTarget(this._doc,"window");return i.addEventListener("hashchange",t,!1),()=>i.removeEventListener("hashchange",t)}get href(){return this._location.href}get protocol(){return this._location.protocol}get hostname(){return this._location.hostname}get port(){return this._location.port}get pathname(){return this._location.pathname}get search(){return this._location.search}get hash(){return this._location.hash}set pathname(t){this._location.pathname=t}pushState(t,i,r){this._history.pushState(t,i,r)}replaceState(t,i,r){this._history.replaceState(t,i,r)}forward(){this._history.forward()}back(){this._history.back()}historyGo(t=0){this._history.go(t)}getState(){return this._history.state}static \u0275fac=function(i){return new(i||e)};static \u0275prov=y({token:e,factory:()=>new e,providedIn:"platform"})}return e})();function re(e,n){if(e.length==0)return n;if(n.length==0)return e;let t=0;return e.endsWith("/")&&t++,n.startsWith("/")&&t++,t==2?e+n.substring(1):t==1?e+n:e+"/"+n}function ge(e){let n=e.match(/#|\?|$/),t=n&&n.index||e.length,i=t-(e[t-1]==="/"?1:0);return e.slice(0,i)+e.slice(t)}function w(e){return e&&e[0]!=="?"?"?"+e:e}var z=(()=>{class e{historyGo(t){throw new Error("")}static \u0275fac=function(i){return new(i||e)};static \u0275prov=y({token:e,factory:()=>I(Ie),providedIn:"root"})}return e})(),we=new v(""),Ie=(()=>{class e extends z{_platformLocation;_baseHref;_removeListenerFns=[];constructor(t,i){super(),this._platformLocation=t,this._baseHref=i??this._platformLocation.getBaseHrefFromDOM()??I(ne).location?.origin??""}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(t){this._removeListenerFns.push(this._platformLocation.onPopState(t),this._platformLocation.onHashChange(t))}getBaseHref(){return this._baseHref}prepareExternalUrl(t){return re(this._baseHref,t)}path(t=!1){let i=this._platformLocation.pathname+w(this._platformLocation.search),r=this._platformLocation.hash;return r&&t?`${i}${r}`:i}pushState(t,i,r,s){let o=this.prepareExternalUrl(r+w(s));this._platformLocation.pushState(t,i,o)}replaceState(t,i,r,s){let o=this.prepareExternalUrl(r+w(s));this._platformLocation.replaceState(t,i,o)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(t=0){this._platformLocation.historyGo?.(t)}static \u0275fac=function(i){return new(i||e)(S(ie),S(we,8))};static \u0275prov=y({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})(),Qt=(()=>{class e extends z{_platformLocation;_baseHref="";_removeListenerFns=[];constructor(t,i){super(),this._platformLocation=t,i!=null&&(this._baseHref=i)}ngOnDestroy(){for(;this._removeListenerFns.length;)this._removeListenerFns.pop()()}onPopState(t){this._removeListenerFns.push(this._platformLocation.onPopState(t),this._platformLocation.onHashChange(t))}getBaseHref(){return this._baseHref}path(t=!1){let i=this._platformLocation.hash??"#";return i.length>0?i.substring(1):i}prepareExternalUrl(t){let i=re(this._baseHref,t);return i.length>0?"#"+i:i}pushState(t,i,r,s){let o=this.prepareExternalUrl(r+w(s));o.length==0&&(o=this._platformLocation.pathname),this._platformLocation.pushState(t,i,o)}replaceState(t,i,r,s){let o=this.prepareExternalUrl(r+w(s));o.length==0&&(o=this._platformLocation.pathname),this._platformLocation.replaceState(t,i,o)}forward(){this._platformLocation.forward()}back(){this._platformLocation.back()}getState(){return this._platformLocation.getState()}historyGo(t=0){this._platformLocation.historyGo?.(t)}static \u0275fac=function(i){return new(i||e)(S(ie),S(we,8))};static \u0275prov=y({token:e,factory:e.\u0275fac})}return e})(),Le=(()=>{class e{_subject=new ue;_basePath;_locationStrategy;_urlChangeListeners=[];_urlChangeSubscription=null;constructor(t){this._locationStrategy=t;let i=this._locationStrategy.getBaseHref();this._basePath=Be(ge(De(i))),this._locationStrategy.onPopState(r=>{this._subject.next({url:this.path(!0),pop:!0,state:r.state,type:r.type})})}ngOnDestroy(){this._urlChangeSubscription?.unsubscribe(),this._urlChangeListeners=[]}path(t=!1){return this.normalize(this._locationStrategy.path(t))}getState(){return this._locationStrategy.getState()}isCurrentPathEqualTo(t,i=""){return this.path()==this.normalize(t+w(i))}normalize(t){return e.stripTrailingSlash(Te(this._basePath,De(t)))}prepareExternalUrl(t){return t&&t[0]!=="/"&&(t="/"+t),this._locationStrategy.prepareExternalUrl(t)}go(t,i="",r=null){this._locationStrategy.pushState(r,"",t,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(t+w(i)),r)}replaceState(t,i="",r=null){this._locationStrategy.replaceState(r,"",t,i),this._notifyUrlChangeListeners(this.prepareExternalUrl(t+w(i)),r)}forward(){this._locationStrategy.forward()}back(){this._locationStrategy.back()}historyGo(t=0){this._locationStrategy.historyGo?.(t)}onUrlChange(t){return this._urlChangeListeners.push(t),this._urlChangeSubscription??=this.subscribe(i=>{this._notifyUrlChangeListeners(i.url,i.state)}),()=>{let i=this._urlChangeListeners.indexOf(t);this._urlChangeListeners.splice(i,1),this._urlChangeListeners.length===0&&(this._urlChangeSubscription?.unsubscribe(),this._urlChangeSubscription=null)}}_notifyUrlChangeListeners(t="",i){this._urlChangeListeners.forEach(r=>r(t,i))}subscribe(t,i,r){return this._subject.subscribe({next:t,error:i??void 0,complete:r??void 0})}static normalizeQueryParams=w;static joinWithSlash=re;static stripTrailingSlash=ge;static \u0275fac=function(i){return new(i||e)(S(z))};static \u0275prov=y({token:e,factory:()=>Me(),providedIn:"root"})}return e})();function Me(){return new Le(S(z))}function Te(e,n){if(!e||!n.startsWith(e))return n;let t=n.substring(e.length);return t===""||["/",";","?","#"].includes(t[0])?t:n}function De(e){return e.replace(/\/index.html$/,"")}function Be(e){if(new RegExp("^(https?:)?//").test(e)){let[,t]=e.split(/\/\/[^\/]+/);return t}return e}var f=function(e){return e[e.Format=0]="Format",e[e.Standalone=1]="Standalone",e}(f||{}),a=function(e){return e[e.Narrow=0]="Narrow",e[e.Abbreviated=1]="Abbreviated",e[e.Wide=2]="Wide",e[e.Short=3]="Short",e}(a||{}),h=function(e){return e[e.Short=0]="Short",e[e.Medium=1]="Medium",e[e.Long=2]="Long",e[e.Full=3]="Full",e}(h||{}),_={Decimal:0,Group:1,List:2,PercentSign:3,PlusSign:4,MinusSign:5,Exponential:6,SuperscriptingExponent:7,PerMille:8,Infinity:9,NaN:10,TimeSeparator:11,CurrencyDecimal:12,CurrencyGroup:13};function Re(e){return g(e)[d.LocaleId]}function Oe(e,n,t){let i=g(e),r=[i[d.DayPeriodsFormat],i[d.DayPeriodsStandalone]],s=D(r,n);return D(s,t)}function Pe(e,n,t){let i=g(e),r=[i[d.DaysFormat],i[d.DaysStandalone]],s=D(r,n);return D(s,t)}function Ne(e,n,t){let i=g(e),r=[i[d.MonthsFormat],i[d.MonthsStandalone]],s=D(r,n);return D(s,t)}function ke(e,n){let i=g(e)[d.Eras];return D(i,n)}function B(e,n){let t=g(e);return D(t[d.DateFormat],n)}function R(e,n){let t=g(e);return D(t[d.TimeFormat],n)}function O(e,n){let i=g(e)[d.DateTimeFormat];return D(i,n)}function V(e,n){let t=g(e),i=t[d.NumberSymbols][n];if(typeof i>"u"){if(n===_.CurrencyDecimal)return t[d.NumberSymbols][_.Decimal];if(n===_.CurrencyGroup)return t[d.NumberSymbols][_.Group]}return i}function Ae(e){if(!e[d.ExtraData])throw new Error(`Missing extra locale data for the locale "${e[d.LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`)}function $e(e){let n=g(e);return Ae(n),(n[d.ExtraData][2]||[]).map(i=>typeof i=="string"?K(i):[K(i[0]),K(i[1])])}function xe(e,n,t){let i=g(e);Ae(i);let r=[i[d.ExtraData][0],i[d.ExtraData][1]],s=D(r,n)||[];return D(s,t)||[]}function D(e,n){for(let t=n;t>-1;t--)if(typeof e[t]<"u")return e[t];throw new Error("Locale data API: locale data undefined")}function K(e){let[n,t]=e.split(":");return{hours:+n,minutes:+t}}var Ue=/^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,P={},ze=/((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;function Ve(e,n,t,i){let r=qe(e);n=E(t,n)||n;let o=[],u;for(;n;)if(u=ze.exec(n),u){o=o.concat(u.slice(1));let F=o.pop();if(!F)break;n=F}else{o.push(n);break}let p=r.getTimezoneOffset();i&&(p=_e(i,p),r=Xe(r,i,!0));let A="";return o.forEach(F=>{let b=We(F);A+=b?b(r,t,p):F==="''"?"'":F.replace(/(^'|'$)/g,"").replace(/''/g,"'")}),A}function U(e,n,t){let i=new Date(0);return i.setFullYear(e,n,t),i.setHours(0,0,0),i}function E(e,n){let t=Re(e);if(P[t]??={},P[t][n])return P[t][n];let i="";switch(n){case"shortDate":i=B(e,h.Short);break;case"mediumDate":i=B(e,h.Medium);break;case"longDate":i=B(e,h.Long);break;case"fullDate":i=B(e,h.Full);break;case"shortTime":i=R(e,h.Short);break;case"mediumTime":i=R(e,h.Medium);break;case"longTime":i=R(e,h.Long);break;case"fullTime":i=R(e,h.Full);break;case"short":let r=E(e,"shortTime"),s=E(e,"shortDate");i=N(O(e,h.Short),[r,s]);break;case"medium":let o=E(e,"mediumTime"),u=E(e,"mediumDate");i=N(O(e,h.Medium),[o,u]);break;case"long":let p=E(e,"longTime"),A=E(e,"longDate");i=N(O(e,h.Long),[p,A]);break;case"full":let F=E(e,"fullTime"),b=E(e,"fullDate");i=N(O(e,h.Full),[F,b]);break}return i&&(P[t][n]=i),i}function N(e,n){return n&&(e=e.replace(/\{([^}]+)}/g,function(t,i){return n!=null&&i in n?n[i]:t})),e}function C(e,n,t="-",i,r){let s="";(e<0||r&&e<=0)&&(r?e=-e+1:(e=-e,s=t));let o=String(e);for(;o.length<n;)o="0"+o;return i&&(o=o.slice(o.length-n)),s+o}function je(e,n){return C(e,3).substring(0,n)}function l(e,n,t=0,i=!1,r=!1){return function(s,o){let u=Ge(e,s);if((t>0||u>-t)&&(u+=t),e===3)u===0&&t===-12&&(u=12);else if(e===6)return je(u,n);let p=V(o,_.MinusSign);return C(u,n,p,i,r)}}function Ge(e,n){switch(e){case 0:return n.getFullYear();case 1:return n.getMonth();case 2:return n.getDate();case 3:return n.getHours();case 4:return n.getMinutes();case 5:return n.getSeconds();case 6:return n.getMilliseconds();case 7:return n.getDay();default:throw new Error(`Unknown DateType value "${e}".`)}}function c(e,n,t=f.Format,i=!1){return function(r,s){return He(r,s,e,n,t,i)}}function He(e,n,t,i,r,s){switch(t){case 2:return Ne(n,r,i)[e.getMonth()];case 1:return Pe(n,r,i)[e.getDay()];case 0:let o=e.getHours(),u=e.getMinutes();if(s){let A=$e(n),F=xe(n,r,i),b=A.findIndex(L=>{if(Array.isArray(L)){let[j,M]=L,se=o>=j.hours&&u>=j.minutes,oe=o<M.hours||o===M.hours&&u<M.minutes;if(j.hours<M.hours){if(se&&oe)return!0}else if(se||oe)return!0}else if(L.hours===o&&L.minutes===u)return!0;return!1});if(b!==-1)return F[b]}return Oe(n,r,i)[o<12?0:1];case 3:return ke(n,i)[e.getFullYear()<=0?0:1];default:let p=t;throw new Error(`unexpected translation type ${p}`)}}function k(e){return function(n,t,i){let r=-1*i,s=V(t,_.MinusSign),o=r>0?Math.floor(r/60):Math.ceil(r/60);switch(e){case 0:return(r>=0?"+":"")+C(o,2,s)+C(Math.abs(r%60),2,s);case 1:return"GMT"+(r>=0?"+":"")+C(o,1,s);case 2:return"GMT"+(r>=0?"+":"")+C(o,2,s)+":"+C(Math.abs(r%60),2,s);case 3:return i===0?"Z":(r>=0?"+":"")+C(o,2,s)+":"+C(Math.abs(r%60),2,s);default:throw new Error(`Unknown zone width "${e}"`)}}}var Ze=0,x=4;function Ye(e){let n=U(e,Ze,1).getDay();return U(e,0,1+(n<=x?x:x+7)-n)}function Se(e){let n=e.getDay(),t=n===0?-3:x-n;return U(e.getFullYear(),e.getMonth(),e.getDate()+t)}function X(e,n=!1){return function(t,i){let r;if(n){let s=new Date(t.getFullYear(),t.getMonth(),1).getDay()-1,o=t.getDate();r=1+Math.floor((o+s)/7)}else{let s=Se(t),o=Ye(s.getFullYear()),u=s.getTime()-o.getTime();r=1+Math.round(u/6048e5)}return C(r,e,V(i,_.MinusSign))}}function $(e,n=!1){return function(t,i){let s=Se(t).getFullYear();return C(s,e,V(i,_.MinusSign),n)}}var q={};function We(e){if(q[e])return q[e];let n;switch(e){case"G":case"GG":case"GGG":n=c(3,a.Abbreviated);break;case"GGGG":n=c(3,a.Wide);break;case"GGGGG":n=c(3,a.Narrow);break;case"y":n=l(0,1,0,!1,!0);break;case"yy":n=l(0,2,0,!0,!0);break;case"yyy":n=l(0,3,0,!1,!0);break;case"yyyy":n=l(0,4,0,!1,!0);break;case"Y":n=$(1);break;case"YY":n=$(2,!0);break;case"YYY":n=$(3);break;case"YYYY":n=$(4);break;case"M":case"L":n=l(1,1,1);break;case"MM":case"LL":n=l(1,2,1);break;case"MMM":n=c(2,a.Abbreviated);break;case"MMMM":n=c(2,a.Wide);break;case"MMMMM":n=c(2,a.Narrow);break;case"LLL":n=c(2,a.Abbreviated,f.Standalone);break;case"LLLL":n=c(2,a.Wide,f.Standalone);break;case"LLLLL":n=c(2,a.Narrow,f.Standalone);break;case"w":n=X(1);break;case"ww":n=X(2);break;case"W":n=X(1,!0);break;case"d":n=l(2,1);break;case"dd":n=l(2,2);break;case"c":case"cc":n=l(7,1);break;case"ccc":n=c(1,a.Abbreviated,f.Standalone);break;case"cccc":n=c(1,a.Wide,f.Standalone);break;case"ccccc":n=c(1,a.Narrow,f.Standalone);break;case"cccccc":n=c(1,a.Short,f.Standalone);break;case"E":case"EE":case"EEE":n=c(1,a.Abbreviated);break;case"EEEE":n=c(1,a.Wide);break;case"EEEEE":n=c(1,a.Narrow);break;case"EEEEEE":n=c(1,a.Short);break;case"a":case"aa":case"aaa":n=c(0,a.Abbreviated);break;case"aaaa":n=c(0,a.Wide);break;case"aaaaa":n=c(0,a.Narrow);break;case"b":case"bb":case"bbb":n=c(0,a.Abbreviated,f.Standalone,!0);break;case"bbbb":n=c(0,a.Wide,f.Standalone,!0);break;case"bbbbb":n=c(0,a.Narrow,f.Standalone,!0);break;case"B":case"BB":case"BBB":n=c(0,a.Abbreviated,f.Format,!0);break;case"BBBB":n=c(0,a.Wide,f.Format,!0);break;case"BBBBB":n=c(0,a.Narrow,f.Format,!0);break;case"h":n=l(3,1,-12);break;case"hh":n=l(3,2,-12);break;case"H":n=l(3,1);break;case"HH":n=l(3,2);break;case"m":n=l(4,1);break;case"mm":n=l(4,2);break;case"s":n=l(5,1);break;case"ss":n=l(5,2);break;case"S":n=l(6,1);break;case"SS":n=l(6,2);break;case"SSS":n=l(6,3);break;case"Z":case"ZZ":case"ZZZ":n=k(0);break;case"ZZZZZ":n=k(3);break;case"O":case"OO":case"OOO":case"z":case"zz":case"zzz":n=k(1);break;case"OOOO":case"ZZZZ":case"zzzz":n=k(2);break;default:return null}return q[e]=n,n}function _e(e,n){e=e.replace(/:/g,"");let t=Date.parse("Jan 01, 1970 00:00:00 "+e)/6e4;return isNaN(t)?n:t}function Ke(e,n){return e=new Date(e.getTime()),e.setMinutes(e.getMinutes()+n),e}function Xe(e,n,t){let i=t?-1:1,r=e.getTimezoneOffset(),s=_e(n,r);return Ke(e,i*(s-r))}function qe(e){if(pe(e))return e;if(typeof e=="number"&&!isNaN(e))return new Date(e);if(typeof e=="string"){if(e=e.trim(),/^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(e)){let[r,s=1,o=1]=e.split("-").map(u=>+u);return U(r,s-1,o)}let t=parseFloat(e);if(!isNaN(e-t))return new Date(t);let i;if(i=e.match(Ue))return Je(i)}let n=new Date(e);if(!pe(n))throw new Error(`Unable to convert "${e}" into a date`);return n}function Je(e){let n=new Date(0),t=0,i=0,r=e[8]?n.setUTCFullYear:n.setFullYear,s=e[8]?n.setUTCHours:n.setHours;e[9]&&(t=Number(e[9]+e[10]),i=Number(e[9]+e[11])),r.call(n,Number(e[1]),Number(e[2])-1,Number(e[3]));let o=Number(e[4]||0)-t,u=Number(e[5]||0)-i,p=Number(e[6]||0),A=Math.floor(parseFloat("0."+(e[7]||0))*1e3);return s.call(n,o,u,p,A),n}function pe(e){return e instanceof Date&&!isNaN(e.valueOf())}function en(e,n){n=encodeURIComponent(n);for(let t of e.split(";")){let i=t.indexOf("="),[r,s]=i==-1?[t,""]:[t.slice(0,i),t.slice(i+1)];if(r.trim()===n)return decodeURIComponent(s)}return null}var J=/\s+/,me=[],tn=(()=>{class e{_ngEl;_renderer;initialClasses=me;rawClass;stateMap=new Map;constructor(t,i){this._ngEl=t,this._renderer=i}set klass(t){this.initialClasses=t!=null?t.trim().split(J):me}set ngClass(t){this.rawClass=typeof t=="string"?t.trim().split(J):t}ngDoCheck(){for(let i of this.initialClasses)this._updateState(i,!0);let t=this.rawClass;if(Array.isArray(t)||t instanceof Set)for(let i of t)this._updateState(i,!0);else if(t!=null)for(let i of Object.keys(t))this._updateState(i,!!t[i]);this._applyStateDiff()}_updateState(t,i){let r=this.stateMap.get(t);r!==void 0?(r.enabled!==i&&(r.changed=!0,r.enabled=i),r.touched=!0):this.stateMap.set(t,{enabled:i,changed:!0,touched:!0})}_applyStateDiff(){for(let t of this.stateMap){let i=t[0],r=t[1];r.changed?(this._toggleClass(i,r.enabled),r.changed=!1):r.touched||(r.enabled&&this._toggleClass(i,!1),this.stateMap.delete(i)),r.touched=!1}}_toggleClass(t,i){t=t.trim(),t.length>0&&t.split(J).forEach(r=>{i?this._renderer.addClass(this._ngEl.nativeElement,r):this._renderer.removeClass(this._ngEl.nativeElement,r)})}static \u0275fac=function(i){return new(i||e)(m(G),m(Z))};static \u0275dir=T({type:e,selectors:[["","ngClass",""]],inputs:{klass:[0,"class","klass"],ngClass:"ngClass"}})}return e})();var Q=class{$implicit;ngForOf;index;count;constructor(n,t,i,r){this.$implicit=n,this.ngForOf=t,this.index=i,this.count=r}get first(){return this.index===0}get last(){return this.index===this.count-1}get even(){return this.index%2===0}get odd(){return!this.even}},nn=(()=>{class e{_viewContainer;_template;_differs;set ngForOf(t){this._ngForOf=t,this._ngForOfDirty=!0}set ngForTrackBy(t){this._trackByFn=t}get ngForTrackBy(){return this._trackByFn}_ngForOf=null;_ngForOfDirty=!0;_differ=null;_trackByFn;constructor(t,i,r){this._viewContainer=t,this._template=i,this._differs=r}set ngForTemplate(t){t&&(this._template=t)}ngDoCheck(){if(this._ngForOfDirty){this._ngForOfDirty=!1;let t=this._ngForOf;!this._differ&&t&&(this._differ=this._differs.find(t).create(this.ngForTrackBy))}if(this._differ){let t=this._differ.diff(this._ngForOf);t&&this._applyChanges(t)}}_applyChanges(t){let i=this._viewContainer;t.forEachOperation((r,s,o)=>{if(r.previousIndex==null)i.createEmbeddedView(this._template,new Q(r.item,this._ngForOf,-1,-1),o===null?void 0:o);else if(o==null)i.remove(s===null?void 0:s);else if(s!==null){let u=i.get(s);i.move(u,o),Ce(u,r)}});for(let r=0,s=i.length;r<s;r++){let u=i.get(r).context;u.index=r,u.count=s,u.ngForOf=this._ngForOf}t.forEachIdentityChange(r=>{let s=i.get(r.currentIndex);Ce(s,r)})}static ngTemplateContextGuard(t,i){return!0}static \u0275fac=function(i){return new(i||e)(m(Y),m(H),m(fe))};static \u0275dir=T({type:e,selectors:[["","ngFor","","ngForOf",""]],inputs:{ngForOf:"ngForOf",ngForTrackBy:"ngForTrackBy",ngForTemplate:"ngForTemplate"}})}return e})();function Ce(e,n){e.context.$implicit=n.item}var rn=(()=>{class e{_viewContainer;_context=new ee;_thenTemplateRef=null;_elseTemplateRef=null;_thenViewRef=null;_elseViewRef=null;constructor(t,i){this._viewContainer=t,this._thenTemplateRef=i}set ngIf(t){this._context.$implicit=this._context.ngIf=t,this._updateView()}set ngIfThen(t){Fe("ngIfThen",t),this._thenTemplateRef=t,this._thenViewRef=null,this._updateView()}set ngIfElse(t){Fe("ngIfElse",t),this._elseTemplateRef=t,this._elseViewRef=null,this._updateView()}_updateView(){this._context.$implicit?this._thenViewRef||(this._viewContainer.clear(),this._elseViewRef=null,this._thenTemplateRef&&(this._thenViewRef=this._viewContainer.createEmbeddedView(this._thenTemplateRef,this._context))):this._elseViewRef||(this._viewContainer.clear(),this._thenViewRef=null,this._elseTemplateRef&&(this._elseViewRef=this._viewContainer.createEmbeddedView(this._elseTemplateRef,this._context)))}static ngIfUseIfTypeGuard;static ngTemplateGuard_ngIf;static ngTemplateContextGuard(t,i){return!0}static \u0275fac=function(i){return new(i||e)(m(Y),m(H))};static \u0275dir=T({type:e,selectors:[["","ngIf",""]],inputs:{ngIf:"ngIf",ngIfThen:"ngIfThen",ngIfElse:"ngIfElse"}})}return e})(),ee=class{$implicit=null;ngIf=null};function Fe(e,n){if(!!!(!n||n.createEmbeddedView))throw new Error(`${e} must be a TemplateRef, but received '${ce(n)}'.`)}function Qe(e,n){return new ae(2100,!1)}var et="mediumDate",tt=new v(""),nt=new v(""),sn=(()=>{class e{locale;defaultTimezone;defaultOptions;constructor(t,i,r){this.locale=t,this.defaultTimezone=i,this.defaultOptions=r}transform(t,i,r,s){if(t==null||t===""||t!==t)return null;try{let o=i??this.defaultOptions?.dateFormat??et,u=r??this.defaultOptions?.timezone??this.defaultTimezone??void 0;return Ve(t,o,s||this.locale,u)}catch(o){throw Qe(e,o.message)}}static \u0275fac=function(i){return new(i||e)(m(le,16),m(tt,24),m(nt,24))};static \u0275pipe=de({name:"date",type:e,pure:!0})}return e})();var it="browser",rt="server";function on(e){return e===it}function un(e){return e===rt}var an=(()=>{class e{static \u0275prov=y({token:e,providedIn:"root",factory:()=>new te(I(ne),window)})}return e})(),te=class{document;window;offset=()=>[0,0];constructor(n,t){this.document=n,this.window=t}setOffset(n){Array.isArray(n)?this.offset=()=>n:this.offset=n}getScrollPosition(){return[this.window.scrollX,this.window.scrollY]}scrollToPosition(n){this.window.scrollTo(n[0],n[1])}scrollToAnchor(n){let t=st(this.document,n);t&&(this.scrollToElement(t),t.focus())}setHistoryScrollRestoration(n){this.window.history.scrollRestoration=n}scrollToElement(n){let t=n.getBoundingClientRect(),i=t.left+this.window.pageXOffset,r=t.top+this.window.pageYOffset,s=this.offset();this.window.scrollTo(i-s[0],r-s[1])}};function st(e,n){let t=e.getElementById(n)||e.getElementsByName(n)[0];if(t)return t;if(typeof e.createTreeWalker=="function"&&e.body&&typeof e.body.attachShadow=="function"){let i=e.createTreeWalker(e.body,NodeFilter.SHOW_ELEMENT),r=i.currentNode;for(;r;){let s=r.shadowRoot;if(s){let o=s.getElementById(n)||s.querySelector(`[name="${n}"]`);if(o)return o}r=i.nextNode()}}return null}var ye=class{};export{W as a,qt as b,he as c,ne as d,Jt as e,z as f,Ie as g,Qt as h,Le as i,en as j,tn as k,nn as l,rn as m,sn as n,it as o,on as p,un as q,an as r,ye as s};
