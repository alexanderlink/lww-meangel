/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AnnotationHelperBasics","sap/base/Log","sap/ui/base/BindingParser","sap/ui/base/ManagedObject","sap/ui/core/CalendarType","sap/ui/core/format/DateFormat","sap/ui/model/odata/ODataUtils","sap/ui/performance/Measurement"],function(e,t,r,a,n,i,s,o){"use strict";var u="sap.ui.model.odata.AnnotationHelper",l,p,c="\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",d="[-+]?\\d+(?:\\.\\d+)?",m="9007199254740991",f="-"+m,g=[u],y=u+"/getExpression",E,v="(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(\\.\\d{1,12})?)?",T={Bool:/^true$|^false$/i,Float:new RegExp("^"+d+"(?:[eE][-+]?\\d+)?$|^NaN$|^-INF$|^INF$"),Date:new RegExp("^"+c+"$"),DateTimeOffset:new RegExp("^"+c+"T"+v+"(?:Z|[-+](?:0\\d|1[0-3]):[0-5]\\d|[-+]14:00)$","i"),Decimal:new RegExp("^"+d+"$"),Guid:/^[A-F0-9]{8}-(?:[A-F0-9]{4}-){3}[A-F0-9]{12}$/i,Int:/^[-+]?\d{1,19}$/,TimeOfDay:new RegExp("^"+v+"$")},D,x=/^\{@i18n>[^\\\{\}:]+\}$/,S=/^\d+$/,h={And:"&&",Eq:"===",Ge:">=",Gt:">",Le:"<=",Lt:"<",Ne:"!==",Not:"!",Or:"||"},O=/^(\/dataServices\/schema\/\d+)(?:\/|$)/,b={"Edm.Boolean":"boolean","Edm.Byte":"number","Edm.Date":"date","Edm.DateTime":"datetime","Edm.DateTimeOffset":"datetime","Edm.Decimal":"decimal","Edm.Double":"number","Edm.Float":"number","Edm.Guid":"string","Edm.Int16":"number","Edm.Int32":"number","Edm.Int64":"decimal","Edm.SByte":"number","Edm.Single":"number","Edm.String":"string","Edm.Time":"time","Edm.TimeOfDay":"time"},P={Bool:"Edm.Boolean",Float:"Edm.Double",Date:"Edm.Date",DateTimeOffset:"Edm.DateTimeOffset",Decimal:"Edm.Decimal",Guid:"Edm.Guid",Int:"Edm.Int64",String:"Edm.String",TimeOfDay:"Edm.TimeOfDay"},w={boolean:false,date:true,datetime:true,decimal:true,number:false,string:false,time:true};D={_setDateTimeFormatter:function(){l=i.getDateInstance({calendarType:n.Gregorian,pattern:"yyyy-MM-dd",strictParsing:true,UTC:true});p=i.getDateTimeInstance({calendarType:n.Gregorian,pattern:"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",strictParsing:true});E=i.getTimeInstance({calendarType:n.Gregorian,pattern:"HH:mm:ss.SSS",strictParsing:true,UTC:true})},adjustOperands:function(e,t){if(e.result!=="constant"&&e.category==="number"&&t.result==="constant"&&t.type==="Edm.Int64"){t.category="number"}if(e.result!=="constant"&&e.category==="decimal"&&t.result==="constant"&&t.type==="Edm.Int32"){t.category="decimal";t.type=e.type}if(e.result==="constant"&&e.category==="date"&&t.result!=="constant"&&t.category==="datetime"){t.category="date"}},apply:function(t,r){var a=e.descend(r,"Name","string"),n=e.descend(r,"Parameters");switch(a.value){case"odata.concat":return D.concat(t,n);case"odata.fillUriTemplate":return D.fillUriTemplate(t,n);case"odata.uriEncode":return D.uriEncode(t,n);default:e.error(a,"unknown function: "+a.value);return undefined}},concat:function(t,r){var a=r.asExpression,n=[],i,s=[];e.expectType(r,"array");r.value.forEach(function(e,n){i=D.parameter(t,r,n);a=a||i.result==="expression";s.push(i)});s.forEach(function(t){if(a){D.wrapExpression(t)}if(t.type!=="edm:Null"){n.push(e.resultToString(t,a,r.withType))}});i=a?{result:"expression",value:n.join("+")}:{result:"composite",value:n.join("")};i.type="Edm.String";return i},conditional:function(t,r){var a=D.parameter(t,r,0,"Edm.Boolean"),n=D.parameter(t,r,1),i=D.parameter(t,r,2),s=n.type,o=r.withType;if(n.type==="edm:Null"){s=i.type}else if(i.type!=="edm:Null"&&n.type!==i.type){e.error(r,"Expected same type for second and third parameter, types are '"+n.type+"' and '"+i.type+"'")}return{result:"expression",type:s,value:e.resultToString(D.wrapExpression(a),true,false)+"?"+e.resultToString(D.wrapExpression(n),true,o)+":"+e.resultToString(D.wrapExpression(i),true,o)}},constant:function(t,r,a){var n=r.value;e.expectType(r,"string");if(a==="String"){if(x.test(n)){return{ignoreTypeInPath:true,result:"binding",type:"Edm.String",value:n.slice(1,-1)}}else if(t.getSetting&&t.getSetting("bindTexts")){return{result:"binding",type:"Edm.String",ignoreTypeInPath:true,value:"/##"+D.replaceIndexes(t.getModel(),r.path)}}a="Edm.String"}else if(!T[a].test(n)){e.error(r,"Expected "+a+" value but instead saw '"+n+"'")}else{a=P[a];if(a==="Edm.Int64"&&s.compare(n,f,true)>=0&&s.compare(n,m,true)<=0){a="Edm.Int32"}}return{result:"constant",type:a,value:n}},expression:function(t,r){var a=r.value,n,i;e.expectType(r,"object");if(a.hasOwnProperty("Type")){i=e.property(r,"Type","string");n=e.descend(r,"Value")}else{["And","Apply","Bool","Date","DateTimeOffset","Decimal","Float","Eq","Ge","Gt","Guid","If","Int","Le","Lt","Ne","Not","Null","Or","Path","PropertyPath","String","TimeOfDay"].forEach(function(t){if(a.hasOwnProperty(t)){i=t;n=e.descend(r,t)}})}switch(i){case"Apply":return D.apply(t,n);case"If":return D.conditional(t,n);case"Path":case"PropertyPath":return D.path(t,n);case"Bool":case"Date":case"DateTimeOffset":case"Decimal":case"Float":case"Guid":case"Int":case"String":case"TimeOfDay":return D.constant(t,n,i);case"And":case"Eq":case"Ge":case"Gt":case"Le":case"Lt":case"Ne":case"Or":return D.operator(t,n,i);case"Not":return D.not(t,n);case"Null":return{result:"constant",value:"null",type:"edm:Null"};default:e.error(r,"Unsupported OData expression");return undefined}},formatOperand:function(t,r,a,n){var i;if(a.result==="constant"){switch(a.category){case"boolean":case"number":return a.value;case"date":i=D.parseDate(a.value);if(!i){e.error(e.descend(t,r),"Invalid Date "+a.value)}return String(i.getTime());case"datetime":i=D.parseDateTimeOffset(a.value);if(!i){e.error(e.descend(t,r),"Invalid DateTime "+a.value)}return String(i.getTime());case"time":return String(D.parseTimeOfDay(a.value).getTime())}}if(n){D.wrapExpression(a)}return e.resultToString(a,true)},getExpression:function(n,i,s){var l;if(i===undefined){return undefined}o.average(y,"",g);if(!D.simpleParserWarningLogged&&a.bindingParser===r.simpleParser){t.warning("Complex binding syntax not active",null,u);D.simpleParserWarningLogged=true}try{l=D.expression(n,{asExpression:false,path:n.getPath(),value:i,withType:s});o.end(y);return e.resultToString(l,false,s)}catch(t){o.end(y);if(t instanceof SyntaxError){return"Unsupported: "+r.complexParser.escape(e.toErrorString(i))}throw t}},fillUriTemplate:function(t,r){var a,n,i=[],s="",o,u=r.value,l,p=D.parameter(t,r,0,"Edm.String");i.push("odata.fillUriTemplate(",e.resultToString(p,true),",{");for(a=1;a<u.length;a+=1){o=e.descend(r,a,"object");n=e.property(o,"Name","string");l=D.expression(t,e.descend(o,"Value"),true);i.push(s,e.toJSON(n),":",e.resultToString(l,true));s=","}i.push("})");return{result:"expression",value:i.join(""),type:"Edm.String"}},not:function(t,r){var a;r.asExpression=true;a=D.expression(t,r);return{result:"expression",value:"!"+e.resultToString(D.wrapExpression(a),true),type:"Edm.Boolean"}},operator:function(t,r,a){var n=a==="And"||a==="Or"?"Edm.Boolean":undefined,i=D.parameter(t,r,0,n),s=D.parameter(t,r,1,n),o,u,l,p;if(i.type!=="edm:Null"&&s.type!=="edm:Null"){i.category=b[i.type];s.category=b[s.type];D.adjustOperands(i,s);D.adjustOperands(s,i);if(i.category!==s.category){e.error(r,"Expected two comparable parameters but instead saw "+i.type+" and "+s.type)}o=i.category==="decimal"?",true":"";u=w[i.category]}l=D.formatOperand(r,0,i,!u);p=D.formatOperand(r,1,s,!u);return{result:"expression",value:u?"odata.compare("+l+","+p+o+")"+h[a]+"0":l+h[a]+p,type:"Edm.Boolean"}},parameter:function(t,r,a,n){var i=e.descend(r,a),s;i.asExpression=true;s=D.expression(t,i);if(n&&n!==s.type){e.error(i,"Expected "+n+" but instead saw "+s.type)}return s},parseDate:function(e){return l.parse(e)},parseDateTimeOffset:function(e){var t=T.DateTimeOffset.exec(e);if(t&&t[1]&&t[1].length>4){e=e.replace(t[1],t[1].slice(0,4))}return p.parse(e.toUpperCase())},parseTimeOfDay:function(e){if(e.length>12){e=e.slice(0,12)}return E.parse(e)},path:function(r,a){var n=a.value,i={},s,o,l,p=r.getModel(),c={getModel:function(){return p},getPath:function(){return a.path}},d,m={result:"binding",value:n},f;e.expectType(a,"string");f=e.followPath(c,{Path:n});if(f&&f.resolvedPath){d=p.getProperty(f.resolvedPath);m.type=d.type;switch(d.type){case"Edm.DateTime":i.displayFormat=d["sap:display-format"];break;case"Edm.Decimal":if(d.precision){i.precision=d.precision}if(d.scale){i.scale=d.scale}l=d["Org.OData.Validation.V1.Minimum"];if(l&&(l.Decimal||l.String)){i.minimum=l.Decimal||l.String;s=l["Org.OData.Validation.V1.Exclusive"];if(s){i.minimumExclusive=s.Bool||"true"}}l=d["Org.OData.Validation.V1.Maximum"];if(l&&(l.Decimal||l.String)){i.maximum=l.Decimal||l.String;s=l["Org.OData.Validation.V1.Exclusive"];if(s){i.maximumExclusive=s.Bool||"true"}}break;case"Edm.String":i.maxLength=d.maxLength;o=d["com.sap.vocabularies.Common.v1.IsDigitSequence"];if(o){i.isDigitSequence=o.Bool||"true"}break}if(d.nullable==="false"){i.nullable="false"}m.constraints=i}else{t.warning("Could not find property '"+n+"' starting from '"+a.path+"'",null,u)}return m},replaceIndexes:function(t,r){var a,n=r.split("/"),i,s;function o(r,a){var s=t.getProperty(i+"/"+r);if(typeof s==="string"){n[a]="[${"+r+"}==="+e.toJSON(s)+"]";return true}return false}a=O.exec(r);if(!a){return r}i=a[1];if(!o("namespace",3)){return r}for(var u=4;u<n.length;u+=1){i=i+"/"+n[u];if(S.test(n[u])&&!o("name",u)){s=t.getProperty(i+"/RecordType");if(s){if(s==="com.sap.vocabularies.UI.v1.DataFieldForAction"){o("Action/String",u)}else if(s==="com.sap.vocabularies.UI.v1.DataFieldForAnnotation"){o("Target/AnnotationPath",u)}else if(s.indexOf("com.sap.vocabularies.UI.v1.DataField")===0){o("Value/Path",u)}}}}return n.join("/")},simpleParserWarningLogged:false,uriEncode:function(t,r){var a=D.parameter(t,r,0);if(a.result==="constant"){if(a.type==="Edm.Date"){a.type="Edm.DateTime";a.value=a.value+"T00:00:00Z"}else if(a.type==="Edm.TimeOfDay"){a.type="Edm.Time";a.value="PT"+a.value.slice(0,2)+"H"+a.value.slice(3,5)+"M"+a.value.slice(6,8)+"S"}}return{result:"expression",value:"odata.uriEncode("+e.resultToString(a,true)+","+e.toJSON(a.type)+")",type:"Edm.String"}},wrapExpression:function(e){if(e.result==="expression"){e.value="("+e.value+")"}return e}};D._setDateTimeFormatter();return D});
//# sourceMappingURL=_AnnotationHelperExpression.js.map