import convert from './convert.js';
import sampleSize from '../sampleSize.js';
var func = convert('sampleSize', sampleSize);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
