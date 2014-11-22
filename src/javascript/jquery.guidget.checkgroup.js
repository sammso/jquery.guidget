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
 * @param {Object} $m
 * @param {Object} mOptions
 */
w.guidget.CheckGroupGuidget = function($m, mOptions){
	if(!mOptions) mOptions = {};
	var mThis = wguidget.Guidget.call(this, mOptions);

	var mCheckName = "GUID-C" + mThis.guid;

	var defaultObject = {};
	defaultObject[$m.attr("name")] = [];

	wguidget.extendOptions({
		rowTemplateHtml : "<span><input type=\"checkbox\" name=\"fieldName\"/></span>",
		query : "input[@type=checkbox]",
		source : new Array(),
		comparator : function(sourceRow, object) { return object===mOptions.converter(sourceRow); },
		object : defaultObject,
		field: $m.attr("name"),
		selectedIndex : null,
		converter : function(sourceRow){ return sourceRow }
	},mOptions);

	var mSource = mOptions.source;

	mOptions.rowRendered = function($row, rowObject, rowIndex) {
		var $checkBox = $row.find(mOptions.query);
		var objectField = mOptions.object[mOptions.field];
		var length = objectField.length;
		for (var i = 0; i < length; i++) {
			if(mOptions.comparator(objectField[i],rowObject)) {
				$checkBox.attr("checked","true");
			}
		}

		$checkBox.click(function() {
			var found = false;
			var l = objectField.length;
			for (var i = 0; i < l; i++) {
				if(mOptions.comparator(objectField[i],rowObject)) {
					if(!this.checked) {
						objectField.splice(i,1);
						return;
					}
					else {
						found=true;
					}
				}
			}
			if (!found) {
				objectField.push(mOptions.converter(rowObject));
			}
		});
	};

	// List guidget to store parameters
	var mListGuidget = $m.listGuidget(mOptions);
};

$.fn.checkgroupGuidget = function(aOptions) {
	return this.each(function() {
		$.setGuidget($(this),new w.guidget.CheckGroupGuidget($(this), aOptions));
	});
};
})(jQuery, window);