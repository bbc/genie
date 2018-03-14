import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import escapeRegExp from '../escapeRegExp.js';
let func = convert('escapeRegExp', escapeRegExp, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
