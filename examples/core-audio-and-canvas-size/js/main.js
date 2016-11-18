/**
 * An object containing your main game code
 */
var game1 = (function() {

  var spriteBatch, content;

  var collisionSound;
  var penguinImage, penguinPosition = new Vector2(0, 0), penguinVelocity = new Vector2(1, 2);

  var canvasSize;

  /**
   * Load all your content into the provided contentManager. A loadingscreen will be shown during the loading.
   */
  var loadContent = function(contentManager) {
    spriteBatch = new Drawer("sgame");
    content = contentManager;

    collisionSound = content.loadAudio("cardFan2.wav");
    penguinImage = content.loadImage("penguin.png");

  };

  /**
   * Called after loading is complete
   */
  var initialize = function() {
    // Save the canvas size in a more conviently named variable
    canvasSize = SGame.Canvas.getSize();
  };

  /**
   *  Called repeatedly after loading and initialization is complete. Place your update logic here
   */
  var update = function(dt) {

    // Move the penguin according to the velocity
    penguinPosition.iadd(penguinVelocity);

    // If the penguin collides with any canvas border, change its direction and play a sound
    if (penguinPosition.x < 0 || penguinPosition.x + penguinImage.width > canvasSize.width) {
      penguinVelocity.x *= -1;
      collisionSound.play();
    }
    if (penguinPosition.y < 0 || penguinPosition.y + penguinImage.height > canvasSize.height) {
      penguinVelocity.y *= -1;
      collisionSound.play();
    }

  };

  /**
   * Called after each update. Place your draw code here
   */
  var draw = function() {
    spriteBatch.clear("cornflowerblue");

    // Draw the penguin
    spriteBatch.draw(penguinImage, penguinPosition);

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
