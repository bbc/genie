import convert from './convert.js';
import parseInt from '../parseInt.js';
var func = convert('parseInt', parseInt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
