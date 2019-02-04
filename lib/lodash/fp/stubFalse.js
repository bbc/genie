import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import stubFalse from '../stubFalse.js';
var func = convert('stubFalse', stubFalse, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
