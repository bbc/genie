import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toPlainObject from '../toPlainObject.js';
var func = convert('toPlainObject', toPlainObject, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
