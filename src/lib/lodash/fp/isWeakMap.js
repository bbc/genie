import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isWeakMap from '../isWeakMap.js';
let func = convert('isWeakMap', isWeakMap, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
