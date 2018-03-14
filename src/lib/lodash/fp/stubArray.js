import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import stubArray from '../stubArray.js';
let func = convert('stubArray', stubArray, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
