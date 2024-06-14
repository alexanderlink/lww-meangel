/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/each","sap/base/util/extend","sap/base/util/isEmptyObject","sap/ui/core/Lib","sap/ui/core/format/NumberFormat","sap/ui/model/CompositeType","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException"],function(t,e,r,o,i,s,a,n,u,p){"use strict";var h=a.extend("sap.ui.model.type.Currency",{constructor:function(t){a.apply(this,arguments);this.sName="Currency";this.bShowMeasure=!t||!("showMeasure"in t)||t.showMeasure;this.bShowNumber=!t||!("showNumber"in t)||t.showNumber;this.bUseRawValues=true}});h.prototype.formatValue=function(t,e){var r=t;if(t==undefined||t==null){return null}if(this.oInputFormat){r=this.oInputFormat.parse(t)}if(!Array.isArray(r)){throw new n("Cannot format currency: "+t+" has the wrong format")}if((r[0]==undefined||r[0]==null)&&this.bShowNumber){return null}switch(this.getPrimitiveType(e)){case"string":return this.oOutputFormat.format(r);default:throw new n("Don't know how to format currency to "+e)}};h.prototype.parseValue=function(t,e){var r;switch(this.getPrimitiveType(e)){case"string":r=this.oOutputFormat.parse(t);if(!Array.isArray(r)||this.bShowNumber&&isNaN(r[0])){throw this.getParseException()}break;default:throw new u("Don't know how to parse Currency from "+e)}if(this.oInputFormat){r=this.oInputFormat.format(r)}return r};h.prototype.validateValue=function(r){if(this.oConstraints){var o=i.getResourceBundleFor("sap.ui.core"),s=[],a=[],n=r,u;if(this.oInputFormat){n=this.oInputFormat.parse(r)}u=n[0];e(this.oConstraints,function(e,r){switch(e){case"minimum":if(u<r){s.push("minimum");a.push(o.getText("Currency.Minimum",[r]))}break;case"maximum":if(u>r){s.push("maximum");a.push(o.getText("Currency.Maximum",[r]))}break;default:t.warning("Unknown constraint '"+e+"': Value is not validated.",null,"sap.ui.model.type.Currency")}});if(s.length>0){throw new p(this.combineMessages(a),s)}}};h.prototype.setFormatOptions=function(t){this.oFormatOptions=Object.assign(t.style!=="short"&&t.style!=="long"?{preserveDecimals:true}:{},t);this._createFormats()};h.prototype._handleLocalizationChange=function(){this._createFormats()};h.prototype._createFormats=function(){var t=this.oFormatOptions.source;this.oOutputFormat=s.getCurrencyInstance(this.iScale>=0?r({},{maxFractionDigits:this.iScale},this.oFormatOptions):this.oFormatOptions);if(t){if(o(t)){t={groupingEnabled:false,groupingSeparator:",",decimalSeparator:"."}}this.oInputFormat=s.getCurrencyInstance(t)}};h.prototype.getParseException=function(){var t=i.getResourceBundleFor("sap.ui.core"),e;if(!this.bShowNumber){e=t.getText("Currency.InvalidMeasure")}else if(!this.bShowMeasure){e=t.getText("EnterNumber")}else{e=t.getText("Currency.Invalid")}return new u(e)};h.prototype.getPartsIgnoringMessages=function(){if(!this.bShowMeasure){return[1]}else if(!this.bShowNumber){return[0]}return[]};h.prototype.getPartsListeningToTypeChanges=function(){return this.bShowNumber?[0]:[]};h.prototype.processPartTypes=function(t){const e=this.iScale;this.iScale=t[0]?.oConstraints?.scale;if(e!==this.iScale){this._createFormats()}};return h});
//# sourceMappingURL=Currency.js.map