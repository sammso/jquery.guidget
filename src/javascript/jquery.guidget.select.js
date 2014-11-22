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
 * Select guidget is mainly for read only
 *
 * @param {Object} $m
 * @param {Object} mOptions {
 * }
 */
w.guidget.SelectGuidget = function($m, mOptions){
	if(!mOptions) mOptions = {};
	var mThis = wguidget.Guidget.call(this, mOptions);

	var defaultObject = {};
	defaultObject[$m.attr("name")] = null;

	wguidget.extendOptions({
		source : new Array(),
		textReader : null,
		comparator : function(sourceRow, object) { return object===mOptions.converter(sourceRow); },
		object : defaultObject,
		field: $m.attr("name"),
		selectedIndex : null,
		converter : function(sourceRow){ return sourceRow }
	},mOptions);

	var mLock = false;

	var textReader = function(value) {
		return wguidget.htmlSafe(mOptions.textReader(value));
	};

	var setSourceData = function(aSource, clear){
		if (!mLock) {
			mLock = true;
			if(clear)mThis.empty();
			mOptions.source = aSource;
			for (var i = 0; i < aSource.length; i++) {
				var lDom = document.createElement("option");
				var $lDom = $(lDom);
				$lDom.attr("value", i);
				$lDom.append(textReader(aSource[i]));
				$m.append($lDom);
			}
			mLock = false;
		}
	}

	mThis.setSource = function(aSource) {
		setSourceData(aSource,true);
	};

	var selectObject = function(aObject) {
		for( var i=0 ; i < mOptions.source.length ; i++ ) {
			if(mOptions.comparator(mOptions.source[i], aObject )) {
				selectIndex(i,true);
				return i;
			}
		}
		return -1;
	};

	var mSelectedData = null;

	var selectIndex =  function(aIndex, aSetVal) {
		if( aIndex>=0 && aIndex < mOptions.source.length ) {
			mOptions.object[mOptions.field] = mOptions.converter(mOptions.source[aIndex]);
			if (aSetVal==true) {
				$m.val(aIndex);
			}
			return aIndex;
		}
		return -1;
	};

	mThis.select = function(by) {
		if (by == undefined || by == null) {
			return -1;
		}
		else if(!isNaN(parseInt(by))){ // index
			return selectIndex(by,true);
		}
		else {
			return selectObject(by);
		}
	};

	mThis.setValue = function(aObject) {
		if(selectObject(aObject)>=0) {
			mOptions.object[mOptions.field]=aObject;
		}
	};

	mThis.getValue = function() {
		return mOptions.object[mOptions.field];
	};

	mThis.getSelectedIndex = function() {
		return $m.val();
	};

	$m.change(function(aEvent) {
		selectIndex($m.val(),false);
	});

	mThis.empty = function(){
		$m.empty();
		mOptions.source.splice(0, mOptions.source.length);
	};

	if(mOptions.source!=null) {
		setSourceData(mOptions.source,false);
		if(mOptions.selectedIndex!=null) {
			selectIndex(mOptions.selectedIndex,true);
		}
		else if(mOptions.object!=null) {
			mThis.setValue(mOptions.object[mOptions.field]);
		};
	};
};

$.fn.selectGuidget = function(options) {
	return this.each(function() {
		$.setGuidget($(this),new w.guidget.SelectGuidget($(this), options));
	});
};

})(jQuery, window);