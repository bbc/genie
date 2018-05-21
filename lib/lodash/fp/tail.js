import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import tail from '../tail.js';
let func = convert('tail', tail, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
