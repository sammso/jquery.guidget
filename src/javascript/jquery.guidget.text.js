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

// For minifier
var wguidget = w.guidget;
var wguidgetvalidation = wguidget.validation;
var createValidationResult = wguidget.validation.createResult;
var validationStatus = wguidgetvalidation.status;

wguidget.getCaretPosition = function(element) {
	if( document.selection ){ // IE 6 & 7 Hack
        var r = document.selection.createRange().duplicate();
		r.moveEnd('character', element.value.length);
		if (r.text == '') {
			return element.value.length;
		}
		else {
			return element.value.lastIndexOf(r.text);
		}
	}
	else if (element.selectionStart || element.selectionStart == '0') {
		return element.selectionStart;
	}
};

var selectionLength = function(element) {
	if (document.selection) {
		return document.selection.createRange().text.length;
	}
	else {
		return element.selectionEnd - element.selectionStart;
	}

};

var getCaretPosition = wguidget.getCaretPosition;

wguidget.TextConverter = function(mOptions) {
	this.validate = function(aText) {
		return createValidationResult(validationStatus.VALID);
	};

	this.to = function(aText) {
		return aText;
	};

	this.from = function(aValue) {
		return aValue;
	};
	this.keyUp = function(aEvent){};

	this.keyDown = function(aEvent) {
		var k = aEvent.which;
		switch(k) {
			case wguidget.KEYS.BACKSPACE :
			case wguidget.KEYS.DELETE :
			case wguidget.KEYS.TAB :
			case wguidget.KEYS.LEFT_ARROW :
			case wguidget.KEYS.RIGHT_ARROW :
			case wguidget.KEYS.HOME :
			case wguidget.KEYS.END :
				return true;
		}

		if(mOptions.$[0].type == "textarea"
			&& k==wguidget.KEYS.UP_ARROW || wguidget.KEYS.DOWN_ARROW) {
			return true;
		}

		if(mOptions.maxLength!=null) {
			if( getCaretPosition(this)>=mOptions.maxLength
				|| mLength>= (mOptions.maxLength - 1)) {
				return false;
			}
		}
		if(aEvent.which==13) {
			if(mOptions.$[0].type == "textarea") {
				return true;
			}
			else {
				return false;
			}
		}
		return true;
	};
};

wguidget.NumberConverter = function(mOptions) {
	this.validate = function(aText) {
		var ret = validationStatus.VALID;
		var msg = undefined;
		if(mOptions.decimal && mOptions.decimal>0) {
			ret = isNaN(parseFloat(aText))
				? validationStatus.INVALID : validationStatus.VALID  ;
			msg = "guidget.msg.not-decimal";
		}
		else {
			ret = isNaN(parseInt(aText))
				? validationStatus.INVALID : validationStatus.VALID  ;
			msg = "guidget.msg.not-integer";
		}

		return wguidgetvalidation.createResult(ret, msg);
	};

	var mHasNegative=false;
	var mDecimalPoint=null;

	this.to = function(aText) {
		aText = $.trim(aText);
		if (aText==="") {
			return null;
		}
		else {
			if(mOptions.decimal && mOptions.decimal>0) {
				return parseFloat(aText);
			}
			else {
				return parseInt(aText);
			}
		}
	};

	this.from = function(aValue) {
		if(aValue) {
			aValue = aValue + "";
		}

		handlePoints(aValue);

		return aValue;
	};


	var handlePoints = function(value) {
		value = value ? value : "";
		if(value.indexOf(",")>=0||value.indexOf(".")>=0) {
			mDecimalPoint=Math.max(value.indexOf(","),value.indexOf("."));
		}
		else {
			mDecimalPoint=null;
		}
		mHasNegative = value.indexOf("-")>=0;
	};

	this.keyUp = function(aEvent) {
		handlePoints(mOptions.$.val());

	};

	this.keyDown = function(aEvent) {
		var k = aEvent.which;
		var lText = mOptions.$.val();
		var pos = getCaretPosition(this);

		if(aEvent.ctrlKey &&(k==67||k==65)) {
			return true;
		}
/*		if(aEvent.shiftKey || aEvent.metaKey) {
			$.log("2");
			return false;
		}*/

		// Check the decimal count is on limit
		// Can add decimal delimeter
		if(mOptions.decimal>0 && mDecimalPoint==null) {
			switch(k) {
				case wguidget.KEYS.COMMA :
				case wguidget.KEYS.PERIOD :
				case wguidget.KEYS.DECIMAL_POINT:
					mDecimalPoint=pos;
					return true;
			}
		}
		// Allowed keys
		switch(k) {
			case wguidget.KEYS.BACKSPACE :
			case wguidget.KEYS.DELETE :
			case wguidget.KEYS.TAB :
			case wguidget.KEYS.LEFT_ARROW :
			case wguidget.KEYS.RIGHT_ARROW :
			case wguidget.KEYS.HOME :
			case wguidget.KEYS.END :
			case wguidget.KEYS.SHIFT :
				return true;
		}
		// is negative allowed
		if(mOptions.negative
			&& pos==0
			&& !mHasNegative
			&& ( k==wguidget.KEYS.SUBTRACT || k==wguidget.KEYS.DASH )) {
			mHasNegative=true;
			return true;
		}

		if( selectionLength(this)==0
			&& mDecimalPoint!=null
			&& mOptions.decimal > 0
			&& pos > mDecimalPoint
			&& ( lText.length - mOptions.decimal ) > mDecimalPoint  ) {
			return false;
		}

		if(wguidget.KEYS.isNumber(k)) {
			return true;
		}
		return false;
	};
};


wguidget.TextGuidget = function($m, mOptions) {
	if(!mOptions) mOptions = {};
	var mThis = wguidget.Guidget.call(this, $m, mOptions);

	var mHasDataFieldOnInit = mOptions.object!=undefined || mOptions.object!=null;

	var defaultObject = {};
	defaultObject[$m.attr("name")] = null;

	wguidget.extendOptions({
		Converter: wguidget.TextConverter,
		disableEnter : true,
		field : $m.attr("name"),
		object : defaultObject,
		keyUpValidation : false,
		maxLength : null
	},mOptions);

	mOptions["$"]=$m;

	var mConverter = new mOptions.Converter(mOptions);

	if($.browser["opera"]) {
		$m.keypress(mConverter.keyDown);
	}
	else {
		$m.keydown(mConverter.keyDown);
	}


	mThis.isVisited = false;

	// Marks guidget visited on focus
	$m.focus(function() {
		mThis.isVisited = true;
	});

	$m.keyup(function(e) {
		mConverter.keyUp(e);
		if(mOptions.keyUpValidation==true) {
			validate($m.val());
		}
	});

	$m.blur(function(aEvent) {
		mOptions.object[mOptions.field]=mConverter.to($m.val());
	});

	var mValidationStatus = validationStatus.NOTVALIDATED;

	mThis.getValidationStatus = function() {
		return mValidationStatus;
	}

	var mLength = 0;

	var validate = function(aText) {
		var validationMessage = mConverter.validate(aText);
		if (validationMessage.code===validationStatus.VALID) {
			var lValue = mConverter.to(aText);
			validationMessage = mOptions.validate.call(mThis, lValue);

			if (validationMessage.code===validationStatus.VALID) {
				mThis.validationMessage(validationMessage);
				return validationStatus.VALID;
			}
			else {
				mThis.validationMessage(validationMessage);
				return validationStatus.VALID;
			}
		}
		else {
			mThis.validationMessage(validationMessage);
			return validationStatus.INVALID;
		}
	};
	/**
	 * Validates textfield
	 */
	mThis.validate = function() {
		validate($m.val());
	};
	/**
	 * Sets value from backend JO object
	 */
	mThis.refresh = function() {
		$m.val(mConverter.from(mOptions.object[mOptions.field]));
	}

	mThis.setValue = function(aValue) {
		mOptions.object[mOptions.field] = aValue;
		mThis.refresh();
	}

	if(mHasDataFieldOnInit) {
		mThis.refresh();
	}
	return mThis;
};

$.fn.textGuidget = function(options) {
	return this.each(function() {
		$.setGuidget($(this),new wguidget.TextGuidget($(this), options));
	});
};
})(jQuery, window);