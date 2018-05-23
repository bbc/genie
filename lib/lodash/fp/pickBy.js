import convert from './convert.js';
import pickBy from '../pickBy.js';
let func = convert('pickBy', pickBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
