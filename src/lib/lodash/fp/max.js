import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import max from '../max.js';
let func = convert('max', max, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
