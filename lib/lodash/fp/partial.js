import convert from './convert.js';
import partial from '../partial.js';
let func = convert('partial', partial);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
