/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/base/strings/capitalize","sap/ui/Device","sap/ui/core/Lib"],function(e,t,s,r){"use strict";var a=e.CarouselArrowsPlacement;var o=e.PlacementType;var n=r.getResourceBundleFor("sap.m");var i={apiVersion:2};i._BULLETS_TO_NUMBERS_THRESHOLD=9;i.render=function(e,t){var r=t.getPages(),n=r.length,i=t.getPageIndicatorPlacement(),l=t.getArrowsPlacement(),d=t._iCurrSlideIndex;this._renderOpeningDiv(e,t);this._renderDummyArea(e,t,"before");if(i===o.Top){this._renderPageIndicatorAndArrows(e,t,{iPageCount:n,iIndex:d,sArrowsPlacement:l,bBottom:false,bShowPageIndicator:t.getShowPageIndicator()})}this._renderInnerDiv(e,t,r,i);if(s.system.desktop&&n>t._getNumberOfItemsToShow()&&l===a.Content){this._renderHudArrows(e,t)}if(i===o.Bottom){this._renderPageIndicatorAndArrows(e,t,{iPageCount:n,iIndex:d,sArrowsPlacement:l,bBottom:true,bShowPageIndicator:t.getShowPageIndicator()})}this._renderDummyArea(e,t,"after");e.close("div")};i._renderOpeningDiv=function(e,t){var s=t.getTooltip_AsString();var r="sapMCrslBackground-"+t.getBackgroundDesign();e.openStart("div",t).class("sapMCrsl").class(r).class("sapMCrslFluid").style("width",t.getWidth()).style("height",t.getHeight()).attr("data-sap-ui-customfastnavgroup",true).accessibilityState(t,{role:"listbox"});if(s){e.attr("title",s)}e.openEnd()};i._renderInnerDiv=function(e,t,s,r){e.openStart("div").class("sapMCrslInner");if(!s.length){e.class("sapMCrslInnerNoPages")}if(s.length>1&&(t.getShowPageIndicator()||t.getArrowsPlacement()===a.PageIndicator)){if(r===o.Bottom){e.class("sapMCrslBottomOffset");if(t.getArrowsPlacement()===a.PageIndicator){e.class("sapMCrslBottomArrowsOffset")}}else{e.class("sapMCrslTopOffset");if(t.getArrowsPlacement()===a.PageIndicator){e.class("sapMCrslTopArrowsOffset")}}}e.openEnd();if(s.length){s.forEach(function(s,r,a){i._renderPage(e,s,t,r,a)})}else{i._renderNoData(e,t)}e.close("div")};i._renderPage=function(e,t,s,r,a){var o=s.getActivePage()===t.getId();e.openStart("div",s.getId()+"-"+t.getId()+"-slide").class("sapMCrslItem").accessibilityState(t,{role:"option",posinset:r+1,setsize:a.length,selected:o,hidden:!s._isPageDisplayed(r)}).attr("tabindex",o?0:-1).openEnd();i._renderPageInScrollContainer(e,s,t);e.close("div")};i._renderNoData=function(e,t){var s=t._getEmptyPage();var r=s.getAccessibilityInfo();e.openStart("div",t.getId()+"-noData").attr("tabindex",0).class("sapMCrslNoDataItem").accessibilityState({label:r.type+" "+r.description}).openEnd();e.renderControl(t._getEmptyPage());e.close("div")};i._renderPageIndicatorAndArrows=function(e,t,r){var o=r.iPageCount,l=s.system.desktop&&r.sArrowsPlacement===a.PageIndicator,d=t.getId(),c=[],p=t._getNumberOfItemsToShow(),g="sapMCrslControlsBackground-"+t.getPageIndicatorBackgroundDesign(),f="sapMCrslControlsBorder-"+t.getPageIndicatorBorderDesign();if(o<=t._getNumberOfItemsToShow()){return}if(!r.bShowPageIndicator&&!l){return}if(r.bBottom){c.push("sapMCrslControlsBottom")}else{c.push("sapMCrslControlsTop")}if(l){e.openStart("div").class("sapMCrslControls")}else{e.openStart("div").class("sapMCrslControlsNoArrows")}e.class(g).class(f);c.forEach(function(t){e.class(t)});e.openEnd();if(l){e.openStart("div").class("sapMCrslControlsContainer");c.forEach(function(t){e.class(t)});e.openEnd()}if(l){this._renderArrow(e,t,"previous")}e.openStart("div",d+"-pageIndicator");if(!r.bShowPageIndicator){e.style("opacity","0")}if(o<i._BULLETS_TO_NUMBERS_THRESHOLD){e.class("sapMCrslBulleted").openEnd();for(var u=1;u<=o-p+1;u++){e.openStart("span").attr("data-slide",u).accessibilityState({role:"img",label:n.getText("CAROUSEL_POSITION",[u,o])}).openEnd().close("span")}}else{e.class("sapMCrslNumeric").openEnd();var C=n.getText("CAROUSEL_PAGE_INDICATOR_TEXT",[r.iIndex+1,o-p+1]);e.openStart("span",d+"-"+"slide-number").attr("dir","auto").openEnd().text(C).close("span")}e.close("div");if(l){this._renderArrow(e,t,"next")}if(!l){e.close("div")}if(l){e.close("div").close("div")}};i._renderHudArrows=function(e,t){var s;if(t.getShowPageIndicator()){if(t.getPageIndicatorPlacement()===o.Top){s="sapMCrslHudTop"}else if(t.getPageIndicatorPlacement()===o.Bottom){s="sapMCrslHudBottom"}}else{s="sapMCrslHudMiddle"}e.openStart("div",t.getId()+"-hud").class("sapMCrslHud").class(s).openEnd();this._renderArrow(e,t,"previous");this._renderArrow(e,t,"next");e.close("div")};i._renderArrow=function(e,s,r){var a=r.slice(0,4),o=s.getLoop(),i=s._aAllActivePagesIndexes[0]===0,l=s._aAllActivePagesIndexes[s._aAllActivePagesIndexes.length-1]===s.getPages().length-1;e.openStart("span",s.getId()+"-arrow-"+r).class("sapMCrslArrow").class("sapMCrsl"+t(a)).attr("data-slide",a).attr("title",n.getText("PAGINGBUTTON_"+r.toUpperCase()));if(i&&r==="previous"&&!o){e.class("sapMCrslLeftmost")}else if(l&&r!=="previous"&&!o){e.class("sapMCrslRightmost")}e.openEnd();e.openStart("div").class("sapMCrslArrowInner").openEnd();e.renderControl(s._getNavigationArrow(r==="previous"?"Left":"Right"));e.close("div").close("span")};i._renderPageInScrollContainer=function(e,t,r){e.openStart("div").class("sapMScrollCont").class("sapMScrollContH").style("width","100%").style("height","100%").openEnd();e.openStart("div").class("sapMScrollContScroll").openEnd();e.openStart("div").class("sapMCrslItemTable").openEnd();e.openStart("div").class("sapMCrslItemTableCell");if(r.isA("sap.m.Image")){var o="sapMCrslImgNoArrows",n=s.system.desktop&&t.getArrowsPlacement()===a.PageIndicator;if(n){o="sapMCrslImg"}e.class(o)}e.openEnd();e.renderControl(r.addStyleClass("sapMCrsPage"));e.close("div");e.close("div");e.close("div");e.close("div")};i._renderDummyArea=function(e,t,s){e.openStart("div",t.getId()+"-"+s).class("sapMCrslDummyArea").attr("role","none").attr("tabindex",0).openEnd().close("div")};return i},true);
//# sourceMappingURL=CarouselRenderer.js.map