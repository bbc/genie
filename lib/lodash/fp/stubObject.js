import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import stubObject from '../stubObject.js';
var func = convert('stubObject', stubObject, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
