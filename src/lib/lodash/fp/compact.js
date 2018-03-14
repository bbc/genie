import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import compact from '../compact.js';
let func = convert('compact', compact, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
