/**
 * SGame by Simon Eddeland
 */

var SGame = {};

/**
 * Enumeration of keys that can be detected
 */
var Keys = {
  Back: 8, Tab: 9, Enter: 13, Shift: 16, Control: 17, Alt: 18, Escape: 27, Space: 32, Left: 37, Up: 38, Right: 39, Down: 40,
  Delete: 46, D0: 48, D1: 49, D2: 50, D3: 51, D4: 52, D5: 53, D6: 54, D7: 55, D8: 56, D9: 57, A: 65, B: 66, C: 67, D: 68,
  E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85,
  V: 86, W: 87, X: 88, Y: 89, Z: 90
};

/**
 * The state of the keyboard (which keys are pressed) at some time
 */
function KeyboardState(pressedKeys) {
  this.pressed = pressedKeys;
}

KeyboardState.prototype = {
  isKeyDown : function(keyCode) {
    return this.pressed[keyCode];
  },
  isKeyUp : function(keyCode) {
    return !this.pressed[keyCode];
  }
};

/**
 * Manages Keyboard information and used to get KeyboardStates.
 */
var Keyboard = (function() {
  // Array of currently pressed keys
  var pressed = {};

  var onKeyDown = function(event) {
    pressed[event.keyCode] = true;
  };

  var onKeyUp = function(event) {
    delete pressed[event.keyCode];
  };

  var getState = function() {
    return new KeyboardState(JSON.parse(JSON.stringify(pressed)));
  };

  return {
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    getState: getState
  };
})();

// Hook up keyboard events to the Keyboard object
window.addEventListener('keyup',   function(event) { Keyboard.onKeyUp(event); },   false);
window.addEventListener('keydown', function(event) { Keyboard.onKeyDown(event); }, false);


/**
 * Represents the state of the Mouse (position and buttons pressed)
 */
function MouseState(mouseInfo) {
  this.x = mouseInfo.x;
  this.y = mouseInfo.y;
  this.leftButtonDown = mouseInfo.leftButton;
  this.rightButtonDown = mouseInfo.rightButton;
  this.middleButtonDown = mouseInfo.middleButton;
}

MouseState.prototype = {
};

/**
 * Manages Mouse information and used to get MouseStates
 */
var Mouse = (function() {
  var mouseInfo = {
    x: 0,
    y: 0,
    leftButton : false,
    middleButton: false,
    rightButton: false
  };

  var gameCanvas = document.getElementById("sgame");

  var onMove = function(evt) {
    var rect = gameCanvas.getBoundingClientRect();
    mouseInfo.x = (evt.clientX - rect.left) / (rect.right - rect.left) * gameCanvas.width;
    mouseInfo.y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * gameCanvas.height;
  };

  var onButtonDown = function(evt) {
    updateButtons(evt.buttons);
  };

  var onButtonUp = function(evt) {
    updateButtons(evt.buttons);
  };

  var updateButtons = function(buttons) {
    // No support for button 4 or 5
    buttons = buttons >= 16 ? buttons - 16 : buttons;
    buttons = buttons >= 8 ? buttons - 8 : buttons;
    if (buttons >= 4) {
      buttons -= 4;
      mouseInfo.middleButton = true;
    } else {
      mouseInfo.middleButton = false;
    }
    if (buttons >= 2) {
      buttons -= 2;
      mouseInfo.rightButton = true;
    } else {
      mouseInfo.rightButton = false;
    }
    if (buttons >= 1) {
      buttons -= 1;
      mouseInfo.leftButton = true;
    } else {
      mouseInfo.leftButton = false;
    }
  };

  var getState = function() {
    return new MouseState(JSON.parse(JSON.stringify(mouseInfo)));
  };

  return {
    onMove: onMove,
    onButtonDown: onButtonDown,
    onButtonUp: onButtonUp,
    getState: getState
  };
})();

// Hook up mouse events to the Mouse object
window.addEventListener('mousemove', function(event) { Mouse.onMove(event); }, false);
window.addEventListener('mousedown', function(event) { Mouse.onButtonDown(event); }, false);
window.addEventListener('mouseup', function(event) { Mouse.onButtonUp(event); }, false);

/**
 * A 2-dimensional vector
 */
function Vector2(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector2.prototype = {
  imuls: function (scalar) { this.x *= scalar; this.y *= scalar;},      // Multiply itself with scalar
  iadd:  function (vector) { this.x += vector.x; this.y += vector.y;},   // Add itself with Vector
  getLength: function()    { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));}
};

/**
 * A rectangle with a method for checking if two rectangles intersect
 */
function Rectangle(x, y, width, height) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
}

Rectangle.prototype = {
  intersects: function (rectangle) {
    return this.x < rectangle.x + rectangle.width &&
           this.x + this.width > rectangle.x &&
           this.y < rectangle.y + rectangle.height &&
           this.y + this.height > rectangle.y;
  }
};

/**
 * Used to load content (images and audio) at startup, as well as serving content to clients
 */
function ContentManager() {
  this.images = {};
  this.audioObjects = {};
  this.checkLoadStatus = function() {
    var loadingInfo = this.getLoadingInfo();
    console.log("Loading status: " + loadingInfo.loadedImg + "/" + loadingInfo.totalImg + " images, " + loadingInfo.loadedAudio + "/" + loadingInfo.totalAudio + " audio files");
    if (loadingInfo.loadedImg === loadingInfo.totalImg && loadingInfo.loadedAudio === loadingInfo.totalAudio){
      if (this.onAllContentLoaded !== null) {
        this.onAllContentLoaded();
      }
    }
  };

  this.onAllContentLoaded = null;
}

ContentManager.prototype = {
  loadImage: function(imgsrc) {
    var self = this;
    var imgs = this.images;
    imgs[imgsrc] = new Image();
    imgs[imgsrc].loaded = false;
    imgs[imgsrc].onload = function() {
      console.log("Loaded new " + imgsrc);
      imgs[imgsrc].loaded = true;
      self.checkLoadStatus();
    };
    return imgs[imgsrc];
  },
  getImage: function(imgsrc) {
    return this.images[imgsrc];
  },
  loadAudio: function(audioSrc) {
    var self = this;
    var audObjs = this.audioObjects;
    audObjs[audioSrc] = null;
    audObjs[audioSrc] = new Howl({
      src: ['audio/' + audioSrc],
      preload: false,
      onload: function() {
        console.log("Loaded new " + audioSrc);
        audObjs[audioSrc].loaded = true;
        self.checkLoadStatus();
      }
    });
    audObjs[audioSrc].loaded = false;
    return audObjs[audioSrc];
  },
  getAudio: function(audioSrc) {
    return this.audioObjects[audioSrc];
  },
  getLoadingInfo: function() {
    var numImgs = Object.keys(this.images).length, loadedImgs = 0, imgs = this.images, numAudio = Object.keys(this.audioObjects).length, loadedAud = 0, aud = this.audioObjects;
    // Check image status
    Object.keys(imgs).forEach(function(property) {
      if (imgs[property].loaded) {
        loadedImgs++;
      }
    });
    // Check audio status
    Object.keys(aud).forEach(function(property) {
      if (aud[property].loaded) {
        loadedAud++;
      }
    });
    return {
      totalImg: numImgs,
      loadedImg: loadedImgs,
      totalAudio: numAudio,
      loadedAudio: loadedAud
    };
  },
  startLoading: function() {
    var imgs = this.images, audObjs = this.audioObjects;

    // Load all images
    Object.keys(imgs).forEach(function(property) {
      imgs[property].src = "img/" + property;
      console.log("Loading " + property);
    });

    // Load all audio files with Howler
    Object.keys(audObjs).forEach(function(property) {
      audObjs[property].load();
      console.log("Loading " + property);
    });
  }
};

/**
 * Represents the game canvas, used to get and set the size of the canvas
 */
SGame.Canvas = (function() {
  var canvas = document.getElementById("sgame");
  var setSize = function(newSize) {
    canvas.height = newSize.height;
    canvas.width = newSize.width;
  };
  var getSize = function() {
    return {
      width: canvas.width,
      height: canvas.height
    };
  };
  return {
    setSize: setSize,
    getSize: getSize
  };
})();


/**
 * An abstraction layer over the canvas 2d context, used to draw images and strings
 */
function Drawer(canvasName) {
  var canvas = document.getElementById(canvasName);
  canvas.oncontextmenu = function() {
     return false;
  };
  this.ctx = canvas.getContext('2d');
}

Drawer.prototype = {
  draw: function(img, rectangle, rotation, rotationImageOrigin) {
    rectangle.width = (typeof rectangle.width !== 'undefined') ? rectangle.width : img.width;
    rectangle.height = (typeof rectangle.height !== 'undefined') ? rectangle.height : img.height;

    if (typeof rotation !== 'undefined') {
      rotationImageOrigin = typeof rotationImageOrigin === 'undefined' ? {x: rectangle.width / 2, y: rectangle.height / 2} : rotationImageOrigin;
      this.ctx.save();
      this.ctx.translate(rectangle.x + rotationImageOrigin.x, rectangle.y + rotationImageOrigin.y);
      this.ctx.rotate(rotation * Math.PI / 180);
      this.ctx.drawImage(img, - rotationImageOrigin.x, - rotationImageOrigin.y, rectangle.width, rectangle.height);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(img, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }

  },
  drawString: function(text, vector, font, color) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, vector.x, vector.y);
    this.ctx.restore();
  },
  clear: function(color) {
    color = (typeof color !== 'undefined') ?  color : "black";
    var canvasSize = SGame.Canvas.getSize();
    this.ctx.save();
    this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    this.ctx.restore();
  }
};


/**
 * Main component of SGame. Hook up your game to SGame by calling SGame.start(yourgame)
 */
SGame.Game = (function(){
  var sb, lastGameTick, externalGame, contentManager, gameHasLoaded;

  var cancelRequestAnimFrame = (function(){
  return window.cancelRequestAnimationFrame ||
         window.webkitCancelRequestAnimationFrame ||
         window.mozCancelRequestAnimationFrame    ||
         window.oCancelRequestAnimationFrame      ||
         window.msCancelRequestAnimationFrame     ||
         window.clearTimeout;
  })();

  var requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function( callback ){
           window.setTimeout(callback, 1000 / 60);
         };
  })();

  var initialize = function() {
    console.log('Initializing SGame');

    // Called sb for historical reasons (spriteBatch in MonoGame/XNA)
    sb = new Drawer('sgame');
    var width = SGame.Canvas.getSize().width;
    var height = SGame.Canvas.getSize().height;

    // Show and position loading image
    var loadingImage = document.getElementById('sgameloading');
    loadingImage.style.display = "block";
    loadingImage.style.top = (height / 2) - (loadingImage.height / 2) + 'px';
    loadingImage.style.left = (width / 2) - (loadingImage.width / 2) + 'px';

    // Send contentManager to externalGame then start loading all assets while showingthe loading screen
    contentManager = new ContentManager();
    gameHasLoaded = false;
    contentManager.onAllContentLoaded = loadingCompleted;
    console.log("Loading game content");
    externalGame.loadContent(contentManager);
    contentManager.startLoading();
    // Check once at beginning, will trigger game start if no content will be loaded
    contentManager.checkLoadStatus();

  };

  var loadingCompleted = function() {

    // Hide loading image
    document.getElementById("sgameloading").style.display = "none";

    console.log("Initializing game");
    externalGame.initialize();
    console.log("Starting gameloop");
    gameHasLoaded = true;
  };

  var gameLoop = function() {
    var now = Date.now();
    var dt = (now - (lastGameTick || now)) / 1000; // Timediff since last frame / gametick
    lastGameTick = now;
    requestAnimFrame(gameLoop);

    if (gameHasLoaded) {
      externalGame.update(dt);
      externalGame.draw();
    } else {
      updateLoadingScreen();
    }

  };

  var updateLoadingScreen = function() {
    var loadingInfo = contentManager.getLoadingInfo(), canvasSize = SGame.Canvas.getSize();
    sb.clear();
    sb.drawString("Loading", {x: (canvasSize.width / 2) - 70, y: (canvasSize.height / 2) - 100}, "36px sans-serif", "white");
    sb.drawString(loadingInfo.loadedImg + "/" + loadingInfo.totalImg + " images", {x: (canvasSize.width / 2) - 50, y: (canvasSize.height  / 2) + 100}, "18px sans-serif", "white");
    sb.drawString(loadingInfo.loadedAudio + "/" + loadingInfo.totalAudio + " sound files", {x: (canvasSize.width / 2) - 50, y: (canvasSize.height  / 2) + 120}, "18px sans-serif", "white");
    sb.drawString("Powered by SGame", {x: (canvasSize.width / 2) - 100, y: (canvasSize.height  / 2) + 160}, "24px sans-serif", "white");
  };

  /**
   * Starts the game
   */
  var start = function(ext) {
      externalGame = ext;
      initialize();
      gameLoop();
  };

  return {
    'start' : start
  };
})();
