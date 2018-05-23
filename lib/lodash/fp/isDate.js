import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isDate from '../isDate.js';
let func = convert('isDate', isDate, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
