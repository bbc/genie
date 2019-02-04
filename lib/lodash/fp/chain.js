import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import chain from '../chain.js';
var func = convert('chain', chain, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
