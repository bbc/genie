import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toArray from '../toArray.js';
let func = convert('toArray', toArray, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
