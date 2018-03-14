import convert from './convert.js';
import invert from '../invert.js';
let func = convert('invert', invert);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
