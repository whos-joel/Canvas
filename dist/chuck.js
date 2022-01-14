/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chuckArt.ts":
/*!*************************!*\
  !*** ./src/chuckArt.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const drawPolygon_1 = __webpack_require__(/*! ./drawPolygon */ "./src/drawPolygon.ts");
const getPixelData_1 = __webpack_require__(/*! ./getPixelData */ "./src/getPixelData.ts");
const colorConverters_1 = __webpack_require__(/*! ./colorConverters */ "./src/colorConverters.ts");
class ChuckArt {
    constructor(ctx, ctx2) {
        this.ctx = ctx;
        this.ctx2 = ctx2;
    }
    pixelate(size, br) {
        pixelate(this.ctx, this.ctx2, size, br);
    }
    pixelate2(size, br) {
        pixelate2(this.ctx, this.ctx2, size, br);
    }
}
exports["default"] = ChuckArt;
function pixelate(ctx, ctx2, size, br) {
    let pixels = getPixelData_1.default(ctx, size);
    const xLen = Math.ceil(ctx.canvas.width / size);
    const yLen = Math.ceil(ctx.canvas.height / size);
    for (let y = 0; y < yLen; y++) {
        for (let x = 0; x < xLen; x++) {
            let i = x + y * xLen;
            //   if (br === 0 || size === 10 || size === 3 || Math.round(Math.random() * size) >= size / 2)
            //     draw(ctx2, x * size * 2, y * size * 2, size, pixels[i], 4, i, br);
            if ((size === 3 && y > yLen / 4 && y < yLen - yLen / 4 && x > xLen / 4 && x < xLen - xLen / 4) ||
                br === 0 ||
                //size === 10 ||
                //size === 3 ||
                Math.round(Math.random() * size) >= size / 2)
                draw(ctx2, x * size * 2, y * size * 2, size, pixels[i], 4, i, br);
        }
    }
}
function pixelate2(ctx, ctx2, size, br) {
    let pixels = getPixelData_1.default(ctx, size);
    const xLen = Math.ceil(ctx.canvas.width / size);
    const yLen = Math.ceil(ctx.canvas.height / size);
    let coords = [];
    for (let y = 0; y < yLen; y++) {
        for (let x = 0; x < xLen; x++) {
            let i = x + y * xLen;
            coords.push({ x: x * size * 2, y: y * size * 2, pixel: pixels[i] });
        }
    }
    for (let i = 0; i < pixels.length; i++) {
        let r = Math.floor(Math.random() * coords.length);
        let coord = coords.splice(r, 1);
        draw2(ctx2, coord[0].x, coord[0].y, size, coord[0].pixel, 4, i, br);
    }
}
function draw(ctx, x, y, rad, pixel, n, p, br) {
    let colors = rad <= 3
        ? modifyColor(pixel, Math.random() * 45 - 22, Math.random() * 0.25 - 0.125, Math.random() * 0.25 - 0.125)
        : modifyColor(pixel, Math.random() * 190 - 95, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25);
    let newRad = br === 0 ? Math.hypot(rad, rad) : rad;
    let s = Math.round(Math.random() * (rad > 10 ? 6 : 2)) + 3;
    drawPolygon_1.default(ctx, {
        x: br === 0 ? x + rad : x + rad * (Math.random() * 2),
        y: br === 0 ? y + rad : y + rad * (Math.random() * 2),
        sides: Math.random() * br === 0 ? 8 : s,
        radius: newRad > 3 ? newRad : Math.random() * 10 - 3,
        rotation: br === 0 ? 45 : p,
        borderRadius: 0,
        strokeColor: "rgba(255, 255, 255, .25)",
        strokeWidth: rad > 5 ? 0 : 0,
        fill: colors[0],
    });
}
function draw2(ctx, x, y, rad, pixel, n, p, br) {
    let colors = rad <= 3
        ? modifyColor(pixel, Math.random() * 45 - 22, Math.random() * 0.25 - 0.125, Math.random() * 0.25 - 0.125)
        : modifyColor(pixel, Math.random() * 190 - 95, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25);
    let newRad = Math.hypot(rad, rad) + (Math.ceil(Math.random() * rad));
    let s = Math.round(Math.random() * (rad > 10 ? 6 : 2)) + 4;
    drawPolygon_1.default(ctx, {
        x: x + rad,
        y: y + rad,
        sides: s,
        radius: newRad,
        rotation: p,
        borderRadius: newRad / 5,
        strokeColor: "rgba(255, 255, 255, .25)",
        strokeWidth: 0,
        fill: colors[0],
    });
}
function getExtractColors(color, n, a) {
    let colors = [`rgba(${color.r}, ${color.g},${color.b}, ${a})`];
    let r = color.r;
    let g = color.g;
    let b = color.b;
    for (let i = 0; i < n; i++) {
        let r1 = Math.random() * r;
        let g1 = Math.random() * g;
        let b1 = Math.random() * b;
        r -= r1;
        g -= g1;
        b -= b1;
        colors.push(`rgba(${r1}, ${g1}, ${b1}, ${color.a})`);
    }
    colors.push(`rgba(${r}, ${g}, ${b}, ${color.a})`);
    return colors;
}
function modifyColor({ r, g, b }, h, s, l) {
    let hsl = colorConverters_1.RgbToHsl(r, g, b);
    hsl.h += h;
    //hsl.h = hsl.h > 360 ? 100 : hsl.h < 0 ? 0 : hsl.h;
    hsl.s += hsl.s * s;
    hsl.s = hsl.s > 100 ? 100 : hsl.s < 0 ? 0 : hsl.s;
    hsl.l += hsl.l * l;
    hsl.l = hsl.l > 100 ? 100 : hsl.l < 0 ? 0 : hsl.l;
    let rgb = colorConverters_1.HslToRgb(hsl.h, hsl.s, hsl.l);
    return [formatRgba(rgb.r, rgb.g, rgb.b, 1)];
}
function drawRect(ctx, x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
}
function drawCircle(ctx, x, y, r, h, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}
function formatRgba(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}


/***/ }),

/***/ "./src/colorConverters.ts":
/*!********************************!*\
  !*** ./src/colorConverters.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HslToRgb = exports.RgbToHsl = void 0;
function RgbToHsl(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;
    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    l = (cmax + cmin) / 2;
    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
}
exports.RgbToHsl = RgbToHsl;
function HslToRgb(h, s, l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return { r, g, b };
}
exports.HslToRgb = HslToRgb;


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

/***/ "./src/getPixelData.ts":
/*!*****************************!*\
  !*** ./src/getPixelData.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getPixelData(ctx, size) {
    let colors = [];
    const xLen = ctx.canvas.width / size;
    const yLen = ctx.canvas.height / size;
    for (let y = 0; y < yLen; y++) {
        for (let x = 0; x < xLen; x++) {
            let data = ctx.getImageData(x * size, y * size, size, size).data;
            colors.push(getAverageValue(data));
        }
    }
    return colors;
}
exports["default"] = getPixelData;
function getRgba(data) {
    const length = data.length / 4;
    let rgba = [];
    for (let i = 0; i < length; i++) {
        let q = i * 4;
        rgba.push({
            r: data[q],
            g: data[q + 1],
            b: data[q + 2],
            a: data[q + 3],
        });
    }
    return rgba;
}
function getAverageValue(data) {
    let rgba = getRgba(data);
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (let i = 0; i < rgba.length; i++) {
        r += rgba[i].r;
        g += rgba[i].g;
        b += rgba[i].b;
        a += rgba[i].a;
    }
    return {
        r: r / rgba.length,
        g: g / rgba.length,
        b: b / rgba.length,
        a: a / rgba.length,
    };
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
  !*** ./src/images.ts ***!
  \***********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const createCanvas_1 = __webpack_require__(/*! ./createCanvas */ "./src/createCanvas.ts");
const chuckArt_1 = __webpack_require__(/*! ./chuckArt */ "./src/chuckArt.ts");
__webpack_require__(/*! ./../styles/site.less */ "./styles/site.less");
// import drawPolygon from "./drawPolygon.js";
// import getPixelData from "./getPixelData.js";
// import { RgbToHsl, HslToRgb } from "./colorConverters.js";
let image = new Image();
image.onload = function () {
    let pixelSize = 60;
    let width = image.width + (image.width % pixelSize);
    let height = image.height + (image.height % pixelSize);
    const canvas = createCanvas_1.default({
        width: width,
        height: height,
    });
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
    const canvas2 = createCanvas_1.default({
        width: ctx.canvas.width * 2,
        height: ctx.canvas.height * 2,
    });
    const ctx2 = canvas2.getContext("2d");
    ctx2.fillStyle = "#000";
    ctx2.fillRect(0, 0, ctx.canvas.width * 2, ctx.canvas.height * 2);
    var chuck = new chuckArt_1.default(ctx, ctx2);
    //chuck.pixelate(ctx, ctx2, pixelSize, 0);
    chuck.pixelate2(40, 0);
    //chuck.pixelate(ctx, ctx2, 30, 10);
    //chuck.pixelate(ctx, ctx2, 10, 5);
    //chuck.pixelate(6, 4);
    //chuck.pixelate(5, 3);
    chuck.pixelate(4, 2);
    chuck.pixelate(3, 1);
};
image.src = "/images/jimi.png";

})();

/******/ })()
;
//# sourceMappingURL=chuck.js.map