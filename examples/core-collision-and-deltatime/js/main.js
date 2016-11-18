/**
 * An object containing your main game code
 */
var game1 = (function() {

  var spriteBatch, content;

  var shipImg, shipPosition = new Vector2(50, 400);
  var missileImg, missileRect, missileSpeed = 50;
  var buildingImg, buildingRect;

  var textPosition = new Vector2(300, 100);

  /**
   * Load all your content into the provided contentManager. A loadingscreen will be shown during the loading.
   */
  var loadContent = function(contentManager) {
    spriteBatch = new Drawer("sgame");
    content = contentManager;

    // Load and save all content in variables
    shipImg = content.loadImage("spaceShips_004.png");
    missileImg = content.loadImage("spaceMissiles_007.png");
    buildingImg = content.loadImage("spaceBuilding_023.png");

  };

  /**
   * Called after loading is complete
   */
  var initialize = function() {

    // Create the rectangles after content has loaded (width and height of the images are now available)
    missileRect = new Rectangle(shipPosition.x + (shipImg.width / 2) - (missileImg.width / 2), shipPosition.y - missileImg.height, missileImg.width, missileImg.height);
    buildingRect = new Rectangle(missileRect.x - 50, 100, buildingImg.width, buildingImg.height);

  };

  /**
   *  Called repeatedly after loading and initialization is complete. Place your update logic here
   */
  var update = function(dt) {

    // Move the missile by missileSpeed pixels per second, regardless of framerate
    missileRect.y -= missileSpeed * dt;

  };

  /**
   * Called after each update. Place your draw code here
   */
  var draw = function() {
    spriteBatch.clear("black");

    // Draw the images, missile last so it's on top
    spriteBatch.draw(shipImg, shipPosition, 180);
    spriteBatch.draw(buildingImg, buildingRect);
    spriteBatch.draw(missileImg, missileRect);

    // Use the intersects method of Rectangle to check if the missile is colliding with the building
    if (missileRect.intersects(buildingRect)) {
      spriteBatch.drawString("Collision detected", textPosition, "40px sans-serif", "red");
    } else {
      spriteBatch.drawString("No collision detected", textPosition, "40px sans-serif", "white");
    }

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
