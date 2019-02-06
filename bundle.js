!function(){"use strict";var t=function(){return(t=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},e=[].slice,n={};function r(t){this._size=t,this._call=this._error=null,this._tasks=[],this._data=[],this._waiting=this._active=this._ended=this._start=0}function o(t){if(!t._start)try{!function(t){for(;t._start=t._waiting&&t._active<t._size;){var e=t._ended+t._active,r=t._tasks[e],o=r.length-1,u=r[o];r[o]=i(t,e),--t._waiting,++t._active,r=u.apply(null,r),t._tasks[e]&&(t._tasks[e]=r||n)}}(t)}catch(e){if(t._tasks[t._ended+t._active-1])u(t,e);else if(!t._data)throw e}}function i(t,e){return function(n,r){t._tasks[e]&&(--t._active,++t._ended,t._tasks[e]=null,null==t._error&&(null!=n?u(t,n):(t._data[e]=r,t._waiting?o(t):a(t))))}}function u(t,e){var n,r=t._tasks.length;for(t._error=e,t._data=void 0,t._waiting=NaN;--r>=0;)if((n=t._tasks[r])&&(t._tasks[r]=null,n.abort))try{n.abort()}catch(e){}t._active=NaN,a(t)}function a(t){if(!t._active&&t._call){var e=t._data;t._data=void 0,t._call(t._error,e)}}function c(t){if(null==t)t=1/0;else if(!((t=+t)>=1))throw new Error("invalid concurrency");return new r(t)}r.prototype=c.prototype={constructor:r,defer:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("defer after await");if(null!=this._error)return this;var n=e.call(arguments,1);return n.push(t),++this._waiting,this._tasks.push(n),o(this),this},abort:function(){return null==this._error&&u(this,new Error("abort")),this},await:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("multiple await");return this._call=function(e,n){t.apply(null,[e].concat(n))},a(this),this},awaitAll:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("multiple await");return this._call=t,a(this),this}};function s(){}function l(t,e){var n=new s;if(t instanceof s)t.each(function(t,e){n.set(e,t)});else if(Array.isArray(t)){var r,o=-1,i=t.length;if(null==e)for(;++o<i;)n.set(o,t[o]);else for(;++o<i;)n.set(e(r=t[o],o,t),r)}else if(t)for(var u in t)n.set(u,t[u]);return n}function f(){}s.prototype=l.prototype={constructor:s,has:function(t){return"$"+t in this},get:function(t){return this["$"+t]},set:function(t,e){return this["$"+t]=e,this},remove:function(t){var e="$"+t;return e in this&&delete this[e]},clear:function(){for(var t in this)"$"===t[0]&&delete this[t]},keys:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(e.slice(1));return t},values:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(this[e]);return t},entries:function(){var t=[];for(var e in this)"$"===e[0]&&t.push({key:e.slice(1),value:this[e]});return t},size:function(){var t=0;for(var e in this)"$"===e[0]&&++t;return t},empty:function(){for(var t in this)if("$"===t[0])return!1;return!0},each:function(t){for(var e in this)"$"===e[0]&&t(this[e],e.slice(1),this)}};var g=l.prototype;f.prototype=function(t,e){var n=new f;if(t instanceof f)t.each(function(t){n.add(t)});else if(t){var r=-1,o=t.length;if(null==e)for(;++r<o;)n.add(t[r]);else for(;++r<o;)n.add(e(t[r],r,t))}return n}.prototype={constructor:f,has:g.has,add:function(t){return this["$"+(t+="")]=t,this},remove:g.remove,clear:g.clear,values:g.keys,size:g.size,empty:g.empty,each:g.each};var d={value:function(){}};function h(){for(var t,e=0,n=arguments.length,r={};e<n;++e){if(!(t=arguments[e]+"")||t in r)throw new Error("illegal type: "+t);r[t]=[]}return new m(r)}function m(t){this._=t}function v(t,e){for(var n,r=0,o=t.length;r<o;++r)if((n=t[r]).name===e)return n.value}function p(t,e,n){for(var r=0,o=t.length;r<o;++r)if(t[r].name===e){t[r]=d,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=n&&t.push({name:e,value:n}),t}m.prototype=h.prototype={constructor:m,on:function(t,e){var n,r,o=this._,i=(r=o,(t+"").trim().split(/^|\s+/).map(function(t){var e="",n=t.indexOf(".");if(n>=0&&(e=t.slice(n+1),t=t.slice(0,n)),t&&!r.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:e}})),u=-1,a=i.length;if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++u<a;)if(n=(t=i[u]).type)o[n]=p(o[n],t.name,e);else if(null==e)for(n in o)o[n]=p(o[n],t.name,null);return this}for(;++u<a;)if((n=(t=i[u]).type)&&(n=v(o[n],t.name)))return n},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new m(t)},call:function(t,e){if((n=arguments.length-2)>0)for(var n,r,o=new Array(n),i=0;i<n;++i)o[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(i=0,n=(r=this._[t]).length;i<n;++i)r[i].value.apply(e,o)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],o=0,i=r.length;o<i;++o)r[o].value.apply(e,n)}};var w,y,T=(w="application/json",y=function(t){return JSON.parse(t.responseText)},function(t,e){var n=function(t,e){var n,r,o,i,u=h("beforesend","progress","load","error"),a=l(),c=new XMLHttpRequest,s=null,f=null,g=0;function d(t){var e,r=c.status;if(!r&&function(t){var e=t.responseType;return e&&"text"!==e?t.response:t.responseText}(c)||r>=200&&r<300||304===r){if(o)try{e=o.call(n,c)}catch(t){return void u.call("error",n,t)}else e=c;u.call("load",n,e)}else u.call("error",n,t)}if("undefined"==typeof XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(t)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=c.ontimeout=d:c.onreadystatechange=function(t){c.readyState>3&&d(t)},c.onprogress=function(t){u.call("progress",n,t)},n={header:function(t,e){return t=(t+"").toLowerCase(),arguments.length<2?a.get(t):(null==e?a.remove(t):a.set(t,e+""),n)},mimeType:function(t){return arguments.length?(r=null==t?null:t+"",n):r},responseType:function(t){return arguments.length?(i=t,n):i},timeout:function(t){return arguments.length?(g=+t,n):g},user:function(t){return arguments.length<1?s:(s=null==t?null:t+"",n)},password:function(t){return arguments.length<1?f:(f=null==t?null:t+"",n)},response:function(t){return o=t,n},get:function(t,e){return n.send("GET",t,e)},post:function(t,e){return n.send("POST",t,e)},send:function(e,o,l){return c.open(e,t,!0,s,f),null==r||a.has("accept")||a.set("accept",r+",*/*"),c.setRequestHeader&&a.each(function(t,e){c.setRequestHeader(e,t)}),null!=r&&c.overrideMimeType&&c.overrideMimeType(r),null!=i&&(c.responseType=i),g>0&&(c.timeout=g),null==l&&"function"==typeof o&&(l=o,o=null),null!=l&&1===l.length&&(l=function(t){return function(e,n){t(null==e?n:null)}}(l)),null!=l&&n.on("error",l).on("load",function(t){l(null,t)}),u.call("beforesend",n,c),c.send(null==o?null:o),n},abort:function(){return c.abort(),n},on:function(){var t=u.on.apply(u,arguments);return t===u?n:t}},null!=e){if("function"!=typeof e)throw new Error("invalid callback: "+e);return n.get(e)}return n}(t).mimeType(w).response(y);if(null!=e){if("function"!=typeof e)throw new Error("invalid callback: "+e);return n.get(e)}return n}),C={},_={},M=34,b=10,U=13;function D(t){return new Function("d","return {"+t.map(function(t,e){return JSON.stringify(t)+": d["+e+"]"}).join(",")+"}")}function S(t){var e=new RegExp('["'+t+"\n\r]"),n=t.charCodeAt(0);function r(t,e){var r,o=[],i=t.length,u=0,a=0,c=i<=0,s=!1;function l(){if(c)return _;if(s)return s=!1,C;var e,r,o=u;if(t.charCodeAt(o)===M){for(;u++<i&&t.charCodeAt(u)!==M||t.charCodeAt(++u)===M;);return(e=u)>=i?c=!0:(r=t.charCodeAt(u++))===b?s=!0:r===U&&(s=!0,t.charCodeAt(u)===b&&++u),t.slice(o+1,e-1).replace(/""/g,'"')}for(;u<i;){if((r=t.charCodeAt(e=u++))===b)s=!0;else if(r===U)s=!0,t.charCodeAt(u)===b&&++u;else if(r!==n)continue;return t.slice(o,e)}return c=!0,t.slice(o,i)}for(t.charCodeAt(i-1)===b&&--i,t.charCodeAt(i-1)===U&&--i;(r=l())!==_;){for(var f=[];r!==C&&r!==_;)f.push(r),r=l();e&&null==(f=e(f,a++))||o.push(f)}return o}function o(e){return e.map(i).join(t)}function i(t){return null==t?"":e.test(t+="")?'"'+t.replace(/"/g,'""')+'"':t}return{parse:function(t,e){var n,o,i=r(t,function(t,r){if(n)return n(t,r-1);o=t,n=e?function(t,e){var n=D(t);return function(r,o){return e(n(r),o,t)}}(t,e):D(t)});return i.columns=o||[],i},parseRows:r,format:function(e,n){return null==n&&(n=function(t){var e=Object.create(null),n=[];return t.forEach(function(t){for(var r in t)r in e||n.push(e[r]=r)}),n}(e)),[n.map(i).join(t)].concat(e.map(function(e){return n.map(function(t){return i(e[t])}).join(t)})).join("\n")},formatRows:function(t){return t.map(o).join("\n")}}}var E=S(","),x=(E.parse,E.parseRows,E.format,E.formatRows,S("\t")),I=(x.parse,x.parseRows,x.format,x.formatRows,new Date),k=new Date;function A(t,e,n,r){function o(e){return t(e=new Date(+e)),e}return o.floor=o,o.ceil=function(n){return t(n=new Date(n-1)),e(n,1),t(n),n},o.round=function(t){var e=o(t),n=o.ceil(t);return t-e<n-t?e:n},o.offset=function(t,n){return e(t=new Date(+t),null==n?1:Math.floor(n)),t},o.range=function(n,r,i){var u,a=[];if(n=o.ceil(n),i=null==i?1:Math.floor(i),!(n<r&&i>0))return a;do{a.push(u=new Date(+n)),e(n,i),t(n)}while(u<n&&n<r);return a},o.filter=function(n){return A(function(e){if(e>=e)for(;t(e),!n(e);)e.setTime(e-1)},function(t,r){if(t>=t)if(r<0)for(;++r<=0;)for(;e(t,-1),!n(t););else for(;--r>=0;)for(;e(t,1),!n(t););})},n&&(o.count=function(e,r){return I.setTime(+e),k.setTime(+r),t(I),t(k),Math.floor(n(I,k))},o.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?o.filter(r?function(e){return r(e)%t==0}:function(e){return o.count(0,e)%t==0}):o:null}),o}var L=A(function(){},function(t,e){t.setTime(+t+e)},function(t,e){return e-t});L.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?A(function(e){e.setTime(Math.floor(e/t)*t)},function(e,n){e.setTime(+e+n*t)},function(e,n){return(n-e)/t}):L:null};var Y=6e4,F=6048e5,H=(A(function(t){t.setTime(t-t.getMilliseconds())},function(t,e){t.setTime(+t+1e3*e)},function(t,e){return(e-t)/1e3},function(t){return t.getUTCSeconds()}),A(function(t){t.setTime(t-t.getMilliseconds()-1e3*t.getSeconds())},function(t,e){t.setTime(+t+e*Y)},function(t,e){return(e-t)/Y},function(t){return t.getMinutes()}),A(function(t){t.setTime(t-t.getMilliseconds()-1e3*t.getSeconds()-t.getMinutes()*Y)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getHours()}),A(function(t){t.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*Y)/864e5},function(t){return t.getDate()-1}));function O(t){return A(function(e){e.setDate(e.getDate()-(e.getDay()+7-t)%7),e.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+7*e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*Y)/F})}var R=O(0),j=O(1),B=(O(2),O(3),O(4)),N=(O(5),O(6),R.range,j.range,B.range,A(function(t){t.setDate(1),t.setHours(0,0,0,0)},function(t,e){t.setMonth(t.getMonth()+e)},function(t,e){return e.getMonth()-t.getMonth()+12*(e.getFullYear()-t.getFullYear())},function(t){return t.getMonth()}),A(function(t){t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,e){t.setFullYear(t.getFullYear()+e)},function(t,e){return e.getFullYear()-t.getFullYear()},function(t){return t.getFullYear()}));N.every=function(t){return isFinite(t=Math.floor(t))&&t>0?A(function(e){e.setFullYear(Math.floor(e.getFullYear()/t)*t),e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,n){e.setFullYear(e.getFullYear()+n*t)}):null};A(function(t){t.setUTCSeconds(0,0)},function(t,e){t.setTime(+t+e*Y)},function(t,e){return(e-t)/Y},function(t){return t.getUTCMinutes()}),A(function(t){t.setUTCMinutes(0,0,0)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getUTCHours()});var G=A(function(t){t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+e)},function(t,e){return(e-t)/864e5},function(t){return t.getUTCDate()-1});function P(t){return A(function(e){e.setUTCDate(e.getUTCDate()-(e.getUTCDay()+7-t)%7),e.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+7*e)},function(t,e){return(e-t)/F})}var $=P(0),Z=P(1),z=(P(2),P(3),P(4)),W=(P(5),P(6),$.range,Z.range,z.range,A(function(t){t.setUTCDate(1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCMonth(t.getUTCMonth()+e)},function(t,e){return e.getUTCMonth()-t.getUTCMonth()+12*(e.getUTCFullYear()-t.getUTCFullYear())},function(t){return t.getUTCMonth()}),A(function(t){t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCFullYear(t.getUTCFullYear()+e)},function(t,e){return e.getUTCFullYear()-t.getUTCFullYear()},function(t){return t.getUTCFullYear()}));function V(t){if(0<=t.y&&t.y<100){var e=new Date(-1,t.m,t.d,t.H,t.M,t.S,t.L);return e.setFullYear(t.y),e}return new Date(t.y,t.m,t.d,t.H,t.M,t.S,t.L)}function X(t){if(0<=t.y&&t.y<100){var e=new Date(Date.UTC(-1,t.m,t.d,t.H,t.M,t.S,t.L));return e.setUTCFullYear(t.y),e}return new Date(Date.UTC(t.y,t.m,t.d,t.H,t.M,t.S,t.L))}function J(t){return{y:t,m:0,d:1,H:0,M:0,S:0,L:0}}W.every=function(t){return isFinite(t=Math.floor(t))&&t>0?A(function(e){e.setUTCFullYear(Math.floor(e.getUTCFullYear()/t)*t),e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,n){e.setUTCFullYear(e.getUTCFullYear()+n*t)}):null};var Q,q,K,tt={"-":"",_:" ",0:"0"},et=/^\s*\d+/,nt=/^%/,rt=/[\\^$*+?|[\]().{}]/g;function ot(t,e,n){var r=t<0?"-":"",o=(r?-t:t)+"",i=o.length;return r+(i<n?new Array(n-i+1).join(e)+o:o)}function it(t){return t.replace(rt,"\\$&")}function ut(t){return new RegExp("^(?:"+t.map(it).join("|")+")","i")}function at(t){for(var e={},n=-1,r=t.length;++n<r;)e[t[n].toLowerCase()]=n;return e}function ct(t,e,n){var r=et.exec(e.slice(n,n+1));return r?(t.w=+r[0],n+r[0].length):-1}function st(t,e,n){var r=et.exec(e.slice(n,n+1));return r?(t.u=+r[0],n+r[0].length):-1}function lt(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.U=+r[0],n+r[0].length):-1}function ft(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.V=+r[0],n+r[0].length):-1}function gt(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.W=+r[0],n+r[0].length):-1}function dt(t,e,n){var r=et.exec(e.slice(n,n+4));return r?(t.y=+r[0],n+r[0].length):-1}function ht(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.y=+r[0]+(+r[0]>68?1900:2e3),n+r[0].length):-1}function mt(t,e,n){var r=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n,n+6));return r?(t.Z=r[1]?0:-(r[2]+(r[3]||"00")),n+r[0].length):-1}function vt(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.m=r[0]-1,n+r[0].length):-1}function pt(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.d=+r[0],n+r[0].length):-1}function wt(t,e,n){var r=et.exec(e.slice(n,n+3));return r?(t.m=0,t.d=+r[0],n+r[0].length):-1}function yt(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.H=+r[0],n+r[0].length):-1}function Tt(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.M=+r[0],n+r[0].length):-1}function Ct(t,e,n){var r=et.exec(e.slice(n,n+2));return r?(t.S=+r[0],n+r[0].length):-1}function _t(t,e,n){var r=et.exec(e.slice(n,n+3));return r?(t.L=+r[0],n+r[0].length):-1}function Mt(t,e,n){var r=et.exec(e.slice(n,n+6));return r?(t.L=Math.floor(r[0]/1e3),n+r[0].length):-1}function bt(t,e,n){var r=nt.exec(e.slice(n,n+1));return r?n+r[0].length:-1}function Ut(t,e,n){var r=et.exec(e.slice(n));return r?(t.Q=+r[0],n+r[0].length):-1}function Dt(t,e,n){var r=et.exec(e.slice(n));return r?(t.Q=1e3*+r[0],n+r[0].length):-1}function St(t,e){return ot(t.getDate(),e,2)}function Et(t,e){return ot(t.getHours(),e,2)}function xt(t,e){return ot(t.getHours()%12||12,e,2)}function It(t,e){return ot(1+H.count(N(t),t),e,3)}function kt(t,e){return ot(t.getMilliseconds(),e,3)}function At(t,e){return kt(t,e)+"000"}function Lt(t,e){return ot(t.getMonth()+1,e,2)}function Yt(t,e){return ot(t.getMinutes(),e,2)}function Ft(t,e){return ot(t.getSeconds(),e,2)}function Ht(t){var e=t.getDay();return 0===e?7:e}function Ot(t,e){return ot(R.count(N(t),t),e,2)}function Rt(t,e){var n=t.getDay();return t=n>=4||0===n?B(t):B.ceil(t),ot(B.count(N(t),t)+(4===N(t).getDay()),e,2)}function jt(t){return t.getDay()}function Bt(t,e){return ot(j.count(N(t),t),e,2)}function Nt(t,e){return ot(t.getFullYear()%100,e,2)}function Gt(t,e){return ot(t.getFullYear()%1e4,e,4)}function Pt(t){var e=t.getTimezoneOffset();return(e>0?"-":(e*=-1,"+"))+ot(e/60|0,"0",2)+ot(e%60,"0",2)}function $t(t,e){return ot(t.getUTCDate(),e,2)}function Zt(t,e){return ot(t.getUTCHours(),e,2)}function zt(t,e){return ot(t.getUTCHours()%12||12,e,2)}function Wt(t,e){return ot(1+G.count(W(t),t),e,3)}function Vt(t,e){return ot(t.getUTCMilliseconds(),e,3)}function Xt(t,e){return Vt(t,e)+"000"}function Jt(t,e){return ot(t.getUTCMonth()+1,e,2)}function Qt(t,e){return ot(t.getUTCMinutes(),e,2)}function qt(t,e){return ot(t.getUTCSeconds(),e,2)}function Kt(t){var e=t.getUTCDay();return 0===e?7:e}function te(t,e){return ot($.count(W(t),t),e,2)}function ee(t,e){var n=t.getUTCDay();return t=n>=4||0===n?z(t):z.ceil(t),ot(z.count(W(t),t)+(4===W(t).getUTCDay()),e,2)}function ne(t){return t.getUTCDay()}function re(t,e){return ot(Z.count(W(t),t),e,2)}function oe(t,e){return ot(t.getUTCFullYear()%100,e,2)}function ie(t,e){return ot(t.getUTCFullYear()%1e4,e,4)}function ue(){return"+0000"}function ae(){return"%"}function ce(t){return+t}function se(t){return Math.floor(+t/1e3)}Q=function(t){var e=t.dateTime,n=t.date,r=t.time,o=t.periods,i=t.days,u=t.shortDays,a=t.months,c=t.shortMonths,s=ut(o),l=at(o),f=ut(i),g=at(i),d=ut(u),h=at(u),m=ut(a),v=at(a),p=ut(c),w=at(c),y={a:function(t){return u[t.getDay()]},A:function(t){return i[t.getDay()]},b:function(t){return c[t.getMonth()]},B:function(t){return a[t.getMonth()]},c:null,d:St,e:St,f:At,H:Et,I:xt,j:It,L:kt,m:Lt,M:Yt,p:function(t){return o[+(t.getHours()>=12)]},Q:ce,s:se,S:Ft,u:Ht,U:Ot,V:Rt,w:jt,W:Bt,x:null,X:null,y:Nt,Y:Gt,Z:Pt,"%":ae},T={a:function(t){return u[t.getUTCDay()]},A:function(t){return i[t.getUTCDay()]},b:function(t){return c[t.getUTCMonth()]},B:function(t){return a[t.getUTCMonth()]},c:null,d:$t,e:$t,f:Xt,H:Zt,I:zt,j:Wt,L:Vt,m:Jt,M:Qt,p:function(t){return o[+(t.getUTCHours()>=12)]},Q:ce,s:se,S:qt,u:Kt,U:te,V:ee,w:ne,W:re,x:null,X:null,y:oe,Y:ie,Z:ue,"%":ae},C={a:function(t,e,n){var r=d.exec(e.slice(n));return r?(t.w=h[r[0].toLowerCase()],n+r[0].length):-1},A:function(t,e,n){var r=f.exec(e.slice(n));return r?(t.w=g[r[0].toLowerCase()],n+r[0].length):-1},b:function(t,e,n){var r=p.exec(e.slice(n));return r?(t.m=w[r[0].toLowerCase()],n+r[0].length):-1},B:function(t,e,n){var r=m.exec(e.slice(n));return r?(t.m=v[r[0].toLowerCase()],n+r[0].length):-1},c:function(t,n,r){return b(t,e,n,r)},d:pt,e:pt,f:Mt,H:yt,I:yt,j:wt,L:_t,m:vt,M:Tt,p:function(t,e,n){var r=s.exec(e.slice(n));return r?(t.p=l[r[0].toLowerCase()],n+r[0].length):-1},Q:Ut,s:Dt,S:Ct,u:st,U:lt,V:ft,w:ct,W:gt,x:function(t,e,r){return b(t,n,e,r)},X:function(t,e,n){return b(t,r,e,n)},y:ht,Y:dt,Z:mt,"%":bt};function _(t,e){return function(n){var r,o,i,u=[],a=-1,c=0,s=t.length;for(n instanceof Date||(n=new Date(+n));++a<s;)37===t.charCodeAt(a)&&(u.push(t.slice(c,a)),null!=(o=tt[r=t.charAt(++a)])?r=t.charAt(++a):o="e"===r?" ":"0",(i=e[r])&&(r=i(n,o)),u.push(r),c=a+1);return u.push(t.slice(c,a)),u.join("")}}function M(t,e){return function(n){var r,o,i=J(1900);if(b(i,t,n+="",0)!=n.length)return null;if("Q"in i)return new Date(i.Q);if("p"in i&&(i.H=i.H%12+12*i.p),"V"in i){if(i.V<1||i.V>53)return null;"w"in i||(i.w=1),"Z"in i?(o=(r=X(J(i.y))).getUTCDay(),r=o>4||0===o?Z.ceil(r):Z(r),r=G.offset(r,7*(i.V-1)),i.y=r.getUTCFullYear(),i.m=r.getUTCMonth(),i.d=r.getUTCDate()+(i.w+6)%7):(o=(r=e(J(i.y))).getDay(),r=o>4||0===o?j.ceil(r):j(r),r=H.offset(r,7*(i.V-1)),i.y=r.getFullYear(),i.m=r.getMonth(),i.d=r.getDate()+(i.w+6)%7)}else("W"in i||"U"in i)&&("w"in i||(i.w="u"in i?i.u%7:"W"in i?1:0),o="Z"in i?X(J(i.y)).getUTCDay():e(J(i.y)).getDay(),i.m=0,i.d="W"in i?(i.w+6)%7+7*i.W-(o+5)%7:i.w+7*i.U-(o+6)%7);return"Z"in i?(i.H+=i.Z/100|0,i.M+=i.Z%100,X(i)):e(i)}}function b(t,e,n,r){for(var o,i,u=0,a=e.length,c=n.length;u<a;){if(r>=c)return-1;if(37===(o=e.charCodeAt(u++))){if(o=e.charAt(u++),!(i=C[o in tt?e.charAt(u++):o])||(r=i(t,n,r))<0)return-1}else if(o!=n.charCodeAt(r++))return-1}return r}return y.x=_(n,y),y.X=_(r,y),y.c=_(e,y),T.x=_(n,T),T.X=_(r,T),T.c=_(e,T),{format:function(t){var e=_(t+="",y);return e.toString=function(){return t},e},parse:function(t){var e=M(t+="",V);return e.toString=function(){return t},e},utcFormat:function(t){var e=_(t+="",T);return e.toString=function(){return t},e},utcParse:function(t){var e=M(t,X);return e.toString=function(){return t},e}}}({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}),Q.format,Q.parse,q=Q.utcFormat,K=Q.utcParse;Date.prototype.toISOString||q("%Y-%m-%dT%H:%M:%S.%LZ");+new Date("2000-01-01T00:00:00.000Z")||K("%Y-%m-%dT%H:%M:%S.%LZ");var le="https://himawari8-dl.nict.go.jp/himawari8/img/",fe="https://epic.gsfc.nasa.gov/",ge="http://rammb-slider.cira.colostate.edu/data/",de="INFRARED_FULL",he="D531106",me="EPIC",ve="EPIC_ENHANCED",pe="GOES_16",we="GOES_16_NATURAL",ye="GOES_17",Te="METEOSAT",Ce="METEOSAT_IODC",_e=550,Me=[1,4,8,16,20],be=678,Ue=[1,2,4,8,16],De=2048,Se=3712,Ee=3630,xe=.95,Ie="imageData",ke="cachedDate",Ae="cachedImageType",Le=null,Ye=browser&&!!browser.storage,Fe={animated:!1,imageType:he};function He(t,e){return void 0===e&&(e=432e3),"https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url="+t+"&container=focus&refresh="+e}function Oe(t,e){for(var n=t+"";n.length<e;)n="0"+n;return n}function Re(t,e){for(var n=document.getElementById("output").clientHeight*window.devicePixelRatio/t,r=0;r<e.length;r++){var o=e[r];if(o>n)return{blocks:o,level:r}}var i=e.length-1;return{blocks:e[i],level:i}}var je=null,Be=null;function Ne(t){document.getElementById("time").innerHTML=t===Le?"":'<abbr title="'+t+'">'+function(t){var e=Math.floor(((new Date).getTime()-t.getTime())/1e3),n=Math.floor(e/31536e3);return n>1?n+" years":(n=Math.floor(e/2592e3))>1?n+" months":(n=Math.floor(e/86400))>1?n+" days":(n=Math.floor(e/3600))>1?n+" hours":(n=Math.floor(e/60))>1?n+" minutes":Math.floor(e)+" seconds"}(t)+"</abbr> ago"}function Ge(t,e){Ne(t),je=t,function(t){switch(document.body.classList.remove("himawari"),document.body.classList.remove("dscovr"),document.body.classList.remove("goes"),document.body.classList.remove("goes16"),document.body.classList.remove("meteosat"),t){case de:case he:document.body.classList.add("himawari");break;case me:case ve:document.body.classList.add("dscovr");break;case pe:case we:case ye:document.body.classList.add("goes");break;case Te:case Ce:document.body.classList.add("meteosat");break;default:console.warn("Unknown image type",t)}}(e),Be=e}function Pe(t,e){if(!je||t.getTime()!==je.getTime()||Be!==e){var n=!localStorage.getItem(ke);n&&Ge(t,e);var r=function(t){for(var e=le+(t.type||he),n=t.date,r=t.blocks,o=e+"/"+r+"d/"+_e+"/"+q("%Y/%m/%d/%H%M%S")(n),i=[],u=0;u<r;u++)for(var a=0;a<r;a++){var c=o+"_"+a+"_"+u+".png";i.push({url:He(c),x:a,y:u})}return{blocks:r,date:n,tiles:i}}({blocks:Re(_e,Me).blocks,date:t,type:e}),o=r.blocks*_e,i=n?document.getElementById("output"):document.createElement("canvas"),u=i.getContext("2d");u.canvas.width=o,u.canvas.height=o;var a=c();r.tiles.forEach(function(t){a.defer(s,t)}),a.awaitAll(function(r){if(r)throw r;if(!n){var u=document.getElementById("output").getContext("2d");u.canvas.width=o,u.canvas.height=o,u.drawImage(i,0,0)}Ge(t,e),Ze(t,e)})}function s(t,e){var n=new Image;n.setAttribute("crossOrigin","anonymous"),n.onload=function(){u.drawImage(n,t.x*_e,t.y*_e,_e,_e),e()},n.src=t.url}}function $e(e,n){if(!je||e.getTime()!==je.getTime()||Be!==n){var r=!localStorage.getItem(ke);r&&Ge(e,n);var o=function(t){for(var e=t.date,n=t.blocks,r=t.level,o={GOES_16:"geocolor",GOES_16_NATURAL:"natural_color",GOES_17:"geocolor"}[t.type],i={GOES_16:16,GOES_16_NATURAL:16,GOES_17:17}[t.type],u=q("%Y%m%d")(t.date),a=q("%Y%m%d%H%M%S")(t.date),c=ge+"imagery/"+u+"/goes-"+i+"---full_disk/"+o+"/"+a+"/",s=[],l=0;l<n;l++)for(var f=0;f<n;f++){var g=""+c+Oe(r,2)+"/"+Oe(l,3)+"_"+Oe(f,3)+".png";s.push({url:He(g),x:f,y:l})}return{blocks:n,date:e,tiles:s}}(t({date:e,type:n},Re(be,Ue))),i=o.blocks*be,u=r?document.getElementById("output"):document.createElement("canvas"),a=u.getContext("2d");a.canvas.width=i,a.canvas.height=i;var s=c();o.tiles.forEach(function(t){s.defer(l,t)}),s.awaitAll(function(t){if(t)throw t;if(!r){var o=document.getElementById("output").getContext("2d");o.canvas.width=i,o.canvas.height=i,o.drawImage(u,0,0)}Ge(e,n),Ze(e,n)})}function l(t,e){var n=new Image;n.setAttribute("crossOrigin","anonymous"),n.onload=function(){a.drawImage(n,t.x*be,t.y*be,be,be),e()},n.src=t.url}}function Ze(t,e,n){void 0===n&&(n=xe);var r=document.getElementById("output").toDataURL("image/jpeg",n);try{localStorage.setItem(Ie,r)}catch(r){if(n>.5)return n-=.05,console.warn("Couldn't store image. Trying again with lower image quality of "+n),Ze(t,e,n)}localStorage.setItem(ke,t.toString()),localStorage.setItem(Ae,e)}function ze(){function t(t){!function(t,e){T("https://himawari-8.appspot.com/latest"+(t===de?"?infrared=true":""),function(t,n){if(t)throw t;var r=n.date;e(K("%Y-%m-%d %H:%M:%S")(r))})}(t,function(e){Pe(e,t)})}function e(t){!function(t,e){T(fe+"api/"+(t===ve?"enhanced":"natural"),function(t,n){if(t)throw t;if(0!==n.length){var r=n[n.length-1];e({date:K("%Y-%m-%d %H:%M:%S")(r.date),image:r.image})}})}(t,function(e){!function(t,e){if(!je||t.date.getTime()!==je.getTime()||Be!==e){var n=!localStorage.getItem(ke);n&&Ge(t.date,e);var r=n?document.getElementById("output"):document.createElement("canvas"),o=r.getContext("2d");o.canvas.width=De,o.canvas.height=De;var i=new Image;i.setAttribute("crossOrigin","anonymous"),i.onload=function(){if(o.drawImage(i,0,0),!n){var u=document.getElementById("output").getContext("2d");u.canvas.width=De,u.canvas.height=De,u.drawImage(r,0,0)}Ge(t.date,e),Ze(t.date,e)};var u=e===ve?"enhanced":"natural",a=Oe(t.date.getMonth()+1,2),c=Oe(t.date.getDate(),2);i.src=He(fe+"archive/"+u+"/"+t.date.getFullYear()+"/"+a+"/"+c+"/png/"+t.image+".png")}}(e,t)})}function n(t){!function(t,e){T(ge+"json/goes-"+{GOES_16:16,GOES_16_NATURAL:16,GOES_17:17}[t]+"/full_disk/geocolor/latest_times.json",function(t,n){if(t)throw t;e(K("%Y%m%d%H%M%S")(n.timestamps_int[0]))})}(t,function(e){$e(e,t)})}function r(t){!function(t,e){T("https://meteosat-url.appspot.com/msg"+(t===Ce?"iodc":""),function(t,n){if(t)throw t;e({date:K("%Y-%m-%d %H:%M:%S")(n.date),image:n.url})})}(t,function(e){!function(t,e){if(!je||t.date.getTime()!==je.getTime()||Be!==e){var n=!localStorage.getItem(ke);n&&Ge(t.date,e);var r=n?document.getElementById("output"):document.createElement("canvas"),o=r.getContext("2d");o.canvas.width=Se,o.canvas.height=Ee;var i=new Image;i.setAttribute("crossOrigin","anonymous"),i.onload=function(){if(o.drawImage(i,0,0),!n){var u=document.getElementById("output").getContext("2d");u.canvas.width=Se,u.canvas.height=Ee,u.drawImage(r,0,0)}Ge(t.date,e),Ze(t.date,e)},i.src=He(""+t.image)}}(e,t)})}navigator.onLine&&(Ye?browser.storage.sync.get(Fe).then(function(o){switch(o.imageType){case me:case ve:e(o.imageType);break;case pe:case we:case ye:n(o.imageType);break;case Te:case Ce:r(o.imageType);break;case de:case he:default:t(o.imageType)}}):t(he))}function We(){var t,e,n;localStorage.getItem(ke)&&(t=document.getElementById("output").getContext("2d"),e=new Date(localStorage.getItem(ke)),(n=new Image).onload=function(){t.canvas.width=n.width,t.canvas.height=n.height,t.drawImage(n,0,0),Ge(e,localStorage.getItem(Ae))},n.src=localStorage.getItem(Ie)),ze()}window.setInterval(ze,6e4),window.addEventListener("online",ze),Ye?browser.storage.sync.get(Fe).then(function(t){t.animated?document.body.classList.add("animated"):document.body.classList.remove("animated"),We()}):We(),window.setInterval(function(){je&&Ne(je)},1e4),Ye&&(browser.storage.onChanged.addListener(ze),document.body.classList.add("extension"),document.getElementById("go-to-options").addEventListener("click",function(){browser.runtime.openOptionsPage()})),document.getElementById("explore").addEventListener("click",function(){switch(Be){case me:window.open("https://epic.gsfc.nasa.gov","_self");case ve:window.open("https://epic.gsfc.nasa.gov/enhanced","_self");break;case pe:case we:case ye:window.open("http://rammb-slider.cira.colostate.edu/","_self");break;case de:case he:window.open("http://himawari8.nict.go.jp/himawari8-image.htm?sI=D531106","_self");break;case Te:case Ce:window.open("http://oiswww.eumetsat.org/IPPS/html/MSG/IMAGERY/","_self");break;default:window.alert("No explorer found.")}})}();
//# sourceMappingURL=bundle.js.map
