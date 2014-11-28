/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3);
	window.Models =  __webpack_require__ (2);

	// 1. create local Host
	var id = Math.round(Math.random() * 10000) + "";
	var swarmHost = new Swarm.Host(id);

	// 2. connect to your server
	//
	swarmHost.connect('ws://codewhale.in:8181/');

	function rid() {
	  return  Math.round(Math.random() * 10000) + "";
	}

	function time() {
	  return Math.round(new Date().getTime() / 1000);
	}

	window.h = swarmHost;

	var users = swarmHost.get("/Users#all");
	var messages = swarmHost.get("/Messages#all");

	window.ChatApi = {
	  getUsers: function() {
	    return users;
	  },

	  getMessages: function() {
	    return messages;
	  },

	  getUser: function(id) {
	    return swarmHost.get("/User#" + id);
	  },

	  getMessage: function(id) {
	    return swarmHost.get("/Message#" + id);
	  },

	  createUser: function(name) {
	    var id = rid();

	    var user = new Models.User(id);
	    user.set({ name: name, time: time() });
	    users.addObject(user);
	    return user;
	  },

	  createMessage: function(text, time, user) {
	    var id = rid();
	    var message = new Models.Message(id);
	    message.set({ text: text, time: time, user: user._id });
	    messages.addObject(message);
	    return message;
	  },

	  activeUser: function(user) {
	    user.set({ time: time() });
	  },

	  removeUser: function(user) {
	    this.getUsers().removeObject(user);
	  },

	  onUsersChange: function(cb) {
	    this.getUsers().on(cb);
	  },

	  onUserChange: function(id, cb) {
	    this.getUser(id).on(cb);
	  },

	  onMessagesChange: function(cb) {
	    this.getMessages().on(cb);
	  },

	  onMessageChange: function(id, cb) {
	    this.getMessage(id).on(cb);
	  }
	};

	setInterval(function(){
	  var t = time();
	  window.ChatApi.getUsers().forEach(function(u) {
	    var diff = t - u.time;
	    if (diff > 60) {
	      console.log("Removing user " + u.name + " diff " + diff);
	      //window.ChatApi.removeUser(u);
	    }
	  });
	}, 5 * 60 * 1000);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Swarm = __webpack_require__(4);

	var User = Swarm.Model.extend('User', {
	    defaults: {
	        name: 'Mickey',
	        time: 0,
	    }
	});

	var Users = Swarm.Set.extend('Users', {
	  objectType: User
	});

	var Message = Swarm.Model.extend('Message', {
	    defaults: {
	        text: 'Mickey',
	        user: "",
	        time: ""
	    }
	});

	var Messages = Swarm.Set.extend('Messages', {
	  objectType: Message
	});


	var models = {
	  User: User,
	  Users: Users,
	  Message: Message,
	  Messages: Message
	};

	module.exports = models;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash -o ./dist/lodash.compat.js`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	;(function() {

	  /** Used as a safe reference for `undefined` in pre ES5 environments */
	  var undefined;

	  /** Used to pool arrays and objects used internally */
	  var arrayPool = [],
	      objectPool = [];

	  /** Used to generate unique IDs */
	  var idCounter = 0;

	  /** Used internally to indicate various things */
	  var indicatorObject = {};

	  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
	  var keyPrefix = +new Date + '';

	  /** Used as the size when optimizations are enabled for large arrays */
	  var largeArraySize = 75;

	  /** Used as the max size of the `arrayPool` and `objectPool` */
	  var maxPoolSize = 40;

	  /** Used to detect and test whitespace */
	  var whitespace = (
	    // whitespace
	    ' \t\x0B\f\xA0\ufeff' +

	    // line terminators
	    '\n\r\u2028\u2029' +

	    // unicode category "Zs" space separators
	    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
	  );

	  /** Used to match empty string literals in compiled template source */
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

	  /**
	   * Used to match ES6 template delimiters
	   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
	   */
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

	  /** Used to match regexp flags from their coerced string values */
	  var reFlags = /\w*$/;

	  /** Used to detected named functions */
	  var reFuncName = /^\s*function[ \n\r\t]+\w/;

	  /** Used to match "interpolate" template delimiters */
	  var reInterpolate = /<%=([\s\S]+?)%>/g;

	  /** Used to match leading whitespace and zeros to be removed */
	  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

	  /** Used to ensure capturing order of template delimiters */
	  var reNoMatch = /($^)/;

	  /** Used to detect functions containing a `this` reference */
	  var reThis = /\bthis\b/;

	  /** Used to match unescaped characters in compiled string literals */
	  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

	  /** Used to assign default `context` object properties */
	  var contextProps = [
	    'Array', 'Boolean', 'Date', 'Error', 'Function', 'Math', 'Number', 'Object',
	    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
	    'parseInt', 'setTimeout'
	  ];

	  /** Used to fix the JScript [[DontEnum]] bug */
	  var shadowedProps = [
	    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
	    'toLocaleString', 'toString', 'valueOf'
	  ];

	  /** Used to make template sourceURLs easier to identify */
	  var templateCounter = 0;

	  /** `Object#toString` result shortcuts */
	  var argsClass = '[object Arguments]',
	      arrayClass = '[object Array]',
	      boolClass = '[object Boolean]',
	      dateClass = '[object Date]',
	      errorClass = '[object Error]',
	      funcClass = '[object Function]',
	      numberClass = '[object Number]',
	      objectClass = '[object Object]',
	      regexpClass = '[object RegExp]',
	      stringClass = '[object String]';

	  /** Used to identify object classifications that `_.clone` supports */
	  var cloneableClasses = {};
	  cloneableClasses[funcClass] = false;
	  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
	  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
	  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
	  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

	  /** Used as an internal `_.debounce` options object */
	  var debounceOptions = {
	    'leading': false,
	    'maxWait': 0,
	    'trailing': false
	  };

	  /** Used as the property descriptor for `__bindData__` */
	  var descriptor = {
	    'configurable': false,
	    'enumerable': false,
	    'value': null,
	    'writable': false
	  };

	  /** Used as the data object for `iteratorTemplate` */
	  var iteratorData = {
	    'args': '',
	    'array': null,
	    'bottom': '',
	    'firstArg': '',
	    'init': '',
	    'keys': null,
	    'loop': '',
	    'shadowedProps': null,
	    'support': null,
	    'top': '',
	    'useHas': false
	  };

	  /** Used to determine if values are of the language type Object */
	  var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	  };

	  /** Used to escape characters for inclusion in compiled string literals */
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\t': 't',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  /** Used as a reference to the global object */
	  var root = (objectTypes[typeof window] && window) || this;

	  /** Detect free variable `exports` */
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  /** Detect free variable `module` */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect the popular CommonJS extension `module.exports` */
	  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
	  var freeGlobal = objectTypes[typeof global] && global;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * The base implementation of `_.indexOf` without support for binary searches
	   * or `fromIndex` constraints.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} [fromIndex=0] The index to search from.
	   * @returns {number} Returns the index of the matched value or `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    var index = (fromIndex || 0) - 1,
	        length = array ? array.length : 0;

	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * An implementation of `_.contains` for cache objects that mimics the return
	   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
	   *
	   * @private
	   * @param {Object} cache The cache object to inspect.
	   * @param {*} value The value to search for.
	   * @returns {number} Returns `0` if `value` is found, else `-1`.
	   */
	  function cacheIndexOf(cache, value) {
	    var type = typeof value;
	    cache = cache.cache;

	    if (type == 'boolean' || value == null) {
	      return cache[value] ? 0 : -1;
	    }
	    if (type != 'number' && type != 'string') {
	      type = 'object';
	    }
	    var key = type == 'number' ? value : keyPrefix + value;
	    cache = (cache = cache[type]) && cache[key];

	    return type == 'object'
	      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
	      : (cache ? 0 : -1);
	  }

	  /**
	   * Adds a given value to the corresponding cache object.
	   *
	   * @private
	   * @param {*} value The value to add to the cache.
	   */
	  function cachePush(value) {
	    var cache = this.cache,
	        type = typeof value;

	    if (type == 'boolean' || value == null) {
	      cache[value] = true;
	    } else {
	      if (type != 'number' && type != 'string') {
	        type = 'object';
	      }
	      var key = type == 'number' ? value : keyPrefix + value,
	          typeCache = cache[type] || (cache[type] = {});

	      if (type == 'object') {
	        (typeCache[key] || (typeCache[key] = [])).push(value);
	      } else {
	        typeCache[key] = true;
	      }
	    }
	  }

	  /**
	   * Used by `_.max` and `_.min` as the default callback when a given
	   * collection is a string value.
	   *
	   * @private
	   * @param {string} value The character to inspect.
	   * @returns {number} Returns the code unit of given character.
	   */
	  function charAtCallback(value) {
	    return value.charCodeAt(0);
	  }

	  /**
	   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
	   * them in ascending order.
	   *
	   * @private
	   * @param {Object} a The object to compare to `b`.
	   * @param {Object} b The object to compare to `a`.
	   * @returns {number} Returns the sort order indicator of `1` or `-1`.
	   */
	  function compareAscending(a, b) {
	    var ac = a.criteria,
	        bc = b.criteria,
	        index = -1,
	        length = ac.length;

	    while (++index < length) {
	      var value = ac[index],
	          other = bc[index];

	      if (value !== other) {
	        if (value > other || typeof value == 'undefined') {
	          return 1;
	        }
	        if (value < other || typeof other == 'undefined') {
	          return -1;
	        }
	      }
	    }
	    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	    // that causes it, under certain circumstances, to return the same value for
	    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
	    //
	    // This also ensures a stable sort in V8 and other engines.
	    // See http://code.google.com/p/v8/issues/detail?id=90
	    return a.index - b.index;
	  }

	  /**
	   * Creates a cache object to optimize linear searches of large arrays.
	   *
	   * @private
	   * @param {Array} [array=[]] The array to search.
	   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
	   */
	  function createCache(array) {
	    var index = -1,
	        length = array.length,
	        first = array[0],
	        mid = array[(length / 2) | 0],
	        last = array[length - 1];

	    if (first && typeof first == 'object' &&
	        mid && typeof mid == 'object' && last && typeof last == 'object') {
	      return false;
	    }
	    var cache = getObject();
	    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

	    var result = getObject();
	    result.array = array;
	    result.cache = cache;
	    result.push = cachePush;

	    while (++index < length) {
	      result.push(array[index]);
	    }
	    return result;
	  }

	  /**
	   * Used by `template` to escape characters for inclusion in compiled
	   * string literals.
	   *
	   * @private
	   * @param {string} match The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeStringChar(match) {
	    return '\\' + stringEscapes[match];
	  }

	  /**
	   * Gets an array from the array pool or creates a new one if the pool is empty.
	   *
	   * @private
	   * @returns {Array} The array from the pool.
	   */
	  function getArray() {
	    return arrayPool.pop() || [];
	  }

	  /**
	   * Gets an object from the object pool or creates a new one if the pool is empty.
	   *
	   * @private
	   * @returns {Object} The object from the pool.
	   */
	  function getObject() {
	    return objectPool.pop() || {
	      'array': null,
	      'cache': null,
	      'criteria': null,
	      'false': false,
	      'index': 0,
	      'null': false,
	      'number': null,
	      'object': null,
	      'push': null,
	      'string': null,
	      'true': false,
	      'undefined': false,
	      'value': null
	    };
	  }

	  /**
	   * Checks if `value` is a DOM node in IE < 9.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if the `value` is a DOM node, else `false`.
	   */
	  function isNode(value) {
	    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
	    // methods that are `typeof` "string" and still can coerce nodes to strings
	    return typeof value.toString != 'function' && typeof (value + '') == 'string';
	  }

	  /**
	   * Releases the given array back to the array pool.
	   *
	   * @private
	   * @param {Array} [array] The array to release.
	   */
	  function releaseArray(array) {
	    array.length = 0;
	    if (arrayPool.length < maxPoolSize) {
	      arrayPool.push(array);
	    }
	  }

	  /**
	   * Releases the given object back to the object pool.
	   *
	   * @private
	   * @param {Object} [object] The object to release.
	   */
	  function releaseObject(object) {
	    var cache = object.cache;
	    if (cache) {
	      releaseObject(cache);
	    }
	    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
	    if (objectPool.length < maxPoolSize) {
	      objectPool.push(object);
	    }
	  }

	  /**
	   * Slices the `collection` from the `start` index up to, but not including,
	   * the `end` index.
	   *
	   * Note: This function is used instead of `Array#slice` to support node lists
	   * in IE < 9 and to ensure dense arrays are returned.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to slice.
	   * @param {number} start The start index.
	   * @param {number} end The end index.
	   * @returns {Array} Returns the new array.
	   */
	  function slice(array, start, end) {
	    start || (start = 0);
	    if (typeof end == 'undefined') {
	      end = array ? array.length : 0;
	    }
	    var index = -1,
	        length = end - start || 0,
	        result = Array(length < 0 ? 0 : length);

	    while (++index < length) {
	      result[index] = array[start + index];
	    }
	    return result;
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Create a new `lodash` function using the given context object.
	   *
	   * @static
	   * @memberOf _
	   * @category Utilities
	   * @param {Object} [context=root] The context object.
	   * @returns {Function} Returns the `lodash` function.
	   */
	  function runInContext(context) {
	    // Avoid issues with some ES3 environments that attempt to use values, named
	    // after built-in constructors like `Object`, for the creation of literals.
	    // ES5 clears this up by stating that literals must use built-in constructors.
	    // See http://es5.github.io/#x11.1.5.
	    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

	    /** Native constructor references */
	    var Array = context.Array,
	        Boolean = context.Boolean,
	        Date = context.Date,
	        Error = context.Error,
	        Function = context.Function,
	        Math = context.Math,
	        Number = context.Number,
	        Object = context.Object,
	        RegExp = context.RegExp,
	        String = context.String,
	        TypeError = context.TypeError;

	    /**
	     * Used for `Array` method references.
	     *
	     * Normally `Array.prototype` would suffice, however, using an array literal
	     * avoids issues in Narwhal.
	     */
	    var arrayRef = [];

	    /** Used for native method references */
	    var errorProto = Error.prototype,
	        objectProto = Object.prototype,
	        stringProto = String.prototype;

	    /** Used to restore the original `_` reference in `noConflict` */
	    var oldDash = context._;

	    /** Used to resolve the internal [[Class]] of values */
	    var toString = objectProto.toString;

	    /** Used to detect if a method is native */
	    var reNative = RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );

	    /** Native method shortcuts */
	    var ceil = Math.ceil,
	        clearTimeout = context.clearTimeout,
	        floor = Math.floor,
	        fnToString = Function.prototype.toString,
	        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
	        hasOwnProperty = objectProto.hasOwnProperty,
	        push = arrayRef.push,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        setTimeout = context.setTimeout,
	        splice = arrayRef.splice,
	        unshift = arrayRef.unshift;

	    /** Used to set meta data on functions */
	    var defineProperty = (function() {
	      // IE 8 only accepts DOM elements
	      try {
	        var o = {},
	            func = isNative(func = Object.defineProperty) && func,
	            result = func(o, o, o) && func;
	      } catch(e) { }
	      return result;
	    }());

	    /* Native method shortcuts for methods with the same name as other `lodash` methods */
	    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
	        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
	        nativeIsFinite = context.isFinite,
	        nativeIsNaN = context.isNaN,
	        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random;

	    /** Used to lookup a built-in constructor by [[Class]] */
	    var ctorByClass = {};
	    ctorByClass[arrayClass] = Array;
	    ctorByClass[boolClass] = Boolean;
	    ctorByClass[dateClass] = Date;
	    ctorByClass[funcClass] = Function;
	    ctorByClass[objectClass] = Object;
	    ctorByClass[numberClass] = Number;
	    ctorByClass[regexpClass] = RegExp;
	    ctorByClass[stringClass] = String;

	    /** Used to avoid iterating non-enumerable properties in IE < 9 */
	    var nonEnumProps = {};
	    nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	    nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
	    nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
	    nonEnumProps[objectClass] = { 'constructor': true };

	    (function() {
	      var length = shadowedProps.length;
	      while (length--) {
	        var key = shadowedProps[length];
	        for (var className in nonEnumProps) {
	          if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)) {
	            nonEnumProps[className][key] = false;
	          }
	        }
	      }
	    }());

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object which wraps the given value to enable intuitive
	     * method chaining.
	     *
	     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
	     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
	     * and `unshift`
	     *
	     * Chaining is supported in custom builds as long as the `value` method is
	     * implicitly or explicitly included in the build.
	     *
	     * The chainable wrapper functions are:
	     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
	     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
	     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
	     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
	     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
	     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
	     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
	     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
	     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
	     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
	     * and `zip`
	     *
	     * The non-chainable wrapper functions are:
	     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
	     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
	     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
	     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
	     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
	     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
	     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
	     * `template`, `unescape`, `uniqueId`, and `value`
	     *
	     * The wrapper functions `first` and `last` return wrapped values when `n` is
	     * provided, otherwise they return unwrapped values.
	     *
	     * Explicit chaining can be enabled by using the `_.chain` method.
	     *
	     * @name _
	     * @constructor
	     * @category Chaining
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @returns {Object} Returns a `lodash` instance.
	     * @example
	     *
	     * var wrapped = _([1, 2, 3]);
	     *
	     * // returns an unwrapped value
	     * wrapped.reduce(function(sum, num) {
	     *   return sum + num;
	     * });
	     * // => 6
	     *
	     * // returns a wrapped value
	     * var squares = wrapped.map(function(num) {
	     *   return num * num;
	     * });
	     *
	     * _.isArray(squares);
	     * // => false
	     *
	     * _.isArray(squares.value());
	     * // => true
	     */
	    function lodash(value) {
	      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
	      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
	       ? value
	       : new lodashWrapper(value);
	    }

	    /**
	     * A fast path for creating `lodash` wrapper objects.
	     *
	     * @private
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @param {boolean} chainAll A flag to enable chaining for all methods
	     * @returns {Object} Returns a `lodash` instance.
	     */
	    function lodashWrapper(value, chainAll) {
	      this.__chain__ = !!chainAll;
	      this.__wrapped__ = value;
	    }
	    // ensure `new lodashWrapper` is an instance of `lodash`
	    lodashWrapper.prototype = lodash.prototype;

	    /**
	     * An object used to flag environments features.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    var support = lodash.support = {};

	    (function() {
	      var ctor = function() { this.x = 1; },
	          object = { '0': 1, 'length': 1 },
	          props = [];

	      ctor.prototype = { 'valueOf': 1, 'y': 1 };
	      for (var key in new ctor) { props.push(key); }
	      for (key in arguments) { }

	      /**
	       * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.argsClass = toString.call(arguments) == argsClass;

	      /**
	       * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);

	      /**
	       * Detect if `name` or `message` properties of `Error.prototype` are
	       * enumerable by default. (IE < 9, Safari < 5.1)
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

	      /**
	       * Detect if `prototype` properties are enumerable by default.
	       *
	       * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
	       * (if the prototype or a property on the prototype has been set)
	       * incorrectly sets a function's `prototype` property [[Enumerable]]
	       * value to `true`.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

	      /**
	       * Detect if functions can be decompiled by `Function#toString`
	       * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

	      /**
	       * Detect if `Function#name` is supported (all but IE).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcNames = typeof Function.name == 'string';

	      /**
	       * Detect if `arguments` object indexes are non-enumerable
	       * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.nonEnumArgs = key != 0;

	      /**
	       * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	       *
	       * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
	       * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.nonEnumShadows = !/valueOf/.test(props);

	      /**
	       * Detect if own properties are iterated after inherited properties (all but IE < 9).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.ownLast = props[0] != 'x';

	      /**
	       * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
	       *
	       * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
	       * and `splice()` functions that fail to remove the last element, `value[0]`,
	       * of array-like objects even though the `length` property is set to `0`.
	       * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
	       * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);

	      /**
	       * Detect lack of support for accessing string characters by index.
	       *
	       * IE < 8 can't access characters by index and IE 8 can only access
	       * characters by index on string literals.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

	      /**
	       * Detect if a DOM node's [[Class]] is resolvable (all but IE < 9)
	       * and that the JS engine errors when attempting to coerce an object to
	       * a string without a `toString` function.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      try {
	        support.nodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
	      } catch(e) {
	        support.nodeClass = true;
	      }
	    }(1));

	    /**
	     * By default, the template delimiters used by Lo-Dash are similar to those in
	     * embedded Ruby (ERB). Change the following template settings to use alternative
	     * delimiters.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    lodash.templateSettings = {

	      /**
	       * Used to detect `data` property values to be HTML-escaped.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'escape': /<%-([\s\S]+?)%>/g,

	      /**
	       * Used to detect code to be evaluated.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'evaluate': /<%([\s\S]+?)%>/g,

	      /**
	       * Used to detect `data` property values to inject.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'interpolate': reInterpolate,

	      /**
	       * Used to reference the data object in the template text.
	       *
	       * @memberOf _.templateSettings
	       * @type string
	       */
	      'variable': '',

	      /**
	       * Used to import variables into the compiled template.
	       *
	       * @memberOf _.templateSettings
	       * @type Object
	       */
	      'imports': {

	        /**
	         * A reference to the `lodash` function.
	         *
	         * @memberOf _.templateSettings.imports
	         * @type Function
	         */
	        '_': lodash
	      }
	    };

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The template used to create iterator functions.
	     *
	     * @private
	     * @param {Object} data The data object used to populate the text.
	     * @returns {string} Returns the interpolated text.
	     */
	    var iteratorTemplate = function(obj) {

	      var __p = 'var index, iterable = ' +
	      (obj.firstArg) +
	      ', result = ' +
	      (obj.init) +
	      ';\nif (!iterable) return result;\n' +
	      (obj.top) +
	      ';';
	       if (obj.array) {
	      __p += '\nvar length = iterable.length; index = -1;\nif (' +
	      (obj.array) +
	      ') {  ';
	       if (support.unindexedChars) {
	      __p += '\n  if (isString(iterable)) {\n    iterable = iterable.split(\'\')\n  }  ';
	       }
	      __p += '\n  while (++index < length) {\n    ' +
	      (obj.loop) +
	      ';\n  }\n}\nelse {  ';
	       } else if (support.nonEnumArgs) {
	      __p += '\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
	      (obj.loop) +
	      ';\n    }\n  } else {  ';
	       }

	       if (support.enumPrototypes) {
	      __p += '\n  var skipProto = typeof iterable == \'function\';\n  ';
	       }

	       if (support.enumErrorProps) {
	      __p += '\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ';
	       }

	          var conditions = [];    if (support.enumPrototypes) { conditions.push('!(skipProto && index == "prototype")'); }    if (support.enumErrorProps)  { conditions.push('!(skipErrorProps && (index == "message" || index == "name"))'); }

	       if (obj.useHas && obj.keys) {
	      __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n';
	          if (conditions.length) {
	      __p += '    if (' +
	      (conditions.join(' && ')) +
	      ') {\n  ';
	       }
	      __p +=
	      (obj.loop) +
	      ';    ';
	       if (conditions.length) {
	      __p += '\n    }';
	       }
	      __p += '\n  }  ';
	       } else {
	      __p += '\n  for (index in iterable) {\n';
	          if (obj.useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }    if (conditions.length) {
	      __p += '    if (' +
	      (conditions.join(' && ')) +
	      ') {\n  ';
	       }
	      __p +=
	      (obj.loop) +
	      ';    ';
	       if (conditions.length) {
	      __p += '\n    }';
	       }
	      __p += '\n  }    ';
	       if (support.nonEnumShadows) {
	      __p += '\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ';
	       for (k = 0; k < 7; k++) {
	      __p += '\n    index = \'' +
	      (obj.shadowedProps[k]) +
	      '\';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))';
	              if (!obj.useHas) {
	      __p += ' || (!nonEnum[index] && iterable[index] !== objectProto[index])';
	       }
	      __p += ') {\n      ' +
	      (obj.loop) +
	      ';\n    }      ';
	       }
	      __p += '\n  }    ';
	       }

	       }

	       if (obj.array || support.nonEnumArgs) {
	      __p += '\n}';
	       }
	      __p +=
	      (obj.bottom) +
	      ';\nreturn result';

	      return __p
	    };

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The base implementation of `_.bind` that creates the bound function and
	     * sets its meta data.
	     *
	     * @private
	     * @param {Array} bindData The bind data array.
	     * @returns {Function} Returns the new bound function.
	     */
	    function baseBind(bindData) {
	      var func = bindData[0],
	          partialArgs = bindData[2],
	          thisArg = bindData[4];

	      function bound() {
	        // `Function#bind` spec
	        // http://es5.github.io/#x15.3.4.5
	        if (partialArgs) {
	          // avoid `arguments` object deoptimizations by using `slice` instead
	          // of `Array.prototype.slice.call` and not assigning `arguments` to a
	          // variable as a ternary expression
	          var args = slice(partialArgs);
	          push.apply(args, arguments);
	        }
	        // mimic the constructor's `return` behavior
	        // http://es5.github.io/#x13.2.2
	        if (this instanceof bound) {
	          // ensure `new bound` is an instance of `func`
	          var thisBinding = baseCreate(func.prototype),
	              result = func.apply(thisBinding, args || arguments);
	          return isObject(result) ? result : thisBinding;
	        }
	        return func.apply(thisArg, args || arguments);
	      }
	      setBindData(bound, bindData);
	      return bound;
	    }

	    /**
	     * The base implementation of `_.clone` without argument juggling or support
	     * for `thisArg` binding.
	     *
	     * @private
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep=false] Specify a deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates clones with source counterparts.
	     * @returns {*} Returns the cloned value.
	     */
	    function baseClone(value, isDeep, callback, stackA, stackB) {
	      if (callback) {
	        var result = callback(value);
	        if (typeof result != 'undefined') {
	          return result;
	        }
	      }
	      // inspect [[Class]]
	      var isObj = isObject(value);
	      if (isObj) {
	        var className = toString.call(value);
	        if (!cloneableClasses[className] || (!support.nodeClass && isNode(value))) {
	          return value;
	        }
	        var ctor = ctorByClass[className];
	        switch (className) {
	          case boolClass:
	          case dateClass:
	            return new ctor(+value);

	          case numberClass:
	          case stringClass:
	            return new ctor(value);

	          case regexpClass:
	            result = ctor(value.source, reFlags.exec(value));
	            result.lastIndex = value.lastIndex;
	            return result;
	        }
	      } else {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isDeep) {
	        // check for circular references and return corresponding clone
	        var initedStack = !stackA;
	        stackA || (stackA = getArray());
	        stackB || (stackB = getArray());

	        var length = stackA.length;
	        while (length--) {
	          if (stackA[length] == value) {
	            return stackB[length];
	          }
	        }
	        result = isArr ? ctor(value.length) : {};
	      }
	      else {
	        result = isArr ? slice(value) : assign({}, value);
	      }
	      // add array properties assigned by `RegExp#exec`
	      if (isArr) {
	        if (hasOwnProperty.call(value, 'index')) {
	          result.index = value.index;
	        }
	        if (hasOwnProperty.call(value, 'input')) {
	          result.input = value.input;
	        }
	      }
	      // exit for shallow clone
	      if (!isDeep) {
	        return result;
	      }
	      // add the source value to the stack of traversed objects
	      // and associate it with its clone
	      stackA.push(value);
	      stackB.push(result);

	      // recursively populate clone (susceptible to call stack limits)
	      (isArr ? baseEach : forOwn)(value, function(objValue, key) {
	        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
	      });

	      if (initedStack) {
	        releaseArray(stackA);
	        releaseArray(stackB);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.create` without support for assigning
	     * properties to the created object.
	     *
	     * @private
	     * @param {Object} prototype The object to inherit from.
	     * @returns {Object} Returns the new object.
	     */
	    function baseCreate(prototype, properties) {
	      return isObject(prototype) ? nativeCreate(prototype) : {};
	    }
	    // fallback for browsers without `Object.create`
	    if (!nativeCreate) {
	      baseCreate = (function() {
	        function Object() {}
	        return function(prototype) {
	          if (isObject(prototype)) {
	            Object.prototype = prototype;
	            var result = new Object;
	            Object.prototype = null;
	          }
	          return result || context.Object();
	        };
	      }());
	    }

	    /**
	     * The base implementation of `_.createCallback` without support for creating
	     * "_.pluck" or "_.where" style callbacks.
	     *
	     * @private
	     * @param {*} [func=identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of the created callback.
	     * @param {number} [argCount] The number of arguments the callback accepts.
	     * @returns {Function} Returns a callback function.
	     */
	    function baseCreateCallback(func, thisArg, argCount) {
	      if (typeof func != 'function') {
	        return identity;
	      }
	      // exit early for no `thisArg` or already bound by `Function#bind`
	      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
	        return func;
	      }
	      var bindData = func.__bindData__;
	      if (typeof bindData == 'undefined') {
	        if (support.funcNames) {
	          bindData = !func.name;
	        }
	        bindData = bindData || !support.funcDecomp;
	        if (!bindData) {
	          var source = fnToString.call(func);
	          if (!support.funcNames) {
	            bindData = !reFuncName.test(source);
	          }
	          if (!bindData) {
	            // checks if `func` references the `this` keyword and stores the result
	            bindData = reThis.test(source);
	            setBindData(func, bindData);
	          }
	        }
	      }
	      // exit early if there are no `this` references or `func` is bound
	      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
	        return func;
	      }
	      switch (argCount) {
	        case 1: return function(value) {
	          return func.call(thisArg, value);
	        };
	        case 2: return function(a, b) {
	          return func.call(thisArg, a, b);
	        };
	        case 3: return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	        case 4: return function(accumulator, value, index, collection) {
	          return func.call(thisArg, accumulator, value, index, collection);
	        };
	      }
	      return bind(func, thisArg);
	    }

	    /**
	     * The base implementation of `createWrapper` that creates the wrapper and
	     * sets its meta data.
	     *
	     * @private
	     * @param {Array} bindData The bind data array.
	     * @returns {Function} Returns the new function.
	     */
	    function baseCreateWrapper(bindData) {
	      var func = bindData[0],
	          bitmask = bindData[1],
	          partialArgs = bindData[2],
	          partialRightArgs = bindData[3],
	          thisArg = bindData[4],
	          arity = bindData[5];

	      var isBind = bitmask & 1,
	          isBindKey = bitmask & 2,
	          isCurry = bitmask & 4,
	          isCurryBound = bitmask & 8,
	          key = func;

	      function bound() {
	        var thisBinding = isBind ? thisArg : this;
	        if (partialArgs) {
	          var args = slice(partialArgs);
	          push.apply(args, arguments);
	        }
	        if (partialRightArgs || isCurry) {
	          args || (args = slice(arguments));
	          if (partialRightArgs) {
	            push.apply(args, partialRightArgs);
	          }
	          if (isCurry && args.length < arity) {
	            bitmask |= 16 & ~32;
	            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
	          }
	        }
	        args || (args = arguments);
	        if (isBindKey) {
	          func = thisBinding[key];
	        }
	        if (this instanceof bound) {
	          thisBinding = baseCreate(func.prototype);
	          var result = func.apply(thisBinding, args);
	          return isObject(result) ? result : thisBinding;
	        }
	        return func.apply(thisBinding, args);
	      }
	      setBindData(bound, bindData);
	      return bound;
	    }

	    /**
	     * The base implementation of `_.difference` that accepts a single array
	     * of values to exclude.
	     *
	     * @private
	     * @param {Array} array The array to process.
	     * @param {Array} [values] The array of values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     */
	    function baseDifference(array, values) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array ? array.length : 0,
	          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
	          result = [];

	      if (isLarge) {
	        var cache = createCache(values);
	        if (cache) {
	          indexOf = cacheIndexOf;
	          values = cache;
	        } else {
	          isLarge = false;
	        }
	      }
	      while (++index < length) {
	        var value = array[index];
	        if (indexOf(values, value) < 0) {
	          result.push(value);
	        }
	      }
	      if (isLarge) {
	        releaseObject(values);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.flatten` without support for callback
	     * shorthands or `thisArg` binding.
	     *
	     * @private
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
	     * @param {number} [fromIndex=0] The index to start from.
	     * @returns {Array} Returns a new flattened array.
	     */
	    function baseFlatten(array, isShallow, isStrict, fromIndex) {
	      var index = (fromIndex || 0) - 1,
	          length = array ? array.length : 0,
	          result = [];

	      while (++index < length) {
	        var value = array[index];

	        if (value && typeof value == 'object' && typeof value.length == 'number'
	            && (isArray(value) || isArguments(value))) {
	          // recursively flatten arrays (susceptible to call stack limits)
	          if (!isShallow) {
	            value = baseFlatten(value, isShallow, isStrict);
	          }
	          var valIndex = -1,
	              valLength = value.length,
	              resIndex = result.length;

	          result.length += valLength;
	          while (++valIndex < valLength) {
	            result[resIndex++] = value[valIndex];
	          }
	        } else if (!isStrict) {
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
	     * that allows partial "_.where" style comparisons.
	     *
	     * @private
	     * @param {*} a The value to compare.
	     * @param {*} b The other value to compare.
	     * @param {Function} [callback] The function to customize comparing values.
	     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
	     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
	     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     */
	    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
	      // used to indicate that when comparing objects, `a` has at least the properties of `b`
	      if (callback) {
	        var result = callback(a, b);
	        if (typeof result != 'undefined') {
	          return !!result;
	        }
	      }
	      // exit early for identical values
	      if (a === b) {
	        // treat `+0` vs. `-0` as not equal
	        return a !== 0 || (1 / a == 1 / b);
	      }
	      var type = typeof a,
	          otherType = typeof b;

	      // exit early for unlike primitive values
	      if (a === a &&
	          !(a && objectTypes[type]) &&
	          !(b && objectTypes[otherType])) {
	        return false;
	      }
	      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
	      // http://es5.github.io/#x15.3.4.4
	      if (a == null || b == null) {
	        return a === b;
	      }
	      // compare [[Class]] names
	      var className = toString.call(a),
	          otherClass = toString.call(b);

	      if (className == argsClass) {
	        className = objectClass;
	      }
	      if (otherClass == argsClass) {
	        otherClass = objectClass;
	      }
	      if (className != otherClass) {
	        return false;
	      }
	      switch (className) {
	        case boolClass:
	        case dateClass:
	          // coerce dates and booleans to numbers, dates to milliseconds and booleans
	          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
	          return +a == +b;

	        case numberClass:
	          // treat `NaN` vs. `NaN` as equal
	          return (a != +a)
	            ? b != +b
	            // but treat `+0` vs. `-0` as not equal
	            : (a == 0 ? (1 / a == 1 / b) : a == +b);

	        case regexpClass:
	        case stringClass:
	          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
	          // treat string primitives and their corresponding object instances as equal
	          return a == String(b);
	      }
	      var isArr = className == arrayClass;
	      if (!isArr) {
	        // unwrap any `lodash` wrapped values
	        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
	            bWrapped = hasOwnProperty.call(b, '__wrapped__');

	        if (aWrapped || bWrapped) {
	          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
	        }
	        // exit for functions and DOM nodes
	        if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
	          return false;
	        }
	        // in older versions of Opera, `arguments` objects have `Array` constructors
	        var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
	            ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

	        // non `Object` object instances with different constructors are not equal
	        if (ctorA != ctorB &&
	              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
	              ('constructor' in a && 'constructor' in b)
	            ) {
	          return false;
	        }
	      }
	      // assume cyclic structures are equal
	      // the algorithm for detecting cyclic structures is adapted from ES 5.1
	      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
	      var initedStack = !stackA;
	      stackA || (stackA = getArray());
	      stackB || (stackB = getArray());

	      var length = stackA.length;
	      while (length--) {
	        if (stackA[length] == a) {
	          return stackB[length] == b;
	        }
	      }
	      var size = 0;
	      result = true;

	      // add `a` and `b` to the stack of traversed objects
	      stackA.push(a);
	      stackB.push(b);

	      // recursively compare objects and arrays (susceptible to call stack limits)
	      if (isArr) {
	        // compare lengths to determine if a deep comparison is necessary
	        length = a.length;
	        size = b.length;
	        result = size == length;

	        if (result || isWhere) {
	          // deep compare the contents, ignoring non-numeric properties
	          while (size--) {
	            var index = length,
	                value = b[size];

	            if (isWhere) {
	              while (index--) {
	                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
	                  break;
	                }
	              }
	            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
	              break;
	            }
	          }
	        }
	      }
	      else {
	        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
	        // which, in this case, is more costly
	        forIn(b, function(value, key, b) {
	          if (hasOwnProperty.call(b, key)) {
	            // count the number of properties.
	            size++;
	            // deep compare each property value.
	            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
	          }
	        });

	        if (result && !isWhere) {
	          // ensure both objects have the same number of properties
	          forIn(a, function(value, key, a) {
	            if (hasOwnProperty.call(a, key)) {
	              // `size` will be `-1` if `a` has more properties than `b`
	              return (result = --size > -1);
	            }
	          });
	        }
	      }
	      stackA.pop();
	      stackB.pop();

	      if (initedStack) {
	        releaseArray(stackA);
	        releaseArray(stackB);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.merge` without argument juggling or support
	     * for `thisArg` binding.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {Function} [callback] The function to customize merging properties.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates values with source counterparts.
	     */
	    function baseMerge(object, source, callback, stackA, stackB) {
	      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
	        var found,
	            isArr,
	            result = source,
	            value = object[key];

	        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
	          // avoid merging previously merged cyclic sources
	          var stackLength = stackA.length;
	          while (stackLength--) {
	            if ((found = stackA[stackLength] == source)) {
	              value = stackB[stackLength];
	              break;
	            }
	          }
	          if (!found) {
	            var isShallow;
	            if (callback) {
	              result = callback(value, source);
	              if ((isShallow = typeof result != 'undefined')) {
	                value = result;
	              }
	            }
	            if (!isShallow) {
	              value = isArr
	                ? (isArray(value) ? value : [])
	                : (isPlainObject(value) ? value : {});
	            }
	            // add `source` and associated `value` to the stack of traversed objects
	            stackA.push(source);
	            stackB.push(value);

	            // recursively merge objects and arrays (susceptible to call stack limits)
	            if (!isShallow) {
	              baseMerge(value, source, callback, stackA, stackB);
	            }
	          }
	        }
	        else {
	          if (callback) {
	            result = callback(value, source);
	            if (typeof result == 'undefined') {
	              result = source;
	            }
	          }
	          if (typeof result != 'undefined') {
	            value = result;
	          }
	        }
	        object[key] = value;
	      });
	    }

	    /**
	     * The base implementation of `_.random` without argument juggling or support
	     * for returning floating-point numbers.
	     *
	     * @private
	     * @param {number} min The minimum possible value.
	     * @param {number} max The maximum possible value.
	     * @returns {number} Returns a random number.
	     */
	    function baseRandom(min, max) {
	      return min + floor(nativeRandom() * (max - min + 1));
	    }

	    /**
	     * The base implementation of `_.uniq` without support for callback shorthands
	     * or `thisArg` binding.
	     *
	     * @private
	     * @param {Array} array The array to process.
	     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	     * @param {Function} [callback] The function called per iteration.
	     * @returns {Array} Returns a duplicate-value-free array.
	     */
	    function baseUniq(array, isSorted, callback) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array ? array.length : 0,
	          result = [];

	      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
	          seen = (callback || isLarge) ? getArray() : result;

	      if (isLarge) {
	        var cache = createCache(seen);
	        indexOf = cacheIndexOf;
	        seen = cache;
	      }
	      while (++index < length) {
	        var value = array[index],
	            computed = callback ? callback(value, index, array) : value;

	        if (isSorted
	              ? !index || seen[seen.length - 1] !== computed
	              : indexOf(seen, computed) < 0
	            ) {
	          if (callback || isLarge) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      if (isLarge) {
	        releaseArray(seen.array);
	        releaseObject(seen);
	      } else if (callback) {
	        releaseArray(seen);
	      }
	      return result;
	    }

	    /**
	     * Creates a function that aggregates a collection, creating an object composed
	     * of keys generated from the results of running each element of the collection
	     * through a callback. The given `setter` function sets the keys and values
	     * of the composed object.
	     *
	     * @private
	     * @param {Function} setter The setter function.
	     * @returns {Function} Returns the new aggregator function.
	     */
	    function createAggregator(setter) {
	      return function(collection, callback, thisArg) {
	        var result = {};
	        callback = lodash.createCallback(callback, thisArg, 3);

	        if (isArray(collection)) {
	          var index = -1,
	              length = collection.length;

	          while (++index < length) {
	            var value = collection[index];
	            setter(result, value, callback(value, index, collection), collection);
	          }
	        } else {
	          baseEach(collection, function(value, key, collection) {
	            setter(result, value, callback(value, key, collection), collection);
	          });
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates a function that, when called, either curries or invokes `func`
	     * with an optional `this` binding and partially applied arguments.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to reference.
	     * @param {number} bitmask The bitmask of method flags to compose.
	     *  The bitmask may be composed of the following flags:
	     *  1 - `_.bind`
	     *  2 - `_.bindKey`
	     *  4 - `_.curry`
	     *  8 - `_.curry` (bound)
	     *  16 - `_.partial`
	     *  32 - `_.partialRight`
	     * @param {Array} [partialArgs] An array of arguments to prepend to those
	     *  provided to the new function.
	     * @param {Array} [partialRightArgs] An array of arguments to append to those
	     *  provided to the new function.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new function.
	     */
	    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
	      var isBind = bitmask & 1,
	          isBindKey = bitmask & 2,
	          isCurry = bitmask & 4,
	          isCurryBound = bitmask & 8,
	          isPartial = bitmask & 16,
	          isPartialRight = bitmask & 32;

	      if (!isBindKey && !isFunction(func)) {
	        throw new TypeError;
	      }
	      if (isPartial && !partialArgs.length) {
	        bitmask &= ~16;
	        isPartial = partialArgs = false;
	      }
	      if (isPartialRight && !partialRightArgs.length) {
	        bitmask &= ~32;
	        isPartialRight = partialRightArgs = false;
	      }
	      var bindData = func && func.__bindData__;
	      if (bindData && bindData !== true) {
	        // clone `bindData`
	        bindData = slice(bindData);
	        if (bindData[2]) {
	          bindData[2] = slice(bindData[2]);
	        }
	        if (bindData[3]) {
	          bindData[3] = slice(bindData[3]);
	        }
	        // set `thisBinding` is not previously bound
	        if (isBind && !(bindData[1] & 1)) {
	          bindData[4] = thisArg;
	        }
	        // set if previously bound but not currently (subsequent curried functions)
	        if (!isBind && bindData[1] & 1) {
	          bitmask |= 8;
	        }
	        // set curried arity if not yet set
	        if (isCurry && !(bindData[1] & 4)) {
	          bindData[5] = arity;
	        }
	        // append partial left arguments
	        if (isPartial) {
	          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
	        }
	        // append partial right arguments
	        if (isPartialRight) {
	          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
	        }
	        // merge flags
	        bindData[1] |= bitmask;
	        return createWrapper.apply(null, bindData);
	      }
	      // fast path for `_.bind`
	      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
	      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
	    }

	    /**
	     * Creates compiled iteration functions.
	     *
	     * @private
	     * @param {...Object} [options] The compile options object(s).
	     * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
	     * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
	     * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
	     * @param {string} [options.args] A comma separated string of iteration function arguments.
	     * @param {string} [options.top] Code to execute before the iteration branches.
	     * @param {string} [options.loop] Code to execute in the object loop.
	     * @param {string} [options.bottom] Code to execute after the iteration branches.
	     * @returns {Function} Returns the compiled function.
	     */
	    function createIterator() {
	      // data properties
	      iteratorData.shadowedProps = shadowedProps;

	      // iterator options
	      iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
	      iteratorData.init = 'iterable';
	      iteratorData.useHas = true;

	      // merge options into a template data object
	      for (var object, index = 0; object = arguments[index]; index++) {
	        for (var key in object) {
	          iteratorData[key] = object[key];
	        }
	      }
	      var args = iteratorData.args;
	      iteratorData.firstArg = /^[^,]+/.exec(args)[0];

	      // create the function factory
	      var factory = Function(
	          'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
	          'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
	          'objectTypes, nonEnumProps, stringClass, stringProto, toString',
	        'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
	      );

	      // return the compiled function
	      return factory(
	        baseCreateCallback, errorClass, errorProto, hasOwnProperty,
	        indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
	        objectTypes, nonEnumProps, stringClass, stringProto, toString
	      );
	    }

	    /**
	     * Used by `escape` to convert characters to HTML entities.
	     *
	     * @private
	     * @param {string} match The matched character to escape.
	     * @returns {string} Returns the escaped character.
	     */
	    function escapeHtmlChar(match) {
	      return htmlEscapes[match];
	    }

	    /**
	     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
	     * customized, this method returns the custom method, otherwise it returns
	     * the `baseIndexOf` function.
	     *
	     * @private
	     * @returns {Function} Returns the "indexOf" function.
	     */
	    function getIndexOf() {
	      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
	      return result;
	    }

	    /**
	     * Checks if `value` is a native function.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
	     */
	    function isNative(value) {
	      return typeof value == 'function' && reNative.test(value);
	    }

	    /**
	     * Sets `this` binding data on a given function.
	     *
	     * @private
	     * @param {Function} func The function to set data on.
	     * @param {Array} value The data array to set.
	     */
	    var setBindData = !defineProperty ? noop : function(func, value) {
	      descriptor.value = value;
	      defineProperty(func, '__bindData__', descriptor);
	    };

	    /**
	     * A fallback implementation of `isPlainObject` which checks if a given value
	     * is an object created by the `Object` constructor, assuming objects created
	     * by the `Object` constructor have no inherited enumerable properties and that
	     * there are no `Object.prototype` extensions.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     */
	    function shimIsPlainObject(value) {
	      var ctor,
	          result;

	      // avoid non Object objects, `arguments` objects, and DOM elements
	      if (!(value && toString.call(value) == objectClass) ||
	          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)) ||
	          (!support.argsClass && isArguments(value)) ||
	          (!support.nodeClass && isNode(value))) {
	        return false;
	      }
	      // IE < 9 iterates inherited properties before own properties. If the first
	      // iterated property is an object's own property then there are no inherited
	      // enumerable properties.
	      if (support.ownLast) {
	        forIn(value, function(value, key, object) {
	          result = hasOwnProperty.call(object, key);
	          return false;
	        });
	        return result !== false;
	      }
	      // In most environments an object's own properties are iterated before
	      // its inherited properties. If the last iterated property is an object's
	      // own property then there are no inherited enumerable properties.
	      forIn(value, function(value, key) {
	        result = key;
	      });
	      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
	    }

	    /**
	     * Used by `unescape` to convert HTML entities to characters.
	     *
	     * @private
	     * @param {string} match The matched character to unescape.
	     * @returns {string} Returns the unescaped character.
	     */
	    function unescapeHtmlChar(match) {
	      return htmlUnescapes[match];
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Checks if `value` is an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
	     * @example
	     *
	     * (function() { return _.isArguments(arguments); })(1, 2, 3);
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      return value && typeof value == 'object' && typeof value.length == 'number' &&
	        toString.call(value) == argsClass || false;
	    }
	    // fallback for browsers that can't detect `arguments` objects by [[Class]]
	    if (!support.argsClass) {
	      isArguments = function(value) {
	        return value && typeof value == 'object' && typeof value.length == 'number' &&
	          hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
	      };
	    }

	    /**
	     * Checks if `value` is an array.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
	     * @example
	     *
	     * (function() { return _.isArray(arguments); })();
	     * // => false
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     */
	    var isArray = nativeIsArray || function(value) {
	      return value && typeof value == 'object' && typeof value.length == 'number' &&
	        toString.call(value) == arrayClass || false;
	    };

	    /**
	     * A fallback implementation of `Object.keys` which produces an array of the
	     * given object's own enumerable property names.
	     *
	     * @private
	     * @type Function
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names.
	     */
	    var shimKeys = createIterator({
	      'args': 'object',
	      'init': '[]',
	      'top': 'if (!(objectTypes[typeof object])) return result',
	      'loop': 'result.push(index)'
	    });

	    /**
	     * Creates an array composed of the own enumerable property names of an object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names.
	     * @example
	     *
	     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
	     */
	    var keys = !nativeKeys ? shimKeys : function(object) {
	      if (!isObject(object)) {
	        return [];
	      }
	      if ((support.enumPrototypes && typeof object == 'function') ||
	          (support.nonEnumArgs && object.length && isArguments(object))) {
	        return shimKeys(object);
	      }
	      return nativeKeys(object);
	    };

	    /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
	    var eachIteratorOptions = {
	      'args': 'collection, callback, thisArg',
	      'top': "callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)",
	      'array': "typeof length == 'number'",
	      'keys': keys,
	      'loop': 'if (callback(iterable[index], index, collection) === false) return result'
	    };

	    /** Reusable iterator options for `assign` and `defaults` */
	    var defaultsIteratorOptions = {
	      'args': 'object, source, guard',
	      'top':
	        'var args = arguments,\n' +
	        '    argsIndex = 0,\n' +
	        "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" +
	        'while (++argsIndex < argsLength) {\n' +
	        '  iterable = args[argsIndex];\n' +
	        '  if (iterable && objectTypes[typeof iterable]) {',
	      'keys': keys,
	      'loop': "if (typeof result[index] == 'undefined') result[index] = iterable[index]",
	      'bottom': '  }\n}'
	    };

	    /** Reusable iterator options for `forIn` and `forOwn` */
	    var forOwnIteratorOptions = {
	      'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
	      'array': false
	    };

	    /**
	     * Used to convert characters to HTML entities:
	     *
	     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
	     * don't require escaping in HTML and have no special meaning unless they're part
	     * of a tag or an unquoted attribute value.
	     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
	     */
	    var htmlEscapes = {
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;',
	      '"': '&quot;',
	      "'": '&#39;'
	    };

	    /** Used to convert HTML entities to characters */
	    var htmlUnescapes = invert(htmlEscapes);

	    /** Used to match HTML entities and HTML characters */
	    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
	        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

	    /**
	     * A function compiled to iterate `arguments` objects, arrays, objects, and
	     * strings consistenly across environments, executing the callback for each
	     * element in the collection. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index|key, collection). Callbacks may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @private
	     * @type Function
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     */
	    var baseEach = createIterator(eachIteratorOptions);

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object. Subsequent sources will overwrite property assignments of previous
	     * sources. If a callback is provided it will be executed to produce the
	     * assigned values. The callback is bound to `thisArg` and invoked with two
	     * arguments; (objectValue, sourceValue).
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @alias extend
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param {Function} [callback] The function to customize assigning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
	     * // => { 'name': 'fred', 'employer': 'slate' }
	     *
	     * var defaults = _.partialRight(_.assign, function(a, b) {
	     *   return typeof a == 'undefined' ? b : a;
	     * });
	     *
	     * var object = { 'name': 'barney' };
	     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
	     * // => { 'name': 'barney', 'employer': 'slate' }
	     */
	    var assign = createIterator(defaultsIteratorOptions, {
	      'top':
	        defaultsIteratorOptions.top.replace(';',
	          ';\n' +
	          "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" +
	          '  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n' +
	          "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" +
	          '  callback = args[--argsLength];\n' +
	          '}'
	        ),
	      'loop': 'result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]'
	    });

	    /**
	     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
	     * be cloned, otherwise they will be assigned by reference. If a callback
	     * is provided it will be executed to produce the cloned values. If the
	     * callback returns `undefined` cloning will be handled by the method instead.
	     * The callback is bound to `thisArg` and invoked with one argument; (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep=false] Specify a deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * var shallow = _.clone(characters);
	     * shallow[0] === characters[0];
	     * // => true
	     *
	     * var deep = _.clone(characters, true);
	     * deep[0] === characters[0];
	     * // => false
	     *
	     * _.mixin({
	     *   'clone': _.partialRight(_.clone, function(value) {
	     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
	     *   })
	     * });
	     *
	     * var clone = _.clone(document.body);
	     * clone.childNodes.length;
	     * // => 0
	     */
	    function clone(value, isDeep, callback, thisArg) {
	      // allows working with "Collections" methods without using their `index`
	      // and `collection` arguments for `isDeep` and `callback`
	      if (typeof isDeep != 'boolean' && isDeep != null) {
	        thisArg = callback;
	        callback = isDeep;
	        isDeep = false;
	      }
	      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
	    }

	    /**
	     * Creates a deep clone of `value`. If a callback is provided it will be
	     * executed to produce the cloned values. If the callback returns `undefined`
	     * cloning will be handled by the method instead. The callback is bound to
	     * `thisArg` and invoked with one argument; (value).
	     *
	     * Note: This method is loosely based on the structured clone algorithm. Functions
	     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
	     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
	     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * var deep = _.cloneDeep(characters);
	     * deep[0] === characters[0];
	     * // => false
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'node': element
	     * };
	     *
	     * var clone = _.cloneDeep(view, function(value) {
	     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
	     * });
	     *
	     * clone.node == view.node;
	     * // => false
	     */
	    function cloneDeep(value, callback, thisArg) {
	      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
	    }

	    /**
	     * Creates an object that inherits from the given `prototype` object. If a
	     * `properties` object is provided its own enumerable properties are assigned
	     * to the created object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} prototype The object to inherit from.
	     * @param {Object} [properties] The properties to assign to the object.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * function Circle() {
	     *   Shape.call(this);
	     * }
	     *
	     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
	     *
	     * var circle = new Circle;
	     * circle instanceof Circle;
	     * // => true
	     *
	     * circle instanceof Shape;
	     * // => true
	     */
	    function create(prototype, properties) {
	      var result = baseCreate(prototype);
	      return properties ? assign(result, properties) : result;
	    }

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object for all destination properties that resolve to `undefined`. Once a
	     * property is set, additional defaults of the same property will be ignored.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param- {Object} [guard] Allows working with `_.reduce` without using its
	     *  `key` and `object` arguments as sources.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * var object = { 'name': 'barney' };
	     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
	     * // => { 'name': 'barney', 'employer': 'slate' }
	     */
	    var defaults = createIterator(defaultsIteratorOptions);

	    /**
	     * This method is like `_.findIndex` except that it returns the key of the
	     * first element that passes the callback check, instead of the element itself.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [callback=identity] The function called per
	     *  iteration. If a property name or object is provided it will be used to
	     *  create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
	     * @example
	     *
	     * var characters = {
	     *   'barney': {  'age': 36, 'blocked': false },
	     *   'fred': {    'age': 40, 'blocked': true },
	     *   'pebbles': { 'age': 1,  'blocked': false }
	     * };
	     *
	     * _.findKey(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => 'barney' (property order is not guaranteed across environments)
	     *
	     * // using "_.where" callback shorthand
	     * _.findKey(characters, { 'age': 1 });
	     * // => 'pebbles'
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findKey(characters, 'blocked');
	     * // => 'fred'
	     */
	    function findKey(object, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forOwn(object, function(value, key, object) {
	        if (callback(value, key, object)) {
	          result = key;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * This method is like `_.findKey` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [callback=identity] The function called per
	     *  iteration. If a property name or object is provided it will be used to
	     *  create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
	     * @example
	     *
	     * var characters = {
	     *   'barney': {  'age': 36, 'blocked': true },
	     *   'fred': {    'age': 40, 'blocked': false },
	     *   'pebbles': { 'age': 1,  'blocked': true }
	     * };
	     *
	     * _.findLastKey(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
	     *
	     * // using "_.where" callback shorthand
	     * _.findLastKey(characters, { 'age': 40 });
	     * // => 'fred'
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findLastKey(characters, 'blocked');
	     * // => 'pebbles'
	     */
	    function findLastKey(object, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forOwnRight(object, function(value, key, object) {
	        if (callback(value, key, object)) {
	          result = key;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * Iterates over own and inherited enumerable properties of an object,
	     * executing the callback for each property. The callback is bound to `thisArg`
	     * and invoked with three arguments; (value, key, object). Callbacks may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * Shape.prototype.move = function(x, y) {
	     *   this.x += x;
	     *   this.y += y;
	     * };
	     *
	     * _.forIn(new Shape, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
	     */
	    var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
	      'useHas': false
	    });

	    /**
	     * This method is like `_.forIn` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * Shape.prototype.move = function(x, y) {
	     *   this.x += x;
	     *   this.y += y;
	     * };
	     *
	     * _.forInRight(new Shape, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
	     */
	    function forInRight(object, callback, thisArg) {
	      var pairs = [];

	      forIn(object, function(value, key) {
	        pairs.push(key, value);
	      });

	      var length = pairs.length;
	      callback = baseCreateCallback(callback, thisArg, 3);
	      while (length--) {
	        if (callback(pairs[length--], pairs[length], object) === false) {
	          break;
	        }
	      }
	      return object;
	    }

	    /**
	     * Iterates over own enumerable properties of an object, executing the callback
	     * for each property. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, key, object). Callbacks may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
	     *   console.log(key);
	     * });
	     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
	     */
	    var forOwn = createIterator(eachIteratorOptions, forOwnIteratorOptions);

	    /**
	     * This method is like `_.forOwn` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
	     */
	    function forOwnRight(object, callback, thisArg) {
	      var props = keys(object),
	          length = props.length;

	      callback = baseCreateCallback(callback, thisArg, 3);
	      while (length--) {
	        var key = props[length];
	        if (callback(object[key], key, object) === false) {
	          break;
	        }
	      }
	      return object;
	    }

	    /**
	     * Creates a sorted array of property names of all enumerable properties,
	     * own and inherited, of `object` that have function values.
	     *
	     * @static
	     * @memberOf _
	     * @alias methods
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names that have function values.
	     * @example
	     *
	     * _.functions(_);
	     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
	     */
	    function functions(object) {
	      var result = [];
	      forIn(object, function(value, key) {
	        if (isFunction(value)) {
	          result.push(key);
	        }
	      });
	      return result.sort();
	    }

	    /**
	     * Checks if the specified property name exists as a direct property of `object`,
	     * instead of an inherited property.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @param {string} key The name of the property to check.
	     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
	     * @example
	     *
	     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
	     * // => true
	     */
	    function has(object, key) {
	      return object ? hasOwnProperty.call(object, key) : false;
	    }

	    /**
	     * Creates an object composed of the inverted keys and values of the given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to invert.
	     * @returns {Object} Returns the created inverted object.
	     * @example
	     *
	     * _.invert({ 'first': 'fred', 'second': 'barney' });
	     * // => { 'fred': 'first', 'barney': 'second' }
	     */
	    function invert(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = {};

	      while (++index < length) {
	        var key = props[index];
	        result[object[key]] = key;
	      }
	      return result;
	    }

	    /**
	     * Checks if `value` is a boolean value.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
	     * @example
	     *
	     * _.isBoolean(null);
	     * // => false
	     */
	    function isBoolean(value) {
	      return value === true || value === false ||
	        value && typeof value == 'object' && toString.call(value) == boolClass || false;
	    }

	    /**
	     * Checks if `value` is a date.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
	     * @example
	     *
	     * _.isDate(new Date);
	     * // => true
	     */
	    function isDate(value) {
	      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
	    }

	    /**
	     * Checks if `value` is a DOM element.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
	     * @example
	     *
	     * _.isElement(document.body);
	     * // => true
	     */
	    function isElement(value) {
	      return value && value.nodeType === 1 || false;
	    }

	    /**
	     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
	     * length of `0` and objects with no own enumerable properties are considered
	     * "empty".
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Array|Object|string} value The value to inspect.
	     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
	     * @example
	     *
	     * _.isEmpty([1, 2, 3]);
	     * // => false
	     *
	     * _.isEmpty({});
	     * // => true
	     *
	     * _.isEmpty('');
	     * // => true
	     */
	    function isEmpty(value) {
	      var result = true;
	      if (!value) {
	        return result;
	      }
	      var className = toString.call(value),
	          length = value.length;

	      if ((className == arrayClass || className == stringClass ||
	          (support.argsClass ? className == argsClass : isArguments(value))) ||
	          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
	        return !length;
	      }
	      forOwn(value, function() {
	        return (result = false);
	      });
	      return result;
	    }

	    /**
	     * Performs a deep comparison between two values to determine if they are
	     * equivalent to each other. If a callback is provided it will be executed
	     * to compare values. If the callback returns `undefined` comparisons will
	     * be handled by the method instead. The callback is bound to `thisArg` and
	     * invoked with two arguments; (a, b).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} a The value to compare.
	     * @param {*} b The other value to compare.
	     * @param {Function} [callback] The function to customize comparing values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * var copy = { 'name': 'fred' };
	     *
	     * object == copy;
	     * // => false
	     *
	     * _.isEqual(object, copy);
	     * // => true
	     *
	     * var words = ['hello', 'goodbye'];
	     * var otherWords = ['hi', 'goodbye'];
	     *
	     * _.isEqual(words, otherWords, function(a, b) {
	     *   var reGreet = /^(?:hello|hi)$/i,
	     *       aGreet = _.isString(a) && reGreet.test(a),
	     *       bGreet = _.isString(b) && reGreet.test(b);
	     *
	     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
	     * });
	     * // => true
	     */
	    function isEqual(a, b, callback, thisArg) {
	      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
	    }

	    /**
	     * Checks if `value` is, or can be coerced to, a finite number.
	     *
	     * Note: This is not the same as native `isFinite` which will return true for
	     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
	     * @example
	     *
	     * _.isFinite(-101);
	     * // => true
	     *
	     * _.isFinite('10');
	     * // => true
	     *
	     * _.isFinite(true);
	     * // => false
	     *
	     * _.isFinite('');
	     * // => false
	     *
	     * _.isFinite(Infinity);
	     * // => false
	     */
	    function isFinite(value) {
	      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
	    }

	    /**
	     * Checks if `value` is a function.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     */
	    function isFunction(value) {
	      return typeof value == 'function';
	    }
	    // fallback for older versions of Chrome and Safari
	    if (isFunction(/x/)) {
	      isFunction = function(value) {
	        return typeof value == 'function' && toString.call(value) == funcClass;
	      };
	    }

	    /**
	     * Checks if `value` is the language type of Object.
	     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(1);
	     * // => false
	     */
	    function isObject(value) {
	      // check if the value is the ECMAScript language type of Object
	      // http://es5.github.io/#x8
	      // and avoid a V8 bug
	      // http://code.google.com/p/v8/issues/detail?id=2291
	      return !!(value && objectTypes[typeof value]);
	    }

	    /**
	     * Checks if `value` is `NaN`.
	     *
	     * Note: This is not the same as native `isNaN` which will return `true` for
	     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
	     * @example
	     *
	     * _.isNaN(NaN);
	     * // => true
	     *
	     * _.isNaN(new Number(NaN));
	     * // => true
	     *
	     * isNaN(undefined);
	     * // => true
	     *
	     * _.isNaN(undefined);
	     * // => false
	     */
	    function isNaN(value) {
	      // `NaN` as a primitive is the only value that is not equal to itself
	      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
	      return isNumber(value) && value != +value;
	    }

	    /**
	     * Checks if `value` is `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
	     * @example
	     *
	     * _.isNull(null);
	     * // => true
	     *
	     * _.isNull(undefined);
	     * // => false
	     */
	    function isNull(value) {
	      return value === null;
	    }

	    /**
	     * Checks if `value` is a number.
	     *
	     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
	     * @example
	     *
	     * _.isNumber(8.4 * 5);
	     * // => true
	     */
	    function isNumber(value) {
	      return typeof value == 'number' ||
	        value && typeof value == 'object' && toString.call(value) == numberClass || false;
	    }

	    /**
	     * Checks if `value` is an object created by the `Object` constructor.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * _.isPlainObject(new Shape);
	     * // => false
	     *
	     * _.isPlainObject([1, 2, 3]);
	     * // => false
	     *
	     * _.isPlainObject({ 'x': 0, 'y': 0 });
	     * // => true
	     */
	    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
	      if (!(value && toString.call(value) == objectClass) || (!support.argsClass && isArguments(value))) {
	        return false;
	      }
	      var valueOf = value.valueOf,
	          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

	      return objProto
	        ? (value == objProto || getPrototypeOf(value) == objProto)
	        : shimIsPlainObject(value);
	    };

	    /**
	     * Checks if `value` is a regular expression.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
	     * @example
	     *
	     * _.isRegExp(/fred/);
	     * // => true
	     */
	    function isRegExp(value) {
	      return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;
	    }

	    /**
	     * Checks if `value` is a string.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
	     * @example
	     *
	     * _.isString('fred');
	     * // => true
	     */
	    function isString(value) {
	      return typeof value == 'string' ||
	        value && typeof value == 'object' && toString.call(value) == stringClass || false;
	    }

	    /**
	     * Checks if `value` is `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
	     * @example
	     *
	     * _.isUndefined(void 0);
	     * // => true
	     */
	    function isUndefined(value) {
	      return typeof value == 'undefined';
	    }

	    /**
	     * Creates an object with the same keys as `object` and values generated by
	     * running each own enumerable property of `object` through the callback.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
	     * @example
	     *
	     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     *
	     * var characters = {
	     *   'fred': { 'name': 'fred', 'age': 40 },
	     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.mapValues(characters, 'age');
	     * // => { 'fred': 40, 'pebbles': 1 }
	     */
	    function mapValues(object, callback, thisArg) {
	      var result = {};
	      callback = lodash.createCallback(callback, thisArg, 3);

	      forOwn(object, function(value, key, object) {
	        result[key] = callback(value, key, object);
	      });
	      return result;
	    }

	    /**
	     * Recursively merges own enumerable properties of the source object(s), that
	     * don't resolve to `undefined` into the destination object. Subsequent sources
	     * will overwrite property assignments of previous sources. If a callback is
	     * provided it will be executed to produce the merged values of the destination
	     * and source properties. If the callback returns `undefined` merging will
	     * be handled by the method instead. The callback is bound to `thisArg` and
	     * invoked with two arguments; (objectValue, sourceValue).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param {Function} [callback] The function to customize merging properties.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * var names = {
	     *   'characters': [
	     *     { 'name': 'barney' },
	     *     { 'name': 'fred' }
	     *   ]
	     * };
	     *
	     * var ages = {
	     *   'characters': [
	     *     { 'age': 36 },
	     *     { 'age': 40 }
	     *   ]
	     * };
	     *
	     * _.merge(names, ages);
	     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
	     *
	     * var food = {
	     *   'fruits': ['apple'],
	     *   'vegetables': ['beet']
	     * };
	     *
	     * var otherFood = {
	     *   'fruits': ['banana'],
	     *   'vegetables': ['carrot']
	     * };
	     *
	     * _.merge(food, otherFood, function(a, b) {
	     *   return _.isArray(a) ? a.concat(b) : undefined;
	     * });
	     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
	     */
	    function merge(object) {
	      var args = arguments,
	          length = 2;

	      if (!isObject(object)) {
	        return object;
	      }
	      // allows working with `_.reduce` and `_.reduceRight` without using
	      // their `index` and `collection` arguments
	      if (typeof args[2] != 'number') {
	        length = args.length;
	      }
	      if (length > 3 && typeof args[length - 2] == 'function') {
	        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
	      } else if (length > 2 && typeof args[length - 1] == 'function') {
	        callback = args[--length];
	      }
	      var sources = slice(arguments, 1, length),
	          index = -1,
	          stackA = getArray(),
	          stackB = getArray();

	      while (++index < length) {
	        baseMerge(object, sources[index], callback, stackA, stackB);
	      }
	      releaseArray(stackA);
	      releaseArray(stackB);
	      return object;
	    }

	    /**
	     * Creates a shallow clone of `object` excluding the specified properties.
	     * Property names may be specified as individual arguments or as arrays of
	     * property names. If a callback is provided it will be executed for each
	     * property of `object` omitting the properties the callback returns truey
	     * for. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The source object.
	     * @param {Function|...string|string[]} [callback] The properties to omit or the
	     *  function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns an object without the omitted properties.
	     * @example
	     *
	     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
	     * // => { 'name': 'fred' }
	     *
	     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
	     *   return typeof value == 'number';
	     * });
	     * // => { 'name': 'fred' }
	     */
	    function omit(object, callback, thisArg) {
	      var result = {};
	      if (typeof callback != 'function') {
	        var props = [];
	        forIn(object, function(value, key) {
	          props.push(key);
	        });
	        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

	        var index = -1,
	            length = props.length;

	        while (++index < length) {
	          var key = props[index];
	          result[key] = object[key];
	        }
	      } else {
	        callback = lodash.createCallback(callback, thisArg, 3);
	        forIn(object, function(value, key, object) {
	          if (!callback(value, key, object)) {
	            result[key] = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Creates a two dimensional array of an object's key-value pairs,
	     * i.e. `[[key1, value1], [key2, value2]]`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns new array of key-value pairs.
	     * @example
	     *
	     * _.pairs({ 'barney': 36, 'fred': 40 });
	     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
	     */
	    function pairs(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        var key = props[index];
	        result[index] = [key, object[key]];
	      }
	      return result;
	    }

	    /**
	     * Creates a shallow clone of `object` composed of the specified properties.
	     * Property names may be specified as individual arguments or as arrays of
	     * property names. If a callback is provided it will be executed for each
	     * property of `object` picking the properties the callback returns truey
	     * for. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The source object.
	     * @param {Function|...string|string[]} [callback] The function called per
	     *  iteration or property names to pick, specified as individual property
	     *  names or arrays of property names.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns an object composed of the picked properties.
	     * @example
	     *
	     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
	     * // => { 'name': 'fred' }
	     *
	     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
	     *   return key.charAt(0) != '_';
	     * });
	     * // => { 'name': 'fred' }
	     */
	    function pick(object, callback, thisArg) {
	      var result = {};
	      if (typeof callback != 'function') {
	        var index = -1,
	            props = baseFlatten(arguments, true, false, 1),
	            length = isObject(object) ? props.length : 0;

	        while (++index < length) {
	          var key = props[index];
	          if (key in object) {
	            result[key] = object[key];
	          }
	        }
	      } else {
	        callback = lodash.createCallback(callback, thisArg, 3);
	        forIn(object, function(value, key, object) {
	          if (callback(value, key, object)) {
	            result[key] = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * An alternative to `_.reduce` this method transforms `object` to a new
	     * `accumulator` object which is the result of running each of its own
	     * enumerable properties through a callback, with each callback execution
	     * potentially mutating the `accumulator` object. The callback is bound to
	     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
	     * Callbacks may exit iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Array|Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] The custom accumulator value.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
	     *   num *= num;
	     *   if (num % 2) {
	     *     return result.push(num) < 3;
	     *   }
	     * });
	     * // => [1, 9, 25]
	     *
	     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
	     *   result[key] = num * 3;
	     * });
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     */
	    function transform(object, callback, accumulator, thisArg) {
	      var isArr = isArray(object);
	      if (accumulator == null) {
	        if (isArr) {
	          accumulator = [];
	        } else {
	          var ctor = object && object.constructor,
	              proto = ctor && ctor.prototype;

	          accumulator = baseCreate(proto);
	        }
	      }
	      if (callback) {
	        callback = lodash.createCallback(callback, thisArg, 4);
	        (isArr ? baseEach : forOwn)(object, function(value, index, object) {
	          return callback(accumulator, value, index, object);
	        });
	      }
	      return accumulator;
	    }

	    /**
	     * Creates an array composed of the own enumerable property values of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property values.
	     * @example
	     *
	     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => [1, 2, 3] (property order is not guaranteed across environments)
	     */
	    function values(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        result[index] = object[props[index]];
	      }
	      return result;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates an array of elements from the specified indexes, or keys, of the
	     * `collection`. Indexes may be specified as individual arguments or as arrays
	     * of indexes.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
	     *   to retrieve, specified as individual indexes or arrays of indexes.
	     * @returns {Array} Returns a new array of elements corresponding to the
	     *  provided indexes.
	     * @example
	     *
	     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
	     * // => ['a', 'c', 'e']
	     *
	     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
	     * // => ['fred', 'pebbles']
	     */
	    function at(collection) {
	      var args = arguments,
	          index = -1,
	          props = baseFlatten(args, true, false, 1),
	          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
	          result = Array(length);

	      if (support.unindexedChars && isString(collection)) {
	        collection = collection.split('');
	      }
	      while(++index < length) {
	        result[index] = collection[props[index]];
	      }
	      return result;
	    }

	    /**
	     * Checks if a given value is present in a collection using strict equality
	     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
	     * offset from the end of the collection.
	     *
	     * @static
	     * @memberOf _
	     * @alias include
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {*} target The value to check for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
	     * @example
	     *
	     * _.contains([1, 2, 3], 1);
	     * // => true
	     *
	     * _.contains([1, 2, 3], 1, 2);
	     * // => false
	     *
	     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
	     * // => true
	     *
	     * _.contains('pebbles', 'eb');
	     * // => true
	     */
	    function contains(collection, target, fromIndex) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = collection ? collection.length : 0,
	          result = false;

	      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
	      if (isArray(collection)) {
	        result = indexOf(collection, target, fromIndex) > -1;
	      } else if (typeof length == 'number') {
	        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
	      } else {
	        baseEach(collection, function(value) {
	          if (++index >= fromIndex) {
	            return !(result = value === target);
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through the callback. The corresponding value
	     * of each key is the number of times the key was returned by the callback.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy(['one', 'two', 'three'], 'length');
	     * // => { '3': 2, '5': 1 }
	     */
	    var countBy = createAggregator(function(result, value, key) {
	      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
	    });

	    /**
	     * Checks if the given callback returns truey value for **all** elements of
	     * a collection. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias all
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if all elements passed the callback check,
	     *  else `false`.
	     * @example
	     *
	     * _.every([true, 1, null, 'yes']);
	     * // => false
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.every(characters, 'age');
	     * // => true
	     *
	     * // using "_.where" callback shorthand
	     * _.every(characters, { 'age': 36 });
	     * // => false
	     */
	    function every(collection, callback, thisArg) {
	      var result = true;
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if (!(result = !!callback(collection[index], index, collection))) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          return (result = !!callback(value, index, collection));
	        });
	      }
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, returning an array of all elements
	     * the callback returns truey for. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias select
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of elements that passed the callback check.
	     * @example
	     *
	     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	     * // => [2, 4, 6]
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.filter(characters, 'blocked');
	     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	     *
	     * // using "_.where" callback shorthand
	     * _.filter(characters, { 'age': 36 });
	     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	     */
	    function filter(collection, callback, thisArg) {
	      var result = [];
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (callback(value, index, collection)) {
	            result.push(value);
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          if (callback(value, index, collection)) {
	            result.push(value);
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, returning the first element that
	     * the callback returns truey for. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias detect, findWhere
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the found element, else `undefined`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': false },
	     *   { 'name': 'fred',    'age': 40, 'blocked': true },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
	     * ];
	     *
	     * _.find(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
	     *
	     * // using "_.where" callback shorthand
	     * _.find(characters, { 'age': 1 });
	     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
	     *
	     * // using "_.pluck" callback shorthand
	     * _.find(characters, 'blocked');
	     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
	     */
	    function find(collection, callback, thisArg) {
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (callback(value, index, collection)) {
	            return value;
	          }
	        }
	      } else {
	        var result;
	        baseEach(collection, function(value, index, collection) {
	          if (callback(value, index, collection)) {
	            result = value;
	            return false;
	          }
	        });
	        return result;
	      }
	    }

	    /**
	     * This method is like `_.find` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the found element, else `undefined`.
	     * @example
	     *
	     * _.findLast([1, 2, 3, 4], function(num) {
	     *   return num % 2 == 1;
	     * });
	     * // => 3
	     */
	    function findLast(collection, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forEachRight(collection, function(value, index, collection) {
	        if (callback(value, index, collection)) {
	          result = value;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, executing the callback for each
	     * element. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection). Callbacks may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * Note: As with other "Collections" methods, objects with a `length` property
	     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	     * may be used for object iteration.
	     *
	     * @static
	     * @memberOf _
	     * @alias each
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
	     * // => logs each number and returns '1,2,3'
	     *
	     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
	     * // => logs each number and returns the object (property order is not guaranteed across environments)
	     */
	    function forEach(collection, callback, thisArg) {
	      if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if (callback(collection[index], index, collection) === false) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, callback, thisArg);
	      }
	      return collection;
	    }

	    /**
	     * This method is like `_.forEach` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias eachRight
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
	     * // => logs each number from right to left and returns '3,2,1'
	     */
	    function forEachRight(collection, callback, thisArg) {
	      var iterable = collection,
	          length = collection ? collection.length : 0;

	      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
	      if (isArray(collection)) {
	        while (length--) {
	          if (callback(collection[length], length, collection) === false) {
	            break;
	          }
	        }
	      } else {
	        if (typeof length != 'number') {
	          var props = keys(collection);
	          length = props.length;
	        } else if (support.unindexedChars && isString(collection)) {
	          iterable = collection.split('');
	        }
	        baseEach(collection, function(value, key, collection) {
	          key = props ? props[--length] : --length;
	          return callback(iterable[key], key, collection);
	        });
	      }
	      return collection;
	    }

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of a collection through the callback. The corresponding value
	     * of each key is an array of the elements responsible for generating the key.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * // using "_.pluck" callback shorthand
	     * _.groupBy(['one', 'two', 'three'], 'length');
	     * // => { '3': ['one', 'two'], '5': ['three'] }
	     */
	    var groupBy = createAggregator(function(result, value, key) {
	      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
	    });

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of the collection through the given callback. The corresponding
	     * value of each key is the last element responsible for generating the key.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * var keys = [
	     *   { 'dir': 'left', 'code': 97 },
	     *   { 'dir': 'right', 'code': 100 }
	     * ];
	     *
	     * _.indexBy(keys, 'dir');
	     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     */
	    var indexBy = createAggregator(function(result, value, key) {
	      result[key] = value;
	    });

	    /**
	     * Invokes the method named by `methodName` on each element in the `collection`
	     * returning an array of the results of each invoked method. Additional arguments
	     * will be provided to each invoked method. If `methodName` is a function it
	     * will be invoked for, and `this` bound to, each element in the `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|string} methodName The name of the method to invoke or
	     *  the function invoked per iteration.
	     * @param {...*} [arg] Arguments to invoke the method with.
	     * @returns {Array} Returns a new array of the results of each invoked method.
	     * @example
	     *
	     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
	     * // => [[1, 5, 7], [1, 2, 3]]
	     *
	     * _.invoke([123, 456], String.prototype.split, '');
	     * // => [['1', '2', '3'], ['4', '5', '6']]
	     */
	    function invoke(collection, methodName) {
	      var args = slice(arguments, 2),
	          index = -1,
	          isFunc = typeof methodName == 'function',
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      forEach(collection, function(value) {
	        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
	      });
	      return result;
	    }

	    /**
	     * Creates an array of values by running each element in the collection
	     * through the callback. The callback is bound to `thisArg` and invoked with
	     * three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias collect
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of the results of each `callback` execution.
	     * @example
	     *
	     * _.map([1, 2, 3], function(num) { return num * 3; });
	     * // => [3, 6, 9]
	     *
	     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
	     * // => [3, 6, 9] (property order is not guaranteed across environments)
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.map(characters, 'name');
	     * // => ['barney', 'fred']
	     */
	    function map(collection, callback, thisArg) {
	      var index = -1,
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      callback = lodash.createCallback(callback, thisArg, 3);
	      if (isArray(collection)) {
	        while (++index < length) {
	          result[index] = callback(collection[index], index, collection);
	        }
	      } else {
	        baseEach(collection, function(value, key, collection) {
	          result[++index] = callback(value, key, collection);
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the maximum value of a collection. If the collection is empty or
	     * falsey `-Infinity` is returned. If a callback is provided it will be executed
	     * for each value in the collection to generate the criterion by which the value
	     * is ranked. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * _.max([4, 2, 8, 6]);
	     * // => 8
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.max(characters, function(chr) { return chr.age; });
	     * // => { 'name': 'fred', 'age': 40 };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.max(characters, 'age');
	     * // => { 'name': 'fred', 'age': 40 };
	     */
	    function max(collection, callback, thisArg) {
	      var computed = -Infinity,
	          result = computed;

	      // allows working with functions like `_.map` without using
	      // their `index` argument as a callback
	      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
	        callback = null;
	      }
	      if (callback == null && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (value > result) {
	            result = value;
	          }
	        }
	      } else {
	        callback = (callback == null && isString(collection))
	          ? charAtCallback
	          : lodash.createCallback(callback, thisArg, 3);

	        baseEach(collection, function(value, index, collection) {
	          var current = callback(value, index, collection);
	          if (current > computed) {
	            computed = current;
	            result = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the minimum value of a collection. If the collection is empty or
	     * falsey `Infinity` is returned. If a callback is provided it will be executed
	     * for each value in the collection to generate the criterion by which the value
	     * is ranked. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * _.min([4, 2, 8, 6]);
	     * // => 2
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.min(characters, function(chr) { return chr.age; });
	     * // => { 'name': 'barney', 'age': 36 };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.min(characters, 'age');
	     * // => { 'name': 'barney', 'age': 36 };
	     */
	    function min(collection, callback, thisArg) {
	      var computed = Infinity,
	          result = computed;

	      // allows working with functions like `_.map` without using
	      // their `index` argument as a callback
	      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
	        callback = null;
	      }
	      if (callback == null && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (value < result) {
	            result = value;
	          }
	        }
	      } else {
	        callback = (callback == null && isString(collection))
	          ? charAtCallback
	          : lodash.createCallback(callback, thisArg, 3);

	        baseEach(collection, function(value, index, collection) {
	          var current = callback(value, index, collection);
	          if (current < computed) {
	            computed = current;
	            result = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the value of a specified property from all elements in the collection.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {string} property The name of the property to pluck.
	     * @returns {Array} Returns a new array of property values.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.pluck(characters, 'name');
	     * // => ['barney', 'fred']
	     */
	    var pluck = map;

	    /**
	     * Reduces a collection to a value which is the accumulated result of running
	     * each element in the collection through the callback, where each successive
	     * callback execution consumes the return value of the previous execution. If
	     * `accumulator` is not provided the first element of the collection will be
	     * used as the initial `accumulator` value. The callback is bound to `thisArg`
	     * and invoked with four arguments; (accumulator, value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @alias foldl, inject
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] Initial value of the accumulator.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var sum = _.reduce([1, 2, 3], function(sum, num) {
	     *   return sum + num;
	     * });
	     * // => 6
	     *
	     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
	     *   result[key] = num * 3;
	     *   return result;
	     * }, {});
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     */
	    function reduce(collection, callback, accumulator, thisArg) {
	      var noaccum = arguments.length < 3;
	      callback = lodash.createCallback(callback, thisArg, 4);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        if (noaccum) {
	          accumulator = collection[++index];
	        }
	        while (++index < length) {
	          accumulator = callback(accumulator, collection[index], index, collection);
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          accumulator = noaccum
	            ? (noaccum = false, value)
	            : callback(accumulator, value, index, collection)
	        });
	      }
	      return accumulator;
	    }

	    /**
	     * This method is like `_.reduce` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias foldr
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] Initial value of the accumulator.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var list = [[0, 1], [2, 3], [4, 5]];
	     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
	     * // => [4, 5, 2, 3, 0, 1]
	     */
	    function reduceRight(collection, callback, accumulator, thisArg) {
	      var noaccum = arguments.length < 3;
	      callback = lodash.createCallback(callback, thisArg, 4);
	      forEachRight(collection, function(value, index, collection) {
	        accumulator = noaccum
	          ? (noaccum = false, value)
	          : callback(accumulator, value, index, collection);
	      });
	      return accumulator;
	    }

	    /**
	     * The opposite of `_.filter` this method returns the elements of a
	     * collection that the callback does **not** return truey for.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of elements that failed the callback check.
	     * @example
	     *
	     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	     * // => [1, 3, 5]
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.reject(characters, 'blocked');
	     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	     *
	     * // using "_.where" callback shorthand
	     * _.reject(characters, { 'age': 36 });
	     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	     */
	    function reject(collection, callback, thisArg) {
	      callback = lodash.createCallback(callback, thisArg, 3);
	      return filter(collection, function(value, index, collection) {
	        return !callback(value, index, collection);
	      });
	    }

	    /**
	     * Retrieves a random element or `n` random elements from a collection.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to sample.
	     * @param {number} [n] The number of elements to sample.
	     * @param- {Object} [guard] Allows working with functions like `_.map`
	     *  without using their `index` arguments as `n`.
	     * @returns {Array} Returns the random sample(s) of `collection`.
	     * @example
	     *
	     * _.sample([1, 2, 3, 4]);
	     * // => 2
	     *
	     * _.sample([1, 2, 3, 4], 2);
	     * // => [3, 1]
	     */
	    function sample(collection, n, guard) {
	      if (collection && typeof collection.length != 'number') {
	        collection = values(collection);
	      } else if (support.unindexedChars && isString(collection)) {
	        collection = collection.split('');
	      }
	      if (n == null || guard) {
	        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
	      }
	      var result = shuffle(collection);
	      result.length = nativeMin(nativeMax(0, n), result.length);
	      return result;
	    }

	    /**
	     * Creates an array of shuffled values, using a version of the Fisher-Yates
	     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to shuffle.
	     * @returns {Array} Returns a new shuffled collection.
	     * @example
	     *
	     * _.shuffle([1, 2, 3, 4, 5, 6]);
	     * // => [4, 1, 6, 3, 5, 2]
	     */
	    function shuffle(collection) {
	      var index = -1,
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      forEach(collection, function(value) {
	        var rand = baseRandom(0, ++index);
	        result[index] = result[rand];
	        result[rand] = value;
	      });
	      return result;
	    }

	    /**
	     * Gets the size of the `collection` by returning `collection.length` for arrays
	     * and array-like objects or the number of own enumerable properties for objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to inspect.
	     * @returns {number} Returns `collection.length` or number of own enumerable properties.
	     * @example
	     *
	     * _.size([1, 2]);
	     * // => 2
	     *
	     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => 3
	     *
	     * _.size('pebbles');
	     * // => 7
	     */
	    function size(collection) {
	      var length = collection ? collection.length : 0;
	      return typeof length == 'number' ? length : keys(collection).length;
	    }

	    /**
	     * Checks if the callback returns a truey value for **any** element of a
	     * collection. The function returns as soon as it finds a passing value and
	     * does not iterate over the entire collection. The callback is bound to
	     * `thisArg` and invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias any
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if any element passed the callback check,
	     *  else `false`.
	     * @example
	     *
	     * _.some([null, 0, 'yes', false], Boolean);
	     * // => true
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.some(characters, 'blocked');
	     * // => true
	     *
	     * // using "_.where" callback shorthand
	     * _.some(characters, { 'age': 1 });
	     * // => false
	     */
	    function some(collection, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if ((result = callback(collection[index], index, collection))) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          return !(result = callback(value, index, collection));
	        });
	      }
	      return !!result;
	    }

	    /**
	     * Creates an array of elements, sorted in ascending order by the results of
	     * running each element in a collection through the callback. This method
	     * performs a stable sort, that is, it will preserve the original sort order
	     * of equal elements. The callback is bound to `thisArg` and invoked with
	     * three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an array of property names is provided for `callback` the collection
	     * will be sorted by each property value.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Array|Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of sorted elements.
	     * @example
	     *
	     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
	     * // => [3, 1, 2]
	     *
	     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
	     * // => [3, 1, 2]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36 },
	     *   { 'name': 'fred',    'age': 40 },
	     *   { 'name': 'barney',  'age': 26 },
	     *   { 'name': 'fred',    'age': 30 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.map(_.sortBy(characters, 'age'), _.values);
	     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
	     *
	     * // sorting by multiple properties
	     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
	     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
	     */
	    function sortBy(collection, callback, thisArg) {
	      var index = -1,
	          isArr = isArray(callback),
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      if (!isArr) {
	        callback = lodash.createCallback(callback, thisArg, 3);
	      }
	      forEach(collection, function(value, key, collection) {
	        var object = result[++index] = getObject();
	        if (isArr) {
	          object.criteria = map(callback, function(key) { return value[key]; });
	        } else {
	          (object.criteria = getArray())[0] = callback(value, key, collection);
	        }
	        object.index = index;
	        object.value = value;
	      });

	      length = result.length;
	      result.sort(compareAscending);
	      while (length--) {
	        var object = result[length];
	        result[length] = object.value;
	        if (!isArr) {
	          releaseArray(object.criteria);
	        }
	        releaseObject(object);
	      }
	      return result;
	    }

	    /**
	     * Converts the `collection` to an array.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to convert.
	     * @returns {Array} Returns the new converted array.
	     * @example
	     *
	     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
	     * // => [2, 3, 4]
	     */
	    function toArray(collection) {
	      if (collection && typeof collection.length == 'number') {
	        return (support.unindexedChars && isString(collection))
	          ? collection.split('')
	          : slice(collection);
	      }
	      return values(collection);
	    }

	    /**
	     * Performs a deep comparison of each element in a `collection` to the given
	     * `properties` object, returning an array of all elements that have equivalent
	     * property values.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Object} props The object of property values to filter by.
	     * @returns {Array} Returns a new array of elements that have the given properties.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
	     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * _.where(characters, { 'age': 36 });
	     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
	     *
	     * _.where(characters, { 'pets': ['dino'] });
	     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
	     */
	    var where = filter;

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates an array with all falsey values removed. The values `false`, `null`,
	     * `0`, `""`, `undefined`, and `NaN` are all falsey.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to compact.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.compact([0, 1, false, 2, '', 3]);
	     * // => [1, 2, 3]
	     */
	    function compact(array) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * Creates an array excluding all values of the provided arrays using strict
	     * equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to process.
	     * @param {...Array} [values] The arrays of values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
	     * // => [1, 3, 4]
	     */
	    function difference(array) {
	      return baseDifference(array, baseFlatten(arguments, true, true, 1));
	    }

	    /**
	     * This method is like `_.find` except that it returns the index of the first
	     * element that passes the callback check, instead of the element itself.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': false },
	     *   { 'name': 'fred',    'age': 40, 'blocked': true },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
	     * ];
	     *
	     * _.findIndex(characters, function(chr) {
	     *   return chr.age < 20;
	     * });
	     * // => 2
	     *
	     * // using "_.where" callback shorthand
	     * _.findIndex(characters, { 'age': 36 });
	     * // => 0
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findIndex(characters, 'blocked');
	     * // => 1
	     */
	    function findIndex(array, callback, thisArg) {
	      var index = -1,
	          length = array ? array.length : 0;

	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (++index < length) {
	        if (callback(array[index], index, array)) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * This method is like `_.findIndex` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': true },
	     *   { 'name': 'fred',    'age': 40, 'blocked': false },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
	     * ];
	     *
	     * _.findLastIndex(characters, function(chr) {
	     *   return chr.age > 30;
	     * });
	     * // => 1
	     *
	     * // using "_.where" callback shorthand
	     * _.findLastIndex(characters, { 'age': 36 });
	     * // => 0
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findLastIndex(characters, 'blocked');
	     * // => 2
	     */
	    function findLastIndex(array, callback, thisArg) {
	      var length = array ? array.length : 0;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (length--) {
	        if (callback(array[length], length, array)) {
	          return length;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Gets the first element or first `n` elements of an array. If a callback
	     * is provided elements at the beginning of the array are returned as long
	     * as the callback returns truey. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias head, take
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback] The function called
	     *  per element or the number of elements to return. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the first element(s) of `array`.
	     * @example
	     *
	     * _.first([1, 2, 3]);
	     * // => 1
	     *
	     * _.first([1, 2, 3], 2);
	     * // => [1, 2]
	     *
	     * _.first([1, 2, 3], function(num) {
	     *   return num < 3;
	     * });
	     * // => [1, 2]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.first(characters, 'blocked');
	     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
	     *
	     * // using "_.where" callback shorthand
	     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
	     * // => ['barney', 'fred']
	     */
	    function first(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = -1;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (++index < length && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = callback;
	        if (n == null || thisArg) {
	          return array ? array[0] : undefined;
	        }
	      }
	      return slice(array, 0, nativeMin(nativeMax(0, n), length));
	    }

	    /**
	     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
	     * is truey, the array will only be flattened a single level. If a callback
	     * is provided each element of the array is passed through the callback before
	     * flattening. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new flattened array.
	     * @example
	     *
	     * _.flatten([1, [2], [3, [[4]]]]);
	     * // => [1, 2, 3, 4];
	     *
	     * _.flatten([1, [2], [3, [[4]]]], true);
	     * // => [1, 2, 3, [[4]]];
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
	     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.flatten(characters, 'pets');
	     * // => ['hoppy', 'baby puss', 'dino']
	     */
	    function flatten(array, isShallow, callback, thisArg) {
	      // juggle arguments
	      if (typeof isShallow != 'boolean' && isShallow != null) {
	        thisArg = callback;
	        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
	        isShallow = false;
	      }
	      if (callback != null) {
	        array = map(array, callback, thisArg);
	      }
	      return baseFlatten(array, isShallow);
	    }

	    /**
	     * Gets the index at which the first occurrence of `value` is found using
	     * strict equality for comparisons, i.e. `===`. If the array is already sorted
	     * providing `true` for `fromIndex` will run a faster binary search.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
	     *  to perform a binary search on a sorted array.
	     * @returns {number} Returns the index of the matched value or `-1`.
	     * @example
	     *
	     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
	     * // => 1
	     *
	     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
	     * // => 4
	     *
	     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
	     * // => 2
	     */
	    function indexOf(array, value, fromIndex) {
	      if (typeof fromIndex == 'number') {
	        var length = array ? array.length : 0;
	        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
	      } else if (fromIndex) {
	        var index = sortedIndex(array, value);
	        return array[index] === value ? index : -1;
	      }
	      return baseIndexOf(array, value, fromIndex);
	    }

	    /**
	     * Gets all but the last element or last `n` elements of an array. If a
	     * callback is provided elements at the end of the array are excluded from
	     * the result as long as the callback returns truey. The callback is bound
	     * to `thisArg` and invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback=1] The function called
	     *  per element or the number of elements to exclude. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a slice of `array`.
	     * @example
	     *
	     * _.initial([1, 2, 3]);
	     * // => [1, 2]
	     *
	     * _.initial([1, 2, 3], 2);
	     * // => [1]
	     *
	     * _.initial([1, 2, 3], function(num) {
	     *   return num > 1;
	     * });
	     * // => [1]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.initial(characters, 'blocked');
	     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
	     *
	     * // using "_.where" callback shorthand
	     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
	     * // => ['barney', 'fred']
	     */
	    function initial(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = length;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (index-- && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = (callback == null || thisArg) ? 1 : callback || n;
	      }
	      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
	    }

	    /**
	     * Creates an array of unique values present in all provided arrays using
	     * strict equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of shared values.
	     * @example
	     *
	     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
	     * // => [1, 2]
	     */
	    function intersection() {
	      var args = [],
	          argsIndex = -1,
	          argsLength = arguments.length,
	          caches = getArray(),
	          indexOf = getIndexOf(),
	          trustIndexOf = indexOf === baseIndexOf,
	          seen = getArray();

	      while (++argsIndex < argsLength) {
	        var value = arguments[argsIndex];
	        if (isArray(value) || isArguments(value)) {
	          args.push(value);
	          caches.push(trustIndexOf && value.length >= largeArraySize &&
	            createCache(argsIndex ? args[argsIndex] : seen));
	        }
	      }
	      var array = args[0],
	          index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      outer:
	      while (++index < length) {
	        var cache = caches[0];
	        value = array[index];

	        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
	          argsIndex = argsLength;
	          (cache || seen).push(value);
	          while (--argsIndex) {
	            cache = caches[argsIndex];
	            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	      }
	      while (argsLength--) {
	        cache = caches[argsLength];
	        if (cache) {
	          releaseObject(cache);
	        }
	      }
	      releaseArray(caches);
	      releaseArray(seen);
	      return result;
	    }

	    /**
	     * Gets the last element or last `n` elements of an array. If a callback is
	     * provided elements at the end of the array are returned as long as the
	     * callback returns truey. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback] The function called
	     *  per element or the number of elements to return. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the last element(s) of `array`.
	     * @example
	     *
	     * _.last([1, 2, 3]);
	     * // => 3
	     *
	     * _.last([1, 2, 3], 2);
	     * // => [2, 3]
	     *
	     * _.last([1, 2, 3], function(num) {
	     *   return num > 1;
	     * });
	     * // => [2, 3]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.pluck(_.last(characters, 'blocked'), 'name');
	     * // => ['fred', 'pebbles']
	     *
	     * // using "_.where" callback shorthand
	     * _.last(characters, { 'employer': 'na' });
	     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	     */
	    function last(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = length;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (index-- && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = callback;
	        if (n == null || thisArg) {
	          return array ? array[length - 1] : undefined;
	        }
	      }
	      return slice(array, nativeMax(0, length - n));
	    }

	    /**
	     * Gets the index at which the last occurrence of `value` is found using strict
	     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
	     * as the offset from the end of the collection.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=array.length-1] The index to search from.
	     * @returns {number} Returns the index of the matched value or `-1`.
	     * @example
	     *
	     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
	     * // => 4
	     *
	     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
	     * // => 1
	     */
	    function lastIndexOf(array, value, fromIndex) {
	      var index = array ? array.length : 0;
	      if (typeof fromIndex == 'number') {
	        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
	      }
	      while (index--) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Removes all provided values from the given array using strict equality for
	     * comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to modify.
	     * @param {...*} [value] The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     * _.pull(array, 2, 3);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    function pull(array) {
	      var args = arguments,
	          argsIndex = 0,
	          argsLength = args.length,
	          length = array ? array.length : 0;

	      while (++argsIndex < argsLength) {
	        var index = -1,
	            value = args[argsIndex];
	        while (++index < length) {
	          if (array[index] === value) {
	            splice.call(array, index--, 1);
	            length--;
	          }
	        }
	      }
	      return array;
	    }

	    /**
	     * Creates an array of numbers (positive and/or negative) progressing from
	     * `start` up to but not including `end`. If `start` is less than `stop` a
	     * zero-length range is created unless a negative `step` is specified.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns a new range array.
	     * @example
	     *
	     * _.range(4);
	     * // => [0, 1, 2, 3]
	     *
	     * _.range(1, 5);
	     * // => [1, 2, 3, 4]
	     *
	     * _.range(0, 20, 5);
	     * // => [0, 5, 10, 15]
	     *
	     * _.range(0, -4, -1);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.range(0);
	     * // => []
	     */
	    function range(start, end, step) {
	      start = +start || 0;
	      step = typeof step == 'number' ? step : (+step || 1);

	      if (end == null) {
	        end = start;
	        start = 0;
	      }
	      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
	      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
	      var index = -1,
	          length = nativeMax(0, ceil((end - start) / (step || 1))),
	          result = Array(length);

	      while (++index < length) {
	        result[index] = start;
	        start += step;
	      }
	      return result;
	    }

	    /**
	     * Removes all elements from an array that the callback returns truey for
	     * and returns an array of removed elements. The callback is bound to `thisArg`
	     * and invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to modify.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of removed elements.
	     * @example
	     *
	     * var array = [1, 2, 3, 4, 5, 6];
	     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
	     *
	     * console.log(array);
	     * // => [1, 3, 5]
	     *
	     * console.log(evens);
	     * // => [2, 4, 6]
	     */
	    function remove(array, callback, thisArg) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (callback(value, index, array)) {
	          result.push(value);
	          splice.call(array, index--, 1);
	          length--;
	        }
	      }
	      return result;
	    }

	    /**
	     * The opposite of `_.initial` this method gets all but the first element or
	     * first `n` elements of an array. If a callback function is provided elements
	     * at the beginning of the array are excluded from the result as long as the
	     * callback returns truey. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias drop, tail
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback=1] The function called
	     *  per element or the number of elements to exclude. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a slice of `array`.
	     * @example
	     *
	     * _.rest([1, 2, 3]);
	     * // => [2, 3]
	     *
	     * _.rest([1, 2, 3], 2);
	     * // => [3]
	     *
	     * _.rest([1, 2, 3], function(num) {
	     *   return num < 3;
	     * });
	     * // => [3]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.pluck(_.rest(characters, 'blocked'), 'name');
	     * // => ['fred', 'pebbles']
	     *
	     * // using "_.where" callback shorthand
	     * _.rest(characters, { 'employer': 'slate' });
	     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	     */
	    function rest(array, callback, thisArg) {
	      if (typeof callback != 'number' && callback != null) {
	        var n = 0,
	            index = -1,
	            length = array ? array.length : 0;

	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (++index < length && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
	      }
	      return slice(array, n);
	    }

	    /**
	     * Uses a binary search to determine the smallest index at which a value
	     * should be inserted into a given sorted array in order to maintain the sort
	     * order of the array. If a callback is provided it will be executed for
	     * `value` and each element of `array` to compute their sort ranking. The
	     * callback is bound to `thisArg` and invoked with one argument; (value).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     * @example
	     *
	     * _.sortedIndex([20, 30, 50], 40);
	     * // => 2
	     *
	     * // using "_.pluck" callback shorthand
	     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
	     * // => 2
	     *
	     * var dict = {
	     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
	     * };
	     *
	     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
	     *   return dict.wordToNumber[word];
	     * });
	     * // => 2
	     *
	     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
	     *   return this.wordToNumber[word];
	     * }, dict);
	     * // => 2
	     */
	    function sortedIndex(array, value, callback, thisArg) {
	      var low = 0,
	          high = array ? array.length : low;

	      // explicitly reference `identity` for better inlining in Firefox
	      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
	      value = callback(value);

	      while (low < high) {
	        var mid = (low + high) >>> 1;
	        (callback(array[mid]) < value)
	          ? low = mid + 1
	          : high = mid;
	      }
	      return low;
	    }

	    /**
	     * Creates an array of unique values, in order, of the provided arrays using
	     * strict equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of combined values.
	     * @example
	     *
	     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
	     * // => [1, 2, 3, 5, 4]
	     */
	    function union() {
	      return baseUniq(baseFlatten(arguments, true, true));
	    }

	    /**
	     * Creates a duplicate-value-free version of an array using strict equality
	     * for comparisons, i.e. `===`. If the array is sorted, providing
	     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
	     * each element of `array` is passed through the callback before uniqueness
	     * is computed. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias unique
	     * @category Arrays
	     * @param {Array} array The array to process.
	     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a duplicate-value-free array.
	     * @example
	     *
	     * _.uniq([1, 2, 1, 3, 1]);
	     * // => [1, 2, 3]
	     *
	     * _.uniq([1, 1, 2, 2, 3], true);
	     * // => [1, 2, 3]
	     *
	     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
	     * // => ['A', 'b', 'C']
	     *
	     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
	     * // => [1, 2.5, 3]
	     *
	     * // using "_.pluck" callback shorthand
	     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    function uniq(array, isSorted, callback, thisArg) {
	      // juggle arguments
	      if (typeof isSorted != 'boolean' && isSorted != null) {
	        thisArg = callback;
	        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
	        isSorted = false;
	      }
	      if (callback != null) {
	        callback = lodash.createCallback(callback, thisArg, 3);
	      }
	      return baseUniq(array, isSorted, callback);
	    }

	    /**
	     * Creates an array excluding all provided values using strict equality for
	     * comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to filter.
	     * @param {...*} [value] The values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
	     * // => [2, 3, 4]
	     */
	    function without(array) {
	      return baseDifference(array, slice(arguments, 1));
	    }

	    /**
	     * Creates an array that is the symmetric difference of the provided arrays.
	     * See http://en.wikipedia.org/wiki/Symmetric_difference.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of values.
	     * @example
	     *
	     * _.xor([1, 2, 3], [5, 2, 1, 4]);
	     * // => [3, 5, 4]
	     *
	     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
	     * // => [1, 4, 5]
	     */
	    function xor() {
	      var index = -1,
	          length = arguments.length;

	      while (++index < length) {
	        var array = arguments[index];
	        if (isArray(array) || isArguments(array)) {
	          var result = result
	            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
	            : array;
	        }
	      }
	      return result || [];
	    }

	    /**
	     * Creates an array of grouped elements, the first of which contains the first
	     * elements of the given arrays, the second of which contains the second
	     * elements of the given arrays, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @alias unzip
	     * @category Arrays
	     * @param {...Array} [array] Arrays to process.
	     * @returns {Array} Returns a new array of grouped elements.
	     * @example
	     *
	     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     */
	    function zip() {
	      var array = arguments.length > 1 ? arguments : arguments[0],
	          index = -1,
	          length = array ? max(pluck(array, 'length')) : 0,
	          result = Array(length < 0 ? 0 : length);

	      while (++index < length) {
	        result[index] = pluck(array, index);
	      }
	      return result;
	    }

	    /**
	     * Creates an object composed from arrays of `keys` and `values`. Provide
	     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
	     * or two arrays, one of `keys` and one of corresponding `values`.
	     *
	     * @static
	     * @memberOf _
	     * @alias object
	     * @category Arrays
	     * @param {Array} keys The array of keys.
	     * @param {Array} [values=[]] The array of values.
	     * @returns {Object} Returns an object composed of the given keys and
	     *  corresponding values.
	     * @example
	     *
	     * _.zipObject(['fred', 'barney'], [30, 40]);
	     * // => { 'fred': 30, 'barney': 40 }
	     */
	    function zipObject(keys, values) {
	      var index = -1,
	          length = keys ? keys.length : 0,
	          result = {};

	      if (!values && length && !isArray(keys[0])) {
	        values = [];
	      }
	      while (++index < length) {
	        var key = keys[index];
	        if (values) {
	          result[key] = values[index];
	        } else if (key) {
	          result[key[0]] = key[1];
	        }
	      }
	      return result;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a function that executes `func`, with  the `this` binding and
	     * arguments of the created function, only after being called `n` times.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {number} n The number of times the function must be called before
	     *  `func` is executed.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var saves = ['profile', 'settings'];
	     *
	     * var done = _.after(saves.length, function() {
	     *   console.log('Done saving!');
	     * });
	     *
	     * _.forEach(saves, function(type) {
	     *   asyncSave({ 'type': type, 'complete': done });
	     * });
	     * // => logs 'Done saving!', after all saves have completed
	     */
	    function after(n, func) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }

	    /**
	     * Creates a function that, when called, invokes `func` with the `this`
	     * binding of `thisArg` and prepends any additional `bind` arguments to those
	     * provided to the bound function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to bind.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var func = function(greeting) {
	     *   return greeting + ' ' + this.name;
	     * };
	     *
	     * func = _.bind(func, { 'name': 'fred' }, 'hi');
	     * func();
	     * // => 'hi fred'
	     */
	    function bind(func, thisArg) {
	      return arguments.length > 2
	        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
	        : createWrapper(func, 1, null, null, thisArg);
	    }

	    /**
	     * Binds methods of an object to the object itself, overwriting the existing
	     * method. Method names may be specified as individual arguments or as arrays
	     * of method names. If no method names are provided all the function properties
	     * of `object` will be bound.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Object} object The object to bind and assign the bound methods to.
	     * @param {...string} [methodName] The object method names to
	     *  bind, specified as individual method names or arrays of method names.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'onClick': function() { console.log('clicked ' + this.label); }
	     * };
	     *
	     * _.bindAll(view);
	     * jQuery('#docs').on('click', view.onClick);
	     * // => logs 'clicked docs', when the button is clicked
	     */
	    function bindAll(object) {
	      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
	          index = -1,
	          length = funcs.length;

	      while (++index < length) {
	        var key = funcs[index];
	        object[key] = createWrapper(object[key], 1, null, null, object);
	      }
	      return object;
	    }

	    /**
	     * Creates a function that, when called, invokes the method at `object[key]`
	     * and prepends any additional `bindKey` arguments to those provided to the bound
	     * function. This method differs from `_.bind` by allowing bound functions to
	     * reference methods that will be redefined or don't yet exist.
	     * See http://michaux.ca/articles/lazy-function-definition-pattern.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Object} object The object the method belongs to.
	     * @param {string} key The key of the method.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var object = {
	     *   'name': 'fred',
	     *   'greet': function(greeting) {
	     *     return greeting + ' ' + this.name;
	     *   }
	     * };
	     *
	     * var func = _.bindKey(object, 'greet', 'hi');
	     * func();
	     * // => 'hi fred'
	     *
	     * object.greet = function(greeting) {
	     *   return greeting + 'ya ' + this.name + '!';
	     * };
	     *
	     * func();
	     * // => 'hiya fred!'
	     */
	    function bindKey(object, key) {
	      return arguments.length > 2
	        ? createWrapper(key, 19, slice(arguments, 2), null, object)
	        : createWrapper(key, 3, null, null, object);
	    }

	    /**
	     * Creates a function that is the composition of the provided functions,
	     * where each function consumes the return value of the function that follows.
	     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
	     * Each function is executed with the `this` binding of the composed function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {...Function} [func] Functions to compose.
	     * @returns {Function} Returns the new composed function.
	     * @example
	     *
	     * var realNameMap = {
	     *   'pebbles': 'penelope'
	     * };
	     *
	     * var format = function(name) {
	     *   name = realNameMap[name.toLowerCase()] || name;
	     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	     * };
	     *
	     * var greet = function(formatted) {
	     *   return 'Hiya ' + formatted + '!';
	     * };
	     *
	     * var welcome = _.compose(greet, format);
	     * welcome('pebbles');
	     * // => 'Hiya Penelope!'
	     */
	    function compose() {
	      var funcs = arguments,
	          length = funcs.length;

	      while (length--) {
	        if (!isFunction(funcs[length])) {
	          throw new TypeError;
	        }
	      }
	      return function() {
	        var args = arguments,
	            length = funcs.length;

	        while (length--) {
	          args = [funcs[length].apply(this, args)];
	        }
	        return args[0];
	      };
	    }

	    /**
	     * Creates a function which accepts one or more arguments of `func` that when
	     * invoked either executes `func` returning its result, if all `func` arguments
	     * have been provided, or returns a function that accepts one or more of the
	     * remaining `func` arguments, and so on. The arity of `func` can be specified
	     * if `func.length` is not sufficient.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var curried = _.curry(function(a, b, c) {
	     *   console.log(a + b + c);
	     * });
	     *
	     * curried(1)(2)(3);
	     * // => 6
	     *
	     * curried(1, 2)(3);
	     * // => 6
	     *
	     * curried(1, 2, 3);
	     * // => 6
	     */
	    function curry(func, arity) {
	      arity = typeof arity == 'number' ? arity : (+arity || func.length);
	      return createWrapper(func, 4, null, null, null, arity);
	    }

	    /**
	     * Creates a function that will delay the execution of `func` until after
	     * `wait` milliseconds have elapsed since the last time it was invoked.
	     * Provide an options object to indicate that `func` should be invoked on
	     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
	     * to the debounced function will return the result of the last `func` call.
	     *
	     * Note: If `leading` and `trailing` options are `true` `func` will be called
	     * on the trailing edge of the timeout only if the the debounced function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to debounce.
	     * @param {number} wait The number of milliseconds to delay.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
	     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
	     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	     * @returns {Function} Returns the new debounced function.
	     * @example
	     *
	     * // avoid costly calculations while the window size is in flux
	     * var lazyLayout = _.debounce(calculateLayout, 150);
	     * jQuery(window).on('resize', lazyLayout);
	     *
	     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
	     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	     *   'leading': true,
	     *   'trailing': false
	     * });
	     *
	     * // ensure `batchLog` is executed once after 1 second of debounced calls
	     * var source = new EventSource('/stream');
	     * source.addEventListener('message', _.debounce(batchLog, 250, {
	     *   'maxWait': 1000
	     * }, false);
	     */
	    function debounce(func, wait, options) {
	      var args,
	          maxTimeoutId,
	          result,
	          stamp,
	          thisArg,
	          timeoutId,
	          trailingCall,
	          lastCalled = 0,
	          maxWait = false,
	          trailing = true;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      wait = nativeMax(0, wait) || 0;
	      if (options === true) {
	        var leading = true;
	        trailing = false;
	      } else if (isObject(options)) {
	        leading = options.leading;
	        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
	        trailing = 'trailing' in options ? options.trailing : trailing;
	      }
	      var delayed = function() {
	        var remaining = wait - (now() - stamp);
	        if (remaining <= 0) {
	          if (maxTimeoutId) {
	            clearTimeout(maxTimeoutId);
	          }
	          var isCalled = trailingCall;
	          maxTimeoutId = timeoutId = trailingCall = undefined;
	          if (isCalled) {
	            lastCalled = now();
	            result = func.apply(thisArg, args);
	            if (!timeoutId && !maxTimeoutId) {
	              args = thisArg = null;
	            }
	          }
	        } else {
	          timeoutId = setTimeout(delayed, remaining);
	        }
	      };

	      var maxDelayed = function() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	        if (trailing || (maxWait !== wait)) {
	          lastCalled = now();
	          result = func.apply(thisArg, args);
	          if (!timeoutId && !maxTimeoutId) {
	            args = thisArg = null;
	          }
	        }
	      };

	      return function() {
	        args = arguments;
	        stamp = now();
	        thisArg = this;
	        trailingCall = trailing && (timeoutId || !leading);

	        if (maxWait === false) {
	          var leadingCall = leading && !timeoutId;
	        } else {
	          if (!maxTimeoutId && !leading) {
	            lastCalled = stamp;
	          }
	          var remaining = maxWait - (stamp - lastCalled),
	              isCalled = remaining <= 0;

	          if (isCalled) {
	            if (maxTimeoutId) {
	              maxTimeoutId = clearTimeout(maxTimeoutId);
	            }
	            lastCalled = stamp;
	            result = func.apply(thisArg, args);
	          }
	          else if (!maxTimeoutId) {
	            maxTimeoutId = setTimeout(maxDelayed, remaining);
	          }
	        }
	        if (isCalled && timeoutId) {
	          timeoutId = clearTimeout(timeoutId);
	        }
	        else if (!timeoutId && wait !== maxWait) {
	          timeoutId = setTimeout(delayed, wait);
	        }
	        if (leadingCall) {
	          isCalled = true;
	          result = func.apply(thisArg, args);
	        }
	        if (isCalled && !timeoutId && !maxTimeoutId) {
	          args = thisArg = null;
	        }
	        return result;
	      };
	    }

	    /**
	     * Defers executing the `func` function until the current call stack has cleared.
	     * Additional arguments will be provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to defer.
	     * @param {...*} [arg] Arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.defer(function(text) { console.log(text); }, 'deferred');
	     * // logs 'deferred' after one or more milliseconds
	     */
	    function defer(func) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var args = slice(arguments, 1);
	      return setTimeout(function() { func.apply(undefined, args); }, 1);
	    }

	    /**
	     * Executes the `func` function after `wait` milliseconds. Additional arguments
	     * will be provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay execution.
	     * @param {...*} [arg] Arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.delay(function(text) { console.log(text); }, 1000, 'later');
	     * // => logs 'later' after one second
	     */
	    function delay(func, wait) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var args = slice(arguments, 2);
	      return setTimeout(function() { func.apply(undefined, args); }, wait);
	    }

	    /**
	     * Creates a function that memoizes the result of `func`. If `resolver` is
	     * provided it will be used to determine the cache key for storing the result
	     * based on the arguments provided to the memoized function. By default, the
	     * first argument provided to the memoized function is used as the cache key.
	     * The `func` is executed with the `this` binding of the memoized function.
	     * The result cache is exposed as the `cache` property on the memoized function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to have its output memoized.
	     * @param {Function} [resolver] A function used to resolve the cache key.
	     * @returns {Function} Returns the new memoizing function.
	     * @example
	     *
	     * var fibonacci = _.memoize(function(n) {
	     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
	     * });
	     *
	     * fibonacci(9)
	     * // => 34
	     *
	     * var data = {
	     *   'fred': { 'name': 'fred', 'age': 40 },
	     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // modifying the result cache
	     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
	     * get('pebbles');
	     * // => { 'name': 'pebbles', 'age': 1 }
	     *
	     * get.cache.pebbles.name = 'penelope';
	     * get('pebbles');
	     * // => { 'name': 'penelope', 'age': 1 }
	     */
	    function memoize(func, resolver) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var memoized = function() {
	        var cache = memoized.cache,
	            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

	        return hasOwnProperty.call(cache, key)
	          ? cache[key]
	          : (cache[key] = func.apply(this, arguments));
	      }
	      memoized.cache = {};
	      return memoized;
	    }

	    /**
	     * Creates a function that is restricted to execute `func` once. Repeat calls to
	     * the function will return the value of the first call. The `func` is executed
	     * with the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` executes `createApplication` once
	     */
	    function once(func) {
	      var ran,
	          result;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      return function() {
	        if (ran) {
	          return result;
	        }
	        ran = true;
	        result = func.apply(this, arguments);

	        // clear the `func` variable so the function may be garbage collected
	        func = null;
	        return result;
	      };
	    }

	    /**
	     * Creates a function that, when called, invokes `func` with any additional
	     * `partial` arguments prepended to those provided to the new function. This
	     * method is similar to `_.bind` except it does **not** alter the `this` binding.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) { return greeting + ' ' + name; };
	     * var hi = _.partial(greet, 'hi');
	     * hi('fred');
	     * // => 'hi fred'
	     */
	    function partial(func) {
	      return createWrapper(func, 16, slice(arguments, 1));
	    }

	    /**
	     * This method is like `_.partial` except that `partial` arguments are
	     * appended to those provided to the new function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
	     *
	     * var options = {
	     *   'variable': 'data',
	     *   'imports': { 'jq': $ }
	     * };
	     *
	     * defaultsDeep(options, _.templateSettings);
	     *
	     * options.variable
	     * // => 'data'
	     *
	     * options.imports
	     * // => { '_': _, 'jq': $ }
	     */
	    function partialRight(func) {
	      return createWrapper(func, 32, null, slice(arguments, 1));
	    }

	    /**
	     * Creates a function that, when executed, will only call the `func` function
	     * at most once per every `wait` milliseconds. Provide an options object to
	     * indicate that `func` should be invoked on the leading and/or trailing edge
	     * of the `wait` timeout. Subsequent calls to the throttled function will
	     * return the result of the last `func` call.
	     *
	     * Note: If `leading` and `trailing` options are `true` `func` will be called
	     * on the trailing edge of the timeout only if the the throttled function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to throttle.
	     * @param {number} wait The number of milliseconds to throttle executions to.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
	     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	     * @returns {Function} Returns the new throttled function.
	     * @example
	     *
	     * // avoid excessively updating the position while scrolling
	     * var throttled = _.throttle(updatePosition, 100);
	     * jQuery(window).on('scroll', throttled);
	     *
	     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
	     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
	     *   'trailing': false
	     * }));
	     */
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      if (options === false) {
	        leading = false;
	      } else if (isObject(options)) {
	        leading = 'leading' in options ? options.leading : leading;
	        trailing = 'trailing' in options ? options.trailing : trailing;
	      }
	      debounceOptions.leading = leading;
	      debounceOptions.maxWait = wait;
	      debounceOptions.trailing = trailing;

	      return debounce(func, wait, debounceOptions);
	    }

	    /**
	     * Creates a function that provides `value` to the wrapper function as its
	     * first argument. Additional arguments provided to the function are appended
	     * to those provided to the wrapper function. The wrapper is executed with
	     * the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {*} value The value to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var p = _.wrap(_.escape, function(func, text) {
	     *   return '<p>' + func(text) + '</p>';
	     * });
	     *
	     * p('Fred, Wilma, & Pebbles');
	     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
	     */
	    function wrap(value, wrapper) {
	      return createWrapper(wrapper, 16, [value]);
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * var getter = _.constant(object);
	     * getter() === object;
	     * // => true
	     */
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }

	    /**
	     * Produces a callback bound to an optional `thisArg`. If `func` is a property
	     * name the created callback will return the property value for a given element.
	     * If `func` is an object the created callback will return `true` for elements
	     * that contain the equivalent object properties, otherwise it will return `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} [func=identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of the created callback.
	     * @param {number} [argCount] The number of arguments the callback accepts.
	     * @returns {Function} Returns a callback function.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // wrap to create custom callback shorthands
	     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
	     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
	     *   return !match ? func(callback, thisArg) : function(object) {
	     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
	     *   };
	     * });
	     *
	     * _.filter(characters, 'age__gt38');
	     * // => [{ 'name': 'fred', 'age': 40 }]
	     */
	    function createCallback(func, thisArg, argCount) {
	      var type = typeof func;
	      if (func == null || type == 'function') {
	        return baseCreateCallback(func, thisArg, argCount);
	      }
	      // handle "_.pluck" style callback shorthands
	      if (type != 'object') {
	        return property(func);
	      }
	      var props = keys(func),
	          key = props[0],
	          a = func[key];

	      // handle "_.where" style callback shorthands
	      if (props.length == 1 && a === a && !isObject(a)) {
	        // fast path the common case of providing an object with a single
	        // property containing a primitive value
	        return function(object) {
	          var b = object[key];
	          return a === b && (a !== 0 || (1 / a == 1 / b));
	        };
	      }
	      return function(object) {
	        var length = props.length,
	            result = false;

	        while (length--) {
	          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
	            break;
	          }
	        }
	        return result;
	      };
	    }

	    /**
	     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
	     * corresponding HTML entities.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} string The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escape('Fred, Wilma, & Pebbles');
	     * // => 'Fred, Wilma, &amp; Pebbles'
	     */
	    function escape(string) {
	      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
	    }

	    /**
	     * This method returns the first argument provided to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * _.identity(object) === object;
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }

	    /**
	     * Adds function properties of a source object to the destination object.
	     * If `object` is a function methods will be added to its prototype as well.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {Function|Object} [object=lodash] object The destination object.
	     * @param {Object} source The object of functions to add.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
	     * @example
	     *
	     * function capitalize(string) {
	     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	     * }
	     *
	     * _.mixin({ 'capitalize': capitalize });
	     * _.capitalize('fred');
	     * // => 'Fred'
	     *
	     * _('fred').capitalize().value();
	     * // => 'Fred'
	     *
	     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
	     * _('fred').capitalize();
	     * // => 'Fred'
	     */
	    function mixin(object, source, options) {
	      var chain = true,
	          methodNames = source && functions(source);

	      if (!source || (!options && !methodNames.length)) {
	        if (options == null) {
	          options = source;
	        }
	        ctor = lodashWrapper;
	        source = object;
	        object = lodash;
	        methodNames = functions(source);
	      }
	      if (options === false) {
	        chain = false;
	      } else if (isObject(options) && 'chain' in options) {
	        chain = options.chain;
	      }
	      var ctor = object,
	          isFunc = isFunction(ctor);

	      forEach(methodNames, function(methodName) {
	        var func = object[methodName] = source[methodName];
	        if (isFunc) {
	          ctor.prototype[methodName] = function() {
	            var chainAll = this.__chain__,
	                value = this.__wrapped__,
	                args = [value];

	            push.apply(args, arguments);
	            var result = func.apply(object, args);
	            if (chain || chainAll) {
	              if (value === result && isObject(result)) {
	                return this;
	              }
	              result = new ctor(result);
	              result.__chain__ = chainAll;
	            }
	            return result;
	          };
	        }
	      });
	    }

	    /**
	     * Reverts the '_' variable to its previous value and returns a reference to
	     * the `lodash` function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @returns {Function} Returns the `lodash` function.
	     * @example
	     *
	     * var lodash = _.noConflict();
	     */
	    function noConflict() {
	      context._ = oldDash;
	      return this;
	    }

	    /**
	     * A no-operation function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * _.noop(object) === undefined;
	     * // => true
	     */
	    function noop() {
	      // no operation performed
	    }

	    /**
	     * Gets the number of milliseconds that have elapsed since the Unix epoch
	     * (1 January 1970 00:00:00 UTC).
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @example
	     *
	     * var stamp = _.now();
	     * _.defer(function() { console.log(_.now() - stamp); });
	     * // => logs the number of milliseconds it took for the deferred function to be called
	     */
	    var now = isNative(now = Date.now) && now || function() {
	      return new Date().getTime();
	    };

	    /**
	     * Converts the given value into an integer of the specified radix.
	     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
	     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
	     *
	     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
	     * implementations. See http://es5.github.io/#E.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} value The value to parse.
	     * @param {number} [radix] The radix used to interpret the value to parse.
	     * @returns {number} Returns the new integer value.
	     * @example
	     *
	     * _.parseInt('08');
	     * // => 8
	     */
	    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
	      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
	      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
	    };

	    /**
	     * Creates a "_.pluck" style function, which returns the `key` value of a
	     * given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} key The name of the property to retrieve.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'fred',   'age': 40 },
	     *   { 'name': 'barney', 'age': 36 }
	     * ];
	     *
	     * var getName = _.property('name');
	     *
	     * _.map(characters, getName);
	     * // => ['barney', 'fred']
	     *
	     * _.sortBy(characters, getName);
	     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
	     */
	    function property(key) {
	      return function(object) {
	        return object[key];
	      };
	    }

	    /**
	     * Produces a random number between `min` and `max` (inclusive). If only one
	     * argument is provided a number between `0` and the given number will be
	     * returned. If `floating` is truey or either `min` or `max` are floats a
	     * floating-point number will be returned instead of an integer.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {number} [min=0] The minimum possible value.
	     * @param {number} [max=1] The maximum possible value.
	     * @param {boolean} [floating=false] Specify returning a floating-point number.
	     * @returns {number} Returns a random number.
	     * @example
	     *
	     * _.random(0, 5);
	     * // => an integer between 0 and 5
	     *
	     * _.random(5);
	     * // => also an integer between 0 and 5
	     *
	     * _.random(5, true);
	     * // => a floating-point number between 0 and 5
	     *
	     * _.random(1.2, 5.2);
	     * // => a floating-point number between 1.2 and 5.2
	     */
	    function random(min, max, floating) {
	      var noMin = min == null,
	          noMax = max == null;

	      if (floating == null) {
	        if (typeof min == 'boolean' && noMax) {
	          floating = min;
	          min = 1;
	        }
	        else if (!noMax && typeof max == 'boolean') {
	          floating = max;
	          noMax = true;
	        }
	      }
	      if (noMin && noMax) {
	        max = 1;
	      }
	      min = +min || 0;
	      if (noMax) {
	        max = min;
	        min = 0;
	      } else {
	        max = +max || 0;
	      }
	      if (floating || min % 1 || max % 1) {
	        var rand = nativeRandom();
	        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
	      }
	      return baseRandom(min, max);
	    }

	    /**
	     * Resolves the value of property `key` on `object`. If `key` is a function
	     * it will be invoked with the `this` binding of `object` and its result returned,
	     * else the property value is returned. If `object` is falsey then `undefined`
	     * is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {Object} object The object to inspect.
	     * @param {string} key The name of the property to resolve.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = {
	     *   'cheese': 'crumpets',
	     *   'stuff': function() {
	     *     return 'nonsense';
	     *   }
	     * };
	     *
	     * _.result(object, 'cheese');
	     * // => 'crumpets'
	     *
	     * _.result(object, 'stuff');
	     * // => 'nonsense'
	     */
	    function result(object, key) {
	      if (object) {
	        var value = object[key];
	        return isFunction(value) ? object[key]() : value;
	      }
	    }

	    /**
	     * A micro-templating method that handles arbitrary delimiters, preserves
	     * whitespace, and correctly escapes quotes within interpolated code.
	     *
	     * Note: In the development build, `_.template` utilizes sourceURLs for easier
	     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
	     *
	     * For more information on precompiling templates see:
	     * http://lodash.com/custom-builds
	     *
	     * For more information on Chrome extension sandboxes see:
	     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} text The template text.
	     * @param {Object} data The data object used to populate the text.
	     * @param {Object} [options] The options object.
	     * @param {RegExp} [options.escape] The "escape" delimiter.
	     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	     * @param {Object} [options.imports] An object to import into the template as local variables.
	     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
	     * @param {string} [variable] The data object variable name.
	     * @returns {Function|string} Returns a compiled function when no `data` object
	     *  is given, else it returns the interpolated text.
	     * @example
	     *
	     * // using the "interpolate" delimiter to create a compiled template
	     * var compiled = _.template('hello <%= name %>');
	     * compiled({ 'name': 'fred' });
	     * // => 'hello fred'
	     *
	     * // using the "escape" delimiter to escape HTML in data property values
	     * _.template('<b><%- value %></b>', { 'value': '<script>' });
	     * // => '<b>&lt;script&gt;</b>'
	     *
	     * // using the "evaluate" delimiter to generate HTML
	     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
	     * _.template(list, { 'people': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
	     * _.template('hello ${ name }', { 'name': 'pebbles' });
	     * // => 'hello pebbles'
	     *
	     * // using the internal `print` function in "evaluate" delimiters
	     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
	     * // => 'hello barney!'
	     *
	     * // using a custom template delimiters
	     * _.templateSettings = {
	     *   'interpolate': /{{([\s\S]+?)}}/g
	     * };
	     *
	     * _.template('hello {{ name }}!', { 'name': 'mustache' });
	     * // => 'hello mustache!'
	     *
	     * // using the `imports` option to import jQuery
	     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
	     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the `sourceURL` option to specify a custom sourceURL for the template
	     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
	     * compiled(data);
	     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	     *
	     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
	     * compiled.source;
	     * // => function(data) {
	     *   var __t, __p = '', __e = _.escape;
	     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
	     *   return __p;
	     * }
	     *
	     * // using the `source` property to inline compiled templates for meaningful
	     * // line numbers in error messages and a stack trace
	     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	     *   var JST = {\
	     *     "main": ' + _.template(mainText).source + '\
	     *   };\
	     * ');
	     */
	    function template(text, data, options) {
	      // based on John Resig's `tmpl` implementation
	      // http://ejohn.org/blog/javascript-micro-templating/
	      // and Laura Doktorova's doT.js
	      // https://github.com/olado/doT
	      var settings = lodash.templateSettings;
	      text = String(text || '');

	      // avoid missing dependencies when `iteratorTemplate` is not defined
	      options = defaults({}, options, settings);

	      var imports = defaults({}, options.imports, settings.imports),
	          importsKeys = keys(imports),
	          importsValues = values(imports);

	      var isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";

	      // compile the regexp to match each delimiter
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');

	      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);

	        // escape characters that cannot be included in string literals
	        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

	        // replace delimiters with snippets
	        if (escapeValue) {
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;

	        // the JS engine embedded in Adobe products requires returning the `match`
	        // string in order to produce the correct `offset` value
	        return match;
	      });

	      source += "';\n";

	      // if `variable` is not specified, wrap a with-statement around the generated
	      // code to add the data object to the top of the scope chain
	      var variable = options.variable,
	          hasVariable = variable;

	      if (!hasVariable) {
	        variable = 'obj';
	        source = 'with (' + variable + ') {\n' + source + '\n}\n';
	      }
	      // cleanup code by stripping empty strings
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');

	      // frame code as the function body
	      source = 'function(' + variable + ') {\n' +
	        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
	        "var __t, __p = '', __e = _.escape" +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';

	      // Use a sourceURL for easier debugging.
	      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
	      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

	      try {
	        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
	      } catch(e) {
	        e.source = source;
	        throw e;
	      }
	      if (data) {
	        return result(data);
	      }
	      // provide the compiled function's source by its `toString` method, in
	      // supported environments, or the `source` property as a convenience for
	      // inlining compiled templates during the build process
	      result.source = source;
	      return result;
	    }

	    /**
	     * Executes the callback `n` times, returning an array of the results
	     * of each callback execution. The callback is bound to `thisArg` and invoked
	     * with one argument; (index).
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {number} n The number of times to execute the callback.
	     * @param {Function} callback The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns an array of the results of each `callback` execution.
	     * @example
	     *
	     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
	     * // => [3, 6, 4]
	     *
	     * _.times(3, function(n) { mage.castSpell(n); });
	     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
	     *
	     * _.times(3, function(n) { this.cast(n); }, mage);
	     * // => also calls `mage.castSpell(n)` three times
	     */
	    function times(n, callback, thisArg) {
	      n = (n = +n) > -1 ? n : 0;
	      var index = -1,
	          result = Array(n);

	      callback = baseCreateCallback(callback, thisArg, 1);
	      while (++index < n) {
	        result[index] = callback(index);
	      }
	      return result;
	    }

	    /**
	     * The inverse of `_.escape` this method converts the HTML entities
	     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
	     * corresponding characters.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} string The string to unescape.
	     * @returns {string} Returns the unescaped string.
	     * @example
	     *
	     * _.unescape('Fred, Barney &amp; Pebbles');
	     * // => 'Fred, Barney & Pebbles'
	     */
	    function unescape(string) {
	      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
	    }

	    /**
	     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} [prefix] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     * @example
	     *
	     * _.uniqueId('contact_');
	     * // => 'contact_104'
	     *
	     * _.uniqueId();
	     * // => '105'
	     */
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return String(prefix == null ? '' : prefix) + id;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object that wraps the given value with explicit
	     * method chaining enabled.
	     *
	     * @static
	     * @memberOf _
	     * @category Chaining
	     * @param {*} value The value to wrap.
	     * @returns {Object} Returns the wrapper object.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36 },
	     *   { 'name': 'fred',    'age': 40 },
	     *   { 'name': 'pebbles', 'age': 1 }
	     * ];
	     *
	     * var youngest = _.chain(characters)
	     *     .sortBy('age')
	     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
	     *     .first()
	     *     .value();
	     * // => 'pebbles is 1'
	     */
	    function chain(value) {
	      value = new lodashWrapper(value);
	      value.__chain__ = true;
	      return value;
	    }

	    /**
	     * Invokes `interceptor` with the `value` as the first argument and then
	     * returns `value`. The purpose of this method is to "tap into" a method
	     * chain in order to perform operations on intermediate results within
	     * the chain.
	     *
	     * @static
	     * @memberOf _
	     * @category Chaining
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * _([1, 2, 3, 4])
	     *  .tap(function(array) { array.pop(); })
	     *  .reverse()
	     *  .value();
	     * // => [3, 2, 1]
	     */
	    function tap(value, interceptor) {
	      interceptor(value);
	      return value;
	    }

	    /**
	     * Enables explicit method chaining on the wrapper object.
	     *
	     * @name chain
	     * @memberOf _
	     * @category Chaining
	     * @returns {*} Returns the wrapper object.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // without explicit chaining
	     * _(characters).first();
	     * // => { 'name': 'barney', 'age': 36 }
	     *
	     * // with explicit chaining
	     * _(characters).chain()
	     *   .first()
	     *   .pick('age')
	     *   .value();
	     * // => { 'age': 36 }
	     */
	    function wrapperChain() {
	      this.__chain__ = true;
	      return this;
	    }

	    /**
	     * Produces the `toString` result of the wrapped value.
	     *
	     * @name toString
	     * @memberOf _
	     * @category Chaining
	     * @returns {string} Returns the string result.
	     * @example
	     *
	     * _([1, 2, 3]).toString();
	     * // => '1,2,3'
	     */
	    function wrapperToString() {
	      return String(this.__wrapped__);
	    }

	    /**
	     * Extracts the wrapped value.
	     *
	     * @name valueOf
	     * @memberOf _
	     * @alias value
	     * @category Chaining
	     * @returns {*} Returns the wrapped value.
	     * @example
	     *
	     * _([1, 2, 3]).valueOf();
	     * // => [1, 2, 3]
	     */
	    function wrapperValueOf() {
	      return this.__wrapped__;
	    }

	    /*--------------------------------------------------------------------------*/

	    // add functions that return wrapped values when chaining
	    lodash.after = after;
	    lodash.assign = assign;
	    lodash.at = at;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.chain = chain;
	    lodash.compact = compact;
	    lodash.compose = compose;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.createCallback = createCallback;
	    lodash.curry = curry;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.filter = filter;
	    lodash.flatten = flatten;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.functions = functions;
	    lodash.groupBy = groupBy;
	    lodash.indexBy = indexBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.invert = invert;
	    lodash.invoke = invoke;
	    lodash.keys = keys;
	    lodash.map = map;
	    lodash.mapValues = mapValues;
	    lodash.max = max;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.min = min;
	    lodash.omit = omit;
	    lodash.once = once;
	    lodash.pairs = pairs;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.pick = pick;
	    lodash.pluck = pluck;
	    lodash.property = property;
	    lodash.pull = pull;
	    lodash.range = range;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.shuffle = shuffle;
	    lodash.sortBy = sortBy;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.times = times;
	    lodash.toArray = toArray;
	    lodash.transform = transform;
	    lodash.union = union;
	    lodash.uniq = uniq;
	    lodash.values = values;
	    lodash.where = where;
	    lodash.without = without;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;

	    // add aliases
	    lodash.collect = map;
	    lodash.drop = rest;
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.extend = assign;
	    lodash.methods = functions;
	    lodash.object = zipObject;
	    lodash.select = filter;
	    lodash.tail = rest;
	    lodash.unique = uniq;
	    lodash.unzip = zip;

	    // add functions to `lodash.prototype`
	    mixin(lodash);

	    /*--------------------------------------------------------------------------*/

	    // add functions that return unwrapped values when chaining
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.contains = contains;
	    lodash.escape = escape;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.has = has;
	    lodash.identity = identity;
	    lodash.indexOf = indexOf;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isBoolean = isBoolean;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isNaN = isNaN;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isString = isString;
	    lodash.isUndefined = isUndefined;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.mixin = mixin;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.result = result;
	    lodash.runInContext = runInContext;
	    lodash.size = size;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.template = template;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;

	    // add aliases
	    lodash.all = every;
	    lodash.any = some;
	    lodash.detect = find;
	    lodash.findWhere = find;
	    lodash.foldl = reduce;
	    lodash.foldr = reduceRight;
	    lodash.include = contains;
	    lodash.inject = reduce;

	    mixin(function() {
	      var source = {}
	      forOwn(lodash, function(func, methodName) {
	        if (!lodash.prototype[methodName]) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }(), false);

	    /*--------------------------------------------------------------------------*/

	    // add functions capable of returning wrapped and unwrapped values when chaining
	    lodash.first = first;
	    lodash.last = last;
	    lodash.sample = sample;

	    // add aliases
	    lodash.take = first;
	    lodash.head = first;

	    forOwn(lodash, function(func, methodName) {
	      var callbackable = methodName !== 'sample';
	      if (!lodash.prototype[methodName]) {
	        lodash.prototype[methodName]= function(n, guard) {
	          var chainAll = this.__chain__,
	              result = func(this.__wrapped__, n, guard);

	          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
	            ? result
	            : new lodashWrapper(result, chainAll);
	        };
	      }
	    });

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The semantic version number.
	     *
	     * @static
	     * @memberOf _
	     * @type string
	     */
	    lodash.VERSION = '2.4.1';

	    // add "Chaining" functions to the wrapper
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.toString = wrapperToString;
	    lodash.prototype.value = wrapperValueOf;
	    lodash.prototype.valueOf = wrapperValueOf;

	    // add `Array` functions that return unwrapped values
	    baseEach(['join', 'pop', 'shift'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        var chainAll = this.__chain__,
	            result = func.apply(this.__wrapped__, arguments);

	        return chainAll
	          ? new lodashWrapper(result, chainAll)
	          : result;
	      };
	    });

	    // add `Array` functions that return the existing wrapped value
	    baseEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        func.apply(this.__wrapped__, arguments);
	        return this;
	      };
	    });

	    // add `Array` functions that return new wrapped values
	    baseEach(['concat', 'slice', 'splice'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
	      };
	    });

	    // avoid array-like object bugs with `Array#shift` and `Array#splice`
	    // in IE < 9, Firefox < 10, Narwhal, and RingoJS
	    if (!support.spliceObjects) {
	      baseEach(['pop', 'shift', 'splice'], function(methodName) {
	        var func = arrayRef[methodName],
	            isSplice = methodName == 'splice';

	        lodash.prototype[methodName] = function() {
	          var chainAll = this.__chain__,
	              value = this.__wrapped__,
	              result = func.apply(value, arguments);

	          if (value.length === 0) {
	            delete value[0];
	          }
	          return (chainAll || isSplice)
	            ? new lodashWrapper(result, chainAll)
	            : result;
	        };
	      });
	    }

	    return lodash;
	  }

	  /*--------------------------------------------------------------------------*/

	  // expose Lo-Dash
	  var _ = runInContext();

	  // some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Expose Lo-Dash to the global object even when an AMD loader is present in
	    // case Lo-Dash is loaded with a RequireJS shim config.
	    // See http://requirejs.org/docs/api.html#config-shim
	    root._ = _;

	    // define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // check for `exports` after `define` in case a build optimizer adds an `exports` object
	  else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = _)._ = _;
	    }
	    // in Narwhal or Rhino -require
	    else {
	      freeExports._ = _;
	    }
	  }
	  else {
	    // in a browser or Rhino
	    root._ = _;
	  }
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)(module), (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Swarm = module.exports = window.Swarm = {};

	Swarm.env = __webpack_require__(5);
	Swarm.Spec = __webpack_require__(6);
	Swarm.LongSpec = __webpack_require__(7);
	Swarm.Syncable = __webpack_require__(8);
	Swarm.Model = __webpack_require__(9);
	Swarm.Set = __webpack_require__(10);
	Swarm.Vector = __webpack_require__(11);
	Swarm.Host = __webpack_require__(12);
	Swarm.Pipe = __webpack_require__(13);
	Swarm.Storage = __webpack_require__(14);
	Swarm.SharedWebStorage = __webpack_require__(15);
	Swarm.LevelStorage = __webpack_require__(16);
	Swarm.WebSocketStream = __webpack_require__(17);
	Swarm.ReactMixin = __webpack_require__(18);

	Swarm.get = function (spec) {
	    return Swarm.env.localhost.get(spec);
	};

	var env = Swarm.env;

	if (env.isWebKit || env.isGecko) {
	    env.log = function css_log(spec, value, replica, host) {
	        if (!host && replica && replica._host) {
	            host = replica._host;
	        }
	        if (value && value.constructor.name === 'Spec') {
	            value = value.toString();
	        }
	        console.log(
	                "%c%s  %c%s  %c%O  %c%s @%c%s",
	                "color: #888",
	                env.multihost ? host && host._id : '',
	                "color: #024; font-style: italic",
	                spec.toString(),
	                "font-style: normal; color: #042",
	                value,
	                "color: #88a",
	                (replica && ((replica.spec && replica.spec().toString()) || replica._id)) ||
	                (replica ? 'no id' : 'undef'),
	                "color: #ccd",
	                replica && replica._host && replica._host._id
	                //replica&&replica.spec&&(replica.spec()+
	                //    (this._host===replica._host?'':' @'+replica._host._id)
	        );
	    };
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/** a really simplistic default hash function */
	function djb2Hash(str) {
	    var hash = 5381;
	    for (var i = 0; i < str.length; i++) {
	        hash = ((hash << 5) + hash) + str.charCodeAt(i);
	    }
	    return hash;
	}

	var env = module.exports = {
	    // maps URI schemes to stream implementations
	    streams: {},
	    // the default host
	    localhost: undefined,
	    // whether multiple hosts are allowed in one process
	    // (that is mostly useful for testing)
	    multihost: false,
	    // hash function used for consistent hashing
	    hashfn: djb2Hash,

	    log: plain_log,
	    debug: false,
	    trace: false,

	    isServer: typeof(navigator) === 'undefined',
	    isBrowser: typeof(navigator) === 'object',
	    isWebKit: false,
	    isGecko: false,
	    isIE: false,
	    clockType: undefined // default
	};

	if (typeof(navigator) === 'object') {
	    var agent = navigator.userAgent;
	    env.isWebKit = /AppleWebKit\/(\S+)/.test(agent);
	    env.isIE = /MSIE ([^;]+)/.test(agent);
	    env.isGecko = /rv:.* Gecko\/\d{8}/.test(agent);
	}

	function plain_log(spec, val, object) {
	    var method = 'log';
	    switch (spec.op()) {
	    case 'error':
	        method = 'error';
	        break;
	    case 'warn':
	        method = 'warn';
	        break;
	    }
	    console[method](spec.toString(), val, object && object._id,
	            '@' + ((object && object._host && object._host._id) || ''));
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	//  S P E C I F I E R
	//
	//  The Swarm aims to switch fully from the classic HTTP
	//  request-response client-server interaction pattern to continuous
	//  real-time synchronization (WebSocket), possibly involving
	//  client-to-client interaction (WebRTC) and client-side storage
	//  (WebStorage). That demands (a) unification of transfer and storage
	//  where possible and (b) transferring, processing and storing of
	//  fine-grained changes.
	//
	//  That's why we use compound event identifiers named *specifiers*
	//  instead of just regular "plain" object ids everyone is so used to.
	//  Our ids have to fully describe the context of every small change as
	//  it is likely to be delivered, processed and stored separately from
	//  the rest of the related state.  For every atomic operation, be it a
	//  field mutation or a method invocation, a specifier contains its
	//  class, object id, a method name and, most importantly, its
	//  version id.
	//
	//  A serialized specifier is a sequence of Base64 tokens each prefixed
	//  with a "quant". A quant for a class name is '/', an object id is
	//  prefixed with '#', a method with '.' and a version id with '!'.  A
	//  special quant '+' separates parts of each token.  For example, a
	//  typical version id looks like "!7AMTc+gritzko" which corresponds to
	//  a version created on Tue Oct 22 2013 08:05:59 GMT by @gritzko (see
	//  Host.time()).
	//
	//  A full serialized specifier looks like
	//        /TodoItem#7AM0f+gritzko.done!7AMTc+gritzko
	//  (a todo item created by @gritzko was marked 'done' by himself)
	//
	//  Specifiers are stored in strings, but we use a lightweight wrapper
	//  class Spec to parse them easily. A wrapper is immutable as we pass
	//  specifiers around a lot.

	function Spec(str, quant) {
	    if (str && str.constructor === Spec) {
	        str = str.value;
	    } else { // later we assume value has valid format
	        str = (str || '').toString();
	        if (quant && str.charAt(0) >= '0') {
	            str = quant + str;
	        }
	        if (str.replace(Spec.reQTokExt, '')) {
	            throw new Error('malformed specifier: ' + str);
	        }
	    }
	    this.value = str;
	    this.index = 0;
	}
	module.exports = Spec;

	Spec.prototype.filter = function (quants) {
	    var filterfn = //typeof(quants)==='function' ? quants :
	                function (token, quant) {
	                    return quants.indexOf(quant) !== -1 ? token : '';
	                };
	    return new Spec(this.value.replace(Spec.reQTokExt, filterfn));
	};
	Spec.pattern = function (spec) {
	    return spec.toString().replace(Spec.reQTokExt, '$1');
	};
	Spec.prototype.isEmpty = function () {
	    return this.value==='';
	};
	Spec.prototype.pattern = function () {
	    return Spec.pattern(this.value);
	};
	Spec.prototype.token = function (quant) {
	    var at = quant ? this.value.indexOf(quant, this.index) : this.index;
	    if (at === -1) {
	        return undefined;
	    }
	    Spec.reQTokExt.lastIndex = at;
	    var m = Spec.reQTokExt.exec(this.value);
	    this.index = Spec.reQTokExt.lastIndex;
	    if (!m) {
	        return undefined;
	    }
	    return {quant: m[1], body: m[2], bare: m[3], ext: m[4]};
	};
	Spec.prototype.get = function specGet(quant) {
	    var i = this.value.indexOf(quant);
	    if (i === -1) {
	        return '';
	    }
	    Spec.reQTokExt.lastIndex = i;
	    var m = Spec.reQTokExt.exec(this.value);
	    return m && m[2];
	};
	Spec.prototype.tok = function specGet(quant) {
	    var i = this.value.indexOf(quant);
	    if (i === -1) { return ''; }
	    Spec.reQTokExt.lastIndex = i;
	    var m = Spec.reQTokExt.exec(this.value);
	    return m && m[0];
	};
	Spec.prototype.has = function specHas(quant) {
	    if (quant.length===1) {
	        return this.value.indexOf(quant) !== -1;
	    } else {
	        var toks = this.value.match(Spec.reQTokExt);
	        return toks.indexOf(quant) !== -1;
	    }
	};
	Spec.prototype.set = function specSet(spec, quant) {
	    var ret = new Spec(spec, quant);
	    var m;
	    Spec.reQTokExt.lastIndex = 0;
	    while (null !== (m = Spec.reQTokExt.exec(this.value))) {
	        if (!ret.has(m[1])) {
	            ret = ret.add(m[0]);
	        }
	    }
	    return ret.sort();
	};
	Spec.prototype.version = function () { return this.get('!'); };
	Spec.prototype.op = function () { return this.get('.'); };
	Spec.prototype.type = function () { return this.get('/'); };
	Spec.prototype.id = function () { return this.get('#'); };
	Spec.prototype.typeid = function () { return this.filter('/#'); };
	Spec.prototype.source = function () { return this.token('!').ext; };

	Spec.prototype.sort = function () {
	    function Q(a, b) {
	        var qa = a.charAt(0), qb = b.charAt(0), q = Spec.quants;
	        return (q.indexOf(qa) - q.indexOf(qb)) || (a < b);
	    }

	    var split = this.value.match(Spec.reQTokExt);
	    return new Spec(split ? split.sort(Q).join('') : '');
	};

	Spec.prototype.add = function (spec, quant) {
	    if (spec.constructor !== Spec) {
	        spec = new Spec(spec, quant);
	    }
	    return new Spec(this.value + spec.value);
	};
	Spec.prototype.toString = function () { return this.value; };


	Spec.int2base = function (i, padlen) {
	    if (i < 0 || i >= (1 << 30)) {
	        throw new Error('out of range');
	    }
	    var ret = '', togo = padlen || 5;
	    for (; i || (togo > 0); i >>= 6, togo--) {
	        ret = Spec.base64.charAt(i & 63) + ret;
	    }
	    return ret;
	};

	Spec.prototype.fits = function (specFilter) {
	    var myToks = this.value.match(Spec.reQTokExt);
	    var filterToks = specFilter.match(Spec.reQTokExt), tok;
	    while (tok=filterToks.pop()) {
	        if (myToks.indexOf(tok) === -1) {
	            return false;
	        }
	    }
	    return true;
	};

	Spec.base2int = function (base) {
	    var ret = 0, l = base.match(Spec.re64l);
	    for (var shift = 0; l.length; shift += 6) {
	        ret += Spec.base64.indexOf(l.pop()) << shift;
	    }
	    return ret;
	};
	Spec.parseToken = function (token_body) {
	    Spec.reTokExt.lastIndex = -1;
	    var m = Spec.reTokExt.exec(token_body);
	    if (!m) {
	        return null;
	    }
	    return {bare: m[1], ext: m[2] || 'swarm'}; // FIXME not generic
	};

	Spec.base64 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~';
	Spec.rT = '[0-9A-Za-z_~]{1,80}'; // 60*8 bits is enough for everyone
	Spec.reTok = new RegExp('^'+Spec.rT+'$'); // plain no-extension token
	Spec.re64l = new RegExp('[0-9A-Za-z_~]', 'g');
	Spec.quants = ['/', '#', '!', '.'];
	Spec.rsTokExt = '^(=)(?:\\+(=))?$'.replace(/=/g, Spec.rT);
	Spec.reTokExt = new RegExp(Spec.rsTokExt);
	Spec.rsQTokExt = '([/#\\.!\\*])((=)(?:\\+(=))?)'.replace(/=/g, Spec.rT);
	Spec.reQTokExt = new RegExp(Spec.rsQTokExt, 'g');
	Spec.is = function (str) {
	    if (str === null || str === undefined) {
	        return false;
	    }
	    return str.constructor === Spec || '' === str.toString().replace(Spec.reQTokExt, '');
	};
	Spec.as = function (spec) {
	    if (!spec) {
	        return new Spec('');
	    } else {
	        return spec.constructor === Spec ? spec : new Spec(spec);
	    }
	};

	Spec.Map = function VersionVectorAsAMap(vec) {
	    this.map = {};
	    if (vec) {
	        this.add(vec);
	    }
	};
	Spec.Map.prototype.add = function (versionVector) {
	    var vec = new Spec(versionVector, '!'), tok;
	    while (undefined !== (tok = vec.token('!'))) {
	        var time = tok.bare, source = tok.ext || 'swarm';
	        if (time > (this.map[source] || '')) {
	            this.map[source] = time;
	        }
	    }
	};
	Spec.Map.prototype.covers = function (version) {
	    Spec.reTokExt.lastIndex = 0;
	    var m = Spec.reTokExt.exec(version);
	    var ts = m[1], src = m[2] || 'swarm';
	    return ts <= (this.map[src] || '');
	};
	Spec.Map.prototype.maxTs = function () {
	    var ts = null,
	        map = this.map;
	    for (var src in map) {
	        if (!ts || ts < map[src]) {
	            ts = map[src];
	        }
	    }
	    return ts;
	};
	Spec.Map.prototype.toString = function (trim) {
	    trim = trim || {top: 10, rot: '0'};
	    var top = trim.top || 10,
	        rot = '!' + (trim.rot || '0'),
	        ret = [],
	        map = this.map;
	    for (var src in map) {
	        ret.push('!' + map[src] + (src === 'swarm' ? '' : '+' + src));
	    }
	    ret.sort().reverse();
	    while (ret.length > top || ret[ret.length - 1] <= rot) {
	        ret.pop();
	    }
	    return ret.join('') || '!0';
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Spec = __webpack_require__(6);

	/**LongSpec is a Long Specifier, i.e. a string of quant+id tokens that may be
	 * indeed very (many megabytes) long.  Ids are compressed using
	 * dynamic dictionaries (codebooks) or "unicode numbers" (base-32768
	 * encoding utilizing Unicode symbols as quasi-binary).  Unicode
	 * numbers are particularly handy for encoding timestamps.  LongSpecs
	 * may be assigned shared codebooks (2nd parameter); a codebook is an
	 * object containing encode/decode tables and some stats, e.g.
	 * {en:{'/Type':'/T'}, de:{'/T':'/Type'}}. It is OK to pass an empty object as
	 * a codebook; it gets initialized automatically).  */
	var LongSpec = function (spec, codeBook) {
	    var cb = this.codeBook = codeBook || {en:{},de:{}};
	    if (!cb.en) { cb.en = {}; }
	    if (!cb.de) { // revert en to make de
	        cb.de = {};
	        for(var tok in cb.en) {
	            cb.de[cb.en[tok]] = tok;
	        }
	    }
	    if (!cb.lastCodes) {
	        cb.lastCodes = {'/':0x30,'#':0x30,'!':0x30,'.':0x30,'+':0x30};
	    }
	    // For a larger document, a single LongSpec may be some megabytes long.
	    // As we don't want to rewrite those megabytes on every keypress, we
	    // divide data into chunks.
	    this.chunks = [];
	    this.chunkLengths = [];
	    if (spec) {
	        this.append(spec);
	    }
	};

	LongSpec.reQTokEn = /([/#\!\.\+])([0-\u802f]+)/g;
	LongSpec.reQTok = new RegExp('([/#\\.!\\*\\+])(=)'.replace(/=/g, Spec.rT), 'g');
	LongSpec.rTEn = '[0-\\u802f]+';
	LongSpec.reQTokExtEn = new RegExp
	    ('([/#\\.!\\*])((=)(?:\\+(=))?)'.replace(/=/g, LongSpec.rTEn), 'g');

	/** Well, for many-MB LongSpecs this may take some time. */
	LongSpec.prototype.toString = function () {
	    var ret = [];
	    for(var i = this.iterator(); !i.end(); i.next()){
	        ret.push(i.decode());
	    }
	    return ret.join('');
	};

	LongSpec.prototype.length = function () { // TODO .length ?
	    var len = 0;
	    for(var i=0; i<this.chunks.length; i++) {
	        len += this.chunkLengths[i];
	    }
	    return len;
	};

	LongSpec.prototype.charLength = function () {
	    var len = 0;
	    for(var i=0; i<this.chunks.length; i++) {
	        len += this.chunks[i].length;
	    }
	    return len;
	};

	//   T O K E N  C O M P R E S S I O N

	LongSpec.prototype.allocateCode = function (tok) {
	    var quant = tok.charAt(0);
	    //if (Spec.quants.indexOf(quant)===-1) {throw new Error('invalid token');}
	    var en, cb = this.codeBook, lc = cb.lastCodes;
	    if (lc[quant]<'z'.charCodeAt(0)) { // pick a nice letter
	        for(var i=1; !en && i<tok.length; i++) {
	            var x = tok.charAt(i), e = quant+x;
	            if (!cb.de[e]) {  en = e;  }
	        }
	    }
	    while (!en && lc[quant]<0x802f) {
	        var y = String.fromCharCode(lc[quant]++);
	        var mayUse = quant + y;
	        if ( ! cb.en[mayUse] ) {  en = mayUse;  }
	    }
	    if (!en) {
	        if (tok.length<=3) {
	            throw new Error("out of codes");
	        }
	        en = tok;
	    }
	    cb.en[tok] = en;
	    cb.de[en] = tok;
	    return en;
	};

	//  F O R M A T  C O N V E R S I O N


	/** Always 2-char base2^15 coding for an int (0...2^30-1) */
	LongSpec.int2uni = function (i) {
	    if (i<0 || i>0x7fffffff) { throw new Error('int is out of range'); }
	    return String.fromCharCode( 0x30+(i>>15), 0x30+(i&0x7fff) );
	};

	LongSpec.uni2int = function (uni) {
	    if (!/^[0-\u802f]{2}$/.test(uni)) {
	        throw new Error('invalid unicode number') ;
	    }
	    return ((uni.charCodeAt(0)-0x30)<<15) | (uni.charCodeAt(1)-0x30);
	};

	//  I T E R A T O R S

	/*  Unfortunately, LongSpec cannot be made a simple array because tokens are
	    not fixed-width in the general case. Some tokens are dictionary-encoded
	    into two-symbol segments, e.g. ".on" --> ".o". Other tokens may need 6
	    symbols to encode, e.g. "!timstse+author~ssn" -> "!tss+a".
	    Also, iterators opportuniatically use sequential compression. Namely,
	    tokens that differ by +1 are collapsed into quant-only sequences:
	    "!abc+s!abd+s" -> "!abc+s!"
	    So, locating and iterating becomes less-than-trivial. Raw string offsets
	    better not be exposed in the external interface; hence, we need iterators.

	    {
	        offset:5,       // char offset in the string (chunk)
	        index:1,        // index of the entry (token)
	        en: "!",        // the actual matched token (encoded)
	        chunk:0,        // index of the chunk
	        de: "!timst00+author~ssn", // decoded token
	        seqstart: "!ts0+a", // first token of the sequence (encoded)
	        seqoffset: 3    // offset in the sequence
	    }
	*/
	LongSpec.Iterator = function Iterator (owner, index) {
	    this.owner = owner;         // our LongSpec
	    /*this.chunk = 0;             // the chunk we are in
	    this.index = -1;            // token index (position "before the 1st token")
	    this.chunkIndex = -1;       // token index within the chunk
	    this.prevFull = undefined;  // previous full (non-collapsed) token
	    //  seqStart IS the previous match or prev match is trivial
	    this.prevCollapsed = 0;
	    this.match = null;
	    //this.next();*/
	    this.skip2chunk(0);
	    if (index) {
	        if (index.constructor===LongSpec.Iterator) {
	            index = index.index;
	        }
	        this.skip(index);
	    }
	};


	// also matches collapsed quant-only tokens
	LongSpec.Iterator.reTok = new RegExp
	    ('([/#\\.!\\*])((=)(?:\\+(=))?)?'.replace(/=/g, LongSpec.rTEn), 'g');


	/* The method converts a (relatively) verbose Base64 specifier into an
	 * internal compressed format.  Compressed tokens are also
	 * variable-length; the length of the token depends on the encoding
	 * method used.
	 * 1 unicode symbol: dictionary-encoded (up to 2^15 entries for each quant),
	 * 2 symbols: simple timestamp base-2^15 encoded,
	 * 3 symbols: timestamp+seq base-2^15,
	 * 4 symbols: long-number base-2^15,
	 * 5 symbols and more: unencoded original (fallback).
	 * As long as two sequential unicoded entries differ by +1 in the body
	 * of the token (quant and extension being the same), we use sequential
	 * compression. The token is collapsed (only the quant is left).
	 * */
	LongSpec.Iterator.prototype.encode = function encode (de) {
	    var re = Spec.reQTokExt;
	    re.lastIndex = 0;
	    var m=re.exec(de); // this one is de
	    if (!m || m[0].length!==de.length) {throw new Error('malformed token: '+de);}
	    var tok=m[0], quant=m[1], body=m[3], ext=m[4];
	    var pm = this.prevFull; // this one is en
	    var prevTok, prevQuant, prevBody, prevExt;
	    var enBody, enExt;
	    if (pm) {
	        prevTok=pm[0], prevQuant=pm[1], prevBody=pm[3], prevExt=pm[4]?'+'+pm[4]:undefined;
	    }
	    if (ext) {
	        enExt = this.owner.codeBook.en['+'+ext] || this.owner.allocateCode('+'+ext);
	    }
	    var maySeq = pm && quant===prevQuant && enExt===prevExt;
	    var haveSeq=false, seqBody = '';
	    var int1, int2, uni1, uni2;
	    //var expected = head + (counter===-1?'':Spec.int2base(counter+inc,1)) + tail;
	    if ( body.length<=4 ||          // TODO make it a switch
	         (quant in LongSpec.quants2code) ||
	         (tok in this.owner.codeBook.en) ) {  // 1 symbol by the codebook

	        enBody = this.owner.codeBook.en[quant+body] ||
	                 this.owner.allocateCode(quant+body);
	        enBody = enBody.substr(1); // FIXME separate codebooks 4 quants
	        if (maySeq) {// seq coding for dictionary-coded
	            seqBody = enBody;
	        }
	    } else if (body.length===5) { // 2-symbol base-2^15
	        var int = Spec.base2int(body);
	        enBody = LongSpec.int2uni(int);
	        if (maySeq && prevBody.length===2) {
	            seqBody = LongSpec.int2uni(int-this.prevCollapsed-1);
	        }
	    } else if (body.length===7) { // 3-symbol base-2^15
	        int1 = Spec.base2int(body.substr(0,5));
	        int2 = Spec.base2int(body.substr(5,2));
	        uni1 = LongSpec.int2uni(int1);
	        uni2 = LongSpec.int2uni(int2).charAt(1);
	        enBody = uni1 + uni2;
	        if (maySeq && prevBody.length===3) {
	            seqBody = uni1 + LongSpec.int2uni(int2-this.prevCollapsed-1).charAt(1);
	        }
	    } else if (body.length===10) { // 4-symbol 60-bit long number
	        int1 = Spec.base2int(body.substr(0,5));
	        int2 = Spec.base2int(body.substr(5,5));
	        uni1 = LongSpec.int2uni(int1);
	        uni2 = LongSpec.int2uni(int2);
	        enBody = uni1 + uni2;
	        if (maySeq && prevBody.length===4) {
	            seqBody = uni1+LongSpec.int2uni(int2-this.prevCollapsed-1);
	        }
	    } else { // verbatim
	        enBody = body;
	        seqBody = enBody;
	    }
	    haveSeq = seqBody===prevBody;
	    return haveSeq ? quant : quant+enBody+(enExt||'');
	};
	LongSpec.quants2code = {'/':1,'.':1};

	/** Decode a compressed specifier back into base64. */
	LongSpec.Iterator.prototype.decode = function decode () {
	    if (this.match===null) { return undefined; }
	    var quant = this.match[1];
	    var body = this.match[3];
	    var ext = this.match[4];
	    var pm=this.prevFull, prevTok, prevQuant, prevBody, prevExt;
	    var int1, int2, base1, base2;
	    var de = quant;
	    if (pm) {
	        prevTok=pm[0], prevQuant=pm[1], prevBody=pm[3], prevExt=pm[4];
	    }
	    if (!body) {
	        if (prevBody.length===1) {
	            body = prevBody;
	        } else {
	            var l_1 = prevBody.length-1;
	            var int = prevBody.charCodeAt(l_1);
	            body = prevBody.substr(0,l_1) + String.fromCharCode(int+this.prevCollapsed+1);
	        }
	        ext = prevExt;
	    }
	    switch (body.length) {
	        case 1:
	            de += this.owner.codeBook.de[quant+body].substr(1); // TODO sep codebooks
	            break;
	        case 2:
	            int1 = LongSpec.uni2int(body);
	            base1 = Spec.int2base(int1,5);
	            de += base1;
	            break;
	        case 3:
	            int1 = LongSpec.uni2int(body.substr(0,2));
	            int2 = LongSpec.uni2int('0'+body.charAt(2));
	            base1 = Spec.int2base(int1,5);
	            base2 = Spec.int2base(int2,2);
	            de += base1 + base2;
	            break;
	        case 4:
	            int1 = LongSpec.uni2int(body.substr(0,2));
	            int2 = LongSpec.uni2int(body.substr(2,2));
	            base1 = Spec.int2base(int1,5);
	            base2 = Spec.int2base(int2,5);
	            de += base1 + base2;
	            break;
	        default:
	            de += body;
	            break;
	    }
	    if (ext) {
	        var deExt = this.owner.codeBook.de['+'+ext];
	        de += deExt;
	    }
	    return de;
	};


	LongSpec.Iterator.prototype.next = function ( ) {

	    if (this.end()) {return;}

	    var re = LongSpec.Iterator.reTok;
	    re.lastIndex = this.match ? this.match.index+this.match[0].length : 0;
	    var chunk = this.owner.chunks[this.chunk];

	    if (chunk.length===re.lastIndex) {
	        this.chunk++;
	        this.chunkIndex = 0;
	        if (this.match && this.match[0].length>0) {
	            this.prevFull = this.match;
	            this.prevCollapsed = 0;
	        } else if (this.match) {
	            this.prevCollapsed++;
	        } else { // empty
	            this.prevFull = undefined;
	            this.prevCollapsed = 0;
	        }
	        this.match = null;
	        this.index ++;
	        if (this.end()) {return;}
	    }

	    if (this.match[0].length>1) {
	        this.prevFull = this.match;
	        this.prevCollapsed = 0;
	    } else {
	        this.prevCollapsed++;
	    }

	    this.match = re.exec(chunk);
	    this.index++;
	    this.chunkIndex++;

	    return this.match[0];
	};


	LongSpec.Iterator.prototype.end = function () {
	    return this.match===null && this.chunk===this.owner.chunks.length;
	};


	LongSpec.Iterator.prototype.skip = function ( count ) {
	    // TODO may implement fast-skip of seq-compressed spans
	    var lengths = this.owner.chunkLengths, chunks = this.owner.chunks;
	    count = count || 1;
	    var left = count;
	    var leftInChunk = lengths[this.chunk]-this.chunkIndex;
	    if ( leftInChunk <= count ) { // skip chunks
	        left -= leftInChunk; // skip the current chunk
	        var c=this.chunk+1;    // how many extra chunks to skip
	        while (left>chunks[c] && c<chunks.length) {
	            left-=chunks[++c];
	        }
	        this.skip2chunk(c);
	    }
	    if (this.chunk<chunks.length) {
	        while (left>0) {
	            this.next();
	            left--;
	        }
	    }
	    return count - left;
	};

	/** Irrespectively of the current state of the iterator moves it to the
	  * first token in the chunk specified; chunk===undefined moves it to
	  * the end() position (one after the last token). */
	LongSpec.Iterator.prototype.skip2chunk = function ( chunk ) {
	    var chunks = this.owner.chunks;
	    if (chunk===undefined) {chunk=chunks.length;}
	    this.index = 0;
	    for(var c=0; c<chunk; c++) { // TODO perf pick the current value
	        this.index += this.owner.chunkLengths[c];
	    }
	    this.chunkIndex = 0;
	    this.chunk = chunk;
	    var re = LongSpec.Iterator.reTok;
	    if ( chunk < chunks.length ) {
	        re.lastIndex = 0;
	        this.match = re.exec(chunks[this.chunk]);
	    } else {
	        this.match = null;
	    }
	    if (chunk>0) { // (1) chunks must not be empty; (2) a chunk starts with a full token
	        var prev = chunks[chunk-1];
	        var j = 0;
	        while (Spec.quants.indexOf(prev.charAt(prev.length-1-j)) !== -1) { j++; }
	        this.prevCollapsed = j;
	        var k = 0;
	        while (Spec.quants.indexOf(prev.charAt(prev.length-1-j-k))===-1) { k++; }
	        re.lastIndex = prev.length-1-j-k;
	        this.prevFull = re.exec(prev);
	    } else {
	        this.prevFull = undefined;
	        this.prevCollapsed = 0;
	    }
	};

	LongSpec.Iterator.prototype.token = function () {
	    return this.decode();
	};

	/*LongSpec.Iterator.prototype.de = function () {
	    if (this.match===null) {return undefined;}
	    return this.owner.decode(this.match[0],this.prevFull?this.prevFull[0]:undefined,this.prevCollapsed);
	};*/

	/*LongSpec.Iterator.prototype.insertDe = function (de) {
	    var en = this.owner.encode(de,this.prevFull?this.prevFull[0]:undefined,this.prevCollapsed);
	    this.insert(en);
	};*/


	/** As sequential coding is incapsulated in LongSpec.Iterator, inserts are
	  * done by Iterator as well. */
	LongSpec.Iterator.prototype.insert = function (de) { // insertBefore

	    var insStr = this.encode(de);

	    var brokenSeq = this.match && this.match[0].length===1;

	    var re = LongSpec.Iterator.reTok;
	    var chunks = this.owner.chunks, lengths = this.owner.chunkLengths;
	    if (this.chunk==chunks.length) { // end(), append
	        if (chunks.length>0) {
	            var ind = this.chunk - 1;
	            chunks[ind] += insStr;
	            lengths[ind] ++;
	        } else {
	            chunks.push(insStr);
	            lengths.push(1);
	            this.chunk++;
	        }
	    } else {
	        var chunkStr = chunks[this.chunk];
	        var preEq = chunkStr.substr(0, this.match.index);
	        var postEq = chunkStr.substr(this.match.index);
	        if (brokenSeq) {
	            var me = this.token();
	            this.prevFull = undefined;
	            var en = this.encode(me);
	            chunks[this.chunk] = preEq + insStr + en + postEq.substr(1);
	            re.lastIndex = preEq.length + insStr.length;
	            this.match = re.exec(chunks[this.chunk]);
	        } else {
	            chunks[this.chunk] = preEq + insStr + /**/ postEq;
	            this.match.index += insStr.length;
	        }
	        lengths[this.chunk] ++;
	        this.chunkIndex ++;
	    }
	    this.index ++;
	    if (insStr.length>1) {
	        re.lastIndex = 0;
	        this.prevFull = re.exec(insStr);
	        this.prevCollapsed = 0;
	    } else {
	        this.prevCollapsed++;
	    }

	    // may split chunks
	    // may join chunks
	};

	LongSpec.Iterator.prototype.insertBlock = function (de) { // insertBefore
	    var re = Spec.reQTokExt;
	    var toks = de.match(re).reverse(), tok;
	    while (tok=toks.pop()) {
	        this.insert(tok);
	    }
	};

	LongSpec.Iterator.prototype.erase = function (count) {
	    if (this.end()) {return;}
	    count = count || 1;
	    var chunks = this.owner.chunks;
	    var lengths = this.owner.chunkLengths;
	    // remember offsets
	    var fromChunk = this.chunk;
	    var fromOffset = this.match.index;
	    var fromChunkIndex = this.chunkIndex; // TODO clone USE 2 iterators or i+c

	    count = this.skip(count); // checked for runaway skip()
	    // the iterator now is at the first-after-erased pos

	    var tillChunk = this.chunk;
	    var tillOffset = this.match ? this.match.index : 0; // end()

	    var collapsed = this.match && this.match[0].length===1;

	    // splice strings, adjust indexes
	    if (fromChunk===tillChunk) {
	        var chunk = chunks[this.chunk];
	        var pre = chunk.substr(0,fromOffset);
	        var post = chunk.substr(tillOffset);
	        if (collapsed) { // sequence is broken now; needs expansion
	            post = this.token() + post.substr(1);
	        }
	        chunks[this.chunk] = pre + post;
	        lengths[this.chunk] -= count;
	        this.chunkIndex -= count;
	    } else {  // FIXME refac, more tests (+wear)
	        if (fromOffset===0) {
	            fromChunk--;
	        } else {
	            chunks[fromChunk] = chunks[fromChunk].substr(0,fromOffset);
	            lengths[fromChunk] = fromChunkIndex;
	        }
	        var midChunks = tillChunk - fromChunk - 1;
	        if (midChunks) { // wipe'em out
	            //for(var c=fromChunk+1; c<tillChunk; c++) ;
	            chunks.splice(fromChunk+1,midChunks);
	            lengths.splice(fromChunk+1,midChunks);
	        }
	        if (tillChunk<chunks.length && tillOffset>0) {
	            chunks[tillChunk] = chunks[tillChunk].substr(this.match.index);
	            lengths[tillChunk] -= this.chunkIndex;
	            this.chunkIndex = 0;
	        }
	    }
	    this.index -= count;

	};


	LongSpec.Iterator.prototype.clone = function () {
	    var copy = new LongSpec.Iterator(this.owner);
	    copy.chunk = this.chunk;
	    copy.match = this.match;
	    copy.index = this.index;
	};

	//  L O N G S P E C  A P I

	LongSpec.prototype.iterator = function (index) {
	    return new LongSpec.Iterator(this,index);
	};

	LongSpec.prototype.end = function () {
	    var e = new LongSpec.Iterator(this);
	    e.skip2chunk(this.chunks.length);
	    return e;
	};

	/** Insert a token at a given position. */
	LongSpec.prototype.insert = function (tok, i) {
	    var iter = i.constructor===LongSpec.Iterator ? i : this.iterator(i);
	    iter.insertBlock(tok);
	};

	LongSpec.prototype.tokenAt = function (pos) {
	    var iter = this.iterator(pos);
	    return iter.token();
	};

	LongSpec.prototype.indexOf = function (tok, startAt) {
	    var iter = this.find(tok,startAt);
	    return iter.end() ? -1 : iter.index;
	};

	/*LongSpec.prototype.insertAfter = function (tok, i) {
	    LongSpec.reQTokExtEn.lastIndex = i;
	    var m = LongSpec.reQTokExtEn.exec(this.value);
	    if (m.index!==i) { throw new Error('incorrect position'); }
	    var splitAt = i+m[0].length;
	    this.insertBefore(tok,splitAt);
	};*/

	LongSpec.prototype.add = function ls_add (spec) {
	    var pos = this.end();
	    pos.insertBlock(spec);
	};
	LongSpec.prototype.append = LongSpec.prototype.add;

	/** The method finds the first occurence of a token, returns an
	 * iterator.  While the internal format of an iterator is kind of
	 * opaque, and generally is not recommended to rely on, that is
	 * actually a regex match array. Note that it contains encoded tokens.
	 * The second parameter is the position to start scanning from, passed
	 * either as an iterator or an offset. */
	LongSpec.prototype.find = function (tok, startIndex) {
	    //var en = this.encode(tok).toString(); // don't split on +
	    var i = this.iterator(startIndex);
	    while (!i.end()) {
	        if (i.token()===tok) {
	            return i;
	        }
	        i.next();
	    }
	    return i;
	};

	module.exports = LongSpec;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Spec = __webpack_require__(6);
	var env = __webpack_require__(5);

	/**
	 * Syncable: an oplog-synchronized object
	 * @constructor
	 */
	function Syncable() {
	    // listeners represented as objects that have deliver() method
	    this._lstn = [',']; // we unshift() uplink listeners and push() downlinks
	    // ...so _lstn is like [server1, server2, storage, ',', view, listener]
	    // The most correct way to specify a version is the version vector,
	    // but that one may consume more space than the data itself in some cases.
	    // Hence, _version is not a fully specified version vector (see version()
	    // instead). _version is essentially is the greatest operation timestamp
	    // (Lamport-like, i.e. "time+source"), sometimes amended with additional
	    // timestamps. Its main features:
	    // (1) changes once the object's state changes
	    // (2) does it monotonically (in the alphanum order sense)
	    this._version = '';
	    // make sense of arguments
	    var args = Array.prototype.slice.call(arguments);
	    this._host = (args.length && args[args.length - 1]._type === 'Host') ?
	            args.pop() : env.localhost;
	    if (Spec.is(args[0])) {
	        this._id = new Spec(args.shift()).id() || this._host.time();
	    } else if (typeof(args[0]) === 'string') {
	        this._id = args.shift(); // TODO format
	    } else {
	        this._id = this._host.time();
	        this._version = '!0'; // may apply state in the constructor, see Model
	    }
	    //var state = args.length ? args.pop() : (fresh?{}:undefined);
	    // register with the host
	    var doubl = this._host.register(this);
	    if (doubl !== this) { return doubl; }
	    // locally created objects get state immediately
	    // (while external-id objects need to query uplinks)
	    /*if (fresh && state) {
	     state._version = '!'+this._id;
	     var pspec = this.spec().add(state._version).add('.init');
	     this.deliver(pspec,state,this._host);
	     }*/
	    this.reset();
	    // find uplinks, subscribe
	    this.checkUplink();
	    // TODO inplement state push
	    return this;
	}
	module.exports = Syncable;

	Syncable.types = {};
	Syncable.isOpSink = function (obj) {
	    if (!obj) { return false; }
	    if (obj.constructor === Function) { return true; }
	    if (obj.deliver && obj.deliver.constructor === Function) { return true; }
	    return false;
	};
	Syncable.reMethodName = /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/;
	Syncable.memberClasses = {ops:1,neutrals:1,remotes:1,defaults:1,reactions:1,mixins:1};
	Syncable._default = {};

	function fnname(fn) {
	    if (fn.name) { return fn.name; }
	    return fn.toString().match(/^function\s*([^\s(]+)/)[1];
	}


	/**
	 * All CRDT model classes must extend syncable directly or indirectly. Syncable
	 * provides all the necessary oplog- and state-related primitives and methods.
	 * Every state-mutating method should be explicitly declared to be wrapped
	 * by extend() (see 'ops', 'neutrals', 'remotes' sections in class declaration).
	 * @param {function|string} fn
	 * @param {{ops:object, neutrals:object, remotes:object}} own
	 */
	Syncable.extend = function (fn, own) {
	    var parent = this, fnid;
	    if (fn.constructor !== Function) {
	        var id = fn.toString();
	        fn = function SomeSyncable() {
	            return parent.apply(this, arguments);
	        };
	        fnid = id; // if only it worked
	    } else { // please call Syncable.constructor.apply(this,args) in your constructor
	        fnid = fnname(fn);
	    }

	    // inheritance trick from backbone.js
	    var SyncProto = function () {
	        this.constructor = fn;
	        this._neutrals = {};
	        this._ops = {};
	        this._reactions = {};

	        var event,
	            name;
	        if (parent._pt) {
	            //copy _neutrals & _ops from parent
	            for (event in parent._pt._neutrals) {
	                this._neutrals[event] = parent._pt._neutrals[event];
	            }
	            for (event in parent._pt._ops) {
	                this._ops[event] = parent._pt._ops[event];
	            }
	        }

	        // "Methods" are serialized, logged and delivered to replicas
	        for (name in own.ops || {}) {
	            if (Syncable.reMethodName.test(name)) {
	                this._ops[name] = own.ops[name];
	                this[name] = wrapCall(name);
	            } else {
	                console.warn('invalid op name:',name);
	            }
	        }

	        // "Neutrals" don't change the state
	        for (name in own.neutrals || {}) {
	            if (Syncable.reMethodName.test(name)) {
	                this._neutrals[name] = own.neutrals[name];
	                this[name] = wrapCall(name);
	            } else {
	                console.warn('invalid neutral op name:',name);
	            }
	        }

	        // "Remotes" are serialized and sent upstream (like RPC calls)
	        for (name in own.remotes || {}) {
	            if (Syncable.reMethodName.test(name)) {
	                this[name] = wrapCall(name);
	            } else {
	                console.warn('invalid rpc name:',name);
	            }
	        }

	        // add mixins
	        (own.mixins || []).forEach(function (mixin) {
	            for (var name in mixin) {
	                this[name] = mixin[name];
	            }
	        }, this);

	        // add other members
	        for (name in own) {
	            if (Syncable.reMethodName.test(name)) {
	                var memberType = own[name].constructor;
	                if (memberType === Function) { // non-op method
	                    // these must change state ONLY by invoking ops
	                    this[name] = own[name];
	                } else if (memberType===String || memberType===Number) {
	                    this[name] = own[name]; // some static constant, OK
	                } else if (name in Syncable.memberClasses) {
	                    // see above
	                    continue;
	                } else {
	                    console.warn('invalid member:',name,memberType);
	                }
	            } else {
	                console.warn('invalid member name:',name);
	            }
	        }

	        // add reactions
	        for (name in own.reactions || {}) {
	            var reaction = own.reactions[name];
	            if (!reaction) { continue; }

	            switch (typeof reaction) {
	            case 'function':
	                // handler-function
	                this._reactions[name] = [reaction];
	                break;
	            case 'string':
	                // handler-method name
	                this._reactions[name] = [this[name]];
	                break;
	            default:
	                if (reaction.constructor === Array) {
	                    // array of handlers
	                    this._reactions[name] = reaction.map(function (item) {
	                        switch (typeof item) {
	                        case 'function':
	                            return item;
	                        case 'string':
	                            return this[item];
	                        default:
	                            throw new Error('unexpected reaction type');
	                        }
	                    }, this);
	                } else {
	                    throw new Error('unexpected reaction type');
	                }
	            }
	        }

	        var syncProto = this;
	        this.callReactions = function (spec, value, src) {
	            var superReactions = syncProto._super.callReactions;
	            if ('function' === typeof superReactions) {
	                superReactions.call(this, spec, value, src);
	            }
	            var r = syncProto._reactions[spec.op()];
	            if (r) {
	                r.constructor !== Array && (r = [r]);
	                for (var i = 0; i < r.length; i++) {
	                    r[i] && r[i].call(this, spec, value, src);
	                }
	            }
	        };

	        this._super = parent.prototype;
	        this._type = fnid;
	    };

	    SyncProto.prototype = parent.prototype;
	    fn.prototype = new SyncProto();
	    fn._pt = fn.prototype; // just a shortcut

	    // default field values
	    var key;
	    var defs = fn.defaults = {};
	    for (key in (parent.defaults || {})) {
	        defs[key] = normalizeDefault(parent.defaults[key]);
	    }
	    for (key in (own.defaults || {})) {
	        defs[key] = normalizeDefault(own.defaults[key]);
	    }

	    function normalizeDefault(val) {
	        if (val && val.type) {
	            return val;
	        }
	        if (val && val.constructor === Function) {
	            return {type: val, value: undefined};
	        }
	        return {type:null, value: val};
	    }

	    // signature normalization for logged/remote/local method calls;
	    function wrapCall(name) {
	        return function wrapper() {
	            // assign a Lamport timestamp
	            var spec = this.newEventSpec(name);
	            var args = Array.prototype.slice.apply(arguments), lstn;
	            // find the callback if any
	            Syncable.isOpSink(args[args.length - 1]) && (lstn = args.pop());
	            // prettify the rest of the arguments
	            if (!args.length) {  // FIXME isn't it confusing?
	                args = ''; // used as 'empty'
	            } else if (args.length === 1) {
	                args = args[0]; // {key:val}
	            }
	            // TODO log 'initiated'
	            return this.deliver(spec, args, lstn);
	        };
	    }

	    // finishing touches
	    fn._super = parent;
	    fn.extend = this.extend;
	    fn.addReaction = this.addReaction;
	    fn.removeReaction = this.removeReaction;
	    Syncable.types[fnid] = fn;
	    return fn;
	};

	/**
	 * A *reaction* is a hybrid of a listener and a method. It "reacts" on a
	 * certain event for all objects of that type. The callback gets invoked
	 * as a method, i.e. this===syncableObj. In an event-oriented architecture
	 * reactions are rather handy, e.g. for creating mixins.
	 * @param {string} op operation name
	 * @param {function} fn callback
	 * @returns {{op:string, fn:function}}
	 */
	Syncable.addReaction = function (op, fn) {
	    var reactions = this.prototype._reactions;
	    var list = reactions[op];
	    list || (list = reactions[op] = []);
	    list.push(fn);
	    return {op: op, fn: fn};
	};

	/**
	 *
	 * @param handle
	 */
	Syncable.removeReaction = function (handle) {
	    var op = handle.op,
	        fn = handle.fn,
	        list = this.prototype._reactions[op],
	        i = list.indexOf(fn);
	    if (i === -1) {
	        throw new Error('reaction unknown');
	    }
	    list[i] = undefined; // such a peculiar pattern not to mess up out-of-callback removal
	    while (list.length && !list[list.length - 1]) {
	        list.pop();
	    }
	};

	/**
	 * compare two listeners
	 * @param {{deliver:function, _src:*, sink:function}} ln listener from syncable._lstn
	 * @param {function|{deliver:function}} other some other listener or function
	 * @returns {boolean}
	 */
	Syncable.listenerEquals = function (ln, other) {
	    return !!ln && ((ln === other) ||
	        (ln._src && ln._src === other) ||
	        (ln.fn && ln.fn === other) ||
	        (ln.sink && ln.sink === other));
	};

	// Syncable includes all the oplog, change propagation and distributed
	// garbage collection logix.
	Syncable.extend(Syncable, {  // :P
	    /**
	     * @returns {Spec} specifier "/Type#objid"
	     */
	    spec: function () { return new Spec('/' + this._type + '#' + this._id); },

	    /**
	     * Generates new specifier with unique version
	     * @param {string} op operation
	     * @returns {Spec}
	     */
	    newEventSpec: function (op) {
	        return this.spec().add(this._host.time(), '!').add(op, '.');
	    },

	    /**
	     * Returns current object state specifier
	     * @returns {string} specifier "/Type#objid!version+source[!version+source2...]"
	     */
	    stateSpec: function () {
	        return this.spec() + (this._version || ''); //?
	    },

	    /**
	     * Applies a serialized operation (or a batch thereof) to this replica
	     */
	    deliver: function (spec, value, lstn) {
	        spec = Spec.as(spec);
	        var opver = '!' + spec.version();
	        var error;

	        function fail(msg, ex) {
	            console.error(msg, spec, value, (ex && ex.stack) || ex || new Error(msg));
	            if (typeof(lstn) === 'function') {
	                lstn(spec.set('.fail'), msg);
	            } else if (lstn && typeof(lstn.error) === 'function') {
	                lstn.error(spec, msg);
	            } // else { } no callback provided
	        }

	        // sanity checks
	        if (spec.pattern() !== '/#!.') {
	            return fail('malformed spec', spec);
	        }
	        if (!this._id) {
	            return fail('undead object invoked');
	        }
	        if (error = this.validate(spec, value)) {
	            return fail('invalid input, ' + error, value);
	        }
	        if (!this.acl(spec, value, lstn)) {
	            return fail('access violation', spec);
	        }

	        env.debug && env.log(spec, value, lstn);

	        try {
	            var call = spec.op();
	            if (this._ops[call]) {  // FIXME name=>impl table
	                if (this.isReplay(spec)) { // it happens
	                    console.warn('replay', spec);
	                    return;
	                }
	                // invoke the implementation
	                this._ops[call].call(this, spec, value, lstn); // NOTE: no return value
	                // once applied, may remember in the log...
	                if (spec.op() !== 'init') {
	                    this._oplog && (this._oplog[spec.filter('!.')] = value);
	                    // this._version is practically a label that lets you know whether
	                    // the state has changed. Also, it allows to detect some cases of
	                    // concurrent change, as it is always set to the maximum version id
	                    // received by this object. Still, only the full version vector may
	                    // precisely and uniquely specify the current version (see version()).
	                    this._version = (opver > this._version) ? opver : this._version + opver;
	                } else {
	                    value = this.diff('!0');
	                }
	                // ...and relay further to downstream replicas and various listeners
	                this.emit(spec, value, lstn);
	            } else if (this._neutrals[call]) {
	                // invoke the implementation
	                this._neutrals[call].call(this, spec, value, lstn);
	                // and relay to listeners
	                this.emit(spec, value, lstn);
	            } else {
	                this.unimplemented(spec, value, lstn);
	            }
	        } catch (ex) { // log and rethrow; don't relay further; don't log
	            return fail("method execution failed", ex);
	        }

	        // to force async signatures we eat the returned value silently
	        return spec;
	    },

	    /**
	     * Notify all the listeners of a state change (i.e. the operation applied).
	     */
	    emit: function (spec, value, src) {
	        var ls = this._lstn,
	            op = spec.op(),
	            is_neutrals = op in this._neutrals;
	        if (ls) {
	            var notify = [];
	            for (var i = 0; i < ls.length; i++) {
	                var l = ls[i];
	                // skip empties, deferreds and the source
	                if (!l || l === ',' || l === src) { continue; }
	                if (is_neutrals && l._op !== op) { continue; }
	                if (l._op && l._op !== op) { continue; }
	                notify.push(l);
	            }
	            for (i = 0; i < notify.length; i++) { // screw it I want my 'this'
	                try {
	                    notify[i].deliver(spec, value, this);
	                } catch (ex) {
	                    console.error(ex.message, ex.stack);
	                }
	            }
	        }
	        this.callReactions(spec, value, src);
	    },

	    trigger: function (event, params) {
	        var spec = this.newEventSpec(event);
	        this.deliver(spec, params);
	    },

	    /**
	     * Blindly applies a JSON changeset to this model.
	     * @param {*} values
	     */
	    apply: function (values) {
	        for (var key in values) {
	            if (Syncable.reFieldName.test(key)) { // skip special fields
	                var def = this.constructor.defaults[key];
	                this[key] = def && def.type ?
	                    new def.type(values[key]) : values[key];
	            }
	        }
	    },

	    /**
	     * @returns {Spec.Map} the version vector for this object
	     */
	    version: function () {
	        // distillLog() may drop some operations; still, those need to be counted
	        // in the version vector; so, their Lamport ids must be saved in this._vector
	        var map = new Spec.Map(this._version + (this._vector || ''));
	        if (this._oplog) {
	            for (var op in this._oplog) {
	                map.add(op);
	            }
	        }
	        return map; // TODO return the object, let the consumer trim it to taste
	    },

	    /**
	     * Produce the entire state or probably the necessary difference
	     * to synchronize a replica which is at version *base*.
	     * The format of a state/patch object is:
	     * {
	     *   // A version label, see Syncable(). Presence of the label means
	     *   // that this object has a snapshot of the state. No version
	     *   // means it is a diff (log tail).
	     *   _version: Spec,
	     *   // Some parts of the version vector that can not be derived from
	     *   // _oplog or _version.
	     *   _vector: Spec,
	     *   // Some ops that were already applied. See distillLog()
	     *   _oplog: { spec: value },
	     *   // Pending ops that need to be applied.
	     *   _tail: { spec: value }
	     * }
	     *
	     * The state object must survive JSON.parse(JSON.stringify(obj))
	     *
	     * In many cases, the size of a distilled log is small enough to
	     * use it for state transfer (i.e. no snapshots needed).
	     */
	    diff: function (base) {
	        //var vid = new Spec(this._version).get('!'); // first !token
	        //var spec = vid + '.patch';
	        if (!this._version) { return undefined; }
	        this.distillLog(); // TODO optimize?
	        var patch, spec;
	        if (base && base != '!0' && base != '0') { // FIXME ugly
	            var map = new Spec.Map(base || '');
	            for (spec in this._oplog) {
	                if (!map.covers(new Spec(spec).version())) {
	                    patch = patch || {_tail: {}}; // NOTE: no _version
	                    patch._tail[spec] = this._oplog[spec];
	                }
	            }
	        } else {
	            patch = {_version: '!0', _tail: {}}; // zero state plus the tail
	            for (spec in this._oplog) {
	                patch._tail[spec] = this._oplog[spec];
	            }
	        }
	        return patch;
	    },

	    distillLog: function () {
	    },

	    /**
	     * The method must decide whether the source of the operation has
	     * the rights to perform it. The method may check both the nearest
	     * source and the original author of the op.
	     * If this method ever mentions 'this', that is a really bad sign.
	     * @returns {boolean}
	     */
	    acl: function (spec, val, src) {
	        return true;
	    },

	    /**
	     * Check operation format/validity (recommendation: don't check against the current state)
	     * @returns {string} '' if OK, error message otherwise.
	     */
	    validate: function (spec, val, src) {
	        if (spec.pattern() !== '/#!.') {
	            return 'incomplete event spec';
	        }
	        if (this.clock && spec.type()!=='Host' && !this.clock.checkTimestamp(spec.version())) {
	            return 'invalid timestamp '+spec;
	        }
	    },

	    /**
	     * whether this op was already applied in the past
	     * @returns {boolean}
	     */
	    isReplay: function (spec) {
	        if (!this._version) { return false; }
	        if (spec.op() === 'init') { return false; } // these are .on !vids
	        var opver = spec.version();
	        if (opver > this._version.substr(1)) { return false; }
	        if (spec.filter('!.').toString() in this._oplog) { return true; }// TODO log trimming, vvectors?
	        return this.version().covers(opver); // heavyweight
	    },

	    /**
	     * External objects (those you create by supplying an id) need first to query
	     * the uplink for their state. Before the state arrives they are stateless.
	     * @return {boolean}
	     */
	    hasState: function () {
	        return !!this._version;
	    },

	    getListenerIndex: function (search_for, uplinks_only) {
	        var i = this._lstn.indexOf(search_for),
	            l;
	        if (i > -1) { return i; }

	        for (i = 0, l = this._lstn.length; i < l; i++) {
	            var ln = this._lstn[i];
	            if (uplinks_only && ln === ',') {
	                return -1;
	            }
	            if (Syncable.listenerEquals(ln, search_for)) {
	                return i;
	            }
	        }
	        return -1;
	    },

	    reset: function () {
	        var defs = this.constructor.defaults;
	        for (var name in defs) {
	            var def = defs[name];
	            if (def.type) {
	                this[name] = def.value ? new def.type(def.value) : new def.type();
	            } else {
	                this[name] = def.value;
	            }
	        }
	    },


	    neutrals: {
	        /**
	         * Subscribe to the object's operations;
	         * the upstream part of the two-way subscription
	         *  on() with a full filter:
	         *  @param {Spec} spec /Mouse#Mickey!now.on
	         *  @param {Spec|string} filter !since.event
	         *  @param {{deliver:function}|function} repl callback
	         *  @this {Syncable}
	         *
	         * TODO: prevent second subscription
	         */
	        on: function (spec, filter, repl) {   // WELL  on() is not an op, right?
	            // if no listener is supplied then the object is only
	            // guaranteed to exist till the next Host.gc() run
	            if (!repl) { return; }

	            var self = this;
	            // stateless objects fire no events; essentially, on() is deferred
	            if (!this._version && filter) { // TODO solidify
	                this._lstn.push({
	                    _op: 'reon',
	                    _src: repl,
	                    deliver: function () {
	                        var i = self._lstn.indexOf(this);
	                        self._lstn.splice(i, 1);
	                        self.deliver(spec, filter, repl);
	                    }
	                });
	                return; // defer this call till uplinks are ready
	            }
	            // make all listeners uniform objects
	            if (repl.constructor === Function) {
	                repl = {
	                    sink: repl,
	                    that: this,
	                    deliver: function () { // .deliver is invoked on an event
	                        this.sink.apply(this.that, arguments);
	                    }
	                };
	            }

	            if (filter) {
	                filter = new Spec(filter, '.');
	                var baseVersion = filter.filter('!'),
	                    filter_by_op = filter.get('.');

	                if (filter_by_op === 'init') {
	                    var diff_if_needed = baseVersion ? this.diff(baseVersion) : '';
	                    repl.deliver(spec.set('.init'), diff_if_needed, this); //??
	                    // FIXME use once()
	                    return;
	                }
	                if (filter_by_op) {
	                    repl = {
	                        sink: repl,
	                        _op: filter_by_op,
	                        deliver: function deliverWithFilter(spec, val, src) {
	                            if (spec.op() === filter_by_op) {
	                                this.sink.deliver(spec, val, src);
	                            }
	                        }
	                    };
	                }

	                if (!baseVersion.isEmpty()) {
	                    var diff = this.diff(baseVersion);
	                    diff && repl.deliver(spec.set('.init'), diff, this); // 2downlink
	                    repl.deliver(spec.set('.reon'), this.version().toString(), this);
	                }
	            }

	            this._lstn.push(repl);
	            // TODO repeated subscriptions: send a diff, otherwise ignore
	        },

	        /**
	         * downstream reciprocal subscription
	         */
	        reon: function (spec, filter, repl) {
	            if (filter) {  // a diff is requested
	                var base = Spec.as(filter).tok('!');
	                var diff = this.diff(base);
	                if (diff) {
	                    repl.deliver(spec.set('.init'), diff, this);
	                }
	            }
	        },

	        /** Unsubscribe */
	        off: function (spec, val, repl) {
	            var idx = this.getListenerIndex(repl); //TODO ??? uplinks_only?
	            if (idx > -1) {
	                this._lstn.splice(idx, 1);
	            }
	        },

	        /** Reciprocal unsubscription */
	        reoff: function (spec, val, repl) {
	            var idx = this.getListenerIndex(repl); //TODO ??? uplinks_only?
	            if (idx > -1) {
	                this._lstn.splice(idx, 1);
	            }
	            if (this._id) {
	                this.checkUplink();
	            }
	        },

	        /**
	         * As all the event/operation processing is asynchronous, we
	         * cannot simply throw/catch exceptions over the network.
	         * This method allows to send errors back asynchronously.
	         * Sort of an asynchronous complaint mailbox :)
	         */
	        error: function (spec, val, repl) {
	            console.error('something failed:', spec, val, '@', (repl && repl._id));
	        }

	    }, // neutrals

	    ops: {
	        /**
	         * A state of a Syncable CRDT object is transferred to a replica using
	         * some combination of POJO state and oplog. For example, a simple LWW
	         * object (Last Writer Wins, see Model.js) uses its distilled oplog
	         * as the most concise form. A CT document (Causal Trees) has a highly
	         * compressed state, its log being hundred times heavier. Hence, it
	         * mainly uses its plain state, but sometimes its log tail as well. The
	         * format of the state object is POJO plus (optionally) special fields:
	         * _oplog, _tail, _vector, _version (the latter flags POJO presence).
	         * In either case, .init is only produced by diff() (+ by storage).
	         * Any real-time changes are transferred as individual events.
	         * @this {Syncable}
	         */
	        init: function (spec, state, src) {

	            var tail = {}, // ops to be applied on top of the received state
	                typeid = spec.filter('/#'),
	                lstn = this._lstn,
	                a_spec;
	            this._lstn = []; // prevent events from being fired

	            if (state._version/* && state._version !== '!0'*/) {
	                // local changes may need to be merged into the received state
	                if (this._oplog) {
	                    for (a_spec in this._oplog) {
	                        tail[a_spec] = this._oplog[a_spec];
	                    }
	                    this._oplog = {};
	                }
	                this._vector && (this._vector = undefined);
	                // zero everything
	                for (var key in this) {
	                    if (this.hasOwnProperty(key) && key.charAt(0) !== '_') {
	                        this[key] = undefined;
	                    }
	                }
	                // set default values
	                this.reset();

	                this.apply(state);
	                this._version = state._version;

	                state._oplog && (this._oplog = state._oplog); // FIXME copy
	                state._vector && (this._vector = state._vector);
	            }
	            // add the received tail to the local one
	            if (state._tail) {
	                for (a_spec in state._tail) {
	                    tail[a_spec] = state._tail[a_spec];
	                }
	            }
	            // appply the combined tail to the new state
	            var specs = [];
	            for (a_spec in tail) {
	                specs.push(a_spec);
	            }
	            specs.sort().reverse();
	            // there will be some replays, but those will be ignored
	            while (a_spec = specs.pop()) {
	                this.deliver(typeid.add(a_spec), tail[a_spec], this);
	            }

	            this._lstn = lstn;

	        }

	    }, // ops


	    /**
	     * Uplink connections may be closed or reestablished so we need
	     * to adjust every object's subscriptions time to time.
	     * @this {Syncable}
	     */
	    checkUplink: function () {
	        var new_uplinks = this._host.getSources(this.spec()).slice(),
	            up, self = this;
	        // the plan is to eliminate extra subscriptions and to
	        // establish missing ones; that only affects outbound subs
	        for (var i = 0; i < this._lstn.length && this._lstn[i] != ','; i++) {
	            up = this._lstn[i];
	            if (!up) {
	                continue;
	            }
	            up._src && (up = up._src); // unready
	            var up_idx = new_uplinks.indexOf(up);
	            if (up_idx === -1) { // don't need this uplink anymore
	                up.deliver(this.newEventSpec('off'), '', this);
	            } else {
	                new_uplinks[up_idx] = undefined;
	            }
	        }
	        // subscribe to the new
	        for (i = 0; i < new_uplinks.length; i++) {
	            up = new_uplinks[i];
	            if (!up) {
	                continue;
	            }
	            var onspec = this.newEventSpec('on');
	            this._lstn.unshift({
	                _op: 'reon',
	                _src: up,
	                deliver: function (spec, base, src) {
	                    if (spec.version() !== onspec.version()) {
	                        return;
	                    } // not mine

	                    var i = self.getListenerIndex(this);
	                    self._lstn[i] = up;
	                }
	            });
	            up.deliver(onspec, this.version().toString(), this);
	        }
	    },

	    /**
	     * returns a Plain Javascript Object with the state
	     * @this {Syncable}
	     */
	    pojo: function (addVersionInfo) {
	        var pojo = {},
	            defs = this.constructor.defaults;
	        for (var key in this) {
	            if (this.hasOwnProperty(key)) {
	                if (Syncable.reFieldName.test(key) && this[key] !== undefined) {
	                    var def = defs[key],
	                        val = this[key];
	                    pojo[key] = def && def.type ?
	                    (val.toJSON && val.toJSON()) || val.toString() :
	                            (val && val._id ? val._id : val); // TODO prettify
	                }
	            }
	        }
	        if (addVersionInfo) {
	            pojo._id = this._id; // not necassary
	            pojo._version = this._version;
	            this._vector && (pojo._vector = this._vector);
	            this._oplog && (pojo._oplog = this._oplog); //TODO copy
	        }
	        return pojo;
	    },

	    /**
	     * Sometimes we get an operation we don't support; not normally
	     * happens for a regular replica, but still needs to be caught
	     */
	    unimplemented: function (spec, val, repl) {
	        console.warn("method not implemented:", spec);
	    },

	    /**
	     * Deallocate everything, free all resources.
	     */
	    close: function () {
	        var l = this._lstn,
	            s = this.spec(),
	            uplink;

	        this._id = null; // no id - no object; prevent relinking
	        while ((uplink = l.shift()) && uplink !== ',') {
	            uplink.off(s, null, this);
	        }
	        while (l.length) {
	            l.pop().deliver(s.set('.reoff'), null, this);
	        }
	        this._host.unregister(this);
	    },

	    /**
	     * Once an object is not listened by anyone it is perfectly safe
	     * to garbage collect it.
	     */
	    gc: function () {
	        var l = this._lstn;
	        if (!l.length || (l.length === 1 && !l[0])) {
	            this.close();
	        }
	    },

	    /**
	     * @param {string} filter event filter for subscription
	     * @param {function} cb callback (will be called once)
	     * @see Syncable#on
	     */
	    once: function (filter, cb) {
	        this.on(filter, function onceWrap(spec, val, src) {
	            // "this" is the object (Syncable)
	            if (cb.constructor === Function) {
	                cb.call(this, spec, val, src);
	            } else {
	                cb.deliver(spec, val, src);
	            }
	            this.off(filter, onceWrap);
	        });
	    }
	});


	Syncable.reFieldName = /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/;

	/**
	 * Derive version vector from a state of a Syncable object.
	 * This is not a method as it needs to be applied to a flat JSON object.
	 * @see Syncable.version
	 * @see Spec.Map
	 * @returns {string} string representation of Spec.Map
	 */
	Syncable.stateVersionVector = function stateVersionVector(state) {
	    var op,
	        map = new Spec.Map( (state._version||'!0') + (state._vector || '') );
	    if (state._oplog) {
	        for (op in state._oplog) {
	            map.add(op);
	        }
	    }
	    if (state._tail) {
	        for (op in state._tail) {
	            map.add(op);
	        }
	    }
	    return map.toString();
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Spec = __webpack_require__(6);
	var Syncable = __webpack_require__(8);

	/**
	 * Model (LWW key-value object)
	 * @param idOrState
	 * @constructor
	 */
	function Model(idOrState) {
	    var ret = Model._super.apply(this, arguments);
	    /// TODO: combine with state push, make clean
	    if (ret === this && idOrState && idOrState.constructor !== String && !Spec.is(idOrState)) {
	        this.deliver(this.spec().add(this._id, '!').add('.set'), idOrState);
	    }
	}

	module.exports = Syncable.extend(Model, {
	    defaults: {
	        _oplog: Object
	    },
	    /**  init modes:
	     *    1  fresh id, fresh object
	     *    2  known id, stateless object
	     *    3  known id, state boot
	     */
	    neutrals: {
	        on: function (spec, base, repl) {
	            //  support the model.on('field',callback_fn) pattern
	            if (typeof(repl) === 'function' &&
	                    typeof(base) === 'string' &&
	                    (base in this.constructor.defaults)) {
	                var stub = {
	                    fn: repl,
	                    key: base,
	                    self: this,
	                    _op: 'set',
	                    deliver: function (spec, val, src) {
	                        if (this.key in val) {
	                            this.fn.call(this.self, spec, val, src);
	                        }
	                    }
	                };
	                repl = stub;
	                base = '';
	            }
	            // this will delay response if we have no state yet
	            Syncable._pt._neutrals.on.call(this, spec, base, repl);
	        },

	        off: function (spec, base, repl) {
	            var ls = this._lstn;
	            if (typeof(repl) === 'function') { // TODO ugly
	                for (var i = 0; i < ls.length; i++) {
	                    if (ls[i] && ls[i].fn === repl && ls[i].key === base) {
	                        repl = ls[i];
	                        break;
	                    }
	                }
	            }
	            Syncable._pt._neutrals.off.apply(this, arguments);
	        }

	    },

	    // TODO remove unnecessary value duplication
	    packState: function (state) {
	    },
	    unpackState: function (state) {
	    },
	    /**
	     * Removes redundant information from the log; as we carry a copy
	     * of the log in every replica we do everythin to obtain the minimal
	     * necessary subset of it.
	     * As a side effect, distillLog allows up to handle some partial
	     * order issues (see _ops.set).
	     * @see Model.ops.set
	     * @returns {*} distilled log {spec:true}
	     */
	    distillLog: function () {
	        // explain
	        var sets = [],
	            cumul = {},
	            heads = {},
	            spec;
	        for (var s in this._oplog) {
	            spec = new Spec(s);
	            //if (spec.op() === 'set') {
	            sets.push(spec);
	            //}
	        }
	        sets.sort();
	        for (var i = sets.length - 1; i >= 0; i--) {
	            spec = sets[i];
	            var val = this._oplog[spec],
	                notempty = false;
	            for (var field in val) {
	                if (field in cumul) {
	                    delete val[field];
	                } else {
	                    notempty = cumul[field] = val[field]; //store last value of the field
	                }
	            }
	            var source = spec.source();
	            notempty || (heads[source] && delete this._oplog[spec]);
	            heads[source] = true;
	        }
	        return cumul;
	    },

	    ops: {
	        /**
	         * This barebones Model class implements just one kind of an op:
	         * set({key:value}). To implment your own ops you need to understand
	         * implications of partial order as ops may be applied in slightly
	         * different orders at different replicas. This implementation
	         * may resort to distillLog() to linearize ops.
	         */
	        set: function (spec, value, repl) {
	            var version = spec.version(),
	                vermet = spec.filter('!.').toString();
	            if (version < this._version.substr(1)) {
	                this._oplog[vermet] = value;
	                this.distillLog(); // may amend the value
	                value = this._oplog[vermet];
	            }
	            value && this.apply(value);
	        }
	    },

	    fill: function (key) { // TODO goes to Model to support references
	        if (!this.hasOwnProperty(key)) {
	            throw new Error('no such entry');
	        }

	        //if (!Spec.is(this[key]))
	        //    throw new Error('not a specifier');
	        var spec = new Spec(this[key]).filter('/#');
	        if (spec.pattern() !== '/#') {
	            throw new Error('incomplete spec');
	        }

	        this[key] = this._host.get(spec);
	        /* TODO new this.refType(id) || new Swarm.types[type](id);
	         on('init', function(){
	         self.emit('fill',key,this)
	         self.emit('full',key,this)
	         });*/
	    },

	    /**
	     * Generate .set operation after some of the model fields were changed
	     * TODO write test for Model.save()
	     */
	    save: function () {
	        var cumul = this.distillLog(),
	            changes = {},
	            pojo = this.pojo(),
	            field;
	        for (field in pojo) {
	            if (this[field] !== cumul[field]) {// TODO nesteds
	                changes[field] = this[field];
	            }
	        }
	        for (field in cumul) {
	            if (!(field in pojo)) {
	                changes[field] = null; // JSON has no undefined
	            }
	        }
	        this.set(changes);
	    },

	    validate: function (spec, val) {
	        if (spec.op() !== 'set') {
	            return '';
	        } // no idea
	        for (var key in val) {
	            if (!Syncable.reFieldName.test(key)) {
	                return 'bad field name';
	            }
	        }
	        return '';
	    }

	});

	// Model may have reactions for field changes as well as for 'real' ops/events
	// (a field change is a .set operation accepting a {field:newValue} map)
	module.exports.addReaction = function (methodOrField, fn) {
	    var proto = this.prototype;
	    if (typeof (proto[methodOrField]) === 'function') { // it is a field name
	        return Syncable.addReaction.call(this, methodOrField, fn);
	    } else {
	        var wrapper = function (spec, val) {
	            if (methodOrField in val) {
	                fn.apply(this, arguments);
	            }
	        };
	        wrapper._rwrap = true;
	        return Syncable.addReaction.call(this, 'set', wrapper);
	    }
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var env = __webpack_require__(5);
	var Spec = __webpack_require__(6);
	var Syncable = __webpack_require__(8);
	var Model = __webpack_require__(9); // TODO
	var ProxyListener = __webpack_require__(20);
	var CollectionMethodsMixin = __webpack_require__(21);

	/**
	 * Backbone's Collection is essentially an array and arrays behave poorly
	 * under concurrent writes (see OT). Hence, our primary collection type
	 * is a {id:Model} Set. One may obtain a linearized version by sorting
	 * them by keys or otherwise.
	 * This basic Set implementation can only store objects of the same type.
	 * @constructor
	 */
	module.exports = Syncable.extend('Set', {

	    defaults: {
	        objects: Object,
	        _oplog: Object,
	        _proxy: ProxyListener
	    },

	    mixins: [
	        CollectionMethodsMixin
	    ],

	    reactions: {
	        init: function (spec,val,src) {
	            this.forEach(function (obj) {
	                obj.on(this._proxy);
	            }, this);
	        }
	    },

	    ops: {
	        /**
	         * Both Model and Set are oplog-only; they never pass the state on the wire,
	         * only the oplog; new replicas are booted with distilled oplog as well.
	         * So, this is the only point in the code that mutates the state of a Set.
	         */
	        change: function (spec, value, repl) {
	            value = this.distillOp(spec, value);
	            var key_spec;
	            for (key_spec in value) {
	                if (value[key_spec] === 1) {
	                    if (!this.objects[key_spec]) { // only if object not in the set
	                        this.objects[key_spec] = this._host.get(key_spec);
	                        this.objects[key_spec].on(this._proxy);
	                    }
	                } else if (value[key_spec] === 0) {
	                    if (this.objects[key_spec]) {
	                        this.objects[key_spec].off(this._proxy);
	                        delete this.objects[key_spec];
	                    }
	                } else {
	                    env.log(this.spec(), 'unexpected val', JSON.stringify(value));
	                }
	            }
	        }
	    },

	    validate: function (spec, val, src) {
	        if (spec.op() !== 'change') {
	            return '';
	        }

	        for (var key_spec in val) {
	            // member spec validity
	            if (Spec.pattern(key_spec) !== '/#') {
	                return 'invalid spec: ' + key_spec;
	            }
	        }
	        return '';
	    },

	    distillOp: function (spec, val) {
	        if (spec.version() > this._version) {
	            return val; // no concurrent op
	        }
	        var opkey = spec.filter('!.');
	        this._oplog[opkey] = val;
	        this.distillLog(); // may amend the value
	        return this._oplog[opkey] || {};
	    },

	    distillLog: Model.prototype.distillLog,

	    /**
	     * Adds an object to the set.
	     * @param {Syncable} obj the object  //TODO , its id or its specifier.
	     */
	    addObject: function (obj) {
	        var specs = {};
	        specs[obj.spec()] = 1;
	        this.change(specs);
	    },
	    // FIXME reactions to emit .add, .remove

	    removeObject: function (obj) {
	        var spec = obj._id ? obj.spec() : new Spec(obj).filter('/#');
	        if (spec.pattern() !== '/#') {
	            throw new Error('invalid spec: ' + spec);
	        }
	        var specs = {};
	        specs[spec] = 0;
	        this.change(specs);
	    },

	    /**
	     * @param {Spec|string} key_spec key (specifier)
	     * @returns {Syncable} object by key
	     */
	    get: function (key_spec) {
	        key_spec = new Spec(key_spec).filter('/#');
	        if (key_spec.pattern() !== '/#') {
	            throw new Error("invalid spec");
	        }
	        return this.objects[key_spec];
	    },

	    /**
	     * @param {function?} order
	     * @returns {Array} sorted list of objects currently in set
	     */
	    list: function (order) {
	        var ret = [];
	        for (var key in this.objects) {
	            ret.push(this.objects[key]);
	        }
	        ret.sort(order);
	        return ret;
	    },

	    forEach: function (cb, thisArg) {
	        var index = 0;
	        for (var spec in this.objects) {
	            cb.call(thisArg, this.objects[spec], index++);
	        }
	    },

	    every: function (cb, thisArg) {
	        var index = 0;
	        for (var spec in this.objects) {
	            if (!cb.call(thisArg, this.objects[spec], index++)) {
	                return false;
	            }
	        }
	        return true;
	    },

	    filter: function (cb, thisArg) {
	        var res = [];
	        this.forEach(function (entry, idx) {
	            if (cb.call(thisArg, entry, idx)) {
	                res.push(entry);
	            }
	        });
	        return res;
	    }

	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Spec = __webpack_require__(6);
	var LongSpec = __webpack_require__(7);
	var Syncable = __webpack_require__(8);
	var ProxyListener = __webpack_require__(20);
	var CollectionMethodsMixin = __webpack_require__(21);

	/** In distributed environments, linear structures are tricky. It is always
	 *  recommended to use (sorted) Set as your default collection type. Still, in
	 *  some cases we need precisely a Vector, so here it is. Note that a vector can
	 *  not prune its mutation history for quite a while, so it is better not to
	 *  sort (reorder) it repeatedly. The perfect usage pattern is a growing vector+
	 *  insert sort or no sort at all. If you need to re-shuffle a vector
	 *  differently or replace its contents, you'd better create a new vector.
	 *  So, you've been warned.
	 *  Vector is implemented on top of a LongSpec, so the API is very much alike.
	 *  The replication/convergence/correctness algorithm is Causal Trees.
	 *
	 *  TODO support JSON types (as a part of ref-gen-refac)
	 */
	module.exports = Syncable.extend('Vector', {

	    defaults: {
	        _oplog: Object,
	        objects: Array,
	        _order: LongSpec,
	        _proxy: ProxyListener
	    },

	    mixins: [
	        CollectionMethodsMixin
	    ],

	    ops: {  // operations is our assembly language

	        // insert an object
	        in: function (spec, value, src) {
	            // we misuse specifiers to express the operation in
	            // a compact non-ambiguous way
	            value = new Spec(value);
	            var opid = spec.tok('!');
	            var at = value.tok('!');
	            if (opid<=at) {
	                throw new Error('timestamps are messed up');
	            }
	            var what = value.tok('#');
	            if (!what) { throw new Error('object #id not specified'); }
	            var type = value.get('/');
	            if (!type && this.objectType) {
	                type = this.objectType.prototype._type;
	            }
	            if (!type) {
	                throw new Error('object /type not specified');
	            }
	            type = '/' + type;

	            var pos = this.findPositionFor(opid, at?at:'!0');
	            var obj = this._host.get(type+what);

	            this.objects.splice(pos.index,0,obj);
	            this._order.insert(opid,pos);

	            obj.on(this._proxy);
	        },

	        // remove an object
	        rm: function (spec, value, src) {
	            value = Spec.as(value);
	            var target = value.tok('!');
	            var hint = value.has('.') ? Spec.base2int(value.get('.')) : 0;
	            var at = this._order.find(target, Math.max(0,hint-5));
	            if (at.end()) {
	                at = this._order.find(target, 0);
	            }
	            if (at.end()) {
	                // this can only be explained by concurrent deletion
	                // partial order can't break cause-and-effect ordering
	                return;
	            }
	            var obj = this.objects[at.index];
	            this.objects.splice(at.index,1);
	            at.erase(1);

	            obj.off(this._proxy);
	        }

	        /** Either thombstones or log  before HORIZON
	        patch: function (spec, value, src) {

	        }*/

	    },

	    distillLog: function () {
	        // TODO HORIZON
	    },

	    reactions: {

	        'init': function fillAll (spec,val,src) { // TODO: reactions, state init tests
	            for(var i=this._order.iterator(); !i.end(); i.next()) {
	                var op = i.token() + '.in';
	                var value = this._oplog[op];
	                var obj = this.getObject(value);
	                this.objects[i.index] = obj;
	                obj.on(this._proxy);
	            }
	        }

	    },

	    getObject: function (spec) {
	        spec = new Spec(spec,'#');
	        if (!spec.has('/')) {
	            if (this.objectType) {
	                spec = spec.add(this.objectType.prototype._type,'/').sort();
	            } else {
	                throw new Error("type not specified"); // TODO is it necessary at all?
	            }
	        }
	        var obj = this._host.get(spec);
	        return obj;
	    },

	    length: function () {
	        return this.objects.length;
	    },

	    //  C A U S A L  T R E E S  M A G I C

	    findPositionFor: function (id, parentId) { // FIXME protected methods && statics (entryType)
	        if (!parentId) {
	            parentId = this.getParentOf(id);
	        }
	        var next;
	        if (parentId!=='!0') {
	            next = this._order.find(parentId);
	            if (next.end()) {
	                next = this.findPositionFor(parentId);
	            }
	            next.next();
	        } else {
	            next = this._order.iterator();
	        }
	        // skip "younger" concurrent siblings
	        while (!next.end()) {
	            var nextId = next.token();
	            if (nextId<id) {
	                break;
	            }
	            var subtreeId = this.inSubtreeOf(nextId,parentId);
	            if (!subtreeId || subtreeId<id) {
	                break;
	            }
	            this.skipSubtree(next,subtreeId);
	        }
	        return next; // insert before
	    },

	    getParentOf: function (id) {
	        var spec = this._oplog[id+'.in'];
	        if (!spec) {
	            throw new Error('operation unknown: '+id);
	        }
	        var parentId = Spec.as(spec).tok('!') || '!0';
	        return parentId;
	    },

	    /** returns the immediate child of the root node that is an ancestor
	      * of the given node. */
	    inSubtreeOf: function (nodeId, rootId) {
	        var id=nodeId, p=id;
	        while (id>rootId) {
	            p=id;
	            id=this.getParentOf(id);
	        }
	        return id===rootId && p;
	    },

	    isDescendantOf: function (nodeId, rootId) {
	        var i=nodeId;
	        while (i>rootId) {
	            i=this.getParentOf(i);
	        }
	        return i===rootId;
	    },

	    skipSubtree: function (iter, root) {
	        root = root || iter.token();
	        do {
	            iter.next();
	        } while (!iter.end() && this.isDescendantOf(iter.token(),root));
	        return iter;
	    },

	    validate: function (spec, val, source) {
	        // ref op is known
	    },

	    //  A R R A Y - L I K E  A P I
	    //  wrapper methods that convert into op calls above

	    indexOf: function (obj, startAt) {
	        if (!obj._id) {
	            obj = this.getObject(obj);
	        }
	        return this.objects.indexOf(obj,startAt);
	    },

	    /*splice: function (offset, removeCount, insert) {
	        var ref = offset===-1 ? '' : this.objects[offset];
	        var del = [];
	        var hint;
	        for (var rm=1; rm<=removeCount; rm++) {
	            del.push(this._order.entryAt(offset+rm));
	        }
	        for(var a=3; a<this.arguments.length; a++) {
	            var arg = this.arguments[a];
	            arg = _id in arg ? arg._id : arg;
	            if (!Spec.isId(arg)) { throw new Error('malformed id: '+arg); }
	            ins.push(arg);
	        }
	        while (rmid=del.pop()) {
	            this.del(rmid+hint);
	        }
	        while (insid=ins.pop()) {
	            this.ins(ref+insid+hint);
	        }
	    },*/

	    normalizePos: function (pos) {
	        if (pos && pos._id) {
	            pos=pos._id;
	        }
	        var spec = new Spec(pos,'#');
	        var type = spec.type();
	        var id = spec.id();
	        for(var i=0; i<this.objects.length; i++) {
	            var obj = this.objects[i];
	            if (obj && obj._id===id && (!type || obj._type===type)) {
	                break;
	            }
	        }
	        return i;
	    },

	    /** Assuming position 0 on the "left" and left-to-right writing, the
	      * logic of causal tree insertion is
	      * insert(newEntry, parentWhichIsOnTheLeftSide). */
	    insert: function (spec, pos) {
	        // TODO bulk insert: make'em siblings
	        if (pos===undefined) {
	            pos = -1; // TODO ? this._order.length()
	        }
	        if (pos.constructor!==Number) {
	            pos = this.normalizePos(pos);
	        }
	        if (spec && spec._id) {
	            spec = spec.spec();
	        } else /*if (spec.constructor===String)*/ {
	            spec = new Spec(spec,'#');
	        }
	        // TODO new object
	        var opid = pos===-1 ? '!0' : this._order.tokenAt(pos);
	        // TODO hint pos
	        return this.in(spec+opid);
	    },

	    insertAfter: function (obj, pos) {
	        this.insert (obj,pos);
	    },

	    insertBefore: function (spec, pos) {
	        if (pos===undefined) {
	            pos = this._order.length();
	        }
	        if (pos.constructor!==Number) {
	            pos = this.normalizePos(pos);
	        }
	        this.insert(spec,pos-1);
	    },

	    append: function append (spec) {
	        this.insert(spec,this._order.length()-1);
	    },

	    remove: function remove (pos) {
	        if (pos.constructor!==Number) {
	            pos = this.normalizePos(pos);
	        }
	        var hint = Spec.int2base(pos,0);
	        var op = this._order.tokenAt(pos);
	        this.rm(op+'.'+hint); // TODO generic spec quants
	    },

	    // Set-compatible, in a sense
	    addObject: function (obj) {
	        this.append(obj);
	    },

	    removeObject: function (pos) {
	        this.remove(pos);
	    },

	    objectAt: function (i) {
	        return this.objects[i];
	    },

	    insertSorted: function (obj, cmp) {
	    },

	    setOrder: function (fn) {
	    },

	    forEach: function (cb, thisArg) {
	        this.objects.forEach(cb, thisArg);
	    },

	    every: function (cb, thisArg) {
	        return this.objects.every(cb, thisArg);
	    },

	    filter: function (cb, thisArg) {
	        return this.objects.filter(cb, thisArg);
	    }

	});


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var env = __webpack_require__(5);
	var Spec = __webpack_require__(6);
	var Syncable = __webpack_require__(8);
	var Pipe = __webpack_require__(13);
	var SecondPreciseClock = __webpack_require__(22);

	/**
	 * Host is (normally) a singleton object registering/coordinating
	 * all the local Swarm objects, connecting them to appropriate
	 * external uplinks, maintaining clocks, etc.
	 * Host itself is not fully synchronized like a Model but still
	 * does some event gossiping with peer Hosts.
	 * @constructor
	 */
	function Host(id, ms, storage) {
	    this.objects = {};
	    this.sources = {};
	    this.storage = storage;
	    this._host = this; // :)
	    this._lstn = [','];
	    this._id = id;
	    this._server = /^swarm~.*/.test(id);
	    var clock_fn = env.clockType || SecondPreciseClock;
	    this.clock = new clock_fn(this._id, ms||0);

	    if (this.storage) {
	        this.sources[this._id] = this.storage;
	        this.storage._host = this;
	    }
	    delete this.objects[this.spec()];

	    if (!env.multihost) {
	        if (env.localhost) {
	            throw new Error('use multihost mode');
	        }
	        env.localhost = this;
	    }
	}

	Host.MAX_INT = 9007199254740992;
	Host.MAX_SYNC_TIME = 60 * 60000; // 1 hour (milliseconds)
	Host.HASH_POINTS = 3;

	Host.hashDistance = function hashDistance(peer, obj) {
	    if ((obj).constructor !== Number) {
	        if (obj._id) {
	            obj = obj._id;
	        }
	        obj = env.hashfn(obj);
	    }
	    if (peer._id) {
	        peer = peer._id;
	    }
	    var dist = 4294967295;
	    for (var i = 0; i < Host.HASH_POINTS; i++) {
	        var hash = env.hashfn(peer._id + ':' + i);
	        dist = Math.min(dist, hash ^ obj);
	    }
	    return dist;
	};

	module.exports = Syncable.extend(Host, {

	    deliver: function (spec, val, repl) {
	        if (spec.type() !== 'Host') {
	            var typeid = spec.filter('/#');
	            var obj = this.get(typeid);
	            if (obj) {
	                // TODO seeTimestamp()
	                obj.deliver(spec, val, repl);
	            }
	        } else {
	            this._super.deliver.apply(this, arguments);
	        }
	    },

	    init: function (spec, val, repl) {

	    },

	    get: function (spec, callback) {
	        if (spec && spec.constructor === Function && spec.prototype._type) {
	            spec = '/' + spec.prototype._type;
	        }
	        spec = new Spec(spec);
	        var typeid = spec.filter('/#');
	        if (!typeid.has('/')) {
	            throw new Error('invalid spec');
	        }
	        var o = typeid.has('#') && this.objects[typeid];
	        if (!o) {
	            var t = Syncable.types[spec.type()];
	            if (!t) {
	                throw new Error('type unknown: ' + spec);
	            }
	            o = new t(typeid, undefined, this);
	            if (typeof(callback) === 'function') {
	                o.on('.init', callback);
	            }
	        }
	        return o;
	    },

	    addSource: function hostAddPeer(spec, peer) {
	        //FIXME when their time is off so tell them so
	        // if (false) { this.clockOffset; }
	        var old = this.sources[peer._id];
	        if (old) {
	            old.deliver(this.newEventSpec('off'), '', this);
	        }

	        this.sources[peer._id] = peer;
	        if (spec.op() === 'on') {
	            peer.deliver(this.newEventSpec('reon'), this.clock.ms(), this);
	        }
	        for (var sp in this.objects) {
	            this.objects[sp].checkUplink();
	        }
	    },

	    neutrals: {
	        /**
	         * Host forwards on() calls to local objects to support some
	         * shortcut notations, like
	         *          host.on('/Mouse',callback)
	         *          host.on('/Mouse.init',callback)
	         *          host.on('/Mouse#Mickey',callback)
	         *          host.on('/Mouse#Mickey.init',callback)
	         *          host.on('/Mouse#Mickey!baseVersion',repl)
	         *          host.on('/Mouse#Mickey!base.x',trackfn)
	         * The target object may not exist beforehand.
	         * Note that the specifier is actually the second 3sig parameter
	         * (value). The 1st (spec) reflects this /Host.on invocation only.
	         */
	        on: function hostOn(spec, filter, lstn) {
	            if (!filter) {
	                // the subscriber needs "all the events"
	                return this.addSource(spec, lstn);
	            }

	            if (filter.constructor === Function && filter.id) {
	                filter = new Spec(filter.id, '/');
	            } else if (filter.constructor === String) {
	                filter = new Spec(filter, '.');
	            }
	            // either suscribe to this Host or to some other object
	            if (!filter.has('/') || filter.type() === 'Host') {
	                this._super._neutrals.on.call(this, spec, filter, lstn);
	            } else {
	                var objSpec = new Spec(filter);
	                if (!objSpec.has('#')) {
	                    throw new Error('no id to listen');
	                }
	                objSpec = objSpec.set('.on').set(spec.version(), '!');
	                this.deliver(objSpec, filter, lstn);
	            }
	        },

	        reon: function hostReOn(spec, ms, host) {
	            if (spec.type() !== 'Host') {
	                throw new Error('Host.reon(/NotHost.reon)');
	            }
	            this.clock.adjustTime(ms);
	            this.addSource(spec, host);
	        },

	        off: function (spec, nothing, peer) {
	            peer.deliver(peer.spec().add(this.time(), '!').add('.reoff'), '', this);
	            this.removeSource(spec, peer);
	        },

	        reoff: function hostReOff(spec, nothing, peer) {
	            this.removeSource(spec, peer);
	        }

	    }, // neutrals

	    removeSource: function (spec, peer) {
	        if (spec.type() !== 'Host') {
	            throw new Error('Host.removeSource(/NoHost)');
	        }

	        if (this.sources[peer._id] !== peer) {
	            console.error('peer unknown', peer._id); //throw new Error
	            return;
	        }
	        delete this.sources[peer._id];
	        for (var sp in this.objects) {
	            var obj = this.objects[sp];
	            if (obj.getListenerIndex(peer, true) > -1) {
	                obj.off(sp, '', peer);
	                obj.checkUplink(sp);
	            }
	        }
	    },


	    /**
	     * Returns an unique Lamport timestamp on every invocation.
	     * Swarm employs 30bit integer Unix-like timestamps starting epoch at
	     * 1 Jan 2010. Timestamps are encoded as 5-char base64 tokens; in case
	     * several events are generated by the same process at the same second
	     * then sequence number is added so a timestamp may be more than 5
	     * chars. The id of the Host (+user~session) is appended to the ts.
	     */
	    time: function () {
	        var ts = this.clock.issueTimestamp();
	        this._version = ts;
	        return ts;
	    },

	    /**
	     * Returns an array of sources (caches,storages,uplinks,peers)
	     * a given replica should be subscribed to. This default
	     * implementation uses a simple consistent hashing scheme.
	     * Note that a client may be connected to many servers
	     * (peers), so the uplink selection logic is shared.
	     * @param {Spec} spec some object specifier
	     * @returns {Array} array of currently available uplinks for specified object
	     */
	    getSources: function (spec) {
	        var self = this,
	            uplinks = [],
	            mindist = 4294967295,
	            rePeer = /^swarm~/, // peers, not clients
	            target = env.hashfn(spec),
	            closestPeer = null;

	        if (rePeer.test(this._id)) {
	            mindist = Host.hashDistance(this._id, target);
	            closestPeer = this.storage;
	        } else {
	            uplinks.push(self.storage); // client-side cache
	        }

	        for (var id in this.sources) {
	            if (!rePeer.test(id)) {
	                continue;
	            }
	            var dist = Host.hashDistance(id, target);
	            if (dist < mindist) {
	                closestPeer = this.sources[id];
	                mindist = dist;
	            }
	        }
	        if (closestPeer) {
	            uplinks.push(closestPeer);
	        }
	        return uplinks;
	    },

	    isUplinked: function () {
	        for (var id in this.sources) {
	            if (/^swarm~.*/.test(id)) {
	                return true;
	            }
	        }
	        return false;
	    },

	    isServer: function () {
	        return this._server;
	    },

	    register: function (obj) {
	        var spec = obj.spec();
	        if (spec in this.objects) {
	            return this.objects[spec];
	        }
	        this.objects[spec] = obj;
	        return obj;
	    },

	    unregister: function (obj) {
	        var spec = obj.spec();
	        // TODO unsubscribe from the uplink - swarm-scale gc
	        if (spec in this.objects) {
	            delete this.objects[spec];
	        }
	    },

	    // waits for handshake from stream
	    accept: function (stream_or_url, pipe_env) {
	        new Pipe(this, stream_or_url, pipe_env);
	    },

	    // initiate handshake with peer
	    connect: function (stream_or_url, pipe_env) {
	        var pipe = new Pipe(this, stream_or_url, pipe_env);
	        pipe.deliver(new Spec('/Host#'+this._id+'!0.on'), '', this); //this.newEventSpec
	        return pipe;
	    },

	    disconnect: function (id) {
	        for (var peer_id in this.sources) {
	            if (id && peer_id != id) {
	                continue;
	            }
	            if (peer_id === this._id) {
	                // storage
	                continue;
	            }
	            var peer = this.sources[peer_id];
	            // normally, .off is sent by a downlink
	            peer.deliver(peer.spec().add(this.time(), '!').add('.off'));
	        }
	    },

	    close: function (cb) {
	        for(var id in this.sources) {
	            if (id===this._id) {continue;}
	            this.disconnect(id);
	        }
	        if (this.storage) {
	            this.storage.close(cb);
	        } else if (cb) {
	            cb();
	        }
	    },

	    checkUplink: function (spec) {
	        //  TBD Host event relay + PEX
	    }

	});


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var env = __webpack_require__(5);
	var Spec = __webpack_require__(6);

	/**
	 * A "pipe" is a channel to a remote Swarm Host. Pipe's interface
	 * mocks a Host except all calls are serialized and sent to the
	 * *stream*; any arriving data is parsed and delivered to the
	 * local host. The *stream* must support an interface of write(),
	 * end() and on('open'|'data'|'close'|'error',fn).  Instead of a
	 * *stream*, the caller may supply an *uri*, so the Pipe will
	 * create a stream and connect/reconnect as necessary.
	 */

	function Pipe(host, stream, opts) {
	    var self = this;
	    self.opts = opts || {};
	    if (!stream || !host) {
	        throw new Error('new Pipe(host,stream[,opts])');
	    }
	    self._id = null;
	    self.host = host;
	    // uplink/downlink state flag;
	    //  true: this side initiated handshake >.on <.reon
	    //  false: this side received handshake <.on >.reon
	    //  undefined: nothing sent/received OR had a .reoff
	    this.isOnSent = undefined;
	    this.reconnectDelay = self.opts.reconnectDelay || 1000;
	    self.serializer = self.opts.serializer || JSON;
	    self.katimer = null;
	    self.send_timer = null;
	    self.lastSendTS = self.lastRecvTS = self.time();
	    self.bundle = {};
	    // don't send immediately, delay to bundle more messages
	    self.delay = self.opts.delay || -1;
	    //self.reconnectDelay = self.opts.reconnectDelay || 1000;
	    if (typeof(stream.write) !== 'function') { // TODO nicer
	        var url = stream.toString();
	        var m = url.match(/(\w+):.*/);
	        if (!m) {
	            throw new Error('invalid url ' + url);
	        }
	        var proto = m[1].toLowerCase();
	        var fn = env.streams[proto];
	        if (!fn) {
	            throw new Error('protocol not supported: ' + proto);
	        }
	        self.url = url;
	        stream = new fn(url);
	    }
	    self.connect(stream);
	}

	module.exports = Pipe;
	//env.streams = {};
	Pipe.TIMEOUT = 60000; //ms

	Pipe.prototype.connect = function pc(stream) {
	    var self = this;
	    self.stream = stream;

	    self.stream.on('data', function onMsg(data) {
	        data = data.toString();
	        env.trace && env.log(dotIn, data, this, this.host);
	        self.lastRecvTS = self.time();
	        var json = self.serializer.parse(data);
	        try {
	            self._id ? self.parseBundle(json) : self.parseHandshake(json);
	        } catch (ex) {
	            console.error('error processing message', ex, ex.stack);
	            //this.deliver(this.host.newEventSpec('error'), ex.message);
	            this.close();
	        }
	        self.reconnectDelay = self.opts.reconnectDelay || 1000;
	    });

	    self.stream.on('close', function onConnectionClosed(reason) {
	        self.stream = null; // needs no further attention
	        self.close("stream closed");
	    });

	    self.stream.on('error', function (err) {
	        self.close('stream error event: ' + err);
	    });

	    self.katimer = setInterval(self.keepAliveFn.bind(self), (Pipe.TIMEOUT / 4 + Math.random() * 100) | 0);

	    // NOPE client only finally, initiate handshake
	    // self.host.connect(self);

	};

	Pipe.prototype.keepAliveFn = function () {
	    var now = this.time(),
	        sinceRecv = now - this.lastRecvTS,
	        sinceSend = now - this.lastSendTS;
	    if (sinceSend > Pipe.TIMEOUT / 2) {
	        this.sendBundle();
	    }
	    if (sinceRecv > Pipe.TIMEOUT) {
	        this.close("stream timeout");
	    }
	};

	Pipe.prototype.parseHandshake = function ph(handshake) {
	    var spec, value, key;
	    for (key in handshake) {
	        spec = new Spec(key);
	        value = handshake[key];
	        break; // 8)-
	    }
	    if (!spec) {
	        throw new Error('handshake has no spec');
	    }
	    if (spec.type() !== 'Host') {
	        env.warn("non-Host handshake");
	    }
	    if (spec.id() === this.host._id) {
	        throw new Error('self hs');
	    }
	    this._id = spec.id();
	    var op = spec.op();
	    var evspec = spec.set(this.host._id, '#');

	    if (op in {on: 1, reon: 1, off: 1, reoff: 1}) {// access denied TODO
	        this.host.deliver(evspec, value, this);
	    } else {
	        throw new Error('invalid handshake');
	    }
	};

	/**
	 * Close the underlying stream.
	 * Schedule new Pipe creation (when error passed).
	 * note: may be invoked multiple times
	 * @param {Error|string} error
	 */
	Pipe.prototype.close = function pc(error) {
	    env.log(dotClose, error ? 'error: ' + error : 'correct', this, this.host);
	    if (error && this.host && this.url) {
	        var uplink_uri = this.url,
	            host = this.host,
	            pipe_opts = this.opts;
	        //reconnect delay for next disconnection
	        pipe_opts.reconnectDelay = Math.min(30000, this.reconnectDelay << 1);
	        // schedule a retry
	        setTimeout(function () {
	            host.connect(uplink_uri, pipe_opts);
	        }, this.reconnectDelay);

	        this.url = null; //to prevent second reconnection timer
	    }
	    if (this.host) {
	        if (this.isOnSent !== undefined && this._id) {
	            // emulate normal off
	            var offspec = this.host.newEventSpec(this.isOnSent ? 'off' : 'reoff');
	            this.host.deliver(offspec, '', this);
	        }
	        this.host = null; // can't pass any more messages
	    }
	    if (this.katimer) {
	        clearInterval(this.katimer);
	        this.katimer = null;
	    }
	    if (this.stream) {
	        try {
	            this.stream.close();
	        } catch (ex) {}
	        this.stream = null;
	    }
	    this._id = null;
	};

	/**
	 * Sends operation to remote
	 */
	Pipe.prototype.deliver = function pd(spec, val, src) {
	    var self = this;
	    val && val.constructor === Spec && (val = val.toString());
	    if (spec.type() === 'Host') {
	        switch (spec.op()) {
	        case 'reoff':
	            setTimeout(function itsOverReally() {
	                self.isOnSent = undefined;
	                self.close();
	            }, 1);
	            break;
	        case 'off':
	            setTimeout(function tickingBomb() {
	                self.close();
	            }, 5000);
	            break;
	        case 'on':
	            this.isOnSent = true;
	        case 'reon':
	            this.isOnSent = false;
	        }
	    }
	    this.bundle[spec] = val === undefined ? null : val; // TODO aggregation
	    if (this.delay === -1) {
	        this.sendBundle();
	    } else if (!this.send_timer) {
	        var now = this.time(),
	            gap = now - this.lastSendTS,
	            timeout = gap > this.delay ? this.delay : this.delay - gap;
	        this.send_timer = setTimeout(this.sendBundle.bind(this), timeout); // hmmm...
	    } // else {} // just wait
	};

	/** @returns {number} milliseconds as an int */
	Pipe.prototype.time = function () { return new Date().getTime(); };

	/**
	 * @returns {Spec|string} remote host spec "/Host#peer_id" or empty string (when not handshaken yet)
	 */
	Pipe.prototype.spec = function () {
	    return this._id ? new Spec('/Host#' + this._id) : '';
	};
	/**
	 * @param {*} bundle is a bunch of operations in a form {operation_spec: operation_params_object}
	 * @private
	 */
	Pipe.prototype.parseBundle = function pb(bundle) {
	    var spec_list = [], spec, self = this;
	    //parse specifiers
	    for (spec in bundle) { spec && spec_list.push(new Spec(spec)); }
	    spec_list.sort().reverse();
	    while (spec = spec_list.pop()) {
	        spec = Spec.as(spec);
	        this.host.deliver(spec, bundle[spec], this);
	        if (spec.type() === 'Host' && spec.op() === 'reoff') { //TODO check #id
	            setTimeout(function () {
	                self.isOnSent = undefined;
	                self.close();
	            }, 1);
	        }
	    }
	};

	var dotIn = new Spec('/Pipe.in');
	var dotOut = new Spec('/Pipe.out');
	var dotClose = new Spec('/Pipe.close');
	//var dotOpen = new Spec('/Pipe.open');

	/**
	 * Sends operations buffered in this.bundle as a bundle {operation_spec: operation_params_object}
	 * @private
	 */
	Pipe.prototype.sendBundle = function pS() {
	    var payload = this.serializer.stringify(this.bundle);
	    this.bundle = {};
	    if (!this.stream) {
	        this.send_timer = null;
	        return; // too late
	    }

	    try {
	        env.trace && env.log(dotOut, payload, this, this.host);
	        this.stream.write(payload);
	        this.lastSendTS = this.time();
	    } catch (ex) {
	        env.error('stream error on write: ' + ex, ex.stack);
	        if (this._id) {
	            this.close('stream error', ex);
	        }
	    } finally {
	        this.send_timer = null;
	    }
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Syncable = __webpack_require__(8);

	function Storage(async) {
	    this.async = !!async || false;
	    this.states = {};
	    this.tails = {};
	    this.counts = {};
	    this._host = null;
	    // many implementations do not push changes
	    // so there are no listeners
	    this.lstn = null;
	    this._id = 'some_storage';
	}
	module.exports = Storage;
	Storage.prototype.MAX_LOG_SIZE = 10;
	Storage.prototype.isRoot = true; // may create global objects

	Storage.prototype.deliver = function (spec, value, src) {
	    var ret;
	    switch (spec.op()) {
	        // A storage is always an "uplink" so it never receives reon, reoff.
	    case 'on':
	        ret = this.on(spec, value, src); break;
	    case 'off':
	        ret = this.off(spec, value, src); break;
	    case 'init':
	        if (value._version) { // state
	            ret = this.init(spec, value, src);
	        } else { // patch
	            var ti = spec.filter('/#');
	            var specs = [], s;
	            for(s in value._tail) {  specs.push(s);  }
	            specs.sort();
	            while (s=specs.pop()) {
	                ret = this.anyOp( ti.add(s), value._tail[s], src);
	            }
	        }
	        break;
	    default:
	        ret = this.anyOp(spec, value, src);
	    }
	    return ret;
	};

	Storage.prototype.on = function storageOn (spec, base, src) {
	    var ti = spec.filter('/#');

	    if (this.lstn) {
	        var ls = this.lstn[ti];
	        if (ls === undefined) {
	            ls = src;
	        } else if (ls !== src) {
	            if (ls.constructor !== Array) {
	                ls = [ls];
	            }
	            ls.push(src);
	        }
	        this.lstn[ti] = ls;
	    }

	    var self = this;
	    var state;
	    var tail;

	    function sendResponse() {
	        if (!state) {
	            if (self.isRoot) {// && !spec.token('#').ext) {
	                // make 0 state for a global object TODO move to Host
	                state = {_version: '!0'};
	            }
	        }
	        if (tail) {
	            if (!state) {state={};}
	            state._tail = state._tail || {};
	            for (var s in tail) {
	                state._tail[s] = tail[s];
	            }
	        }
	        var tiv = ti.add(spec.version(), '!');
	        if (state) {
	            src.deliver(tiv.add('.init'), state, self);
	            src.deliver(tiv.add('.reon'), Syncable.stateVersionVector(state), self); // TODO and the tail
	        } else {
	            src.deliver(tiv.add('.reon'), '!0', self); // state unknown
	        }
	    }

	    this.readState(ti, function (err, s) {
	        state = s || null;
	        if (tail !== undefined) {
	            sendResponse();
	        }
	    });

	    this.readOps(ti, function (err, t) {
	        tail = t || null;
	        if (state !== undefined) {
	            sendResponse();
	        }
	    });
	};


	Storage.prototype.off = function (spec, value, src) {
	    if (!this.lstn) {
	        return;
	    }
	    var ti = spec.filter('/#');
	    var ls = this.lstn[ti];
	    if (ls === src) {
	        delete this.lstn[ti];
	    } else if (ls && ls.constructor === Array) {
	        var cleared = ls.filter(function (v) {return v !== src;});
	        if (cleared.length) {
	            this.lstn[ti] = cleared;
	        } else {
	            delete this.lstn[ti];
	        }
	    }
	};

	Storage.prototype.init = function (spec, state, src) {
	    var ti = spec.filter('/#'), self=this;
	    var saveops = this.tails[ti];
	    this.writeState(spec, state, function (err) {
	        if (err) {
	            console.error('state dump error:', err);
	        } else {
	            var tail = self.tails[ti] || (self.tails[ti] = {});
	            for(var op in saveops) { // OK, let's keep that in the log
	                tail[op] = saveops[op];
	            }
	        }
	    });
	};


	Storage.prototype.anyOp = function (spec, value, src) {
	    var self = this;
	    var ti = spec.filter('/#');
	    this.writeOp(spec, value, function (err) {
	        if (err) {
	            this.close(err); // the log is sacred
	        }
	    });
	    self.counts[ti] = self.counts[ti] || 0;
	    if (++self.counts[ti]>self.MAX_LOG_SIZE) {
	        // The storage piggybacks on the object's state/log handling logic
	        // First, it adds an op to the log tail unless the log is too long...
	        // ...otherwise it sends back a subscription effectively requesting
	        // the state, on state arrival zeroes the tail.
	        delete self.counts[ti];
	        src.deliver(spec.set('.reon'), '!0.init', self);
	    }
	};


	// In a real storage implementation, state and log often go into
	// different backends, e.g. the state is saved to SQL/NoSQL db,
	// while the log may live in a key-value storage.
	// As long as the state has sufficient versioning info saved with
	// it (like a version vector), we may purge the log lazily, once
	// we are sure that the state is reliably saved. So, the log may
	// overlap with the state (some ops are already applied). That
	// provides some necessary resilience to workaround the lack of
	// transactions across backends.
	// In case third parties may write to the backend, go figure
	// some way to deal with it (e.g. make a retrofit operation).
	Storage.prototype.writeState = function (spec, state, cb) {
	    var ti = spec.filter('/#');
	    this.states[ti] = JSON.stringify(state);
	    // tail is zeroed on state flush
	    delete this.tails[ti];
	    // callback is mandatory
	    cb();
	};

	Storage.prototype.writeOp = function (spec, value, cb) {
	    var ti = spec.filter('/#');
	    var vm = spec.filter('!.');
	    var tail = this.tails[ti] || (this.tails[ti] = {});
	    if (tail[vm]) {
	        console.error('op replay @storage'+vm+new Error().stack);
	    }
	    tail[vm] = JSON.stringify(value);
	    cb();
	};

	Storage.prototype.readState = function (ti, callback) {
	    var state = JSON.parse(this.states[ti] || null);

	    function sendResponse() {
	        callback(null, state);
	    }

	    // may force async behavior
	    this.async ? setTimeout(sendResponse, 1) : sendResponse();
	};

	Storage.prototype.readOps = function (ti, callback) {
	    var tail = JSON.parse(this.tails[ti] || null);
	    callback(null, tail);
	};

	Storage.prototype.close = function (callback) {
	    if (callback) { callback(); }
	};

	Storage.prototype.emit = function (spec,value) {
	    var ti = spec.filter('/#');
	    var ln = this.lstn[ti];
	    if (!ln) {return;}
	    if (ln && ln.constructor===Array) {
	        for(var i=0; ln && i<ln.length; i++) {
	            var l = ln[i];
	            if (l && l.constructor===Function) {
	                l(spec,value,this);
	            } else if (l && l.deliver) {
	                l.deliver(spec,value,this);
	            }
	        }
	    } else if (ln && ln.deliver) {
	        ln.deliver(spec,value,this);
	    } else if (ln && ln.constructor===Function) {
	        ln(spec,value,this);
	    }
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Spec = __webpack_require__(6);
	var Storage = __webpack_require__(14);


	/** SharedWebStorage may use localStorage or sessionStorage
	 *  to cache data. The role of ShWS is dual: it may also
	 *  bridge ops from one browser tab/window to another using
	 *  HTML5 onstorage events. */
	function SharedWebStorage(id, options) {
	    this.options = options || {};
	    this.lstn = {};
	    this._id = id;
	    this.tails = {};
	    this.store = this.options.persistent ?
	        window.localStorage : window.sessionStorage;

	    this.loadLog();
	    this.installListeners();
	}

	SharedWebStorage.prototype = new Storage();
	SharedWebStorage.prototype.isRoot = false;
	module.exports = SharedWebStorage;


	SharedWebStorage.prototype.onOp = function (spec, value) {
	    var ti = spec.filter('/#');
	    var vo = spec.filter('!.');
	    if (!vo.toString()) {
	        return; // state, not an op
	    }
	    var tail = this.tails[ti];
	    if (!tail) {
	        tail = this.tails[ti] = [];
	    } else if (tail.indexOf(vo)!==-1) {
	        return; // replay
	    }
	    tail.push(vo);
	    this.emit(spec,value);
	};


	SharedWebStorage.prototype.installListeners = function () {
	    var self = this;
	    function onStorageChange(ev) {
	        if (Spec.is(ev.key) && ev.newValue) {
	            self.onOp(new Spec(ev.key), JSON.parse(ev.newValue));
	        }
	    }
	    window.addEventListener('storage', onStorageChange, false);
	};


	SharedWebStorage.prototype.loadLog = function () {
	    // scan/sort specs for existing records
	    var store = this.store;
	    var ti;
	    for (var i = 0; i < store.length; i++) {
	        var key = store.key(i);
	        if (!Spec.is(key)) { continue; }
	        var spec = new Spec(key);
	        if (spec.pattern() !== '/#!.') {
	            continue; // ops only
	        }
	        ti = spec.filter('/#');
	        var tail = this.tails[ti];
	        if (!tail) {
	            tail = this.tails[ti] = [];
	        }
	        tail.push(spec.filter('!.'));
	    }
	    for (ti in this.tails) {
	        this.tails[ti].sort();
	    }
	};


	SharedWebStorage.prototype.writeOp = function wsOp(spec, value, src) {
	    var ti = spec.filter('/#');
	    var vm = spec.filter('!.');
	    var tail = this.tails[ti] || (this.tails[ti] = []);
	    tail.push(vm);
	    var json = JSON.stringify(value);
	    this.store.setItem(spec, json);
	    if (this.options.trigger) {
	        var otherStore = !this.options.persistent ?
	            window.localStorage : window.sessionStorage;
	        if (!otherStore.getItem(spec)) {
	            otherStore.setItem(spec,json);
	            otherStore.removeItem(spec,json);
	        }
	    }
	};


	SharedWebStorage.prototype.writeState = function wsPatch(spec, state, src) {
	    var ti = spec.filter('/#');
	    this.store.setItem(ti, JSON.stringify(state));
	    var tail = this.tails[ti];
	    if (tail) {
	        for(var k=0; k<tail.length; k++) {
	            this.store.removeItem(ti + tail[k]);
	        }
	        delete this.tails[ti];
	    }
	};

	SharedWebStorage.prototype.readState = function (spec, callback) {
	    spec = new Spec(spec);
	    var ti = spec.filter('/#');
	    var state = this.store.getItem(ti);
	    callback(null, (state&&JSON.parse(state)) || null);
	};

	SharedWebStorage.prototype.readOps = function (ti, callback) {
	    var tail = this.tails[ti];
	    var parsed = null;
	    for(var k=0; tail && k<tail.length; k++) {
	        var spec = tail[k];
	        var value = this.store.getItem(ti+spec);
	        if (!value) {continue;} // it happens
	        parsed = parsed || {};
	        parsed[spec] = JSON.parse(value);
	    }
	    callback(null, parsed);
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var env = __webpack_require__(5);
	var Spec = __webpack_require__(6);
	var Storage = __webpack_require__(14);
	var SecondPreciseClock = __webpack_require__(22);

	/** LevelDB is a perfect local storage: string-indexed, alphanumerically
	  * sorted, stores JSON with minimal overhead. Last but not least, has
	  * the same interface as IndexedDB. */
	function LevelStorage (id, options, callback) {
	    Storage.call(this);
	    this.options = options;
	    this._host = null; // will be set by the Host
	    this.db = options.db;
	    this._id = id;
	    this.filename = null;
	    if (this.db.constructor===Function) {
	        this.db = this.db(options.path||id);
	    }
	    this.logtails = {};
	    var clock_fn = env.clock || SecondPreciseClock;
	    this.clock = new clock_fn(this._id);
	}
	LevelStorage.prototype = new Storage();
	module.exports = LevelStorage;
	LevelStorage.prototype.isRoot = env.isServer;

	LevelStorage.prototype.open = function (callback) {
	    this.db.open(this.options.dbOptions||{}, callback);
	};

	LevelStorage.prototype.writeState = function (spec, state, cb) {
	    console.log('>STATE',state);
	    var self = this;
	    var ti = spec.filter('/#');
	    //var save = JSON.stringify(state, undefined, 2);
	    if (!self.db) {
	        console.warn('the storage is not open', this._host&&this._host._id);
	        return;
	    }

	    var json = JSON.stringify(state);
	    var cleanup = [], key;
	    if (ti in this.logtails) {
	        while (key = this.logtails[ti].pop()) {
	            cleanup.push({
	                key: key,
	                type: 'del'
	            });
	        }
	        delete this.logtails[ti];
	    }
	    console.log('>FLUSH',json,cleanup.length);
	    self.db.put(ti, json, function onSave(err) {
	        if (!err && cleanup.length && self.db) {
	            console.log('>CLEAN',cleanup);
	            self.db.batch(cleanup, function(err){
	                err && console.error('log trimming failed',err);
	            });
	        }
	        err && console.error("state write error", err);
	        cb(err);
	    });

	};

	LevelStorage.prototype.writeOp = function (spec, value, cb) {
	    var json = JSON.stringify(value);
	    var ti = spec.filter('/#');
	    if (!this.logtails[ti]) {
	        this.logtails[ti] = [];
	    }
	    this.logtails[ti].push(spec);
	    console.log('>OP',spec.toString(),json);
	    this.db.put(spec.toString(), json, function (err){
	        err && console.error('op write error',err);
	        cb(err);
	    });
	};


	LevelStorage.prototype.readState = function (ti, callback) {
	    var self = this;
	    ti = ti.toString();
	    this.db.get(ti, {asBuffer:false}, function(err,value){

	        var notFound = err && /^NotFound/.test(err.message);
	        if (err && !notFound) { return callback(err); }

	        if ((err && notFound) || !value) {
	            err = null;
	            value = {_version: '!0'};
	        } else {
	            value = JSON.parse(value);
	        }

	        console.log('<STATE',self._host && self._host._id,value);
	        callback(err, value);
	    });
	};


	LevelStorage.prototype.readOps = function (ti, callback) {
	    var self = this;
	    var tail = {}, log = [];
	    var i = this.db.iterator({
	        gt: ti+' ',
	        lt: ti+'0'
	    });
	    i.next(function recv(err,key,value){
	        if (err) {
	            callback(err);
	            i.end(function(err){});
	        } else if (key) {
	            var spec = new Spec(key);
	            var vo = spec.filter('!.');
	            tail[vo] = JSON.parse(value.toString());
	            log.push(vo);
	            i.next(recv);
	        } else {
	            console.log('<TAIL',self._host && self._host._id,tail);
	            self.logtails[ti] = ti in self.logtails ?
	                self.logtails[ti].concat(log) : log;
	            callback(null, tail);
	            i.end(function(err){
	                err && console.error("can't close an iter",err);
	            });
	        }
	    });
	};

	LevelStorage.prototype.off = function (spec,val,src) {
	    var ti = spec.filter('/#');
	    delete this.logtails[ti];
	    Storage.prototype.off.call(this,spec,val,src);
	};

	LevelStorage.prototype.close = function (callback,error) { // FIXME
	    if (error) {
	        console.log("fatal IO error", error);
	    }
	    if (this.db) {
	        this.db.close(callback);
	        this.db = null;
	    } else {
	        callback(); // closed already
	    }
	};

	/*
	process.on('uncaughtException', function(err) {
	    CLOSE ALL DATABASES
	});
	*/


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var env = __webpack_require__(5);

	function WebSocketStream(url) {
	    var self = this;
	    var ln = this.lstn = {};
	    this.url = url;
	    var ws = this.ws = new WebSocket(url);
	    var buf = this.buf = [];
	    ws.onopen = function () {
	        buf.reverse();
	        self.buf = null;
	        while (buf.length) {
	            self.write(buf.pop());
	        }

	    };
	    ws.onclose = function () { ln.close && ln.close(); };
	    ws.onmessage = function (msg) {
	        ln.data && ln.data(msg.data);
	    };
	    ws.onerror = function (err) { ln.error && ln.error(err); };
	}

	WebSocketStream.prototype.on = function (evname, fn) {
	    if (evname in this.lstn) {
	        var self = this,
	            prev_fn = this.lstn[evname];
	        this.lstn[evname] = function () {
	            prev_fn.apply(self, arguments);
	            fn.apply(self, arguments);
	        };
	    } else {
	        this.lstn[evname] = fn;
	    }
	};

	WebSocketStream.prototype.write = function (data) {
	    if (this.buf) {
	        this.buf.push(data);
	    } else {
	        this.ws.send(data);
	    }
	};

	env.streams.ws = env.streams.wss = WebSocketStream;
	module.exports = WebSocketStream;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var env = __webpack_require__(5);
	var Spec = __webpack_require__(6);

	module.exports = {

	    deliver: function (spec,val,source) {
	        var sync = this.sync;
	        var version = sync._version;
	        if (this.props.listenEntries) {
	            var opId = '!' + spec.version();
	            if (version !== opId) {
	                version = opId;
	            }
	        }
	        this.setState({version: version});
	    },

	    componentWillMount: function () {
	        var spec = this.props.spec || this.props.key;
	        if (!Spec.is(spec)) {
	            if (spec && this.constructor.modelType) {
	                var id = spec;
	                spec = new Spec(this.constructor.modelType,'/'); // TODO fn!!!
	                spec = spec.add(id,'#');
	            } else {
	                throw new Error('not a specifier: '+spec+' at '+this._rootNodeID);
	            }
	        }
	        this.sync = env.localhost.get(spec);
	        this.setState({version:''});
	        if (!env.isServer) {
	            var sync = this.sync;
	            sync.on('init', this); // TODO single listener
	            sync.on(this);
	            if (this.props.listenEntries) {
	                sync.onObjectEvent(this);
	            }
	        }
	    },

	    componentWillUnmount: function () {
	        if (!env.isServer) {
	            var sync = this.sync;
	            sync.off(this);
	            sync.off(this); // FIXME: remove after TODO: prevent second subscription
	            if (this.props.listenEntries) {
	                sync.offObjectEvent(this);
	            }
	        }
	    },

	    shouldComponentUpdate: function (nextProps, nextState) {
	        return this.props !== nextProps || this.state.version !== nextState.version;
	    }

	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function ProxyListener() {
	    this.callbacks = null;
	    this.owner = null;
	}

	ProxyListener.prototype.deliver = function (spec,value,src) {
	    if (this.callbacks===null) { return; }
	    var that = this.owner || src;
	    for(var i=0; i<this.callbacks.length; i++) {
	        var cb = this.callbacks[i];
	        if (cb.constructor===Function) {
	            cb.call(that,spec,value,src);
	        } else {
	            cb.deliver(spec,value,src);
	        }
	    }
	};

	ProxyListener.prototype.on = function (callback) {
	    if (this.callbacks===null) { this.callbacks = []; }
	    this.callbacks.push(callback);
	};

	ProxyListener.prototype.off = function (callback) {
	    if (this.callbacks===null) { return; }
	    var i = this.callbacks.indexOf(callback);
	    if (i!==-1) {
	        this.callbacks.splice(i,1);
	    } else {
	        console.warn('listener unknown', callback);
	    }
	};

	module.exports = ProxyListener;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";


	module.exports = {

	    /**
	     * Subscribe on collections entries' events
	     * @param {function(Spec|string, Object, {deliver: function()})} callback
	     * @this Set|Vector
	     */
	    onObjectEvent: function (callback) {
	        this._proxy.owner = this;
	        this._proxy.on(callback);
	    },

	    /**
	     * Unsubscribe from collections entries' events
	     * @param {function(*)} callback
	     * @this Set|Vector
	     */
	    offObjectEvent: function (callback) {
	        this._proxy.off(callback);
	    },

	    /**
	     * Waits for collection to receive state from cache or uplink and then invokes passed callback
	     *
	     * @param {function()} callback
	     * @this Set|Vector
	     */
	    onObjectStateReady: function (callback) { // TODO timeout ?
	        var self = this;
	        function checker() {
	            var notInitedYet = self.filter(function (entry) {
	                return !entry._version;
	            });
	            if (!notInitedYet.length) {
	                // all entries are inited
	                callback();
	            } else {
	                // wait for some entry not ready yet
	                var randomIdx = (Math.random() * (notInitedYet.length - 1)) | 0;
	                notInitedYet[randomIdx].once('init', checker);
	            }
	        }
	        if (this._version) {
	            checker();
	        } else {
	            this.once('init', checker);
	        }
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Spec = __webpack_require__(6);

	/** Swarm is based on the Lamport model of time and events in a
	  * distributed system, so Lamport timestamps are essential to
	  * its functioning. In most of the cases, it is useful to
	  * use actuall wall clock time to create timestamps. This
	  * class creates second-precise Lamport timestamps.
	  * Timestamp ordering is alphanumeric, length may vary.
	  *
	  * @param processId id of the process/clock to add to every
	  *        timestamp (like !timeseq+gritzko~ssn, where gritzko
	  *        is the user and ssn is a session id, so processId
	  *        is "gritzko~ssn").
	  * @param initTime normally, that is server-supplied timestamp
	  *        to init our time offset; there is no guarantee about
	  *        clock correctness on the client side
	  */
	var SecondPreciseClock = function (processId, timeOffsetMs) {
	    if (!Spec.reTok.test(processId)) {
	        throw new Error('invalid process id: '+processId);
	    }
	    this.id = processId;
	    // sometimes we assume our local clock has some offset
	    this.clockOffsetMs = 0;
	    this.lastTimestamp = '';
	    // although we try hard to use wall clock time, we must
	    // obey Lamport logical clock rules, in particular our
	    // timestamps must be greater than any other timestamps
	    // previously seen
	    this.lastTimeSeen = 0;
	    this.lastSeqSeen = 0;
	    if (timeOffsetMs) {
	        this.clockOffsetMs = timeOffsetMs;
	    }
	};

	var epochDate = new Date("Wed, 01 Jan 2014 00:00:00 GMT");
	SecondPreciseClock.EPOCH = epochDate.getTime();

	SecondPreciseClock.prototype.adjustTime = function (trueMs) {
	    var localTime = this.ms();
	    var clockOffsetMs = trueMs - localTime;
	    this.clockOffsetMs = clockOffsetMs;
	    var lastTS = this.lastTimeSeen;
	    this.lastTimeSeen = 0;
	    this.lastSeqSeen = 0;
	    this.lastTimestamp = '';
	    if ( this.seconds()+1 < lastTS ) {
	        console.error("risky clock reset",this.lastTimestamp);
	    }
	};

	SecondPreciseClock.prototype.ms = function () {
	    var millis = new Date().getTime();
	    millis -= SecondPreciseClock.EPOCH;
	    return millis;
	};

	SecondPreciseClock.prototype.seconds = function () {
	    var millis = this.ms();
	    millis += this.clockOffsetMs;
	    return (millis/1000) | 0;
	};

	SecondPreciseClock.prototype.issueTimestamp = function time () {
	    var res = this.seconds();
	    if (this.lastTimeSeen>res) { res = this.lastTimeSeen; }
	    if (res>this.lastTimeSeen) { this.lastSeqSeen = -1; }
	    this.lastTimeSeen = res;
	    var seq = ++this.lastSeqSeen;
	    if (seq>=(1<<12)) {throw new Error('max event freq is 4000Hz');}

	    var baseTimeSeq = Spec.int2base(res, 5);
	    if (seq>0) { baseTimeSeq+=Spec.int2base(seq, 2); }

	    this.lastTimestamp = baseTimeSeq + '+' + this.id;
	    return this.lastTimestamp;
	};

	//SecondPreciseClock.reQTokExt = new RegExp(Spec.rsTokExt); // no 'g'

	SecondPreciseClock.prototype.parseTimestamp = function parse (ts) {
	    var m = ts.match(Spec.reTokExt);
	    if (!m) {throw new Error('malformed timestamp: '+ts);}
	    var timeseq=m[1]; //, process=m[2];
	    var time = timeseq.substr(0,5), seq = timeseq.substr(5);
	    if (seq&&seq.length!==2) {
	        throw new Error('malformed timestamp value: '+timeseq);
	    }
	    return {
	        time: Spec.base2int(time),
	        seq: seq ? Spec.base2int(seq) : 0
	    };
	};

	/** Freshly issued Lamport logical tiemstamps must be greater than
	    any timestamps previously seen. */
	SecondPreciseClock.prototype.checkTimestamp = function see (ts) {
	    if (ts<this.lastTimestamp) { return true; }
	    var parsed = this.parseTimestamp(ts);
	    if (parsed.time<this.lastTimeSeen) { return true; }
	    var sec = this.seconds();
	    if (parsed.time>sec+1) {
	        return false; // back to the future
	    }
	    this.lastTimeSeen = parsed.time;
	    this.lastSeqSeen = parsed.seq;
	    return true;
	};

	SecondPreciseClock.prototype.timestamp2date = function (ts) {
	    var parsed = this.parseTimestamp(ts);
	    var millis = parsed.time * 1000 + SecondPreciseClock.EPOCH;
	    return new Date(millis);
	};


	module.exports = SecondPreciseClock;


/***/ }
/******/ ])