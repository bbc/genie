import convert from './convert.js';
import forEach from '../forEach.js';
var func = convert('forEach', forEach);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
