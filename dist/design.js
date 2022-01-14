/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animateSine.ts":
/*!****************************!*\
  !*** ./src/animateSine.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cosCurve = exports.sinCurve = exports.setTweenerData = void 0;
function setTweenerData(tweeners, out, radius) {
    for (let i = 0; i < tweeners.length; i++) {
        let tweener = tweeners[i];
        let polygon = tweener.polygon;
        if (out) {
            if (i == tweeners.length - 1 || tweeners[i + 1].polygon.rotation <= 270) {
                setOutData(tweener, polygon, i, radius);
            }
        }
        else {
            if (i == 0 || tweeners[i - 1].polygon.rotation >= 90) {
                setInData(tweener, polygon, i, radius);
            }
        }
    }
}
exports.setTweenerData = setTweenerData;
function setOutData(tweener, polygon, i, radius) {
    let fromRadius = radius / 3 - i * 20;
    let toRadius = 0;
    let fromBorder = 20 - i;
    let toBorder = 0;
    if (polygon.rotation > 0) {
        setTweenData(tweener, polygon, {
            f: 0.65,
            r1: 360,
            r2: 0,
            rc: -55,
            fromRadius,
            toRadius,
            fromBorder,
            toBorder,
            s1: 1,
            s2: 0,
        });
    }
    else {
        polygon.rotation = 0;
    }
}
function setInData(tweener, polygon, i, radius) {
    let fromRadius = 0;
    let toRadius = radius / 3 - i * 20;
    let fromBorder = 0;
    let toBorder = 20 - i;
    if (polygon.rotation < 360) {
        setTweenData(tweener, polygon, {
            f: 0.65,
            r1: 0,
            r2: 360,
            rc: 55,
            fromRadius,
            toRadius,
            fromBorder,
            toBorder,
            s1: 0,
            s2: 1,
        });
    }
    else {
        polygon.rotation = 360;
    }
}
function setTweenData(tweener, polygon, { f, r1, r2, rc, fromRadius, toRadius, fromBorder, toBorder, s1, s2 }) {
    //tweener.friction += f;
    //tweener.progress = getProgress(r1, r2, polygon.rotation);
    let d = 200;
    let s = stretchCurve(3, d, tweener.progress, sinCurve);
    //polygon.rotation = r1 + sinCurve(r1, r2, tweener.progress, d);
    polygon.rotation = r1 + (s * (r2 - r1));
    if (polygon.radius !== toRadius)
        polygon.radius =
            fromRadius + (s * (toRadius - fromRadius)); //sinCurve(fromRadius, toRadius, s, 1); //sinCurve(fromRadius, toRadius, tweener.progress, d);
    polygon.borderRadius =
        fromBorder + (s * (toBorder - fromBorder)); //sinCurve(fromBorder, toBorder, tweener.progress, d);
    polygon.strokeWidth = s1 + (s * (s2 - s1)); //sinCurve(s1, s2, tweener.progress, d);
    tweener.progress++;
}
function stretchCurve(amount, duration, progress, func) {
    let p = progress / duration;
    for (let i = 0; i < amount; i++) {
        p = func(0, 1, p, 1);
    }
    return p;
}
function sinCurve(from, to, current, duration) {
    return Math.sin((Math.PI / 2) * (current / duration)) * (to - from);
}
exports.sinCurve = sinCurve;
function cosCurve(from, to, current, duration) {
    return (to - from - Math.cos((Math.PI / 2) * (current / duration)) * (to - from));
}
exports.cosCurve = cosCurve;


/***/ }),

/***/ "./src/createCanvas.ts":
/*!*****************************!*\
  !*** ./src/createCanvas.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function createCanvas({ width, height, position = "inherit" }) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.style.position = position;
    document.getElementsByTagName("body")[0].append(canvas);
    return canvas;
}
exports["default"] = createCanvas;


/***/ }),

/***/ "./src/drawPolygon.ts":
/*!****************************!*\
  !*** ./src/drawPolygon.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function drawPolygon(ctx, { x = 0, y = 0, sides = 5, radius = 100, rotation = 0, borderRadius = 0, strokeColor = "#999", strokeWidth = 1, fill = "#ccc", }) {
    if (sides < 3)
        throw "Cannot draw polygon with less than 3 sides";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = fill;
    let controlPoints = getControlPoints(sides, radius, rotation);
    let points = getPoints(borderRadius, controlPoints);
    for (let i = 0; i < sides; i++) {
        if (i === 0) {
            ctx.moveTo(points[i][0].x + x, points[i][0].y + y);
            ctx.lineTo(points[i][1].x + x, points[i][1].y + y);
        }
        else {
            ctx.quadraticCurveTo(controlPoints[i].x + x, controlPoints[i].y + y, points[i][0].x + x, points[i][0].y + y);
            ctx.lineTo(points[i][1].x + x, points[i][1].y + y);
        }
    }
    ctx.quadraticCurveTo(controlPoints[0].x + x, controlPoints[0].y + y, points[0][0].x + x, points[0][0].y + y);
    if (strokeWidth > 0)
        ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
}
exports["default"] = drawPolygon;
function getControlPoints(sides, radius, rotation) {
    const segmentRadian = toRadian(360 / sides);
    const rotationRadian = toRadian(rotation);
    let cp = [];
    for (let i = 0; i < sides; i++) {
        const x = Math.sin(segmentRadian * i + rotationRadian) * radius;
        const y = Math.cos(segmentRadian * i + rotationRadian) * radius;
        cp.push({ x: x, y: y });
    }
    return cp;
}
function getPoints(cornerRadius, controlPoints) {
    let hypotenuse = Math.hypot(controlPoints[0].x - controlPoints[1].x, controlPoints[0].y - controlPoints[1].y);
    const upper = hypotenuse - cornerRadius;
    let p = [];
    for (let i = 0; i < controlPoints.length; i++) {
        const x = (i < controlPoints.length - 1
            ? controlPoints[i + 1].x
            : controlPoints[0].x) - controlPoints[i].x;
        const y = (i < controlPoints.length - 1
            ? controlPoints[i + 1].y
            : controlPoints[0].y) - controlPoints[i].y;
        let radian = Math.atan2(y, x);
        const sin = Math.sin(radian);
        const cos = Math.cos(radian);
        p.push([
            {
                x: cos * cornerRadius + controlPoints[i].x,
                y: sin * cornerRadius + controlPoints[i].y,
            },
            {
                x: cos * upper + controlPoints[i].x,
                y: sin * upper + controlPoints[i].y,
            },
        ]);
    }
    return p;
}
function toRadian(degrees) {
    return (Math.PI / 180) * degrees;
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/less-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./styles/site.less":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/less-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./styles/site.less ***!
  \***************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\n  margin: 0;\n  padding: 0;\n  background-color: black;\n}\n", "",{"version":3,"sources":["webpack://./styles/site.less"],"names":[],"mappings":"AAAA;EACI,SAAA;EACA,UAAA;EACA,uBAAA;AACJ","sourcesContent":["body{\n    margin: 0;\n    padding: 0;\n    background-color: black;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./styles/site.less":
/*!**************************!*\
  !*** ./styles/site.less ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var api = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!../node_modules/less-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./site.less */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/less-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./styles/site.less");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!***********************!*\
  !*** ./src/design.ts ***!
  \***********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const drawPolygon_1 = __webpack_require__(/*! ./drawPolygon */ "./src/drawPolygon.ts");
const animateSine_1 = __webpack_require__(/*! ./animateSine */ "./src/animateSine.ts");
const createCanvas_1 = __webpack_require__(/*! ./createCanvas */ "./src/createCanvas.ts");
__webpack_require__(/*! ./../styles/site.less */ "./styles/site.less");
///import setTweenerData from "./animate.js";
let polygons = [];
let polygonCount = 8;
let polygonSides = 5;
let running = false;
let tweeners = [];
let out = false;
let start = -1;
let progress = 0;
const width = 800;
const height = 800;
function draw(canvas, tweeners) {
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0, 0);
    for (let i = 0; i < tweeners.length; i++) {
        drawPolygon_1.default(ctx, tweeners[i].polygon);
    }
    ctx.restore();
}
const canvas = createCanvas_1.default({
    width: width,
    height: height,
    position: "absolute",
});
function step(timestamp) {
    //if(start === -1) start = timestamp;
    //let progress = timestamp - start;
    progress++;
    animateSine_1.setTweenerData(tweeners, out, width);
    draw(canvas, tweeners);
    if (!out &&
        tweeners.filter((t) => t.polygon.rotation >= 360).length === tweeners.length) {
        reset();
        progress = 0;
        out = true;
    }
    else if (out &&
        tweeners.filter((t) => t.polygon.rotation === 0).length === tweeners.length) {
        reset();
        progress = 0;
        out = false;
    }
    if (running)
        window.requestAnimationFrame(step);
}
window.addEventListener("click", listener);
function listener() {
    running = !running;
    if (running) {
        window.requestAnimationFrame(step);
    }
}
function init() {
    tweeners = [];
    for (let i = 0; i < polygonCount; i++) {
        polygons.push({
            x: width / 2,
            y: height / 2,
            radius: 0,
            sides: polygonSides,
            rotation: 0,
            borderRadius: 20,
            strokeWidth: 0,
            strokeColor: "rgba(255, 255, 255, .15)",
            fill: "rgba(205, 100, 100, .15)",
        });
        tweeners.push({
            friction: 1,
            progress: 0,
            polygon: polygons[i]
        });
    }
}
function reset() {
    for (let i = 0; i < polygonCount; i++) {
        tweeners[i].friction = 1;
        tweeners[i].progress = 0;
    }
}
init();
drawCurves(animateSine_1.cosCurve, 700);
drawCurves(animateSine_1.sinCurve, 550);
function drawCurves(func, x) {
    const ctx = canvas.getContext("2d");
    let arr = [];
    for (let i = 0; i <= 10; i++) {
        arr.push(func(0, 100, i, 10));
        let y = i === 0 ? 0 : arr.reduce((a, b) => a + b + 5, 0) - arr[i] - 5;
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, 100, arr[i]);
    }
}

})();

/******/ })()
;
//# sourceMappingURL=design.js.map