import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import valueOf from '../valueOf';
var func = convert('valueOf', valueOf, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
