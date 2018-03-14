import convert from './convert.js';
import sortedLastIndexBy from '../sortedLastIndexBy.js';
let func = convert('sortedLastIndexBy', sortedLastIndexBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
