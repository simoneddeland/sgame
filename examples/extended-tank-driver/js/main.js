
/**
 * Information shared between scenes
 */
GameGlobals = {
  currentScene: null,

  setScene: function(scene) {
    this.currentScene = scene;
    this.currentScene.sceneReset();
  },

  highScore: 0,
  lastScore: 0
};

/**
 * Utitilty function for creating random numbers (upper limit is exclusive)
 */
var random = function(min, max) {
  return Math.floor((Math.random() * (max + 1 - min)) + min);
};

/**
 * Adds some new functionality to input checking
 */
var Input = (function() {
  var prevKeyboard = Keyboard.getState();
  var keyboard = Keyboard.getState();
  var prevMouse = Mouse.getState();
  var mouse = Mouse.getState();

  var update = function(dt) {
    prevKeyboard = keyboard;
    keyboard = Keyboard.getState();
    prevMouse = mouse;
    mouse = Mouse.getState();
  };

  var isKeyDown = function(key) {
    return keyboard.isKeyDown(key);
  };

  var isKeyPressed = function(key) {
    return prevKeyboard.isKeyUp(key) && keyboard.isKeyDown(key);
  };

  var isLeftMousePressed = function() {
    return !prevMouse.leftButtonDown && mouse.leftButtonDown;
  };

  var getMouse = function() {
    return mouse;
  };

  return {
    update: update,
    isKeyDown: isKeyDown,
    isKeyPressed: isKeyPressed,
    isLeftMousePressed: isLeftMousePressed,
    getMouse: getMouse
  };
})();

/**
 * The main menu
 */
var menuScene = (function() {

  var camera, content, spriteBatch;
  var menuText;
  var button, buttonText;
  var canvasSize;
  var highScoreText, lastScoreText;
  var clickAudio;
  var tank;
  var menuMusic;

  var loadContent = function(contentManager, sb) {
    content = contentManager;
    spriteBatch = sb;
    content.loadImage("green_button05.png");
    clickAudio = content.loadAudio("click3.wav");
    // Even though this load is duplicated in another scene, it will only load once
    content.loadImage("tankBeige_outline.png");
    menuMusic = content.loadAudio("juhani-titlescreen.ogg");
  };

  /**
   * Initialize the menu scene
   */
  var initialize = function() {
    canvasSize = SGame.Canvas.getSize();

    buttonImg = content.getImage("green_button05.png");

    camera = new Camera(spriteBatch, 0, 0);
    var tankImg = content.getImage("tankBeige_outline.png");
    tank = new Entity(new Rectangle(canvasSize.width / 2- (tankImg.width / 2), canvasSize.height / 2 - tankImg.height / 2, tankImg.width, tankImg.height), tankImg);

    menuText = new TextEntity("Tank driver", new Vector2(280, 200), "46px sans-serif", "white");
    button = new Entity(new Rectangle(canvasSize.width / 2 - buttonImg.width / 2, canvasSize.height / 2 + 100, buttonImg.width, buttonImg.height), buttonImg);
    buttonText = new TextEntity("Start", new Vector2(button.rectangle.x + 57, button.rectangle.y + 33), "30px sans-serif", "white");
    highScoreText = new TextEntity("High score: " + GameGlobals.highScore, new Vector2(button.rectangle.x + 7, button.rectangle.y + 73), "30px sans-serif", "white");
    lastScoreText = new TextEntity("Last score: " + GameGlobals.lastScore, new Vector2(button.rectangle.x + 7, button.rectangle.y + 113), "30px sans-serif", "white");
  };

  /**
   * Update the menu scene
   */
  var update = function(dt) {

    tank.rotation += 1;

    if (Input.isLeftMousePressed()
        && Input.getMouse().x >= button.rectangle.x
        && Input.getMouse().x <= button.rectangle.x + button.rectangle.width
        && Input.getMouse().y >= button.rectangle.y
        && Input.getMouse().y <= button.rectangle.y + button.rectangle.height
        ) {
      // Change scene
      menuMusic.stop();
      GameGlobals.setScene(gameScene);
      clickAudio.play();
    }

  };

  /**
   * Draw the menu scene
   */
  var draw = function() {
    spriteBatch.clear("cornflowerblue");
    camera.drawUIString(menuText);
    camera.drawUIEntity(button);
    camera.drawUIString(buttonText);
    camera.drawUIString(highScoreText);
    camera.drawUIString(lastScoreText);
    camera.drawUIEntity(tank);

  };

  /**
   * Called when menu scene is set as the currentScene
   */
  var sceneReset = function() {
    this.initialize();
    menuMusic.fade(0, 0.2, 500);
    menuMusic.loop(true);
    menuMusic.play();
  };

  /**
   * Properties available to the rest of the program
   */
  return {
    loadContent: loadContent,
    initialize: initialize,
    update: update,
    draw: draw,
    sceneReset: sceneReset
  };
})();


/**
 * The main part of the game
 */
var gameScene = (function() {

  var camera, content, spriteBatch;
  var obstacles = [];
  var player, playerSpeed = 7, playerBonusPosition;
  var cameraSpeed;
  var canvasSize;
  var lengthText;
  var gameOverAudio, levelUpAudio, gameMusic;
  var smoke1, smoke2;
  var smokeCounter;

  /**
   * Load content for the main part of the game
   */
  var loadContent = function(contentManager, sb) {
    content = contentManager;
    spriteBatch = sb;

    content.loadImage("blank.png");
    content.loadImage("tankBeige_outline.png");
    content.loadImage("smokeGrey0.png");
    content.loadImage("smokeGrey2.png");
    levelUpAudio = content.loadAudio("level_up.ogg");
    gameOverAudio = content.loadAudio("game_over.ogg");
    gameMusic = content.loadAudio("juhani-level1.ogg");

  };

  /**
   * Initialize the main part of the game
   */
  var initialize = function() {
    camera = new Camera(spriteBatch, 0, 0);
    cameraSpeed = 2;
    canvasSize = SGame.Canvas.getSize();

    var playerImg = content.getImage("tankBeige_outline.png");
    var smoke1Img = content.getImage("smokeGrey0.png");
    var smoke2Img = content.getImage("smokeGrey2.png");

    // Reset player position
    player = new Entity(new Rectangle(0, 0, playerImg.width / 2, playerImg.height / 2), playerImg);
    player.rotation = -90;
    playerBonusPosition = new Vector2(100, canvasSize.height / 2 - player.rectangle.height / 2);
    player.rectangle.x = camera.x + playerBonusPosition.x;
    player.rectangle.y = camera.y + playerBonusPosition.y;

    lengthText = new TextEntity("Score: 0", new Vector2(canvasSize.width - 180, 30), "30px sans-serif", "white");

    // Reset smoke trail
    smoke1 = new Entity(new Rectangle(player.rectangle.x - 50, player.rectangle.y, smoke1Img.width / 2 - 10, smoke1Img.height / 2 - 10), smoke1Img);
    smoke2 = new Entity(new Rectangle(smoke1.rectangle.x - 50, smoke1.rectangle.y, smoke2Img.width / 2 + 10, smoke2Img.height / 2 + 10), smoke2Img);
    smokeCounter = 0;
    smokeCounterLimit = 15;

    // Reset obstacle list
    obstacles = [];
  };

  /**
   * Update the main part of the game
   */
  var update = function(dt) {

    camera.x += cameraSpeed;
    smokeCounter++;
    lengthText.text = "Score: " + Math.floor(camera.x / 10);

    // Allow player movement
    if (Input.isKeyDown(Keys.W) || Input.isKeyDown(Keys.Up)) {
      playerBonusPosition.y -= playerSpeed;
    }
    if (Input.isKeyDown(Keys.S) || Input.isKeyDown(Keys.Down)) {
      playerBonusPosition.y += playerSpeed;
    }
    if (Input.isKeyDown(Keys.A) || Input.isKeyDown(Keys.Left)) {
      playerBonusPosition.x -= playerSpeed;
    }
    if (Input.isKeyDown(Keys.D) || Input.isKeyDown(Keys.Right)) {
      playerBonusPosition.x += playerSpeed;
    }

    // Constraint player movement
    playerBonusPosition.x = playerBonusPosition.x > 200 ? 200 : playerBonusPosition.x;
    playerBonusPosition.x = playerBonusPosition.x < 0 ? 0 : playerBonusPosition.x;
    playerBonusPosition.y = playerBonusPosition.y > canvasSize.height - player.rectangle.height ? canvasSize.height - player.rectangle.height : playerBonusPosition.y;
    playerBonusPosition.y = playerBonusPosition.y < 0 ? 0 : playerBonusPosition.y;

    // Set player position
    player.rectangle.x = camera.x + playerBonusPosition.x;
    player.rectangle.y = camera.y + playerBonusPosition.y;

    // Move smoke
    if (smokeCounter > smokeCounterLimit) {
      smokeCounter = 0;
      smoke2.rectangle.x = smoke1.rectangle.x;
      smoke2.rectangle.y = smoke1.rectangle.y + smoke1.rectangle.height / 2 - smoke2.rectangle.height / 2;
      smoke1.rectangle.x = player.rectangle.x;
      smoke1.rectangle.y = player.rectangle.y + player.rectangle.height / 2 - smoke1.rectangle.height / 2;
    }

    // Spawn new obstacles
    if (camera.x % 100 < cameraSpeed) {
      var length = random(70, 140);
      tempObs = new Entity(new Rectangle(camera.x + canvasSize.width, random(0, canvasSize.height), length, 20), content.getImage("blank.png"));
      var rotationDirection = random(0, 1) === 0 ? -1 : 1;
      tempObs.rotationSpeed = rotationDirection * random(1, 3);
      obstacles.push(tempObs);
    }

    // Speed up camera
    if (camera.x % 1000 < cameraSpeed) {
      cameraSpeed++;
      smokeCounterLimit = smokeCounterLimit > 5 ? smokeCounterLimit -= 1 : 5;
      levelUpAudio.play();
    }

    // Check collision with player
    obstacles.forEach(function(obstacle) {
      obstacle.rotation += obstacle.rotationSpeed;
      if (obstacle.intersects(player)) {
        GameGlobals.lastScore = Math.floor(camera.x / 10);
        GameGlobals.highScore = GameGlobals.lastScore > GameGlobals.highScore ? GameGlobals.lastScore : GameGlobals.highScore;
        gameMusic.stop();
        gameOverAudio.play();
        GameGlobals.setScene(gameOverScene);
      }
    }, this);

  };

  /**
   * Draw the main part of the game
   */
  var draw = function() {
    spriteBatch.clear("green");

    camera.draw(smoke1);
    camera.draw(smoke2);

    camera.draw(player);

    obstacles.forEach(function(obstacle) {
      camera.draw(obstacle);
    }, this);

    camera.drawUIString(lengthText);

  };

  /**
   * Called when this scene is set as the currentScene
   */
  var sceneReset = function() {
    this.initialize();
    gameMusic.fade(0, 0.2, 500);
    gameMusic.loop(true);
    gameMusic.play();
  };

  /**
   * Properties available to the rest of the program
   */
  return {
    loadContent: loadContent,
    initialize: initialize,
    update: update,
    draw: draw,
    sceneReset: sceneReset
  };

})();

/**
 * Game over scene
 */
var gameOverScene = (function() {

  var camera, content, spriteBatch;
  var canvasSize;

  var gameOverSceneMusic;
  var gameOverText;

  /**
   * Load content for the game over scene
   */
  var loadContent = function(contentManager, sb) {
    content = contentManager;
    spriteBatch = sb;
    gameOverSceneMusic = content.loadAudio("juhani-ending.ogg");
    content.loadImage("text_gameover.png");
  };

  /**
   * Initialize the game over scene
   */
  var initialize = function() {
    camera = new Camera(spriteBatch, 0, 0);
    canvasSize = SGame.Canvas.getSize();
    var gameOverImg = content.getImage("text_gameover.png");
    gameOverText = new Entity(new Rectangle(canvasSize.width / 2 - gameOverImg.width / 2, 100, gameOverImg.width, gameOverImg.height), gameOverImg);
  };

  /**
   * Update the game over scene
   */
  var update = function(dt) {
    if (Input.isKeyDown(Keys.Enter)) {
      gameOverSceneMusic.stop();
      GameGlobals.setScene(menuScene);
    } else if (Input.isKeyDown(Keys.Space)) {
      gameOverSceneMusic.stop();
      GameGlobals.setScene(gameScene);
    }
  };

  /**
   * Draw the game over scene
   */
  var draw = function() {
    spriteBatch.clear("maroon");
    camera.draw(gameOverText);
    spriteBatch.drawString("Score this round: " + GameGlobals.lastScore, new Vector2(210, 250), "30px sans-serif", "white");
    spriteBatch.drawString("High score: " + GameGlobals.highScore, new Vector2(210, 300), "30px sans-serif", "white");
    spriteBatch.drawString("Press Enter to return to main menu", new Vector2(210, 400), "30px sans-serif", "white");
    spriteBatch.drawString("Press Space to play again", new Vector2(210, 450), "30px sans-serif", "white");
  };

  /**
   * Called when this scene is set as the currentScene
   */
  var sceneReset = function() {
    this.initialize();
    gameOverSceneMusic.fade(0, 0.2, 500);
    gameOverSceneMusic.loop(true);
    gameOverSceneMusic.play();
  };

  /**
   * Properties available to the rest of the program
   */
  return {
    loadContent: loadContent,
    initialize: initialize,
    update: update,
    draw: draw,
    sceneReset: sceneReset
  };

})();

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

    // Load all content from all scens before going to the main menu
    menuScene.loadContent(content, spriteBatch);
    gameScene.loadContent(content, spriteBatch);
    gameOverScene.loadContent(content, spriteBatch);

  };

  /**
   * Called after loading is complete
   */
  var initialize = function() {

    // Initialize all scenes
    menuScene.initialize();
    gameScene.initialize();
    gameOverScene.initialize();

    // Start at the main menu
    GameGlobals.setScene(menuScene);
  };

  /**
   *  Called repeatedly after loading and initialization is complete. Place your update logic here
   */
  var update = function(dt) {
    // Always update input first
    Input.update(dt);
    GameGlobals.currentScene.update(dt);
  };

  /**
   * Called after each update. Place your draw code here
   */
  var draw = function() {
    GameGlobals.currentScene.draw();
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
