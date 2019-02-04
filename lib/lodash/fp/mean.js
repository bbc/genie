import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import mean from '../mean.js';
var func = convert('mean', mean, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
