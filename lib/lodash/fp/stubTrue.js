import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import stubTrue from '../stubTrue.js';
var func = convert('stubTrue', stubTrue, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
