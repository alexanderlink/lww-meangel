/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/Lib","sap/ui/layout/form/SimpleForm","sap/ui/layout/VerticalLayout","sap/ui/layout/HorizontalLayout","sap/m/Avatar","sap/m/Page","sap/m/Button","sap/m/Bar","sap/m/Title","sap/m/Link","sap/m/Text","sap/m/Label","sap/m/HBox","sap/ui/core/Icon","sap/ui/core/Title","sap/ui/core/CustomData","sap/ui/core/library","sap/ui/layout/library","sap/ui/Device","sap/ui/layout/form/ResponsiveGridLayout","./QuickViewPageRenderer","sap/base/Log","sap/base/security/encodeURL","sap/ui/dom/jquery/Focusable"],function(e,t,a,i,o,r,n,s,p,g,u,l,c,d,h,f,v,y,m,C,P,_,b,w,k,A){"use strict";var V=e.URLHelper;var x=P.form.SimpleFormLayout;var N=C.TitleLevel;var T=e.QuickViewGroupElementType;var I=e.ButtonType;var S=e.AvatarShape;var L=e.EmptyIndicatorMode;var D=i.getResourceBundleFor("sap.m");var H=e.PageBackgroundDesign;var B=t.extend("sap.m.QuickViewPage",{metadata:{library:"sap.m",properties:{pageId:{type:"string",group:"Misc",defaultValue:""},header:{type:"string",group:"Misc",defaultValue:""},title:{type:"string",group:"Misc",defaultValue:""},titleUrl:{type:"string",group:"Misc",defaultValue:""},crossAppNavCallback:{type:"object",group:"Misc",deprecated:true},description:{type:"string",group:"Misc",defaultValue:""},icon:{type:"string",group:"Misc",defaultValue:"",deprecated:true},fallbackIcon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null,deprecated:true}},defaultAggregation:"groups",aggregations:{groups:{type:"sap.m.QuickViewGroup",multiple:true,singularName:"group",bindable:"bindable"},avatar:{type:"sap.m.Avatar",multiple:false,bindable:"bindable"}}},renderer:w});B.prototype.init=function(){this._initCrossAppNavigationService()};B.prototype._initCrossAppNavigationService=function(){var e=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService;if(e){this.oCrossAppNavigator=e("CrossApplicationNavigation")}};B.prototype.exit=function(){if(this._oPage){this._oPage.destroy();this._oPage=null}else{this._destroyPageContent()}this._mNavContext=null};B.prototype.onBeforeRendering=function(){this._destroyPageContent();this._createPageContent()};B.prototype.getPageContent=function(){return this._mPageContent};B.prototype.setNavContext=function(e){this._mNavContext=e};B.prototype.getNavContext=function(){return this._mNavContext};B.prototype.setPageTitleControl=function(e){this._oPageTitle=e};B.prototype.getPageTitleControl=function(){return this._oPageTitle};B.prototype._createPage=function(){var e=this._createPageContent();var t=this.getNavContext();var i;if(this._oPage){i=this._oPage;i.destroyContent();i.setCustomHeader(new u)}else{i=this._oPage=new p(t.quickViewId+"-"+this.getPageId(),{customHeader:new u,backgroundDesign:H.Transparent});i.addEventDelegate({onAfterRendering:this.onAfterRenderingPage},this)}if(this.getHeader()===""&&t.quickView.getPages().length===1&&!_.system.phone){i.setShowHeader(false);i.addStyleClass("sapMQuickViewPageWithoutHeader")}if(e.header){i.addContent(e.header)}i.addContent(e.form);var o=i.getCustomHeader();o.addContentMiddle(new l({text:this.getHeader()}).addStyleClass("sapMQuickViewTitle"));if(t.hasBackButton){o.addContentLeft(new g({type:I.Back,tooltip:D.getText("PAGE_NAVBUTTON_TEXT"),press:function(){if(t.navContainer){t.quickView._setNavOrigin(null);t.navContainer.back()}}}))}if(t.popover&&_.system.phone){o.addContentRight(new g({icon:a.getIconURI("decline"),press:function(){t.popover.close()}}))}i.addStyleClass("sapMQuickViewPage");return i};B.prototype.onAfterRenderingPage=function(){var e=this.getParent(),a=e instanceof t&&e.isA("sap.m.QuickView");if(a&&!this._oPage.$().firstFocusableDomRef()){this._oPage.$("cont").attr("tabindex",0)}if(this._bItemsChanged){var i=this.getNavContext();if(i){i.quickView._restoreFocus()}this._bItemsChanged=false}};B.prototype._createPageContent=function(){var e=this._createForm();var t=this._getPageHeaderContent();var a=this.getPageTitleControl();if(t&&a){e.addAriaLabelledBy(a)}this._mPageContent={form:e,header:t};return this._mPageContent};B.prototype._createForm=function(){var e=this.getAggregation("groups"),t=new o({maxContainerCols:1,editable:false,layout:x.ResponsiveGridLayout});if(e){for(var a=0;a<e.length;a++){if(e[a].getVisible()){this._renderGroup(e[a],t)}}}return t};B.prototype._getPageHeaderContent=function(){var e=this._getAvatar(),t=new r,a=new n,i=this.getTitle(),o=this.getDescription(),s=this.getTitleUrl(),p,g;if(e&&e.getVisible()){a.addContent(e)}if(s&&i){p=new c({text:i,href:s,target:"_blank"})}else if(i){p=new l({text:i,level:N.H3});if(this.getCrossAppNavCallback()){p.destroy();p=new c({text:i});p.attachPress(this._crossApplicationNavigation.bind(this))}}this.setPageTitleControl(p);if(o){g=new d({text:o})}if(p){t.addContent(p)}if(g){t.addContent(g)}if(t.getContent().length){a.addContent(t)}else{t.destroy()}if(a.getContent().length){return a}a.destroy();return null};B.prototype._renderGroup=function(e,t){var i=e.getAggregation("elements");var o,r,n;if(e.getHeading()){t.addContent(new y({text:e.getHeading(),level:N.H4}))}if(!i){return}var s=this.getNavContext();for(var p=0;p<i.length;p++){o=i[p];if(!o.getVisible()){continue}n=new h({text:o.getLabel()});var g;if(s){g=s.quickViewId}r=o._getGroupElementValue(g);t.addContent(n);if(!r){t.addContent(new d({text:"",emptyIndicatorMode:L.On}));continue}n.setLabelFor(r.getId());if(o.getType()==T.pageLink){r.attachPress(this._attachPressLink(this))}if(o.getType()==T.mobile&&!_.system.desktop){var u=new v({src:a.getIconURI("post"),tooltip:D.getText("QUICKVIEW_SEND_SMS"),decorative:false,customData:[new m({key:"phoneNumber",value:o.getValue()})],press:this._mobilePress});var l=new f({items:[r,u]});t.addContent(l)}else{t.addContent(r)}}};B.prototype._crossApplicationNavigation=function(){if(this.getCrossAppNavCallback()&&this.oCrossAppNavigator){var e=this.getCrossAppNavCallback();if(typeof e=="function"){var t=e();var a=this.oCrossAppNavigator.hrefForExternal({target:{semanticObject:t.target.semanticObject,action:t.target.action},params:t.params});V.redirect(a)}return}if(this.getTitleUrl()){V.redirect(this.getTitleUrl(),true)}};B.prototype._destroyPageContent=function(){if(!this._mPageContent){return}if(this._mPageContent.form){this._mPageContent.form.destroy()}if(this._mPageContent.header){this._mPageContent.header.destroy()}this._mPageContent=null};B.prototype._attachPressLink=function(e){var t=e.getNavContext();return function(e){e.preventDefault();var a=this.getCustomData()[0].getValue();if(t.navContainer&&a){t.quickView._setNavOrigin(this);t.navContainer.to(a)}}};B.prototype._mobilePress=function(){var e="sms://"+A(this.getCustomData()[0].getValue());window.location.replace(e)};B.prototype._updatePage=function(){var e=this.getNavContext();if(e&&e.quickView._bRendered){this._bItemsChanged=true;e.popover.focus();if(e.quickView.indexOfPage(this)==0){e.quickView._clearContainerHeight()}this._createPage();e.popover.$().css("display","block");e.quickView._adjustContainerHeight();e.quickView._restoreFocus()}};["setModel","bindAggregation","setAggregation","insertAggregation","addAggregation","removeAggregation","removeAllAggregation","destroyAggregation"].forEach(function(e){B.prototype[e]=function(){var a=t.prototype[e].apply(this,arguments);this._updatePage();if(["removeAggregation","removeAllAggregation"].indexOf(e)!==-1){return a}return this}});B.prototype.setProperty=function(){t.prototype.setProperty.apply(this,arguments);this._updatePage();return this};B.prototype.getQuickViewBase=function(){var e=this.getParent();if(e&&e.isA("sap.m.QuickViewBase")){return e}return null};B.prototype._getAvatar=function(){var e=null,t=this.getIcon&&this.getIcon();if(this.getAvatar()){e=this.getAvatar().clone(null,null,{cloneBindings:false,cloneChildren:true});this._checkAvatarProperties(e)}else if(t&&this.getFallbackIcon){e=new s({displayShape:S.Square,fallbackIcon:this.getFallbackIcon(),src:t})}if(e){if(this.getTitleUrl()&&!e.hasListeners("press")){e.attachPress(this._crossApplicationNavigation.bind(this))}e.addStyleClass("sapMQuickViewThumbnail")}return e};B.prototype._checkAvatarProperties=function(e){var t=e.getMetadata().getPropertyDefaults();if(e.getDisplaySize()!==t["displaySize"]){k.warning("'displaySize' property of avatar shouldn't be used in sap.m.QuickViewPage")}if(e.getCustomDisplaySize()!==t["customDisplaySize"]){k.warning("'customDisplaySize' property of avatar shouldn't be used in sap.m.QuickViewPage")}if(e.getCustomFontSize()!==t["customFontSize"]){k.warning("'customFontSize' property of avatar shouldn't be used in sap.m.QuickViewPage")}if(e.getDetailBox()){k.warning("'detailBox' aggregation of avatar shouldn't be used in sap.m.QuickViewPage")}};return B});
//# sourceMappingURL=QuickViewPage.js.map