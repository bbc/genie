import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import wrapperValue from '../wrapperValue';
let func = convert('wrapperValue', wrapperValue, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
