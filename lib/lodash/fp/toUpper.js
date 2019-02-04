import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toUpper from '../toUpper.js';
var func = convert('toUpper', toUpper, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
