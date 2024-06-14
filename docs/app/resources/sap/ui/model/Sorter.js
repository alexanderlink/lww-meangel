/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/i18n/Localization","sap/ui/base/Object"],function(t,r,n){"use strict";var e=n.extend("sap.ui.model.Sorter",{constructor:function(r,n,e,i){if(typeof r==="object"){var o=r;r=o.path;n=o.descending;e=o.group;i=o.comparator}this.sPath=r;var s=this.sPath.indexOf(">");if(s>0){t.error('Model names are not allowed in sorter-paths: "'+this.sPath+'"');this.sPath=this.sPath.substr(s+1)}this.bDescending=n;this.vGroup=e;if(typeof e=="boolean"&&e){this.fnGroup=function(t){return t.getProperty(this.sPath)}}if(typeof e=="function"){this.fnGroup=e}this.fnCompare=i},getGroup:function(t){var r=this.fnGroup(t);if(typeof r==="string"||typeof r==="number"||typeof r==="boolean"||r==null){r={key:r}}return r},getGroupFunction:function(){return this.fnGroup&&this.fnGroup.bind(this)}});e.defaultComparator=function(t,n){if(t==n){return 0}if(n==null){return-1}if(t==null){return 1}if(typeof t=="string"&&typeof n=="string"){return t.localeCompare(n,r.getLanguageTag().toString())}if(t<n){return-1}if(t>n){return 1}return 0};return e});
//# sourceMappingURL=Sorter.js.map