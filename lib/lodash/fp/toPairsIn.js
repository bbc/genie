import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toPairsIn from '../toPairsIn.js';
var func = convert('toPairsIn', toPairsIn, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
