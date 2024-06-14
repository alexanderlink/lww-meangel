/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","./PlanningCalendarHeader","./SegmentedButtonItem","./SinglePlanningCalendarWeekView","./SinglePlanningCalendarGrid","./SinglePlanningCalendarMonthGrid","./SinglePlanningCalendarRenderer","sap/base/Log","sap/ui/core/Control","sap/ui/core/Element","sap/ui/core/InvisibleText","sap/ui/core/Lib","sap/ui/core/ResizeHandler","sap/ui/core/format/DateFormat","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/DateRange","sap/ui/unified/DateTypeRange","sap/ui/unified/library","sap/ui/base/ManagedObjectObserver","sap/ui/core/date/UI5Date","sap/ui/thirdparty/jquery","sap/ui/core/date/CalendarWeekNumbering"],function(e,t,i,a,r,n,s,o,g,l,d,p,h,u,c,f,_,y,m,D,jQuery,w){"use strict";var v=e.PlanningCalendarStickyMode;var S=e.SinglePlanningCalendarSelectionMode;var C="_sHeaderResizeHandlerId";var A=4;var V="--item";var b=g.extend("sap.m.SinglePlanningCalendar",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Appearance",defaultValue:""},startDate:{type:"object",group:"Data"},startHour:{type:"int",group:"Data",defaultValue:0},endHour:{type:"int",group:"Data",defaultValue:24},fullDay:{type:"boolean",group:"Data",defaultValue:true},stickyMode:{type:"sap.m.PlanningCalendarStickyMode",group:"Behavior",defaultValue:v.None},scaleFactor:{type:"float",group:"Data",defaultValue:1},enableAppointmentsDragAndDrop:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsResize:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsCreate:{type:"boolean",group:"Misc",defaultValue:false},firstDayOfWeek:{type:"int",group:"Appearance",defaultValue:-1},calendarWeekNumbering:{type:"sap.ui.core.date.CalendarWeekNumbering",group:"Appearance",defaultValue:null},dateSelectionMode:{type:"sap.m.SinglePlanningCalendarSelectionMode",group:"Behavior",defaultValue:S.SingleSelect}},aggregations:{actions:{type:"sap.ui.core.Control",multiple:true,singularName:"action",forwarding:{getter:"_getHeader",aggregation:"actions"}},appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment",forwarding:{getter:"_getCurrentGrid",aggregation:"appointments"}},views:{type:"sap.m.SinglePlanningCalendarView",multiple:true,singularName:"view"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate",forwarding:{getter:"_getCurrentGrid",aggregation:"specialDates"}},_header:{type:"sap.m.PlanningCalendarHeader",multiple:false,visibility:"hidden"},_grid:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_mvgrid:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate",forwarding:{getter:"_getCurrentGrid",aggregation:"selectedDates"}}},associations:{selectedView:{type:"sap.m.SinglePlanningCalendarView",multiple:false},legend:{type:"sap.m.PlanningCalendarLegend",multiple:false}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"}}},appointmentDrop:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},copy:{type:"boolean"}}},appointmentResize:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"}}},appointmentCreate:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},headerDateSelect:{parameters:{date:{type:"object"}}},startDateChange:{parameters:{date:{type:"object"}}},cellPress:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},moreLinkPress:{parameters:{date:{type:"object"}}},viewChange:{},weekNumberPress:{parameters:{weekNumber:{type:"int"}}},selectedDatesChange:{allowPreventDefault:true,parameters:{selectedDates:{type:"sap.ui.unified.DateRange[]"}}}}},renderer:s});b.prototype.init=function(){var e=this.getId();this._oRB=p.getResourceBundleFor("sap.m");this._oDefaultView=new a({key:"DEFAULT_INNER_WEEK_VIEW_CREATED_FROM_CONTROL",title:""});this.setAssociation("selectedView",this._oDefaultView);this.setAggregation("_header",this._createHeader());this.setAggregation("_grid",new r(e+"-Grid"));this.setAggregation("_mvgrid",new n(e+"-GridMV"));this._attachHeaderEvents();this._attachGridEvents();this._attachDelegates();this.setStartDate(D.getInstance())};b.prototype.onBeforeRendering=function(){this._toggleStickyClasses();if(this.getFirstDayOfWeek()!==-1&&this.getCalendarWeekNumbering()){o.warning("Both properties firstDayOfWeek and calendarWeekNumbering should not be used at the same time!")}};b.prototype.onAfterRendering=function(){var e=this._getHeader();this._adjustColumnHeadersTopOffset();this.toggleStyleClass("sapMSinglePCActionsHidden",!e._getActionsToolbar().getVisible());this._registerResizeHandler(C,e,this._onHeaderResize.bind(this))};b.prototype.exit=function(){if(this._oDefaultView){this._oDefaultView.destroy();this._oDefaultView=null}if(this._afterRenderFocusCell){this.removeDelegate(this._afterRenderFocusCell);this._afterRenderFocusCell=null}this._deRegisterResizeHandler(C)};b.prototype._onHeaderResize=function(e){if(e.oldSize.height===e.size.height){return this}this.toggleStyleClass("sapMSinglePCActionsHidden",!this._getHeader()._getActionsToolbar().getVisible());this._adjustColumnHeadersTopOffset();return this};b.prototype.setTitle=function(e){this._getHeader().setTitle(e);return this.setProperty("title",e)};b.prototype.setScaleFactor=function(e){if(e<1||e>6){return}this.setProperty("scaleFactor",parseInt(e));this.getAggregation("_grid").setProperty("scaleFactor",parseInt(e));return this};b.prototype.setStartDate=function(e){this.setProperty("startDate",e);this._alignColumns();return this};b.prototype.setStartHour=function(e){this.getAggregation("_grid").setStartHour(e);this.setProperty("startHour",e);return this};b.prototype.setEndHour=function(e){this.getAggregation("_grid").setEndHour(e);this.setProperty("endHour",e);return this};b.prototype.setFullDay=function(e){this.getAggregation("_grid").setFullDay(e);this.setProperty("fullDay",e);return this};b.prototype.setEnableAppointmentsDragAndDrop=function(e){this.getAggregation("_grid").setEnableAppointmentsDragAndDrop(e);this.getAggregation("_mvgrid").setEnableAppointmentsDragAndDrop(e);return this.setProperty("enableAppointmentsDragAndDrop",e,true)};b.prototype.setEnableAppointmentsResize=function(e){this.getAggregation("_grid").setEnableAppointmentsResize(e);return this.setProperty("enableAppointmentsResize",e,true)};b.prototype.setEnableAppointmentsCreate=function(e){this.getAggregation("_grid").setEnableAppointmentsCreate(e);return this.setProperty("enableAppointmentsCreate",e,true)};b.prototype.setDateSelectionMode=function(e){this.getAggregation("_mvgrid").setDateSelectionMode(e);this.getAggregation("_grid").setDateSelectionMode(e);return this.setProperty("dateSelectionMode",e)};b.prototype._toggleStickyClasses=function(){var e=this.getStickyMode();this.toggleStyleClass("sapMSinglePCStickyAll",e===v.All);this.toggleStyleClass("sapMSinglePCStickyNavBarAndColHeaders",e===v.NavBarAndColHeaders);return this};b.prototype.removeAllSelectedDates=function(){return this._getCurrentGrid().removeAllSelectedDates()};b.prototype.getSelectedDates=function(){return this._getCurrentGrid().getAggregation("selectedDates")};b.prototype.addSelectedDate=function(e){this._getCurrentGrid().addAggregation("selectedDates",e);return this};b.prototype._adjustColumnHeadersTopOffset=function(){var e=this.getStickyMode(),t=this.getAggregation("_grid"),i=t&&t._getColumnHeaders(),a;if(!i||!i.getDomRef()){return this}switch(e){case v.All:a=this._getHeader().$().outerHeight();break;case v.NavBarAndColHeaders:a=this._getHeader()._getNavigationToolbar().$().outerHeight();break;default:a="auto";break}i.$().css("top",a);i._setTopPosition(a);return this};b.prototype.addView=function(e){var t,a=this._getHeader(),r=e.getId()+V,n;if(!e){return this}if(this._isViewKeyExisting(e.getKey())){o.error("There is an existing view with the same key.",this);return this}this.addAggregation("views",e);t=a._getOrCreateViewSwitch();n=new i(r,{key:e.getKey(),text:e.getTitle()});t.addItem(n);this._observeViewTitle(e);if(this._getSelectedView().getKey()===this._oDefaultView.getKey()){this.setAssociation("selectedView",e)}this._alignView();if(this.getViews().length>A){a._convertViewSwitchToSelect()}return this};b.prototype.insertView=function(e,t){var a,r=this._getHeader(),n=e.getId()+V,s;if(!e){return this}if(this._isViewKeyExisting(e.getKey())){o.error("There is an existing view with the same key.",this);return this}this.insertAggregation("views",e,t);a=r._getOrCreateViewSwitch();s=new i(n,{key:e.getKey(),text:e.getTitle()});a.insertItem(s,t);this._observeViewTitle(e);if(this._getSelectedView().getKey()===this._oDefaultView.getKey()){this.setAssociation("selectedView",e)}this._alignView();if(this.getViews().length>A){r._convertViewSwitchToSelect()}return this};b.prototype.removeView=function(e){if(!e){return this}var t=this._getHeader(),i=t._getOrCreateViewSwitch(),a=i.getItems(),r=this._getSelectedView(),n=e.getKey(),s,o;if(this.getViews().length===1){this._disconnectAndDestroyViewsObserver()}else{this._oViewsObserver.unobserve(e,{properties:["title"]})}for(o=0;o<a.length;o++){s=a[o];if(s.getKey()===n){i.removeItem(s);break}}this.removeAggregation("views",e);if(n===r.getKey()){this.setAssociation("selectedView",this.getViews()[0]||this._oDefaultView)}this._alignView();if(this.getViews().length<=A){t._convertViewSwitchToSegmentedButton()}return this};b.prototype.removeAllViews=function(){var e=this._getHeader()._getOrCreateViewSwitch();this._disconnectAndDestroyViewsObserver();e.removeAllItems();this.setAssociation("selectedView",this._oDefaultView);this._alignView();return this.removeAllAggregation("views")};b.prototype.destroyViews=function(){var e=this._getHeader()._getOrCreateViewSwitch();this._disconnectAndDestroyViewsObserver();e.destroyItems();this.setAssociation("selectedView",this._oDefaultView);this._alignView();return this.destroyAggregation("views")};b.prototype._viewsObserverCallbackFunction=function(e){l.getElementById(e.object.getId()+V).setText(e.current)};b.prototype._getViewsObserver=function(){if(!this._oViewsObserver){this._oViewsObserver=new m(this._viewsObserverCallbackFunction)}return this._oViewsObserver};b.prototype._observeViewTitle=function(e){this._getViewsObserver().observe(e,{properties:["title"]})};b.prototype._disconnectAndDestroyViewsObserver=function(){if(this._oViewsObserver){this._oViewsObserver.disconnect();this._oViewsObserver.destroy();this._oViewsObserver=null}};b.prototype.setSelectedView=function(e){if(typeof e==="string"){e=this._getViewById(e)}else if(e.isA("sap.m.SinglePlanningCalendarView")&&!this._isViewKeyExisting(e.getKey())){e=null}if(!e){o.error("There is no such view.",this);return this}this._setupNewView(e);this._getHeader()._getOrCreateViewSwitch().setSelectedKey(e.getKey());return this};b.prototype.getSelectedAppointments=function(){return this.getAggregation("_grid").getSelectedAppointments()};b.prototype.setLegend=function(e){var t,i,a;this.setAssociation("legend",e);this.getAggregation("_grid").setAssociation("legend",e);this.getAggregation("_mvgrid").setAssociation("legend",e);i=this.getLegend();if(i){this.getAggregation("_grid")._sLegendId=i;this.getAggregation("_mvgrid")._sLegendId=i;a=l.getElementById(i)}if(a){t=new m(function(e){this.invalidate()}.bind(this));t.observe(a,{destroy:true})}return this};b.prototype.setFirstDayOfWeek=function(e){if(e<-1||e>6){o.error(""+e+" is not a valid value to the property firstDayOfWeek. Valid values are from -1 to 6.");return}this.setProperty("firstDayOfWeek",e);this.getViews().forEach(function(t){t.setFirstDayOfWeek(e)});var t=this._getHeader(),i=t.getAggregation("_calendarPicker")?t.getAggregation("_calendarPicker"):t._oPopup.getContent()[0],a=this._getSelectedView(),r=this.getStartDate()||D.getInstance(),n=a.calculateStartDate(D.getInstance(r.getTime())),s=this.getAggregation("_mvgrid");this.setStartDate(n);s.setFirstDayOfWeek(e);i.setFirstDayOfWeek(e);return this};b.prototype.setCalendarWeekNumbering=function(e){this.setProperty("calendarWeekNumbering",e);this.getViews().forEach(function(t){t.setCalendarWeekNumbering(e)});var t=this._getHeader(),i=t.getAggregation("_calendarPicker")?t.getAggregation("_calendarPicker"):t._oPopup.getContent()[0],a=this.getAggregation("_mvgrid");a.setCalendarWeekNumbering(this.getCalendarWeekNumbering());i.setCalendarWeekNumbering(this.getCalendarWeekNumbering());this._alignColumns();return this};b.prototype._alignView=function(){this._switchViewButtonVisibility();this._alignColumns();return this};b.prototype._createHeader=function(){var e=new t(this.getId()+"-Header");e.getAggregation("_actionsToolbar").addAriaLabelledBy(d.getStaticId("sap.m","SPC_ACTIONS_TOOLBAR"));e.getAggregation("_navigationToolbar").addAriaLabelledBy(d.getStaticId("sap.m","SPC_NAVIGATION_TOOLBAR"));return e};b.prototype._isViewKeyExisting=function(e){return this.getViews().some(function(t){return t.getKey()===e})};b.prototype.getViewByKey=function(e){var t=this.getViews(),i;for(i=0;i<t.length;i++){if(t[i].getKey()===e){return t[i]}}return null};b.prototype._getViewById=function(e){var t=this.getViews(),i;for(i=0;i<t.length;i++){if(t[i].getId()===e){return t[i]}}return null};b.prototype._getSelectedView=function(){var e,t=this.getViews(),i=l.getElementById(this.getAssociation("selectedView")).getKey();for(var a=0;a<t.length;a++){if(i===t[a].getKey()){e=t[a];break}}return e||this._oDefaultView};b.prototype._switchViewButtonVisibility=function(){var e=this._getHeader()._getOrCreateViewSwitch(),t=e.getItems().length>1;e.setProperty("visible",t);return this};b.prototype._attachHeaderEvents=function(){var e=this._getHeader();e.attachEvent("viewChange",this._handleViewChange,this);e.attachEvent("pressPrevious",this._handlePressArrow,this);e.attachEvent("pressToday",this._handlePressToday,this);e.attachEvent("pressNext",this._handlePressArrow,this);e.attachEvent("dateSelect",this._handleCalendarPickerDateSelect,this);return this};b.prototype._attachDelegates=function(){this._afterRenderFocusCell={onAfterRendering:function(){if(this._sGridCellFocusSelector){jQuery(this._sGridCellFocusSelector).trigger("focus");this._sGridCellFocusSelector=null}}.bind(this)};this.getAggregation("_grid").addDelegate(this._afterRenderFocusCell);this.getAggregation("_mvgrid").addDelegate(this._afterRenderFocusCell)};b.prototype._attachGridEvents=function(){var e=this.getAggregation("_grid"),t=this.getAggregation("_mvgrid");var i=function(e){this.fireHeaderDateSelect({date:e.getSource()._oDate.toLocalJSDate()})};var a=function(e){this.fireAppointmentSelect({appointment:e.getParameter("appointment"),appointments:e.getParameter("appointments")})};var r=function(e){this.fireAppointmentDrop({appointment:e.getParameter("appointment"),startDate:e.getParameter("startDate"),endDate:e.getParameter("endDate"),copy:e.getParameter("copy")})};var n=function(e){this.fireAppointmentResize({appointment:e.getParameter("appointment"),startDate:e.getParameter("startDate"),endDate:e.getParameter("endDate")})};var s=function(e){this.fireAppointmentCreate({startDate:e.getParameter("startDate"),endDate:e.getParameter("endDate")})};var o=function(e){this.fireEvent("cellPress",{startDate:e.getParameter("startDate"),endDate:e.getParameter("endDate")})};var g=function(e){this.fireEvent("moreLinkPress",{date:e.getParameter("date")})};var l=function(e){this.fireEvent("weekNumberPress",{weekNumber:e.getParameter("weekNumber")})};var d=function(e){const t=this.fireSelectedDatesChange({selectedDates:e.getParameter("selectedDates")});if(!t){e.preventDefault()}};var p=function(e){var t=this.getAggregation("_grid"),i=t._getDateFormatter(),a=this._getSelectedView().getScrollEntityCount()-t._getColumns()+1,r=D.getInstance(e.getParameter("startDate")),n=e.getParameter("fullDay"),s=this.getStartDate();if(e.getParameter("next")){r.setDate(r.getDate()+a);s=D.getInstance(s.setDate(s.getDate()+this._getSelectedView().getScrollEntityCount()));this.setStartDate(s)}else{r.setDate(r.getDate()-a);s=D.getInstance(s.setDate(s.getDate()-this._getSelectedView().getScrollEntityCount()));this.setStartDate(s)}this._sGridCellFocusSelector=n?"[data-sap-start-date='"+i.format(r)+"'].sapMSinglePCBlockersColumn":"[data-sap-start-date='"+i.format(r)+"'].sapMSinglePCRow"};var h=function(e){var t=D.getInstance(e.getParameter("startDate")),i=c.fromLocalJSDate(t),a;i.setDate(i.getDate()+e.getParameter("offset"));a=i.toLocalJSDate();this.setStartDate(a);this._sGridCellFocusSelector="[sap-ui-date='"+i.valueOf()+"'].sapMSPCMonthDay"};e._getColumnHeaders().attachEvent("select",i,this);e.attachEvent("appointmentSelect",a,this);t.attachEvent("appointmentSelect",a,this);e.attachEvent("appointmentDrop",r,this);t.attachEvent("appointmentDrop",r,this);e.attachEvent("appointmentResize",n,this);e.attachEvent("appointmentCreate",s,this);e.attachEvent("cellPress",o,this);t.attachEvent("cellPress",o,this);t.attachEvent("moreLinkPress",g,this);t.attachEvent("weekNumberPress",l,this);t.attachEvent("selectedDatesChange",d,this);e.attachEvent("borderReached",p,this);t.attachEvent("borderReached",h,this);return this};b.prototype._handleViewChange=function(e){var t=e.getParameter("item").getProperty("key"),i=this.getViewByKey(t);this._setupNewView(i);this.fireViewChange()};b.prototype._handlePressArrow=function(e){this._applyArrowsLogic(e.getId()==="pressPrevious");this._adjustColumnHeadersTopOffset()};b.prototype._handlePressToday=function(){var e=this._getSelectedView().calculateStartDate(D.getInstance());this.setStartDate(e);this.fireStartDateChange({date:e});this._adjustColumnHeadersTopOffset()};b.prototype._setupNewView=function(e){var t=this._getCurrentGrid();this.setAssociation("selectedView",e);this._transferAggregations(t);this._alignColumns();this._adjustColumnHeadersTopOffset()};b.prototype._transferAggregations=function(e){var t=this._getCurrentGrid(),i,a,r,n;if(e.getId()!==t.getId()){i=e.removeAllAggregation("appointments",true);for(n=0;n<i.length;n++){t.addAggregation("appointments",i[n],true)}a=e.removeAllAggregation("specialDates",true);for(n=0;n<a.length;n++){t.addAggregation("specialDates",a[n],true)}r=e.removeAllAggregation("selectedDates",true);for(n=0;n<r.length;n++){t.addAggregation("selectedDates",r[n],true)}}};b.prototype._handleCalendarPickerDateSelect=function(){var e=this._getHeader().getStartDate(),t;t=this._getSelectedView().calculateStartDate(D.getInstance(e.getTime()));this.setStartDate(t);if(!this._getSelectedView().isA("sap.m.SinglePlanningCalendarMonthView")){this.getAggregation("_grid")._getColumnHeaders().setDate(e)}this.fireStartDateChange({date:t});this._adjustColumnHeadersTopOffset()};b.prototype._updateCalendarPickerSelection=function(){var e=this._getFirstAndLastRangeDate(),t=this._getHeader(),i=t.getAggregation("_calendarPicker")?t.getAggregation("_calendarPicker"):t._oPopup.getContent()[0],a;a=new f({startDate:e.oStartDate.toLocalJSDate(),endDate:e.oEndDate.toLocalJSDate()});i.destroySelectedDates();i.addSelectedDate(a)};b.prototype._formatPickerText=function(){var e=this._getFirstAndLastRangeDate(),t=e.oStartDate.toLocalJSDate(),i=e.oEndDate.toLocalJSDate(),a,r;if(this._getSelectedView().isA("sap.m.SinglePlanningCalendarMonthView")){a=u.getDateInstance({format:"yMMMM"});r=a.format(t)}else{a=u.getDateInstance({format:"yMMMMd"});r=a.format(t);if(t.getTime()!==i.getTime()){r+=" - "+a.format(i)}}return r};b.prototype._applyArrowsLogic=function(e){var t=c.fromLocalJSDate(this.getStartDate()||D.getInstance()),i=e?-1:1,a=this._getSelectedView().getScrollEntityCount(this.getStartDate(),i),r;if(e){a*=-1}t.setDate(t.getDate()+a);r=t.toLocalJSDate();this.setStartDate(r);this.fireStartDateChange({date:r})};b.prototype._getFirstAndLastRangeDate=function(){var e=this._getSelectedView(),t=this._getHeader().getStartDate()||D.getInstance(),i=e.getEntityCount()-1,a,r;a=c.fromLocalJSDate(e.calculateStartDate(D.getInstance(t.getTime())));r=new c(a);r.setDate(a.getDate()+i);return{oStartDate:a,oEndDate:r}};b.prototype._alignColumns=function(){var e=this._getHeader(),t=this.getAggregation("_grid"),i=this.getAggregation("_mvgrid"),a=this._getSelectedView(),r=this.getStartDate()||D.getInstance(),n=a.calculateStartDate(D.getInstance(r.getTime())),s=c.fromLocalJSDate(n);e.setStartDate(n);e.setPickerText(this._formatPickerText(s));this._updateCalendarPickerSelection();t.setStartDate(n);i.setStartDate(n);t._setColumns(a.getEntityCount());this._setColumnHeaderVisibility()};b.prototype._setColumnHeaderVisibility=function(){var e;if(this._getSelectedView().isA("sap.m.SinglePlanningCalendarMonthView")){return}e=!this._getSelectedView().isA("sap.m.SinglePlanningCalendarDayView");this.getAggregation("_grid")._getColumnHeaders().setVisible(e);this.toggleStyleClass("sapMSinglePCHiddenColHeaders",!e)};b.prototype._getHeader=function(){return this.getAggregation("_header")};b.prototype._getCurrentGrid=function(){if(this._getSelectedView().isA("sap.m.SinglePlanningCalendarMonthView")){return this.getAggregation("_mvgrid")}else{return this.getAggregation("_grid")}};b.prototype._registerResizeHandler=function(e,t,i){if(!this[e]){this[e]=h.register(t,i)}return this};b.prototype._deRegisterResizeHandler=function(e){if(this[e]){h.deregister(this[e]);this[e]=null}return this};b.prototype._getSpecialDates=function(){var e=this.getSpecialDates();for(var t=0;t<e.length;t++){var i=e[t].getSecondaryType()===y.CalendarDayType.NonWorking&&e[t].getType()!==y.CalendarDayType.NonWorking;if(i){var a=new _;a.setType(y.CalendarDayType.NonWorking);a.setStartDate(e[t].getStartDate());if(e[t].getEndDate()){a.setEndDate(e[t].getEndDate())}e.push(a)}}return e};return b});
//# sourceMappingURL=SinglePlanningCalendar.js.map