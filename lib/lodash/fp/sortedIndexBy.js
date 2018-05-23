import convert from './convert.js';
import sortedIndexBy from '../sortedIndexBy.js';
let func = convert('sortedIndexBy', sortedIndexBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
