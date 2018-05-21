import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import flip from '../flip.js';
let func = convert('flip', flip, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
