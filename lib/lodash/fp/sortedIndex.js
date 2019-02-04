import convert from './convert.js';
import sortedIndex from '../sortedIndex.js';
var func = convert('sortedIndex', sortedIndex);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
