import convert from './convert.js';
import create from '../create.js';
var func = convert('create', create);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
