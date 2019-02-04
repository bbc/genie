import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isMap from '../isMap.js';
var func = convert('isMap', isMap, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
