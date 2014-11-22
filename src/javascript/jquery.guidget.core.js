/**
 * jQuery Guidget JavaScript Library
 *
 * Copyright (c) 2008-2009,
 * jQuery.guidget team
 *
 * Licensed under the MIT license.
 * http://www.guidget.org/licence.html
 */
(function($, w){ // Do the function to separate this from
if(w.guidget) { // Already defined
	return;
}
w.guidget = {};

var wguidget = w.guidget;

wguidget.version = '@VERSION';

wguidget.KEYS = {
	isNumber: function(v) {
		return ( v>=48 && v<= 57 ); // || ( v>=96 && v<=105 );
	},
	BACKSPACE:8,
	TAB:9,
	ENTER:13,
	SHIFT:16,
	CTRL:17,
	ALT:18,
	PAUSEBREAK:19,
	CAPS_LOCK:20,
	ESCAPE:27,
	PAGE_UP:33,
	PAGE_DOWN:34,
	END:35,
	HOME:36,
	LEFT_ARROW:37,
	UP_ARROW:38,
	RIGHT_ARROW:39,
	DOWN_ARROW:40,
	INSERT:45,
	DELETE:46,
	LEFTWINDOWKEY:91,
	RIGHTWINDOWKEY:92,
	SELECTKEY:93,
	ADD:107,
	SUBTRACT:109,
	DECIMAL_POINT:110,
	DIVIDE:111,
	F1:112,
	F2:113,
	F3:114,
	F4:115,
	F5:116,
	F6:117,
	F7:118,
	F8:119,
	F9:120,
	F10:121,
	F11:122,
	F12:123,
	NUM_LOCK:144,
	SCROLL_LOCK:145,
	SEMI_COLON:186,
	EQUAL_SIGN:187,
	COMMA:188,
	DASH:189,
	PERIOD:190,
	FORWARDSLASH:191,
	GRAVE_ACCENT:192,
	OPEN_BRACKET:219,
	BACK_SLASH:220,
	CLOSE_BRAKET:221,
	SINGLE_QUOTE:222
};

var htmlSafeAmpReg = /[&]/g, htmlSafeLtReg = /[<]/g, htmlSafeGtReg = /[>]/g;

wguidget.htmlSafe = function(value) {
	if (value) {
		return value.replace(htmlSafeAmpReg,"&amp;")
			.replace(htmlSafeGtReg,"&gt;")
			.replace(htmlSafeLtReg,"&lt;");
	}
	else {
		return "";
	}
};

/**
* Helper methdods
*/

var gGuidCounter = 0;

$.setObjectToTemplate = function(template, templateObject, prefix) {
	prefix = prefix ? prefix + "." : "";
	for (propertyName in templateObject) {
		template = template.replace(new RegExp("[{]" + prefix + propertyName + "[}]","g"), templateObject[propertyName]);
	}
	return template;
};

$.hasGuidget = function(wquery) {
	return $.getGuidget(wquery)?true:false;
};

$.getGuidget = function(wquery) {
	if(!wquery.jquery) {
		wquery = $(wquery);
	}
	var guidgetData =wquery.data("guidget");
	if(guidgetData) {
		return guidgetData.guidget;
	}
	else {
		return null;
	}
};

$.getGuidgetData = function(wquery) {
	if(!wquery.jquery) {
		wquery = $(wquery);
	}
	var guidgetData =wquery.data("guidget");
	if(guidgetData) {
		return guidgetData.data;
	}
	else {
		return null;
	}
};

$.setGuidget = function(wquery,guidget,guidgetData) {
	if(!wquery.jquery) {
		wquery = $(wquery);
	}
	wquery.data("guidget",
			{
				guidget:guidget,
				data:guidgetData?guidgetData:null});
};



$.queryTemplate = function($template,aHtml) {
	if (jQuery.nodeName($template[0], "table")) {
		$template.append("<tbody>" + aHtml + "</tbody>");
		var $templateClone = $template.children().children().clone();

		$template.children().remove();
		$templateClone.show();
		return $templateClone;
	}
	else if(jQuery.nodeName($template[0], "tbody")) {
		$template.append(aHtml);
		var $templateClone = $template.children().clone();

		$template.children().remove();
		$templateClone.show();
		return $templateClone;
	}
	else {
		var $lDom = $(document.createElement("div"));
		$lDom.html(aHtml);
		return $($lDom.children()[0]).clone();
	}
};

wguidget.nextGuidId = function() {
	return gGuidCounter++;
}

var extendOptions = wguidget.extendOptions = function(source, target) {
	if (source && target) {
		for (var name in source) {
			var src = source[name], trg = target[name];
			// Prevent never-ending loop
			if (trg === undefined) {
				target[name] = src;
			}
		}
	}
};

/**
 * Base Guidget "Class"
 * provides some basic services for all guidgets
 */
wguidget.Guidget = function($m, mOptions) {
	var mThis = this;
	mThis.guid = wguidget.nextGuidId();
	extendOptions({
		validate :wguidgetvalidation.defaultValidationHandler,
		validationMessage: emptyHander,
		groupValidator: wguidgetvalidation.GROUPVALID
	},mOptions);

	var mValidationStatus = v.NOTVALIDATED;

	/**
	 * Current validation status
	 */
	mThis.getValidationStatus = function() {
		return mValidationStatus;
	};

	mThis.setValidationStatus = function(validationStatus) {
		if (validationStatus === validationStatus.NOTVALIDATED ||
		validationStatus === validationStatus.VALID ||
		validationStatus === validationStatus.VALIDATING ||
		validationStatus === validationStatus.NOTVALID) {
			mValidationStatus = validationStatus;
		}
		else throw "ERROR: Wrong type argument at function <guidget>.setValidationStatus(..)=";
	};

	mThis.validationMessage = function(validationResult) {
		if( validationResult.code === v.VALID ) {
			validationResult = mOptions.groupValidator.validate();
		}
		mOptions.validationMessage.call(mThis, validationResult);
	};

	mThis.query = function(){
		return $m;
	};
	return mThis;
};

$.fn.guidget = function(aGuidget, aParameters){
	if (!aGuidget && !aParameters) {
		if (this.length > 1) {
			throw ".guidget() : ERROR jQuery result greater than 1";
		}
		if (this.length == 0) {
			throw ".guidget() : ERROR jQuery result empty";
		}
		else {
			return $.getGuidget(this);
		}
	}
	else {
		return this.each(function() {
			$.setGuidget($(this),new aGuidget($(this), aParameters));
		});
	}
};

$.fn.guidgetData = function(aData){
	if (!aGuidget && !aParameters) {
		if (this.length > 1) {
			throw ".guidgetData() : ERROR jQuery result greater than 1";
		}
		if (this.length == 0) {
			throw ".guidgetData() : ERROR jQuery result empty";
		}
		else {
			return $.getGuidgetData(this);
		}
	}
	else {
		return this.each(function() {
			$.setGuidgetData($(this),aData);
		});
	}
};

var loggerCounter=1;

var guidgetLoggerId = "#jGuidgetLog";

// If jQuery has log then it can be used.
if(!$.log) {
	$.log = function(logText) {
		if($(guidgetLoggerId).length==0) {
			$("body").append("<div id=\"jGuidgetLog\"></div>");
			$(guidgetLoggerId).click(function() {$("#jGuidgetLog").hide()});
		}
		$(guidgetLoggerId).show();
		$(guidgetLoggerId).prepend("<p><span>" + (loggerCounter++) + "</span> : " + logText +"</p>");
	};
};

w.guidget.validation = {};
var wguidgetvalidation = w.guidget.validation;


var v = wguidgetvalidation.status = {
	NOTVALIDATED: 0,
	VALID: 1,
	VALIDATING: 2,
	INVALID : 3
};

var emptyHander = function() {};

// Make static result codes

var RESULTVALID = { code:v.VALID };
var RESULTNOTVALIDATED = { code:v.NOTVALIDATED };
var RESULTVALIDATING = { code:v.VALIDATING };

wguidgetvalidation.defaultValidationHandler = function(result) {
	return RESULTVALID;
};

wguidgetvalidation.createResult = function(resultCode, resultMsg, msgParams) {
	if(resultCode===v.NOTVALIDATED || resultCode==="NOTVALIDATED") {
		return RESULTNOTVALIDATED;
	}
	else if( resultCode===v.VALID || resultCode==="VALID" ) {
		return RESULTVALID;
	}
	else if( resultCode===v.VALIDATING || resultCode==="VALIDATING" ) {
		return RESULTVALIDATING;
	}
	else if(resultCode===v.INVALID
		|| resultCode==="INVALID" ){
		var result =  {	code:resultCode };
		if(resultMsg) result.msg = resultMsg;
		if(msgParams && !msgParams.length) result.params = [msgParams];
		if(msgParams && msgParams.length) result.params = msgParams;
		return result;
	}
	throw "Wrong result CODE has to be (NOTVALIDATED, VALID, VALIDATING, INVALID)";
};

wguidgetvalidation.createValidatingResult = function() {
	return RESULTVALIDATING;
};

wguidgetvalidation.createValidResult = function() {
	return RESULTVALID;
};

wguidgetvalidation.createGroupValidator = function(object, validateMethod) {
	var mThis = this;
	var guidgets = [];

	mThis.register = function(guidget) {
		guidgets.put(guidget);
	};

	mThis.validate = function(result) {
		var result = validateMethod(object);
	};

	mThis.setValidationResult = function(result) {
		var length = guidgets.length;
		for(var i=0 ; i<length ; i++ ) {
			guidgets.setValidationResult(result);
		}
	};

	return mtThis;
};

wguidgetvalidation.GROUPVALID = {
	register: function(guidget) {},
	validate: function(){
		return RESULTVALID;
	}
};

})(jQuery, window);