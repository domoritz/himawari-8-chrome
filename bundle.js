!function(){"use strict";function t(t){this._size=t,this._call=this._error=null,this._tasks=[],this._data=[],this._waiting=this._active=this._ended=this._start=0}function e(t){if(!t._start)try{!function(t){for(;t._start=t._waiting&&t._active<t._size;){var o=t._ended+t._active,i=t._tasks[o],u=i.length-1,a=i[u];i[u]=function(t,o){return function(i,u){t._tasks[o]&&(--t._active,++t._ended,t._tasks[o]=null,null==t._error&&(null!=i?n(t,i):(t._data[o]=u,t._waiting?e(t):r(t))))}}(t,o),--t._waiting,++t._active,i=a.apply(null,i),t._tasks[o]&&(t._tasks[o]=i||j)}}(t)}catch(e){if(t._tasks[t._ended+t._active-1])n(t,e);else if(!t._data)throw e}}function n(t,e){var n,o=t._tasks.length;for(t._error=e,t._data=void 0,t._waiting=NaN;--o>=0;)if((n=t._tasks[o])&&(t._tasks[o]=null,n.abort))try{n.abort()}catch(e){}t._active=NaN,r(t)}function r(t){if(!t._active&&t._call){var e=t._data;t._data=void 0,t._call(t._error,e)}}function o(e){if(null==e)e=1/0;else if(!((e=+e)>=1))throw new Error("invalid concurrency");return new t(e)}function i(){}function u(t,e){var n=new i;if(t instanceof i)t.each(function(t,e){n.set(e,t)});else if(Array.isArray(t)){var r,o=-1,u=t.length;if(null==e)for(;++o<u;)n.set(o,t[o]);else for(;++o<u;)n.set(e(r=t[o],o,t),r)}else if(t)for(var a in t)n.set(a,t[a]);return n}function a(){for(var t,e=0,n=arguments.length,r={};e<n;++e){if(!(t=arguments[e]+"")||t in r)throw new Error("illegal type: "+t);r[t]=[]}return new c(r)}function c(t){this._=t}function l(t,e,n){for(var r=0,o=t.length;r<o;++r)if(t[r].name===e){t[r]=R,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=n&&t.push({name:e,value:n}),t}function s(t){return new Function("d","return {"+t.map(function(t,e){return JSON.stringify(t)+": d["+e+"]"}).join(",")+"}")}function f(t,e,n,r){function o(e){return t(e=new Date(+e)),e}return o.floor=o,o.ceil=function(n){return t(n=new Date(n-1)),e(n,1),t(n),n},o.round=function(t){var e=o(t),n=o.ceil(t);return t-e<n-t?e:n},o.offset=function(t,n){return e(t=new Date(+t),null==n?1:Math.floor(n)),t},o.range=function(n,r,i){var u=[];if(n=o.ceil(n),i=null==i?1:Math.floor(i),!(n<r&&i>0))return u;do{u.push(new Date(+n))}while(e(n,i),t(n),n<r);return u},o.filter=function(n){return f(function(e){if(e>=e)for(;t(e),!n(e);)e.setTime(e-1)},function(t,r){if(t>=t)if(r<0)for(;++r<=0;)for(;e(t,-1),!n(t););else for(;--r>=0;)for(;e(t,1),!n(t););})},n&&(o.count=function(e,r){return V.setTime(+e),J.setTime(+r),t(V),t(J),Math.floor(n(V,J))},o.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?o.filter(r?function(e){return r(e)%t==0}:function(e){return o.count(0,e)%t==0}):o:null}),o}function g(t){return f(function(e){e.setDate(e.getDate()-(e.getDay()+7-t)%7),e.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+7*e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*q)/G})}function h(t){return f(function(e){e.setUTCDate(e.getUTCDate()-(e.getUTCDay()+7-t)%7),e.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+7*e)},function(t,e){return(e-t)/G})}function d(t){if(0<=t.y&&t.y<100){var e=new Date(Date.UTC(-1,t.m,t.d,t.H,t.M,t.S,t.L));return e.setUTCFullYear(t.y),e}return new Date(Date.UTC(t.y,t.m,t.d,t.H,t.M,t.S,t.L))}function m(t){return{y:t,m:0,d:1,H:0,M:0,S:0,L:0}}function v(t,e,n){var r=t<0?"-":"",o=(r?-t:t)+"",i=o.length;return r+(i<n?new Array(n-i+1).join(e)+o:o)}function p(t){return new RegExp("^(?:"+t.map(function(t){return t.replace(mt,"\\$&")}).join("|")+")","i")}function w(t){for(var e={},n=-1,r=t.length;++n<r;)e[t[n].toLowerCase()]=n;return e}function y(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.d=+r[0],n+r[0].length):-1}function T(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.H=+r[0],n+r[0].length):-1}function C(t,e){return v(t.getDate(),e,2)}function M(t,e){return v(t.getMilliseconds(),e,3)}function _(t,e){return v(t.getUTCDate(),e,2)}function D(t,e){return v(t.getUTCMilliseconds(),e,3)}function U(){return"%"}function b(t){return+t}function S(t){return Math.floor(+t/1e3)}function x(t,e){return void 0===e&&(e=432e3),"https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url="+t+"&container=focus&refresh="+e}function I(t,e){for(var n=t+"";n.length<e;)n="0"+n;return n}function E(t,e){for(var n=document.getElementById("output").clientHeight*window.devicePixelRatio/t,r=0;r<e.length;r++){var o=e[r];if(o>n)return{blocks:o,level:r}}var i=e.length-1;return{blocks:e[i],level:i}}function k(t){document.getElementById("time").innerHTML=t===jt?"":'<abbr title="'+t+'">'+function(t){var e=Math.floor(((new Date).getTime()-t.getTime())/1e3),n=Math.floor(e/31536e3);return n>1?n+" years":(n=Math.floor(e/2592e3))>1?n+" months":(n=Math.floor(e/86400))>1?n+" days":(n=Math.floor(e/3600))>1?n+" hours":(n=Math.floor(e/60))>1?n+" minutes":Math.floor(e)+" seconds"}(t)+"</abbr> ago"}function F(t,e){k(t),Bt=t,function(t){switch(document.body.classList.remove("himawari"),document.body.classList.remove("dscovr"),document.body.classList.remove("goes"),document.body.classList.remove("goes16"),t){case Ct:case Mt:document.body.classList.add("himawari");break;case _t:case Dt:document.body.classList.add("dscovr");break;case St:document.body.classList.add("goes16");break;case Ut:case bt:document.body.classList.add("goes");break;default:console.warn("Unknown image type",t)}}(e),Zt=e}function L(t){var e={animated:!1,imageType:Mt};"browser"in window?window.browser.storage.sync.get(e).then(t):window.chrome.storage.sync.get(e,t)}function H(){function t(t){!function(t,e){Z("https://himawari-8.appspot.com/latest"+(t===Ct?"?infrared=true":""),function(t,n){if(t)throw t;var r=n.date;e(ft("%Y-%m-%d %H:%M:%S")(r))})}(t,function(e){!function(t,e){if(!Bt||t.getTime()!==Bt.getTime()||Zt!==e){var n=!localStorage.getItem(At);n&&F(t,e);var r=function(t){for(var e=vt+(t.type||Mt),n=t.date,r=t.blocks,o=e+"/"+r+"d/"+xt+"/"+st("%Y/%m/%d/%H%M%S")(n),i=[],u=0;u<r;u++)for(var a=0;a<r;a++){var c=o+"_"+a+"_"+u+".png";i.push({url:x(c),x:a,y:u})}return{blocks:r,date:n,tiles:i}}({blocks:E(xt,It).blocks,date:t,type:e}),i=r.blocks*xt,u=n?document.getElementById("output"):document.createElement("canvas"),a=u.getContext("2d");a.canvas.width=i,a.canvas.height=i;var c=o();r.tiles.forEach(function(t){c.defer(function(t,e){var n=new Image;n.setAttribute("crossOrigin","anonymous"),n.onload=function(){a.drawImage(n,t.x*xt,t.y*xt,xt,xt),e()},n.src=t.url},t)}),c.awaitAll(function(r){if(r)throw r;if(!n){var o=document.getElementById("output").getContext("2d");o.canvas.width=i,o.canvas.height=i,o.drawImage(u,0,0)}F(t,e);var a=u.toDataURL("image/jpeg",Ht);localStorage.setItem(Yt,a),localStorage.setItem(At,t.toDateString()),localStorage.setItem(Ot,e)})}}(e,t)})}navigator.onLine&&(Rt?L(function(e){switch(e.imageType){case _t:case Dt:!function(t){!function(t,e){Z("http://epic.gsfc.nasa.gov/api/"+(t===Dt?"enhanced":"natural"),function(t,n){if(t)throw t;if(0!==n.length){var r=n[n.length-1];e({date:ft("%Y-%m-%d %H:%M:%S")(r.date),image:r.image})}})}(t,function(e){!function(t,e){if(!Bt||t.date.getTime()!==Bt.getTime()||Zt!==e){var n=!localStorage.getItem(At);n&&F(t.date,e);var r=n?document.getElementById("output"):document.createElement("canvas"),o=r.getContext("2d");o.canvas.width=Ft,o.canvas.height=Ft;var i=new Image;i.setAttribute("crossOrigin","anonymous"),i.onload=function(){if(o.drawImage(i,0,0),!n){var u=document.getElementById("output").getContext("2d");u.canvas.width=Ft,u.canvas.height=Ft,u.drawImage(r,0,0)}F(t.date,e);var a=r.toDataURL("image/jpeg",Ht);localStorage.setItem(Yt,a),localStorage.setItem(At,t.date.toDateString()),localStorage.setItem(Ot,e)};var u=e===Dt?"enhanced":"natural",a=I(t.date.getMonth()+1,2),c=I(t.date.getDate(),2);i.src=x(""+pt+u+"/"+t.date.getFullYear()+"/"+a+"/"+c+"/png/"+t.image+".png")}}(e,t)})}(e.imageType);break;case Ut:case bt:!function(t){var e=localStorage.getItem(Ot),n=!e||e!==Ut&&e!==bt;n&&F(jt,t);var r=n?document.getElementById("output"):document.createElement("canvas"),o=r.getContext("2d");o.canvas.width=Lt,o.canvas.height=Lt;var i=new Image;i.setAttribute("crossOrigin","anonymous"),i.onload=function(){if(o.drawImage(i,0,0),!n){var e=document.getElementById("output").getContext("2d");e.canvas.width=Lt,e.canvas.height=Lt,e.drawImage(r,0,0)}F(jt,t);var u=r.toDataURL("image/jpeg",Ht);localStorage.setItem(Yt,u),localStorage.setItem(At,String(jt)),localStorage.setItem(Ot,t)},i.src=x(t===bt?yt:wt,3600)}(e.imageType);break;case St:!function(t){!function(t){Z(Tt+"json/goes-16/full_disk/geocolor/latest_times.json",function(e,n){if(e)throw e;t(ft("%Y%m%d%H%M%S")(n.timestamps_int[0]))})}(function(e){!function(t,e){if(!Bt||t.getTime()!==Bt.getTime()||Zt!==e){var n=!localStorage.getItem(At);n&&F(t,e);var r=function(t){for(var e=t.date,n=t.blocks,r=t.level,o=st("%Y%m%d")(t.date),i=st("%Y%m%d%H%M%S")(t.date),u=Tt+"/imagery/"+o+"/goes-16---full_disk/geocolor/"+i+"/",a=[],c=0;c<n;c++)for(var l=0;l<n;l++){var s=""+u+I(r,2)+"/"+I(c,3)+"_"+I(l,3)+".png";a.push({url:x(s),x:l,y:c})}return{blocks:n,date:e,tiles:a}}(A({date:t},E(Et,kt))),i=r.blocks*xt,u=n?document.getElementById("output"):document.createElement("canvas"),a=u.getContext("2d");a.canvas.width=i,a.canvas.height=i;var c=o();r.tiles.forEach(function(t){c.defer(function(t,e){var n=new Image;n.setAttribute("crossOrigin","anonymous"),n.onload=function(){a.drawImage(n,t.x*xt,t.y*xt,xt,xt),e()},n.src=t.url},t)}),c.awaitAll(function(r){if(r)throw r;if(!n){var o=document.getElementById("output").getContext("2d");o.canvas.width=i,o.canvas.height=i,o.drawImage(u,0,0)}F(t,e);var a=u.toDataURL("image/jpeg",Ht);localStorage.setItem(Yt,a),localStorage.setItem(At,t.toDateString()),localStorage.setItem(Ot,e)})}}(e,t)})}(e.imageType);break;case Ct:case Mt:default:t(e.imageType)}}):t(Mt))}function Y(){localStorage.getItem(At)&&function(){var t=document.getElementById("output").getContext("2d"),e=new Date(localStorage.getItem(At)),n=new Image;n.onload=function(){t.canvas.width=n.width,t.canvas.height=n.height,t.drawImage(n,0,0),F(e,localStorage.getItem(Ot))},n.src=localStorage.getItem(Yt)}(),H()}var A=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},O=[].slice,j={};t.prototype=o.prototype={constructor:t,defer:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("defer after await");if(null!=this._error)return this;var n=O.call(arguments,1);return n.push(t),++this._waiting,this._tasks.push(n),e(this),this},abort:function(){return null==this._error&&n(this,new Error("abort")),this},await:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("multiple await");return this._call=function(e,n){t.apply(null,[e].concat(n))},r(this),this},awaitAll:function(t){if("function"!=typeof t)throw new Error("invalid callback");if(this._call)throw new Error("multiple await");return this._call=t,r(this),this}};i.prototype=u.prototype={constructor:i,has:function(t){return"$"+t in this},get:function(t){return this["$"+t]},set:function(t,e){return this["$"+t]=e,this},remove:function(t){var e="$"+t;return e in this&&delete this[e]},clear:function(){for(var t in this)"$"===t[0]&&delete this[t]},keys:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(e.slice(1));return t},values:function(){var t=[];for(var e in this)"$"===e[0]&&t.push(this[e]);return t},entries:function(){var t=[];for(var e in this)"$"===e[0]&&t.push({key:e.slice(1),value:this[e]});return t},size:function(){var t=0;for(var e in this)"$"===e[0]&&++t;return t},empty:function(){for(var t in this)if("$"===t[0])return!1;return!0},each:function(t){for(var e in this)"$"===e[0]&&t(this[e],e.slice(1),this)}};var R={value:function(){}};c.prototype=a.prototype={constructor:c,on:function(t,e){var n,r=this._,o=function(t,e){return t.trim().split(/^|\s+/).map(function(t){var n="",r=t.indexOf(".");if(r>=0&&(n=t.slice(r+1),t=t.slice(0,r)),t&&!e.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:n}})}(t+"",r),i=-1,u=o.length;{if(!(arguments.length<2)){if(null!=e&&"function"!=typeof e)throw new Error("invalid callback: "+e);for(;++i<u;)if(n=(t=o[i]).type)r[n]=l(r[n],t.name,e);else if(null==e)for(n in r)r[n]=l(r[n],t.name,null);return this}for(;++i<u;)if((n=(t=o[i]).type)&&(n=function(t,e){for(var n,r=0,o=t.length;r<o;++r)if((n=t[r]).name===e)return n.value}(r[n],t.name)))return n}},copy:function(){var t={},e=this._;for(var n in e)t[n]=e[n].slice();return new c(t)},call:function(t,e){if((n=arguments.length-2)>0)for(var n,r,o=new Array(n),i=0;i<n;++i)o[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(i=0,n=(r=this._[t]).length;i<n;++i)r[i].value.apply(e,o)},apply:function(t,e,n){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],o=0,i=r.length;o<i;++o)r[o].value.apply(e,n)}};var B=function(t,e){return function(n,r){var o=function(t,e){function n(t){var e,n=f.status;if(!n&&function(t){var e=t.responseType;return e&&"text"!==e?t.response:t.responseText}(f)||n>=200&&n<300||304===n){if(i)try{e=i.call(r,f)}catch(t){return void l.call("error",r,t)}else e=f;l.call("load",r,e)}else l.call("error",r,t)}var r,o,i,c,l=a("beforesend","progress","load","error"),s=u(),f=new XMLHttpRequest,g=null,h=null,d=0;if("undefined"==typeof XDomainRequest||"withCredentials"in f||!/^(http(s)?:)?\/\//.test(t)||(f=new XDomainRequest),"onload"in f?f.onload=f.onerror=f.ontimeout=n:f.onreadystatechange=function(t){f.readyState>3&&n(t)},f.onprogress=function(t){l.call("progress",r,t)},r={header:function(t,e){return t=(t+"").toLowerCase(),arguments.length<2?s.get(t):(null==e?s.remove(t):s.set(t,e+""),r)},mimeType:function(t){return arguments.length?(o=null==t?null:t+"",r):o},responseType:function(t){return arguments.length?(c=t,r):c},timeout:function(t){return arguments.length?(d=+t,r):d},user:function(t){return arguments.length<1?g:(g=null==t?null:t+"",r)},password:function(t){return arguments.length<1?h:(h=null==t?null:t+"",r)},response:function(t){return i=t,r},get:function(t,e){return r.send("GET",t,e)},post:function(t,e){return r.send("POST",t,e)},send:function(e,n,i){return f.open(e,t,!0,g,h),null==o||s.has("accept")||s.set("accept",o+",*/*"),f.setRequestHeader&&s.each(function(t,e){f.setRequestHeader(e,t)}),null!=o&&f.overrideMimeType&&f.overrideMimeType(o),null!=c&&(f.responseType=c),d>0&&(f.timeout=d),null==i&&"function"==typeof n&&(i=n,n=null),null!=i&&1===i.length&&(i=function(t){return function(e,n){t(null==e?n:null)}}(i)),null!=i&&r.on("error",i).on("load",function(t){i(null,t)}),l.call("beforesend",r,f),f.send(null==n?null:n),r},abort:function(){return f.abort(),r},on:function(){var t=l.on.apply(l,arguments);return t===l?r:t}},null!=e){if("function"!=typeof e)throw new Error("invalid callback: "+e);return r.get(e)}return r}(n).mimeType(t).response(e);if(null!=r){if("function"!=typeof r)throw new Error("invalid callback: "+r);return o.get(r)}return o}};B("text/html",function(t){return document.createRange().createContextualFragment(t.responseText)});var Z=B("application/json",function(t){return JSON.parse(t.responseText)});B("text/plain",function(t){return t.responseText}),B("application/xml",function(t){var e=t.responseXML;if(!e)throw new Error("parse error");return e});var $={},N={},P=34,W=10,X=13,z=function(t){function e(t,e){function n(){if(l)return N;if(s)return s=!1,$;var e,n,r=a;if(t.charCodeAt(r)===P){for(;a++<u&&t.charCodeAt(a)!==P||t.charCodeAt(++a)===P;);return(e=a)>=u?l=!0:(n=t.charCodeAt(a++))===W?s=!0:n===X&&(s=!0,t.charCodeAt(a)===W&&++a),t.slice(r+1,e-1).replace(/""/g,'"')}for(;a<u;){if((n=t.charCodeAt(e=a++))===W)s=!0;else if(n===X)s=!0,t.charCodeAt(a)===W&&++a;else if(n!==o)continue;return t.slice(r,e)}return l=!0,t.slice(r,u)}var r,i=[],u=t.length,a=0,c=0,l=u<=0,s=!1;for(t.charCodeAt(u-1)===W&&--u,t.charCodeAt(u-1)===X&&--u;(r=n())!==N;){for(var f=[];r!==$&&r!==N;)f.push(r),r=n();e&&null==(f=e(f,c++))||i.push(f)}return i}function n(t){return null==t?"":r.test(t+="")?'"'+t.replace(/"/g,'""')+'"':t}var r=new RegExp('["'+t+"\n\r]"),o=t.charCodeAt(0);return{parse:function(t,n){var r,o,i=e(t,function(t,e){if(r)return r(t,e-1);o=t,r=n?function(t,e){var n=s(t);return function(r,o){return e(n(r),o,t)}}(t,n):s(t)});return i.columns=o,i},parseRows:e,format:function(e,r){return null==r&&(r=function(t){var e=Object.create(null),n=[];return t.forEach(function(t){for(var r in t)r in e||n.push(e[r]=r)}),n}(e)),[r.map(n).join(t)].concat(e.map(function(e){return r.map(function(t){return n(e[t])}).join(t)})).join("\n")},formatRows:function(e){return e.map(function(e){return e.map(n).join(t)}).join("\n")}}},V=(z(","),z("\t"),new Date),J=new Date,Q=f(function(){},function(t,e){t.setTime(+t+e)},function(t,e){return e-t});Q.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?f(function(e){e.setTime(Math.floor(e/t)*t)},function(e,n){e.setTime(+e+n*t)},function(e,n){return(n-e)/t}):Q:null};var q=6e4,G=6048e5,K=(f(function(t){t.setTime(1e3*Math.floor(t/1e3))},function(t,e){t.setTime(+t+1e3*e)},function(t,e){return(e-t)/1e3},function(t){return t.getUTCSeconds()}),f(function(t){t.setTime(Math.floor(t/q)*q)},function(t,e){t.setTime(+t+e*q)},function(t,e){return(e-t)/q},function(t){return t.getMinutes()}),f(function(t){var e=t.getTimezoneOffset()*q%36e5;e<0&&(e+=36e5),t.setTime(36e5*Math.floor((+t-e)/36e5)+e)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getHours()}),f(function(t){t.setHours(0,0,0,0)},function(t,e){t.setDate(t.getDate()+e)},function(t,e){return(e-t-(e.getTimezoneOffset()-t.getTimezoneOffset())*q)/864e5},function(t){return t.getDate()-1})),tt=g(0),et=g(1),nt=(g(2),g(3),g(4)),rt=(g(5),g(6),f(function(t){t.setDate(1),t.setHours(0,0,0,0)},function(t,e){t.setMonth(t.getMonth()+e)},function(t,e){return e.getMonth()-t.getMonth()+12*(e.getFullYear()-t.getFullYear())},function(t){return t.getMonth()}),f(function(t){t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,e){t.setFullYear(t.getFullYear()+e)},function(t,e){return e.getFullYear()-t.getFullYear()},function(t){return t.getFullYear()}));rt.every=function(t){return isFinite(t=Math.floor(t))&&t>0?f(function(e){e.setFullYear(Math.floor(e.getFullYear()/t)*t),e.setMonth(0,1),e.setHours(0,0,0,0)},function(e,n){e.setFullYear(e.getFullYear()+n*t)}):null};f(function(t){t.setUTCSeconds(0,0)},function(t,e){t.setTime(+t+e*q)},function(t,e){return(e-t)/q},function(t){return t.getUTCMinutes()}),f(function(t){t.setUTCMinutes(0,0,0)},function(t,e){t.setTime(+t+36e5*e)},function(t,e){return(e-t)/36e5},function(t){return t.getUTCHours()});var ot=f(function(t){t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCDate(t.getUTCDate()+e)},function(t,e){return(e-t)/864e5},function(t){return t.getUTCDate()-1}),it=h(0),ut=h(1),at=(h(2),h(3),h(4)),ct=(h(5),h(6),f(function(t){t.setUTCDate(1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCMonth(t.getUTCMonth()+e)},function(t,e){return e.getUTCMonth()-t.getUTCMonth()+12*(e.getUTCFullYear()-t.getUTCFullYear())},function(t){return t.getUTCMonth()}),f(function(t){t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,e){t.setUTCFullYear(t.getUTCFullYear()+e)},function(t,e){return e.getUTCFullYear()-t.getUTCFullYear()},function(t){return t.getUTCFullYear()}));ct.every=function(t){return isFinite(t=Math.floor(t))&&t>0?f(function(e){e.setUTCFullYear(Math.floor(e.getUTCFullYear()/t)*t),e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},function(e,n){e.setUTCFullYear(e.getUTCFullYear()+n*t)}):null};var lt,st,ft,gt={"-":"",_:" ",0:"0"},ht=/^\s*\d+/,dt=/^%/,mt=/[\\^$*+?|[\]().{}]/g;!function(t){lt=function(t){function e(t,e){return function(n){var r,o,i,u=[],a=-1,c=0,l=t.length;for(n instanceof Date||(n=new Date(+n));++a<l;)37===t.charCodeAt(a)&&(u.push(t.slice(c,a)),null!=(o=gt[r=t.charAt(++a)])?r=t.charAt(++a):o="e"===r?" ":"0",(i=e[r])&&(r=i(n,o)),u.push(r),c=a+1);return u.push(t.slice(c,a)),u.join("")}}function n(t,e){return function(n){var o,i,u=m(1900);if(r(u,t,n+="",0)!=n.length)return null;if("Q"in u)return new Date(u.Q);if("p"in u&&(u.H=u.H%12+12*u.p),"V"in u){if(u.V<1||u.V>53)return null;"w"in u||(u.w=1),"Z"in u?(o=(i=(o=d(m(u.y))).getUTCDay())>4||0===i?ut.ceil(o):ut(o),o=ot.offset(o,7*(u.V-1)),u.y=o.getUTCFullYear(),u.m=o.getUTCMonth(),u.d=o.getUTCDate()+(u.w+6)%7):(o=(i=(o=e(m(u.y))).getDay())>4||0===i?et.ceil(o):et(o),o=K.offset(o,7*(u.V-1)),u.y=o.getFullYear(),u.m=o.getMonth(),u.d=o.getDate()+(u.w+6)%7)}else("W"in u||"U"in u)&&("w"in u||(u.w="u"in u?u.u%7:"W"in u?1:0),i="Z"in u?d(m(u.y)).getUTCDay():e(m(u.y)).getDay(),u.m=0,u.d="W"in u?(u.w+6)%7+7*u.W-(i+5)%7:u.w+7*u.U-(i+6)%7);return"Z"in u?(u.H+=u.Z/100|0,u.M+=u.Z%100,d(u)):e(u)}}function r(t,e,n,r){for(var o,i,u=0,a=e.length,c=n.length;u<a;){if(r>=c)return-1;if(37===(o=e.charCodeAt(u++))){if(o=e.charAt(u++),!(i=j[o in gt?e.charAt(u++):o])||(r=i(t,n,r))<0)return-1}else if(o!=n.charCodeAt(r++))return-1}return r}var o=t.dateTime,i=t.date,u=t.time,a=t.periods,c=t.days,l=t.shortDays,s=t.months,f=t.shortMonths,g=p(a),h=w(a),x=p(c),I=w(c),E=p(l),k=w(l),F=p(s),L=w(s),H=p(f),Y=w(f),A={a:function(t){return l[t.getDay()]},A:function(t){return c[t.getDay()]},b:function(t){return f[t.getMonth()]},B:function(t){return s[t.getMonth()]},c:null,d:C,e:C,f:function(t,e){return M(t,e)+"000"},H:function(t,e){return v(t.getHours(),e,2)},I:function(t,e){return v(t.getHours()%12||12,e,2)},j:function(t,e){return v(1+K.count(rt(t),t),e,3)},L:M,m:function(t,e){return v(t.getMonth()+1,e,2)},M:function(t,e){return v(t.getMinutes(),e,2)},p:function(t){return a[+(t.getHours()>=12)]},Q:b,s:S,S:function(t,e){return v(t.getSeconds(),e,2)},u:function(t){var e=t.getDay();return 0===e?7:e},U:function(t,e){return v(tt.count(rt(t),t),e,2)},V:function(t,e){var n=t.getDay();return t=n>=4||0===n?nt(t):nt.ceil(t),v(nt.count(rt(t),t)+(4===rt(t).getDay()),e,2)},w:function(t){return t.getDay()},W:function(t,e){return v(et.count(rt(t),t),e,2)},x:null,X:null,y:function(t,e){return v(t.getFullYear()%100,e,2)},Y:function(t,e){return v(t.getFullYear()%1e4,e,4)},Z:function(t){var e=t.getTimezoneOffset();return(e>0?"-":(e*=-1,"+"))+v(e/60|0,"0",2)+v(e%60,"0",2)},"%":U},O={a:function(t){return l[t.getUTCDay()]},A:function(t){return c[t.getUTCDay()]},b:function(t){return f[t.getUTCMonth()]},B:function(t){return s[t.getUTCMonth()]},c:null,d:_,e:_,f:function(t,e){return D(t,e)+"000"},H:function(t,e){return v(t.getUTCHours(),e,2)},I:function(t,e){return v(t.getUTCHours()%12||12,e,2)},j:function(t,e){return v(1+ot.count(ct(t),t),e,3)},L:D,m:function(t,e){return v(t.getUTCMonth()+1,e,2)},M:function(t,e){return v(t.getUTCMinutes(),e,2)},p:function(t){return a[+(t.getUTCHours()>=12)]},Q:b,s:S,S:function(t,e){return v(t.getUTCSeconds(),e,2)},u:function(t){var e=t.getUTCDay();return 0===e?7:e},U:function(t,e){return v(it.count(ct(t),t),e,2)},V:function(t,e){var n=t.getUTCDay();return t=n>=4||0===n?at(t):at.ceil(t),v(at.count(ct(t),t)+(4===ct(t).getUTCDay()),e,2)},w:function(t){return t.getUTCDay()},W:function(t,e){return v(ut.count(ct(t),t),e,2)},x:null,X:null,y:function(t,e){return v(t.getUTCFullYear()%100,e,2)},Y:function(t,e){return v(t.getUTCFullYear()%1e4,e,4)},Z:function(){return"+0000"},"%":U},j={a:function(t,e,n){var r=E.exec(e.slice(n));return r?(t.w=k[r[0].toLowerCase()],n+r[0].length):-1},A:function(t,e,n){var r=x.exec(e.slice(n));return r?(t.w=I[r[0].toLowerCase()],n+r[0].length):-1},b:function(t,e,n){var r=H.exec(e.slice(n));return r?(t.m=Y[r[0].toLowerCase()],n+r[0].length):-1},B:function(t,e,n){var r=F.exec(e.slice(n));return r?(t.m=L[r[0].toLowerCase()],n+r[0].length):-1},c:function(t,e,n){return r(t,o,e,n)},d:y,e:y,f:function(t,e,n){var r=ht.exec(e.slice(n,n+6));return r?(t.L=Math.floor(r[0]/1e3),n+r[0].length):-1},H:T,I:T,j:function(t,e,n){var r=ht.exec(e.slice(n,n+3));return r?(t.m=0,t.d=+r[0],n+r[0].length):-1},L:function(t,e,n){var r=ht.exec(e.slice(n,n+3));return r?(t.L=+r[0],n+r[0].length):-1},m:function(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.m=r[0]-1,n+r[0].length):-1},M:function(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.M=+r[0],n+r[0].length):-1},p:function(t,e,n){var r=g.exec(e.slice(n));return r?(t.p=h[r[0].toLowerCase()],n+r[0].length):-1},Q:function(t,e,n){var r=ht.exec(e.slice(n));return r?(t.Q=+r[0],n+r[0].length):-1},s:function(t,e,n){var r=ht.exec(e.slice(n));return r?(t.Q=1e3*+r[0],n+r[0].length):-1},S:function(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.S=+r[0],n+r[0].length):-1},u:function(t,e,n){var r=ht.exec(e.slice(n,n+1));return r?(t.u=+r[0],n+r[0].length):-1},U:function(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.U=+r[0],n+r[0].length):-1},V:function(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.V=+r[0],n+r[0].length):-1},w:function(t,e,n){var r=ht.exec(e.slice(n,n+1));return r?(t.w=+r[0],n+r[0].length):-1},W:function(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.W=+r[0],n+r[0].length):-1},x:function(t,e,n){return r(t,i,e,n)},X:function(t,e,n){return r(t,u,e,n)},y:function(t,e,n){var r=ht.exec(e.slice(n,n+2));return r?(t.y=+r[0]+(+r[0]>68?1900:2e3),n+r[0].length):-1},Y:function(t,e,n){var r=ht.exec(e.slice(n,n+4));return r?(t.y=+r[0],n+r[0].length):-1},Z:function(t,e,n){var r=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n,n+6));return r?(t.Z=r[1]?0:-(r[2]+(r[3]||"00")),n+r[0].length):-1},"%":function(t,e,n){var r=dt.exec(e.slice(n,n+1));return r?n+r[0].length:-1}};return A.x=e(i,A),A.X=e(u,A),A.c=e(o,A),O.x=e(i,O),O.X=e(u,O),O.c=e(o,O),{format:function(t){var n=e(t+="",A);return n.toString=function(){return t},n},parse:function(t){var e=n(t+="",function(t){if(0<=t.y&&t.y<100){var e=new Date(-1,t.m,t.d,t.H,t.M,t.S,t.L);return e.setFullYear(t.y),e}return new Date(t.y,t.m,t.d,t.H,t.M,t.S,t.L)});return e.toString=function(){return t},e},utcFormat:function(t){var n=e(t+="",O);return n.toString=function(){return t},n},utcParse:function(t){var e=n(t,d);return e.toString=function(){return t},e}}}(t),st=lt.utcFormat,ft=lt.utcParse}({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});Date.prototype.toISOString||st("%Y-%m-%dT%H:%M:%S.%LZ"),+new Date("2000-01-01T00:00:00.000Z")||ft("%Y-%m-%dT%H:%M:%S.%LZ");var vt="https://himawari8-dl.nict.go.jp/himawari8/img/",pt="https://epic.gsfc.nasa.gov/archive/",wt="http://goes.gsfc.nasa.gov/goescolor/goeseast/overview2/color_lrg/latestfull.jpg",yt="http://goes.gsfc.nasa.gov/goescolor/goeswest/overview2/color_lrg/latestfull.jpg",Tt="http://rammb-slider.cira.colostate.edu/data/",Ct="INFRARED_FULL",Mt="D531106",_t="EPIC",Dt="EPIC_ENHANCED",Ut="GOES_EAST",bt="GOES_WEST",St="GOES_16",xt=550,It=[1,4,8,16,20],Et=678,kt=[1,2,4,8,16],Ft=2048,Lt=3072,Ht=.9,Yt="imageData",At="cachedDate",Ot="cachedImageType",jt=null,Rt="chrome"in window&&!!window.chrome.storage,Bt=null,Zt=null;window.setInterval(H,6e4),window.addEventListener("online",H),Rt?L(function(t){t.animated?document.body.classList.add("animated"):document.body.classList.remove("animated"),Y()}):Y(),window.setInterval(function(){Bt&&k(Bt)},1e4),Rt&&(window.chrome.storage.onChanged.addListener(H),document.body.classList.add("extension"),document.getElementById("go-to-options").addEventListener("click",function(){window.chrome.runtime.openOptionsPage()})),document.getElementById("explore").addEventListener("click",function(){switch(Zt){case _t:window.open("https://epic.gsfc.nasa.gov","_self");case Dt:window.open("https://epic.gsfc.nasa.gov/enhanced","_self");break;case St:window.open("http://rammb-slider.cira.colostate.edu/","_self");break;case Ct:case Mt:window.open("http://himawari8.nict.go.jp/himawari8-image.htm?sI=D531106","_self");break;default:window.alert("No explorer found.")}})}();
//# sourceMappingURL=bundle.js.map
