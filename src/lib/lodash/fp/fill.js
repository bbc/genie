import convert from './convert.js';
import fill from '../fill.js';
let func = convert('fill', fill);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
