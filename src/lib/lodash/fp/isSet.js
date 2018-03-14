import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isSet from '../isSet.js';
let func = convert('isSet', isSet, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
