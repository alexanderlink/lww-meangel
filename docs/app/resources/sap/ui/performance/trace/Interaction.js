/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/performance/Measurement","sap/ui/performance/XHRInterceptor","sap/ui/performance/trace/FESRHelper","sap/base/util/LoaderExtensions","sap/base/util/now","sap/base/util/uid","sap/base/Log","sap/ui/thirdparty/URI"],function(e,t,i,n,r,s,a,o){"use strict";var u=window.location.host,p="INTERACTION",d=false,f=[],g,c={"application/zip":true,"application/vnd.rar":true,"application/gzip":true,"application/x-tar":true,"application/java-archive":true,"image/jpeg":true,"application/pdf":true},l="zip,rar,arj,z,gz,tar,lzh,cab,hqx,ace,jar,ear,war,jpg,jpeg,pdf,gzip";let m=false,h;function v(e){var t=new o(e).host();return t&&t!==u}function y(e){var t=e.toString();var i="";for(var n=0;n<t.length;n+=2){i+=String.fromCharCode(parseInt(t.substr(n,2),16))}return i.trim()}function S(e){return{event:"startup",trigger:"undetermined",component:"undetermined",appVersion:"undetermined",start:e||performance.timeOrigin,end:0,navigation:0,roundtrip:0,processing:0,duration:0,requests:[],measurements:[],sapStatistics:[],requestTime:0,networkTime:0,bytesSent:0,bytesReceived:0,requestCompression:"X",busyDuration:0,id:s(),passportAction:"undetermined_startup_0"}}function I(e){if(e.start>g.start&&e.end<g.end){return e}}function L(e){var t=e.startTime>0&&e.startTime<=e.requestStart&&e.requestStart<=e.responseEnd;var i=g.start<=performance.timeOrigin+e.requestStart&&g.end>=performance.timeOrigin+e.responseEnd;return i&&t&&e.initiatorType==="xmlhttprequest"}function b(e){this.end=e.responseEnd>this.end?e.responseEnd:this.end;g.requestTime+=e.responseEnd-e.startTime;if(this.roundtripHigherLimit<=e.startTime){g.navigation+=this.navigationHigherLimit-this.navigationLowerLimit;g.roundtrip+=this.roundtripHigherLimit-this.roundtripLowerLimit;this.navigationLowerLimit=e.startTime;this.roundtripLowerLimit=e.startTime}if(e.responseEnd>this.roundtripHigherLimit){this.roundtripHigherLimit=e.responseEnd}if(e.requestStart>this.navigationHigherLimit){this.navigationHigherLimit=e.requestStart}}function T(e){var t={start:e[0].startTime,end:e[0].responseEnd,navigationLowerLimit:e[0].startTime,navigationHigherLimit:e[0].requestStart,roundtripLowerLimit:e[0].startTime,roundtripHigherLimit:e[0].responseEnd};e.forEach(b,t);g.navigation+=t.navigationHigherLimit-t.navigationLowerLimit;g.roundtrip+=t.roundtripHigherLimit-t.roundtripLowerLimit;if(g.networkTime){var i=g.requestTime-g.networkTime;g.networkTime=i/e.length}else{g.networkTime=0}}function E(t){if(g){var i=performance.getEntriesByType("resource");var n;g.end=t;g.processing=t-g.start;g.duration=g.processing;g.requests=i.filter(L);g.completeRoundtrips=0;g.measurements=e.filterMeasurements(I,true);if(g.requests.length>0){T(g.requests)}g.completeRoundtrips=g.requests.length;var r=g.processing-g.navigation-g.roundtrip;g.processing=r>-1?r:0;g.completed=true;Object.freeze(g);if(g.semanticStepName||g.duration>=2||g.requests.length>0||d){f.push(g);n=f[f.length-1];if(a.isLoggable()){a.debug("Interaction step finished: trigger: "+g.trigger+"; duration: "+g.duration+"; requests: "+g.requests.length,"Interaction.js")}}if(M.onInteractionFinished){M.onInteractionFinished(n)}g=null;w=null;d=false;A=false;N=false;clearTimeout(h)}}function H(e){var t,i;if(e){var n,r;n=sap.ui.require("sap/ui/core/Component");if(n){while(e&&e.getParent){r=n.getOwnerComponentFor(e);if(r||e instanceof n){r=r||e;var s=r.getManifestEntry("sap.app");t=s&&s.id||r.getMetadata().getName();i=s&&s.applicationVersion&&s.applicationVersion.version}e=e.getParent()}}}return{id:t?t:"undetermined",version:i?i:""}}var q=false,w,R,A=false,N=false,C,P=false,_=false,D=0,O=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src");function j(){Object.defineProperty(HTMLScriptElement.prototype,"src",{set:function(e){var t;if(!this.dataset.sapUiCoreInteractionHandled){t=M.notifyAsyncStep();this.addEventListener("load",function(){t()});this.addEventListener("error",function(){t()});this.dataset.sapUiCoreInteractionHandled="true"}O.set.call(this,e)},get:O.get})}function k(){t.register(p,"send",function(){if(this.pendingInteraction){this.pendingInteraction.bytesSent+=arguments[0]?arguments[0].length:0}});t.register(p,"setRequestHeader",function(e,t){if(!this.requestHeaderLength){this.requestHeaderLength=0}this.requestHeaderLength+=(e+"").length+(t+"").length});t.register(p,"open",function(e,t,i){var n,r,s;function a(e){if(this.readyState===4){e()}}if(g){var o=!v(t);if(o){n=M.passportHeader.get(this);if(n&&n.length>=370){r=y(n.substring(150,230));if(parseInt(n.substring(8,10),16)>2){s=n.substring(372,404)}}if(!n||r&&s&&g.passportAction.endsWith(r)){this.addEventListener("readystatechange",B.bind(this,g.id))}}if(o||i!==false){this.addEventListener("readystatechange",a.bind(this,M.notifyAsyncStep()))}this.pendingInteraction=g}})}function z(e,t,i,n){var r=e.split(".").pop().split(/\#|\?/)[0];if(t==="gzip"||t==="br"||i in c||r&&l.indexOf(r)!==-1||n<1024){return true}else{return false}}function B(e){if(this.readyState===4){if(this.pendingInteraction&&!this.pendingInteraction.completed&&g.id===e){var t=this.getResponseHeader("content-length"),i=z(this.responseURL,this.getResponseHeader("content-encoding"),this.getResponseHeader("content-type"),t),n=this.getResponseHeader("sap-perf-fesrec");this.pendingInteraction.bytesReceived+=t?parseInt(t):0;this.pendingInteraction.bytesReceived+=this.getAllResponseHeaders().length;this.pendingInteraction.bytesSent+=this.requestHeaderLength||0;this.pendingInteraction.requestCompression=i&&this.pendingInteraction.requestCompression!==false;this.pendingInteraction.networkTime+=n?Math.round(parseFloat(n,10)/1e3):0;var r=this.getResponseHeader("sap-statistics");if(r){var s=performance.getEntriesByType("resource");this.pendingInteraction.sapStatistics.push({url:this.responseURL,statistics:r,timing:s?s[s.length-1]:undefined})}delete this.requestHeaderLength;delete this.pendingInteraction}}}var M={getAll:function(e){if(e){M.end(true)}return f},filter:function(e){var t=[];if(e){for(var i=0,n=f.length;i<n;i++){if(e(f[i])){t.push(f[i])}}}return t},getPending:function(){return g},clear:function(){f=[]},start:function(e,t){var n=r();if(g){E(n)}if(C){clearTimeout(C)}D=0;if(performance.clearResourceTimings){performance.clearResourceTimings()}var s=H(t);g=S(m?n:undefined);g.event=e;g.component=s.id;g.appVersion=s.version;if(t&&t.getId){g.trigger=t.getId();g.semanticStepName=i.getSemanticStepname(t,e)}if(a.isLoggable(null,"sap.ui.Performance")){console.time("INTERACTION: "+g.trigger+" - "+g.event)}if(a.isLoggable()){a.debug("Interaction step started: trigger: "+g.trigger+"; type: "+g.event,"Interaction.js")}},end:function(e){if(g){if(e){if(a.isLoggable(null,"sap.ui.Performance")){console.timeEnd("INTERACTION: "+g.trigger+" - "+g.event)}E(g.preliminaryEnd||r());if(a.isLoggable()){a.debug("Interaction ended...")}}else{g.preliminaryEnd=r()}}},getActive:function(){return q},setActive:function(e){q=e;if(e){if(!m){k();j();n.notifyResourceLoading=M.notifyAsyncStep}M.notifyStepStart("startup","startup",true);m=true}},notifyNavigation:function(){d=true},notifyShowBusyIndicator:function(e){e._sapui_fesr_fDelayedStartTime=r()+e.getBusyIndicatorDelay()},notifyHideBusyIndicator:function(e){if(e._sapui_fesr_fDelayedStartTime){var t=r()-e._sapui_fesr_fDelayedStartTime;M.addBusyDuration(t>0?t:0);delete e._sapui_fesr_fDelayedStartTime}},notifyStepStart:function(e,t,n){if(q){var r,s,a;if(!g&&w||n){if(n){r="startup"}else{r=e}M.start(r,t);g=M.getPending();if(g&&!g.completed&&M.onInteractionStarted){g.passportAction=M.onInteractionStarted(g,n)}if(w){R=w.srcControl}a=i.getSemanticStepname(R,e);if(t&&t.getId&&R&&t.getId()===R.getId()){N=true}else if(a){g.trigger=R.getId();g.semanticStepName=a;N=true}else{s=R;while(s&&s.getParent()){s=s.getParent();if(t.getId()===s.getId()){A=true;break}}}w=null;d=false;h=setTimeout(function(){w=null},0);P=false;M.notifyStepEnd(true)}else if(g&&R&&!N){s=R;a=i.getSemanticStepname(R,e);if(s&&t.getId()===s.getId()){g.trigger=t.getId();g.semanticStepName=a;g.event=e;N=true}else if(a){g.trigger=R.getId();g.semanticStepName=a;N=true}else if(!A){while(s&&s.getParent()){s=s.getParent();if(t.getId()===s.getId()){g.trigger=t.getId();g.semanticStepName=i.getSemanticStepname(t,e);g.event=e;break}}}}}},notifyAsyncStep:function(e){if(g){if(a.isLoggable(null,"sap.ui.Performance")&&e){console.time(e)}var t=g.id;delete g.preliminaryEnd;M.notifyAsyncStepStart();return function(){M.notifyAsyncStepEnd(t);if(a.isLoggable(null,"sap.ui.Performance")&&e){console.timeEnd(e)}}}else{return function(){}}},notifyAsyncStepStart:function(){if(g){D++;clearTimeout(C);P=false;if(a.isLoggable()){a.debug("Interaction relevant step started - Number of pending steps: "+D)}}},notifyAsyncStepEnd:function(e){if(g&&e===g.id){D--;M.notifyStepEnd(true);if(a.isLoggable()){a.debug("Interaction relevant step stopped - Number of pending steps: "+D)}}},notifyStepEnd:function(e){if(q&&!_){if(D===0||!e){if(P||!e){M.end(true);if(a.isLoggable()){a.debug("Interaction stopped")}P=false}else{M.end();P=true;if(C){clearTimeout(C)}C=setTimeout(M.notifyStepEnd,301);if(a.isLoggable()){a.debug("Interaction check for idle time - Number of pending steps: "+D)}}}}},notifyEventStart:function(e){w=q?e:null},notifyScrollEvent:function(e){},notifyEventEnd:function(){if(w){if(w.type.match(/^(mousedown|touchstart|keydown)$/)){M.end(true)}if(this.eventEndTimer){clearTimeout(this.eventEndTimer)}this.eventEndTimer=setTimeout(function(){w=null;delete this.eventEndTimer}.bind(this),10)}},onInteractionStarted:null,onInteractionFinished:null,setStepComponent:function(e){if(q&&g&&e&&!g.stepComponent){g.stepComponent=e}},addBusyDuration:function(e){if(q&&g){if(!g.busyDuration){g.busyDuration=0}g.busyDuration+=e}}};return M});
//# sourceMappingURL=Interaction.js.map