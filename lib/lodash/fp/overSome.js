import convert from './convert.js';
import overSome from '../overSome.js';
var func = convert('overSome', overSome);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
