!function(){"use strict";var t=function(){return(t=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},e=[].slice,n={};function r(t){this._size=t,this._call=this._error=null,this._tasks=[],this._data=[],this._waiting=this._active=this._ended=this._start=0}function o(t){if(!t._start)try{!function(t){for(;t._start=t._waiting&&t._active<t._size;){var e=t._ended+t._active,r=t._tasks[e],o=r.length-1,u=r[o];r[o]=i(t,e),--t._waiting,++t._active,r=u.apply(null,r),t._tasks[e]&&(t._tasks[e]=r||n)}}(t)}catch(e){if(t._tasks[t._ended+t._active-1])u(t,e);else if(!t._data)throw e}}function i(t,e){return function(n,r){t._tasks[e]&&(--t._active,++t._ended,t._tasks[e]=null,null==t._error&&(null!=n?u(t,n):(t._data[e]=r,t._waiting?o(t):a(t))))}}function u(t,e){var n,r=t._tasks.length;for(t._error=e,t._data=void 0,t._waiting=NaN;--r>=0;)if((n=t._tasks[r])&&(t._tasks[r]=null,n.abort))try{n.abort()}catch(e){}t._active=NaN,a(t)}function a(t){if(!t._active&&t._call){var e=t._data;t._data=void 0,t._call(t._error,e)}}function c(t){if(null==t)t=1/0;else if(!((t=+t)>=1))throw new Error("invalid concurrency");return new r(t)}r.prototype=c.prototype={constructor:r,defer:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("defer after await");if(null!=this._error)return this;var n=e.call(arguments,1);return n.push(t),++this._waiting,this._tasks.push(n),o(this),this},abort:function(){return null==this._error&&u(this,new Error("abort")),this},await:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("multiple await");return this._call=function(e,n){t.apply(null,[e].concat(n))},a(this),this},awaitAll:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("multiple await");return this._call=t,a(this),this}};function s(){}function l(t,e){var n=new s;if(t instanceof s)t.each(function(t,e){n.set(e,t)});else if(Array.isArray(t)){var r,o=-1,i=t.length;if(null==e)for(;++o<i;)n.set(o,t[o]);else for(;++o<i;)n.set(e(r=t[o],o,t),r)}else if(t)for(var u in t)n.set(u,t[u]);return n}function f(){}s.prototype=l.prototype={constructor:s,has:function(t){return"$"+t in this},get:function(t){return this["$"+t]},set:function(t,e){return this["$"+t]=e,this},remove:function(t){var e="$"+t;return e in this&&delete this[e]},clear:function(){for(var t in this)"$"===t[0]&&delete this[t]},keys:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(e.slice(1));return t},values:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(this[e]);return t},entries:function(){var t=[];for(var e in this)"$"===e[0]&&t.push({key:e.slice(1),value:this[e]});return t},size:function(){var t=0;for(var e in this)"$"===e[0]&&++t;return t},empty:function(){for(var t in this)if("$"===t[0])return!1;return!0},each:function(t){for(var e in this)"$"===e[0]&&t(this[e],e.slice(1),this)}};var g=l.prototype;f.prototype=function(t,e){var n=new f;if(t instanceof f)t.each(function(t){n.add(t)});else if(t){var r=-1,o=t.length;if(null==e)for(;++r<o;)n.add(t[r]);else for(;++r<o;)n.add(e(t[r],r,t))}return n}.prototype={constructor:f,has:g.has,add:function(t){return this["$"+(t+="")]=t,this},remove:g.remove,clear:g.clear,values:g.keys,size:g.size,empty:g.empty,each:g.each};var d={value:function(){}};function h(){for(var t,e=0,n=arguments.length,r={};e<n;++e){if(!(t=arguments[e]+"")||t in r)throw new Error("illegal type: "+t);r[t]=[]}return new m(r)}function m(t){this._=t}function v(t,e){return t.trim().split(/^|\s+/).map(function(t){var n="",r=t.indexOf(".");if(r>=0&&(n=t.slice(r+1),t=t.slice(0,r)),t&&!e.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:n}})}function p(t,e){for(var n,r=0,o=t.length;r<o;++r)if((n=t[r]).name===e)return n.value}function w(t,e,n){for(var r=0,o=t.length;r<o;++r)if(t[r].name===e){t[r]=d,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=n&&t.push({name:e,value:n}),t}m.prototype=h.prototype={constructor:m,on:function(t,e){var n,r=this._,o=v(t+"",r),i=-1,u=o.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++i<u;)if(n=(t=o[i]).type)r[n]=w(r[n],t.name,e);else if(null==e)for(n in r)r[n]=w(r[n],t.name,null);return this}for(;++i<u;)if((n=(t=o[i]).type)&&(n=p(r[n],t.name)))return n},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new m(t)},call:function(t,e){if((n=arguments.length-2)>0)for(var n,r,o=new Array(n),i=0;i<n;++i)o[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(i=0,n=(r=this._[t]).length;i<n;++i)r[i].value.apply(e,o)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],o=0,i=r.length;o<i;++o)r[o].value.apply(e,n)}};var y,T,C=(y="application/json",T=function(t){return JSON.parse(t.responseText)},function(t,e){var n=function(t,e){var n,r,o,i,u=h("beforesend","progress","load","error"),a=l(),c=new XMLHttpRequest,s=null,f=null,g=0;function d(t){var e,r=c.status;if(!r&&function(t){var e=t.responseType;return e&&"text"!==e?t.response:t.responseText}(c)||r>=200&&r<300||304===r){if(o)try{e=o.call(n,c)}catch(t){return void u.call("error",n,t)}else e=c;u.call("load",n,e)}else u.call("error",n,t)}if("undefined"==typeof XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(t)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=c.ontimeout=d:c.onreadystatechange=function(t){c.readyState>3&&d(t)},c.onprogress=function(t){u.call("progress",n,t)},n={header:function(t,e){return t=(t+"").toLowerCase(),arguments.length<2?a.get(t):(null==e?a.remove(t):a.set(t,e+""),n)},mimeType:function(t){return arguments.length?(r=null==t?null:t+"",n):r},responseType:function(t){return arguments.length?(i=t,n):i},timeout:function(t){return arguments.length?(g=+t,n):g},user:function(t){return arguments.length<1?s:(s=null==t?null:t+"",n)},password:function(t){return arguments.length<1?f:(f=null==t?null:t+"",n)},response:function(t){return o=t,n},get:function(t,e){return n.send("GET",t,e)},post:function(t,e){return n.send("POST",t,e)},send:function(e,o,l){return c.open(e,t,!0,s,f),null==r||a.has("accept")||a.set("accept",r+",*/*"),c.setRequestHeader&&a.each(function(t,e){c.setRequestHeader(e,t)}),null!=r&&c.overrideMimeType&&c.overrideMimeType(r),null!=i&&(c.responseType=i),g>0&&(c.timeout=g),null==l&&"function"==typeof o&&(l=o,o=null),null!=l&&1===l.length&&(l=function(t){return function(e,n){t(null==e?n:null)}}(l)),null!=l&&n.on("error",l).on("load",function(t){l(null,t)}),u.call("beforesend",n,c),c.send(null==o?null:o),n},abort:function(){return c.abort(),n},on:function(){var t=u.on.apply(u,arguments);return t===u?n:t}},null!=e){if("function"!=typeof e)throw new Error("invalid callback: "+e);return n.get(e)}return n}(t).mimeType(y).response(T);if(null!=e){if("function"!=typeof e)throw new Error("invalid callback: "+e);return n.get(e)}return n}),_={},M={},U=34,b=10,D=13;function S(t){return new Function("d","return {"+t.map(function(t,e){return JSON.stringify(t)+": d["+e+"]"}).join(",")+"}")}function E(t){var e=Object.create(null),n=[];return t.forEach(function(t){for(var r in t)r in e||n.push(e[r]=r)}),n}function I(t,e){var n=t+"",r=n.length;return r<e?new Array(e-r+1).join(0)+n:n}function x(t){var e=t.getUTCHours(),n=t.getUTCMinutes(),r=t.getUTCSeconds(),o=t.getUTCMilliseconds();return isNaN(t)?"Invalid Date":function(t){return t<0?"-"+I(-t,6):t>9999?"+"+I(t,6):I(t,4)}(t.getUTCFullYear())+"-"+I(t.getUTCMonth()+1,2)+"-"+I(t.getUTCDate(),2)+(o?"T"+I(e,2)+":"+I(n,2)+":"+I(r,2)+"."+I(o,3)+"Z":r?"T"+I(e,2)+":"+I(n,2)+":"+I(r,2)+"Z":n||e?"T"+I(e,2)+":"+I(n,2)+"Z":"")}function k(t){var e=new RegExp('["'+t+"\n\r]"),n=t.charCodeAt(0);function r(t,e){var r,o=[],i=t.length,u=0,a=0,c=i<=0,s=!1;function l(){if(c)return M;if(s)return s=!1,_;var e,r,o=u;if(t.charCodeAt(o)===U){for(;u++<i&&t.charCodeAt(u)!==U||t.charCodeAt(++u)===U;);return(e=u)>=i?c=!0:(r=t.charCodeAt(u++))===b?s=!0:r===D&&(s=!0,t.charCodeAt(u)===b&&++u),t.slice(o+1,e-1).replace(/""/g,'"')}for(;u<i;){if((r=t.charCodeAt(e=u++))===b)s=!0;else if(r===D)s=!0,t.charCodeAt(u)===b&&++u;else if(r!==n)continue;return t.slice(o,e)}return c=!0,t.slice(o,i)}for(t.charCodeAt(i-1)===b&&--i,t.charCodeAt(i-1)===D&&--i;(r=l())!==M;){for(var f=[];r!==_&&r!==M;)f.push(r),r=l();e&&null==(f=e(f,a++))||o.push(f)}return o}function o(e,n){return e.map(function(e){return n.map(function(t){return u(e[t])}).join(t)})}function i(e){return e.map(u).join(t)}function u(t){return null==t?"":t instanceof Date?x(t):e.test(t+="")?'"'+t.replace(/"/g,'""')+'"':t}return{parse:function(t,e){var n,o,i=r(t,function(t,r){if(n)return n(t,r-1);o=t,n=e?function(t,e){var n=S(t);return function(r,o){return e(n(r),o,t)}}(t,e):S(t)});return i.columns=o||[],i},parseRows:r,format:function(e,n){return null==n&&(n=E(e)),[n.map(u).join(t)].concat(o(e,n)).join("\n")},formatBody:function(t,e){return null==e&&(e=E(t)),o(t,e).join("\n")},formatRows:function(t){return t.map(i).join("\n")}}}k(","),k("\t");var A=new Date,Y=new Date;function F(t,e,n,r){function o(e){return t(e=new Date(+e)),e}return o.floor=o,o.ceil=function(n){return t(n=new Date(n-1)),e(n,1),t(n),n},o.round=function(t){var e=o(t),n=o.ceil(t);return t-e<n-t?e:n},o.offset=function(t,n){return e(t=new Date(+t),null==n?1:Math.floor(n)),t},o.range=function(n,r,i){var u,a=[];if(n=o.ceil(n),i=null==i?1:Math.floor(i),!(n<r&&i>0))return a;do{a.push(u=new Date(+n)),e(n,i),t(n)}while(u<n&&n<r);return a},o.filter=function(n){return F(function(e){if(e>=e)for(;t(e),!n(e);)e.setTime(e-1)},function(t,r){if(t>=t)if(r<0)for(;++r<=0;)for(;e(t,-1),!n(t););else for(;--r>=0;)for(;e(t,1),!n(t););})},n&&(o.count=function(e,r){return A.setTime(+e),Y.setTime(+r),t(A),t(Y),Math.floor(n(A,Y))},o.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?o.filter(r?function(e){return r(e)%t==0}:function(e){return o.count(0,e)%t==0}):o:null}),o}var H=F(function(){},function(t,e){t.setTime(+t+e)},function(t,e){return e-t});H.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?F(function(e){e.setTime(Math.floor(e/t)*t)},function(e,n){e.setTime(+e+n*t)},function(e,n){return(n-e)/t}):H:null};var L=6e4,O=6048e5,j=(F(function(t){t.setTime(t-t.getMilliseconds())},function(t,e){t.setTime(+t+1e3*e)},function(t,e){return(e-t)/1e3},function(t){return t.getUTCSeconds()}),F(function(t){t.setTime(t-t.getMilliseconds()-1e3*t.getSeconds())},function(t,e){t.setTime(+t+e*L)},function(t,e){return(e-t)/L},function(t){return t.getMinutes()}),F(function(t){t.setTime(t-t.getMilliseconds()-1e3*t.getSeconds()-t.getMinutes()*L)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getHours()}),F(function(t){t.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*L)/864e5},function(t){return t.getDate()-1}));function B(t){return F(function(e){e.setDate(e.getDate()-(e.getDay()+7-t)%7),e.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+7*e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*L)/O})}var N=B(0),R=B(1),Z=(B(2),B(3),B(4)),G=(B(5),B(6),F(function(t){t.setDate(1),t.setHours(0,0,0,0)},function(t,e){t.setMonth(t.getMonth()+e)},function(t,e){return e.getMonth()-t.getMonth()+12*(e.getFullYear()-t.getFullYear())},function(t){return t.getMonth()}),F(function(t){t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,e){t.setFullYear(t.getFullYear()+e)},function(t,e){return e.getFullYear()-t.getFullYear()},function(t){return t.getFullYear()}));G.every=function(t){return isFinite(t=Math.floor(t))&&t>0?F(function(e){e.setFullYear(Math.floor(e.getFullYear()/t)*t),e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,n){e.setFullYear(e.getFullYear()+n*t)}):null};F(function(t){t.setUTCSeconds(0,0)},function(t,e){t.setTime(+t+e*L)},function(t,e){return(e-t)/L},function(t){return t.getUTCMinutes()}),F(function(t){t.setUTCMinutes(0,0,0)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getUTCHours()});var P=F(function(t){t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+e)},function(t,e){return(e-t)/864e5},function(t){return t.getUTCDate()-1});function $(t){return F(function(e){e.setUTCDate(e.getUTCDate()-(e.getUTCDay()+7-t)%7),e.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+7*e)},function(t,e){return(e-t)/O})}var z=$(0),W=$(1),V=($(2),$(3),$(4)),X=($(5),$(6),F(function(t){t.setUTCDate(1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCMonth(t.getUTCMonth()+e)},function(t,e){return e.getUTCMonth()-t.getUTCMonth()+12*(e.getUTCFullYear()-t.getUTCFullYear())},function(t){return t.getUTCMonth()}),F(function(t){t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCFullYear(t.getUTCFullYear()+e)},function(t,e){return e.getUTCFullYear()-t.getUTCFullYear()},function(t){return t.getUTCFullYear()}));function J(t){if(0<=t.y&&t.y<100){var e=new Date(-1,t.m,t.d,t.H,t.M,t.S,t.L);return e.setFullYear(t.y),e}return new Date(t.y,t.m,t.d,t.H,t.M,t.S,t.L)}function Q(t){if(0<=t.y&&t.y<100){var e=new Date(Date.UTC(-1,t.m,t.d,t.H,t.M,t.S,t.L));return e.setUTCFullYear(t.y),e}return new Date(Date.UTC(t.y,t.m,t.d,t.H,t.M,t.S,t.L))}function q(t){return{y:t,m:0,d:1,H:0,M:0,S:0,L:0}}X.every=function(t){return isFinite(t=Math.floor(t))&&t>0?F(function(e){e.setUTCFullYear(Math.floor(e.getUTCFullYear()/t)*t),e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,n){e.setUTCFullYear(e.getUTCFullYear()+n*t)}):null};var K,tt,et,nt={"-":"",_:" ",0:"0"},rt=/^\s*\d+/,ot=/^%/,it=/[\\^$*+?|[\]().{}]/g;function ut(t,e,n){var r=t<0?"-":"",o=(r?-t:t)+"",i=o.length;return r+(i<n?new Array(n-i+1).join(e)+o:o)}function at(t){return t.replace(it,"\\$&")}function ct(t){return new RegExp("^(?:"+t.map(at).join("|")+")","i")}function st(t){for(var e={},n=-1,r=t.length;++n<r;)e[t[n].toLowerCase()]=n;return e}function lt(t,e,n){var r=rt.exec(e.slice(n,n+1));return r?(t.w=+r[0],n+r[0].length):-1}function ft(t,e,n){var r=rt.exec(e.slice(n,n+1));return r?(t.u=+r[0],n+r[0].length):-1}function gt(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.U=+r[0],n+r[0].length):-1}function dt(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.V=+r[0],n+r[0].length):-1}function ht(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.W=+r[0],n+r[0].length):-1}function mt(t,e,n){var r=rt.exec(e.slice(n,n+4));return r?(t.y=+r[0],n+r[0].length):-1}function vt(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.y=+r[0]+(+r[0]>68?1900:2e3),n+r[0].length):-1}function pt(t,e,n){var r=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n,n+6));return r?(t.Z=r[1]?0:-(r[2]+(r[3]||"00")),n+r[0].length):-1}function wt(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.m=r[0]-1,n+r[0].length):-1}function yt(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.d=+r[0],n+r[0].length):-1}function Tt(t,e,n){var r=rt.exec(e.slice(n,n+3));return r?(t.m=0,t.d=+r[0],n+r[0].length):-1}function Ct(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.H=+r[0],n+r[0].length):-1}function _t(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.M=+r[0],n+r[0].length):-1}function Mt(t,e,n){var r=rt.exec(e.slice(n,n+2));return r?(t.S=+r[0],n+r[0].length):-1}function Ut(t,e,n){var r=rt.exec(e.slice(n,n+3));return r?(t.L=+r[0],n+r[0].length):-1}function bt(t,e,n){var r=rt.exec(e.slice(n,n+6));return r?(t.L=Math.floor(r[0]/1e3),n+r[0].length):-1}function Dt(t,e,n){var r=ot.exec(e.slice(n,n+1));return r?n+r[0].length:-1}function St(t,e,n){var r=rt.exec(e.slice(n));return r?(t.Q=+r[0],n+r[0].length):-1}function Et(t,e,n){var r=rt.exec(e.slice(n));return r?(t.Q=1e3*+r[0],n+r[0].length):-1}function It(t,e){return ut(t.getDate(),e,2)}function xt(t,e){return ut(t.getHours(),e,2)}function kt(t,e){return ut(t.getHours()%12||12,e,2)}function At(t,e){return ut(1+j.count(G(t),t),e,3)}function Yt(t,e){return ut(t.getMilliseconds(),e,3)}function Ft(t,e){return Yt(t,e)+"000"}function Ht(t,e){return ut(t.getMonth()+1,e,2)}function Lt(t,e){return ut(t.getMinutes(),e,2)}function Ot(t,e){return ut(t.getSeconds(),e,2)}function jt(t){var e=t.getDay();return 0===e?7:e}function Bt(t,e){return ut(N.count(G(t),t),e,2)}function Nt(t,e){var n=t.getDay();return t=n>=4||0===n?Z(t):Z.ceil(t),ut(Z.count(G(t),t)+(4===G(t).getDay()),e,2)}function Rt(t){return t.getDay()}function Zt(t,e){return ut(R.count(G(t),t),e,2)}function Gt(t,e){return ut(t.getFullYear()%100,e,2)}function Pt(t,e){return ut(t.getFullYear()%1e4,e,4)}function $t(t){var e=t.getTimezoneOffset();return(e>0?"-":(e*=-1,"+"))+ut(e/60|0,"0",2)+ut(e%60,"0",2)}function zt(t,e){return ut(t.getUTCDate(),e,2)}function Wt(t,e){return ut(t.getUTCHours(),e,2)}function Vt(t,e){return ut(t.getUTCHours()%12||12,e,2)}function Xt(t,e){return ut(1+P.count(X(t),t),e,3)}function Jt(t,e){return ut(t.getUTCMilliseconds(),e,3)}function Qt(t,e){return Jt(t,e)+"000"}function qt(t,e){return ut(t.getUTCMonth()+1,e,2)}function Kt(t,e){return ut(t.getUTCMinutes(),e,2)}function te(t,e){return ut(t.getUTCSeconds(),e,2)}function ee(t){var e=t.getUTCDay();return 0===e?7:e}function ne(t,e){return ut(z.count(X(t),t),e,2)}function re(t,e){var n=t.getUTCDay();return t=n>=4||0===n?V(t):V.ceil(t),ut(V.count(X(t),t)+(4===X(t).getUTCDay()),e,2)}function oe(t){return t.getUTCDay()}function ie(t,e){return ut(W.count(X(t),t),e,2)}function ue(t,e){return ut(t.getUTCFullYear()%100,e,2)}function ae(t,e){return ut(t.getUTCFullYear()%1e4,e,4)}function ce(){return"+0000"}function se(){return"%"}function le(t){return+t}function fe(t){return Math.floor(+t/1e3)}K=function(t){var e=t.dateTime,n=t.date,r=t.time,o=t.periods,i=t.days,u=t.shortDays,a=t.months,c=t.shortMonths,s=ct(o),l=st(o),f=ct(i),g=st(i),d=ct(u),h=st(u),m=ct(a),v=st(a),p=ct(c),w=st(c),y={a:function(t){return u[t.getDay()]},A:function(t){return i[t.getDay()]},b:function(t){return c[t.getMonth()]},B:function(t){return a[t.getMonth()]},c:null,d:It,e:It,f:Ft,H:xt,I:kt,j:At,L:Yt,m:Ht,M:Lt,p:function(t){return o[+(t.getHours()>=12)]},Q:le,s:fe,S:Ot,u:jt,U:Bt,V:Nt,w:Rt,W:Zt,x:null,X:null,y:Gt,Y:Pt,Z:$t,"%":se},T={a:function(t){return u[t.getUTCDay()]},A:function(t){return i[t.getUTCDay()]},b:function(t){return c[t.getUTCMonth()]},B:function(t){return a[t.getUTCMonth()]},c:null,d:zt,e:zt,f:Qt,H:Wt,I:Vt,j:Xt,L:Jt,m:qt,M:Kt,p:function(t){return o[+(t.getUTCHours()>=12)]},Q:le,s:fe,S:te,u:ee,U:ne,V:re,w:oe,W:ie,x:null,X:null,y:ue,Y:ae,Z:ce,"%":se},C={a:function(t,e,n){var r=d.exec(e.slice(n));return r?(t.w=h[r[0].toLowerCase()],n+r[0].length):-1},A:function(t,e,n){var r=f.exec(e.slice(n));return r?(t.w=g[r[0].toLowerCase()],n+r[0].length):-1},b:function(t,e,n){var r=p.exec(e.slice(n));return r?(t.m=w[r[0].toLowerCase()],n+r[0].length):-1},B:function(t,e,n){var r=m.exec(e.slice(n));return r?(t.m=v[r[0].toLowerCase()],n+r[0].length):-1},c:function(t,n,r){return U(t,e,n,r)},d:yt,e:yt,f:bt,H:Ct,I:Ct,j:Tt,L:Ut,m:wt,M:_t,p:function(t,e,n){var r=s.exec(e.slice(n));return r?(t.p=l[r[0].toLowerCase()],n+r[0].length):-1},Q:St,s:Et,S:Mt,u:ft,U:gt,V:dt,w:lt,W:ht,x:function(t,e,r){return U(t,n,e,r)},X:function(t,e,n){return U(t,r,e,n)},y:vt,Y:mt,Z:pt,"%":Dt};function _(t,e){return function(n){var r,o,i,u=[],a=-1,c=0,s=t.length;for(n instanceof Date||(n=new Date(+n));++a<s;)37===t.charCodeAt(a)&&(u.push(t.slice(c,a)),null!=(o=nt[r=t.charAt(++a)])?r=t.charAt(++a):o="e"===r?" ":"0",(i=e[r])&&(r=i(n,o)),u.push(r),c=a+1);return u.push(t.slice(c,a)),u.join("")}}function M(t,e){return function(n){var r,o,i=q(1900);if(U(i,t,n+="",0)!=n.length)return null;if("Q"in i)return new Date(i.Q);if("p"in i&&(i.H=i.H%12+12*i.p),"V"in i){if(i.V<1||i.V>53)return null;"w"in i||(i.w=1),"Z"in i?(o=(r=Q(q(i.y))).getUTCDay(),r=o>4||0===o?W.ceil(r):W(r),r=P.offset(r,7*(i.V-1)),i.y=r.getUTCFullYear(),i.m=r.getUTCMonth(),i.d=r.getUTCDate()+(i.w+6)%7):(o=(r=e(q(i.y))).getDay(),r=o>4||0===o?R.ceil(r):R(r),r=j.offset(r,7*(i.V-1)),i.y=r.getFullYear(),i.m=r.getMonth(),i.d=r.getDate()+(i.w+6)%7)}else("W"in i||"U"in i)&&("w"in i||(i.w="u"in i?i.u%7:"W"in i?1:0),o="Z"in i?Q(q(i.y)).getUTCDay():e(q(i.y)).getDay(),i.m=0,i.d="W"in i?(i.w+6)%7+7*i.W-(o+5)%7:i.w+7*i.U-(o+6)%7);return"Z"in i?(i.H+=i.Z/100|0,i.M+=i.Z%100,Q(i)):e(i)}}function U(t,e,n,r){for(var o,i,u=0,a=e.length,c=n.length;u<a;){if(r>=c)return-1;if(37===(o=e.charCodeAt(u++))){if(o=e.charAt(u++),!(i=C[o in nt?e.charAt(u++):o])||(r=i(t,n,r))<0)return-1}else if(o!=n.charCodeAt(r++))return-1}return r}return y.x=_(n,y),y.X=_(r,y),y.c=_(e,y),T.x=_(n,T),T.X=_(r,T),T.c=_(e,T),{format:function(t){var e=_(t+="",y);return e.toString=function(){return t},e},parse:function(t){var e=M(t+="",J);return e.toString=function(){return t},e},utcFormat:function(t){var e=_(t+="",T);return e.toString=function(){return t},e},utcParse:function(t){var e=M(t,Q);return e.toString=function(){return t},e}}}({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}),K.format,K.parse,tt=K.utcFormat,et=K.utcParse;Date.prototype.toISOString||tt("%Y-%m-%dT%H:%M:%S.%LZ");+new Date("2000-01-01T00:00:00.000Z")||et("%Y-%m-%dT%H:%M:%S.%LZ");var ge="https://himawari8-dl.nict.go.jp/himawari8/img/",de="https://epic.gsfc.nasa.gov/",he="http://rammb-slider.cira.colostate.edu/data/",me="INFRARED_FULL",ve="D531106",pe="EPIC",we="EPIC_ENHANCED",ye="GOES_16",Te="GOES_16_NATURAL",Ce="GOES_17",_e="METEOSAT",Me="METEOSAT_IODC",Ue=550,be=[1,4,8,16,20],De=678,Se=[1,2,4,8,16],Ee=2048,Ie=3712,xe=3630,ke=.95,Ae="imageData",Ye="cachedDate",Fe="cachedImageType",He=null,Le=browser&&!!browser.storage,Oe={animated:!1,imageType:ve};function je(t,e){return void 0===e&&(e=432e3),"https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url="+t+"&container=focus&refresh="+e}function Be(t,e){for(var n=t+"";n.length<e;)n="0"+n;return n}function Ne(t,e){for(var n=document.getElementById("output").clientHeight*window.devicePixelRatio/t,r=0;r<e.length;r++){var o=e[r];if(o>n)return{blocks:o,level:r}}var i=e.length-1;return{blocks:e[i],level:i}}var Re=null,Ze=null;function Ge(t){document.getElementById("time").innerHTML=t===He?"":'<abbr title="'+t+'">'+function(t){var e=Math.floor(((new Date).getTime()-t.getTime())/1e3),n=Math.floor(e/31536e3);return n>1?n+" years":(n=Math.floor(e/2592e3))>1?n+" months":(n=Math.floor(e/86400))>1?n+" days":(n=Math.floor(e/3600))>1?n+" hours":(n=Math.floor(e/60))>1?n+" minutes":Math.floor(e)+" seconds"}(t)+"</abbr> ago"}function Pe(t,e){Ge(t),Re=t,function(t){switch(document.body.classList.remove("himawari"),document.body.classList.remove("dscovr"),document.body.classList.remove("goes"),document.body.classList.remove("goes16"),document.body.classList.remove("meteosat"),t){case me:case ve:document.body.classList.add("himawari");break;case pe:case we:document.body.classList.add("dscovr");break;case ye:case Te:case Ce:document.body.classList.add("goes");break;case _e:case Me:document.body.classList.add("meteosat");break;default:console.warn("Unknown image type",t)}}(e),Ze=e}function $e(t,e){if(!Re||t.getTime()!==Re.getTime()||Ze!==e){var n=!localStorage.getItem(Ye);n&&Pe(t,e);var r=function(t){for(var e=ge+(t.type||ve),n=t.date,r=t.blocks,o=e+"/"+r+"d/"+Ue+"/"+tt("%Y/%m/%d/%H%M%S")(n),i=[],u=0;u<r;u++)for(var a=0;a<r;a++){var c=o+"_"+a+"_"+u+".png";i.push({url:je(c),x:a,y:u})}return{blocks:r,date:n,tiles:i}}({blocks:Ne(Ue,be).blocks,date:t,type:e}),o=r.blocks*Ue,i=n?document.getElementById("output"):document.createElement("canvas"),u=i.getContext("2d");u.canvas.width=o,u.canvas.height=o;var a=c();r.tiles.forEach(function(t){a.defer(s,t)}),a.awaitAll(function(r){if(r)throw r;if(!n){var u=document.getElementById("output").getContext("2d");u.canvas.width=o,u.canvas.height=o,u.drawImage(i,0,0)}Pe(t,e),We(t,e)})}function s(t,e){var n=new Image;n.setAttribute("crossOrigin","anonymous"),n.onload=function(){u.drawImage(n,t.x*Ue,t.y*Ue,Ue,Ue),e()},n.src=t.url}}function ze(e,n){if(!Re||e.getTime()!==Re.getTime()||Ze!==n){var r=!localStorage.getItem(Ye);r&&Pe(e,n);var o=function(t){for(var e=t.date,n=t.blocks,r=t.level,o={GOES_16:"geocolor",GOES_16_NATURAL:"natural_color",GOES_17:"geocolor"}[t.type],i={GOES_16:16,GOES_16_NATURAL:16,GOES_17:17}[t.type],u=tt("%Y%m%d")(t.date),a=tt("%Y%m%d%H%M%S")(t.date),c=he+"imagery/"+u+"/goes-"+i+"---full_disk/"+o+"/"+a+"/",s=[],l=0;l<n;l++)for(var f=0;f<n;f++){var g=""+c+Be(r,2)+"/"+Be(l,3)+"_"+Be(f,3)+".png";s.push({url:je(g),x:f,y:l})}return{blocks:n,date:e,tiles:s}}(t({date:e,type:n},Ne(De,Se))),i=o.blocks*De,u=r?document.getElementById("output"):document.createElement("canvas"),a=u.getContext("2d");a.canvas.width=i,a.canvas.height=i;var s=c();o.tiles.forEach(function(t){s.defer(l,t)}),s.awaitAll(function(t){if(t)throw t;if(!r){var o=document.getElementById("output").getContext("2d");o.canvas.width=i,o.canvas.height=i,o.drawImage(u,0,0)}Pe(e,n),We(e,n)})}function l(t,e){var n=new Image;n.setAttribute("crossOrigin","anonymous"),n.onload=function(){a.drawImage(n,t.x*De,t.y*De,De,De),e()},n.src=t.url}}function We(t,e,n){void 0===n&&(n=ke);var r=document.getElementById("output").toDataURL("image/jpeg",n);try{localStorage.setItem(Ae,r)}catch(r){if(n>.5)return n-=.05,console.warn("Couldn't store image. Trying again with lower image quality of "+n),We(t,e,n)}localStorage.setItem(Ye,t.toString()),localStorage.setItem(Fe,e)}function Ve(){function t(t){!function(t,e){C("https://himawari-8.appspot.com/latest"+(t===me?"?infrared=true":""),function(t,n){if(t)throw t;var r=n.date;e(et("%Y-%m-%d %H:%M:%S")(r))})}(t,function(e){$e(e,t)})}function e(t){!function(t,e){C(de+"api/"+(t===we?"enhanced":"natural"),function(t,n){if(t)throw t;if(0!==n.length){var r=n[n.length-1];e({date:et("%Y-%m-%d %H:%M:%S")(r.date),image:r.image})}})}(t,function(e){!function(t,e){if(!Re||t.date.getTime()!==Re.getTime()||Ze!==e){var n=!localStorage.getItem(Ye);n&&Pe(t.date,e);var r=n?document.getElementById("output"):document.createElement("canvas"),o=r.getContext("2d");o.canvas.width=Ee,o.canvas.height=Ee;var i=new Image;i.setAttribute("crossOrigin","anonymous"),i.onload=function(){if(o.drawImage(i,0,0),!n){var u=document.getElementById("output").getContext("2d");u.canvas.width=Ee,u.canvas.height=Ee,u.drawImage(r,0,0)}Pe(t.date,e),We(t.date,e)};var u=e===we?"enhanced":"natural",a=Be(t.date.getMonth()+1,2),c=Be(t.date.getDate(),2);i.src=je(de+"archive/"+u+"/"+t.date.getFullYear()+"/"+a+"/"+c+"/png/"+t.image+".png")}}(e,t)})}function n(t){!function(t,e){C(he+"json/goes-"+{GOES_16:16,GOES_16_NATURAL:16,GOES_17:17}[t]+"/full_disk/geocolor/latest_times.json",function(t,n){if(t)throw t;e(et("%Y%m%d%H%M%S")(n.timestamps_int[0]))})}(t,function(e){ze(e,t)})}function r(t){!function(t,e){C("https://meteosat-url.appspot.com/msg"+(t===Me?"iodc":""),function(t,n){if(t)throw t;e({date:et("%Y-%m-%d %H:%M:%S")(n.date),image:n.url})})}(t,function(e){!function(t,e){if(!Re||t.date.getTime()!==Re.getTime()||Ze!==e){var n=!localStorage.getItem(Ye);n&&Pe(t.date,e);var r=n?document.getElementById("output"):document.createElement("canvas"),o=r.getContext("2d");o.canvas.width=Ie,o.canvas.height=xe;var i=new Image;i.setAttribute("crossOrigin","anonymous"),i.onload=function(){if(o.drawImage(i,0,0),!n){var u=document.getElementById("output").getContext("2d");u.canvas.width=Ie,u.canvas.height=xe,u.drawImage(r,0,0)}Pe(t.date,e),We(t.date,e)},i.src=je(""+t.image)}}(e,t)})}navigator.onLine&&(Le?browser.storage.sync.get(Oe).then(function(o){switch(o.imageType){case pe:case we:e(o.imageType);break;case ye:case Te:case Ce:n(o.imageType);break;case _e:case Me:r(o.imageType);break;case me:case ve:default:t(o.imageType)}}):t(ve))}function Xe(){var t,e,n;localStorage.getItem(Ye)&&(t=document.getElementById("output").getContext("2d"),e=new Date(localStorage.getItem(Ye)),(n=new Image).onload=function(){t.canvas.width=n.width,t.canvas.height=n.height,t.drawImage(n,0,0),Pe(e,localStorage.getItem(Fe))},n.src=localStorage.getItem(Ae)),Ve()}window.setInterval(Ve,6e4),window.addEventListener("online",Ve),Le?browser.storage.sync.get(Oe).then(function(t){t.animated?document.body.classList.add("animated"):document.body.classList.remove("animated"),Xe()}):Xe(),window.setInterval(function(){Re&&Ge(Re)},1e4),Le&&(browser.storage.onChanged.addListener(Ve),document.body.classList.add("extension"),document.getElementById("go-to-options").addEventListener("click",function(){browser.runtime.openOptionsPage()})),document.getElementById("explore").addEventListener("click",function(){switch(Ze){case pe:window.open("https://epic.gsfc.nasa.gov","_self");case we:window.open("https://epic.gsfc.nasa.gov/enhanced","_self");break;case ye:case Te:case Ce:window.open("http://rammb-slider.cira.colostate.edu/","_self");break;case me:case ve:window.open("http://himawari8.nict.go.jp/himawari8-image.htm?sI=D531106","_self");break;case _e:case Me:window.open("http://oiswww.eumetsat.org/IPPS/html/MSG/IMAGERY/","_self");break;default:window.alert("No explorer found.")}})}();
//# sourceMappingURL=bundle.js.map
