import convert from './convert.js';
import overEvery from '../overEvery.js';
var func = convert('overEvery', overEvery);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
