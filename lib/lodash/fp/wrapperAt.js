import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import wrapperAt from '../wrapperAt';
var func = convert('wrapperAt', wrapperAt, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
