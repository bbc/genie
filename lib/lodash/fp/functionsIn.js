import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import functionsIn from '../functionsIn.js';
var func = convert('functionsIn', functionsIn, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
