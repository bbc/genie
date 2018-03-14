import convert from './convert.js';
import sortedIndex from '../sortedIndex.js';
let func = convert('sortedIndex', sortedIndex);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
