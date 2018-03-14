import convert from './convert.js';
import has from '../has.js';
let func = convert('has', has);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
