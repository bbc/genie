import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isArguments from '../isArguments.js';
let func = convert('isArguments', isArguments, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
