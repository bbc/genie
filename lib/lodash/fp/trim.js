import convert from './convert.js';
import trim from '../trim.js';
var func = convert('trim', trim);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
