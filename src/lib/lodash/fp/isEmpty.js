import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isEmpty from '../isEmpty.js';
let func = convert('isEmpty', isEmpty, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
