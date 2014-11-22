/**
 * 
 * 
 * @author Sampsa Sohlman
 */

(function(w){
	if(!w.jsopresenter) {
		var toString = Object.prototype.toString;
		var isArray = function(jso) {
			return toString.call(jso) === "[object Array]";			
		};
		var isObject = function(jso) {
			return toString.call(jso) === "[object Object]";
		};
		
		var isNumber = function(jso) {
			return typeof jso === "number";			
		};
		
		var isString = function(jso) {
			return typeof jso === "string";
		};
		var isUndefined = function(jso) {
			return typeof object == "undefined";
		};
		
		var isBoolean = function(jso) {
			return jso===true || jso===false;
		}
		
		var isDate = function(jso) {
			return false;			
		};
		
		var TMPL = {
			OBJECT : "<fieldset><legend><b>{name}</b></legend>{value}</fieldset>",
			ARRAY : "<fieldset><legend>array: <b>{name}</b></legend>{value}</fieldset>",
			TEXT : "<fieldset><legend>string: <b>{name}</b></legend>\"{value}\"</fieldset>",		
			NUMBER : "<fieldset><legend>number: <b>{name}</b></legend>{value}</fieldset>",
			DATE : "<fieldset><legend>date: <b>{name}</b></legend>{value}</fieldset>",			
			BOOLEAN : "<fieldset><legend>boolean: <b>{name}</b></legend>{value}</fieldset>",			
		};

				
		var toTemplate = function(name, value, template) {
			var out = template.replace(new RegExp("[{]name[}]","g"), name);
			if(value===undefined) {
				value = "&lt;undefined&gt;";
			}
			else if(value===null) {
				value = "&lt;null&gt;";
			}
			return out.replace(new RegExp("[{]value[}]","g"), value);
		};			
		
		
						
		var processObject = function(jso){
			var out = "";
			for(var fieldName in jso ) {
				out += objectToTemplate(fieldName, jso[fieldName]);
			}
			return out;
		};
		
		var processArray = function(array) {
			var out = "";
			for( var i=0 ; i<array.length ; i++ ) {
				out += objectToTemplate("[" + i + "]", array[i]);							
			}				
			return out;
		};		
		
		var objectToTemplate = function(fieldName, field) {
			if(isArray(field)) {
				return toTemplate(fieldName, processArray(field), TMPL.ARRAY);
			}
			else if(isObject(field)) {
				return toTemplate(fieldName, processObject(field), TMPL.OBJECT);
			}
			else if(isNumber(field)) {
				return toTemplate(fieldName, processNumber(field), TMPL.NUMBER);					
			}
			else if(isDate(field)) {
				return toTemplate(fieldName, processDate(field), TMPL.TEXT);										
			}	
			else if(isBoolean(field)) {
				return toTemplate(fieldName, processBoolean(field), TMPL.BOOLEAN);
			}
			else if(isString(field)) {
				return toTemplate(fieldName, processText(field), TMPL.TEXT);										
			}
			else if(field==null) {
				return toTemplate(fieldName, "&lt;null&gt;" , TMPL.OBJECT);
			}
			else if(isUndefined(field)) {
				return toTemplate(fieldName, "&lt;undefined&gt;", TMPL.OBJECT);
			}			
			else {
				return "";
			}
		};


		var processNumber = function(number) {
			return number + "";
		};

		var processDate = function(date) {
			return date + "";
		};
		
		var processBoolean = function(value) {
			return "" + value;
		};		
		
		var processText = function(text) {
			if(text) {
				text = text + "";
				text =  text.replace(new RegExp("[&]","g"), "&amp;");				
				text =  text.replace(new RegExp("[<]","g"), "&lt;");
				return  text.replace(new RegExp("[<]","g"), "&gt;");				
			}
			return text;
		};

		w.jsopresenter = {		
			toString: function(jso){
				if(isArray(jso)) {
					return processArray(jso);
				}
				else if(isObject(jso)) {
					return processObject(jso);
				}
				else if(isNumber(jso)) {
					return processNumber(jso);
				}
				else if(isDate(jso)) {
					return processDate(jso);										
				}				
				else {
					return processText(jso);
				}
			}
		};
	}
})(window);
