import convert from './convert.js';
import drop from '../drop.js';
var func = convert('drop', drop);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
