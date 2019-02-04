import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isElement from '../isElement.js';
var func = convert('isElement', isElement, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
