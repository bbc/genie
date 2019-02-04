import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toJSON from '../toJSON.js';
var func = convert('toJSON', toJSON, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
