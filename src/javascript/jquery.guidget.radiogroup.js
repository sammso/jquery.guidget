/**
 * jQuery Guidget JavaScript Library
 *
 * Copyright (c) 2008-2009,
 * jQuery.guidget team
 *
 * Licensed under the MIT license.
 * http://www.guidget.org/licence.html
 */
(function($, w){
var wguidget = w.guidget;
/**
 * @param {Object} $m
 * @param {Object} aOptions
 */

var REG_NAME = /[{]name[}]/g;

w.guidget.RadioGroupGuidget = function($m, mOptions){
	if(!mOptions) mOptions = {};
	var mThis = wguidget.Guidget.call(this, mOptions);

	var mRadioName = "GUID-C" + mThis.guid;

	wguidget.extendOptions({
		rowTemplateHtml : "<span><input type=\"radio\" name=\"{name}\"/></span>",
		rowQueryString : "input[type=radio]",
		source : null,
		object : { data: null },
		comparator : function(sourceRow, objectField) { return objectField===mOptions.converter(sourceRow); },
		field: "data",
		converter : function(sourceRow){
			return sourceRow;
		}
	}, mOptions);

	mOptions.rowTemplateHtml = mOptions.rowTemplateHtml.replace(REG_NAME,mOptions.rowTemplateHtml, mRadioName);

	mOptions.rowRendered = function($row, rowObject, rowIndex) {
		var $lRadio = $(mOptions.rowQueryString,$row);
		$lRadio.attr("name", mRadioName);

		if(mOptions.comparator(mOptions.object[mOptions.field], rowObject)) {
			$lRadio.attr("checked","true");
		}

		$lRadio.click(function() {
			if(this.checked) {
				mOptions.object[mOptions.field] = mOptions.converter(rowObject)
			}
			return true;
		});
	};

	// List guidget to store parameters
	var mListGuidget = $m.listGuidget(mOptions);

	mThis.setSource = function(sourceArray) {
		mListGuidget.setSource(sourceArray);
	}
};

$.fn.radiogroupGuidget = function(options) {
	return this.each(function() {
		$.setGuidget($(this),new w.guidget.RadioGroupGuidget($(this), options));
	});
};
})(jQuery, window);