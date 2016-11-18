/**
 * SGame Extended by Simon Eddeland
 */

function Entity(rectangle, img, rotation, origin) {
  this.rectangle = rectangle;
  this.img = img;
  this.update = function() {};
  this.rotation = rotation || 0;
  this.origin = origin || new Vector2(rectangle.width / 2, rectangle.height / 2);
}

Entity.prototype = {
  intersects: function (otherEntity) {
    var rectangle1Points = SGame.rotatedRectanglePoints(this.rectangle, -this.rotation, this.origin),
      rectangle2Points = SGame.rotatedRectanglePoints(otherEntity.rectangle, -otherEntity.rotation, otherEntity.origin);
      return SGame.doPolygonsIntersect(rectangle1Points, rectangle2Points);
  }
};

function TextEntity(text, position, font, color) {
    this.text = text || "";
    this.position = position || new Vector2(0, 0);
    this.font = font || "18px sans-serif";
    this.color = color || "Black";
    this.update = function() {};
}

TextEntity.prototype = {
};

function Camera(sb, x, y) {
    this.sb = sb;
    this.x = x;
    this.y = y;
}

Camera.prototype = {
    draw: function(entity) {
        this.sb.draw(entity.img, new Rectangle(entity.rectangle.x - this.x, entity.rectangle.y - this.y, entity.rectangle.width, entity.rectangle.height),
                     entity.rotation, entity.origin);
    },
    drawString: function(textEntity) {
        this.sb.drawString(textEntity.text, new Vector2(textEntity.position.x - this.x, textEntity.position.y - this.y),
        textEntity.font, textEntity.color);
    },
    drawUIEntity: function(entity) {
        this.sb.draw(entity.img, entity.rectangle, entity.rotation, entity.origin);
    },
    drawUIString: function(textEntity) {
        this.sb.drawString(textEntity.text, textEntity.position, textEntity.font, textEntity.color);
    },
};

SGame.rotatedRectanglePoints = function(rectangle, rotation, origin) {
  var originNew = {x: rectangle.x + origin.x, y: rectangle.y + origin.y};
  return [
      SGame.rotatePoint({x: rectangle.x, y: rectangle.y}, originNew, rotation),
      SGame.rotatePoint({x: rectangle.x + rectangle.width, y: rectangle.y}, originNew, rotation),
      SGame.rotatePoint({x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height}, originNew, rotation),
      SGame.rotatePoint({x: rectangle.x, y: rectangle.y + rectangle.height}, originNew, rotation)
      ];
};

SGame.rotatePoint = function (point, origin, angle) {
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (point.x - origin.x)) + (sin * (point.y - origin.y)) + origin.x,
      ny = (cos * (point.y - origin.y)) - (sin * (point.x - origin.x)) + origin.y;
  return {x: nx, y: ny};
};

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
SGame.doPolygonsIntersect = function (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (typeof minA === 'undefined' || projected < minA) {
                    minA = projected;
                }
                if (typeof maxA === 'undefined' || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (typeof minB === 'undefined' || projected < minB) {
                    minB = projected;
                }
                if (typeof maxB === 'undefined' || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
};

