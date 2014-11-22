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
 var wguidget = w.guidget;
/**
 *
 * @param {Object} $m
 * @param {Object} aParameters
 */
w.guidget.RadioGuidget = function($m, mOptions){
	if(!mOptions) mOptions = {};
	var mThis = wguidget.Guidget.call(this, mOptions);

	var defaultObject = {};
	defaultObject[$m.attr("name")] = null;

	wguidget.extendOptions({
		checked: true,
		unChecked : false,
		object: { data: false },
		field : "data"
	},mOptions);

	var mName = $m.attr("name");

	$m.click(function(aEvent) {
		if($m.attr("type")=="checkbox" && !$m[0].checked) {
			mThis.unCheck();
			return;
		}
		else {
			mThis.check();
		}
	});

	mThis.type="RADIO";

	mThis.getValue = function() {
		return mOptions.object[mOptionss.field];
	};

	mThis.setValue = function(aData) {
		if(aData===mOptions.checked) {
			mOptions.object[mOptions.field] = aData;
			unCheckOthers(mOptions.object);
		}
		else if(aData===mOptions.unChecked) {
			mOptions.object[mOptions.field] = aData;
		}

	};

	var unCheckOthers = function() {
		var $lOthers = $("input[name=" + mName + "]");
		var ldom = $m[0];
		for( var i=0 ; i< $lOthers.length ; i++ ) {
			lOther = $lOthers[i];
			if(lOther!=ldom) {
				var g = $.getGuidget($(lOther));
				if(g) {
					g.unCheck();
				}
			}
		}
	};

	mThis.unCheck = function() {
		$m.removeAttr("checked");
		mOptions.object[mOptions.field] = mOptions.unChecked;
	};

	mThis.check = function() {
		$m.attr("checked","true");
		mOptions.object[mOptions.field] = mOptions.checked;
		unCheckOthers();
	};
	if (mOptions.object[mOptions.field] === mOptions.checked) {
		mThis.check();
	};
};

$.fn.radioGuidget = function(aParameters) {
	return this.each(function() {
		$.setGuidget($(this),new w.guidget.RadioGuidget($(this), aParameters));
	});
};
})(jQuery, window);