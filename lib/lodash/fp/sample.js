import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import sample from '../sample.js';
var func = convert('sample', sample, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
