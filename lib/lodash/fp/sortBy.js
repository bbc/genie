import convert from './convert.js';
import sortBy from '../sortBy.js';
let func = convert('sortBy', sortBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
