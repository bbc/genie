import convert from './convert.js';
import update from '../update.js';
var func = convert('update', update);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
