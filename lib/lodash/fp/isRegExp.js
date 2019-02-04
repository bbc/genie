import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isRegExp from '../isRegExp.js';
var func = convert('isRegExp', isRegExp, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
