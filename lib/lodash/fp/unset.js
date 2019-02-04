import convert from './convert.js';
import unset from '../unset.js';
var func = convert('unset', unset);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
