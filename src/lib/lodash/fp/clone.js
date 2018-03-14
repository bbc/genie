import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import clone from '../clone.js';
let func = convert('clone', clone, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
