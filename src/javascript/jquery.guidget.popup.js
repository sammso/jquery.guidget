/**
 * jQuery Guidget JavaScript Library
 *
 * Copyright (c) 2008-present,
 * Sampsa Sohlman
 *
 * Licensed under the MIT license.
 * http://www.guidget.org/licence.html
 */
(function($, w){ // Do the function to separate this from
var wguidget = w.guidget;
var isMac = function() {
	var userAgent = navigator.userAgent.toLowerCase();
	return userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1;
};

var createOverlay = function() {
	if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
		$("body","html").css({height: "100%", width: "100%"});
		$("html").css("overflow","hidden");
		if (document.getElementById("jgHtmlBoxHideSelect") === null) {//iframe to hide select elements in ie6
			$("body").append("<iframe id=\"jgHtmlBoxHideSelect\"></iframe><div id='jgHtmlBoxOverlay'></div>");
		}
	}else{//all others
		if(document.getElementById("jgHtmlBoxOverlay") === null){
			$("body").append("<div id='jgHtmlBoxOverlay'></div>");
		}
	}
	// Mac detection, thanks for Thickbox
   	if(isMac()) {
		$("#jgHtmlBoxOverlay").addClass("jgHtmlBoxOverlayMacFFBGHack");
	}
	else {
		$("#jgHtmlBoxOverlay").addClass("jgHtmlBoxOverlayBG");//use background and opacity
	}
}

var removeOverlay = function() {
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		$("body","html").css({height: "auto", width: "auto"});
		$("html").css("overflow","");
	}
	$("#jgHtmlBoxWindow").remove();
	$("#jgHtmlBoxHideSelect").remove();
	$("#jgHtmlBoxOverlay").remove();
}

var $popupPrev=null;
var $openPopup=null;

$.popupOpen = function(search){
	if ($popupPrev != null) {
		$.popupClose();
	}

	createOverlay();
	var $popup = $(search);
	if (!$popup.length) {
		return $popup;
	}
	$popupPrev = $popup.prev();
	$("body").append($popup);
	$openPopup = $popup;

	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;

	if ($.browser.msie && navigator.userAgent.toLowerCase().indexOf("msie 7") === -1) {
		$popup.addClass("jgHtmlBoxWindowIE6");
		$popup.css("top", ((h - $popup.height()) / 2) + "px");
		$popup.css("left", ((w - $popup.width()) / 2) + "px");
		$popup.show();
	}
	else {
		$popup.addClass("jgHtmlBoxWindow");
		$popup.show();
		$popup.css("top", ((h - $popup.height()) / 2) + "px");
		$popup.css("left", ((w - $popup.width()) / 2) + "px");
	}
};

$.popupClose = function(){
	if ($openPopup != null) {
		if ($popupPrev != null) {
			$popupPrev.after($openPopup);
		}
		$openPopup.removeClass("jgHtmlBoxWindow");
		$openPopup.removeClass("jgHtmlBoxWindowIE6");
		$openPopup.hide();
		$popupPrev = null;
		$openPopup = null;
	}
	removeOverlay();
};
})(jQuery, window);