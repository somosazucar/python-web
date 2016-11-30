(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var Vibrant;

Vibrant = require('./vibrant');

Vibrant.DefaultOpts.Image = require('./image/browser');

module.exports = Vibrant;

},{"./image/browser":7,"./vibrant":16}],3:[function(require,module,exports){
module.exports = function(r, g, b, a) {
  return a >= 125 && !(r > 250 && g > 250 && b > 250);
};

},{}],4:[function(require,module,exports){
module.exports.Default = require('./default');

},{"./default":3}],5:[function(require,module,exports){
var DefaultGenerator, DefaultOpts, Generator, Swatch, util,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

Swatch = require('../swatch');

util = require('../util');

Generator = require('./index');

DefaultOpts = {
  targetDarkLuma: 0.26,
  maxDarkLuma: 0.45,
  minLightLuma: 0.55,
  targetLightLuma: 0.74,
  minNormalLuma: 0.3,
  targetNormalLuma: 0.5,
  maxNormalLuma: 0.7,
  targetMutesSaturation: 0.3,
  maxMutesSaturation: 0.4,
  targetVibrantSaturation: 1.0,
  minVibrantSaturation: 0.35,
  weightSaturation: 3,
  weightLuma: 6,
  weightPopulation: 1
};

module.exports = DefaultGenerator = (function(superClass) {
  extend(DefaultGenerator, superClass);

  DefaultGenerator.prototype.HighestPopulation = 0;

  function DefaultGenerator(opts) {
    this.opts = util.defaults(opts, DefaultOpts);
    this.VibrantSwatch = null;
    this.LightVibrantSwatch = null;
    this.DarkVibrantSwatch = null;
    this.MutedSwatch = null;
    this.LightMutedSwatch = null;
    this.DarkMutedSwatch = null;
  }

  DefaultGenerator.prototype.generate = function(swatches) {
    this.swatches = swatches;
    this.maxPopulation = this.findMaxPopulation;
    this.generateVarationColors();
    return this.generateEmptySwatches();
  };

  DefaultGenerator.prototype.getVibrantSwatch = function() {
    return this.VibrantSwatch;
  };

  DefaultGenerator.prototype.getLightVibrantSwatch = function() {
    return this.LightVibrantSwatch;
  };

  DefaultGenerator.prototype.getDarkVibrantSwatch = function() {
    return this.DarkVibrantSwatch;
  };

  DefaultGenerator.prototype.getMutedSwatch = function() {
    return this.MutedSwatch;
  };

  DefaultGenerator.prototype.getLightMutedSwatch = function() {
    return this.LightMutedSwatch;
  };

  DefaultGenerator.prototype.getDarkMutedSwatch = function() {
    return this.DarkMutedSwatch;
  };

  DefaultGenerator.prototype.generateVarationColors = function() {
    this.VibrantSwatch = this.findColorVariation(this.opts.targetNormalLuma, this.opts.minNormalLuma, this.opts.maxNormalLuma, this.opts.targetVibrantSaturation, this.opts.minVibrantSaturation, 1);
    this.LightVibrantSwatch = this.findColorVariation(this.opts.targetLightLuma, this.opts.minLightLuma, 1, this.opts.targetVibrantSaturation, this.opts.minVibrantSaturation, 1);
    this.DarkVibrantSwatch = this.findColorVariation(this.opts.targetDarkLuma, 0, this.opts.maxDarkLuma, this.opts.targetVibrantSaturation, this.opts.minVibrantSaturation, 1);
    this.MutedSwatch = this.findColorVariation(this.opts.targetNormalLuma, this.opts.minNormalLuma, this.opts.maxNormalLuma, this.opts.targetMutesSaturation, 0, this.opts.maxMutesSaturation);
    this.LightMutedSwatch = this.findColorVariation(this.opts.targetLightLuma, this.opts.minLightLuma, 1, this.opts.targetMutesSaturation, 0, this.opts.maxMutesSaturation);
    return this.DarkMutedSwatch = this.findColorVariation(this.opts.targetDarkLuma, 0, this.opts.maxDarkLuma, this.opts.targetMutesSaturation, 0, this.opts.maxMutesSaturation);
  };

  DefaultGenerator.prototype.generateEmptySwatches = function() {
    var hsl;
    if (this.VibrantSwatch === null) {
      if (this.DarkVibrantSwatch !== null) {
        hsl = this.DarkVibrantSwatch.getHsl();
        hsl[2] = this.opts.targetNormalLuma;
        this.VibrantSwatch = new Swatch(util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }
    if (this.DarkVibrantSwatch === null) {
      if (this.VibrantSwatch !== null) {
        hsl = this.VibrantSwatch.getHsl();
        hsl[2] = this.opts.targetDarkLuma;
        return this.DarkVibrantSwatch = new Swatch(util.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
      }
    }
  };

  DefaultGenerator.prototype.findMaxPopulation = function() {
    var j, len, population, ref, swatch;
    population = 0;
    ref = this.swatches;
    for (j = 0, len = ref.length; j < len; j++) {
      swatch = ref[j];
      population = Math.max(population, swatch.getPopulation());
    }
    return population;
  };

  DefaultGenerator.prototype.findColorVariation = function(targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation) {
    var j, len, luma, max, maxValue, ref, sat, swatch, value;
    max = null;
    maxValue = 0;
    ref = this.swatches;
    for (j = 0, len = ref.length; j < len; j++) {
      swatch = ref[j];
      sat = swatch.getHsl()[1];
      luma = swatch.getHsl()[2];
      if (sat >= minSaturation && sat <= maxSaturation && luma >= minLuma && luma <= maxLuma && !this.isAlreadySelected(swatch)) {
        value = this.createComparisonValue(sat, targetSaturation, luma, targetLuma, swatch.getPopulation(), this.HighestPopulation);
        if (max === null || value > maxValue) {
          max = swatch;
          maxValue = value;
        }
      }
    }
    return max;
  };

  DefaultGenerator.prototype.createComparisonValue = function(saturation, targetSaturation, luma, targetLuma, population, maxPopulation) {
    return this.weightedMean(this.invertDiff(saturation, targetSaturation), this.opts.weightSaturation, this.invertDiff(luma, targetLuma), this.opts.weightLuma, population / maxPopulation, this.opts.weightPopulation);
  };

  DefaultGenerator.prototype.invertDiff = function(value, targetValue) {
    return 1 - Math.abs(value - targetValue);
  };

  DefaultGenerator.prototype.weightedMean = function() {
    var i, sum, sumWeight, value, values, weight;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    sum = 0;
    sumWeight = 0;
    i = 0;
    while (i < values.length) {
      value = values[i];
      weight = values[i + 1];
      sum += value * weight;
      sumWeight += weight;
      i += 2;
    }
    return sum / sumWeight;
  };

  DefaultGenerator.prototype.isAlreadySelected = function(swatch) {
    return this.VibrantSwatch === swatch || this.DarkVibrantSwatch === swatch || this.LightVibrantSwatch === swatch || this.MutedSwatch === swatch || this.DarkMutedSwatch === swatch || this.LightMutedSwatch === swatch;
  };

  return DefaultGenerator;

})(Generator);

},{"../swatch":14,"../util":15,"./index":6}],6:[function(require,module,exports){
var Generator;

module.exports = Generator = (function() {
  function Generator() {}

  Generator.prototype.generate = function(swatches) {};

  Generator.prototype.getVibrantSwatch = function() {};

  Generator.prototype.getLightVibrantSwatch = function() {};

  Generator.prototype.getDarkVibrantSwatch = function() {};

  Generator.prototype.getMutedSwatch = function() {};

  Generator.prototype.getLightMutedSwatch = function() {};

  Generator.prototype.getDarkMutedSwatch = function() {};

  return Generator;

})();

module.exports.Default = require('./default');

},{"./default":5}],7:[function(require,module,exports){
var BrowserImage, Image, Url, isRelativeUrl, isSameOrigin,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Image = require('./index');

Url = require('url');

isRelativeUrl = function(url) {
  var u;
  u = Url.parse(url);
  return u.protocol === null && u.host === null && u.port === null;
};

isSameOrigin = function(a, b) {
  var ua, ub;
  ua = Url.parse(a);
  ub = Url.parse(b);
  return ua.protocol === ub.protocol && ua.hostname === ub.hostname && ua.port === ub.port;
};

module.exports = BrowserImage = (function(superClass) {
  extend(BrowserImage, superClass);

  function BrowserImage(path, cb) {
    if (typeof path === 'object' && path instanceof HTMLImageElement) {
      this.img = path;
      path = this.img.src;
    } else {
      this.img = document.createElement('img');
      this.img.src = path;
    }
    if (!isRelativeUrl(path) && !isSameOrigin(window.location.href, path)) {
      this.img.crossOrigin = 'anonymous';
    }
    this.img.onload = (function(_this) {
      return function() {
        _this._initCanvas();
        return typeof cb === "function" ? cb(null, _this) : void 0;
      };
    })(this);
    if (this.img.complete) {
      this.img.onload();
    }
    this.img.onerror = (function(_this) {
      return function(e) {
        var err;
        err = new Error("Fail to load image: " + path);
        err.raw = e;
        return typeof cb === "function" ? cb(err) : void 0;
      };
    })(this);
  }

  BrowserImage.prototype._initCanvas = function() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.width = this.canvas.width = this.img.width;
    this.height = this.canvas.height = this.img.height;
    return this.context.drawImage(this.img, 0, 0, this.width, this.height);
  };

  BrowserImage.prototype.clear = function() {
    return this.context.clearRect(0, 0, this.width, this.height);
  };

  BrowserImage.prototype.getWidth = function() {
    return this.width;
  };

  BrowserImage.prototype.getHeight = function() {
    return this.height;
  };

  BrowserImage.prototype.resize = function(w, h, r) {
    this.width = this.canvas.width = w;
    this.height = this.canvas.height = h;
    this.context.scale(r, r);
    return this.context.drawImage(this.img, 0, 0);
  };

  BrowserImage.prototype.update = function(imageData) {
    return this.context.putImageData(imageData, 0, 0);
  };

  BrowserImage.prototype.getPixelCount = function() {
    return this.width * this.height;
  };

  BrowserImage.prototype.getImageData = function() {
    return this.context.getImageData(0, 0, this.width, this.height);
  };

  BrowserImage.prototype.removeCanvas = function() {
    return this.canvas.parentNode.removeChild(this.canvas);
  };

  return BrowserImage;

})(Image);

},{"./index":8,"url":25}],8:[function(require,module,exports){
var Image;

module.exports = Image = (function() {
  function Image() {}

  Image.prototype.clear = function() {};

  Image.prototype.update = function(imageData) {};

  Image.prototype.getWidth = function() {};

  Image.prototype.getHeight = function() {};

  Image.prototype.scaleDown = function(opts) {
    var height, maxSide, ratio, width;
    width = this.getWidth();
    height = this.getHeight();
    ratio = 1;
    if (opts.maxDimension != null) {
      maxSide = Math.max(width, height);
      if (maxSide > opts.maxDimension) {
        ratio = opts.maxDimension / maxSide;
      }
    } else {
      ratio = 1 / opts.quality;
    }
    if (ratio < 1) {
      return this.resize(width * ratio, height * ratio, ratio);
    }
  };

  Image.prototype.resize = function(w, h, r) {};

  Image.prototype.getPixelCount = function() {};

  Image.prototype.getImageData = function() {};

  Image.prototype.removeCanvas = function() {};

  return Image;

})();

},{}],9:[function(require,module,exports){
var MMCQ, PQueue, RSHIFT, SIGBITS, Swatch, VBox, getColorIndex, ref, util;

ref = util = require('../../util'), getColorIndex = ref.getColorIndex, SIGBITS = ref.SIGBITS, RSHIFT = ref.RSHIFT;

Swatch = require('../../swatch');

VBox = require('./vbox');

PQueue = require('./pqueue');

module.exports = MMCQ = (function() {
  MMCQ.DefaultOpts = {
    maxIterations: 1000,
    fractByPopulations: 0.75
  };

  function MMCQ(opts) {
    this.opts = util.defaults(opts, this.constructor.DefaultOpts);
  }

  MMCQ.prototype.quantize = function(pixels, opts) {
    var color, colorCount, hist, pq, pq2, shouldIgnore, swatches, v, vbox;
    if (pixels.length === 0 || opts.colorCount < 2 || opts.colorCount > 256) {
      throw new Error("Wrong MMCQ parameters");
    }
    shouldIgnore = function() {
      return false;
    };
    if (Array.isArray(opts.filters) && opts.filters.length > 0) {
      shouldIgnore = function(r, g, b, a) {
        var f, i, len, ref1;
        ref1 = opts.filters;
        for (i = 0, len = ref1.length; i < len; i++) {
          f = ref1[i];
          if (!f(r, g, b, a)) {
            return true;
          }
        }
        return false;
      };
    }
    vbox = VBox.build(pixels, shouldIgnore);
    hist = vbox.hist;
    colorCount = Object.keys(hist).length;
    pq = new PQueue(function(a, b) {
      return a.count() - b.count();
    });
    pq.push(vbox);
    this._splitBoxes(pq, this.opts.fractByPopulations * opts.colorCount);
    pq2 = new PQueue(function(a, b) {
      return a.count() * a.volume() - b.count() * b.volume();
    });
    pq2.contents = pq.contents;
    this._splitBoxes(pq2, opts.colorCount - pq2.size());
    swatches = [];
    this.vboxes = [];
    while (pq2.size()) {
      v = pq2.pop();
      color = v.avg();
      if (!(typeof shouldIgnore === "function" ? shouldIgnore(color[0], color[1], color[2], 255) : void 0)) {
        this.vboxes.push(v);
        swatches.push(new Swatch(color, v.count()));
      }
    }
    return swatches;
  };

  MMCQ.prototype._splitBoxes = function(pq, target) {
    var colorCount, iteration, maxIterations, ref1, vbox, vbox1, vbox2;
    colorCount = 1;
    iteration = 0;
    maxIterations = this.opts.maxIterations;
    while (iteration < maxIterations) {
      iteration++;
      vbox = pq.pop();
      if (!vbox.count()) {
        continue;
      }
      ref1 = vbox.split(), vbox1 = ref1[0], vbox2 = ref1[1];
      pq.push(vbox1);
      if (vbox2) {
        pq.push(vbox2);
        colorCount++;
      }
      if (colorCount >= target || iteration > maxIterations) {
        return;
      }
    }
  };

  return MMCQ;

})();

},{"../../swatch":14,"../../util":15,"./pqueue":10,"./vbox":11}],10:[function(require,module,exports){
var PQueue;

module.exports = PQueue = (function() {
  function PQueue(comparator) {
    this.comparator = comparator;
    this.contents = [];
    this.sorted = false;
  }

  PQueue.prototype._sort = function() {
    this.contents.sort(this.comparator);
    return this.sorted = true;
  };

  PQueue.prototype.push = function(o) {
    this.contents.push(o);
    return this.sorted = false;
  };

  PQueue.prototype.peek = function(index) {
    if (!this.sorted) {
      this._sort();
    }
    if (index == null) {
      index = this.contents.length - 1;
    }
    return this.contents[index];
  };

  PQueue.prototype.pop = function() {
    if (!this.sorted) {
      this._sort();
    }
    return this.contents.pop();
  };

  PQueue.prototype.size = function() {
    return this.contents.length;
  };

  PQueue.prototype.map = function(f) {
    if (!this.sorted) {
      this._sort();
    }
    return this.contents.map(f);
  };

  return PQueue;

})();

},{}],11:[function(require,module,exports){
var RSHIFT, SIGBITS, VBox, getColorIndex, ref, util;

ref = util = require('../../util'), getColorIndex = ref.getColorIndex, SIGBITS = ref.SIGBITS, RSHIFT = ref.RSHIFT;

module.exports = VBox = (function() {
  VBox.build = function(pixels, shouldIgnore) {
    var a, b, bmax, bmin, g, gmax, gmin, hist, hn, i, index, n, offset, r, rmax, rmin;
    hn = 1 << (3 * SIGBITS);
    hist = new Uint32Array(hn);
    rmax = gmax = bmax = 0;
    rmin = gmin = bmin = Number.MAX_VALUE;
    n = pixels.length / 4;
    i = 0;
    while (i < n) {
      offset = i * 4;
      i++;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      if (shouldIgnore(r, g, b, a)) {
        continue;
      }
      r = r >> RSHIFT;
      g = g >> RSHIFT;
      b = b >> RSHIFT;
      index = getColorIndex(r, g, b);
      hist[index] += 1;
      if (r > rmax) {
        rmax = r;
      }
      if (r < rmin) {
        rmin = r;
      }
      if (g > gmax) {
        gmax = g;
      }
      if (g < gmin) {
        gmin = g;
      }
      if (b > bmax) {
        bmax = b;
      }
      if (b < bmin) {
        bmin = b;
      }
    }
    return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, hist);
  };

  function VBox(r1, r2, g1, g2, b1, b2, hist1) {
    this.r1 = r1;
    this.r2 = r2;
    this.g1 = g1;
    this.g2 = g2;
    this.b1 = b1;
    this.b2 = b2;
    this.hist = hist1;
  }

  VBox.prototype.invalidate = function() {
    delete this._count;
    delete this._avg;
    return delete this._volume;
  };

  VBox.prototype.volume = function() {
    if (this._volume == null) {
      this._volume = (this.r2 - this.r1 + 1) * (this.g2 - this.g1 + 1) * (this.b2 - this.b1 + 1);
    }
    return this._volume;
  };

  VBox.prototype.count = function() {
    var c, hist;
    if (this._count == null) {
      hist = this.hist;
      c = 0;
      
      for (var r = this.r1; r <= this.r2; r++) {
        for (var g = this.g1; g <= this.g2; g++) {
          for (var b = this.b1; b <= this.b2; b++) {
            var index = getColorIndex(r, g, b);
            c += hist[index];
          }
        }
      }
      ;
      this._count = c;
    }
    return this._count;
  };

  VBox.prototype.clone = function() {
    return new VBox(this.r1, this.r2, this.g1, this.g2, this.b1, this.b2, this.hist);
  };

  VBox.prototype.avg = function() {
    var bsum, gsum, hist, mult, ntot, rsum;
    if (this._avg == null) {
      hist = this.hist;
      ntot = 0;
      mult = 1 << (8 - SIGBITS);
      rsum = gsum = bsum = 0;
      
      for (var r = this.r1; r <= this.r2; r++) {
        for (var g = this.g1; g <= this.g2; g++) {
          for (var b = this.b1; b <= this.b2; b++) {
            var index = getColorIndex(r, g, b);
            var h = hist[index];
            ntot += h;
            rsum += (h * (r + 0.5) * mult);
            gsum += (h * (g + 0.5) * mult);
            bsum += (h * (b + 0.5) * mult);
          }
        }
      }
      ;
      if (ntot) {
        this._avg = [~~(rsum / ntot), ~~(gsum / ntot), ~~(bsum / ntot)];
      } else {
        this._avg = [~~(mult * (this.r1 + this.r2 + 1) / 2), ~~(mult * (this.g1 + this.g2 + 1) / 2), ~~(mult * (this.b1 + this.b2 + 1) / 2)];
      }
    }
    return this._avg;
  };

  VBox.prototype.split = function() {
    var accSum, bw, d, doCut, gw, hist, i, j, maxd, maxw, ref1, reverseSum, rw, splitPoint, sum, total, vbox;
    hist = this.hist;
    if (!this.count()) {
      return null;
    }
    if (this.count() === 1) {
      return [this.clone()];
    }
    rw = this.r2 - this.r1 + 1;
    gw = this.g2 - this.g1 + 1;
    bw = this.b2 - this.b1 + 1;
    maxw = Math.max(rw, gw, bw);
    accSum = null;
    sum = total = 0;
    maxd = null;
    switch (maxw) {
      case rw:
        maxd = 'r';
        accSum = new Uint32Array(this.r2 + 1);
        
        for (var r = this.r1; r <= this.r2; r++) {
          sum = 0
          for (var g = this.g1; g <= this.g2; g++) {
            for (var b = this.b1; b <= this.b2; b++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[r] = total;
        }
        ;
        break;
      case gw:
        maxd = 'g';
        accSum = new Uint32Array(this.g2 + 1);
        
        for (var g = this.g1; g <= this.g2; g++) {
          sum = 0
          for (var r = this.r1; r <= this.r2; r++) {
            for (var b = this.b1; b <= this.b2; b++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[g] = total;
        }
        ;
        break;
      case bw:
        maxd = 'b';
        accSum = new Uint32Array(this.b2 + 1);
        
        for (var b = this.b1; b <= this.b2; b++) {
          sum = 0
          for (var r = this.r1; r <= this.r2; r++) {
            for (var g = this.g1; g <= this.g2; g++) {
              var index = getColorIndex(r, g, b);
              sum += hist[index];
            }
          }
          total += sum;
          accSum[b] = total;
        }
        ;
    }
    splitPoint = -1;
    reverseSum = new Uint32Array(accSum.length);
    for (i = j = 0, ref1 = accSum.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
      d = accSum[i];
      if (splitPoint < 0 && d > total / 2) {
        splitPoint = i;
      }
      reverseSum[i] = total - d;
    }
    vbox = this;
    doCut = function(d) {
      var c2, d1, d2, dim1, dim2, left, right, vbox1, vbox2;
      dim1 = d + "1";
      dim2 = d + "2";
      d1 = vbox[dim1];
      d2 = vbox[dim2];
      vbox1 = vbox.clone();
      vbox2 = vbox.clone();
      left = splitPoint - d1;
      right = d2 - splitPoint;
      if (left <= right) {
        d2 = Math.min(d2 - 1, ~~(splitPoint + right / 2));
        d2 = Math.max(0, d2);
      } else {
        d2 = Math.max(d1, ~~(splitPoint - 1 - left / 2));
        d2 = Math.min(vbox[dim2], d2);
      }
      while (!accSum[d2]) {
        d2++;
      }
      c2 = reverseSum[d2];
      while (!c2 && accSum[d2 - 1]) {
        c2 = reverseSum[--d2];
      }
      vbox1[dim2] = d2;
      vbox2[dim1] = d2 + 1;
      return [vbox1, vbox2];
    };
    return doCut(maxd);
  };

  VBox.prototype.contains = function(p) {
    var b, g, r;
    r = p[0] >> RSHIFT;
    g = p[1] >> RSHIFT;
    b = p[2] >> RSHIFT;
    return r >= this.r1 && r <= this.r2 && g >= this.g1 && g <= this.g2 && b >= this.b1 && b <= this.b2;
  };

  return VBox;

})();

},{"../../util":15}],12:[function(require,module,exports){
var Quantizer;

module.exports = Quantizer = (function() {
  function Quantizer() {}

  Quantizer.prototype.initialize = function(pixels, opts) {};

  Quantizer.prototype.getQuantizedColors = function() {};

  return Quantizer;

})();

module.exports.MMCQ = require('./mmcq');

},{"./mmcq":13}],13:[function(require,module,exports){
var MMCQ, MMCQImpl, Quantizer, Swatch,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Swatch = require('../swatch');

Quantizer = require('./index');

MMCQImpl = require('./impl/mmcq');

module.exports = MMCQ = (function(superClass) {
  extend(MMCQ, superClass);

  function MMCQ() {
    return MMCQ.__super__.constructor.apply(this, arguments);
  }

  MMCQ.prototype.initialize = function(pixels, opts) {
    var mmcq;
    this.opts = opts;
    mmcq = new MMCQImpl();
    return this.swatches = mmcq.quantize(pixels, this.opts);
  };

  MMCQ.prototype.getQuantizedColors = function() {
    return this.swatches;
  };

  return MMCQ;

})(Quantizer);

},{"../swatch":14,"./impl/mmcq":9,"./index":12}],14:[function(require,module,exports){
var Swatch, util;

util = require('./util');


/*
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  Swatch class
 */

module.exports = Swatch = (function() {
  Swatch.prototype.hsl = void 0;

  Swatch.prototype.rgb = void 0;

  Swatch.prototype.population = 1;

  Swatch.prototype.yiq = 0;

  function Swatch(rgb, population) {
    this.rgb = rgb;
    this.population = population;
  }

  Swatch.prototype.getHsl = function() {
    if (!this.hsl) {
      return this.hsl = util.rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2]);
    } else {
      return this.hsl;
    }
  };

  Swatch.prototype.getPopulation = function() {
    return this.population;
  };

  Swatch.prototype.getRgb = function() {
    return this.rgb;
  };

  Swatch.prototype.getHex = function() {
    return util.rgbToHex(this.rgb[0], this.rgb[1], this.rgb[2]);
  };

  Swatch.prototype.getTitleTextColor = function() {
    this._ensureTextColors();
    if (this.yiq < 200) {
      return "#fff";
    } else {
      return "#000";
    }
  };

  Swatch.prototype.getBodyTextColor = function() {
    this._ensureTextColors();
    if (this.yiq < 150) {
      return "#fff";
    } else {
      return "#000";
    }
  };

  Swatch.prototype._ensureTextColors = function() {
    if (!this.yiq) {
      return this.yiq = (this.rgb[0] * 299 + this.rgb[1] * 587 + this.rgb[2] * 114) / 1000;
    }
  };

  return Swatch;

})();

},{"./util":15}],15:[function(require,module,exports){
var DELTAE94, RSHIFT, SIGBITS;

DELTAE94 = {
  NA: 0,
  PERFECT: 1,
  CLOSE: 2,
  GOOD: 10,
  SIMILAR: 50
};

SIGBITS = 5;

RSHIFT = 8 - SIGBITS;

module.exports = {
  clone: function(o) {
    var _o, key, value;
    if (typeof o === 'object') {
      if (Array.isArray(o)) {
        return o.map((function(_this) {
          return function(v) {
            return _this.clone(v);
          };
        })(this));
      } else {
        _o = {};
        for (key in o) {
          value = o[key];
          _o[key] = this.clone(value);
        }
        return _o;
      }
    }
    return o;
  },
  defaults: function() {
    var _o, i, key, len, o, value;
    o = {};
    for (i = 0, len = arguments.length; i < len; i++) {
      _o = arguments[i];
      for (key in _o) {
        value = _o[key];
        if (o[key] == null) {
          o[key] = this.clone(value);
        }
      }
    }
    return o;
  },
  hexToRgb: function(hex) {
    var m;
    m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (m != null) {
      return [m[1], m[2], m[3]].map(function(s) {
        return parseInt(s, 16);
      });
    }
    return null;
  },
  rgbToHex: function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
  },
  rgbToHsl: function(r, g, b) {
    var d, h, l, max, min, s;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = void 0;
    s = void 0;
    l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h, s, l];
  },
  hslToRgb: function(h, s, l) {
    var b, g, hue2rgb, p, q, r;
    r = void 0;
    g = void 0;
    b = void 0;
    hue2rgb = function(p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };
    if (s === 0) {
      r = g = b = l;
    } else {
      q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
      p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - (1 / 3));
    }
    return [r * 255, g * 255, b * 255];
  },
  rgbToXyz: function(r, g, b) {
    var x, y, z;
    r /= 255;
    g /= 255;
    b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92;
    r *= 100;
    g *= 100;
    b *= 100;
    x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x, y, z];
  },
  xyzToCIELab: function(x, y, z) {
    var L, REF_X, REF_Y, REF_Z, a, b;
    REF_X = 95.047;
    REF_Y = 100;
    REF_Z = 108.883;
    x /= REF_X;
    y /= REF_Y;
    z /= REF_Z;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    L = 116 * y - 16;
    a = 500 * (x - y);
    b = 200 * (y - z);
    return [L, a, b];
  },
  rgbToCIELab: function(r, g, b) {
    var ref, x, y, z;
    ref = this.rgbToXyz(r, g, b), x = ref[0], y = ref[1], z = ref[2];
    return this.xyzToCIELab(x, y, z);
  },
  deltaE94: function(lab1, lab2) {
    var L1, L2, WEIGHT_C, WEIGHT_H, WEIGHT_L, a1, a2, b1, b2, dL, da, db, xC1, xC2, xDC, xDE, xDH, xDL, xSC, xSH;
    WEIGHT_L = 1;
    WEIGHT_C = 1;
    WEIGHT_H = 1;
    L1 = lab1[0], a1 = lab1[1], b1 = lab1[2];
    L2 = lab2[0], a2 = lab2[1], b2 = lab2[2];
    dL = L1 - L2;
    da = a1 - a2;
    db = b1 - b2;
    xC1 = Math.sqrt(a1 * a1 + b1 * b1);
    xC2 = Math.sqrt(a2 * a2 + b2 * b2);
    xDL = L2 - L1;
    xDC = xC2 - xC1;
    xDE = Math.sqrt(dL * dL + da * da + db * db);
    if (Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC))) {
      xDH = Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC);
    } else {
      xDH = 0;
    }
    xSC = 1 + 0.045 * xC1;
    xSH = 1 + 0.015 * xC1;
    xDL /= WEIGHT_L;
    xDC /= WEIGHT_C * xSC;
    xDH /= WEIGHT_H * xSH;
    return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);
  },
  rgbDiff: function(rgb1, rgb2) {
    var lab1, lab2;
    lab1 = this.rgbToCIELab.apply(this, rgb1);
    lab2 = this.rgbToCIELab.apply(this, rgb2);
    return this.deltaE94(lab1, lab2);
  },
  hexDiff: function(hex1, hex2) {
    var rgb1, rgb2;
    rgb1 = this.hexToRgb(hex1);
    rgb2 = this.hexToRgb(hex2);
    return this.rgbDiff(rgb1, rgb2);
  },
  DELTAE94_DIFF_STATUS: DELTAE94,
  getColorDiffStatus: function(d) {
    if (d < DELTAE94.NA) {
      return "N/A";
    }
    if (d <= DELTAE94.PERFECT) {
      return "Perfect";
    }
    if (d <= DELTAE94.CLOSE) {
      return "Close";
    }
    if (d <= DELTAE94.GOOD) {
      return "Good";
    }
    if (d < DELTAE94.SIMILAR) {
      return "Similar";
    }
    return "Wrong";
  },
  SIGBITS: SIGBITS,
  RSHIFT: RSHIFT,
  getColorIndex: function(r, g, b) {
    return (r << (2 * SIGBITS)) + (g << SIGBITS) + b;
  }
};

},{}],16:[function(require,module,exports){

/*
  From Vibrant.js by Jari Zwarts
  Ported to node.js by AKFish

  Color algorithm class that finds variations on colors in an image.

  Credits
  --------
  Lokesh Dhakar (http://www.lokeshdhakar.com) - Created ColorThief
  Google - Palette support library in Android
 */
var Builder, DefaultGenerator, Filter, Swatch, Vibrant, util,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Swatch = require('./swatch');

util = require('./util');

DefaultGenerator = require('./generator').Default;

Filter = require('./filter');

module.exports = Vibrant = (function() {
  Vibrant.DefaultOpts = {
    colorCount: 64,
    quality: 5,
    generator: new DefaultGenerator(),
    Image: null,
    Quantizer: require('./quantizer').MMCQ,
    filters: []
  };

  Vibrant.from = function(src) {
    return new Builder(src);
  };

  Vibrant.prototype.quantize = require('quantize');

  Vibrant.prototype._swatches = [];

  function Vibrant(sourceImage, opts) {
    this.sourceImage = sourceImage;
    if (opts == null) {
      opts = {};
    }
    this.swatches = bind(this.swatches, this);
    this.opts = util.defaults(opts, this.constructor.DefaultOpts);
    this.generator = this.opts.generator;
  }

  Vibrant.prototype.getPalette = function(cb) {
    var image;
    return image = new this.opts.Image(this.sourceImage, (function(_this) {
      return function(err, image) {
        var error, error1;
        if (err != null) {
          return cb(err);
        }
        try {
          _this._process(image, _this.opts);
          return cb(null, _this.swatches());
        } catch (error1) {
          error = error1;
          return cb(error);
        }
      };
    })(this));
  };

  Vibrant.prototype.getSwatches = function(cb) {
    return this.getPalette(cb);
  };

  Vibrant.prototype._process = function(image, opts) {
    var imageData, quantizer, swatches;
    image.scaleDown(this.opts);
    imageData = image.getImageData();
    quantizer = new this.opts.Quantizer();
    quantizer.initialize(imageData.data, this.opts);
    swatches = quantizer.getQuantizedColors();
    this.generator.generate(swatches);
    return image.removeCanvas();
  };

  Vibrant.prototype.swatches = function() {
    return {
      Vibrant: this.generator.getVibrantSwatch(),
      Muted: this.generator.getMutedSwatch(),
      DarkVibrant: this.generator.getDarkVibrantSwatch(),
      DarkMuted: this.generator.getDarkMutedSwatch(),
      LightVibrant: this.generator.getLightVibrantSwatch(),
      LightMuted: this.generator.getLightMutedSwatch()
    };
  };

  return Vibrant;

})();

module.exports.Builder = Builder = (function() {
  function Builder(src1, opts1) {
    this.src = src1;
    this.opts = opts1 != null ? opts1 : {};
    this.opts.filters = util.clone(Vibrant.DefaultOpts.filters);
  }

  Builder.prototype.maxColorCount = function(n) {
    this.opts.colorCount = n;
    return this;
  };

  Builder.prototype.maxDimension = function(d) {
    this.opts.maxDimension = d;
    return this;
  };

  Builder.prototype.addFilter = function(f) {
    if (typeof f === 'function') {
      this.opts.filters.push(f);
    }
    return this;
  };

  Builder.prototype.removeFilter = function(f) {
    var i;
    if ((i = this.opts.filters.indexOf(f)) > 0) {
      this.opts.filters.splice(i);
    }
    return this;
  };

  Builder.prototype.clearFilters = function() {
    this.opts.filters = [];
    return this;
  };

  Builder.prototype.quality = function(q) {
    this.opts.quality = q;
    return this;
  };

  Builder.prototype.useImage = function(image) {
    this.opts.Image = image;
    return this;
  };

  Builder.prototype.useGenerator = function(generator) {
    this.opts.generator = generator;
    return this;
  };

  Builder.prototype.useQuantizer = function(quantizer) {
    this.opts.Quantizer = quantizer;
    return this;
  };

  Builder.prototype.build = function() {
    if (this.v == null) {
      this.v = new Vibrant(this.src, this.opts);
    }
    return this.v;
  };

  Builder.prototype.getSwatches = function(cb) {
    return this.build().getPalette(cb);
  };

  Builder.prototype.getPalette = function(cb) {
    return this.build().getPalette(cb);
  };

  Builder.prototype.from = function(src) {
    return new Vibrant(src, this.opts);
  };

  return Builder;

})();

module.exports.Util = util;

module.exports.Swatch = Swatch;

module.exports.Quantizer = require('./quantizer/');

module.exports.Generator = require('./generator/');

module.exports.Filter = require('./filter/');

},{"./filter":4,"./filter/":4,"./generator":6,"./generator/":6,"./quantizer":12,"./quantizer/":12,"./swatch":14,"./util":15,"quantize":20}],17:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":18}],18:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],19:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],20:[function(require,module,exports){
/*
 * quantize.js Copyright 2008 Nick Rabinowitz
 * Ported to node.js by Olivier Lesnicki
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

// fill out a couple protovis dependencies
/*
 * Block below copied from Protovis: http://mbostock.github.com/protovis/
 * Copyright 2010 Stanford Visualization Group
 * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
 */
if (!pv) {
    var pv = {
        map: function(array, f) {
            var o = {};
            return f ? array.map(function(d, i) {
                o.index = i;
                return f.call(o, d);
            }) : array.slice();
        },
        naturalOrder: function(a, b) {
            return (a < b) ? -1 : ((a > b) ? 1 : 0);
        },
        sum: function(array, f) {
            var o = {};
            return array.reduce(f ? function(p, d, i) {
                o.index = i;
                return p + f.call(o, d);
            } : function(p, d) {
                return p + d;
            }, 0);
        },
        max: function(array, f) {
            return Math.max.apply(null, f ? pv.map(array, f) : array);
        }
    }
}

/**
 * Basic Javascript port of the MMCQ (modified median cut quantization)
 * algorithm from the Leptonica library (http://www.leptonica.com/).
 * Returns a color map you can use to map original pixels to the reduced
 * palette. Still a work in progress.
 * 
 * @author Nick Rabinowitz
 * @example
 
// array of pixels as [R,G,B] arrays
var myPixels = [[190,197,190], [202,204,200], [207,214,210], [211,214,211], [205,207,207]
                // etc
                ];
var maxColors = 4;
 
var cmap = MMCQ.quantize(myPixels, maxColors);
var newPalette = cmap.palette();
var newPixels = myPixels.map(function(p) { 
    return cmap.map(p); 
});
 
 */
var MMCQ = (function() {
    // private constants
    var sigbits = 5,
        rshift = 8 - sigbits,
        maxIterations = 1000,
        fractByPopulations = 0.75;

    // get reduced-space color index for a pixel

    function getColorIndex(r, g, b) {
        return (r << (2 * sigbits)) + (g << sigbits) + b;
    }

    // Simple priority queue

    function PQueue(comparator) {
        var contents = [],
            sorted = false;

        function sort() {
            contents.sort(comparator);
            sorted = true;
        }

        return {
            push: function(o) {
                contents.push(o);
                sorted = false;
            },
            peek: function(index) {
                if (!sorted) sort();
                if (index === undefined) index = contents.length - 1;
                return contents[index];
            },
            pop: function() {
                if (!sorted) sort();
                return contents.pop();
            },
            size: function() {
                return contents.length;
            },
            map: function(f) {
                return contents.map(f);
            },
            debug: function() {
                if (!sorted) sort();
                return contents;
            }
        };
    }

    // 3d color space box

    function VBox(r1, r2, g1, g2, b1, b2, histo) {
        var vbox = this;
        vbox.r1 = r1;
        vbox.r2 = r2;
        vbox.g1 = g1;
        vbox.g2 = g2;
        vbox.b1 = b1;
        vbox.b2 = b2;
        vbox.histo = histo;
    }
    VBox.prototype = {
        volume: function(force) {
            var vbox = this;
            if (!vbox._volume || force) {
                vbox._volume = ((vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1));
            }
            return vbox._volume;
        },
        count: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._count_set || force) {
                var npix = 0,
                    i, j, k, index;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            index = getColorIndex(i, j, k);
                            npix += (histo[index] || 0);
                        }
                    }
                }
                vbox._count = npix;
                vbox._count_set = true;
            }
            return vbox._count;
        },
        copy: function() {
            var vbox = this;
            return new VBox(vbox.r1, vbox.r2, vbox.g1, vbox.g2, vbox.b1, vbox.b2, vbox.histo);
        },
        avg: function(force) {
            var vbox = this,
                histo = vbox.histo;
            if (!vbox._avg || force) {
                var ntot = 0,
                    mult = 1 << (8 - sigbits),
                    rsum = 0,
                    gsum = 0,
                    bsum = 0,
                    hval,
                    i, j, k, histoindex;
                for (i = vbox.r1; i <= vbox.r2; i++) {
                    for (j = vbox.g1; j <= vbox.g2; j++) {
                        for (k = vbox.b1; k <= vbox.b2; k++) {
                            histoindex = getColorIndex(i, j, k);
                            hval = histo[histoindex] || 0;
                            ntot += hval;
                            rsum += (hval * (i + 0.5) * mult);
                            gsum += (hval * (j + 0.5) * mult);
                            bsum += (hval * (k + 0.5) * mult);
                        }
                    }
                }
                if (ntot) {
                    vbox._avg = [~~(rsum / ntot), ~~ (gsum / ntot), ~~ (bsum / ntot)];
                } else {
                    //console.log('empty box');
                    vbox._avg = [~~(mult * (vbox.r1 + vbox.r2 + 1) / 2), ~~ (mult * (vbox.g1 + vbox.g2 + 1) / 2), ~~ (mult * (vbox.b1 + vbox.b2 + 1) / 2)];
                }
            }
            return vbox._avg;
        },
        contains: function(pixel) {
            var vbox = this,
                rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            return (rval >= vbox.r1 && rval <= vbox.r2 &&
                gval >= vbox.g1 && gval <= vbox.g2 &&
                bval >= vbox.b1 && bval <= vbox.b2);
        }
    };

    // Color map

    function CMap() {
        this.vboxes = new PQueue(function(a, b) {
            return pv.naturalOrder(
                a.vbox.count() * a.vbox.volume(),
                b.vbox.count() * b.vbox.volume()
            )
        });;
    }
    CMap.prototype = {
        push: function(vbox) {
            this.vboxes.push({
                vbox: vbox,
                color: vbox.avg()
            });
        },
        palette: function() {
            return this.vboxes.map(function(vb) {
                return vb.color
            });
        },
        size: function() {
            return this.vboxes.size();
        },
        map: function(color) {
            var vboxes = this.vboxes;
            for (var i = 0; i < vboxes.size(); i++) {
                if (vboxes.peek(i).vbox.contains(color)) {
                    return vboxes.peek(i).color;
                }
            }
            return this.nearest(color);
        },
        nearest: function(color) {
            var vboxes = this.vboxes,
                d1, d2, pColor;
            for (var i = 0; i < vboxes.size(); i++) {
                d2 = Math.sqrt(
                    Math.pow(color[0] - vboxes.peek(i).color[0], 2) +
                    Math.pow(color[1] - vboxes.peek(i).color[1], 2) +
                    Math.pow(color[2] - vboxes.peek(i).color[2], 2)
                );
                if (d2 < d1 || d1 === undefined) {
                    d1 = d2;
                    pColor = vboxes.peek(i).color;
                }
            }
            return pColor;
        },
        forcebw: function() {
            // XXX: won't  work yet
            var vboxes = this.vboxes;
            vboxes.sort(function(a, b) {
                return pv.naturalOrder(pv.sum(a.color), pv.sum(b.color))
            });

            // force darkest color to black if everything < 5
            var lowest = vboxes[0].color;
            if (lowest[0] < 5 && lowest[1] < 5 && lowest[2] < 5)
                vboxes[0].color = [0, 0, 0];

            // force lightest color to white if everything > 251
            var idx = vboxes.length - 1,
                highest = vboxes[idx].color;
            if (highest[0] > 251 && highest[1] > 251 && highest[2] > 251)
                vboxes[idx].color = [255, 255, 255];
        }
    };

    // histo (1-d array, giving the number of pixels in
    // each quantized region of color space), or null on error

    function getHisto(pixels) {
        var histosize = 1 << (3 * sigbits),
            histo = new Array(histosize),
            index, rval, gval, bval;
        pixels.forEach(function(pixel) {
            rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            index = getColorIndex(rval, gval, bval);
            histo[index] = (histo[index] || 0) + 1;
        });
        return histo;
    }

    function vboxFromPixels(pixels, histo) {
        var rmin = 1000000,
            rmax = 0,
            gmin = 1000000,
            gmax = 0,
            bmin = 1000000,
            bmax = 0,
            rval, gval, bval;
        // find min/max
        pixels.forEach(function(pixel) {
            rval = pixel[0] >> rshift;
            gval = pixel[1] >> rshift;
            bval = pixel[2] >> rshift;
            if (rval < rmin) rmin = rval;
            else if (rval > rmax) rmax = rval;
            if (gval < gmin) gmin = gval;
            else if (gval > gmax) gmax = gval;
            if (bval < bmin) bmin = bval;
            else if (bval > bmax) bmax = bval;
        });
        return new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histo);
    }

    function medianCutApply(histo, vbox) {
        if (!vbox.count()) return;

        var rw = vbox.r2 - vbox.r1 + 1,
            gw = vbox.g2 - vbox.g1 + 1,
            bw = vbox.b2 - vbox.b1 + 1,
            maxw = pv.max([rw, gw, bw]);
        // only one pixel, no split
        if (vbox.count() == 1) {
            return [vbox.copy()]
        }
        /* Find the partial sum arrays along the selected axis. */
        var total = 0,
            partialsum = [],
            lookaheadsum = [],
            i, j, k, sum, index;
        if (maxw == rw) {
            for (i = vbox.r1; i <= vbox.r2; i++) {
                sum = 0;
                for (j = vbox.g1; j <= vbox.g2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(i, j, k);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        } else if (maxw == gw) {
            for (i = vbox.g1; i <= vbox.g2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.b1; k <= vbox.b2; k++) {
                        index = getColorIndex(j, i, k);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        } else { /* maxw == bw */
            for (i = vbox.b1; i <= vbox.b2; i++) {
                sum = 0;
                for (j = vbox.r1; j <= vbox.r2; j++) {
                    for (k = vbox.g1; k <= vbox.g2; k++) {
                        index = getColorIndex(j, k, i);
                        sum += (histo[index] || 0);
                    }
                }
                total += sum;
                partialsum[i] = total;
            }
        }
        partialsum.forEach(function(d, i) {
            lookaheadsum[i] = total - d
        });

        function doCut(color) {
            var dim1 = color + '1',
                dim2 = color + '2',
                left, right, vbox1, vbox2, d2, count2 = 0;
            for (i = vbox[dim1]; i <= vbox[dim2]; i++) {
                if (partialsum[i] > total / 2) {
                    vbox1 = vbox.copy();
                    vbox2 = vbox.copy();
                    left = i - vbox[dim1];
                    right = vbox[dim2] - i;
                    if (left <= right)
                        d2 = Math.min(vbox[dim2] - 1, ~~ (i + right / 2));
                    else d2 = Math.max(vbox[dim1], ~~ (i - 1 - left / 2));
                    // avoid 0-count boxes
                    while (!partialsum[d2]) d2++;
                    count2 = lookaheadsum[d2];
                    while (!count2 && partialsum[d2 - 1]) count2 = lookaheadsum[--d2];
                    // set dimensions
                    vbox1[dim2] = d2;
                    vbox2[dim1] = vbox1[dim2] + 1;
                    // console.log('vbox counts:', vbox.count(), vbox1.count(), vbox2.count());
                    return [vbox1, vbox2];
                }
            }

        }
        // determine the cut planes
        return maxw == rw ? doCut('r') :
            maxw == gw ? doCut('g') :
            doCut('b');
    }

    function quantize(pixels, maxcolors) {
        // short-circuit
        if (!pixels.length || maxcolors < 2 || maxcolors > 256) {
            // console.log('wrong number of maxcolors');
            return false;
        }

        // XXX: check color content and convert to grayscale if insufficient

        var histo = getHisto(pixels),
            histosize = 1 << (3 * sigbits);

        // check that we aren't below maxcolors already
        var nColors = 0;
        histo.forEach(function() {
            nColors++
        });
        if (nColors <= maxcolors) {
            // XXX: generate the new colors from the histo and return
        }

        // get the beginning vbox from the colors
        var vbox = vboxFromPixels(pixels, histo),
            pq = new PQueue(function(a, b) {
                return pv.naturalOrder(a.count(), b.count())
            });
        pq.push(vbox);

        // inner function to do the iteration

        function iter(lh, target) {
            var ncolors = 1,
                niters = 0,
                vbox;
            while (niters < maxIterations) {
                vbox = lh.pop();
                if (!vbox.count()) { /* just put it back */
                    lh.push(vbox);
                    niters++;
                    continue;
                }
                // do the cut
                var vboxes = medianCutApply(histo, vbox),
                    vbox1 = vboxes[0],
                    vbox2 = vboxes[1];

                if (!vbox1) {
                    // console.log("vbox1 not defined; shouldn't happen!");
                    return;
                }
                lh.push(vbox1);
                if (vbox2) { /* vbox2 can be null */
                    lh.push(vbox2);
                    ncolors++;
                }
                if (ncolors >= target) return;
                if (niters++ > maxIterations) {
                    // console.log("infinite loop; perhaps too few pixels!");
                    return;
                }
            }
        }

        // first set of colors, sorted by population
        iter(pq, fractByPopulations * maxcolors);
        // console.log(pq.size(), pq.debug().length, pq.debug().slice());

        // Re-sort by the product of pixel occupancy times the size in color space.
        var pq2 = new PQueue(function(a, b) {
            return pv.naturalOrder(a.count() * a.volume(), b.count() * b.volume())
        });
        while (pq.size()) {
            pq2.push(pq.pop());
        }

        // next set - generate the median cuts using the (npix * vol) sorting.
        iter(pq2, maxcolors - pq2.size());

        // calculate the actual colors
        var cmap = new CMap();
        while (pq2.size()) {
            cmap.push(pq2.pop());
        }

        return cmap;
    }

    return {
        quantize: quantize
    }
})();

module.exports = MMCQ.quantize

},{}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],23:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":21,"./encode":22}],24:[function(require,module,exports){
(function (process){
var ՐՏ_1, ՐՏ_2, ՐՏ_3, ՐՏ_4, ՐՏ_5, ՐՏ_6, ՐՏ_7, ՐՏ_8, ՐՏ_9, ՐՏ_10, ՐՏ_11, ՐՏ_12, ՐՏ_13, ՐՏ_14, ՐՏ_15, ՐՏ_16, ՐՏ_17, ՐՏ_18, ՐՏ_19, ՐՏ_20, ՐՏ_21, ՐՏ_22, ՐՏ_23, ՐՏ_24, ՐՏ_25, ՐՏ_26, ՐՏ_27, ՐՏ_28, ՐՏ_29, ՐՏ_31, ՐՏ_32, ՐՏ_33, ՐՏ_34, ՐՏ_35, ՐՏ_36, ՐՏ_37, ՐՏ_38, ՐՏ_39, ՐՏ_40, ՐՏ_41, ՐՏ_42, ՐՏ_43, ՐՏ_44, ՐՏ_45, ՐՏ_46, ՐՏ_47, ՐՏ_48, ՐՏ_49, ՐՏ_50, ՐՏ_51, ՐՏ_52, ՐՏ_53, ՐՏ_54, ՐՏ_55, ՐՏ_56, ՐՏ_57, ՐՏ_58, ՐՏ_59, ՐՏ_60, ՐՏ_62, ՐՏ_63, ՐՏ_64, ՐՏ_65, ՐՏ_66, ՐՏ_67, ՐՏ_68, ՐՏ_69, ՐՏ_70, ՐՏ_71, ՐՏ_72, ՐՏ_73, ՐՏ_74, ՐՏ_75, ՐՏ_76, ՐՏ_77, ՐՏ_78, ՐՏ_79, ՐՏ_80, ՐՏ_81, ՐՏ_82, ՐՏ_83, ՐՏ_84, ՐՏ_85, ՐՏ_86, ՐՏ_87, ՐՏ_88, ՐՏ_89, ՐՏ_90, ՐՏ_91, ՐՏ_92, ՐՏ_93, ՐՏ_94, ՐՏ_95, ՐՏ_96, ՐՏ_97, ՐՏ_98, ՐՏ_99, ՐՏ_100, ՐՏ_101, ՐՏ_102, ՐՏ_103, ՐՏ_104, ՐՏ_105, ՐՏ_106, ՐՏ_107, ՐՏ_108, ՐՏ_109, ՐՏ_110, ՐՏ_111, ՐՏ_112, ՐՏ_113, ՐՏ_114;
function abs(n) {
    return Math.abs(n);
}
function all(a) {
    var ՐՏitr86, ՐՏidx86;
    var e;
    ՐՏitr86 = ՐՏ_Iterable(a);
    for (ՐՏidx86 = 0; ՐՏidx86 < ՐՏitr86.length; ՐՏidx86++) {
        e = ՐՏitr86[ՐՏidx86];
        if (!e) {
            return false;
        }
    }
    return true;
}
function any(a) {
    var ՐՏitr87, ՐՏidx87;
    var e;
    ՐՏitr87 = ՐՏ_Iterable(a);
    for (ՐՏidx87 = 0; ՐՏidx87 < ՐՏitr87.length; ՐՏidx87++) {
        e = ՐՏitr87[ՐՏidx87];
        if (e) {
            return true;
        }
    }
    return false;
}
function bin(a) {
    return "0b" + (a >>> 0).toString(2);
}
function ՐՏ_bind(fn, thisArg) {
    var ret;
    if (fn.orig) {
        fn = fn.orig;
    }
    if (thisArg === false) {
        return fn;
    }
    ret = function() {
        return fn.apply(thisArg, arguments);
    };
    ret.orig = fn;
    return ret;
}
function ՐՏ_rebindAll(thisArg, rebind) {
    if (rebind === void 0) {
        rebind = true;
    }
    for (var p in thisArg) {
        if (thisArg[p] && thisArg[p].orig) {
            if (rebind) {
                thisArg[p] = ՐՏ_bind(thisArg[p], thisArg);
            } else {
                thisArg[p] = thisArg[p].orig;
            }
        }
    }
}
function cmp(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
chr = String.fromCharCode;
function dir(item) {
    var arr;
    arr = [];
    for (var i in item) {
        arr.push(i);
    }
    return arr;
}
function enumerate(item) {
    var arr, iter, i;
    arr = [];
    iter = ՐՏ_Iterable(item);
    for (i = 0; i < iter.length; i++) {
        arr[arr.length] = [ i, item[i] ];
    }
    return arr;
}
function ՐՏ_eslice(arr, step, start, end) {
    var isString;
    arr = arr.slice(0);
    if (typeof arr === "string" || arr instanceof String) {
        isString = true;
        arr = arr.split("");
    }
    if (step < 0) {
        step = -step;
        arr.reverse();
        if (typeof start !== "undefined") {
            start = arr.length - start - 1;
        }
        if (typeof end !== "undefined") {
            end = arr.length - end - 1;
        }
    }
    if (typeof start === "undefined") {
        start = 0;
    }
    if (typeof end === "undefined") {
        end = arr.length;
    }
    arr = arr.slice(start, end).filter(function(e, i) {
        return i % step === 0;
    });
    return isString ? arr.join("") : arr;
}
function ՐՏ_extends(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.__base__ = parent;
    child.prototype.constructor = child;
}
function filter(oper, arr) {
    return arr.filter(oper);
}
function hex(a) {
    return "0x" + (a >>> 0).toString(16);
}
function ՐՏ_in(val, arr) {
    if (typeof arr.indexOf === "function") {
        return arr.indexOf(val) !== -1;
    }
    return arr.hasOwnProperty(val);
}
function ՐՏ_Iterable(iterable) {
    var tmp;
    if (iterable.constructor === [].constructor || iterable.constructor === "".constructor || (tmp = Array.prototype.slice.call(iterable)).length) {
        return tmp || iterable;
    }
    return Object.keys(iterable);
}
function len(obj) {
    var tmp;
    if (obj.constructor === [].constructor || obj.constructor === "".constructor || (tmp = Array.prototype.slice.call(obj)).length) {
        return (tmp || obj).length;
    }
    return Object.keys(obj).length;
}
function map(oper, arr) {
    return arr.map(oper);
}
function max(a) {
    return Math.max.apply(null, Array.isArray(a) ? a : arguments);
}
function min(a) {
    return Math.min.apply(null, Array.isArray(a) ? a : arguments);
}
function ՐՏ_merge(target, source, overwrite) {
    var ՐՏitr88, ՐՏidx88;
    var prop;
    for (var i in source) {
        if (source.hasOwnProperty(i) && (overwrite || typeof target[i] === "undefined")) {
            target[i] = source[i];
        }
    }
    ՐՏitr88 = ՐՏ_Iterable(Object.getOwnPropertyNames(source.prototype));
    for (ՐՏidx88 = 0; ՐՏidx88 < ՐՏitr88.length; ՐՏidx88++) {
        prop = ՐՏitr88[ՐՏidx88];
        if (overwrite || typeof target.prototype[prop] === "undefined") {
            target.prototype[prop] = source.prototype[prop];
        }
    }
}
function ՐՏ_mixin() {
    var classes = [].slice.call(arguments, 0);
    return function(baseClass) {
        var ՐՏitr89, ՐՏidx89, ՐՏitr90, ՐՏidx90;
        var cls, key;
        ՐՏitr89 = ՐՏ_Iterable(classes);
        for (ՐՏidx89 = 0; ՐՏidx89 < ՐՏitr89.length; ՐՏidx89++) {
            cls = ՐՏitr89[ՐՏidx89];
            ՐՏitr90 = ՐՏ_Iterable(Object.getOwnPropertyNames(cls.prototype));
            for (ՐՏidx90 = 0; ՐՏidx90 < ՐՏitr90.length; ՐՏidx90++) {
                key = ՐՏitr90[ՐՏidx90];
                if (!(ՐՏ_in(key, baseClass.prototype))) {
                    baseClass.prototype[key] = cls.prototype[key];
                }
            }
        }
        return baseClass;
    };
}
function ՐՏ_print() {
    if (typeof console === "object") {
        console.log.apply(console, arguments);
    }
}
function range(start, stop, step) {
    var length, idx, range;
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = arguments[2] || 1;
    length = Math.max(Math.ceil((stop - start) / step), 0);
    idx = 0;
    range = new Array(length);
    while (idx < length) {
        range[idx++] = start;
        start += step;
    }
    return range;
}
function reduce(f, a) {
    return Array.prototype.reduce.call(a, f);
}
function reversed(arr) {
    var tmp;
    tmp = arr.slice(0);
    return tmp.reverse();
}
function sorted(arr) {
    var tmp;
    tmp = arr.slice(0);
    return tmp.sort();
}
function sum(arr, start) {
    start = start === void 0 ? 0 : start;
    return arr.reduce(function(prev, cur) {
        return prev + cur;
    }, start);
}
function ՐՏ_type(obj) {
    return obj && obj.constructor && obj.constructor.name ? obj.constructor.name : Object.prototype.toString.call(obj).slice(8, -1);
}
function zip(a, b) {
    var i;
    return (function() {
        var ՐՏidx91, ՐՏitr91 = ՐՏ_Iterable(range(Math.min(a.length, b.length))), ՐՏres = [], i;
        for (ՐՏidx91 = 0; ՐՏidx91 < ՐՏitr91.length; ՐՏidx91++) {
            i = ՐՏitr91[ՐՏidx91];
            ՐՏres.push([ a[i], b[i] ]);
        }
        return ՐՏres;
    })();
}
function getattr(obj, name) {
    return obj[name];
}
function setattr(obj, name, value) {
    obj[name] = value;
}
function hasattr(obj, name) {
    return name in obj;
}
function ՐՏ_eq(a, b) {
    var ՐՏitr92, ՐՏidx92;
    var i;
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b) || a instanceof Object && b instanceof Object) {
        if (a.constructor !== b.constructor || a.length !== b.length) {
            return false;
        }
        if (Array.isArray(a)) {
            for (i = 0; i < a.length; i++) {
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        } else {
            if (Object.keys(a).length !== Object.keys(b).length) {
                return false;
            }
            ՐՏitr92 = ՐՏ_Iterable(a);
            for (ՐՏidx92 = 0; ՐՏidx92 < ՐՏitr92.length; ՐՏidx92++) {
                i = ՐՏitr92[ՐՏidx92];
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}
function kwargs(f) {
    var argNames;
    argNames = f.toString().match(/\(([^\)]+)/)[1];
    if (!kwargs.memo[argNames]) {
        kwargs.memo[argNames] = argNames ? argNames.split(",").map(function(s) {
            return s.trim();
        }) : [];
    }
    argNames = kwargs.memo[argNames];
    return function() {
        var args, kw, i;
        args = [].slice.call(arguments);
        if (args.length) {
            kw = args[args.length-1];
            if (typeof kw === "object") {
                for (i = 0; i < argNames.length; i++) {
                    if (ՐՏ_in(argNames[i], kw)) {
                        args[i] = kw[argNames[i]];
                    }
                }
            } else {
                args.push(kw);
            }
        }
        try {
            return f.apply(this, args);
        } catch (ՐՏ_Exception) {
            var e = ՐՏ_Exception;
            if (/Class constructor \w+ cannot be invoked without 'new'/.test(e)) {
                return new f(args);
            }
            throw ՐՏ_Exception;
        }
    };
}
kwargs.memo = {};
var AssertionError = (ՐՏ_124 = function AssertionError() {
    AssertionError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_124, Error), Object.defineProperties(ՐՏ_124.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            self.name = "AssertionError";
            self.message = message;
        }
    }
}), ՐՏ_124);
var IndexError = (ՐՏ_125 = function IndexError() {
    IndexError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_125, Error), Object.defineProperties(ՐՏ_125.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            self.name = "IndexError";
            self.message = message;
        }
    }
}), ՐՏ_125);
var KeyError = (ՐՏ_126 = function KeyError() {
    KeyError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_126, Error), Object.defineProperties(ՐՏ_126.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            self.name = "KeyError";
            self.message = message;
        }
    }
}), ՐՏ_126);
var TypeError = (ՐՏ_127 = function TypeError() {
    TypeError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_127, Error), Object.defineProperties(ՐՏ_127.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            self.name = "TypeError";
            self.message = message;
        }
    }
}), ՐՏ_127);
var ValueError = (ՐՏ_128 = function ValueError() {
    ValueError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_128, Error), Object.defineProperties(ՐՏ_128.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            self.name = "ValueError";
            self.message = message;
        }
    }
}), ՐՏ_128);
var ՐՏ_modules = {};
ՐՏ_modules["utils"] = {};
ՐՏ_modules["ast"] = {};
ՐՏ_modules["tokenizer"] = {};
ՐՏ_modules["parser"] = {};
ՐՏ_modules["_baselib"] = {};
ՐՏ_modules["output"] = {};

(function(){
    var __name__ = "utils";
    var RAPYD_PREFIX, MAP, colors;
    RAPYD_PREFIX = "ՐՏ";
    function slice(a, start) {
        return Array.prototype.slice.call(a, start || 0);
    }
    function member(name, array) {
        var ՐՏitr1, ՐՏidx1;
        var i;
        ՐՏitr1 = ՐՏ_Iterable(range(array.length - 1, -1, -1));
        for (ՐՏidx1 = 0; ՐՏidx1 < ՐՏitr1.length; ՐՏidx1++) {
            i = ՐՏitr1[ՐՏidx1];
            if (array[i] === name) {
                return true;
            }
        }
        return false;
    }
    function find_if(func, array) {
        var i;
        for (i = 0; i < len(array); i++) {
            if (func(array[i])) {
                return array[i];
            }
        }
    }
    function repeat_string(str_, i) {
        var d;
        if (i <= 0) {
            return "";
        }
        if (i === 1) {
            return str_;
        }
        d = repeat_string(str_, i >> 1);
        d += d;
        if (i & 1) {
            d += str_;
        }
        return d;
    }
    function DefaultsError(msg, defs) {
        this.msg = msg;
        this.defs = defs;
    }
    var ImportError = (ՐՏ_1 = function ImportError() {
        ImportError.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_1, Error), Object.defineProperties(ՐՏ_1.prototype, {
        __init__: {
            enumerable: true, 
            writable: true, 
            value: function __init__(message){
                var self = this;
                self.message = message;
            }
        }
    }), ՐՏ_1);
    var ParseError = (ՐՏ_2 = function ParseError() {
        ParseError.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_2, Error), Object.defineProperties(ՐՏ_2.prototype, {
        __init__: {
            enumerable: true, 
            writable: true, 
            value: function __init__(message, line, col, pos, is_eof){
                var self = this;
                self.message = message;
                self.line = line;
                self.col = col;
                self.pos = pos;
                self.stack = new Error().stack;
                self.is_eof = is_eof;
            }
        },
        toString: {
            enumerable: true, 
            writable: true, 
            value: function toString(){
                var self = this;
                return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack;
            }
        }
    }), ՐՏ_2);
    function defaults(args, defs, croak) {
        var ՐՏitr2, ՐՏidx2, ՐՏitr3, ՐՏidx3;
        var ret, key;
        if (args === true) {
            args = {};
        }
        ret = args || {};
        if (croak) {
            ՐՏitr2 = ՐՏ_Iterable(ret);
            for (ՐՏidx2 = 0; ՐՏidx2 < ՐՏitr2.length; ՐՏidx2++) {
                key = ՐՏitr2[ՐՏidx2];
                if (!(ՐՏ_in(key, defs))) {
                    throw new DefaultsError("`" + key + "` is not a supported option", defs);
                }
            }
        }
        ՐՏitr3 = ՐՏ_Iterable(defs);
        for (ՐՏidx3 = 0; ՐՏidx3 < ՐՏitr3.length; ՐՏidx3++) {
            key = ՐՏitr3[ՐՏidx3];
            ret[key] = args && ՐՏ_in(key, args) ? args[key] : defs[key];
        }
        return ret;
    }
    function merge(obj, ext) {
        var ՐՏitr4, ՐՏidx4;
        var key;
        ՐՏitr4 = ՐՏ_Iterable(ext);
        for (ՐՏidx4 = 0; ՐՏidx4 < ՐՏitr4.length; ՐՏidx4++) {
            key = ՐՏitr4[ՐՏidx4];
            obj[key] = ext[key];
        }
        return obj;
    }
    function noop() {
    }
    MAP = function() {
        var skip;
        function MAP(a, f, backwards) {
            var ՐՏitr5, ՐՏidx5;
            var ret, top, i;
            ret = [];
            top = [];
            function doit() {
                var val, is_last;
                val = f(a[i], i);
                is_last = val instanceof Last;
                if (is_last) {
                    val = val.v;
                }
                if (val instanceof AtTop) {
                    val = val.v;
                    if (val instanceof Splice) {
                        top.push.apply(top, backwards ? val.v.slice().reverse() : val.v);
                    } else {
                        top.push(val);
                    }
                } else if (val !== skip) {
                    if (val instanceof Splice) {
                        ret.push.apply(ret, backwards ? val.v.slice().reverse() : val.v);
                    } else {
                        ret.push(val);
                    }
                }
                return is_last;
            }
            if (Array.isArray(a)) {
                if (backwards) {
                    ՐՏitr5 = ՐՏ_Iterable(range(a.length - 1, -1, -1));
                    for (ՐՏidx5 = 0; ՐՏidx5 < ՐՏitr5.length; ՐՏidx5++) {
                        i = ՐՏitr5[ՐՏidx5];
                        if (doit()) {
                            break;
                        }
                    }
                    ret.reverse();
                    top.reverse();
                } else {
                    for (i = 0; i < len(a); i++) {
                        if (doit()) {
                            break;
                        }
                    }
                }
            } else {
                for (i in a) {
                    if (a.hasOwnProperty(i)) {
                        if (doit()) {
                            break;
                        }
                    }
                }
            }
            return top.concat(ret);
        }
        MAP.at_top = function(val) {
            return new AtTop(val);
        };
        MAP.splice = function(val) {
            return new Splice(val);
        };
        MAP.last = function(val) {
            return new Last(val);
        };
        skip = MAP.skip = {};
        function AtTop(val) {
            this.v = val;
        }
        function Splice(val) {
            this.v = val;
        }
        function Last(val) {
            this.v = val;
        }
        return MAP;
    }();
    function push_uniq(array, el) {
        if (!(ՐՏ_in(el, array))) {
            array.push(el);
        }
    }
    function string_template(text, props) {
        return text.replace(/\{(.+?)\}/g, function(str_, p) {
            return props[p];
        });
    }
    function remove(array, el) {
        var ՐՏitr6, ՐՏidx6;
        var idx;
        ՐՏitr6 = ՐՏ_Iterable(range(array.length - 1, -1, -1));
        for (ՐՏidx6 = 0; ՐՏidx6 < ՐՏitr6.length; ՐՏidx6++) {
            idx = ՐՏitr6[ՐՏidx6];
            if (array[idx] === el) {
                array.splice(i, 1);
            }
        }
    }
    function mergeSort(array, cmp) {
        if (array.length < 2) {
            return array.slice();
        }
        function merge(a, b) {
            var r, ai, bi, i;
            r = [];
            ai = 0;
            bi = 0;
            i = 0;
            while (ai < a.length && bi < b.length) {
                if (cmp(a[ai], b[bi]) <= 0) {
                    r[i] = a[ai];
                    ++ai;
                } else {
                    r[i] = b[bi];
                    ++bi;
                }
                ++i;
            }
            if (ai < a.length) {
                r.push.apply(r, a.slice(ai));
            }
            if (bi < b.length) {
                r.push.apply(r, b.slice(bi));
            }
            return r;
        }
        function _ms(a) {
            var m, left, right;
            if (a.length <= 1) {
                return a;
            }
            m = Math.floor(a.length / 2);
            left = a.slice(0, m);
            right = a.slice(m);
            left = _ms(left);
            right = _ms(right);
            return ՐՏ_merge(left, right);
        }
        return _ms(array);
    }
    function set_difference(a, b) {
        return a.filter(function(el) {
            return !(ՐՏ_in(el, b));
        });
    }
    function set_intersection(a, b) {
        return a.filter(function(el) {
            return ՐՏ_in(el, b);
        });
    }
    function makePredicate(words) {
        var f, cats, i, skip, j, cat;
        if (!Array.isArray(words)) {
            words = words.split(" ");
        }
        f = "";
        cats = [];
        for (i = 0; i < len(words); i++) {
            skip = false;
            for (j = 0; j < len(cats); j++) {
                if (cats[j][0].length === words[i].length) {
                    cats[j].push(words[i]);
                    skip = true;
                    break;
                }
            }
            if (!skip) {
                cats.push([ words[i] ]);
            }
        }
        function compareTo(arr) {
            var i;
            if (arr.length === 1) {
                return f += "return str === " + JSON.stringify(arr[0]) + ";";
            }
            f += "switch(str){";
            for (i = 0; i < len(arr); i++) {
                f += "case " + JSON.stringify(arr[i]) + ":";
            }
            f += "return true}return false;";
        }
        if (cats.length > 3) {
            cats.sort(function(a, b) {
                return b.length - a.length;
            });
            f += "switch(str.length){";
            for (i = 0; i < len(cats); i++) {
                cat = cats[i];
                f += "case " + cat[0].length + ":";
                compareTo(cat);
            }
            f += "}";
        } else {
            compareTo(words);
        }
        return new Function("str", f);
    }
    function Dictionary() {
        this._values = Object.create(null);
        this._size = 0;
    }
    Dictionary.prototype = {
        set: function(key, val) {
            if (!this.has(key)) {
                ++this._size;
            }
            this._values["$" + key] = val;
            return this;
        },
        add: function(key, val) {
            if (this.has(key)) {
                this.get(key).push(val);
            } else {
                this.set(key, [ val ]);
            }
            return this;
        },
        get: function(key) {
            return this._values["$" + key];
        },
        del_: function(key) {
            if (this.has(key)) {
                --this._size;
                delete this._values["$" + key];
            }
            return this;
        },
        has: function(key) {
            return ՐՏ_in("$" + key, this._values);
        },
        each: function(f) {
            var i;
            for (i in this._values) {
                f(this._values[i], i.substr(1));
            }
        },
        size: function() {
            return this._size;
        },
        map: function(f) {
            var ret, i;
            ret = [];
            for (i in this._values) {
                ret.push(f(this._values[i], i.substr(1)));
            }
            return ret;
        }
    };
    colors = [ "red", "green", "yellow", "blue", "magenta", "cyan", "white" ];
    function ansi(code) {
        code = code || 0;
        return "[" + code + "m";
    }
    function colored(string, color, bold) {
        var prefix;
        prefix = [];
        if (bold) {
            prefix.push(ansi(1));
        }
        if (color) {
            prefix.push(ansi(colors.indexOf(color) + 31));
        }
        return prefix.join("") + string + ansi(0);
    }
    ՐՏ_modules["utils"]["RAPYD_PREFIX"] = RAPYD_PREFIX;

    ՐՏ_modules["utils"]["MAP"] = MAP;

    ՐՏ_modules["utils"]["colors"] = colors;

    ՐՏ_modules["utils"]["slice"] = slice;

    ՐՏ_modules["utils"]["member"] = member;

    ՐՏ_modules["utils"]["find_if"] = find_if;

    ՐՏ_modules["utils"]["repeat_string"] = repeat_string;

    ՐՏ_modules["utils"]["DefaultsError"] = DefaultsError;

    ՐՏ_modules["utils"]["ImportError"] = ImportError;

    ՐՏ_modules["utils"]["ParseError"] = ParseError;

    ՐՏ_modules["utils"]["defaults"] = defaults;

    ՐՏ_modules["utils"]["merge"] = merge;

    ՐՏ_modules["utils"]["noop"] = noop;

    ՐՏ_modules["utils"]["push_uniq"] = push_uniq;

    ՐՏ_modules["utils"]["string_template"] = string_template;

    ՐՏ_modules["utils"]["remove"] = remove;

    ՐՏ_modules["utils"]["mergeSort"] = mergeSort;

    ՐՏ_modules["utils"]["set_difference"] = set_difference;

    ՐՏ_modules["utils"]["set_intersection"] = set_intersection;

    ՐՏ_modules["utils"]["makePredicate"] = makePredicate;

    ՐՏ_modules["utils"]["Dictionary"] = Dictionary;

    ՐՏ_modules["utils"]["ansi"] = ansi;

    ՐՏ_modules["utils"]["colored"] = colored;
})();

(function(){
    var __name__ = "ast";
    var noop = ՐՏ_modules["utils"].noop;
    var string_template = ՐՏ_modules["utils"].string_template;
    var colored = ՐՏ_modules["utils"].colored;
    
    function memoized(f) {
        return function(x) {
            if (!this.computedType) {
                this.computedType = f.call(this, x);
            }
            return this.computedType;
        };
    }
    var AST = (ՐՏ_3 = function AST() {
        AST.prototype.__init__.apply(this, arguments);
    }, Object.defineProperties(ՐՏ_3.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {}        },
        __init__: {
            enumerable: true, 
            writable: true, 
            value: function __init__(initializer){
                var self = this;
                var obj, i;
                if (initializer) {
                    obj = self;
                    while (obj) {
                        for (i in obj.properties) {
                            self[i] = initializer[i];
                        }
                        obj = Object.getPrototypeOf(obj);
                    }
                }
            }
        },
        clone: {
            enumerable: true, 
            writable: true, 
            value: function clone(){
                var self = this;
                return new self.constructor(self);
            }
        }
    }), ՐՏ_3);
    var Token = (ՐՏ_4 = function Token() {
        AST.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_4, AST), Object.defineProperties(ՐՏ_4.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                "type": "The type of the token",
                "value": "The value of the token",
                "line": "The line number at which the token occurs",
                "col": "The column number at which the token occurs",
                "pos": "Absolute position of the token start, relative to document start",
                "endpos": "Absolute position of the token start, relative to document start",
                "newline_before": "True if there was a newline before this token",
                "comments_before": "True if there were comments before this token",
                "file": "Name of the file currently being parsed"
            }        }
    }), ՐՏ_4);
    var Node = (ՐՏ_5 = function Node() {
        AST.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_5, AST), Object.defineProperties(ՐՏ_5.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                "start": "[Token] The first token of this node",
                "end": "[Token] The last token of this node"
            }        },
        computedType: {
            enumerable: true, 
            writable: true, 
            value: null        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var heap = this;
                return "?";
            })
        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self);
            }
        },
        walk: {
            enumerable: true, 
            writable: true, 
            value: function walk(visitor){
                var self = this;
                return self._walk(visitor);
            }
        },
        _dump: {
            enumerable: true, 
            writable: true, 
            value: function _dump(depth, omit, offset, include_name, compact){
                var ՐՏitr7, ՐՏidx7, ՐՏitr8, ՐՏidx8, ՐՏitr9, ՐՏidx9, ՐՏitr10, ՐՏidx10;
                var self = this;
                var key, colored_key, value, element, property;
                function out(string) {
                    var pad;
                    pad = new Array(offset + 1).join("  ");
                    console.log(pad + string);
                }
                if (include_name) {
                    out(colored(ՐՏ_type(self), "yellow"));
                }
                ՐՏitr7 = ՐՏ_Iterable(this);
                for (ՐՏidx7 = 0; ՐՏidx7 < ՐՏitr7.length; ՐՏidx7++) {
                    key = ՐՏitr7[ՐՏidx7];
                    if (ՐՏ_in(key, omit)) {
                        continue;
                    }
                    colored_key = colored(key + ": ", "blue");
                    value = self[key];
                    if (Array.isArray(value)) {
                        if (value.length) {
                            out(" " + colored_key + "[");
                            if (depth > 1) {
                                ՐՏitr8 = ՐՏ_Iterable(value);
                                for (ՐՏidx8 = 0; ՐՏidx8 < ՐՏitr8.length; ՐՏidx8++) {
                                    element = ՐՏitr8[ՐՏidx8];
                                    element._dump(depth - 1, omit, offset + 1, true, compact);
                                }
                            } else {
                                ՐՏitr9 = ՐՏ_Iterable(value);
                                for (ՐՏidx9 = 0; ՐՏidx9 < ՐՏitr9.length; ՐՏidx9++) {
                                    element = ՐՏitr9[ՐՏidx9];
                                    out("   " + colored(ՐՏ_type(element), "yellow"));
                                }
                            }
                            out(" ]");
                        } else {
                            if (!compact) {
                                out(" " + colored_key + "[]");
                            }
                        }
                    } else if (!(ՐՏ_in(value, [ void 0, null ]))) {
                        if (ՐՏ_type(value)) {
                            if (ՐՏ_type(value) === "Token") {
                                if (compact) {
                                    out(" " + colored_key + colored(ՐՏ_type(value) + "(" + value.file + ":" + value.line + ":" + value.col + ": " + value.value + ")", "magenta"));
                                } else {
                                    out(" " + colored_key + colored(ՐՏ_type(value), "magenta"));
                                    ՐՏitr10 = ՐՏ_Iterable(value);
                                    for (ՐՏidx10 = 0; ՐՏidx10 < ՐՏitr10.length; ՐՏidx10++) {
                                        property = ՐՏitr10[ՐՏidx10];
                                        out("   " + colored(property + ": ", "blue") + value[property]);
                                    }
                                }
                            } else {
                                out(" " + colored_key + colored(ՐՏ_type(value), "yellow"));
                                if (depth > 1) {
                                    value._dump(depth - 1, omit, offset + 1, false, compact);
                                }
                            }
                        } else if (typeof value === "string") {
                            out(" " + colored_key + colored('"' + value + '"', "green"));
                        } else if (typeof value === "number") {
                            out(" " + colored_key + colored(value, "green"));
                        } else if (typeof value === "boolean") {
                            out(" " + colored_key + colored(value, "green"));
                        } else {
                            out(" " + colored_key + colored(value, "red"));
                        }
                    } else {
                        if (!compact) {
                            out(" " + colored_key + value);
                        }
                    }
                }
            }
        },
        dump: {
            enumerable: true, 
            writable: true, 
            value: function dump(depth, omit, compact){
                var self = this;
                depth = depth === void 0 ? 2 : depth;
                omit = omit === void 0 ? [ "start", "end" ] : omit;
                compact = compact === void 0 ? true : compact;
                return self._dump(depth, omit, 0, true, compact);
            }
        }
    }), Object.defineProperties(ՐՏ_5, {
        warn_function: {
            enumerable: true, 
            writable: true, 
            value: function warn_function(self){
            }
        },
        warn: {
            enumerable: true, 
            writable: true, 
            value: function warn(txt, props){
                if (Node.warn_function) {
                    Node.warn_function(string_template(txt, props));
                }
            }
        }
    }), ՐՏ_5);
    var Statement = (ՐՏ_6 = function Statement() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_6, Node), ՐՏ_6);
    var Debugger = (ՐՏ_7 = function Debugger() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_7, Statement), ՐՏ_7);
    var Directive = (ՐՏ_8 = function Directive() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_8, Statement), Object.defineProperties(ՐՏ_8.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[string] The value of this directive as a plain string (it's not an String!)",
                scope: "[Scope/S] The scope that this directive affects"
            }        }
    }), ՐՏ_8);
    var SimpleStatement = (ՐՏ_9 = function SimpleStatement() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_9, Statement), Object.defineProperties(ՐՏ_9.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                body: "[Node] an expression node (should not be instanceof Statement)"
            }        },
        walk_: {
            enumerable: true, 
            writable: true, 
            value: function walk_(){
                var visitor = this;
                var node;
                node = this;
                return visitor._visit(node, function() {
                    node.body._walk(visitor);
                });
            }
        }
    }), ՐՏ_9);
    function walk_body(node, visitor) {
        var ՐՏitr11, ՐՏidx11;
        var stat;
        if (node.body instanceof Statement) {
            node.body._walk(visitor);
        } else if (node.body) {
            ՐՏitr11 = ՐՏ_Iterable(node.body);
            for (ՐՏidx11 = 0; ՐՏidx11 < ՐՏitr11.length; ՐՏidx11++) {
                stat = ՐՏitr11[ՐՏidx11];
                stat._walk(visitor);
            }
        }
    }
    var Block = (ՐՏ_10 = function Block() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_10, Statement), Object.defineProperties(ՐՏ_10.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                body: "[Statement*] an array of statements"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    walk_body(self, visitor);
                });
            }
        }
    }), ՐՏ_10);
    var BlockStatement = (ՐՏ_11 = function BlockStatement() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_11, Block), ՐՏ_11);
    var EmptyStatement = (ՐՏ_12 = function EmptyStatement() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_12, Statement), Object.defineProperties(ՐՏ_12.prototype, {
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self);
            }
        }
    }), ՐՏ_12);
    var StatementWithBody = (ՐՏ_13 = function StatementWithBody() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_13, Statement), Object.defineProperties(ՐՏ_13.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                body: "[Statement] the body; this should always be present, even if it's an EmptyStatement"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.body._walk(visitor);
                });
            }
        }
    }), ՐՏ_13);
    var LabeledStatement = (ՐՏ_14 = function LabeledStatement() {
        StatementWithBody.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_14, StatementWithBody), Object.defineProperties(ՐՏ_14.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                label: "[Label] a label definition"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.label._walk(visitor);
                    self.body._walk(visitor);
                });
            }
        }
    }), ՐՏ_14);
    var DWLoop = (ՐՏ_15 = function DWLoop() {
        StatementWithBody.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_15, StatementWithBody), Object.defineProperties(ՐՏ_15.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                condition: "[Node] the loop condition.  Should not be instanceof Statement"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.condition._walk(visitor);
                    self.body._walk(visitor);
                });
            }
        }
    }), ՐՏ_15);
    var Do = (ՐՏ_16 = function Do() {
        DWLoop.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_16, DWLoop), ՐՏ_16);
    var While = (ՐՏ_17 = function While() {
        DWLoop.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_17, DWLoop), ՐՏ_17);
    var ForIn = (ՐՏ_18 = function ForIn() {
        StatementWithBody.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_18, StatementWithBody), Object.defineProperties(ՐՏ_18.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                init: "[Node] the `for/in` initialization code",
                name: "[SymbolRef?] the loop variable, only if `init` is Var",
                object: "[Node] the object that we're looping through"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.init._walk(visitor);
                    self.object._walk(visitor);
                    self.body._walk(visitor);
                });
            }
        }
    }), ՐՏ_18);
    var ForJS = (ՐՏ_19 = function ForJS() {
        StatementWithBody.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_19, StatementWithBody), Object.defineProperties(ՐՏ_19.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                condition: "[Verbatim] raw JavaScript conditional"
            }        }
    }), ՐՏ_19);
    var ListComprehension = (ՐՏ_20 = function ListComprehension() {
        ForIn.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_20, ForIn), Object.defineProperties(ՐՏ_20.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                condition: "[Node] the `if` condition",
                statement: "[Node] statement to perform on each element before returning it"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.init._walk(visitor);
                    self.statement._walk(visitor);
                    if (self.condition) {
                        self.condition._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_20);
    var DictComprehension = (ՐՏ_21 = function DictComprehension() {
        ListComprehension.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_21, ListComprehension), Object.defineProperties(ՐՏ_21.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value_statement: "[Node] statement to perform on each value before returning it"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.init._walk(visitor);
                    self.statement._walk(visitor);
                    self.value_statement._walk(visitor);
                    if (self.condition) {
                        self.condition._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_21);
    var With = (ՐՏ_22 = function With() {
        StatementWithBody.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_22, StatementWithBody), Object.defineProperties(ՐՏ_22.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                expression: "[Node] the `with` expression"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.expression._walk(visitor);
                    self.body._walk(visitor);
                });
            }
        }
    }), ՐՏ_22);
    var Scope = (ՐՏ_23 = function Scope() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_23, Block), Object.defineProperties(ՐՏ_23.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                docstring: "[string?] docstring for this scope, if any",
                directives: "[string*/S] an array of directives declared in this scope",
                variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
                localvars: "[SymbolDef*] list of variables local to this scope",
                functions: "[Object/S] like `variables`, but only lists function declarations",
                parent_scope: "[Scope?/S] link to the parent scope",
                enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes"
            }        }
    }), ՐՏ_23);
    var TopLevel = (ՐՏ_24 = function TopLevel() {
        Scope.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_24, Scope), Object.defineProperties(ՐՏ_24.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                globals: "[Object/S] a map of name -> SymbolDef for all undeclared names",
                baselib: "[Object/s] a collection of used parts of baselib",
                imports: "[Object/S] a map of module_id->TopLevel for all imported modules",
                nonlocalvars: "[String*] a list of all non-local variable names (names that come from the global scope)",
                strict: "[boolean/S] true if strict directive is in scope",
                shebang: "[string] If #! line is present, it will be stored here",
                import_order: "[number] The global order in which this scope was imported",
                module_id: "[string] The id of this module",
                exports: "[SymbolDef*] list of names exported from this module",
                submodules: "[string*] list of names exported from this module",
                classes: "[Object/S] a map of class names to Class for classes defined in this module",
                filename: "[string] The absolute path to the file from which this module was read",
                srchash: "[string] SHA1 hash of source code, used for caching"
            }        }
    }), ՐՏ_24);
    var Splat = (ՐՏ_25 = function Splat() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_25, Statement), Object.defineProperties(ՐՏ_25.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                module: "[SymbolVar] name of the module we're splatting",
                key: "[string] The key by which this module is stored in the global modules mapping",
                body: "[TopLevel] parsed contents of the imported file"
            }        }
    }), ՐՏ_25);
    var Import = (ՐՏ_26 = function Import() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_26, Statement), Object.defineProperties(ՐՏ_26.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                module: "[SymbolVar] name of the module we're importing",
                key: "[string] The key by which this module is stored in the global modules mapping",
                alias: "[SymbolAlias] The name this module is imported as, can be None. For import x as y statements.",
                argnames: "[ImportedVar*] names of objects to be imported",
                body: "[TopLevel] parsed contents of the imported file"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr12, ՐՏidx12;
                    var arg;
                    ՐՏitr12 = ՐՏ_Iterable(self.argnames);
                    for (ՐՏidx12 = 0; ՐՏidx12 < ՐՏitr12.length; ՐՏidx12++) {
                        arg = ՐՏitr12[ՐՏidx12];
                        arg._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_26);
    var Imports = (ՐՏ_27 = function Imports() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_27, Statement), Object.defineProperties(ՐՏ_27.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                "imports": "[Import+] array of imports"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr13, ՐՏidx13;
                    var imp;
                    ՐՏitr13 = ՐՏ_Iterable(self.imports);
                    for (ՐՏidx13 = 0; ՐՏidx13 < ՐՏitr13.length; ՐՏidx13++) {
                        imp = ՐՏitr13[ՐՏidx13];
                        imp._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_27);
    var Decorator = (ՐՏ_28 = function Decorator() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_28, Node), Object.defineProperties(ՐՏ_28.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                expression: "[Node] decorator expression"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                if (self.expression) {
                    self.expression.walk(visitor);
                }
            }
        }
    }), ՐՏ_28);
    var Annotation = (ՐՏ_29 = function Annotation() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_29, Node), Object.defineProperties(ՐՏ_29.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                expression: "[Node] decorator expression"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                if (self.expression) {
                    self.expression.walk(visitor);
                }
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                function parse(obj) {
                    var ՐՏ_30;
                    if (obj instanceof Array) {
                        if (obj.elements.length === 1) {
                            return "[" + parse(obj.elements[0]) + "]";
                        }
                        return "[?]";
                    }
                    if (obj instanceof ObjectLiteral) {
                        if (obj.properties.length === 1) {
                            return "{String:" + parse(obj.properties[0].value) + "}";
                        }
                        return "{String:?}";
                    }
                    if (obj instanceof SymbolRef) {
                        return obj.name === "Array" ? "[?]" : ՐՏ_in(obj.name, [ "Object", "Dictionary" ]) ? "{String:?}" : obj.name;
                    }
                    if (obj instanceof Call) {
                        if (obj.expression instanceof SymbolRef && obj.expression.name === "Array" && obj.args.length === 1) {
                            return "[" + parse(obj.args[0]) + "]";
                        }
                        if (obj.expression instanceof SymbolRef && ՐՏ_in(obj.expression.name, [ "Object", "Dictionary" ])) {
                            if (1 <= (ՐՏ_30 = obj.args.length) && ՐՏ_30 <= 2) {
                                return "{String:" + parse(obj.args[obj.args.length-1]) + "}";
                            }
                            return "{String:?}";
                        }
                    }
                    return "?";
                }
                return parse(self.expression);
            })
        }
    }), ՐՏ_29);
    var Lambda = (ՐՏ_31 = function Lambda() {
        Scope.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_31, Scope), Object.defineProperties(ՐՏ_31.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                name: "[SymbolDeclaration?] the name of this function/class/method",
                argnames: "[SymbolFunarg*] array of arguments",
                kwargs: "[SymbolFunarg?] kwargs symbol, if any",
                uses_arguments: "[boolean/S] tells whether this function accesses the arguments array",
                decorators: "[Decorator*] function decorators, if any",
                generator: "[boolean] true if this is a generator function (false by default)",
                return_annotation: "[Annotation?] the return type annotation provided (if any)"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr14, ՐՏidx14, ՐՏitr15, ՐՏidx15;
                    var d, arg;
                    if (self.decorators) {
                        ՐՏitr14 = ՐՏ_Iterable(self.decorators);
                        for (ՐՏidx14 = 0; ՐՏidx14 < ՐՏitr14.length; ՐՏidx14++) {
                            d = ՐՏitr14[ՐՏidx14];
                            d.walk(visitor);
                        }
                    }
                    if (self.name) {
                        self.name._walk(visitor);
                    }
                    ՐՏitr15 = ՐՏ_Iterable(self.argnames);
                    for (ՐՏidx15 = 0; ՐՏidx15 < ՐՏitr15.length; ՐՏidx15++) {
                        arg = ՐՏitr15[ՐՏidx15];
                        arg._walk(visitor);
                    }
                    if (self.argnames.starargs) {
                        self.argnames.starargs._walk(visitor);
                    }
                    if (self.kwargs) {
                        self.kwargs._walk(visitor);
                    }
                    walk_body(self, visitor);
                });
            }
        }
    }), ՐՏ_31);
    var Accessor = (ՐՏ_32 = function Accessor() {
        Lambda.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_32, Lambda), ՐՏ_32);
    var Function = (ՐՏ_33 = function Function() {
        Lambda.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_33, Lambda), Object.defineProperties(ՐՏ_33.prototype, {
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var ՐՏitr16, ՐՏidx16;
                var self = this;
                var annotated, args, arg, computedType, result, signature;
                if (self.argnames.starargs) {
                    return "Function";
                }
                annotated = true;
                args = [];
                ՐՏitr16 = ՐՏ_Iterable(self.argnames);
                for (ՐՏidx16 = 0; ՐՏidx16 < ՐՏitr16.length; ՐՏidx16++) {
                    arg = ՐՏitr16[ՐՏidx16];
                    if (arg.annotation) {
                        computedType = arg.annotation.resolveType(heap);
                        if (computedType) {
                            args.push(computedType);
                        } else {
                            annotated = false;
                            break;
                        }
                    } else {
                        annotated = false;
                        break;
                    }
                }
                if (self.return_annotation) {
                    result = self.return_annotation.resolveType(heap);
                    if (!result) {
                        annotated = false;
                    }
                }
                signature = "Function";
                if (annotated) {
                    signature += "(" + args.join(",") + ")";
                    if (result) {
                        signature += " -> " + result;
                    }
                }
                return signature;
            })
        }
    }), ՐՏ_33);
    var Class = (ՐՏ_34 = function Class() {
        Scope.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_34, Scope), Object.defineProperties(ՐՏ_34.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                name: "[SymbolDeclaration?] the name of this class",
                init: "[Function] constructor for the class",
                parent: "[Class?] parent class this class inherits from",
                static: "[string*] list of static methods",
                external: "[boolean] true if class is declared elsewhere, but will be within current scope at runtime",
                bound: "[string*] hash of methods that need to be bound to behave correctly (function pointers)",
                decorators: "[Decorator*] function decorators, if any",
                module_id: "[string] The id of the module this class is defined in",
                statements: "[Node*] list of statements in the class scope (excluding method definitions)"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.name._walk(visitor);
                    walk_body(this, visitor);
                    if (self.parent) {
                        self.parent._walk(visitor);
                    }
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                return self.name.name;
            })
        }
    }), ՐՏ_34);
    var Module = (ՐՏ_35 = function Module() {
        Scope.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_35, Scope), Object.defineProperties(ՐՏ_35.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                name: "[SymbolDeclaration?] the name of this class",
                external: "[boolean] true if module is declared elsewhere, but will be within current scope at runtime",
                decorators: "[Decorator*] module decorators, if any"
            }        }
    }), ՐՏ_35);
    var Method = (ՐՏ_36 = function Method() {
        Lambda.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_36, Lambda), Object.defineProperties(ՐՏ_36.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                static: "[boolean] true if method is static"
            }        }
    }), ՐՏ_36);
    var Constructor = (ՐՏ_37 = function Constructor() {
        Method.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_37, Method), Object.defineProperties(ՐՏ_37.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                callsSuper: "[boolean] true if user manually called super or Parent.__init__",
                parent: "[string?] parent class this class inherits from"
            }        }
    }), ՐՏ_37);
    var Jump = (ՐՏ_38 = function Jump() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_38, Statement), ՐՏ_38);
    var Exit = (ՐՏ_39 = function Exit() {
        Jump.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_39, Jump), Object.defineProperties(ՐՏ_39.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[Node?] the value returned or thrown by this statement; could be null for Return"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    if (self.value) {
                        self.value._walk(visitor);
                    }
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                return self.value.resolveType(heap);
            })
        }
    }), ՐՏ_39);
    var Return = (ՐՏ_40 = function Return() {
        Exit.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_40, Exit), ՐՏ_40);
    var Yield = (ՐՏ_41 = function Yield() {
        Exit.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_41, Exit), ՐՏ_41);
    var Throw = (ՐՏ_42 = function Throw() {
        Exit.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_42, Exit), ՐՏ_42);
    var LoopControl = (ՐՏ_43 = function LoopControl() {
        Jump.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_43, Jump), Object.defineProperties(ՐՏ_43.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                label: "[LabelRef?] the label, or null if none"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    if (self.label) {
                        self.label._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_43);
    var Break = (ՐՏ_44 = function Break() {
        LoopControl.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_44, LoopControl), ՐՏ_44);
    var Continue = (ՐՏ_45 = function Continue() {
        LoopControl.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_45, LoopControl), ՐՏ_45);
    var If = (ՐՏ_46 = function If() {
        StatementWithBody.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_46, StatementWithBody), Object.defineProperties(ՐՏ_46.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                condition: "[Node] the `if` condition",
                alternative: "[Statement?] the `else` part, or null if not present"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.condition._walk(visitor);
                    self.body._walk(visitor);
                    if (self.alternative) {
                        self.alternative._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_46);
    var Switch = (ՐՏ_47 = function Switch() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_47, Block), Object.defineProperties(ՐՏ_47.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                expression: "[Node] the `switch` “discriminant”"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.expression._walk(visitor);
                    walk_body(self, visitor);
                });
            }
        }
    }), ՐՏ_47);
    var SwitchBranch = (ՐՏ_48 = function SwitchBranch() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_48, Block), ՐՏ_48);
    var Default = (ՐՏ_49 = function Default() {
        SwitchBranch.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_49, SwitchBranch), ՐՏ_49);
    var Case = (ՐՏ_50 = function Case() {
        SwitchBranch.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_50, SwitchBranch), Object.defineProperties(ՐՏ_50.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                expression: "[Node] the `case` expression"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.expression._walk(visitor);
                    walk_body(self, visitor);
                });
            }
        }
    }), ՐՏ_50);
    var Try = (ՐՏ_51 = function Try() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_51, Block), Object.defineProperties(ՐՏ_51.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                bcatch: "[Catch?] the catch block, or null if not present",
                bfinally: "[Finally?] the finally block, or null if not present"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    walk_body(self, visitor);
                    if (self.bcatch) {
                        self.bcatch._walk(visitor);
                    }
                    if (self.bfinally) {
                        self.bfinally._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_51);
    var Catch = (ՐՏ_52 = function Catch() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_52, Block), ՐՏ_52);
    var Except = (ՐՏ_53 = function Except() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_53, Block), Object.defineProperties(ՐՏ_53.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                argname: "[SymbolCatch] symbol for the exception",
                errors: "[SymbolVar*] error classes to catch in this block"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr17, ՐՏidx17;
                    var e;
                    if (self.argname) {
                        self.argname.walk(visitor);
                    }
                    if (self.errors) {
                        ՐՏitr17 = ՐՏ_Iterable(self.errors);
                        for (ՐՏidx17 = 0; ՐՏidx17 < ՐՏitr17.length; ՐՏidx17++) {
                            e = ՐՏitr17[ՐՏidx17];
                            e.walk(visitor);
                        }
                    }
                    walk_body(self, visitor);
                });
            }
        }
    }), ՐՏ_53);
    var Finally = (ՐՏ_54 = function Finally() {
        Block.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_54, Block), ՐՏ_54);
    var Definitions = (ՐՏ_55 = function Definitions() {
        Statement.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_55, Statement), Object.defineProperties(ՐՏ_55.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                definitions: "[VarDef*] array of variable definitions"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr18, ՐՏidx18;
                    var def_;
                    ՐՏitr18 = ՐՏ_Iterable(self.definitions);
                    for (ՐՏidx18 = 0; ՐՏidx18 < ՐՏitr18.length; ՐՏidx18++) {
                        def_ = ՐՏitr18[ՐՏidx18];
                        def_._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_55);
    var Var = (ՐՏ_56 = function Var() {
        Definitions.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_56, Definitions), ՐՏ_56);
    var Const = (ՐՏ_57 = function Const() {
        Definitions.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_57, Definitions), ՐՏ_57);
    var VarDef = (ՐՏ_58 = function VarDef() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_58, Node), Object.defineProperties(ՐՏ_58.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                name: "[SymbolVar|SymbolConst] name of the variable",
                value: "[Node?] initializer, or null if there's no initializer"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.name._walk(visitor);
                    if (self.value) {
                        self.value._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_58);
    var BaseCall = (ՐՏ_59 = function BaseCall() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_59, Node), Object.defineProperties(ՐՏ_59.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                args: "[Node*] array of arguments"
            }        }
    }), ՐՏ_59);
    var Call = (ՐՏ_60 = function Call() {
        BaseCall.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_60, BaseCall), Object.defineProperties(ՐՏ_60.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                expression: "[Node] expression to invoke as function"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr19, ՐՏidx19, ՐՏitr20, ՐՏidx20, ՐՏitr21, ՐՏidx21;
                    var arg;
                    self.expression._walk(visitor);
                    ՐՏitr19 = ՐՏ_Iterable(self.args);
                    for (ՐՏidx19 = 0; ՐՏidx19 < ՐՏitr19.length; ՐՏidx19++) {
                        arg = ՐՏitr19[ՐՏidx19];
                        arg._walk(visitor);
                    }
                    if (self.args.kwargs) {
                        ՐՏitr20 = ՐՏ_Iterable(self.args.kwargs);
                        for (ՐՏidx20 = 0; ՐՏidx20 < ՐՏitr20.length; ՐՏidx20++) {
                            arg = ՐՏitr20[ՐՏidx20];
                            arg[0]._walk(visitor);
                            arg[1]._walk(visitor);
                        }
                    }
                    if (self.args.kwarg_items) {
                        ՐՏitr21 = ՐՏ_Iterable(self.args.kwarg_items);
                        for (ՐՏidx21 = 0; ՐՏidx21 < ՐՏitr21.length; ՐՏidx21++) {
                            arg = ՐՏitr21[ՐՏidx21];
                            arg._walk(visitor);
                        }
                    }
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var ՐՏitr22, ՐՏidx22;
                var self = this;
                var scope, parse, result;
                if (self.expression instanceof SymbolRef) {
                    ՐՏitr22 = ՐՏ_Iterable(reversed(heap));
                    for (ՐՏidx22 = 0; ՐՏidx22 < ՐՏitr22.length; ՐՏidx22++) {
                        scope = ՐՏitr22[ՐՏidx22];
                        if (ՐՏ_in(self.expression.name, scope.vars) && ՐՏ_in("->", scope.vars[self.expression.name][scope.vars[self.expression.name].length-1])) {
                            return scope.vars[self.expression.name][scope.vars[self.expression.name].length-1].split("->")[1].trim();
                        } else if (ՐՏ_in(self.expression.name, scope.functions) && ՐՏ_in("->", scope.functions[self.expression.name])) {
                            return scope.functions[self.expression.name].split("->")[1].trim();
                        } else if (scope.type === "function" && self.expression.name === scope.name && scope.return) {
                            parse = function(variable) {
                                var ՐՏ_61;
                                var wrap, wrapper, element, result;
                                wrap = {
                                    "array": function(value) {
                                        return "[" + value + "]";
                                    },
                                    "dict": function(value) {
                                        return "{String:" + value + "}";
                                    },
                                    "base": function(value) {
                                        return value;
                                    }
                                };
                                wrapper = "base";
                                if (variable instanceof Array) {
                                    if (variable.elements.length !== 1) {
                                        return;
                                    }
                                    wrapper = "array";
                                    element = variable.elements[0];
                                } else if (variable instanceof Call && variable.expression instanceof SymbolRef && variable.expression.name === "Array") {
                                    if (variable.args.length !== 1) {
                                        return;
                                    }
                                    wrapper = "array";
                                    element = variable.args[0];
                                } else if (variable instanceof ObjectLiteral) {
                                    if (variable.properties.length !== 1) {
                                        return;
                                    }
                                    wrapper = "dict";
                                    element = variable.properties[0].value;
                                } else if (variable instanceof Call && variable.expression instanceof SymbolRef && ՐՏ_in(variable.expression.name, [ "Object", "Dictionary" ])) {
                                    if (1 <= (ՐՏ_61 = variable.args.length) && ՐՏ_61 <= 2) {
                                        element = variable.args[variable.args.length-1];
                                        wrapper = "dict";
                                    } else {
                                        return;
                                    }
                                } else {
                                    element = variable;
                                }
                                if (element instanceof SymbolRef && ՐՏ_in(element.name, NATIVE_CLASSES)) {
                                    return wrap[wrapper](element.name);
                                } else if (element instanceof Array || element instanceof ObjectLiteral || element instanceof Call) {
                                    result = parse(element);
                                    if (result) {
                                        return wrap[wrapper](result);
                                    }
                                }
                            };
                            result = parse(scope.return_annotation);
                            if (result) {
                                return result;
                            }
                        }
                    }
                }
                return "?";
            })
        }
    }), ՐՏ_60);
    var ClassCall = (ՐՏ_62 = function ClassCall() {
        BaseCall.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_62, BaseCall), Object.defineProperties(ՐՏ_62.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                class: "[string] name of the class method belongs to",
                super: "[boolean] this call can be replaced with a super() call",
                method: "[string] class method being called",
                static: "[boolean] defines whether the method is static"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr23, ՐՏidx23, ՐՏitr24, ՐՏidx24, ՐՏitr25, ՐՏidx25;
                    var arg;
                    if (self.expression) {
                        self.expression._walk(visitor);
                    }
                    ՐՏitr23 = ՐՏ_Iterable(self.args);
                    for (ՐՏidx23 = 0; ՐՏidx23 < ՐՏitr23.length; ՐՏidx23++) {
                        arg = ՐՏitr23[ՐՏidx23];
                        arg._walk(visitor);
                    }
                    ՐՏitr24 = ՐՏ_Iterable(self.args.kwargs);
                    for (ՐՏidx24 = 0; ՐՏidx24 < ՐՏitr24.length; ՐՏidx24++) {
                        arg = ՐՏitr24[ՐՏidx24];
                        arg[0]._walk(visitor);
                        arg[1]._walk(visitor);
                    }
                    ՐՏitr25 = ՐՏ_Iterable(self.args.kwarg_items);
                    for (ՐՏidx25 = 0; ՐՏidx25 < ՐՏitr25.length; ՐՏidx25++) {
                        arg = ՐՏitr25[ՐՏidx25];
                        arg._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_62);
    var New = (ՐՏ_63 = function New() {
        Call.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_63, Call), ՐՏ_63);
    var Seq = (ՐՏ_64 = function Seq() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_64, Node), Object.defineProperties(ՐՏ_64.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                car: "[Node] first element in sequence",
                cdr: "[Node] second element in sequence"
            }        },
        cons: {
            enumerable: true, 
            writable: true, 
            value: function cons(x, y){
                var self = this;
                var seq;
                seq = new Seq(x);
                seq.car = x;
                seq.cdr = y;
                return seq;
            }
        },
        from_array: {
            enumerable: true, 
            writable: true, 
            value: function from_array(array){
                var ՐՏitr26, ՐՏidx26;
                var self = this;
                var list, i, p;
                if (array.length === 0) {
                    return null;
                }
                if (array.length === 1) {
                    return array[0].clone();
                }
                list = null;
                ՐՏitr26 = ՐՏ_Iterable(range(array.length - 1, -1, -1));
                for (ՐՏidx26 = 0; ՐՏidx26 < ՐՏitr26.length; ՐՏidx26++) {
                    i = ՐՏitr26[ՐՏidx26];
                    list = Seq.prototype.cons.call(array[i], list);
                }
                p = list;
                while (p) {
                    if (p.cdr && !p.cdr.cdr) {
                        p.cdr = p.cdr.car;
                        break;
                    }
                    p = p.cdr;
                }
                return list;
            }
        },
        to_array: {
            enumerable: true, 
            writable: true, 
            value: function to_array(){
                var self = this;
                var p, a;
                p = this;
                a = [];
                while (p) {
                    a.push(p.car);
                    if (p.cdr && !(p.cdr instanceof Seq)) {
                        a.push(p.cdr);
                        break;
                    }
                    p = p.cdr;
                }
                return a;
            }
        },
        add: {
            enumerable: true, 
            writable: true, 
            value: function add(node){
                var self = this;
                var p, cell;
                p = this;
                while (p) {
                    if (!(p.cdr instanceof Seq)) {
                        cell = Seq.prototype.cons.call(p.cdr, node);
                        return p.cdr = cell;
                    }
                    p = p.cdr;
                }
            }
        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.car._walk(visitor);
                    if (self.cdr) {
                        self.cdr._walk(visitor);
                    }
                });
            }
        }
    }), ՐՏ_64);
    var PropAccess = (ՐՏ_65 = function PropAccess() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_65, Node), Object.defineProperties(ՐՏ_65.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                expression: "[Node] the “container” expression",
                property: "[Node|string] the property to access. For Dot this is always a plain string, while for Sub it's an arbitrary Node"
            }        }
    }), ՐՏ_65);
    var Dot = (ՐՏ_66 = function Dot() {
        PropAccess.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_66, PropAccess), Object.defineProperties(ՐՏ_66.prototype, {
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.expression._walk(visitor);
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                var containerType;
                containerType = self.expression.resolveType(heap);
                if (containerType && containerType[0] === "{") {
                    return /\{\w+:(.*)\}/.exec(containerType)[1];
                }
                return "?";
            })
        }
    }), ՐՏ_66);
    var Sub = (ՐՏ_67 = function Sub() {
        PropAccess.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_67, PropAccess), Object.defineProperties(ՐՏ_67.prototype, {
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.expression._walk(visitor);
                    self.property._walk(visitor);
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                var containerType;
                containerType = self.expression.resolveType(heap);
                if (containerType) {
                    if (containerType[0] === "[" && self.property instanceof Number) {
                        return /\[(.*)\]/.exec(containerType)[1];
                    }
                    if (containerType[0] === "{") {
                        return /\{\w+:(.*)\}/.exec(containerType)[1];
                    }
                }
                return "?";
            })
        }
    }), ՐՏ_67);
    var Slice = (ՐՏ_68 = function Slice() {
        PropAccess.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_68, PropAccess), Object.defineProperties(ՐՏ_68.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                property2: "[Node] the 2nd property to access - typically ending index for the array.",
                assignment: "[Node] The data being spliced in."
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.expression._walk(visitor);
                    self.property._walk(visitor);
                    self.property2._walk(visitor);
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                return self.expression.resolveType(heap);
            })
        }
    }), ՐՏ_68);
    var Unary = (ՐՏ_69 = function Unary() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_69, Node), Object.defineProperties(ՐՏ_69.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                operator: "[string] the operator",
                expression: "[Node] expression that this unary operator applies to"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.expression._walk(visitor);
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                if (self.operator === "!") {
                    return "Boolean";
                }
                if (ՐՏ_in(self.operator, [ "-", "+" ]) && self.expression.resolveType(heap) === "Number") {
                    return "Number";
                }
                return "?";
            })
        }
    }), ՐՏ_69);
    var UnaryPrefix = (ՐՏ_70 = function UnaryPrefix() {
        Unary.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_70, Unary), ՐՏ_70);
    var UnaryPostfix = (ՐՏ_71 = function UnaryPostfix() {
        Unary.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_71, Unary), ՐՏ_71);
    var Binary = (ՐՏ_72 = function Binary() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_72, Node), Object.defineProperties(ՐՏ_72.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                left: "[Node] left-hand side expression",
                operator: "[string] the operator",
                right: "[Node] right-hand side expression"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.left._walk(visitor);
                    self.right._walk(visitor);
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                var left, right;
                if (!(self.left && self.right)) {
                    return "?";
                }
                left = self.left.resolveType(heap);
                right = self.left.resolveType(heap);
                if (left === "Number" && right === "Number") {
                    return "Number";
                }
                if (left === "Boolean" && right === "Boolean" || ՐՏ_in(self.operator, [ "===", "!==", ">", ">=", "<", "<=" ])) {
                    return "Boolean";
                }
                if (left === "String" && self.operator === "+") {
                    return "String";
                }
                return "?";
            })
        }
    }), ՐՏ_72);
    var Range = (ՐՏ_73 = function Range() {
        Binary.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_73, Binary), Object.defineProperties(ՐՏ_73.prototype, {
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                return "[Number]";
            })
        }
    }), ՐՏ_73);
    var DeepEquality = (ՐՏ_74 = function DeepEquality() {
        Binary.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_74, Binary), Object.defineProperties(ՐՏ_74.prototype, {
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                return "Boolean";
            })
        }
    }), ՐՏ_74);
    var Conditional = (ՐՏ_75 = function Conditional() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_75, Node), Object.defineProperties(ՐՏ_75.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                condition: "[Node] test to run before deciding the return value",
                consequent: "[Node] return expression in the event on truthy test evaluation",
                alternative: "[Node] return expression in the event of falsy test evaluation"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.condition._walk(visitor);
                    self.consequent._walk(visitor);
                    self.alternative._walk(visitor);
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                var computedType;
                computedType = self.consequent.resolveType(heap);
                return computedType === self.alternative.resolveType(heap) ? computedType : "?";
            })
        }
    }), ՐՏ_75);
    var Assign = (ՐՏ_76 = function Assign() {
        Binary.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_76, Binary), Object.defineProperties(ՐՏ_76.prototype, {
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var self = this;
                if (self.operator === "=") {
                    return self.right.resolveType(heap);
                }
                return "?";
            })
        }
    }), ՐՏ_76);
    var Array = (ՐՏ_77 = function Array() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_77, Node), Object.defineProperties(ՐՏ_77.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                elements: "[Node*] array of elements"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr27, ՐՏidx27;
                    var el;
                    ՐՏitr27 = ՐՏ_Iterable(self.elements);
                    for (ՐՏidx27 = 0; ՐՏidx27 < ՐՏitr27.length; ՐՏidx27++) {
                        el = ՐՏitr27[ՐՏidx27];
                        el._walk(visitor);
                    }
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var ՐՏitr28, ՐՏidx28;
                var self = this;
                var expected, element, current;
                if (!self.elements.length) {
                    return "[?]";
                }
                expected = self.elements[0].resolveType(heap);
                ՐՏitr28 = ՐՏ_Iterable(self.elements.slice(1));
                for (ՐՏidx28 = 0; ՐՏidx28 < ՐՏitr28.length; ՐՏidx28++) {
                    element = ՐՏitr28[ՐՏidx28];
                    current = element.resolveType(heap);
                    if (current !== expected) {
                        if (expected.indexOf("Function") === 0 && current.indexOf("Function") === 0) {
                            return "[Function]";
                        }
                        return "[?]";
                    }
                }
                return "[" + expected + "]";
            })
        }
    }), ՐՏ_77);
    var TupleUnpack = (ՐՏ_78 = function TupleUnpack() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_78, Node), Object.defineProperties(ՐՏ_78.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                elements: "[Node*] array of elements being assigned to",
                right: "[Node] right-hand side expression"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr29, ՐՏidx29;
                    var el;
                    ՐՏitr29 = ՐՏ_Iterable(self.elements);
                    for (ՐՏidx29 = 0; ՐՏidx29 < ՐՏitr29.length; ՐՏidx29++) {
                        el = ՐՏitr29[ՐՏidx29];
                        el._walk(visitor);
                    }
                    self.right._walk(visitor);
                });
            }
        }
    }), ՐՏ_78);
    var ObjectLiteral = (ՐՏ_79 = function ObjectLiteral() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_79, Node), Object.defineProperties(ՐՏ_79.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                properties: "[ObjectProperty*] array of properties"
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    var ՐՏitr30, ՐՏidx30;
                    var prop;
                    ՐՏitr30 = ՐՏ_Iterable(self.properties);
                    for (ՐՏidx30 = 0; ՐՏidx30 < ՐՏitr30.length; ՐՏidx30++) {
                        prop = ՐՏitr30[ՐՏidx30];
                        prop._walk(visitor);
                    }
                });
            }
        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var ՐՏitr31, ՐՏidx31;
                var self = this;
                var start, spread, expected, element, current, result;
                if (!self.properties.length) {
                    return "{String:?}";
                }
                start = 0;
                spread = null;
                while (self.properties[start] instanceof UnaryPrefix) {
                    spread = self.properties[start].expression.resolveType(heap);
                    if (ՐՏ_in("?", spread)) {
                        return "{String:?}";
                    }
                    ++start;
                }
                expected = self.properties[start].value.resolveType(heap);
                ՐՏitr31 = ՐՏ_Iterable(self.properties.slice(start + 1));
                for (ՐՏidx31 = 0; ՐՏidx31 < ՐՏitr31.length; ՐՏidx31++) {
                    element = ՐՏitr31[ՐՏidx31];
                    if (element instanceof UnaryPrefix) {
                        if (spread) {
                            if (spread !== element.expression.resolveType(heap)) {
                                return "{String:?}";
                            }
                        } else {
                            spread = element.expression.resolveType(heap);
                        }
                    } else if (element instanceof Accessor) {
                    } else {
                        current = element.value.resolveType(heap);
                        if (current !== expected) {
                            if (expected.indexOf("Function") === 0 && current.indexOf("Function") === 0) {
                                return "{String:Function}";
                            }
                            return "{String:?}";
                        }
                    }
                }
                result = "{String:" + expected + "}";
                if (spread) {
                    if (spread === result) {
                        return result;
                    } else {
                        return "{String:?}";
                    }
                }
                return result;
            })
        }
    }), ՐՏ_79);
    var ObjectProperty = (ՐՏ_80 = function ObjectProperty() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_80, Node), Object.defineProperties(ՐՏ_80.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                key: "[Node] the property name or expression for computed key ",
                value: "[Node] property value. For setters and getters this is an Function."
            }        },
        _walk: {
            enumerable: true, 
            writable: true, 
            value: function _walk(visitor){
                var self = this;
                return visitor._visit(self, function() {
                    self.key._walk(visitor);
                    self.value._walk(visitor);
                });
            }
        }
    }), ՐՏ_80);
    var ObjectKeyVal = (ՐՏ_81 = function ObjectKeyVal() {
        ObjectProperty.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_81, ObjectProperty), ՐՏ_81);
    var ObjectSetter = (ՐՏ_82 = function ObjectSetter() {
        Accessor.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_82, Accessor), ՐՏ_82);
    var ObjectGetter = (ՐՏ_83 = function ObjectGetter() {
        Accessor.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_83, Accessor), ՐՏ_83);
    var Symbol = (ՐՏ_84 = function Symbol() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_84, Node), Object.defineProperties(ՐՏ_84.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                name: "[string] name of this symbol",
                scope: "[Scope/S] the current scope (not necessarily the definition scope)",
                thedef: "[SymbolDef/S] the definition of this symbol"
            }        }
    }), ՐՏ_84);
    var SymbolAlias = (ՐՏ_85 = function SymbolAlias() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_85, Symbol), ՐՏ_85);
    var SymbolAccessor = (ՐՏ_86 = function SymbolAccessor() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_86, Symbol), ՐՏ_86);
    var SymbolDeclaration = (ՐՏ_87 = function SymbolDeclaration() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_87, Symbol), Object.defineProperties(ՐՏ_87.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                init: "[Node*/S] array of initializers for this declaration."
            }        }
    }), ՐՏ_87);
    var SymbolVar = (ՐՏ_88 = function SymbolVar() {
        SymbolDeclaration.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_88, SymbolDeclaration), ՐՏ_88);
    var SymbolNonlocal = (ՐՏ_89 = function SymbolNonlocal() {
        SymbolDeclaration.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_89, SymbolDeclaration), ՐՏ_89);
    var ImportedVar = (ՐՏ_90 = function ImportedVar() {
        SymbolVar.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_90, SymbolVar), Object.defineProperties(ՐՏ_90.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                alias: "SymbolAlias the alias for this imported symbol"
            }        }
    }), ՐՏ_90);
    var SymbolConst = (ՐՏ_91 = function SymbolConst() {
        SymbolDeclaration.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_91, SymbolDeclaration), ՐՏ_91);
    var SymbolFunarg = (ՐՏ_92 = function SymbolFunarg() {
        SymbolVar.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_92, SymbolVar), Object.defineProperties(ՐՏ_92.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                annotation: "[Annotation?] annotation provided for this argument, if any"
            }        }
    }), ՐՏ_92);
    var SymbolDefun = (ՐՏ_93 = function SymbolDefun() {
        SymbolDeclaration.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_93, SymbolDeclaration), ՐՏ_93);
    var SymbolLambda = (ՐՏ_94 = function SymbolLambda() {
        SymbolDeclaration.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_94, SymbolDeclaration), ՐՏ_94);
    var SymbolCatch = (ՐՏ_95 = function SymbolCatch() {
        SymbolDeclaration.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_95, SymbolDeclaration), ՐՏ_95);
    var Label = (ՐՏ_96 = function Label() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_96, Symbol), Object.defineProperties(ՐՏ_96.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                references: "[LabelRef*] a list of nodes referring to this label"
            }        }
    }), ՐՏ_96);
    var SymbolRef = (ՐՏ_97 = function SymbolRef() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_97, Symbol), Object.defineProperties(ՐՏ_97.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                parens: "[boolean/S] if true, this variable is wrapped in parentheses"
            }        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(heap){
                var ՐՏitr32, ՐՏidx32;
                var self = this;
                var scope;
                ՐՏitr32 = ՐՏ_Iterable(reversed(heap));
                for (ՐՏidx32 = 0; ՐՏidx32 < ՐՏitr32.length; ՐՏidx32++) {
                    scope = ՐՏitr32[ՐՏidx32];
                    if (ՐՏ_in(self.name, scope.vars)) {
                        return scope.vars[self.name][scope.vars[self.name].length-1];
                    }
                    if (scope.args && ՐՏ_in(self.name, scope.args)) {
                        return scope.args[self.name];
                    }
                }
                return "?";
            })
        }
    }), ՐՏ_97);
    var SymbolClassRef = (ՐՏ_98 = function SymbolClassRef() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_98, Symbol), Object.defineProperties(ՐՏ_98.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                class: "[SymbolDeclaration?] the name of this class"
            }        }
    }), ՐՏ_98);
    var LabelRef = (ՐՏ_99 = function LabelRef() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_99, Symbol), ՐՏ_99);
    var This = (ՐՏ_100 = function This() {
        Symbol.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_100, Symbol), ՐՏ_100);
    var Constant = (ՐՏ_101 = function Constant() {
        Node.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_101, Node), Object.defineProperties(ՐՏ_101.prototype, {
        getValue: {
            enumerable: true, 
            writable: true, 
            value: function getValue(){
                var self = this;
                return this.value;
            }
        }
    }), ՐՏ_101);
    var String = (ՐՏ_102 = function String() {
        Constant.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_102, Constant), Object.defineProperties(ՐՏ_102.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[string] the contents of this string",
                modifier: "[string] string type modifier"
            }        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return "String";
            })
        }
    }), ՐՏ_102);
    var Verbatim = (ՐՏ_103 = function Verbatim() {
        Constant.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_103, Constant), Object.defineProperties(ՐՏ_103.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[string] A string of raw JS code"
            }        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return "?";
            })
        }
    }), ՐՏ_103);
    var Number = (ՐՏ_104 = function Number() {
        Constant.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_104, Constant), Object.defineProperties(ՐՏ_104.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[number] the numeric value"
            }        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return "Number";
            })
        }
    }), ՐՏ_104);
    var Identifier = (ՐՏ_105 = function Identifier() {
        Constant.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_105, Constant), Object.defineProperties(ՐՏ_105.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[string] the name of this key"
            }        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return "String";
            })
        }
    }), ՐՏ_105);
    var RegExp = (ՐՏ_106 = function RegExp() {
        Constant.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_106, Constant), Object.defineProperties(ՐՏ_106.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[RegExp] the actual regexp"
            }        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return "RegExp";
            })
        }
    }), ՐՏ_106);
    var Atom = (ՐՏ_107 = function Atom() {
        Constant.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_107, Constant), ՐՏ_107);
    var Null = (ՐՏ_108 = function Null() {
        Atom.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_108, Atom), Object.defineProperties(ՐՏ_108.prototype, {
        value: {
            enumerable: true, 
            writable: true, 
            value: null        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return null;
            })
        }
    }), ՐՏ_108);
    var NotANumber = (ՐՏ_109 = function NotANumber() {
        Atom.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_109, Atom), Object.defineProperties(ՐՏ_109.prototype, {
        value: {
            enumerable: true, 
            writable: true, 
            value: 0 / 0        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return null;
            })
        }
    }), ՐՏ_109);
    var Undefined = (ՐՏ_110 = function Undefined() {
        Atom.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_110, Atom), Object.defineProperties(ՐՏ_110.prototype, {
        value: {
            enumerable: true, 
            writable: true, 
            value: void 0        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return null;
            })
        }
    }), ՐՏ_110);
    var Hole = (ՐՏ_111 = function Hole() {
        Atom.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_111, Atom), Object.defineProperties(ՐՏ_111.prototype, {
        value: {
            enumerable: true, 
            writable: true, 
            value: void 0        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return null;
            })
        }
    }), ՐՏ_111);
    var Infinity = (ՐՏ_112 = function Infinity() {
        Atom.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_112, Atom), Object.defineProperties(ՐՏ_112.prototype, {
        value: {
            enumerable: true, 
            writable: true, 
            value: 1 / 0        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return "Number";
            })
        }
    }), ՐՏ_112);
    var Boolean = (ՐՏ_113 = function Boolean() {
        Atom.prototype.__init__.apply(this, arguments);
    }, ՐՏ_extends(ՐՏ_113, Atom), Object.defineProperties(ՐՏ_113.prototype, {
        properties: {
            enumerable: true, 
            writable: true, 
            value: {
                value: "[boolean] value"
            }        },
        resolveType: {
            enumerable: true, 
            writable: true, 
            value: memoized(function resolveType(){
                var self = this;
                return "Boolean";
            })
        }
    }), ՐՏ_113);
    var TreeWalker = (ՐՏ_114 = function TreeWalker() {
        TreeWalker.prototype.__init__.apply(this, arguments);
    }, Object.defineProperties(ՐՏ_114.prototype, {
        __init__: {
            enumerable: true, 
            writable: true, 
            value: function __init__(callback){
                var self = this;
                self.visit = callback;
                self.stack = [];
            }
        },
        _visit: {
            enumerable: true, 
            writable: true, 
            value: function _visit(node, descend){
                var self = this;
                var ret;
                self.stack.push(node);
                ret = self.visit(node, descend ? function() {
                    descend.call(node);
                } : noop);
                if (!ret && descend) {
                    descend.call(node);
                }
                self.stack.pop();
                return ret;
            }
        },
        parent: {
            enumerable: true, 
            writable: true, 
            value: function parent(n){
                var self = this;
                return self.stack[self.stack.length - 2 - (n || 0)];
            }
        },
        push: {
            enumerable: true, 
            writable: true, 
            value: function push(node){
                var self = this;
                self.stack.push(node);
            }
        },
        pop: {
            enumerable: true, 
            writable: true, 
            value: function pop(){
                var self = this;
                return self.stack.pop();
            }
        },
        self: {
            enumerable: true, 
            writable: true, 
            value: function self(){
                var self = this;
                return self.stack[self.stack.length - 1];
            }
        },
        find_parent: {
            enumerable: true, 
            writable: true, 
            value: function find_parent(type){
                var ՐՏitr33, ՐՏidx33;
                var self = this;
                var stack, i, x;
                stack = self.stack;
                ՐՏitr33 = ՐՏ_Iterable(range(stack.length - 1, -1, -1));
                for (ՐՏidx33 = 0; ՐՏidx33 < ՐՏitr33.length; ՐՏidx33++) {
                    i = ՐՏitr33[ՐՏidx33];
                    x = stack[i];
                    if (x instanceof type) {
                        return x;
                    }
                }
            }
        },
        in_boolean_context: {
            enumerable: true, 
            writable: true, 
            value: function in_boolean_context(){
                var self = this;
                var stack, i, p;
                stack = self.stack;
                i = stack.length;
                self = stack[--i];
                while (i > 0) {
                    p = stack[--i];
                    if (p instanceof If && p.condition === self || p instanceof Conditional && p.condition === self || p instanceof DWLoop && p.condition === self || p instanceof UnaryPrefix && p.operator === "!" && p.expression === self) {
                        return true;
                    }
                    if (!(p instanceof Binary && (p.operator === "&&" || p.operator === "||"))) {
                        return false;
                    }
                    self = p;
                }
            }
        },
        loopcontrol_target: {
            enumerable: true, 
            writable: true, 
            value: function loopcontrol_target(label){
                var ՐՏitr34, ՐՏidx34, ՐՏitr35, ՐՏidx35;
                var self = this;
                var stack, i, x;
                stack = self.stack;
                if (label) {
                    ՐՏitr34 = ՐՏ_Iterable(range(stack.length - 1, -1, -1));
                    for (ՐՏidx34 = 0; ՐՏidx34 < ՐՏitr34.length; ՐՏidx34++) {
                        i = ՐՏitr34[ՐՏidx34];
                        x = stack[i];
                        if (x instanceof LabeledStatement && x.label.name === label.name) {
                            return x.body;
                        }
                    }
                } else {
                    ՐՏitr35 = ՐՏ_Iterable(range(stack.length - 1, -1, -1));
                    for (ՐՏidx35 = 0; ՐՏidx35 < ՐՏitr35.length; ՐՏidx35++) {
                        i = ՐՏitr35[ՐՏidx35];
                        x = stack[i];
                        if (x instanceof Switch || x instanceof ForIn || x instanceof DWLoop) {
                            return x;
                        }
                    }
                }
            }
        }
    }), ՐՏ_114);
    ՐՏ_modules["ast"]["memoized"] = memoized;

    ՐՏ_modules["ast"]["AST"] = AST;

    ՐՏ_modules["ast"]["Token"] = Token;

    ՐՏ_modules["ast"]["Node"] = Node;

    ՐՏ_modules["ast"]["Statement"] = Statement;

    ՐՏ_modules["ast"]["Debugger"] = Debugger;

    ՐՏ_modules["ast"]["Directive"] = Directive;

    ՐՏ_modules["ast"]["SimpleStatement"] = SimpleStatement;

    ՐՏ_modules["ast"]["walk_body"] = walk_body;

    ՐՏ_modules["ast"]["Block"] = Block;

    ՐՏ_modules["ast"]["BlockStatement"] = BlockStatement;

    ՐՏ_modules["ast"]["EmptyStatement"] = EmptyStatement;

    ՐՏ_modules["ast"]["StatementWithBody"] = StatementWithBody;

    ՐՏ_modules["ast"]["LabeledStatement"] = LabeledStatement;

    ՐՏ_modules["ast"]["DWLoop"] = DWLoop;

    ՐՏ_modules["ast"]["Do"] = Do;

    ՐՏ_modules["ast"]["While"] = While;

    ՐՏ_modules["ast"]["ForIn"] = ForIn;

    ՐՏ_modules["ast"]["ForJS"] = ForJS;

    ՐՏ_modules["ast"]["ListComprehension"] = ListComprehension;

    ՐՏ_modules["ast"]["DictComprehension"] = DictComprehension;

    ՐՏ_modules["ast"]["With"] = With;

    ՐՏ_modules["ast"]["Scope"] = Scope;

    ՐՏ_modules["ast"]["TopLevel"] = TopLevel;

    ՐՏ_modules["ast"]["Splat"] = Splat;

    ՐՏ_modules["ast"]["Import"] = Import;

    ՐՏ_modules["ast"]["Imports"] = Imports;

    ՐՏ_modules["ast"]["Decorator"] = Decorator;

    ՐՏ_modules["ast"]["Annotation"] = Annotation;

    ՐՏ_modules["ast"]["Lambda"] = Lambda;

    ՐՏ_modules["ast"]["Accessor"] = Accessor;

    ՐՏ_modules["ast"]["Function"] = Function;

    ՐՏ_modules["ast"]["Class"] = Class;

    ՐՏ_modules["ast"]["Module"] = Module;

    ՐՏ_modules["ast"]["Method"] = Method;

    ՐՏ_modules["ast"]["Constructor"] = Constructor;

    ՐՏ_modules["ast"]["Jump"] = Jump;

    ՐՏ_modules["ast"]["Exit"] = Exit;

    ՐՏ_modules["ast"]["Return"] = Return;

    ՐՏ_modules["ast"]["Yield"] = Yield;

    ՐՏ_modules["ast"]["Throw"] = Throw;

    ՐՏ_modules["ast"]["LoopControl"] = LoopControl;

    ՐՏ_modules["ast"]["Break"] = Break;

    ՐՏ_modules["ast"]["Continue"] = Continue;

    ՐՏ_modules["ast"]["If"] = If;

    ՐՏ_modules["ast"]["Switch"] = Switch;

    ՐՏ_modules["ast"]["SwitchBranch"] = SwitchBranch;

    ՐՏ_modules["ast"]["Default"] = Default;

    ՐՏ_modules["ast"]["Case"] = Case;

    ՐՏ_modules["ast"]["Try"] = Try;

    ՐՏ_modules["ast"]["Catch"] = Catch;

    ՐՏ_modules["ast"]["Except"] = Except;

    ՐՏ_modules["ast"]["Finally"] = Finally;

    ՐՏ_modules["ast"]["Definitions"] = Definitions;

    ՐՏ_modules["ast"]["Var"] = Var;

    ՐՏ_modules["ast"]["Const"] = Const;

    ՐՏ_modules["ast"]["VarDef"] = VarDef;

    ՐՏ_modules["ast"]["BaseCall"] = BaseCall;

    ՐՏ_modules["ast"]["Call"] = Call;

    ՐՏ_modules["ast"]["ClassCall"] = ClassCall;

    ՐՏ_modules["ast"]["New"] = New;

    ՐՏ_modules["ast"]["Seq"] = Seq;

    ՐՏ_modules["ast"]["PropAccess"] = PropAccess;

    ՐՏ_modules["ast"]["Dot"] = Dot;

    ՐՏ_modules["ast"]["Sub"] = Sub;

    ՐՏ_modules["ast"]["Slice"] = Slice;

    ՐՏ_modules["ast"]["Unary"] = Unary;

    ՐՏ_modules["ast"]["UnaryPrefix"] = UnaryPrefix;

    ՐՏ_modules["ast"]["UnaryPostfix"] = UnaryPostfix;

    ՐՏ_modules["ast"]["Binary"] = Binary;

    ՐՏ_modules["ast"]["Range"] = Range;

    ՐՏ_modules["ast"]["DeepEquality"] = DeepEquality;

    ՐՏ_modules["ast"]["Conditional"] = Conditional;

    ՐՏ_modules["ast"]["Assign"] = Assign;

    ՐՏ_modules["ast"]["Array"] = Array;

    ՐՏ_modules["ast"]["TupleUnpack"] = TupleUnpack;

    ՐՏ_modules["ast"]["ObjectLiteral"] = ObjectLiteral;

    ՐՏ_modules["ast"]["ObjectProperty"] = ObjectProperty;

    ՐՏ_modules["ast"]["ObjectKeyVal"] = ObjectKeyVal;

    ՐՏ_modules["ast"]["ObjectSetter"] = ObjectSetter;

    ՐՏ_modules["ast"]["ObjectGetter"] = ObjectGetter;

    ՐՏ_modules["ast"]["Symbol"] = Symbol;

    ՐՏ_modules["ast"]["SymbolAlias"] = SymbolAlias;

    ՐՏ_modules["ast"]["SymbolAccessor"] = SymbolAccessor;

    ՐՏ_modules["ast"]["SymbolDeclaration"] = SymbolDeclaration;

    ՐՏ_modules["ast"]["SymbolVar"] = SymbolVar;

    ՐՏ_modules["ast"]["SymbolNonlocal"] = SymbolNonlocal;

    ՐՏ_modules["ast"]["ImportedVar"] = ImportedVar;

    ՐՏ_modules["ast"]["SymbolConst"] = SymbolConst;

    ՐՏ_modules["ast"]["SymbolFunarg"] = SymbolFunarg;

    ՐՏ_modules["ast"]["SymbolDefun"] = SymbolDefun;

    ՐՏ_modules["ast"]["SymbolLambda"] = SymbolLambda;

    ՐՏ_modules["ast"]["SymbolCatch"] = SymbolCatch;

    ՐՏ_modules["ast"]["Label"] = Label;

    ՐՏ_modules["ast"]["SymbolRef"] = SymbolRef;

    ՐՏ_modules["ast"]["SymbolClassRef"] = SymbolClassRef;

    ՐՏ_modules["ast"]["LabelRef"] = LabelRef;

    ՐՏ_modules["ast"]["This"] = This;

    ՐՏ_modules["ast"]["Constant"] = Constant;

    ՐՏ_modules["ast"]["String"] = String;

    ՐՏ_modules["ast"]["Verbatim"] = Verbatim;

    ՐՏ_modules["ast"]["Number"] = Number;

    ՐՏ_modules["ast"]["Identifier"] = Identifier;

    ՐՏ_modules["ast"]["RegExp"] = RegExp;

    ՐՏ_modules["ast"]["Atom"] = Atom;

    ՐՏ_modules["ast"]["Null"] = Null;

    ՐՏ_modules["ast"]["NotANumber"] = NotANumber;

    ՐՏ_modules["ast"]["Undefined"] = Undefined;

    ՐՏ_modules["ast"]["Hole"] = Hole;

    ՐՏ_modules["ast"]["Infinity"] = Infinity;

    ՐՏ_modules["ast"]["Boolean"] = Boolean;

    ՐՏ_modules["ast"]["TreeWalker"] = TreeWalker;
})();

(function(){
    var __name__ = "tokenizer";
    var ES6_KEYWORDS, KEYWORDS, JS_KEYWORDS, KEYWORDS_ATOM, RESERVED_WORDS, KEYWORDS_BEFORE_EXPRESSION, ALL_KEYWORDS, OPERATOR_CHARS, RE_HEX_NUMBER, RE_OCT_NUMBER, RE_DEC_NUMBER, OPERATORS, OP_MAP, WHITESPACE_CHARS, PUNC_BEFORE_EXPRESSION, PUNC_CHARS, REGEXP_MODIFIERS, UNICODE, IDENTIFIER_PAT, STRING_MODIFIERS, UNARY_POSTFIX, PRECEDENCE, EX_EOF;
    var makePredicate = ՐՏ_modules["utils"].makePredicate;
    var ParseError = ՐՏ_modules["utils"].ParseError;
    
    var ast = ՐՏ_modules["ast"];
    
    function characters(str_) {
        return str_.split("");
    }
    ES6_KEYWORDS = "async await yield";
    KEYWORDS = "as break case class const continue debugger default def del do elif else except " + "finally for from if import in is new nonlocal pass raise return switch til to " + "try void while with or and not " + ES6_KEYWORDS;
    JS_KEYWORDS = "var function instanceof typeof catch delete throw".split(" ");
    KEYWORDS_ATOM = "False None True";
    RESERVED_WORDS = "abstract boolean byte char double enum export extends final float goto " + "implements int interface long native package private protected public short static " + "synchronized this throws transient volatile " + KEYWORDS_ATOM + " " + KEYWORDS;
    KEYWORDS_BEFORE_EXPRESSION = "return new del raise elif else if";
    ALL_KEYWORDS = RESERVED_WORDS + " " + KEYWORDS_BEFORE_EXPRESSION;
    KEYWORDS = makePredicate(KEYWORDS);
    ES6_KEYWORDS = makePredicate(ES6_KEYWORDS);
    RESERVED_WORDS = makePredicate(RESERVED_WORDS);
    KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION);
    KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM);
    OPERATOR_CHARS = makePredicate(characters("+-*&%=<>!?|~^@"));
    RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
    RE_OCT_NUMBER = /^0[0-7]+$/;
    RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;
    OPERATORS = makePredicate([ "in", "instanceof", "typeof", "new", "void", "del", "++", "--", "+", "-", "not", "~", "&", "|", "^", "**", "*", "/", "//", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "is", "!=", "!==", "?", "=", "+=", "-=", "/=", "//=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "and", "or", "til", "to", "@", "->" ]);
    OP_MAP = {
        "or": "||",
        "and": "&&",
        "not": "!",
        "del": "delete",
        "None": "null",
        "is": "==="
    };
    WHITESPACE_CHARS = makePredicate(characters("  \n\r\t\f​᠎             　"));
    PUNC_BEFORE_EXPRESSION = makePredicate(characters("[{(,.;:"));
    PUNC_CHARS = makePredicate(characters("[]{}(),;:"));
    REGEXP_MODIFIERS = makePredicate(characters("gmsiy"));
    UNICODE = {
        letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
        non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
        space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
        connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
    };
    IDENTIFIER_PAT = /^[a-z_$][_a-z0-9$]*$/i;
    STRING_MODIFIERS = "urfURF";
    UNARY_POSTFIX = makePredicate([ "--", "++" ]);
    PRECEDENCE = function(a, ret) {
        var i, b, j;
        for (i = 0; i < a.length; i++) {
            b = a[i];
            for (j = 0; j < b.length; j++) {
                ret[b[j]] = i + 1;
            }
        }
        return ret;
    }([ [ "||" ], [ "&&" ], [ "|" ], [ "^" ], [ "&" ], [ "==", "===", "!=", "!==" ], [ "<", ">", "<=", ">=", "in", "instanceof" ], [ ">>", "<<", ">>>" ], [ "+", "-" ], [ "*", "/", "//", "%" ], [ "**" ] ], {});
    function is_letter(code) {
        return code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 170 && UNICODE.letter.test(String.fromCharCode(code));
    }
    function is_digit(code) {
        return code >= 48 && code <= 57;
    }
    function is_alphanumeric_char(code) {
        return is_digit(code) || is_letter(code);
    }
    function is_unicode_combining_mark(ch) {
        return UNICODE.non_spacing_mark.test(ch) || UNICODE.space_combining_mark.test(ch);
    }
    function is_unicode_connector_punctuation(ch) {
        return UNICODE.connector_punctuation.test(ch);
    }
    function is_string_modifier(val) {
        var ՐՏitr36, ՐՏidx36;
        var ch;
        ՐՏitr36 = ՐՏ_Iterable(val);
        for (ՐՏidx36 = 0; ՐՏidx36 < ՐՏitr36.length; ՐՏidx36++) {
            ch = ՐՏitr36[ՐՏidx36];
            if (ՐՏ_in(ch, STRING_MODIFIERS)) {
                return true;
            }
        }
        return false;
    }
    function is_identifier(name) {
        return !RESERVED_WORDS(name) && IDENTIFIER_PAT.test(name);
    }
    function is_identifier_start(code) {
        return code === 36 || code === 95 || is_letter(code);
    }
    function is_identifier_char(ch) {
        var code;
        code = ch.charCodeAt(0);
        return is_identifier_start(code) || is_digit(code) || code === 8204 || code === 8205 || is_unicode_combining_mark(ch) || is_unicode_connector_punctuation(ch);
    }
    function parse_js_number(num) {
        if (RE_HEX_NUMBER.test(num)) {
            return parseInt(num.substr(2), 16);
        } else if (RE_OCT_NUMBER.test(num)) {
            return parseInt(num.substr(1), 8);
        } else if (RE_DEC_NUMBER.test(num)) {
            return parseFloat(num);
        }
    }
    function is_token(token, type, val) {
        return token.type === type && (val === null || val === void 0 || token.value === val);
    }
    function js_error(message, filename, line, col, pos, is_eof) {
        ast.Node.warn("ERROR: {message} [{file}:{line},{col}]", {
            message: message,
            file: filename,
            line: line,
            col: col
        });
        throw new ParseError(message, line, col, pos, is_eof);
    }
    EX_EOF = {};
    function tokenizer($TEXT, filename) {
        var ՐՏ_115, ՐՏ_116, ՐՏ_117;
        var S;
        S = {
            text: $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ""),
            filename: filename,
            pos: 0,
            tokpos: 0,
            line: 1,
            tokline: 0,
            col: 0,
            tokcol: 0,
            newline_before: false,
            regex_allowed: false,
            comments_before: [],
            whitespace_before: [],
            newblock: false,
            endblock: false,
            indentation_matters: [ true ],
            cached_whitespace: "",
            prev: void 0,
            index_or_slice: [ false ],
            expect_object_literal_key: false
        };
        function peek() {
            return S.text.charAt(S.pos);
        }
        function prevChar() {
            return S.text.charAt(S.tokpos - 1);
        }
        function next(signal_eof, in_string) {
            var ch;
            ch = S.text.charAt(S.pos);
            ++S.pos;
            if (signal_eof && !ch) {
                throw EX_EOF;
            }
            if (ch === "\n") {
                S.newline_before = S.newline_before || !in_string;
                ++S.line;
                S.col = 0;
            } else {
                ++S.col;
            }
            return ch;
        }
        function find(what, signal_eof) {
            var pos;
            pos = S.text.indexOf(what, S.pos);
            if (signal_eof && pos === -1) {
                throw EX_EOF;
            }
            return pos;
        }
        function start_token() {
            S.tokline = S.line;
            S.tokcol = S.col;
            S.tokpos = S.pos;
        }
        function token(full_type, value, is_comment, keep_newline) {
            var type, subtype, ret, i;
            full_type = full_type.split(":");
            type = full_type[0];
            subtype = full_type[1];
            S.regex_allowed = type === "operator" && !UNARY_POSTFIX[value] || type === "keyword" && KEYWORDS_BEFORE_EXPRESSION(value) || type === "punc" && PUNC_BEFORE_EXPRESSION(value);
            if (type === "operator" && value === "is" && S.text.substr(S.pos).trimLeft().substr(0, 4).trimRight() === "not") {
                next_token();
                value = "!==";
            }
            if (type === "operator" && OP_MAP[value]) {
                value = OP_MAP[value];
            }
            ret = {
                type: type,
                subtype: subtype,
                value: value,
                line: S.tokline,
                col: S.tokcol,
                pos: S.tokpos,
                endpos: S.pos,
                newline_before: S.newline_before,
                file: filename
            };
            if (!is_comment) {
                ret.comments_before = S.comments_before;
                S.comments_before = [];
                for (i = 0; i < len(ret.comments_before); i++) {
                    ret.newline_before = ret.newline_before || ret.comments_before[i].newline_before;
                }
            }
            if (!keep_newline) {
                S.newline_before = false;
            }
            if (type === "punc") {
                if (value === ":" && !S.index_or_slice[S.index_or_slice.length-1] && !S.expect_object_literal_key && (!S.text.substring(S.pos + 1, find("\n")).trim() || !S.text.substring(S.pos + 1, find("#")).trim())) {
                    S.newblock = true;
                    S.indentation_matters.push(true);
                }
                if (value === "[") {
                    if (S.prev && S.prev.type === "name") {
                        S.index_or_slice.push(true);
                    } else {
                        S.index_or_slice.push(false);
                    }
                    S.indentation_matters.push(false);
                } else if (value === "{" || value === "(") {
                    S.indentation_matters.push(false);
                } else if (value === "]") {
                    S.index_or_slice.pop();
                    S.indentation_matters.pop();
                } else if (value === "}" || value === ")") {
                    S.indentation_matters.pop();
                }
            }
            S.prev = new ast.Token(ret);
            return S.prev;
        }
        function parse_whitespace() {
            var leading_whitespace, whitespace_exists, ch;
            leading_whitespace = "";
            whitespace_exists = false;
            while (WHITESPACE_CHARS(peek())) {
                whitespace_exists = true;
                ch = next();
                if (ch === "\n") {
                    leading_whitespace = "";
                } else {
                    leading_whitespace += ch;
                }
            }
            if (peek() !== "#") {
                if (!whitespace_exists) {
                    leading_whitespace = S.cached_whitespace;
                } else {
                    S.cached_whitespace = leading_whitespace;
                }
                if (S.newline_before || S.endblock) {
                    return test_indent_token(leading_whitespace);
                }
            }
        }
        function test_indent_token(leading_whitespace) {
            var most_recent;
            most_recent = S.whitespace_before[S.whitespace_before.length - 1] || "";
            S.endblock = false;
            if (S.indentation_matters[S.indentation_matters.length-1] && leading_whitespace !== most_recent) {
                if (S.newblock && leading_whitespace && leading_whitespace.indexOf(most_recent) === 0) {
                    S.newblock = false;
                    S.whitespace_before.push(leading_whitespace);
                    return 1;
                } else if (most_recent && most_recent.indexOf(leading_whitespace) === 0) {
                    S.endblock = true;
                    S.whitespace_before.pop();
                    return -1;
                } else {
                    TokenizerError("Inconsistent indentation");
                }
            } else {
                return 0;
            }
        }
        function read_while(pred) {
            var ret, i, ch;
            ret = "";
            i = 0;
            while ((ch = peek()) && pred(ch, i)) {
                ++i;
                ret += next();
            }
            return ret;
        }
        function TokenizerError(err, is_eof) {
            js_error(err, filename, S.tokline, S.tokcol, S.tokpos, is_eof);
        }
        function read_num(prefix) {
            var has_e, after_e, has_x, has_dot, num, valid;
            has_e = false;
            after_e = false;
            has_x = false;
            has_dot = prefix === ".";
            num = read_while(function(ch, i) {
                var code, tmp_, has_x, has_e, has_dot;
                code = ch.charCodeAt(0);
                tmp_ = code;
                if (tmp_ === 120 || tmp_ === 88) {
                    return has_x ? false : has_x = true;
                } else if (tmp_ === 101 || tmp_ === 69) {
                    return has_x ? true : has_e ? false : has_e = after_e = true;
                } else if (tmp_ === 45) {
                    return after_e || i === 0 && !prefix;
                } else if (tmp_ === 43) {
                    return after_e;
                } else if (tmp_ === 46) {
                    after_e = false;
                    return !has_dot && !has_x && !has_e ? has_dot = true : false;
                }
                return is_alphanumeric_char(code);
            });
            if (prefix) {
                num = prefix + num;
            }
            valid = parse_js_number(num);
            if (!isNaN(valid)) {
                return token("num", valid);
            } else {
                TokenizerError("Invalid syntax: " + num);
            }
        }
        function read_escaped_char(in_string, digester) {
            var ch, tmp_;
            digester = digester || function(in_str) {
                return next(true, in_str);
            };
            ch = digester(in_string);
            tmp_ = ch.charCodeAt(0);
            if (tmp_ === 110) {
                return "\n";
            } else if (tmp_ === 114) {
                return "\r";
            } else if (tmp_ === 116) {
                return "\t";
            } else if (tmp_ === 98) {
                return "\b";
            } else if (tmp_ === 118) {
                return "";
            } else if (tmp_ === 102) {
                return "\f";
            } else if (tmp_ === 48) {
                return "\0";
            } else if (tmp_ === 120) {
                return String.fromCharCode(hex_bytes(2, digester));
            } else if (tmp_ === 117) {
                return String.fromCharCode(hex_bytes(4, digester));
            } else if (tmp_ === 10) {
                return "";
            } else {
                return ch;
            }
        }
        function hex_bytes(n, digester) {
            var num, i, digit;
            num = 0;
            for (i = 0; i < n; i++) {
                digit = parseInt(digester(), 16);
                if (isNaN(digit)) {
                    TokenizerError("Invalid hex-character pattern in string");
                }
                num = num << 4 | digit;
            }
            return num;
        }
        
        var read_string = (ՐՏ_115 = function read_string(modifier) {
            var token_type, quote, ret, i, tmp, find_newlines, ch;
            token_type = "string";
            if (modifier) {
                token_type += ":" + modifier;
            }
            quote = next();
            ret = "";
            if (peek() === quote) {
                next(true);
                if (peek() === quote) {
                    next(true);
                    i = find(quote + quote + quote, true);
                    if (i !== -1) {
                        tmp = S.text.substring(S.pos, i);
                        S.pos = i + 3;
                        while (tmp.length) {
                            if (tmp[0] === "\\") {
                                tmp = tmp.slice(1);
                                ret += read_escaped_char(true, function() {
                                    var ch;
                                    ch = tmp[0];
                                    tmp = tmp.slice(1);
                                    return ch;
                                });
                            } else {
                                ret += tmp[0];
                                tmp = tmp.slice(1);
                            }
                        }
                        find_newlines = ret.match(/\n/g);
                        if (find_newlines) {
                            S.line += find_newlines.length;
                        }
                        return token(token_type, ret);
                    }
                } else {
                    return token(token_type, "");
                }
            }
            while (true) {
                ch = next(true);
                if (ch === "\n") {
                    TokenizerError("End of line while scanning string literal.");
                }
                if (ch === "\\") {
                    if (peek() === "\n") {
                        next(true);
                        continue;
                    } else {
                        ch = read_escaped_char(true);
                    }
                } else if (ch === quote) {
                    break;
                }
                ret += ch;
            }
            return token(token_type, ret);
        }, ՐՏ_115 = with_eof_error("Unterminated string constant")(ՐՏ_115), ՐՏ_115);
        function read_line_comment(shebang) {
            shebang = shebang === void 0 ? false : shebang;
            var i, ret;
            if (!shebang) {
                next();
            }
            i = find("\n");
            if (i === -1) {
                ret = S.text.substr(S.pos);
                S.pos = S.text.length;
            } else {
                ret = S.text.substring(S.pos, i);
                S.pos = i;
            }
            return token(shebang ? "shebang" : "comment:line", ret, true);
        }
        
        var read_multiline_comment = (ՐՏ_116 = function read_multiline_comment() {
            var i, text, a, n;
            next();
            i = find("*/", true);
            text = S.text.substring(S.pos, i);
            a = text.split("\n");
            n = a.length;
            S.pos = i + 2;
            S.line += n - 1;
            if (n > 1) {
                S.col = a[n - 1].length;
            } else {
                S.col += a[n - 1].length;
            }
            S.col += 2;
            S.newline_before = S.newline_before || ՐՏ_in("\n", text);
            return token("comment:multiline", text, true);
        }, ՐՏ_116 = with_eof_error("Unterminated multiline comment")(ՐՏ_116), ՐՏ_116);
        function read_name() {
            var backslash, name, escaped, ch, hex;
            backslash = false;
            name = "";
            escaped = false;
            while ((ch = peek()) !== null) {
                if (!backslash) {
                    if (ch === "\\") {
                        if (S.text.charAt(S.pos + 1) === "\n") {
                            S.pos += 2;
                            continue;
                        } else {
                            escaped = backslash = true;
                            next();
                        }
                    } else if (is_identifier_char(ch)) {
                        name += next();
                    } else {
                        break;
                    }
                } else {
                    if (ch !== "u") {
                        TokenizerError("Expecting UnicodeEscapeSequence -- uXXXX");
                    }
                    ch = read_escaped_char();
                    if (!is_identifier_char(ch)) {
                        TokenizerError("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                    }
                    name += ch;
                    backslash = false;
                }
            }
            if (KEYWORDS(name) && escaped) {
                hex = name.charCodeAt(0).toString(16).toUpperCase();
                name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
            }
            return name;
        }
        
        var read_regexp = (ՐՏ_117 = function read_regexp(regexp) {
            var prev_backslash, in_class, verbose_regexp, in_comment, mods, ch;
            prev_backslash = false;
            in_class = false;
            verbose_regexp = false;
            in_comment = false;
            if (peek() === "/") {
                next(true);
                if (peek() === "/") {
                    verbose_regexp = true;
                    next(true);
                } else {
                    mods = read_name();
                    return token("regexp", new RegExp(regexp, mods));
                }
            }
            while (ch = next(true)) {
                if (in_comment) {
                    if (ch === "\n") {
                        in_comment = false;
                    }
                    continue;
                }
                if (prev_backslash) {
                    regexp += "\\" + ch;
                    prev_backslash = false;
                } else if (ch === "[") {
                    in_class = true;
                    regexp += ch;
                } else if (ch === "]" && in_class) {
                    in_class = false;
                    regexp += ch;
                } else if (ch === "/" && !in_class) {
                    if (verbose_regexp) {
                        if (peek() !== "/") {
                            regexp += "\\/";
                            continue;
                        }
                        next(true);
                        if (peek() !== "/") {
                            regexp += "\\/\\/";
                            continue;
                        }
                        next(true);
                    }
                    break;
                } else if (ch === "\\") {
                    prev_backslash = true;
                } else if (verbose_regexp && !in_class && ՐՏ_in(ch, " \n\r\t")) {
                } else if (verbose_regexp && !in_class && ch === "#") {
                    in_comment = true;
                } else {
                    regexp += ch;
                }
            }
            mods = read_name();
            return token("regexp", new RegExp(regexp, mods));
        }, ՐՏ_117 = with_eof_error("Unterminated regular expression")(ՐՏ_117), ՐՏ_117);
        function read_operator(prefix) {
            var op;
            function grow(op) {
                var bigger;
                if (!peek()) {
                    return op;
                }
                bigger = op + peek();
                if (OPERATORS(bigger)) {
                    next();
                    return grow(bigger);
                } else {
                    return op;
                }
            }
            op = grow(prefix || next());
            if (ՐՏ_in(op, [ "++", "--", "===", "!==" ])) {
                TokenizerError("Invalid operator «" + op + "»");
            } else if (op === "->") {
                return token("punc", op);
            }
            return token("operator", op);
        }
        function handle_slash() {
            next();
            return S.regex_allowed ? read_regexp("") : read_operator("/");
        }
        function handle_dot() {
            next();
            return is_digit(peek().charCodeAt(0)) ? read_num(".") : token("punc", ".");
        }
        function read_word() {
            var word;
            word = read_name();
            return KEYWORDS_ATOM(word) ? token("atom", word) : !KEYWORDS(word) ? token("name", word) : OPERATORS(word) && prevChar() !== "." ? token("operator", word) : token("keyword", word);
        }
        function with_eof_error(eof_error) {
            return function(cont) {
                return function(x) {
                    try {
                        return cont(x);
                    } catch (ՐՏ_Exception) {
                        var ex = ՐՏ_Exception;
                        if (ex === EX_EOF) {
                            TokenizerError(eof_error, true);
                        } else {
                            throw ՐՏ_Exception;
                        }
                    }
                };
            };
        }
        function next_token(force_regexp) {
            var indent, ch, code, tmp_, regex_allowed, tok, mods, string_tok;
            if (!(ՐՏ_in(force_regexp, [null, void 0]))) {
                return read_regexp(force_regexp);
            }
            indent = parse_whitespace();
            if (indent === -1) {
                return token("punc", "}", false, true);
            }
            start_token();
            ch = peek();
            if (!ch) {
                return token("eof");
            }
            code = ch.charCodeAt(0);
            tmp_ = code;
            if (tmp_ === 34 || tmp_ === 39) {
                return read_string();
            } else if (tmp_ === 35) {
                if (S.pos === 0 && S.text.charAt(1) === "!") {
                    return read_line_comment(true);
                }
                regex_allowed = S.regex_allowed;
                S.comments_before.push(read_line_comment());
                S.regex_allowed = regex_allowed;
                return next_token();
            } else if (tmp_ === 46) {
                return handle_dot();
            } else if (tmp_ === 47) {
                return handle_slash();
            }
            if (is_digit(code)) {
                return read_num();
            }
            if (PUNC_CHARS(ch)) {
                return token("punc", next());
            }
            if (OPERATOR_CHARS(ch)) {
                return read_operator();
            }
            if (code === 92 && S.text.charAt(S.pos + 1) === "\n") {
                next();
                next();
                S.newline_before = false;
                return next_token();
            }
            if (code === 92 || is_identifier_start(code)) {
                tok = read_word();
                if (ՐՏ_in(peek(), "'\"") && is_string_modifier(tok.value)) {
                    mods = tok.value.toLowerCase();
                    string_tok = read_string(mods);
                    tok.endpos = string_tok.endpos;
                    tok.value = string_tok.value;
                    tok.subtype = string_tok.subtype;
                    tok.type = string_tok.type;
                }
                return tok;
            }
            TokenizerError("Unexpected character «" + ch + "»");
        }
        next_token.context = function(nc) {
            if (nc) {
                S = nc;
            }
            return S;
        };
        return next_token;
    }
    ՐՏ_modules["tokenizer"]["ES6_KEYWORDS"] = ES6_KEYWORDS;

    ՐՏ_modules["tokenizer"]["KEYWORDS"] = KEYWORDS;

    ՐՏ_modules["tokenizer"]["JS_KEYWORDS"] = JS_KEYWORDS;

    ՐՏ_modules["tokenizer"]["KEYWORDS_ATOM"] = KEYWORDS_ATOM;

    ՐՏ_modules["tokenizer"]["RESERVED_WORDS"] = RESERVED_WORDS;

    ՐՏ_modules["tokenizer"]["KEYWORDS_BEFORE_EXPRESSION"] = KEYWORDS_BEFORE_EXPRESSION;

    ՐՏ_modules["tokenizer"]["ALL_KEYWORDS"] = ALL_KEYWORDS;

    ՐՏ_modules["tokenizer"]["OPERATOR_CHARS"] = OPERATOR_CHARS;

    ՐՏ_modules["tokenizer"]["RE_HEX_NUMBER"] = RE_HEX_NUMBER;

    ՐՏ_modules["tokenizer"]["RE_OCT_NUMBER"] = RE_OCT_NUMBER;

    ՐՏ_modules["tokenizer"]["RE_DEC_NUMBER"] = RE_DEC_NUMBER;

    ՐՏ_modules["tokenizer"]["OPERATORS"] = OPERATORS;

    ՐՏ_modules["tokenizer"]["OP_MAP"] = OP_MAP;

    ՐՏ_modules["tokenizer"]["WHITESPACE_CHARS"] = WHITESPACE_CHARS;

    ՐՏ_modules["tokenizer"]["PUNC_BEFORE_EXPRESSION"] = PUNC_BEFORE_EXPRESSION;

    ՐՏ_modules["tokenizer"]["PUNC_CHARS"] = PUNC_CHARS;

    ՐՏ_modules["tokenizer"]["REGEXP_MODIFIERS"] = REGEXP_MODIFIERS;

    ՐՏ_modules["tokenizer"]["UNICODE"] = UNICODE;

    ՐՏ_modules["tokenizer"]["IDENTIFIER_PAT"] = IDENTIFIER_PAT;

    ՐՏ_modules["tokenizer"]["STRING_MODIFIERS"] = STRING_MODIFIERS;

    ՐՏ_modules["tokenizer"]["UNARY_POSTFIX"] = UNARY_POSTFIX;

    ՐՏ_modules["tokenizer"]["PRECEDENCE"] = PRECEDENCE;

    ՐՏ_modules["tokenizer"]["EX_EOF"] = EX_EOF;

    ՐՏ_modules["tokenizer"]["characters"] = characters;

    ՐՏ_modules["tokenizer"]["is_letter"] = is_letter;

    ՐՏ_modules["tokenizer"]["is_digit"] = is_digit;

    ՐՏ_modules["tokenizer"]["is_alphanumeric_char"] = is_alphanumeric_char;

    ՐՏ_modules["tokenizer"]["is_unicode_combining_mark"] = is_unicode_combining_mark;

    ՐՏ_modules["tokenizer"]["is_unicode_connector_punctuation"] = is_unicode_connector_punctuation;

    ՐՏ_modules["tokenizer"]["is_string_modifier"] = is_string_modifier;

    ՐՏ_modules["tokenizer"]["is_identifier"] = is_identifier;

    ՐՏ_modules["tokenizer"]["is_identifier_start"] = is_identifier_start;

    ՐՏ_modules["tokenizer"]["is_identifier_char"] = is_identifier_char;

    ՐՏ_modules["tokenizer"]["parse_js_number"] = parse_js_number;

    ՐՏ_modules["tokenizer"]["is_token"] = is_token;

    ՐՏ_modules["tokenizer"]["js_error"] = js_error;

    ՐՏ_modules["tokenizer"]["tokenizer"] = tokenizer;
})();

(function(){
    var __name__ = "parser";
    var NATIVE_CLASSES, COMMON_STATIC, CLASS_MAP, key, BASELIB, STDLIB, UNARY_PREFIX, ASSIGNMENT, STATEMENTS_WITH_LABELS, ATOMIC_START_TOKEN;
    var makePredicate = ՐՏ_modules["utils"].makePredicate;
    var defaults = ՐՏ_modules["utils"].defaults;
    var ImportError = ՐՏ_modules["utils"].ImportError;
    var js_error = ՐՏ_modules["utils"].js_error;
    var RAPYD_PREFIX = ՐՏ_modules["utils"].RAPYD_PREFIX;
    
    var ast = ՐՏ_modules["ast"];
    
    var tokenizer = ՐՏ_modules["tokenizer"];
    
    function array_to_hash(a) {
        var ret, i;
        ret = {};
        for (i = 0; i < len(a); i++) {
            ret[a[i]] = true;
        }
        return ret;
    }
    NATIVE_CLASSES = {
        "Image": {},
        "RegExp": {},
        "Error": {},
        "Object": {
            static: [ "assign", "getOwnPropertyNames", "keys", "create", "defineProperty", "defineProperties", "getPrototypeOf", "setPrototypeOf" ]
        },
        "String": {
            static: [ "fromCharCode" ]
        },
        "Array": {
            static: [ "isArray", "from", "of" ]
        },
        "Number": {
            static: [ "isFinite", "isNaN" ]
        },
        "Function": {},
        "Date": {
            static: [ "UTC", "now", "parse" ]
        },
        "Boolean": {},
        "ArrayBuffer": {},
        "DataView": {},
        "Float32Array": {},
        "Float64Array": {},
        "Int16Array": {},
        "Int32Array": {},
        "Int8Array": {},
        "Uint16Array": {},
        "Uint32Array": {},
        "Uint8Array": {},
        "Uint8ClampedArray": {},
        "Map": {},
        "WeakMap": {},
        "Set": {},
        "WeakSet": {},
        "AssertionError": {},
        "IndexError": {},
        "KeyError": {},
        "TypeError": {},
        "ValueError": {}
    };
    COMMON_STATIC = [ "call", "apply", "bind", "toString" ];
    CLASS_MAP = {};
    BASELIB = (function() {
        var ՐՏidx37, ՐՏitr37 = ՐՏ_Iterable([ "abs", "all", "any", "bin", "bind", "rebind_all", "cmp", "chr", "dir", "enumerate", "eslice", "extends", "filter", "hex", "in", "iterable", "len", "map", "max", "min", "merge", "mixin", "print", "range", "reduce", "reversed", "sorted", "sum", "type", "zip", "getattr", "setattr", "hasattr", "eq", "kwargs", "AssertionError", "IndexError", "KeyError", "TypeError", "ValueError" ]), ՐՏres = {}, key;
        for (ՐՏidx37 = 0; ՐՏidx37 < ՐՏitr37.length; ՐՏidx37++) {
            key = ՐՏitr37[ՐՏidx37];
            ՐՏres[key] = 0;
        }
        return ՐՏres;
    })();
    STDLIB = [ "abs", "bin", "cmp", "chr", "dir", "hex", "max", "min", "merge", "mixin", "print", "range", "reduce", "getattr", "setattr", "hasattr", "eq", "bind", "rebind_all", "type", "all", "any", "enumerate", "filter", "len", "map", "reversed", "sum", "zip", "AssertionError", "IndexError", "KeyError", "TypeError", "ValueError" ];
    function has_simple_decorator(decorators, name) {
        var remove, s;
        remove = [];
        for (var i = 0; i < decorators.length; i++) {
            s = decorators[i];
            if (s instanceof ast.SymbolRef && !s.parens && s.name === name) {
                remove.push(i);
            }
        }
        if (remove.length) {
            remove.reverse();
            for (var i = 0; i < remove.length; i++) {
                decorators.splice(remove[i], 1);
            }
            return true;
        }
        return false;
    }
    UNARY_PREFIX = makePredicate([ "typeof", "void", "delete", "--", "++", "!", "~", "-", "+", "*", "@" ]);
    ASSIGNMENT = makePredicate([ "=", "+=", "-=", "/=", "//=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=" ]);
    STATEMENTS_WITH_LABELS = array_to_hash([ "for", "do", "while", "switch" ]);
    ATOMIC_START_TOKEN = array_to_hash([ "atom", "num", "string", "regexp", "name" ]);
    function parse($TEXT, options) {
        var ՐՏitr38, ՐՏidx38, ՐՏ_118, ՐՏ_119, ՐՏ_120;
        var module_id, import_dirs, IMPORTED, IMPORTING, S, cname, obj;
        options = defaults(options, {
            strict: false,
            filename: null,
            auto_bind: false,
            module_id: "__main__",
            es6: false,
            toplevel: null,
            import_dirs: [],
            dropDecorators: [],
            dropImports: [],
            dropDocstrings: false,
            classes: null
        });
        module_id = options.module_id;
        import_dirs = options.import_dirs.slice(0);
        if (options.libdir) {
            import_dirs.push(options.libdir);
        }
        if (options.basedir) {
            import_dirs.unshift(options.basedir);
        }
        IMPORTED = options.IMPORTED || {};
        IMPORTING = options.IMPORTING || {};
        IMPORTING[module_id] = true;
        S = {
            input: typeof $TEXT === "string" ? tokenizer.tokenizer($TEXT, options.filename) : $TEXT,
            token: null,
            prev: null,
            peeked: null,
            in_directives: true,
            in_loop: 0,
            in_scope: [ {
                type: null,
                vars: {},
                nonlocal: {},
                functions: {},
                classes: {}
            } ],
            labels: [],
            decorators: [],
            in_seq: false,
            in_decorator: false
        };
        if (options.classes) {
            ՐՏitr38 = ՐՏ_Iterable(options.classes);
            for (ՐՏidx38 = 0; ՐՏidx38 < ՐՏitr38.length; ՐՏidx38++) {
                cname = ՐՏitr38[ՐՏidx38];
                obj = options.classes[cname];
                S.in_scope[0].classes[cname] = {
                    "static": obj.static,
                    "bound": obj.bound
                };
            }
        }
        S.token = next();
        function is_(type, value) {
            return tokenizer.is_token(S.token, type, value);
        }
        function peek() {
            return S.peeked || (S.peeked = S.input());
        }
        function next() {
            S.prev = S.token;
            if (S.peeked) {
                S.token = S.peeked;
                S.peeked = null;
            } else {
                S.token = S.input();
            }
            S.in_directives = S.in_directives && (S.token.type === "string" || is_("punc", ";"));
            return S.token;
        }
        function prev() {
            return S.prev;
        }
        function croak(msg, line, col, pos, is_eof) {
            var ctx;
            ctx = S.input.context();
            tokenizer.js_error(msg, ctx.filename, line !== void 0 ? line : ctx.tokline, col !== void 0 ? col : ctx.tokcol, pos !== void 0 ? pos : ctx.tokpos, is_eof);
        }
        function token_error(token, msg) {
            var is_eof;
            is_eof = token.type === "eof" ? true : false;
            croak(msg, token.line, token.col, void 0, is_eof);
        }
        function unexpected(token) {
            if (token === void 0) {
                token = S.token;
            }
            token_error(token, "Unexpected token: " + token.type + " «" + token.value + "»");
        }
        function expect_token(type, val) {
            if (is_(type, val)) {
                return next();
            }
            token_error(S.token, "Unexpected token " + S.token.type + " «" + S.token.value + "»" + ", expected " + type + " «" + val + "»");
        }
        function expect(punc) {
            return expect_token("punc", punc);
        }
        function can_insert_semicolon() {
            return !options.strict && (S.token.newline_before || is_("eof") || is_("punc", "}"));
        }
        function semicolon() {
            if (is_("punc", ";")) {
                next();
                S.token.newline_before = true;
            }
        }
        function parenthesised() {
            var exp;
            expect("(");
            exp = expression(true);
            expect(")");
            return exp;
        }
        function embed_tokens(parser) {
            return function() {
                var start, expr, end;
                start = S.token;
                expr = parser();
                if (expr === void 0) {
                    unexpected();
                }
                end = prev();
                expr.start = start;
                expr.end = end;
                return expr;
            };
        }
        function is_nested_comparison(stmt) {
            var comparators;
            comparators = {
                "<": true,
                ">": true,
                "<=": true,
                ">=": true,
                "==": true,
                "!=": true,
                "===": true,
                "!==": true
            };
            if (stmt instanceof ast.Binary && ՐՏ_in(stmt.operator, comparators) && stmt.left instanceof ast.Binary && ՐՏ_in(stmt.left.operator, comparators)) {
                return true;
            } else {
                return false;
            }
        }
        function scan_for_top_level_callables(body) {
            var ՐՏitr39, ՐՏidx39;
            var ans, name, obj, x, opt;
            ans = [];
            if (Array.isArray(body)) {
                for (name in body) {
                    obj = body[name];
                    if (obj instanceof ast.Function || obj instanceof ast.Class) {
                        if (obj.name) {
                            ans.push(obj.name);
                        } else {
                            token_error(obj.start, "Top-level functions must have names");
                        }
                    } else {
                        if (obj instanceof ast.Scope) {
                            continue;
                        }
                        ՐՏitr39 = ՐՏ_Iterable([ "body", "alternative" ]);
                        for (ՐՏidx39 = 0; ՐՏidx39 < ՐՏitr39.length; ՐՏidx39++) {
                            x = ՐՏitr39[ՐՏidx39];
                            opt = obj[x];
                            if (opt) {
                                ans = ans.concat(scan_for_top_level_callables(opt));
                            }
                            if (opt instanceof ast.Assign && !(opt.right instanceof ast.Scope)) {
                                ans = ans.concat(scan_for_top_level_callables(opt.right));
                            }
                        }
                    }
                }
            } else if (body.body) {
                ans = ans.concat(scan_for_top_level_callables(body.body));
                if (body.alternative) {
                    ans = ans.concat(scan_for_top_level_callables(body.alternative));
                }
            }
            return ans;
        }
        
        var statement = (ՐՏ_118 = function statement() {
            var tmp_, dir, stat, type, start, func, chain, ctor, result, expectedType, actualType, tmp;
            if (is_("operator", "/") || is_("operator", "/=")) {
                S.peeked = null;
                S.token = S.input(S.token.value.slice(1));
            }
            tmp_ = S.token.type;
            if (tmp_ === "string") {
                dir = S.in_directives;
                stat = simple_statement();
                if (dir && stat.body instanceof ast.String && !is_("punc", ",")) {
                    return new ast.Directive({
                        value: stat.body.value
                    });
                }
                return stat;
            } else if (tmp_ === "shebang") {
                tmp_ = S.token.value;
                next();
                return new ast.Directive({
                    value: tmp_
                });
            } else if (tmp_ === "num" || tmp_ === "regexp" || tmp_ === "operator" || tmp_ === "atom") {
                return simple_statement();
            } else if (tmp_ === "punc") {
                tmp_ = S.token.value;
                if (tmp_ === ":") {
                    return new ast.BlockStatement({
                        start: S.token,
                        body: block_(),
                        end: prev()
                    });
                } else if (tmp_ === "{" || tmp_ === "[" || tmp_ === "(") {
                    return simple_statement();
                } else if (tmp_ === ";") {
                    next();
                    return new ast.EmptyStatement();
                } else {
                    unexpected();
                }
            } else if (tmp_ === "name") {
                if (ՐՏ_in(S.token.value, [ "set", "get" ])) {
                    if (!options.es6) {
                        croak("Class getters/setters require ES6 compilation mode");
                    }
                    type = S.token.value;
                    start = S.token.start;
                    next();
                    return accessor_(type, start, true);
                }
                return tokenizer.is_token(peek(), "punc", ":") ? labeled_statement() : simple_statement();
            } else if (tmp_ === "keyword") {
                tmp_ = S.token.value;
                if (tokenizer.ES6_KEYWORDS(tmp_) && !options.es6) {
                    token_error(prev(), "«" + tmp_ + "» keyword not supported with ES5 output, use --ecmascript6 compilation flag");
                }
                next();
                if (tmp_ === "break") {
                    return break_cont(ast.Break);
                } else if (tmp_ === "continue") {
                    return break_cont(ast.Continue);
                } else if (tmp_ === "debugger") {
                    semicolon();
                    return new ast.Debugger();
                } else if (tmp_ === "do") {
                    return new ast.Do({
                        body: in_loop(statement),
                        condition: function() {
                            var tmp;
                            expect(".");
                            expect_token("keyword", "while");
                            tmp = expression(true);
                            semicolon();
                            return tmp;
                        }.call(this)
                    });
                } else if (tmp_ === "while") {
                    return new ast.While({
                        condition: expression(true),
                        body: in_loop(statement)
                    });
                } else if (tmp_ === "for") {
                    if (is_("name", "JS")) {
                        return for_js();
                    }
                    return for_();
                } else if (tmp_ === "from") {
                    return import_(true);
                } else if (tmp_ === "import") {
                    return import_(false);
                } else if (tmp_ === "class") {
                    ++BASELIB["extends"];
                    if (options.auto_bind) {
                        ++BASELIB["rebind_all"];
                    }
                    return class_();
                } else if (tmp_ === "def") {
                    start = prev();
                    func = function_(S.in_scope[S.in_scope.length-1].type === "class" ? S.in_scope[S.in_scope.length-1].name : false);
                    func.start = start;
                    func.end = prev();
                    chain = subscripts(func, true);
                    if (chain === func) {
                        return func;
                    } else {
                        return new ast.SimpleStatement({
                            start: start,
                            body: chain,
                            end: prev()
                        });
                    }
                } else if (tmp_ === "if") {
                    return if_();
                } else if (tmp_ === "pass") {
                    semicolon();
                    return new ast.EmptyStatement();
                } else if (tmp_ === "return" || tmp_ === "yield") {
                    if (S.in_scope[S.in_scope.length-1].type !== "function") {
                        croak("'return' outside of function");
                    }
                    if (tmp_ === "yield") {
                        S.in_scope[S.in_scope.length-1].generator = true;
                        ctor = ast.Yield;
                    } else {
                        ctor = ast.Return;
                    }
                    result = new ctor({
                        value: is_("punc", ";") ? function() {
                            semicolon();
                            return null;
                        }() : can_insert_semicolon() ? null : function() {
                            var tmp;
                            tmp = expression(true);
                            semicolon();
                            return tmp;
                        }()
                    });
                    if (S.in_scope[S.in_scope.length-1].return_annotation) {
                        expectedType = S.in_scope[S.in_scope.length-1].return_annotation.resolveType(S.in_scope);
                        actualType = result.resolveType(S.in_scope);
                        if (!(ՐՏ_in(actualType, [ expectedType, "?" ]))) {
                            croak("Type annotation states that function returns " + expectedType + ", actual returned type is " + actualType + "");
                        }
                    }
                    return result;
                } else if (tmp_ === "switch") {
                    return new ast.Switch({
                        expression: parenthesised(),
                        body: in_loop(switch_body_)
                    });
                } else if (tmp_ === "raise") {
                    if (S.token.newline_before) {
                        return new ast.Throw({
                            value: new ast.SymbolCatch({
                                name: "ՐՏ_Exception"
                            })
                        });
                    }
                    tmp = expression(true);
                    semicolon();
                    return new ast.Throw({
                        value: tmp
                    });
                } else if (tmp_ === "try") {
                    return try_();
                } else if (tmp_ === "nonlocal") {
                    tmp = nonlocal_();
                    semicolon();
                    return tmp;
                } else if (tmp_ === "const") {
                    tmp = const_();
                    semicolon();
                    return tmp;
                } else if (tmp_ === "with") {
                    return new ast.With({
                        expression: parenthesised(),
                        body: statement()
                    });
                } else {
                    unexpected();
                }
            }
        }, ՐՏ_118 = embed_tokens(ՐՏ_118), ՐՏ_118);
        function labeled_statement() {
            var label, stat;
            label = as_symbol(ast.Label);
            if (find_if(function(l) {
                return l.name === label.name;
            }, S.labels)) {
                croak("Label " + label.name + " defined twice");
            }
            expect(":");
            S.labels.push(label);
            stat = statement();
            S.labels.pop();
            return new ast.LabeledStatement({
                body: stat,
                label: label
            });
        }
        function simple_statement(tmp) {
            tmp = expression(true);
            semicolon();
            return new ast.SimpleStatement({
                body: tmp
            });
        }
        function break_cont(type_) {
            var label;
            label = null;
            if (!can_insert_semicolon()) {
                label = as_symbol(ast.LabelRef, true);
            }
            if (label !== null) {
                if (!find_if(function(l) {
                    return l.name === label.name;
                }, S.labels)) {
                    croak("Undefined label " + label.name);
                }
            } else if (S.in_loop === 0) {
                croak(ՐՏ_type(type_) + " not inside a loop or switch");
            }
            semicolon();
            return new type_({
                label: label
            });
        }
        function seq_to_array(seq) {
            return new ast.Array({
                start: seq.start,
                elements: seq.to_array(),
                end: seq.end
            });
        }
        function for_(list_comp) {
            var init;
            init = null;
            if (!is_("punc", ";")) {
                init = expression(true, true);
                if (init instanceof ast.Seq) {
                    init = seq_to_array(init);
                }
                if (is_("operator", "in")) {
                    if (init instanceof ast.Var && init.definitions.length > 1) {
                        croak("Only one variable declaration allowed in for..in loop");
                    }
                    next();
                    return for_in(init, list_comp);
                }
            }
            unexpected();
        }
        function for_in(init, list_comp) {
            var ՐՏitr40, ՐՏidx40, ՐՏupk1;
            var lhs, obj, i, element, value;
            lhs = init instanceof ast.Var ? init.definitions[0].name : null;
            obj = expression(true);
            if (init instanceof ast.Array) {
                ՐՏitr40 = ՐՏ_Iterable(enumerate(init.elements));
                for (ՐՏidx40 = 0; ՐՏidx40 < ՐՏitr40.length; ՐՏidx40++) {
                    ՐՏupk1 = ՐՏitr40[ՐՏidx40];
                    i = ՐՏupk1[0];
                    element = ՐՏupk1[1];
                    value = null;
                    if (obj instanceof ast.Call && obj.expression instanceof ast.SymbolRef && obj.expression.name === "enumerate") {
                        if (i === 0) {
                            value = "Number";
                        }
                    }
                    mark_local_assignment(element, value);
                }
            } else {
                value = null;
                if (obj instanceof ast.Call && obj.expression instanceof ast.SymbolRef && obj.expression.name === "range") {
                    value = "Number";
                }
                mark_local_assignment(init, value);
            }
            ++BASELIB["iterable"];
            if (list_comp) {
                return {
                    init: init,
                    name: lhs,
                    object: obj
                };
            }
            return new ast.ForIn({
                init: init,
                name: lhs,
                object: obj,
                body: in_loop(statement)
            });
        }
        function for_js() {
            var condition;
            condition = expression(true, true);
            return new ast.ForJS({
                condition: condition,
                body: in_loop(statement)
            });
        }
        function get_class_in_scope(expr) {
            var ՐՏitr41, ՐՏidx41, ՐՏitr42, ՐՏidx42;
            var s, referenced_path, class_name;
            if (expr instanceof ast.SymbolRef) {
                if (ՐՏ_in(expr.name, NATIVE_CLASSES)) {
                    return NATIVE_CLASSES[expr.name];
                }
                ՐՏitr41 = ՐՏ_Iterable(range(S.in_scope.length - 1, -1, -1));
                for (ՐՏidx41 = 0; ՐՏidx41 < ՐՏitr41.length; ՐՏidx41++) {
                    s = ՐՏitr41[ՐՏidx41];
                    if (ՐՏ_in(expr.name, S.in_scope[s].classes)) {
                        return S.in_scope[s].classes[expr.name];
                    }
                }
            } else if (expr instanceof ast.Dot) {
                referenced_path = [];
                while (expr instanceof ast.Dot) {
                    referenced_path.unshift(expr.property);
                    expr = expr.expression;
                }
                if (expr instanceof ast.SymbolRef) {
                    referenced_path.unshift(expr.name);
                    if (len(referenced_path) > 1) {
                        class_name = referenced_path.join(".");
                        ՐՏitr42 = ՐՏ_Iterable(range(S.in_scope.length - 1, -1, -1));
                        for (ՐՏidx42 = 0; ՐՏidx42 < ՐՏitr42.length; ՐՏidx42++) {
                            s = ՐՏitr42[ՐՏidx42];
                            if (ՐՏ_in(class_name, S.in_scope[s].classes)) {
                                return S.in_scope[s].classes[class_name];
                            }
                        }
                    }
                }
            }
            return false;
        }
        function do_import(key) {
            var ՐՏitr44, ՐՏidx44, ՐՏupk3;
            var package_module_id, filename, src_code, modpath, location, data, contents;
            if (ՐՏ_in(key, IMPORTED)) {
                return;
            }
            if (IMPORTING[key]) {
                throw new ImportError("Detected a recursive import of: " + key + " while importing: " + module_id);
            }
            package_module_id = key.split(".").slice(0, -1).join(".");
            if (len(package_module_id) > 0) {
                do_import(package_module_id);
            }
            function safe_read(base_path) {
                var ՐՏitr43, ՐՏidx43, ՐՏupk2;
                var i, path;
                ՐՏitr43 = ՐՏ_Iterable(enumerate([ base_path + ".pyj", base_path + "/__init__.pyj" ]));
                for (ՐՏidx43 = 0; ՐՏidx43 < ՐՏitr43.length; ՐՏidx43++) {
                    ՐՏupk2 = ՐՏitr43[ՐՏidx43];
                    i = ՐՏupk2[0];
                    path = ՐՏupk2[1];
                    try {
                        return [ options.readfile(path, "utf-8"), path ];
                    } catch (ՐՏ_Exception) {
                        var e = ՐՏ_Exception;
                        if (e.code === "ENOENT" || e.code === "EPERM" || e.code === "EACCESS") {
                            if (i === 1) {
                                return [null, null];
                            }
                        }
                        if (i === 1) {
                            throw ՐՏ_Exception;
                        }
                    }
                }
            }
            src_code = filename = null;
            modpath = key.replace(/\./g, "/");
            ՐՏitr44 = ՐՏ_Iterable(import_dirs);
            for (ՐՏidx44 = 0; ՐՏidx44 < ՐՏitr44.length; ՐՏidx44++) {
                location = ՐՏitr44[ՐՏidx44];
                if (location) {
                    ՐՏupk3 = safe_read(location + "/" + modpath);
                    data = ՐՏupk3[0];
                    filename = ՐՏupk3[1];
                    if (data !== null) {
                        src_code = data;
                        break;
                    }
                }
            }
            if (src_code === null) {
                throw "Failed Import: '" + key + "' module doesn't exist in any of the import directories: " + import_dirs.join(", ");
            }
            contents = parse(src_code, {
                filename: filename,
                toplevel: null,
                readfile: options.readfile || require("fs").readFileSync,
                basedir: options.basedir,
                libdir: options.libdir,
                module_id: key,
                IMPORTED: IMPORTED,
                IMPORTING: IMPORTING,
                auto_bind: options.auto_bind,
                es6: options.es6,
                import_dirs: options.import_dirs,
                dropDecorators: options.dropDecorators,
                dropImports: options.dropImports,
                dropDocstrings: options.dropDocstrings
            });
            if (len(package_module_id) > 0) {
                IMPORTED[package_module_id].submodules.push(key);
            }
        }
        function import_(from_import) {
            var ՐՏitr45, ՐՏidx45, ՐՏitr46, ՐՏidx46;
            var ans, name, tmp, key, alias, imp, classes, argnames, aname, argvar, obj, i;
            ans = new ast.Imports({
                "imports": []
            });
            while (true) {
                tmp = name = expression(false);
                key = "";
                while (tmp instanceof ast.Dot) {
                    key = "." + tmp.property + key;
                    tmp = tmp.expression;
                }
                key = tmp.name + key;
                if (!keepDecoratorOrImport(key, true)) {
                    return new ast.EmptyStatement({
                        start: prev(),
                        end: prev()
                    });
                }
                alias = null;
                if (!from_import && is_("keyword", "as")) {
                    next();
                    alias = as_symbol(ast.SymbolAlias);
                }
                imp = new ast.Import({
                    "module": name,
                    "key": key,
                    "alias": alias,
                    "argnames": null,
                    "body": function() {
                        return IMPORTED[key];
                    }
                });
                ans.imports.push(imp);
                if (from_import) {
                    break;
                }
                if (is_("punc", ",")) {
                    next();
                } else {
                    break;
                }
            }
            ՐՏitr45 = ՐՏ_Iterable(ans["imports"]);
            for (ՐՏidx45 = 0; ՐՏidx45 < ՐՏitr45.length; ՐՏidx45++) {
                imp = ՐՏitr45[ՐՏidx45];
                do_import(imp.key);
                classes = IMPORTED[key].classes;
                if (from_import) {
                    expect_token("keyword", "import");
                    imp.argnames = argnames = [];
                    while (true) {
                        aname = as_symbol(ast.ImportedVar);
                        if (is_("keyword", "as")) {
                            next();
                            aname.alias = as_symbol(ast.SymbolAlias);
                        }
                        argnames.push(aname);
                        if (is_("punc", ",")) {
                            next();
                        } else {
                            break;
                        }
                    }
                    ՐՏitr46 = ՐՏ_Iterable(argnames);
                    for (ՐՏidx46 = 0; ՐՏidx46 < ՐՏitr46.length; ՐՏidx46++) {
                        argvar = ՐՏitr46[ՐՏidx46];
                        obj = classes[argvar.name];
                        if (obj) {
                            key = argvar.alias ? argvar.alias.name : argvar.name;
                            S.in_scope[S.in_scope.length-1].classes[key] = {
                                "static": obj.static,
                                "bound": obj.bound
                            };
                        }
                    }
                } else {
                    for (i in classes) {
                        obj = classes[i];
                        if (obj instanceof ast.Class) {
                            key = imp.alias ? imp.alias.name : imp.key;
                            S.in_scope[S.in_scope.length-1].classes[key + "." + obj.name.name] = {
                                "static": obj.static,
                                "bound": obj.bound
                            };
                        }
                    }
                }
            }
            return ans;
        }
        function class_() {
            var ՐՏitr49, ՐՏidx49;
            var start, name, externaldecorator, class_details, parent, docstring, definition, i, stmt, class_var_names, visitor;
            start = prev();
            name = as_symbol(ast.SymbolDefun);
            if (!name) {
                unexpected();
            }
            externaldecorator = has_simple_decorator(S.decorators, "external");
            class_details = {
                "static": [],
                "bound": {}
            };
            parent = null;
            docstring = null;
            definition = new ast.Class({
                start: start,
                name: name,
                module_id: module_id,
                parent: function() {
                    var atom;
                    if (is_("punc", "(")) {
                        next();
                        if (is_("punc", ")")) {
                            S.in_parenthesized_expr = false;
                            next();
                            return null;
                        }
                        atom = expr_atom(false);
                        expect(")");
                        parent = atom.name;
                        return atom;
                    } else {
                        return null;
                    }
                }(),
                localvars: [],
                static: class_details.static,
                external: externaldecorator,
                bound: class_details.bound,
                statements: [],
                decorators: function() {
                    var ՐՏitr47, ՐՏidx47;
                    var d, decorator;
                    d = [];
                    ՐՏitr47 = ՐՏ_Iterable(S.decorators);
                    for (ՐՏidx47 = 0; ՐՏidx47 < ՐՏitr47.length; ՐՏidx47++) {
                        decorator = ՐՏitr47[ՐՏidx47];
                        if (decorator === "kwargs") {
                            ++BASELIB["kwargs"];
                        }
                        d.push(new ast.Decorator({
                            expression: decorator
                        }));
                    }
                    S.decorators = [];
                    return d;
                }(),
                body: function(loop, labels) {
                    var a;
                    S.in_scope[S.in_scope.length-1].classes[name.name] = class_details;
                    S.in_scope.push({
                        type: "class",
                        name: name.name,
                        parent: parent,
                        nonlocal: {},
                        functions: {},
                        vars: {},
                        classes: {}
                    });
                    S.in_directives = true;
                    S.in_loop = 0;
                    S.labels = [];
                    a = block_();
                    docstring = S.in_scope[S.in_scope.length-1].docstring;
                    S.in_scope.pop();
                    S.in_loop = loop;
                    S.labels = labels;
                    return a;
                }(S.in_loop, S.labels),
                docstring: docstring,
                end: prev()
            });
            for (i in definition.body) {
                stmt = definition.body[i];
                if (stmt instanceof ast.Method && stmt.name.name === "__init__") {
                    definition.init = stmt;
                    break;
                }
            }
            class_var_names = {};
            function walker() {
                this._visit = function(node, descend) {
                    var ՐՏitr48, ՐՏidx48;
                    var child;
                    if (node instanceof ast.Method) {
                        class_var_names[node.name.name] = true;
                        return;
                    } else if (node instanceof ast.Assign && node.left instanceof ast.SymbolRef) {
                        class_var_names[node.left.name] = true;
                    }
                    ՐՏitr48 = ՐՏ_Iterable(node);
                    for (ՐՏidx48 = 0; ՐՏidx48 < ՐՏitr48.length; ՐՏidx48++) {
                        child = ՐՏitr48[ՐՏidx48];
                        if (node[child] instanceof ast.SymbolRef && Object.prototype.hasOwnProperty.call(class_var_names, node[child].name)) {
                            node[child] = new ast.SymbolClassRef({
                                "class": name,
                                "name": node[child].name
                            });
                        }
                    }
                    if (descend) {
                        descend.call(node);
                    }
                };
            }
            visitor = new walker();
            ՐՏitr49 = ՐՏ_Iterable(definition.body);
            for (ՐՏidx49 = 0; ՐՏidx49 < ՐՏitr49.length; ՐՏidx49++) {
                stmt = ՐՏitr49[ՐՏidx49];
                if (!(stmt instanceof ast.Class) && !(stmt instanceof ast.Method)) {
                    stmt.walk(visitor);
                    definition.statements.push(stmt);
                }
            }
            if (S.in_scope.length === 1) {
                CLASS_MAP[definition.name.name] = definition;
            }
            return definition;
        }
        function function_(in_class, ctor) {
            var start, is_accessor, name, generator, localvars, staticmethod, function_args, return_annotation, has_special_decorator, docstring, callsSuper, definition, arg, args;
            start = prev();
            is_accessor = ctor === ast.ObjectGetter || ctor === ast.ObjectSetter;
            name = is_("name") ? as_symbol(in_class ? ast.SymbolDefun : is_accessor ? ast.SymbolAccessor : ast.SymbolLambda) : is_accessor && (is_("string") || is_("num")) ? as_atom_node() : null;
            if (in_class && !name) {
                unexpected();
            }
            if (name && ՐՏ_in(name.name, tokenizer.JS_KEYWORDS)) {
                name.name += "_";
            }
            generator = false;
            localvars = null;
            staticmethod = false;
            function_args = {};
            return_annotation = null;
            if (!S.in_decorator) {
                has_special_decorator = function(name) {
                    return has_simple_decorator(S.decorators, name);
                };
                if (in_class) {
                    if (has_special_decorator("staticmethod")) {
                        S.in_scope[S.in_scope.length-2].classes[in_class].static.push(name.name);
                        staticmethod = true;
                    }
                    if (has_special_decorator("bind") || name.name !== "__init__" && options.auto_bind) {
                        ++BASELIB["bind"];
                        S.in_scope[S.in_scope.length-2].classes[in_class].bound[name.name] = true;
                    }
                }
            }
            expect("(");
            if (!ctor) {
                ctor = in_class ? name.name === "__init__" ? ast.Constructor : ast.Method : ast.Function;
            }
            docstring = null;
            callsSuper = null;
            definition = new ctor({
                start: start,
                name: name,
                argnames: function(a) {
                    var defaults, first, seen_names, def_line, val, expr;
                    defaults = {};
                    first = true;
                    seen_names = {};
                    def_line = S.input.context().tokline;
                    function get_arg() {
                        var name_token, name_ctx, ntok, annotation, sym, name;
                        if (Object.prototype.hasOwnProperty.call(seen_names, S.token.value)) {
                            token_error(prev(), "Can't repeat parameter names");
                        }
                        if (S.token.value === "arguments") {
                            token_error(prev(), "Can't use the name arguments as a parameter name, it is reserved by JavaScript");
                        }
                        seen_names[S.token.value] = true;
                        name_token = S.token;
                        name_ctx = S.input.context();
                        ntok = peek();
                        if (ntok.type === "punc" && ntok.value === ":") {
                            next();
                            expect(":");
                            annotation = maybe_conditional();
                            if (!tokenizer.is_token(name_token, "name")) {
                                croak("Name expected", name_ctx.tokline);
                                return null;
                            }
                            sym = new ast.SymbolFunarg({
                                "name": name_token.value,
                                "start": S.token,
                                "end": S.token,
                                "annotation": annotation ? new ast.Annotation({
                                    "start": annotation.start,
                                    "expression": annotation,
                                    "end": annotation.end
                                }) : null
                            });
                        } else {
                            if (!is_("name")) {
                                if (S.input.context().tokline !== def_line) {
                                    croak("Name expected", def_line);
                                } else {
                                    croak("Name expected");
                                }
                                return null;
                            }
                            name = S.token.value;
                            if (ՐՏ_in(name, tokenizer.JS_KEYWORDS)) {
                                name += "_";
                            }
                            sym = new ast.SymbolFunarg({
                                "name": name,
                                "start": S.token,
                                "end": S.token,
                                "annotation": null
                            });
                            next();
                        }
                        function_args[sym.name] = sym.annotation ? sym.annotation.resolveType(S.in_scope) : "?";
                        return sym;
                    }
                    while (!is_("punc", ")")) {
                        if (first) {
                            first = false;
                        } else {
                            expect(",");
                        }
                        if (is_("operator", "**")) {
                            token_error(prev(), "**kwargs in function definition is not implemented yet, work in progress");
                            next();
                            if (a.kwargs) {
                                token_error(prev(), "Can't define multiple **kwargs in function definition");
                            }
                            a.kwargs = get_arg();
                        } else if (is_("operator", "*")) {
                            next();
                            if (a.starargs) {
                                token_error(prev(), "Can't define multiple *args in function definition");
                            }
                            if (a.kwargs) {
                                token_error(prev(), "Can't define *args after **kwargs in function definition");
                            }
                            a.starargs = get_arg();
                        } else {
                            if (a.starargs || a.kwargs) {
                                token_error(prev(), "Can't define a formal parameter after *args or **kwargs");
                            }
                            a.push(get_arg());
                            if (is_("operator", "=")) {
                                if (a.kwargs) {
                                    token_error(prev(), "Can't define an optional formal parameter after **kwargs");
                                }
                                val = prev().value;
                                next();
                                defaults[val] = expression(false);
                                a.has_defaults = true;
                            } else {
                                if (a.has_defaults) {
                                    token_error(prev(), "Can't define required formal parameters after optional formal parameters");
                                }
                            }
                        }
                    }
                    next();
                    if (is_("punc", "->")) {
                        next();
                        expr = expression(true);
                        return_annotation = new ast.Annotation({
                            start: expr.start,
                            expression: expr,
                            end: expr.end
                        });
                    }
                    a.defaults = defaults;
                    return a;
                }([]),
                decorators: S.in_decorator ? [] : function() {
                    var ՐՏitr50, ՐՏidx50;
                    var d, decorator;
                    d = [];
                    ՐՏitr50 = ՐՏ_Iterable(S.decorators);
                    for (ՐՏidx50 = 0; ՐՏidx50 < ՐՏitr50.length; ՐՏidx50++) {
                        decorator = ՐՏitr50[ՐՏidx50];
                        d.push(new ast.Decorator({
                            expression: decorator
                        }));
                    }
                    S.decorators = [];
                    return d;
                }(),
                return_annotation: return_annotation,
                body: function(loop, labels) {
                    var a, variable;
                    S.in_scope.push({
                        type: "function",
                        name: name ? name.name : null,
                        return_annotation: return_annotation,
                        nonlocal: {},
                        vars: {},
                        args: function_args,
                        functions: {},
                        classes: {}
                    });
                    S.in_directives = true;
                    S.in_loop = 0;
                    S.labels = [];
                    a = block_();
                    generator = S.in_scope[S.in_scope.length-1].generator;
                    docstring = S.in_scope[S.in_scope.length-1].docstring;
                    callsSuper = S.in_scope[S.in_scope.length-1].callsSuper;
                    if (generator) {
                        ՐՏ_print(S.in_scope[S.in_scope.length-1]);
                    }
                    localvars = (function() {
                        var ՐՏidx51, ՐՏitr51 = ՐՏ_Iterable(Object.keys(S.in_scope[S.in_scope.length-1].vars)), ՐՏres = [], variable;
                        for (ՐՏidx51 = 0; ՐՏidx51 < ՐՏitr51.length; ՐՏidx51++) {
                            variable = ՐՏitr51[ՐՏidx51];
                            if (!(ՐՏ_in(variable, S.in_scope[S.in_scope.length-1].nonlocal))) {
                                ՐՏres.push(new_symbol(ast.SymbolVar, variable));
                            }
                        }
                        return ՐՏres;
                    })();
                    S.in_scope.pop();
                    S.in_loop = loop;
                    S.labels = labels;
                    return a;
                }(S.in_loop, S.labels),
                docstring: docstring,
                generator: generator,
                localvars: localvars,
                end: prev(),
                static: in_class && staticmethod
            });
            if (name) {
                S.in_scope[S.in_scope.length-1].functions[name.name] = definition.resolveType(S.in_scope);
            }
            args = (function() {
                var ՐՏidx52, ՐՏitr52 = ՐՏ_Iterable(definition.argnames), ՐՏres = [], arg;
                for (ՐՏidx52 = 0; ՐՏidx52 < ՐՏitr52.length; ՐՏidx52++) {
                    arg = ՐՏitr52[ՐՏidx52];
                    ՐՏres.push(arg.name);
                }
                return ՐՏres;
            })();
            definition.localvars = definition.localvars.filter(function(var_) {
                return !(ՐՏ_in(var_.name, args));
            });
            if (in_class && !staticmethod) {
                if (ctor === ast.Constructor) {
                    definition.parent = S.in_scope[S.in_scope.length-1].parent;
                    definition.callsSuper = callsSuper;
                }
                if (definition.argnames.length < 1) {
                    croak("Class methods require at least one argument (self)", start.line, start.col, start.pos);
                } else if (ctor === ast.ObjectGetter && definition.argnames.length !== 1) {
                    croak("Class getters don't take any arguments aside from one referencing the instance (self)", start.line, start.col, start.pos);
                } else if (ctor === ast.ObjectSetter && definition.argnames.length !== 2) {
                    croak("Class setters take exactly 2 arguments (self, value)", start.line, start.col, start.pos);
                }
            } else if (is_accessor) {
                if (ctor === ast.ObjectGetter && definition.argnames.length) {
                    croak("Object getters don't take any arguments", start.line, start.col, start.pos);
                } else if (ctor === ast.ObjectSetter && definition.argnames.length !== 1) {
                    croak("Object setters take exactly 1 argument", start.line, start.col, start.pos);
                }
            }
            return definition;
        }
        function accessor_(type, start, in_class) {
            var func;
            if (type === "get") {
                func = function_(in_class, ast.ObjectGetter);
            } else if (type === "set") {
                func = function_(in_class, ast.ObjectSetter);
            } else {
                croak("Expecting setter/getter, got '" + type + "' instead.");
            }
            func.start = start;
            func.end = prev();
            return func;
        }
        function if_() {
            var cond, body, belse;
            cond = expression(true);
            body = statement();
            belse = null;
            if (is_("keyword", "elif") || is_("keyword", "else")) {
                if (is_("keyword", "else")) {
                    next();
                } else {
                    S.token.value = "if";
                }
                belse = statement();
            }
            return new ast.If({
                condition: cond,
                body: body,
                alternative: belse
            });
        }
        function is_docstring(stmt) {
            if (stmt instanceof ast.Directive && !S.in_scope[S.in_scope.length-1].docstring) {
                return true;
            }
            return false;
        }
        function format_docstring(string) {
            var ՐՏitr53, ՐՏidx53, ՐՏitr54, ՐՏidx54;
            var lines, indent, line, pad, trimmed;
            lines = string.split(/\n/g);
            indent = 1e6;
            ՐՏitr53 = ՐՏ_Iterable(lines.slice(1));
            for (ՐՏidx53 = 0; ՐՏidx53 < ՐՏitr53.length; ՐՏidx53++) {
                line = ՐՏitr53[ՐՏidx53];
                if (line.trim().length) {
                    pad = line.match(/^\s*/)[0];
                    indent = Math.min(indent, pad.length);
                }
            }
            trimmed = [ lines[0].trim() ];
            if (indent < 1e6) {
                ՐՏitr54 = ՐՏ_Iterable(lines.slice(1));
                for (ՐՏidx54 = 0; ՐՏidx54 < ՐՏitr54.length; ՐՏidx54++) {
                    line = ՐՏitr54[ՐՏidx54];
                    trimmed.push(line.slice(indent).replace(/\s+$/));
                }
            }
            while (trimmed && !trimmed[trimmed.length-1]) {
                trimmed.pop();
            }
            while (trimmed && !trimmed[0]) {
                trimmed.shift();
            }
            return trimmed.join("\n");
        }
        function block_() {
            var a, stmt;
            expect(":");
            a = [];
            if (!S.token.newline_before) {
                while (!S.token.newline_before) {
                    if (is_("eof")) {
                        unexpected();
                    }
                    stmt = statement();
                    if (!a.length && is_docstring(stmt)) {
                        if (!options.dropDocstrings) {
                            S.in_scope[S.in_scope.length-1].docstring = format_docstring(stmt.value);
                        }
                    } else {
                        a.push(stmt);
                    }
                }
            } else {
                while (!is_("punc", "}")) {
                    if (is_("eof")) {
                        return a;
                    }
                    stmt = statement();
                    if (!a.length && is_docstring(stmt)) {
                        if (!options.dropDocstrings) {
                            S.in_scope[S.in_scope.length-1].docstring = format_docstring(stmt.value);
                        }
                    } else {
                        a.push(stmt);
                    }
                }
                next();
            }
            return a;
        }
        function switch_body_() {
            var a, cur, branch;
            expect("{");
            a = [];
            cur = null;
            branch = null;
            while (!is_("punc", "}")) {
                if (is_("eof")) {
                    unexpected();
                }
                if (is_("keyword", "case")) {
                    if (branch) {
                        branch.end = prev();
                    }
                    cur = [];
                    branch = new ast.Case({
                        start: function() {
                            var tmp;
                            tmp = S.token;
                            next();
                            return tmp;
                        }(),
                        expression: expression(true),
                        body: cur
                    });
                    a.push(branch);
                    expect(":");
                } else if (is_("keyword", "default")) {
                    if (branch) {
                        branch.end = prev();
                    }
                    cur = [];
                    branch = new ast.Default({
                        start: function() {
                            var tmp;
                            tmp = S.token;
                            next();
                            expect(":");
                            return tmp;
                        }(),
                        body: cur
                    });
                    a.push(branch);
                } else {
                    if (!cur) {
                        unexpected();
                    }
                    cur.push(statement());
                }
            }
            if (branch) {
                branch.end = prev();
            }
            next();
            return a;
        }
        function try_() {
            var body, bcatch, bfinally, start, exceptions, name;
            body = block_();
            bcatch = [];
            bfinally = null;
            while (is_("keyword", "except")) {
                start = S.token;
                next();
                exceptions = [];
                if (!is_("punc", ":") && !is_("keyword", "as")) {
                    exceptions.push(as_symbol(ast.SymbolVar));
                    while (is_("punc", ",")) {
                        next();
                        exceptions.push(as_symbol(ast.SymbolVar));
                    }
                }
                name = null;
                if (is_("keyword", "as")) {
                    next();
                    name = as_symbol(ast.SymbolCatch);
                }
                bcatch.push(new ast.Except({
                    start: start,
                    argname: name,
                    errors: exceptions,
                    body: block_(),
                    end: prev()
                }));
            }
            if (is_("keyword", "finally")) {
                start = S.token;
                next();
                bfinally = new ast.Finally({
                    start: start,
                    body: block_(),
                    end: prev()
                });
            }
            if (!bcatch.length && !bfinally) {
                croak("Missing except/finally blocks");
            }
            return new ast.Try({
                body: body,
                bcatch: bcatch.length ? new ast.Catch({
                    body: bcatch
                }) : null,
                bfinally: bfinally
            });
        }
        function vardefs(no_in, type) {
            var a, symbol;
            a = [];
            while (true) {
                symbol = new ast.VarDef({
                    start: S.token,
                    name: as_symbol(type === "const" ? ast.SymbolConst : type === "nonlocal" ? ast.SymbolNonlocal : ast.SymbolVar),
                    end: prev()
                });
                if (type === "nonlocal") {
                    S.in_scope[S.in_scope.length-1].nonlocal[symbol.name.name] = true;
                }
                a.push(symbol);
                if (!is_("punc", ",")) {
                    break;
                }
                next();
            }
            return a;
        }
        function nonlocal_(no_in) {
            return new ast.Var({
                start: prev(),
                definitions: vardefs(no_in, "nonlocal"),
                end: prev()
            });
        }
        function const_() {
            return new ast.Const({
                start: prev(),
                definitions: vardefs(false, "const"),
                end: prev()
            });
        }
        function new_() {
            var start, newexp, args;
            start = S.token;
            expect_token("operator", "new");
            newexp = expr_atom(false);
            if (is_("punc", "(")) {
                next();
                args = expr_list(")");
            } else {
                args = [];
            }
            return subscripts(new ast.New({
                start: start,
                expression: newexp,
                args: args,
                end: prev()
            }), true);
        }
        function as_atom_node(token) {
            var tok, tmp_, ret, tmp__;
            tok = token || S.token;
            tmp_ = tok.type;
            if (tmp_ === "name") {
                if (tok.value === "NaN") {
                    ret = kwargs(as_symbol)(ast.NotANumber, {token: tok});
                } else if (tok.value === "undefined") {
                    ret = kwargs(as_symbol)(ast.Undefined, {token: tok});
                } else {
                    ret = kwargs(as_symbol)(ast.SymbolRef, {token: tok});
                }
            } else if (tmp_ === "num") {
                ret = new ast.Number({
                    start: tok,
                    end: tok,
                    value: tok.value
                });
            } else if (tmp_ === "string") {
                ret = new ast.String({
                    start: tok,
                    end: tok,
                    value: tok.value,
                    modifier: tok.subtype
                });
            } else if (tmp_ === "regexp") {
                ret = new ast.RegExp({
                    start: tok,
                    end: tok,
                    value: tok.value
                });
            } else if (tmp_ === "atom") {
                tmp__ = tok.value;
                if (tmp__ === "False") {
                    ret = new ast.Boolean({
                        start: tok,
                        value: false,
                        end: tok
                    });
                } else if (tmp__ === "True") {
                    ret = new ast.Boolean({
                        start: tok,
                        value: true,
                        end: tok
                    });
                } else if (tmp__ === "None") {
                    ret = new ast.Null({
                        start: tok,
                        end: tok
                    });
                }
            }
            if (!token) {
                next();
            }
            ret.resolveType(S.in_scope);
            return ret;
        }
        function expr_atom(allow_calls) {
            var start, tmp_, ex, cls, func;
            if (is_("operator", "new")) {
                return new_();
            }
            start = S.token;
            if (is_("punc")) {
                tmp_ = start.value;
                if (tmp_ === "(") {
                    next();
                    ex = expression(true);
                    ex.start = start;
                    ex.end = S.token;
                    if (ex instanceof ast.SymbolRef) {
                        ex.parens = true;
                    }
                    expect(")");
                    return subscripts(ex, allow_calls);
                } else if (tmp_ === "[") {
                    return subscripts(array_(), allow_calls);
                } else if (tmp_ === "{") {
                    return subscripts(object_(), allow_calls);
                }
                unexpected();
            }
            if (is_("keyword", "class")) {
                next();
                cls = class_();
                cls.start = start;
                cls.end = prev();
                return subscripts(cls, allow_calls);
            }
            if (is_("keyword", "def")) {
                next();
                func = function_(false);
                func.start = start;
                func.end = prev();
                return subscripts(func, allow_calls);
            }
            if (ATOMIC_START_TOKEN[S.token.type]) {
                return subscripts(as_atom_node(), allow_calls);
            }
            unexpected();
        }
        function expr_list(closing, allow_trailing_comma, allow_empty, func_call) {
            var ՐՏitr55, ՐՏidx55, ՐՏupk4;
            var first, a, saw_starargs, tmp, i, arg;
            first = true;
            a = [];
            saw_starargs = false;
            while (!is_("punc", closing)) {
                if (saw_starargs) {
                    token_error(prev(), "*args must be the last argument in a function call");
                }
                if (first) {
                    first = false;
                } else {
                    expect(",");
                }
                if (allow_trailing_comma && is_("punc", closing)) {
                    break;
                }
                if (is_("operator", "*") && func_call) {
                    saw_starargs = true;
                    next();
                }
                if (is_("punc", ",") && allow_empty) {
                    a.push(new ast.Hole({
                        start: S.token,
                        end: S.token
                    }));
                } else {
                    a.push(expression(false));
                }
            }
            if (func_call) {
                tmp = [];
                tmp.kwargs = [];
                ՐՏitr55 = ՐՏ_Iterable(enumerate(a));
                for (ՐՏidx55 = 0; ՐՏidx55 < ՐՏitr55.length; ՐՏidx55++) {
                    ՐՏupk4 = ՐՏitr55[ՐՏidx55];
                    i = ՐՏupk4[0];
                    arg = ՐՏupk4[1];
                    if (arg instanceof ast.Assign) {
                        ++BASELIB["kwargs"];
                        tmp.kwargs.push([ arg.left, arg.right ]);
                    } else {
                        tmp.push(arg);
                    }
                }
                a = tmp;
            }
            next();
            if (saw_starargs) {
                a.starargs = true;
            }
            return a;
        }
        function func_call_list() {
            var a, first, kwargs, arg;
            a = [];
            first = true;
            a.kwargs = [];
            a.kwarg_items = kwargs = [];
            a.starargs = false;
            while (!is_("punc", ")")) {
                if (first) {
                    first = false;
                } else {
                    expect(",");
                }
                if (is_("operator", "*")) {
                    next();
                    arg = expression(false);
                    arg.is_array = true;
                    a.push(arg);
                    a.starargs = true;
                } else if (is_("operator", "**")) {
                    ++BASELIB["kwargs"];
                    next();
                    kwargs.push(as_symbol(ast.SymbolVar, false));
                } else {
                    arg = expression(false);
                    if (arg instanceof ast.Assign) {
                        ++BASELIB["kwargs"];
                        a.kwargs.push([ arg.left, arg.right ]);
                    } else {
                        a.push(arg);
                    }
                }
            }
            next();
            return a;
        }
        function read_comprehension(object) {
            var terminator, forloop;
            terminator = object instanceof ast.DictComprehension ? "}" : "]";
            expect_token("keyword", "for");
            forloop = for_(true);
            ++BASELIB["iterable"];
            object.init = forloop.init;
            object.name = forloop.name;
            object.object = forloop.object;
            object.condition = is_("punc", terminator) ? null : (expect_token("keyword", "if"), 
            expression(true));
            expect(terminator);
            return object;
        }
        
        var array_ = (ՐՏ_119 = function array_() {
            var expr, ret;
            expect("[");
            expr = [];
            if (!is_("punc", "]")) {
                expr.push(expression(false));
                if (is_("keyword", "for")) {
                    return read_comprehension(new ast.ListComprehension({
                        statement: expr[0]
                    }));
                }
                if (is_("operator", "til")) {
                    ++BASELIB["range"];
                    next();
                    expr.push(expression(false));
                    ret = new ast.Range({
                        start: S.token,
                        left: expr[0],
                        operator: "til",
                        right: expr[1],
                        end: prev()
                    });
                    expect("]");
                    return ret;
                } else if (is_("operator", "to")) {
                    ++BASELIB["range"];
                    next();
                    expr.push(expression(false));
                    ret = new ast.Range({
                        start: S.token,
                        left: expr[0],
                        operator: "to",
                        right: expr[1],
                        end: prev()
                    });
                    expect("]");
                    return ret;
                } else if (!is_("punc", "]")) {
                    expect(",");
                }
            }
            return new ast.Array({
                elements: expr.concat(expr_list("]", !options.strict, true))
            });
        }, ՐՏ_119 = embed_tokens(ՐՏ_119), ՐՏ_119);
        
        var object_ = (ՐՏ_120 = function object_() {
            var maybe_dict_comprehension, first, a, start, type, computed, saw_starargs, key, name, ctx, orig, key_;
            maybe_dict_comprehension = false;
            expect("{");
            first = true;
            a = [];
            while (!is_("punc", "}")) {
                if (!first) {
                    expect(",");
                }
                if (!options.strict && is_("punc", "}")) {
                    break;
                }
                start = S.token;
                type = start.type;
                computed = false;
                saw_starargs = false;
                if (is_("operator", "*")) {
                    saw_starargs = true;
                    if (!options.es6) {
                        croak("Spread operator in object literals is only allowed in ES6 mode");
                    }
                    a.push(maybe_unary(true));
                } else if (first && peek().value !== ":") {
                    maybe_dict_comprehension = true;
                    key = expression(false);
                    name = null;
                } else {
                    ctx = S.input.context();
                    orig = ctx.expect_object_literal_key;
                    ctx.expect_object_literal_key = true;
                    if (is_("punc", "(")) {
                        if (!options.es6) {
                            croak("Computed properties are only allowed in ES6 mode");
                        }
                        expect("(");
                        key = expression(false);
                        expect(")");
                        computed = true;
                    } else {
                        key_ = as_property_name();
                        name = key_.value;
                        if (key_.type === "num") {
                            key = new ast.Number({
                                start: start,
                                value: name,
                                end: prev()
                            });
                        } else if (key_.type === "name" || key_.type === "keyword") {
                            if (ՐՏ_in(name, [ "True", "False" ])) {
                                key = new ast.Boolean({
                                    start: start,
                                    value: name,
                                    end: prev()
                                });
                            } else {
                                key = new ast.Identifier({
                                    start: start,
                                    value: name,
                                    end: prev()
                                });
                            }
                        } else {
                            key = new ast.String({
                                start: start,
                                value: name,
                                end: prev()
                            });
                        }
                    }
                    ctx.expect_object_literal_key = orig;
                    if (type === "name" && !is_("punc", ":")) {
                        a.push(accessor_(name, start, false));
                        continue;
                    }
                }
                if (!saw_starargs) {
                    expect(":");
                    a.push(new ast.ObjectKeyVal({
                        start: start,
                        key: key,
                        value: expression(false),
                        end: prev()
                    }));
                    if (a.length === 1 && is_("keyword", "for")) {
                        return read_comprehension(new ast.DictComprehension({
                            statement: maybe_dict_comprehension ? key : as_atom_node(a[0].start),
                            value_statement: a[0].value
                        }));
                    }
                }
                first = false;
            }
            next();
            return new ast.ObjectLiteral({
                properties: a
            });
        }, ՐՏ_120 = embed_tokens(ՐՏ_120), ՐՏ_120);
        function as_property_name() {
            var tmp, tmp_;
            tmp = S.token;
            next();
            tmp_ = tmp.type;
            if (tmp_ === "num" || tmp_ === "string" || tmp_ === "name" || tmp_ === "operator" || tmp_ === "keyword" || tmp_ === "atom") {
                return tmp;
            } else {
                unexpected();
            }
        }
        function as_name() {
            var tmp, tmp_;
            tmp = S.token;
            next();
            tmp_ = tmp.type;
            if (tmp_ === "name" || tmp_ === "operator" || tmp_ === "keyword" || tmp_ === "atom") {
                return tmp.value;
            } else {
                unexpected();
            }
        }
        function as_symbol(type, noerror, token) {
            var token_, name, sym;
            token_ = token || S.token;
            if (!tokenizer.is_token(token_, "name")) {
                if (!noerror) {
                    croak("Name expected");
                }
                return null;
            }
            name = token_.value;
            if (ՐՏ_in(name, tokenizer.JS_KEYWORDS)) {
                token_.value += "_";
            }
            sym = new (name === "this" ? ast.This : type)({
                name: String(token_.value),
                start: token_,
                end: token_
            });
            if (!token) {
                next();
            }
            return sym;
        }
        function new_symbol(type, name) {
            var sym;
            sym = new (name === "this" ? ast.This : type)({
                name: String(name),
                start: null,
                end: null
            });
            return sym;
        }
        function is_static_method(cls, method) {
            if (ՐՏ_in(method, COMMON_STATIC) || cls.static && ՐՏ_in(method, cls.static)) {
                return true;
            } else {
                return false;
            }
        }
        function mark_local_assignment(element, value) {
            var computedType, name;
            if (value) {
                computedType = typeof value === "string" ? value : value.resolveType(S.in_scope);
            } else {
                computedType = "?";
            }
            name = typeof element === "string" ? element : element.name;
            if (name) {
                if (ՐՏ_in(name, S.in_scope[S.in_scope.length-1].vars)) {
                    S.in_scope[S.in_scope.length-1].vars[name].push(computedType);
                } else {
                    S.in_scope[S.in_scope.length-1].vars[name] = [ computedType ];
                }
            }
        }
        function subscripts(expr, allow_calls) {
            var start, slice_bounds, is_slice, i, str_, ret, className, funcname, tmp_, args;
            start = expr.start;
            if (is_("punc", ".")) {
                next();
                return subscripts(new ast.Dot({
                    start: start,
                    expression: expr,
                    property: as_name(),
                    end: prev()
                }), allow_calls);
            }
            if (is_("punc", "[") && !S.token.newline_before) {
                next();
                slice_bounds = [];
                is_slice = false;
                if (is_("punc", ":")) {
                    slice_bounds.push(null);
                } else {
                    slice_bounds.push(expression(false));
                }
                if (is_("punc", ":")) {
                    is_slice = true;
                    next();
                    if (is_("punc", ":")) {
                        slice_bounds.push(null);
                    } else if (!is_("punc", "]")) {
                        slice_bounds.push(expression(false));
                    }
                }
                if (is_("punc", ":")) {
                    ++BASELIB["eslice"];
                    next();
                    if (is_("punc", "]")) {
                        unexpected();
                    } else {
                        slice_bounds.push(expression(false));
                    }
                }
                expect("]");
                if (is_slice) {
                    if (is_("operator") && S.token.value === "=") {
                        next();
                        return subscripts(new ast.Slice({
                            start: start,
                            expression: expr,
                            property: slice_bounds[0] || new ast.Number({
                                value: 0
                            }),
                            property2: slice_bounds[1],
                            assignment: expression(true),
                            end: prev()
                        }), allow_calls);
                    } else if (slice_bounds.length === 3) {
                        slice_bounds.unshift(slice_bounds.pop());
                        if (!slice_bounds[slice_bounds.length-1]) {
                            slice_bounds.pop();
                            if (!slice_bounds[slice_bounds.length-1]) {
                                slice_bounds.pop();
                            }
                        } else if (!slice_bounds[slice_bounds.length-2]) {
                            slice_bounds[slice_bounds.length-2] = new ast.Undefined();
                        }
                        return subscripts(new ast.Call({
                            start: start,
                            expression: new ast.SymbolRef({
                                name: "eslice"
                            }),
                            args: [ expr ].concat(slice_bounds),
                            end: prev()
                        }), allow_calls);
                    } else {
                        slice_bounds = (function() {
                            var ՐՏidx56, ՐՏitr56 = ՐՏ_Iterable(slice_bounds), ՐՏres = [], i;
                            for (ՐՏidx56 = 0; ՐՏidx56 < ՐՏitr56.length; ՐՏidx56++) {
                                i = ՐՏitr56[ՐՏidx56];
                                ՐՏres.push(i === null ? new ast.Number({
                                    value: 0
                                }) : i);
                            }
                            return ՐՏres;
                        })();
                        return subscripts(new ast.Call({
                            start: start,
                            expression: new ast.Dot({
                                start: start,
                                expression: expr,
                                property: "slice",
                                end: prev()
                            }),
                            args: slice_bounds,
                            end: prev()
                        }), allow_calls);
                    }
                } else {
                    return subscripts(new ast.Sub({
                        start: start,
                        expression: expr,
                        property: slice_bounds[0] || new ast.Number({
                            value: 0
                        }),
                        end: prev()
                    }), allow_calls);
                }
            }
            if (allow_calls && is_("punc", "(") && !S.token.newline_before) {
                next();
                if (expr instanceof ast.SymbolRef && expr.name === "JS") {
                    str_ = expression(false);
                    if (!(str_ instanceof ast.String)) {
                        token_error(prev(), "Compile-time function JS() can't evaluate variables or expressions");
                    }
                    ret = new ast.Verbatim({
                        start: start,
                        value: str_.value,
                        end: prev()
                    });
                    expect(")");
                    return subscripts(ret, true);
                } else if (!expr.parens && get_class_in_scope(expr)) {
                    if (ՐՏ_in(expr.name, STDLIB)) {
                        ++BASELIB[expr.name];
                        if (/Error$/.test(expr.name)) {
                            ++BASELIB["extends"];
                        }
                    }
                    return subscripts(new ast.New({
                        start: start,
                        expression: expr,
                        args: func_call_list(),
                        end: prev()
                    }), true);
                } else {
                    if (expr instanceof ast.Dot) {
                        className = get_class_in_scope(expr.expression);
                    }
                    if (className) {
                        funcname = expr;
                        if (funcname.property === "__init__") {
                            funcname.property = "constructor";
                        }
                        S.in_scope[S.in_scope.length-1].callsSuper = S.in_scope.length > 1 && S.in_scope[S.in_scope.length-2].type === "class" && expr.expression.name === S.in_scope[S.in_scope.length-2].parent;
                        return validateCallArgs(subscripts(new ast.ClassCall({
                            start: start,
                            class: expr.expression,
                            method: funcname.property,
                            super: S.in_scope[S.in_scope.length-1].callsSuper,
                            static: is_static_method(className, funcname.property),
                            args: func_call_list(),
                            end: prev()
                        }), true));
                    } else if (expr instanceof ast.SymbolRef) {
                        tmp_ = expr.name;
                        if (ՐՏ_in(tmp_, STDLIB)) {
                            ++BASELIB[tmp_];
                        } else if (tmp_ === "isinstance") {
                            args = func_call_list();
                            if (args.length !== 2) {
                                croak("'isinstance' takes exactly 2 arguments");
                            }
                            return new ast.Binary({
                                start: start,
                                operator: "instanceof",
                                left: args[0],
                                right: args[1],
                                end: prev()
                            });
                        } else if (tmp_ === "super") {
                            S.in_scope[S.in_scope.length-1].callsSuper = true;
                        } else if (ՐՏ_in(tmp_, tokenizer.JS_KEYWORDS)) {
                            expr.name += "_";
                        }
                    }
                    return validateCallArgs(subscripts(new ast.Call({
                        start: start,
                        expression: expr,
                        args: func_call_list(),
                        end: prev()
                    }), true));
                }
            }
            return expr;
        }
        function keepDecoratorOrImport(expr, imp) {
            imp = imp === void 0 ? false : imp;
            var name;
            if (imp) {
                if (!options.dropImports.length) {
                    return true;
                }
            } else {
                if (!options.dropDecorators.length) {
                    return true;
                }
            }
            function stringifyName(expr) {
                if (expr instanceof ast.Dot) {
                    return stringifyName(expr.expression) + "." + expr.property;
                }
                return expr.name;
            }
            if (typeof expr === "string") {
                name = expr;
            } else if (expr instanceof ast.SymbolRef) {
                name = expr.name;
            } else if (expr instanceof ast.Dot) {
                name = stringifyName(expr);
            } else if (expr instanceof ast.Call) {
                name = stringifyName(expr.expression);
            } else {
                croak("Unsupported decorator");
            }
            if (imp) {
                return !(ՐՏ_in(name, options.dropImports));
            } else {
                return !(ՐՏ_in(name, options.dropDecorators));
            }
        }
        function maybe_unary(allow_calls) {
            var start, expr, ex, val;
            start = S.token;
            if (is_("operator", "@")) {
                if (S.in_decorator) {
                    croak("Nested decorators are not allowed");
                }
                next();
                S.in_decorator = true;
                expr = expression(true);
                S.in_decorator = false;
                if (keepDecoratorOrImport(expr)) {
                    S.decorators.push(expr);
                }
                return new ast.EmptyStatement({
                    stype: "@",
                    start: prev(),
                    end: prev()
                });
            }
            if (is_("operator") && UNARY_PREFIX(start.value)) {
                next();
                ex = make_unary(ast.UnaryPrefix, start.value, maybe_unary(allow_calls));
                ex.start = start;
                ex.end = prev();
                return ex;
            }
            val = expr_atom(allow_calls);
            while (is_("operator") && tokenizer.UNARY_POSTFIX(S.token.value) && !S.token.newline_before) {
                val = make_unary(ast.UnaryPostfix, S.token.value, val);
                val.start = start;
                val.end = S.token;
                next();
            }
            return val;
        }
        function make_unary(ctor, op, expr) {
            return validateUnary(new ctor({
                operator: op,
                expression: expr
            }));
        }
        function validateBinary(astElement) {
            var left, right, op;
            left = astElement.left.resolveType(S.in_scope);
            right = astElement.right.resolveType(S.in_scope);
            op = astElement.operator;
            if (!(ՐՏ_in(op, [ "in", "instanceof", "==", "!=", "===", "!==", "||", "&&", "=" ])) && (!(ՐՏ_in(left, [ "Number", "String", "Boolean", "?" ])) || !(ՐՏ_in(right, [ "Number", "String", "Boolean", "?" ])) || left === "String" && !(ՐՏ_in(op, [ "+", "+=" ])) || right === "String" && !(ՐՏ_in(op, [ "+", "+=" ])))) {
                if (left) {
                    if (left[0] === "[") {
                        left = "Array";
                    } else if (left[0] === "{") {
                        left = "Object";
                    }
                }
                if (right) {
                    if (right[0] === "[") {
                        right = "Array";
                    } else if (right[0] === "{") {
                        right = "Object";
                    }
                }
                throw croak("cannot perform binary '" + op + "' operation on incompatbile elements of type " + left + " and " + right + "");
            }
            return astElement;
        }
        function validateUnary(astElement) {
            var element, op;
            element = astElement.expression.resolveType(S.in_scope);
            op = astElement.operator;
            if (!element) {
                if (op !== "!") {
                    throw croak("cannot perform unary '" + op + "' operation on incompatbile element of type " + element);
                }
            } else if (!(ՐՏ_in(element, [ "Number", "?" ])) && ՐՏ_in(op, [ "+", "-" ]) || !(ՐՏ_in(element[0], [ "[", "{", "?" ])) && op === "*") {
                if (element[0] === "[") {
                    element = "Array";
                } else if (element[0] === "{") {
                    element = "Object";
                }
                throw croak("cannot perform unary '" + op + "' operation on incompatbile element of type " + element);
            }
            return astElement;
        }
        function validateCallArgs(astElement) {
            var ՐՏitr57, ՐՏidx57, ՐՏitr58, ՐՏidx58, ՐՏitr59, ՐՏidx59, ՐՏitr60, ՐՏidx60, ՐՏupk5;
            var name, found, scope, func, signature, variable, args, i, arg, expected, actual;
            if (astElement.expression instanceof ast.SymbolRef) {
                name = astElement.expression.name;
                found = false;
                ՐՏitr57 = ՐՏ_Iterable(reversed(S.in_scope));
                for (ՐՏidx57 = 0; ՐՏidx57 < ՐՏitr57.length; ՐՏidx57++) {
                    scope = ՐՏitr57[ՐՏidx57];
                    ՐՏitr58 = ՐՏ_Iterable(scope.functions);
                    for (ՐՏidx58 = 0; ՐՏidx58 < ՐՏitr58.length; ՐՏidx58++) {
                        func = ՐՏitr58[ՐՏidx58];
                        if (func === name) {
                            signature = scope.functions[func];
                            found = true;
                            break;
                        }
                    }
                    ՐՏitr59 = ՐՏ_Iterable(scope.vars);
                    for (ՐՏidx59 = 0; ՐՏidx59 < ՐՏitr59.length; ՐՏidx59++) {
                        variable = ՐՏitr59[ՐՏidx59];
                        if (variable === name) {
                            signature = scope.vars[func];
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        break;
                    }
                }
                if (signature && signature.slice(0, 9) === "Function(") {
                    args = /\((.*)\)/.exec(signature)[1].split(",");
                    if (args.length === 1 && !args[0].length) {
                        args.pop();
                    }
                    if (args.length < astElement.args.length) {
                        croak("Function '" + name + "' takes " + args.length + " arguments, yet your call contains " + astElement.args.length + "");
                    }
                    ՐՏitr60 = ՐՏ_Iterable(enumerate(astElement.args));
                    for (ՐՏidx60 = 0; ՐՏidx60 < ՐՏitr60.length; ՐՏidx60++) {
                        ՐՏupk5 = ՐՏitr60[ՐՏidx60];
                        i = ՐՏupk5[0];
                        arg = ՐՏupk5[1];
                        expected = args[i].trim();
                        actual = arg.resolveType(S.in_scope);
                        if (expected !== "?" && !(ՐՏ_in(actual, [ expected, "?" ]))) {
                            croak("Function '" + name + "' expects argument " + i + " type of " + expected + ", but you're passing " + actual + "");
                        }
                    }
                }
            }
            return astElement;
        }
        function expr_op(left, min_prec, no_in) {
            var op, not_in, prec, right, ret;
            op = is_("operator") ? S.token.value : null;
            not_in = false;
            if (op === "!" && peek().type === "operator" && peek().value === "in") {
                next();
                op = "in";
                not_in = true;
            }
            if (op === "in") {
                if (no_in) {
                    op = null;
                } else {
                    ++BASELIB[op];
                }
            }
            prec = op !== null ? tokenizer.PRECEDENCE[op] : null;
            if (prec !== null && prec > min_prec) {
                next();
                right = expr_op(maybe_unary(true), prec, no_in);
                if (ՐՏ_in(op, [ "==", "!=" ])) {
                    ++BASELIB["eq"];
                    ret = new ast.DeepEquality({
                        start: left.start,
                        left: left,
                        operator: op,
                        right: right,
                        end: right.end
                    });
                } else {
                    ret = new ast.Binary({
                        start: left.start,
                        left: left,
                        operator: op,
                        right: right,
                        end: right.end
                    });
                    validateBinary(ret);
                }
                if (not_in) {
                    ret = new ast.UnaryPrefix({
                        start: left.start,
                        operator: "!",
                        expression: ret,
                        end: right.end
                    });
                }
                return expr_op(ret, min_prec, no_in);
            }
            return left;
        }
        function expr_ops(no_in) {
            return expr_op(maybe_unary(true), 0, no_in);
        }
        function maybe_conditional(no_in) {
            var start, expr, yes;
            start = S.token;
            expr = expr_ops(no_in);
            if (is_("operator", "?")) {
                next();
                yes = expression(false);
                expect(":");
                return new ast.Conditional({
                    start: start,
                    condition: expr,
                    consequent: yes,
                    alternative: expression(false, no_in),
                    end: peek()
                });
            }
            return expr;
        }
        function isAssignable(expr) {
            var ՐՏitr61, ՐՏidx61;
            var element;
            if (expr instanceof ast.SymbolRef || expr instanceof ast.PropAccess) {
                return true;
            }
            if (expr instanceof ast.Array) {
                ՐՏitr61 = ՐՏ_Iterable(expr.elements);
                for (ՐՏidx61 = 0; ՐՏidx61 < ՐՏitr61.length; ՐՏidx61++) {
                    element = ՐՏitr61[ՐՏidx61];
                    if (!isAssignable(element)) {
                        return false;
                    }
                }
                return true;
            }
            if (expr instanceof ast.Seq) {
                if (isAssignable(expr.car) && isAssignable(expr.cdr)) {
                    return true;
                }
            }
            return false;
        }
        function maybe_assign(no_in) {
            var start, left, val, right;
            start = S.token;
            left = maybe_conditional(no_in);
            val = S.token.value;
            if (is_("operator") && ASSIGNMENT(val)) {
                if (isAssignable(left)) {
                    if (left instanceof ast.SymbolRef && val !== "=" && !(ՐՏ_in(left.name, S.in_scope[S.in_scope.length-1].vars)) && (!S.in_scope[S.in_scope.length-1].args || !(ՐՏ_in(left.name, S.in_scope[S.in_scope.length-1].args))) && !(ՐՏ_in(left.name, S.in_scope[S.in_scope.length-1].nonlocal))) {
                        croak("Attempting to increment/modify uninitialized variable '" + left.name + "', this can also occur if you're trying to shadow without initializing the variable in local scope.");
                    }
                    next();
                    right = maybe_assign(no_in);
                    if (!S.in_seq) {
                        mark_local_assignment(left, right);
                    }
                    return validateBinary(new ast.Assign({
                        start: start,
                        left: left,
                        operator: val,
                        right: right,
                        end: prev()
                    }));
                }
                croak("Invalid assignment");
            }
            return left;
        }
        function expression(commas, no_in) {
            var ՐՏitr62, ՐՏidx62, ՐՏupk6, ՐՏitr63, ՐՏidx63, ՐՏupk7;
            var start, expr, left, leftAst, right, index, element, seq;
            start = S.token;
            expr = maybe_assign(no_in);
            if (commas) {
                left = [ expr ];
                while (is_("punc", ",") && !peek().newline_before) {
                    S.in_seq = true;
                    next();
                    if (expr instanceof ast.Assign) {
                        left[left.length-1] = left[left.length-1].left;
                        if (left.length === 1) {
                            if (left[0] instanceof ast.Seq) {
                                leftAst = seq_to_array(left[0]);
                            } else {
                                leftAst = left[0];
                            }
                        } else {
                            leftAst = new ast.Array({
                                elements: left
                            });
                        }
                        right = seq_to_array(new ast.Seq({
                            car: expr.right,
                            cdr: expression(true, no_in)
                        }));
                        ՐՏitr62 = ՐՏ_Iterable(enumerate(leftAst.elements));
                        for (ՐՏidx62 = 0; ՐՏidx62 < ՐՏitr62.length; ՐՏidx62++) {
                            ՐՏupk6 = ՐՏitr62[ՐՏidx62];
                            index = ՐՏupk6[0];
                            element = ՐՏupk6[1];
                            mark_local_assignment(element, right.elements[index]);
                        }
                        return new ast.Assign({
                            start: start,
                            left: leftAst,
                            operator: expr.operator,
                            right: right,
                            end: peek()
                        });
                    }
                    expr = maybe_assign(no_in);
                    left.push(expr);
                }
                S.in_seq = false;
                if (expr instanceof ast.Assign && expr.left instanceof ast.Seq) {
                    expr.left = seq_to_array(expr.left);
                }
                if (left.length > 1 && left[left.length-1] instanceof ast.Assign) {
                    left[left.length-1] = left[left.length-1].left;
                    ՐՏitr63 = ՐՏ_Iterable(enumerate(left));
                    for (ՐՏidx63 = 0; ՐՏidx63 < ՐՏitr63.length; ՐՏidx63++) {
                        ՐՏupk7 = ՐՏitr63[ՐՏidx63];
                        index = ՐՏupk7[0];
                        element = ՐՏupk7[1];
                        mark_local_assignment(element, expr.right instanceof ast.Array ? expr.right.elements[index] : null);
                    }
                    return new ast.Assign({
                        start: start,
                        left: new ast.Array({
                            elements: left
                        }),
                        operator: expr.operator,
                        right: expr.right,
                        end: peek()
                    });
                }
                seq = function build_seq(a) {
                    var ՐՏitr64, ՐՏidx64, ՐՏupk8;
                    var first, index, element;
                    first = a.shift();
                    if (first instanceof ast.Assign) {
                        if (first.left instanceof ast.Array) {
                            ՐՏitr64 = ՐՏ_Iterable(enumerate(first.left.elements));
                            for (ՐՏidx64 = 0; ՐՏidx64 < ՐՏitr64.length; ՐՏidx64++) {
                                ՐՏupk8 = ՐՏitr64[ՐՏidx64];
                                index = ՐՏupk8[0];
                                element = ՐՏupk8[1];
                                mark_local_assignment(element, first.right instanceof ast.Array ? first.right.elements[index] : null);
                            }
                        }
                    }
                    if (!a.length) {
                        return first;
                    }
                    return new ast.Seq({
                        start: start,
                        car: first,
                        cdr: build_seq(a),
                        end: peek()
                    });
                }(left);
                return seq;
            }
            return expr;
        }
        function in_loop(cont) {
            var ret;
            ++S.in_loop;
            ret = cont();
            --S.in_loop;
            return ret;
        }
        return function() {
            var ՐՏitr65, ՐՏidx65;
            var start, body, docstring, first_token, element, shebang, end, toplevel, assignments, callables, item;
            start = S.token;
            body = [];
            docstring = null;
            first_token = true;
            while (!is_("eof")) {
                element = statement();
                if (first_token && element instanceof ast.Directive && element.value.indexOf("#!") === 0) {
                    shebang = element.value;
                } else if (!body.length && is_docstring(element)) {
                    if (!options.dropDocstrings) {
                        docstring = format_docstring(element.value);
                    }
                } else {
                    body.push(element);
                }
                first_token = false;
            }
            end = prev();
            toplevel = options.toplevel;
            if (toplevel) {
                toplevel.body = toplevel.body.concat(body);
                toplevel.end = end;
            } else {
                toplevel = new ast.TopLevel({
                    start: start,
                    body: body,
                    strict: true,
                    shebang: shebang,
                    docstring: docstring,
                    end: end
                });
            }
            function uniq(element, index, arr) {
                return arr.lastIndexOf(element) === index;
            }
            toplevel.nonlocalvars = Object.keys(S.in_scope[S.in_scope.length-1].nonlocal);
            assignments = Object.keys(S.in_scope[S.in_scope.length-1].vars);
            callables = scan_for_top_level_callables(toplevel.body).filter(uniq);
            toplevel.localvars = [];
            ՐՏitr65 = ՐՏ_Iterable(assignments);
            for (ՐՏidx65 = 0; ՐՏidx65 < ՐՏitr65.length; ՐՏidx65++) {
                item = ՐՏitr65[ՐՏidx65];
                if (!(ՐՏ_in(item, toplevel.nonlocalvars))) {
                    toplevel.localvars.push(new_symbol(ast.SymbolVar, item));
                }
            }
            toplevel.exports = toplevel.localvars.concat(callables).filter(uniq);
            toplevel.submodules = [];
            toplevel.classes = CLASS_MAP;
            toplevel.import_order = Object.keys(IMPORTED).length;
            toplevel.module_id = module_id;
            IMPORTED[module_id] = toplevel;
            toplevel.imports = IMPORTED;
            toplevel.baselib = BASELIB;
            IMPORTING[module_id] = false;
            return toplevel;
        }();
    }
    ՐՏ_modules["parser"]["NATIVE_CLASSES"] = NATIVE_CLASSES;

    ՐՏ_modules["parser"]["COMMON_STATIC"] = COMMON_STATIC;

    ՐՏ_modules["parser"]["CLASS_MAP"] = CLASS_MAP;

    ՐՏ_modules["parser"]["key"] = key;

    ՐՏ_modules["parser"]["BASELIB"] = BASELIB;

    ՐՏ_modules["parser"]["STDLIB"] = STDLIB;

    ՐՏ_modules["parser"]["UNARY_PREFIX"] = UNARY_PREFIX;

    ՐՏ_modules["parser"]["ASSIGNMENT"] = ASSIGNMENT;

    ՐՏ_modules["parser"]["STATEMENTS_WITH_LABELS"] = STATEMENTS_WITH_LABELS;

    ՐՏ_modules["parser"]["ATOMIC_START_TOKEN"] = ATOMIC_START_TOKEN;

    ՐՏ_modules["parser"]["array_to_hash"] = array_to_hash;

    ՐՏ_modules["parser"]["has_simple_decorator"] = has_simple_decorator;

    ՐՏ_modules["parser"]["parse"] = parse;
})();

(function(){
    var __name__ = "_baselib";
    var BASELIB;
    BASELIB = '"""\n**********************************************************************\n\n  A RapydScript to JavaScript compiler.\n  https://github.com/atsepkov/RapydScript\n\n  -------------------------------- (C) ---------------------------------\n\n                       Author: Alexander Tsepkov\n                         <atsepkov@pyjeon.com>\n                         http://www.pyjeon.com\n\n  Distributed under BSD license:\n    Copyright 2013 (c) Alexander Tsepkov <atsepkov@pyjeon.com>\n\n **********************************************************************\n"""\n\n\n# for convenience we\'ll use a convention here that will work as follows:\n#\n#   if function is named, assume we\'ll be outputting the function itself\n#   if the given baselib chunk is triggered\n#\n#   if function is unnamed, assume the function is a container for the logic\n#   to be output. We\'re basically ignoring the wrapper and dumping what\'s inside\n\n{\n"abs": def abs(n):\n    return Math.abs(n)\n,\n"all": def all(a):\n    for e in a:\n        if not e: return False\n    return True\n,\n"any": def any(a):\n    for e in a:\n        if e: return True\n    return False\n,\n"bin": def bin(a): return \'0b\' + (a >>> 0).toString(2)\n,\n"bind": def ՐՏ_bind(fn, thisArg):\n    if fn.orig: fn = fn.orig\n    if thisArg is False: return fn\n    ret = def():\n        return fn.apply(thisArg, arguments)\n    ret.orig = fn\n    return ret\n,\n"rebind_all": def ՐՏ_rebindAll(thisArg, rebind):\n    if rebind is undefined: rebind = True\n    for JS(\'var p in thisArg\'):\n        if thisArg[p] and thisArg[p].orig:\n            if rebind: thisArg[p] = bind(thisArg[p], thisArg)\n            else: thisArg[p] = thisArg[p].orig\n,\n"cmp": def cmp(a, b): return a < b ? -1 : a > b ? 1 : 0\n,\n"chr": def(): chr = String.fromCharCode\n,\n"dir": def dir(item):\n    # TODO: this isn\'t really representative of real Python\'s dir(), nor is it\n    # an intuitive replacement for "for ... in" loop, need to update this logic\n    # and introduce a different way of achieving "for ... in"\n    arr = []\n    for JS(\'var i in item\'): arr.push(i)\n    return arr\n,\n"enumerate": def enumerate(item):\n    arr = []\n    iter = ՐՏ_Iterable(item)\n    for i in range(iter.length):\n        arr[arr.length] = [i, item[i]]\n    return arr\n,\n"eslice": def ՐՏ_eslice(arr, step, start, end):\n    arr = arr[:]\n    if JS(\'typeof arr\') is \'string\' or isinstance(arr, String):\n        isString = True\n        arr = arr.split(\'\')\n\n    if step < 0:\n        step = -step\n        arr.reverse()\n        if JS(\'typeof start\') is not "undefined": start = arr.length - start - 1\n        if JS(\'typeof end\') is not "undefined": end = arr.length - end - 1\n    if JS(\'typeof start\') is "undefined": start = 0\n    if JS(\'typeof end\') is "undefined": end = arr.length\n\n    arr = arr.slice(start, end).filter(def(e, i): return i % step is 0;)\n    return isString ? arr.join(\'\') : arr\n,\n"extends": def ՐՏ_extends(child, parent):\n    child.prototype = Object.create(parent.prototype)\n    child.prototype.__base__ = parent     # since we don\'t support multiple inheritance, __base__ seemed more appropriate than __bases__ array of 1\n    child.prototype.constructor = child\n,\n"filter": def filter(oper, arr):\n    return arr.filter(oper)\n,\n"hex": def hex(a): return \'0x\' + (a >>> 0).toString(16)\n,\n"in": def ՐՏ_in(val, arr):\n    if JS(\'typeof arr.indexOf\') is \'function\': return arr.indexOf(val) is not -1\n    return arr.hasOwnProperty(val)\n,\n"iterable": def ՐՏ_Iterable(iterable):\n    # can\'t use Symbol.iterator yet since it\'s not supported on all platforms until ES6 (i.e. mobile browsers don\'t have it)\n    if iterable.constructor is [].constructor\n    or iterable.constructor is \'\'.constructor\n    or (tmp = Array.prototype.slice.call(iterable)).length:\n        return tmp or iterable\n    return Object.keys(iterable)    # so we can use \'for ... in\' syntax with hashes\n,\n"len": def len(obj):\n    # can\'t use Symbol.iterator yet since it\'s not supported on all platforms until ES6 (i.e. mobile browsers don\'t have it)\n    if obj.constructor is [].constructor\n    or obj.constructor is \'\'.constructor\n    or (tmp = Array.prototype.slice.call(obj)).length:\n        return (tmp or obj).length\n    return Object.keys(obj).length\n,\n"map": def map(oper, arr):\n    return arr.map(oper)\n,\n"max": def max(a):\n    return Math.max.apply(null, Array.isArray(a) ? a : arguments)\n,\n"min": def min(a):\n    return Math.min.apply(null, Array.isArray(a) ? a : arguments)\n,\n"merge": def ՐՏ_merge(target, source, overwrite):\n    for JS(\'var i in source\'):\n        # instance variables\n        if source.hasOwnProperty(i) and (overwrite or JS(\'typeof target[i]\') is \'undefined\'): target[i] = source[i]\n    for prop in Object.getOwnPropertyNames(source.prototype):\n        # methods\n        if overwrite or JS(\'typeof target.prototype[prop]\') is \'undefined\': target.prototype[prop] = source.prototype[prop]\n,\n"mixin": def ՐՏ_mixin(*classes):\n    return def(baseClass):\n        for cls in classes:\n            for key in Object.getOwnPropertyNames(cls.prototype):\n                if key not in baseClass.prototype:\n                    baseClass.prototype[key] = cls.prototype[key]\n        return baseClass\n\n,\n"print": def ՐՏ_print():\n    if JS(\'typeof console\') is \'object\': console.log.apply(console, arguments)\n,\n"range": def range(start, stop, step):\n    if arguments.length <= 1:\n        stop = start or 0\n        start = 0\n    step = arguments[2] or 1\n\n    length = Math.max(Math.ceil((stop - start) / step), 0)\n    idx = 0\n    range = Array(length)\n\n    while idx < length:\n        range[JS(\'idx++\')] = start\n        start += step\n    return range\n,\n"reduce": def reduce(f, a): return Array.reduce(a, f)\n,\n"reversed": def reversed(arr):\n    tmp = arr[:]\n    return tmp.reverse()\n,\n"sorted": def sorted(arr):\n    tmp = arr[:]\n    return tmp.sort()\n,\n"sum": def sum(arr, start=0):\n    return arr.reduce(\n        def(prev, cur): return prev+cur\n        ,\n        start\n    )\n,\n"type": def ՐՏ_type(obj):\n    return obj and obj.constructor and obj.constructor.name ? obj.constructor.name : Object.prototype.toString.call(obj).slice(8, -1)\n,\n"zip": def zip(a, b):\n    return [[a[i], b[i]] for i in range(Math.min(a.length, b.length))]\n,\n"getattr": def getattr(obj, name):\n    return obj[name]\n,\n"setattr": def setattr(obj, name, value):\n    obj[name] = value\n,\n"hasattr": def hasattr(obj, name):\n    return JS(\'name in obj\')\n,\n"eq": def ՐՏ_eq(a, b):\n    """\n    Equality comparison that works with all data types, returns true if structure and\n    contents of first object equal to those of second object\n\n    Arguments:\n        a: first object\n        b: second object\n    """\n    if a is b:\n        # simple object\n        return True\n\n    if (Array.isArray(a) and Array.isArray(b)) or (isinstance(a, Object) and isinstance(b, Object)):\n        # if length ot type doesn\'t match, they can\'t be equal\n        if a.constructor is not b.constructor or a.length is not b.length:\n            return False\n\n        if Array.isArray(a):\n            # arrays\n            for i in range(a.length):\n                if not ՐՏ_eq(a[i], b[i]):\n                    return False\n        else:\n            # hashes\n            # compare individual properties (order doesn\'t matter if it\'s a hash)\n            if Object.keys(a).length is not Object.keys(b).length: return False\n            for i in a:\n                # recursively test equality of object children\n                if not ՐՏ_eq(a[i], b[i]):\n                    return False\n        return True\n    return False\n,\n"kwargs": def():\n    # WARNING: when using this function decorator, you will not be able to use obfuscators that rename local variables\n    def kwargs(f):\n        argNames = f.toString().match(/\\(([^\\)]+)/)[1]\n        if not kwargs.memo[argNames]:\n            kwargs.memo[argNames] = argNames ? argNames.split(\',\').map(def(s): return s.trim();) : []\n        argNames = kwargs.memo[argNames]\n        return def():\n            args = [].slice.call(arguments)\n            if args.length:\n                kw = args[-1]\n                if JS(\'typeof kw\') is \'object\':\n                    for i in range(argNames.length):\n                        if argNames[i] in kw:\n                            args[i] = kw[argNames[i]]\n                else:\n                    args.push(kw)\n\n            # This logic is very fragile and very subtle, it needs to work both in ES6 and ES5, don\'t try to optimize the\n            # apply away into *args because having it in this format ensures correct \'this\' context, otherwise the function\n            # ends up unbound. Similarly, the fallthrough to except handles class creation in ES6.\n            try:\n                return f.apply(this, args)\n            except as e:\n                if /Class constructor \\w+ cannot be invoked without \'new\'/.test(e):\n                    return new f(*args)\n                raise\n    kwargs.memo = {}\n,\n\n# Errors\n# temporarily implemented via a wrapper pattern since there is no mechanism for assigning\n# classes to dictionary keys yet\n"AssertionError": def():\n    class AssertionError(Error):\n        def __init__(self, message):\n            self.name = "AssertionError"\n            self.message = message\n,\n"IndexError": def():\n    class IndexError(Error):\n        def __init__(self, message):\n            self.name = "IndexError"\n            self.message = message\n,\n"KeyError": def():\n    class KeyError(Error):\n        def __init__(self, message):\n            self.name = "KeyError"\n            self.message = message\n,\n"TypeError": def():\n    class TypeError(Error):\n        def __init__(self, message):\n            self.name = "TypeError"\n            self.message = message\n,\n"ValueError": def():\n    class ValueError(Error):\n        def __init__(self, message):\n            self.name = "ValueError"\n            self.message = message\n,\n}\n';
    ՐՏ_modules["_baselib"]["BASELIB"] = BASELIB;
})();

(function(){
    var __name__ = "output";
    var makePredicate = ՐՏ_modules["utils"].makePredicate;
    var noop = ՐՏ_modules["utils"].noop;
    var defaults = ՐՏ_modules["utils"].defaults;
    var repeat_string = ՐՏ_modules["utils"].repeat_string;
    var RAPYD_PREFIX = ՐՏ_modules["utils"].RAPYD_PREFIX;
    
    var is_identifier_char = ՐՏ_modules["tokenizer"].is_identifier_char;
    var PRECEDENCE = ՐՏ_modules["tokenizer"].PRECEDENCE;
    
    var ast = ՐՏ_modules["ast"];
    
    var _baselib = ՐՏ_modules["_baselib"];
    
    var parser = ՐՏ_modules["parser"];
    
    function Stream(options) {
        var indentation, current_col, current_line, current_pos, BUFFERS, IMPORTED, might_need_space, might_need_semicolon, last, requireSemicolonChars, space, indent, with_indent, newline, semicolon, add_mapping, tmpIndex, stack, baselibCache;
        options = defaults(options, {
            indent_start: 0,
            indent_level: 4,
            quote_keys: false,
            space_colon: true,
            ascii_only: false,
            inline_script: false,
            width: 80,
            max_line_len: 32e3,
            es6: false,
            beautify: false,
            source_map: null,
            bracketize: false,
            semicolons: true,
            comments: false,
            preserve_line: false,
            omit_baselib: false,
            baselib: null,
            private_scope: true,
            auto_bind: false,
            write_name: true
        });
        indentation = 0;
        current_col = 0;
        current_line = 1;
        current_pos = 0;
        BUFFERS = [ {
            vars: [],
            output: "",
            baselib: {}
        } ];
        IMPORTED = {};
        function to_ascii(str_, identifier) {
            return str_.replace(/[\u0080-\uffff]/g, function(ch) {
                var code;
                code = ch.charCodeAt(0).toString(16);
                if (code.length <= 2 && !identifier) {
                    while (code.length < 2) {
                        code = "0" + code;
                    }
                    return "\\x" + code;
                } else {
                    while (code.length < 4) {
                        code = "0" + code;
                    }
                    return "\\u" + code;
                }
            });
        }
        function make_string(str_, quotes) {
            var dq, sq;
            dq = 0;
            sq = 0;
            str_ = str_.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(s) {
                var tmp_;
                tmp_ = s;
                if (tmp_ === "\\") {
                    return "\\\\";
                } else if (tmp_ === "\b") {
                    return "\\b";
                } else if (tmp_ === "\f") {
                    return "\\f";
                } else if (tmp_ === "\n") {
                    return "\\n";
                } else if (tmp_ === "\t") {
                    return "\\t";
                } else if (tmp_ === "\r") {
                    return "\\r";
                } else if (tmp_ === "\u2028") {
                    return "\\u2028";
                } else if (tmp_ === "\u2029") {
                    return "\\u2029";
                } else if (tmp_ === '"') {
                    ++dq;
                    return '"';
                } else if (tmp_ === "'") {
                    ++sq;
                    return "'";
                } else if (tmp_ === "\0") {
                    return "\\0";
                }
                return s;
            });
            if (options.ascii_only) {
                str_ = to_ascii(str_);
            }
            if (quotes) {
                if (dq > sq) {
                    return "'" + str_.replace(/\x27/g, "\\'") + "'";
                } else {
                    return '"' + str_.replace(/\x22/g, '\\"') + '"';
                }
            } else {
                return str_;
            }
        }
        function encode_string(str_, quotes) {
            var ret;
            ret = make_string(str_, quotes);
            if (options.inline_script) {
                ret = ret.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
            }
            return ret;
        }
        function make_name(name) {
            name = name.toString();
            if (options.ascii_only) {
                name = to_ascii(name, true);
            }
            return name;
        }
        function make_indent(back) {
            return repeat_string(" ", options.indent_start + indentation - back * options.indent_level);
        }
        might_need_space = false;
        might_need_semicolon = false;
        last = null;
        function last_char() {
            return last.charAt(last.length - 1);
        }
        function maybe_newline() {
            if (options.max_line_len && current_col > options.max_line_len) {
                print_("\n");
            }
        }
        requireSemicolonChars = makePredicate("( [ + * / - , .");
        function print_(str_) {
            var ch, target_line, prev, a, n;
            str_ = String(str_);
            ch = str_.charAt(0);
            if (might_need_semicolon) {
                if ((!ch || !(ՐՏ_in(ch, ";}"))) && !/[;]$/.test(last)) {
                    if (options.semicolons || requireSemicolonChars(ch)) {
                        BUFFERS[BUFFERS.length-1].output += ";";
                        ++current_col;
                        ++current_pos;
                    } else {
                        BUFFERS[BUFFERS.length-1].output += "\n";
                        ++current_pos;
                        ++current_line;
                        current_col = 0;
                    }
                    if (!options.beautify) {
                        might_need_space = false;
                    }
                }
                might_need_semicolon = false;
                maybe_newline();
            }
            if (!options.beautify && options.preserve_line && stack[stack.length - 1]) {
                target_line = stack[stack.length - 1].start.line;
                while (current_line < target_line) {
                    BUFFERS[BUFFERS.length-1].output += "\n";
                    ++current_pos;
                    ++current_line;
                    current_col = 0;
                    might_need_space = false;
                }
            }
            if (might_need_space) {
                prev = last_char();
                if (is_identifier_char(prev) && (is_identifier_char(ch) || ch === "\\") || /^[\+\-\/]$/.test(ch) && ch === prev) {
                    BUFFERS[BUFFERS.length-1].output += " ";
                    ++current_col;
                    ++current_pos;
                }
                might_need_space = false;
            }
            a = str_.split(/\r?\n/);
            n = a.length - 1;
            current_line += n;
            if (n === 0) {
                current_col += a[n].length;
            } else {
                current_col = a[n].length;
            }
            current_pos += str_.length;
            last = str_;
            BUFFERS[BUFFERS.length-1].output += str_;
        }
        space = options.beautify ? function() {
            print_(" ");
        } : function() {
            might_need_space = true;
        };
        indent = options.beautify ? function(half) {
            if (options.beautify) {
                print_(make_indent(half ? .5 : 0));
            }
        } : noop;
        with_indent = options.beautify ? function(col, cont) {
            var save_indentation, ret;
            if (col === true) {
                col = next_indent();
            }
            save_indentation = indentation;
            indentation = col;
            ret = cont();
            indentation = save_indentation;
            return ret;
        } : function(col, cont) {
            return cont();
        };
        newline = options.beautify ? function() {
            print_("\n");
        } : noop;
        semicolon = options.beautify ? function() {
            print_(";");
        } : function() {
            might_need_semicolon = true;
        };
        function force_semicolon() {
            might_need_semicolon = false;
            print_(";");
        }
        function next_indent() {
            return indentation + options.indent_level;
        }
        function spaced() {
            var ՐՏitr66, ՐՏidx66, ՐՏupk9;
            var i, x;
            ՐՏitr66 = ՐՏ_Iterable(enumerate(arguments));
            for (ՐՏidx66 = 0; ՐՏidx66 < ՐՏitr66.length; ՐՏidx66++) {
                ՐՏupk9 = ՐՏitr66[ՐՏidx66];
                i = ՐՏupk9[0];
                x = ՐՏupk9[1];
                if (i > 0) {
                    space();
                }
                if (x.print) {
                    x.print(this);
                } else {
                    print_(x);
                }
            }
        }
        function addProperty(prop, val) {
            return function(obj) {
                var output;
                output = this;
                output.print("Object.defineProperty(");
                output.print(obj);
                output.comma();
                output.print_string(prop);
                output.comma();
                output.with_block(function() {
                    output.indent();
                    output.print("value");
                    output.colon();
                    output.print_string(val);
                    output.newline();
                });
                output.print(")");
            };
        }
        function addProperties(subattr, props) {
            return function(obj) {
                var output;
                output = this;
                output.print("Object.defineProperties(");
                output.print(obj);
                if (subattr) {
                    output.print("." + subattr);
                }
                output.comma();
                output.with_block(function() {
                    Object.keys(props).forEach(function(key, i) {
                        if (i) {
                            output.print(",");
                            output.newline();
                        }
                        output.indent();
                        output.print(key);
                        output.colon();
                        output.with_block(function() {
                            var ՐՏitr67, ՐՏidx67;
                            var attr;
                            ՐՏitr67 = ՐՏ_Iterable([ "enumerable", "writable" ]);
                            for (ՐՏidx67 = 0; ՐՏidx67 < ՐՏitr67.length; ՐՏidx67++) {
                                attr = ՐՏitr67[ՐՏidx67];
                                output.indent();
                                output.print(attr);
                                output.colon();
                                output.print("true");
                                output.comma();
                                output.newline();
                            }
                            output.indent();
                            output.print("value");
                            output.colon();
                            props[key](output);
                        });
                    });
                    output.newline();
                });
                output.print(")");
            };
        }
        function end_statement() {
            semicolon();
            newline();
        }
        function with_block(cont) {
            var ret;
            ret = null;
            print_("{");
            newline();
            with_indent(next_indent(), function() {
                ret = cont();
            });
            indent();
            print_("}");
            return ret;
        }
        function with_parens(cont) {
            var ret;
            print_("(");
            ret = cont();
            print_(")");
            return ret;
        }
        function with_square(cont) {
            var ret;
            print_("[");
            ret = cont();
            print_("]");
            return ret;
        }
        function comma() {
            print_(",");
            space();
        }
        function colon() {
            print_(":");
            if (options.space_colon) {
                space();
            }
        }
        add_mapping = options.source_map ? function(token, name) {
            try {
                if (token) {
                    options.source_map.add(token.file || "?", current_line, current_col, token.line, token.col, !name && token.type === "name" ? token.value : name);
                }
            } catch (ՐՏ_Exception) {
                var ex = ՐՏ_Exception;
                ast.Node.warn("Couldn't figure out mapping for {file}:{line},{col} → {cline},{ccol} [{name}]", {
                    file: token.file,
                    line: token.line,
                    col: token.col,
                    cline: current_line,
                    ccol: current_col,
                    name: name || ""
                });
            }
        } : noop;
        function get_() {
            var output, out;
            if (BUFFERS.len > 1) {
                throw new Error("Something went wrong, output generator didn't exit all of its scopes properly.");
            }
            output = this;
            if (BUFFERS[0].vars.length) {
                BUFFERS.unshift({
                    vars: [],
                    output: ""
                });
                endLocalBuffer();
            }
            out = BUFFERS[0].output;
            BUFFERS[0].output = "";
            if (options.private_scope) {
                output.with_parens(function() {
                    output.print("function()");
                    output.with_block(function() {
                        output.print('"use strict"');
                        output.end_statement();
                        output.print(out);
                    });
                });
                output.print("();");
                output.newline();
            } else {
                output.print(out);
            }
            return BUFFERS[BUFFERS.length-1].output;
        }
        function assign_var(name) {
            if (typeof name === "string") {
                print_(name);
            } else {
                name.print(this);
            }
            space();
            print_("=");
            space();
        }
        tmpIndex = {
            "itr": 0,
            "idx": 0,
            "upk": 0,
            "_": 0
        };
        function newTemp(subtype, buffer) {
            subtype = subtype === void 0 ? "_" : subtype;
            buffer = buffer === void 0 ? true : buffer;
            var tmp;
            ++tmpIndex[subtype];
            tmp = RAPYD_PREFIX + subtype + tmpIndex[subtype];
            if (buffer) {
                BUFFERS[BUFFERS.length-1].vars.push(tmp);
            }
            return tmp;
        }
        function prevTemp(subtype) {
            subtype = subtype === void 0 ? "_" : subtype;
            return RAPYD_PREFIX + subtype + tmpIndex[subtype];
        }
        function startLocalBuffer() {
            BUFFERS.push({
                vars: [],
                output: ""
            });
        }
        function endLocalBuffer(baselib) {
            baselib = baselib === void 0 ? false : baselib;
            var localBuffer;
            localBuffer = BUFFERS.pop();
            if (localBuffer.vars.length) {
                indent();
                print_("var ");
                localBuffer.vars.forEach(function(local, i) {
                    if (i) {
                        comma();
                    }
                    print_(local);
                });
                force_semicolon();
                newline();
            }
            if (baselib) {
                BUFFERS[BUFFERS.length-1].output = localBuffer.output + BUFFERS[BUFFERS.length-1].output;
            } else {
                BUFFERS[BUFFERS.length-1].output += localBuffer.output;
            }
        }
        stack = [];
        baselibCache = {};
        return {
            get: get_,
            toString: get_,
            indent: indent,
            indentation: function() {
                return indentation;
            },
            current_width: function() {
                return current_col - indentation;
            },
            should_break: function() {
                return options.width && this.current_width() >= options.width;
            },
            newline: newline,
            print: print_,
            space: space,
            comma: comma,
            colon: colon,
            last: function() {
                return last;
            },
            semicolon: semicolon,
            force_semicolon: force_semicolon,
            to_ascii: to_ascii,
            print_name: function(name) {
                print_(make_name(name));
            },
            print_string: function(str_, quotes) {
                quotes = quotes === void 0 ? true : quotes;
                print_(encode_string(str_, quotes));
            },
            next_indent: next_indent,
            with_indent: with_indent,
            with_block: with_block,
            with_parens: with_parens,
            spaced: spaced,
            end_statement: end_statement,
            addProperty: addProperty,
            startLocalBuffer: startLocalBuffer,
            endLocalBuffer: endLocalBuffer,
            addProperties: addProperties,
            with_square: with_square,
            add_mapping: add_mapping,
            assign: assign_var,
            print_baselib: function(key) {
                var ՐՏitr68, ՐՏidx68;
                var baselibAst, hash, data, item, key_, value;
                if (!options.omit_baselib) {
                    if (!Object.keys(baselibCache).length) {
                        baselibAst = parser.parse(_baselib.BASELIB, {
                            readfile: null,
                            dropDocstrings: true,
                            filename: "_baselib.pyj"
                        });
                        hash = baselibAst.body[baselibAst.body.length-1];
                        data = hash.body.properties;
                        ՐՏitr68 = ՐՏ_Iterable(data);
                        for (ՐՏidx68 = 0; ՐՏidx68 < ՐՏitr68.length; ՐՏidx68++) {
                            item = ՐՏitr68[ՐՏidx68];
                            key_ = item.key.value;
                            value = item.value.name ? [ item.value ] : item.value.body;
                            baselibCache[key_] = splatBaselib(key_, value);
                        }
                    }
                    baselibCache[key].print(this);
                }
                return null;
            },
            import: function(key) {
                if (!IMPORTED.hasOwnProperty(key)) {
                    IMPORTED[key] = key;
                    return true;
                }
                return false;
            },
            is_main: function() {
                return BUFFERS.length === 1 && BUFFERS[BUFFERS.length-1].output.length === 0;
            },
            option: function(opt) {
                return options[opt];
            },
            line: function() {
                return current_line;
            },
            col: function() {
                return current_col;
            },
            pos: function() {
                return current_pos;
            },
            push_node: function(node) {
                stack.push(node);
            },
            pop_node: function() {
                return stack.pop();
            },
            stack: function() {
                return stack;
            },
            newTemp: newTemp,
            prevTemp: prevTemp,
            parent: function(n) {
                return stack[stack.length - 2 - (n || 0)];
            }
        };
    }
    (function() {
        var SPECIAL_METHODS, BASELIB, CREATION;
        SPECIAL_METHODS = {
            "bind": "ՐՏ_bind",
            "rebind_all": "ՐՏ_rebindAll",
            "bool": "!!",
            "float": "parseFloat",
            "int": "parseInt",
            "mixin": "ՐՏ_mixin",
            "merge": "ՐՏ_merge",
            "print": "ՐՏ_print",
            "eslice": "ՐՏ_eslice",
            "type": "ՐՏ_type"
        };
        function unify(output, assign) {
            var args = [].slice.call(arguments, 2);
            var args;
            args = args.filter(function(i) {
                return i !== null;
            });
            return function(baseFn) {
                if (args.length) {
                    return function() {
                        var tmp;
                        tmp = output.newTemp();
                        if (assign) {
                            output.assign(assign);
                        }
                        output.with_parens(function() {
                            var ՐՏitr69, ՐՏidx69;
                            var arg;
                            output.assign(tmp);
                            baseFn();
                            output.comma();
                            ՐՏitr69 = ՐՏ_Iterable(args);
                            for (ՐՏidx69 = 0; ՐՏidx69 < ՐՏitr69.length; ՐՏidx69++) {
                                arg = ՐՏitr69[ՐՏidx69];
                                if (!(ՐՏ_in(arg, [ null, void 0 ]))) {
                                    arg.call(output, tmp);
                                    output.comma();
                                }
                            }
                            output.print(tmp);
                        });
                        if (assign) {
                            output.semicolon();
                        }
                    };
                } else {
                    return function() {
                        baseFn();
                    };
                }
            };
        }
        function DEFPRINT(nodetype, generator) {
            nodetype.prototype._codegen = generator;
        }
        ast.Node.prototype.print = function(stream, force_parens) {
            var self, generator;
            self = this;
            generator = self._codegen;
            stream.push_node(self);
            if (force_parens || self.needs_parens(stream)) {
                stream.with_parens(function() {
                    self.add_comments(stream);
                    self.add_source_map(stream);
                    generator(self, stream);
                });
            } else {
                self.add_comments(stream);
                self.add_source_map(stream);
                generator(self, stream);
            }
            stream.pop_node();
        };
        ast.Node.prototype.print_to_string = function(options) {
            var s;
            s = Stream(options);
            this.print(s);
            return s.get();
        };
        ast.Node.prototype.add_comments = function(output) {
            var ՐՏitr70, ՐՏidx70;
            var c, self, start, comments;
            c = output.option("comments");
            self = this;
            if (c) {
                start = self.start;
                if (start && !start._comments_dumped) {
                    start._comments_dumped = true;
                    comments = start.comments_before;
                    if (self instanceof ast.Exit && self.value && self.value.start.comments_before.length > 0) {
                        comments = (comments || []).concat(self.value.start.comments_before);
                        self.value.start.comments_before = [];
                    }
                    if (c.test) {
                        comments = comments.filter(function(comment) {
                            return c.test(comment.value);
                        });
                    } else if (typeof c === "function") {
                        comments = comments.filter(function(comment) {
                            return c(self, comment);
                        });
                    }
                    ՐՏitr70 = ՐՏ_Iterable(comments);
                    for (ՐՏidx70 = 0; ՐՏidx70 < ՐՏitr70.length; ՐՏidx70++) {
                        c = ՐՏitr70[ՐՏidx70];
                        if (c.type === "comment:line") {
                            output.print("//" + c.value + "\n");
                            output.indent();
                        } else if (c.type === "comment:multiline") {
                            output.print("/*" + c.value + "*/");
                            if (start.newline_before) {
                                output.print("\n");
                                output.indent();
                            } else {
                                output.space();
                            }
                        }
                    }
                }
            }
        };
        function PARENS(nodetype, func) {
            nodetype.prototype.needs_parens = func;
        }
        PARENS(ast.Node, function() {
            return false;
        });
        PARENS(ast.Function, function(output) {
            return first_in_statement(output);
        });
        PARENS(ast.ObjectLiteral, function(output) {
            return first_in_statement(output);
        });
        PARENS(ast.Unary, function(output) {
            var p;
            p = output.parent();
            return p instanceof ast.PropAccess && p.expression === this;
        });
        PARENS(ast.Seq, function(output) {
            var p;
            p = output.parent();
            return p instanceof ast.Unary || p instanceof ast.VarDef || p instanceof ast.Dot || p instanceof ast.ObjectProperty || p instanceof ast.Conditional;
        });
        PARENS(ast.Range, function(output) {
            return false;
        });
        PARENS(ast.Binary, function(output) {
            var p, po, pp, so, sp;
            p = output.parent();
            if (p instanceof ast.BaseCall && p.expression === this) {
                return true;
            }
            if (p instanceof ast.Unary) {
                return true;
            }
            if (p instanceof ast.PropAccess && p.expression === this) {
                return true;
            }
            if (p instanceof ast.Binary) {
                po = p.operator;
                pp = PRECEDENCE[po];
                so = this.operator;
                sp = PRECEDENCE[so];
                if (pp > sp || pp === sp && this === p.right && !(so === po && (so === "*" || so === "&&" || so === "||"))) {
                    return true;
                }
            }
        });
        PARENS(ast.PropAccess, function(output) {
            var p;
            p = output.parent();
            if (p instanceof ast.New && p.expression === this) {
                try {
                    this.walk(new ast.TreeWalker(function(node) {
                        if (node instanceof ast.BaseCall) {
                            throw p;
                        }
                    }));
                } catch (ՐՏ_Exception) {
                    var ex = ՐՏ_Exception;
                    if (ex !== p) {
                        throw ex;
                    }
                    return true;
                }
            }
        });
        PARENS(ast.BaseCall, function(output) {
            var p;
            p = output.parent();
            return p instanceof ast.New && p.expression === this;
        });
        PARENS(ast.New, function(output) {
            var p;
            p = output.parent();
            if (no_constructor_parens(this, output) && (p instanceof ast.PropAccess || p instanceof ast.BaseCall && p.expression === this)) {
                return true;
            }
        });
        PARENS(ast.Number, function(output) {
            var p;
            p = output.parent();
            if (this.getValue() < 0 && p instanceof ast.PropAccess && p.expression === this) {
                return true;
            }
        });
        PARENS(ast.NotANumber, function(output) {
            var p;
            p = output.parent();
            if (p instanceof ast.PropAccess && p.expression === this) {
                return true;
            }
        });
        function assign_and_conditional_paren_rules(output) {
            var p;
            p = output.parent();
            if (p instanceof ast.Unary) {
                return true;
            }
            if (p instanceof ast.Binary && !(p instanceof ast.Assign)) {
                return true;
            }
            if (p instanceof ast.BaseCall && p.expression === this) {
                return true;
            }
            if (p instanceof ast.Conditional && p.condition === this) {
                return true;
            }
            if (p instanceof ast.PropAccess && p.expression === this) {
                return true;
            }
        }
        PARENS(ast.Assign, assign_and_conditional_paren_rules);
        PARENS(ast.Conditional, assign_and_conditional_paren_rules);
        DEFPRINT(ast.Directive, function(self, output) {
            output.print_string(self.value);
            output.semicolon();
        });
        DEFPRINT(ast.Debugger, function(self, output) {
            output.print("debugger");
            output.semicolon();
        });
        function display_body(body, is_toplevel, output) {
            var last;
            last = body.length - 1;
            body.forEach(function(stmt, i) {
                if (!(stmt instanceof ast.EmptyStatement) && !(stmt instanceof ast.Definitions)) {
                    output.indent();
                    stmt.print(output);
                    if (!(i === last && is_toplevel)) {
                        output.newline();
                    }
                }
            });
        }
        function bind_methods(methods, output) {
            var arg;
            for (arg in methods) {
                output.indent();
                output.print("this.");
                output.assign(arg);
                output.print("ՐՏ_bind");
                output.with_parens(function() {
                    output.print("this." + arg);
                    output.comma();
                    output.print("this");
                });
                output.end_statement();
            }
        }
        function write_imports(module_, output) {
            var ՐՏitr71, ՐՏidx71, ՐՏitr72, ՐՏidx72, ՐՏitr73, ՐՏidx73, ՐՏitr74, ՐՏidx74, ՐՏitr75, ՐՏidx75;
            var imports, import_id, nonlocalvars, name;
            imports = [];
            ՐՏitr71 = ՐՏ_Iterable(Object.keys(module_.imports));
            for (ՐՏidx71 = 0; ՐՏidx71 < ՐՏitr71.length; ՐՏidx71++) {
                import_id = ՐՏitr71[ՐՏidx71];
                imports.push(module_.imports[import_id]);
            }
            imports.sort(function(a, b) {
                var ՐՏupk10;
                ՐՏupk10 = [ a.import_order, b.import_order ];
                a = ՐՏupk10[0];
                b = ՐՏupk10[1];
                return a < b ? -1 : a > b ? 1 : 0;
            });
            if (imports.length > 1) {
                output.indent();
                output.spaced("var ՐՏ_modules", "=", "{};");
                output.newline();
            }
            nonlocalvars = {};
            ՐՏitr72 = ՐՏ_Iterable(imports);
            for (ՐՏidx72 = 0; ՐՏidx72 < ՐՏitr72.length; ՐՏidx72++) {
                module_ = ՐՏitr72[ՐՏidx72];
                ՐՏitr73 = ՐՏ_Iterable(module_.nonlocalvars);
                for (ՐՏidx73 = 0; ՐՏidx73 < ՐՏitr73.length; ՐՏidx73++) {
                    name = ՐՏitr73[ՐՏidx73];
                    nonlocalvars[name] = true;
                }
            }
            nonlocalvars = Object.getOwnPropertyNames(nonlocalvars).join(", ");
            if (nonlocalvars.length) {
                output.indent();
                output.print("var " + nonlocalvars);
                output.end_statement();
            }
            ՐՏitr74 = ՐՏ_Iterable(imports);
            for (ՐՏidx74 = 0; ՐՏidx74 < ՐՏitr74.length; ՐՏidx74++) {
                module_ = ՐՏitr74[ՐՏidx74];
                if (module_.module_id !== "__main__") {
                    output.indent();
                    output.assign('ՐՏ_modules["' + module_.module_id + '"]');
                    output.print("{}");
                    output.end_statement();
                }
            }
            ՐՏitr75 = ՐՏ_Iterable(imports);
            for (ՐՏidx75 = 0; ՐՏidx75 < ՐՏitr75.length; ՐՏidx75++) {
                module_ = ՐՏitr75[ՐՏidx75];
                if (module_.module_id !== "__main__") {
                    print_module(module_, output);
                }
            }
        }
        function write_main_name(output) {
            if (output.option("write_name")) {
                output.newline();
                output.indent();
                output.spaced("var __name__", "=", '"__main__"');
                output.end_statement();
            }
        }
        function display_complex_body(node, is_toplevel, output) {
            var offset, needsSuper, delaySelfAssignment, arg;
            output.startLocalBuffer();
            offset = 0;
            needsSuper = false;
            delaySelfAssignment = false;
            if (output.option("es6") && node instanceof ast.Constructor && node.parent) {
                if (node.callsSuper) {
                    delaySelfAssignment = true;
                } else {
                    needsSuper = true;
                }
            }
            if (node instanceof ast.Method && !node.static && !delaySelfAssignment) {
                if (needsSuper) {
                    output.indent();
                    output.print("super()");
                    output.end_statement();
                }
                output.indent();
                output.spaced("var", node.argnames[0], "=", "this");
                output.end_statement();
                ++offset;
            }
            if (node instanceof ast.Scope) {
                if (node.argnames) {
                    if (node.argnames.starargs) {
                        output.indent();
                        output.spaced("var", node.argnames.starargs, "=", "[].slice.call");
                        output.with_parens(function() {
                            output.print("arguments");
                            output.comma();
                            output.print(node.argnames.length - offset);
                        });
                        output.end_statement();
                    }
                    if (!output.option("es6")) {
                        for (arg in node.argnames.defaults) {
                            output.indent();
                            output.spaced(arg, "=", arg, "===", "void 0", "?");
                            output.space();
                            force_statement(node.argnames.defaults[arg], output);
                            output.space();
                            output.colon();
                            output.print(arg);
                            output.end_statement();
                        }
                    }
                }
                if (output.option("auto_bind") && node.name && node.name.name === "__init__") {
                    output.indent();
                    output.print("ՐՏ_rebindAll");
                    output.with_parens(function() {
                        output.print("this");
                        output.comma();
                        output.print("true");
                    });
                    output.end_statement();
                    bind_methods(node.bound, output);
                }
                declare_vars(node.localvars, output);
            } else if (node instanceof ast.Except) {
                if (node.argname) {
                    output.indent();
                    output.print("var ");
                    output.assign(node.argname);
                    output.print("ՐՏ_Exception");
                    output.end_statement();
                }
            }
            display_body(node.body, is_toplevel, output);
            output.endLocalBuffer();
        }
        function declare_vars(vars, output) {
            if (vars.length) {
                output.indent();
                output.print("var ");
                vars.forEach(function(arg, i) {
                    if (i) {
                        output.comma();
                    }
                    arg.print(output);
                });
                output.end_statement();
            }
        }
        function declare_exports(module_id, exports, submodules, output) {
            var ՐՏitr76, ՐՏidx76, ՐՏitr77, ՐՏidx77;
            var seen, symbol, sub_module_id, key;
            seen = {};
            ՐՏitr76 = ՐՏ_Iterable(exports);
            for (ՐՏidx76 = 0; ՐՏidx76 < ՐՏitr76.length; ՐՏidx76++) {
                symbol = ՐՏitr76[ՐՏidx76];
                output.newline();
                output.indent();
                output.print('ՐՏ_modules["' + module_id + '"]["' + symbol.name + '"] = ' + symbol.name);
                seen[symbol.name] = true;
                output.end_statement();
            }
            ՐՏitr77 = ՐՏ_Iterable(submodules);
            for (ՐՏidx77 = 0; ՐՏidx77 < ՐՏitr77.length; ՐՏidx77++) {
                sub_module_id = ՐՏitr77[ՐՏidx77];
                if (!seen.hasOwnProperty(module_id)) {
                    key = sub_module_id.split(".")[sub_module_id.split(".").length-1];
                    output.newline();
                    output.indent();
                    output.print('ՐՏ_modules["' + module_id + '"]["' + key + '"] = ');
                    output.print('ՐՏ_modules["' + sub_module_id + '"]');
                    output.end_statement();
                }
            }
        }
        function unpack_tuple(tuple, output, in_statement) {
            tuple.elements.forEach(function(elem, i) {
                output.indent();
                output.assign(elem);
                output.print(output.prevTemp("upk"));
                output.with_square(function() {
                    output.print(i);
                });
                if (!in_statement || i < tuple.elements.length - 1) {
                    output.end_statement();
                }
            });
        }
        function cacheBubble(operand, output) {
            var tmp;
            if (!(operand instanceof ast.SymbolRef || operand instanceof ast.SymbolClassRef)) {
                tmp = output.newTemp();
                output.with_parens(function() {
                    output.spaced(tmp, "=", operand);
                });
                return {
                    print: function(output) {
                        output.print(tmp);
                    }
                };
            }
            operand.print(output);
            return operand;
        }
        ast.StatementWithBody.prototype._do_print_body = function(output) {
            force_statement(this.body, output);
        };
        DEFPRINT(ast.Statement, function(self, output) {
            self.body.print(output);
            output.semicolon();
        });
        BASELIB = {};
        DEFPRINT(ast.TopLevel, function(self, output) {
            var is_main;
            is_main = output.is_main();
            BASELIB = self.baselib;
            if (output.option("private_scope") && is_main) {
                write_imports(self, output);
                output.newline();
                output.with_parens(function() {
                    output.print("function()");
                    output.with_block(function() {
                        write_main_name(output);
                        output.newline();
                        display_complex_body(self, true, output);
                        output.newline();
                    });
                });
                output.print("();");
                output.newline();
            } else {
                if (is_main) {
                    write_imports(self, output);
                    write_main_name(output);
                }
                if (self.strict) {
                    declare_vars(self.localvars, output);
                }
                display_body(self.body, true, output);
            }
            if (is_main) {
                output.startLocalBuffer();
                Object.keys(BASELIB).filter(function(a) {
                    return self.baselib[a] > 0;
                }).forEach(function(key) {
                    output.print_baselib(key);
                });
                output.endLocalBuffer(true);
            }
        });
        function print_module(self, output) {
            output.newline();
            output.indent();
            output.with_parens(function() {
                output.print("function()");
                output.with_block(function() {
                    output.indent();
                    output.assign("var __name__");
                    output.print('"' + self.module_id + '"');
                    output.end_statement();
                    declare_vars(self.localvars, output);
                    display_body(self.body, true, output);
                    declare_exports(self.module_id, self.exports, self.submodules, output);
                });
            });
            output.print("()");
            output.end_statement();
        }
        DEFPRINT(ast.Splat, function(self, output) {
            if (output.import(self.module.name)) {
                display_body(self.body.body, true, output);
                output.newline();
            }
        });
        DEFPRINT(ast.Imports, function(container, output) {
            var ՐՏitr78, ՐՏidx78, ՐՏitr79, ՐՏidx79;
            var self, argname, alias, bound_name;
            function add_aname(aname, key, from_import) {
                output.assign("var " + aname);
                output.print('ՐՏ_modules["' + key + '"]');
                if (from_import) {
                    output.print("." + from_import);
                }
                output.end_statement();
                output.indent();
            }
            ՐՏitr78 = ՐՏ_Iterable(container.imports);
            for (ՐՏidx78 = 0; ՐՏidx78 < ՐՏitr78.length; ՐՏidx78++) {
                self = ՐՏitr78[ՐՏidx78];
                output.import(self.module.name);
                if (self.argnames) {
                    ՐՏitr79 = ՐՏ_Iterable(self.argnames);
                    for (ՐՏidx79 = 0; ՐՏidx79 < ՐՏitr79.length; ՐՏidx79++) {
                        argname = ՐՏitr79[ՐՏidx79];
                        alias = argname.alias ? argname.alias.name : argname.name;
                        add_aname(alias, self.key, argname.name);
                    }
                } else {
                    if (self.alias) {
                        add_aname(self.alias.name, self.key, false);
                    } else {
                        bound_name = self.key.split(".", 1)[0];
                        add_aname(bound_name, bound_name, false);
                    }
                }
            }
        });
        DEFPRINT(ast.LabeledStatement, function(self, output) {
            self.label.print(output);
            output.colon();
            self.body.print(output);
        });
        DEFPRINT(ast.SimpleStatement, function(self, output) {
            if (!(self.body instanceof ast.EmptyStatement)) {
                self.body.print(output);
                output.semicolon();
            }
        });
        function print_bracketed(node, output, complex) {
            if (node.body.length) {
                output.with_block(function() {
                    if (complex) {
                        display_complex_body(node, false, output);
                    } else {
                        display_body(node.body, false, output);
                    }
                });
            } else {
                output.print("{}");
            }
        }
        DEFPRINT(ast.BlockStatement, function(self, output) {
            print_bracketed(self, output);
        });
        DEFPRINT(ast.EmptyStatement, function(self, output) {
        });
        DEFPRINT(ast.Do, function(self, output) {
            output.print("do");
            output.space();
            self._do_print_body(output);
            output.space();
            output.print("while");
            output.space();
            output.with_parens(function() {
                self.condition.print(output);
            });
            output.semicolon();
        });
        DEFPRINT(ast.While, function(self, output) {
            output.print("while");
            output.space();
            output.with_parens(function() {
                self.condition.print(output);
            });
            output.space();
            self._do_print_body(output);
        });
        function is_simple_for_in(self) {
            if (self.object instanceof ast.BaseCall && self.object.expression instanceof ast.SymbolRef && self.object.expression.name === "dir" && self.object.args.length === 1) {
                return true;
            }
            return false;
        }
        function is_simple_for(self) {
            if (self.object instanceof ast.BaseCall && self.object.expression instanceof ast.SymbolRef && self.object.expression.name === "range" && !(self.init instanceof ast.Array) && (self.object.args.length < 3 || self.object.args[self.object.args.length-1][0] instanceof ast.Number || self.object.args[self.object.args.length-1][0] instanceof ast.Unary && self.object.args[self.object.args.length-1][0].operator === "-" && self.object.args[self.object.args.length-1][0].expression instanceof ast.Number)) {
                return true;
            }
            return false;
        }
        ast.ForIn.prototype._do_print_body = function(output) {
            var self;
            self = this;
            output.with_block(function() {
                var iterator, index, unpack;
                if (!(is_simple_for(self) || is_simple_for_in(self))) {
                    output.indent();
                    iterator = output.prevTemp("itr");
                    index = output.prevTemp("idx");
                    if (self.init instanceof ast.Array) {
                        if (output.option("es6")) {
                            output.with_square(function() {
                                self.init.elements.forEach(function(element, index) {
                                    if (index) output.comma();
                                    element.print(output);
                                });
                            });
                            output.space();
                            output.print("=");
                            output.space();
                            output.print(iterator + "[" + index + "];");
                            output.newline();
                        } else {
                            unpack = output.newTemp("upk");
                            output.assign(unpack);
                            output.print(iterator + "[" + index + "];");
                            output.newline();
                            unpack_tuple(self.init, output);
                        }
                    } else {
                        output.assign(self.init);
                        output.print(iterator + "[" + index + "];");
                        output.newline();
                    }
                }
                self.body.body.forEach(function(stmt, i) {
                    output.indent();
                    stmt.print(output);
                    output.newline();
                });
            });
        };
        DEFPRINT(ast.ForIn, function(self, output) {
            var increment, args, tmp_, start, end, iterator;
            if (is_simple_for(self)) {
                increment = null;
                args = self.object.args;
                tmp_ = args.length;
                if (tmp_ === 1) {
                    start = 0;
                    end = args[0];
                } else if (tmp_ === 2) {
                    start = args[0];
                    end = args[1];
                } else if (tmp_ === 3) {
                    start = args[0];
                    end = args[1];
                    increment = args[2];
                }
                output.print("for");
                output.space();
                output.with_parens(function() {
                    output.assign(self.init);
                    start.print ? start.print(output) : output.print(start);
                    output.semicolon();
                    output.space();
                    self.init.print(output);
                    output.space();
                    increment instanceof ast.Unary ? output.print(">") : output.print("<");
                    output.space();
                    end.print(output);
                    output.semicolon();
                    output.space();
                    self.init.print(output);
                    if (increment && (!(increment instanceof ast.Unary) || increment.expression.value !== "1")) {
                        if (increment instanceof ast.Unary) {
                            output.print("-=");
                            increment.expression.print(output);
                        } else {
                            output.print("+=");
                            increment.print(output);
                        }
                    } else {
                        if (increment instanceof ast.Unary) {
                            output.print("--");
                        } else {
                            output.print("++");
                        }
                    }
                });
            } else if (is_simple_for_in(self)) {
                output.print("for");
                output.space();
                output.with_parens(function() {
                    output.spaced(self.init, "in", self.object.args[0]);
                });
            } else {
                iterator = output.newTemp("itr");
                output.assign(iterator);
                output.print("ՐՏ_Iterable");
                output.with_parens(function() {
                    self.object.print(output);
                });
                output.end_statement();
                output.indent();
                output.print("for");
                output.space();
                output.with_parens(function() {
                    var index;
                    index = output.newTemp("idx");
                    output.assign(index);
                    output.print("0");
                    output.semicolon();
                    output.space();
                    output.spaced(index, "<", iterator + ".length");
                    output.semicolon();
                    output.space();
                    output.print(index + "++");
                });
            }
            output.space();
            self._do_print_body(output);
        });
        ast.ForJS.prototype._do_print_body = function(output) {
            var self;
            self = this;
            output.with_block(function() {
                self.body.body.forEach(function(stmt, i) {
                    output.indent();
                    stmt.print(output);
                    output.newline();
                });
            });
        };
        DEFPRINT(ast.ForJS, function(self, output) {
            output.print("for");
            output.space();
            output.with_parens(function() {
                self.condition.print(output);
            });
            output.space();
            self._do_print_body(output);
        });
        DEFPRINT(ast.ListComprehension, function(self, output) {
            var constructor, iterator, index, result, add_entry;
            constructor = {
                ListComprehension: "[]",
                DictComprehension: "{}"
            }[ՐՏ_type(self)];
            iterator = output.newTemp("itr", false);
            index = output.newTemp("idx", false);
            result = RAPYD_PREFIX + "res";
            if (self instanceof ast.DictComprehension) {
                add_entry = function() {
                    output.indent();
                    output.print(result);
                    output.with_square(function() {
                        self.statement.print(output);
                    });
                    output.assign("");
                    self.value_statement.print(output);
                    output.end_statement();
                };
            } else {
                add_entry = function() {
                    output.indent();
                    output.print(result + ".push");
                    output.with_parens(function() {
                        self.statement.print(output);
                    });
                    output.end_statement();
                };
            }
            output.with_parens(function() {
                output.print("function");
                output.print("()");
                output.space();
                output.with_block(function() {
                    output.indent();
                    output.print("var " + index);
                    output.comma();
                    output.assign(iterator);
                    output.print("ՐՏ_Iterable");
                    output.with_parens(function() {
                        self.object.print(output);
                    });
                    output.comma();
                    output.assign(result);
                    output.print(constructor);
                    if (self.init instanceof ast.Array) {
                        self.init.elements.forEach(function(i) {
                            output.comma();
                            i.print(output);
                        });
                    } else {
                        output.comma();
                        self.init.print(output);
                    }
                    output.semicolon();
                    output.newline();
                    output.indent();
                    output.print("for");
                    output.space();
                    output.with_parens(function() {
                        output.spaced(index, "=", "0");
                        output.semicolon();
                        output.space();
                        output.spaced(index, "<", iterator + ".length");
                        output.semicolon();
                        output.space();
                        output.print(index + "++");
                    });
                    output.space();
                    output.with_block(function() {
                        output.indent();
                        if (self.init instanceof ast.Array) {
                            if (output.option("es6")) {
                                output.with_square(function() {
                                    self.init.elements.forEach(function(element, index) {
                                        if (index) output.comma();
                                        element.print(output);
                                    });
                                });
                                output.space();
                                output.print("=");
                                output.space();
                            } else {
                                output.assign(output.newTemp("upk"));
                            }
                            output.print(iterator + "[" + index + "];");
                            output.newline();
                            if (!output.option("es6")) {
                                unpack_tuple(self.init, output);
                            }
                        } else {
                            output.assign(self.init);
                            output.print(iterator + "[" + index + "];");
                            output.newline();
                        }
                        if (self.condition) {
                            output.indent();
                            output.print("if");
                            output.space();
                            output.with_parens(function() {
                                self.condition.print(output);
                            });
                            output.space();
                            output.with_block(function() {
                                add_entry();
                            });
                            output.newline();
                        } else {
                            add_entry();
                        }
                    });
                    output.newline();
                    output.indent();
                    output.print("return " + result);
                    output.end_statement();
                });
            });
            output.print("()");
        });
        DEFPRINT(ast.With, function(self, output) {
            output.print("with");
            output.space();
            output.with_parens(function() {
                self.expression.print(output);
            });
            output.space();
            self._do_print_body(output);
        });
        function decorate(decorators, output, internalsub) {
            var pos, wrap;
            pos = 0;
            wrap = function() {
                if (pos < decorators.length) {
                    decorators[pos].expression.print(output);
                    ++pos;
                    output.with_parens(function() {
                        wrap();
                    });
                } else {
                    internalsub();
                }
            };
            wrap();
        }
        function decorated(decorators, output) {
            return function(baseFn) {
                return function() {
                    decorate(decorators, output, baseFn);
                };
            };
        }
        ast.Lambda.prototype._do_print = function(output, nokeyword) {
            var ՐՏ_121;
            var self, name;
            self = this;
            function addDecorators() {
                if (self.decorators && self.decorators.length) {
                    return function(obj) {
                        var output;
                        output = this;
                        output.assign(obj);
                        decorate(self.decorators, output, function() {
                            output.print(obj);
                        });
                    };
                }
                return null;
            }
            function addDocstring() {
                if (self.docstring) {
                    return function(obj) {
                        var output;
                        output = this;
                        output.addProperty("__doc__", self.docstring).call(output, obj);
                    };
                }
                return null;
            }
            name = null;
            if (self.name) {
                name = "var " + self.name.name;
            }
            
            var internalsub = (ՐՏ_121 = function internalsub() {
                if (!nokeyword) {
                    output.print("function");
                    if (self.generator) {
                        output.print("*");
                    }
                }
                if (self.name) {
                    output.space();
                    self.name.print(output);
                }
                output.with_parens(function() {
                    self.argnames.forEach(function(arg, i) {
                        if (i) {
                            output.comma();
                        }
                        arg.print(output);
                        if (output.option("es6") && self.argnames.defaults[arg.name]) {
                            output.print("=");
                            self.argnames.defaults[arg.name].print(output);
                        }
                    });
                    if (self.kwargs) {
                        if (self.argnames.length) {
                            output.comma();
                        }
                        output.print("ՐՏ_kw");
                    }
                });
                output.space();
                print_bracketed(self, output, true);
            }, ՐՏ_121 = unify(output, name, addDecorators(), addDocstring())(ՐՏ_121), ՐՏ_121);
            internalsub();
        };
        DEFPRINT(ast.Lambda, function(self, output) {
            self._do_print(output);
        });
        ast.Class.prototype._do_print = function(output) {
            var self, name, generateClass;
            self = this;
            if (self.external) {
                return;
            }
            function addDecorators() {
                if (self.decorators && self.decorators.length) {
                    return function(obj) {
                        var ՐՏitr80, ՐՏidx80;
                        var output, stmt, funcName;
                        output = this;
                        output.assign(obj);
                        decorate(self.decorators, output, function() {
                            output.print(obj);
                        });
                        if (output.option("es6")) {
                            ՐՏitr80 = ՐՏ_Iterable(self.body);
                            for (ՐՏidx80 = 0; ՐՏidx80 < ՐՏitr80.length; ՐՏidx80++) {
                                stmt = ՐՏitr80[ՐՏidx80];
                                if (stmt instanceof ast.Lambda && stmt.decorators && stmt.decorators.length) {
                                    funcName = obj + ".prototype." + stmt.name.name;
                                    output.comma();
                                    output.assign(funcName);
                                    decorate(stmt.decorators, output, function() {
                                        output.print(funcName);
                                    });
                                }
                            }
                        }
                    };
                }
                return null;
            }
            name = null;
            if (self.name) {
                name = "var " + self.name.name;
            }
            function outputEs6() {
                var ՐՏ_122;
                function addClassVariables() {
                    var properties;
                    properties = {};
                    if (self.docstring) {
                        properties["__doc__"] = function(output) {
                            output.print_string(self.docstring);
                        };
                    }
                    self.body.forEach(function(stmt, i) {
                        if (stmt instanceof ast.SimpleStatement && stmt.body instanceof ast.Assign && stmt.body.operator === "=") {
                            properties[stmt.body.left.name] = function(output) {
                                stmt.body.right.print(output);
                                output.newline();
                            };
                        }
                    });
                    if (Object.keys(properties).length) {
                        return output.addProperties("prototype", properties);
                    }
                    return null;
                }
                
                var generateClass = (ՐՏ_122 = function generateClass() {
                    output.print("class");
                    if (self.name) {
                        output.space();
                        self.name.print(output);
                    }
                    if (self.parent) {
                        output.space();
                        output.print("extends");
                        output.space();
                        self.parent.print(output);
                    }
                    output.space();
                    output.with_block(function() {
                        self.body.forEach(function(stmt, i) {
                            if (stmt instanceof ast.Lambda) {
                                output.indent();
                                if (stmt.static) {
                                    output.print("static");
                                    output.space();
                                }
                                if (stmt.name.name === "__init__") {
                                    output.print("constructor");
                                } else {
                                    if (stmt instanceof ast.ObjectGetter) {
                                        output.print("get ");
                                    } else if (stmt instanceof ast.ObjectSetter) {
                                        output.print("set ");
                                    }
                                    stmt.name.print(output);
                                }
                                output.space();
                                output.with_parens(function() {
                                    stmt.argnames.forEach(function(arg, i) {
                                        if (ՐՏ_in(name, self.static)) {
                                            ++i;
                                        }
                                        if (i > 1) {
                                            output.comma();
                                        }
                                        if (i) {
                                            arg.print(output);
                                        }
                                        if (stmt.argnames.defaults[arg.name]) {
                                            output.print("=");
                                            stmt.argnames.defaults[arg.name].print(output);
                                        }
                                    });
                                    if (self.kwargs) {
                                        if (self.argnames.length) {
                                            output.comma();
                                        }
                                        output.print("ՐՏ_kw");
                                    }
                                });
                                output.space();
                                print_bracketed(stmt, output, true);
                                output.newline();
                            }
                        });
                    });
                }, ՐՏ_122 = unify(output, name, addDecorators(), addClassVariables())(ՐՏ_122), ՐՏ_122);
                return generateClass;
            }
            function outputEs5() {
                var ՐՏupk11, ՐՏ_123;
                var methodsAndVars, staticmethods;
                function define_method(stmt) {
                    return function(output) {
                        var name;
                        name = stmt.name.name;
                        function internalsub() {
                            output.print("function");
                            output.space();
                            output.print(name);
                            output.with_parens(function() {
                                stmt.argnames.forEach(function(arg, i) {
                                    if (ՐՏ_in(name, self.static)) {
                                        ++i;
                                    }
                                    if (i > 1) {
                                        output.comma();
                                    }
                                    if (i) {
                                        arg.print(output);
                                    }
                                });
                                if (self.kwargs) {
                                    if (self.argnames.length) {
                                        output.comma();
                                    }
                                    output.print("ՐՏ_kw");
                                }
                            });
                            print_bracketed(stmt, output, true);
                        }
                        if (stmt.decorators && stmt.decorators.length) {
                            decorate(stmt.decorators, output, internalsub);
                        } else {
                            internalsub();
                        }
                        output.newline();
                    };
                }
                function addInheritance() {
                    if (self.parent) {
                        return function(obj) {
                            var output;
                            output = this;
                            output.print("ՐՏ_extends");
                            output.with_parens(function() {
                                output.print(obj);
                                output.comma();
                                self.parent.print(output);
                            });
                        };
                    }
                    return null;
                }
                function addMethods() {
                    var methodsAndVars, staticMethods, methodAndOutput, methodAndVarOutput, staticMethodOutput;
                    methodsAndVars = {};
                    staticMethods = {};
                    if (self.docstring) {
                        methodsAndVars["__doc__"] = function(output) {
                            output.print_string(self.docstring);
                        };
                    }
                    self.body.forEach(function(stmt, i) {
                        if (stmt instanceof ast.Method) {
                            if (stmt.static) {
                                staticMethods[stmt.name.name] = define_method(stmt);
                            } else {
                                methodsAndVars[stmt.name.name] = define_method(stmt);
                            }
                        } else if (stmt instanceof ast.SimpleStatement && stmt.body instanceof ast.Assign && stmt.body.operator === "=") {
                            methodsAndVars[stmt.body.left.name] = function(output) {
                                stmt.body.right.print(output);
                            };
                        } else if (stmt instanceof ast.Class) {
                            console.error("Nested classes aren't supported yet");
                        }
                    });
                    methodAndOutput = null;
                    if (Object.keys(methodsAndVars).length) {
                        methodAndVarOutput = output.addProperties("prototype", methodsAndVars);
                    }
                    staticMethodOutput = null;
                    if (Object.keys(staticMethods).length) {
                        staticMethodOutput = output.addProperties(null, staticMethods);
                    }
                    return [methodAndVarOutput, staticMethodOutput];
                }
                ՐՏupk11 = addMethods();
                methodsAndVars = ՐՏupk11[0];
                staticmethods = ՐՏupk11[1];
                
                var generateClass = (ՐՏ_123 = function generateClass() {
                    if (self.init || self.parent || self.statements.length) {
                        output.print("function");
                        output.space();
                        self.name.print(output);
                        output.print("()");
                        output.space();
                        output.with_block(function() {
                            var cname;
                            bind_methods(self.bound, output);
                            if (self.init || self.parent) {
                                output.indent();
                                cname = self.init ? self.name : self.parent;
                                cname.print(output);
                                output.print(".prototype.__init__.apply");
                                output.with_parens(function() {
                                    output.print("this");
                                    output.comma();
                                    output.print("arguments");
                                });
                                output.end_statement();
                            }
                        });
                    } else {
                        output.print("function");
                        output.space();
                        self.name.print(output);
                        output.print("()");
                        output.space();
                        output.with_block(function() {
                            bind_methods(self.bound, output);
                        });
                    }
                }, ՐՏ_123 = unify(output, name, addInheritance(), addDecorators(), methodsAndVars, staticmethods)(ՐՏ_123), ՐՏ_123);
                return generateClass;
            }
            if (output.option("es6")) {
                generateClass = outputEs6();
            } else {
                generateClass = outputEs5();
            }
            generateClass();
        };
        DEFPRINT(ast.Class, function(self, output) {
            self._do_print(output);
        });
        DEFPRINT(ast.SymbolClassRef, function(self, output) {
            self.class.print(output);
            output.print(".prototype." + self.name);
        });
        ast.Exit.prototype._do_print = function(output, kind) {
            var self;
            self = this;
            output.print(kind);
            if (self.value) {
                output.space();
                self.value.print(output);
            }
            output.semicolon();
        };
        DEFPRINT(ast.Return, function(self, output) {
            self._do_print(output, "return");
        });
        DEFPRINT(ast.Yield, function(self, output) {
            self._do_print(output, "yield");
        });
        DEFPRINT(ast.Throw, function(self, output) {
            self._do_print(output, "throw");
        });
        ast.LoopControl.prototype._do_print = function(output, kind) {
            output.print(kind);
            if (this.label) {
                output.space();
                this.label.print(output);
            }
            output.semicolon();
        };
        DEFPRINT(ast.Break, function(self, output) {
            self._do_print(output, "break");
        });
        DEFPRINT(ast.Continue, function(self, output) {
            self._do_print(output, "continue");
        });
        function make_then(self, output) {
            var body;
            if (output.option("bracketize")) {
                make_block(self.body, output);
                return;
            }
            if (!self.body) {
                return output.force_semicolon();
            }
            body = self.body;
            while (true) {
                if (body instanceof ast.If) {
                    if (!body.alternative) {
                        make_block(self.body, output);
                        return;
                    }
                    body = body.alternative;
                } else if (body instanceof ast.StatementWithBody) {
                    body = body.body;
                } else {
                    break;
                }
            }
            force_statement(self.body, output);
        }
        DEFPRINT(ast.If, function(self, output) {
            output.print("if");
            output.space();
            output.with_parens(function() {
                self.condition.print(output);
            });
            output.space();
            if (self.alternative) {
                make_then(self, output);
                output.space();
                output.print("else");
                output.space();
                force_statement(self.alternative, output);
            } else {
                self._do_print_body(output);
            }
        });
        DEFPRINT(ast.Switch, function(self, output) {
            output.print("switch");
            output.space();
            output.with_parens(function() {
                self.expression.print(output);
            });
            output.space();
            if (self.body.length > 0) {
                output.with_block(function() {
                    self.body.forEach(function(stmt, i) {
                        if (i) {
                            output.newline();
                        }
                        output.indent(true);
                        stmt.print(output);
                    });
                });
            } else {
                output.print("{}");
            }
        });
        ast.SwitchBranch.prototype._do_print_body = function(output) {
            if (this.body.length > 0) {
                output.newline();
                this.body.forEach(function(stmt) {
                    output.indent();
                    stmt.print(output);
                    output.newline();
                });
            }
        };
        DEFPRINT(ast.Default, function(self, output) {
            output.print("default:");
            self._do_print_body(output);
        });
        DEFPRINT(ast.Case, function(self, output) {
            output.print("case");
            output.space();
            self.expression.print(output);
            output.print(":");
            self._do_print_body(output);
        });
        DEFPRINT(ast.Try, function(self, output) {
            output.print("try");
            output.space();
            print_bracketed(self, output);
            if (self.bcatch) {
                output.space();
                self.bcatch.print(output);
            }
            if (self.bfinally) {
                output.space();
                self.bfinally.print(output);
            }
        });
        DEFPRINT(ast.Catch, function(self, output) {
            output.print("catch");
            output.space();
            output.with_parens(function() {
                output.print("ՐՏ_Exception");
            });
            output.space();
            if (self.body.length > 1 || self.body[0].errors.length) {
                output.with_block(function() {
                    var no_default;
                    output.indent();
                    no_default = true;
                    self.body.forEach(function(exception, i) {
                        var no_default;
                        if (i) {
                            output.print("else ");
                        }
                        if (exception.errors.length) {
                            output.print("if");
                            output.space();
                            output.with_parens(function() {
                                exception.errors.forEach(function(err, i) {
                                    if (i) {
                                        output.newline();
                                        output.indent();
                                        output.print("||");
                                        output.space();
                                    }
                                    output.spaced("ՐՏ_Exception", "instanceof", err);
                                });
                            });
                            output.space();
                        } else {
                            no_default = false;
                        }
                        print_bracketed(exception, output, true);
                        output.space();
                    });
                    if (no_default) {
                        output.print("else");
                        output.space();
                        output.with_block(function() {
                            output.indent();
                            output.spaced("throw", "ՐՏ_Exception");
                            output.end_statement();
                        });
                    }
                    output.newline();
                });
            } else {
                print_bracketed(self.body[0], output, true);
            }
        });
        DEFPRINT(ast.Finally, function(self, output) {
            output.print("finally");
            output.space();
            print_bracketed(self, output);
        });
        ast.Definitions.prototype._do_print = function(output, kind) {
            var p, in_for, avoid_semicolon;
            output.print(kind);
            output.space();
            this.definitions.forEach(function(def_, i) {
                if (i) {
                    output.comma();
                }
                def_.print(output);
            });
            p = output.parent();
            in_for = p instanceof ast.ForIn;
            avoid_semicolon = in_for && p.init === this;
            if (!avoid_semicolon) {
                output.semicolon();
            }
        };
        DEFPRINT(ast.Var, function(self, output) {
            self._do_print(output, "var");
        });
        DEFPRINT(ast.Const, function(self, output) {
            self._do_print(output, "const");
        });
        function parenthesize_for_noin(node, output, noin) {
            if (!noin) {
                node.print(output);
            } else {
                try {
                    node.walk(new ast.TreeWalker(function(node) {
                        if (node instanceof ast.Binary && node.operator === "in") {
                            throw output;
                        }
                    }));
                    node.print(output);
                } catch (ՐՏ_Exception) {
                    var ex = ՐՏ_Exception;
                    if (ex !== output) {
                        throw ex;
                    }
                    node.print(output, true);
                }
            }
        }
        DEFPRINT(ast.VarDef, function(self, output) {
            self.name.print(output);
            if (self.value) {
                output.assign("");
                parenthesize_for_noin(self.value, output, output.parent(1) instanceof ast.ForIn);
            }
        });
        CREATION = [];
        DEFPRINT(ast.BaseCall, function(self, output) {
            var selfArg, object, has_kwarg_items, has_kwarg_formals, has_kwargs, obj, output_kwargs;
            selfArg = null;
            function call_format() {
                var rename;
                if (self instanceof ast.ClassCall) {
                    if (self.static) {
                        self.class.print(output);
                        output.print("." + self.method);
                    } else if (output.option("es6") && self.super) {
                        output.print("super");
                        if (self.method !== "constructor") {
                            output.print("." + self.method);
                        }
                        selfArg = self.args.shift();
                    } else {
                        self.class.print(output);
                        output.print(".prototype." + self.method + ".call");
                    }
                } else {
                    rename = ՐՏ_in(self.expression.name, SPECIAL_METHODS) ? SPECIAL_METHODS[self.expression.name] : void 0;
                    if (rename) {
                        output.print(rename);
                    } else {
                        self.expression.print(output);
                    }
                }
            }
            if (self instanceof ast.New) {
                object = CREATION.pop();
                if (no_constructor_parens(self, output)) {
                    call_format();
                    return;
                }
            }
            has_kwarg_items = self.args.kwarg_items && self.args.kwarg_items.length;
            has_kwarg_formals = self.args.kwargs && self.args.kwargs.length;
            has_kwargs = has_kwarg_items || has_kwarg_formals;
            if (self.args.starargs || has_kwargs) {
                obj = self instanceof ast.New ? object : self.expression.expression ? self.expression.expression : new ast.This();
                if (output.option("es6")) {
                    if (has_kwargs) {
                        output.print("kwargs");
                        output.with_parens(function() {
                            call_format();
                        });
                    } else {
                        call_format();
                    }
                } else {
                    if (self instanceof ast.New) {
                        call_format();
                        output.semicolon();
                        output.newline();
                        output.indent();
                        if (has_kwargs) {
                            output.print("kwargs");
                            output.with_parens(function() {
                                object.print(output);
                                output.print(".__init__");
                            });
                        } else {
                            object.print(output);
                            output.print(".__init__");
                        }
                    } else if (has_kwargs) {
                        output.print("kwargs");
                        output.with_parens(function() {
                            call_format();
                        });
                    } else {
                        call_format();
                    }
                }
            } else {
                call_format();
            }
            output_kwargs = function() {
                if (has_kwarg_items) {
                    self.args.kwarg_items.forEach(function(kwname, i) {
                        if (i > 0) {
                            output.print(",");
                            output.space();
                        }
                        kwname.print(output);
                    });
                    if (has_kwarg_formals) {
                        output.print(",");
                        output.space();
                    }
                }
                if (has_kwarg_formals) {
                    output.print("{");
                    self.args.kwargs.forEach(function(pair, i) {
                        if (i) {
                            output.comma();
                        }
                        pair[0].print(output);
                        output.print(":");
                        output.space();
                        pair[1].print(output);
                    });
                    output.print("}");
                }
            };
            if (output.option("es6") && self.args.starargs) {
                output.with_parens(function() {
                    self.args.forEach(function(expr, i) {
                        if (i) {
                            output.comma();
                        }
                        if (self.args.starargs && i === self.args.length - 1) {
                            output.print("...");
                        }
                        expr.print(output);
                    });
                });
            } else if (self.args.starargs) {
                output.print(".apply");
                output.with_parens(function() {
                    obj.print(output);
                    output.comma();
                    if (self.args.length > 1) {
                        output.with_square(function() {
                            self.args.slice(0, -1).forEach(function(expr, i) {
                                if (i) {
                                    output.comma();
                                }
                                expr.print(output);
                            });
                        });
                    } else {
                        self.args[0].print(output);
                    }
                    if (has_kwargs || self.args.length > 1) {
                        output.print(".concat");
                        output.with_parens(function() {
                            if (self.args.length > 1) {
                                self.args[self.args.length-1].print(output);
                                if (has_kwargs) {
                                    output.comma();
                                }
                            }
                            output_kwargs();
                        });
                    }
                });
            } else if (has_kwargs && (self instanceof ast.New || self.expression && self.expression.expression)) {
                output.print(".call");
                output.with_parens(function() {
                    var ՐՏitr81, ՐՏidx81;
                    var arg;
                    obj.print(output);
                    ՐՏitr81 = ՐՏ_Iterable(self.args);
                    for (ՐՏidx81 = 0; ՐՏidx81 < ՐՏitr81.length; ՐՏidx81++) {
                        arg = ՐՏitr81[ՐՏidx81];
                        output.comma();
                        arg.print(output);
                    }
                    output.comma();
                    output_kwargs();
                });
            } else {
                output.with_parens(function() {
                    self.args.forEach(function(expr, i) {
                        if (i) {
                            output.comma();
                        }
                        expr.print(output);
                    });
                    if (has_kwargs) {
                        if (self.args.length) {
                            output.comma();
                        }
                        output_kwargs();
                    }
                });
            }
            if (output.option("es6") && self instanceof ast.ClassCall && self.super) {
                output.end_statement();
                output.indent();
                output.spaced("var", selfArg, "=", "this");
            }
        });
        DEFPRINT(ast.New, function(self, output) {
            output.print("new");
            output.space();
            ast.BaseCall.prototype._codegen(self, output);
        });
        ast.Seq.prototype._do_print = function(output) {
            var self, p, print_seq;
            self = this;
            p = output.parent();
            print_seq = function() {
                self.car.print(output);
                if (self.cdr) {
                    output.comma();
                    if (output.should_break()) {
                        output.newline();
                        output.indent();
                    }
                    self.cdr.print(output);
                }
            };
            if (p instanceof ast.Binary || p instanceof ast.Return || p instanceof ast.Array || p instanceof ast.BaseCall || p instanceof ast.SimpleStatement) {
                output.with_square(print_seq);
            } else {
                print_seq();
            }
        };
        DEFPRINT(ast.Seq, function(self, output) {
            self._do_print(output);
        });
        DEFPRINT(ast.Dot, function(self, output) {
            var expr;
            expr = self.expression;
            expr.print(output);
            if (expr instanceof ast.Number && expr.getValue() >= 0) {
                if (!/[xa-f.]/i.test(output.last())) {
                    output.print(".");
                }
            }
            output.print(".");
            output.add_mapping(self.end);
            output.print_name(self.property);
        });
        DEFPRINT(ast.Sub, function(self, output) {
            self.expression.print(output);
            output.print("[");
            if (self.property instanceof ast.Unary && self.property.operator === "-" && self.property.expression instanceof ast.Number) {
                self.expression.print(output);
                output.print(".length");
            }
            self.property.print(output);
            output.print("]");
        });
        DEFPRINT(ast.Slice, function(self, output) {
            output.print("[].splice.apply");
            output.with_parens(function() {
                self.expression.print(output);
                output.comma();
                output.with_square(function() {
                    self.property.print(output);
                    output.comma();
                    self.property2.print(output);
                    output.print("-");
                    self.property.print(output);
                });
                output.print(".concat");
                output.with_parens(function() {
                    self.assignment.print(output);
                });
            });
        });
        DEFPRINT(ast.UnaryPrefix, function(self, output) {
            var op;
            op = self.operator;
            if (op === "*") {
                if (output.option("es6")) {
                    op = "...";
                } else {
                    op = "";
                }
            }
            output.print(op);
            if (/^[a-z]/i.test(op)) {
                output.space();
            }
            self.expression.print(output);
        });
        DEFPRINT(ast.UnaryPostfix, function(self, output) {
            self.expression.print(output);
            output.print(self.operator);
        });
        DEFPRINT(ast.Binary, function(self, output) {
            var comparators, function_ops, normalize, operator, leftvar;
            comparators = {
                "<": true,
                ">": true,
                "<=": true,
                ">=": true,
                "==": true,
                "!=": true
            };
            function_ops = {
                "in": "ՐՏ_in",
                "**": "Math.pow",
                "//": "Math.floor"
            };
            normalize = function(op) {
                if (op === "==") {
                    return "===";
                } else if (op === "!=") {
                    return "!==";
                }
                return op;
            };
            if (ՐՏ_in(self.operator, function_ops)) {
                output.print(function_ops[self.operator]);
                output.with_parens(function() {
                    self.left.print(output);
                    if (self.operator === "//") {
                        output.space();
                        output.print("/");
                        output.space();
                    } else {
                        output.comma();
                    }
                    self.right.print(output);
                });
            } else if (comparators[self.operator] && self.left instanceof ast.Binary && comparators[self.left.operator]) {
                operator = normalize(self.operator);
                if (self.left.right instanceof ast.Symbol) {
                    self.left.print(output);
                    leftvar = self.left.right.name;
                } else {
                    self.left.left.print(output);
                    output.space();
                    output.print(self.left.operator);
                    output.space();
                    output.with_parens(function() {
                        leftvar = output.newTemp();
                        output.assign(leftvar);
                        self.left.right.print(output);
                    });
                }
                output.space();
                output.spaced("&&", leftvar, operator, self.right);
            } else {
                output.spaced(self.left, normalize(self.operator), self.right);
            }
        });
        DEFPRINT(ast.DeepEquality, function(self, output) {
            var primitives;
            primitives = [ "Boolean", "String", "Number" ];
            if (ՐՏ_in(self.left.computedType, primitives) || ՐՏ_in(self.right.computedType, primitives)) {
                self.left.print(output);
                output.space();
                self.operator === "==" ? output.print("===") : output.print("!==");
                output.space();
                self.right.print(output);
            } else {
                output.with_parens(function() {
                    var left, right;
                    left = cacheBubble(self.left, output);
                    if (self.operator === "==") {
                        output.space();
                        output.spaced("===");
                        output.space();
                        right = cacheBubble(self.right, output);
                        output.space();
                        output.spaced("||", "typeof", left, "===", '"object"');
                        output.space();
                        output.print("&&");
                        output.space();
                        output.print("ՐՏ_eq");
                        output.with_parens(function() {
                            left.print(output);
                            output.comma();
                            right.print(output);
                        });
                    } else {
                        output.space();
                        output.spaced("!==");
                        output.space();
                        right = cacheBubble(self.right, output);
                        output.space();
                        output.print("&&");
                        output.space();
                        output.with_parens(function() {
                            output.spaced("typeof", left, "!==", '"object"');
                            output.space();
                            output.print("||");
                            output.space();
                            output.print("!ՐՏ_eq");
                            output.with_parens(function() {
                                left.print(output);
                                output.comma();
                                right.print(output);
                            });
                        });
                    }
                });
            }
        });
        DEFPRINT(ast.Assign, function(self, output) {
            if (self.right instanceof ast.Number && self.right.value === 1 && ՐՏ_in(self.operator, [ "+=", "-=" ])) {
                output.print(self.operator === "+=" ? "++" : "--");
                self.left.print(output);
            } else {
                if (self.operator === "//=") {
                    output.assign(self.left);
                    output.print("Math.floor");
                    output.with_parens(function() {
                        self.left.print(output);
                        output.space();
                        output.print("/");
                        output.space();
                        self.right.print(output);
                    });
                    return;
                }
                if (self.left instanceof ast.Array) {
                    if (output.option("es6")) {
                        output.with_square(function() {
                            self.left.elements.forEach(function(element, index) {
                                if (index) output.comma();
                                element.print(output);
                            });
                        });
                    } else {
                        output.print(output.newTemp("upk"));
                    }
                } else {
                    self.left.print(output);
                }
                output.space();
                output.print(self.operator);
                output.space();
                if (self.right instanceof ast.New) {
                    CREATION.push(self.left);
                }
                self.right.print(output);
                if (self.left instanceof ast.Array) {
                    if (!output.option("es6")) {
                        output.end_statement();
                        unpack_tuple(self.left, output, true);
                    }
                }
            }
        });
        DEFPRINT(ast.Conditional, function(self, output) {
            self.condition.print(output);
            output.space();
            output.print("?");
            output.space();
            self.consequent.print(output);
            output.space();
            output.colon();
            self.alternative.print(output);
        });
        DEFPRINT(ast.Array, function(self, output) {
            output.with_square(function() {
                var array, len_;
                array = self.elements;
                len_ = array.length;
                if (len_ > 0) {
                    output.space();
                }
                array.forEach(function(exp, i) {
                    if (i) {
                        output.comma();
                    }
                    exp.print(output);
                });
                if (len_ > 0) {
                    output.space();
                }
            });
        });
        DEFPRINT(ast.Range, function(self, output) {
            var ՐՏitr82, ՐՏidx82;
            var indexes, element, start, end, step;
            indexes = [];
            ՐՏitr82 = ՐՏ_Iterable([ self.left, self.right ]);
            for (ՐՏidx82 = 0; ՐՏidx82 < ՐՏitr82.length; ՐՏidx82++) {
                element = ՐՏitr82[ՐՏidx82];
                if (element instanceof ast.UnaryPrefix && element.operator === "-" && element.expression instanceof ast.Number) {
                    indexes.push(parseFloat("-" + element.expression.value));
                } else if (element instanceof ast.Number) {
                    indexes.push(parseFloat(element.value));
                } else {
                    indexes.push(null);
                }
            }
            if (indexes[0] && indexes[1] && Math.abs(indexes[1] - indexes[0]) < 50) {
                start = indexes[0];
                end = indexes[1];
                step = start < end ? 1 : -1;
                if (self.operator === "to") {
                    end += step / 1e6;
                }
                output.with_square(function() {
                    var ՐՏitr83, ՐՏidx83;
                    var i;
                    ՐՏitr83 = ՐՏ_Iterable(range(start, end, step));
                    for (ՐՏidx83 = 0; ՐՏidx83 < ՐՏitr83.length; ՐՏidx83++) {
                        i = ՐՏitr83[ՐՏidx83];
                        if (i !== start) {
                            output.comma();
                        }
                        output.print(i);
                    }
                });
            } else {
                output.print("range");
                output.with_parens(function() {
                    self.left.print(output);
                    output.comma();
                    if (self.operator === "to") {
                        output.spaced(self.left, "<", self.right, "?", self.right, "+", 1e-6, ":", self.right, "-", 1e-6);
                    } else {
                        self.right.print(output);
                    }
                    output.comma();
                    output.spaced(self.left, "<", self.right, "?", "1", ":", "-1");
                });
            }
        });
        DEFPRINT(ast.ObjectLiteral, function(self, output) {
            if (self.properties.length > 0) {
                output.with_block(function() {
                    self.properties.forEach(function(prop, i) {
                        if (i) {
                            output.print(",");
                            output.newline();
                        }
                        output.indent();
                        prop.print(output);
                    });
                    output.newline();
                });
            } else {
                output.print("{}");
            }
        });
        DEFPRINT(ast.ObjectKeyVal, function(self, output) {
            if (self.key instanceof ast.Identifier || self.key instanceof ast.String || self.key instanceof ast.Number || self.key instanceof ast.Boolean) {
                self.key.print(output);
            } else {
                output.with_square(function() {
                    self.key.print(output);
                });
            }
            output.colon();
            self.value.print(output);
        });
        ast.Symbol.prototype.definition = function() {
            return this.thedef;
        };
        DEFPRINT(ast.Symbol, function(self, output) {
            var def_;
            def_ = self.definition();
            output.print_name(def_ ? def_.mangled_name || def_.name : self.name);
        });
        DEFPRINT(ast.Undefined, function(self, output) {
            output.print("void 0");
        });
        DEFPRINT(ast.Hole, noop);
        DEFPRINT(ast.Infinity, function(self, output) {
            output.print("1/0");
        });
        DEFPRINT(ast.NotANumber, function(self, output) {
            output.print("0/0");
        });
        DEFPRINT(ast.This, function(self, output) {
            output.print("this");
        });
        DEFPRINT(ast.Constant, function(self, output) {
            output.print(self.getValue());
        });
        DEFPRINT(ast.String, function(self, output) {
            if (ՐՏ_in(self.modifier, "fF")) {
                output.print("`");
                output.print_string(self.getValue(), false);
                output.print("`");
            } else {
                output.print_string(self.getValue());
            }
        });
        DEFPRINT(ast.Verbatim, function(self, output) {
            output.print(self.getValue());
        });
        DEFPRINT(ast.Number, function(self, output) {
            output.print(make_num(self.getValue()));
        });
        DEFPRINT(ast.RegExp, function(self, output) {
            var str_, p;
            str_ = self.getValue().toString();
            if (output.option("ascii_only")) {
                str_ = output.to_ascii(str_);
            }
            output.print(str_);
            p = output.parent();
            if (p instanceof ast.Binary && /^in/.test(p.operator) && p.left === self) {
                output.print(" ");
            }
        });
        function force_statement(stat, output) {
            if (output.option("bracketize")) {
                if (!stat || stat instanceof ast.EmptyStatement) {
                    output.print("{}");
                } else if (stat instanceof ast.BlockStatement) {
                    stat.print(output);
                } else {
                    output.with_block(function() {
                        output.indent();
                        stat.print(output);
                        output.newline();
                    });
                }
            } else {
                if (!stat || stat instanceof ast.EmptyStatement) {
                    output.force_semicolon();
                } else {
                    stat.print(output);
                }
            }
        }
        function first_in_statement(output) {
            var processed, i, node, prev;
            processed = output.stack();
            i = processed.length;
            node = processed[--i];
            prev = processed[--i];
            while (i > 0) {
                if (prev instanceof ast.Statement && prev.body === node) {
                    return true;
                }
                if (prev instanceof ast.Seq && prev.car === node || prev instanceof ast.BaseCall && prev.expression === node || prev instanceof ast.Dot && prev.expression === node || prev instanceof ast.Sub && prev.expression === node || prev instanceof ast.Conditional && prev.condition === node || prev instanceof ast.Binary && prev.left === node || prev instanceof ast.UnaryPostfix && prev.expression === node) {
                    node = prev;
                    prev = processed[--i];
                } else {
                    return false;
                }
            }
        }
        function no_constructor_parens(self, output) {
            return self.args.length === 0 && !output.option("beautify");
        }
        function best_of(choices) {
            var best, len_, i;
            best = choices[0];
            len_ = best.length;
            for (i = 1; i < choices.length; i++) {
                if (choices[i].length < len_) {
                    best = choices[i];
                    len_ = best.length;
                }
            }
            return best;
        }
        function make_num(num) {
            var str_, choices, match;
            str_ = num.toString(10);
            choices = [ str_.replace(/^0\./, ".").replace("e+", "e") ];
            match = null;
            if (Math.floor(num) === num) {
                if (num >= 0) {
                    choices.push("0x" + num.toString(16).toLowerCase(), "0" + num.toString(8));
                } else {
                    choices.push("-0x" + (-num).toString(16).toLowerCase(), "-0" + (-num).toString(8));
                }
                if (match = /^(.*?)(0+)$/.exec(num)) {
                    choices.push(match[1] + "e" + match[2].length);
                }
            } else if (match = /^0?\.(0+)(.*)$/.exec(num)) {
                choices.push(match[2] + "e-" + (match[1].length + match[2].length), str_.substr(str_.indexOf(".")));
            }
            return best_of(choices);
        }
        function make_block(stmt, output) {
            if (stmt instanceof ast.BlockStatement) {
                stmt.print(output);
                return;
            }
            output.with_block(function() {
                output.indent();
                stmt.print(output);
                output.newline();
            });
        }
        function DEFMAP(nodetype, generator) {
            nodetype.prototype.add_source_map = function(stream) {
                generator(this, stream);
            };
        }
        DEFMAP(ast.Node, noop);
        function basic_sourcemap_gen(self, output) {
            output.add_mapping(self.start);
        }
        DEFMAP(ast.Directive, basic_sourcemap_gen);
        DEFMAP(ast.Debugger, basic_sourcemap_gen);
        DEFMAP(ast.Symbol, basic_sourcemap_gen);
        DEFMAP(ast.Jump, basic_sourcemap_gen);
        DEFMAP(ast.StatementWithBody, basic_sourcemap_gen);
        DEFMAP(ast.LabeledStatement, noop);
        DEFMAP(ast.Lambda, basic_sourcemap_gen);
        DEFMAP(ast.Switch, basic_sourcemap_gen);
        DEFMAP(ast.SwitchBranch, basic_sourcemap_gen);
        DEFMAP(ast.BlockStatement, basic_sourcemap_gen);
        DEFMAP(ast.TopLevel, noop);
        DEFMAP(ast.New, basic_sourcemap_gen);
        DEFMAP(ast.Try, basic_sourcemap_gen);
        DEFMAP(ast.Catch, basic_sourcemap_gen);
        DEFMAP(ast.Finally, basic_sourcemap_gen);
        DEFMAP(ast.Definitions, basic_sourcemap_gen);
        DEFMAP(ast.Constant, basic_sourcemap_gen);
        DEFMAP(ast.ObjectProperty, function(self, output) {
            output.add_mapping(self.start, self.key);
        });
    })();
    ՐՏ_modules["output"]["Stream"] = Stream;
})();
var exports, rapydscript, compile;
var utils = ՐՏ_modules["utils"];

var ast = ՐՏ_modules["ast"];

var tokenizer = ՐՏ_modules["tokenizer"];

var parser = ՐՏ_modules["parser"];

var output = ՐՏ_modules["output"];

ast.Node.warn_function = function(txt) {
    console.error(txt);
};
function splatBaselib(key, value) {
    return new ast.Splat({
        module: new ast.SymbolVar({
            name: key
        }),
        body: new ast.TopLevel({
            start: value[0].start,
            body: value,
            strict: true,
            end: value[value.length-1].end
        })
    });
}
if (!exports) {
    rapydscript = exports = {};
}
exports.parse_baselib = exports.parseBaselib = function(srcPath, beautify) {
    var ՐՏitr84, ՐՏidx84;
    var fs, baselibPath, baselibAst, hash, data, baselibList, item, key, value;
    try {
        fs = require("fs");
        baselibPath = require("path").join(srcPath, "baselib.pyj");
        baselibAst = parser.parse(fs.readFileSync(baselibPath, "utf8"), {
            readfile: fs.readFileSync,
            dropDocstrings: true,
            filename: "baselib.pyj"
        });
    } catch (ՐՏ_Exception) {
        var e = ՐՏ_Exception;
        if (e.code === "ENOENT") {
            throw "Failed to localte baselib module.";
        } else {
            throw ՐՏ_Exception;
        }
    }
    hash = baselibAst.body[baselibAst.body.length-1];
    data = hash.body.properties;
    baselibList = {};
    ՐՏitr84 = ՐՏ_Iterable(data);
    for (ՐՏidx84 = 0; ՐՏidx84 < ՐՏitr84.length; ՐՏidx84++) {
        item = ՐՏitr84[ՐՏidx84];
        key = item.key.value;
        value = item.value.name ? [ item.value ] : item.value.body;
        baselibList[key] = splatBaselib(key, value);
    }
    return baselibList;
};
exports.get_import_dirs = function(paths_string, ignore_env) {
    var paths, path;
    paths = [];
    path = require("path");
    function merge(new_path) {
        if (!(ՐՏ_in(new_path, paths))) {
            paths.push(new_path);
        }
    }
    if (!ignore_env && process && process.env && process.env.RAPYDSCRIPT_PATH) {
        process.env.RAPYDSCRIPT_PATH.split(path.delimiter).forEach(merge);
    }
    if (paths_string) {
        paths_string.split(path.delimiter).forEach(merge);
    }
    return paths;
};
exports.compile = compile = function(code, options) {
    var toplevel, stream;
    toplevel = parser.parse(code, utils.defaults(options, {
        toplevel: toplevel,
        output: {}
    }));
    if (!options.omit_baselib) {
        if (!toplevel.baselib["AssertionError"]) {
            --toplevel.baselib["extends"];
        }
        if (!toplevel.baselib["IndexError"]) {
            --toplevel.baselib["extends"];
        }
        if (!toplevel.baselib["KeyError"]) {
            --toplevel.baselib["extends"];
        }
        if (!toplevel.baselib["TypeError"]) {
            --toplevel.baselib["extends"];
        }
        if (!toplevel.baselib["ValueError"]) {
            --toplevel.baselib["extends"];
        }
        if (!toplevel.baselib["kwargs"]) {
            --toplevel.baselib["in"];
            --toplevel.baselib["iterator"];
            --toplevel.baselib["range"];
            --toplevel.baselib["dir"];
        }
        if (!toplevel.baselib["eq"]) {
            toplevel.baselib["iterator"] -= 2;
            --toplevel.baselib["range"];
        }
        if (!toplevel.baselib["merge"]) {
            --toplevel.baselib["iterator"];
        }
        if (!toplevel.baselib["mixin"]) {
            --toplevel.baselib["in"];
            toplevel.baselib["iterator"] -= 2;
        }
        if (!toplevel.baselib["enumerate"]) {
            --toplevel.baselib["iterator"];
            --toplevel.baselib["range"];
        }
        if (!toplevel.baselib["all"]) {
            --toplevel.baselib["iterator"];
        }
        if (!toplevel.baselib["any"]) {
            --toplevel.baselib["iterator"];
        }
        if (!toplevel.baselib["zip"]) {
            --toplevel.baselib["iterator"];
            --toplevel.baselib["range"];
        }
        if (!toplevel.baselib["rebind_all"]) {
            --toplevel.baselib["bind"];
        }
    }
    stream = output.Stream(options);
    toplevel.print(stream);
    return stream.toString();
};
exports.minify = function(files, options) {
    var ՐՏitr85, ՐՏidx85;
    var file, code;
    options = utils.defaults(options, {
        fromString: false,
        warnings: false
    });
    if (typeof files === "string") {
        files = [ files ];
    }
    ՐՏitr85 = ՐՏ_Iterable(files);
    for (ՐՏidx85 = 0; ՐՏidx85 < ՐՏitr85.length; ՐՏidx85++) {
        file = ՐՏitr85[ՐՏidx85];
        options.filename = options.fromString ? "?" : file;
        code = options.fromString ? file : require("fs").readFileSync(file, "utf8");
        retrun;
        ({
            code: compile(code, options)
        });
    }
};
exports.parse = parser.parse;
exports.output = function(ast, options) {
    var stream;
    stream = output.Stream(options);
    ast.print(stream);
    return stream.toString();
};
exports.string_template = utils.string_template;
exports.ast = ast;
exports.tokenizer = tokenizer;
exports.NATIVE_CLASSES = parser.NATIVE_CLASSES;
exports.ParseError = utils.ParseError;
exports.ImportError = utils.ImportError;
exports.ALL_KEYWORDS = tokenizer.ALL_KEYWORDS;
exports.IDENTIFIER_PAT = tokenizer.IDENTIFIER_PAT;
exports.colored = utils.colored;var ՐՏ_124, ՐՏ_125, ՐՏ_126, ՐՏ_127, ՐՏ_128;

}).call(this,require('_process'))
},{"_process":18,"fs":1,"path":17}],25:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":26,"punycode":19,"querystring":23}],26:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],27:[function(require,module,exports){
function ՐՏ_bind(fn, thisArg) {
    var ret;
    if (fn.orig) {
        fn = fn.orig;
    }
    if (thisArg === false) {
        return fn;
    }
    ret = function() {
        return fn.apply(thisArg, arguments);
    };
    ret.orig = fn;
    return ret;
}
function ՐՏ_rebindAll(thisArg, rebind) {
    if (rebind === void 0) {
        rebind = true;
    }
    for (var p in thisArg) {
        if (thisArg[p] && thisArg[p].orig) {
            if (rebind) {
                thisArg[p] = ՐՏ_bind(thisArg[p], thisArg);
            } else {
                thisArg[p] = thisArg[p].orig;
            }
        }
    }
}
function ՐՏ_extends(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.__base__ = parent;
    child.prototype.constructor = child;
}
function ՐՏ_Iterable(iterable) {
    var tmp;
    if (iterable.constructor === [].constructor || iterable.constructor === "".constructor || (tmp = Array.prototype.slice.call(iterable)).length) {
        return tmp || iterable;
    }
    return Object.keys(iterable);
}
function len(obj) {
    var tmp;
    if (obj.constructor === [].constructor || obj.constructor === "".constructor || (tmp = Array.prototype.slice.call(obj)).length) {
        return (tmp || obj).length;
    }
    return Object.keys(obj).length;
}
function ՐՏ_print() {
    if (typeof console === "object") {
        console.log.apply(console, arguments);
    }
}
function range(start, stop, step) {
    var length, idx, range;
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = arguments[2] || 1;
    length = Math.max(Math.ceil((stop - start) / step), 0);
    idx = 0;
    range = new Array(length);
    while (idx < length) {
        range[idx++] = start;
        start += step;
    }
    return range;
}
function ՐՏ_type(obj) {
    return obj && obj.constructor && obj.constructor.name ? obj.constructor.name : Object.prototype.toString.call(obj).slice(8, -1);
}
function ՐՏ_eq(a, b) {
    var ՐՏitr8, ՐՏidx8;
    var i;
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b) || a instanceof Object && b instanceof Object) {
        if (a.constructor !== b.constructor || a.length !== b.length) {
            return false;
        }
        if (Array.isArray(a)) {
            for (i = 0; i < a.length; i++) {
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        } else {
            if (Object.keys(a).length !== Object.keys(b).length) {
                return false;
            }
            ՐՏitr8 = ՐՏ_Iterable(a);
            for (ՐՏidx8 = 0; ՐՏidx8 < ՐՏitr8.length; ՐՏidx8++) {
                i = ՐՏitr8[ՐՏidx8];
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}
var IndexError = (ՐՏ_2 = function IndexError() {
    IndexError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_2, Error), Object.defineProperties(ՐՏ_2.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.name = "IndexError";
            self.message = message;
        }
    }
}), ՐՏ_2);
var TypeError = (ՐՏ_3 = function TypeError() {
    TypeError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_3, Error), Object.defineProperties(ՐՏ_3.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.name = "TypeError";
            self.message = message;
        }
    }
}), ՐՏ_3);
var ValueError = (ՐՏ_4 = function ValueError() {
    ValueError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_4, Error), Object.defineProperties(ՐՏ_4.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.name = "ValueError";
            self.message = message;
        }
    }
}), ՐՏ_4);
var ՐՏ_modules = {};
ՐՏ_modules["stdlib"] = {};
ՐՏ_modules["compat"] = {};

(function(){
    var __name__ = "stdlib";
    var str;
    str = JSON.stringify;
    String.prototype.find = String.prototype.indexOf;
    String.prototype.strip = String.prototype.trim;
    String.prototype.lstrip = String.prototype.trimLeft;
    String.prototype.rstrip = String.prototype.trimRight;
    String.prototype.join = function(iterable) {
        return iterable.join(this);
    };
    String.prototype.zfill = function(size) {
        var s;
        s = this;
        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    };
    function list(iterable) {
        var ՐՏitr1, ՐՏidx1;
        iterable = iterable === void 0 ? [] : iterable;
        var result, i;
        result = [];
        ՐՏitr1 = ՐՏ_Iterable(iterable);
        for (ՐՏidx1 = 0; ՐՏidx1 < ՐՏitr1.length; ՐՏidx1++) {
            i = ՐՏitr1[ՐՏidx1];
            result.append(i);
        }
        return result;
    }
    Array.prototype.append = Array.prototype.push;
    Array.prototype.find = Array.prototype.indexOf;
    Array.prototype.index = function(index) {
        var ՐՏ_1;
        var val;
        val = this.find(index);
        if ((val === (ՐՏ_1 = -1) || typeof val === "object" && ՐՏ_eq(val, ՐՏ_1))) {
            throw new ValueError(str(index) + " is not in list");
        }
        return val;
    };
    Array.prototype.insert = function(index, item) {
        this.splice(index, 0, item);
    };
    Array.prototype.pop = function(index) {
        index = index === void 0 ? this.length - 1 : index;
        return this.splice(index, 1)[0];
    };
    Array.prototype.extend = function(array2) {
        this.push.apply(this, array2);
    };
    Array.prototype.remove = function(item) {
        var index;
        index = this.find(item);
        this.splice(index, 1);
    };
    Array.prototype.copy = function() {
        return this.slice(0);
    };
    function dict(iterable) {
        var ՐՏitr2, ՐՏidx2;
        var result, key;
        result = {};
        ՐՏitr2 = ՐՏ_Iterable(iterable);
        for (ՐՏidx2 = 0; ՐՏidx2 < ՐՏitr2.length; ՐՏidx2++) {
            key = ՐՏitr2[ՐՏidx2];
            result[key] = iterable[key];
        }
        return result;
    }
    if (ՐՏ_type(Object.getOwnPropertyNames) !== "function") {
        dict.keys = function(hash) {
            var keys;
            keys = [];
            
        for (var x in hash) {
            if (hash.hasOwnProperty(x)) {
                keys.push(x);
            }
        }
        ;
            return keys;
        };
    } else {
        dict.keys = function(hash) {
            return Object.getOwnPropertyNames(hash);
        };
    }
    dict.values = function(hash) {
        var ՐՏitr3, ՐՏidx3;
        var vals, key;
        vals = [];
        ՐՏitr3 = ՐՏ_Iterable(dict.keys(hash));
        for (ՐՏidx3 = 0; ՐՏidx3 < ՐՏitr3.length; ՐՏidx3++) {
            key = ՐՏitr3[ՐՏidx3];
            vals.append(hash[key]);
        }
        return vals;
    };
    dict.items = function(hash) {
        var ՐՏitr4, ՐՏidx4;
        var items, key;
        items = [];
        ՐՏitr4 = ՐՏ_Iterable(dict.keys(hash));
        for (ՐՏidx4 = 0; ՐՏidx4 < ՐՏitr4.length; ՐՏidx4++) {
            key = ՐՏitr4[ՐՏidx4];
            items.append([key, hash[key]]);
        }
        return items;
    };
    dict.copy = dict;
    dict.clear = function(hash) {
        var ՐՏitr5, ՐՏidx5;
        var key;
        ՐՏitr5 = ՐՏ_Iterable(dict.keys(hash));
        for (ՐՏidx5 = 0; ՐՏidx5 < ՐՏitr5.length; ՐՏidx5++) {
            key = ՐՏitr5[ՐՏidx5];
            delete hash[key];
        }
    };
    ՐՏ_modules["stdlib"]["str"] = str;

    ՐՏ_modules["stdlib"]["list"] = list;

    ՐՏ_modules["stdlib"]["dict"] = dict;
})();

(function(){
    var __name__ = "compat";
    var stdlib = ՐՏ_modules["stdlib"];
    
    if (!window.transpiler) {
        
        Vibrant = require ("node-vibrant")
        require ("rapydscript")
        common = require ("./common.py")
        ;
        window.transpiler = "Rapydscript";
    }
    function _new(cls, arg) {
        return new cls(arg);
    }
    function _print() {
        var args = [].slice.call(arguments, 0);
        var sep, end;
        sep = " ";
        end = "\n";
        function printAsync() {
            var element, arg, addition, previous;
            element = document.getElementById("__terminal__");
            if (element) {
                addition = sep.join((function() {
                    var ՐՏidx6, ՐՏitr6 = ՐՏ_Iterable(args), ՐՏres = [], arg;
                    for (ՐՏidx6 = 0; ՐՏidx6 < ՐՏitr6.length; ՐՏidx6++) {
                        arg = ՐՏitr6[ՐՏidx6];
                        ՐՏres.push(arg);
                    }
                    return ՐՏres;
                })()) + end;
                previous = element.innerHTML;
                element.innerHTML = previous + addition.replace("\n", "<br>");
                element.scrollTop = element.scrollHeight;
            } else {
                console.log(sep.join((function() {
                    var ՐՏidx7, ՐՏitr7 = ՐՏ_Iterable(args), ՐՏres = [], arg;
                    for (ՐՏidx7 = 0; ՐՏidx7 < ՐՏitr7.length; ՐՏidx7++) {
                        arg = ՐՏitr7[ՐՏidx7];
                        ՐՏres.push(str(arg));
                    }
                    return ՐՏres;
                })()));
            }
        }
        setTimeout(printAsync, 5);
    }
    ՐՏ_modules["compat"]["_new"] = _new;

    ՐՏ_modules["compat"]["_print"] = _print;
})();

var __name__ = "__main__";
var ՐՏ_print = ՐՏ_modules["compat"]._print;

function start_ide() {
    ՐՏ_print(">>> Hello from <b>Python</b>!");
    ՐՏ_print("<b>" + window.transpiler + "</b> running under " + navigator.userAgent);
    ՐՏ_print(navigator.platform + " " + navigator.language);
    ՐՏ_print("<br><h1><a href='https://github.com/somosazucar/python-web'>" + "Python Browser Compatibility Layer</a></h1>");
    ՐՏ_print("<br><img src='./docs/images/uroboros_head.png'>");
    ՐՏ_print("<div id='__header__'>" + "<button style='padding: 10px; border-radius: 5px' " + "onclick='location.href=\"https://github.com/somosazucar/python-web/blob/master/src/main.py\"'>" + "⚙ View Source for this Example</button><br><br>" + "<iframe src='https://ghbtns.com/github-btn.html?user=somosazucar&repo=python-web&type=fork&count=true&size=large' frameborder='0' scrolling='0' width='128px' height='30px'></iframe><br>" + "<br><img src='" + window.colors.asset + "'><br>" + "<b>Compilers:</b>" + "<p><a href='index.html'>rapydscript</a></p>" + "<p><a href='index_transcrypt.html'>transcrypt</a></p>" + "</ul>" + "</div>");
}
window.start_ide = start_ide;var ՐՏ_2, ՐՏ_3, ՐՏ_4;

},{"./common.py":27,"node-vibrant":2,"rapydscript":24}],28:[function(require,module,exports){
var ՐՏupk5, ՐՏ_2, ՐՏ_3, ՐՏ_6;
function ՐՏ_bind(fn, thisArg) {
    var ret;
    if (fn.orig) {
        fn = fn.orig;
    }
    if (thisArg === false) {
        return fn;
    }
    ret = function() {
        return fn.apply(thisArg, arguments);
    };
    ret.orig = fn;
    return ret;
}
function ՐՏ_rebindAll(thisArg, rebind) {
    if (rebind === void 0) {
        rebind = true;
    }
    for (var p in thisArg) {
        if (thisArg[p] && thisArg[p].orig) {
            if (rebind) {
                thisArg[p] = ՐՏ_bind(thisArg[p], thisArg);
            } else {
                thisArg[p] = thisArg[p].orig;
            }
        }
    }
}
function ՐՏ_extends(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.__base__ = parent;
    child.prototype.constructor = child;
}
function ՐՏ_Iterable(iterable) {
    var tmp;
    if (iterable.constructor === [].constructor || iterable.constructor === "".constructor || (tmp = Array.prototype.slice.call(iterable)).length) {
        return tmp || iterable;
    }
    return Object.keys(iterable);
}
function len(obj) {
    var tmp;
    if (obj.constructor === [].constructor || obj.constructor === "".constructor || (tmp = Array.prototype.slice.call(obj)).length) {
        return (tmp || obj).length;
    }
    return Object.keys(obj).length;
}
function range(start, stop, step) {
    var length, idx, range;
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = arguments[2] || 1;
    length = Math.max(Math.ceil((stop - start) / step), 0);
    idx = 0;
    range = new Array(length);
    while (idx < length) {
        range[idx++] = start;
        start += step;
    }
    return range;
}
function ՐՏ_type(obj) {
    return obj && obj.constructor && obj.constructor.name ? obj.constructor.name : Object.prototype.toString.call(obj).slice(8, -1);
}
function ՐՏ_eq(a, b) {
    var ՐՏitr10, ՐՏidx10;
    var i;
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b) || a instanceof Object && b instanceof Object) {
        if (a.constructor !== b.constructor || a.length !== b.length) {
            return false;
        }
        if (Array.isArray(a)) {
            for (i = 0; i < a.length; i++) {
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        } else {
            if (Object.keys(a).length !== Object.keys(b).length) {
                return false;
            }
            ՐՏitr10 = ՐՏ_Iterable(a);
            for (ՐՏidx10 = 0; ՐՏidx10 < ՐՏitr10.length; ՐՏidx10++) {
                i = ՐՏitr10[ՐՏidx10];
                if (!ՐՏ_eq(a[i], b[i])) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}
var IndexError = (ՐՏ_7 = function IndexError() {
    IndexError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_7, Error), Object.defineProperties(ՐՏ_7.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.name = "IndexError";
            self.message = message;
        }
    }
}), ՐՏ_7);
var TypeError = (ՐՏ_8 = function TypeError() {
    TypeError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_8, Error), Object.defineProperties(ՐՏ_8.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.name = "TypeError";
            self.message = message;
        }
    }
}), ՐՏ_8);
var ValueError = (ՐՏ_9 = function ValueError() {
    ValueError.prototype.__init__.apply(this, arguments);
}, ՐՏ_extends(ՐՏ_9, Error), Object.defineProperties(ՐՏ_9.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(message){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.name = "ValueError";
            self.message = message;
        }
    }
}), ՐՏ_9);
var ՐՏ_modules = {};
ՐՏ_modules["random"] = {};
ՐՏ_modules["stdlib"] = {};
ՐՏ_modules["compat"] = {};

(function(){
    var __name__ = "random";
    var _$rapyd$_seed_state, _$rapyd$_get_random_byte;
    _$rapyd$_seed_state = {
        key: [],
        key_i: 0,
        key_j: 0
    };
    _$rapyd$_get_random_byte = function() {
        var ՐՏupk1;
        _$rapyd$_seed_state.key_i = (_$rapyd$_seed_state.key_i + 1) % 256;
        _$rapyd$_seed_state.key_j = (_$rapyd$_seed_state.key_j + _$rapyd$_seed_state.key[_$rapyd$_seed_state.key_i]) % 256;
        ՐՏupk1 = [ _$rapyd$_seed_state.key[_$rapyd$_seed_state.key_j], _$rapyd$_seed_state.key[_$rapyd$_seed_state.key_i] ];
        _$rapyd$_seed_state.key[_$rapyd$_seed_state.key_i] = ՐՏupk1[0];
        _$rapyd$_seed_state.key[_$rapyd$_seed_state.key_j] = ՐՏupk1[1];
        return _$rapyd$_seed_state.key[(_$rapyd$_seed_state.key[_$rapyd$_seed_state.key_i] + _$rapyd$_seed_state.key[_$rapyd$_seed_state.key_j]) % 256];
    };
    function seed(x) {
        var ՐՏupk2;
        x = x === void 0 ? new Date().getTime() : x;
        var i, j;
        if (typeof x === "number") {
            x = x.toString();
        } else if (typeof x !== "string") {
            throw new TypeError("unhashable type: '" + typeof x + "'");
        }
        for (i = 0; i < 256; i++) {
            _$rapyd$_seed_state.key[i] = i;
        }
        j = 0;
        for (i = 0; i < 256; i++) {
            j = (j + _$rapyd$_seed_state.key[i] + x.charCodeAt(i % x.length)) % 256;
            ՐՏupk2 = [ _$rapyd$_seed_state.key[j], _$rapyd$_seed_state.key[i] ];
            _$rapyd$_seed_state.key[i] = ՐՏupk2[0];
            _$rapyd$_seed_state.key[j] = ՐՏupk2[1];
        }
    }
    seed();
    function random() {
        var n, m, i;
        n = 0;
        m = 1;
        for (i = 0; i < 8; i++) {
            n += _$rapyd$_get_random_byte() * m;
            m *= 256;
        }
        return n / 0x10000000000000000;
    }
    function randrange() {
        return choice(range.apply(this, arguments));
    }
    function randint(a, b) {
        return parseInt(random() * (b - a + 1) + a);
    }
    function uniform(a, b) {
        return random() * (b - a) + a;
    }
    function choice(seq) {
        if (seq.length > 0) {
            return seq[Math.floor(random() * seq.length)];
        } else {
            throw new IndexError();
        }
    }
    function shuffle(x, random_f) {
        var ՐՏupk3;
        random_f = random_f === void 0 ? random : random_f;
        var i, j;
        for (i = 0; i < x.length; i++) {
            j = Math.floor(random_f() * (i + 1));
            ՐՏupk3 = [ x[j], x[i] ];
            x[i] = ՐՏupk3[0];
            x[j] = ՐՏupk3[1];
        }
        return x;
    }
    function sample(population, k) {
        var ՐՏitr1, ՐՏidx1, ՐՏupk4;
        var x, i, j;
        x = population.slice();
        ՐՏitr1 = ՐՏ_Iterable(range(population.length - 1, population.length - k - 1, -1));
        for (ՐՏidx1 = 0; ՐՏidx1 < ՐՏitr1.length; ՐՏidx1++) {
            i = ՐՏitr1[ՐՏidx1];
            j = Math.floor(random() * (i + 1));
            ՐՏupk4 = [ x[j], x[i] ];
            x[i] = ՐՏupk4[0];
            x[j] = ՐՏupk4[1];
        }
        return x.slice(population.length - k);
    }
    ՐՏ_modules["random"]["_$rapyd$_seed_state"] = _$rapyd$_seed_state;

    ՐՏ_modules["random"]["_$rapyd$_get_random_byte"] = _$rapyd$_get_random_byte;

    ՐՏ_modules["random"]["seed"] = seed;

    ՐՏ_modules["random"]["random"] = random;

    ՐՏ_modules["random"]["randrange"] = randrange;

    ՐՏ_modules["random"]["randint"] = randint;

    ՐՏ_modules["random"]["uniform"] = uniform;

    ՐՏ_modules["random"]["choice"] = choice;

    ՐՏ_modules["random"]["shuffle"] = shuffle;

    ՐՏ_modules["random"]["sample"] = sample;
})();

(function(){
    var __name__ = "stdlib";
    var str;
    str = JSON.stringify;
    String.prototype.find = String.prototype.indexOf;
    String.prototype.strip = String.prototype.trim;
    String.prototype.lstrip = String.prototype.trimLeft;
    String.prototype.rstrip = String.prototype.trimRight;
    String.prototype.join = function(iterable) {
        return iterable.join(this);
    };
    String.prototype.zfill = function(size) {
        var s;
        s = this;
        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    };
    function list(iterable) {
        var ՐՏitr2, ՐՏidx2;
        iterable = iterable === void 0 ? [] : iterable;
        var result, i;
        result = [];
        ՐՏitr2 = ՐՏ_Iterable(iterable);
        for (ՐՏidx2 = 0; ՐՏidx2 < ՐՏitr2.length; ՐՏidx2++) {
            i = ՐՏitr2[ՐՏidx2];
            result.append(i);
        }
        return result;
    }
    Array.prototype.append = Array.prototype.push;
    Array.prototype.find = Array.prototype.indexOf;
    Array.prototype.index = function(index) {
        var ՐՏ_1;
        var val;
        val = this.find(index);
        if ((val === (ՐՏ_1 = -1) || typeof val === "object" && ՐՏ_eq(val, ՐՏ_1))) {
            throw new ValueError(str(index) + " is not in list");
        }
        return val;
    };
    Array.prototype.insert = function(index, item) {
        this.splice(index, 0, item);
    };
    Array.prototype.pop = function(index) {
        index = index === void 0 ? this.length - 1 : index;
        return this.splice(index, 1)[0];
    };
    Array.prototype.extend = function(array2) {
        this.push.apply(this, array2);
    };
    Array.prototype.remove = function(item) {
        var index;
        index = this.find(item);
        this.splice(index, 1);
    };
    Array.prototype.copy = function() {
        return this.slice(0);
    };
    function dict(iterable) {
        var ՐՏitr3, ՐՏidx3;
        var result, key;
        result = {};
        ՐՏitr3 = ՐՏ_Iterable(iterable);
        for (ՐՏidx3 = 0; ՐՏidx3 < ՐՏitr3.length; ՐՏidx3++) {
            key = ՐՏitr3[ՐՏidx3];
            result[key] = iterable[key];
        }
        return result;
    }
    if (ՐՏ_type(Object.getOwnPropertyNames) !== "function") {
        dict.keys = function(hash) {
            var keys;
            keys = [];
            
        for (var x in hash) {
            if (hash.hasOwnProperty(x)) {
                keys.push(x);
            }
        }
        ;
            return keys;
        };
    } else {
        dict.keys = function(hash) {
            return Object.getOwnPropertyNames(hash);
        };
    }
    dict.values = function(hash) {
        var ՐՏitr4, ՐՏidx4;
        var vals, key;
        vals = [];
        ՐՏitr4 = ՐՏ_Iterable(dict.keys(hash));
        for (ՐՏidx4 = 0; ՐՏidx4 < ՐՏitr4.length; ՐՏidx4++) {
            key = ՐՏitr4[ՐՏidx4];
            vals.append(hash[key]);
        }
        return vals;
    };
    dict.items = function(hash) {
        var ՐՏitr5, ՐՏidx5;
        var items, key;
        items = [];
        ՐՏitr5 = ՐՏ_Iterable(dict.keys(hash));
        for (ՐՏidx5 = 0; ՐՏidx5 < ՐՏitr5.length; ՐՏidx5++) {
            key = ՐՏitr5[ՐՏidx5];
            items.append([key, hash[key]]);
        }
        return items;
    };
    dict.copy = dict;
    dict.clear = function(hash) {
        var ՐՏitr6, ՐՏidx6;
        var key;
        ՐՏitr6 = ՐՏ_Iterable(dict.keys(hash));
        for (ՐՏidx6 = 0; ՐՏidx6 < ՐՏitr6.length; ՐՏidx6++) {
            key = ՐՏitr6[ՐՏidx6];
            delete hash[key];
        }
    };
    ՐՏ_modules["stdlib"]["str"] = str;

    ՐՏ_modules["stdlib"]["list"] = list;

    ՐՏ_modules["stdlib"]["dict"] = dict;
})();

(function(){
    var __name__ = "compat";
    var stdlib = ՐՏ_modules["stdlib"];
    
    if (!window.transpiler) {
        
        Vibrant = require ("node-vibrant")
        require ("rapydscript")
        common = require ("./common.py")
        ;
        window.transpiler = "Rapydscript";
    }
    function _new(cls, arg) {
        return new cls(arg);
    }
    function _print() {
        var args = [].slice.call(arguments, 0);
        var sep, end;
        sep = " ";
        end = "\n";
        function printAsync() {
            var element, arg, addition, previous;
            element = document.getElementById("__terminal__");
            if (element) {
                addition = sep.join((function() {
                    var ՐՏidx7, ՐՏitr7 = ՐՏ_Iterable(args), ՐՏres = [], arg;
                    for (ՐՏidx7 = 0; ՐՏidx7 < ՐՏitr7.length; ՐՏidx7++) {
                        arg = ՐՏitr7[ՐՏidx7];
                        ՐՏres.push(arg);
                    }
                    return ՐՏres;
                })()) + end;
                previous = element.innerHTML;
                element.innerHTML = previous + addition.replace("\n", "<br>");
                element.scrollTop = element.scrollHeight;
            } else {
                console.log(sep.join((function() {
                    var ՐՏidx8, ՐՏitr8 = ՐՏ_Iterable(args), ՐՏres = [], arg;
                    for (ՐՏidx8 = 0; ՐՏidx8 < ՐՏitr8.length; ՐՏidx8++) {
                        arg = ՐՏitr8[ՐՏidx8];
                        ՐՏres.push(str(arg));
                    }
                    return ՐՏres;
                })()));
            }
        }
        setTimeout(printAsync, 5);
    }
    ՐՏ_modules["compat"]["_new"] = _new;

    ՐՏ_modules["compat"]["_print"] = _print;
})();

var __name__ = "__main__";
var width, height;
var random = ՐՏ_modules["random"];

var ՐՏ_print = ՐՏ_modules["compat"]._print;

var stdlib = ՐՏ_modules["compat"].stdlib;

var _new = ՐՏ_modules["compat"]._new;

ՐՏupk5 = [ 800, 300 ];
width = ՐՏupk5[0];
height = ՐՏupk5[1];
var Bola = (ՐՏ_2 = function Bola() {
    this.recolor = ՐՏ_bind(this.recolor, this);
    this.destroy = ՐՏ_bind(this.destroy, this);
    this.play = ՐՏ_bind(this.play, this);
    Bola.prototype.__init__.apply(this, arguments);
}, Object.defineProperties(ՐՏ_2.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(director){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.director = director;
            self.to_delete = false;
            self.sprite = director.game.circle(10, colors.vibe_light);
            self.sprite.x = width / 2;
            self.sprite.y = height / 2;
            self.sprite.vy = random.choice([ -5, +5 ]);
            self.sprite.vx = random.choice([ -1, +1 ]);
            self.recolor();
        }
    },
    recolor: {
        enumerable: true, 
        writable: true, 
        value: function recolor(){
            var self = this;
            self.sprite.fillStyle = random.choice([ colors.vibe_light, colors.vibe, colors.mute, colors.mute_light ]);
        }
    },
    destroy: {
        enumerable: true, 
        writable: true, 
        value: function destroy(){
            var self = this;
            self.to_delete = true;
            self.sprite.visible = false;
            self.director.game.remove(self.sprite);
            self.sprite.destroy();
        }
    },
    play: {
        enumerable: true, 
        writable: true, 
        value: function play(){
            var self = this;
            if (self.sprite.visible) {
                if (self.sprite.y > height - self.sprite.height) {
                    self.sprite.vy *= -1;
                }
                if (self.sprite.x > width - self.sprite.width) {
                    self.destroy();
                    return;
                }
                if (self.sprite.y < 0) {
                    self.sprite.vy *= -1;
                }
                if (self.sprite.x < 0) {
                    self.destroy();
                    return;
                }
                self.director.game.move(self.sprite);
            }
        }
    }
}), ՐՏ_2);
var Director = (ՐՏ_3 = function Director() {
    this.setup = ՐՏ_bind(this.setup, this);
    this.recolor = ՐՏ_bind(this.recolor, this);
    this.make_bola = ՐՏ_bind(this.make_bola, this);
    this.play = ՐՏ_bind(this.play, this);
    this.pause = ՐՏ_bind(this.pause, this);
    this.resume = ՐՏ_bind(this.resume, this);
    this.rescale = ՐՏ_bind(this.rescale, this);
    Director.prototype.__init__.apply(this, arguments);
}, Object.defineProperties(ՐՏ_3.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(){
            var self = this;
            ՐՏ_rebindAll(this, true);
            self.game = hexi(width, height, self.setup);
            self.game.backgroundColor = "ffffff";
            self.game.fps = 25;
            self.tick = false;
            self.actors = [];
        }
    },
    setup: {
        enumerable: true, 
        writable: true, 
        value: function setup(){
            var self = this;
            self.game.state = self.play;
            if (self.tick === false) {
                self.tick = window.setInterval(self.make_bola, 250);
            }
        }
    },
    recolor: {
        enumerable: true, 
        writable: true, 
        value: function recolor(){
            var ՐՏitr9, ՐՏidx9;
            var self = this;
            var styles, actor;
            styles = document.styleSheets[document.styleSheets.length - 1];
            styles.insertRule("#__terminal__ { color: " + colors.vibe_light + " }", 0);
            self.game.backgroundColor = colors.mute_dark;
            ՐՏitr9 = ՐՏ_Iterable(self.actors);
            for (ՐՏidx9 = 0; ՐՏidx9 < ՐՏitr9.length; ՐՏidx9++) {
                actor = ՐՏitr9[ՐՏidx9];
                actor.recolor();
            }
            self.rescale();
        }
    },
    make_bola: {
        enumerable: true, 
        writable: true, 
        value: function make_bola(){
            var self = this;
            self.actors.append(new Bola(self));
        }
    },
    play: {
        enumerable: true, 
        writable: true, 
        value: function play(){
            var ՐՏ_4, ՐՏ_5;
            var self = this;
            var index, actor;
            if (((ՐՏ_4 = self.bgcolor) !== (ՐՏ_5 = colors.mute_dark) && (typeof ՐՏ_4 !== "object" || !ՐՏ_eq(ՐՏ_4, ՐՏ_5)))) {
                self.bgcolor = colors.mute_dark;
                self.recolor();
            }
            for (index = 0; index < len(self.actors); index++) {
                actor = self.actors[index];
                if (actor.to_delete === false) {
                    actor.play();
                } else if (actor.to_delete === true) {
                    self.actors.pop(index);
                }
            }
        }
    },
    pause: {
        enumerable: true, 
        writable: true, 
        value: function pause(){
            var self = this;
            if (self.tick) {
                window.clearInterval(self.tick);
                self.tick = false;
            }
            self.game.pause();
        }
    },
    resume: {
        enumerable: true, 
        writable: true, 
        value: function resume(){
            var self = this;
            if (!self.tick) {
                self.tick = window.setInterval(self.make_bola, 250);
            }
            self.game.resume();
        }
    },
    rescale: {
        enumerable: true, 
        writable: true, 
        value: function rescale(){
            var self = this;
            self.scale = self.game.scaleToWindow(colors.vibe_dark);
        }
    }
}), ՐՏ_3);
var Palette = (ՐՏ_6 = function Palette() {
    this.parse = ՐՏ_bind(this.parse, this);
    Palette.prototype.__init__.apply(this, arguments);
}, Object.defineProperties(ՐՏ_6.prototype, {
    __init__: {
        enumerable: true, 
        writable: true, 
        value: function __init__(asset){
            var self = this;
            ՐՏ_rebindAll(this, true);
            var v;
            if (asset) {
                v = _new(Vibrant, asset);
                if (v) {
                    v.getPalette(self.parse);
                    self.asset = asset;
                }
            }
            self.vibe = "#335533";
            self.vibe_light = "#656565";
            self.vibe_dark = "#0f1f0f";
            self.mute = "#111111";
            self.mute_light = "#333333";
            self.mute_dark = "#222222";
        }
    },
    parse: {
        enumerable: true, 
        writable: true, 
        value: function parse(err, palette){
            var self = this;
            palette = palette === void 0 ? "" : palette;
            self.palette = palette;
            if (palette) {
                self.vibe = palette.Vibrant.getHex();
                self.vibe_light = palette.LightVibrant.getHex();
                self.vibe_dark = palette.DarkVibrant.getHex();
                self.mute = palette.Muted.getHex();
                self.mute_light = palette.LightMuted.getHex();
                self.mute_dark = palette.DarkMuted.getHex();
            }
        }
    }
}), ՐՏ_6);
function main() {
    var colors, educajuego;
    if (window.educajuego) {
        return;
    }
    if (window.transpiler === "Transcrypt") {
        colors = new Palette("docs/images/monk_transcribing_logo.png");
    } else if (window.transpiler === "Rapydscript") {
        colors = new Palette("docs/images/rs_logo_tiny.png");
    } else {
        colors = new Palette();
    }
    educajuego = new Director();
    educajuego.game.start();
    window.onblur = educajuego.pause;
    window.onfocus = educajuego.resume;
    window.onresize = educajuego.rescale;
    window.colors = colors;
    window.educajuego = educajuego;
    window.start_ide();
}
main();var ՐՏ_7, ՐՏ_8, ՐՏ_9;

},{"./common.py":27,"node-vibrant":2,"rapydscript":24}]},{},[28]);
