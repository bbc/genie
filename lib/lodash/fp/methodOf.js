import convert from './convert.js';
import methodOf from '../methodOf.js';
var func = convert('methodOf', methodOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
