# SGame
SGame is a small Javascript game framework in the style of XNA/MonoGame. It is small, easy to setup and users familiar with XNA or MonoGame will immediately recognize the object types and methods that are used in SGame.

## Application flow
SGame needs to be passed an object with the methods loadContent, initialize, update, draw, which are included in an object called game1 in the template file. 

SGame will start loading all content that is loaded in the loadContent method, showing a loading screen and some progress information during the loading. When loading is complete the initialize method is called once. After initialize finishes the update method and subsequently the draw method will be called after each other with a frequency matching the screen refresh rate (as defined in the browsers requestAnimationFrame).

### Summary of application flow
loadContent -> initialize -> update -> draw -> update -> draw -> update -> draw ...
## Basic usage
The easiest way to start using SGame is to copy the template folder and start adding content to your img and audio folders. Your game code should be in main.js. Then start by adding code to the 4 methods in the object game1 (which you should rename to whatever name your game has). Check out the example programs to see all features of SGame in use.

The html file containing your game should contain the following elements where you want the game to be. This is where you specify the initial width and height of your game canvas.

```html
<div id="sgamecontainer">
  <canvas id='sgame' width='800' height='600'>
    Your browser does not support the element HTML5 Canvas.
  </canvas>
  <img id="sgameloading" src="img/gears.svg">
</div>
```

## Dependencies
SGame uses jQuery to make sure the game does not start before the page has finished loading and Howler for sounds. Both jQuery and Howler must be included before SGame.js, SGame-extended and your main.js file. SGame must be included before SGame-extended (if you want to use SGame-extended) and your main.js file should be included last.

This is an example of how you can include the necessary Javascript files for your game (SGame-Extended is optional).
```html
<script src="js/lib/jquery.js"></script>
<script src="js/lib/howler.min.js"></script>
<script src="js/sgame.js"></script>
<script src="js/sgame-extended.js"></script>
<script src="js/main.js"></script>
```

## SGame API
Listed below are the public parts of SGame intended for use by other developers. Some other parts which are used by SGame internally are also available, documentation for those parts is provided in the source code. The API is developed to mimic the style of XNA and MonoGame.

### Input
#### Keyboard
Manages Keyboard information and used to get KeyboardStates
* KeyboardState getState() - Gets the current KeyboardState

#### KeyboardState
The state of the keyboard (which keys are pressed) at some time
* Boolean isKeyDown(Keys key) - Checks if the supplied key is down (the key is a number keycode or property of Keys)

#### Keys
Enumeration of keys that can be detected

#### Mouse
Manages Mouse information and used to get MouseStates
* MouseState getState() - Gets the current MouseState

#### MouseState
Represents the state of the Mouse (position and buttons pressed)
* Number x - The x-coordinate of the mouse in canvas space
* Number y - The y-coordinate of the mouse in canvas 
* Boolean leftButtonDown - True if the left mouse button is down, false otherwise
* Boolean rightButtonDown - True if the right mouse button is down, false otherwise
* Boolean middleButtonDown - True if the middle mouse button is down, false otherwise

### Utitity
#### Vector2
A 2-dimensional vector
* Constructor Vector2(Number x, Number y) - Creates a new Vector2 with the specified coordinates
* Number x - The x-coordinate of the vector
* Number y - The y-coordinate of the vector
* Void imuls(Number scalar) - Multiply the current vector with a scalar
* Void iadd(Vector2 vector) - Adds the current vector with the supplied vector
* Number getLength() - Gets the length of this vector

#### Rectangle
A rectangle with a method for checking if two rectangles intersect
* Constructor Rectangle(Number x, Number y, Number width, Number height) - Creates a new Rectangle with the specified values
* Number x - The x-coordinate of the rectangle
* Number y - The y-coordinate of the rectangle
* Number width - The width of the rectangle
* Number height - The height of the rectangle
* Boolean intersects(Rectangle otherRectangle) - Checks if the two rectangles intersects

### Content
#### ContentManager
Used to load content (images and audio) at startup, as well as serving content to clients. Images are loaded from the img folder and audio from the audio folder.
* Image loadImage(String imageName) - Starts loading and returns the specified image in the img folder
* Howl loadAudio(String audioName) - Starts loading and returns the specified audio file as a Howl (see Howler documentation for Howl properties and methods)
* Image getImage(String imageName) - Gets a previously loaded image with the specified imageName
* Howl getAudio(String audioName) - Gets a previously loaded audio file as a Howl (see Howler documentation for Howl properties and methods)

### Canvas interaction
#### SGame.Canvas
Represents the game canvas, used to get and set the size of the canvas
* Void setSize(SizeInfo newSize) - Change the size of the game canvas, SizeInfo is an object with width and height properties
* SizeInfo getSize() - Gets the size of the game canvas, SizeInfo is an object with width and height properties

#### Drawer
An abstraction layer over the canvas 2d context, used to draw images and strings
* Constructor Drawer(String canvasName) - Creates a new drawer for the specified canvas
* Void clear(String color) - Clears the canvas and repaints it with the specified color. The color is optional, the default color is black.
* Void draw(Image img, Vector2 position, Number rotation, Vector2 rotationImageOrigin) - Draws an image at the specified position. The Vector2 may be exchanged with a Rectangle if you want to control the width and height of the drawn image. Optional parameters specify the rotation of the image in degrees (default 0), and the origin of rotation relative to the image position (default middle of the image/specified rectangle)
* Void drawString(String text, Vector2 vector, String font, String color) - Draws a string at the specified position with the specified CSS font and color.

### Starting SGame
#### SGame.Game
Main component of SGame. Hook up your game to SGame by calling SGame.start(yourgame)
* Void start(Game game) - Starts loading, initializing and running the supplied game. A game is an object with  loadContent, initialize, update and draw methods.

## SGame-Extended API
SGame-Extended provides the ability to more easily manage your game entities, support for rotated colission detection and camera movement. The reason for placing SGame-Extended in a separate file is that these features have no equivalent in XNA or MonoGame and therefore it would be considered an extension to those frameworks as well.

#### Entity
Bundles information needed to make drawings of an image into one object type.
* Constructor Entity(Rectangle rectangle, Image img, Number rotation, Vector2 origin) - Creates a new Entity with the a rectangle specifying its position and an Image specifying what it looks like. Optional parameters are the entitys rotation in degrees (default 0) and the origin of rotation relative to the rectangles top left corner (default middle of the rectangle).
* Rectangle rectangle - The entitys rectangle defines its position and size
* Image img - The image representing the entity
* Number rotation - The entitys rotation
* Vector2 origin - The origin of the entitys rotation
* Function update() - An function that does nothing by default
* Boolean intersects(Entity otherEntity) - Checks if this entity intersects another entity. Supports rotated entities.

#### TextEntity
Bundles information needed for drawing text into one object type.
* Constructor TextEntity(String text, Vector2 position, String font, String color) - Creates a new TextEntity with the specified text. Optional parameters are the position (default {x: 0, y: 0}), the font (default 18px sans-serif) and color (default black).
* String text - The text message of this TextEntity
* Vector2 position - The position of the text
* String font - The font of the text (CSS font)
* String color - The color of the text
* Function update() - An function that does nothing by default

#### Camera
Contains method for drawing entities and textentities, as well as moving them easily by moving the camera.
* Constructor Camera(Drawer spriteBatch, Number x, Number y) - Creates a new camera that will draw using the supplied Drawer and coordinates.
* Drawer sb - The Drawer this camera will use to draw entities and textentities.
* Number x - The x-coordinate of the camera
* Number y - The y-coordinate of the camera
* Void draw(Entity entity) - Draws the supplied entity with respect to the cameras position
* Void drawUIEntity(Entity entity) - Draws the supplied entity at the entitys coordinates in canvas space
* Void drawString(TextEntity textEntity) - Draws the supplied textentity with respect to the cameras position
* Void drawUIString(TextEntity textEntity) - Draws the supplied textentity at the textentitys coordinates in canvas space
