/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var throttleFor = 100;
var lastCallTime = 0;
export var getInputFn = function getInputFn(keys) {
  return function () {
    var currentTime = Date.now();
    var sizing = keys.x.isDown;
    var slow = keys.z.isDown;
    var throttled = slow && currentTime - lastCallTime < throttleFor;
    var val = throttled ? 0 : slow ? 1 : 10;
    var xDir = keys.right.isDown - keys.left.isDown;
    var yDir = keys.down.isDown - keys.up.isDown;
    var x = sizing ? 0 : xDir * val;
    var y = sizing ? 0 : yDir * val;
    var width = sizing ? xDir * val : 0;
    var height = sizing ? yDir * val : 0;
    !throttled && (lastCallTime = currentTime);
    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  };
};