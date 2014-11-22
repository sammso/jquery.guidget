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

wguidget.ListGuidget = function($m, mOptions) {
	if(!mOptions) mOptions = {};
	var mThis = wguidget.Guidget.call(this, mOptions);

	var mClickLock = false;
	var mClickEnabled = true;

	wguidget.extendOptions(
		{
		rowRendered : function($row, aObject, aIndex) {
			$row.click( function(aEvent){
				if(!mClickLock && mClickEnabled) {
					mClickLock=true;
					var dom = getRowDom(aEvent.target);
					mThis.select($(dom));
					mClickLock=false;
				}
			});
		},
		rowSelection : function($rows, isSelected) {

		},
		rowTemplateHtml : null, // row template on html
		rowTemplateQuery: null, // row template on $ selection
		loadingTemplateHtml: "<i>Loading</i>",
		rowActiveClass : "jg-active",
		source : new Array(),
		selectedRow: null
	},mOptions);

	var mDataRowRefs = new Array()

	var empty = function(){
		$m.empty();
	};

	$m.data("guidget",{ guidget:mThis});

	var mRowTemplate = null;

	if(mOptions.rowTemplateQuery!=null) {
		mRowTemplate = rowTemplateQuery.clone();
		rowTemplateQuery.remove();
		mOptions.rowTemplateHtml = mRowTemplate.html();
	}
	else if(mOptions.rowTemplateHtml!=null) {
		mRowTemplate = $.queryTemplate($m,mOptions.rowTemplateHtml);
	}

	var $prevSelection = null;

	var scrollIntoView = function(node) {
		var parent = node.parentNode;
		if (parent.scrollHeight > parent.clientHeight) {
			var scrollOffset = node.offsetTop - parent.offsetTop
				- parent.clientHeight / 2 + node.clientHeight / 2;
			parent.scrollTop = scrollOffset;
		}
	};

	var getRowDom = function(aDom) {
		var lGuidget = $.getGuidget($(aDom));
		if(lGuidget && lGuidget.guid===mThis.guid) {
			return aDom;
		}
		else {
			return getRowDom(aDom.parentNode);
		}
	};

	mThis.select = function(by) {
		if (by == undefined || by == null) {
		}
		else if(by.jquery) {
			selectRowByQuery(by);
		}
		else {
			selectRowByObject(by);
		}
	};

	mThis.selectByIndex = function(index) {
		selectRowByIndex(index);
	};


	var selectRowByQuery = function($row) {
		if($prevSelection!=null && $prevSelection[0]==$row[0]) {
			$prevSelection.removeClass(mOptions.rowActiveClass);
			mOptions.rowSelection($prevSelection,false);
			$prevSelection=null;
		}
		else {
			if($prevSelection!=null) {
				$prevSelection.removeClass(mOptions.rowActiveClass);
				mOptions.rowSelection($prevSelection,false);
				$prevSelection=null;
			}
			$row.addClass(mOptions.rowActiveClass);
			mOptions.rowSelection($row,true);
			$prevSelection=$row;
		}
	};

	var selectRowByIndex = function(index) {
		if(index>=0 && index < mOptions.source.length) {
			var rowQ = mDataRowRef[index];
			selectRowByQuery(rowQ);
			scrollIntoView(rowQ[0]);
		}
	};

	var selectRowByObject = mThis.selectRowByObject = function(aObject) {
		var index = findIndex(aObject);
		selectRowByIndex(index);
	};

	mThis.source = function(source) {
		if (source === undefined) {
			return mOptions.source;
		}
		else {
			if (!mLock) {
				mLock = true;
				empty();
				mOptions.source = source;
				var l = source.length;
				for (var i = 0; i < l; i++) {
					insert(false, source[i]);
				}
				mLock = false;
			}
		}
	};

	var mLock = false;
	/**
	 *
	 * @param {boolean} aInsertToData false only if to be rendered
	 * @param {Object} aObject
	 * @param {integer} aBeforeIndex
	 */
	var insert = function(aInsertToData, aObject, aBeforeIndex) {
		var $dataRowQuery = $.queryTemplate($m,$.setObjectToTemplate(mOptions.rowTemplateHtml,aObject));
		$.setGuidget($dataRowQuery, mThis, aObject);

		if(aBeforeIndex==undefined || aBeforeIndex<0 || aBeforeIndex >= mOptions.source.length) {
			// add to end
			$m.append( $dataRowQuery );


			if(mOptions.isRowSelected!=null
				&& mOptions.isRowSelected(aObject)) {
				mOptions.rowSelection($dataRowQuery,true);
				$dataRowQuery.addClass(mOptions.rowActiveClass);
				$prevSelection=$dataRowQuery;
			}
			mOptions.rowRendered($dataRowQuery, aObject, mDataRowRefs.length);
			mDataRowRefs.push($dataRowQuery);
			if(aInsertToData) {
				mOptions.source.push(aObject);
			}
		}
		else {
			// add before "aBeforeIndex"
			var $b = mDataRowRefs[aBeforeIndex];
			$b.before($dataRowQuery);
			if(mOptions.isRowSelected!=null
				&& mOptions.isRowSelected(aObject)) {
				mOptions.rowSelection($dataRowQuery,true);
				$dataRowQuery.addClass(mOptions.rowActiveClass);
				$prevSelection=$dataRowQuery;
			}

			mOptions.rowRendered($dataRowQuery, aObject, aBeforeIndex);
			mOptions.source.splice(aBeforeIndex,0, aObject);
			mDataRowRefs.splice(aBeforeIndex,0, $dataRowQuery);
		}
		return $dataRowQuery;
	};

	var findIndexFromRow$ = function($aRow) {
		for(var i=0 ; i < mDataRowRefs.length ; i++ ) {
			if($aRow[0]===mDataRowRefs[i][0])	 {
				return i
			}
		}
		return -1;
	};

	mThis.orderByDomOrder = function() {
		var $list = $m.children();
		var di=0;
		for(var i=0; i<$list.length ; i++) {
			var gdata = $.getGuidgetData($list[i]);
			if(gdata!=null) {
				mOptions.source[di] = $.getGuidgetData($list[i]);
				mDataRowRefs[di] = $($list[i]);
				di++;
			}
		}
	};

	var findIndexFromObject = function(aObject) {
		for(var i=0 ; i < mOptions.source.length ; i++ ) {
			if(aObject===mOptions.source[i])	 {
				return i;
			}
		}
		return -1;
	};

	/**
	 *
	 */
	mThis.findIndex = function(by) {
		if(by.jquery) {
			return findIndexFromRow$(by);
		}
		else {
			return findIndexFromObject(by);
		}
	};

	mThis.insert = function(aObject, aBeforeIndex, aScrollToRow) {
		var $row;
		if(!mLock) {
			mLock=true;
			$row = insert(true,aObject, aBeforeIndex);
			mLock=false;
		}
		if($row && aScrollToRow!=undefined && aScrollToRow===true) {
			selectRowByQuery($row);
			scrollIntoView($row[0]);
		}
		return $row;
	};

	mThis.add = function(aObject, aScrollToRow) {
		return mThis.insert(aObject,undefined, aScrollToRow);
	};

	mThis.getSelectedIndex = function() {
		return findIndexFromRow$($prevSelection);
	};
	/**
	 *
	 */
	mThis.query = mThis.$ = function() {
		return $m;
	};

	/**
	 * set
	 * @param {Object} aObject
	 * @param {Object} aIndex
	 */
	mThis.set = function(aObject, aIndex) {
		if(!mLock) {
			mLock=true;
			var $dataRowQuery = mDataRowRefs[aIndex];
			$.setGuidget($dataRowQuery, mThis, aObject);
			$dataRowQuery.html($.setObjectToTemplate(mOptions.rowTemplateHtml,aObject));
			mOptions.rowRendered($dataRowQuery, aObject, aIndex);
			mOptions.source[aIndex] = aObject;
			mDataRowRefs[aIndex] = $dataRowQuery;
			mLock=false;
		}
	}

	var remove = function(aIndex) {
		mOptions.source.splice(aIndex,1);
		var $removedRowRefs = mDataRowRefs.splice(aIndex,1);
		for(var i=0 ; i < $removedRowRefs.length ; i++) {
			if($removedRowRefs[i][0]===$prevSelection[0]) {
				mOptions.rowSelection($prevSelection,false);
				$prevSelection=null;
			}
			$removedRowRefs[i].remove();
		}
	}

	mThis.remove = function(by) {
		if(!mLock) {
			mLock=true;
			if(by===undefined) {
				by = $prevSelection;
			}
			var index = mThis.findIndex(by);
			if (index != -1) {
				remove(index);
			}
			mLock=false;
		}
	};

	mThis.removeByIndex = function(index) {
		if(!mLock) {
			mLock=true;
			remove(index);
			mLock=false;
		}
	};

	mThis.size = function() {
		if(mOptions.source==null) {
			return -1;
		}
		else {
			return mOptions.source.length;
		}
	};

	mThis.empty = function() {
		if(!mLock) {
			mLock = true;
			empty();
			mDataRowRefs.clear();
			mOptions.source.splice(0, mOptions.source.length);
			mLock = false;
		}
	};

	/**
	 * loadingMsg
	 * set's loading message defined in loading template
	 *
	 */
	mThis.loadingMsg = function() {
		if(!mLock) {
			mLock = true;
			empty();
			$m.html(mOptions.loadingTemplateHtml);
			mLock = false;
		}
	};

	if(mOptions.source!=null && mOptions.source.length>0) {
		mThis.source(mOptions.source);
	}
	if(mOptions.selected!=null) {
		mThis.select(mOptions.selected);
	}
};

$.fn.listGuidget = function(options) {
	return this.each(function(){
		$.setGuidget($(this), new wguidget.ListGuidget($(this), options));
	});
};
})(jQuery, window);