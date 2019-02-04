import convert from './convert.js';
import lastIndexOf from '../lastIndexOf.js';
var func = convert('lastIndexOf', lastIndexOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
