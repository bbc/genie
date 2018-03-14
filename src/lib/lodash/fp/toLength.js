import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toLength from '../toLength.js';
let func = convert('toLength', toLength, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
