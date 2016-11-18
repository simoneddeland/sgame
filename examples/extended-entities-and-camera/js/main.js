/**
 * An object containing your main game code
 */
var game1 = (function() {

  var spriteBatch, content;

  var camera;
  var tank, trees = [], tankSpeed = 5;
  var keyboard, prevKeyboard;
  var canvasSize;
  var UIText;

  /**
   * Load all your content into the provided contentManager. A loadingscreen will be shown during the loading.
   */
  var loadContent = function(contentManager) {
    spriteBatch = new Drawer("sgame");
    content = contentManager;

    content.loadImage("tankBeige_outline.png");
    content.loadImage("treeGreen_low.png");

  };

  /**
   * Called after loading is complete
   */
  var initialize = function() {
    var tankImg = content.getImage("tankBeige_outline.png");
    var treeImg = content.getImage("treeGreen_low.png");

    camera = new Camera(spriteBatch, 0, 0);
    canvasSize = SGame.Canvas.getSize();

    tank = new Entity(new Rectangle(200, 200, tankImg.width / 2, tankImg.height / 2), tankImg);

    // Create some trees
    trees.push(new Entity(new Rectangle(200, 400, treeImg.width, treeImg.height), treeImg));
    trees.push(new Entity(new Rectangle(120, 300, treeImg.width, treeImg.height), treeImg));
    trees.push(new Entity(new Rectangle(520, 120, treeImg.width, treeImg.height), treeImg));

    UIText = new TextEntity("Drive the tank around!", new Vector2(100, 100), "36px sans-serif", "white");

    keyboard = Keyboard.getState();
    prevKeyboard = Keyboard.getState();

  };

  /**
   *  Called repeatedly after loading and initialization is complete. Place your update logic here
   */
  var update = function(dt) {

    // Save previous tank coordinates, move back tank if colliding with tree
    var prevTankX = tank.rectangle.x;
    var prevTankY = tank.rectangle.y;

    keyboard = Keyboard.getState();
    prevKeyboard = Keyboard.getState();

    // Move the tank
    if (keyboard.isKeyDown(Keys.A) || keyboard.isKeyDown(Keys.Left)) {
      tank.rotation -= 3;
    }
    if (keyboard.isKeyDown(Keys.D) || keyboard.isKeyDown(Keys.Right)) {
      tank.rotation += 3;
    }
    if (keyboard.isKeyDown(Keys.W) || keyboard.isKeyDown(Keys.Up)) {
      tank.rectangle.x += Math.cos(degToRad(tank.rotation + 90)) * tankSpeed;
      tank.rectangle.y += Math.sin(degToRad(tank.rotation + 90)) * tankSpeed;
    }
    if (keyboard.isKeyDown(Keys.S) || keyboard.isKeyDown(Keys.Down)) {
      tank.rectangle.x -= Math.cos(degToRad(tank.rotation + 90)) * tankSpeed;
      tank.rectangle.y -= Math.sin(degToRad(tank.rotation + 90)) * tankSpeed;
    }

    // Make the camera follow the tank
    if (tank.rectangle.x - camera.x < 200) {
      camera.x = tank.rectangle.x - 200;
    }
    if (tank.rectangle.y - camera.y < 200) {
      camera.y = tank.rectangle.y - 200;
    }
    if (tank.rectangle.x - camera.x > canvasSize.width - 200) {
      camera.x = tank.rectangle.x - canvasSize.width + 200;
    }
    if (tank.rectangle.y - camera.y > canvasSize.height - 200) {
      camera.y = tank.rectangle.y - canvasSize.height + 200;
    }

    // Dont allow tree collisions
    trees.forEach(function(tree) {
      if (tree.intersects(tank)) {
        tank.rectangle.x = prevTankX;
        tank.rectangle.y = prevTankY;
      }
    }, this);

  };

  /**
   * Called after each update. Place your draw code here
   */
  var draw = function() {
    spriteBatch.clear("green");

    trees.forEach(function(tree) {
      camera.draw(tree);
    }, this);

    camera.draw(tank);

    // UI text that does not move with camera
    camera.drawUIString(UIText);

  };

  /**
   * Helper function for converting degrees to radians
   */
  var degToRad = function(degrees) {
    return degrees * Math.PI / 180;
  };

  /**
   * Return the necessary methods to SGame
   */
  return {
    loadContent: loadContent,
    initialize: initialize,
    update: update,
    draw: draw
  };
})();


// Start the game when the page has finished loading
$(function(){
  'use strict';
  SGame.Game.start(game1);

});
