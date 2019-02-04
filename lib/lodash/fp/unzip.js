import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import unzip from '../unzip.js';
var func = convert('unzip', unzip, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
