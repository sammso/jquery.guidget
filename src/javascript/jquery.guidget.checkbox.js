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
 * @param {Object} aOptions
 */
w.guidget.CheckGuidget = function($m, mOptions){
	if(!mOptions) mOptions = {};
	var mThis = wguidget.Guidget.call(this, mOptions);

	var defaultObject = {};
	defaultObject[$m.attr("name")] = null;

	wguidget.extendOptions({
		checked: true,
		unChecked : false,
		object: defaultObject,
		field : $m.attr("name")
	}, mOptions );

	mThis.getValue = function() {
		return mOptions.object[mOptions.field];
	};

	$m.click(function(aEvent) {
		if (mOptions.object[mOptions.field] == mOptions.checked) {
			mThis.check(false);
		}
		else {
			mThis.check(true);
		}
	});

	mThis.value = function(value) {
		if (value) {
			if (value === mOptions.checked) {
				mOptions.object[mOptions.field] = aData;
			}
			else
				if (value === mOptions.unChecked) {
					mOptions.object[mOptions.field] = aData;
				}
				else {
					throw "Exception: CheckGuidget.setValue Object is not checked nor unchecked";
				}
		}
		return mOptions.object[mOptions.field];
	};


	mThis.check = function(checkorNot) {
		if(checkorNot===undefined) {
			return;
		}

		checkorNot = checkorNot ? true : false;
		if (checkorNot === true) {
			$m.attr("checked", "true");
			mOptions.object[mOptions.field] = mOptions.checked;
		}
		else {
			$m.removeAttr("checked");
			mOptions.object[mOptions.field] = mOptions.unChecked;
		}
	};

	if (mOptions.object[mOptions.field] === mOptions.checked) {
		mThis.check(true);
	};
};

$.fn.checkGuidget = function(options) {
	return this.each(function() {
		$.setGuidget($(this),new w.guidget.CheckGuidget($(this), options));
	});
};

})(jQuery, window);