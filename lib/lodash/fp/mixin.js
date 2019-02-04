import convert from './convert.js';
import mixin from '../mixin.js';
var func = convert('mixin', mixin);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
