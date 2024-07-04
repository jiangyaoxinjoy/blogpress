import{s as P,a7 as j}from"./framework.D9UbSEwM.js";var L=i=>{throw TypeError(i)},O=(i,s,t)=>s.has(i)||L("Cannot "+t),w=(i,s,t)=>(O(i,s,"read from private field"),t?t.call(i):s.get(i)),k=(i,s,t)=>s.has(i)?L("Cannot add the same private member more than once"):s instanceof WeakSet?s.add(i):s.set(i,t),S=(i,s,t,p)=>(O(i,s,"write to private field"),s.set(i,t),t);const b=P(1),A=1440,T=(i,s)=>{const t=s.documentElement,p=i.devicePixelRatio||1;function g(){s.body?s.body.style.fontSize=12*p+"px":s.addEventListener("DOMContentLoaded",g)}g();function y(){const d=t.clientWidth/10;t.style.fontSize=d+"px",b.value=t.clientWidth/A}return y(),i.addEventListener("resize",y),i.addEventListener("pageshow",function(d){d.persisted&&y()}),{flexiableRatio:j(b)}};function M(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var C={exports:{}};(function(i){var s=Object.prototype.hasOwnProperty,t="~";function p(){}Object.create&&(p.prototype=Object.create(null),new p().__proto__||(t=!1));function g(e,r,o){this.fn=e,this.context=r,this.once=o||!1}function y(e,r,o,u,v){if(typeof o!="function")throw new TypeError("The listener must be a function");var c=new g(o,u||e,v),f=t?t+r:r;return e._events[f]?e._events[f].fn?e._events[f]=[e._events[f],c]:e._events[f].push(c):(e._events[f]=c,e._eventsCount++),e}function d(e,r){--e._eventsCount===0?e._events=new p:delete e._events[r]}function l(){this._events=new p,this._eventsCount=0}l.prototype.eventNames=function(){var e=[],r,o;if(this._eventsCount===0)return e;for(o in r=this._events)s.call(r,o)&&e.push(t?o.slice(1):o);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(r)):e},l.prototype.listeners=function(e){var r=t?t+e:e,o=this._events[r];if(!o)return[];if(o.fn)return[o.fn];for(var u=0,v=o.length,c=new Array(v);u<v;u++)c[u]=o[u].fn;return c},l.prototype.listenerCount=function(e){var r=t?t+e:e,o=this._events[r];return o?o.fn?1:o.length:0},l.prototype.emit=function(e,r,o,u,v,c){var f=t?t+e:e;if(!this._events[f])return!1;var n=this._events[f],_=arguments.length,m,a;if(n.fn){switch(n.once&&this.removeListener(e,n.fn,void 0,!0),_){case 1:return n.fn.call(n.context),!0;case 2:return n.fn.call(n.context,r),!0;case 3:return n.fn.call(n.context,r,o),!0;case 4:return n.fn.call(n.context,r,o,u),!0;case 5:return n.fn.call(n.context,r,o,u,v),!0;case 6:return n.fn.call(n.context,r,o,u,v,c),!0}for(a=1,m=new Array(_-1);a<_;a++)m[a-1]=arguments[a];n.fn.apply(n.context,m)}else{var E=n.length,x;for(a=0;a<E;a++)switch(n[a].once&&this.removeListener(e,n[a].fn,void 0,!0),_){case 1:n[a].fn.call(n[a].context);break;case 2:n[a].fn.call(n[a].context,r);break;case 3:n[a].fn.call(n[a].context,r,o);break;case 4:n[a].fn.call(n[a].context,r,o,u);break;default:if(!m)for(x=1,m=new Array(_-1);x<_;x++)m[x-1]=arguments[x];n[a].fn.apply(n[a].context,m)}}return!0},l.prototype.on=function(e,r,o){return y(this,e,r,o,!1)},l.prototype.once=function(e,r,o){return y(this,e,r,o,!0)},l.prototype.removeListener=function(e,r,o,u){var v=t?t+e:e;if(!this._events[v])return this;if(!r)return d(this,v),this;var c=this._events[v];if(c.fn)c.fn===r&&(!u||c.once)&&(!o||c.context===o)&&d(this,v);else{for(var f=0,n=[],_=c.length;f<_;f++)(c[f].fn!==r||u&&!c[f].once||o&&c[f].context!==o)&&n.push(c[f]);n.length?this._events[v]=n.length===1?n[0]:n:d(this,v)}return this},l.prototype.removeAllListeners=function(e){var r;return e?(r=t?t+e:e,this._events[r]&&d(this,r)):(this._events=new p,this._eventsCount=0),this},l.prototype.off=l.prototype.removeListener,l.prototype.addListener=l.prototype.on,l.prefixed=t,l.EventEmitter=l,i.exports=l})(C);var W=C.exports;const z=M(W);var h;class D{constructor(){k(this,h),S(this,h,new z)}once(s,t){if(t)w(this,h).once(s,t);else return new Promise(p=>w(this,h).once(s,p))}on(s,t){if(t)w(this,h).on(s,t);else return new Promise(p=>w(this,h).on(s,p))}removeListener(s){w(this,h).removeListener(s)}emit(s,t){w(this,h).emit(s,t)}}h=new WeakMap;export{D as B,T as M};
