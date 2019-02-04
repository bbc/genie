import convert from './convert.js';
import sortedLastIndexBy from '../sortedLastIndexBy.js';
var func = convert('sortedLastIndexBy', sortedLastIndexBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
