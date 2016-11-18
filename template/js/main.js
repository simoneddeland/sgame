/**
 * An object containing your main game code
 */
var game1 = (function() {

  var spriteBatch, content;

  /**
   * Load all your content into the provided contentManager. A loadingscreen will be shown during the loading.
   */
  var loadContent = function(contentManager) {
    spriteBatch = new Drawer("sgame");
    content = contentManager;

    // TODO: Load your content (images and audio) here

  };

  /**
   * Called after loading is complete
   */
  var initialize = function() {

    // TODO: Add your initialization logic here

  };

  /**
   *  Called repeatedly after loading and initialization is complete. Place your update logic here
   */
  var update = function(dt) {

    // TODO: Add your update logic here

  };

  /**
   * Called after each update. Place your draw code here
   */
  var draw = function() {
    spriteBatch.clear("cornflowerblue");

    // TODO: Add your drawing code here

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
