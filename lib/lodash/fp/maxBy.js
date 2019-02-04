import convert from './convert.js';
import maxBy from '../maxBy.js';
var func = convert('maxBy', maxBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
