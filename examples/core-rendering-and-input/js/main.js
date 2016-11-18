/**
 * An object containing your main game code
 */
var game1 = (function() {

  var spriteBatch, content;

  var shipImage, shipPosition = new Vector2(40, 50), shipRotation = 0;
  var mouse, keyboard;
  var spaceStationRectangle = new Rectangle(300, 100, 80, 40);
  var textPosition = new Vector2(450, 150);

  /**
   * Load all your content into the provided contentManager. A loadingscreen will be shown during the loading.
   */
  var loadContent = function(contentManager) {
    spriteBatch = new Drawer("sgame");
    content = contentManager;

    // Save the loaded content in a variable...
    shipImage = content.loadImage("spaceShips_001.png");
    // ... or get it later with getImage(imageName)
    content.loadImage("spaceStation_018.png");

  };

  /**
   * Called after loading is complete
   */
  var initialize = function() {

  };

  /**
   *  Called repeatedly after loading and initialization is complete. Place your update logic here
   */
  var update = function(dt) {

    // Get the current mousestate and keyboardstate
    mouse = Mouse.getState();
    keyboard = Keyboard.getState();

    // Move the middle of the ship to the cursor
    shipPosition.x = mouse.x - (shipImage.width / 2);
    shipPosition.y = mouse.y - (shipImage.height / 2);

    // Rotate the ship with the A, D, right arrow and left arrow keys
    if (keyboard.isKeyDown(Keys.A) || keyboard.isKeyDown(Keys.Left)) {
      shipRotation -= 2;
    }
    if (keyboard.isKeyDown(Keys.D) || keyboard.isKeyDown(Keys.Right)) {
      shipRotation += 2;
    }

  };

  /**
   * Called after each update. Place your draw code here
   */
  var draw = function() {

    // Black background
    spriteBatch.clear("black");

    // Draw images with Vector2, rotation is optional...
    spriteBatch.draw(shipImage, shipPosition, shipRotation);

    // ... or with Rectangle, rotation can be specified here as well
    spriteBatch.draw(content.getImage("spaceStation_018.png"), spaceStationRectangle);

    // Draw some text to the canvas
    spriteBatch.drawString("Hello world!", textPosition, "40px sans-serif", "white");

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
