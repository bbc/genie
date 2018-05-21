import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import now from '../now.js';
let func = convert('now', now, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
